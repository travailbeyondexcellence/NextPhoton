// ContentView.swift
// NextPhoton EduCare - iOS Application
//
// Root content view that handles navigation based on authentication state.
// Displays either the login flow or main app navigation.

import SwiftUI

/// Root content view for the NextPhoton application
///
/// This view acts as the primary router, displaying either:
/// - A splash/loading screen while checking authentication
/// - The login view for unauthenticated users
/// - The main app navigation for authenticated users
struct ContentView: View {
    // MARK: - Environment

    @EnvironmentObject private var appState: AppState
    @EnvironmentObject private var networkMonitor: NetworkMonitor

    // MARK: - State

    @State private var showSplash = true

    // MARK: - Body

    var body: some View {
        ZStack {
            if showSplash || appState.isCheckingAuth {
                SplashView()
                    .transition(.opacity)
            } else if appState.isAuthenticated {
                MainTabView()
                    .transition(.opacity)
            } else {
                NavigationStack {
                    LoginView()
                }
                .transition(.opacity)
            }
        }
        .animation(.easeInOut(duration: 0.3), value: appState.isAuthenticated)
        .animation(.easeInOut(duration: 0.3), value: appState.isCheckingAuth)
        .onAppear {
            // Show splash for minimum duration for branding
            DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
                withAnimation {
                    showSplash = false
                }
            }
        }
        .alert("Error", isPresented: $appState.showError) {
            Button("OK", role: .cancel) {
                appState.errorMessage = nil
            }
        } message: {
            if let message = appState.errorMessage {
                Text(message)
            }
        }
        .overlay(alignment: .top) {
            // Offline indicator banner
            if !networkMonitor.isConnected {
                OfflineBanner()
                    .transition(.move(edge: .top).combined(with: .opacity))
            }
        }
    }
}

// MARK: - Splash View

/// Splash screen shown during app launch
struct SplashView: View {
    @State private var logoScale: CGFloat = 0.8
    @State private var logoOpacity: Double = 0

    var body: some View {
        ZStack {
            // Background gradient
            LinearGradient(
                colors: [
                    Color.accentColor.opacity(0.1),
                    Color.accentColor.opacity(0.05),
                    Color(uiColor: .systemBackground)
                ],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            .ignoresSafeArea()

            VStack(spacing: 24) {
                // App logo
                Image(systemName: "graduationcap.fill")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 100, height: 100)
                    .foregroundStyle(
                        LinearGradient(
                            colors: [.accentColor, .accentColor.opacity(0.7)],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .scaleEffect(logoScale)
                    .opacity(logoOpacity)

                // App name
                VStack(spacing: 4) {
                    Text("NextPhoton")
                        .font(.system(size: 32, weight: .bold, design: .rounded))
                        .foregroundColor(.primary)

                    Text("EduCare")
                        .font(.system(size: 18, weight: .medium, design: .rounded))
                        .foregroundColor(.secondary)
                }
                .opacity(logoOpacity)
            }
        }
        .onAppear {
            withAnimation(.spring(response: 0.8, dampingFraction: 0.6)) {
                logoScale = 1.0
                logoOpacity = 1.0
            }
        }
    }
}

// MARK: - Offline Banner

/// Banner displayed when device is offline
struct OfflineBanner: View {
    var body: some View {
        HStack(spacing: 8) {
            Image(systemName: "wifi.slash")
                .font(.system(size: 14, weight: .semibold))

            Text("You're offline")
                .font(.system(size: 14, weight: .medium))

            Spacer()

            Text("Some features may be limited")
                .font(.system(size: 12))
                .foregroundColor(.white.opacity(0.8))
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 10)
        .background(Color.orange)
        .foregroundColor(.white)
    }
}

// MARK: - Main Tab View

/// Main tab bar navigation for authenticated users
struct MainTabView: View {
    // MARK: - State

    @State private var selectedTab: Tab = .home

    // MARK: - Tab Enum

    enum Tab: String, CaseIterable {
        case home = "Home"
        case sessions = "Sessions"
        case assignments = "Assignments"
        case notifications = "Notifications"
        case profile = "Profile"

        var icon: String {
            switch self {
            case .home: return "house.fill"
            case .sessions: return "calendar"
            case .assignments: return "doc.text.fill"
            case .notifications: return "bell.fill"
            case .profile: return "person.fill"
            }
        }
    }

    // MARK: - Body

    var body: some View {
        TabView(selection: $selectedTab) {
            NavigationStack {
                HomeView()
            }
            .tabItem {
                Label(Tab.home.rawValue, systemImage: Tab.home.icon)
            }
            .tag(Tab.home)

            NavigationStack {
                SessionsView()
            }
            .tabItem {
                Label(Tab.sessions.rawValue, systemImage: Tab.sessions.icon)
            }
            .tag(Tab.sessions)

            NavigationStack {
                AssignmentsView()
            }
            .tabItem {
                Label(Tab.assignments.rawValue, systemImage: Tab.assignments.icon)
            }
            .tag(Tab.assignments)

            NavigationStack {
                NotificationsView()
            }
            .tabItem {
                Label(Tab.notifications.rawValue, systemImage: Tab.notifications.icon)
            }
            .tag(Tab.notifications)

            NavigationStack {
                ProfileView()
            }
            .tabItem {
                Label(Tab.profile.rawValue, systemImage: Tab.profile.icon)
            }
            .tag(Tab.profile)
        }
        .tint(.accentColor)
    }
}

// MARK: - Preview

#Preview {
    ContentView()
        .environmentObject(AppState())
        .environmentObject(NetworkMonitor())
}
