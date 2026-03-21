using Core.Domain.Enum;
using Core.Domain.Helpers;
using Core.Infraestructure.Persistance;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Core.Features.Citas.queries;

public record GetDate : IRequest<List<GetDateResponse>>
{
    public string PacienteId { get; set; }
}

public class GetDateHandler : IRequestHandler<GetDate, List<GetDateResponse>>
{
    private readonly FisioContext _context;

    public GetDateHandler(FisioContext context)
    {
        _context = context;
    }
    
    public async Task<List<GetDateResponse>> Handle(GetDate request, CancellationToken cancellationToken)
    {
        var dates = await _context.Citas
            .AsNoTracking()
            .Include(x => x.Paciente)
            .Where(x => x.PacienteId == request.PacienteId.HashIdInt() && x.Status == (int)EstadoCita.Pendiente)
            .OrderBy(x => x.Fecha)
            .ThenBy(x => x.Hora)
            .Select(x => new GetDateResponse()
            {
                CitaId = x.CitasId.HashId(),
                Nombre = $"{x.Paciente.Nombre} {x.Paciente.Apellido}",
                Fecha = x.Fecha,
                Hora = x.Hora,
                Motivo = x.Motivo
            }).ToListAsync();

        return dates;
    }
}

public record GetDateResponse
{
    public string CitaId { get; set; }
    public string Nombre { get; set; }
    public DateTime Fecha { get; set; }
    public TimeSpan Hora { get; set; }
    public string Motivo { get; set; }
}