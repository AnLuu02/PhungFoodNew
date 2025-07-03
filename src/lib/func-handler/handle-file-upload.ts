export const tokenBlobVercel = process.env.BLOB_READ_WRITE_TOKEN;

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

export async function vercelBlobToFile(
  url: string | string[],
  options?: { type?: 'multiple' }
): Promise<File | File[] | null> {
  try {
    if (!url) {
      throw new Error('URL is undefined');
    }

    const urls = Array.isArray(url) ? url : [url];

    const fetchFile = async (url: string): Promise<File> => {
      const fileName = getFileNameFromVercelBlob(url);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch the file from ${url}`);
      }
      const blob = await response.blob();
      return new File([blob], fileName, { type: blob.type });
    };

    if (options?.type === 'multiple') {
      const files = await Promise.all(urls.map(u => fetchFile(u)));
      return files;
    }

    return await fetchFile(urls[0] as string);
  } catch (error) {
    console.error('Error converting Vercel Blob URL to file:', error);
    return null;
  }
}

export function getFileNameFromVercelBlob(url: string): string {
  const decodedUrl = decodeURIComponent(url);
  return decodedUrl.split('/').pop()?.split('?')[0] || '';
}
