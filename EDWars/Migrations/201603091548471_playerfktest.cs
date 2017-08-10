namespace EDWars.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class playerfktest : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.players", "Team_Id", "dbo.Teams");
            DropIndex("dbo.players", new[] { "Team_Id" });
            RenameColumn(table: "dbo.players", name: "Team_Id", newName: "teamId");
            AlterColumn("dbo.players", "teamId", c => c.Int(nullable: false));
            CreateIndex("dbo.players", "teamId");
            AddForeignKey("dbo.players", "teamId", "dbo.Teams", "id", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.players", "teamId", "dbo.Teams");
            DropIndex("dbo.players", new[] { "teamId" });
            AlterColumn("dbo.players", "teamId", c => c.Int());
            RenameColumn(table: "dbo.players", name: "teamId", newName: "Team_Id");
            CreateIndex("dbo.players", "Team_Id");
            AddForeignKey("dbo.players", "Team_Id", "dbo.Teams", "id");
        }
    }
}
