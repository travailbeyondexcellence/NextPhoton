// main.rs - NextPhoton Desktop Application Entry Point
// =============================================================================
// This is the entry point for the Tauri desktop application.
// It initializes the application container, plugins, and command handlers.
//
// Architecture:
// - Uses Clean Architecture with Domain, Infrastructure, and Application layers
// - Implements dependency injection through a Container pattern
// - All Tauri commands are registered here and routed to application layer
// =============================================================================

#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use log::{error, info};
use std::sync::Arc;
use tauri::{Manager, WindowEvent};

mod application;
mod di;
mod domain;
mod infrastructure;

use application::commands::{auth_commands, session_commands, sync_commands, system_commands};
use application::state::AppState;
use di::Container;

/// Application entry point
/// Initializes the Tauri application with all plugins, state management,
/// and command handlers for IPC communication with the frontend.
fn main() {
    // Initialize logging for development and debugging
    env_logger::Builder::from_env(env_logger::Env::default().default_filter_or("info"))
        .format_timestamp_millis()
        .init();

    info!("Starting NextPhoton Desktop Application...");

    // Build and run the Tauri application
    tauri::Builder::default()
        // =====================================================================
        // Plugin Registration
        // =====================================================================
        // Store plugin - Persistent local storage for app settings
        .plugin(tauri_plugin_store::Builder::default().build())
        // SQL plugin - SQLite database support
        .plugin(tauri_plugin_sql::Builder::default().build())
        // HTTP plugin - Network requests
        .plugin(tauri_plugin_http::init())
        // Notification plugin - System notifications
        .plugin(tauri_plugin_notification::init())
        // Shell plugin - Open URLs and run system commands
        .plugin(tauri_plugin_shell::init())
        // File system plugin - File operations
        .plugin(tauri_plugin_fs::init())
        // Dialog plugin - Native file dialogs
        .plugin(tauri_plugin_dialog::init())
        // Clipboard plugin - System clipboard access
        .plugin(tauri_plugin_clipboard_manager::init())
        // Process plugin - Process management
        .plugin(tauri_plugin_process::init())
        // Updater plugin - Auto-updates
        .plugin(tauri_plugin_updater::Builder::new().build())
        // Deep link plugin - Handle custom URL schemes
        .plugin(tauri_plugin_deep_link::init())
        // Single instance plugin - Prevent multiple instances
        .plugin(tauri_plugin_single_instance::init(|app, argv, cwd| {
            info!("Single instance detected: argv={:?}, cwd={}", argv, cwd);
            // Focus the main window when another instance tries to open
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.set_focus();
            }
        }))
        // Autostart plugin - Launch on system startup
        .plugin(tauri_plugin_autostart::init(
            tauri_plugin_autostart::MacosLauncher::LaunchAgent,
            Some(vec!["--minimized"]),
        ))
        // Window state plugin - Remember window position/size
        .plugin(tauri_plugin_window_state::Builder::default().build())
        // =====================================================================
        // Application Setup
        // =====================================================================
        .setup(|app| {
            info!("Setting up application...");

            // Get the app data directory for database and cache storage
            let app_data_dir = app
                .path()
                .app_data_dir()
                .expect("Failed to get app data directory");

            // Create the directory if it doesn't exist
            std::fs::create_dir_all(&app_data_dir)?;

            info!("App data directory: {:?}", app_data_dir);

            // Initialize the dependency injection container
            // This creates all services and repositories needed by the application
            let runtime = tokio::runtime::Runtime::new()?;
            let container = runtime.block_on(async {
                Container::new(app_data_dir.clone())
                    .await
                    .expect("Failed to initialize container")
            });

            // Create and manage the application state
            let app_state = AppState::new(Arc::new(container));
            app.manage(app_state);

            info!("Application setup complete");

            // Setup system tray if enabled
            #[cfg(desktop)]
            {
                use tauri::tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent};
                use tauri::menu::{MenuBuilder, MenuItemBuilder};

                let show_item = MenuItemBuilder::new("Show")
                    .id("show")
                    .build(app)?;
                let hide_item = MenuItemBuilder::new("Hide")
                    .id("hide")
                    .build(app)?;
                let quit_item = MenuItemBuilder::new("Quit")
                    .id("quit")
                    .build(app)?;

                let menu = MenuBuilder::new(app)
                    .item(&show_item)
                    .item(&hide_item)
                    .separator()
                    .item(&quit_item)
                    .build()?;

                let _tray = TrayIconBuilder::new()
                    .menu(&menu)
                    .tooltip("NextPhoton EduCare")
                    .on_menu_event(move |app, event| {
                        match event.id().as_ref() {
                            "show" => {
                                if let Some(window) = app.get_webview_window("main") {
                                    let _ = window.show();
                                    let _ = window.set_focus();
                                }
                            }
                            "hide" => {
                                if let Some(window) = app.get_webview_window("main") {
                                    let _ = window.hide();
                                }
                            }
                            "quit" => {
                                app.exit(0);
                            }
                            _ => {}
                        }
                    })
                    .on_tray_icon_event(|tray, event| {
                        if let TrayIconEvent::Click {
                            button: MouseButton::Left,
                            button_state: MouseButtonState::Up,
                            ..
                        } = event
                        {
                            let app = tray.app_handle();
                            if let Some(window) = app.get_webview_window("main") {
                                let _ = window.show();
                                let _ = window.set_focus();
                            }
                        }
                    })
                    .build(app)?;
            }

            Ok(())
        })
        // =====================================================================
        // Window Event Handling
        // =====================================================================
        .on_window_event(|window, event| {
            match event {
                WindowEvent::CloseRequested { api, .. } => {
                    // Hide window instead of closing (minimize to tray)
                    #[cfg(not(target_os = "macos"))]
                    {
                        let _ = window.hide();
                        api.prevent_close();
                    }
                }
                WindowEvent::Focused(focused) => {
                    if *focused {
                        info!("Window focused: {}", window.label());
                    }
                }
                _ => {}
            }
        })
        // =====================================================================
        // Command Handlers (IPC)
        // =====================================================================
        // Register all Tauri commands for frontend-backend communication
        .invoke_handler(tauri::generate_handler![
            // Authentication commands
            auth_commands::login,
            auth_commands::logout,
            auth_commands::get_current_user,
            auth_commands::refresh_token,
            auth_commands::register,
            // Session commands
            session_commands::get_sessions,
            session_commands::get_session_by_id,
            session_commands::book_session,
            session_commands::cancel_session,
            session_commands::get_upcoming_sessions,
            // Sync commands
            sync_commands::sync_data,
            sync_commands::get_sync_status,
            sync_commands::force_sync,
            // System commands
            system_commands::get_app_info,
            system_commands::check_for_updates,
            system_commands::get_system_info,
            system_commands::open_external_link,
        ])
        // =====================================================================
        // Run Application
        // =====================================================================
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
