// NextPhotoniPadApp.swift
// NextPhoton EduCare iPadOS Application
// Main application entry point with multi-window and Stage Manager support
//
// Architecture: Clean Architecture + MVVM
// Target: iPadOS 17.0+
// Created: January 2026

import SwiftUI
import SwiftData

/// Main application entry point for NextPhoton iPadOS app
/// Supports Stage Manager, multi-window, and split view features
@main
struct NextPhotoniPadApp: App {
    // MARK: - Dependencies

    /// Dependency injection container for the entire app
    @StateObject private var container = DependencyContainer.shared

    /// Authentication state manager
    @StateObject private var authManager = AuthManager.shared

    /// Network connectivity monitor
    @StateObject private var networkMonitor = NetworkMonitor.shared

    // MARK: - SwiftData Configuration

    /// SwiftData model container for local persistence
    var sharedModelContainer: ModelContainer = {
        let schema = Schema([
            UserModel.self,
            SessionModel.self,
            AssignmentModel.self,
            ProgressModel.self
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

    // MARK: - App Body

    var body: some Scene {
        // Main window group with multi-window support for Stage Manager
        WindowGroup {
            RootView()
                .environmentObject(container)
                .environmentObject(authManager)
                .environmentObject(networkMonitor)
                .modelContainer(sharedModelContainer)
        }
        .commands {
            // Custom keyboard shortcuts for iPad
            NextPhotonCommands()
        }
        .defaultSize(width: 1200, height: 900)

        // Secondary window for whiteboard/drawing sessions
        WindowGroup("Whiteboard", id: "whiteboard") {
            WhiteboardWindow()
                .environmentObject(container)
                .environmentObject(authManager)
                .modelContainer(sharedModelContainer)
        }
        .defaultSize(width: 1000, height: 800)

        // Auxiliary window for session details
        WindowGroup("Session Details", id: "session-details", for: String.self) { $sessionId in
            if let sessionId = sessionId {
                SessionDetailWindow(sessionId: sessionId)
                    .environmentObject(container)
                    .environmentObject(authManager)
                    .modelContainer(sharedModelContainer)
            }
        }
        .defaultSize(width: 800, height: 600)
    }
}

// MARK: - Custom Commands

/// Custom keyboard commands for the NextPhoton app
struct NextPhotonCommands: Commands {
    var body: some Commands {
        // Navigation commands
        CommandGroup(after: .sidebar) {
            Button("Show Dashboard") {
                NotificationCenter.default.post(name: .navigateToDashboard, object: nil)
            }
            .keyboardShortcut("1", modifiers: [.command])

            Button("Show Sessions") {
                NotificationCenter.default.post(name: .navigateToSessions, object: nil)
            }
            .keyboardShortcut("2", modifiers: [.command])

            Button("Show Assignments") {
                NotificationCenter.default.post(name: .navigateToAssignments, object: nil)
            }
            .keyboardShortcut("3", modifiers: [.command])

            Button("Show Profile") {
                NotificationCenter.default.post(name: .navigateToProfile, object: nil)
            }
            .keyboardShortcut("4", modifiers: [.command])

            Divider()

            Button("Open Whiteboard") {
                NotificationCenter.default.post(name: .openWhiteboard, object: nil)
            }
            .keyboardShortcut("W", modifiers: [.command, .shift])
        }

        // Refresh commands
        CommandGroup(after: .toolbar) {
            Button("Refresh") {
                NotificationCenter.default.post(name: .refreshContent, object: nil)
            }
            .keyboardShortcut("R", modifiers: [.command])
        }

        // Search commands
        CommandGroup(replacing: .textEditing) {
            Button("Search") {
                NotificationCenter.default.post(name: .openSearch, object: nil)
            }
            .keyboardShortcut("F", modifiers: [.command])
        }
    }
}

// MARK: - Notification Names

extension Notification.Name {
    static let navigateToDashboard = Notification.Name("navigateToDashboard")
    static let navigateToSessions = Notification.Name("navigateToSessions")
    static let navigateToAssignments = Notification.Name("navigateToAssignments")
    static let navigateToProfile = Notification.Name("navigateToProfile")
    static let openWhiteboard = Notification.Name("openWhiteboard")
    static let refreshContent = Notification.Name("refreshContent")
    static let openSearch = Notification.Name("openSearch")
}

// MARK: - Root View

/// Root view that handles authentication state
struct RootView: View {
    @EnvironmentObject var authManager: AuthManager
    @EnvironmentObject var networkMonitor: NetworkMonitor

    var body: some View {
        Group {
            if authManager.isAuthenticated {
                ContentView()
            } else {
                LoginView()
            }
        }
        .overlay(alignment: .top) {
            // Network status indicator
            if !networkMonitor.isConnected {
                NetworkStatusBanner()
            }
        }
    }
}

// MARK: - Network Status Banner

/// Banner shown when device is offline
struct NetworkStatusBanner: View {
    var body: some View {
        HStack {
            Image(systemName: "wifi.slash")
            Text("No Internet Connection")
                .font(.subheadline)
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 8)
        .background(.ultraThinMaterial)
        .clipShape(Capsule())
        .padding(.top, 8)
    }
}

// MARK: - Whiteboard Window

/// Standalone whiteboard window for Stage Manager
struct WhiteboardWindow: View {
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            PencilKitCanvas(
                drawing: .constant(nil),
                onSave: { _ in }
            )
            .navigationTitle("Whiteboard")
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Done") {
                        dismiss()
                    }
                }
            }
        }
    }
}

// MARK: - Session Detail Window

/// Window for viewing session details in Stage Manager
struct SessionDetailWindow: View {
    let sessionId: String
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            SessionDetailView(sessionId: sessionId)
                .toolbar {
                    ToolbarItem(placement: .topBarTrailing) {
                        Button("Done") {
                            dismiss()
                        }
                    }
                }
        }
    }
}
