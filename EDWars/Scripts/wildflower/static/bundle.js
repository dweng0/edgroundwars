/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = BABYLON;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
 * Copyright 2014-2016 the original author or authors
 * @license MIT, see LICENSE.txt for details
 *
 * @author Scott Andrews
 */



var rest = __webpack_require__(7),
    browser = __webpack_require__(8);

rest.setPlatformDefaultClient(browser);

module.exports = rest;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
 * Copyright 2014-2016 the original author or authors
 * @license MIT, see LICENSE.txt for details
 *
 * @author Scott Andrews
 */



/**
 * Add common helper methods to a client impl
 *
 * @param {function} impl the client implementation
 * @param {Client} [target] target of this client, used when wrapping other clients
 * @returns {Client} the client impl with additional methods
 */
module.exports = function client(impl, target) {

	if (target) {

		/**
		 * @returns {Client} the target client
		 */
		impl.skip = function skip() {
			return target;
		};

	}

	/**
	 * Allow a client to easily be wrapped by an interceptor
	 *
	 * @param {Interceptor} interceptor the interceptor to wrap this client with
	 * @param [config] configuration for the interceptor
	 * @returns {Client} the newly wrapped client
	 */
	impl.wrap = function wrap(interceptor, config) {
		return interceptor(impl, config);
	};

	/**
	 * @deprecated
	 */
	impl.chain = function chain() {
		if (typeof console !== 'undefined') {
			console.log('rest.js: client.chain() is deprecated, use client.wrap() instead');
		}

		return impl.wrap.apply(this, arguments);
	};

	return impl;

};


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
 * Copyright 2012-2016 the original author or authors
 * @license MIT, see LICENSE.txt for details
 *
 * @author Scott Andrews
 */



/**
 * Normalize HTTP header names using the pseudo camel case.
 *
 * For example:
 *   content-type         -> Content-Type
 *   accepts              -> Accepts
 *   x-custom-header-name -> X-Custom-Header-Name
 *
 * @param {string} name the raw header name
 * @return {string} the normalized header name
 */
function normalizeHeaderName(name) {
	return name.toLowerCase()
		.split('-')
		.map(function (chunk) { return chunk.charAt(0).toUpperCase() + chunk.slice(1); })
		.join('-');
}

module.exports = normalizeHeaderName;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var BABYLON = __webpack_require__(0);
var dom_1 = __webpack_require__(5);
var assetsmanager_1 = __webpack_require__(6);
var statisticshandler_1 = __webpack_require__(10);
var interface_1 = __webpack_require__(11);
var stage_1 = __webpack_require__(12);
var userinput_1 = __webpack_require__(15);
var pipestream_1 = __webpack_require__(16);
var transportlayer_1 = __webpack_require__(17);
/**
 * @classdesc Ahh the trusty game class, the puppeteer pulling all the strings, the functions have been placed in the order that they are called, but essentially, this loads other classes and waits for their response before continuing onto the next function
 */
