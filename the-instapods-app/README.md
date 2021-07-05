# Instapods

# TO DO LIST

0. Fix the algorithm so that its a daily job that collects all of the days engagements and updates cloud bucket JSON karma files.

1. Loading animations, empty list messages, Error messages, Retries

1. Fix the bottom nav bug

1. Setup {@fcm}

1. Karma Algorithm. Implement the karma algorithm and take into account a KarmaUserUser that differs per viewer. This is necessary in the case where one user has many more followers than the other, and thus has a greater impact. They should not need to match engagement 1:1 because their engagement is worth more. - Is there a way to state tracking a graph their network and the engagement that comes with it? If we analyze who likes/engages with which posts, we have a proxy of audience quality to a niche. Perhaps in the future we can trade on that info.

1. Deep linking

1. Write the privacy policy and apply to release {@RNApp} to Apple Store and Google Play Store

1. Write up a set of infrastructure deployment scripts for easier dev testing

# The Entire System Explained Behaviorly

This outlines how the entire system works from the point of view of the users behavior. It contains references to API specs of firestore, cloudfns, graphql... etc. You can find those within this monorepo by searching for `README.md` files.

## User Signup

1. User auths into React-Native app (RNApp)
2. Auth CloudFN triggers {@cloudfn}`onSignup` and creates a {@firestore}`User` record
3. RNApp goes to a splash screen to onboard.
4. RNApp queries {@graphql}`q/getMyAccount` which finds its {@firestore}`User` record
5. App is loaded

## Joining a Pod

1. User opens/rejects a Pod invite deeplink, or inputs a Pod Signup referral code (0000 is public). RNApp fires {@graphql}`m/respondInvite` and Backend creates a {@firestore}`Invite.respondInvite` record
2. RNApp takes them into Pod and queries {@graphql}`q/getPodPrivate` which queries {@firestore}`Pod,KarmaPod,Users` and returns the Pod details & its members & karmas.

## Creating a Pod

1. User creates a Pod and RNApp fires {@graphql}`m/createPod`. Backend saves a {@firestore}`Pod` record.

## Sending a Pod Invite

1. From within the Pod, click the invite button. This fires {@graphql}`m/createInvite` and saves a {@firestore}`Invite.createInvite` record
2. User sends to friend the invite link of url format `/p/:podslug/i/:referralCode` and a password if necessary.

## Creating a Drop

1. User creates a drop from RNApp which fires a {@graphql}`m/createDrop` and saves a {@firestore}`Drop` record. The drop has an estimated drop datetime, but no notification will be sent out until the drop is released.
   - If there are any scheduled reminders in the {@firestore}`Drop` record, they will be scheduled to run on {@gapi}`Cloud Scheduler`.

## Releasing a Drop

1. User in RNApp goes to their drops list and clicks the release button, which fires a {@graphql}`m/releaseDrop` and updates {@firestore}`Drop` record. It also updates the {@firestore}`Pod.recentDrops` subcollection. In addition,
   - {@fcm}`dropRelease` will fire a push notification all users in subscribed Pods. Clicking the notification will take them to the Droppers Drop on RNApp where they can open or reject the post before opening it up on Instagram.
   - {@gapi}`Cloud Scheduler` will schedule {@apify}`crawlDrop` in 10 minutes and 24 hours. The 10 min {@apify}`crawlDrop` job will update the {@firestore}`Pod.recentDrops` to remove the drop.

## Firing a Drop Reminder

0. There should already be a drop reminder scheduled task in {@gapi}`Cloud Scheduler`.
1. {@gapi}`Cloud Scheduler` will fire a {@pubsub}`DropReminder` which triggers a {@cloudfn}`SendDropReminder` which fires {@fcm}`dropReminder`.
1. Users will receive a push notification on all their devices. Clicking the notification will take them to the Dropper's Profile in RNApp. RNApp will fire {@graphql}`q/getPublicUser` which queries {@graphql}`User,KarmaUserUser`
1. If reminders have changed, then clean up any unnecessary {@gapi}`Cloud Scheduler` tasks and add the new reminders in.

## Before GraphQL save of Engagement Event

1. Before any {@graphql} save of a {@firestore}`Engagement`, it will take the incoming engagement timestamp, query {@firestore}`Drop` to grab the drops release timestamp, and diff the two to calculate the # of seconds to engagement. That will be saved to the {@firestore}`Engagement` record.

## Firing the ACCEPT and DECLINE engagement event

1. When {@fcm}`dropRelease` push notification is clicked, the user in RNApp is taken to a Drop Review page where they can accept or decline the post. To display the Drop info, RNApp fires {@graphql}`q/getDropReview` which queries {@firestore}`Drop,KarmaUserUser`
2. Accepting will take the user to the drops IG page. RNApp will fire {@graphql}`acceptDrop` and create a {\$firestore}`Engagement` entry.
3. Declining will ask for a reason and then save to DB. RNApp will fire {@graphql}`declineDrop` and also create a {@firestore}`Engagement` entry

## Web Crawler runs on schedule and logs COMMENT engagement event

1. {@gapi}`Cloud Scheduler` will run a {@apify}`crawlDrop` job.
2. {@apify}`crawlDrop` will save any comments found to {@firestore}`Engagement` collection with type `COMMENT`. Before saving, it will query {@firestore}`Drop` to calculate # of seconds to `COMMENT` engagement.
3. {@firestore}`drop` gets crawlSchedule.10 set to TRUE

## Drop crawlSchedule.10 gets set to True

1. Triggers {@firebase}`onDropCrawlCompleteUpdateKarma` function which is a BIG ASS function that updates all user karmas and pod karmas affected.

## Leaving a Pod

0. User may leave voluntarily or be kicked out.
1. When User leaves voluntarily, RNApp will fire {@graphql}`m/leavePod` and create a {@firestore}`PodActivity` event as well as updating the {@firestore}`Pod` record to remove user from members list.
1. When User is kicked out, a PodAdmin will in RNApp fire {@graphql}`m/kickPodMember` and create a {@firestore}`PodActivity` event as well as updating the {@firestore}`Pod` record to remove user from members list.

## Changing Pod Admin Privilages

0. Currently this functionality is not supported via App. It must be manually changed via the Firestore GUI

## Retrieving Pod Lists & Pod Details

1. When a RNApp wants to retrieve a list of Pods, it will query {@graphql}`q/getPodList` which will query {@firestore}`Pod` and include its subcollection of recent drops.
2. When a RNApp wants to retrieve the details of a Pod, it will query {@graphql}`q/getPodPrivate` which will query {@firestore}`Pod` with karma info {@firestore}`KarmaPod,KarmaPodUser`

## Retrieving another User's Profile

1. RNApp will fire {@graphql}`q/getPublicUser` which queries {@graphql}`User,KarmaUserUser`
