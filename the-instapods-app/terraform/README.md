# Infrastructure Deployment

This doc outlines how to create a complete replica of our infrastructure so that we can spin up independent dev/staging/prod environments. Although the folder is named Terraform, there is a mix of bash scripts, javascript files, and manual steps.

## Steps

1. Login to our firebase account with `instapods.success@gmail.com` and create a new Firebase project. Watch this [video tutorial](https://share.vidyard.com/watch/4QjiGv6VATswF6JnP4kjEM?) to learn how.

2. Connect your frontend code to the new environment by copying over the plist for ios, and play-services.json for Android. Follow this [video tutorial](https://share.vidyard.com/watch/DqkYmhaVNMn3EL4CyxGEsJ?) to learn how.

3. Download the `GOOGLE_APPLICATION_CREDENTIALS.json` to be used by Firebase backend. This is the exact same steps as #4 (GCP service key for terraform) except with more permissions. Download the key and move it into the right folder.

4. Create and download a GCP service key for our project, to be used by Terraform. Follow this [video tutorial](https://share.vidyard.com/watch/MfxjPYhfuCUcwSnNSNf7Mr?)

5. Rename the GCP service key to `instapods-infradeploy.json`. Then place it in the appropriate folder within `terraform/envs/`, which can be a copy of `terraform/envs/mockenvs/instapods-infradeploy.json`. For example, `terraform/envs/staging/instapods-infradeploy.json`.

6. Enable any GCP services that you may need access to. Follow this [video tutorial](https://share.vidyard.com/watch/5nsAXYdF3cqStW8cq7CDK9?).

7. Deploy the APIFY creds to firebase with `$ npm run load-apify-creds`

8. Set the firebase cli to use the new prod creds with `$ npm run load-firebase-creds`. Warning, right now the package.json script uses a hardcoded project id in `firebase use <PROJECT_ID>`. Change the `<PROJECT_ID>` to whatever you need.

9. Finally, deploy your backend with `$ firebase deploy --only functions`
