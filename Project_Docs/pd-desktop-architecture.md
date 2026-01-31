# NextPhoton Desktop Architecture (Tauri 2.x)

## Document Version
- **Version**: 1.0.0
- **Last Updated**: January 2026
- **Status**: Canonical Reference

---

## 1. Desktop Platform Overview

NextPhoton Desktop is a cross-platform application built with Tauri 2.x, combining a Rust backend with a React/TypeScript frontend for native performance and web-based UI flexibility.

### 1.1 Platform Targets

| Platform | Status | Min Version |
|----------|--------|-------------|
| **Windows** | Supported | Windows 10+ |
| **macOS** | Supported | macOS 11+ |
| **Linux** | Supported | Ubuntu 20.04+ |

### 1.2 Architecture Principles

| Principle | Application |
|-----------|-------------|
| **Clean Architecture** | Rust: Domain → Infrastructure |
| **Native Performance** | Rust backend for heavy operations |
| **Shared UI** | React frontend shared with web |
| **Offline-First** | SQLite local database |
| **Secure by Default** | No Node.js, minimal permissions |

---

## 2. Technology Stack

### 2.1 Core Technologies

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Framework** | Tauri | 2.x | Desktop framework |
| **Backend** | Rust | 1.76.x | Native backend |
| **Frontend** | React + TypeScript | 19.x / 5.4.x | UI layer |
| **Build Tool** | Vite | 5.x | Frontend bundler |
| **Package Manager** | Bun | 1.1.x | JS dependencies |
| **Styling** | Tailwind CSS | 4.x | Utility CSS |

### 2.2 Rust Libraries

| Library | Version | Purpose |
|---------|---------|---------|
| **Tokio** | 1.36.x | Async runtime |
| **Serde** | 1.0.x | Serialization |
| **SQLx** | 0.7.x | Database (SQLite) |
| **reqwest** | 0.12.x | HTTP client |
| **graphql_client** | 0.14.x | GraphQL client |
| **tauri-plugin-store** | 2.x | Local storage |
| **tauri-plugin-sql** | 2.x | SQLite plugin |
| **keyring** | 2.x | Secure credential storage |
| **notify** | 6.x | File system watching |
| **directories** | 5.x | Platform directories |

### 2.3 Testing Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **cargo test** | - | Rust unit tests |
| **rstest** | 0.18.x | Rust test framework |
| **mockall** | 0.12.x | Rust mocking |
| **Vitest** | 2.x | Frontend unit tests |
| **Playwright** | 1.43.x | E2E testing |
| **WebDriver** | - | Tauri E2E |

---

## 3. Project Structure

