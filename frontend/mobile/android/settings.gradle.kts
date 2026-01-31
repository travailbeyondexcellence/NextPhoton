/**
 * NextPhoton EduCare Android Application
 * Settings configuration for the Gradle build system
 *
 * This file configures:
 * - Plugin repositories for build tools
 * - Dependency repositories for libraries
 * - Project structure with included modules
 */

pluginManagement {
    repositories {
        google {
            content {
                includeGroupByRegex("com\\.android.*")
                includeGroupByRegex("com\\.google.*")
                includeGroupByRegex("androidx.*")
            }
        }
        mavenCentral()
        gradlePluginPortal()
    }
}

dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

// Project name for the NextPhoton EduCare Android application
rootProject.name = "NextPhoton"

// Include the main application module
include(":app")
