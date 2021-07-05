// The Firebase Admin SDK to access the Firebase Realtime Database.
require("dotenv");
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp(functions.config().firebase);

export { default as graphql } from "./fn/graphql/";
export { default as onAuthCreate } from "./fn/onAuthCreate/";
export { default as onApifyCrawled } from "./fn/onApifyCrawled";
export { default as scheduledDropCrawler } from "./fn/scheduledDropCrawler";
export { default as scheduleDropFragmentCleaner } from "./fn/scheduleDropFragmentCleaner";
export { default as scheduleRecentDropCleaner } from "./fn/scheduleRecentDropCleaner";
export { default as onDropCrawlCompleteUpdateKarma } from "./fn/onDropCrawlCompleteUpdateKarma";
export { default as logging } from "./fn/logging";
