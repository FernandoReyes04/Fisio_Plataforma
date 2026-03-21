using Core.Domain.Entities;
using Core.Infraestructure.Persistance;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace Core.Features.Diagnostico.queries;

public record GetFormularioSecciones() : IRequest<List<FormularioSeccionResponse>>;

public record FormularioSeccionResponse
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

public class GetFormularioSeccionesHandler : IRequestHandler<GetFormularioSecciones, List<FormularioSeccionResponse>>
{
    private readonly FisioContext _context;

    public GetFormularioSeccionesHandler(FisioContext context)
    {
        _context = context;
    }

    public async Task<List<FormularioSeccionResponse>> Handle(GetFormularioSecciones request, CancellationToken cancellationToken)
    {
        List<DiagnosticoFormularioSeccion> secciones;

        try
        {
            secciones = await _context.DiagnosticoFormularioSecciones
                .AsNoTracking()
                .OrderBy(x => x.Orden)
                .ThenBy(x => x.DiagnosticoFormularioSeccionId)
                .ToListAsync(cancellationToken);
        }
        catch
        {
            return GetDefaultSections();
        }

        if (!secciones.Any())
        {
            return GetDefaultSections();
        }

        return secciones.Select(MapResponse).ToList();
    }

    private static FormularioSeccionResponse MapResponse(DiagnosticoFormularioSeccion seccion)
    {
        List<string> opciones;

        try
        {
            opciones = string.IsNullOrWhiteSpace(seccion.OpcionesJson)
                ? new List<string>()
                : JsonConvert.DeserializeObject<List<string>>(seccion.OpcionesJson) ?? new List<string>();
        }
        catch
        {
            opciones = new List<string>();
        }

        return new FormularioSeccionResponse
        {
            Clave = seccion.Clave,
            Titulo = seccion.Titulo,
            TipoRespuesta = seccion.TipoRespuesta,
            EsObligatoria = seccion.EsObligatoria,
            EsSistema = seccion.EsSistema,
            Activa = seccion.Activa,
            Orden = seccion.Orden,
            Placeholder = seccion.Placeholder,
            Opciones = opciones
        };
    }

    private static List<FormularioSeccionResponse> GetDefaultSections()
    {
        var defaults = new (string Key, string Title, string Type, bool Required, int Order)[]
        {
            ("diagnostico", "Diagnóstico", "text", true, 1),
            ("refiere", "Refiere", "text", true, 2),
            ("categoria", "Categoría", "text", true, 3),
            ("diagnosticoPrevio", "Diagnóstico previo del médico", "textarea", true, 4),
            ("terapeuticaEmpleada", "Terapéutica empleada y tratamientos afines", "textarea", true, 5),
            ("diagnosticoFuncional", "Diagnóstico funcional", "textarea", true, 6),
            ("padecimientoActual", "Padecimiento actual", "textarea", true, 7),
            ("inspeccion", "Inspección general y específica", "textarea", true, 8),
            ("exploracionFisicaDescripcion", "Palpación, sensibilidad y medidas antropométricas", "textarea", true, 9),
            ("estudiosComplementarios", "Pruebas complementarias", "textarea", true, 10),
            ("diagnosticoNosologico", "Diagnóstico nosológico", "textarea", true, 11),
            ("cortoPlazo", "Objetivos a corto plazo", "textarea", true, 12),
            ("medianoPlazo", "Objetivos a mediano plazo", "textarea", true, 13),
            ("largoPlazo", "Objetivos a largo plazo", "textarea", true, 14),
            ("tratamientoFisioterapeutico", "Tratamiento fisioterapéutico", "textarea", true, 15),
            ("sugerencias", "Sugerencias y recomendaciones", "textarea", true, 16),
            ("pronostico", "Pronósticos y recomendaciones", "textarea", true, 17)
        };

        return defaults.Select(x => new FormularioSeccionResponse
        {
            Clave = x.Key,
            Titulo = x.Title,
            TipoRespuesta = x.Type,
            EsObligatoria = x.Required,
            EsSistema = true,
            Activa = true,
            Orden = x.Order,
            Placeholder = null,
            Opciones = new List<string>()
        }).ToList();
    }
}
