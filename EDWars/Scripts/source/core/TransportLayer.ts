/**
 * Focuses on setting up the signalR connections for this client
 */
export class TransportLayer {
    private hubConnectionUrl: string =  "/game";
    private campaignUrl:string =  '/game/campaign/';
    private logging: boolean = true;
    private model: any; //need to find out what the server sends back, and create an interface
    private api: any;
    private onComplete: any; //callback when the handshake is complete
    private clientHub: any;
    private campaignId: number;
    //set up the ajax request
    constructor(campaignId: number, getCampaignDataComplete:any, handShakeComplete: any) {
        //setting up transport layer
        console.log('Requesting campaign data from server, campaign:', campaignId);
        this.onComplete = handShakeComplete;
        this.campaignId = campaignId;
        $.ajax(this.campaignUrl + campaignId,
        {
            url: this.campaignUrl + campaignId,
            dataType: "json",
            traditional: true,
            context: this,
            success: function (data: any, textStatus: string, jqXHR: JQueryXHR) {
              
                console.log("Retrieved campaign data...");
                data = JSON.parse(data);

                console.log('setting up hub connection...');
                getCampaignDataComplete(data);//someone else handles the campaign data
                this.handshake();
            },
            error: function (jqXHR: JQueryXHR, textStatus: string, errorThrown: string) {
                throw new Error(errorThrown);
            }
            });
        
        this.onComplete = handShakeComplete;
    }   
    
    handshake() {
        debugger;
        this.clientHub = $.signalR.hub.createHubProxy('game');
        this.clientHub.client = {
            beef: function() { debugger }
        };
        console.log('Handshaking....');
        $.signalR.hub.logging = this.logging;
        //start the connection
        $.signalR.hub.start().done(this.handshakeSuccess.bind(this)).fail(this.handshakeError);
    }

    //if handshake was succesfull, provide back the api signalR interface
    handshakeSuccess() {
        debugger
        this.clientHub.server.registerPlayer(this.campaignId);
        //set up client hub functions...
        //this.clientHub.client <=== should containg functions to the server
        //the servers response in===> this.clientHub.server functions()
        
    }

    handshakeError() {
        throw new Error("Failed to complete handshake with server");
    }
    
}
