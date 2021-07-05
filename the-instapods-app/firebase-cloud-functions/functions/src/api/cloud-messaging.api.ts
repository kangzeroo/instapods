import * as admin from "firebase-admin";
import {
  TFcmToken,
  TFcmTopic,
  IDrop,
  TPodId
} from "@instapods/firestore-types";

export const sendPushNotificationsToPodTopic = async ({
  topic,
  drop
}: {
  topic: TPodId;
  drop: IDrop;
}) => {
  console.log("-------- sendPushNotificationsToPodTopic ------");
  console.log(topic);
  const p = new Promise((res, rej) => {
    const message = {
      notification: {
        title: `New IG post from @${drop.username}`,
        body: `Gain +${20} karma from commenting`
      },
      data: {
        dropId: drop.id,
        title: `New IG post from @${drop.username}`,
        body: `Gain +${20} karma from commenting`
        // notifee: JSON.stringify({
        //   body: `New IG post from @${drop.username}`,
        //   android: {
        //     channelId: "default"
        //   }
        // })
      },
      topic: topic
    };
    console.log(message);
    admin
      .messaging()
      .send(message)
      .then(response => {
        // Response is a message ID string.
        console.log("Successfully sent message:", response);
        res(response);
      })
      .catch(error => {
        console.log("Error sending message:", error);
        rej(error);
      });
  });
  return p;
};

export const subscribeToPodTopic = async ({
  topic,
  fcmToken
}: {
  topic: TFcmTopic;
  fcmToken: TFcmToken;
}) => {
  console.log("--------- subscribeToPodTopic");
  console.log(topic);
  console.log(fcmToken);
  const p = new Promise((res, rej) => {
    if (fcmToken) {
      admin
        .messaging()
        .subscribeToTopic([fcmToken], topic)
        .then(response => {
          // See the MessagingTopicManagementResponse reference documentation
          // for the contents of response.
          console.log("Successfully subscribed to topic:", response);
          res(response);
        })
        .catch(error => {
          console.log("Error subscribing to topic:", error);
          rej(error);
        });
    } else {
      res();
    }
  });
  return p;
};

export const unsubscribeFromPodTopic = async ({
  topic,
  fcmToken
}: {
  topic: TFcmTopic;
  fcmToken: TFcmToken;
}) => {
  console.log("--------- unsubscribeFromPodTopic");
  console.log(topic);
  console.log(fcmToken);
  const p = new Promise((res, rej) => {
    if (fcmToken) {
      admin
        .messaging()
        .unsubscribeFromTopic([fcmToken], topic)
        .then(response => {
          // See the MessagingTopicManagementResponse reference documentation
          // for the contents of response.
          console.log("Successfully unsubscribed from topic:", response);
          res(response);
        })
        .catch(error => {
          console.log("Error unsubscribing from topic:", error);
          rej(error);
        });
    } else {
      res();
    }
  });
  return p;
};
