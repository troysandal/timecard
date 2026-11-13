# Enduro Time Card
A very simple app to compute your score in a Time Keeping (AMA National & NEI Brand X) or Sprint Enduro.  Enter your time card scores then quickly verify times posted by the club to make sure no errors were made (unless they are your own 😀). App is live on [Github Pages](https://troysandal.github.io/timecard/).  This is a PWA so you can install it onto your iOS or Android device from the browser.  App store version is in a future release.

## Roadmap
- [X] Support [NETRA Brand X](https://www.netra.org/wp-content/uploads/2023/03/2023-NETRA-Enduro-Rules.pdf) scoring format
- [X] More than one timecard
- [ ] Scan timecard with device camera, attach photo to timecard
- [ ] Add to the Apple and Google Stores

## Development
This is a single page HTML/CSS/TypeScript/Svelte/Vite/Vitest/Cypress web app that runs as a Web page, PWA and Capacitor iOS and Android app. Everything was built with Node 26. 

First Time Setup
1. Initialize a self signed certificate for PWA `npm run cert`
2. Trust Certificate - e.g. in Chrome open chrome://settings/certificates
3. Import ./cert.crt
4. [optional] Jump to [PWA](#pwa) below and setup certs for each simulator

Here are the basics you'll need to work on it.
```
# Run site
npm run dev

# Unit Tests
npm run test

# Integration Tests
npm run dev
npx cypress open

# Debug Capacitor App w/Live Reloading
npm run build:cap:dev
npx cap open [ios|android]
npm run dev

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

Install Cert in simulator
- XCode 26 and before - Drag and drop your cert.crt file directly from your computer's finder onto the running iOS Simulator screen. 
- XCode 27+ - run `xcrun simctl keychain booted add-root-cert ./cert.crt`
- Enable Full Trust (Crucial Step for iOS):
  - Go to Settings -> General -> About -> Certificate Trust Settings (at the very bottom).
  - Find your certificate under "Enable full trust for root certificates" and toggle the switch to green/active.


**Android**
Two options - I prefer #2:
1. The Chrome Flag Trick (Easiest): Open Chrome inside the Android emulator, navigate to chrome://flags, search for "Insecure origins treated as secure", add http://10.0.2.2:5173 (note the http), enable it, and relaunch mobile Chrome. This fools Android into letting you test your PWA over an unencrypted local bridge.
2. The Local IP Route: If you want to keep HTTPS, update your OpenSSL command one more time to include your machine's actual local IP network block (like IP:192.168.1.X) or IP:10.0.2.2 inside the -addext block.

Since Android runs on a virtualized internal network, typing localhost will fail.
1. The URL to use: Open Google Chrome inside the Android emulator and go to: https://10.0.2.2:5173
2. Install the Certificate:
	• Drag and drop your cert.crt file directly from your computer onto the running Android emulator screen to save it to the virtual device downloads.
	• Inside the emulator, open Settings -> Security -> More Security Settings -> Encryption & credentials -> Install a certificate -> CA certificate.
	• Choose Install anyway, locate your cert.crt in the files explorer, and select it.
3. Restart Mobile Chrome: Fully close and open Chrome inside the emulator. The Service Worker will now register flawlessly over https://10.0.2.2:5173, letting you test the PWA features.



## Wallaby.js

[![Wallaby.js](https://img.shields.io/badge/wallaby.js-powered-blue.svg?style=for-the-badge&logo=github)](https://wallabyjs.com/oss/)

This repository contributors are welcome to use
[Wallaby.js OSS License](https://wallabyjs.com/oss/) to get
test results immediately as you type, and see the results in
your editor right next to your code.