var Game = (function () {
    /**
     * Set up member variables
     * @param campaignId {number} the campaing instance id used for loading map assets and players
     * @param canvasId {string} the canvas element id string
     */
    function Game(campaignId, canvasId) {
        this._url = "/game";
        var domHandler = new dom_1.DomHandler(canvasId);
        this._canvas = domHandler.getCanvas();
        this._interface = new interface_1.Interface(this._url, campaignId);
        this._campaignId = campaignId;
        this._transport = new transportlayer_1.TransportLayer(campaignId, function () { console.log('success'); }, function () { console.log('fail'); });
        this._stream = new pipestream_1.PipeStream();
        this.input = new userinput_1.Input(this._stream);
        this._statisticsHandler = new statisticshandler_1.StatisticsHandler();
        this.ifAssetsFailedToLoad = function () { console.log('stub function ifAssetsFailedToLoad'); };
        this.ifBabylonFailedToLoad = function () { console.log('stub function ifBabylonFailedToLoad'); };
        this.ifInterfaceFailedToLoad = function () { console.log('stub function ifInterfaceFailedToLoad'); };
    }
    /**
     * Starts us off... calls the load function and handles the success (by calling onLoadBabylon) or error (by calling handleLoadingLifecycleError)
     */
    Game.prototype.start = function () {
        var _this = this;
        console.log('starting...');
        this.load().then(function (manifest) { _this.onBeginLoadGameData(manifest); }).catch(function (reasons) {
            console.log('Interface failed to load');
            _this.handleLoadingLifecycleError(_this.ifInterfaceFailedToLoad, reasons);
        });
    };
    /**
     * Promise does some pre babylon loading errands, like fetching the game instance manifest, uses the onBeforeLoad function if it is set. Returns a promise
     * @return {Promise}
     */
    Game.prototype.load = function () {
        var _this = this;
        if (this.onBeforeLoad) {
            this.onBeforeLoad();
        }
        console.log('loading started');
        return new Promise(function (resolve, reject) {
            _this._interface.fetchManifest(function (response) {
                resolve(response);
            }, function (err) { reject(err.error); });
        });
    };
    Game.prototype.onBeginLoadGameData = function (manifest) {
        var _this = this;
        console.log('loading game data');
        this.onLoadGameData(manifest)
            .then(function (campaign) {
            _this.onLoadBabylon(manifest, campaign);
        })
            .catch(function (reason) {
            console.log("Game data loading failed");
            _this.handleLoadingLifecycleError(null, reason);
        });
    };
    Game.prototype.onLoadGameData = function (manifest) {
        if (this.onBeforeLoadGameData) {
            this.onBeforeLoadGameData();
        }
        return this._statisticsHandler.loadCampaign(manifest, this._campaignId);
    };
    /**
     * If the load promise was successful this function is called, does some more promisy stuff, but this time we have the url manifest from the previous promise.
     * This function sets the scene for other classes that need it (now that its loaded) and attempts to set up the assets manager (a wrapper around the babylon assetsmanager class). If it succeeds it calls onBeginLoadAssets, if it fails it calls 'handleLoadingLifecycleError'
     * @param manifest {UrlManifest}
     */
    Game.prototype.onLoadBabylon = function (manifest, campaign) {
        var _this = this;
        console.log('loading babylon files');
        this.loadBabylon(manifest, campaign).then(function () {
            // at this point we have the scene, so we can set up the assets manager
            _this._assetsManager = new assetsmanager_1.AssetsManager(manifest, _this._stage.getScene(), campaign);
            // and apply the scene to other classes that need it
            _this.input.setScene(_this._stage.getScene());
            _this.onBeginLoadAssets(manifest, campaign);
        }).catch(function (reasons) {
            console.log('Babylon loading failed');
            _this.handleLoadingLifecycleError(_this.ifAssetsFailedToLoad, reasons);
        });
    };
    /**
     * Sets up babylon in the stage class
     * @see Stage
     * @param manifest {UrlManifest} contains urls for loading componentsin other classes
     */
    Game.prototype.loadBabylon = function (manifest, campaign) {
        var _this = this;
        if (this.onBeforeBabylonLoad) {
            this.onBeforeBabylonLoad();
        }
        var errors = new Array();
        return new Promise(function (resolve, reject) {
            errors.concat(errors, _this.setEngine());
            _this._stage = new stage_1.Stage(_this._engine, manifest);
            errors.concat(errors, _this._stage.setTheStage(_this._canvas));
            if (errors.length === 0) {
                resolve(errors);
            }
            else {
                _this.ifBabylonFailedToLoad(errors);
                reject(errors);
            }
        });
    };
    /**
     * Have an instance of the assets manager set up, have BABYLON set up, now its time to get assets for this game... Calls load assets, handles success (calls onBeginLoadGameData) and failure (calls handleLoadingLifecycleError)
     * @param manifest {UrlManifest}
     */
    Game.prototype.onBeginLoadAssets = function (manifest, campaign) {
        var _this = this;
        console.log('loading assets');
        this.loadAssets(campaign).then(function () { _this.onLoaded(manifest, campaign); }).catch(function (reasons) {
            console.log('Asset loading failed');
            _this.handleLoadingLifecycleError(_this.ifAssetsFailedToLoad, reasons);
        });
    };
    ;
    /**
     * starts the asset loading process and returns a promise (success or failure).
     * calls the optional function onBeforeAssetsLoad
     * @returns {promise<boolean>}
     */
    Game.prototype.loadAssets = function (campaign) {
        var _this = this;
        if (this.onBeforeAssetsLoad) {
            this.onBeforeAssetsLoad();
        }
        return new Promise(function (resolve, reject) {
            if (!_this._interface.manifest) {
                reject("No Manifest found");
            }
            _this._assetsManager.loadInstanceAssets(_this._engine).then(function () { resolve(); }).catch(function (reason) {
                console.log("Assets manager failed.");
                _this.ifAssetsFailedToLoad(reason);
                reject(reason);
            });
        });
    };
    /**
     * At this point, all assets (textures, meshes, stats for physics ect) have been loaded and we can start the engine
     * @todo tell server we are ready and wait for it to tell us to start the engine.
     * @param callback {function}
     */
    Game.prototype.onLoaded = function (manifest, campaign) {
        var _this = this;
        console.log('finished loading');
        if (this.onReady) {
            this.onReady();
        }
        this._stage.pipeUserInput(this._stream);
        this._stage.setThisPlayer(manifest.playerUsername, campaign);
        this.input.onCharacterReady(this._stage.getCharacter());
        this._engine.runRenderLoop(function () {
            _this._stage.showTime();
        });
    };
    Game.prototype.hasBabylon = function () {
        return (BABYLON) ? true : false;
    };
    /**
     * Loads the babylon engine, returns an array of error messages, if there are no error messages then it was succesfull
     * @returns {Array<string>}
     */
    Game.prototype.setEngine = function () {
        var _this = this;
        var errors = new Array();
        if (!this._canvas) {
            errors.push("No canvas element could be found to attach the engine to");
        }
        this._engine = new BABYLON.Engine(this._canvas, true);
        this._engine.loadingUIText = "Loading... (assets)";
        window.addEventListener('resize', function () {
            _this._engine.resize();
        });
        return errors;
    };
    Game.prototype.handleLoadingLifecycleError = function (eventFn, errors) {
        this._engine.loadingUIText = this.buildErrorMessage(errors);
        if (errors.length === undefined) {
            errors = new Array();
            errors.push(errors);
        }
        if (eventFn) {
            eventFn(errors);
        }
        else {
            throw new Error("failed to load");
        }
    };
    /**
     * builds up an error message from a list of error messages
     * @param errors {Array<string>}
     * @returns {string}
     */
    Game.prototype.buildErrorMessage = function (errors) {
        var message = "Landing Aborted";
        throw new Error(errors);
    };
    return Game;
}());
exports.Game = Game;
window['Game'] = Game;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var DomHandler = (function () {
    function DomHandler(id) {
        this.defaultElementId = 'gui';
        var elementId = (id) ? id : this.defaultElementId;
        this.element = document.getElementById(elementId);
    }
    DomHandler.prototype.getCanvas = function () {
        return this.element;
    };
    return DomHandler;
}());
exports.DomHandler = DomHandler;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var BABYLON = __webpack_require__(0);
var WebRequest = __webpack_require__(1);
var AssetsManager = (function () {
    function AssetsManager(manifest, scene, campaign) {
        this._manifest = manifest;
        this._scene = scene;
        this._campaign = campaign;
    }
    /**
     * Loads all instance assets for the game
     * @param loadingText {string} the text shown while the game is loading.
     * @returns {Promise}
     */
    AssetsManager.prototype.loadInstanceAssets = function (engine) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._assets = new BABYLON.AssetsManager(_this._scene);
            var numberOfAssets = _this.countAllAssets(_this._manifest);
            engine.loadingUIText = "Distance to touchdown " + numberOfAssets + "000km";
            _this.getMapAssets(_this._scene, _this._manifest, reject);
            _this.getAvatarStatistics(_this._scene, _this._manifest).then(function (characterData) {
                _this._loadedAvatarStatistics = characterData;
                _this._assets.load();
            }).catch(function () {
                throw new Error('Failed to load Players');
            });
            _this._assets.onFinish = function (tasks) {
                console.log('tasks finished');
                engine.loadingUIText = "Activating landing gears";
                resolve();
            };
            _this._assets.onTaskError = function (task) {
                console.log('task loading failure');
                engine.loadingUIText = "Landing aborted";
            };
            _this._assets.onTaskSuccess = function (task) {
                numberOfAssets = (numberOfAssets - 1);
                engine.loadingUIText = "Distance to touchdown " + numberOfAssets + "000km";
            };
        });
    };
    AssetsManager.prototype.countAllAssets = function (manifest) {
        return 3;
    };
    AssetsManager.prototype.getAvatarStatistics = function (scene, manifest) {
        var _this = this;
        var url = manifest.baseUrl + "/characters";
        var loadedCharacters = Array();
        var loadCharacter = function (player, startingVector, response) {
            var characterManifest = JSON.parse(response.entity);
            _this.loadCharacter(url, player.commander, characterManifest, startingVector);
            loadedCharacters.push(characterManifest);
            // when all characters have been loaded into the assets manager, resolve the promise
            if (loadedCharacters.length === _this._campaign.redTeam.players.length + _this._campaign.blueTeam.players.length) {
                return true;
            }
        };
        return new Promise(function (resolve, reject) {
            // load red team avatars
            _this._campaign.redTeam.players.forEach(function (redPlayer) {
                WebRequest(url + redPlayer.commander.assetsUrl + "/manifest").then(function (response) {
                    var spaceMaker = (6 * loadCharacter.length);
                    var redStartingVector = new BABYLON.Vector3(_this._campaign.map.redStartingPointX + spaceMaker, _this._campaign.map.redStartingPointY, _this._campaign.map.redStartingPointZ);
                    if (loadCharacter(redPlayer, redStartingVector, response)) {
                        resolve(loadedCharacters);
                    }
                }).catch(function () { throw new Error("Failed to load character manifest"); });
            });
            // load blue team avatars
            _this._campaign.blueTeam.players.forEach(function (bluePlayer) {
                WebRequest(url + bluePlayer.commander.assetsUrl + "/manifest").then(function (response) {
                    var spaceMaker = (5 * loadCharacter.length);
                    var blueStartingVector = new BABYLON.Vector3(_this._campaign.map.blueStartingPointX + spaceMaker, _this._campaign.map.blueStartingPointY, _this._campaign.map.blueStartingPointZ);
                    if (loadCharacter(bluePlayer, blueStartingVector, response)) {
                        resolve(loadedCharacters);
                    }
                }).catch(function () { throw new Error("Failed to load character manifest"); });
            });
        });
    };
    AssetsManager.prototype.loadCharacter = function (url, commander, manifest, startingVector) {
        var bodyTextureUrl = url + commander.assetsUrl + "/textures/" + manifest.textureUrl;
        var meshUrl = url + commander.assetsUrl + manifest.meshUrl;
        var meshTask = this._assets.addMeshTask("skull task", "", meshUrl, "buggy.babylon");
        meshTask.onSuccess = function (task) {
            // http://www.html5gamedevs.com/topic/6732-question-about-mesh-impostor/
            commander.mesh = BABYLON.Mesh.MergeMeshes(task.loadedMeshes);
            commander.mesh.position = BABYLON.Vector3.Zero();
            commander.mesh.name = commander.name + "_mesh";
            commander.mesh.showBoundingBox = true;
            commander.mesh.position = startingVector;
            commander.mesh.edgesWidth = 20;
            commander.mesh.outlineWidth = 20;
            commander.mesh.physicsImpostor = new BABYLON.PhysicsImpostor(commander.mesh, BABYLON.PhysicsImpostor.BoxImpostor, {
                mass: manifest.physics.mass,
                restitution: manifest.physics.restitution,
                friction: manifest.physics.friction
            }, this._scene);
        };
    };
    AssetsManager.prototype.setTerrain = function (url, scene, manifest, reject) {
        var _this = this;
        var map = this._campaign.map;
        var ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", url + "/heightmap" + manifest.map.heightMap, map.width, map.height, map.subDivisions, 0, 12, scene, true);
        /** Load ground texture */
        this.loadTexture("ground", url + "/texture" + manifest.map.texture, function (asset) {
            var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
            groundMaterial.diffuseTexture = asset.texture;
            groundMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
            ground.material = groundMaterial;
            ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.HeightmapImpostor, { mass: map.physics.mass, restitution: map.physics.restitution, friction: map.physics.friction }, scene);
            _this._campaign.map.groundMesh = ground;
        }, function () { reject(["Failed to load map texture"]); });
    };
    AssetsManager.prototype.setFlatTerrain = function (url, scene, manifest, reject) {
        var _this = this;
        var map = this._campaign.map;
        var ground = BABYLON.Mesh.CreateGround("ground", map.width, map.height, map.subDivisions, scene, true);
        ground.position.y = 1;
        /** Load ground texture */
        this.loadTexture("ground", url + "/texture" + manifest.map.texture, function (asset) {
            var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
            groundMaterial.diffuseTexture = asset.texture;
            groundMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
            ground.material = groundMaterial;
            ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.HeightmapImpostor, { mass: map.physics.mass, restitution: map.physics.restitution, friction: map.physics.friction }, scene);
            _this._campaign.map.groundMesh = ground;
        }, function () { reject(["Failed to load map texture"]); });
    };
    /**
     * Sets the skybox
     * @param url {string} The url used to get the material
     * @param scene
     * @param manifest
     * @param reject
     */
    AssetsManager.prototype.setSkyBox = function (url, scene, manifest, reject) {
        /** Load sky box */
        var skybox = BABYLON.Mesh.CreateBox("skyBox", 500.0, scene);
        var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.disableLighting = true;
        skybox.material = skyboxMaterial;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(url + "/skybox" + manifest.map.skyBox, scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skybox.renderingGroupId = 0;
        this._campaign.map.skyMesh = skybox;
    };
    AssetsManager.prototype.setSkyPhere = function (url, scene, manifest, reject) {
        var skybox = BABYLON.Mesh.CreateSphere("skyBox", 10, 2500, scene);
        var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.disableLighting = true;
        skybox.material = skyboxMaterial;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(url + "/skybox" + manifest.map.skyBox, scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skybox.renderingGroupId = 0;
        this._campaign.map.skyMesh = skybox;
    };
    /**
     * Get the map assets required to load the map
     * @param text {string} The text used to show during game load
     * @param scene {BABYLON.Scene} The scene passed in from the game class
     * @param manifest {UrlManifest} The manifest of urls required to load this game
     * @param errors {Array<string>} The list of errors, if any incurred in this code path.
     */
    AssetsManager.prototype.getMapAssets = function (scene, manifest, reject) {
        var url = manifest.baseUrl + "/map" + manifest.map.baseUrl;
        this.setFlatTerrain(url, scene, manifest, reject);
        this.setSkyPhere(url, scene, manifest, reject);
    };
    /**
     * Given a set of arguments, attempts to load an image into the assets manager
     * @param taskName string name of the task
     * @param url string the url of where to find the image
     * @param success fn
     * @param fail fn
     */
    AssetsManager.prototype.loadImage = function (taskName, url, success, fail) {
        var imageLoader = this._assets.addImageTask(taskName, url);
        imageLoader.onSuccess = success.bind(this);
        imageLoader.onError = fail.bind(this);
        return imageLoader;
    };
    /**
    * Given a set of arguments, attempts to load a texture into the assets manage
    */
    AssetsManager.prototype.loadTexture = function (taskName, url, success, fail, noMipMap, sampling) {
        var textureLoad = this._assets.addTextureTask(taskName, url, noMipMap, sampling);
        textureLoad.onSuccess = success.bind(this);
        textureLoad.onError = fail.bind(this);
        return textureLoad;
    };
    AssetsManager.prototype.loadMesh = function (taskName, meshNames, rootUrl, success, fail) {
        console.log('loading mesh', taskName);
        var meshLoader = this._assets.addMeshTask(taskName, "", rootUrl, meshNames);
        meshLoader.onSuccess = success.bind(this);
        meshLoader.onError = fail.bind(this);
        return meshLoader;
    };
    return AssetsManager;
}());
exports.AssetsManager = AssetsManager;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
 * Copyright 2014-2016 the original author or authors
 * @license MIT, see LICENSE.txt for details
 *
 * @author Scott Andrews
 */



