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
        public int Id { get; set; }
        public string Notes { get; set; }

        public int? MapId { get; set; }

        [ForeignKey("MapId")]
        public virtual Map Map { get; set; }

        public int RedTeamId { get; set; }
        [ForeignKey("RedTeamId")]
        public virtual Team RedTeam { get; set; }
        public int BlueTeamId { get; set; }
        [ForeignKey("BlueTeamId")]
        public virtual Team BlueTeam { get; set; }
        
        public int SpectatingTeamId { get; set; }
        [ForeignKey("SpectatingTeamId")]
        public virtual Team SpectatingTeam { get; set; }
        public Status Status { get; set; }
        public int WinningTeamId { get; set; }
        public int MasterId { get; set; } //the person who is the master of this campaign (can change maps ect in matchmaking room)
    }

    public class Map
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string ImageUrl { get; set; }
        public string Description { get; set; }
        public int MaxPlayers { get; set; }
        public int TimesPicked { get; set; }
        public string AssetUrl { get; set; }
        public int RedStartingPointX { get; set; }
        public int RedStartingPointY { get; set; }
        public int RedStartingPointZ { get; set; }
        public int BlueStartingPointX { get; set; }
        public int BlueStartingPointY { get; set; }
        public int BlueStartingPointZ { get; set; }
    }

    public enum Status
    {
        InLobby,
        InGame,
        Finished
    }

    public enum TeamSide
    {
        red,
        blue,
        spectator
    }

    public class Team
    {   
        public int Id { get; set; }
        public TeamSide Side { get; set; }
        public string Name { get; set; }
        public virtual List<Player> Players { get; set; }
        public int? FactionId { get; set; }

        [ForeignKey("FactionId")]
        public virtual Faction Faction { get; set; }
        public Team()
        {
            Players = new List<Player>();
            Name = "Mostly Harmless Team";
        }
    }

    //Empire, Alliance, or Fed
    public class Faction
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string ImgUrl { get; set; }
        public virtual List<FactionAbility> FactionAbilities { get; set; }
        public int TimesPicked { get; set; }
        public int Wins { get; set; }
        public int Losses { get; set; }
        public string Description { get; set; }
        public int WinPercentage
        {
            get
            {
                int diff = 0;
                int percentage = 0;
                diff = (Wins - Losses);
                if (diff > 0)
                {
                    percentage = (diff / Wins) * 100;    
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
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string ImgUrl { get; set; } //for the html badge
        public string AssetsUrl { get; set; } //for loading Rendering assets, may need to flesh this
        public int TimesPicked { get; set; }
        public int Wins { get; set; }
        public int Losses { get; set; }

        public int BaseHealth { get; set; }
        public int BaseShield { get; set; }
        public int BasePower { get; set; }
        public double LevelUpMultiplier { get; set; } //defines how much base stats multiply by when a commander levels up, can be used in conjunction with the level to perform exponential stat growth
        public int BaseSpeed { get; set; }
        public int BaseAgility { get; set; }

        public virtual List<CommanderAbility> CommanderAbilities { get; set; }

        public int Level { get; set; } //used in the instance
        public int ExperiencePoints { get; set; } //used in the instance
    }

    /// <summary>
    /// A commander can have many commander abilities, they can be passive and always on or be something triggered with a cooldown this class inherits from the Ability class
    /// </summary>
     
    public class CommanderAbility : Ability
    {
        public int Id { get; set; }
        public int CommanderId { get; set; }
        public virtual Commander Commander { get; set; }
        public int LevelAvailable { get; set; }
        public int DamageOverTimeTick { get; set; } //the time it takes for the next damage tick to occur
        public int DamagePerTick { get; set; } //how much damage does this ability do per tick if any
        public int CriticalHitChance { get; set; } //if its a hit, what is the percent chance of a critical hit
        public int StackBuff { get; set; } //If set, the buff will stack, on enemies or on defensively
        public StackDepletesOn StackDepletesOn { get; set; }
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
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }

        public string TaskBarBadgeUrl { get; set; } //the badge to how in the users taskbar
        public string ActiveBadgeUrl { get; set; } //the badge to show when the stat is active
        public string AssetUrl { get; set; } //assetts need fleshing out. For example will we need more then just an assets url? what about when its fired, or when the stat is in transit
        

        public bool Aggressive { get; set; } //if a stat is aggressive, it is applied to enemies, the stats are then used negatively against them (helps the engine define what to do with this stat)
        public bool Defensive { get; set; } //if a stat is defensive, it is applied as a boost to the commander and/or their allies
        public Targeting Targeting { get; set; }
        public int AreaOfEffect { get; set; } //if set to 0, only effects target
   
        public int Health { get; set; } //put your pips into these
        public int Shield { get; set; }
        public int Power { get; set; }
        public int Pips { get; set; } //the number of pips you have, can be used to multiply the stats above

        public int KineticAttack { get; set; } //the amount of kinetic damage this ability does
        public int PlasmaAttack { get; set; } //the amount of plasma damage this ability does

        public int KineticDefense { get; set; }
        public int PlasmaDefense { get; set; }

        public int TowerDefense { get; set; } //adds to the base defense of a tower
        public int TowerAttack { get; set; } //adds to the base attack of a tower

        public int Speed { get; set; }
        public int Agility { get; set; }
        public int CriticalHit { get; set; } //how much this ability improves critical hit
        public int Money { get; set; } //how much money is gained on top of normal money amounts
        public int Experience { get; set; } //how much experience is gained on top of normal amounts
        public bool Stacks { get; set; } //Does this ability stack?
        public int StackLimit { get; set; } //how much can this ability stack by
        
        public int LevelUpMultiplier { get; set; }

        public int CoolDownTime { get; set; }
        public int CoolDownReducedBy { get; set; }
        public int Duration { get; set; } //if 0 always on
        public bool TriggersGlobalCoolDown { get; set; }

        public bool IsAPercentage { get; set; } //if true use the int as a percentage rather then a number
        public bool IsPassive { get; set; } //if set to true, it is always on

    }

    public class FactionAbility : Ability
    {
        public int Id { get; set; }

        public int FactionId { get; set; }
        public virtual Faction Faction { get; set; }


    }


    public class Player
    {
        public int Id { get; set; }

        public int? CommanderId { get; set;}

        [ForeignKey("CommanderId")]
        public virtual Commander Commander { get; set; }

        public int  TeamId { get; set; }

        public bool Ready { get; set; }
        public string Username { get; set; }
        public string PlayerId { get; set; }
        public int X { get; set; }
        public int Y { get; set; }
    }
}