import SparkMD5 from 'spark-md5';

export const calculateHash = (file: File): Promise<string> => {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = e => {
      const hash = SparkMD5.ArrayBuffer.hash(e.target?.result as ArrayBuffer);
      resolve(hash);
    };
    reader.readAsArrayBuffer(file);
  });
};
