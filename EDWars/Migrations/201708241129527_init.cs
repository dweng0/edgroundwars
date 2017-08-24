namespace EDWars.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class init : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Campaigns",
                c => new
                    {
                        id = c.Int(nullable: false, identity: true),
                        notes = c.String(),
                        mapId = c.Int(),
                        RedTeamId = c.Int(nullable: false),
                        BlueTeamId = c.Int(nullable: false),
                        SpectatingTeamId = c.Int(nullable: false),
                        Status = c.Int(nullable: false),
                        WinningTeamId = c.Int(nullable: false),
                        MasterId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.id)
                .ForeignKey("dbo.Teams", t => t.BlueTeamId, cascadeDelete: true)
                .ForeignKey("dbo.Maps", t => t.mapId)
                .ForeignKey("dbo.Teams", t => t.RedTeamId, cascadeDelete: true)
                .ForeignKey("dbo.Teams", t => t.SpectatingTeamId, cascadeDelete: true)
                .Index(t => t.mapId)
                .Index(t => t.RedTeamId)
                .Index(t => t.BlueTeamId)
                .Index(t => t.SpectatingTeamId);
            
            CreateTable(
                "dbo.Teams",
                c => new
                    {
                        id = c.Int(nullable: false, identity: true),
                        name = c.String(),
                        level = c.Int(nullable: false),
                        FactionId = c.Int(),
                    })
                .PrimaryKey(t => t.id)
                .ForeignKey("dbo.Factions", t => t.FactionId)
                .Index(t => t.FactionId);
            
            CreateTable(
                "dbo.Factions",
                c => new
                    {
                        id = c.Int(nullable: false, identity: true),
                        name = c.String(),
                        imgUrl = c.String(),
                        timesPicked = c.Int(nullable: false),
                        wins = c.Int(nullable: false),
                        losses = c.Int(nullable: false),
                        description = c.String(),
                    })
                .PrimaryKey(t => t.id);
            
            CreateTable(
                "dbo.FactionAbilities",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        FactionId = c.Int(nullable: false),
                        name = c.String(),
                        description = c.String(),
                        taskBarBadgeUrl = c.String(),
                        activeBadgeUrl = c.String(),
                        AssetUrl = c.String(),
                        aggressive = c.Boolean(nullable: false),
                        defensive = c.Boolean(nullable: false),
                        targeting = c.Int(nullable: false),
                        areaOfEffectRadius = c.Int(nullable: false),
                        health = c.Int(nullable: false),
                        shield = c.Int(nullable: false),
                        power = c.Int(nullable: false),
                        pips = c.Int(nullable: false),
                        kineticAttack = c.Int(nullable: false),
                        plasmaAttack = c.Int(nullable: false),
                        kineticDefense = c.Int(nullable: false),
                        plasmaDefense = c.Int(nullable: false),
                        towerDefense = c.Int(nullable: false),
                        towerAttack = c.Int(nullable: false),
                        speed = c.Int(nullable: false),
                        agility = c.Int(nullable: false),
                        criticalHit = c.Int(nullable: false),
                        money = c.Int(nullable: false),
                        experience = c.Int(nullable: false),
                        stacks = c.Boolean(nullable: false),
                        stackLimit = c.Int(nullable: false),
                        levelUpMultiplier = c.Int(nullable: false),
                        coolDownTime = c.Int(nullable: false),
                        coolDownReducedBy = c.Int(nullable: false),
                        duration = c.Int(nullable: false),
                        triggersGlobalCoolDown = c.Boolean(nullable: false),
                        isAPercentage = c.Boolean(nullable: false),
                        isPassive = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Factions", t => t.FactionId, cascadeDelete: true)
                .Index(t => t.FactionId);
            
            CreateTable(
                "dbo.Players",
                c => new
                    {
                        id = c.Int(nullable: false, identity: true),
                        CommanderId = c.Int(),
                        Ready = c.Boolean(nullable: false),
                        teamId = c.Int(nullable: false),
                        username = c.String(),
                        playerId = c.String(),
                        x = c.Int(nullable: false),
                        y = c.Int(nullable: false),
                        z = c.Int(nullable: false),
                        stats_Id = c.Int(),
                    })
                .PrimaryKey(t => t.id)
                .ForeignKey("dbo.Commanders", t => t.CommanderId)
                .ForeignKey("dbo.PlayerStats", t => t.stats_Id)
                .ForeignKey("dbo.Teams", t => t.teamId, cascadeDelete: true)
                .Index(t => t.CommanderId)
                .Index(t => t.teamId)
                .Index(t => t.stats_Id);
            
            CreateTable(
                "dbo.Commanders",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        name = c.String(),
                        description = c.String(),
                        imgUrl = c.String(),
                        assetsUrl = c.String(),
                        timesPicked = c.Int(nullable: false),
                        wins = c.Int(nullable: false),
                        losses = c.Int(nullable: false),
                        baseHealth = c.Int(nullable: false),
                        baseShield = c.Int(nullable: false),
                        basePower = c.Int(nullable: false),
                        levelUpMultiplier = c.Double(nullable: false),
                        baseSpeed = c.Int(nullable: false),
                        baseAgility = c.Int(nullable: false),
                        level = c.Int(nullable: false),
                        experiencePoints = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.CommanderAbilities",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        levelAvailable = c.Int(nullable: false),
                        damageOverTimeTick = c.Int(nullable: false),
                        damagePerTick = c.Int(nullable: false),
                        criticalHitChance = c.Int(nullable: false),
                        stackBuff = c.Int(nullable: false),
                        stackDepletesOn = c.Int(nullable: false),
                        CommanderId = c.Int(nullable: false),
                        name = c.String(),
                        description = c.String(),
                        taskBarBadgeUrl = c.String(),
                        activeBadgeUrl = c.String(),
                        AssetUrl = c.String(),
                        aggressive = c.Boolean(nullable: false),
                        defensive = c.Boolean(nullable: false),
                        targeting = c.Int(nullable: false),
                        areaOfEffectRadius = c.Int(nullable: false),
                        health = c.Int(nullable: false),
                        shield = c.Int(nullable: false),
                        power = c.Int(nullable: false),
                        pips = c.Int(nullable: false),
                        kineticAttack = c.Int(nullable: false),
                        plasmaAttack = c.Int(nullable: false),
                        kineticDefense = c.Int(nullable: false),
                        plasmaDefense = c.Int(nullable: false),
                        towerDefense = c.Int(nullable: false),
                        towerAttack = c.Int(nullable: false),
                        speed = c.Int(nullable: false),
                        agility = c.Int(nullable: false),
                        criticalHit = c.Int(nullable: false),
                        money = c.Int(nullable: false),
                        experience = c.Int(nullable: false),
                        stacks = c.Boolean(nullable: false),
                        stackLimit = c.Int(nullable: false),
                        levelUpMultiplier = c.Int(nullable: false),
                        coolDownTime = c.Int(nullable: false),
                        coolDownReducedBy = c.Int(nullable: false),
                        duration = c.Int(nullable: false),
                        triggersGlobalCoolDown = c.Boolean(nullable: false),
                        isAPercentage = c.Boolean(nullable: false),
                        isPassive = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Commanders", t => t.CommanderId, cascadeDelete: true)
                .Index(t => t.CommanderId);
            
            CreateTable(
                "dbo.PlayerStats",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        deaths = c.Int(nullable: false),
                        Kills = c.Int(nullable: false),
                        experience = c.Int(nullable: false),
                        gold = c.Int(nullable: false),
                        damageDealt = c.Int(nullable: false),
                        healingDealt = c.Int(nullable: false),
                        healingReceived = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Maps",
                c => new
                    {
                        id = c.Int(nullable: false, identity: true),
                        name = c.String(),
                        imageUrl = c.String(),
                        description = c.String(),
                        maxPlayers = c.Int(nullable: false),
                        timesPicked = c.Int(nullable: false),
                        width = c.Int(nullable: false),
                        height = c.Int(nullable: false),
                        subDivisions = c.Int(nullable: false),
                        assetUrl = c.String(),
                        MapPhysicsId = c.Int(),
                        redStartingPointX = c.Int(nullable: false),
                        redStartingPointY = c.Int(nullable: false),
                        redStartingPointZ = c.Int(nullable: false),
                        blueStartingPointX = c.Int(nullable: false),
                        blueStartingPointY = c.Int(nullable: false),
                        blueStartingPointZ = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.id)
                .ForeignKey("dbo.MapPhysics", t => t.MapPhysicsId)
                .Index(t => t.MapPhysicsId);
            
            CreateTable(
                "dbo.MapPhysics",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        mass = c.Double(nullable: false),
                        restitution = c.Double(nullable: false),
                        friction = c.Double(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.CharacterDatas",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        height = c.Int(nullable: false),
                        width = c.Int(nullable: false),
                        textureUrl = c.String(),
                        number = c.Int(nullable: false),
                        meshUrl = c.String(),
                        physics_Id = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.CharacterPhysics", t => t.physics_Id)
                .Index(t => t.physics_Id);
            
            CreateTable(
                "dbo.CharacterPhysics",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        mass = c.Double(nullable: false),
                        restitution = c.Double(nullable: false),
                        friction = c.Double(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Games",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        XpBase = c.Int(nullable: false),
                        XpScale = c.Double(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.UrlManifests",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        playerUsername = c.String(),
                        baseUrl = c.String(),
                        handshake = c.String(),
                        map_Id = c.Int(),
                        world_Id = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.MapManifests", t => t.map_Id)
                .ForeignKey("dbo.WorldPhysics", t => t.world_Id)
                .Index(t => t.map_Id)
                .Index(t => t.world_Id);
            
            CreateTable(
                "dbo.MapManifests",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        baseUrl = c.String(),
                        texture = c.String(),
                        heightMap = c.String(),
                        skyBox = c.String(),
                        physics_Id = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.MapPhysics", t => t.physics_Id)
                .Index(t => t.physics_Id);
            
            CreateTable(
                "dbo.WorldPhysics",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        gravityVector_Id = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.GravityVectors", t => t.gravityVector_Id)
                .Index(t => t.gravityVector_Id);
            
            CreateTable(
                "dbo.GravityVectors",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        x = c.Int(nullable: false),
                        y = c.Int(nullable: false),
                        z = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.UserProfile",
                c => new
                    {
                        UserId = c.Int(nullable: false, identity: true),
                        UserName = c.String(),
                        Level = c.Int(),
                        ImgUrl = c.String(),
                        Wins = c.Int(),
                        Losses = c.Int(),
                    })
                .PrimaryKey(t => t.UserId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.UrlManifests", "world_Id", "dbo.WorldPhysics");
            DropForeignKey("dbo.WorldPhysics", "gravityVector_Id", "dbo.GravityVectors");
            DropForeignKey("dbo.UrlManifests", "map_Id", "dbo.MapManifests");
            DropForeignKey("dbo.MapManifests", "physics_Id", "dbo.MapPhysics");
            DropForeignKey("dbo.CharacterDatas", "physics_Id", "dbo.CharacterPhysics");
            DropForeignKey("dbo.Campaigns", "SpectatingTeamId", "dbo.Teams");
            DropForeignKey("dbo.Campaigns", "RedTeamId", "dbo.Teams");
            DropForeignKey("dbo.Campaigns", "mapId", "dbo.Maps");
            DropForeignKey("dbo.Maps", "MapPhysicsId", "dbo.MapPhysics");
            DropForeignKey("dbo.Campaigns", "BlueTeamId", "dbo.Teams");
            DropForeignKey("dbo.Players", "teamId", "dbo.Teams");
            DropForeignKey("dbo.Players", "stats_Id", "dbo.PlayerStats");
            DropForeignKey("dbo.Players", "CommanderId", "dbo.Commanders");
            DropForeignKey("dbo.CommanderAbilities", "CommanderId", "dbo.Commanders");
            DropForeignKey("dbo.Teams", "FactionId", "dbo.Factions");
            DropForeignKey("dbo.FactionAbilities", "FactionId", "dbo.Factions");
            DropIndex("dbo.WorldPhysics", new[] { "gravityVector_Id" });
            DropIndex("dbo.MapManifests", new[] { "physics_Id" });
            DropIndex("dbo.UrlManifests", new[] { "world_Id" });
            DropIndex("dbo.UrlManifests", new[] { "map_Id" });
            DropIndex("dbo.CharacterDatas", new[] { "physics_Id" });
            DropIndex("dbo.Maps", new[] { "MapPhysicsId" });
            DropIndex("dbo.CommanderAbilities", new[] { "CommanderId" });
            DropIndex("dbo.Players", new[] { "stats_Id" });
            DropIndex("dbo.Players", new[] { "teamId" });
            DropIndex("dbo.Players", new[] { "CommanderId" });
            DropIndex("dbo.FactionAbilities", new[] { "FactionId" });
            DropIndex("dbo.Teams", new[] { "FactionId" });
            DropIndex("dbo.Campaigns", new[] { "SpectatingTeamId" });
            DropIndex("dbo.Campaigns", new[] { "BlueTeamId" });
            DropIndex("dbo.Campaigns", new[] { "RedTeamId" });
            DropIndex("dbo.Campaigns", new[] { "mapId" });
            DropTable("dbo.UserProfile");
            DropTable("dbo.GravityVectors");
            DropTable("dbo.WorldPhysics");
            DropTable("dbo.MapManifests");
            DropTable("dbo.UrlManifests");
            DropTable("dbo.Games");
            DropTable("dbo.CharacterPhysics");
            DropTable("dbo.CharacterDatas");
            DropTable("dbo.MapPhysics");
            DropTable("dbo.Maps");
            DropTable("dbo.PlayerStats");
            DropTable("dbo.CommanderAbilities");
            DropTable("dbo.Commanders");
            DropTable("dbo.Players");
            DropTable("dbo.FactionAbilities");
            DropTable("dbo.Factions");
            DropTable("dbo.Teams");
            DropTable("dbo.Campaigns");
        }
    }
}
