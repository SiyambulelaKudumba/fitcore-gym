using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FitCoreGym.Migrations
{
    /// <inheritdoc />
    public partial class AddApplicationUserLinks : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ApplicationUserId",
                table: "PersonalTrainers",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ApplicationUserId",
                table: "GymMembers",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_PersonalTrainers_ApplicationUserId",
                table: "PersonalTrainers",
                column: "ApplicationUserId");

            migrationBuilder.CreateIndex(
                name: "IX_GymMembers_ApplicationUserId",
                table: "GymMembers",
                column: "ApplicationUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_GymMembers_AspNetUsers_ApplicationUserId",
                table: "GymMembers",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_PersonalTrainers_AspNetUsers_ApplicationUserId",
                table: "PersonalTrainers",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GymMembers_AspNetUsers_ApplicationUserId",
                table: "GymMembers");

            migrationBuilder.DropForeignKey(
                name: "FK_PersonalTrainers_AspNetUsers_ApplicationUserId",
                table: "PersonalTrainers");

            migrationBuilder.DropIndex(
                name: "IX_PersonalTrainers_ApplicationUserId",
                table: "PersonalTrainers");

            migrationBuilder.DropIndex(
                name: "IX_GymMembers_ApplicationUserId",
                table: "GymMembers");

            migrationBuilder.DropColumn(
                name: "ApplicationUserId",
                table: "PersonalTrainers");

            migrationBuilder.DropColumn(
                name: "ApplicationUserId",
                table: "GymMembers");
        }
    }
}
