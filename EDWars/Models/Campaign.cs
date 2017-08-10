using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Security.AccessControl;
using System.Web.Configuration;
using Microsoft.Ajax.Utilities;

namespace EDWars.Models
{
    public class Campaign
    { 
        [Key]
        public int id { get; set; }
        public string notes { get; set; }

        public int? mapId { get; set; }

        [ForeignKey("mapId")]
        public virtual Map map { get; set; }

        public int RedTeamId { get; set; }
        [ForeignKey("RedTeamId")]
        public virtual Team redTeam { get; set; }
        public int BlueTeamId { get; set; }
        [ForeignKey("BlueTeamId")]
        public virtual Team blueTeam { get; set; }
        
        public int SpectatingTeamId { get; set; }
        [ForeignKey("SpectatingTeamId")]
        public virtual Team spectatingTeam { get; set; }
        public Status Status { get; set; }
        public int WinningTeamId { get; set; }
        public int MasterId { get; set; } //the person who is the master of this campaign (can change maps ect in matchmaking room)
    }

    public class MapPhysics
    {
        [Key]
        public int id { get; set; }

        [ForeignKey("MapId")]
        public int MapId { get; set; }
        public virtual Map map{ get; set; }

        public int mass { get; set; }
        public int restitution { get; set; }
        public int friction { get; set; }
    }

    public class Map
    {
        [Key]
        public int id { get; set; }
        public string name { get; set; }
        public string imageUrl { get; set; }
        public string description { get; set; }
        public int maxPlayers { get; set; }
        public int timesPicked { get; set; }
        public int width { get; set; }
        public int height { get; set; }
        public int subDivisions { get; set; }
        public string assetUrl { get; set; }
        public virtual MapPhysics physics { get; set; }
        public int redStartingPointX { get; set; }
        public int redStartingPointY { get; set; }
        public int redStartingPointZ { get; set; }
        public int blueStartingPointX { get; set; }
        public int blueStartingPointY { get; set; }
        public int blueStartingPointZ { get; set; }
    }

    public enum Status
    {
        InLobby,
        InGame,
        Finished
    }
    
    public class Team
    {   
        public int id { get; set; }
        public string name { get; set; }
        public virtual List<Player> players { get; set; }
        public int? FactionId { get; set; }

        [ForeignKey("FactionId")]
        public virtual Faction faction { get; set; }
        public Team()
        {
            players = new List<Player>();
            name = "Mostly Harmless Team";
        }
    }

    //Empire, Alliance, or Fed
    public class Faction
    {
        [Key]
        public int id { get; set; }
        public string name { get; set; }
        public string imgUrl { get; set; }
        public virtual List<FactionAbility> factionAbilities { get; set; }
        public int timesPicked { get; set; }
        public int wins { get; set; }
        public int losses { get; set; }
        public string description { get; set; }
        public int winPercentage
        {
            get
            {
                int diff = 0;
                int percentage = 0;
                diff = (wins - losses);
                if (diff > 0)
                {
                    percentage = (diff / wins) * 100;    
                }
                return percentage;
            }
        }

    }


    /// <summary>
    /// The commander class contains all the base stats as well as combat stats and assets for rendering in WEBGL
    /// It has a one to many relatinship with commander abilities, these abilities are then applied on top of stats the user currently has.
    /// </summary>
    public class Commander
    {
        [Key]
        public int id { get; set; }
        public string name { get; set; }
        public string description { get; set; }
        public string imgUrl { get; set; } //for the html badge
        public string assetsUrl { get; set; } //for loading Rendering assets, may need to flesh this
        public int timesPicked { get; set; }
        public int wins { get; set; }
        public int losses { get; set; }

        public int baseHealth { get; set; }
        public int baseShield { get; set; }
        public int basePower { get; set; }
        public double levelUpMultiplier { get; set; } //defines how much base stats multiply by when a commander levels up, can be used in conjunction with the level to perform exponential stat growth
        public int baseSpeed { get; set; }
        public int baseAgility { get; set; }

        public virtual List<CommanderAbility> abilities { get; set; }

        public int level { get; set; } //used in the instance
        public int experiencePoints { get; set; } //used in the instance
    }

