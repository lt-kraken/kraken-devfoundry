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
        var courses = await context.Courses
            .AsNoTracking()
            .OrderBy(course => course.Title)
            .ToListAsync(cancellationToken);

        var lessons = await context.Lessons
            .AsNoTracking()
            .OrderBy(lesson => lesson.CreatedAtUtc)
            .ThenBy(lesson => lesson.Id)
            .ToListAsync(cancellationToken);

        return courses
            .Select(course =>
            {
                var courseLessons = lessons
                    .Where(lesson => lesson.CourseId == course.Id)
                    .Select(lesson => new LessonNavItemDto(lesson.Id, lesson.Title))
                    .ToList();

                return new CourseSummaryDto(
                    course.Id,
                    course.Slug,
                    course.Title,
                    course.Description,
                    courseLessons.FirstOrDefault()?.Id,
                    courseLessons);
            })
            .ToList();
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

        var steps = BuildStepsForLesson(lesson.Title);
        var files = BuildFilesForLesson(lesson.Title);

        var description = task is null
            ? lesson.Description
            : $"{lesson.Description} Task: {task.Prompt}";

        return new LessonDetailDto(lesson.Id, lesson.Title, description, lesson.XpReward, steps, files);
    }

    private static List<LessonStepDto> BuildStepsForLesson(string lessonTitle)
    {
        if (lessonTitle.Contains("Nested", StringComparison.OrdinalIgnoreCase))
        {
            return
            [
                new("step-1", "Use a nested loop to process matrix rows", false),
                new("step-2", "Accumulate each row total into a result array", false),
                new("step-3", "Return a readable multi-line summary", false),
            ];
        }

        if (lessonTitle.Contains("Scoreboard", StringComparison.OrdinalIgnoreCase))
        {
            return
            [
                new("step-1", "Sort players by score descending", false),
                new("step-2", "Format rank, name, and score per line", false),
                new("step-3", "Return the final scoreboard output", false),
            ];
        }

        return
        [
            new("step-1", "Create a for loop over scores", false),
            new("step-2", "Build a summary string from each value", false),
            new("step-3", "Return the final output", false),
        ];
    }

    private static List<LessonFileDto> BuildFilesForLesson(string lessonTitle)
    {
        if (lessonTitle.Contains("Nested", StringComparison.OrdinalIgnoreCase))
        {
            return
            [
                new(
                    "src/main.js",
                    "javascript",
                    "const matrix = [[3, 5], [4, 2], [10, 1]];\\n\\nfunction buildRowTotals(rows) {\\n  // TODO: nested loop and return readable totals\\n  return '';\\n}\\n\\nconsole.log(buildRowTotals(matrix));\\n"),
                new(
                    "README.md",
                    "json",
                    "{\\n  \"goal\": \"Use nested loops to produce one total per row\"\\n}\\n"),
            ];
        }

        if (lessonTitle.Contains("Scoreboard", StringComparison.OrdinalIgnoreCase))
        {
            return
            [
                new(
                    "src/main.js",
                    "javascript",
                    "const players = [{ name: 'Ari', score: 18 }, { name: 'Mina', score: 27 }, { name: 'Rex', score: 22 }];\\n\\nfunction buildScoreboard(entries) {\\n  // TODO: rank and format scoreboard output\\n  return '';\\n}\\n\\nconsole.log(buildScoreboard(players));\\n"),
                new(
                    "README.md",
                    "json",
                    "{\\n  \"goal\": \"Return a sorted scoreboard with rank, name, and score\"\\n}\\n"),
            ];
        }

        return
        [
            new(
                "src/main.js",
                "javascript",
                "const scores = [12, 30, 18, 42];\\n\\nfunction buildSummary(values) {\\n  // TODO\\n  return '';\\n}\\n\\nconsole.log(buildSummary(scores));\\n"),
            new(
                "README.md",
                "json",
                "{\\n  \"goal\": \"Return a summary string with one line per score\"\\n}\\n"),
        ];
    }
}

