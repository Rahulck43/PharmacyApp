using PharmacyApp.Api.Middleware;
using PharmacyApp.Core;
using PharmacyApp.Core.Options;
using PharmacyApp.Infrastructure;
using PharmacyApp.Infrastructure.Options;

const string ClientCorsPolicy = "Client";

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi();

builder.Services.AddProblemDetails();
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();

builder.Services.AddSingleton(TimeProvider.System);

builder.Services.AddOptions<InventoryOptions>()
    .BindConfiguration(InventoryOptions.SectionName)
    .ValidateDataAnnotations()
    .ValidateOnStart();

builder.Services.AddCore();
builder.Services.AddInfrastructure();

builder.Services.PostConfigure<StorageOptions>(options =>
{
    if (!Path.IsPathRooted(options.FilePath))
    {
        options.FilePath = Path.Combine(builder.Environment.ContentRootPath, options.FilePath);
    }
});

var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];
builder.Services.AddCors(options =>
{
    options.AddPolicy(ClientCorsPolicy, policy =>
        policy.WithOrigins(allowedOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod());
});

var app = builder.Build();

app.UseExceptionHandler();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseCors(ClientCorsPolicy);

app.MapControllers();

app.Run();
