'use client';
import { useRef, useState } from 'react';

export default function ImageUploader() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e: any) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/search-food', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (response.ok) {
        setResults(data.results);
      } else {
        throw new Error(data.error || 'Failed to analyze image');
      }
    } catch (error) {
      console.error('Error:', error);
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='container mx-auto p-4'>
      <h1 className='mb-4 text-2xl font-bold'>Food Image Search</h1>

      <form onSubmit={handleSubmit} className='mb-4'>
        <input type='file' accept='image/*' onChange={handleFileChange} ref={fileInputRef} className='mb-2' />

        {preview && (
          <div className='mb-4'>
            <img src={preview} alt='Preview' className='max-h-48 max-w-xs object-cover' />
          </div>
        )}

        <button
          type='submit'
          disabled={loading}
          className='rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:bg-gray-400'
        >
          {loading ? 'Analyzing...' : 'Search Food'}
        </button>
      </form>

      {results.length > 0 && (
        <div className='mt-4'>
          <h2 className='mb-2 text-xl font-semibold'>Results:</h2>
          <ul className='space-y-2'>
            {results.map((item: any, index: number) => (
              <li key={index} className='rounded bg-gray-100 p-2'>
                {item.label} - {(item.score * 100).toFixed(1)}%
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