```
frontend/desktop/
├── src-tauri/                        # Rust Backend
│   ├── Cargo.toml
│   ├── tauri.conf.json               # Tauri configuration
│   ├── capabilities/                  # Security capabilities
│   │   ├── default.json
│   │   └── main-window.json
│   ├── icons/                         # App icons
│   │   ├── icon.ico
│   │   ├── icon.icns
│   │   └── icon.png
│   │
│   └── src/
│       ├── main.rs                    # Entry point
│       ├── lib.rs                     # Library root
│       │
│       ├── domain/                    # Business Logic Layer
│       │   ├── mod.rs
│       │   ├── entities/
│       │   │   ├── mod.rs
│       │   │   ├── user.rs
│       │   │   ├── session.rs
│       │   │   └── assignment.rs
│       │   ├── repositories/          # Repository traits
│       │   │   ├── mod.rs
│       │   │   ├── user_repository.rs
│       │   │   └── session_repository.rs
│       │   └── services/              # Service traits
│       │       ├── mod.rs
│       │       ├── auth_service.rs
│       │       └── sync_service.rs
│       │
│       ├── infrastructure/            # External Concerns
│       │   ├── mod.rs
│       │   ├── persistence/
│       │   │   ├── mod.rs
│       │   │   ├── database.rs        # SQLite setup
│       │   │   ├── user_repo_impl.rs
│       │   │   └── session_repo_impl.rs
│       │   ├── network/
│       │   │   ├── mod.rs
│       │   │   ├── graphql_client.rs
│       │   │   └── api_client.rs
│       │   └── security/
│       │       ├── mod.rs
│       │       └── keychain.rs
│       │
│       ├── application/               # Use Cases & Commands
│       │   ├── mod.rs
│       │   ├── commands/              # Tauri commands
│       │   │   ├── mod.rs
│       │   │   ├── auth_commands.rs
│       │   │   ├── session_commands.rs
│       │   │   └── sync_commands.rs
│       │   └── state/                 # Application state
│       │       ├── mod.rs
│       │       └── app_state.rs
│       │
│       └── di/                        # Dependency Injection
│           ├── mod.rs
│           └── container.rs
│
├── src/                               # React Frontend (shared with web)
│   ├── main.tsx                       # Entry point
│   ├── App.tsx
│   ├── components/                    # Shared components
│   │   ├── common/
│   │   └── cards/
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useTauri.ts               # Tauri-specific hooks
│   ├── lib/
│   │   └── tauri.ts                  # Tauri API wrappers
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   └── Sessions.tsx
│   └── styles/
│       └── globals.css
│
├── tests/
│   ├── unit/                          # Vitest unit tests
│   └── e2e/                           # Playwright E2E
│
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## 4. Rust Backend Architecture

### 4.1 Clean Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                      TAURI COMMANDS                          │
│              (interfaces/commands/*.rs)                      │
└─────────────────────────────────┬───────────────────────────┘
                                  │
┌─────────────────────────────────▼───────────────────────────┐
│                      APPLICATION                             │
│           Commands, Queries, State Management                │
└─────────────────────────────────┬───────────────────────────┘
                                  │
┌─────────────────────────────────▼───────────────────────────┐
│                         DOMAIN                               │
│        Entities, Repository Traits, Service Traits           │
└─────────────────────────────────┬───────────────────────────┘
                                  │
┌─────────────────────────────────▼───────────────────────────┐
│                     INFRASTRUCTURE                           │
│    SQLite, GraphQL Client, HTTP Client, Keychain             │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 Entry Point (main.rs)

```rust
// src-tauri/src/main.rs
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod domain;
mod infrastructure;
mod application;
mod di;

use application::commands::*;
use application::state::AppState;
use di::Container;

