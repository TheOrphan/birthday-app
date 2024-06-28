import axios from 'axios';

export class GeocodingService {
  private static apiKey: string = 'y9T7YaHYHCJZnc+m+13qqw==ieA1kXLEW682zVs2'; // Biar mudah apikey tidak di letakan di env

  static async getCountryAndCityTimezone(city: string): Promise<any> {
    try {
      const response = await axios.get(
        `https://api.api-ninjas.com/v1/geocoding?city=${city}`,
        {
          headers: {
            'X-Api-Key': this.apiKey,
          },
        },
      );
      const { latitude, longitude } = response.data[0];
      const responseTz = await axios.get(
        `https://api.api-ninjas.com/v1/timezone?lat=${latitude}&lon=${longitude}`,
        {
          headers: {
            'X-Api-Key': this.apiKey,
          },
        },
      );
      return {
        timezone: responseTz.data.timezone,
      };
    } catch (error) {
      console.error('Error fetching geocoding data:', error);
      throw error;
    }
  }
}
