namespace DevFoundry.Application.Dtos;

public sealed record CourseSummaryDto(Guid Id, string Slug, string Title, string Description, Guid? FirstLessonId);

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

public sealed record ProgressResponse(int TotalXp, int EarnedXp);

public sealed record CodeRunRequest(Guid UserId, Guid LessonId, string Language, string SourceCode);

public sealed record CodeRunResponse(bool Passed, int RuntimeMs, IReadOnlyCollection<string> Logs);

public sealed record AiHintRequest(Guid LessonId, string StepId, string CurrentCode);

public sealed record AiHintResponse(string Hint, string Explanation);
