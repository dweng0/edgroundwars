namespace EDWars.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class thebigshort : DbMigration
    {
        public override void Up()
        {
            DropIndex("dbo.Campaigns", new[] { "MapId" });
            DropIndex("dbo.Players", new[] { "TeamId" });
            CreateTable(
                "dbo.MapPhysics",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        mass = c.Int(nullable: false),
                        restitution = c.Int(nullable: false),
                        friction = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            AddColumn("dbo.FactionAbilities", "areaOfEffectRadius", c => c.Int(nullable: false));
            AddColumn("dbo.Players", "z", c => c.Int(nullable: false));
            AddColumn("dbo.CommanderAbilities", "areaOfEffectRadius", c => c.Int(nullable: false));
            AddColumn("dbo.Maps", "width", c => c.Int(nullable: false));
            AddColumn("dbo.Maps", "height", c => c.Int(nullable: false));
            AddColumn("dbo.Maps", "subDivisions", c => c.Int(nullable: false));
            AddColumn("dbo.Maps", "MapPhysicsId", c => c.Int());
            CreateIndex("dbo.Campaigns", "mapId");
            CreateIndex("dbo.Players", "teamId");
            CreateIndex("dbo.Maps", "MapPhysicsId");
            AddForeignKey("dbo.Maps", "MapPhysicsId", "dbo.MapPhysics", "Id");
            DropColumn("dbo.Teams", "Side");
            DropColumn("dbo.FactionAbilities", "AreaOfEffect");
            DropColumn("dbo.CommanderAbilities", "AreaOfEffect");
        }
        
        public override void Down()
        {
            AddColumn("dbo.CommanderAbilities", "AreaOfEffect", c => c.Int(nullable: false));
            AddColumn("dbo.FactionAbilities", "AreaOfEffect", c => c.Int(nullable: false));
            AddColumn("dbo.Teams", "Side", c => c.Int(nullable: false));
            DropForeignKey("dbo.Maps", "MapPhysicsId", "dbo.MapPhysics");
            DropIndex("dbo.Maps", new[] { "MapPhysicsId" });
            DropIndex("dbo.Players", new[] { "teamId" });
            DropIndex("dbo.Campaigns", new[] { "mapId" });
            DropColumn("dbo.Maps", "MapPhysicsId");
            DropColumn("dbo.Maps", "subDivisions");
            DropColumn("dbo.Maps", "height");
            DropColumn("dbo.Maps", "width");
            DropColumn("dbo.CommanderAbilities", "areaOfEffectRadius");
            DropColumn("dbo.Players", "z");
            DropColumn("dbo.FactionAbilities", "areaOfEffectRadius");
            DropTable("dbo.MapPhysics");
            CreateIndex("dbo.Players", "TeamId");
            CreateIndex("dbo.Campaigns", "MapId");
        }
    }
}
