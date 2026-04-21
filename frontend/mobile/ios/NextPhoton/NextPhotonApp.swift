// NextPhotonApp.swift
// NextPhoton EduCare - iOS Application
//
// Main entry point for the NextPhoton iOS application.
// This file initializes the app, sets up dependency injection,
// and configures the SwiftData model container.
//
// Architecture: Clean Architecture + MVVM
// Minimum iOS Version: 17.0+

import SwiftUI
import SwiftData

/// Main application entry point for NextPhoton EduCare
///
/// NextPhoton is an "Uber for Educators" platform focused on
/// micromanagement and outside-classroom monitoring.
@main
struct NextPhotonApp: App {
    // MARK: - State Properties

    /// Application-wide state manager for authentication and navigation
    @StateObject private var appState = AppState()

    /// Network monitor for offline-first functionality
    @StateObject private var networkMonitor = NetworkMonitor()

    // MARK: - SwiftData Configuration

    /// Model container for local persistence using SwiftData
    /// Stores user data, sessions, assignments, and cached content
    var sharedModelContainer: ModelContainer = {
        let schema = Schema([
            UserModel.self,
            SessionModel.self,
            AssignmentModel.self,
            NotificationModel.self,
            CachedSessionModel.self
        ])
        let modelConfiguration = ModelConfiguration(
            schema: schema,
            isStoredInMemoryOnly: false,
            allowsSave: true
        )

        do {
            return try ModelContainer(for: schema, configurations: [modelConfiguration])
        } catch {
            fatalError("Could not create ModelContainer: \(error)")
        }
    }()

    // MARK: - Body

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(appState)
                .environmentObject(networkMonitor)
                .modelContainer(sharedModelContainer)
                .onAppear {
                    setupAppearance()
                    checkAuthenticationStatus()
                }
        }
    }

    // MARK: - Private Methods

    /// Configures global UI appearance settings
    private func setupAppearance() {
        // Configure navigation bar appearance
        let navigationBarAppearance = UINavigationBarAppearance()
        navigationBarAppearance.configureWithOpaqueBackground()
        navigationBarAppearance.backgroundColor = UIColor.systemBackground
        navigationBarAppearance.titleTextAttributes = [
            .foregroundColor: UIColor.label,
            .font: UIFont.systemFont(ofSize: 17, weight: .semibold)
        ]
        navigationBarAppearance.largeTitleTextAttributes = [
            .foregroundColor: UIColor.label,
            .font: UIFont.systemFont(ofSize: 34, weight: .bold)
        ]

        UINavigationBar.appearance().standardAppearance = navigationBarAppearance
        UINavigationBar.appearance().compactAppearance = navigationBarAppearance
        UINavigationBar.appearance().scrollEdgeAppearance = navigationBarAppearance

        // Configure tab bar appearance
        let tabBarAppearance = UITabBarAppearance()
        tabBarAppearance.configureWithOpaqueBackground()
        UITabBar.appearance().standardAppearance = tabBarAppearance
        UITabBar.appearance().scrollEdgeAppearance = tabBarAppearance
    }

    /// Checks if user is already authenticated on app launch
    private func checkAuthenticationStatus() {
        Task {
            await appState.checkAuthenticationStatus()
        }
    }
}

// MARK: - App State

/// Global application state manager
///
/// Manages authentication state, user session, and app-wide settings.
/// Uses @Published properties for reactive UI updates.
@MainActor
final class AppState: ObservableObject {
    // MARK: - Published Properties

    /// Current authentication state
    @Published var isAuthenticated: Bool = false

    /// Currently logged in user
    @Published var currentUser: User?

    /// Loading state for authentication checks
    @Published var isCheckingAuth: Bool = true

    /// Global error message to display
    @Published var errorMessage: String?

    /// Flag to show error alert
    @Published var showError: Bool = false

    // MARK: - Dependencies

    private let keychainManager = KeychainManager()
    private let authRepository: AuthRepositoryProtocol

    // MARK: - Initialization

    init() {
        self.authRepository = Container.shared.authRepository()
    }

    // MARK: - Public Methods

    /// Checks if user has valid authentication tokens
    func checkAuthenticationStatus() async {
        isCheckingAuth = true
        defer { isCheckingAuth = false }

        // Check for existing access token
        guard let accessToken = keychainManager.getAccessToken(),
              !accessToken.isEmpty else {
            isAuthenticated = false
            currentUser = nil
            return
        }

        // Validate token and fetch user profile
        do {
            let user = try await authRepository.getCurrentUser()
            currentUser = user
            isAuthenticated = true
        } catch {
            // Token is invalid or expired, try to refresh
            do {
                try await refreshTokenIfNeeded()
                let user = try await authRepository.getCurrentUser()
                currentUser = user
                isAuthenticated = true
            } catch {
                // Refresh failed, user needs to login again
                logout()
            }
        }
    }

    /// Attempts to refresh authentication token
    func refreshTokenIfNeeded() async throws {
        guard let refreshToken = keychainManager.getRefreshToken() else {
            throw AuthError.noRefreshToken
        }

        let tokens = try await authRepository.refreshToken(refreshToken: refreshToken)
        keychainManager.saveAccessToken(tokens.accessToken)
        keychainManager.saveRefreshToken(tokens.refreshToken)
    }

    /// Logs out the current user
    func logout() {
        keychainManager.clearAllTokens()
        isAuthenticated = false
        currentUser = nil
    }

    /// Sets the current user after successful login
    func setUser(_ user: User) {
        currentUser = user
        isAuthenticated = true
    }

    /// Shows an error message
    func showError(_ message: String) {
        errorMessage = message
        showError = true
    }
}
