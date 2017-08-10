using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Entity;
using System.Linq;
using System.Net.Mime;
using System.Runtime.Remoting.Channels;
using System.Timers;
using System.Web.Configuration;
using EDWars.Models;
using Microsoft.Ajax.Utilities;
using Microsoft.AspNet.SignalR;
using Newtonsoft.Json;
using Timer = System.Threading.Timer;

namespace EDWars.Hubs
{
    public class PlayerInfo
    {
        public int Id { get; set; }
        public bool MatchMakingMaster { get; set; }
        public bool TeamLeader { get; set; }
        public bool Ready { get; set; }
        public System.Timers.Timer Time { get; set; }
        public string GroupId { get; set; }
        public Campaign Campaign{ get; set; }
        public Team Team { get; set; }
        public Player Player { get; set; }
    }
    public class MatchMaking : Hub
    {
        private const int StartGameTimer = 15000;
        private static Dictionary<string, PlayerInfo> ConnectedUsers = new Dictionary<string, PlayerInfo>(); 
        private static List<Campaign> _campaigns = new List<Campaign>();
        private static List<Commander> _commanders = new List<Commander>();
        private static List<Map> _map = new List<Map>(); 
        private static List<Faction>  _factions = new List<Faction>();
        private static readonly UsersContext _db = new UsersContext(); //connection to db

        /// <summary>
        /// Returns a stringified version of our campaign business model    
        /// </summary>
        /// <param name="campaignToConvert"></param>
        /// <returns></returns>
        private static string ReturnCampaignJson(Campaign campaignToConvert)
        {
            var jsonCampaign = JsonConvert.SerializeObject(campaignToConvert, Formatting.None,
                new JsonSerializerSettings()
                {
                    ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
                });
            return jsonCampaign;
        }

        public MatchMaking()
        {
            if (!_commanders.Any())
            {
                _commanders = _db.Commanders.ToList();    
            }

            if (!_map.Any())
            {
                _map = _db.Maps.ToList();
            }
        }


    public override System.Threading.Tasks.Task OnConnected()
        {
     
            // Add your own code here.
            // For example: in a chat application, record the association between
            // the current connection ID and user name, and mark the user as online.
            // After the code in this method completes, the client is informed that
            // the connection is established; for example, in a JavaScript client,
            // the start().done callback is executed.
            //check if user is already connected with the same name
            if (!ConnectedUsers.ContainsKey(Context.User.Identity.Name))
            {  
                ConnectedUsers.Add(Context.User.Identity.Name, new PlayerInfo());
            }
            return base.OnConnected();
        }

    public override System.Threading.Tasks.Task OnDisconnected(bool stopCalled)
        {
            //get user data
            var user = GetUserDictionaryData();

        if (user != null)
        {
            //notify others
            Clients.OthersInGroup(user.GroupId).playerLeft(user.Team.id, user.Player.username);
            //remove from campaign team ... no id set so have to find and remove manually
            user.Team.players.Remove(user.Player);

            //transfer leadership if this user is the leader
            if (user.TeamLeader)
            {
                AssignNewTeamLeader(user.Team);
            }

            //transfer matchmaker master if this user is master
            if (user.MatchMakingMaster)
            {
                user.MatchMakingMaster = false;
                AssignNewMaster(user.Campaign);
            }
        }
          
            //remove from connected users dictionary
            ConnectedUsers.Remove(Context.User.Identity.Name); 
    
            return base.OnDisconnected(stopCalled);
        }

    

    public override System.Threading.Tasks.Task OnReconnected()
        {
            // Add your own code here.
            // For example: in a chat application, you might have marked the
            // user as offline after a period of inactivity; in that case 
            // mark the user as online again.
        var test = Context;
            return base.OnReconnected();
        }

