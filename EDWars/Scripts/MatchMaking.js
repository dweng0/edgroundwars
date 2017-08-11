
(function () {
    var MatchMaker = {
        matchMaker: $.connection.matchMaking,
        gameid: undefined,
        viewModel: undefined,
        playerusername: undefined,
        teamName: undefined,
        init: function() {
            $.connection.hub.logging = true;
            this.sendSetup();
            $.connection.hub.start().done(this.connected.bind(this));
        },

        getPathName: function() {
            var pathName = window.location.pathname;
            var lastChar = pathName.substr(pathName.length - 1);
            if (lastChar === "/") {
                pathName = pathName.substr(0, pathName.length - 1);
            }

            return pathName.substr(pathName.lastIndexOf('/') + 1);
        },

        connected: function() {
            
           
            this.matchMaker.server.handShake(this.gameid).fail(function(e) {
                alertify.error("failed to connect to game lobby");
                console.log(e);
            });
        },
        sendSetup: function () {
            this.gameid = this.getPathName();
            this.matchMaker.client.Addcampaign = this.completeHandshake.bind(this);
            this.matchMaker.client.warning = function(message) {
                alertify.warning(message);
            };
            this.matchMaker.client.error = function (message) {
                alertify.error(message);
                throw new Error(message);
            };
            this.matchMaker.client.playerChangedTeam = this.lateBindingFunctions.playerChangedTeam.bind(this);
            this.matchMaker.client.playerLeft = this.lateBindingFunctions.playerLeft.bind(this);
            this.matchMaker.client.playerJoined = this.lateBindingFunctions.playerJoined.bind(this);
            this.matchMaker.client.chatMessage = this.lateBindingFunctions.addMessage.bind(this);
            this.matchMaker.client.makeTeamLeader = this.lateBindingFunctions.makeTeamLeader.bind(this);
            this.matchMaker.client.makeMaster = this.lateBindingFunctions.makeMaster.bind(this);
            this.matchMaker.client.teamChangedfaction = this.lateBindingFunctions.teamChangedfaction.bind(this);
            this.matchMaker.client.mapHasChanged = this.lateBindingFunctions.mapHasChanged.bind(this);
            this.matchMaker.client.startGameCountdown = this.lateBindingFunctions.startGameCountdown.bind(this);
            this.matchMaker.client.gameIsStarting = this.lateBindingFunctions.gameIsStarting.bind(this);
            this.matchMaker.client.playerIsNotReady = this.lateBindingFunctions.playerIsNotReady.bind(this);
            this.matchMaker.client.playerIsReady = this.lateBindingFunctions.playerIsReady.bind(this);
            this.matchMaker.client.playerChangedcommander = this.lateBindingFunctions.playerChangedcommander.bind(this);
        },
        completeHandshake: function (campaign, username) {
            campaign = JSON.parse(campaign);
                       debugger
            this.playerusername = username;
            this.viewModel = new this.models.MatchMaker(this.models, campaign);
            ko.applyBindings(this.viewModel);
            document.getElementById('joinSpectators').addEventListener("click", this.viewModel.joinSpectators.bind(this.viewModel));
          
        },
        //Functions act as a middle man for the viewmodel which may not exist when signalR needs a reference to it.
        lateBindingFunctions: {
            playerChangedTeam: function() {
                this.viewModel.playerChangedTeam.apply(this.viewModel, arguments);
            },
            playerLeft: function() {
                this.viewModel.playerLeft.apply(this.viewModel, arguments);
            },
            playerJoined:function() {
                this.viewModel.playerJoined.apply(this.viewModel, arguments);
            },
            addMessage:function() {
                this.viewModel.addMessage.apply(this.viewModel, arguments);
            },
            makeTeamLeader: function() {
                this.viewModel.makeTeamLeader.apply(this.viewModel, arguments);
            },
            makeMaster:function() {
                this.viewModel.makeMaster.apply(this.viewModel, arguments);
            },
            teamChangedfaction:function()
            {
                this.viewModel.teamChangedfaction.apply(this.viewModel, arguments);
            },
            mapHasChanged:function() {
                this.viewModel.mapHasChanged.apply(this.viewModel, arguments);
            },
            startGameCountdown:function() {
                this.viewModel.startGameCountdown.apply(this.viewModel, arguments);
            },
            gameIsStarting:function() {
                this.viewModel.gameIsStarting.apply(this.viewModel, arguments);
            },
            playerIsNotReady:function() {
                this.viewModel.playerIsNotReady.apply(this.viewModel, arguments);
            },
            playerIsReady:function() {
                this.viewModel.playerIsReady.apply(this.viewModel, arguments);
            }                                                                          ,
            playerChangedcommander:function() {
                this.viewModel.playerChangedcommander.apply(this.viewModel, arguments);
            }
        },
        models: {
            MatchMaker: function (Models, campaignObject, startTime) {
                var self = this;
                self.autoStarts = false; //ko.observable(startingTime),
                self.teamName = ko.observable("");
                self.teamLeader = ko.observable(false);
                self.matchMaster = ko.observable(false);
                self.chat = new Models.Messages();
                self.campaign = new Models.campaign(Models, campaignObject);
                self.currentTeam = ko.observable();
            },
            redTeam:function(Model, team){
                var self = this;
                self.id = team.id;
                self.name = ko.observable(team.name);
                self.faction = new Model.faction(team.faction);
                self.players = ko.observableArray();
                for (var index = 0; index < team.players.length; index++) {
                    var player = team.players[index];
                    self.players.push(new MatchMaker.models.player(player));
                }
            },
            blueTeam: function (Model, team) {
                var self = this;
                self.id = team.id;
                self.name = ko.observable(team.name);
                self.faction = new Model.faction(team.faction);
                self.players = ko.observableArray();
                for (var index = 0; index < team.players.length; index++) {
                    var player = team.players[index];
                    self.players.push(new MatchMaker.models.player(player));
                }
            },
            spectatingTeam: function (team) {
                var self = this;
                self.id = team.id;
                self.name = ko.observable(team.name);
                self.players = ko.observableArray();
                for (var index = 0; index < team.players.length; index++) {
                    var player = team.players[index];
                    self.players.push(new MatchMaker.models.player(player));
                }
            },
            campaign:function(Models, campaign) {
                var self = this;
                var status = ["In Lobby", "In Game", "Finished"];
                self.id = ko.observable(campaign.id);
                self.url = ko.observable("/lobbies/matchmaking/" + campaign.id);
                self.users = ko.observable(campaign.blueTeam.players.length + campaign.redTeam.players.length + "/8");
                self.map = ko.observable(campaign.map);
                self.notes = ko.observable(campaign.notes);
                self.status = ko.observable(status[campaign.Status]);
                self.redTeam = new Models.redTeam(Models, campaign.redTeam);
                self.blueTeam = new Models.blueTeam(Models, campaign.blueTeam);
                self.spectatingTeam = new Models.spectatingTeam(campaign.spectatingTeam);
            },
            faction:function(faction) {
                var self = this;
                self.id = ko.observable(faction.id);
                self.name = ko.observable(faction.name);
                self.imgUrl = ko.observable(faction.imgUrl);
                self.factionAbilities = faction.factionAbilities;
            },
            player: function(player) {
                var self = this;
                self.id = player.Id || player.id;
                self.username = player.username;
                debugger;
                if (typeof player.commander === "function") {
                    self.commander = ko.observable(new MatchMaker.models.commander(player.commander()));
                } else {
                    self.commander = ko.observable(new MatchMaker.models.commander(player.commander));
                }
               
                if (typeof player.Ready === "function") {
                    player.Ready = player.Ready();
                }
                self.Ready = ko.observable(player.Ready);
                debugger;
                self.me = (player.me) ? player.me : false; //purely for display, not used by the backend to determine who the player is
            },
            commander: function(commander) {
                var self = this;
                self.id = commander.Id;
                self.name = commander.name;
                self.imgUrl = commander.imgUrl;
            },
            Messages:function() {
                var self = this;
                self.message = ko.observable("");
                self.messages = ko.observableArray();
            }
        }
    }

    MatchMaker.models.player.prototype = {
        playerReady: function() {
            MatchMaker.matchMaker.server.playerReady();
        },
        playerNotReady: function() {
            MatchMaker.matchMaker.server.playerNotReady();
        },
        commanderFn: undefined,
        commanderSelectBox: function () {
            var reloader = function () {
                commandSlider.reloadSlider();
                var self = this;
                if (!self.commanderFn) {
                    debugger;
                    self.commanderFn = function (event) {
                        var commanderid = parseInt(this.dataset.commanderid);
                        self.setcommander(commanderid);
                    }
                    $('.commander-select').click(self.commanderFn);
                }
            }
            if (!self.commanderFn) {
                $('#commanderList').on('shown.bs.modal', reloader.bind(this));
            }
            $('#commanderList').modal('show');
        },
        setcommander: function (commanderid) {
            MatchMaker.matchMaker.server.requestCommander(commanderid);
        }
     
    };

    MatchMaker.models.MatchMaker.prototype = {
        orphanedplayers: [],
        playerJoined: function(playerObject, isMe) {
            playerObject = JSON.parse(playerObject);
            playerObject.me = isMe;
            var player = new MatchMaker.models.player(playerObject);
            this.orphanedplayers.push(player);
            this.addMessage(player.username + " joined");
        },
        playerLeft: function(teamid, playerusername) {
            this.removeFromTeam(teamid, playerusername);
            this.addMessage(playerusername + " has left.");
        },
        joinRed: function() {
            var teamid = this.campaign.redTeam.id;
            this.teamLeader(false);
            this.joinTeam(teamid);
        },

        pickRedfaction: function() {
            var reloader = function() {
                slider.reloadSlider();
                var self = this;
                if (!self.performTeamChangeRed) {
                    debugger;
                    self.performTeamChangeRed = function(event) {
                        var factionid = parseInt(this.dataset.faction);
                        var teamid = self.campaign.redTeam.id;
                        self.setfaction(factionid, teamid);
                    }
                    $('.faction-picker').click(self.performTeamChangeRed);
                }
            }
            if (!this.performTeamChangeRed) {
                $('#factionslist').on('shown.bs.modal', reloader.bind(this));
            }
            $('#factionslist').modal('show');
        },
        setfaction: function(faction, team) {
            MatchMaker.matchMaker.server.requestUpdatefaction(faction, team);
        },
        playerChangedcommander: function(username, commander) {
            commander = JSON.parse(commander);
            var player = this.getplayer(username);
            var commanderModel = new MatchMaker.models.commander(commander);
            player.commander(commanderModel);
            player.commander.valueHasMutated();
        },
        pickMapFn: undefined,
        pickMap: function() {
            var mapPicker = function() {
                mapSlider.reloadSlider();
                var self = this;
                if (!self.pickMapFn) {
                    debugger;
                    self.pickMapFn = function(event) {
                        var mapid = parseInt(this.dataset.mapid);
                        self.setMap(mapid);
                    }
                    $('.map-select').click(self.pickMapFn);
                }
            }
            if (!this.pickMapFn) {
                $('#mapslist').on('shown.bs.modal', mapPicker.bind(this));
            }
            $('#mapslist').modal();
        },

        requestStartGameCountDown: function() {
            if (this.matchMaster()) {
                MatchMaker.matchMaker.server.requestStartGameCountdown();
            }
        },
        pickcommanderFn: undefined,
        startGameCountdown: function(time) {
            var timeInSeconds = (time / 1000);
            this.clock = setInterval(this.updateCountDown.bind(this, timeInSeconds), 1000);
            alertify.success('Game starting in ' + timeInSeconds);
        },
        gameIsStarting: function (groupid) {
            window.location.href = "/game/play/"+groupid; 
        },
        countDownEl: document.getElementById('countDown'),
        clock: undefined,
        countDown:undefined,
        updateCountDown: function (time) {
            if (!this.countDown) {
                this.countDown = time;
            }

            this.countDown = (this.countDown - 1);
            if (this.countDown < 2) {
                clearInterval(this.clock);
                this.countDownEl.textContent = "Waiting for server...";
                return;
            }
            this.countDownEl.textContent = this.countDown;

    },
        playerIsReady:function(playerName) {
            var player = this.getplayer(playerName);
            player.Ready(true);
            player.valueHasMutated();
        },
        playerIsNotReady:function(playerName) {
            var player = this.getplayer(playerName);
            player.Ready(false);
            player.valueHasMutated();
        },
        mapHasChanged:function(map) {
            this.campaign.map(map);
            this.addMessage("Admin: map has changed to "+ map.Name);
        }                       ,
        setMap:function(mapid) {
            MatchMaker.matchMaker.server.requestMapChange(mapid);
        }   ,
        renameRed: function (model, e) {
            debugger;
            alert("rename to", e.value);
        },
        joinBlue: function () {
            var teamid = this.campaign.blueTeam.id;
            this.teamLeader(false);
            this.joinTeam(teamid);
        },
        joinSpectators: function () {
            var teamid = this.campaign.spectatingTeam.id;
            this.teamLeader(false);
            this.joinTeam(teamid);   
        },
     
        performTeamChangeBlue:undefined,
        performTeamChangeRed: undefined,
        pickBluefaction: function () {
             var reloader = function () {
                slider.reloadSlider();
                var self = this;
                if (!self.performTeamChangeBlue) {
                    debugger;
                    self.performTeamChangeBlue = function(event) {
                        var factionid = parseInt(this.dataset.faction);
                        var teamid = self.campaign.blueTeam.id;
                        self.setfaction(factionid, teamid);
                    }
                    $('.faction-picker').click(self.performTeamChangeBlue);
                }
            }
            if (!self.performTeamChangeBlue) {
                $('#factionslist').on('shown.bs.modal', reloader.bind(this));
            }        
            $('#factionslist').modal('show');
        },
        teamChangedfaction: function (teamid, faction) {
            faction = JSON.parse(faction);
            var team = this.getTeam(teamid);
            team.faction.id = faction.id;
            team.faction.name(faction.name);
            team.faction.imgUrl(faction.imgUrl);
            alertify.success(team.name() + " have switched faction to " + faction.name);

        } ,
        makeTeamLeader: function () {
            var team = this.teamName();
            debugger;
            if (this.teamName().toLowerCase() === "spectator") {
                return;
            }
            this.teamLeader(true);
            alertify.success('You are team leader');
        },
        makeMaster: function () {
            this.matchMaster(true);
            this.matchMaster.valueHasMutated();
            alertify.success('you are now Matchmaking Master');
        },
        throttleTime: 800,
        canSend: true,
        loaded: false,
        debounceThrottle: function () {
            var timedEvent = function () {
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
            MatchMaker.matchMaker.server.sendMessage(msgToSend).fail(function (error) {
                
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
        joinTeam: function (teamid) {
            MatchMaker.matchMaker.server.joinTeam(teamid);
        },
        playerChangedTeam: function (currentTeamid, newTeamid, playerName) {
            debugger;
            var changeTeamName = false;
            if (playerName === MatchMaker.playerusername) {
                changeTeamName = true;
            }
            var player = this.removeFromTeam(currentTeamid, playerName); //find player and remove from current team/list

            var team = this.addToTeam(newTeamid, player, changeTeamName); //find team and add player to that list
            this.addMessage("Admin: " + playerName + " joined " + team.name());
        },
        getTeam:function(teamid) {
            var team = undefined;
            if (this.campaign.blueTeam.id === teamid) {
                team = this.campaign.blueTeam;
            }
            if (this.campaign.redTeam.id === teamid) {
                team = this.campaign.redTeam;
            }
            if (this.campaign.spectatingTeam.id === teamid) {
                team = this.campaign.spectatingTeam;
            }
            return team;
        },
        getplayer:function(playerName) {
            var player = undefined;
            debugger;
            var blueTeam = this.campaign.blueTeam;
            var redTeam = this.campaign.redTeam;
            var spectators = this.campaign.spectatingTeam;
            var blueplayerCount = blueTeam.players();
            for (var index = 0; index < blueplayerCount.length; index++) {
                var blueplayer = blueplayerCount[index];
                if (blueplayer.username === playerName) {
                    player = blueplayer;
                }
            }
            if (!player) {
                var redplayerCount = redTeam.players();
                for (var index = 0; index < redplayerCount.length; index++) {
                    var redplayer = redplayerCount[index];
                    if (redplayer.username === playerName) {
                        player = redplayer;
                    }
                }
            }         
            if (!player) {
                var spectatorCount = spectators.players();
                for (var index = 0; index < spectatorCount.length; index++) {
                    var specplayer = spectatorCount[index];
                    if (specplayer.username === playerName) {
                        player = specplayer;
                    }
                }
            }
            if (!player) {
                var orphans = this.orphanedplayers;
                for (var index = 0; index < orphans.length; index++) {
                    var orphanplayer = orphans[index];
                    if (orphanplayer.username === playerName) {
                        player = orphanplayer;
                    }
                }
            }
            return player;

        },
        removeFromTeam: function (teamid, playerName) {
            var blueTeam = this.campaign.blueTeam;
            var redTeam = this.campaign.redTeam;
            var spectators = this.campaign.spectatingTeam;     
            var playerObject = undefined;

            if (blueTeam.id === teamid) {
                var blueplayers = blueTeam.players().length;
                for (var i = 0; i < blueplayers; i++) {
                    var blueTeamplayer = blueTeam.players()[i];
                    if (blueTeamplayer.username === playerName) {
                        playerObject = blueTeam.players().splice(i, 1)[0];
                        blueTeam.players.valueHasMutated();
                        break;
                    }
                }
            } else if (redTeam.id === teamid) {
                var redplayers = redTeam.players().length;
                for (var i = 0; i < redplayers; i++) {
                    var redTeamplayer = redTeam.players()[i];
                    if (redTeamplayer.username === playerName) {
                        playerObject = redTeam.players().splice(i, 1)[0];
                        redTeam.players.valueHasMutated();
                        break;
                    }
                }
            } else if (spectators.id === teamid) {
                var specplayers = spectators.players().length;
                for (var i = 0; i < specplayers; i++) {

                    var player = spectators.players()[i];
                    if (player.username === playerName) {
                        playerObject = spectators.players().splice(i, 1)[0];
                        spectators.players.valueHasMutated();
                        break;
                    }
                }
            } else {
                
                //check orphaned players list
                for (var j = 0; j < this.orphanedplayers.length; j++) {
                    var player = this.orphanedplayers[j];
                    if (player.username === playerName) {
                        playerObject = this.orphanedplayers.splice(j, 1)[0];
                        break;
                    }
                }
            }
            return playerObject;
        },
        addToTeam:function(teamid, player, changeTeamName) {
            var blueTeam = this.campaign.blueTeam;
            var redTeam = this.campaign.redTeam;
            var spectators = this.campaign.spectatingTeam;
            var playerObject = new MatchMaker.models.player(player);
            if (blueTeam.id === teamid) {
                blueTeam.players.push(playerObject);
                if (changeTeamName) {
                    MatchMaker.viewModel.teamName(blueTeam.name());
                }
                return blueTeam;
            } else if (redTeam.id === teamid) {
                redTeam.players.push(playerObject);
                if (changeTeamName) {
                    MatchMaker.viewModel.teamName(redTeam.name());
                }
                return redTeam;

            } else if (spectators.id === teamid) {
                var spectatingplayers = spectators.players();
                spectators.players.push(playerObject);
                if (changeTeamName) {
                    MatchMaker.viewModel.teamName(spectators.name());
                }
                return spectators;
            }
        }
    }

    MatchMaker.init();

})();