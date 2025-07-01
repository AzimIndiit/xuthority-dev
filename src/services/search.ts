import { ApiService } from './api';

export async function searchAll(query: string) {
  const res = await ApiService.get(`/search?q=${encodeURIComponent(query)}`);
  return res.data;
} 