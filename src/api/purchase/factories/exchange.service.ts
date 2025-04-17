import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class ExchangeRateService {
  private readonly apiUrl = 'https://open.er-api.com/v6/latest/USD';

  async getUsdToVndRate(): Promise<number> {
    try {
      const response = await fetch(this.apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const rate = data.rates?.VND;

      if (!rate) {
        throw new Error('VND rate not found');
      }

      return rate;
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
      throw new InternalServerErrorException('Cannot fetch exchange rate');
    }
  }
}
