using Core.Domain.Exceptions;
using Core.Domain.Entities;
using Core.Domain.Helpers;
using Core.Infraestructure.Persistance;
using MediatR;
using Microsoft.EntityFrameworkCore;
using EntityDiagnostico = Core.Domain.Entities.Diagnostico;

namespace Core.Features.Pacientes.queries;

public record GetExpedient : IRequest<GetExpedientResponse>
{
    public string PacienteId { get; set; }
}

public class GetExpedientHandler : IRequestHandler<GetExpedient, GetExpedientResponse>
{
    private readonly FisioContext _context;

    public GetExpedientHandler(FisioContext context)
    {
        _context = context;
    }
    
    public async Task<GetExpedientResponse> Handle(GetExpedient request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.PacienteId))
            throw new NotFoundException("El paciente no existe o no ha terminado su registro");

        var pacienteId = request.PacienteId.HashIdInt();
        if (pacienteId <= 0)
            throw new NotFoundException("El paciente no existe o no ha terminado su registro");

        //Buscamos si el usuario cuenta ya con un expediente
        var expedient = await _context.Expedientes
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.PacienteId == pacienteId, cancellationToken);
        
        if(expedient == null)
            throw new NotFoundException("El paciente no existe o no ha terminado su registro");

        HeredoFamiliar? heredo = null;
        NoPatologico? noPatologico = null;
        GinecoObstetrico? gineco = null;
        List<EntityDiagnostico> diagnosticos = new();

        try
        {
            heredo = await _context.HeredoFamiliars
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.HeredoFamiliarId == expedient.HeredoFamiliarId, cancellationToken);
        }
        catch
        {
            heredo = null;
        }

        try
        {
            noPatologico = await _context.NoPatologicos
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.NoPatologicoId == expedient.NoPatologicoId, cancellationToken);
        }
        catch
        {
            noPatologico = null;
        }

        try
        {
            gineco = await _context.GinecoObstetricos
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.ExpedienteId == expedient.ExpedienteId, cancellationToken);
        }
        catch
        {
            gineco = null;
        }
        
        try
        {
            diagnosticos = await _context.Diagnosticos
                .AsNoTracking()
                .OrderByDescending(x => x.FechaInicio)
                .ThenByDescending(x => x.DiagnosticoId)
                .Where(x => x.ExpedienteId == expedient.ExpedienteId)
                .ToListAsync(cancellationToken);
        }
        catch
        {
            diagnosticos = new List<EntityDiagnostico>();
        }
        
        var response = new GetExpedientResponse()
        {
            ExpedienteId = expedient.ExpedienteId.HashId(),
            Nomenclatura = expedient.Nomenclatura,
            TipoInterrogatorio = expedient.TipoInterrogatorio,
            Responsable = expedient.Responsable,
            Diagnosticos = diagnosticos.Select(x => new DiagnosticGet()
            {
                Diagnostico = x.Descripcion,
                DiagnosticoId = x.DiagnosticoId.HashId(),
                Status = x.Estatus,
                FechaInicio = x.FechaInicio,
                FechaAlta = x.FechaAlta
            }).ToList(),
            HeredoFamiliar = new FamilyHistoryGet()
            {
                Padres = heredo?.Padres ?? 0,
                PadresVivos = heredo?.PadresVivos ?? 0,
                PadresCausaMuerte = heredo?.PadresCausaMuerte ?? string.Empty,
                Hermanos = heredo?.Hermanos ?? 0,
                HermanosVivos = heredo?.HermanosVivos ?? 0,
                HermanosCausaMuerte = heredo?.HermanosCausaMuerte ?? string.Empty,
                Hijos = heredo?.Hijos ?? 0,
                HijosVivos = heredo?.HijosVivos ?? 0,
                HijosCausaMuerte = heredo?.HijosCausaMuerte ?? string.Empty,
                Dm = heredo?.Dm ?? string.Empty,
                Hta = heredo?.Hta ?? string.Empty,
                Cancer = heredo?.Cancer ?? string.Empty,
                Alcoholismo = heredo?.Alcoholismo ?? string.Empty,
                Tabaquismo = heredo?.Tabaquismo ?? string.Empty,
                Drogas = heredo?.Drogas ?? string.Empty
            },
            Antecedente = new AntecedentsGet()
            {
                AntecedentesPatologicos = expedient.AntecedentesPatologicos ?? string.Empty,
                MedioLaboral = noPatologico?.MedioLaboral ?? string.Empty,
                MedioSociocultural = noPatologico?.MedioSociocultural ?? string.Empty,
                MedioFisicoambiental = noPatologico?.MedioFisicoambiental ?? string.Empty
            },
            Ginecobstetricos = gineco == null ? null : new GinecobstetricoGet()
            {
                Fum = gineco.Fum ?? string.Empty,
                Fpp = gineco.Fpp ?? string.Empty,
                Menarca = gineco.Menarca ?? string.Empty,
                Ritmo = gineco.Ritmo ?? string.Empty,
                Cirugias = gineco.Cirugias ?? string.Empty,
                EdadGestional = gineco.EdadGestional == 0 ? "No aplica" : gineco.EdadGestional.ToString(),
                Semanas = gineco.Semanas == 0 ? "No aplica" : gineco.Semanas.ToString(),
                Gestas = gineco.Gestas == 0 ? "No aplica" : gineco.Gestas.ToString(),
                Partos = gineco.Partos == 0 ? "No aplica" : gineco.Partos.ToString(),
                Cesareas = gineco.Cesareas == 0 ? "No aplica" : gineco.Cesareas.ToString(),
                Abortos = gineco.Abortos == 0 ? "No aplica" : gineco.Abortos.ToString(),
                FlujoVaginalId = gineco.FlujoVaginalId.HasValue ? gineco.FlujoVaginalId.Value.HashId() : string.Empty,
                TipoAnticonceptivoId = gineco.TipoAnticonceptivoId.HasValue ? gineco.TipoAnticonceptivoId.Value.HashId() : string.Empty
            }
        };

        return response;
    }
}

