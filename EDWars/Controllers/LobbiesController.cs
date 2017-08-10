using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using System.Web.UI;
using EDWars.Hubs;
using EDWars.Models;
using WebMatrix.WebData;

namespace EDWars.Controllers
{
    public class LobbiesController : Controller
    {
        protected readonly UsersContext db = new UsersContext();
        public ActionResult Index()
        {
            return View();
        }

        [Authorize]
        public ActionResult Create()
        {
            var campaign = new Campaign();
            return View(campaign);
        }

        public ActionResult AvailableMapsPartial()
        {
            var maps = db.Maps.ToList();
            return PartialView(maps);
        }

        public ActionResult AvailableCommanders()
        {
            var commanders = db.Commanders.ToList();
            return PartialView(commanders);
        }

        public ActionResult FactionsPartial()
        {
            var factions = db.Factions.ToList();
            return PartialView(factions);
        }
    

        [HttpPost]
        [ValidateAntiForgeryToken]
        [Authorize]
        public ActionResult Create(Campaign campaign)
        {
            if (ModelState.IsValid)
            {
                var map = db.Maps.FirstOrDefault(c => c.id == campaign.mapId.Value);
                if (map == null)
                {
                    return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
                }
                var Factions = db.Factions.ToList();
                campaign.map = map;
                campaign.blueTeam = new Team();
                campaign.blueTeam.faction = Factions.FirstOrDefault(c => c.name == "Alliance");
                campaign.blueTeam.name = "Blue Team";
                campaign.redTeam = new Team();
                campaign.redTeam.faction = Factions.FirstOrDefault(c => c.name == "Federation");
                campaign.redTeam.name = "Red Team";
                campaign.spectatingTeam = new Team();
                campaign.spectatingTeam.name = "Spectators";

                db.Campaigns.Add(campaign);
                db.SaveChanges();
            }
            else
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            LobbyChat.Static_Update_Campaigns(campaign);
            return RedirectToAction("MatchMaking", new{Id =campaign.id});
        }

        [Authorize]
        public ActionResult MatchMaking(int? Id)
        {
            if (Id == null)
            {
                return HttpNotFound();
            }

            var campaign = db.Campaigns.FirstOrDefault(c => c.id == Id);

            if (campaign == null)
            {
                return HttpNotFound();
            }

            return View(campaign);

        }

        public ActionResult CreateCampaignPartial()
        {
            return PartialView();
        }
    }
}