        /// <summary>
        /// The initial handshake with the hub, gets the campaign the user is connected to resolves it and sorts out the user object , provides this information back to the end user
        /// </summary>
        /// <param name="campaignId"></param>
        public void HandShake(int campaignId)
        {   
            var campaign = _campaigns.FirstOrDefault(c => c.id == campaignId);
            if (campaign == null)
            {
                //find and add if not
                campaign = _db.Campaigns.FirstOrDefault(c => c.id == campaignId);
                if (campaign == null)
                {
                    Clients.Caller.error("Campaign not found");
                    return;
                }
                if (campaign.Status == Status.InGame)
                {
                    Clients.Caller.gameIsStarting(campaign.id);
                    return;
                }

                if (campaign.Status == Status.Finished)
                {
                    Clients.Caller.error("Game has finished");
                    return;
                }

                //now check and set up factions
                _factions = _db.Factions.Include(c => c.factionAbilities).ToList();
                _campaigns.Add(campaign);
            }
            string groupId = campaign.id.ToString();
            //add user to group with campaign id
            Groups.Add(Context.ConnectionId, groupId);

            //create a player
            var player = new Player();
            player.playerId = Context.User.Identity.Name; //requires that the username is unique then...
            player.username = Context.User.Identity.Name;
            
            //now add a default commander
            player.commander = _commanders.First();

            //set up player info for quick references
            var playerInfo = new PlayerInfo();
            playerInfo.GroupId = groupId;
            playerInfo.Campaign = campaign;
            playerInfo.Player = player;
            playerInfo.Ready = false;

            //what if player already exists, remove
            UpdateAndRemoveExistingUser(playerInfo);
            
            SetUserDictionaryData(playerInfo);
            
            //give user back the campaign object and player object
            string jsonCampaign = ReturnCampaignJson(campaign);

            Clients.Caller.AddCampaign(jsonCampaign, player.username);
            var playerJson = ReturnPlayerString(player);
            Clients.Caller.playerJoined(playerJson, true); //tells the person that they have joined, allows them to set up user specific stuff
            Clients.OthersInGroup(groupId).playerJoined(playerJson); //tells everyone else you joined.

           // var commanderJson = ReturnCommanderString(player.commander);

          //  Clients.Group(groupId).playerChangedCommander(playerInfo.Player.username, commanderJson); //sets up your commander
            joinTeam(campaign.SpectatingTeamId);

            //check if first player to join and set up master
            if (!campaign.redTeam.players.Any() && !campaign.blueTeam.players.Any() &&
                campaign.spectatingTeam.players.Count == 1)
            {
                AssignNewMaster(campaign);
            }
        }

        private void UpdateAndRemoveExistingUser(PlayerInfo playerInfo)
        {
           var player = new Player();

            player = playerInfo.Campaign.redTeam.players.FirstOrDefault(c => c.username == playerInfo.Player.username);

            if (player != null)
            {
                playerInfo.Campaign.redTeam.players.Remove(player);
            }
            else
            {
                  player =
                    playerInfo.Campaign.spectatingTeam.players.FirstOrDefault(
                        c => c.username == playerInfo.Player.username);

                if (player != null)
                {
                    playerInfo.Campaign.spectatingTeam.players.Remove(player);
                }
                else
                {
                     player =
                    playerInfo.Campaign.redTeam.players.FirstOrDefault(
                        c => c.username == playerInfo.Player.username);
                    if (player != null)
                    {
                        playerInfo.Campaign.redTeam.players.Remove(player);
                    }
                }
            }
            if (ConnectedUsers.ContainsKey(playerInfo.Player.username))
            {
                 ConnectedUsers.Remove(playerInfo.Player.username); 
            }
        
        }

        public void playerReady()
        {
            var user = GetUserDictionaryData();
            user.Ready = true;
            Clients.Group(user.GroupId).playerIsReady(user.Player.username);
        }

        public void playerNotReady()
        {
            var user = GetUserDictionaryData();
            user.Ready = false;
            Clients.Group(user.GroupId).playerIsNotReady(user.Player.username);
        }

        public void RequestStartGameCountdown()
        {
            var user = GetUserDictionaryData();
            if (!user.MatchMakingMaster)
            {
                Clients.Caller.error("You cannot start the game, you are tnot the matchmaker!");
                return;
            }
            if (user.Time == null)
            {
                user.Time = GameCountdown(user);
            }
            Clients.Group(user.GroupId).startGameCountdown(StartGameTimer);
        }

        public void ForceStart()
        {
            var user = GetUserDictionaryData();
            if (user.MatchMakingMaster)
            {
                startGame(user);
                Clients.Group(user.GroupId).gameIsStarting(user.GroupId);
            }
        }

        public void AssignNewTeamLeader(Team team)
        {
            if (team.players.Any())
            {
                //get a user
                var user = team.players.First();
                //update this users dictionary
                var newTeamLeaderDict = ConnectedUsers[user.username];
                newTeamLeaderDict.TeamLeader = true;

                //notify the user
                Clients.User(user.username).makeTeamLeader();
            }
        }

