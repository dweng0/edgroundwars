namespace EDWars.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class test : DbMigration
    {
        public override void Up()
        {
            RenameColumn(table: "dbo.CharacterDatas", name: "physics_Id", newName: "CharacterPhysicsId");
            RenameIndex(table: "dbo.CharacterDatas", name: "IX_physics_Id", newName: "IX_CharacterPhysicsId");
        }
        
        public override void Down()
        {
            RenameIndex(table: "dbo.CharacterDatas", name: "IX_CharacterPhysicsId", newName: "IX_physics_Id");
            RenameColumn(table: "dbo.CharacterDatas", name: "CharacterPhysicsId", newName: "physics_Id");
        }
    }
}
