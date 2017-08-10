namespace EDWars.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class texturemapandheightmap : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Maps", "TextureMap", c => c.String());
            AddColumn("dbo.Maps", "HeightMap", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Maps", "HeightMap");
            DropColumn("dbo.Maps", "TextureMap");
        }
    }
}
