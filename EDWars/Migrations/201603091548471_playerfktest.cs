namespace EDWars.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class playerfktest : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Players", "Team_Id", "dbo.Teams");
            DropIndex("dbo.Players", new[] { "Team_Id" });
            RenameColumn(table: "dbo.Players", name: "Team_Id", newName: "TeamId");
            AlterColumn("dbo.Players", "TeamId", c => c.Int(nullable: false));
            CreateIndex("dbo.Players", "TeamId");
            AddForeignKey("dbo.Players", "TeamId", "dbo.Teams", "Id", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Players", "TeamId", "dbo.Teams");
            DropIndex("dbo.Players", new[] { "TeamId" });
            AlterColumn("dbo.Players", "TeamId", c => c.Int());
            RenameColumn(table: "dbo.Players", name: "TeamId", newName: "Team_Id");
            CreateIndex("dbo.Players", "Team_Id");
            AddForeignKey("dbo.Players", "Team_Id", "dbo.Teams", "Id");
        }
    }
}
