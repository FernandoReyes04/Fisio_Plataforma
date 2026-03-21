using Core.Domain.Enum;
using Core.Domain.Helpers;
using Core.Infraestructure.Persistance;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Core.Features.Citas.queries;

public record GetDailyDate : IRequest<List<GetDailyDateResponse>>;

public class GetDailyDateHandler : IRequestHandler<GetDailyDate, List<GetDailyDateResponse>>
{
    private readonly FisioContext _context;

    public GetDailyDateHandler(FisioContext context)
    {
        _context = context;
    }
    
    public async Task<List<GetDailyDateResponse>> Handle(GetDailyDate request, CancellationToken cancellationToken)
    {
        var dates = await _context.Citas
            .AsNoTracking()
            .Include(x => x.Paciente)
            .Where(x => x.Fecha.Date == FormatDate.DateLocal().Date && x.Status == (int)EstadoCita.Pendiente)
            .OrderBy(x => x.Hora)
            .Select(x => new GetDailyDateResponse()
            {
                CitasId = x.CitasId.HashId(),
                PacienteId = x.Paciente.PacienteId.HashId(),
                Nombre = $"{x.Paciente.Nombre} {x.Paciente.Apellido}",
                Motivo = x.Motivo,
                Foto = x.Paciente.Foto,
                Telefono = x.Paciente.Telefono,
                Fecha = x.Fecha,
                Hora = x.Hora
            }).ToListAsync();

        return dates;
    }
}

public record GetDailyDateResponse
{
    public string CitasId { get; set; }
    public string PacienteId { get; set; }
    public string Nombre { get; set; }
    public string Motivo { get; set; }
    public byte[] Foto { get; set; }
    public string Telefono { get; set; }
    public DateTime Fecha { get; set; }
    public TimeSpan Hora { get; set; }
}