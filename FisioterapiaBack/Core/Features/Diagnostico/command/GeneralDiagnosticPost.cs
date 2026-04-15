using System.ComponentModel.DataAnnotations;
using Core.Domain.Entities;
using Core.Domain.Exceptions;
using Core.Domain.Helpers;
using Core.Infraestructure.Persistance;
using Core.Services.Interfaz;
using Core.Services.Interfaz.Validator;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace Core.Features.Diagnostico.command;

public record ExplorationPost()
{
    public int? Fr { get; set; }
    public int? Fc { get; set; }
    public float? Temperatura { get; set; }
    public float? Peso { get; set; }
    public float? Estatura { get; set; }
    public float? Imc { get; set; }
    public float? IndiceCinturaCadera { get; set; }
    public float? SaturacionOxigeno { get; set; }
    public string PresionArterial { get; set; }
}

public record MapPost()
{
    public List<int> valores { get; set; }
    public List<int> RangoDolor { get; set; }
    public string Nota { get; set; }
    public List<MapPointPost>? Puntos { get; set; }
}

public record MapPointPost()
{
    public float X { get; set; }
    public float Y { get; set; }
    public string? Simbolo { get; set; }
    public string? Tipo { get; set; }
    public int? Nivel { get; set; }
}

public record PostDiagnostic()
{
    public string Descripcion { get; set; }
    public string Refiere { get; set; }
    public string Categoria { get; set; }
    public string DiagnosticoPrevio { get; set; }
    public string TerapeuticaEmpleada { get; set; }
    public string DiagnosticoFuncional { get; set; }
    public string PadecimientoActual { get; set; }
    public string Inspeccion { get; set; }
    public string ExploracionFisicaDescripcion { get; set; }
    public string EstudiosComplementarios { get; set; }
    public string DiagnosticoNosologico { get; set; }
}

public record ProgramPost()
{
    public string CortoPlazo { get; set; }
    public string MedianoPlazo { get; set; }
    public string LargoPlazo { get; set; }
    public string TratamientoFisioterapeutico { get; set; }
    public string Sugerencias { get; set; }
    public string Pronostico { get; set; }
}

public record ReviewPost()
{
    public string Notas { get; set; }
    public string FolioPago { get; set; }
    public string ServicioId { get; set; }
}

public record DynamicSectionPost()
{
    public string Clave { get; set; }
    public string Titulo { get; set; }
    public string TipoRespuesta { get; set; }
    public bool EsObligatoria { get; set; }
    public bool EsSistema { get; set; }
    public int Orden { get; set; }
    public System.Text.Json.JsonElement? Respuesta { get; set; }
}

public record GeneralDiagnosticPost() : IRequest
{
    public string ExpedienteId { get; set; }
    public ExplorationPost Exploration { get; set; }
    public MapPost Map { get; set; }
    public PostDiagnostic Diagnostic { get; set; }
    public ProgramPost Program { get; set; }
    public ReviewPost Review { get; set; }
    public List<DynamicSectionPost>? DynamicSections { get; set; }
}

public class PostDiagnosticHanlder : IRequestHandler<GeneralDiagnosticPost>
{
    private const string MapaPuntosTag = "[FISIOLABS_MAPA_PUNTOS]";
    private readonly FisioContext _context;
    private readonly IExistResource _existResource;
    private readonly IDiagnosticoValidator _validator;

    public PostDiagnosticHanlder(FisioContext context, IExistResource existResource, IDiagnosticoValidator validator)
    {
        _context = context;
        _existResource = existResource;
        _validator = validator;
    }
    
