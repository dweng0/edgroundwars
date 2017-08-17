
using System;
using Microsoft.Owin.Security.DataHandler.Encoder;

namespace EDWars.Models
{

    public class MapManifest
    {
        public MapManifest()
        {
            physics = new MapPhysics();
        }

        public int Id { get; set; }
        public string  baseUrl { get; set; }
        public string texture { get; set; }
        public string heightMap { get; set; }
        public string skyBox { get; set; }
        public MapPhysics physics { get; set; }
    }

    public class GravityVector
    {
        public int Id { get; set; }
        public int x { get; set; }
        public int y { get; set; }
        public int z { get; set; }
    }
    public class WorldPhysics
    {
        public int Id { get; set; }
        public GravityVector gravityVector { get; set; }
    }

    public class UrlManifest
    {
        public UrlManifest()
        {
            this.map = new MapManifest();
            this.world = new WorldPhysics();
        }

        public int Id { get; set; }
        public string playerUsername { get; set; }
        public string baseUrl { get; set; }
        public string handshake { get; set; }
        public WorldPhysics world { get; set; }
        public MapManifest map { get; set; }

    }
}

