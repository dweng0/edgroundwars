using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Configuration;
using EDWars.Models;
using Microsoft.AspNet.SignalR;
using Newtonsoft.Json;

namespace EDWars.Hubs
{
    public class Game : Hub
    {
        public enum PlayerStatus
        {
            online,
            offline
        }

        /// <summary>
        /// Holds information we want to access quickly about a user and pushes it into a Dictionary
        /// </summary>
        public class PlayerObject
        {
            public int Id { get; set; }
            public Team Team { get; set; }
            public Campaign Campaign { get; set; }
            public Player Player { get; set; }
            public string GroupId { get; set; }
            public Game.PlayerStatus Status { get; set; }

            public PlayerObject()
            {
                Status = PlayerStatus.online;
            }
        }

        private UsersContext _db = new UsersContext();

        /// <summary>
        /// Holds our players' player Object model for quick access to stuff so we don't have to do lookups all the time, the trade off is memory usage...
        /// </summary>
        private static Dictionary<string, PlayerObject> PlayingUser = new Dictionary<string, PlayerObject>(); 

        /// <summary>
        /// Holds list of campaigns so we don't have to load from the database everytime we want access to the campaign
        /// </summary>
        private static List<Campaign> _campaigns = new List<Campaign>();

        /// <summary>
        /// Loaded players dictionary, used to determine if campaigns are ready to start loading assets... We don't want assets to start loading until everyone is ready.
        /// </summary>
        private static Dictionary<string, List<string>> LoadedPlayers = new Dictionary<string, List<string>>();

        public override Task OnConnected()
        {
            

            return base.OnConnected();
        }

        /// <summary>
        /// Overrides the onDisconnected function and sets the user object to offline, this can be checked when other players interacts with them...
        /// </summary>
        /// <param name="stopCalled"></param>
        /// <returns></returns>
        public override Task OnDisconnected(bool stopCalled)
        {
            var user = GetUserDictionaryData();
            if (user != null)
            {
                user.Status = PlayerStatus.offline;
                var playerJson = ReturnObjectAsJSON(user.Player);
                Clients.OthersInGroup(user.GroupId).userDisconnected(playerJson);
            }

            return base.OnDisconnected(stopCalled);
        }

        /// <summary>
        /// Registers a player for a campaign, sets up the users' dictionary data and allows the server to scrub erronous clientside data.
        /// </summary>
        /// <param name="campaignId"></param>
        public void RegisterPlayer(int campaignId)
        {  
           var campaign = CheckCampaign(campaignId);

           string groupId = campaign.Id.ToString();
           Groups.Add(Context.ConnectionId, groupId);

           var user = campaign.RedTeam.Players.FirstOrDefault(c => c.Username == Context.User.Identity.Name) ??
                      campaign.BlueTeam.Players.FirstOrDefault(c => c.Username == Context.User.Identity.Name);

           var team = (campaign.RedTeam.Id == user.TeamId) ? campaign.RedTeam : campaign.BlueTeam;

            //check if user already exists (possible reconnect).
            var currentUser = GetUserDictionaryData();
            if (currentUser == null)
            {
                var playingUser = new PlayerObject
                {
                    Campaign = campaign,
                    GroupId = groupId,
                    Player = user,
                    Team = team
                };
                SetUserDictionaryData(playingUser);
            }
          
            //notify everyone user has joined
            Clients.Caller.addPlayerToWorld(team.Id, user.Username, ReturnObjectAsJSON(user), true); //inform the client they have been added
            Clients.OthersInGroup(groupId).addPlayerToWorld(team.Id, user.Username, ReturnObjectAsJSON(user), false); //inform others that this client has been added
        }
        
        /// <summary>
        /// Called by a client to inform the server it has finished connecting to server, the client can then add the user to the loaded players dictionary for that campaign.
        /// If the number of loaded players is equal or greater than the redteam + blueteam player count, we can start the assett loading and eventually... the game.
        /// </summary>
        public void FinishedConnecting()
        {
            var user = GetUserDictionaryData();
            SetPlayerLoaded(user.GroupId, user.Player.Username);
            var loadedPlayers = GetLoadedPlayers(user.GroupId);

            if (loadedPlayers.Count >= (user.Campaign.RedTeam.Players.Count + user.Campaign.BlueTeam.Players.Count))
            {
               Clients.Group(user.GroupId).startGame();
            }
        }

        /// <summary>
        /// Adds another user to the dictionary
        /// </summary>
        /// <param name="playerInfo"></param>
        /// <returns></returns>
        private PlayerObject SetUserDictionaryData(PlayerObject playerInfo)
        {
            PlayingUser[Context.User.Identity.Name] = playerInfo;
            return playerInfo;
        }

        /// <summary>
        /// Wraps the GetUserDataByName function by passing in the context name, useful if you just want to quickly get current callers' dictionary data
        /// </summary>
        /// <returns></returns>
        private PlayerObject GetUserDictionaryData()
        {
            return GetUserDataByName(Context.User.Identity.Name);
        }

        /// <summary>
        /// Adds a user to a dictionary that can be used to check if all players are loaded. creates a list if it does not exist
        /// </summary>
        /// <param name="groupId">The id of the dictionary key to add the player to</param>
        /// <param name="username">The string name of the user that is loaded, usernames are unique</param>
        private void SetPlayerLoaded(string groupId, string username)
        {
            if (!LoadedPlayers.ContainsKey(groupId))
            {
                LoadedPlayers[groupId] = new List<string>();
            }

            var loadedUserList = LoadedPlayers[groupId];
            loadedUserList.Add(username);
            
        }

        /// <summary>
        /// Returns a list of usernames that have informed the server that they are loaded
        /// </summary>
        /// <param name="groupId">the key used to return the correct key</param>
        /// <returns></returns>
        private List<string> GetLoadedPlayers(string groupId)
        {
            var loadedUsersList = (LoadedPlayers.ContainsKey(groupId)) ? LoadedPlayers[groupId] : new List<string>();
            return loadedUsersList;
        }

        /// <summary>
        /// Gets user data for a specific user in a specific campaign, requires the users name
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>
        private PlayerObject GetUserDataByName(string name)
        {
            if (!PlayingUser.ContainsKey(name))
            {
                return null;
            }
            return PlayingUser[name];
        }
        
        /// <summary>
        /// Checks if the campaign exists, if it doesn't requests it from the db, if it can't find it then returns an error.
        /// </summary>
        /// <param name="campaignId"></param>
        /// <returns></returns>
        private Campaign CheckCampaign(int campaignId)
        {
            var campaign =  _campaigns.FirstOrDefault(c => c.Id == campaignId);
            if(!_campaigns.Any())
            {
                campaign =_db.Campaigns.FirstOrDefault(c => c.Id == campaignId);
                if (campaign == null)
                {
                    Clients.Caller.error("Could not connect to game");
                }
            }
            return campaign;
        }

        /// <summary>
        /// To prevent circularreferences, objects are serialized to ignore them and returned as a string here, not all models will require this, but its a good idea to keep consistent and use it.
        /// </summary>
        /// <param name="objectToJson"></param>
        /// <returns></returns>
        private string ReturnObjectAsJSON(object objectToJson)
        {
            var jsonCampaign = JsonConvert.SerializeObject(objectToJson, Formatting.None,
               new JsonSerializerSettings()
               {
                   ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
               });
            return jsonCampaign;
        }

    }
}