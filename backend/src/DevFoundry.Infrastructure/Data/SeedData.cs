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

        context.Users.Add(user);
        context.Courses.Add(course);
        context.Modules.Add(module);
        context.Lessons.Add(lesson);
        context.Lessons.Add(lessonTwo);
        context.Lessons.Add(lessonThree);
        context.Tasks.Add(task);
        context.Tasks.Add(taskTwo);
        context.Tasks.Add(taskThree);

        await context.SaveChangesAsync(cancellationToken);
    }
}
