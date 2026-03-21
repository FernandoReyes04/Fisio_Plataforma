using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Core.Infraestructure.Persistance.Migrations
{
    public partial class DiagnosticoFormularioDinamico : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "SeccionesDinamicasJson",
                table: "diagnostico",
                type: "LONGTEXT",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "diagnostico_formulario_seccion",
                columns: table => new
                {
                    DiagnosticoFormularioSeccionId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySql.EntityFrameworkCore.Metadata.MySQLValueGenerationStrategy.IdentityColumn),
                    Clave = table.Column<string>(type: "varchar(120)", maxLength: 120, nullable: false),
                    Titulo = table.Column<string>(type: "varchar(180)", maxLength: 180, nullable: false),
                    TipoRespuesta = table.Column<string>(type: "varchar(40)", maxLength: 40, nullable: false),
                    EsObligatoria = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    EsSistema = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    Activa = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    Orden = table.Column<int>(type: "int", nullable: false),
                    Placeholder = table.Column<string>(type: "LONGTEXT", nullable: true),
                    OpcionesJson = table.Column<string>(type: "LONGTEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_diagnostico_formulario_seccion", x => x.DiagnosticoFormularioSeccionId);
                });

            migrationBuilder.CreateIndex(
                name: "IX_diagnostico_formulario_seccion_Clave",
                table: "diagnostico_formulario_seccion",
                column: "Clave",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "diagnostico_formulario_seccion");

            migrationBuilder.DropColumn(
                name: "SeccionesDinamicasJson",
                table: "diagnostico");
        }
    }
}