/**
 * Plain JS Object containing properties that represent an HTTP request.
 *
 * Depending on the capabilities of the underlying client, a request
 * may be cancelable. If a request may be canceled, the client will add
 * a canceled flag and cancel function to the request object. Canceling
 * the request will put the response into an error state.
 *
 * @field {string} [method='GET'] HTTP method, commonly GET, POST, PUT, DELETE or HEAD
 * @field {string|UrlBuilder} [path=''] path template with optional path variables
 * @field {Object} [params] parameters for the path template and query string
 * @field {Object} [headers] custom HTTP headers to send, in addition to the clients default headers
 * @field [entity] the HTTP entity, common for POST or PUT requests
 * @field {boolean} [canceled] true if the request has been canceled, set by the client
 * @field {Function} [cancel] cancels the request if invoked, provided by the client
 * @field {Client} [originator] the client that first handled this request, provided by the interceptor
 *
 * @class Request
 */

/**
 * Plain JS Object containing properties that represent an HTTP response
 *
 * @field {Object} [request] the request object as received by the root client
 * @field {Object} [raw] the underlying request object, like XmlHttpRequest in a browser
 * @field {number} [status.code] status code of the response (i.e. 200, 404)
 * @field {string} [status.text] status phrase of the response
 * @field {Object] [headers] response headers hash of normalized name, value pairs
 * @field [entity] the response body
 *
 * @class Response
 */

