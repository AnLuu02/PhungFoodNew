import { del, put } from '@vercel/blob';
import { getFileNameFromVercelBlob, tokenBlobVercel } from '~/lib/FuncHandler/handle-file-base64';
import { ImageReq } from '~/shared/schema/image.schema';

export const uploadImageToVercel = async (oldImage: any, input: ImageReq) => {
  let imgURL = '';
  if (input?.fileName) {
    const filenameImgFromDb = oldImage ? getFileNameFromVercelBlob(oldImage?.url) : null;
    if (input.base64) {
      if (!filenameImgFromDb || filenameImgFromDb !== input.fileName) {
        if (oldImage && oldImage?.url) await del(oldImage.url, { token: tokenBlobVercel });
        const buffer = Buffer.from(input.base64, 'base64');
        const blob = await put(input.fileName, buffer, { access: 'public', token: tokenBlobVercel });
        imgURL = blob.url;
      } else {
        imgURL = oldImage?.url;
      }
    } else {
      imgURL = input.fileName;
    }
  } else if (oldImage && oldImage.url && input?.fileName === '') {
    await del(oldImage.url, { token: tokenBlobVercel });
  }
  return { imgURL };
};
