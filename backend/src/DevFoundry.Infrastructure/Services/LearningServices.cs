using DevFoundry.Application.Contracts;
using DevFoundry.Application.Dtos;
using DevFoundry.Domain.Entities;
using DevFoundry.Infrastructure.Data;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;

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
                    "const matrix = [[3, 5], [4, 2], [10, 1]];\n\nfunction buildRowTotals(rows) {\n  // TODO: nested loop and return readable totals\n  return '';\n}\n\nconsole.log(buildRowTotals(matrix));\n"),
                new(
                    "README.md",
                    "json",
                    "{\n  \"goal\": \"Use nested loops to produce one total per row\"\n}\n"),
            ];
        }

        if (lessonTitle.Contains("Scoreboard", StringComparison.OrdinalIgnoreCase))
        {
            return
            [
                new(
                    "src/main.js",
                    "javascript",
                    "const players = [{ name: 'Ari', score: 18 }, { name: 'Mina', score: 27 }, { name: 'Rex', score: 22 }];\n\nfunction buildScoreboard(entries) {\n  // TODO: rank and format scoreboard output\n  return '';\n}\n\nconsole.log(buildScoreboard(players));\n"),
                new(
                    "README.md",
                    "json",
                    "{\n  \"goal\": \"Return a sorted scoreboard with rank, name, and score\"\n}\n"),
            ];
        }

        return
        [
            new(
                "src/main.js",
                "javascript",
                "const scores = [12, 30, 18, 42];\n\nfunction buildSummary(values) {\n  // TODO\n  return '';\n}\n\nconsole.log(buildSummary(scores));\n"),
            new(
                "README.md",
                "json",
                "{\n  \"goal\": \"Return a summary string with one line per score\"\n}\n"),
        ];
    }
}

public sealed class ProgressService(DevFoundryDbContext context, IConfiguration configuration) : IProgressService
{
    private static readonly HashSet<string> RequiredStepKeys = ["step-1", "step-2", "step-3"];

    private readonly AnswerRetentionMode _answerRetentionMode = ParseRetentionMode(configuration["AnswerRetentionMode"]);

    private enum AnswerRetentionMode
    {
        SystemOnly,
        UserSource,
    }

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

