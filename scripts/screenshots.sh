#!/usr/bin/env bash
# Visual-verification harness for the mobile UI restyle (docs/mobile-ui-spec.md, step 0).
# Builds the Capacitor app, installs it on a simulator/emulator, and captures PNGs
# for each {theme} x {text size} combination.
#
# Usage:
#   scripts/screenshots.sh ios     [--device "iPhone 17"] [--no-build]
#   scripts/screenshots.sh android [--avd Pixel_5]        [--no-build]
#
# Output: screenshots/<platform>/<device>/<name>-<theme>-<text>.png (git-ignored)
set -euo pipefail

cd "$(dirname "$0")/.."
ROOT=$PWD

PLATFORM=${1:-}
shift || true
DEVICE_NAME=""
AVD="Pixel_5"
BUILD=1
while [[ $# -gt 0 ]]; do
  case $1 in
    --device) DEVICE_NAME=$2; shift 2 ;;
    --avd) AVD=$2; shift 2 ;;
    --no-build) BUILD=0; shift ;;
    *) echo "unknown arg: $1" >&2; exit 1 ;;
  esac
done

THEMES=(light dark)
# name:ios content_size:android font_scale
TEXT_SIZES=(default:large:1.0 large:accessibility-extra-large:1.3)
SHOT_NAME=${SHOT_NAME:-home}
SETTLE=${SETTLE:-10}  # seconds to wait after launch before capturing

export ANDROID_HOME=${ANDROID_HOME:-$HOME/Library/Android/sdk}
export PATH="$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$PATH"

build_web() {
  [[ $BUILD -eq 1 ]] || return 0
  npm run build:cap
}

ios() {
  local device=${DEVICE_NAME:-"iPhone 17"}
  local udid
  # Newest runtime wins: simctl lists runtimes oldest to newest.
  udid=$(xcrun simctl list devices available | awk -v d="$device" '
    /^-- / {rt=$0}
    index($0, "    " d " (") == 1 {match($0, /\([0-9A-F-]{36}\)/); id=substr($0, RSTART+1, RLENGTH-2)}
    END {print id}')
  [[ -n $udid ]] || { echo "no simulator named '$device'" >&2; exit 1; }
  echo "==> iOS simulator: $device ($udid)"

  build_web
  xcrun simctl boot "$udid" 2>/dev/null || true
  xcrun simctl bootstatus "$udid" -b >/dev/null

  if [[ $BUILD -eq 1 ]]; then
    xcodebuild -project ios/App/App.xcodeproj -scheme App -configuration Debug \
      -destination "id=$udid" -derivedDataPath "$ROOT/.build/ios" build -quiet
  fi
  local app
  app=$(find "$ROOT/.build/ios/Build/Products" -name 'App.app' -maxdepth 3 | head -1)
  [[ -n $app ]] || { echo "App.app not found; run without --no-build" >&2; exit 1; }
  local bundle_id
  bundle_id=$(/usr/libexec/PlistBuddy -c 'Print :CFBundleIdentifier' "$app/Info.plist")
  xcrun simctl install "$udid" "$app"

  local out="screenshots/ios/${device// /_}"
  mkdir -p "$out"
  for theme in "${THEMES[@]}"; do
    xcrun simctl ui "$udid" appearance "$theme"
    for ts in "${TEXT_SIZES[@]}"; do
      IFS=: read -r label ios_size _ <<<"$ts"
      xcrun simctl ui "$udid" content_size "$ios_size" >/dev/null
      xcrun simctl terminate "$udid" "$bundle_id" 2>/dev/null || true
      xcrun simctl launch "$udid" "$bundle_id" >/dev/null
      sleep "$SETTLE"
      xcrun simctl io "$udid" screenshot "$out/$SHOT_NAME-$theme-$label.png" 2>/dev/null
      echo "    $out/$SHOT_NAME-$theme-$label.png"
    done
  done
  # Restore defaults.
  xcrun simctl ui "$udid" appearance light
  xcrun simctl ui "$udid" content_size large >/dev/null
}

android() {
  echo "==> Android emulator: $AVD"
  if ! adb get-state >/dev/null 2>&1; then
    nohup emulator -avd "$AVD" -no-snapshot-save -no-audio >/dev/null 2>&1 &
    adb wait-for-device
    until [[ $(adb shell getprop sys.boot_completed 2>/dev/null | tr -d '\r') == 1 ]]; do sleep 2; done
  fi

  build_web
  if [[ $BUILD -eq 1 ]]; then
    (cd android && ./gradlew --quiet assembleDebug)
  fi
  local apk
  apk=$(find android/app/build/outputs/apk/debug -name '*.apk' | head -1)
  [[ -n $apk ]] || { echo "debug APK not found; run without --no-build" >&2; exit 1; }
  adb install -r "$apk" >/dev/null
  local pkg=com.troysandal.enduroscorecard
  adb shell pm clear "$pkg" >/dev/null  # start from empty app data so captures are deterministic

  local out="screenshots/android/$AVD"
  mkdir -p "$out"
  for theme in "${THEMES[@]}"; do
    adb shell cmd uimode night "$([[ $theme == dark ]] && echo yes || echo no)" >/dev/null
    for ts in "${TEXT_SIZES[@]}"; do
      IFS=: read -r label _ scale <<<"$ts"
      adb shell settings put system font_scale "$scale"
      adb shell am force-stop "$pkg"
      adb shell monkey -p "$pkg" -c android.intent.category.LAUNCHER 1 >/dev/null 2>&1
      sleep "$SETTLE"
      adb exec-out screencap -p >"$out/$SHOT_NAME-$theme-$label.png"
      echo "    $out/$SHOT_NAME-$theme-$label.png"
    done
  done
  adb shell cmd uimode night no >/dev/null
  adb shell settings put system font_scale 1.0
}

case $PLATFORM in
  ios) ios ;;
  android) android ;;
  *) echo "usage: $0 ios|android [--device NAME | --avd NAME] [--no-build]" >&2; exit 1 ;;
esac
