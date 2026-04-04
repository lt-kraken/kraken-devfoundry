using DevFoundry.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace DevFoundry.Infrastructure.Data;

public sealed class DevFoundryDbContext(DbContextOptions<DevFoundryDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Course> Courses => Set<Course>();
    public DbSet<CourseModule> Modules => Set<CourseModule>();
    public DbSet<Lesson> Lessons => Set<Lesson>();
    public DbSet<LearningTask> Tasks => Set<LearningTask>();
    public DbSet<CourseProgress> CourseProgress => Set<CourseProgress>();
    public DbSet<CompletedStep> CompletedSteps => Set<CompletedStep>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Course>().HasIndex(course => course.Slug).IsUnique();

        modelBuilder.Entity<CourseModule>()
            .HasOne<Course>()
            .WithMany(course => course.Modules)
            .HasForeignKey(module => module.CourseId);

        modelBuilder.Entity<Lesson>()
            .HasOne<Course>()
            .WithMany()
            .HasForeignKey(lesson => lesson.CourseId);

        modelBuilder.Entity<CompletedStep>()
            .HasOne<CourseProgress>()
            .WithMany(progress => progress.CompletedSteps)
            .HasForeignKey(step => step.CourseProgressId);
    }
}
