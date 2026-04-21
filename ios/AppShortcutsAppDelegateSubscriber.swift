#if os(iOS)
import ExpoModulesCore
import UIKit

public class AppShortcutsAppDelegateSubscriber: ExpoAppDelegateSubscriber {
  public func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    if let shortcutItem = launchOptions?[.shortcutItem] as? UIApplicationShortcutItem {
      AppShortcutsRegistry.shared.storeInitialShortcut(shortcutItem)
      return false
    }

    return true
  }

  public func application(
    _ application: UIApplication,
    performActionFor shortcutItem: UIApplicationShortcutItem,
    completionHandler: @escaping (Bool) -> Void
  ) {
    AppShortcutsRegistry.shared.handleShortcut(shortcutItem)
    completionHandler(true)
  }
}
#endif
