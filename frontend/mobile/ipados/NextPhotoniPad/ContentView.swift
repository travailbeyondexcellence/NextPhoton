// ContentView.swift
// NextPhoton EduCare iPadOS Application
// Main content view with adaptive layout for iPad
//
// Features:
// - NavigationSplitView for three-column layout
// - Adaptive layouts for all iPad sizes
// - Keyboard shortcut support
// - Drag and drop support

import SwiftUI

/// Main content view implementing the iPad-specific three-column layout
struct ContentView: View {
    // MARK: - State

    /// Currently selected navigation section
    @State private var selectedSection: NavigationSection? = .dashboard

    /// Currently selected item within the section
    @State private var selectedItem: NavigationItem?

    /// Column visibility for split view
    @State private var columnVisibility: NavigationSplitViewVisibility = .all

    /// Search text for global search
    @State private var searchText = ""

    /// Whether search is active
    @State private var isSearching = false

    // MARK: - Environment

    @EnvironmentObject var authManager: AuthManager
    @Environment(\.horizontalSizeClass) private var horizontalSizeClass
    @Environment(\.openWindow) private var openWindow

    // MARK: - Body

    var body: some View {
        NavigationSplitView(columnVisibility: $columnVisibility) {
            // MARK: Sidebar (First Column)
            SidebarNavigationView(
                selectedSection: $selectedSection,
                selectedItem: $selectedItem
            )
            .navigationSplitViewColumnWidth(min: 200, ideal: 250, max: 300)
        } content: {
            // MARK: Content List (Second Column)
            if let section = selectedSection {
                ContentListView(
                    section: section,
                    selectedItem: $selectedItem,
                    searchText: $searchText
                )
                .navigationSplitViewColumnWidth(min: 300, ideal: 350, max: 450)
            } else {
                ContentUnavailableView(
                    "Select a Section",
                    systemImage: "sidebar.left",
                    description: Text("Choose a section from the sidebar to get started.")
                )
            }
        } detail: {
            // MARK: Detail View (Third Column)
            if let item = selectedItem {
                DetailView(item: item)
            } else {
                ContentUnavailableView(
                    "Select an Item",
                    systemImage: "doc.text",
                    description: Text("Select an item from the list to view details.")
                )
            }
        }
        .navigationSplitViewStyle(.balanced)
        .searchable(text: $searchText, isPresented: $isSearching, prompt: "Search NextPhoton")
        .onReceive(NotificationCenter.default.publisher(for: .navigateToDashboard)) { _ in
            selectedSection = .dashboard
        }
        .onReceive(NotificationCenter.default.publisher(for: .navigateToSessions)) { _ in
            selectedSection = .sessions
        }
        .onReceive(NotificationCenter.default.publisher(for: .navigateToAssignments)) { _ in
            selectedSection = .assignments
        }
        .onReceive(NotificationCenter.default.publisher(for: .navigateToProfile)) { _ in
            selectedSection = .profile
        }
        .onReceive(NotificationCenter.default.publisher(for: .openSearch)) { _ in
            isSearching = true
        }
        .onReceive(NotificationCenter.default.publisher(for: .openWhiteboard)) { _ in
            openWindow(id: "whiteboard")
        }
    }
}

// MARK: - Navigation Section Enum

/// Represents main navigation sections in the sidebar
enum NavigationSection: String, CaseIterable, Identifiable, Hashable {
    case dashboard = "Dashboard"
    case sessions = "Sessions"
    case assignments = "Assignments"
    case progress = "Progress"
    case messages = "Messages"
    case profile = "Profile"
    case settings = "Settings"

    var id: String { rawValue }

    var icon: String {
        switch self {
        case .dashboard: return "square.grid.2x2"
        case .sessions: return "video.fill"
        case .assignments: return "doc.text.fill"
        case .progress: return "chart.line.uptrend.xyaxis"
        case .messages: return "message.fill"
        case .profile: return "person.fill"
        case .settings: return "gear"
        }
    }

    var accentColor: Color {
        switch self {
        case .dashboard: return .blue
        case .sessions: return .green
        case .assignments: return .orange
        case .progress: return .purple
        case .messages: return .pink
        case .profile: return .cyan
        case .settings: return .gray
        }
    }
}

// MARK: - Navigation Item

