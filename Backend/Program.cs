using Microsoft.EntityFrameworkCore;
using Serilog;
using Serilog.Events;

// Configure Serilog early so startup logs are captured
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Debug()
    .MinimumLevel.Override("Microsoft", LogEventLevel.Information)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.File("logs/log-.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

var builder = WebApplication.CreateBuilder(args);
builder.Host.UseSerilog();

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure Entity Framework with MySQL
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        // Allow both http and https dev origins for the Angular dev server
        policy.WithOrigins("http://localhost:4200", "https://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Enable routing so CORS middleware can act on routed endpoints
app.UseRouting();

app.UseCors("AllowAngular");
// Rely on the CORS middleware to handle preflight (OPTIONS) requests consistently

// Request/response logging middleware (placed after CORS so preflight is handled first)
app.Use(async (context, next) =>
{
    var logger = context.RequestServices.GetRequiredService<ILogger<Program>>();
    logger.LogInformation("Incoming request {Method} {Path}", context.Request.Method, context.Request.Path);
    await next();
    logger.LogInformation("Response {StatusCode} for {Method} {Path}", context.Response.StatusCode, context.Request.Method, context.Request.Path);
});

// Configure the HTTP request pipeline
    app.UseSwagger();
    app.UseSwaggerUI();

app.UseStaticFiles();
app.UseAuthorization();
app.MapControllers();

try
{
    app.Run();
}
finally
{
    // Ensure logs are flushed on shutdown
    Log.CloseAndFlush();
}