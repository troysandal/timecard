# Sprint Enduro Time Card

Simple app to compute Sprint Enduro time card scores so you can quickly verify
times posted by the club to make sure no errors were made (unless they are 
yours:)).

```
# Run site
npm run dev

# Unit Tests
npm run test

# Integration Tests
npm run dev
npm cypress open
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
- Sprint
  - [] Switch to numeric inputs like Enduro?
- Time Keeper Enduro
  - [ ] User Interface
    - Is it always 2 pts / 5pts for burning?
    - Red input border when invalid #
    - Cypress Tests

## Mobile App
Goal here is for a universal app for iOS and Android racers can put on their 
phones and use at the race to verify score cards.

### Progressive Web App
This seems like the easiest option as it lets us re-use the existing web site
versus having to create and maintain a separate React Native app.
- [ ] [What does it take to be installable?](https://web.dev/install-criteria/)
- [ ] [Building a PWA with Svelte - LogRocket Blog](https://blog.logrocket.com/building-a-pwa-with-svelte/)
- [ ] [Designing Native-Like Progressive Web Apps For iOS | by Appscope | Appscope | Medium](https://medium.com/appscope/designing-native-like-progressive-web-apps-for-ios-1b3cdda1d0e8)

