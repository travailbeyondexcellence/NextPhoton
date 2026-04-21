# NextPhoton Mobile Architecture

## Document Version
- **Version**: 1.0.0
- **Last Updated**: January 2026
- **Status**: Canonical Reference

---

## 1. Mobile Platform Overview

NextPhoton provides native mobile applications for Android, iOS, and iPadOS, each built with platform-specific technologies following Clean Architecture and MVVM patterns.

### 1.1 Platform Strategy

| Platform | Technology | Target |
|----------|-----------|--------|
| **Android** | Kotlin + Jetpack Compose | Android 8.0+ (API 26+) |
| **iOS** | Swift + SwiftUI | iOS 17.0+ |
| **iPadOS** | Swift + SwiftUI | iPadOS 17.0+ |

### 1.2 Architecture Principles

| Principle | Application |
|-----------|-------------|
| **Clean Architecture** | Domain → Data → Presentation separation |
| **MVVM** | Model-View-ViewModel pattern |
| **Unidirectional Data Flow** | State flows down, events flow up |
| **Dependency Injection** | Koin (Android), Factory (iOS) |
| **Offline-First** | Local database with sync |

---

## 2. Android Architecture (Kotlin + Jetpack Compose)

### 2.1 Project Structure

```
frontend/mobile/android/
├── app/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/nextphoton/
│   │   │   │   ├── NextPhotonApp.kt              # Application class
│   │   │   │   │
│   │   │   │   ├── domain/                        # Business Logic Layer
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   ├── User.kt
│   │   │   │   │   │   ├── Session.kt
│   │   │   │   │   │   ├── Assignment.kt
│   │   │   │   │   │   └── Progress.kt
│   │   │   │   │   ├── repositories/
│   │   │   │   │   │   ├── UserRepository.kt      # Interface
│   │   │   │   │   │   ├── SessionRepository.kt
│   │   │   │   │   │   └── AssignmentRepository.kt
│   │   │   │   │   └── usecases/
│   │   │   │   │       ├── auth/
│   │   │   │   │       │   ├── LoginUseCase.kt
│   │   │   │   │       │   └── RegisterUseCase.kt
│   │   │   │   │       ├── session/
│   │   │   │   │       │   ├── BookSessionUseCase.kt
│   │   │   │   │       │   └── GetSessionsUseCase.kt
│   │   │   │   │       └── assignment/
│   │   │   │   │           ├── GetAssignmentsUseCase.kt
│   │   │   │   │           └── SubmitAssignmentUseCase.kt
│   │   │   │   │
│   │   │   │   ├── data/                          # Data Layer
│   │   │   │   │   ├── repositories/
│   │   │   │   │   │   ├── UserRepositoryImpl.kt  # Implementation
│   │   │   │   │   │   ├── SessionRepositoryImpl.kt
│   │   │   │   │   │   └── AssignmentRepositoryImpl.kt
│   │   │   │   │   ├── remote/
│   │   │   │   │   │   ├── api/
│   │   │   │   │   │   │   ├── NextPhotonApi.kt   # GraphQL client
│   │   │   │   │   │   │   └── AuthApi.kt
│   │   │   │   │   │   └── dto/
│   │   │   │   │   │       ├── UserDto.kt
│   │   │   │   │   │       └── SessionDto.kt
│   │   │   │   │   ├── local/
│   │   │   │   │   │   ├── database/
│   │   │   │   │   │   │   ├── NextPhotonDatabase.kt
│   │   │   │   │   │   │   ├── dao/
│   │   │   │   │   │   │   │   ├── UserDao.kt
│   │   │   │   │   │   │   │   └── SessionDao.kt
│   │   │   │   │   │   │   └── entities/
│   │   │   │   │   │   │       ├── UserEntity.kt
│   │   │   │   │   │   │       └── SessionEntity.kt
│   │   │   │   │   │   └── preferences/
│   │   │   │   │   │       └── UserPreferences.kt # DataStore
│   │   │   │   │   └── mappers/
│   │   │   │   │       ├── UserMapper.kt
│   │   │   │   │       └── SessionMapper.kt
│   │   │   │   │
│   │   │   │   ├── presentation/                  # UI Layer
│   │   │   │   │   ├── navigation/
│   │   │   │   │   │   ├── NavGraph.kt
│   │   │   │   │   │   └── Routes.kt
│   │   │   │   │   ├── theme/
│   │   │   │   │   │   ├── Theme.kt
│   │   │   │   │   │   ├── Color.kt
│   │   │   │   │   │   └── Typography.kt
│   │   │   │   │   ├── components/
│   │   │   │   │   │   ├── common/
│   │   │   │   │   │   │   ├── LoadingButton.kt
│   │   │   │   │   │   │   ├── ErrorDialog.kt
│   │   │   │   │   │   │   └── EmptyState.kt
│   │   │   │   │   │   └── cards/
│   │   │   │   │   │       ├── SessionCard.kt
│   │   │   │   │   │       └── AssignmentCard.kt
│   │   │   │   │   └── screens/
│   │   │   │   │       ├── auth/
│   │   │   │   │       │   ├── LoginScreen.kt
│   │   │   │   │       │   ├── LoginViewModel.kt
│   │   │   │   │       │   └── LoginState.kt
│   │   │   │   │       ├── home/
│   │   │   │   │       │   ├── HomeScreen.kt
│   │   │   │   │       │   ├── HomeViewModel.kt
│   │   │   │   │       │   └── HomeState.kt
│   │   │   │   │       ├── sessions/
│   │   │   │   │       │   ├── SessionsScreen.kt
│   │   │   │   │       │   └── SessionsViewModel.kt
│   │   │   │   │       ├── assignments/
│   │   │   │   │       │   ├── AssignmentsScreen.kt
│   │   │   │   │       │   └── AssignmentsViewModel.kt
│   │   │   │   │       └── profile/
│   │   │   │   │           ├── ProfileScreen.kt
│   │   │   │   │           └── ProfileViewModel.kt
│   │   │   │   │
│   │   │   │   └── core/                          # Core Utilities
│   │   │   │       ├── di/
│   │   │   │       │   ├── AppModule.kt           # Koin modules
│   │   │   │       │   ├── NetworkModule.kt
│   │   │   │       │   ├── DatabaseModule.kt
│   │   │   │       │   └── UseCaseModule.kt
│   │   │   │       ├── utils/
│   │   │   │       │   ├── Resource.kt            # Result wrapper
│   │   │   │       │   ├── NetworkUtils.kt
│   │   │   │       │   └── DateUtils.kt
│   │   │   │       └── extensions/
│   │   │   │           ├── ContextExtensions.kt
│   │   │   │           └── FlowExtensions.kt
│   │   │   │
│   │   │   ├── res/
│   │   │   │   ├── values/
│   │   │   │   │   ├── strings.xml
│   │   │   │   │   ├── colors.xml
│   │   │   │   │   └── themes.xml
│   │   │   │   └── drawable/
│   │   │   │
│   │   │   └── AndroidManifest.xml
│   │   │
│   │   ├── test/                                  # Unit Tests
│   │   │   └── java/com/nextphoton/
│   │   │       ├── domain/usecases/
│   │   │       ├── data/repositories/
│   │   │       └── presentation/viewmodels/
│   │   │
│   │   └── androidTest/                           # Instrumented Tests
│   │       └── java/com/nextphoton/
│   │           ├── ui/
│   │           └── e2e/
│   │
│   └── build.gradle.kts
│
├── gradle/
│   └── libs.versions.toml                         # Version catalog
│
├── build.gradle.kts
├── settings.gradle.kts
└── gradle.properties
```

