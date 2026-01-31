// swift-tools-version:5.10
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "NextPhoton",
    platforms: [
        .iOS(.v17),
        .macOS(.v14)
    ],
    products: [
        .library(
            name: "NextPhoton",
            targets: ["NextPhoton"]
        ),
    ],
    dependencies: [
        // Apollo iOS - GraphQL client for type-safe API communication
        .package(url: "https://github.com/apollographql/apollo-ios.git", from: "1.9.0"),

        // Kingfisher - Async image downloading and caching
        .package(url: "https://github.com/onevcat/Kingfisher.git", from: "7.11.0"),

        // Factory - Modern dependency injection for Swift
        .package(url: "https://github.com/hmlongco/Factory.git", from: "2.3.0"),

        // KeychainAccess - Secure keychain wrapper for credentials
        .package(url: "https://github.com/kishikawakatsumi/KeychainAccess.git", from: "4.2.2"),
    ],
    targets: [
        .target(
            name: "NextPhoton",
            dependencies: [
                .product(name: "Apollo", package: "apollo-ios"),
                .product(name: "ApolloAPI", package: "apollo-ios"),
                "Kingfisher",
                "Factory",
                "KeychainAccess",
            ],
            path: "NextPhoton"
        ),
        .testTarget(
            name: "NextPhotonTests",
            dependencies: ["NextPhoton"],
            path: "NextPhotonTests"
        ),
    ]
)
