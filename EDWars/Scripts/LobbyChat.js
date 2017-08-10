
(function () {
    var Lobby = {
        lobbyHub: $.connection.lobbyChat,
        chatModel: undefined,
        campaignModel: undefined,
        viewModel: undefined,
        init: function() {
            $.connection.hub.logging = true;
            $.connection.hub.start().done(this.connected.bind(this));
            this.viewModel = new this.models.Lobby(this.models.Messages, this.models.Campaigns);
            this.sendSetup();
        },
        connected: function() {
            this.lobbyHub.server.returnLobbies();
            ko.applyBindings(this.viewModel);
        },
        sendSetup: function() {
            this.lobbyHub.client.chatMessage = this.viewModel.addMessage.bind(this.viewModel);
            this.lobbyHub.client.addLobby = this.viewModel.addOne.bind(this.viewModel);
            this.lobbyHub.client.addLobbies = this.viewModel.addAll.bind(this.viewModel);
        },
        models: {
            Lobby: function(Messages, Campaigns) {
                var self = this;
                self.chat = new Messages();
                self.campaigns = new Campaigns();
            },
            Campaigns: function() {
                var self = this;
                self.campaigns = ko.observableArray();
            },
            Messages: function() {
                var self = this;
                self.message = ko.observable("");
                self.messages = ko.observableArray();
            },
            Campaign: function(campaign) {
                var self = this;
                var status = ["In Lobby", "In Game", "Finished"];
                self.Id = ko.observable(campaign.id);
                self.url = ko.observable("/lobbies/matchmaking/" + campaign.id);
                self.users = ko.observable(campaign.blueTeam.players.length + campaign.redTeam.players.length + "/8");
                self.mapName = ko.observable(campaign.map.name);
                self.mapImage = ko.observable(campaign.map.imageUrl);
                self.notes = ko.observable(campaign.notes);
                self.status = ko.observable(status[campaign.status]);
                self.redFaction = ko.observable(campaign.redTeam.faction.imgUrl);
                self.blueFaction = ko.observable(campaign.blueTeam.faction.imgUrl);
            }
        }
        
    }

    //Chat protos
    Lobby.models.Lobby.prototype = {
        throttleTime: 800,
        canSend: true,
        loaded: false,
        debounceThrottle: function () {
            var timedEvent = function() {
                this.canSend = true;
            }
            setTimeout(timedEvent.bind(this), this.throttleTime);
        },
        sendMessage: function () {
            var self = this;
            var msgToSend = self.chat.message();
            if (!msgToSend) {
                alertify.error('Message field is empty');
                return;
            }
            if (!this.canSend) {
                self.addMessage("Admin: Your message was throttled, please wait before sending a message again");
                this.debounceThrottle();
                return;
            }
            Lobby.lobbyHub.server.sendMessage(msgToSend).fail(function (error) { 
                debugger;
                alertify.error("Cannot send message, if you have just logged in you will need to refresh the page to get proper chat credentials.");
                console.error(error);
            });;
            self.chat.message("");
            this.canSend = false;
            this.debounceThrottle();
        },
        addMessage: function (message) {
            var self = this.chat;
            self.messages.push(message);
            var out = document.getElementById("chat-messages");
            out.scrollTop = out.scrollHeight;
        },
        addOne: function (campaign) {
            campaign = JSON.parse(campaign);
            var campaignModel = new Lobby.models.Campaign(campaign);
            this.campaigns.campaigns.push(campaignModel);
        },
        addAll: function (campaigns) {
            campaigns = JSON.parse(campaigns);
            this.campaigns.campaigns.removeAll();
            var campaignModels = [];
            for (var i = 0; i < campaigns.length; i++) {
                campaignModels.push(new Lobby.models.Campaign(campaigns[i]));
            }
            this.campaigns.campaigns(campaignModels);
            if (!this.loaded) {

            }
        }
    }

    Lobby.init();

})();