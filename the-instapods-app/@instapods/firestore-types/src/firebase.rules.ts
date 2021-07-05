const firestoreRules = `
    service cloud.firestore {
        match /databases/{database}/documents {

            // blanket deny access recursively
            match /{document=**} {
                allow read, write: if false;
            }
            
        }
    }
`;

export default firestoreRules;
