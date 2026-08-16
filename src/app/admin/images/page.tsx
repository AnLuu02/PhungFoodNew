import { Metadata } from 'next';
import ImageManager from './components/ImageManager';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Quản lý hình ảnh & video'
};

export default async function ImageManagerPage() {
  return <ImageManager mode={'page'} />;
}
