// src/services/og-parser.api.ts
import { API_BASE_URL } from '@/lib/api/clients';
import axios from 'axios';

interface OGMetadata {
  [x: string]: string;
  title: string;
  description: string;
  image: string;
  price?: string;
  brand?: string;
  availability?: string;
  url: string;
}

class OGParserApi {
  private api = axios.create({
    baseURL: `${API_BASE_URL}/api/v1/parser`,
    withCredentials: true,
  });

  async parseUrl(url: string): Promise<OGMetadata> {
    const response = await this.api.post('/og-metadata', { url });
    return response.data.data;
  }
}

export const ogParserApi = new OGParserApi();