    public async Task<LessonAnswerSnapshotResponse?> GetLessonAnswerSnapshotAsync(Guid userId, Guid courseId, Guid lessonId, CancellationToken cancellationToken)
    {
        var progress = await context.CourseProgress
            .AsNoTracking()
            .FirstOrDefaultAsync(
                entry => entry.UserId == userId
                    && entry.CourseId == courseId
                    && entry.LessonId == lessonId,
                cancellationToken);

        if (progress is null)
        {
            return null;
        }

        var lesson = await context.Lessons
            .AsNoTracking()
            .FirstOrDefaultAsync(entry => entry.Id == lessonId, cancellationToken);

        if (lesson is null)
        {
            return null;
        }

        var answer = progress.StoredAnswerSnapshot;
        if (string.IsNullOrWhiteSpace(answer))
        {
            answer = BuildSystemAnswerForLesson(lesson.Title);
        }

        return new LessonAnswerSnapshotResponse(
            lessonId,
            progress.IsSubmissionLocked,
            progress.AnswerRetentionKind,
            answer);
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

        var latestRun = await context.CodeRuns
            .AsNoTracking()
            .Where(entry => entry.UserId == request.UserId && entry.LessonId == request.LessonId)
            .OrderByDescending(entry => entry.CreatedAtUtc)
            .FirstOrDefaultAsync(cancellationToken);

        if (latestRun is null)
        {
            return new ProgressResult(false, null, "missing_run", "Run your solution successfully before submitting.");
        }

        var latestRunResult = await context.CodeRunResults
            .AsNoTracking()
            .Where(entry => entry.CodeRunId == latestRun.Id)
            .OrderByDescending(entry => entry.CreatedAtUtc)
            .FirstOrDefaultAsync(cancellationToken);

        if (latestRunResult is null || !latestRunResult.Passed)
        {
            return new ProgressResult(false, null, "invalid_run", "Latest run did not pass validation. Fix the code and run again.");
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

        if (progress is not null && progress.IsSubmissionLocked)
        {
            return new ProgressResult(false, null, "already_completed", "Task is already completed and locked. You cannot submit another answer.");
        }

        if (progress is null)
        {
            progress = new CourseProgress
            {
                UserId = request.UserId,
                CourseId = request.CourseId,
                LessonId = request.LessonId,
            };

            // Populate steps before Add so EF Core graph traversal captures them.
            foreach (var stepId in submittedSteps)
            {
                progress.CompletedSteps.Add(new CompletedStep
                {
                    CourseProgressId = progress.Id,
                    StepKey = stepId,
                });
            }

            context.CourseProgress.Add(progress);
        }
        else
        {
            // For re-submission, remove existing steps explicitly then insert fresh ones.
            context.CompletedSteps.RemoveRange(progress.CompletedSteps);
            progress.CompletedSteps.Clear();

            foreach (var stepId in submittedSteps)
            {
                var step = new CompletedStep { CourseProgressId = progress.Id, StepKey = stepId };
                context.CompletedSteps.Add(step);
                progress.CompletedSteps.Add(step);
            }
        }

        var alreadyCompleted = progress.XpEarned > 0;
        var xpDelta = alreadyCompleted ? 0 : lesson.XpReward;
        progress.XpEarned += xpDelta;
        progress.IsSubmissionLocked = true;
        progress.SubmittedAtUtc = DateTimeOffset.UtcNow;
        progress.AnswerRetentionKind = _answerRetentionMode == AnswerRetentionMode.UserSource ? "user-source" : "system-answer";
        progress.StoredAnswerSnapshot = _answerRetentionMode == AnswerRetentionMode.UserSource
            ? latestRun.SourceCode
            : BuildSystemAnswerForLesson(lesson.Title);

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

    private static AnswerRetentionMode ParseRetentionMode(string? configuredMode)
    {
        if (string.Equals(configuredMode, "UserSource", StringComparison.OrdinalIgnoreCase))
        {
            return AnswerRetentionMode.UserSource;
        }

        return AnswerRetentionMode.SystemOnly;
    }

    private static string BuildSystemAnswerForLesson(string lessonTitle)
    {
        if (lessonTitle.Contains("Nested", StringComparison.OrdinalIgnoreCase))
        {
            return "function buildRowTotals(rows) {\n  const lines = [];\n  for (let i = 0; i < rows.length; i++) {\n    let total = 0;\n    for (let j = 0; j < rows[i].length; j++) {\n      total += rows[i][j];\n    }\n    lines.push(`Row ${i + 1}: ${total}`);\n  }\n  return lines.join('\\n');\n}";
        }

        if (lessonTitle.Contains("Scoreboard", StringComparison.OrdinalIgnoreCase))
        {
            return "function buildScoreboard(entries) {\n  return [...entries]\n    .sort((a, b) => b.score - a.score)\n    .map((entry, index) => `${index + 1}. ${entry.name} - ${entry.score}`)\n    .join('\\n');\n}";
        }

        return "function buildSummary(values) {\n  const lines = [];\n  for (let i = 0; i < values.length; i++) {\n    lines.push(`${i + 1}. Score: ${values[i]}`);\n  }\n  return lines.join('\\n');\n}";
    }
}

public sealed class MockCodeExecutionService(DevFoundryDbContext context) : ICodeExecutionService
{
    private static readonly Regex ForLoopRegex = new(@"for\s*\(", RegexOptions.IgnoreCase | RegexOptions.Compiled);

    public async Task<CodeRunResponse> RunAsync(CodeRunRequest request, CancellationToken cancellationToken)
    {
        var lesson = await context.Lessons
            .AsNoTracking()
            .FirstOrDefaultAsync(entry => entry.Id == request.LessonId, cancellationToken);

        if (lesson is null)
        {
            return new CodeRunResponse(false, 8, ["Validation failed.", "Lesson reference is invalid."]);
        }

        var validation = ValidateSourceForLesson(lesson.Title, request.SourceCode);

        var run = new CodeRun
        {
            UserId = request.UserId,
            LessonId = request.LessonId,
            Language = request.Language,
            SourceCode = request.SourceCode,
        };

        context.CodeRuns.Add(run);

        var result = new CodeRunResult
        {
            CodeRunId = run.Id,
            Passed = validation.Passed,
            RuntimeMs = validation.RuntimeMs,
            Logs = validation.Logs.ToArray(),
        };

        context.CodeRunResults.Add(result);
        await context.SaveChangesAsync(cancellationToken);

        return new CodeRunResponse(validation.Passed, validation.RuntimeMs, validation.Logs);
    }

    private static ValidationOutcome ValidateSourceForLesson(string lessonTitle, string sourceCode)
    {
        if (lessonTitle.Contains("Nested", StringComparison.OrdinalIgnoreCase))
        {
            return ValidateNestedLesson(sourceCode);
        }

        if (lessonTitle.Contains("Scoreboard", StringComparison.OrdinalIgnoreCase))
        {
            return ValidateScoreboardLesson(sourceCode);
        }

        return ValidateControlledRepetitionLesson(sourceCode);
    }

    private static ValidationOutcome ValidateControlledRepetitionLesson(string sourceCode)
    {
        var failures = new List<string>();
        var forCount = ForLoopRegex.Matches(sourceCode).Count;

        if (forCount < 1)
        {
            failures.Add("Use a loop to iterate over the input values.");
        }

        if (!sourceCode.Contains("buildSummary", StringComparison.OrdinalIgnoreCase))
        {
            failures.Add("Implement your logic in buildSummary(values).");
        }

        if (!sourceCode.Contains("values", StringComparison.OrdinalIgnoreCase))
        {
            failures.Add("Use the function input (values) rather than hardcoding output.");
        }

        var referencesValueItems = Regex.IsMatch(sourceCode, @"values\s*\[", RegexOptions.IgnoreCase)
            || sourceCode.Contains("forEach", StringComparison.OrdinalIgnoreCase)
            || sourceCode.Contains("map(", StringComparison.OrdinalIgnoreCase);

        if (!referencesValueItems)
        {
            failures.Add("Read each value from the input collection while iterating.");
        }

        var buildsSummary = sourceCode.Contains("push(", StringComparison.OrdinalIgnoreCase)
            || sourceCode.Contains("+=", StringComparison.OrdinalIgnoreCase)
            || sourceCode.Contains("join(", StringComparison.OrdinalIgnoreCase);

        if (!buildsSummary)
        {
            failures.Add("Build a summary string from the iterated values.");
        }

        if (HasEmptyReturnLiteral(sourceCode))
        {
            failures.Add("Return a computed summary, not an empty string literal.");
        }

        if (failures.Count > 0)
        {
            return new ValidationOutcome(false, 14, ["Validation failed.", .. failures]);
        }

        return new ValidationOutcome(
            true,
            10,
            ["Execution complete.", "1. Score: 12", "2. Score: 30", "3. Score: 18", "4. Score: 42"]);
    }

    private static ValidationOutcome ValidateNestedLesson(string sourceCode)
    {
        var failures = new List<string>();
        var forCount = ForLoopRegex.Matches(sourceCode).Count;

        if (forCount < 2)
        {
            failures.Add("Use nested loops to process each row and each value.");
        }

        if (!sourceCode.Contains("rows", StringComparison.OrdinalIgnoreCase))
        {
            failures.Add("Use the rows input in your implementation.");
        }

        if (HasEmptyReturnLiteral(sourceCode))
        {
            failures.Add("Return a computed summary, not an empty string literal.");
        }

        var hasAccumulation = sourceCode.Contains("total", StringComparison.OrdinalIgnoreCase)
            || sourceCode.Contains("+=", StringComparison.OrdinalIgnoreCase);
        if (!hasAccumulation)
        {
            failures.Add("Accumulate each row total before formatting output.");
        }

        if (failures.Count > 0)
        {
            return new ValidationOutcome(false, 15, ["Validation failed.", .. failures]);
        }

        return new ValidationOutcome(
            true,
            11,
            ["Execution complete.", "Row 1: 8", "Row 2: 6", "Row 3: 11"]);
    }

    private static ValidationOutcome ValidateScoreboardLesson(string sourceCode)
    {
        var failures = new List<string>();

        if (!sourceCode.Contains("sort(", StringComparison.OrdinalIgnoreCase))
        {
            failures.Add("Sort players by score before formatting the scoreboard.");
        }

        var hasDescendingComparator = Regex.IsMatch(sourceCode, @"\bb\s*\.\s*score\s*-\s*a\s*\.\s*score", RegexOptions.IgnoreCase)
            || Regex.IsMatch(sourceCode, @"\ba\s*\.\s*score\s*<\s*b\s*\.\s*score", RegexOptions.IgnoreCase);

        if (!hasDescendingComparator)
        {
            failures.Add("Use a descending score comparator in sort.");
        }

        var formatsOutput = sourceCode.Contains("map(", StringComparison.OrdinalIgnoreCase)
            || ForLoopRegex.IsMatch(sourceCode)
            || sourceCode.Contains("forEach", StringComparison.OrdinalIgnoreCase);

        if (!formatsOutput)
        {
            failures.Add("Format each ranked line for the scoreboard output.");
        }

        if (HasEmptyReturnLiteral(sourceCode))
        {
            failures.Add("Return the computed scoreboard, not an empty string literal.");
        }

        if (failures.Count > 0)
        {
            return new ValidationOutcome(false, 15, ["Validation failed.", .. failures]);
        }

        return new ValidationOutcome(
            true,
            12,
            ["Execution complete.", "1. Mina - 27", "2. Rex - 22", "3. Ari - 18"]);
    }

    private sealed record ValidationOutcome(bool Passed, int RuntimeMs, IReadOnlyCollection<string> Logs);

    private static bool HasEmptyReturnLiteral(string sourceCode)
    {
        return sourceCode.Contains("return ''", StringComparison.OrdinalIgnoreCase)
            || sourceCode.Contains("return \"\"", StringComparison.OrdinalIgnoreCase);
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
