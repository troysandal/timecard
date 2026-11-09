# Enduro Time Card
A very simple app to compute your score in a Time Keeping or Sprint Enduro.  Enter your time card scores then quickly verify times posted by the club to make sure no errors were made (unless they are your own 😀). App is live on [Github Pages](https://troysandal.github.io/timecard/).  This is a PWA so you can install it onto your iOS or Android device from the browser.  App store version is in a future release.

For Time Keeping Enduros, the app only supports the [AMA National](https://ecea.org/documents/ecea-rulebook-current.pdf) format.

## Future Plans
- Support [NETRA Brand X](https://www.netra.org/wp-content/uploads/2023/03/2023-NETRA-Enduro-Rules.pdf) scoring format
- More than one timecard
- Scan timecard with device camera, attach photo to timecard
- Add to the Apple and Google Stores

## Development
This is a single page HTML PWA app that uses Svelte with basic CSS, build system is Vite.  All code is written in Typescript.  Unit tests use Vitest and E2E tests use Cypress. Everything was built with Node 24. Very simple.

First Time Setup
```
# 1. Initialize a self signed certificate for PWA
npm run cert

# 2. Trust Certificate - e.g. in Chrome open chrome://settings/certificates
# 3. Import ./cert.crt
```

Here are the basics you'll need to work on it.
```
# Run site
npm run dev

# Unit Tests
npm run test

# Integration Tests
npm run dev
npx cypress open

# Deploy Web / PWA
npm run build
npm run test
npx cyrpress run
git push origin main

# Deploy to Capacitor
npm run build:cap
npx cap sync ios android

# Open Native Projects
npx cap open [ios|android]
```

## PWA
We still support PWA which means you need the openssl certificate trusted by your browser.  For iOS and Android simulators you need to add the cert.

**iOS**

Drag and drop your cert.crt file directly from your computer's finder onto the running iOS Simulator screen. Go to Settings -> Profile Downloaded, install the certificate profile, and then go to Settings -> General -> About -> Certificate Trust Settings and toggle full trust on for your certificate.

**Android**
Two options:
1. The Chrome Flag Trick (Easiest): Open Chrome inside the Android emulator, navigate to chrome://flags, search for "Insecure origins treated as secure", add http://10.0.2.2:5173 (note the http), enable it, and relaunch mobile Chrome. This fools Android into letting you test your PWA over an unencrypted local bridge.
2. The Local IP Route: If you want to keep HTTPS, update your OpenSSL command one more time to include your machine's actual local IP network block (like IP:192.168.1.X) or IP:10.0.2.2 inside the -addext block.


## Wallaby.js

[![Wallaby.js](https://img.shields.io/badge/wallaby.js-powered-blue.svg?style=for-the-badge&logo=github)](https://wallabyjs.com/oss/)

This repository contributors are welcome to use
[Wallaby.js OSS License](https://wallabyjs.com/oss/) to get
test results immediately as you type, and see the results in
your editor right next to your code.
