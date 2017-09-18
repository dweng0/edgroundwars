namespace EDWars.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class lol2 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Commanders", "CharacterDataId", c => c.Int());
            CreateIndex("dbo.Commanders", "CharacterDataId");
            AddForeignKey("dbo.Commanders", "CharacterDataId", "dbo.CharacterDatas", "Id");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Commanders", "CharacterDataId", "dbo.CharacterDatas");
            DropIndex("dbo.Commanders", new[] { "CharacterDataId" });
            DropColumn("dbo.Commanders", "CharacterDataId");
        }
    }
}
