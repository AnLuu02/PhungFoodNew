import { deleteObject, getDownloadURL, ref, updateMetadata, uploadString } from 'firebase/storage';
import { storage } from '~/app/config/firebase';

export function fileToBase64(file: any) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
export async function uploadToFirebase(fileName: string, base64Content: string) {
  const fileRef = ref(storage, `Images_PhungFood/Images_Food/${fileName}`);
  await uploadString(fileRef, base64Content, 'base64');
  const mimeType = fileName.endsWith('.png')
    ? 'image/png'
    : fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')
      ? 'image/jpeg'
      : 'application/octet-stream';
  await updateMetadata(fileRef, { contentType: mimeType });
  const url = await getDownloadURL(fileRef);
  return url;
}

export async function deleteImageFromFirebase(fileName: string): Promise<void> {
  try {
    const fileNameDecode = decodeURIComponent(fileName.split('?')[0]?.split('%2F').pop() || 'default-file-name');
    const fileRef = ref(storage, `Images_PhungFood/Images_Food/${fileNameDecode}`);
    await deleteObject(fileRef);
  } catch (error) {
    console.error('Lỗi khi xóa file:', error);
    throw new Error('Không thể xóa file từ Firebase Storage');
  }
}

export async function getImageUrlFirebase(fileName: string) {
  if (fileName && fileName !== '') {
    try {
      const fileRef = ref(storage, `Images_PhungFood/Images_Food/${fileName}`);
      const url = await getDownloadURL(fileRef);
      return url;
    } catch (error) {
      console.error('Lỗi khi lấy URL:', error);
      throw new Error('Không thể lấy URL của file');
    }
  }
}

interface IOptionsFirebaseToFile {
  type: 'single' | 'multiple';
}

export async function firebaseToFile(
  url: string | string[],
  options?: IOptionsFirebaseToFile
): Promise<File | File[] | null> {
  try {
    if (!url) {
      throw new Error('URL is undefined');
    }

    const urls: any = Array.isArray(url) ? url : [url];

    const fetchFile = async (url: string): Promise<File> => {
      const fileName = decodeURIComponent(url.split('?')[0]?.split('%2F').pop() || 'default-file-name');
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch the file from ${url}`);
      }
      const blob = await response.blob();
      return new File([blob], fileName, { type: blob.type });
    };

    if (options?.type === 'multiple') {
      const files = await Promise.all(urls.map((u: any) => fetchFile(u)));
      return files;
    }

    return await fetchFile(urls[0]);
  } catch (error) {
    console.error('Error converting URL to file:', error);
    return null;
  }
}

export function getFileNameFromFirebaseFile(url: any) {
  const decodedUrl = decodeURIComponent(url);
  return decodedUrl.split('/').pop()?.split('?')[0] || '';
}
