/** @type {Detox.DetoxConfig} */
module.exports = {
  testRunner: {
    args: {
      $0: 'jest',
      config: 'e2e/jest.config.js',
    },
    jest: {
      setupTimeout: 120000,
    },
  },
  artifacts: {
    rootDir: 'artifacts',
    plugins: {
      log: 'failing',
      screenshot: 'failing',
      video: 'none',
    },
  },
  apps: {
    'ios.debug': {
      type: 'ios.app',
      binaryPath: 'ios/build/Build/Products/Debug-iphonesimulator/appshortcutsexample.app',
      build:
        'xcodebuild -workspace ios/appshortcutsexample.xcworkspace -scheme appshortcutsexample -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build',
      bundleId: 'expo.modules.appshortcuts.example',
    },
    'android.e2e': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/e2e/app-e2e.apk',
      testBinaryPath: 'android/app/build/outputs/apk/androidTest/e2e/app-e2e-androidTest.apk',
      build: 'cd android && ./gradlew assembleE2e assembleE2eAndroidTest -DtestBuildType=e2e',
      bundleId: 'expo.modules.appshortcuts.example',
    },
  },
  devices: {
    simulator: {
      type: 'ios.simulator',
      device: {
        type: process.env.DETOX_IOS_SIMULATOR || 'iPhone 15',
      },
    },
    emulator: {
      type: 'android.emulator',
      device: {
        avdName: process.env.DETOX_ANDROID_EMULATOR || 'Pixel_3a_API_34_extension_level_7_arm64-v8a',
      },
    },
  },
  configurations: {
    'ios.sim.debug': {
      device: 'simulator',
      app: 'ios.debug',
    },
    'android.emu.e2e': {
      device: 'emulator',
      app: 'android.e2e',
    },
  },
};
