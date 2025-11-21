import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

export const pickImageFromGallery = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (status !== 'granted') {
    Alert.alert(
      'Permission needed',
      'Sorry, we need camera roll permissions to make this work!',
    );
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });

  if (!result.canceled) {
    return result.assets[0].uri;
  }

  return null;
};

export const takePhoto = async () => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();

  if (status !== 'granted') {
    Alert.alert(
      'Permission needed',
      'Sorry, we need camera permissions to make this work!',
    );
    return null;
  }

  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });

  if (!result.canceled) {
    return result.assets[0].uri;
  }

  return null;
};

export const removeBackground = async (imageUri: string) => {
  try {
    // Note: Gemini API doesn't directly support background removal
    // This is a placeholder for future integration with a proper background removal service
    // For now, we'll use a mock implementation

    // TODO: Integrate with a proper background removal API like:
    // - remove.bg API
    // - Adobe Firefly API
    // - Cloudinary AI Background Removal

    return new Promise<string>((resolve) => {
      setTimeout(() => {
        // Mock: Return original image
        // In production, this would return the processed image URL
        resolve(imageUri);
      }, 2000);
    });
  } catch (error) {
    console.error('Background removal error:', error);
    throw error;
  }
};