/**
 * HTTP client particularly suited for RESTful operations.
 *
 * @field {function} wrap wraps this client with a new interceptor returning the wrapped client
 *
 * @param {Request} the HTTP request
 * @returns {ResponsePromise<Response>} a promise the resolves to the HTTP response
 *
 * @class Client
 */

 /**
  * Extended when.js Promises/A+ promise with HTTP specific helpers
  *q
  * @method entity promise for the HTTP entity
  * @method status promise for the HTTP status code
  * @method headers promise for the HTTP response headers
  * @method header promise for a specific HTTP response header
  *
  * @class ResponsePromise
  * @extends Promise
  */

var client, target, platformDefault;

client = __webpack_require__(2);

if (typeof Promise !== 'function' && console && console.log) {
	console.log('An ES6 Promise implementation is required to use rest.js. See https://github.com/cujojs/when/blob/master/docs/es6-promise-shim.md for using when.js as a Promise polyfill.');
}

/**
 * Make a request with the default client
 * @param {Request} the HTTP request
 * @returns {Promise<Response>} a promise the resolves to the HTTP response
 */
function defaultClient() {
	return target.apply(void 0, arguments);
}

/**
 * Change the default client
 * @param {Client} client the new default client
 */
defaultClient.setDefaultClient = function setDefaultClient(client) {
	target = client;
};

/**
 * Obtain a direct reference to the current default client
 * @returns {Client} the default client
 */
defaultClient.getDefaultClient = function getDefaultClient() {
	return target;
};

/**
 * Reset the default client to the platform default
 */
defaultClient.resetDefaultClient = function resetDefaultClient() {
	target = platformDefault;
};

/**
 * @private
 */
defaultClient.setPlatformDefaultClient = function setPlatformDefaultClient(client) {
	if (platformDefault) {
		throw new Error('Unable to redefine platformDefaultClient');
	}
	target = platformDefault = client;
};

module.exports = client(defaultClient);


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
 * Copyright 2012-2016 the original author or authors
 * @license MIT, see LICENSE.txt for details
 *
 * @author Scott Andrews
 */



var normalizeHeaderName, responsePromise, client, headerSplitRE;

normalizeHeaderName = __webpack_require__(3);
responsePromise = __webpack_require__(9);
client = __webpack_require__(2);

// according to the spec, the line break is '\r\n', but doesn't hold true in practice
headerSplitRE = /[\r|\n]+/;

function parseHeaders(raw) {
	// Note: Set-Cookie will be removed by the browser
	var headers = {};

	if (!raw) { return headers; }

	raw.trim().split(headerSplitRE).forEach(function (header) {
		var boundary, name, value;
		boundary = header.indexOf(':');
		name = normalizeHeaderName(header.substring(0, boundary).trim());
		value = header.substring(boundary + 1).trim();
		if (headers[name]) {
			if (Array.isArray(headers[name])) {
				// add to an existing array
				headers[name].push(value);
			}
			else {
				// convert single value to array
				headers[name] = [headers[name], value];
			}
		}
		else {
			// new, single value
			headers[name] = value;
		}
	});

	return headers;
}

