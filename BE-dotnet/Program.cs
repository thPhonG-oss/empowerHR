using EmpowerHR.Data;
using EmpowerHR.Services;
using EmpowerHR.Repositories;
using EmpowerHR.Mappers;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
var AllowAll = "_allowAll";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: AllowAll, policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddAutoMapper(typeof(Program).Assembly);

// ========== Database Configuration ==========
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection"))
    )
);

// ========== AutoMapper Configuration ==========
builder.Services.AddAutoMapper(typeof(EmployeeMappingProfile));

// ========== Repository Registration ==========
builder.Services.AddScoped<IEmployeeRepository, EmployeeRepository>();

// ========== Services Registration ==========
builder.Services.AddScoped<IEmployeeService, EmployeeService>();

// ========== CORS Configuration ==========
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "https://empower-hr-woad.vercel.app")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// ========== Logging Configuration ==========
builder.Services.AddLogging(config =>
{
    config.AddConsole();
    config.AddDebug();
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.MapControllers();
app.UseCors(AllowAll);

app.Run();