fn main() {
    let container = Container::new().expect("Failed to initialize container");

    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_sql::Builder::default().build())
        .manage(AppState::new(container))
        .invoke_handler(tauri::generate_handler![
            // Auth commands
            auth_commands::login,
            auth_commands::logout,
            auth_commands::get_current_user,
            // Session commands
            session_commands::get_sessions,
            session_commands::book_session,
            session_commands::cancel_session,
            // Sync commands
            sync_commands::sync_data,
            sync_commands::get_sync_status,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

### 4.3 Domain Layer Example

```rust
// src-tauri/src/domain/entities/user.rs
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct User {
    pub id: String,
    pub email: String,
    pub name: String,
    pub role: UserRole,
    pub created_at: chrono::DateTime<chrono::Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum UserRole {
    Learner,
    Guardian,
    Educator,
    ECM,
    Admin,
}

// src-tauri/src/domain/repositories/user_repository.rs
use async_trait::async_trait;
use crate::domain::entities::User;

#[async_trait]
pub trait UserRepository: Send + Sync {
    async fn find_by_id(&self, id: &str) -> Result<Option<User>, RepositoryError>;
    async fn find_by_email(&self, email: &str) -> Result<Option<User>, RepositoryError>;
    async fn save(&self, user: &User) -> Result<(), RepositoryError>;
    async fn delete(&self, id: &str) -> Result<(), RepositoryError>;
}
```

### 4.4 Tauri Commands Example

```rust
// src-tauri/src/application/commands/auth_commands.rs
use tauri::State;
use crate::application::state::AppState;
use crate::domain::entities::User;

#[derive(Debug, serde::Serialize)]
pub struct LoginResponse {
    pub user: User,
    pub token: String,
}

#[tauri::command]
pub async fn login(
    state: State<'_, AppState>,
    email: String,
    password: String,
) -> Result<LoginResponse, String> {
    let auth_service = state.container.auth_service();

    match auth_service.login(&email, &password).await {
        Ok((user, token)) => {
            // Store token securely
            state.container.keychain().store_token(&token).await
                .map_err(|e| e.to_string())?;

            Ok(LoginResponse { user, token })
        }
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
pub async fn logout(state: State<'_, AppState>) -> Result<(), String> {
    let auth_service = state.container.auth_service();
    let keychain = state.container.keychain();

    auth_service.logout().await.map_err(|e| e.to_string())?;
    keychain.clear_token().await.map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
pub async fn get_current_user(state: State<'_, AppState>) -> Result<Option<User>, String> {
    let keychain = state.container.keychain();
    let auth_service = state.container.auth_service();

    let token = keychain.get_token().await.map_err(|e| e.to_string())?;

    match token {
        Some(t) => auth_service.get_user_from_token(&t).await
            .map_err(|e| e.to_string()),
        None => Ok(None),
    }
}
```

### 4.5 SQLite Database

```rust
// src-tauri/src/infrastructure/persistence/database.rs
use sqlx::sqlite::{SqlitePool, SqlitePoolOptions};
use std::path::PathBuf;

pub struct Database {
    pool: SqlitePool,
}

impl Database {
    pub async fn new(app_data_dir: PathBuf) -> Result<Self, sqlx::Error> {
        let db_path = app_data_dir.join("nextphoton.db");

        let pool = SqlitePoolOptions::new()
            .max_connections(5)
            .connect(&format!("sqlite:{}?mode=rwc", db_path.display()))
            .await?;

        // Run migrations
        sqlx::migrate!("./migrations")
            .run(&pool)
            .await?;

        Ok(Self { pool })
    }

    pub fn pool(&self) -> &SqlitePool {
        &self.pool
    }
}
```

---

## 5. Frontend Integration

### 5.1 Tauri API Wrapper

```typescript
// src/lib/tauri.ts
import { invoke } from '@tauri-apps/api/core'

export interface User {
  id: string
  email: string
  name: string
  role: 'Learner' | 'Guardian' | 'Educator' | 'ECM' | 'Admin'
}

export interface LoginResponse {
  user: User
  token: string
}

export const tauriApi = {
  auth: {
    login: (email: string, password: string): Promise<LoginResponse> =>
      invoke('login', { email, password }),

    logout: (): Promise<void> =>
      invoke('logout'),

    getCurrentUser: (): Promise<User | null> =>
      invoke('get_current_user'),
  },

  sessions: {
    getSessions: (): Promise<Session[]> =>
      invoke('get_sessions'),

    bookSession: (sessionData: SessionBooking): Promise<Session> =>
      invoke('book_session', { sessionData }),
  },

  sync: {
    syncData: (): Promise<SyncResult> =>
      invoke('sync_data'),

    getSyncStatus: (): Promise<SyncStatus> =>
      invoke('get_sync_status'),
  },
}
```

### 5.2 React Hook for Tauri

```typescript
// src/hooks/useTauri.ts
import { useState, useCallback } from 'react'
import { tauriApi, User } from '../lib/tauri'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await tauriApi.auth.login(email, password)
      setUser(response.user)
      return response
    } catch (e) {
      setError(e as string)
      throw e
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    await tauriApi.auth.logout()
    setUser(null)
  }, [])

  const checkAuth = useCallback(async () => {
    setLoading(true)
    try {
      const currentUser = await tauriApi.auth.getCurrentUser()
      setUser(currentUser)
    } finally {
      setLoading(false)
    }
  }, [])

  return { user, loading, error, login, logout, checkAuth }
}
```

---

## 6. Offline-First Architecture

### 6.1 Sync Strategy

```
┌─────────────────┐      ┌─────────────────┐
│   Local SQLite  │◄────►│   Sync Engine   │
│    Database     │      │                 │
└─────────────────┘      └────────┬────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │   GraphQL API   │
                         │    (Remote)     │
                         └─────────────────┘
```

### 6.2 Sync Commands

```rust
// src-tauri/src/application/commands/sync_commands.rs
use tauri::State;
use crate::application::state::AppState;

#[derive(Debug, serde::Serialize)]
pub struct SyncStatus {
    pub last_sync: Option<chrono::DateTime<chrono::Utc>>,
    pub pending_changes: usize,
    pub is_syncing: bool,
}

#[derive(Debug, serde::Serialize)]
pub struct SyncResult {
    pub synced_items: usize,
    pub conflicts: Vec<SyncConflict>,
}

#[tauri::command]
pub async fn sync_data(state: State<'_, AppState>) -> Result<SyncResult, String> {
    let sync_service = state.container.sync_service();

    sync_service.sync_all().await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_sync_status(state: State<'_, AppState>) -> Result<SyncStatus, String> {
    let sync_service = state.container.sync_service();

    sync_service.get_status().await
        .map_err(|e| e.to_string())
}
```

---

## 7. Security Configuration

### 7.1 Tauri Capabilities

```json
// src-tauri/capabilities/main-window.json
{
  "identifier": "main-window",
  "description": "Main window capabilities",
  "windows": ["main"],
  "permissions": [
    "core:default",
    "store:default",
    "sql:default",
    {
      "identifier": "http:default",
      "allow": [
        { "url": "https://api.nextphoton.com/**" }
      ]
    },
    "notification:default",
    "clipboard:default"
  ]
}
```

### 7.2 Secure Credential Storage

```rust
// src-tauri/src/infrastructure/security/keychain.rs
use keyring::Entry;

pub struct Keychain {
    service: String,
}

impl Keychain {
    pub fn new(service: &str) -> Self {
        Self {
            service: service.to_string(),
        }
    }

    pub async fn store_token(&self, token: &str) -> Result<(), KeychainError> {
        let entry = Entry::new(&self.service, "auth_token")?;
        entry.set_password(token)?;
        Ok(())
    }

    pub async fn get_token(&self) -> Result<Option<String>, KeychainError> {
        let entry = Entry::new(&self.service, "auth_token")?;
        match entry.get_password() {
            Ok(token) => Ok(Some(token)),
            Err(keyring::Error::NoEntry) => Ok(None),
            Err(e) => Err(e.into()),
        }
    }

    pub async fn clear_token(&self) -> Result<(), KeychainError> {
        let entry = Entry::new(&self.service, "auth_token")?;
        let _ = entry.delete_password(); // Ignore if not exists
        Ok(())
    }
}
```

---

## 8. Build & Distribution

### 8.1 Build Commands

```bash
# Development
cd frontend/desktop
bun install
bun run tauri dev

# Production build
bun run tauri build

# Platform-specific builds
bun run tauri build --target x86_64-pc-windows-msvc    # Windows
bun run tauri build --target x86_64-apple-darwin        # macOS Intel
bun run tauri build --target aarch64-apple-darwin       # macOS ARM
bun run tauri build --target x86_64-unknown-linux-gnu   # Linux
```

### 8.2 Distribution Formats

| Platform | Format | Auto-Update |
|----------|--------|-------------|
| **Windows** | .msi, .exe | ✅ NSIS |
| **macOS** | .dmg, .app | ✅ Sparkle |
| **Linux** | .deb, .AppImage | ✅ AppImage |

### 8.3 Auto-Update Configuration

```json
// src-tauri/tauri.conf.json
{
  "bundle": {
    "active": true,
    "targets": "all",
    "identifier": "com.nextphoton.app",
    "publisher": "NextPhoton",
    "icon": ["icons/icon.icns", "icons/icon.ico", "icons/icon.png"]
  },
  "plugins": {
    "updater": {
      "active": true,
      "endpoints": [
        "https://releases.nextphoton.com/{{target}}/{{current_version}}"
      ],
      "pubkey": "YOUR_PUBLIC_KEY"
    }
  }
}
```

---

## 9. Testing

### 9.1 Rust Unit Tests

```rust
// src-tauri/src/domain/entities/user_test.rs
#[cfg(test)]
mod tests {
    use super::*;
    use rstest::*;

    #[rstest]
    fn test_user_creation() {
        let user = User {
            id: "1".to_string(),
            email: "test@example.com".to_string(),
            name: "Test User".to_string(),
            role: UserRole::Learner,
            created_at: chrono::Utc::now(),
        };

        assert_eq!(user.email, "test@example.com");
    }
}
```

### 9.2 Frontend E2E with Playwright

```typescript
// tests/e2e/login.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Desktop Login', () => {
  test('should login successfully', async ({ page }) => {
    await page.goto('tauri://localhost')

    await page.fill('[name="email"]', 'test@example.com')
    await page.fill('[name="password"]', 'password123')
    await page.click('button[type="submit"]')

    await expect(page.getByText('Dashboard')).toBeVisible()
  })
})
```

---

This desktop architecture provides native performance with web UI flexibility, ensuring a consistent experience across Windows, macOS, and Linux.
