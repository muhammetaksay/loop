import { GoogleGenerativeAI } from '@google/generative-ai';
import { ENV } from '../config/env';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(ENV.GEMINI_API_KEY);


/**
 * Analyze clothing image and extract details
 * @param imageBase64 Base64 encoded image
 * @returns Clothing details (category, color, style, etc.)
 */
export const analyzeClothingImage = async (imageBase64: string) => {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const prompt = `Analyze this clothing item image and provide:
1. Category (e.g., T-Shirt, Jeans, Dress, Jacket, Shoes)
2. Primary color
3. Style/pattern (if any)
4. Suggested occasions to wear it

Respond in JSON format:
{
  "category": "...",
  "color": "...",
  "style": "...",
  "occasions": ["...", "..."]
}`;

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: imageBase64,
                    mimeType: 'image/jpeg',
                },
            },
        ]);

        const response = await result.response;
        const text = response.text();

        // Parse JSON response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }

        throw new Error('Could not parse AI response');
    } catch (error) {
        console.error('Gemini AI analysis error:', error);
        throw error;
    }
};

/**
 * Generate outfit recommendations based on weather and wardrobe
 * @param weather Weather data
 * @param wardrobeItems User's wardrobe items
 * @returns Outfit recommendation
 */
/**
 * Generate outfit recommendations based on weather and wardrobe
 * @param weather Weather data
 * @param wardrobeItems User's wardrobe items
 * @param gender User's gender
 * @returns Outfit recommendation
 */
export const generateOutfitRecommendation = async (
    weather: { temp: number; condition: string },
    wardrobeItems: any[],
    gender?: string
) => {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });

        const itemsList = wardrobeItems
            .map((item) => `- ${item.category} (${item.color})`)
            .join('\n');

        const prompt = `Aşağıdaki hava durumu ve gardırop ürünlerine göre tam bir kombin önerisi yap:

Hava Durumu:
- Sıcaklık: ${weather.temp}°C
- Durum: ${weather.condition}

Kullanıcı Cinsiyeti: ${gender || 'Belirtilmemiş'}

Mevcut Ürünler:
${itemsList}

Lütfen şu kriterlere uygun bir kombin öner:
1. Hava durumuna uygun olsun
2. Şık ve uyumlu olsun
3. Sadece listedeki mevcut ürünleri kullanmaya çalış (eğer eksik parça varsa genel bir öneri yap)
4. Cinsiyete uygun stil önerileri sun

Yanıtı şu JSON formatında ver:
{
  "outfit": {
    "top": "kategori ve renk",
    "bottom": "kategori ve renk",
    "shoes": "kategori ve renk",
    "outerwear": "kategori ve renk (gerekirse)"
  },
  "reasoning": "bu kombinin neden hava durumuna ve stile uygun olduğunun açıklaması (Türkçe)"
}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Parse JSON response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }

        throw new Error('AI yanıtı ayrıştırılamadı');
    } catch (error) {
        console.error('Gemini outfit recommendation error:', error);
        throw error;
    }
};


/**
 * Get styling tips for a specific item
 * @param item Wardrobe item
 * @returns Styling suggestions
 */
export const getStylingTips = async (item: any) => {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const prompt = `Provide 3-5 styling tips for a ${item.color} ${item.category}. 
Include suggestions for:
- What to pair it with
- Occasions to wear it
- Accessories that would complement it

Keep each tip concise (1-2 sentences).`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return text.split('\n').filter((line: string) => line.trim());
    } catch (error) {
        console.error('Gemini styling tips error:', error);
        throw error;
    }
};
