# The Instapods App

## Deployment Tutorials
- Release to  Test Flight [Tutorial](https://readybytes.in/blog/how-to-deploy-a-react-native-ios-app-on-the-app-store)

## Android Release
- Need to generate keystore files for dev/staging/prod. [See tutorial](https://dev.to/calintamas/how-to-manage-staging-and-production-environments-in-a-react-native-app-4naa)

The mobile app for Instapods, written in React Native and compiled for iOS and Android. An infrastructure reploy script is coming out.

## Libraries Used
- [UI Kitten](https://akveo.github.io/react-native-ui-kitten/)
- [React Native Firebase](https://invertase.io/oss/react-native-firebase/)

## Helpful Resources
- How to install Firebase for iOS on react-native [Tutorial](https://invertase.io/oss/react-native-firebase/quick-start/ios-firebase-credentials)
- How to install Firebase for Android on react-native [Tutorial](https://invertase.io/oss/react-native-firebase/quick-start/android-firebase-credentials)
    - How to change `bundleID` for iOS and Android [Tutorial](https://medium.com/@impaachu/how-to-change-bundle-identifier-of-ios-app-and-package-name-of-android-app-within-react-native-app-4fbdd6679aa2)
    - Debug signing certificate SHA1 is saved in `/android/app/debug.keystore`
- React Typescript types [cheatsheet](https://www.saltycrane.com/cheat-sheets/typescript/react/latest/)

## Getting started

```
npm install .
```

### Set up firebase for ios

if you do not have command "pod", run: 
```
sudo gem install cocoapods
```

then you can run
```
cd ios && pod install
```

to start up in ios
```
cd ..
npm run ios
```


### Set up firebase for android


