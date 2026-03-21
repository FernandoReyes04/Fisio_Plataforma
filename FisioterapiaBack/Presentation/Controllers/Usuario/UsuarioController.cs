using Core.Features.Usuario.command;
using Core.Features.Usuario.queries;
using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;

namespace Presentation.Controllers.Catalogos;

[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
[ApiController]
[Route("[controller]")]
public class UsuarioController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IWebHostEnvironment _environment;
    
    public UsuarioController(IMediator mediator, IWebHostEnvironment environment)
    {
        _mediator = mediator;
        _environment = environment;
    }
    
    /// <summary>
    /// Obtener datos del usuario
    /// </summary>
    [HttpGet()]
    public async Task<DataUserResponse> getData()
    {
        return await _mediator.Send(new DataUser(){ });
    }
    
    /// <summary>
    /// Validación de la clave del administrador
    /// </summary>
    [HttpGet("ClaveAdmin/{clave}")]
    public async Task<ClaveAdminResponse> getClaveAdmin(string clave)
    {
        return await _mediator.Send(new ClaveAdmin(){Clave = clave});
    }
    
    /// <summary>
    /// Foto de perfil del usuario
    /// </summary>
    [HttpGet("FotoPerfil")]
    public async Task<IActionResult> fotoPerfil()
    {
        var response = await _mediator.Send(new ViewPicture());
        return File(response.Foto, "image/jpeg", $"{response.Username}.jpg");
    }
    
    /// <summary>
    /// Crear usuario
    /// </summary>
    [AllowAnonymous]
    [HttpPost()]
    public async Task<IActionResult> PostUser([FromForm] CreateUser command)
    {
        await _mediator.Send(command);
        return Ok("Se registro el usuario correctamente");
    }
    
    /// <summary>
    /// Modificar usuario
    /// </summary>
    [HttpPut()]
    public async Task<IActionResult> PutUser([FromForm] ModificarUsuario command)
    {
        await _mediator.Send(command);
        return Ok("Se modifico el usuario correctamente");
    }
    
    /// <summary>
    /// Modificar foto del usuario
    /// </summary>
    [HttpPut("Foto")]
    public async Task<IActionResult> PutFoto([FromForm] ModificarFoto command)
    {
        await _mediator.Send(command);
        return Ok("Se modifico la foto del usuario correctamente");
    }

    /// <summary>
    /// Obtener logo institucional
    /// </summary>
    [AllowAnonymous]
    [HttpGet("Logo")]
    public IActionResult GetLogoInstitucional()
    {
        var carpetaLogo = Path.Combine(_environment.ContentRootPath, "PersistentStorage", "Branding");

        string? archivo = null;
        if (Directory.Exists(carpetaLogo))
        {
            archivo = Directory
                .GetFiles(carpetaLogo, "logo.*")
                .OrderByDescending(System.IO.File.GetLastWriteTimeUtc)
                .FirstOrDefault();
        }

        if (archivo == null)
        {
            var logoDefault = Path.Combine(_environment.WebRootPath ?? string.Empty, "Logos", "uac.png");
            if (System.IO.File.Exists(logoDefault))
                archivo = logoDefault;
        }

        if (archivo == null)
            return NotFound();

        var provider = new FileExtensionContentTypeProvider();
        if (!provider.TryGetContentType(archivo, out var contentType))
            contentType = "application/octet-stream";

        var fileBytes = System.IO.File.ReadAllBytes(archivo);
        return File(fileBytes, contentType);
    }

    /// <summary>
    /// Actualizar logo institucional
    /// </summary>
    [HttpPut("Logo")]
    public async Task<IActionResult> PutLogoInstitucional([FromForm] IFormFile logo)
    {
        if (logo == null || logo.Length == 0)
            return BadRequest("No se recibió ningún archivo");

        var extensionesPermitidas = new[] { ".png", ".jpg", ".jpeg" };
        var extension = Path.GetExtension(logo.FileName).ToLowerInvariant();

        if (!extensionesPermitidas.Contains(extension))
            return BadRequest("Solo se permiten archivos PNG o JPG");

        var carpetaLogo = Path.Combine(_environment.ContentRootPath, "PersistentStorage", "Branding");
        Directory.CreateDirectory(carpetaLogo);

        foreach (var existente in Directory.GetFiles(carpetaLogo, "logo.*"))
            System.IO.File.Delete(existente);

        var rutaDestino = Path.Combine(carpetaLogo, $"logo{extension}");

        await using var stream = new FileStream(rutaDestino, FileMode.Create, FileAccess.Write);
        await logo.CopyToAsync(stream);

        return Ok("Logo institucional actualizado correctamente");
    }
}