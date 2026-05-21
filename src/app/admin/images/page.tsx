import ImageManager from './components/ImageManager';

export const revalidate = 60 * 60;
export const dynamic = 'force-static';

export default function ImageManagerPage() {
  return <ImageManager mode={'page'} />;
}
