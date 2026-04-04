using DevFoundry.Application.Contracts;
using DevFoundry.Application.Dtos;
using DevFoundry.Domain.Entities;
using DevFoundry.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace DevFoundry.Infrastructure.Services;

public sealed class LearningContentService(DevFoundryDbContext context) : ILearningContentService
{
    public async Task<IReadOnlyCollection<CourseSummaryDto>> GetCoursesAsync(CancellationToken cancellationToken)
    {
        return await context.Courses
            .AsNoTracking()
            .OrderBy(course => course.Title)
            .Select(course => new CourseSummaryDto(
                course.Id,
                course.Slug,
                course.Title,
                course.Description,
                context.Lessons
                    .Where(lesson => lesson.CourseId == course.Id)
                    .OrderBy(lesson => lesson.CreatedAtUtc)
                    .Select(lesson => (Guid?)lesson.Id)
                    .FirstOrDefault()))
            .ToListAsync(cancellationToken);
    }

    public async Task<LessonDetailDto?> GetLessonAsync(Guid lessonId, CancellationToken cancellationToken)
    {
        var lesson = await context.Lessons
            .AsNoTracking()
            .FirstOrDefaultAsync(entry => entry.Id == lessonId, cancellationToken);

        if (lesson is null)
        {
            return null;
        }

        var task = await context.Tasks
            .AsNoTracking()
            .Where(entry => entry.LessonId == lessonId)
            .OrderBy(entry => entry.CreatedAtUtc)
            .FirstOrDefaultAsync(cancellationToken);

        var steps = new List<LessonStepDto>
        {
            new("step-1", "Create a for loop over scores", false),
            new("step-2", "Build a summary string from each value", false),
            new("step-3", "Return the final output", false),
        };

        var files = new List<LessonFileDto>
        {
            new(
                "src/main.js",
                "javascript",
                "const scores = [12, 30, 18, 42];\\n\\nfunction buildSummary(values) {\\n  // TODO\\n  return '';\\n}\\n\\nconsole.log(buildSummary(scores));\\n"),
            new(
                "README.md",
                "json",
                "{\\n  \"goal\": \"Return a summary string with one line per score\"\\n}\\n"),
        };

        var description = task is null
            ? lesson.Description
            : $"{lesson.Description} Task: {task.Prompt}";

        return new LessonDetailDto(lesson.Id, lesson.Title, description, lesson.XpReward, steps, files);
    }
}

public sealed class ProgressService(DevFoundryDbContext context) : IProgressService
{
    public async Task<ProgressResponse> SaveProgressAsync(ProgressRequest request, CancellationToken cancellationToken)
    {
        var progress = await context.CourseProgress
            .Include(entry => entry.CompletedSteps)
            .FirstOrDefaultAsync(
                entry => entry.UserId == request.UserId
                    && entry.CourseId == request.CourseId
                    && entry.LessonId == request.LessonId,
                cancellationToken);

        if (progress is null)
        {
            progress = new CourseProgress
            {
                UserId = request.UserId,
                CourseId = request.CourseId,
                LessonId = request.LessonId,
            };
            context.CourseProgress.Add(progress);
        }

        progress.CompletedSteps.Clear();
        foreach (var stepId in request.CompletedStepIds)
        {
            progress.CompletedSteps.Add(new CompletedStep { StepKey = stepId });
        }

        var xpDelta = request.CompletedStepIds.Count >= 3 ? 120 : 40;
        progress.XpEarned += xpDelta;

        var user = await context.Users.FirstOrDefaultAsync(entry => entry.Id == request.UserId, cancellationToken);
        if (user is not null)
        {
            user.TotalXp += xpDelta;
        }

        await context.SaveChangesAsync(cancellationToken);

        return new ProgressResponse(user?.TotalXp ?? xpDelta, xpDelta);
    }
}

public sealed class MockCodeExecutionService : ICodeExecutionService
{
    public Task<CodeRunResponse> RunAsync(CodeRunRequest request, CancellationToken cancellationToken)
    {
        var hasLoop = request.SourceCode.Contains("for", StringComparison.OrdinalIgnoreCase);
        var hasReturn = request.SourceCode.Contains("return", StringComparison.OrdinalIgnoreCase);

        if (!hasLoop || !hasReturn)
        {
            return Task.FromResult(
                new CodeRunResponse(
                    false,
                    17,
                    ["Validation failed.", "Expected a loop and return statement in buildSummary()."]));
        }

        return Task.FromResult(
            new CodeRunResponse(
                true,
                10,
                ["Execution complete.", "1. Score: 12", "2. Score: 30", "3. Score: 18", "4. Score: 42"]));
    }
}

public sealed class MockAiHintService : IAiHintService
{
    public Task<AiHintResponse> GetHintAsync(AiHintRequest request, CancellationToken cancellationToken)
    {
        return Task.FromResult(
            new AiHintResponse(
                "Use a loop to append one formatted line per score, then return one joined string.",
                "Start with an array, push each line with template literals, and join using newline characters."));
    }
}