/// Represents an item within a navigation section
struct NavigationItem: Identifiable, Hashable {
    let id: String
    let title: String
    let subtitle: String?
    let icon: String?
    let type: ItemType

    enum ItemType: Hashable {
        case session(String)
        case assignment(String)
        case message(String)
        case profile
        case settings
        case dashboardWidget(String)
    }

    static func == (lhs: NavigationItem, rhs: NavigationItem) -> Bool {
        lhs.id == rhs.id
    }

    func hash(into hasher: inout Hasher) {
        hasher.combine(id)
    }
}

// MARK: - Content List View

/// View displaying list of items for the selected section
struct ContentListView: View {
    let section: NavigationSection
    @Binding var selectedItem: NavigationItem?
    @Binding var searchText: String

    var body: some View {
        Group {
            switch section {
            case .dashboard:
                DashboardListView(selectedItem: $selectedItem, searchText: searchText)
            case .sessions:
                SessionsListView(selectedItem: $selectedItem, searchText: searchText)
            case .assignments:
                AssignmentsListView(selectedItem: $selectedItem, searchText: searchText)
            case .progress:
                ProgressListView(selectedItem: $selectedItem, searchText: searchText)
            case .messages:
                MessagesListView(selectedItem: $selectedItem, searchText: searchText)
            case .profile:
                ProfileListView(selectedItem: $selectedItem)
            case .settings:
                SettingsListView(selectedItem: $selectedItem)
            }
        }
        .navigationTitle(section.rawValue)
    }
}

// MARK: - Dashboard List View

struct DashboardListView: View {
    @Binding var selectedItem: NavigationItem?
    let searchText: String

    private let widgets = [
        NavigationItem(id: "upcoming-sessions", title: "Upcoming Sessions", subtitle: "3 sessions this week", icon: "calendar", type: .dashboardWidget("upcoming")),
        NavigationItem(id: "pending-assignments", title: "Pending Assignments", subtitle: "5 due soon", icon: "doc.badge.clock", type: .dashboardWidget("pending")),
        NavigationItem(id: "progress-overview", title: "Progress Overview", subtitle: "85% completion", icon: "chart.pie", type: .dashboardWidget("progress")),
        NavigationItem(id: "recent-activity", title: "Recent Activity", subtitle: "Last 7 days", icon: "clock.arrow.circlepath", type: .dashboardWidget("activity"))
    ]

    var filteredWidgets: [NavigationItem] {
        if searchText.isEmpty {
            return widgets
        }
        return widgets.filter { $0.title.localizedCaseInsensitiveContains(searchText) }
    }

    var body: some View {
        List(filteredWidgets, selection: $selectedItem) { widget in
            DashboardWidgetRow(widget: widget)
                .tag(widget)
        }
        .listStyle(.sidebar)
    }
}

struct DashboardWidgetRow: View {
    let widget: NavigationItem

    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: widget.icon ?? "square")
                .font(.title2)
                .foregroundStyle(.blue)
                .frame(width: 32)

            VStack(alignment: .leading, spacing: 2) {
                Text(widget.title)
                    .font(.headline)
                if let subtitle = widget.subtitle {
                    Text(subtitle)
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
            }
        }
        .padding(.vertical, 4)
    }
}

// MARK: - Sessions List View

struct SessionsListView: View {
    @Binding var selectedItem: NavigationItem?
    let searchText: String
    @StateObject private var viewModel = SessionsViewModel()

    var body: some View {
        List(viewModel.filteredSessions(searchText: searchText), selection: $selectedItem) { session in
            SessionListRow(session: session)
                .tag(NavigationItem(
                    id: session.id,
                    title: session.title,
                    subtitle: session.formattedDate,
                    icon: "video.fill",
                    type: .session(session.id)
                ))
        }
        .listStyle(.sidebar)
        .refreshable {
            await viewModel.refresh()
        }
        .toolbar {
            ToolbarItem(placement: .primaryAction) {
                Button {
                    viewModel.showBookingSheet = true
                } label: {
                    Label("Book Session", systemImage: "plus")
                }
            }
        }
        .sheet(isPresented: $viewModel.showBookingSheet) {
            BookSessionSheet()
        }
    }
}

struct SessionListRow: View {
    let session: Session

