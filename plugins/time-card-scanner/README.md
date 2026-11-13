# TimeCardScanner (Capacitor plugin)

Photograph a paper enduro time card and get its checkpoint table back as
`rows` of three strings. Offline, on device, iOS 26+ only (Apple's document
table detector). On older iOS, Android and web, `isAvailable()` is `false` and
the other methods reject with `UNAVAILABLE`.

## Development

This plugin is an npm workspace of the app (npm name: `time-card-scanner`).
Root `npm install` links it and builds `dist/`.

```sh
npm run build -w time-card-scanner   # rebuild after TypeScript changes
npx cap sync ios                     # after Swift or package changes
```

The camera permission (`NSCameraUsageDescription`) is already set in the app's
`Info.plist`.

The plugin compiles for the host's iOS 15 target; the scanner itself is behind
`#available(iOS 26)`.

## Use

```ts
import { TimeCardScanner } from 'time-card-scanner';

if ((await TimeCardScanner.isAvailable()).available) {
  try {
    const { image, rows, warnings } = await TimeCardScanner.captureCard({
      directory: 'DOCUMENTS',
      folder: 'cards',
    });
    // image.webPath → <img src>; image.path → @capacitor/filesystem
    // rows[i] = { c1, c2, c3, flagged? }, '' for a blank cell
  } catch (e: any) {
    if (e.code === 'CANCELLED') return; // user closed the scanner
    if (e.code === 'NO_TABLE') { /* e.data.image holds the photo */ }
  }
}
```

In the scanner choose **Manual** shutter, then Save. Hold the phone about
25–30 cm away: the document scanner does not switch to the macro lens.

`captureCard` takes the first page only (a warning notes extra pages).
`scanImage({ path })` re-reads a photo already on disk.

## Output

- Cells contain only `0-9` and `:`. Colons are meaningful (`:05`, `4:21`) and
  never stripped. Nothing is interpreted as a time.
- `rows.length` is the printed row count of the card (10/12/15/18), discovered
  from the photo.
- `flagged` marks rows the scanner doubts (a character was mapped to a digit, a
  row was inserted or its checkpoint number disagrees). Expect roughly one in
  five filled cells to be wrong: let the user edit.

## Layout

- `src/` — TypeScript definitions and web/Android fallback.
- `ios/Core/` — `TimeCardScannerCore`, the Swift scanning package (no Capacitor
  dependency; tests: `cd ios/Core && swift test`).
- `ios/Sources/TimeCardScannerPlugin/` — the Capacitor bridge.
