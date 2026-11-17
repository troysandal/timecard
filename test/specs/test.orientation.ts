/// <reference types="node" />

import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

// The native orientation rules live in project files, not in code that runs under test, so
// pin them here: phones portrait, tablets free, Split View available (DESIGN.md "Orientation
// and tablets").

// Paths come from this file's location, so the tests don't depend on the working directory.
const repo = (path: string) => readFileSync(resolve(import.meta.dirname, '../..', path), 'utf8')

const plist = repo('ios/App/App/Info.plist')
const activity = repo('android/app/src/main/java/com/troysandal/endurocomputer/MainActivity.java')

function orientations(key: string): string[] {
  const match = plist.match(new RegExp(`<key>${key}</key>\\s*<array>([\\s\\S]*?)</array>`))
  expect(match, `${key} is defined`).not.toBeNull()
  return [...match![1]!.matchAll(/<string>(.*?)<\/string>/g)].map((m) => m[1]!)
}

describe('iOS orientations', () => {
  it('locks iPhone to portrait', () => {
    expect(orientations('UISupportedInterfaceOrientations')).toEqual(['UIInterfaceOrientationPortrait'])
  })

  it('lets iPad use all four orientations (required for Split View and Slide Over)', () => {
    expect(orientations('UISupportedInterfaceOrientations~ipad').sort()).toEqual(
      [
        'UIInterfaceOrientationLandscapeLeft',
        'UIInterfaceOrientationLandscapeRight',
        'UIInterfaceOrientationPortrait',
        'UIInterfaceOrientationPortraitUpsideDown',
      ].sort()
    )
  })

  it('does not require full screen, which would turn off iPad multitasking', () => {
    expect(plist).not.toMatch(/<key>UIRequiresFullScreen<\/key>\s*<true\/>/)
  })
})

describe('Android orientation', () => {
  it('locks phones to portrait and frees tablets at the 600dp breakpoint', () => {
    expect(activity).toContain('TABLET_MIN_SMALLEST_WIDTH_DP = 600')
    expect(activity).toMatch(/smallestScreenWidthDp\s*>=\s*TABLET_MIN_SMALLEST_WIDTH_DP/)
    expect(activity).toContain('SCREEN_ORIENTATION_PORTRAIT')
    expect(activity).toContain('SCREEN_ORIENTATION_UNSPECIFIED')
  })

  it('applies the lock before super.onCreate (never starts in landscape)', () => {
    const lock = activity.indexOf('applyOrientationLock(getResources()')
    const create = activity.indexOf('super.onCreate(savedInstanceState)')
    expect(lock, 'the lock is applied in onCreate').toBeGreaterThan(-1)
    expect(create, 'onCreate calls super').toBeGreaterThan(-1)
    expect(lock).toBeLessThan(create)
  })

  it('re-applies the lock on configuration changes (foldables, resized windows), because the manifest stops recreation', () => {
    expect(activity).toMatch(/onConfigurationChanged\(Configuration newConfig\)[\s\S]*applyOrientationLock\(newConfig\)/)
    const manifest = repo('android/app/src/main/AndroidManifest.xml')
    expect(manifest).toMatch(/configChanges="[^"]*smallestScreenSize/)
  })

  it('does not hard-lock the whole app in the manifest (that would lock tablets too)', () => {
    expect(repo('android/app/src/main/AndroidManifest.xml')).not.toContain('screenOrientation')
  })
})
