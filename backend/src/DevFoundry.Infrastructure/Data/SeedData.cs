using DevFoundry.Domain.Entities;

namespace DevFoundry.Infrastructure.Data;

public static class SeedData
{
    private static readonly Guid SeedUserId = Guid.Parse("00000000-0000-0000-0000-000000000001");

    public static async Task EnsureSeededAsync(DevFoundryDbContext context, CancellationToken cancellationToken)
    {
        if (context.Courses.Any())
        {
            return;
        }

        var user = new User
        {
            Id = SeedUserId,
            Email = "learner@devfoundry.local",
            DisplayName = "MVP Learner",
            TotalXp = 240,
            LearningTrack = "intermediate",
        };

        var course = new Course
        {
            Slug = "javascript-foundations",
            Title = "JavaScript Foundations",
            Description = "Core JavaScript syntax, control flow, and functions.",
        };

        var module = new CourseModule
        {
            CourseId = course.Id,
            Title = "Loops",
            Order = 1,
        };

        var lesson = new Lesson
        {
            CourseId = course.Id,
            ModuleId = module.Id,
            Title = "Controlled Repetition",
            Description = "Use loop constructs to transform values into structured output.",
            XpReward = 120,
        };

        var lessonTwo = new Lesson
        {
            CourseId = course.Id,
            ModuleId = module.Id,
            Title = "Nested Iteration Patterns",
            Description = "Use nested loops to aggregate row-level data from grouped values.",
            XpReward = 140,
        };

        var lessonThree = new Lesson
        {
            CourseId = course.Id,
            ModuleId = module.Id,
            Title = "Array Scoreboard",
            Description = "Sort and format ranked output for a small data set.",
            XpReward = 160,
        };

        var task = new LearningTask
        {
            LessonId = lesson.Id,
            Title = "Scoreboard Formatter",
            Prompt = "Build a summary string by iterating over all score values.",
        };

        var taskTwo = new LearningTask
        {
            LessonId = lessonTwo.Id,
            Title = "Row Total Aggregator",
            Prompt = "Use nested loops to compute each row total and format readable output.",
        };

        var taskThree = new LearningTask
        {
            LessonId = lessonThree.Id,
            Title = "Ranked Scoreboard",
            Prompt = "Sort players by score and return rank-numbered lines.",
        };

        var lessonBranches = new[]
        {
            new LessonBranch
            {
                LessonId = lesson.Id,
                BranchId = "guided-loop-builder",
                Label = "Guided Loop Builder",
                Description = "Stay explicit with one clear loop and a simple result array.",
                Difficulty = "beginner",
                Order = 1,
            },
            new LessonBranch
            {
                LessonId = lesson.Id,
                BranchId = "summary-array-pattern",
                Label = "Summary Array Pattern",
                Description = "Build each row of output in an array, then join once at the end.",
                Difficulty = "intermediate",
                Order = 2,
            },
            new LessonBranch
            {
                LessonId = lesson.Id,
                BranchId = "functional-summary-pass",
                Label = "Functional Summary Pass",
                Description = "Lean on map and join for a shorter, more composable solution.",
                Difficulty = "advanced",
                Order = 3,
            },
            new LessonBranch
            {
                LessonId = lessonTwo.Id,
                BranchId = "row-walkthrough",
                Label = "Row-by-Row Walkthrough",
                Description = "Use one outer loop and one inner loop with explicit running totals.",
                Difficulty = "beginner",
                Order = 1,
            },
            new LessonBranch
            {
                LessonId = lessonTwo.Id,
                BranchId = "loop-approach",
                Label = "Manual Nested Loops",
                Description = "Solve using traditional for loops for full control.",
                Difficulty = "intermediate",
                Order = 2,
            },
            new LessonBranch
            {
                LessonId = lessonTwo.Id,
                BranchId = "functional-approach",
                Label = "Functional Methods",
                Description = "Use map and reduce for a more functional style.",
                Difficulty = "advanced",
                Order = 3,
            },
            new LessonBranch
            {
                LessonId = lessonThree.Id,
                BranchId = "rank-then-print",
                Label = "Rank Then Print",
                Description = "Sort first, then format each ranked player with one straightforward pass.",
                Difficulty = "beginner",
                Order = 1,
            },
            new LessonBranch
            {
                LessonId = lessonThree.Id,
                BranchId = "pipeline-scoreboard",
                Label = "Pipeline Scoreboard",
                Description = "Chain sorting and formatting to keep the solution compact and readable.",
                Difficulty = "intermediate",
                Order = 2,
            },
            new LessonBranch
            {
                LessonId = lessonThree.Id,
                BranchId = "reducer-scoreboard",
                Label = "Reducer Scoreboard",
                Description = "Compose the final scoreboard through a denser functional pipeline.",
                Difficulty = "advanced",
                Order = 3,
            },
        };

        context.Users.Add(user);
        context.Courses.Add(course);
        context.Modules.Add(module);
        context.Lessons.Add(lesson);
        context.Lessons.Add(lessonTwo);
        context.Lessons.Add(lessonThree);
        context.LessonBranches.AddRange(lessonBranches);
        context.Tasks.Add(task);
        context.Tasks.Add(taskTwo);
        context.Tasks.Add(taskThree);

        await context.SaveChangesAsync(cancellationToken);
    }
}