public sealed class ProgressService(DevFoundryDbContext context) : IProgressService
{
    private static readonly HashSet<string> RequiredStepKeys = ["step-1", "step-2", "step-3"];

    public async Task<CourseProgressSnapshotResponse> GetCourseProgressAsync(Guid userId, Guid courseId, CancellationToken cancellationToken)
    {
        var progressEntries = await context.CourseProgress
            .AsNoTracking()
            .Include(entry => entry.CompletedSteps)
            .Where(entry => entry.UserId == userId && entry.CourseId == courseId)
            .ToListAsync(cancellationToken);

        var completedLessonIds = progressEntries
            .Where(IsLessonCompleted)
            .Select(entry => entry.LessonId)
            .Distinct()
            .ToList();

        var user = await context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(entry => entry.Id == userId, cancellationToken);

        var totalXp = user?.TotalXp ?? progressEntries.Sum(entry => entry.XpEarned);
        return new CourseProgressSnapshotResponse(totalXp, completedLessonIds);
    }

    public async Task<ProgressResult> SaveProgressAsync(ProgressRequest request, CancellationToken cancellationToken)
    {
        var lesson = await context.Lessons
            .AsNoTracking()
            .FirstOrDefaultAsync(entry => entry.Id == request.LessonId, cancellationToken);

        if (lesson is null || lesson.CourseId != request.CourseId)
        {
            return new ProgressResult(false, null, "invalid_lesson", "Lesson or course reference is invalid.");
        }

        var submittedSteps = request.CompletedStepIds
            .Where(step => !string.IsNullOrWhiteSpace(step))
            .Select(step => step.Trim())
            .ToHashSet(StringComparer.OrdinalIgnoreCase);

        var invalidSteps = submittedSteps
            .Where(step => !RequiredStepKeys.Contains(step))
            .ToList();

        if (invalidSteps.Count > 0)
        {
            return new ProgressResult(false, null, "invalid_steps", "Submitted steps contain unknown step ids.");
        }

        if (RequiredStepKeys.Any(step => !submittedSteps.Contains(step)))
        {
            return new ProgressResult(false, null, "incomplete_steps", "Complete all required steps before submitting.");
        }

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
        foreach (var stepId in submittedSteps)
        {
            progress.CompletedSteps.Add(new CompletedStep { StepKey = stepId });
        }

        var alreadyCompleted = progress.XpEarned > 0;
        var xpDelta = alreadyCompleted ? 0 : lesson.XpReward;
        progress.XpEarned += xpDelta;

        var user = await context.Users.FirstOrDefaultAsync(entry => entry.Id == request.UserId, cancellationToken);
        if (user is not null)
        {
            user.TotalXp += xpDelta;
        }

        await context.SaveChangesAsync(cancellationToken);

        Guid? nextLessonId = null;
        var orderedLessonIds = await context.Lessons
            .AsNoTracking()
            .Where(entry => entry.CourseId == request.CourseId)
            .OrderBy(entry => entry.CreatedAtUtc)
            .ThenBy(entry => entry.Id)
            .Select(entry => entry.Id)
            .ToListAsync(cancellationToken);

        var currentIndex = orderedLessonIds.FindIndex(entry => entry == request.LessonId);
        if (currentIndex >= 0 && currentIndex + 1 < orderedLessonIds.Count)
        {
            nextLessonId = orderedLessonIds[currentIndex + 1];
        }

        var isCourseCompleted = nextLessonId is null;
        var message = isCourseCompleted
            ? "Lesson complete. Course complete!"
            : "Lesson complete. Ready for the next task.";

        return new ProgressResult(
            true,
            new ProgressResponse(
                user?.TotalXp ?? xpDelta,
                xpDelta,
                nextLessonId,
                true,
                isCourseCompleted,
                message),
            null,
            null);
    }

    private static bool IsLessonCompleted(CourseProgress entry)
    {
        var completed = entry.CompletedSteps
            .Select(step => step.StepKey)
            .ToHashSet(StringComparer.OrdinalIgnoreCase);

        return RequiredStepKeys.All(completed.Contains);
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
