export interface StorageService {
  uploadFile(bucketName: string, path: string, file: Buffer, contentType: string): Promise<string>;
  getDownloadUrl(bucketName: string, path: string): Promise<string>;
  deleteFile(bucketName: string, path: string): Promise<void>;
}
