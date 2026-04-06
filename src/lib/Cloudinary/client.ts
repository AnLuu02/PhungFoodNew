import { api } from '~/trpc/react';
import { calculateHash } from '../FuncHandler/hashFileToMD5';

interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  created_at: string;
  bytes: number;
}

interface UploadOptions {
  folder?: string;
  publicId?: string;
  tags?: string[];
  transformation?: string;
}

export interface UploadedImage {
  publicId: string;
  url: string;
  width: number;
  height: number;
  format: string;
  file?: File;
}

export interface OptimizeOptions {
  width?: number;
  height?: number;
  fit?: 'fill' | 'scale' | 'crop' | 'thumb' | 'pad';
}

export async function uploadToCloudinary(file: File, options: UploadOptions = {}): Promise<CloudinaryUploadResult> {
  const formData = new FormData();

  formData.append('file', file);
  formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
  if (options.folder) {
    formData.append('folder', options.folder);
  }
  if (options.publicId) {
    formData.append('public_id', options.publicId);
  }
  if (options.tags && options.tags.length > 0) {
    formData.append('tags', options.tags.join(','));
  }

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Upload failed');
    }

    const result = await response.json();
    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
      created_at: result.created_at,
      bytes: result.bytes
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
}

export async function uploadMultipleToCloudinary(
  files: File[],
  options: UploadOptions = {}
): Promise<CloudinaryUploadResult[]> {
  const uploadPromises = files.map(file => uploadToCloudinary(file, options));
  return Promise.all(uploadPromises);
}

export const getOptimizedUrl = (url: string, options: OptimizeOptions = {}): string => {
  if (!url || !url.includes('cloudinary.com')) return url;

  let transformParams = 'f_auto,q_auto';

  if (options.width) transformParams += `,w_${options.width}`;
  if (options.height) transformParams += `,h_${options.height}`;
  if (options.fit) transformParams += `,c_${options.fit}`;

  return url.replace('/upload/', `/upload/${transformParams}/`);
};
export type TRPCUtils = ReturnType<typeof api.useUtils>;
export const handleUploadFromClient = async (
  acceptedFiles: File | null | undefined,
  utils: TRPCUtils,
  options: UploadOptions
): Promise<UploadedImage | undefined> => {
  try {
    if (acceptedFiles && acceptedFiles instanceof File) {
      const hash = await calculateHash(acceptedFiles);
      const publicId = options.folder ? options.folder + '/' + hash : hash;
      const { exists, image } = await utils.Images.checkExisting.fetch({ publicId });
      if (exists && image) {
        return {
          publicId: image.publicId || '',
          url: image.url || '',
          width: image.width || 0,
          height: image.height || 0,
          format: image.format || ''
        };
      }
      const cloudinaryResults = await uploadToCloudinary(acceptedFiles, {
        ...options,
        publicId: hash
      });
      return {
        publicId: cloudinaryResults.public_id,
        url: cloudinaryResults.secure_url,
        width: cloudinaryResults.width,
        height: cloudinaryResults.height,
        format: cloudinaryResults.format
      };
    }
  } catch (error) {
    console.error('Upload process failed:', error);
    alert('Upload đã xảy ra lỗi. Xem chi tiết trong console.');
  }
};
export async function uploadMultipleToCloudinaryFromClient(
  files: File[],
  utils: TRPCUtils,
  options: UploadOptions = {}
): Promise<(UploadedImage | undefined)[]> {
  const uploadPromises = files.map(file => handleUploadFromClient(file, utils, options));
  return Promise.all(uploadPromises);
}
