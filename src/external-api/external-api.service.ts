import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import axios from 'axios';
import { PluggyTransactionResponse } from 'src/models/external.model';
import { getFirstAndLastDayOfCurrentMonth } from 'src/utils/utils';

@Injectable()
export class ExternalApiService {
  private url: string;
  private readonly pageSize = 500;

  constructor() {
    this.url = process.env.PLUGGY_API;
  }

  createApiKey(): Promise<AxiosResponse> {
    const payload = {
      clientId: process.env.PLUGGY_CLIENT_ID,
      clientSecret: process.env.PLUGGY_CLIENT_SECRET,
    };
    return axios.post(`${this.url}/auth`, payload);
  }

  async getTransactions(): Promise<AxiosResponse<PluggyTransactionResponse>> {
    //TODO avoid call createApiKey every time
    const apikey = await this.createApiKey();
    const accountId = process.env.PLUGGY_ACCOUNT_ID;

    const { from, to } = getFirstAndLastDayOfCurrentMonth();

    const config = {
      headers: {
        'X-Api-Key': apikey?.data?.apiKey || '',
      },
    };
    return axios.get<PluggyTransactionResponse>(
      `${this.url}/transactions?accountId=${accountId}&pageSize=${this.pageSize}&from=${from}&to=${to}`,
      config,
    );
  }
}
