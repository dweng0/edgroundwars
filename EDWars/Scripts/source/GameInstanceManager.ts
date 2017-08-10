import {Map} from  "./assets/Map";
import {Player} from  "./assets/Player";
import {TransportLayer} from  "./core/transportLayer";
import {AssetsManager} from  "./core/assetsmanager";


export class GameInstanceInstanceManager {

    private _canvasId: string = "rendercanvas";
    private _canvas: HTMLCanvasElement;
    private _engine: BABYLON.Engine;
    private _scene: BABYLON.Scene;
    private _camera: BABYLON.FreeCamera;
    private _light: BABYLON.Light;
    private _map: Map;
    private _players: Player[];
    private _tpl: TransportLayer;
    private _aim: AssetsManager;
    private _debug: boolean = true;


    /*
    * Sets up the game instance for this user.
    * - Sets up the transportlayer class for connections to the server
    * - Utilisiese the resource manager to handle loading of assets
    * - when everyone is happy, sets up the user interface class 
    */
    constructor(campaignId: number) {
        console.log('initializing...');
        //set up babylong,
        this._canvas = <HTMLCanvasElement>document.getElementById(this._canvasId);

        if (!this._canvas) {
            throw new Error("Could not load canvas");
        }
        
        this._aim = new AssetsManager();
        //this.aim.onAssetsLoaded(callbk)

        //use the transportlayer class to set up a connection to the server
        this._tpl = new TransportLayer(campaignId, this.startBabylon.bind(this), this.placeholderFn());
        
    }

    //when handshake is complete what happens next
    placeholderFn() {
        
    }

    startBabylon(campaign: Campaign) {
        console.log('Starting engine...')
        this._engine = new BABYLON.Engine(this._canvas, true);
        this._engine.loadingUIText = "Loading... (assets)";
        
        //resize the canvas on window resize
        window.addEventListener('resize', function () {
            this.engine.resize();
        });
        
        this.setScene();
        console.log('Loading assets manager...');
        this._aim.loadInstanceAssets(this._engine.loadingUIText, this._scene, campaign, this.onAllAssetsLoaded, this.onLoadAssetsFail);
    }

    /**
     * If we've got this far, then all assets needed by the game have been retrieved and we can start loading up babylon
     */
    onAllAssetsLoaded() {
        console.log('Completing scene creation...');
        this._engine.loadingUIText = "Landing gear deployed";

        var errors = new Array<string>();
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
        } else {
            this.ready();
        }

    }

    /**
     * reached this point, then the client is ready and waiting on server to tell it if it can start
     */
    ready() {
        console.log('Ready...');
       //for now just call start
        this.start();
    }

    start() {
        if (this._debug) {
            this._scene.debugLayer.show();    
        }
    }

    setScene() {
        this._scene = new BABYLON.Scene(this._engine);
    }

    /**
     * Sets up the camera for the game,
     */
    setCamera(){
        this._camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 1, -10), this._scene);

        //camera positioning
        this._camera.setTarget(new BABYLON.Vector3(-10, -10, 0));
        this._camera.attachControl(this._canvas);

        //for debugging
        //for debugging the scene
        this._camera.keysUp = [87];
        this._camera.keysDown = [83];
        this._camera.keysLeft = [65];
        this._camera.keysRight = [68];

        this._camera.speed = 3.0;

     

        var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, this._scene);
            // Move the sphere upward 1/2 its height
            sphere.position.y = 1;
            sphere.position.z = -10;
            sphere.position.x = -10;

    }

    /**
     * Sets up the lighting for the game
     */
    setLighting() {
        //lighting
        this._light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), this._scene);

        this._light.diffuse = new BABYLON.Color3(1, 1, 1);
        this._light.specular = new BABYLON.Color3(0, 0, 0);
    }
    
    setEnvironment() {
        var material = new BABYLON.StandardMaterial("ground", this._scene);
            material.diffuseTexture = new BABYLON.Texture(this._aim.textureUrl, this._scene);
        var ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", this._aim.heightMapUrl, 250, 300, 250, 0, 50, this._scene, false);
            ground.material = material;
    }

    setPlayers() {
        var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, this._scene);
        // Move the sphere upward 1/2 its height
        sphere.position.y = 1;
        sphere.position.z = -10;
        sphere.position.x = -10;
    }

    onLoadAssetsFail() {
        throw new Error("Failed to load Assets");
    }
}