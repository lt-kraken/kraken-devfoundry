namespace DevFoundry.Domain.Entities;

/// <summary>
/// Base entity for all persisted models.
/// </summary>
public abstract class EntityBase
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public DateTimeOffset CreatedAtUtc { get; set; } = DateTimeOffset.UtcNow;
}

public sealed class User : EntityBase
{
    public required string Email { get; set; }
    public required string DisplayName { get; set; }
    public int TotalXp { get; set; }
}

public sealed class Course : EntityBase
{
    public required string Slug { get; set; }
    public required string Title { get; set; }
    public required string Description { get; set; }
    public ICollection<CourseModule> Modules { get; set; } = new List<CourseModule>();
}

public sealed class CourseModule : EntityBase
{
    public Guid CourseId { get; set; }
    public required string Title { get; set; }
    public int Order { get; set; }
}

public sealed class Lesson : EntityBase
{
    public Guid CourseId { get; set; }
    public Guid ModuleId { get; set; }
    public required string Title { get; set; }
    public required string Description { get; set; }
    public int XpReward { get; set; }
    public Guid? BranchPointId { get; set; }
    public ICollection<LessonBranch> BranchOptions { get; set; } = new List<LessonBranch>();
}

public sealed class LearningTask : EntityBase
{
    public Guid LessonId { get; set; }
    public required string Title { get; set; }
    public required string Prompt { get; set; }
}

public sealed class CourseProgress : EntityBase
{
    public Guid UserId { get; set; }
    public Guid CourseId { get; set; }
    public Guid LessonId { get; set; }
    public int XpEarned { get; set; }
    public bool IsSubmissionLocked { get; set; }
    public string AnswerRetentionKind { get; set; } = "none";
    public string? StoredAnswerSnapshot { get; set; }
    public DateTimeOffset? SubmittedAtUtc { get; set; }
    public string? SelectedBranchId { get; set; }
    public ICollection<CompletedStep> CompletedSteps { get; set; } = new List<CompletedStep>();
}

public sealed class CompletedStep : EntityBase
{
    public Guid CourseProgressId { get; set; }
    public required string StepKey { get; set; }
}

public sealed class LessonBranch : EntityBase
{
    public Guid LessonId { get; set; }
    public required string BranchId { get; set; }
    public required string Label { get; set; }
    public required string Description { get; set; }
    public Guid? NextLessonId { get; set; }
    public string Difficulty { get; set; } = "intermediate";
    public int Order { get; set; }
}

public sealed class CodeRun : EntityBase
{
    public Guid UserId { get; set; }
    public Guid LessonId { get; set; }
    public required string Language { get; set; }
    public required string SourceCode { get; set; }
}

public sealed class CodeRunResult : EntityBase
{
    public Guid CodeRunId { get; set; }
    public bool Passed { get; set; }
    public int RuntimeMs { get; set; }
    public required string[] Logs { get; set; }
}

// Future-ready entities for organization support.
public sealed class Organization : EntityBase
{
    public required string Name { get; set; }
}

public sealed class Workspace : EntityBase
{
    public Guid OrganizationId { get; set; }
    public required string Name { get; set; }
}

public sealed class CustomCourse : EntityBase
{
    public Guid OrganizationId { get; set; }
    public required string Title { get; set; }
}

public sealed class KnowledgeBase : EntityBase
{
    public Guid OrganizationId { get; set; }
    public required string Name { get; set; }
}
