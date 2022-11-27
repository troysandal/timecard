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

## React Native App
Goal here is for a universal app for iOS and Android racers can put on their 
phones and use at the race to verify score cards.

Issues
* Sharing Source - need to setup a [monorepo](https://github.com/MoixaEnergy/typescript-monorepo-with-create-react-app)
 to share the web and mobile code. [This person](https://stackoverflow.com/questions/62978085/how-to-import-external-typescript-files-in-expo-project) had a similar issue with webpack. Expo has [a guide](https://docs.expo.dev/guides/monorepos/) on this.