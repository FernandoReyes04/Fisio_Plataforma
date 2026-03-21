using Core.Domain.Entities;
using Core.Infraestructure.Persistance;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace Core.Features.Diagnostico.command;

public record GuardarFormularioSecciones() : IRequest
{
    public List<FormularioSeccionRequest> Secciones { get; set; } = new();
}

public record FormularioSeccionRequest
{
    public string Clave { get; set; } = null!;
    public string Titulo { get; set; } = null!;
    public string TipoRespuesta { get; set; } = null!;
    public bool EsObligatoria { get; set; }
    public bool EsSistema { get; set; }
    public bool Activa { get; set; }
    public int Orden { get; set; }
    public string? Placeholder { get; set; }
    public List<string> Opciones { get; set; } = new();
}

public class GuardarFormularioSeccionesHandler : IRequestHandler<GuardarFormularioSecciones>
{
    private readonly FisioContext _context;

    public GuardarFormularioSeccionesHandler(FisioContext context)
    {
        _context = context;
    }

    public async Task Handle(GuardarFormularioSecciones request, CancellationToken cancellationToken)
    {
        var incoming = request.Secciones
            .Where(x => !string.IsNullOrWhiteSpace(x.Clave))
            .OrderBy(x => x.Orden)
            .ToList();

        var existentes = await _context.DiagnosticoFormularioSecciones.ToListAsync(cancellationToken);

        var incomingKeys = incoming.Select(x => x.Clave.Trim()).ToHashSet(StringComparer.OrdinalIgnoreCase);

        foreach (var existente in existentes.Where(x => !incomingKeys.Contains(x.Clave)))
        {
            _context.DiagnosticoFormularioSecciones.Remove(existente);
        }

        var orden = 1;
        foreach (var item in incoming)
        {
            var key = item.Clave.Trim();
            var entity = existentes.FirstOrDefault(x => x.Clave == key);

            if (entity == null)
            {
                entity = new DiagnosticoFormularioSeccion
                {
                    Clave = key
                };
                await _context.DiagnosticoFormularioSecciones.AddAsync(entity, cancellationToken);
            }

            entity.Titulo = item.Titulo?.Trim() ?? key;
            entity.TipoRespuesta = item.TipoRespuesta?.Trim() ?? "text";
            entity.EsObligatoria = item.EsObligatoria;
            entity.EsSistema = item.EsSistema;
            entity.Activa = item.Activa;
            entity.Orden = orden++;
            entity.Placeholder = item.Placeholder;
            entity.OpcionesJson = item.Opciones.Any() ? JsonConvert.SerializeObject(item.Opciones) : null;
        }

        await _context.SaveChangesAsync(cancellationToken);
    }
}