        public bool AssignNewMaster(Campaign campaign)
        {   
            var master = new Player();
            if (campaign.blueTeam.players.Any() )
            {
                master = campaign.blueTeam.players.First();
            }
            else if (campaign.redTeam.players.Any())
            {
                master = campaign.redTeam.players.First();
            }
            else if (campaign.spectatingTeam.players.Any())
            {
                master = campaign.spectatingTeam.players.First();
            }
            else
            {
                var thisCampaign = _db.Campaigns.First(c => c.id == campaign.id);

                thisCampaign.Status = Status.Finished;
                _db.Entry(thisCampaign).State = EntityState.Modified;
                _db.SaveChanges();
                _campaigns.Remove(campaign);
                return false;
            }

            var user = GetUserDataByName(master.username);

            if (user == null)
            {
                return false;
            }

            user.MatchMakingMaster = true;
            //if we got this far, we have a new master
            Clients.User(master.username).makeMaster();
            return true;
        }

        public void RequestMapChange(int? mapId)
        {
            if (mapId == null)
            {
                Clients.Caller.error("Could not change map");
                return;
            }
            var user = GetUserDictionaryData();

            if (!user.MatchMakingMaster)
            {
                Clients.Caller.error("Cannot change map, you are not the matchmaker!");
                return;
            }

            var map = _map.FirstOrDefault(c => c.id == mapId);
            if (map == null)
            {
                Clients.Caller.error("Could not find the map you requested");
            }
            //update the campaign object
            user.Campaign.map = map;
            Clients.Group(user.GroupId).mapHasChanged(map);
        }

        public void RequestUpdateFaction(int? factionId, int? teamId)
        {
            if (factionId == null || teamId == null)
            {
                Clients.Caller.error("Could not update the team faction. faction or Team data was not sanitized.");
                return;
            }

            //check the user that made the request
            var user = GetUserDictionaryData();

            if (user.TeamLeader && user.Team.id == teamId.Value)
            {
                //user is teamleader and in the team that requests the change... check faction
                var faction = _factions.FirstOrDefault(c => c.id == factionId.Value);

                if (faction == null)
                {
                    Clients.Caller.error("Could not find a faction with that ID");   
                }

                //now trigger the update
                user.Team.FactionId = faction.id;
                user.Team.faction = faction;
                var factionJson = ReturnFactionString(faction);
                Clients.Group(user.GroupId).teamChangedFaction(user.Team.id, factionJson);
            }
            else
            {
                //will always be called twice, will need to fix this
               // Clients.Caller.error("Could not update the team faction.");
            }
        }

        public void RequestCommander(int commanderId)
        {
            var user = GetUserDictionaryData();
            if (user.Ready)
            {
                Clients.Caller.error("Cannot change commander if you are ready");
                return;
            }

            var commander = _commanders.FirstOrDefault(c => c.Id == commanderId);

            if (commander == null)
            {
                Clients.Caller.error("Could not find the commander you requested");
                return;
            }

            var commanderJson = ReturnCommanderString(commander);

            Clients.Group(user.GroupId).playerChangedCommander(user.Player.username, commanderJson);

        }

        /// <summary>
        /// When invoked allows a user to join a team based on its ID, informs other users and the data is stored on the 
        /// </summary>
        /// <param name="teamId">The id of the team the user wishes to join</param>
        public void joinTeam(int teamId)
        {
            PlayerInfo playerInfo = GetUserDictionaryData();

            //if player has stated he is ready, then exit
            if (playerInfo.Ready)
            {
                Clients.Caller.error("Cannot change team, you are ready!");
                return;
            }

            var newTeam = new Team();
            var movedPlayer = false;
            var currentTeamId = -1;
            if (playerInfo.Team == null)
            {
                 currentTeamId = -1;
            }
            else
            {
                 currentTeamId = playerInfo.Team.id;
            }
            
            //check if you can join the team with this id
            if (playerInfo.Campaign.BlueTeamId == teamId)
            {
                if (playerInfo.Campaign.blueTeam.players.Count >= 8)
                {
                    Clients.Caller.warning("Cannot join team, they already have 8 players");
                    return;
                }
                else
                {
                    if (playerInfo.Team != null && playerInfo.Campaign.BlueTeamId == playerInfo.Team.id)
                    {
                        Clients.Caller.warning("Already on team");
                        return;
                    }
                    else
                    {
                        newTeam = playerInfo.Campaign.blueTeam;
                    }
                }
            }
            else if (playerInfo.Campaign.RedTeamId == teamId)
            {
                if (playerInfo.Campaign.redTeam.players.Count >= 8)
                {
                    Clients.Caller.warning("Cannot join team, they already have 8 players");
                    return;
                }
                else
                {
                    if (playerInfo.Team != null && playerInfo.Campaign.RedTeamId == playerInfo.Team.id)
                    {
                        Clients.Caller.warning("Already on team");
                        return;
                    }
                    else
                    {
                        newTeam = playerInfo.Campaign.redTeam;
                    }
                }
            }
            else
            {
                if (playerInfo.Team != null && playerInfo.Campaign.SpectatingTeamId == playerInfo.Team.id)
                {
                    Clients.Caller.warning("Already on team");
                    return;
                }
                else
                {
                    newTeam = playerInfo.Campaign.spectatingTeam;
                }
            }
            Clients.Group(playerInfo.GroupId).playerChangedTeam(currentTeamId, teamId, playerInfo.Player.username);
            SwitchTeam(playerInfo.Team, newTeam, playerInfo.Player);
            playerInfo.Team = newTeam;
        }

