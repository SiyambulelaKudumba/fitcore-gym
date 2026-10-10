IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
GO

CREATE TABLE [AspNetRoles] (
    [Id] nvarchar(450) NOT NULL,
    [Name] nvarchar(256) NULL,
    [NormalizedName] nvarchar(256) NULL,
    [ConcurrencyStamp] nvarchar(max) NULL,
    CONSTRAINT [PK_AspNetRoles] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [AspNetUsers] (
    [Id] nvarchar(450) NOT NULL,
    [FirstName] nvarchar(max) NOT NULL,
    [LastName] nvarchar(max) NOT NULL,
    [Role] nvarchar(max) NOT NULL,
    [MemberId] int NULL,
    [TrainerId] int NULL,
    [UserName] nvarchar(256) NULL,
    [NormalizedUserName] nvarchar(256) NULL,
    [Email] nvarchar(256) NULL,
    [NormalizedEmail] nvarchar(256) NULL,
    [EmailConfirmed] bit NOT NULL,
    [PasswordHash] nvarchar(max) NULL,
    [SecurityStamp] nvarchar(max) NULL,
    [ConcurrencyStamp] nvarchar(max) NULL,
    [PhoneNumber] nvarchar(max) NULL,
    [PhoneNumberConfirmed] bit NOT NULL,
    [TwoFactorEnabled] bit NOT NULL,
    [LockoutEnd] datetimeoffset NULL,
    [LockoutEnabled] bit NOT NULL,
    [AccessFailedCount] int NOT NULL,
    CONSTRAINT [PK_AspNetUsers] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [TrainingProgrammes] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(100) NOT NULL,
    [Description] nvarchar(500) NULL,
    [Duration] nvarchar(50) NOT NULL,
    [FitnessGoal] int NOT NULL,
    CONSTRAINT [PK_TrainingProgrammes] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [AspNetRoleClaims] (
    [Id] int NOT NULL IDENTITY,
    [RoleId] nvarchar(450) NOT NULL,
    [ClaimType] nvarchar(max) NULL,
    [ClaimValue] nvarchar(max) NULL,
    CONSTRAINT [PK_AspNetRoleClaims] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_AspNetRoleClaims_AspNetRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [AspNetRoles] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [AspNetUserClaims] (
    [Id] int NOT NULL IDENTITY,
    [UserId] nvarchar(450) NOT NULL,
    [ClaimType] nvarchar(max) NULL,
    [ClaimValue] nvarchar(max) NULL,
    CONSTRAINT [PK_AspNetUserClaims] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_AspNetUserClaims_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [AspNetUserLogins] (
    [LoginProvider] nvarchar(450) NOT NULL,
    [ProviderKey] nvarchar(450) NOT NULL,
    [ProviderDisplayName] nvarchar(max) NULL,
    [UserId] nvarchar(450) NOT NULL,
    CONSTRAINT [PK_AspNetUserLogins] PRIMARY KEY ([LoginProvider], [ProviderKey]),
    CONSTRAINT [FK_AspNetUserLogins_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [AspNetUserRoles] (
    [UserId] nvarchar(450) NOT NULL,
    [RoleId] nvarchar(450) NOT NULL,
    CONSTRAINT [PK_AspNetUserRoles] PRIMARY KEY ([UserId], [RoleId]),
    CONSTRAINT [FK_AspNetUserRoles_AspNetRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [AspNetRoles] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_AspNetUserRoles_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [AspNetUserTokens] (
    [UserId] nvarchar(450) NOT NULL,
    [LoginProvider] nvarchar(450) NOT NULL,
    [Name] nvarchar(450) NOT NULL,
    [Value] nvarchar(max) NULL,
    CONSTRAINT [PK_AspNetUserTokens] PRIMARY KEY ([UserId], [LoginProvider], [Name]),
    CONSTRAINT [FK_AspNetUserTokens_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [Trainers] (
    [Id] int NOT NULL IDENTITY,
    [StaffNumber] nvarchar(20) NOT NULL,
    [FirstName] nvarchar(50) NOT NULL,
    [LastName] nvarchar(50) NOT NULL,
    [Gender] int NOT NULL,
    [Email] nvarchar(100) NOT NULL,
    [PhoneNumber] nvarchar(15) NULL,
    [Specialization] int NOT NULL,
    [UserId] nvarchar(450) NULL,
    CONSTRAINT [PK_Trainers] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Trainers_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE SET NULL
);
GO

CREATE TABLE [Members] (
    [Id] int NOT NULL IDENTITY,
    [MemberNumber] nvarchar(20) NOT NULL,
    [FirstName] nvarchar(50) NOT NULL,
    [LastName] nvarchar(50) NOT NULL,
    [Gender] int NOT NULL,
    [DateOfBirth] datetime2 NOT NULL,
    [HomeAddress] nvarchar(200) NOT NULL,
    [Email] nvarchar(100) NOT NULL,
    [PhoneNumber] nvarchar(15) NULL,
    [MembershipType] int NOT NULL,
    [JoinDate] datetime2 NOT NULL,
    [TrainerId] int NULL,
    [TrainingProgrammeId] int NULL,
    [UserId] nvarchar(450) NULL,
    CONSTRAINT [PK_Members] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Members_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE SET NULL,
    CONSTRAINT [FK_Members_Trainers_TrainerId] FOREIGN KEY ([TrainerId]) REFERENCES [Trainers] ([Id]) ON DELETE SET NULL,
    CONSTRAINT [FK_Members_TrainingProgrammes_TrainingProgrammeId] FOREIGN KEY ([TrainingProgrammeId]) REFERENCES [TrainingProgrammes] ([Id]) ON DELETE SET NULL
);
GO

CREATE TABLE [WorkoutPlans] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(100) NOT NULL,
    [Description] nvarchar(500) NULL,
    [MemberId] int NOT NULL,
    [TrainerId] int NOT NULL,
    [TrainingProgrammeId] int NOT NULL,
    [CreatedDate] datetime2 NOT NULL,
    CONSTRAINT [PK_WorkoutPlans] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_WorkoutPlans_Members_MemberId] FOREIGN KEY ([MemberId]) REFERENCES [Members] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_WorkoutPlans_Trainers_TrainerId] FOREIGN KEY ([TrainerId]) REFERENCES [Trainers] ([Id]) ON DELETE NO ACTION,
    CONSTRAINT [FK_WorkoutPlans_TrainingProgrammes_TrainingProgrammeId] FOREIGN KEY ([TrainingProgrammeId]) REFERENCES [TrainingProgrammes] ([Id]) ON DELETE NO ACTION
);
GO

CREATE TABLE [WorkoutTasks] (
    [Id] int NOT NULL IDENTITY,
    [ExerciseName] nvarchar(100) NOT NULL,
    [Description] nvarchar(500) NULL,
    [NumberOfSets] int NOT NULL,
    [NumberOfRepetitions] int NOT NULL,
    [DueDate] datetime2 NOT NULL,
    [Status] int NOT NULL,
    [WorkoutPlanId] int NOT NULL,
    CONSTRAINT [PK_WorkoutTasks] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_WorkoutTasks_WorkoutPlans_WorkoutPlanId] FOREIGN KEY ([WorkoutPlanId]) REFERENCES [WorkoutPlans] ([Id]) ON DELETE CASCADE
);
GO

CREATE INDEX [IX_AspNetRoleClaims_RoleId] ON [AspNetRoleClaims] ([RoleId]);
GO

CREATE UNIQUE INDEX [RoleNameIndex] ON [AspNetRoles] ([NormalizedName]) WHERE [NormalizedName] IS NOT NULL;
GO

CREATE INDEX [IX_AspNetUserClaims_UserId] ON [AspNetUserClaims] ([UserId]);
GO

CREATE INDEX [IX_AspNetUserLogins_UserId] ON [AspNetUserLogins] ([UserId]);
GO

CREATE INDEX [IX_AspNetUserRoles_RoleId] ON [AspNetUserRoles] ([RoleId]);
GO

CREATE INDEX [EmailIndex] ON [AspNetUsers] ([NormalizedEmail]);
GO

CREATE UNIQUE INDEX [UserNameIndex] ON [AspNetUsers] ([NormalizedUserName]) WHERE [NormalizedUserName] IS NOT NULL;
GO

CREATE UNIQUE INDEX [IX_Members_Email] ON [Members] ([Email]);
GO

CREATE UNIQUE INDEX [IX_Members_MemberNumber] ON [Members] ([MemberNumber]);
GO

CREATE INDEX [IX_Members_TrainerId] ON [Members] ([TrainerId]);
GO

CREATE INDEX [IX_Members_TrainingProgrammeId] ON [Members] ([TrainingProgrammeId]);
GO

CREATE UNIQUE INDEX [IX_Members_UserId] ON [Members] ([UserId]) WHERE [UserId] IS NOT NULL;
GO

CREATE UNIQUE INDEX [IX_Trainers_Email] ON [Trainers] ([Email]);
GO

CREATE UNIQUE INDEX [IX_Trainers_StaffNumber] ON [Trainers] ([StaffNumber]);
GO

CREATE UNIQUE INDEX [IX_Trainers_UserId] ON [Trainers] ([UserId]) WHERE [UserId] IS NOT NULL;
GO

CREATE INDEX [IX_WorkoutPlans_MemberId] ON [WorkoutPlans] ([MemberId]);
GO

CREATE INDEX [IX_WorkoutPlans_TrainerId] ON [WorkoutPlans] ([TrainerId]);
GO

CREATE INDEX [IX_WorkoutPlans_TrainingProgrammeId] ON [WorkoutPlans] ([TrainingProgrammeId]);
GO

CREATE INDEX [IX_WorkoutTasks_WorkoutPlanId] ON [WorkoutTasks] ([WorkoutPlanId]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20261008231453_InitialCreate', N'8.0.11');
GO

COMMIT;
GO

