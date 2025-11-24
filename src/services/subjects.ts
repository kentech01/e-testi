import { AxiosInstance } from 'axios';
import HttpClient from './httpClient';

// Types based on backend Subject entity
export interface Subject {
  id: string; // Subject ID (UUID)
  name?: string; // May not be present if API uses label instead
  value: string; // Subject value/identifier (e.g., "biologji", "ekonomi")
  label: string; // Subject display name (e.g., "Biologji", "Ekonomi")
  isActive: boolean;
  sectorId: string;
  createdAt?: string;
  updatedAt?: string;
  sector?: {
    id: string;
    name: string;
    displayName: string;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
  };
}

/**
 * Subject Service Class
 * Uses a shared HttpClient instance
 */
export class SubjectService {
  private api: AxiosInstance;

  constructor() {
    this.api = HttpClient.instance;
  }

  /**
   * Get all active subjects for a specific sector
   * GET /api/subjects/sector/:sectorId
   */
  async getSubjectsBySector(sectorId: string): Promise<Subject[]> {
    const response = await this.api.get<Subject[]>(
      `subjects/sector/${sectorId}`
    );
    return response.data;
  }
}

// Export singleton instance
export const subjectService = new SubjectService();
export default subjectService;

