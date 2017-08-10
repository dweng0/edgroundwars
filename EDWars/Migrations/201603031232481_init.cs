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
                        Id = c.Int(nullable: false, identity: true),
                        Notes = c.String(),
                        MapId = c.Int(),
                        RedTeamId = c.Int(nullable: false),
                        BlueTeamId = c.Int(nullable: false),
                        SpectatingTeamId = c.Int(nullable: false),
                        Status = c.Int(nullable: false),
                        WinningTeamId = c.Int(nullable: false),
                        MasterId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Teams", t => t.BlueTeamId, cascadeDelete: false)
                .ForeignKey("dbo.Maps", t => t.MapId)
                .ForeignKey("dbo.Teams", t => t.RedTeamId, cascadeDelete: false)
                .ForeignKey("dbo.Teams", t => t.SpectatingTeamId, cascadeDelete: false)
                .Index(t => t.MapId)
                .Index(t => t.RedTeamId)
                .Index(t => t.BlueTeamId)
                .Index(t => t.SpectatingTeamId);
            
            CreateTable(
                "dbo.Teams",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        FactionId = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Factions", t => t.FactionId)
                .Index(t => t.FactionId);
            
            CreateTable(
                "dbo.Factions",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        ImgUrl = c.String(),
                        TimesPicked = c.Int(nullable: false),
                        Wins = c.Int(nullable: false),
                        Losses = c.Int(nullable: false),
                        Description = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.FactionAbilities",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        FactionId = c.Int(nullable: false),
                        Name = c.String(),
                        Description = c.String(),
                        TaskBarBadgeUrl = c.String(),
                        ActiveBadgeUrl = c.String(),
                        AssetUrl = c.String(),
                        Aggressive = c.Boolean(nullable: false),
                        Defensive = c.Boolean(nullable: false),
                        Targeting = c.Int(nullable: false),
                        AreaOfEffect = c.Int(nullable: false),
                        Health = c.Int(nullable: false),
                        Shield = c.Int(nullable: false),
                        Power = c.Int(nullable: false),
                        Pips = c.Int(nullable: false),
                        KineticAttack = c.Int(nullable: false),
                        PlasmaAttack = c.Int(nullable: false),
                        KineticDefense = c.Int(nullable: false),
                        PlasmaDefense = c.Int(nullable: false),
                        TowerDefense = c.Int(nullable: false),
                        TowerAttack = c.Int(nullable: false),
                        Speed = c.Int(nullable: false),
                        Agility = c.Int(nullable: false),
                        CriticalHit = c.Int(nullable: false),
                        Money = c.Int(nullable: false),
                        Experience = c.Int(nullable: false),
                        Stacks = c.Boolean(nullable: false),
                        StackLimit = c.Int(nullable: false),
                        LevelUpMultiplier = c.Int(nullable: false),
                        CoolDownTime = c.Int(nullable: false),
                        CoolDownReducedBy = c.Int(nullable: false),
                        Duration = c.Int(nullable: false),
                        TriggersGlobalCoolDown = c.Boolean(nullable: false),
                        IsAPercentage = c.Boolean(nullable: false),
                        IsPassive = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Factions", t => t.FactionId, cascadeDelete: true)
                .Index(t => t.FactionId);
            
            CreateTable(
                "dbo.Players",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        CommanderId = c.Int(),
                        Ready = c.Boolean(nullable: false),
                        Username = c.String(),
                        PlayerId = c.String(),
                        Team_Id = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Commanders", t => t.CommanderId)
                .ForeignKey("dbo.Teams", t => t.Team_Id)
                .Index(t => t.CommanderId)
                .Index(t => t.Team_Id);
            
            CreateTable(
                "dbo.Commanders",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        Description = c.String(),
                        ImgUrl = c.String(),
                        AssetsUrl = c.String(),
                        TimesPicked = c.Int(nullable: false),
                        Wins = c.Int(nullable: false),
                        Losses = c.Int(nullable: false),
                        BaseHealth = c.Int(nullable: false),
                        BaseShield = c.Int(nullable: false),
                        BasePower = c.Int(nullable: false),
                        LevelUpMultiplier = c.Double(nullable: false),
                        BaseSpeed = c.Int(nullable: false),
                        BaseAgility = c.Int(nullable: false),
                        Level = c.Int(nullable: false),
                        ExperiencePoints = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.CommanderAbilities",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        CommanderId = c.Int(nullable: false),
                        LevelAvailable = c.Int(nullable: false),
                        DamageOverTimeTick = c.Int(nullable: false),
                        DamagePerTick = c.Int(nullable: false),
                        CriticalHitChance = c.Int(nullable: false),
                        StackBuff = c.Int(nullable: false),
                        StackDepletesOn = c.Int(nullable: false),
                        Name = c.String(),
                        Description = c.String(),
                        TaskBarBadgeUrl = c.String(),
                        ActiveBadgeUrl = c.String(),
                        AssetUrl = c.String(),
                        Aggressive = c.Boolean(nullable: false),
                        Defensive = c.Boolean(nullable: false),
                        Targeting = c.Int(nullable: false),
                        AreaOfEffect = c.Int(nullable: false),
                        Health = c.Int(nullable: false),
                        Shield = c.Int(nullable: false),
                        Power = c.Int(nullable: false),
                        Pips = c.Int(nullable: false),
                        KineticAttack = c.Int(nullable: false),
                        PlasmaAttack = c.Int(nullable: false),
                        KineticDefense = c.Int(nullable: false),
                        PlasmaDefense = c.Int(nullable: false),
                        TowerDefense = c.Int(nullable: false),
                        TowerAttack = c.Int(nullable: false),
                        Speed = c.Int(nullable: false),
                        Agility = c.Int(nullable: false),
                        CriticalHit = c.Int(nullable: false),
                        Money = c.Int(nullable: false),
                        Experience = c.Int(nullable: false),
                        Stacks = c.Boolean(nullable: false),
                        StackLimit = c.Int(nullable: false),
                        LevelUpMultiplier = c.Int(nullable: false),
                        CoolDownTime = c.Int(nullable: false),
                        CoolDownReducedBy = c.Int(nullable: false),
                        Duration = c.Int(nullable: false),
                        TriggersGlobalCoolDown = c.Boolean(nullable: false),
                        IsAPercentage = c.Boolean(nullable: false),
                        IsPassive = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Commanders", t => t.CommanderId, cascadeDelete: true)
                .Index(t => t.CommanderId);
            
            CreateTable(
                "dbo.Maps",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        ImageUrl = c.String(),
                        Description = c.String(),
                        MaxPlayers = c.Int(nullable: false),
                        TimesPicked = c.Int(nullable: false),
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
                "dbo.UserProfile",
                c => new
                    {
                        UserId = c.Int(nullable: false, identity: true),
                        UserName = c.String(),
                        Level = c.Int(nullable: false),
                        ImgUrl = c.String(),
                        Wins = c.Int(nullable: false),
                        Losses = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.UserId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Campaigns", "SpectatingTeamId", "dbo.Teams");
            DropForeignKey("dbo.Campaigns", "RedTeamId", "dbo.Teams");
            DropForeignKey("dbo.Campaigns", "MapId", "dbo.Maps");
            DropForeignKey("dbo.Campaigns", "BlueTeamId", "dbo.Teams");
            DropForeignKey("dbo.Players", "Team_Id", "dbo.Teams");
            DropForeignKey("dbo.Players", "CommanderId", "dbo.Commanders");
            DropForeignKey("dbo.CommanderAbilities", "CommanderId", "dbo.Commanders");
            DropForeignKey("dbo.Teams", "FactionId", "dbo.Factions");
            DropForeignKey("dbo.FactionAbilities", "FactionId", "dbo.Factions");
            DropIndex("dbo.CommanderAbilities", new[] { "CommanderId" });
            DropIndex("dbo.Players", new[] { "Team_Id" });
            DropIndex("dbo.Players", new[] { "CommanderId" });
            DropIndex("dbo.FactionAbilities", new[] { "FactionId" });
            DropIndex("dbo.Teams", new[] { "FactionId" });
            DropIndex("dbo.Campaigns", new[] { "SpectatingTeamId" });
            DropIndex("dbo.Campaigns", new[] { "BlueTeamId" });
            DropIndex("dbo.Campaigns", new[] { "RedTeamId" });
            DropIndex("dbo.Campaigns", new[] { "MapId" });
            DropTable("dbo.UserProfile");
            DropTable("dbo.Games");
            DropTable("dbo.Maps");
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
