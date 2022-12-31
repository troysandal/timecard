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
  - [Vite PWA Module](https://vite-pwa-org.netlify.app/)
  - Icons
    - Use Start Icon, common to all races
    - Rounded Rect Corners - 
    - 152, 180, 167, 192, 512
    - [FavIcon Generator?](https://realfavicongenerator.net/)
  - [iOS](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html)
    - [Great Reference](https://medium.com/appscope/designing-native-like-progressive-web-apps-for-ios-1b3cdda1d0e8)
    - Icons go in index.html
    - [Sizes](https://developer.apple.com/design/human-interface-guidelines/foundations/app-icons/)
      - 152, 180, 167
    - [Splash Screen](https://appsco.pe/developer/splash-screens)
    Status Bar
  - Android
    - Icons go in Manifest.json
    - 192 and 512 icons


### Progressive Web App
This seems like the easiest option as it lets us re-use the existing web site
versus having to create and maintain a separate React Native app.
- [ ] [What does it take to be installable?](https://web.dev/install-criteria/)
- [ ] [Building a PWA with Svelte - LogRocket Blog](https://blog.logrocket.com/building-a-pwa-with-svelte/)
- [ ] [Designing Native-Like Progressive Web Apps For iOS | by Appscope | Appscope | Medium](https://medium.com/appscope/designing-native-like-progressive-web-apps-for-ios-1b3cdda1d0e8)