        public void SendMessage(string message)
        {
            var user = GetUserDictionaryData();

            var team = "";
            if (user.Team != null)
            {
                team = "[" + user.Team.name +"]";
            }
            
            Clients.Group(user.GroupId).chatMessage(team +  user.Player.username + ": " + message);
        }

        /// <summary>
        /// Returns a bool that determines whether or not to call AssignNewTeamLeader, if true, then assignnewteamleader should be called
        /// </summary>
        /// <param name="currentTeam"></param>
        /// <param name="newTeam"></param>
        /// <param name="player"></param>
        /// <returns></returns>
        private void SwitchTeam(Team currentTeam, Team newTeam, Player player)
        {
            if (currentTeam != null)
            {
                currentTeam.players.Remove(player);
            }
            newTeam.players.Add(player);
            if (newTeam.players.Count == 1)
            {
                AssignNewTeamLeader(newTeam);
            }
        }

        private PlayerInfo GetUserDictionaryData()
        {   
            return GetUserDataByName(Context.User.Identity.Name);
        }

        private PlayerInfo GetUserDataByName(string name)
        {
            if (!ConnectedUsers.ContainsKey(name))
            {
                return null;
            }
            return ConnectedUsers[name];
        }

        private PlayerInfo SetUserDictionaryData(PlayerInfo playerInfo)
        {
            ConnectedUsers[Context.User.Identity.Name] = playerInfo;
            return playerInfo;
        }

        private static string ReturnFactionString(Faction faction)
        {
            var jsonCampaign = JsonConvert.SerializeObject(faction, Formatting.None,
               new JsonSerializerSettings()
               {
                   ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
               });
            return jsonCampaign;
        }

        private static string ReturnPlayerString(Player player)
        {
            var jsonCampaign = JsonConvert.SerializeObject(player, Formatting.None,
             new JsonSerializerSettings()
             {
                 ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
             });
            return jsonCampaign;
        }

        private static string ReturnCommanderString(Commander commander)
        {
            var jsonCampaign = JsonConvert.SerializeObject(commander, Formatting.None,
           new JsonSerializerSettings()
           {
               ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
           });
            return jsonCampaign;
        }

        private System.Timers.Timer GameCountdown(PlayerInfo user)
        {   
            // Create a timer and set a two second interval.
            var countDown = new System.Timers.Timer();
                countDown.Interval = StartGameTimer;
                countDown.Elapsed += (sender, e) => GameStarted(sender, e, user, countDown);
                countDown.Start();
            return countDown;
        }

        private void GameStarted(object sender, ElapsedEventArgs e, PlayerInfo user, System.Timers.Timer countDown)
        {
            countDown.Stop();
            countDown.Dispose();
            startGame(user);
            Clients.Group(user.GroupId).gameIsStarting(user.GroupId);
         
        }

        private void startGame(PlayerInfo user)
        {
            
            var campaign = _db.Campaigns.FirstOrDefault(c => c.id == user.Campaign.id);
            
            var redTeam = user.Campaign.redTeam;

            var blueTeam = user.Campaign.blueTeam;
            var spectators = user.Campaign.spectatingTeam;

            var map = user.Campaign.map;

            campaign.redTeam = redTeam;
           campaign.blueTeam = blueTeam;
            campaign.spectatingTeam = spectators;
           
            campaign.map = map;
            campaign.Status = Status.InGame;

            _db.Entry(campaign).State = EntityState.Modified;
            _db.Entry(campaign.blueTeam).State = EntityState.Modified;
            _db.Entry(campaign.redTeam).State = EntityState.Modified;
            _db.Entry(campaign.spectatingTeam).State = EntityState.Modified;
            
            _db.SaveChanges();

        }
    }
}