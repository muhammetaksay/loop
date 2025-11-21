import { WeatherData } from './weatherService';

export interface Outfit {
  top: any;
  bottom: any;
  shoes: any;
  accessory?: any;
}

// Mock Wardrobe Data (should come from a real store/db)
const WARDROBE = [
  {
    id: '1',
    category: 'T-Shirt',
    color: 'White',
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
  },
  {
    id: '2',
    category: 'Shirt',
    color: 'Blue',
    image:
      'https://images.unsplash.com/photo-1620799140408-ed5341cd2431?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
  },
  {
    id: '3',
    category: 'Pants',
    color: 'Black',
    image:
      'https://images.unsplash.com/photo-1542272617-08f086302542?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
  },
  {
    id: '4',
    category: 'Jeans',
    color: 'Blue',
    image:
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
  },
  {
    id: '5',
    category: 'Shoes',
    color: 'White',
    image:
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
  },
  {
    id: '6',
    category: 'Jacket',
    color: 'Green',
    image:
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
  },
];

export const getOutfitSuggestion = (weather: WeatherData): Outfit => {
  // Simple logic based on temperature
  let topCategory = ['T-Shirt', 'Shirt'];
  let bottomCategory = ['Pants', 'Jeans'];

  if (weather.temp < 15) {
    topCategory = ['Jacket', 'Shirt']; // Prefer warmer
  } else if (weather.temp > 25) {
    bottomCategory = ['Shorts', 'Pants']; // Prefer cooler
  }

  const tops = WARDROBE.filter(
    (i) => topCategory.includes(i.category) || i.category === 'T-Shirt',
  );
  const bottoms = WARDROBE.filter((i) => bottomCategory.includes(i.category));
  const shoes = WARDROBE.filter((i) => i.category === 'Shoes');

  // Random selection
  const selectedTop =
    tops[Math.floor(Math.random() * tops.length)] || WARDROBE[0];
  const selectedBottom =
    bottoms[Math.floor(Math.random() * bottoms.length)] || WARDROBE[2];
  const selectedShoes =
    shoes[Math.floor(Math.random() * shoes.length)] || WARDROBE[4];

  return {
    top: selectedTop,
    bottom: selectedBottom,
    shoes: selectedShoes,
  };
};
