
(function () {
    var MatchMaker = {
        matchMaker: $.connection.matchMaking,
        gameId: undefined,
        viewModel: undefined,
        playerUsername: undefined,
        teamName: undefined,
        init: function() {
            $.connection.hub.logging = true;
            $.connection.hub.start().done(this.connected.bind(this));
            this.sendSetup();
            var pathName = window.location.pathname;
            var lastChar = pathName.substr(pathName.length - 1);
            if (lastChar === "/") {
                pathName = pathName.substr(0, pathName.length - 1);
            }
            this.sendSetup();
            pathName = pathName.substr(pathName.lastIndexOf('/') + 1);
            this.gameId = pathName;
        },
        connected: function() {
            
           
            this.matchMaker.server.handShake(this.gameId).fail(function(e) {
                alertify.error("failed to connect to game lobby");
                console.log(e);
            });
        },
        sendSetup: function() {
            this.matchMaker.client.AddCampaign = this.completeHandshake.bind(this);
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
            this.matchMaker.client.teamChangedFaction = this.lateBindingFunctions.teamChangedFaction.bind(this);
            this.matchMaker.client.mapHasChanged = this.lateBindingFunctions.mapHasChanged.bind(this);
            this.matchMaker.client.startGameCountdown = this.lateBindingFunctions.startGameCountdown.bind(this);
            this.matchMaker.client.gameIsStarting = this.lateBindingFunctions.gameIsStarting.bind(this);
            this.matchMaker.client.playerIsNotReady = this.lateBindingFunctions.playerIsNotReady.bind(this);
            this.matchMaker.client.playerIsReady = this.lateBindingFunctions.playerIsReady.bind(this);
            this.matchMaker.client.playerChangedCommander = this.lateBindingFunctions.playerChangedCommander.bind(this);
        },
        completeHandshake: function (campaign, username) {
            campaign = JSON.parse(campaign);
                       debugger
            this.playerUsername = username;
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
            teamChangedFaction:function()
            {
                this.viewModel.teamChangedFaction.apply(this.viewModel, arguments);
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
            playerChangedCommander:function() {
                this.viewModel.playerChangedCommander.apply(this.viewModel, arguments);
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
                self.campaign = new Models.Campaign(Models, campaignObject);
                self.currentTeam = ko.observable();
            },
            RedTeam:function(Model, team){
                var self = this;
                self.id = team.Id;
                self.name = ko.observable(team.Name);
                self.faction = new Model.Faction(team.Faction);
                self.players = ko.observableArray();
                for (var index = 0; index < team.Players.length; index++) {
                    var player = team.Players[index];
                    self.players.push(new MatchMaker.models.Player(player));
                }
            },
            BlueTeam: function (Model, team) {
                var self = this;
                self.id = team.Id;
                self.name = ko.observable(team.Name);
                self.faction = new Model.Faction(team.Faction);
                self.players = ko.observableArray();
                for (var index = 0; index < team.Players.length; index++) {
                    var player = team.Players[index];
                    self.players.push(new MatchMaker.models.Player(player));
                }
            },
            SpectatingTeam: function (team) {
                var self = this;
                self.id = team.Id;
                self.name = ko.observable(team.Name);
                self.players = ko.observableArray();
                for (var index = 0; index < team.Players.length; index++) {
                    var player = team.Players[index];
                    self.players.push(new MatchMaker.models.Player(player));
                }
            },
            Campaign:function(Models, campaign) {
                var self = this;
                var status = ["In Lobby", "In Game", "Finished"];
                self.Id = ko.observable(campaign.Id);
                self.url = ko.observable("/lobbies/matchmaking/" + campaign.Id);
                self.users = ko.observable(campaign.BlueTeam.Players.length + campaign.RedTeam.Players.length + "/8");
                self.map = ko.observable(campaign.Map);
                self.notes = ko.observable(campaign.Notes);
                self.status = ko.observable(status[campaign.Status]);
                self.redTeam = new Models.RedTeam(Models, campaign.RedTeam);
                self.blueTeam = new Models.BlueTeam(Models, campaign.BlueTeam);
                self.spectatingTeam = new Models.SpectatingTeam(campaign.SpectatingTeam);
            },
            Faction:function(faction) {
                var self = this;
                self.id = ko.observable(faction.Id);
                self.name = ko.observable(faction.Name);
                self.imgUrl = ko.observable(faction.ImgUrl);
                self.FactionAbilities = faction.FactionAbilities;
            },
            Player: function(player) {
                var self = this;
                self.Id = player.Id;
                self.Username = player.Username;
                debugger;
                if (typeof player.Commander === "function") {
                    self.Commander = ko.observable(new MatchMaker.models.Commander(player.Commander()));
                } else {
                    self.Commander = ko.observable(new MatchMaker.models.Commander(player.Commander));
                }
               
                if (typeof player.Ready === "function") {
                    player.Ready = player.Ready();
                }
                self.Ready = ko.observable(player.Ready);
                debugger;
                self.me = (player.me) ? player.me : false; //purely for display, not used by the backend to determine who the player is
            },
            Commander: function(commander) {
                var self = this;
                self.Id = commander.Id;
                self.Name = commander.Name;
                self.ImgUrl = commander.ImgUrl;
            },
            Messages:function() {
                var self = this;
                self.message = ko.observable("");
                self.messages = ko.observableArray();
            }
        }
    }

    MatchMaker.models.Player.prototype = {
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
                        var commanderId = parseInt(this.dataset.commanderid);
                        self.setCommander(commanderId);
                    }
                    $('.commander-select').click(self.commanderFn);
                }
            }
            if (!self.commanderFn) {
                $('#commanderList').on('shown.bs.modal', reloader.bind(this));
            }
            $('#commanderList').modal('show');
        },
        setCommander: function (commanderId) {
            MatchMaker.matchMaker.server.requestCommander(commanderId);
        }
     
    };

    MatchMaker.models.MatchMaker.prototype = {
        orphanedPlayers: [],
        playerJoined: function(playerObject, isMe) {
            playerObject = JSON.parse(playerObject);
            playerObject.me = isMe;
            var player = new MatchMaker.models.Player(playerObject);
            this.orphanedPlayers.push(player);
            this.addMessage(player.Username + " joined");
        },
        playerLeft: function(teamId, playerUserName) {
            this.removeFromTeam(teamId, playerUserName);
            this.addMessage(playerUserName + " has left.");
        },
        joinRed: function() {
            var teamId = this.campaign.redTeam.id;
            this.teamLeader(false);
            this.joinTeam(teamId);
        },

        pickRedFaction: function() {
            var reloader = function() {
                slider.reloadSlider();
                var self = this;
                if (!self.performTeamChangeRed) {
                    debugger;
                    self.performTeamChangeRed = function(event) {
                        var factionId = parseInt(this.dataset.faction);
                        var teamId = self.campaign.redTeam.id;
                        self.setFaction(factionId, teamId);
                    }
                    $('.faction-picker').click(self.performTeamChangeRed);
                }
            }
            if (!this.performTeamChangeRed) {
                $('#factionslist').on('shown.bs.modal', reloader.bind(this));
            }
            $('#factionslist').modal('show');
        },
        setFaction: function(faction, team) {
            MatchMaker.matchMaker.server.requestUpdateFaction(faction, team);
        },
        playerChangedCommander: function(username, commander) {
            commander = JSON.parse(commander);
            var player = this.getPlayer(username);
            var commanderModel = new MatchMaker.models.Commander(commander);
            player.Commander(commanderModel);
            player.Commander.valueHasMutated();
        },
        pickMapFn: undefined,
        pickMap: function() {
            var mapPicker = function() {
                mapSlider.reloadSlider();
                var self = this;
                if (!self.pickMapFn) {
                    debugger;
                    self.pickMapFn = function(event) {
                        var mapId = parseInt(this.dataset.mapid);
                        self.setMap(mapId);
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
        pickCommanderFn: undefined,
        startGameCountdown: function(time) {
            var timeInSeconds = (time / 1000);
            this.clock = setInterval(this.updateCountDown.bind(this, timeInSeconds), 1000);
            alertify.success('Game starting in ' + timeInSeconds);
        },
        gameIsStarting: function (groupId) {
            window.location.href = "/game/play/"+groupId; 
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
            var player = this.getPlayer(playerName);
            player.Ready(true);
            player.valueHasMutated();
        },
        playerIsNotReady:function(playerName) {
            var player = this.getPlayer(playerName);
            player.Ready(false);
            player.valueHasMutated();
        },
        mapHasChanged:function(map) {
            this.campaign.map(map);
            this.addMessage("Admin: map has changed to "+ map.Name);
        }                       ,
        setMap:function(mapId) {
            MatchMaker.matchMaker.server.requestMapChange(mapId);
        }   ,
        renameRed: function (model, e) {
            debugger;
            alert("rename to", e.value);
        },
        joinBlue: function () {
            var teamId = this.campaign.blueTeam.id;
            this.teamLeader(false);
            this.joinTeam(teamId);
        },
        joinSpectators: function () {
            var teamId = this.campaign.spectatingTeam.id;
            this.teamLeader(false);
            this.joinTeam(teamId);   
        },
     
        performTeamChangeBlue:undefined,
        performTeamChangeRed: undefined,
        pickBlueFaction: function () {
             var reloader = function () {
                slider.reloadSlider();
                var self = this;
                if (!self.performTeamChangeBlue) {
                    debugger;
                    self.performTeamChangeBlue = function(event) {
                        var factionId = parseInt(this.dataset.faction);
                        var teamId = self.campaign.blueTeam.id;
                        self.setFaction(factionId, teamId);
                    }
                    $('.faction-picker').click(self.performTeamChangeBlue);
                }
            }
            if (!self.performTeamChangeBlue) {
                $('#factionslist').on('shown.bs.modal', reloader.bind(this));
            }        
            $('#factionslist').modal('show');
        },
        teamChangedFaction: function (teamId, faction) {
            faction = JSON.parse(faction);
            var team = this.getTeam(teamId);
            team.faction.id = faction.Id;
            team.faction.name(faction.Name);
            team.faction.imgUrl(faction.ImgUrl);
            alertify.success(team.name() + " have switched faction to " + faction.Name);

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
        joinTeam: function (teamId) {
            MatchMaker.matchMaker.server.joinTeam(teamId);
        },
        playerChangedTeam: function (currentTeamId, newTeamId, playerName) {
            debugger;
            var changeTeamName = false;
            if (playerName === MatchMaker.playerUsername) {
                changeTeamName = true;
            }
            var player = this.removeFromTeam(currentTeamId, playerName); //find player and remove from current team/list

            var team = this.addToTeam(newTeamId, player, changeTeamName); //find team and add player to that list
            this.addMessage("Admin: " + playerName + " joined " + team.name());
        },
        getTeam:function(teamId) {
            var team = undefined;
            if (this.campaign.blueTeam.id === teamId) {
                team = this.campaign.blueTeam;
            }
            if (this.campaign.redTeam.id === teamId) {
                team = this.campaign.redTeam;
            }
            if (this.campaign.spectatingTeam.id === teamId) {
                team = this.campaign.spectatingTeam;
            }
            return team;
        },
        getPlayer:function(playerName) {
            var player = undefined;
            debugger;
            var blueTeam = this.campaign.blueTeam;
            var redTeam = this.campaign.redTeam;
            var spectators = this.campaign.spectatingTeam;
            var bluePlayerCount = blueTeam.players();
            for (var index = 0; index < bluePlayerCount.length; index++) {
                var bluePlayer = bluePlayerCount[index];
                if (bluePlayer.Username === playerName) {
                    player = bluePlayer;
                }
            }
            if (!player) {
                var redPlayerCount = redTeam.players();
                for (var index = 0; index < redPlayerCount.length; index++) {
                    var redPlayer = redPlayerCount[index];
                    if (redPlayer.Username === playerName) {
                        player = redPlayer;
                    }
                }
            }         
            if (!player) {
                var spectatorCount = spectators.players();
                for (var index = 0; index < spectatorCount.length; index++) {
                    var specPlayer = spectatorCount[index];
                    if (specPlayer.Username === playerName) {
                        player = specPlayer;
                    }
                }
            }
            if (!player) {
                var orphans = this.orphanedPlayers;
                for (var index = 0; index < orphans.length; index++) {
                    var orphanPlayer = orphans[index];
                    if (orphanPlayer.Username === playerName) {
                        player = orphanPlayer;
                    }
                }
            }
            return player;

        },
        removeFromTeam: function (teamId, playerName) {
            var blueTeam = this.campaign.blueTeam;
            var redTeam = this.campaign.redTeam;
            var spectators = this.campaign.spectatingTeam;     
            var playerObject = undefined;

            if (blueTeam.id === teamId) {
                var bluePlayers = blueTeam.players().length;
                for (var i = 0; i < bluePlayers; i++) {
                    var blueTeamPlayer = blueTeam.players()[i];
                    if (blueTeamPlayer.Username === playerName) {
                        playerObject = blueTeam.players().splice(i, 1)[0];
                        blueTeam.players.valueHasMutated();
                        break;
                    }
                }
            } else if (redTeam.id === teamId) {
                var redPlayers = redTeam.players().length;
                for (var i = 0; i < redPlayers; i++) {
                    var redTeamPlayer = redTeam.players()[i];
                    if (redTeamPlayer.Username === playerName) {
                        playerObject = redTeam.players().splice(i, 1)[0];
                        redTeam.players.valueHasMutated();
                        break;
                    }
                }
            } else if (spectators.id === teamId) {
                var specPlayers = spectators.players().length;
                for (var i = 0; i < specPlayers; i++) {

                    var player = spectators.players()[i];
                    if (player.Username === playerName) {
                        playerObject = spectators.players().splice(i, 1)[0];
                        spectators.players.valueHasMutated();
                        break;
                    }
                }
            } else {
                
                //check orphaned players list
                for (var j = 0; j < this.orphanedPlayers.length; j++) {
                    var player = this.orphanedPlayers[j];
                    if (player.Username === playerName) {
                        playerObject = this.orphanedPlayers.splice(j, 1)[0];
                        break;
                    }
                }
            }
            return playerObject;
        },
        addToTeam:function(teamId, player, changeTeamName) {
            var blueTeam = this.campaign.blueTeam;
            var redTeam = this.campaign.redTeam;
            var spectators = this.campaign.spectatingTeam;
            var playerObject = new MatchMaker.models.Player(player);
            if (blueTeam.id === teamId) {
                blueTeam.players.push(playerObject);
                if (changeTeamName) {
                    MatchMaker.viewModel.teamName(blueTeam.name());
                }
                return blueTeam;
            } else if (redTeam.id === teamId) {
                redTeam.players.push(playerObject);
                if (changeTeamName) {
                    MatchMaker.viewModel.teamName(redTeam.name());
                }
                return redTeam;

            } else if (spectators.id === teamId) {
                var spectatingPlayers = spectators.players();
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