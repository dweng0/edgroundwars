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
                new Faction { id = 1, imgUrl = "/images/alliance.png", losses = 0, wins = 0, name = "Alliance", timesPicked = 0, description = "[description about working as a team]" },
                new Faction { id = 2, imgUrl = "/images/Federation.png", losses = 0, wins = 0, name = "Federation", timesPicked = 0, },
                new Faction { id = 3, imgUrl = "/images/Empire.png", losses = 0, wins = 0, name = "Empire", timesPicked = 0, }
                );

            //seed faction abilities
            context.FactionAbilities.AddOrUpdate(
                new FactionAbility { id = 1, name = "Mob Mentality", taskBarBadgeUrl = "/images/graphics/abilities/faction/alliance/mobmentality.png", aggressive = false, defensive = true, areaOfEffectRadius = 3, isPassive = true, duration = 0, isAPercentage = true, criticalHit = 2, stacks = true, stackLimit = 4, targeting = Targeting.passiveOnSelf, FactionId = 1, description = "Your critical hit chance increases by 2%, this goes up the more allies there are around you" },
                new FactionAbility { id = 2, name = "Herd Immunity", taskBarBadgeUrl = "/images/graphics/abilities/faction/alliance/herdimmunity.png", aggressive = false, defensive = true, areaOfEffectRadius = 3, isPassive = true, duration = 0, isAPercentage = true, kineticDefense = 2, stacks = true, stackLimit = 4, targeting = Targeting.passiveOnSelf, FactionId = 1, description = "Herd immunity affords you 2% increase to base defence, this goes up the more allies there are around you" },
                new FactionAbility { id = 3, name = "Imperial Measurements", taskBarBadgeUrl = "/images/graphics/abilities/faction/empire/measurement.png", aggressive = false, defensive = true, areaOfEffectRadius = 3, isPassive = true, duration = 0, isAPercentage = true, speed = 2, stacks = true, stackLimit = 4, targeting = Targeting.passiveOnSelf, FactionId = 3, description = "Due to the peculiarities of emperial measurements you are afforded a 2% movement speed increase... Strangely, this increases the more members of the empire are around..." },
                new FactionAbility { id = 4, name = "Colonial Expansion", taskBarBadgeUrl = "/images/graphics/abilities/faction/empire/expansion.png", aggressive = false, defensive = true, areaOfEffectRadius = 3, isPassive = true, duration = 0, isAPercentage = true, towerAttack = 2, stacks = true, stackLimit = 4, targeting = Targeting.passiveOnSelf, FactionId = 3, description = "Colonising expertise mean that you do 2% more damage to towers. This increases with more members of the empire around" },
                new FactionAbility { id = 5, name = "Productive Punishment", taskBarBadgeUrl = "/images/graphics/abilities/faction/federation/punishment.png", aggressive = false, defensive = true, areaOfEffectRadius = 0, isPassive = true, duration = 0, isAPercentage = true, experience = 4, stacks = false, targeting = Targeting.passiveOnSelf, FactionId = 2, description = "Always looking for ways to corner the market... Any market, you gain an additional 4% experience killing enemies." },
                new FactionAbility { id = 6, name = "Greed", taskBarBadgeUrl = "/images/graphics/abilities/faction/federation/greed.png", aggressive = false, defensive = true, areaOfEffectRadius = 0, isPassive = true, duration = 0, isAPercentage = true, money = 2, stacks = true, targeting = Targeting.passiveOnSelf, FactionId = 2, description = "Dishing out punishment should never affect profits, you gain a 2% increase to money gained from kills, this increases with more members around" }
                );

            context.Commanders.AddOrUpdate(
                new Commander
                {
                    id = 1,
                    assetsUrl = "r/",
                    name = "R",
                    description = "A true commander",
                    baseAgility = 1,
                    baseHealth = 20,
                    basePower = 20,
                    baseShield = 20,
                    baseSpeed = 20,
                    imgUrl = "/Images/graphics/Commanders/r.png",
                    wins = 0,
                    losses = 0,
                    timesPicked = 0,
                    levelUpMultiplier = 1.2,
                    level = 1,
                    experiencePoints = 0
                },

                new Commander
                {
                    id = 2,
                    assetsUrl = "izella/",
                    name = "Izella",
                    description = "Needs a swanky description",
                    baseAgility = 3,
                    baseHealth = 15,
                    basePower = 15,
                    baseSpeed = 25,
                    baseShield = 25,
                    imgUrl = "/Images/graphics/commanders/izella.png",
                    wins = 0,
                    losses = 0,
                    timesPicked = 0,
                    levelUpMultiplier = 1.2,
                    level = 1,
                    experiencePoints = 0
                }


                );
            context.Maps.AddOrUpdate(
                new Map { id = 1, redStartingPointX = -30, redStartingPointY  = 9, redStartingPointZ = -108,  blueStartingPointX  = -79, blueStartingPointY = 13, blueStartingPointZ = 94, description = "A planet on the edge of civilized space, packed with enough resources to start the next expedition. Factions have been posturing for control, now they have sent in their best commanders ", imageUrl = "/images/maps/stargazer.jpg", maxPlayers = 8, name = "Star Gazer", timesPicked = 0, assetUrl = "stargazer/"},
                new Map { id = 2, description = "[COMING SOON] - The sensitive payload on this shipwreck has got all factions scrambling to recover it.", imageUrl = "/images/maps/shipwreck.png", maxPlayers = 8, name = "Shipwreck", timesPicked = 0 }
                );

            context.CommanderAbilities.AddOrUpdate(
                new CommanderAbility { id = 1, levelAvailable = 1, coolDownTime = 7000, name = "Stomp", CommanderId = 1, aggressive = true, kineticAttack = 25, areaOfEffectRadius = 3, taskBarBadgeUrl = "/images/graphics/abilities/commander/stomp.png", description = "Sends out a shock wave damaging enemies around you" },
                new CommanderAbility { id = 2, levelAvailable = 3, coolDownTime = 5000, name = "Slug Strike", CommanderId = 1, aggressive = true, kineticAttack = 62, areaOfEffectRadius = 0, taskBarBadgeUrl = "/images/graphics/abilities/commander/slugstrike.png", description = "Powerful slug shot" },
                new CommanderAbility { id = 3, levelAvailable = 4, coolDownTime = 2500, name = "Mine Toss", CommanderId = 1, aggressive = true, kineticAttack = 32, areaOfEffectRadius = 3, taskBarBadgeUrl = "/images/graphics/abilities/commander/minetoss.png", description = "Throw mines into the surrounding area, blowing up on contact with the ground." },
                new CommanderAbility { id = 4, levelAvailable = 2, coolDownTime = 13000, duration = 5000, name = "Emp", CommanderId = 1, aggressive = true, isAPercentage = true, criticalHit = 7, areaOfEffectRadius = 3, taskBarBadgeUrl = "/images/graphics/abilities/commander/emp.png", description = "Release an emp into a crowded area, increasing enemy vulnerability" },
                new CommanderAbility { id = 5, levelAvailable = 5, coolDownTime = 120000, name = "Silent Running", CommanderId = 1, defensive = true, isAPercentage = true, criticalHit = 10, areaOfEffectRadius = 3, taskBarBadgeUrl = "/images/graphics/abilities/commander/silentrunning.png", description = "Enter silent running mode, reducing critical strikes against." },
                new CommanderAbility { id = 6, levelAvailable = 8, coolDownTime = 240000, name = "Blockbuster", CommanderId = 1, aggressive = true, kineticAttack = 70, plasmaAttack = 30, areaOfEffectRadius = 5, taskBarBadgeUrl = "/images/graphics/abilities/commander/blockbuster.png", description = "Call in a blockbuster strike on an enemy position for devistating effects" },

                new CommanderAbility { id = 7, levelAvailable = 1, coolDownTime = 5000, name = "Assassinate", CommanderId = 2, aggressive = true, kineticAttack = 27, criticalHitChance = 25, areaOfEffectRadius = 0, taskBarBadgeUrl = "/images/graphics/abilities/commander/assassinate.png", description = "Strikes your opponent with a decisive blow, has a 25% chance to critically hit" },
                new CommanderAbility { id = 8, levelAvailable = 2, coolDownTime = 7000, name = "Glare", CommanderId = 2, duration = 3000, aggressive = true, isAPercentage = true, kineticDefense = 50, areaOfEffectRadius = 3, taskBarBadgeUrl = "/images/graphics/abilities/commander/glare.png", description = "Glare at your opponents lowering their defence by 50% for 3 seconds." },
                new CommanderAbility { id = 9, levelAvailable = 3, coolDownTime = 2000, name = "Cluster Volley", CommanderId = 2, aggressive = true, kineticAttack = 25, areaOfEffectRadius = 3, taskBarBadgeUrl = "/images/graphics/abilities/commander/clustervolley.png", description = "Disperse a volley of cluster bombs at your opponent, all enemies in the vicinity." },
                new CommanderAbility { id = 10, levelAvailable = 4, targeting = Targeting.passiveOnSelf, isPassive = true, name = "Suspicion", CommanderId = 2, aggressive = true, isAPercentage = true, criticalHit = 8, areaOfEffectRadius = 5, taskBarBadgeUrl = "/images/graphics/abilities/commander/suspicion.png", description = "Wherever you go you arouse suspicion amongst your enemies, increasing the chance they can be critically hit by 8%" },
                new CommanderAbility { id = 11, levelAvailable = 5, stackBuff = 3, stackDepletesOn = StackDepletesOn.hit, targeting = Targeting.passiveOnSelf, duration = 13000, coolDownTime = 60000, name = "Echo shield", CommanderId = 2, defensive = true, kineticDefense = 100, isAPercentage = true, areaOfEffectRadius = 0, taskBarBadgeUrl = "/images/graphics/abilities/commander/echoshield.png", description = "Powers up a defensive shield that absorbs three damaging attacks" },
                new CommanderAbility { id = 12, levelAvailable = 8, coolDownTime = 240000, name = "Missile Swarm", CommanderId = 2, aggressive = true, kineticAttack = 110, plasmaAttack = 10, areaOfEffectRadius = 2, taskBarBadgeUrl = "/images/graphics/abilities/commander/missileswarm.png", description = "Releases a swarm of missiles onto a target and the immediate surrounding area" }
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
