# What is this?




## Setup Steps

These steps are largely based off [this tutorial](https://dev.to/calintamas/how-to-manage-staging-and-production-environments-in-a-react-native-app-4naa) on `react-native-config`.

0. You should have already setup a Firebase project, as per the steps in backend repo `the-instapods-app`.
1. [ Repeat step from `the-instapods-app` ] Connect your frontend code to the new environment by copying over the plist for ios, and play-services.json for Android. Follow this [video tutorial](https://share.vidyard.com/watch/DqkYmhaVNMn3EL4CyxGEsJ?) to learn how. Store the files to this directory, pretending that this folder is the root level directory of app. For example, the following is equivalent:


```
InstapodsMobile/ios/GoogleService-Info.plist

// is equal to

InstapodsMobile/staging_creds/staging/ios/GoogleService-Info.plist
```

This is useful for swapping between prod, dev, staging. However, we use `react-native-config` to dynamically load the creds in without needing to manually move over these creds. Its more important that you copy over info from the `plist` and `google-services.json` to the following env variable files at the directory root:

- `.env.development`
- `.env.staging`
- `.env.production`

2. Update the above env variable files with `WEB_CLIENT_ID=firebase_oauth_client_id`. This [github comment](https://github.com/react-native-community/google-signin/issues/263#issuecomment-320611997) has a screenshot on how to find that from you `google-services.json` file.

3. Duplicate the new Project Schemes in [XCode as per instructions](https://github.com/luggit/react-native-config) in `react-native-config`

4. When we want to build the iOS app for different stages, we must select the scheme from `XCode`. Open the ios folder in XCode and click `Product > Scheme > Instapods.staging` to switch to your desired stage (`eg. Instapods.development or Instapods.production`).

5. Add the url scheme to XCode. [See tutorial](https://developers.google.com/identity/sign-in/ios/start-integrating), or go to `ios/InstapodsMobile/Info.plist` and change the XML directly:

```xml
<key>CFBundleURLTypes</key>
<array>
    <dict>
        <key>CFBundleTypeRole</key> 
        <string>Editor</string>
        <key>CFBundleURLSchemes</key>
        <array>
            <string>com.googleusercontent.apps.___REVERSED_CLIENT_ID_from_googleService-Info.plist___</string>
        </array>
    </dict>
</array>
```

6. Enable Google & SMS signin method in the Firebase Console. See [video tutorial](https://share.vidyard.com/watch/vYEQvjwPvP6zgQXUHCgdLK?)

7. 