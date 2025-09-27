/**
 * MockDatabase - Utility class for CRUD operations with JSON files
 * 
 * This class provides a consistent interface for managing mock data during
 * the rapid prototyping phase. It handles file operations, data validation,
 * and maintains the schema structure defined in the implementation guidelines.
 * 
 * Features:
 * - CRUD operations for all entities
 * - Automatic ID generation
 * - Timestamp management (createdAt, updatedAt)
 * - Metadata tracking (count, lastUpdated)
 * - Type-safe operations with TypeScript
 * - Error handling and validation
 * 
 * Usage:
 * const db = new MockDatabase();
 * const educators = await db.read('educators');
 * const newEducator = await db.create('educators', educatorData);
 * await db.update('educators', id, updatedData);
 * await db.delete('educators', id);
 */

import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Base schema structure for all JSON files
interface MockDataFile<T = any> {
  metadata: {
    lastUpdated: string;
    version: string;
    count: number;
    description: string;
  };
  data: T[];
}

// Base entity interface with common fields
interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * MockDatabase class for handling CRUD operations on JSON files
 */
export class MockDatabase {
  private dataDir: string;

  constructor() {
    // Use mock-data directory in the frontend/web folder
    this.dataDir = path.join(process.cwd(), 'mock-data');
  }

  /**
   * Ensure data directory exists
   */
  private async ensureDataDir(): Promise<void> {
    try {
      await fs.access(this.dataDir);
    } catch {
      await fs.mkdir(this.dataDir, { recursive: true });
    }
  }

  /**
   * Ensure data file exists with proper structure
   */
  private async ensureDataFile(collection: string): Promise<void> {
    await this.ensureDataDir();
    const filePath = path.join(this.dataDir, `${collection}.json`);
    
    try {
      await fs.access(filePath);
    } catch {
      const initialData: MockDataFile = {
        metadata: {
          lastUpdated: new Date().toISOString(),
          version: "1.0",
          count: 0,
          description: `${collection} data collection`
        },
        data: []
      };
      await fs.writeFile(filePath, JSON.stringify(initialData, null, 2));
    }
  }

