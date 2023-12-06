import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import axios from 'axios';
import { connectors } from 'src/constants/connectors.const';

@Injectable()
export class ExternalApiService {
  private url: string;
  private apiKey: string;

  constructor(private readonly httpService: HttpService) {
    this.url = process.env.PLUGGY_API;
  }

  createApiKey(): Promise<AxiosResponse> {
    const payload = {
      clientId: process.env.PLUGGY_CLIENT_ID,
      clientSecret: process.env.PLUGGY_CLIENT_SECRET,
    };
    return axios.post(`${this.url}/auth`, payload);
  }

  async getTransactions(): Promise<AxiosResponse> {
    const apikey = await this.createApiKey();
    const accountId = process.env.PLUGGY_ACCOUNT_ID;
    const config = {
      headers: {
        'X-Api-Key': apikey?.data?.apiKey || '',
      },
    };
    return axios.get(`${this.url}/transactions?accountId=${accountId}`, config);
  }
}
