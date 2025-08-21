// Sample Firebase Firestore data structure for guest collection
// Collection name: "guest"

/*
Example documents in the "guest" collection:

Document 1:
{
  "name": "Ajay",
  "id": "10001"
}

Document 2:
{
  "name": "John Doe", 
  "id": "10002"
}

Document 3:
{
  "name": "Jane Smith",
  "id": "10003"
}

How to add data to Firebase Firestore:

1. Go to Firebase Console (https://console.firebase.google.com/)
2. Select your project
3. Click on "Firestore Database" in the left sidebar
4. Click "Start collection"
5. Collection ID: "guest"
6. Add documents with the following structure:
   - Field: "name" (string) - Value: "Ajay"
   - Field: "id" (string) - Value: "10001"

Note: The QR code should contain just the ID value (e.g., "10001")
When scanned, the app will search for this ID in the guest collection
and display "Welcome [name]!" if found.

Security Rules (optional - add to Firestore Rules):
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /guest/{document} {
      allow read: if true; // Allow reading guest data for verification
      allow write: if false; // Prevent writing from client (admin only)
    }
  }
}
*/

export const sampleGuestData = [
  { name: "Ajay", id: "10001" },
  { name: "John Doe", id: "10002" },
  { name: "Jane Smith", id: "10003" },
  { name: "Mike Johnson", id: "10004" },
  { name: "Sarah Wilson", id: "10005" }
];
