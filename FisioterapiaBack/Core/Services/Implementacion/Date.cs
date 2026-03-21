using Core.Domain.Enum;
using Core.Domain.Helpers;
using Core.Infraestructure.Persistance;
using Core.Services.Interfaz;
using Microsoft.EntityFrameworkCore;

namespace Core.Services.Implementacion;

public class Date : IDate
{
    private readonly FisioContext _context;
    
    public Date(FisioContext context)
    {
        _context = context;
    }
    
    public async Task ModifyDate()
    {
        await Task.CompletedTask;
    }
}