using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FitCoreGym.Migrations
{
    /// <inheritdoc />
    public partial class InitialGymSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GymMembers_PersonalTrainers_PersonalTrainerId",
                table: "GymMembers");

            migrationBuilder.DropForeignKey(
                name: "FK_GymMembers_TrainingProgrammes_TrainingProgrammeId",
                table: "GymMembers");

            migrationBuilder.AlterColumn<string>(
                name: "PhoneNumber",
                table: "GymMembers",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddForeignKey(
                name: "FK_GymMembers_PersonalTrainers_PersonalTrainerId",
                table: "GymMembers",
                column: "PersonalTrainerId",
                principalTable: "PersonalTrainers",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_GymMembers_TrainingProgrammes_TrainingProgrammeId",
                table: "GymMembers",
                column: "TrainingProgrammeId",
                principalTable: "TrainingProgrammes",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GymMembers_PersonalTrainers_PersonalTrainerId",
                table: "GymMembers");

            migrationBuilder.DropForeignKey(
                name: "FK_GymMembers_TrainingProgrammes_TrainingProgrammeId",
                table: "GymMembers");

            migrationBuilder.AlterColumn<string>(
                name: "PhoneNumber",
                table: "GymMembers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_GymMembers_PersonalTrainers_PersonalTrainerId",
                table: "GymMembers",
                column: "PersonalTrainerId",
                principalTable: "PersonalTrainers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_GymMembers_TrainingProgrammes_TrainingProgrammeId",
                table: "GymMembers",
                column: "TrainingProgrammeId",
                principalTable: "TrainingProgrammes",
                principalColumn: "Id");
        }
    }
}
