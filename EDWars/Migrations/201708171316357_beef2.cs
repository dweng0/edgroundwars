namespace EDWars.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class beef2 : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.MapPhysics", "mass", c => c.Double(nullable: false));
            AlterColumn("dbo.MapPhysics", "restitution", c => c.Double(nullable: false));
            AlterColumn("dbo.MapPhysics", "friction", c => c.Double(nullable: false));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.MapPhysics", "friction", c => c.Int(nullable: false));
            AlterColumn("dbo.MapPhysics", "restitution", c => c.Int(nullable: false));
            AlterColumn("dbo.MapPhysics", "mass", c => c.Int(nullable: false));
        }
    }
}
