import { AxiosInstance } from 'axios';
import HttpClient from './httpClient';

// Types based on backend entities
export interface Sector {
  id: string;
  name: string;
  displayName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSectorRequest {
  name: string;
  displayName: string;
  isActive?: boolean;
}

export interface UpdateSectorRequest {
  name?: string;
  displayName?: string;
  isActive?: boolean;
}

/**
 * Sector Service Class
 * Uses a shared HttpClient instance
 */
export class SectorService {
  private api: AxiosInstance;

  constructor() {
    this.api = HttpClient.instance;
  }

  // Get all sectors
  async getSectors(): Promise<Sector[]> {
    const response = await this.api.get<Sector[]>('sectors');
    return response.data;
  }

  // Get sector by ID
  async getSectorById(id: string): Promise<Sector> {
    const response = await this.api.get<Sector>(`sectors/${id}`);
    return response.data;
  }

  // Create sector
  async createSector(sectorData: CreateSectorRequest): Promise<Sector> {
    const response = await this.api.post<Sector>('sectors', sectorData);
    return response.data;
  }

  // Update sector
  async updateSector(
    id: string,
    sectorData: UpdateSectorRequest
  ): Promise<Sector> {
    const response = await this.api.put<Sector>(`sectors/${id}`, sectorData);
    return response.data;
  }

  // Delete sector
  async deleteSector(id: string): Promise<void> {
    await this.api.delete(`sectors/${id}`);
  }
}

// Export singleton instance
export const sectorService = new SectorService();
export default sectorService;
