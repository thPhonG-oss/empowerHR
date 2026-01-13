using EmpowerHR.Data;
using EmpowerHR.Services;
using EmpowerHR.Repositories;
using EmpowerHR.Mappers;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// =====================
// Load .env (chỉ khi dev)
// =====================
if (builder.Environment.IsDevelopment())
{
    DotNetEnv.Env.Load();
}

// =====================
// Lấy biến môi trường DB
// =====================
var dbServer   = Environment.GetEnvironmentVariable("DB_SERVER");
var dbPort     = Environment.GetEnvironmentVariable("DB_PORT");
var dbName     = Environment.GetEnvironmentVariable("DB_NAME");
var dbUser     = Environment.GetEnvironmentVariable("DB_USER");
var dbPassword = Environment.GetEnvironmentVariable("DB_PASSWORD");

// =====================
// Validate env
// =====================
if (string.IsNullOrWhiteSpace(dbServer) ||
    string.IsNullOrWhiteSpace(dbPort) ||
    string.IsNullOrWhiteSpace(dbName) ||
    string.IsNullOrWhiteSpace(dbUser) ||
    string.IsNullOrWhiteSpace(dbPassword))
{
    throw new InvalidOperationException(
        "Missing database environment variables. " +
        "Please check DB_SERVER, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD."
    );
}

// =====================
// Build connection string
// =====================
var connectionString =
    $"server={dbServer};" +
    $"port={dbPort};" +
    $"database={dbName};" +
    $"user={dbUser};" +
    $"password={dbPassword};" +
    $"AllowPublicKeyRetrieval=True;";

// =====================
// Add services
// =====================
var AllowAll = "_allowAll";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: AllowAll, policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// =====================
// Database
// =====================
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(
        connectionString,
        ServerVersion.AutoDetect(connectionString)
    )
);

// =====================
// AutoMapper + DI
// =====================
builder.Services.AddAutoMapper(typeof(EmployeeMappingProfile));
builder.Services.AddScoped<IEmployeeRepository, EmployeeRepository>();
builder.Services.AddScoped<IEmployeeService, EmployeeService>();

builder.Services.AddLogging(config =>
{
    config.AddConsole();
    config.AddDebug();
});

var app = builder.Build();

// =====================
// Swagger
// =====================
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// =====================
// Middleware
// =====================
app.UseHttpsRedirection();
app.UseCors(AllowAll);
app.MapControllers();

// =====================
// (Optional) Test DB when start - chỉ để debug
// =====================
if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    try
    {
        db.Database.OpenConnection();
        Console.WriteLine("✅ DB connection OK");
        db.Database.CloseConnection();
    }
    catch (Exception ex)
    {
        Console.WriteLine("❌ DB connection FAILED: " + ex.Message);
    }
}

app.Run();
