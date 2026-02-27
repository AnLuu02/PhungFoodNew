'use client';
import { Box } from '@mantine/core';
import Empty from '../Empty';
export const TiptapViewer = ({ descriptionDetailHtml }: any) => {
  if (!descriptionDetailHtml || descriptionDetailHtml == '<p>Đang cập nhật</p>')
    return (
      <Empty
        hasButton={false}
        logoUrl='/images/png/403.png'
        title='Đang cập nhật'
        content='Mô tả đang được cập nhật. Vui lòng quay lại sau.'
      />
    );
  return <Box dangerouslySetInnerHTML={{ __html: descriptionDetailHtml || '<p>Đang cập nhật</p>' }} />;
};
