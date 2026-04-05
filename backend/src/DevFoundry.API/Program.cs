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
			.WithOrigins("http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176")
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
	var lesson = await service.GetLessonAsync(id, null, cancellationToken);
	return lesson is null ? Results.NotFound() : Results.Ok(lesson);
});

app.MapGet("/lessons/{id:guid}/{track}", async (Guid id, string track, ILearningContentService service, CancellationToken cancellationToken) =>
{
	var lesson = await service.GetLessonAsync(id, track, cancellationToken);
	return lesson is null ? Results.NotFound() : Results.Ok(lesson);
});

app.MapPost("/progress", async (ProgressRequest request, IProgressService service, CancellationToken cancellationToken) =>
{
	var result = await service.SaveProgressAsync(request, cancellationToken);
	if (!result.Succeeded)
	{
		return Results.BadRequest(new
		{
			errorCode = result.ErrorCode,
			message = result.ErrorMessage,
		});
	}

	return Results.Ok(result.Progress);
});

app.MapGet("/progress/{userId:guid}/{courseId:guid}", async (Guid userId, Guid courseId, IProgressService service, CancellationToken cancellationToken) =>
{
	var response = await service.GetCourseProgressAsync(userId, courseId, cancellationToken);
	return Results.Ok(response);
});

app.MapGet("/progress/{userId:guid}/{courseId:guid}/{lessonId:guid}/answer", async (Guid userId, Guid courseId, Guid lessonId, IProgressService service, CancellationToken cancellationToken) =>
{
	var response = await service.GetLessonAnswerSnapshotAsync(userId, courseId, lessonId, cancellationToken);
	return response is null ? Results.NotFound() : Results.Ok(response);
});

app.MapPost("/progress/branch", async (BranchSelectionRequest request, IProgressService service, CancellationToken cancellationToken) =>
{
	await service.SaveBranchSelectionAsync(request, cancellationToken);
	return Results.NoContent();
});

app.MapGet("/users/{userId:guid}/preferences/learning-track", async (Guid userId, ILearningPreferencesService service, CancellationToken cancellationToken) =>
{
	var response = await service.GetLearningTrackAsync(userId, cancellationToken);
	return Results.Ok(response);
});

app.MapPut("/users/{userId:guid}/preferences/learning-track", async (Guid userId, UpdateLearningTrackPreferenceRequest request, ILearningPreferencesService service, CancellationToken cancellationToken) =>
{
	var response = await service.SetLearningTrackAsync(userId, request, cancellationToken);
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
