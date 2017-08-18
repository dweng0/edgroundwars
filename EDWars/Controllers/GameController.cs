using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Configuration;
using System.Web.Mvc;
using EDWars.Models;
using Microsoft.Ajax.Utilities;
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

        public ActionResult Assets(string objectType, string objectId, string resource, string resourceId)
        {
            Response.Headers.Add("Content-type", "application/json");

            switch (objectType.ToLower())
            {
                case "map":
                {
                    return MapPath(objectId, resource, resourceId);
                }
                case "characters":
                {
                    return CharacterPath(objectId, resource, resourceId);
                }
                case "manifest":
                {
                    var worldPhysics = new WorldPhysics();
                    worldPhysics.gravityVector = new GravityVector();
                    worldPhysics.gravityVector.x = 0;
                    worldPhysics.gravityVector.y = 20;
                    worldPhysics.gravityVector.z = 0;

                    var manifest = new UrlManifest();
                    manifest.baseUrl = "/game";
                    manifest.world = worldPhysics;
                    manifest.map.baseUrl = "/stargazer";
                    manifest.map.texture = "/ground.jpg";
                    manifest.map.skyBox = "/skybox";
                    manifest.map.heightMap = "/heightmap";
                    manifest.map.physics.friction = 0.5;
                    manifest.map.physics.mass = 0;
                    manifest.map.physics.restitution = 0.8;
                    manifest.playerUsername = this.User.Identity.Name;

                    //todo fetch from a manifest db

                    return Json(manifest, JsonRequestBehavior.AllowGet);
                }
                case "campaign":
                {
                    var IdAsInt = Convert.ToInt32(objectId);
                    return Json(db.Campaigns.Find(IdAsInt), JsonRequestBehavior.AllowGet);
                }
            }
            
            return HttpNotFound();
        }

        private ActionResult MapPath(string mapName, string resource, string resourceId)
        {
            mapName = mapName.ToLower();
            var map = db.Maps.FirstOrDefault(c => c.name.ToLower() == mapName);

            if (map != null && !resource.IsNullOrWhiteSpace())
            {
                var dir = Server.MapPath("/assets/maps/"+map.name);
                switch (resource.ToLower())
                {
                    case "skybox" :
                    {
                        var path = dir + "/skybox/" + resourceId; //validate the path for security or use other means to generate the path.
                        return File(path, "image/jpeg");
                    }
                    case "texture":
                    {
                        var path = dir + "/" + resourceId; //validate the path for security or use other means to generate the path.
                        return File(path, "image/jpeg");
                    }
                   
                }

                
            }

            return HttpNotFound();
        }

        private ActionResult CharacterPath(string characterName, string resource, string resourceId)
        {
            characterName = characterName.ToLower();
            var character = db.Commanders.FirstOrDefault(c => c.name.ToLower() == characterName);
            
            if (character != null && !resource.IsNullOrWhiteSpace())
            {
                var dir = Server.MapPath("/assets/commanders/" + character.name);
                switch (resource.ToLower())
                {
                    case "manifest":
                        {
                            return Json(db.CharacterDatas.Find(character.Id), JsonRequestBehavior.AllowGet);
                        }
                    case "meshes":
                    {
                        //ignore the manifest
                        var dotSeperated = resourceId.Split('.').Last();
                        if (dotSeperated == "manifest")
                        {
                            return HttpNotFound();
                        }

                        var path = dir + "/meshes/" + resourceId; //validate the path for security or use other means to generate the path.
                        return File(path, "application/babylon");
                    }
                    case "texture":
                    {
                        var path = dir + "/textures/" + resourceId; //validate the path for security or use other means to generate the path.
                        return File(path, "image/jpeg");
                    }
                }
            }
            return Json(character, JsonRequestBehavior.AllowGet);
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