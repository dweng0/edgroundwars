namespace EDWars.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class streamlinedmodel : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Maps", "assetUrl", c => c.String());
            DropColumn("dbo.Maps", "TextureMap");
            DropColumn("dbo.Maps", "HeightMap");
            DropColumn("dbo.Maps", "SkyBox");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Maps", "SkyBox", c => c.String());
            AddColumn("dbo.Maps", "HeightMap", c => c.String());
            AddColumn("dbo.Maps", "TextureMap", c => c.String());
            DropColumn("dbo.Maps", "assetUrl");
        }
    }
}
