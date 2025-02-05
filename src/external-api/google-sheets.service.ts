import { google } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';
import { Injectable } from '@nestjs/common';
import { GoogleSheetRowData } from 'src/models/transaction.model';



@Injectable()
export class GoogleSheetService {
    private credentials: any;
    private googleSheetId: string;
    constructor(){
        const credentialsPath = path.resolve(__dirname, '../../credentials.json');
        this.credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
        this.googleSheetId = process.env.GOOGLE_SHEET_ID
    }
    async getSheetData(): Promise<GoogleSheetRowData[]> {
        
      
        const auth = new google.auth.GoogleAuth({
          credentials: this.credentials,
          scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
        });
      
        const client = await auth.getClient();
      
        const spreadsheetId = this.googleSheetId;
        const range = 'main!A2:D'; 
      
        try {
          // @ts-ignore
          const sheets = google.sheets({ version: 'v4', auth: client });
          const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range,
          });
      
          const rows = response.data.values || [];
          
          if (!rows.length) {
            console.log('No data found.');
            return;
          }
      
          const data: GoogleSheetRowData[] = rows.map((row: string[]) => ({
            date: row[0] || '',
            description: row[1] || '',
            value: row[3] || '',
          }));
      
          return data;
        } catch (error) {
          console.error('Error fetching sheet data:', error);
          return []
        }
      }
}








