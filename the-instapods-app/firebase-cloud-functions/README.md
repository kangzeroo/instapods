# The Instapods App - CloudFN Backend

Firebase Cloud Functions backend written in Typescript with a Cloud Firestore database.

## Firebase Cloud Firestore
To see the detailed types of each collection, view `/src/firestore/types.ts`
### Schema Collections
```
/users
    /refs:post
    /refs:engagement
    /refs:pod

/posts
    /ref:user
    /ref:pod

/engagements
    /ref:post
    /ref:user

/pods
    /refs:user
    /refs:post
    /refs:recentPosts
/pods/messages
    /ref:user
```

## GraphQL Layer
The GraphQL Layer exists as the intemediary between frontend and backend at endpoint `/graphql`.