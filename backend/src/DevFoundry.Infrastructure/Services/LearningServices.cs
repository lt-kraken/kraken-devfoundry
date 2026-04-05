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

    public async Task<LessonDetailDto?> GetLessonAsync(Guid lessonId, string? learningTrack, CancellationToken cancellationToken)
    {
        var lesson = await context.Lessons
            .AsNoTracking()
            .Include(entry => entry.BranchOptions)
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

        var normalizedTrack = NormalizeLearningTrack(learningTrack);
        var steps = BuildStepsForLesson(lesson.Title, normalizedTrack);
        var files = BuildFilesForLesson(lesson.Title, normalizedTrack);
        var hints = BuildHintsForLesson(lesson.Title, normalizedTrack);
        var referenceCode = BuildReferenceSolutionForLesson(lesson.Title, normalizedTrack);
        var branchPoint = BuildBranchPoint(lesson);

        var description = task is null
            ? BuildTrackDescription(lesson.Description, normalizedTrack)
            : $"{BuildTrackDescription(lesson.Description, normalizedTrack)} Task: {task.Prompt}";

        return new LessonDetailDto(lesson.Id, lesson.Title, description, lesson.XpReward, steps, files, hints, referenceCode, branchPoint);
    }

    private static List<LessonStepDto> BuildStepsForLesson(string lessonTitle, string learningTrack)
    {
        if (lessonTitle.Contains("Nested", StringComparison.OrdinalIgnoreCase))
        {
            if (learningTrack == "beginner")
            {
                return
                [
                    new("step-1", "Start with one outer loop over each row", false),
                    new("step-2", "Add an inner loop and keep a running row total", false),
                    new("step-3", "Return one clear line per row total", false),
                ];
            }

            if (learningTrack == "advanced")
            {
                return
                [
                    new("step-1", "Transform each row into a computed total", false),
                    new("step-2", "Compose the summary with a compact functional pass", false),
                    new("step-3", "Return a readable multi-line result", false),
                ];
            }

            return
            [
                new("step-1", "Use a nested loop to process matrix rows", false),
                new("step-2", "Accumulate each row total into a result array", false),
                new("step-3", "Return a readable multi-line summary", false),
            ];
        }

        if (lessonTitle.Contains("Scoreboard", StringComparison.OrdinalIgnoreCase))
        {
            if (learningTrack == "beginner")
            {
                return
                [
                    new("step-1", "Copy and sort players from highest to lowest score", false),
                    new("step-2", "Format each ranked player on its own line", false),
                    new("step-3", "Return the scoreboard string", false),
                ];
            }

            if (learningTrack == "advanced")
            {
                return
                [
                    new("step-1", "Create a descending scoreboard pipeline", false),
                    new("step-2", "Compose ranked lines without mutating the input", false),
                    new("step-3", "Return the final joined scoreboard", false),
                ];
            }

            return
            [
                new("step-1", "Sort players by score descending", false),
                new("step-2", "Format rank, name, and score per line", false),
                new("step-3", "Return the final scoreboard output", false),
            ];
        }

        if (learningTrack == "beginner")
        {
            return
            [
                new("step-1", "Write one loop that visits every score", false),
                new("step-2", "Store each formatted line before joining", false),
                new("step-3", "Return the combined summary string", false),
            ];
        }

        if (learningTrack == "advanced")
        {
            return
            [
                new("step-1", "Transform the values with a concise iteration pattern", false),
                new("step-2", "Compose formatted output without manual index bookkeeping", false),
                new("step-3", "Return the final joined summary", false),
            ];
        }

        return
        [
            new("step-1", "Create a for loop over scores", false),
            new("step-2", "Build a summary string from each value", false),
            new("step-3", "Return the final output", false),
        ];
    }

    private static List<LessonFileDto> BuildFilesForLesson(string lessonTitle, string learningTrack)
    {
        if (lessonTitle.Contains("Nested", StringComparison.OrdinalIgnoreCase))
        {
            if (learningTrack == "beginner")
            {
                return
                [
                    new(
                        "src/main.js",
                        "javascript",
                        "const matrix = [[3, 5], [4, 2], [10, 1]];\n\nfunction buildRowTotals(rows) {\n  const lines = [];\n\n  for (const row of rows) {\n    let total = 0;\n    // TODO: add an inner loop that updates total\n    lines.push(`Row total: ${total}`);\n  }\n\n  return lines.join('\\n');\n}\n\nconsole.log(buildRowTotals(matrix));\n"),
                    new(
                        "README.md",
                        "json",
                        "{\n  \"goal\": \"Use two loops and build one line per row total\"\n}\n"),
                ];
            }

            if (learningTrack == "advanced")
            {
                return
                [
                    new(
                        "src/main.js",
                        "javascript",
                        "const matrix = [[3, 5], [4, 2], [10, 1]];\n\nfunction buildRowTotals(rows) {\n  // TODO: compute each row total with map/reduce and join the final lines\n  return '';\n}\n\nconsole.log(buildRowTotals(matrix));\n"),
                    new(
                        "README.md",
                        "json",
                        "{\n  \"goal\": \"Use a functional pass to compute row totals and format output\"\n}\n"),
                ];
            }

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
            if (learningTrack == "beginner")
            {
                return
                [
                    new(
                        "src/main.js",
                        "javascript",
                        "const players = [{ name: 'Ari', score: 18 }, { name: 'Mina', score: 27 }, { name: 'Rex', score: 22 }];\n\nfunction buildScoreboard(entries) {\n  const rankedPlayers = [...entries].sort((a, b) => b.score - a.score);\n  const lines = [];\n\n  // TODO: loop over rankedPlayers and push one line per player\n  return lines.join('\\n');\n}\n\nconsole.log(buildScoreboard(players));\n"),
                    new(
                        "README.md",
                        "json",
                        "{\n  \"goal\": \"Sort scores first, then build the scoreboard line by line\"\n}\n"),
                ];
            }

            if (learningTrack == "advanced")
            {
                return
                [
                    new(
                        "src/main.js",
                        "javascript",
                        "const players = [{ name: 'Ari', score: 18 }, { name: 'Mina', score: 27 }, { name: 'Rex', score: 22 }];\n\nfunction buildScoreboard(entries) {\n  // TODO: build the scoreboard with a non-mutating sort and a compact functional chain\n  return '';\n}\n\nconsole.log(buildScoreboard(players));\n"),
                    new(
                        "README.md",
                        "json",
                        "{\n  \"goal\": \"Use a functional pipeline to return the ranked scoreboard\"\n}\n"),
                ];
            }

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

        if (learningTrack == "beginner")
        {
            return
            [
                new(
                    "src/main.js",
                    "javascript",
                    "const scores = [12, 30, 18, 42];\n\nfunction buildSummary(values) {\n  const lines = [];\n\n  for (const value of values) {\n    // TODO: push one formatted line into lines\n  }\n\n  return lines.join('\\n');\n}\n\nconsole.log(buildSummary(scores));\n"),
                new(
                    "README.md",
                    "json",
                    "{\n  \"goal\": \"Use one loop and build the result one line at a time\"\n}\n"),
            ];
        }

        if (learningTrack == "advanced")
        {
            return
            [
                new(
                    "src/main.js",
                    "javascript",
                    "const scores = [12, 30, 18, 42];\n\nfunction buildSummary(values) {\n  // TODO: transform values with map and join the formatted output\n  return '';\n}\n\nconsole.log(buildSummary(scores));\n"),
                new(
                    "README.md",
                    "json",
                    "{\n  \"goal\": \"Return a summary string using a concise functional pass\"\n}\n"),
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

    private static List<LessonHintDto> BuildHintsForLesson(string lessonTitle, string learningTrack)
    {
        if (lessonTitle.Contains("Nested", StringComparison.OrdinalIgnoreCase))
        {
            return learningTrack switch
            {
                "beginner" =>
                [
                    new("hint-1", "Outer loop first", "Start with the rows, then add a second loop for values inside each row."),
                    new("hint-2", "Running total", "Create total inside the outer loop so each row starts fresh before you sum it."),
                ],
                "advanced" =>
                [
                    new("hint-1", "Map rows", "Map each row into a total, then format the totals into lines."),
                    new("hint-2", "Reducer option", "Use reduce inside the map callback to collapse each row into one number."),
                ],
                _ =>
                [
                    new("hint-1", "Nested loops", "Loop outer rows first, then inner values to build a row total."),
                ],
            };
        }

        if (lessonTitle.Contains("Scoreboard", StringComparison.OrdinalIgnoreCase))
        {
            return learningTrack switch
            {
                "beginner" =>
                [
                    new("hint-1", "Copy before sort", "Use [...entries] before sort so you keep the original input intact."),
                    new("hint-2", "Build lines", "After sorting, loop over the ranked players and push one formatted line per player."),
                ],
                "advanced" =>
                [
                    new("hint-1", "Pipeline", "Use a non-mutating sort followed by map and join for a compact scoreboard."),
                    new("hint-2", "Rank index", "The map index gives you the rank, so you do not need a separate counter."),
                ],
                _ =>
                [
                    new("hint-1", "Sorting", "Use a copy of the array before sorting so starter values remain intact."),
                ],
            };
        }

        return learningTrack switch
        {
            "beginner" =>
            [
                new("hint-1", "Start simple", "Create an array of lines, loop through each value, then join once at the end."),
                new("hint-2", "Formatting", "Push strings like `${index + 1}. Score: ${value}` as you loop."),
            ],
            "advanced" =>
            [
                new("hint-1", "Functional pass", "Map the values into formatted strings and join them with newline characters."),
                new("hint-2", "Avoid extra state", "The array index from map can provide the rank without a manual counter."),
            ],
            _ =>
            [
                new("hint-1", "Need a starting point?", "Start with let summary = []; then push each formatted score inside the loop and join at the end."),
                new("hint-2", "Formatting output", "Use template strings like `${index + 1}. Score: ${score}` to keep output readable."),
            ],
        };
    }

    private static string BuildReferenceSolutionForLesson(string lessonTitle, string learningTrack)
    {
        if (lessonTitle.Contains("Nested", StringComparison.OrdinalIgnoreCase))
        {
            return learningTrack switch
            {
                "beginner" => "function buildRowTotals(rows) {\n  const lines = [];\n  for (const row of rows) {\n    let total = 0;\n    for (const value of row) {\n      total += value;\n    }\n    lines.push(`Row total: ${total}`);\n  }\n  return lines.join('\\n');\n}",
                "advanced" => "function buildRowTotals(rows) {\n  return rows\n    .map((row, index) => `Row ${index + 1}: ${row.reduce((total, value) => total + value, 0)}`)\n    .join('\\n');\n}",
                _ => "function buildRowTotals(rows) {\n  const lines = [];\n  for (let i = 0; i < rows.length; i++) {\n    let total = 0;\n    for (let j = 0; j < rows[i].length; j++) {\n      total += rows[i][j];\n    }\n    lines.push(`Row ${i + 1}: ${total}`);\n  }\n  return lines.join('\\n');\n}",
            };
        }

        if (lessonTitle.Contains("Scoreboard", StringComparison.OrdinalIgnoreCase))
        {
            return learningTrack switch
            {
                "beginner" => "function buildScoreboard(entries) {\n  const rankedPlayers = [...entries].sort((a, b) => b.score - a.score);\n  const lines = [];\n  for (let i = 0; i < rankedPlayers.length; i++) {\n    const player = rankedPlayers[i];\n    lines.push(`${i + 1}. ${player.name} - ${player.score}`);\n  }\n  return lines.join('\\n');\n}",
                "advanced" => "function buildScoreboard(entries) {\n  return [...entries]\n    .toSorted((a, b) => b.score - a.score)\n    .map((entry, index) => `${index + 1}. ${entry.name} - ${entry.score}`)\n    .join('\\n');\n}",
                _ => "function buildScoreboard(entries) {\n  return [...entries]\n    .sort((a, b) => b.score - a.score)\n    .map((entry, index) => `${index + 1}. ${entry.name} - ${entry.score}`)\n    .join('\\n');\n}",
            };
        }

        return learningTrack switch
        {
            "beginner" => "function buildSummary(values) {\n  const lines = [];\n  for (const value of values) {\n    lines.push(`${lines.length + 1}. Score: ${value}`);\n  }\n  return lines.join('\\n');\n}",
            "advanced" => "function buildSummary(values) {\n  return values\n    .map((value, index) => `${index + 1}. Score: ${value}`)\n    .join('\\n');\n}",
            _ => "function buildSummary(values) {\n  const lines = [];\n  for (let i = 0; i < values.length; i++) {\n    lines.push(`${i + 1}. Score: ${values[i]}`);\n  }\n  return lines.join('\\n');\n}",
        };
    }

    private static BranchPointDto? BuildBranchPoint(Lesson lesson)
    {
        if (lesson.BranchOptions.Count == 0)
        {
            return null;
        }

        return new BranchPointDto(
            "Preferred solution path",
            lesson.BranchOptions
                .OrderBy(option => option.Order)
                .Select(option => new BranchOptionDto(option.BranchId, option.Label, option.Description, option.Difficulty))
                .ToList());
    }

    private static string BuildTrackDescription(string baseDescription, string learningTrack)
    {
        return learningTrack switch
        {
            "beginner" => $"{baseDescription} This track keeps the solution explicit and step-by-step.",
            "advanced" => $"{baseDescription} This track favors compact, composable patterns and fewer manual steps.",
            _ => baseDescription,
        };
    }

    private static string NormalizeLearningTrack(string? learningTrack)
    {
        if (string.Equals(learningTrack, "beginner", StringComparison.OrdinalIgnoreCase))
        {
            return "beginner";
        }

        if (string.Equals(learningTrack, "advanced", StringComparison.OrdinalIgnoreCase))
        {
            return "advanced";
        }

        return "intermediate";
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

    public async Task SaveBranchSelectionAsync(BranchSelectionRequest request, CancellationToken cancellationToken)
    {
        var progress = await context.CourseProgress
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
                SelectedBranchId = request.BranchId,
            };

            context.CourseProgress.Add(progress);
        }
        else
        {
            progress.SelectedBranchId = request.BranchId;
        }

        await context.SaveChangesAsync(cancellationToken);
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

public sealed class LearningPreferencesService(DevFoundryDbContext context) : ILearningPreferencesService
{
    public async Task<LearningTrackPreferenceResponse> GetLearningTrackAsync(Guid userId, CancellationToken cancellationToken)
    {
        var user = await context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(entry => entry.Id == userId, cancellationToken);

        return new LearningTrackPreferenceResponse(NormalizeLearningTrack(user?.LearningTrack));
    }

    public async Task<LearningTrackPreferenceResponse> SetLearningTrackAsync(
        Guid userId,
        UpdateLearningTrackPreferenceRequest request,
        CancellationToken cancellationToken)
    {
        var normalizedTrack = NormalizeLearningTrack(request.LearningTrack);
        var user = await context.Users.FirstOrDefaultAsync(entry => entry.Id == userId, cancellationToken);

        if (user is null)
        {
            user = new User
            {
                Id = userId,
                Email = $"learner-{userId:N}@devfoundry.local",
                DisplayName = "Learner",
                LearningTrack = normalizedTrack,
            };

            context.Users.Add(user);
        }
        else
        {
            user.LearningTrack = normalizedTrack;
        }

        await context.SaveChangesAsync(cancellationToken);
        return new LearningTrackPreferenceResponse(normalizedTrack);
    }

    private static string NormalizeLearningTrack(string? learningTrack)
    {
        if (string.Equals(learningTrack, "beginner", StringComparison.OrdinalIgnoreCase))
        {
            return "beginner";
        }

        if (string.Equals(learningTrack, "advanced", StringComparison.OrdinalIgnoreCase))
        {
            return "advanced";
        }

        return "intermediate";
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
        var normalizedTrack = NormalizeLearningTrack(request.LearningTrack);

        var hint = normalizedTrack switch
        {
            "beginner" => "Start from the visible structure in the starter code. Finish one small step first, then build the final string at the end.",
            "advanced" => "Look for a concise transformation pipeline so each collection pass has one job and the return stays compact.",
            _ => "Use a loop or focused collection pass to build one formatted line at a time, then return the combined string.",
        };

        var explanation = normalizedTrack switch
        {
            "beginner" => "Keep the control flow obvious: initialize a result container, fill it during iteration, and join or return once after the loop.",
            "advanced" => "Prefer composable operations like map or reduce when they keep the intent clear and avoid extra mutable bookkeeping.",
            _ => "Build the result progressively, keep formatting near the iteration, and avoid returning an empty literal.",
        };

        return Task.FromResult(
            new AiHintResponse(hint, explanation));
    }

    private static string NormalizeLearningTrack(string? learningTrack)
    {
        if (string.Equals(learningTrack, "beginner", StringComparison.OrdinalIgnoreCase))
        {
            return "beginner";
        }

        if (string.Equals(learningTrack, "advanced", StringComparison.OrdinalIgnoreCase))
        {
            return "advanced";
        }

        return "intermediate";
    }
}