function safeMixin(target, source) {
	Object.keys(source || {}).forEach(function (prop) {
		// make sure the property already exists as
		// IE 6 will blow up if we add a new prop
		if (source.hasOwnProperty(prop) && prop in target) {
			try {
				target[prop] = source[prop];
			}
			catch (e) {
				// ignore, expected for some properties at some points in the request lifecycle
			}
		}
	});

	return target;
}

module.exports = client(function xhr(request) {
	return responsePromise.promise(function (resolve, reject) {
		/*jshint maxcomplexity:20 */

		var client, method, url, headers, entity, headerName, response, XHR;

		request = typeof request === 'string' ? { path: request } : request || {};
		response = { request: request };

		if (request.canceled) {
			response.error = 'precanceled';
			reject(response);
			return;
		}

		XHR = request.engine || XMLHttpRequest;
		if (!XHR) {
			reject({ request: request, error: 'xhr-not-available' });
			return;
		}

		entity = request.entity;
		request.method = request.method || (entity ? 'POST' : 'GET');
		method = request.method;
		url = response.url = request.path || '';

		try {
			client = response.raw = new XHR();

			// mixin extra request properties before and after opening the request as some properties require being set at different phases of the request
			safeMixin(client, request.mixin);
			client.open(method, url, true);
			safeMixin(client, request.mixin);

			headers = request.headers;
			for (headerName in headers) {
				/*jshint forin:false */
				if (headerName === 'Content-Type' && headers[headerName] === 'multipart/form-data') {
					// XMLHttpRequest generates its own Content-Type header with the
					// appropriate multipart boundary when sending multipart/form-data.
					continue;
				}

				client.setRequestHeader(headerName, headers[headerName]);
			}

			request.canceled = false;
			request.cancel = function cancel() {
				request.canceled = true;
				client.abort();
				reject(response);
			};

			client.onreadystatechange = function (/* e */) {
				if (request.canceled) { return; }
				if (client.readyState === (XHR.DONE || 4)) {
					response.status = {
						code: client.status,
						text: client.statusText
					};
					response.headers = parseHeaders(client.getAllResponseHeaders());
					response.entity = client.responseText;

					// #125 -- Sometimes IE8-9 uses 1223 instead of 204
					// http://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
					if (response.status.code === 1223) {
						response.status.code = 204;
					}

					if (response.status.code > 0) {
						// check status code as readystatechange fires before error event
						resolve(response);
					}
					else {
						// give the error callback a chance to fire before resolving
						// requests for file:// URLs do not have a status code
						setTimeout(function () {
							resolve(response);
						}, 0);
					}
				}
			};

			try {
				client.onerror = function (/* e */) {
					response.error = 'loaderror';
					reject(response);
				};
			}
			catch (e) {
				// IE 6 will not support error handling
			}

			client.send(entity);
		}
		catch (e) {
			response.error = 'loaderror';
			reject(response);
		}

	});
});


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
 * Copyright 2014-2016 the original author or authors
 * @license MIT, see LICENSE.txt for details
 *
 * @author Scott Andrews
 */



/*jshint latedef: nofunc */

var normalizeHeaderName = __webpack_require__(3);

function property(promise, name) {
	return promise.then(
		function (value) {
			return value && value[name];
		},
		function (value) {
			return Promise.reject(value && value[name]);
		}
	);
}

/**
 * Obtain the response entity
 *
 * @returns {Promise} for the response entity
 */
function entity() {
	/*jshint validthis:true */
	return property(this, 'entity');
}

/**
 * Obtain the response status
 *
 * @returns {Promise} for the response status
 */
function status() {
	/*jshint validthis:true */
	return property(property(this, 'status'), 'code');
}

/**
 * Obtain the response headers map
 *
 * @returns {Promise} for the response headers map
 */
function headers() {
	/*jshint validthis:true */
	return property(this, 'headers');
}

/**
 * Obtain a specific response header
 *
 * @param {String} headerName the header to retrieve
 * @returns {Promise} for the response header's value
 */
function header(headerName) {
	/*jshint validthis:true */
	headerName = normalizeHeaderName(headerName);
	return property(this.headers(), headerName);
}

/**
 * Follow a related resource
 *
 * The relationship to follow may be define as a plain string, an object
 * with the rel and params, or an array containing one or more entries
 * with the previous forms.
 *
 * Examples:
 *   response.follow('next')
 *
 *   response.follow({ rel: 'next', params: { pageSize: 100 } })
 *
 *   response.follow([
 *       { rel: 'items', params: { projection: 'noImages' } },
 *       'search',
 *       { rel: 'findByGalleryIsNull', params: { projection: 'noImages' } },
 *       'items'
 *   ])
 *
 * @param {String|Object|Array} rels one, or more, relationships to follow
 * @returns ResponsePromise<Response> related resource
 */
function follow(rels) {
	/*jshint validthis:true */
	rels = [].concat(rels);

	return make(rels.reduce(function (response, rel) {
		return response.then(function (response) {
			if (typeof rel === 'string') {
				rel = { rel: rel };
			}
			if (typeof response.entity.clientFor !== 'function') {
				throw new Error('Hypermedia response expected');
			}
			var client = response.entity.clientFor(rel.rel);
			return client({ params: rel.params });
		});
	}, this));
}

/**
 * Wrap a Promise as an ResponsePromise
 *
 * @param {Promise<Response>} promise the promise for an HTTP Response
 * @returns {ResponsePromise<Response>} wrapped promise for Response with additional helper methods
 */
function make(promise) {
	promise.status = status;
	promise.headers = headers;
	promise.header = header;
	promise.entity = entity;
	promise.follow = follow;
	return promise;
}

function responsePromise(obj, callback, errback) {
	return make(Promise.resolve(obj).then(callback, errback));
}

responsePromise.make = make;
responsePromise.reject = function (val) {
	return make(Promise.reject(val));
};
responsePromise.promise = function (func) {
	return make(new Promise(func));
};

