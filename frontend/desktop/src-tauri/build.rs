// build.rs - Tauri build script
// This script is executed before the main build and generates
// the necessary Tauri bindings and context

fn main() {
    // Generate Tauri context and command bindings
    tauri_build::build()
}
