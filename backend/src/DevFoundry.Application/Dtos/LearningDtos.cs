namespace DevFoundry.Application.Dtos;

public sealed record LessonNavItemDto(Guid Id, string Title);

public sealed record CourseSummaryDto(
    Guid Id,
    string Slug,
    string Title,
    string Description,
    Guid? FirstLessonId,
    IReadOnlyCollection<LessonNavItemDto> Lessons);

public sealed record LessonStepDto(string Id, string Label, bool Completed);

public sealed record LessonFileDto(string Path, string Language, string StarterCode);

public sealed record LessonDetailDto(
    Guid Id,
    string Title,
    string Description,
    int XpReward,
    IReadOnlyCollection<LessonStepDto> Steps,
    IReadOnlyCollection<LessonFileDto> Files);

public sealed record ProgressRequest(Guid UserId, Guid CourseId, Guid LessonId, IReadOnlyCollection<string> CompletedStepIds);

public sealed record ProgressResponse(
    int TotalXp,
    int EarnedXp,
    Guid? NextLessonId,
    bool LessonCompleted,
    bool CourseCompleted,
    string Message);

public sealed record ProgressResult(bool Succeeded, ProgressResponse? Progress, string? ErrorCode, string? ErrorMessage);

public sealed record CourseProgressSnapshotResponse(int TotalXp, IReadOnlyCollection<Guid> CompletedLessonIds);

public sealed record LessonAnswerSnapshotResponse(
    Guid LessonId,
    bool IsSubmissionLocked,
    string RetentionKind,
    string Answer);

public sealed record CodeRunRequest(Guid UserId, Guid LessonId, string Language, string SourceCode);

public sealed record CodeRunResponse(bool Passed, int RuntimeMs, IReadOnlyCollection<string> Logs);

public sealed record AiHintRequest(Guid LessonId, string StepId, string CurrentCode);

public sealed record AiHintResponse(string Hint, string Explanation);