### 2.2 Core Technologies

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Language** | Kotlin | 2.0.x | Primary language |
| **UI** | Jetpack Compose | 1.6.x | Declarative UI |
| **Build** | Gradle (Kotlin DSL) | 8.6.x | Build system |

### 2.3 Libraries

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **HTTP** | Ktor | 2.3.x | Network requests |
| **DI** | Koin | 3.5.x | Dependency injection |
| **Database** | Room | 2.6.x | Local persistence |
| **GraphQL** | Apollo Kotlin | 4.0.x | GraphQL client |
| **Async** | Coroutines | 1.8.x | Concurrency |
| **Serialization** | Kotlin Serialization | 1.6.x | JSON parsing |
| **Images** | Coil | 2.6.x | Image loading |
| **Navigation** | Navigation Compose | 2.7.x | Screen navigation |
| **Preferences** | DataStore | 1.0.x | Key-value storage |

### 2.4 Testing Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **JUnit 5** | 5.10.x | Unit testing |
| **MockK** | 1.13.x | Mocking |
| **Turbine** | 1.1.x | Flow testing |
| **Robolectric** | 4.11.x | Android unit tests |
| **Espresso** | 3.5.x | UI testing |
| **Compose Test** | 1.6.x | Compose testing |
| **Kaspresso** | 1.5.x | E2E testing |