public record GetExpedientResponse
{
    public string ExpedienteId { get; set; }
    
    public string Nomenclatura { get; set; }
    
    public bool TipoInterrogatorio { get; set; }
    
    public string Responsable { get; set; }
    
    public FamilyHistoryGet HeredoFamiliar { get; set; }
    
    public AntecedentsGet Antecedente { get; set; }
    
    public GinecobstetricoGet? Ginecobstetricos { get; set; }
    
    public List<DiagnosticGet> Diagnosticos { get; set; }
};

public record FamilyHistoryGet
{
    public int Padres { get; set; }

    public int PadresVivos { get; set; }

    public string PadresCausaMuerte { get; set; }

    public int Hermanos { get; set; }

    public int HermanosVivos { get; set; }

    public string HermanosCausaMuerte { get; set; }

    public int Hijos { get; set; }

    public int HijosVivos { get; set; }

    public string HijosCausaMuerte { get; set; }

    public string Dm { get; set; }

    public string Hta { get; set; }

    public string Cancer { get; set; }

    public string Alcoholismo { get; set; }

    public string Tabaquismo { get; set; }

    public string Drogas { get; set; }
}

public record AntecedentsGet
{
    public string AntecedentesPatologicos { get; set; }

    public string MedioLaboral { get; set; }

    public string MedioSociocultural { get; set; }

    public string MedioFisicoambiental { get; set; }
}

public record GinecobstetricoGet
{
    public string Fum { get; set; }

    public string Fpp { get; set; }

    public string EdadGestional { get; set; }

    public string Semanas { get; set; }

    public string Menarca { get; set; }

    public string Ritmo { get; set; }

    public string Gestas { get; set; }

    public string Partos { get; set; }

    public string Cesareas { get; set; }

    public string Abortos { get; set; }

    public string Cirugias { get; set; }

    public string FlujoVaginalId { get; set; }
    
    public string TipoAnticonceptivoId { get; set; }
}

public record DiagnosticGet
{
    public string Diagnostico { get; set; }
    public DateTime FechaInicio { get; set; }
    public DateTime? FechaAlta { get; set; }
    public bool Status { get; set; }
    public string DiagnosticoId { get; set; } 
}