    var body: some View {
        HStack(spacing: 12) {
            Circle()
                .fill(session.statusColor)
                .frame(width: 10, height: 10)

            VStack(alignment: .leading, spacing: 2) {
                Text(session.title)
                    .font(.headline)
                Text(session.educatorName)
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
                Text(session.formattedDate)
                    .font(.caption)
                    .foregroundStyle(.tertiary)
            }

            Spacer()

            if session.isLive {
                Text("LIVE")
                    .font(.caption.bold())
                    .foregroundStyle(.white)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                    .background(.red)
                    .clipShape(Capsule())
            }
        }
        .padding(.vertical, 4)
    }
}

// MARK: - Assignments List View

struct AssignmentsListView: View {
    @Binding var selectedItem: NavigationItem?
    let searchText: String
    @StateObject private var viewModel = AssignmentsViewModel()

    var body: some View {
        List(viewModel.filteredAssignments(searchText: searchText), selection: $selectedItem) { assignment in
            AssignmentListRow(assignment: assignment)
                .tag(NavigationItem(
                    id: assignment.id,
                    title: assignment.title,
                    subtitle: "Due: \(assignment.formattedDueDate)",
                    icon: "doc.text.fill",
                    type: .assignment(assignment.id)
                ))
        }
        .listStyle(.sidebar)
        .refreshable {
            await viewModel.refresh()
        }
    }
}

struct AssignmentListRow: View {
    let assignment: Assignment

    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: assignment.isCompleted ? "checkmark.circle.fill" : "circle")
                .foregroundStyle(assignment.isCompleted ? .green : .secondary)
                .font(.title3)

            VStack(alignment: .leading, spacing: 2) {
                Text(assignment.title)
                    .font(.headline)
                    .strikethrough(assignment.isCompleted)
                Text(assignment.subject)
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
                Text("Due: \(assignment.formattedDueDate)")
                    .font(.caption)
                    .foregroundStyle(assignment.isOverdue ? .red : .tertiary)
            }

            Spacer()

            if assignment.isOverdue && !assignment.isCompleted {
                Image(systemName: "exclamationmark.triangle.fill")
                    .foregroundStyle(.red)
            }
        }
        .padding(.vertical, 4)
    }
}

// MARK: - Progress List View

struct ProgressListView: View {
    @Binding var selectedItem: NavigationItem?
    let searchText: String

    var body: some View {
        List {
            Section("Subjects") {
                ForEach(["Mathematics", "Physics", "Chemistry", "Biology"], id: \.self) { subject in
                    HStack {
                        Text(subject)
                        Spacer()
                        ProgressView(value: Double.random(in: 0.5...1.0))
                            .frame(width: 100)
                    }
                }
            }

            Section("Recent Achievements") {
                ForEach(1...5, id: \.self) { _ in
                    HStack {
                        Image(systemName: "star.fill")
                            .foregroundStyle(.yellow)
                        Text("Achievement Unlocked")
                    }
                }
            }
        }
        .listStyle(.sidebar)
    }
}

// MARK: - Messages List View

struct MessagesListView: View {
    @Binding var selectedItem: NavigationItem?
    let searchText: String

    var body: some View {
        List {
            ForEach(1...10, id: \.self) { index in
                HStack(spacing: 12) {
                    Circle()
                        .fill(.blue.gradient)
                        .frame(width: 40, height: 40)
                        .overlay {
                            Text("E\(index)")
                                .font(.caption.bold())
                                .foregroundStyle(.white)
                        }

                    VStack(alignment: .leading) {
                        Text("Educator \(index)")
                            .font(.headline)
                        Text("Latest message preview...")
                            .font(.subheadline)
                            .foregroundStyle(.secondary)
                            .lineLimit(1)
                    }

                    Spacer()

                    Text("2h ago")
                        .font(.caption)
                        .foregroundStyle(.tertiary)
                }
                .padding(.vertical, 4)
            }
        }
        .listStyle(.sidebar)
    }
}

// MARK: - Profile List View

struct ProfileListView: View {
    @Binding var selectedItem: NavigationItem?

