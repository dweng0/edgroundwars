/**
 * Focuses on setting up the signalR connections for this client
 */
export class AssetsManager {
    private _assets: BABYLON.AssetsManager;
    private _mapAssets: string[];
    private _commanderAssets: string[];
    private _success: any;
    private _fail: any;

    private _assetUrl: string =  "/assets";
    private _mapAssetUrl: string;
    private _textureUrl: string;
    private _skyBoxUrl: string;
    private _loadingText: string;

    heightMapUrl: string;
    textureUrl: string;
    

    constructor() {
        
    }

    //Load assets for a given map
    loadInstanceAssets(loadingText: string, scene: BABYLON.Scene, campaign: Campaign, onSuccess: any, onFail: any) {
        var errors = new Array<string>();
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
    }

    getMapAssets(scene: BABYLON.Scene, campaign: Campaign, errors: Array<string>): Array<string> {
        console.log('loading map assets....');
        
        this._mapAssetUrl = this._assetUrl + "/maps/" + campaign.Map.AssetUrl;
        
        var maptexture = this._mapAssetUrl + "ground.jpg";
        var skyBoxUrl = this._mapAssetUrl + "skybox/skybox";

        this.textureUrl = this._mapAssetUrl + "ground.jpg";
        this.heightMapUrl = this._mapAssetUrl + "heightMap.png";

        //load ground texture
        this.loadTexture("groundloading", maptexture, () => this._loadingText = "Distance to touchdown 7000km", () => errors.push("Failed to load map texture"));

        //load height map
        this.loadImage("heightMap", this.heightMapUrl, () => this._loadingText = "Distance to touchdown 5000km", ()=> errors.push("Failed to load height map"));

        //load skybox
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
    }


    /**
    * Given a set of arguments, attempts to load a texture into the assets manage
    */
    loadTexture(taskName: string, url: string, success: any, fail: any, noMipMap?: boolean, sampling?: boolean) {
        console.log('loading texture...', taskName);
        var textureLoad = this._assets.addTextureTask(taskName, url, noMipMap, sampling);
        textureLoad.onSuccess = success.bind(this);
        textureLoad.onError = fail.bind(this);
        return textureLoad;
    }

    /**
     * Given a set of arguments, attempts to load an image into the assets manager
     * @param taskName string name of the task
     * @param url string the url of where to find the image
     * @param success fn
     * @param fail fn
     */
    loadImage(taskName: string, url: string, success: any, fail: any) {
        console.log('loading image...', taskName);
        var imageLoader = this._assets.addImageTask(taskName, url); 
        imageLoader.onSuccess = success;
        imageLoader.onError = fail;
        return imageLoader;
    }

    /**
     * Load mech components for the game
     * @param taskName
     * @param meshNames
     * @param rootUrl
     * @param sceneFileName
     * @param success
     * @param fail
     */
    loadMesh(taskName: string, meshNames: any, rootUrl: string, sceneFileName: string, success: any, fail: any) {
        console.log('loading mesh', taskName);
        var meshLoader = this._assets.addMeshTask(taskName, meshNames, rootUrl, sceneFileName);
        meshLoader.onSuccess = success.bind(this);
        meshLoader.onError = fail.bind(this);
        return meshLoader;
    }

    getInstancePlayerAssets(scene: BABYLON.Scene, campain: Campaign, errors: Array<string>): Array<string> {
        return errors;
    }

    getOtherPlayerAssets(scene: BABYLON.Scene, campain: Campaign,errors: Array<string>): Array<string> {
        return errors;
    }
}
