using Core.Domain.Enum;
using Core.Domain.Exceptions;
using Core.Domain.Helpers;
using Core.Infraestructure.Persistance;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Core.Features.Citas.command;

public record ModifyDate : IRequest
{
    public string CitaId { get; set; }
    public bool? Cancelar { get; set; }
    public bool? Inasistencia { get; set; }
    public bool? Concluida { get; set; }
    public DateTime? Fecha { get; set; }
    public TimeSpan? Hora { get; set; }
    public string? Motivo { get; set; }
};

public class ModifyDateHandler : IRequestHandler<ModifyDate>
{
    private readonly FisioContext _context;

    public ModifyDateHandler(FisioContext context)
    {
        _context = context;
    }
    
    public async Task Handle(ModifyDate request, CancellationToken cancellationToken)
    {
        if (request.CitaId == null)
            throw new BadRequestException(Message.CITA_0004);
        
        var date = await _context.Citas
            .FindAsync(new object[] { request.CitaId.HashIdInt() }, cancellationToken)
            ?? throw new NotFoundException(Message.CITA_0005);

        if (request.Cancelar == true)
            date.Status = (int)EstadoCita.Cancelada;

        if (request.Concluida == true)
            date.Status = (int)EstadoCita.Concluida;

        if (request.Inasistencia == true)
        {
            date.Status = (int)EstadoCita.Inasistencia;

            // Contar inasistencias anteriores del paciente (sin incluir la actual)
            int inasistenciasAnteriores = await _context.Citas
                .CountAsync(x =>
                    x.PacienteId == date.PacienteId &&
                    x.Status == (int)EstadoCita.Inasistencia &&
                    x.CitasId != date.CitasId,
                    cancellationToken);

            // Al sumar la actual, si llega a 3 se da de baja automáticamente
            if (inasistenciasAnteriores + 1 >= 3)
            {
                var paciente = await _context.Pacientes
                    .FindAsync(new object[] { date.PacienteId }, cancellationToken);
                if (paciente != null)
                    paciente.Status = false;
            }
        }

        if (request.Fecha.HasValue)
            date.Fecha = request.Fecha.Value;

        if (request.Hora.HasValue)
            date.Hora = request.Hora.Value;

        date.Motivo = request.Motivo ?? date.Motivo;
        
        await _context.SaveChangesAsync(cancellationToken);
    }
}