using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace EDWars
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
            routes.MapRoute(
               name: "gameRoutesPlay",
               url: "game/play/{Id}",
               defaults: new { controller = "Game", action = "Play", id = UrlParameter.Optional}
           );
            routes.MapRoute(
                 name: "gameRoutes",
                 url: "game/{objectType}/{objectId}/{resource}/{resourceId}",
                 defaults: new { controller = "Game", action = "Assets", objectType = UrlParameter.Optional, objectId = UrlParameter.Optional, resource = UrlParameter.Optional, resourceId = UrlParameter.Optional}
             );
            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );

        }
    }
}