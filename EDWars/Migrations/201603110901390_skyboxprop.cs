namespace EDWars.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class skyboxprop : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Maps", "SkyBox", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Maps", "SkyBox");
        }
    }
}
