import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import axios from 'axios';
import { getFirstAndLastDayOfCurrentMonth } from 'src/utils/utils';

@Injectable()
export class NubankIntegrationService {
  private url: string;

  constructor() {
    this.url = process.env.NUBANK_INTEGRATION_URL;
  }

  async getTransactions(): Promise<AxiosResponse> {
    const { from, to } = getFirstAndLastDayOfCurrentMonth();

    const config = {
      params: { 
        fromDate: from,
        toDate: to
      }
    }

    return axios.get(
      `${this.url}/service/get-card-statements`, config
    );
  }

}
