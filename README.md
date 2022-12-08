# Enduro Time Card

Simple app to compute Enduro time card scores so you can quickly verify
times posted by the club to make sure no errors were made (unless they are 
yours:). App is live on [Github Pages](https://troysandal.github.io/timecard/).

```
# Run site
npm run dev

# Unit Tests
npm run test

# Integration Tests
npm run dev
npm cypress open

# Deploy
npm run test
npx cyrpress run
git push origin main

```

## To Dos
- PWA
  - Service Worker
    - Cache all generated file files
    - Cache all non-gen'ed files
  - iOS
    - Icons
  - Android
    - Icons

## Mobile App
Goal here is for a universal app for iOS and Android racers can put on their 
phones and use at the race to verify score cards.

### Progressive Web App
This seems like the easiest option as it lets us re-use the existing web site
versus having to create and maintain a separate React Native app.
- [ ] [What does it take to be installable?](https://web.dev/install-criteria/)
- [ ] [Building a PWA with Svelte - LogRocket Blog](https://blog.logrocket.com/building-a-pwa-with-svelte/)
- [ ] [Designing Native-Like Progressive Web Apps For iOS | by Appscope | Appscope | Medium](https://medium.com/appscope/designing-native-like-progressive-web-apps-for-ios-1b3cdda1d0e8)