### 2.5 Sample ViewModel

```kotlin
// presentation/screens/home/HomeViewModel.kt
@HiltViewModel
class HomeViewModel @Inject constructor(
    private val getSessionsUseCase: GetSessionsUseCase,
    private val getAssignmentsUseCase: GetAssignmentsUseCase
) : ViewModel() {

    private val _state = MutableStateFlow(HomeState())
    val state: StateFlow<HomeState> = _state.asStateFlow()

    init {
        loadDashboard()
    }

    fun loadDashboard() {
        viewModelScope.launch {
            _state.update { it.copy(isLoading = true) }

            combine(
                getSessionsUseCase(),
                getAssignmentsUseCase()
            ) { sessions, assignments ->
                HomeState(
                    isLoading = false,
                    upcomingSessions = sessions.take(3),
                    pendingAssignments = assignments.filter { !it.isCompleted }
                )
            }.catch { error ->
                _state.update { it.copy(isLoading = false, error = error.message) }
            }.collect { newState ->
                _state.value = newState
            }
        }
    }
}

data class HomeState(
    val isLoading: Boolean = false,
    val upcomingSessions: List<Session> = emptyList(),
    val pendingAssignments: List<Assignment> = emptyList(),
    val error: String? = null
)
```

---

## 3. iOS Architecture (Swift + SwiftUI)

### 3.1 Project Structure

```
frontend/mobile/ios/
├── NextPhoton/
│   ├── NextPhotonApp.swift                       # App entry point
│   │
│   ├── Domain/                                    # Business Logic Layer
│   │   ├── Entities/
│   │   │   ├── User.swift
│   │   │   ├── Session.swift
│   │   │   ├── Assignment.swift
│   │   │   └── Progress.swift
│   │   ├── Repositories/
│   │   │   ├── UserRepositoryProtocol.swift
│   │   │   ├── SessionRepositoryProtocol.swift
│   │   │   └── AssignmentRepositoryProtocol.swift
│   │   └── UseCases/
│   │       ├── Auth/
│   │       │   ├── LoginUseCase.swift
│   │       │   └── RegisterUseCase.swift
│   │       ├── Session/
│   │       │   ├── BookSessionUseCase.swift
│   │       │   └── GetSessionsUseCase.swift
│   │       └── Assignment/
│   │           ├── GetAssignmentsUseCase.swift
│   │           └── SubmitAssignmentUseCase.swift
│   │
│   ├── Data/                                      # Data Layer
│   │   ├── Repositories/
│   │   │   ├── UserRepository.swift              # Implementation
│   │   │   ├── SessionRepository.swift
│   │   │   └── AssignmentRepository.swift
│   │   ├── Remote/
│   │   │   ├── API/
│   │   │   │   ├── NextPhotonAPI.swift           # GraphQL client
│   │   │   │   └── AuthAPI.swift
│   │   │   └── DTOs/
│   │   │       ├── UserDTO.swift
│   │   │       └── SessionDTO.swift
│   │   ├── Local/
│   │   │   ├── Database/
│   │   │   │   ├── NextPhotonModelContainer.swift # SwiftData
│   │   │   │   └── Models/
│   │   │   │       ├── UserModel.swift
│   │   │   │       └── SessionModel.swift
│   │   │   └── Keychain/
│   │   │       └── KeychainManager.swift
│   │   └── Mappers/
│   │       ├── UserMapper.swift
│   │       └── SessionMapper.swift
│   │
│   ├── Presentation/                              # UI Layer
│   │   ├── Navigation/
│   │   │   ├── AppNavigator.swift
│   │   │   └── Routes.swift
│   │   ├── Theme/
│   │   │   ├── Theme.swift
│   │   │   ├── Colors.swift
│   │   │   └── Typography.swift
│   │   ├── Components/
│   │   │   ├── Common/
│   │   │   │   ├── LoadingButton.swift
│   │   │   │   ├── ErrorView.swift
│   │   │   │   └── EmptyStateView.swift
│   │   │   └── Cards/
│   │   │       ├── SessionCard.swift
│   │   │       └── AssignmentCard.swift
│   │   └── Screens/
│   │       ├── Auth/
│   │       │   ├── LoginView.swift
│   │       │   └── LoginViewModel.swift
│   │       ├── Home/
│   │       │   ├── HomeView.swift
│   │       │   └── HomeViewModel.swift
│   │       ├── Sessions/
│   │       │   ├── SessionsView.swift
│   │       │   └── SessionsViewModel.swift
│   │       ├── Assignments/
│   │       │   ├── AssignmentsView.swift
│   │       │   └── AssignmentsViewModel.swift
│   │       └── Profile/
│   │           ├── ProfileView.swift
│   │           └── ProfileViewModel.swift
│   │
│   ├── Core/                                      # Core Utilities
│   │   ├── DI/
│   │   │   └── Container.swift                   # Factory container
│   │   ├── Utils/
│   │   │   ├── Result+Extensions.swift
│   │   │   ├── NetworkMonitor.swift
│   │   │   └── DateFormatter+Extensions.swift
│   │   └── Extensions/
│   │       ├── View+Extensions.swift
│   │       └── Publisher+Extensions.swift
│   │
│   ├── Resources/
│   │   ├── Assets.xcassets
│   │   ├── Localizable.strings
│   │   └── Info.plist
│   │
│   └── Generated/                                 # Apollo generated
│       └── GraphQL/
│
├── NextPhotonTests/                               # Unit Tests
│   ├── Domain/UseCases/
│   ├── Data/Repositories/
│   └── Presentation/ViewModels/
│
├── NextPhotonUITests/                             # UI Tests
│   └── Screens/
│
└── Package.swift                                  # SPM dependencies
```

