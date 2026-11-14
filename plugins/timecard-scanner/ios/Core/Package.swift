// swift-tools-version: 6.2
import PackageDescription

// The S1 scanning core: no Capacitor dependency, so it builds and tests on
// the Mac and is shared by the plugin, the `scan` CLI and the test-bench app.
// Everything that touches Vision's document API is `@available(iOS 26, macOS 26)`;
// the declared minimum is lower only so the Capacitor plugin (iOS 15) can link it.
let package = Package(
    name: "TimeCardScannerCore",
    platforms: [.iOS(.v15), .macOS(.v26)],
    products: [
        .library(name: "TimeCardScannerCore", targets: ["TimeCardScannerCore"]),
    ],
    targets: [
        .target(name: "TimeCardScannerCore"),
        .testTarget(name: "TimeCardScannerCoreTests", dependencies: ["TimeCardScannerCore"]),
    ]
)
