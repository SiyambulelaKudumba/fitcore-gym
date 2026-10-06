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

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261004210853_InitialCreate'
)
BEGIN
    CREATE TABLE [AspNetRoles] (
        [Id] nvarchar(450) NOT NULL,
        [Name] nvarchar(256) NULL,
        [NormalizedName] nvarchar(256) NULL,
        [ConcurrencyStamp] nvarchar(max) NULL,
        CONSTRAINT [PK_AspNetRoles] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261004210853_InitialCreate'
)
BEGIN
    CREATE TABLE [AspNetUsers] (
        [Id] nvarchar(450) NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [Surname] nvarchar(max) NOT NULL,
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
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261004210853_InitialCreate'
)
BEGIN
    CREATE TABLE [PersonalTrainers] (
        [Id] int NOT NULL IDENTITY,
        [StaffNumber] nvarchar(max) NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [Surname] nvarchar(max) NOT NULL,
        [Gender] int NOT NULL,
        [EmailAddress] nvarchar(max) NOT NULL,
        [PhoneNumber] nvarchar(max) NOT NULL,
        [Specialization] int NOT NULL,
        CONSTRAINT [PK_PersonalTrainers] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261004210853_InitialCreate'
)
BEGIN
    CREATE TABLE [TrainingProgrammes] (
        [Id] int NOT NULL IDENTITY,
        [ProgrammeName] nvarchar(max) NOT NULL,
        [Description] nvarchar(max) NOT NULL,
        [Duration] nvarchar(max) NOT NULL,
        [FitnessGoal] int NOT NULL,
        CONSTRAINT [PK_TrainingProgrammes] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261004210853_InitialCreate'
)
BEGIN
    CREATE TABLE [AspNetRoleClaims] (
        [Id] int NOT NULL IDENTITY,
        [RoleId] nvarchar(450) NOT NULL,
        [ClaimType] nvarchar(max) NULL,
        [ClaimValue] nvarchar(max) NULL,
        CONSTRAINT [PK_AspNetRoleClaims] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_AspNetRoleClaims_AspNetRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [AspNetRoles] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261004210853_InitialCreate'
)
BEGIN
    CREATE TABLE [AspNetUserClaims] (
        [Id] int NOT NULL IDENTITY,
        [UserId] nvarchar(450) NOT NULL,
        [ClaimType] nvarchar(max) NULL,
        [ClaimValue] nvarchar(max) NULL,
        CONSTRAINT [PK_AspNetUserClaims] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_AspNetUserClaims_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261004210853_InitialCreate'
)
BEGIN
    CREATE TABLE [AspNetUserLogins] (
        [LoginProvider] nvarchar(450) NOT NULL,
        [ProviderKey] nvarchar(450) NOT NULL,
        [ProviderDisplayName] nvarchar(max) NULL,
        [UserId] nvarchar(450) NOT NULL,
        CONSTRAINT [PK_AspNetUserLogins] PRIMARY KEY ([LoginProvider], [ProviderKey]),
        CONSTRAINT [FK_AspNetUserLogins_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261004210853_InitialCreate'
)
BEGIN
    CREATE TABLE [AspNetUserRoles] (
        [UserId] nvarchar(450) NOT NULL,
        [RoleId] nvarchar(450) NOT NULL,
        CONSTRAINT [PK_AspNetUserRoles] PRIMARY KEY ([UserId], [RoleId]),
        CONSTRAINT [FK_AspNetUserRoles_AspNetRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [AspNetRoles] ([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_AspNetUserRoles_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261004210853_InitialCreate'
)
BEGIN
    CREATE TABLE [AspNetUserTokens] (
        [UserId] nvarchar(450) NOT NULL,
        [LoginProvider] nvarchar(450) NOT NULL,
        [Name] nvarchar(450) NOT NULL,
        [Value] nvarchar(max) NULL,
        CONSTRAINT [PK_AspNetUserTokens] PRIMARY KEY ([UserId], [LoginProvider], [Name]),
        CONSTRAINT [FK_AspNetUserTokens_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261004210853_InitialCreate'
)
BEGIN
    CREATE TABLE [GymMembers] (
        [Id] int NOT NULL IDENTITY,
        [MemberNumber] nvarchar(max) NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [Surname] nvarchar(max) NOT NULL,
        [Gender] int NOT NULL,
        [DateOfBirth] datetime2 NOT NULL,
        [HomeAddress] nvarchar(max) NOT NULL,
        [EmailAddress] nvarchar(max) NOT NULL,
        [PhoneNumber] nvarchar(max) NOT NULL,
        [MembershipType] int NOT NULL,
        [PersonalTrainerId] int NULL,
        [TrainingProgrammeId] int NULL,
        CONSTRAINT [PK_GymMembers] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_GymMembers_PersonalTrainers_PersonalTrainerId] FOREIGN KEY ([PersonalTrainerId]) REFERENCES [PersonalTrainers] ([Id]),
        CONSTRAINT [FK_GymMembers_TrainingProgrammes_TrainingProgrammeId] FOREIGN KEY ([TrainingProgrammeId]) REFERENCES [TrainingProgrammes] ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261004210853_InitialCreate'
)
BEGIN
    CREATE TABLE [WorkoutPlans] (
        [Id] int NOT NULL IDENTITY,
        [PlanName] nvarchar(max) NOT NULL,
        [Description] nvarchar(max) NOT NULL,
        [TrainingProgrammeId] int NOT NULL,
        [GymMemberId] int NOT NULL,
        CONSTRAINT [PK_WorkoutPlans] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_WorkoutPlans_GymMembers_GymMemberId] FOREIGN KEY ([GymMemberId]) REFERENCES [GymMembers] ([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_WorkoutPlans_TrainingProgrammes_TrainingProgrammeId] FOREIGN KEY ([TrainingProgrammeId]) REFERENCES [TrainingProgrammes] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261004210853_InitialCreate'
)
BEGIN
    CREATE TABLE [WorkoutTasks] (
        [Id] int NOT NULL IDENTITY,
        [ExerciseName] nvarchar(max) NOT NULL,
        [Description] nvarchar(max) NOT NULL,
        [NumberOfSets] int NOT NULL,
        [NumberOfRepetitions] int NOT NULL,
        [DueWorkoutDate] datetime2 NOT NULL,
        [TaskStatus] int NOT NULL,
        [WorkoutPlanId] int NOT NULL,
        CONSTRAINT [PK_WorkoutTasks] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_WorkoutTasks_WorkoutPlans_WorkoutPlanId] FOREIGN KEY ([WorkoutPlanId]) REFERENCES [WorkoutPlans] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261004210853_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_AspNetRoleClaims_RoleId] ON [AspNetRoleClaims] ([RoleId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261004210853_InitialCreate'
)
BEGIN
    EXEC(N'CREATE UNIQUE INDEX [RoleNameIndex] ON [AspNetRoles] ([NormalizedName]) WHERE [NormalizedName] IS NOT NULL');
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261004210853_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_AspNetUserClaims_UserId] ON [AspNetUserClaims] ([UserId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261004210853_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_AspNetUserLogins_UserId] ON [AspNetUserLogins] ([UserId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261004210853_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_AspNetUserRoles_RoleId] ON [AspNetUserRoles] ([RoleId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261004210853_InitialCreate'
)
BEGIN
    CREATE INDEX [EmailIndex] ON [AspNetUsers] ([NormalizedEmail]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261004210853_InitialCreate'
)
BEGIN
    EXEC(N'CREATE UNIQUE INDEX [UserNameIndex] ON [AspNetUsers] ([NormalizedUserName]) WHERE [NormalizedUserName] IS NOT NULL');
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261004210853_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_GymMembers_PersonalTrainerId] ON [GymMembers] ([PersonalTrainerId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261004210853_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_GymMembers_TrainingProgrammeId] ON [GymMembers] ([TrainingProgrammeId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261004210853_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_WorkoutPlans_GymMemberId] ON [WorkoutPlans] ([GymMemberId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261004210853_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_WorkoutPlans_TrainingProgrammeId] ON [WorkoutPlans] ([TrainingProgrammeId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261004210853_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_WorkoutTasks_WorkoutPlanId] ON [WorkoutTasks] ([WorkoutPlanId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261004210853_InitialCreate'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20261004210853_InitialCreate', N'8.0.4');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261005012835_InitialGymSchema'
)
BEGIN
    ALTER TABLE [GymMembers] DROP CONSTRAINT [FK_GymMembers_PersonalTrainers_PersonalTrainerId];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261005012835_InitialGymSchema'
)
BEGIN
    ALTER TABLE [GymMembers] DROP CONSTRAINT [FK_GymMembers_TrainingProgrammes_TrainingProgrammeId];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261005012835_InitialGymSchema'
)
BEGIN
    DECLARE @var0 sysname;
    SELECT @var0 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[GymMembers]') AND [c].[name] = N'PhoneNumber');
    IF @var0 IS NOT NULL EXEC(N'ALTER TABLE [GymMembers] DROP CONSTRAINT [' + @var0 + '];');
    ALTER TABLE [GymMembers] ALTER COLUMN [PhoneNumber] nvarchar(max) NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261005012835_InitialGymSchema'
)
BEGIN
    ALTER TABLE [GymMembers] ADD CONSTRAINT [FK_GymMembers_PersonalTrainers_PersonalTrainerId] FOREIGN KEY ([PersonalTrainerId]) REFERENCES [PersonalTrainers] ([Id]) ON DELETE SET NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261005012835_InitialGymSchema'
)
BEGIN
    ALTER TABLE [GymMembers] ADD CONSTRAINT [FK_GymMembers_TrainingProgrammes_TrainingProgrammeId] FOREIGN KEY ([TrainingProgrammeId]) REFERENCES [TrainingProgrammes] ([Id]) ON DELETE SET NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261005012835_InitialGymSchema'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20261005012835_InitialGymSchema', N'8.0.4');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261005141438_AddApplicationUserLinks'
)
BEGIN
    ALTER TABLE [PersonalTrainers] ADD [ApplicationUserId] nvarchar(450) NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261005141438_AddApplicationUserLinks'
)
BEGIN
    ALTER TABLE [GymMembers] ADD [ApplicationUserId] nvarchar(450) NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261005141438_AddApplicationUserLinks'
)
BEGIN
    CREATE INDEX [IX_PersonalTrainers_ApplicationUserId] ON [PersonalTrainers] ([ApplicationUserId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261005141438_AddApplicationUserLinks'
)
BEGIN
    CREATE INDEX [IX_GymMembers_ApplicationUserId] ON [GymMembers] ([ApplicationUserId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261005141438_AddApplicationUserLinks'
)
BEGIN
    ALTER TABLE [GymMembers] ADD CONSTRAINT [FK_GymMembers_AspNetUsers_ApplicationUserId] FOREIGN KEY ([ApplicationUserId]) REFERENCES [AspNetUsers] ([Id]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261005141438_AddApplicationUserLinks'
)
BEGIN
    ALTER TABLE [PersonalTrainers] ADD CONSTRAINT [FK_PersonalTrainers_AspNetUsers_ApplicationUserId] FOREIGN KEY ([ApplicationUserId]) REFERENCES [AspNetUsers] ([Id]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261005141438_AddApplicationUserLinks'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20261005141438_AddApplicationUserLinks', N'8.0.4');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261005221246_AddUniqueIndexes'
)
BEGIN
    DECLARE @var1 sysname;
    SELECT @var1 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[PersonalTrainers]') AND [c].[name] = N'StaffNumber');
    IF @var1 IS NOT NULL EXEC(N'ALTER TABLE [PersonalTrainers] DROP CONSTRAINT [' + @var1 + '];');
    ALTER TABLE [PersonalTrainers] ALTER COLUMN [StaffNumber] nvarchar(450) NOT NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261005221246_AddUniqueIndexes'
)
BEGIN
    DECLARE @var2 sysname;
    SELECT @var2 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[GymMembers]') AND [c].[name] = N'MemberNumber');
    IF @var2 IS NOT NULL EXEC(N'ALTER TABLE [GymMembers] DROP CONSTRAINT [' + @var2 + '];');
    ALTER TABLE [GymMembers] ALTER COLUMN [MemberNumber] nvarchar(450) NOT NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261005221246_AddUniqueIndexes'
)
BEGIN
    CREATE UNIQUE INDEX [IX_PersonalTrainers_StaffNumber] ON [PersonalTrainers] ([StaffNumber]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261005221246_AddUniqueIndexes'
)
BEGIN
    CREATE UNIQUE INDEX [IX_GymMembers_MemberNumber] ON [GymMembers] ([MemberNumber]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261005221246_AddUniqueIndexes'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20261005221246_AddUniqueIndexes', N'8.0.4');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261006110700_UpdateDateOfBirthToDateOnly'
)
BEGIN
    DECLARE @var3 sysname;
    SELECT @var3 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[GymMembers]') AND [c].[name] = N'DateOfBirth');
    IF @var3 IS NOT NULL EXEC(N'ALTER TABLE [GymMembers] DROP CONSTRAINT [' + @var3 + '];');
    ALTER TABLE [GymMembers] ALTER COLUMN [DateOfBirth] date NOT NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261006110700_UpdateDateOfBirthToDateOnly'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20261006110700_UpdateDateOfBirthToDateOnly', N'8.0.4');
END;
GO

COMMIT;
GO

