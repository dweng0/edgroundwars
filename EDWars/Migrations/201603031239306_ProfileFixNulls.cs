namespace EDWars.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ProfileFixNulls : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.UserProfile", "Level", c => c.Int());
            AlterColumn("dbo.UserProfile", "Wins", c => c.Int());
            AlterColumn("dbo.UserProfile", "Losses", c => c.Int());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.UserProfile", "Losses", c => c.Int(nullable: false));
            AlterColumn("dbo.UserProfile", "Wins", c => c.Int(nullable: false));
            AlterColumn("dbo.UserProfile", "Level", c => c.Int(nullable: false));
        }
    }
}
