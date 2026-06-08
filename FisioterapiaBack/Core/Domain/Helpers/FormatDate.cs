namespace Core.Domain.Helpers;

public static class FormatDate
{
    //Se usa para saber la edad
    public static int DateToYear(DateTime date)
    {
        //Resta los años
        int age = DateTime.Today.Year - date.Year;
            
        //Resta un año si el mes actual es menor al mes de nacimiento
        if(DateTime.Today.Month < date.Month)
            age -= 1;
        //Si el mes actual es igual al mes de nacimiento y si el día actual es menor o igual al día de nacimiento
        else if (DateTime.Today.Month == date.Month && DateTime.Today.Day <= date.Day){
            age -= 1;
        }
        
        return age;
    }
    
    //Lo usaremos para obtener la fecha local
    public static DateTime DateLocal()
    {
        // Obtener la hora actual en UTC
        DateTime utcNow = DateTime.UtcNow;
        
        // Obtener la hora local de México en formato IANA (Linux)
        TimeZoneInfo campecheTimeZone = TimeZoneInfo.FindSystemTimeZoneById("America/Mexico_City");
        DateTime campecheTime = TimeZoneInfo.ConvertTimeFromUtc(utcNow, campecheTimeZone);

        return campecheTime;
    }

    public static DateTime StartOfWeek()
    {
        var today = DateLocal();
        int delta = (today.DayOfWeek == DayOfWeek.Sunday ? 7 : (int)today.DayOfWeek) - (int)DayOfWeek.Monday;
        DateTime startOfWeek = today.AddDays(-delta);
    
        return startOfWeek;
    }
    
    public static DateTime EndOfWeek()
    {
        DateTime endOfWeek = StartOfWeek().AddDays(6);
        
        return endOfWeek;
    }

    // Calcula el lunes de la semana de cualquier fecha arbitraria
    public static DateTime StartOfWeekFor(DateTime fecha)
    {
        int delta = (fecha.DayOfWeek == DayOfWeek.Sunday ? 7 : (int)fecha.DayOfWeek) - (int)DayOfWeek.Monday;
        return fecha.Date.AddDays(-delta);
    }

    // Calcula el domingo de la semana de cualquier fecha arbitraria
    public static DateTime EndOfWeekFor(DateTime fecha)
    {
        return StartOfWeekFor(fecha).AddDays(6);
    }
    public static string ToSpanishDate(DateTime date)
{
    string[] meses = {
        "enero", "febrero", "marzo", "abril", "mayo", "junio",
        "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
    };
    return $"{date.Day} {meses[date.Month - 1]} {date.Year}";
}
}