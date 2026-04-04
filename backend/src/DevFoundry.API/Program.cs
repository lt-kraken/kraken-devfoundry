using DevFoundry.Application.Contracts;
using DevFoundry.Application.Dtos;
using DevFoundry.Infrastructure.Data;
using DevFoundry.Infrastructure.Extensions;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddInfrastructure(builder.Configuration);

builder.Services.AddCors(options =>
{
	options.AddPolicy(
		"frontend",
		policy => policy
			.WithOrigins("http://localhost:5173")
			.AllowAnyHeader()
			.AllowAnyMethod());
});

var app = builder.Build();

app.UseCors("frontend");

if (app.Environment.IsDevelopment())
{
	app.MapOpenApi();
}

app.MapGet("/courses", async (ILearningContentService service, CancellationToken cancellationToken) =>
{
	var courses = await service.GetCoursesAsync(cancellationToken);
	return Results.Ok(courses);
});

app.MapGet("/lessons/{id:guid}", async (Guid id, ILearningContentService service, CancellationToken cancellationToken) =>
{
	var lesson = await service.GetLessonAsync(id, cancellationToken);
	return lesson is null ? Results.NotFound() : Results.Ok(lesson);
});

app.MapPost("/progress", async (ProgressRequest request, IProgressService service, CancellationToken cancellationToken) =>
{
	var response = await service.SaveProgressAsync(request, cancellationToken);
	return Results.Ok(response);
});

app.MapPost("/code/run", async (CodeRunRequest request, ICodeExecutionService service, CancellationToken cancellationToken) =>
{
	var result = await service.RunAsync(request, cancellationToken);
	return Results.Ok(result);
});

app.MapPost("/ai/hint", async (AiHintRequest request, IAiHintService service, CancellationToken cancellationToken) =>
{
	var hint = await service.GetHintAsync(request, cancellationToken);
	return Results.Ok(hint);
});

await using (var scope = app.Services.CreateAsyncScope())
{
	var dbContext = scope.ServiceProvider.GetRequiredService<DevFoundryDbContext>();
	await dbContext.Database.EnsureCreatedAsync();
	await SeedData.EnsureSeededAsync(dbContext, CancellationToken.None);
}

app.Run();
