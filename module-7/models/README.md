User (coreUserModel.js)  // Root table, parent model
├── id: UUID (PK)
├── name: STRING(50)
├── email: STRING (UNIQUE)
├── password: STRING (hashed)
├── isAdmin: BOOLEAN
├── pathId: UUID (FK to Paths)  // New: User's chosen path
├── createdAt: DATE
└── updatedAt: DATE
    |
    |---[1:1]---> UserSettings (userSettingsModel.js)
    |              ├── userId: UUID (FK, UNIQUE)
    |              ├── theme: STRING (ENUM: 'light', 'dark')
    |              ├── notificationPreferences: JSON
    |              ├── createdAt: DATE
    |              └── updatedAt: DATE
    |
    |---[1:1]---> UserProfile (userProfileModel.js)
    |              ├── userId: UUID (FK, UNIQUE)
    |              ├── experiencePoints: INTEGER
    |              ├── avatarUrl: STRING
    |              ├── createdAt: DATE
    |              └── updatedAt: DATE
    |
    |---[1:1]---> PrivacySettings (privacySettingsModel.js)
    |              ├── userId: UUID (FK, UNIQUE)
    |              ├── profileVisibility: STRING (ENUM: 'private', 'public', 'friends')
    |              ├── blogVisibility: STRING (ENUM: 'private', 'public', 'friends')
    |              ├── createdAt: DATE
    |              └── updatedAt: DATE
    |
    |---[1:N]---> Activity (activityModel.js)
    |              ├── id: UUID (PK)
    |              ├── userId: UUID (FK)
    |              ├── activityType: STRING
    |              ├── timestamp: DATE
    |              └── details: JSON
    |
    |---[1:N]---> UserFavorites (userFavoritesModel.js)
    |              ├── id: UUID (PK)
    |              ├── userId: UUID (FK)
    |              ├── favoriteItemId: UUID
    |              ├── itemType: STRING
    |              ├── createdAt: DATE
    |              └── updatedAt: DATE
    |
    |---[1:N]---> UserPlaylists (userPlaylistsModel.js)
    |              ├── id: UUID (PK)
    |              ├── userId: UUID (FK)
    |              ├── playlistName: STRING
    |              ├── items: JSON
    |              ├── createdAt: DATE
    |              └── updatedAt: DATE
    |
    |---[1:N]---> Blog (coreBlogModel.js)
    |              ├── id: UUID (PK)
    |              ├── authorId: UUID (FK to User)
                   |── authorName: STRING(69)
    |              ├── pathId: UUID (FK to Paths)
    |              ├── title: STRING(100)
    |              ├── content: TEXT
    |              ├── isAgeRestricted: BOOLEAN
    |              ├── videoUrl: STRING (nullable)
    |              ├── audioUrl: STRING (nullable)
    |              ├── authorWebsite: STRING (nullable)
    |              ├── authorLogo: STRING (nullable)
    |              ├── disclaimer: TEXT (nullable)
    |              ├── easterEgg: TEXT (nullable)
    |              ├── createdAt: DATE
    |              └── updatedAt: DATE
    |                  |
    |                  |---[1:N]---> BlogComment (blogCommentModel.js)
    |                  |              ├── id: UUID (PK)
    |                  |              ├── blogId: UUID (FK to Blog)
    |                  |              ├── userId: UUID (FK to User)
    |                  |              ├── content: TEXT
    |                  |              ├── createdAt: DATE
    |                  |              └── updatedAt: DATE
    |                  |
    |                  |---[1:1]---> BlogSummary (blogSummaryModel.js)
    |                  |              ├── id: UUID (PK)
    |                  |              ├── blogId: UUID (FK to Blog, UNIQUE)
    |                  |              ├── summary: TEXT
    |                  |              ├── createdAt: DATE
    |                  |              └── updatedAt: DATE
    |                  |
    |                  |---[1:N]---> BlogImage (blogImageModel.js)
    |                  |              ├── id: UUID (PK)
    |                  |              ├── blogId: UUID (FK to Blog)
    |                  |              ├── imageUrl: STRING
    |                  |              ├── createdAt: DATE
    |                  |              └── updatedAt: DATE
    |                  |
    |                  |---[1:N]---> BlogLeveling (blogLevelingModel.js)
    |                  |              ├── blogId: UUID (FK to Blog)
    |                  |              ├── pointTypeId: UUID (FK to PointTypes)
    |                  |              ├── pathId: UUID (FK to Paths)  // New: Path reference
    |                  |              ├── achievementId: UUID (FK to Achievements, nullable)  // New: Achievement link
    |                  |              ├── points: INTEGER
    |                  |              └── Primary Key: (blogId, pointTypeId)
    |                  |
    |                  |---[1:N]---> BlogCategories (blogCategoriesModel.js)
    |                                 ├── blogId: UUID (FK to Blog)
    |                                 ├── categoryId: UUID (FK to Categories)
    |                                 └── Primary Key: (blogId, categoryId)
    |
    |---[1:N]---> BlogComment (blogCommentModel.js)  // Direct association with User
    |              ├── id: UUID (PK)
    |              ├── blogId: UUID (FK to Blog)
    |              ├── userId: UUID (FK to User)
    |              ├── content: TEXT
    |              ├── createdAt: DATE
    |              └── updatedAt: DATE
    |
    |---[N:N]---> UserRelations (userRelationsModel.js)  // Self-referencing many-to-many
    |              ├── userId: UUID (FK to User, as 'user')
    |              ├── relatedUserId: UUID (FK to User, as 'relatedUser')
    |              ├── relationType: STRING (ENUM: 'follower', 'friend')
    |              ├── createdAt: DATE
    |              └── updatedAt: DATE
    |
    |---[1:N]---> UserAchievements (userAchievementsModel.js)  // New: Junction table for achievements
                   ├── userId: UUID (FK to User)
                   ├── achievementId: UUID (FK to Achievements)
                   ├── earnedAt: DATE
                   └── Primary Key: (userId, achievementId)

Paths (pathsModel.js)
├── id: UUID (PK)
└── name: STRING (unique)

PointTypes (pointTypesModel.js)
├── id: UUID (PK)
└── name: STRING (unique)

Achievements (achievementsModel.js)
├── id: UUID (PK)
├── name: STRING (unique)
├── description: TEXT
├── perkLevelingModifier: FLOAT (nullable)
├── createdAt: DATE
└── updatedAt: DATE

Categories (categoriesModel.js)
├── id: UUID (PK)
└── name: STRING (unique)