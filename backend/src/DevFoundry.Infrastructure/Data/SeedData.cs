using DevFoundry.Domain.Entities;

namespace DevFoundry.Infrastructure.Data;

public static class SeedData
{
    public static async Task EnsureSeededAsync(DevFoundryDbContext context, CancellationToken cancellationToken)
    {
        if (context.Courses.Any())
        {
            return;
        }

        var user = new User
        {
            Email = "learner@devfoundry.local",
            DisplayName = "MVP Learner",
            TotalXp = 240,
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

        var task = new LearningTask
        {
            LessonId = lesson.Id,
            Title = "Scoreboard Formatter",
            Prompt = "Build a summary string by iterating over all score values.",
        };

        context.Users.Add(user);
        context.Courses.Add(course);
        context.Modules.Add(module);
        context.Lessons.Add(lesson);
        context.Tasks.Add(task);

        await context.SaveChangesAsync(cancellationToken);
    }
}
