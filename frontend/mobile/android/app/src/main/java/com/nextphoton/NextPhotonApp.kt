/**
 * NextPhoton EduCare Android Application
 * Application class - Entry point for the Android application
 *
 * This class:
 * - Initializes Koin dependency injection framework
 * - Sets up logging for debug builds
 * - Configures global application state
 *
 * The Application class is instantiated before any other class when the process
 * for the application is created. It's the ideal place to initialize
 * dependency injection and other global configurations.
 */
package com.nextphoton

import android.app.Application
import android.util.Log
import coil.ImageLoader
import coil.ImageLoaderFactory
import coil.disk.DiskCache
import coil.memory.MemoryCache
import coil.request.CachePolicy
import com.nextphoton.core.di.appModule
import com.nextphoton.core.di.databaseModule
import com.nextphoton.core.di.networkModule
import com.nextphoton.core.di.repositoryModule
import com.nextphoton.core.di.useCaseModule
import com.nextphoton.core.di.viewModelModule
import org.koin.android.ext.koin.androidContext
import org.koin.android.ext.koin.androidLogger
import org.koin.core.context.startKoin
import org.koin.core.logger.Level

/**
 * Main Application class for NextPhoton EduCare
 *
 * Responsibilities:
 * - Initialize Koin DI framework with all modules
 * - Configure Coil image loader with caching
 * - Set up crash reporting and analytics (in production)
 */
class NextPhotonApp : Application(), ImageLoaderFactory {

    companion object {
        private const val TAG = "NextPhotonApp"

        // Cache sizes
        private const val MEMORY_CACHE_PERCENT = 0.25
        private const val DISK_CACHE_SIZE = 100L * 1024 * 1024 // 100 MB
    }

    override fun onCreate() {
        super.onCreate()

        // Initialize dependency injection
        initializeKoin()

        Log.i(TAG, "NextPhoton EduCare application initialized")
    }

    /**
     * Initializes Koin dependency injection framework
     *
     * Modules are organized by layer following Clean Architecture:
     * - appModule: Core application dependencies
     * - networkModule: Apollo GraphQL and Ktor clients
     * - databaseModule: Room database and DAOs
     * - repositoryModule: Repository implementations
     * - useCaseModule: Business logic use cases
     * - viewModelModule: ViewModels for UI layer
     */
    private fun initializeKoin() {
        startKoin {
            // Configure logger level based on build type
            androidLogger(
                level = if (BuildConfig.DEBUG) Level.DEBUG else Level.ERROR
            )

            // Provide Android context
            androidContext(this@NextPhotonApp)

            // Load all dependency modules
            modules(
                listOf(
                    appModule,
                    networkModule,
                    databaseModule,
                    repositoryModule,
                    useCaseModule,
                    viewModelModule
                )
            )
        }

        Log.d(TAG, "Koin DI initialized with all modules")
    }

    /**
     * Creates a customized Coil ImageLoader for efficient image loading
     *
     * Configuration includes:
     * - Memory cache: 25% of available memory
     * - Disk cache: 100 MB for offline images
     * - Crossfade animation for smooth transitions
     * - Cache policies for network efficiency
     */
    override fun newImageLoader(): ImageLoader {
        return ImageLoader.Builder(this)
            .memoryCache {
                MemoryCache.Builder(this)
                    .maxSizePercent(MEMORY_CACHE_PERCENT)
                    .build()
            }
            .diskCache {
                DiskCache.Builder()
                    .directory(cacheDir.resolve("image_cache"))
                    .maxSizeBytes(DISK_CACHE_SIZE)
                    .build()
            }
            .memoryCachePolicy(CachePolicy.ENABLED)
            .diskCachePolicy(CachePolicy.ENABLED)
            .networkCachePolicy(CachePolicy.ENABLED)
            .crossfade(true)
            .respectCacheHeaders(false)
            .build()
    }
}
