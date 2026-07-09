import { StorageService } from '../../domain/services/StorageService';
import fs from 'fs/promises';
import path from 'path';

export class SupabaseStorageService implements StorageService {
  private readonly supabaseUrl: string;
  private readonly supabaseKey: string;

  constructor() {
    this.supabaseUrl = process.env.SUPABASE_URL || '';
    this.supabaseKey = process.env.SUPABASE_KEY || '';
  }

  async uploadFile(bucketName: string, filePath: string, file: Buffer, contentType: string): Promise<string> {
    if (!this.supabaseUrl || !this.supabaseKey) {
      const localDir = path.join(process.cwd(), 'public', 'uploads', bucketName);
      await fs.mkdir(localDir, { recursive: true });
      const localFilePath = path.join(localDir, path.basename(filePath));
      await fs.writeFile(localFilePath, file);
      return `/uploads/${bucketName}/${path.basename(filePath)}`;
    }

    try {
      const uploadUrl = `${this.supabaseUrl}/storage/v1/object/${bucketName}/${filePath}`;
      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.supabaseKey}`,
          apikey: this.supabaseKey,
          'Content-Type': contentType,
        },
        body: file as any,
      });

      if (!response.ok) {
        throw new Error(`Failed to upload to Supabase: ${response.statusText}`);
      }

      return this.getDownloadUrl(bucketName, filePath);
    } catch (error) {
      console.error('Supabase upload error, using local fallback:', error);
      const localDir = path.join(process.cwd(), 'public', 'uploads', bucketName);
      await fs.mkdir(localDir, { recursive: true });
      const localFilePath = path.join(localDir, path.basename(filePath));
      await fs.writeFile(localFilePath, file);
      return `/uploads/${bucketName}/${path.basename(filePath)}`;
    }
  }

  async getDownloadUrl(bucketName: string, filePath: string): Promise<string> {
    if (!this.supabaseUrl || !this.supabaseKey) {
      return `/uploads/${bucketName}/${path.basename(filePath)}`;
    }
    return `${this.supabaseUrl}/storage/v1/object/public/${bucketName}/${filePath}`;
  }

  async deleteFile(bucketName: string, filePath: string): Promise<void> {
    if (!this.supabaseUrl || !this.supabaseKey) {
      const localFilePath = path.join(process.cwd(), 'public', 'uploads', bucketName, path.basename(filePath));
      await fs.unlink(localFilePath).catch(() => {});
      return;
    }

    try {
      const deleteUrl = `${this.supabaseUrl}/storage/v1/object/${bucketName}/${filePath}`;
      await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${this.supabaseKey}`,
          apikey: this.supabaseKey,
        },
      });
    } catch (error) {
      console.error('Supabase delete error:', error);
    }
  }
}
