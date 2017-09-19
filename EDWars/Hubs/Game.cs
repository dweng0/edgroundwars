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
        #region Game Data
        private UsersContext _db = new UsersContext();
        private static List<Campaign> localCampaigns = new List<Campaign>(); 
        #endregion

        #region connection events

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
           
            return base.OnDisconnected(stopCalled);
        }

        #endregion

        #region Handshaking

        /// <summary>
        /// Registers a player for a campaign, sets up the users' dictionary data and allows the server to scrub erronous clientside data.
        /// </summary>
        /// <param name="campaignId"></param>
        public void RegisterPlayer(int campaignId)
        {

            //get the campaign
            var campaign = GetCampaign(campaignId);

            //get user 
            var user = GetPlayerFromCampaign(campaign, Context.User.Identity.Name);

            //get team
            var team = (campaign.redTeam.id == user.teamId) ? campaign.redTeam : campaign.blueTeam;

            //then add the user to the signal campaign group
            string groupId = campaign.id.ToString();
            Groups.Add(Context.ConnectionId, groupId);

        }

        /// <summary>
        /// Given a campaign object and a user name, find the user.
        /// </summary>
        /// <param name="campaign"></param>
        /// <param name="name"></param>
        /// <returns></returns>
        private Player GetPlayerFromCampaign(Campaign campaign, string name)
        {
            return campaign.redTeam.players.FirstOrDefault(c => c.username == Context.User.Identity.Name) ??
                       campaign.blueTeam.players.FirstOrDefault(c => c.username == Context.User.Identity.Name);
        }

        /// <summary>
        /// Given a campaign Id, find the campaign stored locally, if not, fetch from DB
        /// </summary>
        /// <param name="campaignId"></param>
        /// <returns></returns>
        private Campaign GetCampaign(int campaignId)
        {
            var result = localCampaigns.FirstOrDefault(c => c.id == campaignId);
            if (result == null)
            {
                result = _db.Campaigns.FirstOrDefault(c => c.id == campaignId);

                if (result != null)
                {
                    localCampaigns.Add(result);
                }
            }
            return result;
        }



        #endregion

    }
}