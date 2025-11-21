# Firebase Backend Setup Guide

## 🔥 Firebase Project Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter project name: `loop-wardrobe-app` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click **"Create project"**

### Step 2: Register Your App

1. In Firebase Console, click **"Add app"** → Select **Web** (🌐)
2. Register app with nickname: `Loop Web`
3. **Copy the Firebase configuration** - you'll need this!
// Import the functions you need from the SDKs you need

```javascript
// Example configuration (yours will be different)
const firebaseConfig = {
  apiKey: "AIzaSyAEac6YysU3sTYrnvglqy4aW92hA5-Q8rg",
  authDomain: "loop-wardrobe-app.firebaseapp.com",
  projectId: "loop-wardrobe-app",
  storageBucket: "loop-wardrobe-app.firebasestorage.app",
  messagingSenderId: "282687749476",
  appId: "1:282687749476:web:9d38cbd103221054338e71",
  measurementId: "G-M6D3Q6WENP"
};
```

### Step 3: Configure Firebase Services

#### 🔐 Authentication

1. In Firebase Console, go to **Authentication** → **Get started**
2. Enable **Email/Password** sign-in method
3. (Optional) Enable **Google** sign-in:
   - Click on Google provider
   - Enable it
   - Add support email
   - Save

#### 📊 Firestore Database

1. Go to **Firestore Database** → **Create database**
2. Choose **Start in test mode** (for development)
3. Select your preferred location
4. Click **Enable**

**Security Rules (for development):**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    // Wardrobe collection
    match /wardrobe/{itemId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                     request.resource.data.userId == request.auth.uid;
      allow delete: if request.auth != null && 
                      resource.data.userId == request.auth.uid;
    }
    
    // Marketplace collection
    match /marketplace/{listingId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Trade offers collection
    match /tradeOffers/{offerId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Conversations collection
    match /conversations/{conversationId} {
      allow read: if request.auth != null && 
                    request.auth.uid in resource.data.participants;
      allow write: if request.auth != null;
    }
    
    // Messages collection
    match /messages/{messageId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

#### 📦 Storage

1. Go to **Storage** → **Get started**
2. Start in **test mode** (for development)
3. Click **Done**

**Security Rules (for development):**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /wardrobe/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Step 4: Add Configuration to Your App

1. Open `src/config/firebase.ts`
2. Replace the placeholder values with your actual Firebase config:

```typescript
export const firebaseConfig = {
  apiKey: 'YOUR_ACTUAL_API_KEY',
  authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT_ID.appspot.com',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
};
```

3. **IMPORTANT**: The file is already in `.gitignore` - never commit your credentials!

## 🎯 Database Structure

### Collections

#### `users`
```typescript
{
  uid: string;
  email: string;
  name: string;
  isPremium: boolean;
  createdAt: Timestamp;
  bodySize?: {
    height?: string;
    weight?: string;
    size?: string;
  };
  stylePreferences?: string[];
  colorPreferences?: string[];
}
```

#### `wardrobe`
```typescript
{
  id: string;
  userId: string;
  imageUrl: string;
  category: string;
  color: string;
  season?: string;
  brand?: string;
  notes?: string;
  createdAt: Timestamp;
}
```

#### `marketplace`
```typescript
{
  id: string;
  itemId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  imageUrl: string;
  category: string;
  color: string;
  brand?: string;
  size?: string;
  condition: string;
  description: string;
  location: string;
  createdAt: Timestamp;
}
```

#### `tradeOffers`
```typescript
{
  id: string;
  listingId: string;
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  offeredItemId: string;
  offeredItemImage: string;
  offeredItemCategory: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Timestamp;
}
```

#### `conversations`
```typescript
{
  id: string;
  participants: string[];
  participantNames: { [userId: string]: string };
  participantAvatars: { [userId: string]: string };
  lastMessage: string;
  lastMessageTime: Timestamp;
  unreadCount: { [userId: string]: number };
}
```

#### `messages`
```typescript
{
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  createdAt: Timestamp;
  read: boolean;
}
```

## 🚀 Testing Your Setup

1. Run your app: `npm start`
2. Try registering a new user
3. Check Firebase Console → Authentication to see the new user
4. Try adding a wardrobe item
5. Check Firestore Database to see the data

## 📚 Available Services

- **`authService.ts`** - User registration, login, logout, profile management
- **`wardrobeService.ts`** - Wardrobe CRUD operations, image uploads
- **`marketplaceService.ts`** - Marketplace listings, trade offers
- **`chatService.ts`** - Real-time messaging, conversations

## ⚠️ Important Notes

- **Development Mode**: Current security rules allow all authenticated users to read/write
- **Production**: Update security rules to be more restrictive
- **Costs**: Firebase has a free tier, but monitor your usage
- **Security**: Never commit `firebase.ts` to version control (already in `.gitignore`)

## 🔗 Useful Links

- [Firebase Console](https://console.firebase.google.com/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Storage Security Rules](https://firebase.google.com/docs/storage/security)