### 3.2 Core Technologies

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Language** | Swift | 5.10+ | Primary language |
| **UI** | SwiftUI | 5.x | Declarative UI |
| **Min Target** | iOS | 17.0+ | Minimum version |
| **Package Manager** | SPM | - | Dependencies |

### 3.3 Libraries

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **GraphQL** | Apollo iOS | 1.9.x | GraphQL client |
| **Persistence** | SwiftData | 1.x | Local database |
| **Keychain** | KeychainAccess | 4.2.x | Secure storage |
| **Images** | Kingfisher | 7.11.x | Image loading |
| **DI** | Factory | 2.3.x | Dependency injection |
| **Networking** | URLSession | - | Native HTTP |
| **Reactive** | Combine | - | Reactive streams |

### 3.4 Testing Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **XCTest** | - | Unit testing |
| **Quick** | 7.x | BDD testing |
| **Nimble** | 13.x | Matchers |
| **ViewInspector** | 0.9.x | SwiftUI testing |
| **OHHTTPStubs** | 9.x | Network mocking |
| **XCUITest** | - | UI testing |
| **SnapshotTesting** | 1.15.x | Snapshot tests |

### 3.5 Sample ViewModel

```swift
// Presentation/Screens/Home/HomeViewModel.swift
import Foundation
import Combine

@MainActor
final class HomeViewModel: ObservableObject {
    @Published private(set) var state = HomeState()

    private let getSessionsUseCase: GetSessionsUseCase
    private let getAssignmentsUseCase: GetAssignmentsUseCase
    private var cancellables = Set<AnyCancellable>()

    init(
        getSessionsUseCase: GetSessionsUseCase,
        getAssignmentsUseCase: GetAssignmentsUseCase
    ) {
        self.getSessionsUseCase = getSessionsUseCase
        self.getAssignmentsUseCase = getAssignmentsUseCase
        loadDashboard()
    }

    func loadDashboard() {
        state.isLoading = true

        Publishers.Zip(
            getSessionsUseCase.execute(),
            getAssignmentsUseCase.execute()
        )
        .receive(on: DispatchQueue.main)
        .sink { [weak self] completion in
            self?.state.isLoading = false
            if case .failure(let error) = completion {
                self?.state.error = error.localizedDescription
            }
        } receiveValue: { [weak self] sessions, assignments in
            self?.state.upcomingSessions = Array(sessions.prefix(3))
            self?.state.pendingAssignments = assignments.filter { !$0.isCompleted }
        }
        .store(in: &cancellables)
    }
}

struct HomeState {
    var isLoading = false
    var upcomingSessions: [Session] = []
    var pendingAssignments: [Assignment] = []
    var error: String?
}
```

---

## 4. iPadOS Architecture

### 4.1 iPad-Specific Features

