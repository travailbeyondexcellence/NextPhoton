/**
 * NextPhoton EduCare Android Application
 * App module build configuration
 *
 * This file configures:
 * - Android SDK versions and build features
 * - Kotlin and Compose compiler settings
 * - Dependencies for all layers of the application
 * - Apollo GraphQL code generation
 */

plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
    alias(libs.plugins.kotlin.serialization)
    alias(libs.plugins.ksp)
    alias(libs.plugins.apollo)
}

android {
    namespace = "com.nextphoton"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.nextphoton"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"

        vectorDrawables {
            useSupportLibrary = true
        }

        // Build config fields for API configuration
        buildConfigField("String", "API_BASE_URL", "\"https://api.nextphoton.com\"")
        buildConfigField("String", "GRAPHQL_ENDPOINT", "\"https://api.nextphoton.com/graphql\"")
    }

    buildTypes {
        debug {
            isDebuggable = true
            applicationIdSuffix = ".debug"
            versionNameSuffix = "-debug"

            // Debug API endpoints
            buildConfigField("String", "API_BASE_URL", "\"http://10.0.2.2:8080\"")
            buildConfigField("String", "GRAPHQL_ENDPOINT", "\"http://10.0.2.2:8080/graphql\"")
        }

        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )

            // Production API endpoints
            buildConfigField("String", "API_BASE_URL", "\"https://api.nextphoton.com\"")
            buildConfigField("String", "GRAPHQL_ENDPOINT", "\"https://api.nextphoton.com/graphql\"")
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"

        // Enable experimental coroutines APIs
        freeCompilerArgs += listOf(
            "-opt-in=kotlinx.coroutines.ExperimentalCoroutinesApi",
            "-opt-in=kotlinx.coroutines.FlowPreview",
            "-opt-in=androidx.compose.material3.ExperimentalMaterial3Api",
            "-opt-in=androidx.compose.foundation.ExperimentalFoundationApi"
        )
    }

    buildFeatures {
        compose = true
        buildConfig = true
    }

    packaging {
        resources {
            excludes += "/META-INF/{AL2.0,LGPL2.1}"
            excludes += "/META-INF/INDEX.LIST"
            excludes += "/META-INF/io.netty.versions.properties"
        }
    }

    // Room schema export for migrations
    ksp {
        arg("room.schemaLocation", "$projectDir/schemas")
        arg("room.incremental", "true")
        arg("room.generateKotlin", "true")
    }
}

// Apollo GraphQL configuration
apollo {
    service("nextphoton") {
        packageName.set("com.nextphoton.graphql")
        generateKotlinModels.set(true)
        generateOptionalOperationVariables.set(true)

        // Introspection configuration (for development)
        introspection {
            endpointUrl.set("http://localhost:8080/graphql")
            schemaFile.set(file("src/main/graphql/schema.graphqls"))
        }
    }
}

dependencies {
    // Android Core
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.activity.compose)

    // Lifecycle
    implementation(libs.bundles.lifecycle)

    // Compose BOM - manages all Compose versions
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.bundles.compose)
    implementation(libs.androidx.navigation.compose)

    // Compose Tooling
    debugImplementation(libs.androidx.compose.ui.tooling)
    debugImplementation(libs.androidx.compose.ui.test.manifest)

    // Koin Dependency Injection
    implementation(libs.bundles.koin)

    // Apollo GraphQL
    implementation(libs.bundles.apollo)

    // Ktor HTTP Client
    implementation(libs.bundles.ktor)

    // Room Database
    implementation(libs.bundles.room)
    ksp(libs.room.compiler)

    // DataStore Preferences
    implementation(libs.datastore.preferences)

    // Coroutines
    implementation(libs.bundles.coroutines)

    // Kotlin Serialization
    implementation(libs.kotlinx.serialization.json)

    // Image Loading
    implementation(libs.coil.compose)

    // Testing
    testImplementation(libs.junit5)
    testImplementation(libs.mockk)
    testImplementation(libs.turbine)
    testImplementation(libs.robolectric)
    testImplementation(libs.kotlinx.coroutines.test)

    // Android Testing
    androidTestImplementation(libs.androidx.test.core)
    androidTestImplementation(libs.androidx.test.runner)
    androidTestImplementation(libs.androidx.espresso.core)
    androidTestImplementation(platform(libs.androidx.compose.bom))
    androidTestImplementation(libs.androidx.compose.ui.test.junit4)
}
