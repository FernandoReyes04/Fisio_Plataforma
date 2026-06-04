using Core.Domain.Helpers;
using Core.Infraestructure.Persistance;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Core.Features.Pacientes.queries;

public record SearchPatients : IRequest<SearchPatientResponse>
{
    public int Pagina { get; set; }
    public string Nombre { get; set; }
    public bool OnlyActive { get; set; }
}

public class SearchPatientsHandler : IRequestHandler<SearchPatients, SearchPatientResponse>
{
    private readonly FisioContext _context;

    public SearchPatientsHandler(FisioContext context)
    {
        _context = context;
    }

    public async Task<SearchPatientResponse> Handle(SearchPatients request, CancellationToken cancellationToken)
    {
        string termino = (request.Nombre ?? string.Empty).Trim().ToLower();

        // Carga todos los pacientes que hagan match en Apellido, Nombre o la
        // combinación "Apellido Nombre" / "Nombre Apellido".
        var candidatos = await _context.Pacientes
            .AsNoTracking()
            .Where(x =>
                (!request.OnlyActive || x.Status) &&
                (x.Apellido.Contains(termino) ||
                 x.Nombre.Contains(termino)   ||
                 (x.Apellido + " " + x.Nombre).Contains(termino) ||
                 (x.Nombre + " " + x.Apellido).Contains(termino)))
            .Include(x => x.Fisioterapeuta)
            .Include(x => x.Expediente)
            .ToListAsync(cancellationToken);

        // Ordenamiento: apellido primero.
        // 0 — Apellido comienza con el término  → máxima prioridad
        // 1 — Apellido contiene el término en cualquier posición
        // 2 — Nombre comienza con el término
        // 3 — Nombre contiene el término
        // 4 — Solo coincide en la combinación completa
        // Dentro de cada prioridad: alfabético por Apellido, luego Nombre.
        var ordenados = candidatos
            .OrderBy(p =>
            {
                string ap  = p.Apellido.ToLower();
                string nom = p.Nombre.ToLower();

                if (ap.StartsWith(termino))  return 0;
                if (ap.Contains(termino))    return 1;
                if (nom.StartsWith(termino)) return 2;
                if (nom.Contains(termino))   return 3;
                return 4;
            })
            .ThenBy(p => p.Apellido)
            .ThenBy(p => p.Nombre)
            .ToList();

        int total    = ordenados.Count;
        int numPages = Math.Max(1, (int)Math.Ceiling((double)total / 10));
        int pagina   = request.Pagina <= 0 ? 1 : request.Pagina;

        var pacientes = ordenados
            .Skip((pagina - 1) * 10)
            .Take(10)
            .Select(x => new PatientModelSearch
            {
                PacienteId     = x.PacienteId.HashId(),
                Nombre         = $"{x.Apellido} {x.Nombre}",  // Apellido primero en la UI
                Edad           = FormatDate.DateToYear(x.Edad.Date),
                Sexo           = x.Sexo ? "Hombre" : "Mujer",
                Telefono       = x.Telefono,
                Fisioterapeuta = x.Fisioterapeuta?.Nombre ?? "Sin asignar",
                Estatus        = x.Status,
                Verificado     = x.Expediente != null,
                Foto           = x.Foto
            })
            .ToList();

        return new SearchPatientResponse
        {
            numPaginas = numPages,
            total      = total,
            pacientes  = pacientes
        };
    }
}

public record SearchPatientResponse
{
    public int numPaginas { get; set; }
    public int total { get; set; }
    public List<PatientModelSearch> pacientes { get; set; }
}

public record PatientModelSearch
{
    public string PacienteId   { get; set; }
    public string Nombre       { get; set; }
    public string Sexo         { get; set; }
    public string Telefono     { get; set; }
    public string Fisioterapeuta { get; set; }
    public int    Edad         { get; set; }
    public bool   Estatus      { get; set; }
    public bool   Verificado   { get; set; }
    public byte[] Foto         { get; set; }
}