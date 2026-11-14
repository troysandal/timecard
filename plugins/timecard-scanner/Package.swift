// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "TimeCardScanner",
    platforms: [.iOS(.v15)],
    products: [
        .library(name: "TimeCardScanner", targets: ["TimeCardScannerPlugin"]),
    ],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", from: "8.0.0"),
        // The S1 scanning core, a separate package so it builds and tests with `swift test`, without Capacitor.
        .package(name: "TimeCardScannerCore", path: "ios/Core"),
    ],
    targets: [
        .target(
            name: "TimeCardScannerPlugin",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "Cordova", package: "capacitor-swift-pm"),
                .product(name: "TimeCardScannerCore", package: "TimeCardScannerCore"),
            ],
            path: "ios/Sources/TimeCardScannerPlugin"
        ),
    ]
)
