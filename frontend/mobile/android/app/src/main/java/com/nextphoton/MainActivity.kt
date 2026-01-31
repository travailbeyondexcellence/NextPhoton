/**
 * NextPhoton EduCare Android Application
 * MainActivity - Single Activity Architecture entry point
 *
 * This activity serves as the single entry point for the application,
 * hosting the Jetpack Compose UI and Navigation component.
 *
 * Single Activity Architecture benefits:
 * - Simplified navigation with Navigation Compose
 * - Consistent theme and window handling
 * - Better deep link support
 * - Reduced activity lifecycle complexity
 */
package com.nextphoton

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import com.nextphoton.presentation.navigation.NavGraph
import com.nextphoton.presentation.theme.NextPhotonTheme
import com.nextphoton.presentation.viewmodels.AuthViewModel
import org.koin.androidx.viewmodel.ext.android.viewModel

/**
 * Main Activity for NextPhoton EduCare
 *
 * Responsibilities:
 * - Install splash screen for initial loading
 * - Enable edge-to-edge display
 * - Set up the Compose content with theming
 * - Handle deep links and navigation
 */
class MainActivity : ComponentActivity() {

    // Auth ViewModel to check authentication state
    private val authViewModel: AuthViewModel by viewModel()

    override fun onCreate(savedInstanceState: Bundle?) {
        // Install splash screen before super.onCreate()
        val splashScreen = installSplashScreen()

        super.onCreate(savedInstanceState)

        // Keep splash screen visible while checking auth state
        splashScreen.setKeepOnScreenCondition {
            authViewModel.isLoading.value
        }

        // Enable edge-to-edge display for modern Android experience
        enableEdgeToEdge()

        // Set Compose content
        setContent {
            NextPhotonApp(authViewModel = authViewModel)
        }
    }
}

/**
 * Root Composable for the NextPhoton application
 *
 * This composable:
 * - Applies the NextPhoton theme (supports dark mode)
 * - Provides the Material3 surface as the background
 * - Sets up the navigation graph
 *
 * @param authViewModel The authentication ViewModel to determine start destination
 */
@Composable
fun NextPhotonApp(authViewModel: AuthViewModel) {
    // Collect authentication state
    val isAuthenticated by authViewModel.isAuthenticated.collectAsState()
    val isLoading by authViewModel.isLoading.collectAsState()

    NextPhotonTheme {
        Surface(
            modifier = Modifier.fillMaxSize(),
            color = MaterialTheme.colorScheme.background
        ) {
            // Only show content after auth check is complete
            if (!isLoading) {
                NavGraph(
                    isAuthenticated = isAuthenticated,
                    onLogout = { authViewModel.logout() }
                )
            }
        }
    }
}
