/**
 * NextPhoton EduCare Android Application
 * Root build configuration
 *
 * This file defines the plugins used across all modules in the project.
 * Individual module configurations are in their respective build.gradle.kts files.
 */

plugins {
    // Android application plugin - configured in app module
    alias(libs.plugins.android.application) apply false

    // Android library plugin - for future feature modules
    alias(libs.plugins.android.library) apply false

    // Kotlin Android plugin - Kotlin support for Android
    alias(libs.plugins.kotlin.android) apply false

    // Kotlin Compose Compiler plugin - Jetpack Compose support
    alias(libs.plugins.kotlin.compose) apply false

    // Kotlin Serialization plugin - JSON serialization
    alias(libs.plugins.kotlin.serialization) apply false

    // KSP (Kotlin Symbol Processing) - for Room and other annotation processors
    alias(libs.plugins.ksp) apply false

    // Apollo GraphQL plugin - GraphQL code generation
    alias(libs.plugins.apollo) apply false
}

// Task to clean the build directory
tasks.register("clean", Delete::class) {
    delete(rootProject.layout.buildDirectory)
}
