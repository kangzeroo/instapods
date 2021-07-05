# Environments Setup

The following creds need to be set

1. Firebase
        - `.env.mock` -> copy this per environment eg. `.env.production`
        - `ios/GoogleService-info.plist`
        - `android/app/google-services.json`
All the google creds for iOS & Android should be backed up locally at `credentials/mock/(ios|android)/*`. Use that to easily swap out the above google creds. Follow this [video tutorial](https://share.vidyard.com/watch/DqkYmhaVNMn3EL4CyxGEsJ?) to learn how.
        - Enable [OAuth Consent in Google Cloud Console](https://console.cloud.google.com/apis/credentials/consent). Make sure you are in the right project. See [tutorial video](https://share.vidyard.com/watch/SEnrEW9EyWEyM2351ad3QX?)

2. iOS
        - `ios/InstapodsMobile/Info.plist`
The creds for iOS in the`plist` should be swapped out at `CFBundleURLSchemes`. Insert the `REVERSED_CLIENT_ID` from `GoogleService-info.plist` there.

3. Android
        - ??? not completed yet
The creds for Android... not sure. Haven't done it yet.