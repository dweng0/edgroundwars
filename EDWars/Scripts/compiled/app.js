System.register("assets/Asset", [], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Asset;
    return {
        setters:[],
        execute: function() {
            Asset = (function () {
                function Asset() {
                }
                return Asset;
            }());
            exports_1("Asset", Asset);
        }
    }
});
System.register("assets/Map", [], function(exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    var Map;
    return {
        setters:[],
        execute: function() {
            Map = (function () {
                function Map() {
                }
                return Map;
            }());
            exports_2("Map", Map);
        }
    }
});
System.register("assets/Player", [], function(exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    var PlayerState, Player;
    return {
        setters:[],
        execute: function() {
            (function (PlayerState) {
                PlayerState[PlayerState["LoadingAssets"] = 0] = "LoadingAssets";
                PlayerState[PlayerState["Ready"] = 1] = "Ready";
                PlayerState[PlayerState["Disconnected"] = 2] = "Disconnected";
                PlayerState[PlayerState["Idle"] = 3] = "Idle";
            })(PlayerState || (PlayerState = {}));
            exports_3("PlayerState", PlayerState);
            Player = (function () {
                function Player() {
                }
                return Player;
            }());
            exports_3("Player", Player);
        }
    }
});
System.register("core/transportLayer", [], function(exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    var TransportLayer;
    return {
        setters:[],
        execute: function() {
            TransportLayer = (function () {
                function TransportLayer(campaignId, getCampaignDataComplete, handShakeComplete) {
                    this.hubConnectionUrl = "/game";
                    this.campaignUrl = '/game/campaign/';
                    this.logging = true;
                    console.log('Requesting campaign data from server, campaign:', campaignId);
                    this.onComplete = handShakeComplete;
                    this.campaignId = campaignId;
                    $.ajax(this.campaignUrl + campaignId, {
                        url: this.campaignUrl + campaignId,
                        dataType: "json",
                        traditional: true,
                        context: this,
                        success: function (data, textStatus, jqXHR) {
                            console.log("Retrieved campaign data...");
                            data = JSON.parse(data);
                            console.log('setting up hub connection...');
                            getCampaignDataComplete(data);
                            this.handshake();
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            throw new Error(errorThrown);
                        }
                    });
                    this.onComplete = handShakeComplete;
                }
                TransportLayer.prototype.handshake = function () {
                    debugger;
                    this.clientHub = $.signalR.hub.createHubProxy('game');
                    this.clientHub.client = {
                        beef: function () { debugger; }
                    };
                    console.log('Handshaking....');
                    $.signalR.hub.logging = this.logging;
                    $.signalR.hub.start().done(this.handshakeSuccess.bind(this)).fail(this.handshakeError);
                };
                TransportLayer.prototype.handshakeSuccess = function () {
                    debugger;
                    this.clientHub.server.registerPlayer(this.campaignId);
                };
                TransportLayer.prototype.handshakeError = function () {
                    throw new Error("Failed to complete handshake with server");
                };
                return TransportLayer;
            }());
            exports_4("TransportLayer", TransportLayer);
        }
    }
});
System.register("core/assetsmanager", [], function(exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    var AssetsManager;
    return {
        setters:[],
        execute: function() {
            AssetsManager = (function () {
                function AssetsManager() {
                    this._assetUrl = "/assets";
                }
                AssetsManager.prototype.loadInstanceAssets = function (loadingText, scene, campaign, onSuccess, onFail) {
                    var errors = new Array();
                    this._assets = new BABYLON.AssetsManager(scene);
                    this._loadingText = loadingText;
                    this._loadingText = "Distance to touchdown 9000km";
                    this.getMapAssets(scene, campaign, errors);
                    this.getInstancePlayerAssets(scene, campaign, errors);
                    this.getOtherPlayerAssets(scene, campaign, errors);
                    if (errors.length > 0) {
                        onFail(errors);
                    }
                    else {
                        this._loadingText = "Distance to touchdown 3000km";
                        this._assets.onFinish = onSuccess;
                    }
                };
                AssetsManager.prototype.getMapAssets = function (scene, campaign, errors) {
                    var _this = this;
                    console.log('loading map assets....');
                    this._mapAssetUrl = this._assetUrl + "/maps/" + campaign.Map.AssetUrl;
                    var maptexture = this._mapAssetUrl + "ground.jpg";
                    var skyBoxUrl = this._mapAssetUrl + "skybox/skybox";
                    this.textureUrl = this._mapAssetUrl + "ground.jpg";
                    this.heightMapUrl = this._mapAssetUrl + "heightMap.png";
                    this.loadTexture("groundloading", maptexture, function () { return _this._loadingText = "Distance to touchdown 7000km"; }, function () { return errors.push("Failed to load map texture"); });
                    this.loadImage("heightMap", this.heightMapUrl, function () { return _this._loadingText = "Distance to touchdown 5000km"; }, function () { return errors.push("Failed to load height map"); });
                    var skybox = BABYLON.Mesh.CreateBox("skyBox", 500.0, scene);
                    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
                    skyboxMaterial.backFaceCulling = false;
                    skyboxMaterial.disableLighting = true;
                    skybox.material = skyboxMaterial;
                    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
                    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
                    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(skyBoxUrl, scene);
                    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
                    skybox.renderingGroupId = 0;
                    return errors;
                };
                AssetsManager.prototype.loadTexture = function (taskName, url, success, fail, noMipMap, sampling) {
                    console.log('loading texture...', taskName);
                    var textureLoad = this._assets.addTextureTask(taskName, url, noMipMap, sampling);
                    textureLoad.onSuccess = success.bind(this);
                    textureLoad.onError = fail.bind(this);
                    return textureLoad;
                };
                AssetsManager.prototype.loadImage = function (taskName, url, success, fail) {
                    console.log('loading image...', taskName);
                    var imageLoader = this._assets.addImageTask(taskName, url);
                    imageLoader.onSuccess = success;
                    imageLoader.onError = fail;
                    return imageLoader;
                };
                AssetsManager.prototype.loadMesh = function (taskName, meshNames, rootUrl, sceneFileName, success, fail) {
                    console.log('loading mesh', taskName);
                    var meshLoader = this._assets.addMeshTask(taskName, meshNames, rootUrl, sceneFileName);
                    meshLoader.onSuccess = success.bind(this);
                    meshLoader.onError = fail.bind(this);
                    return meshLoader;
                };
                AssetsManager.prototype.getInstancePlayerAssets = function (scene, campain, errors) {
                    return errors;
                };
                AssetsManager.prototype.getOtherPlayerAssets = function (scene, campain, errors) {
                    return errors;
                };
                return AssetsManager;
            }());
            exports_5("AssetsManager", AssetsManager);
        }
    }
});
System.register("GameInstanceManager", ["core/transportLayer", "core/assetsmanager"], function(exports_6, context_6) {
    "use strict";
    var __moduleName = context_6 && context_6.id;
    var transportLayer_1, assetsmanager_1;
    var GameInstanceInstanceManager;
    return {
        setters:[
            function (transportLayer_1_1) {
                transportLayer_1 = transportLayer_1_1;
            },
            function (assetsmanager_1_1) {
                assetsmanager_1 = assetsmanager_1_1;
            }],
        execute: function() {
            GameInstanceInstanceManager = (function () {
                function GameInstanceInstanceManager(campaignId) {
                    this._canvasId = "rendercanvas";
                    this._debug = true;
                    console.log('initializing...');
                    this._canvas = document.getElementById(this._canvasId);
                    if (!this._canvas) {
                        throw new Error("Could not load canvas");
                    }
                    this._aim = new assetsmanager_1.AssetsManager();
                    this._tpl = new transportLayer_1.TransportLayer(campaignId, this.startBabylon.bind(this), this.placeholderFn());
                }
                GameInstanceInstanceManager.prototype.placeholderFn = function () {
                };
                GameInstanceInstanceManager.prototype.startBabylon = function (campaign) {
                    console.log('Starting engine...');
                    this._engine = new BABYLON.Engine(this._canvas, true);
                    this._engine.loadingUIText = "Loading... (assets)";
                    window.addEventListener('resize', function () {
                        this.engine.resize();
                    });
                    this.setScene();
                    console.log('Loading assets manager...');
                    this._aim.loadInstanceAssets(this._engine.loadingUIText, this._scene, campaign, this.onAllAssetsLoaded, this.onLoadAssetsFail);
                };
                GameInstanceInstanceManager.prototype.onAllAssetsLoaded = function () {
                    console.log('Completing scene creation...');
                    this._engine.loadingUIText = "Landing gear deployed";
                    var errors = new Array();
                    this.setCamera();
                    this.setLighting();
                    this.setEnvironment();
                    this.setPlayers();
                    if (errors.length > 0) {
                        var message = "LANDING ABORTED! ";
                        for (var i = 0; i < errors.length; i++) {
                            message += errors[i];
                        }
                        this._engine.loadingUIText = message;
                        throw new Error("Failed to set up Babylon");
                    }
                    else {
                        this.ready();
                    }
                };
                GameInstanceInstanceManager.prototype.ready = function () {
                    console.log('Ready...');
                    this.start();
                };
                GameInstanceInstanceManager.prototype.start = function () {
                    if (this._debug) {
                        this._scene.debugLayer.show();
                    }
                };
                GameInstanceInstanceManager.prototype.setScene = function () {
                    this._scene = new BABYLON.Scene(this._engine);
                };
                GameInstanceInstanceManager.prototype.setCamera = function () {
                    this._camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 1, -10), this._scene);
                    this._camera.setTarget(new BABYLON.Vector3(-10, -10, 0));
                    this._camera.attachControl(this._canvas);
                    this._camera.keysUp = [87];
                    this._camera.keysDown = [83];
                    this._camera.keysLeft = [65];
                    this._camera.keysRight = [68];
                    this._camera.speed = 3.0;
                    var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, this._scene);
                    sphere.position.y = 1;
                    sphere.position.z = -10;
                    sphere.position.x = -10;
                };
                GameInstanceInstanceManager.prototype.setLighting = function () {
                    this._light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), this._scene);
                    this._light.diffuse = new BABYLON.Color3(1, 1, 1);
                    this._light.specular = new BABYLON.Color3(0, 0, 0);
                };
                GameInstanceInstanceManager.prototype.setEnvironment = function () {
                    var material = new BABYLON.StandardMaterial("ground", this._scene);
                    material.diffuseTexture = new BABYLON.Texture(this._aim.textureUrl, this._scene);
                    var ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", this._aim.heightMapUrl, 250, 300, 250, 0, 50, this._scene, false);
                    ground.material = material;
                };
                GameInstanceInstanceManager.prototype.setPlayers = function () {
                    var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, this._scene);
                    sphere.position.y = 1;
                    sphere.position.z = -10;
                    sphere.position.x = -10;
                };
                GameInstanceInstanceManager.prototype.onLoadAssetsFail = function () {
                    throw new Error("Failed to load Assets");
                };
                return GameInstanceInstanceManager;
            }());
            exports_6("GameInstanceInstanceManager", GameInstanceInstanceManager);
        }
    }
});
var TeamSide;
(function (TeamSide) {
    TeamSide[TeamSide["red"] = 0] = "red";
    TeamSide[TeamSide["blue"] = 1] = "blue";
    TeamSide[TeamSide["spectator"] = 2] = "spectator";
})(TeamSide || (TeamSide = {}));
System.register("assets/GameStatistics", [], function(exports_7, context_7) {
    "use strict";
    var __moduleName = context_7 && context_7.id;
    var GameStatistics;
    return {
        setters:[],
        execute: function() {
            GameStatistics = (function () {
                function GameStatistics() {
                }
                return GameStatistics;
            }());
            exports_7("GameStatistics", GameStatistics);
        }
    }
});
//# sourceMappingURL=app.js.map