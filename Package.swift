// swift-tools-version: 6.0
import PackageDescription

let package = Package(
  name: "AppShortcutsAppleShared",
  products: [
    .library(
      name: "AppShortcutsAppleShared",
      targets: ["AppShortcutsAppleShared"]
    )
  ],
  targets: [
    .target(
      name: "AppShortcutsAppleShared",
      path: "ios/Support"
    ),
    .testTarget(
      name: "AppShortcutsAppleSharedTests",
      dependencies: ["AppShortcutsAppleShared"],
      path: "Tests/AppShortcutsAppleSharedTests"
    )
  ]
)
