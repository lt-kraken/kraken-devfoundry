using DevFoundry.Application.Dtos;

namespace DevFoundry.Application.Contracts;

/// <summary>
/// Provides read operations for course and lesson content.
/// </summary>
public interface ILearningContentService
{
    Task<IReadOnlyCollection<CourseSummaryDto>> GetCoursesAsync(CancellationToken cancellationToken);
    Task<LessonDetailDto?> GetLessonAsync(Guid lessonId, string? learningTrack, CancellationToken cancellationToken);
}

/// <summary>
/// Handles user learning progress and XP updates.
/// </summary>
public interface IProgressService
{
    Task<CourseProgressSnapshotResponse> GetCourseProgressAsync(Guid userId, Guid courseId, CancellationToken cancellationToken);
    Task<LessonAnswerSnapshotResponse?> GetLessonAnswerSnapshotAsync(Guid userId, Guid courseId, Guid lessonId, CancellationToken cancellationToken);
    Task<ProgressResult> SaveProgressAsync(ProgressRequest request, CancellationToken cancellationToken);
    Task SaveBranchSelectionAsync(BranchSelectionRequest request, CancellationToken cancellationToken);
}

/// <summary>
/// Stores learner-wide preferences that should follow the user across devices.
/// </summary>
public interface ILearningPreferencesService
{
    Task<LearningTrackPreferenceResponse> GetLearningTrackAsync(Guid userId, CancellationToken cancellationToken);
    Task<LearningTrackPreferenceResponse> SetLearningTrackAsync(Guid userId, UpdateLearningTrackPreferenceRequest request, CancellationToken cancellationToken);
}

/// <summary>
/// Executes code using a safe adapter implementation.
/// </summary>
public interface ICodeExecutionService
{
    Task<CodeRunResponse> RunAsync(CodeRunRequest request, CancellationToken cancellationToken);
}

/// <summary>
/// Returns AI-generated hints behind a service abstraction.
/// </summary>
public interface IAiHintService
{
    Task<AiHintResponse> GetHintAsync(AiHintRequest request, CancellationToken cancellationToken);
}
