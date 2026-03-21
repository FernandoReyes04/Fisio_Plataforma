using Core.Infraestructure.Persistance;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Core.Domain.Helpers;

namespace Core.Features.Pacientes.queries;

public record GetPatients : IRequest<GetPatientsResponse>
{
    public int Pagina { get; set; }
    public bool OnlyActive { get; set; }
};

public class GetPatientsHandler : IRequestHandler<GetPatients, GetPatientsResponse>
{
    private readonly FisioContext _context;

    public GetPatientsHandler(FisioContext context)
    {
        _context = context;
    }

    public async Task<GetPatientsResponse> Handle(GetPatients request, CancellationToken cancellationToken)
    {
        var pagina = request.Pagina <= 0 ? 1 : request.Pagina;

        var query = _context.Pacientes
            .AsNoTracking()
            .Where(x => !request.OnlyActive || x.Status);

        // Obtener total de pacientes y calcular páginas
        var totalPatients = await query.CountAsync(cancellationToken);
        int numPage = Math.Max(1, (int)Math.Ceiling((double)totalPatients / 10));
        
        //Devuelve una lista de 10 pacientes
        var patients = await query
            .Include(x => x.Fisioterapeuta)
            .Include(x => x.Expediente)
            .OrderBy(x => x.Nombre)
            .Skip((pagina - 1) * 10)
            .Take(10)
            .Select(x => new GetPacientesModel()
            {
                PacienteId = x.PacienteId.HashId(), 
                Nombre = $"{x.Nombre} {x.Apellido}",
                Sexo = x.Sexo == true ? "Hombre" : "Mujer",
                Telefono = x.Telefono,
                Fisioterapeuta = x.Fisioterapeuta != null ? x.Fisioterapeuta.Nombre : "Sin asignar",
                Edad = x.Edad == default ? 0 : FormatDate.DateToYear(x.Edad.Date),
                Estatus = x.Status,
                Verificado = x.Expediente != null,
                Foto = x.Foto
            }).ToListAsync(cancellationToken);

        // Response
        var response = new GetPatientsResponse()
        {
            numPaginas = numPage,
            total = totalPatients,
            pacientes = patients
        };
        
        return response;
    }
}

public record GetPatientsResponse
{
    public int numPaginas { get; set; }
    public int total { get; set; }
    public List<GetPacientesModel> pacientes { get; set; }
}

public record GetPacientesModel
{
    public string PacienteId { get; set; } 
    public string Nombre { get; set; }
    public string Sexo { get; set; }
    public string Telefono { get; set; }
    public string Fisioterapeuta { get; set; }
    public int Edad { get; set; }
    public bool Estatus { get; set; }
    public bool Verificado { get; set; } //Este son para los que tienen completado el expediente
    public byte[] Foto { get; set; }
}