# Gemini AI Integration Setup

## 🔑 Getting Your API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

## 📝 Configuration

1. Open `src/config/env.ts`
2. Replace `YOUR_GEMINI_API_KEY_HERE` with your actual API key:

```typescript
export const ENV = {
  GEMINI_API_KEY: 'AIzaSy...your-actual-key-here',
};
```

3. **IMPORTANT**: Add `src/config/env.ts` to `.gitignore` to avoid committing your API key!

## 🎯 Features Using Gemini AI

### 1. Image Analysis (Future)
- Automatically detect clothing category
- Identify colors and patterns
- Suggest styling tips

### 2. Outfit Recommendations
- AI-powered outfit suggestions based on weather
- Smart item pairing
- Occasion-based recommendations

### 3. Styling Tips
- Personalized styling advice
- Accessory suggestions
- Occasion recommendations

## 📦 Current Implementation

Currently, the background removal feature is still using a **mock implementation** because:
- Gemini AI doesn't directly support background removal
- You'll need a dedicated service like:
  - [remove.bg](https://www.remove.bg/api)
  - [Adobe Firefly](https://www.adobe.com/products/firefly.html)
  - [Cloudinary AI Background Removal](https://cloudinary.com/documentation/cloudinary_ai_background_removal_addon)

## 🚀 Future Enhancements

To add real background removal:

1. **Option A: Use remove.bg API**
```bash
npm install @remove-bg/api
```

2. **Option B: Use Cloudinary**
```bash
npm install cloudinary-react-native
```

3. Update `src/services/imageService.ts` with the chosen service

## 💡 Usage Example

```typescript
import { analyzeClothingImage } from './services/geminiService';

// Analyze an image
const analysis = await analyzeClothingImage(base64Image);
console.log(analysis.category); // "T-Shirt"
console.log(analysis.color); // "Navy Blue"
```

## ⚠️ Important Notes

- **Free Tier**: Gemini API has a free tier with rate limits
- **Costs**: Monitor your usage to avoid unexpected charges
- **Privacy**: Images are sent to Google's servers for processing
- **Security**: Never commit API keys to version control

## 📚 Documentation

- [Gemini API Docs](https://ai.google.dev/docs)
- [Pricing](https://ai.google.dev/pricing)
- [Quickstart Guide](https://ai.google.dev/tutorials/get_started_node)
