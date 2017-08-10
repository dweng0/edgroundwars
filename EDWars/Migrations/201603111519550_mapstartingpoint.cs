namespace EDWars.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class mapstartingpoint : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Maps", "RedStartingPointX", c => c.Int(nullable: false));
            AddColumn("dbo.Maps", "RedStartingPointY", c => c.Int(nullable: false));
            AddColumn("dbo.Maps", "RedStartingPointZ", c => c.Int(nullable: false));
            AddColumn("dbo.Maps", "BlueStartingPointX", c => c.Int(nullable: false));
            AddColumn("dbo.Maps", "BlueStartingPointY", c => c.Int(nullable: false));
            AddColumn("dbo.Maps", "BlueStartingPointZ", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Maps", "BlueStartingPointZ");
            DropColumn("dbo.Maps", "BlueStartingPointY");
            DropColumn("dbo.Maps", "BlueStartingPointX");
            DropColumn("dbo.Maps", "RedStartingPointZ");
            DropColumn("dbo.Maps", "RedStartingPointY");
            DropColumn("dbo.Maps", "RedStartingPointX");
        }
    }
}
