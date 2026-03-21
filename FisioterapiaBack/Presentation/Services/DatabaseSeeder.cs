using Core.Domain.Entities;
using Core.Infraestructure.Persistance;
using Microsoft.EntityFrameworkCore;

namespace Presentation.Services;

public static class DatabaseSeeder
{
    public static async Task SeedAsync(WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<FisioContext>();

        await context.Database.MigrateAsync();

        var tecnico = await context.Especialidades
            .FirstOrDefaultAsync(x => x.Descripcion == "Tecnico");

        if (tecnico == null)
        {
            tecnico = new Cat_Especialidades
            {
                Descripcion = "Tecnico",
                Status = true
            };

            await context.Especialidades.AddAsync(tecnico);
            await context.SaveChangesAsync();
        }

        var usuarioFernando = await context.Usuarios
            .FirstOrDefaultAsync(x => x.Username == "Fernando");

        var passwordHash = BCrypt.Net.BCrypt.HashPassword("1234");
        var claveVerificadoraHash = BCrypt.Net.BCrypt.HashPassword("12345");

        if (usuarioFernando == null)
        {
            await context.Usuarios.AddAsync(new Usuario
            {
                Username = "Fernando",
                Password = passwordHash,
                Clave = claveVerificadoraHash,
                FechaRegistro = DateTime.Now.Date,
                EspecialidadId = tecnico.EspecialidadesId
            });
        }
        else
        {
            if (!BCrypt.Net.BCrypt.Verify("12345", usuarioFernando.Clave))
            {
                usuarioFernando.Clave = claveVerificadoraHash;
                context.Usuarios.Update(usuarioFernando);
            }

            if (usuarioFernando.EspecialidadId != tecnico.EspecialidadesId)
            {
                usuarioFernando.EspecialidadId = tecnico.EspecialidadesId;
                context.Usuarios.Update(usuarioFernando);
            }
        }

        await SeedEstadoCivil(context);
        await SeedAnticonceptivos(context);
        await SeedFlujoVaginal(context);

        await context.SaveChangesAsync();
    }

    private static async Task SeedEstadoCivil(FisioContext context)
    {
        string[] valores = ["soltero/a", "casado/a"];
        var existentes = await context.EstadoCivils
            .Select(x => x.Descripcion.ToLower())
            .ToListAsync();

        var nuevos = valores
            .Where(valor => !existentes.Contains(valor.ToLower()))
            .Select(valor => new Cat_EstadoCivil
            {
                Descripcion = valor,
                Status = true
            });

        await context.EstadoCivils.AddRangeAsync(nuevos);
    }

    private static async Task SeedAnticonceptivos(FisioContext context)
    {
        string[] valores = ["Ninguno", "Condón", "DIU", "Pastillas"];
        var existentes = await context.TipoAnticonceptivos
            .Select(x => x.Descripcion.ToLower())
            .ToListAsync();

        var nuevos = valores
            .Where(valor => !existentes.Contains(valor.ToLower()))
            .Select(valor => new Cat_TipoAnticonceptivo
            {
                Descripcion = valor,
                Status = true
            });

        await context.TipoAnticonceptivos.AddRangeAsync(nuevos);
    }

    private static async Task SeedFlujoVaginal(FisioContext context)
    {
        string[] valores = ["Escaso", "Moderado", "Abundante"];
        var existentes = await context.FlujoVaginals
            .Select(x => x.Descripcion.ToLower())
            .ToListAsync();

        var nuevos = valores
            .Where(valor => !existentes.Contains(valor.ToLower()))
            .Select(valor => new Cat_FlujoVaginal
            {
                Descripcion = valor,
                Status = true
            });

        await context.FlujoVaginals.AddRangeAsync(nuevos);
    }
}
