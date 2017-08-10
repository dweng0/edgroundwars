using EDWars.Models;

namespace EDWars.Migrations
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<EDWars.Models.UsersContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = true;
        }

        protected override void Seed(EDWars.Models.UsersContext context)
        {
            //seed factions
            context.Factions.AddOrUpdate(
                new Faction { Id = 1, ImgUrl = "/images/alliance.png", Losses = 0, Wins = 0, Name = "Alliance", TimesPicked = 0, Description = "[Description about working as a team]" },
                new Faction { Id = 2, ImgUrl = "/images/Federation.png", Losses = 0, Wins = 0, Name = "Federation", TimesPicked = 0, },
                new Faction { Id = 3, ImgUrl = "/images/Empire.png", Losses = 0, Wins = 0, Name = "Empire", TimesPicked = 0, }
                );

            //seed faction abilities
            context.FactionAbilities.AddOrUpdate(
                new FactionAbility { Id = 1, Name = "Mob Mentality", TaskBarBadgeUrl = "/images/graphics/abilities/faction/alliance/mobmentality.png", Aggressive = false, Defensive = true, AreaOfEffect = 3, IsPassive = true, Duration = 0, IsAPercentage = true, CriticalHit = 2, Stacks = true, StackLimit = 4, Targeting = Targeting.passiveOnSelf, FactionId = 1, Description = "Your critical hit chance increases by 2%, this goes up the more allies there are around you" },
                new FactionAbility { Id = 2, Name = "Herd Immunity", TaskBarBadgeUrl = "/images/graphics/abilities/faction/alliance/herdimmunity.png", Aggressive = false, Defensive = true, AreaOfEffect = 3, IsPassive = true, Duration = 0, IsAPercentage = true, KineticDefense = 2, Stacks = true, StackLimit = 4, Targeting = Targeting.passiveOnSelf, FactionId = 1, Description = "Herd immunity affords you 2% increase to base defence, this goes up the more allies there are around you" },
                new FactionAbility { Id = 3, Name = "Imperial Measurements", TaskBarBadgeUrl = "/images/graphics/abilities/faction/empire/measurement.png", Aggressive = false, Defensive = true, AreaOfEffect = 3, IsPassive = true, Duration = 0, IsAPercentage = true, Speed = 2, Stacks = true, StackLimit = 4, Targeting = Targeting.passiveOnSelf, FactionId = 3, Description = "Due to the peculiarities of emperial measurements you are afforded a 2% movement speed increase... Strangely, this increases the more members of the empire are around..." },
                new FactionAbility { Id = 4, Name = "Colonial Expansion", TaskBarBadgeUrl = "/images/graphics/abilities/faction/empire/expansion.png", Aggressive = false, Defensive = true, AreaOfEffect = 3, IsPassive = true, Duration = 0, IsAPercentage = true, TowerAttack = 2, Stacks = true, StackLimit = 4, Targeting = Targeting.passiveOnSelf, FactionId = 3, Description = "Colonising expertise mean that you do 2% more damage to towers. This increases with more members of the empire around" },
                new FactionAbility { Id = 5, Name = "Productive Punishment", TaskBarBadgeUrl = "/images/graphics/abilities/faction/federation/punishment.png", Aggressive = false, Defensive = true, AreaOfEffect = 0, IsPassive = true, Duration = 0, IsAPercentage = true, Experience = 4, Stacks = false, Targeting = Targeting.passiveOnSelf, FactionId = 2, Description = "Always looking for ways to corner the market... Any market, you gain an additional 4% experience killing enemies." },
                new FactionAbility { Id = 6, Name = "Greed", TaskBarBadgeUrl = "/images/graphics/abilities/faction/federation/greed.png", Aggressive = false, Defensive = true, AreaOfEffect = 0, IsPassive = true, Duration = 0, IsAPercentage = true, Money = 2, Stacks = true, Targeting = Targeting.passiveOnSelf, FactionId = 2, Description = "Dishing out punishment should never affect profits, you gain a 2% increase to money gained from kills, this increases with more members around" }
                );

            context.Commanders.AddOrUpdate(
                new Commander
                {
                    Id = 1,
                    AssetsUrl = "r/",
                    Name = "R",
                    Description = "A true commander",
                    BaseAgility = 1,
                    BaseHealth = 20,
                    BasePower = 20,
                    BaseShield = 20,
                    BaseSpeed = 20,
                    ImgUrl = "/Images/graphics/Commanders/r.png",
                    Wins = 0,
                    Losses = 0,
                    TimesPicked = 0,
                    LevelUpMultiplier = 1.2,
                    Level = 1,
                    ExperiencePoints = 0
                },

                new Commander
                {
                    Id = 2,
                    AssetsUrl = "izella/",
                    Name = "Izella",
                    Description = "Needs a swanky description",
                    BaseAgility = 3,
                    BaseHealth = 15,
                    BasePower = 15,
                    BaseSpeed = 25,
                    BaseShield = 25,
                    ImgUrl = "/Images/graphics/commanders/izella.png",
                    Wins = 0,
                    Losses = 0,
                    TimesPicked = 0,
                    LevelUpMultiplier = 1.2,
                    Level = 1,
                    ExperiencePoints = 0
                }


                );
            context.Maps.AddOrUpdate(
                new Map { Id = 1, RedStartingPointX = -30, RedStartingPointY  = 9, RedStartingPointZ = -108,  BlueStartingPointX  = -79, BlueStartingPointY = 13, BlueStartingPointZ = 94, Description = "A planet on the edge of civilized space, packed with enough resources to start the next expedition. Factions have been posturing for control, now they have sent in their best commanders ", ImageUrl = "/images/maps/stargazer.jpg", MaxPlayers = 8, Name = "Star Gazer", TimesPicked = 0, AssetUrl = "stargazer/"},
                new Map { Id = 2, Description = "[COMING SOON] - The sensitive payload on this shipwreck has got all factions scrambling to recover it.", ImageUrl = "/images/maps/shipwreck.png", MaxPlayers = 8, Name = "Shipwreck", TimesPicked = 0 }
                );

            context.CommanderAbilities.AddOrUpdate(
                new CommanderAbility { Id = 1, LevelAvailable = 1, CoolDownTime = 7000, Name = "Stomp", CommanderId = 1, Aggressive = true, KineticAttack = 25, AreaOfEffect = 3, TaskBarBadgeUrl = "/images/graphics/abilities/commander/stomp.png", Description = "Sends out a shock wave damaging enemies around you" },
                new CommanderAbility { Id = 2, LevelAvailable = 3, CoolDownTime = 5000, Name = "Slug Strike", CommanderId = 1, Aggressive = true, KineticAttack = 62, AreaOfEffect = 0, TaskBarBadgeUrl = "/images/graphics/abilities/commander/slugstrike.png", Description = "Powerful slug shot" },
                new CommanderAbility { Id = 3, LevelAvailable = 4, CoolDownTime = 2500, Name = "Mine Toss", CommanderId = 1, Aggressive = true, KineticAttack = 32, AreaOfEffect = 3, TaskBarBadgeUrl = "/images/graphics/abilities/commander/minetoss.png", Description = "Throw mines into the surrounding area, blowing up on contact with the ground." },
                new CommanderAbility { Id = 4, LevelAvailable = 2, CoolDownTime = 13000, Duration = 5000, Name = "Emp", CommanderId = 1, Aggressive = true, IsAPercentage = true, CriticalHit = 7, AreaOfEffect = 3, TaskBarBadgeUrl = "/images/graphics/abilities/commander/emp.png", Description = "Release an emp into a crowded area, increasing enemy vulnerability" },
                new CommanderAbility { Id = 5, LevelAvailable = 5, CoolDownTime = 120000, Name = "Silent Running", CommanderId = 1, Defensive = true, IsAPercentage = true, CriticalHit = 10, AreaOfEffect = 3, TaskBarBadgeUrl = "/images/graphics/abilities/commander/silentrunning.png", Description = "Enter silent running mode, reducing critical strikes against." },
                new CommanderAbility { Id = 6, LevelAvailable = 8, CoolDownTime = 240000, Name = "Blockbuster", CommanderId = 1, Aggressive = true, KineticAttack = 70, PlasmaAttack = 30, AreaOfEffect = 5, TaskBarBadgeUrl = "/images/graphics/abilities/commander/blockbuster.png", Description = "Call in a blockbuster strike on an enemy position for devistating effects" },

                new CommanderAbility { Id = 7, LevelAvailable = 1, CoolDownTime = 5000, Name = "Assassinate", CommanderId = 2, Aggressive = true, KineticAttack = 27, CriticalHitChance = 25, AreaOfEffect = 0, TaskBarBadgeUrl = "/images/graphics/abilities/commander/assassinate.png", Description = "Strikes your opponent with a decisive blow, has a 25% chance to critically hit" },
                new CommanderAbility { Id = 8, LevelAvailable = 2, CoolDownTime = 7000, Name = "Glare", CommanderId = 2, Duration = 3000, Aggressive = true, IsAPercentage = true, KineticDefense = 50, AreaOfEffect = 3, TaskBarBadgeUrl = "/images/graphics/abilities/commander/glare.png", Description = "Glare at your opponents lowering their defence by 50% for 3 seconds." },
                new CommanderAbility { Id = 9, LevelAvailable = 3, CoolDownTime = 2000, Name = "Cluster Volley", CommanderId = 2, Aggressive = true, KineticAttack = 25, AreaOfEffect = 3, TaskBarBadgeUrl = "/images/graphics/abilities/commander/clustervolley.png", Description = "Disperse a volley of cluster bombs at your opponent, all enemies in the vicinity." },
                new CommanderAbility { Id = 10, LevelAvailable = 4, Targeting = Targeting.passiveOnSelf, IsPassive = true, Name = "Suspicion", CommanderId = 2, Aggressive = true, IsAPercentage = true, CriticalHit = 8, AreaOfEffect = 5, TaskBarBadgeUrl = "/images/graphics/abilities/commander/suspicion.png", Description = "Wherever you go you arouse suspicion amongst your enemies, increasing the chance they can be critically hit by 8%" },
                new CommanderAbility { Id = 11, LevelAvailable = 5, StackBuff = 3, StackDepletesOn = StackDepletesOn.hit, Targeting = Targeting.passiveOnSelf, Duration = 13000, CoolDownTime = 60000, Name = "Echo Shield", CommanderId = 2, Defensive = true, KineticDefense = 100, IsAPercentage = true, AreaOfEffect = 0, TaskBarBadgeUrl = "/images/graphics/abilities/commander/echoshield.png", Description = "Powers up a defensive shield that absorbs three damaging attacks" },
                new CommanderAbility { Id = 12, LevelAvailable = 8, CoolDownTime = 240000, Name = "Missile Swarm", CommanderId = 2, Aggressive = true, KineticAttack = 110, PlasmaAttack = 10, AreaOfEffect = 2, TaskBarBadgeUrl = "/images/graphics/abilities/commander/missileswarm.png", Description = "Releases a swarm of missiles onto a target and the immediate surrounding area" }
                );

            context.Game.AddOrUpdate(
                new Game()
                {
                    Id = 1,
                    XpBase = 100,
                    XpScale = 1.1
                }
                );



            // commnder.experience algorithm example
            //http://gamedev.stackexchange.com/questions/974/how-to-determine-the-amount-of-experience-needed-for-leveling-up?rq=1
            // xpNumber = (game.expBase * commander.currentLevel) 
            // var xpRequired = pow((double), xpNumber, game.XpScale)
        }
    }
}
