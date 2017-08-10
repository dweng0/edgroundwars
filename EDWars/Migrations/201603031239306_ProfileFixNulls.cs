namespace EDWars.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ProfileFixNulls : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.UserProfile", "level", c => c.Int());
            AlterColumn("dbo.UserProfile", "wins", c => c.Int());
            AlterColumn("dbo.UserProfile", "losses", c => c.Int());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.UserProfile", "losses", c => c.Int(nullable: false));
            AlterColumn("dbo.UserProfile", "wins", c => c.Int(nullable: false));
            AlterColumn("dbo.UserProfile", "level", c => c.Int(nullable: false));
        }
    }
}