module.exports = responsePromise;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var WebRequest = __webpack_require__(1);
var StatisticsHandler = (function () {
    function StatisticsHandler() {
    }
    StatisticsHandler.prototype.loadCampaign = function (manifest, campaignId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            WebRequest(manifest.baseUrl + "/campaign/" + campaignId).then(function (response) {
                _this._campaign = JSON.parse(response.entity);
                resolve(_this._campaign);
            }).catch(function (reason) { reject(reason); });
        });
    };
    StatisticsHandler.prototype.playerDied = function (characterKilled, killedBy) {
    };
    /**
     * If we have the campaign data, we can set the player ids to the correct characters for better referencing
     * @param characters {Array<Characters>}
     */
    StatisticsHandler.prototype.updateCommandersWithPlayerIds = function (characters) {
        var _this = this;
        characters.forEach(function (character) {
            _this._campaign.redTeam.players.forEach(function (player) {
                if (player.commander.name === character.getCommanderName()) {
                    character.setPlayerId(player.id);
                }
            });
            _this._campaign.blueTeam.players.forEach(function (player) {
                if (player.commander.name === character.getCommanderName()) {
                    character.setPlayerId(player.id);
                }
            });
        });
    };
    return StatisticsHandler;
}());
exports.StatisticsHandler = StatisticsHandler;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var WebRequest = __webpack_require__(1);
/**
 * Handles the loading of files for the game, does not handle web sockets or real time streams
 */
var Interface = (function () {
    function Interface(url, campaignId, testMode) {
        this._testSuccessURL = "foo.com";
        this._testFailUrl = "bar.com";
        this._testMode = false;
        this._manifestUrl = url + "/manifest/" + campaignId;
        this._testMode = testMode;
        if (this._handShakeUrl === null) {
            throw new Error("No handshake url provided");
        }
    }
    /**
     * check the server exists, also sets the manifest url, to get manifest data.
     */
    Interface.prototype.handshake = function (callback, errCall) {
        var _this = this;
        this.fetch(this._handShakeUrl, function (data) { _this.setManifestUrl(data.message); callback(data); }, function (err) {
            if (errCall) {
                errCall(err);
            }
            else {
                throw new Error(err);
            }
        });
    };
    /**
     * Returns a url manifest of all urls needed to load the game
     * @param callback {function}
     */
    Interface.prototype.fetchManifest = function (callback, errCall) {
        var _this = this;
        if (!this._manifestUrl) {
            throw new Error("No manifest url found. Handshake with server is requried");
        }
        this.fetch(this._manifestUrl, function (data) {
            _this.manifest = JSON.parse(data.entity);
            callback(_this.manifest);
        }, function (err) {
            if (errCall) {
                errCall(err);
            }
            else {
                throw new Error(err);
            }
        });
    };
    /**
     * Function makes calls to the server and passes the response back to the appropriate callback functions
     * @param url {string} The url to fetch on
     * @param successCallback {function} the success callback
     * @param errorCallback {function} the error callback
     */
    Interface.prototype.fetch = function (url, successCallback, errorCallback) {
        return WebRequest(url).then(successCallback).catch(errorCallback);
    };
    /**
    * Using the data provided, attempts to set it to our url manifest, we can then use the manifest url whenever we like, to get a list of all the urls needed to load assets into the game
    * @param data {object}
    */
    Interface.prototype.setManifestUrl = function (url) {
        this._manifestUrl = url;
    };
    return Interface;
}());
exports.Interface = Interface;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var BABYLON = __webpack_require__(0);
var character_1 = __webpack_require__(13);
/**
 * @classdesc Handles the setting up of scenes, cameras and management of active characters in the scene.
 * The entry point for 'setting up' is 'setTheStage'
 * The entry point for starting everything up is 'showTime'
 */