    var body: some View {
        List {
            Section {
                Button {
                    selectedItem = NavigationItem(id: "personal-info", title: "Personal Information", subtitle: nil, icon: "person", type: .profile)
                } label: {
                    Label("Personal Information", systemImage: "person")
                }

                Button {
                    selectedItem = NavigationItem(id: "learning-preferences", title: "Learning Preferences", subtitle: nil, icon: "brain", type: .profile)
                } label: {
                    Label("Learning Preferences", systemImage: "brain")
                }

                Button {
                    selectedItem = NavigationItem(id: "notifications", title: "Notifications", subtitle: nil, icon: "bell", type: .profile)
                } label: {
                    Label("Notifications", systemImage: "bell")
                }
            }

            Section {
                Button {
                    selectedItem = NavigationItem(id: "subscription", title: "Subscription", subtitle: nil, icon: "creditcard", type: .profile)
                } label: {
                    Label("Subscription", systemImage: "creditcard")
                }

                Button {
                    selectedItem = NavigationItem(id: "payment-history", title: "Payment History", subtitle: nil, icon: "clock", type: .profile)
                } label: {
                    Label("Payment History", systemImage: "clock")
                }
            }
        }
        .listStyle(.sidebar)
    }
}

// MARK: - Settings List View

struct SettingsListView: View {
    @Binding var selectedItem: NavigationItem?

    var body: some View {
        List {
            Section("Preferences") {
                Button {
                    selectedItem = NavigationItem(id: "appearance", title: "Appearance", subtitle: nil, icon: "paintbrush", type: .settings)
                } label: {
                    Label("Appearance", systemImage: "paintbrush")
                }

                Button {
                    selectedItem = NavigationItem(id: "accessibility", title: "Accessibility", subtitle: nil, icon: "accessibility", type: .settings)
                } label: {
                    Label("Accessibility", systemImage: "accessibility")
                }
            }

            Section("Privacy & Security") {
                Button {
                    selectedItem = NavigationItem(id: "privacy", title: "Privacy", subtitle: nil, icon: "lock.shield", type: .settings)
                } label: {
                    Label("Privacy", systemImage: "lock.shield")
                }

                Button {
                    selectedItem = NavigationItem(id: "security", title: "Security", subtitle: nil, icon: "key", type: .settings)
                } label: {
                    Label("Security", systemImage: "key")
                }
            }

            Section("Support") {
                Button {
                    selectedItem = NavigationItem(id: "help", title: "Help & Support", subtitle: nil, icon: "questionmark.circle", type: .settings)
                } label: {
                    Label("Help & Support", systemImage: "questionmark.circle")
                }

                Button {
                    selectedItem = NavigationItem(id: "about", title: "About", subtitle: nil, icon: "info.circle", type: .settings)
                } label: {
                    Label("About", systemImage: "info.circle")
                }
            }
        }
        .listStyle(.sidebar)
    }
}

// MARK: - Detail View

/// View displaying details for the selected item
struct DetailView: View {
    let item: NavigationItem

    var body: some View {
        Group {
            switch item.type {
            case .session(let sessionId):
                SessionDetailView(sessionId: sessionId)
            case .assignment(let assignmentId):
                AssignmentDetailView(assignmentId: assignmentId)
            case .message(let messageId):
                MessageDetailView(messageId: messageId)
            case .profile:
                ProfileDetailView(section: item.id)
            case .settings:
                SettingsDetailView(section: item.id)
            case .dashboardWidget(let widgetType):
                DashboardWidgetDetailView(widgetType: widgetType)
            }
        }
    }
}

// MARK: - Placeholder Detail Views

struct MessageDetailView: View {
    let messageId: String

    var body: some View {
        Text("Message Details: \(messageId)")
            .navigationTitle("Message")
    }
}

struct ProfileDetailView: View {
    let section: String

    var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                Text("Profile Section: \(section)")
                    .font(.title)
            }
            .padding()
        }
        .navigationTitle("Profile")
    }
}

struct SettingsDetailView: View {
    let section: String

    var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                Text("Settings Section: \(section)")
                    .font(.title)
            }
            .padding()
        }
        .navigationTitle("Settings")
    }
}

struct DashboardWidgetDetailView: View {
    let widgetType: String

    var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                Text("Dashboard Widget: \(widgetType)")
                    .font(.title)
            }
            .padding()
        }
        .navigationTitle("Dashboard")
    }
}

// MARK: - Preview

#Preview {
    ContentView()
        .environmentObject(AuthManager.shared)
        .environmentObject(NetworkMonitor.shared)
        .environmentObject(DependencyContainer.shared)
}
