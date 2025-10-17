'use client';
import { Box } from '@mantine/core';
export const TiptapViewer = ({ descriptionDetailHtml }: any) => {
  return <Box dangerouslySetInnerHTML={{ __html: descriptionDetailHtml || '<p>Đang cập nhật</p>' }} />;
};