    /// <summary>
    /// A commander can have many commander abilities, they can be passive and always on or be something triggered with a cooldown this class inherits from the Ability class
    /// </summary>
     
    public class CommanderAbility : Ability
    {
        [Key]
        public int id { get; set; }
        public int CommanderId { get; set; }
        public virtual Commander Commander { get; set; }
        public int levelAvailable { get; set; }
        public int damageOverTimeTick { get; set; } //the time it takes for the next damage tick to occur
        public int damagePerTick { get; set; } //how much damage does this ability do per tick if any
        public int criticalHitChance { get; set; } //if its a hit, what is the percent chance of a critical hit
        public int stackBuff { get; set; } //If set, the buff will stack, on enemies or on defensively
        public StackDepletesOn stackDepletesOn { get; set; }
    }

    public class Game
    {
        public int Id { get; set; }
        public int XpBase { get; set; }
        public double XpScale { get; set; }
       
    }

    public enum StackDepletesOn
    {
        hit, //every hit removes a stack
        timeout //stack depletes after an amount of time
    }

    public enum Targeting
    {
        singleTarget, //must select a target
        groundArea, //must select a ground area to trigger this on
        dropsFromSelf, //drops on current user location
        passiveOnSelf, //is passively applied to self
        passiveOnTarget, //Is applied passively to a target
        passiveOnArea //Is applied passively to a target area
    }

    public class Ability
    {
        [Key]
        public int Id { get; set; }
        public string name { get; set; }
        public string description { get; set; }

        public string taskBarBadgeUrl { get; set; } //the badge to how in the users taskbar
        public string activeBadgeUrl { get; set; } //the badge to show when the stat is active
        public string AssetUrl { get; set; } //assetts need fleshing out. For example will we need more then just an assets url? what about when its fired, or when the stat is in transit
        

        public bool aggressive { get; set; } //if a stat is aggressive, it is applied to enemies, the stats are then used negatively against them (helps the engine define what to do with this stat)
        public bool defensive { get; set; } //if a stat is defensive, it is applied as a boost to the commander and/or their allies
        public Targeting targeting { get; set; }
        public int areaOfEffectRadius { get; set; } //if set to 0, only effects target
   
            //Should this not be on the commander?
        public int health { get; set; } //put your pips into these
        public int shield { get; set; }
        public int power { get; set; }
        public int pips { get; set; } //the number of pips you have, can be used to multiply the stats above

        public int kineticAttack { get; set; } //the amount of kinetic damage this ability does
        public int plasmaAttack { get; set; } //the amount of plasma damage this ability does

        public int kineticDefense { get; set; }
        public int plasmaDefense { get; set; }

        public int towerDefense { get; set; } //adds to the base defense of a tower
        public int towerAttack { get; set; } //adds to the base attack of a tower

        public int speed { get; set; }
        public int agility { get; set; }
        public int criticalHit { get; set; } //how much this ability improves critical hit
        public int money { get; set; } //how much money is gained on top of normal money amounts
        public int experience { get; set; } //how much experience is gained on top of normal amounts
        public bool stacks { get; set; } //Does this ability stack?
        public int stackLimit { get; set; } //how much can this ability stack by 
        
        public int levelUpMultiplier { get; set; }

        public int coolDownTime { get; set; }
        public int coolDownReducedBy { get; set; }
        public int duration { get; set; } //if 0 always on
        public bool triggersGlobalCoolDown { get; set; }

        public bool isAPercentage { get; set; } //if true use the int as a percentage rather then a number
        public bool isPassive { get; set; } //if set to true, it is always on

    }

    public class FactionAbility : Ability
    {
        [Key]
        public int id { get; set; }

        public int FactionId { get; set; }
        public virtual Faction Faction { get; set; }


    }


    public class Player
    {
        [Key]
        public int id { get; set; }

        public int? CommanderId { get; set;}

        [ForeignKey("CommanderId")]
        public virtual Commander commander { get; set; }
        
        public bool Ready { get; set; }

        public int teamId { get; set; }
        public string username { get; set; }
        public string playerId { get; set; }
        public int x { get; set; }
        public int y { get; set; }
        public int z { get; set; }
    }
}