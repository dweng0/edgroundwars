using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using EDWars.Models;
using Newtonsoft.Json;

namespace EDWars.Controllers
{
    public class GameController : Controller
    {
        protected readonly UsersContext db = new UsersContext();
        // GET: Game
        public ActionResult Play(int? Id)
        {
            if (Id == null)
            {
                return HttpNotFound();
            }

            var campaign = db.Campaigns.FirstOrDefault(c => c.id == Id);
            return View(campaign);
        }

        public ActionResult Campaign(int? Id)
        {
            if (Id == null)
            {
                return HttpNotFound();
            }


            var campaign = db.Campaigns.FirstOrDefault(c => c.id == Id);

            if (campaign != null)
            {
                var jsonStuff = GetCampaignJson(campaign);
                return Json(jsonStuff, JsonRequestBehavior.AllowGet);
            }
            return new HttpStatusCodeResult(HttpStatusCode.NotFound, "Could not find the campaign!");
        }

        private string GetCampaignJson(Campaign campaign)
        {
           var jsonCampaign = JsonConvert.SerializeObject(campaign, Formatting.None,
           new JsonSerializerSettings()
           {
               ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
           });
            return jsonCampaign;
        }

    }
}