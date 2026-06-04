using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Core.Infraestructure.Persistance.Migrations
{
    public partial class RemoveTelefonoUniqueIndex : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // El teléfono deja de ser único: varios pacientes pueden
            // compartir el mismo número (familiares, tutores, etc.)
            migrationBuilder.DropIndex(
                name: "IX_paciente_Telefono",
                table: "paciente");

            // Se vuelve a crear como índice normal (sin unicidad)
            // para mantener la performance en búsquedas por teléfono.
            migrationBuilder.CreateIndex(
                name: "IX_paciente_Telefono",
                table: "paciente",
                column: "Telefono");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Rollback: restaura la unicidad original si se revierte la migración.
            migrationBuilder.DropIndex(
                name: "IX_paciente_Telefono",
                table: "paciente");

            migrationBuilder.CreateIndex(
                name: "IX_paciente_Telefono",
                table: "paciente",
                column: "Telefono",
                unique: true);
        }
    }
}