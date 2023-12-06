import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import axios from 'axios';

@Injectable()
export class ExternalApiService {
  private url: string;
  private apiKey: string;

  constructor(private readonly httpService: HttpService) {
    this.url = process.env.PLUGGY_API;
  }

  getTransactions(): Observable<AxiosResponse<any>> {
    // Replace 'https://example.com/api/data' with the actual API endpoint
    return this.httpService.get('https://example.com/api/data');
  }

  createApiKey(): Promise<AxiosResponse> {
    const payload = {
      clientId: process.env.PLUGGY_CLIENT_ID,
      clientSecret: process.env.PLUGGY_CLIENT_SECRET,
    };
    return axios.post(`${this.url}/auth`, payload);
  }

  async getItems(): Promise<AxiosResponse> {
    const apikey = await this.createApiKey();
    const config = {
      headers: {
        'X-Api-Key': apikey?.data?.apiKey || '',
      },
    };
    return axios.get(`${this.url}/items`, config);
  }
}
