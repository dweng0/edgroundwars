using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;

using System.Threading.Tasks;
using System.Timers;
using System.Web.Services.Description;
using EDWars.Helpers;
using EDWars.Models;
using Microsoft.AspNet.SignalR;
using Newtonsoft.Json;

namespace EDWars.Hubs
{
    public class LobbyChat : Hub
    {
        private const int TIMEOUT = 10000;
        private static IHubContext hubContext = GlobalHost.ConnectionManager.GetHubContext<LobbyChat>();

        private int users = 0;
        private IDisposable timer; //holds the set interval
        private readonly UsersContext db = new UsersContext(); //connection to db
        private List<Campaign> _campaigns = new List<Campaign>();

        // Call this from C#: LobbyChat.Static_Update_Campaigns(content)
        public static void Static_Update_Campaigns(Campaign campaign)
        {
            var jsonCampaign = JsonConvert.SerializeObject(campaign, Formatting.None,
                new JsonSerializerSettings()
                {
                    ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
                });

            hubContext.Clients.All.addLobby(jsonCampaign);
        }

        public static string ReturnCampaignJson(Campaign campaignToConvert)
        {
             var jsonCampaign = JsonConvert.SerializeObject(campaignToConvert, Formatting.None,
                new JsonSerializerSettings()
                {
                    ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
                });
            return jsonCampaign;
        }

        public static string ReturnCampaignsJson(List<Campaign> campaignsToConvert)
        {
            var jsonCampaigns = JsonConvert.SerializeObject(campaignsToConvert, Formatting.None,
               new JsonSerializerSettings()
               {
                   ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
               });
            return jsonCampaigns;
        }


        public override Task OnConnected()
        {
            if (users == 0)
            {
                timer = Timeout.SetInterval(SetCampaigns, TIMEOUT); //start interval if users are here
            }
            users++;
            
            return base.OnConnected();
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            if (stopCalled)
            {
                users--;
            }
            else
            {
                users--;
            }
            //if (users <= 0)
            //{
            //    timer.Dispose(); //stop interval if no users are here
            //}
            return base.OnDisconnected(stopCalled);
        }
        
        public LobbyChat()
        {
           _campaigns = GetCampaigns();
        }

        private List<Campaign> GetCampaigns()
        {
            return db.Campaigns.Where(c => c.Status == Status.InLobby || c.Status == Status.InGame).Include(c => c.Map).ToList();
        }

        public void SendMessage(string message)
        {
            var user = "anon";
            if (Context.User.Identity.IsAuthenticated)
            {
                user = Context.User.Identity.Name;
            }

            Clients.All.chatMessage(user + ": " + message);
        }

        private void SetCampaigns()
        {
            _campaigns = GetCampaigns();
        }

        public void ReturnLobbies()
        { //hav eto do json here
            var campaigns = ReturnCampaignsJson(_campaigns);
            Clients.Caller.addLobbies(campaigns);
        }
    }
}