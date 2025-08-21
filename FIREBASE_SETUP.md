# QR Code Gate Scanner with Firebase Integration

## Firebase Setup Instructions

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter your project name (e.g., "qr-gate-scanner")
4. Follow the setup steps

### 2. Enable Firestore Database
1. In your Firebase project, click "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location for your database

### 3. Get Firebase Configuration
1. Click the gear icon (Project Settings) in the left sidebar
2. Scroll down to "Your apps" section
3. Click "Add app" and select the web icon (</>)
4. Register your app with a name (e.g., "QR Scanner Web")
5. Copy the Firebase configuration object

### 4. Update Firebase Configuration
1. Open `src/firebase.js`
2. Replace the placeholder config with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-actual-app-id"
};
```

### 5. Set Up Guest Collection
1. In Firestore Database, click "Start collection"
2. Collection ID: `guest`
3. Add documents with this structure:
   - Document ID: Auto-generate or use custom ID
   - Fields:
     - `name` (string): "Ajay"
     - `id` (string): "10001"

### 6. Sample Guest Data
Add these sample documents to your `guest` collection:

| Document | name | id |
|----------|------|-----|
| Doc 1 | Ajay | 10001 |
| Doc 2 | John Doe | 10002 |
| Doc 3 | Jane Smith | 10003 |

### 7. QR Code Generation
- Generate QR codes that contain just the ID value (e.g., "10001")
- When scanned, the app will search for this ID and display "Welcome [name]!"

### 8. Security Rules (Optional)
In Firestore Rules, add:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /guest/{document} {
      allow read: if true; // Allow reading for verification
      allow write: if false; // Prevent client writes
    }
  }
}
```

## How It Works

1. **QR Code Scan**: User scans a QR code containing a guest ID (e.g., "10001")
2. **Firebase Query**: App queries the `guest` collection for a document where `id` field equals the scanned value
3. **Result Display**: 
   - If found: Shows "Welcome [name]!" with confetti
   - If not found: Shows "Access Denied - Guest ID not found"
   - If error: Shows database connection error

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Features

- **Firebase Integration**: Real-time guest verification
- **Professional UI**: Desktop-optimized gate scanner interface
- **Keyboard Shortcuts**: Space (start/stop), C (camera switch), Esc (close)
- **Camera Switching**: Front/back camera support
- **Auto-restart**: Continues scanning after successful verification
- **Error Handling**: Network and database error management

## Troubleshooting

### Common Issues:
1. **"Firebase not configured"**: Update `firebase.js` with your actual config
2. **"Permission denied"**: Check Firestore security rules
3. **"Collection not found"**: Ensure `guest` collection exists with proper structure
4. **Camera issues**: Check browser permissions and HTTPS requirement