var Stage = (function () {
    function Stage(engine, manifest) {
        console.log('A magical stage has been created');
        this._engine = engine;
        this._worldPhysics = manifest.world;
        this.characters = new Array();
    }
    /**
     * Allows easy camera setting.
     * @param type {string} camera type to be used
     * @param canvas {HTMLCanvasElement} the canvas that the camera may like to attach to
     */
    Stage.prototype.useCamera = function (type, canvas) {
        var camera;
        switch (type) {
            case "free":
                {
                    camera = this.setDebugCamera(canvas);
                    break;
                }
            case "arc":
                {
                    camera = this._setArcCamera(canvas);
                    break;
                }
            case "follow":
                {
                    camera = this._setCamera(canvas);
                    break;
                }
        }
        this._scene.activeCamera = camera;
    };
    /**
     * Creates the scene, sets up the cameras and the lighting
     * @param canvas {HTMLCanvasElement} required for the camera to attach controls to
     */
    Stage.prototype.setTheStage = function (canvas) {
        var errors = new Array();
        this._setScene(errors);
        this.useCamera("free", canvas);
        this._setLighting();
        // this._setShadows();
        return errors;
    };
    /**
     * Called after everything is loaded and the server has provided back a ready call
     * @param debug {boolean} determines if the debug layer should be shown
     */
    Stage.prototype.showTime = function (debug) {
        var _this = this;
        var characterMesh = this.getCharacter().fetchMesh();
        this._freeCamera.lockedTarget = characterMesh;
        this._scene.registerBeforeRender(function () {
            _this._updateCharacterMovements();
            var zoom = _this.getCharacter().zoom;
            // update camera as player moves
            var newCamPos = new BABYLON.Vector3((characterMesh.position.x + 50), (characterMesh.position.y + zoom + 80), (characterMesh.position.z + 60));
            _this._freeCamera.position = newCamPos;
        });
        this._scene.render();
        this._scene.debugLayer.show();
        if (debug) {
            this._scene.debugLayer.show();
        }
    };
    /**
     * simple getter, returns the private scene
     * @returns {BABYLON.Scene}
     */
    Stage.prototype.getScene = function () {
        return this._scene;
    };
    Stage.prototype.pipeUserInput = function (stream) {
        var _this = this;
        var hooks = {
            movePlayerSuccess: function (id, point) {
                _this.characters.forEach(function (character) {
                    (character.playerId === id) ? character.moveByMouse(point) : null;
                });
            },
            movePlayerFailure: function () { },
            attackPlayerSuccess: function () { },
            attackPlayerFailure: function () { }
        };
        stream.setStreamHandlers(hooks);
    };
    /**
     * Sets up a free camera, attaches movement controls, note the controls prevent default even with noPreventDefault bool set to true
     * @param canvas {HTMLCanvasElement} element the camera needs to attach controls to
     */
    Stage.prototype.setDebugCamera = function (canvas) {
        this._freeCamera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 15, -45), this._scene);
        this._freeCamera.speed = 3.0;
        window['camera'] = this._freeCamera;
        // camera positioning
        // this._freeCamera.setTarget(this._thisCharacter.fetchMesh().position);
        this._freeCamera.attachControl(canvas, true);
        return this._freeCamera;
    };
    /**
     * Gets 'this client' character
     * @todo should return any character based on the id passeed in... or something.
     * @return {Character}
     */
    Stage.prototype.getCharacter = function () {
        return this._thisCharacter;
    };
    Stage.prototype._setShadows = function () {
        var dl = new BABYLON.DirectionalLight("dir", new BABYLON.Vector3(1, -1, -0.5), this._scene);
        dl.position = new BABYLON.Vector3(0, 60, 0);
        var shadow = new BABYLON.ShadowGenerator(768, dl);
        shadow.useBlurVarianceShadowMap = true;
    };
    /**
     * Called in registerBeforeRender, updates character movements
     * @private
     */
    Stage.prototype._updateCharacterMovements = function () {
        this.characters.forEach(function (character) {
            !(character.movementPackage.finished) ? character.updateMovement() : null;
        });
    };
    ;
    /**
     * Sets up a follow camera and attaches controls
     * @param canvas {HTMLCanvasElement}
     * @return {BABYLON.FollowCamera}
     */
    Stage.prototype._setCamera = function (canvas) {
        this._camera = new BABYLON.FollowCamera("Follow", new BABYLON.Vector3(0, 15, 45), this._scene);
        this._camera.radius = 70; // how far from the object to follow
        this._camera.heightOffset = 70; // how high above the object to place the camera
        this._camera.rotationOffset = 720; // the viewing angle
        this._camera.cameraAcceleration = 0.7; // how fast to move
        this._camera.maxCameraSpeed = 1; // speed limit
        this._camera.attachControl(canvas, true);
        window['camera'] = this._camera;
        return this._camera;
    };
    /**
     * Sets up an arc camera sets it on the member variable, but also returns it
     * @param canvas {HTMLCanvasElement}
     * @returns {BABYLON.ArcRotateCamera}
     */
    Stage.prototype._setArcCamera = function (canvas) {
        this._arcCamera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 1, 0.8, 10, new BABYLON.Vector3(0, 0, 0), this._scene);
        this._arcCamera.setPosition(new BABYLON.Vector3(0, 20, 50));
        this._arcCamera.attachControl(canvas, true);
        return this._arcCamera;
    };
    /**
     * Attempts to set the scene, returns an array of error messages. if the array is empty, then it was successful
     * @private
     * @returns {Array<string>}
     */
    Stage.prototype._setScene = function (errors) {
        if (!this._engine) {
            errors.push("Failed to set scene, the engine is missing.");
        }
        else {
            this._scene = new BABYLON.Scene(this._engine);
            this._scene.enablePhysics(new BABYLON.Vector3(this._worldPhysics.gravityVector.x, this._worldPhysics.gravityVector.y, this._worldPhysics.gravityVector.z), new BABYLON.OimoJSPlugin());
        }
        return errors;
    };
    /**
     * Sets scen lightingq
     * @private
     */
    Stage.prototype._setLighting = function () {
        this._lighting = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), this._scene);
        this._lighting.diffuse = new BABYLON.Color3(1, 1, 1);
        this._lighting.specular = new BABYLON.Color3(0, 0, 0);
    };
    /**
     * Sets the '_thisCharacter' variable and pushes it into the list of characters in the scene
     */
    Stage.prototype.setThisPlayer = function (userName, campaign) {
        this._thisCharacter = new character_1.Character(userName, campaign, this._scene);
        this.characters.push(this._thisCharacter);
    };
    /**
     * Adds the character argument to the list of characters array
     * @param character {Character}
     */
    Stage.prototype.addCharacter = function (character) {
        this.characters.push(character);
    };
    return Stage;
}());
exports.Stage = Stage;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var BABYLON = __webpack_require__(0);
var commander_1 = __webpack_require__(14);
var Character = (function () {
    function Character(username, campaign, scene) {
        this.zoom = 0;
        debugger;
        // find user in campaign
        this._player = this.findUserInCampaign(username, campaign);
        this.playerId = this._player.username;
        // create commander
        this.commander = new commander_1.Commander(this._player.commander, scene);
        this.movementPackage = {
            finished: true,
            angleApplied: false,
            destination: new BABYLON.Vector3(0, 0, 0)
        };
    }
    Character.prototype.zoomOut = function () {
        if (this.zoom < 70) {
            this.zoom += 4;
        }
    };
    Character.prototype.zoomIn = function () {
        if (this.zoom > -10) {
            this.zoom -= 4;
        }
    };
    Character.prototype.findUserInCampaign = function (username, campaign) {
        var foundPlayer;
        campaign.blueTeam.players.forEach(function (player) {
            if (player.username === username) {
                foundPlayer = player;
            }
        });
        campaign.redTeam.players.forEach(function (player) {
            if (player.username === username) {
                foundPlayer = player;
            }
        });
        return foundPlayer;
    };
    Character.prototype.fetchMesh = function () {
        return this.commander.fetchMesh();
    };
    Character.prototype.setPlayerId = function (id) {
        this.playerId = id;
    };
    Character.prototype.getCommanderName = function () {
        return this.commander.getName();
    };
    Character.prototype.updateMovement = function () {
        var mesh = this.commander.fetchMesh();
        var myPos = mesh.getAbsolutePosition();
        var hitVector = this.movementPackage.destination;
        var x = 0;
        var z = 0;
        var y;
        var tolerance = 1;
        var xFinished = false;
        if (hitVector.x > myPos.x + tolerance) {
            x = this.commander.stats.baseSpeed;
        }
        else if (hitVector.x < myPos.x - tolerance) {
            x = -this.commander.stats.baseSpeed;
        }
        else {
            xFinished = true;
        }
        if (hitVector.z > myPos.z + tolerance) {
            z = this.commander.stats.baseSpeed;
        }
        else if (hitVector.z < myPos.z - tolerance) {
            z = -this.commander.stats.baseSpeed;
        }
        else {
            if (xFinished === true) {
                this.movementPackage.finished = true;
            }
        }
        mesh.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(x, 0, z));
        if (!xFinished) {
            mesh.lookAt(hitVector);
        }
    };
    Character.prototype.moveByMouse = function (hitVector) {
        this.movementPackage = {
            finished: false,
            destination: hitVector,
            angleApplied: false
        };
    };
    Character.prototype.computeWorldMatrix = function () {
        return this.commander.fetchMesh().getWorldMatrix();
    };
    Character.prototype.transformFromGlobalVectorToLocal = function (global, newVector) {
        return BABYLON.Vector3.TransformCoordinates(newVector, global);
    };
    return Character;
}());
exports.Character = Character;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Commander = (function () {
    function Commander(commander, scene) {
        this.stats = commander;
        this._mesh = commander.mesh;
    }
    Commander.prototype.fetchMesh = function () {
        return this._mesh;
    };
    Commander.prototype.getName = function () {
        return this.stats.name;
    };
    return Commander;
}());
exports.Commander = Commander;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Input = (function () {
    /**
     * TODO we really need to place a 'character' class that can just be told to move, the character class will then get the necessary data
     * such as the matric
     */
    function Input(stream) {
        // set to WASD
        this.updateKeyboardMaps({
            forward: 87,
            back: 83,
            strafeLeft: 65,
            strafeRight: 68,
            jump: 32,
            target: 223,
            firstAbility: 49,
            secondAbility: 50,
            thirdAbility: 51,
            fourthAbility: 52,
            fithAbility: 53 // 5
        });
        this._stream = stream;
    }
    Input.prototype.updateKeyboardMaps = function (mapping) {
        this._keyboardMapping = mapping;
    };
    Input.prototype.onCharacterReady = function (character) {
        this._character = character;
    };
    Input.prototype.isNotReady = function () {
        return (this._character === undefined);
    };
    Input.prototype.setScene = function (scene) {
        this._scene = scene;
    };
    Input.prototype.onKeyboardInput = function (event) {
        if (this.isNotReady()) {
            return console.log('Player not ready yet...');
        }
        console.log('Player input logged, a request to move, for now just stub:');
        if (event.keyCode === this._keyboardMapping.jump) {
            this.jump();
        }
    };
    Input.prototype.onMouseInput = function (event) {
        if (this._scene && !this.isNotReady()) {
            var pickResult = this._scene.pick(this._scene.pointerX, this._scene.pointerY);
            if (pickResult.hit) {
                this._stream.movePlayerRequest(this._character.playerId, pickResult.pickedPoint);
                //  this._character.moveByMouse(pickResult.pickedPoint);
            }
        }
    };
    Input.prototype.onMouseScroll = function (event) {
        if (event.wheelDelta / 120 > 0) {
            this._character.zoomIn();
        }
        else {
            this._character.zoomOut();
        }
    };
    Input.prototype.jump = function () {
        console.log("jump");
    };
    return Input;
}());
exports.Input = Input;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @classdesc More like pipe dream HUE HUE HUE
 */
