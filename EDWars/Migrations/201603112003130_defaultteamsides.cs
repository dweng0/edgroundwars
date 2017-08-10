namespace EDWars.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class defaultteamsides : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Teams", "Side", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Teams", "Side");
        }
    }
}
