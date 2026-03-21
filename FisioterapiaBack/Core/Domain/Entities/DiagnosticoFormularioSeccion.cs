using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Core.Domain.Entities;

public class DiagnosticoFormularioSeccion
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int DiagnosticoFormularioSeccionId { get; set; }

    [MaxLength(120)]
    public string Clave { get; set; } = null!;

    [MaxLength(180)]
    public string Titulo { get; set; } = null!;

    [MaxLength(40)]
    public string TipoRespuesta { get; set; } = null!;

    public bool EsObligatoria { get; set; }

    public bool EsSistema { get; set; }

    public bool Activa { get; set; }

    public int Orden { get; set; }

    public string? Placeholder { get; set; }

    public string? OpcionesJson { get; set; }
}