| Feature | Technology | Purpose |
|---------|-----------|---------|
| **Multitasking** | SwiftUI Scenes | Split View, Slide Over |
| **Sidebar** | NavigationSplitView | Three-column layout |
| **Keyboard** | FocusState, KeyboardShortcut | Hardware keyboard |
| **Pencil** | PencilKit | Apple Pencil drawing |
| **Stage Manager** | WindowGroup | Multi-window |

### 4.2 Adaptive Layout

```swift
// Presentation/Navigation/AppNavigator.swift
struct AppNavigator: View {
    @State private var selectedSection: Section? = .home
    @State private var selectedItem: Item?

    var body: some View {
        NavigationSplitView {
            // Sidebar
            List(Section.allCases, selection: $selectedSection) { section in
                Label(section.title, systemImage: section.icon)
                    .tag(section)
            }
            .navigationTitle("NextPhoton")
        } content: {
            // Content list
            if let section = selectedSection {
                ContentListView(section: section, selection: $selectedItem)
            }
        } detail: {
            // Detail view
            if let item = selectedItem {
                DetailView(item: item)
            } else {
                ContentUnavailableView(
                    "Select an item",
                    systemImage: "doc.text"
                )
            }
        }
        .navigationSplitViewStyle(.balanced)
    }
}
```

### 4.3 Apple Pencil Integration

```swift
// Presentation/Components/WhiteboardView.swift
import PencilKit

struct WhiteboardView: View {
    @State private var canvasView = PKCanvasView()
    @State private var toolPicker = PKToolPicker()

    var body: some View {
        CanvasRepresentable(canvasView: $canvasView)
            .onAppear {
                toolPicker.setVisible(true, forFirstResponder: canvasView)
                toolPicker.addObserver(canvasView)
                canvasView.becomeFirstResponder()
            }
    }
}

struct CanvasRepresentable: UIViewRepresentable {
    @Binding var canvasView: PKCanvasView

    func makeUIView(context: Context) -> PKCanvasView {
        canvasView.drawingPolicy = .anyInput
        canvasView.tool = PKInkingTool(.pen, color: .black, width: 2)
        return canvasView
    }

    func updateUIView(_ uiView: PKCanvasView, context: Context) {}
}
```

---

## 5. Shared Functionality

### 5.1 GraphQL Schema Sharing

All platforms share the same GraphQL schema:

```
shared/graphql/
├── schema.graphqls
├── queries/
│   ├── auth.graphql
│   ├── sessions.graphql
│   └── assignments.graphql
└── mutations/
    ├── auth.graphql
    └── sessions.graphql
```

### 5.2 Offline-First Strategy

| Layer | Android | iOS |
|-------|---------|-----|
| **Database** | Room | SwiftData |
| **Sync** | WorkManager | BGTaskScheduler |
| **Conflict Resolution** | Last-write-wins | Last-write-wins |

### 5.3 Push Notifications

| Platform | Technology |
|----------|-----------|
| **Android** | Firebase Cloud Messaging (FCM) |
| **iOS/iPadOS** | Apple Push Notification service (APNs) |

---

## 6. Feature Parity Matrix

| Feature | Android | iOS | iPadOS |
|---------|---------|-----|--------|
| Authentication | ✅ | ✅ | ✅ |
| Biometric Login | ✅ | ✅ | ✅ |
| Session Booking | ✅ | ✅ | ✅ |
| Assignments | ✅ | ✅ | ✅ |
| Progress Tracking | ✅ | ✅ | ✅ |
| Notifications | ✅ | ✅ | ✅ |
| Offline Mode | ✅ | ✅ | ✅ |
| Dark Mode | ✅ | ✅ | ✅ |
| Widgets | ✅ | ✅ | ✅ |
| Pencil Support | ❌ | ❌ | ✅ |
| Split View | ❌ | ❌ | ✅ |
| Keyboard Shortcuts | ❌ | ❌ | ✅ |

---

## 7. Build & Release

### 7.1 Android

| Tool | Purpose |
|------|---------|
| **Gradle** | Build system |
| **R8/ProGuard** | Code shrinking |
| **Firebase App Distribution** | Beta testing |
| **Google Play Console** | Production release |

### 7.2 iOS/iPadOS

| Tool | Purpose |
|------|---------|
| **Xcode** | Build system |
| **Fastlane** | Automation |
| **TestFlight** | Beta testing |
| **App Store Connect** | Production release |

---

This mobile architecture ensures consistent user experience across all platforms while leveraging platform-specific capabilities for optimal performance and native feel.
