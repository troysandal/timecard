# Enduro Time Card
A very simple app to compute your score in a Time Keeping or Sprint Enduro.  Enter your time card scores then quickly verify times posted by the club to make sure no errors were made (unless they are your own 😀). App is live on [Github Pages](https://troysandal.github.io/timecard/).  This is a PWA so you can install it onto your iOS or Android device from the browser.  App store version is in a future release.

For Time Keeping Enduros, the app only supports the [AMA National](https://ecea.org/documents/ecea-rulebook-current.pdf) format.

## Future Plans
- Support [NETRA Brand X](https://www.netra.org/wp-content/uploads/2023/03/2023-NETRA-Enduro-Rules.pdf) scoring format
- More than one timecard
- Scan timecard with device camera, attach photo to timecard
- Add to the Apple and Google Stores

## Development
This is a single page HTML PWA app that uses Svelte with basic CSS, build system is Vite.  All code is written in Typescript.  Unit tests use Mocha+Chai and E2E tests use Cypress. Everything was built with Node 24. Very simple.

Here are the basics you'll need to work on it.

```
# Run site
npm run dev

# Unit Tests
npm run test

# Integration Tests
npm run dev
npx cypress open

# Deploy
npm run test
npx cyrpress run
git push origin main
```

## Wallaby.js

[![Wallaby.js](https://img.shields.io/badge/wallaby.js-powered-blue.svg?style=for-the-badge&logo=github)](https://wallabyjs.com/oss/)

This repository contributors are welcome to use
[Wallaby.js OSS License](https://wallabyjs.com/oss/) to get
test results immediately as you type, and see the results in
your editor right next to your code.