  /**
   * Read all records from a collection
   */
  async read<T extends BaseEntity>(collection: string): Promise<T[]> {
    await this.ensureDataFile(collection);
    const filePath = path.join(this.dataDir, `${collection}.json`);
    
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const jsonData: MockDataFile<T> = JSON.parse(content);
      return jsonData.data;
    } catch (error) {
      console.error(`Error reading ${collection}:`, error);
      throw new Error(`Failed to read ${collection} data`);
    }
  }

  /**
   * Read a single record by ID
   */
  async readById<T extends BaseEntity>(collection: string, id: string): Promise<T | null> {
    const records = await this.read<T>(collection);
    return records.find(record => record.id === id) || null;
  }

  /**
   * Create a new record
   */
  async create<T extends BaseEntity>(collection: string, data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    await this.ensureDataFile(collection);
    const filePath = path.join(this.dataDir, `${collection}.json`);
    
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const jsonData: MockDataFile<T> = JSON.parse(fileContent);
      
      const newRecord: T = {
        ...data,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as T;
      
      jsonData.data.push(newRecord);
      jsonData.metadata.count = jsonData.data.length;
      jsonData.metadata.lastUpdated = new Date().toISOString();
      
      await fs.writeFile(filePath, JSON.stringify(jsonData, null, 2));
      
      return newRecord;
    } catch (error) {
      console.error(`Error creating record in ${collection}:`, error);
      throw new Error(`Failed to create record in ${collection}`);
    }
  }

  /**
   * Update an existing record
   */
  async update<T extends BaseEntity>(collection: string, id: string, updates: Partial<Omit<T, 'id' | 'createdAt'>>): Promise<T | null> {
    await this.ensureDataFile(collection);
    const filePath = path.join(this.dataDir, `${collection}.json`);
    
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const jsonData: MockDataFile<T> = JSON.parse(fileContent);
      
      const recordIndex = jsonData.data.findIndex(record => record.id === id);
      if (recordIndex === -1) {
        return null;
      }
      
      const updatedRecord: T = {
        ...jsonData.data[recordIndex],
        ...updates,
        updatedAt: new Date().toISOString(),
      } as T;
      
      jsonData.data[recordIndex] = updatedRecord;
      jsonData.metadata.lastUpdated = new Date().toISOString();
      
      await fs.writeFile(filePath, JSON.stringify(jsonData, null, 2));
      
      return updatedRecord;
    } catch (error) {
      console.error(`Error updating record in ${collection}:`, error);
      throw new Error(`Failed to update record in ${collection}`);
    }
  }

  /**
   * Delete a record by ID
   */
  async delete(collection: string, id: string): Promise<boolean> {
    await this.ensureDataFile(collection);
    const filePath = path.join(this.dataDir, `${collection}.json`);
    
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const jsonData: MockDataFile = JSON.parse(fileContent);
      
      const recordIndex = jsonData.data.findIndex(record => record.id === id);
      if (recordIndex === -1) {
        return false;
      }
      
      jsonData.data.splice(recordIndex, 1);
      jsonData.metadata.count = jsonData.data.length;
      jsonData.metadata.lastUpdated = new Date().toISOString();
      
      await fs.writeFile(filePath, JSON.stringify(jsonData, null, 2));
      
      return true;
    } catch (error) {
      console.error(`Error deleting record from ${collection}:`, error);
      throw new Error(`Failed to delete record from ${collection}`);
    }
  }

  /**
   * Search records with filters
   */
  async search<T extends BaseEntity>(
    collection: string, 
    filters: Partial<T> = {},
    options: { limit?: number; offset?: number; sortBy?: keyof T; sortOrder?: 'asc' | 'desc' } = {}
  ): Promise<{ data: T[]; total: number }> {
    const records = await this.read<T>(collection);
    
    // Apply filters
    let filteredRecords = records.filter(record => {
      return Object.entries(filters).every(([key, value]) => {
        if (value === undefined || value === null) return true;
        return record[key as keyof T] === value;
      });
    });
    
    // Apply sorting
    if (options.sortBy) {
      filteredRecords.sort((a, b) => {
        const aVal = a[options.sortBy!];
        const bVal = b[options.sortBy!];
        
        if (aVal < bVal) return options.sortOrder === 'desc' ? 1 : -1;
        if (aVal > bVal) return options.sortOrder === 'desc' ? -1 : 1;
        return 0;
      });
    }
    
    const total = filteredRecords.length;
    
    // Apply pagination
    const offset = options.offset || 0;
    const limit = options.limit || total;
    const paginatedRecords = filteredRecords.slice(offset, offset + limit);
    
    return {
      data: paginatedRecords,
      total
    };
  }

  /**
   * Get collection metadata
   */
  async getMetadata(collection: string): Promise<MockDataFile['metadata']> {
    await this.ensureDataFile(collection);
    const filePath = path.join(this.dataDir, `${collection}.json`);
    
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const jsonData: MockDataFile = JSON.parse(content);
      return jsonData.metadata;
    } catch (error) {
      console.error(`Error reading metadata for ${collection}:`, error);
      throw new Error(`Failed to read metadata for ${collection}`);
    }
  }

  /**
   * Validate record data
   */
  private validateRecord<T>(data: any, requiredFields: string[] = []): data is T {
    if (!data || typeof data !== 'object') {
      return false;
    }
    
    return requiredFields.every(field => field in data && data[field] !== undefined);
  }

  /**
   * Batch operations
   */
  async createMany<T extends BaseEntity>(collection: string, records: Omit<T, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<T[]> {
    const createdRecords: T[] = [];
    
    for (const record of records) {
      const created = await this.create<T>(collection, record);
      createdRecords.push(created);
    }
    
    return createdRecords;
  }

  /**
   * Count records with optional filters
   */
  async count<T extends BaseEntity>(collection: string, filters: Partial<T> = {}): Promise<number> {
    const result = await this.search(collection, filters);
    return result.total;
  }

  /**
   * Check if record exists
   */
  async exists(collection: string, id: string): Promise<boolean> {
    const record = await this.readById(collection, id);
    return record !== null;
  }
}

// Export a singleton instance
export const mockDb = new MockDatabase();

// Export types for use in other files
export type { BaseEntity, MockDataFile };