    public async Task Handle(GeneralDiagnosticPost request, CancellationToken cancellationToken)
    {
        // Validacion
        await _validator.crearDiagnostico(request);
        
        // Existencias
        await _existResource.ExistExpediente(request.ExpedienteId);
        await _existResource.ExistServicio(request.Review.ServicioId);

        var tieneDiagnosticoActivo = await _context.Diagnosticos
            .AsNoTracking()
            .AnyAsync(x => x.ExpedienteId == request.ExpedienteId.HashIdInt() && x.Estatus, cancellationToken);

        if (tieneDiagnosticoActivo)
            throw new BadRequestException(Message.DIAG_0014);
        
        using (var transaction = _context.Database.BeginTransaction())
        {
            try
            {
                // Creamos primero el programa fisioterapeutico
                var program = new ProgramaFisioterapeutico()
                {
                    CortoPlazo = request.Program.CortoPlazo,
                    MedianoPlazo = request.Program.MedianoPlazo,
                    LargoPlazo = request.Program.LargoPlazo,
                    TratamientoFisioterapeutico = request.Program.TratamientoFisioterapeutico,
                    Sugerencias = request.Program.Sugerencias,
                    Pronostico = request.Program.Pronostico
                };
                
                await _context.ProgramaFisioterapeuticos.AddAsync(program);
                await _context.SaveChangesAsync();

                // Creamos el mapa corporal
                var mapa = new MapaCorporal()
                {
                    Valor = request.Map.valores,
                    RangoDolor = request.Map.RangoDolor,
                    Nota = ConstruirNotaMapa(request.Map.Nota, request.Map.Puntos),
                };
                
                await _context.MapaCorporals.AddAsync(mapa);
                await _context.SaveChangesAsync();

                
                /* Creamos el diagnostico */
                var diagnostico = new Domain.Entities.Diagnostico()
                {
                    Descripcion = request.Diagnostic.Descripcion,
                    Refiere = request.Diagnostic.Refiere,
                    Categoria = request.Diagnostic.Categoria,
                    DiagnosticoPrevio = request.Diagnostic.DiagnosticoPrevio,
                    TerapeuticaEmpleada = request.Diagnostic.TerapeuticaEmpleada,
                    DiagnosticoFuncional = request.Diagnostic.DiagnosticoFuncional,
                    PadecimientoActual = request.Diagnostic.PadecimientoActual,
                    Inspeccion = request.Diagnostic.Inspeccion,
                    ExploracionFisicaCuadro = request.Diagnostic.ExploracionFisicaDescripcion,
                    EstudiosComplementarios = request.Diagnostic.EstudiosComplementarios,
                    DiagnosticoNosologico = request.Diagnostic.DiagnosticoNosologico,
                    SeccionesDinamicasJson = request.DynamicSections == null || !request.DynamicSections.Any()
                        ? null
                        : System.Text.Json.JsonSerializer.Serialize(request.DynamicSections),
                    Estatus = true,
                    FechaInicio = FormatDate.DateLocal(),
                    ProgramaFisioterapeuticoId = program.ProgramaFisioterapeuticoId,
                    MapaCorporalId = mapa.MapaCorporalId,
                    ExpedienteId = request.ExpedienteId.HashIdInt()
                };
                
                await _context.Diagnosticos.AddAsync(diagnostico);
                await _context.SaveChangesAsync();
                
                // Creamos la revision
                /*
                 * Esta parte se crea aqui, porque la primera vez se crean los datos de la exploracion fisica ya que se
                 * toma como cita al iniciar el diagnostico
                 */
                
                /* Creamos la exploracion Fisica */
                var exploracion = new ExploracionFisica()
                {
                    Fr = (int)(request.Exploration.Fr == null ? 0 : request.Exploration.Fr),
                    Fc = (int)(request.Exploration.Fc == null ? 0 : request.Exploration.Fc),
                    Temperatura = (float)(request.Exploration.Temperatura == null ? 0 : request.Exploration.Temperatura),
                    Peso = (float)(request.Exploration.Peso == null ? 0 : request.Exploration.Peso),
                    Estatura = (float)(request.Exploration.Estatura == null ? 0 : request.Exploration.Estatura),
                    Imc = (float)(request.Exploration.Imc == null ? 0 : request.Exploration.Imc),
                    IndiceCinturaCadera = (float)(request.Exploration.IndiceCinturaCadera == null ? 0 : request.Exploration.IndiceCinturaCadera),
                    SaturacionOxigeno = (float)(request.Exploration.SaturacionOxigeno == null ? 0 : request.Exploration.SaturacionOxigeno),
                    PresionArterial = request.Exploration.PresionArterial
                };
                
                await _context.ExploracionFisicas.AddAsync(exploracion);
                await _context.SaveChangesAsync();
                
                var revision = new Revision()
                {
                    Notas = request.Review.Notas,
                    FolioPago = request.Review.FolioPago,
                    Fecha = FormatDate.DateLocal(),
                    Hora =  new TimeSpan(FormatDate.DateLocal().Hour, FormatDate.DateLocal().Minute, 0),
                    ExploracionFisicaId = exploracion.ExploracionFisicaId,
                    DiagnosticoId = diagnostico.DiagnosticoId,
                    ServicioId = request.Review.ServicioId.HashIdInt()
                };
                
                await _context.Revisions.AddAsync(revision);
                await _context.SaveChangesAsync();
                
                //Si todo sale bien commitiar 
                transaction.Commit();
            }
            catch (Exception ex)
            {
                // Si ocurre un error, revertir la transacción
                try
                {
                    transaction.Rollback();
                }
                catch (Exception exRollback)
                {
                    Console.WriteLine("Error al revertir la transacción: " + exRollback.Message);
                }
                
                throw new BadRequestException("Error al procesar los datos");
            }
        }
    }

    private static string ConstruirNotaMapa(string? nota, List<MapPointPost>? puntos)
    {
        var notaLimpia = LimpiarMetadatosMapa(nota);

        if (puntos == null || puntos.Count == 0)
            return notaLimpia;

        var puntosValidos = puntos
            .Where(x => x != null && x.X >= 0 && x.X <= 100 && x.Y >= 0 && x.Y <= 100)
            .Select(x => new MapPointPost
            {
                X = x.X,
                Y = x.Y,
                Simbolo = x.Simbolo,
                Tipo = x.Tipo,
                Nivel = x.Nivel
            })
            .ToList();

        if (!puntosValidos.Any())
            return notaLimpia;

        var metadata = JsonConvert.SerializeObject(puntosValidos);
        return $"{notaLimpia}\n{MapaPuntosTag}{metadata}";
    }

    private static string LimpiarMetadatosMapa(string? nota)
    {
        if (string.IsNullOrWhiteSpace(nota))
            return string.Empty;

        var indice = nota.IndexOf(MapaPuntosTag, StringComparison.Ordinal);
        if (indice < 0)
            return nota;

        return nota[..indice].TrimEnd();
    }
}