var PipeStream = (function () {
    function PipeStream() {
        this._ready = false;
        // provide signal R here, it should already be connected to the server the connection process should not be handled by this class
    }
    PipeStream.prototype.setStreamHandlers = function (functionHooks) {
        this._movePlayerSuccess = functionHooks.movePlayerSuccess;
        this._movePlayerFailure = functionHooks.movePlayerFailure;
        this._attackPlayerSuccess = functionHooks.attackPlayerSuccess;
        this._attackPlayerFailure = functionHooks.attackPlayerFailure;
        this._ready = true;
    };
    PipeStream.prototype.isReady = function () {
        return this._ready;
    };
    PipeStream.prototype.movePlayerRequest = function (playerId, locationRequest) {
        console.log('todo make signal r request to server');
        // stub server should decide if below function is called
        var streamResult = {
            success: true,
            message: "yeah",
            response: {
                playerId: playerId,
                locationRequest: locationRequest
            }
        };
        this.movePlayerResponse(streamResult);
    };
    /**
     * We get this from the server.
     * @param result
     */
    PipeStream.prototype.movePlayerResponse = function (result) {
        if (result.success) {
            this._movePlayerSuccess(result.response.playerId, result.response.locationRequest);
        }
        else {
            this._movePlayerFailure(result.message);
        }
    };
    PipeStream.prototype.attackPlayerRequest = function () {
    };
    PipeStream.prototype.attackPlayerResponse = function () {
    };
    return PipeStream;
}());
exports.PipeStream = PipeStream;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Focuses on setting up the signalR connections for this client
 */
var TransportLayer = (function () {
    // set up the ajax request
    function TransportLayer(campaignId, getCampaignDataComplete, handShakeComplete) {
        this.hubConnectionUrl = "/game";
        this.campaignUrl = '/game/campaign/';
        this.logging = true;
        // setting up transport layer
        console.log('Requesting campaign data from server, campaign:', campaignId);
        this.onComplete = handShakeComplete;
        this.campaignId = campaignId;
        this.handshake();
        this.onComplete = handShakeComplete;
    }
    TransportLayer.prototype.handshake = function () {
        this.clientHub = $.signalR.hub.createHubProxy('game');
        this.clientHub.client = {
            beef: function () { debugger; }
        };
        console.log('Handshaking....');
        $.signalR.hub.logging = this.logging;
        $.signalR.hub.start().done(this.handshakeSuccess.bind(this)).fail(this.handshakeError);
    };
    // if handshake was succesfull, provide back the api signalR interface
    TransportLayer.prototype.handshakeSuccess = function () {
        debugger;
        this.clientHub.server.registerPlayer(this.campaignId);
        // set up client hub functions...
        // this.clientHub.client <=== should containg functions to the server
        // the servers response in===> this.clientHub.server functions()
    };
    TransportLayer.prototype.handshakeError = function () {
        throw new Error("Failed to complete handshake with server");
    };
    return TransportLayer;
}());
exports.TransportLayer = TransportLayer;


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map