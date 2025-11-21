import * as Location from 'expo-location';

export interface WeatherData {
  temp: number;
  condition: string;
  location: string;
  icon: string; // e.g., 'sun', 'cloud', 'rain'
}

export const getCurrentWeather = async (): Promise<WeatherData> => {
  // In a real app, we would get permissions and location here
  // const { status } = await Location.requestForegroundPermissionsAsync();
  // if (status !== 'granted') { ... }

  // Mock data for now
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        temp: 22,
        condition: 'Sunny',
        location: 'Istanbul, TR',
        icon: 'sun',
      });
    }, 1000);
  });
};
