# Google Contacts Integration Setup

This document explains how to set up Google Contacts API integration for the WhatsApp Contact Manager.

## Prerequisites

- A Google Cloud Project
- Access to Google Cloud Console (https://console.cloud.google.com)
- Your application's URL (for OAuth callback)

## Step-by-Step Setup

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click on the project dropdown at the top
3. Click "NEW PROJECT"
4. Enter project name: "WhatsApp Contact Manager"
5. Click "CREATE"

### 2. Enable Required APIs

1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "People API"
3. Click on it and press "ENABLE"
4. Search for "Google Contacts API"
5. Click on it and press "ENABLE"

### 3. Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. You may be prompted to configure the OAuth consent screen first:
   - Click "Configure Consent Screen"
   - Choose "External" user type
   - Fill in:
     - App name: "WhatsApp Contact Manager"
     - User support email: your email
     - Developer contact information: your email
   - Save and continue
   - Add scopes:
     - Click "Add or Remove Scopes"
     - Search and add: "https://www.googleapis.com/auth/contacts.readonly"
     - Click "Update"
   - Save and continue
   - Add test users (optional)
   - Back to "Credentials"

4. Click "Create Credentials" > "OAuth client ID"
5. Application type: "Web application"
6. Name: "WhatsApp Contact Manager"
7. Authorized JavaScript origins:
   - `http://localhost:3000` (for development)
   - `https://yourdomain.com` (for production)
8. Authorized redirect URIs:
   - `http://localhost:3000/auth/google/callback` (development)
   - `https://yourdomain.com/auth/google/callback` (production)
9. Click "CREATE"
10. Copy the Client ID

### 4. Configure Environment Variables

Add to your `.env.local` file:

```bash
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id_here
```

Replace `your_client_id_here` with the Client ID from step 3.

## How It Works

### OAuth Flow

1. User clicks "Sincronizar Google Contacts" button in Profile tab
2. App opens Google OAuth consent screen
3. User authorizes access to contacts
4. Google redirects to `/auth/google/callback` with authorization code
5. Authorization code is stored in localStorage
6. User clicks "Sincronizar Contatos" to start sync

### Sync Process

1. App fetches Google contacts using People API
2. For each Google contact:
   - Downloads profile photo (if available)
   - Converts photo to Base64
   - Matches with existing contacts by phone/email
   - Creates new contact or updates photo of existing contact
3. Photos are stored as Base64 in contact's `avatar_url` field

### Photo Matching

Contacts are matched using:
1. **Phone number** (primary) - most reliable for WhatsApp users
2. **Email address** (secondary)

## Security Considerations

⚠️ **Important**: The current implementation stores the authorization code in localStorage. For production use, you should:

1. Exchange the authorization code on your backend server
2. Store refresh tokens securely on the server
3. Never expose Client Secret to the frontend
4. Use HTTPS for all OAuth flows

### Backend Token Exchange (Recommended for Production)

```typescript
// Create an API route: /api/auth/google/exchange
POST /api/auth/google/exchange
Body: { code: string }
Response: { accessToken: string; expiresIn: number }
```

Then update `GoogleContactsSync.tsx` to call this endpoint instead of storing the code.

## Troubleshooting

### "CORS error when fetching contacts"

The Google People API requires proper CORS setup. Make sure your authorized origins are correct in Google Cloud Console.

### "No contacts found"

- Check that you have contacts in your Google account
- Ensure the user authorized the "Contacts readonly" scope
- Try disconnecting and reconnecting

### "Photos not downloading"

- Check browser console for errors
- Ensure Google Contacts have public photos
- Some photos may be restricted and unavailable to third-party apps

## Testing

To test the integration locally:

1. Set `NEXT_PUBLIC_GOOGLE_CLIENT_ID` in `.env.local`
2. Add `http://localhost:3000` and `http://localhost:3000/auth/google/callback` to authorized URLs
3. Run the app: `npm run dev`
4. Navigate to Profile tab > "Sincronizar Google Contacts"
5. Follow the OAuth flow

## Rate Limiting

The Google People API has rate limits:
- Free tier: 100 QPS (queries per second)
- Contacts read: Limited to connections per person

For large contact lists, consider:
- Implementing pagination
- Adding batching for updates
- Caching results locally

## API Reference

### Relevant Endpoints

- **Get Contacts**: `GET /v1/people/me/connections`
  - `personFields=names,phoneNumbers,emailAddresses,photos`
  - Maximum 1000 connections per request

- **Get Person**: `GET /v1/people/{resourceName}`
  - Fetch specific contact details

## More Information

- [Google People API Documentation](https://developers.google.com/people/api/rest/v1/people/get)
- [OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Contacts API Guide](https://developers.google.com/contacts/v3/reference)
