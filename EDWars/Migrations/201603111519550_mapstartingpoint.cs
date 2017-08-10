namespace EDWars.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class mapstartingpoint : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Maps", "redStartingPointX", c => c.Int(nullable: false));
            AddColumn("dbo.Maps", "redStartingPointY", c => c.Int(nullable: false));
            AddColumn("dbo.Maps", "redStartingPointZ", c => c.Int(nullable: false));
            AddColumn("dbo.Maps", "blueStartingPointX", c => c.Int(nullable: false));
            AddColumn("dbo.Maps", "blueStartingPointY", c => c.Int(nullable: false));
            AddColumn("dbo.Maps", "blueStartingPointZ", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Maps", "blueStartingPointZ");
            DropColumn("dbo.Maps", "blueStartingPointY");
            DropColumn("dbo.Maps", "blueStartingPointX");
            DropColumn("dbo.Maps", "redStartingPointZ");
            DropColumn("dbo.Maps", "redStartingPointY");
            DropColumn("dbo.Maps", "redStartingPointX");
        }
    }
}
