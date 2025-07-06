'use client';

import { ActionIcon, Button, FileButton, Group, Modal, ScrollAreaAutosize, Table, Title } from '@mantine/core';
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import clsx from 'clsx';
import { useState } from 'react';
import { handleDelete } from '~/lib/button-handle/ButtonDeleteConfirm';
import { formatDataExcel } from '~/lib/func-handler/formatDate';
import { NotifyError, NotifySuccess } from '~/lib/func-handler/toast';
import { api } from '~/trpc/react';
import CreateCategory from './form/CreateCategory';
import UpdateCategory from './form/UpdateCategory';
const mapFields: Record<string, string> = {
  'Tên danh mục': 'name',
  Tag: 'tag',
  'Mô tả': 'description'
};

export function CreateManyCategoryButton() {
  const [data, setData] = useState<any[]>([]);
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const utils = api.useUtils();

  const resetFileInput = () => {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };
  const importMutation = api.Category.createMany.useMutation({
    onSuccess: data => {
      if (data.success) {
        NotifySuccess(data.message);
        utils.Category.invalidate();
      } else {
        NotifyError(data.message);
      }
      setOpened(false);
      setData([]);
      setLoading(false);
      resetFileInput();
    },
    onError: error => {
      setLoading(false);
      NotifyError('Import thất bại! Sai định dạng dữ liệu.');
    }
  });

  const handleFileUpload = async (file: File) => {
    const allowedExtensions = ['xlsx', 'xls'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      resetFileInput();
      return NotifyError('Định dạng file không hợp lệ. Vui lòng chọn file Excel (.xlsx, .xls)');
    }

    try {
      const XLSX = await import('xlsx');
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'buffer' });

      const firstSheetName = workbook.SheetNames[0];
      if (!firstSheetName) {
        resetFileInput();
        return NotifyError('Không tìm thấy sheet nào trong file Excel');
      }
      const sheet = workbook.Sheets[firstSheetName];
      if (!sheet) {
        resetFileInput();
        return NotifyError('Không thể đọc sheet từ file Excel');
      }
      const rows = XLSX.utils.sheet_to_json(sheet);
      setData(rows);
      setOpened(true);
    } catch (error) {
      resetFileInput();
      NotifyError('Lỗi khi đọc file. Vui lòng kiểm tra lại.');
    }
  };

  const handleImport = async () => {
    try {
      setLoading(true);
      const formatData_: any = formatDataExcel(mapFields, data);
      await importMutation.mutateAsync({ data: formatData_ });
    } catch (error) {
      setLoading(false);
      NotifyError('Import thất bại! Sai định dạng dữ liệu.');
    }
  };
  const fetchCategories = api.Category.getAll.useQuery();
  const handleExport = async () => {
    if (!fetchCategories.data || fetchCategories.data.length === 0) {
      return NotifyError('Không có dữ liệu để xuất.');
    }
    const XLSX = await import('xlsx');
    const exportData = fetchCategories.data.map((item: any) => ({
      ID: item.id,
      'Tên danh mục': item.name,
      Tag: item.tag,
      'Mô tả': item.description || ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Categories');

    XLSX.writeFile(workbook, `Danh_muc - ${new Date().getTime()}.xlsx`);
  };

  return (
    <>
      <Group>
        <FileButton disabled={opened} onChange={file => file && handleFileUpload(file)} accept='xlsx,xls'>
          {props => (
            <Button disabled={opened} variant='outline' {...props}>
              Import dữ liệu
            </Button>
          )}
        </FileButton>
        <Button c={'red'} onClick={handleExport} disabled={fetchCategories?.data?.length === 0}>
          Export Excel
        </Button>
      </Group>

      <Modal
        size={'xl'}
        opened={opened}
        onClose={() => {
          setOpened(false);
          resetFileInput();
        }}
        title={<Title order={3}>Xem trước dữ liệu</Title>}
      >
        <ScrollAreaAutosize mah={480} scrollbarSize={5}>
          <div className={clsx('w-full overflow-x-auto', 'tableAdmin')}>
            <Table striped highlightOnHover withTableBorder withColumnBorders>
              <Table.Thead className='rounded-lg text-sm uppercase leading-normal'>
                <Table.Tr>
                  <Table.Th style={{ minWidth: 100 }}>Tên danh mục</Table.Th>
                  <Table.Th style={{ minWidth: 100 }}>Tag</Table.Th>
                  <Table.Th style={{ minWidth: 100 }}>Mô tả</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {data.map((row, index) => (
                  <Table.Tr key={index}>
                    <Table.Td>{row['Tên danh mục']}</Table.Td>
                    <Table.Td>{row['Tag']}</Table.Td>
                    <Table.Td>{row['Mô tả']}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </div>
        </ScrollAreaAutosize>
        <Group mt='md' align='flex-end'>
          <Button
            color='red'
            onClick={() => {
              setOpened(false);
              resetFileInput();
            }}
          >
            Hủy
          </Button>
          <Button onClick={handleImport} loading={loading}>
            Import
          </Button>
        </Group>
      </Modal>
    </>
  );
}
export function CreateCategoryButton() {
  const [opened, setOpened] = useState(false);
  return (
    <>
      <Button leftSection={<IconPlus size={16} />} onClick={() => setOpened(true)}>
        Tạo mới
      </Button>
      <Modal
        closeOnClickOutside={false}
        opened={opened}
        onClose={() => setOpened(false)}
        title={<Title order={2}>Tạo danh mục</Title>}
      >
        <CreateCategory setOpened={setOpened} />
      </Modal>
    </>
  );
}
export function UpdateCategoryButton({ id }: { id: string }) {
  const [opened, setOpened] = useState(false);
  return (
    <>
      <ActionIcon variant='subtle' color='blue' onClick={() => setOpened(true)}>
        <IconEdit size={24} />
      </ActionIcon>
      <Modal
        closeOnClickOutside={false}
        opened={opened}
        onClose={() => setOpened(false)}
        title={<Title order={2}>Cập nhật danh mục</Title>}
      >
        <UpdateCategory categoryId={id.toString()} setOpened={setOpened} />
      </Modal>
    </>
  );
}

export function DeleteCategoryButton({ id }: { id: string }) {
  const untils = api.useUtils();
  const deleteMutation = api.Category.delete.useMutation();
  return (
    <>
      <ActionIcon
        variant='subtle'
        color='red'
        onClick={() => {
          handleDelete({ id }, deleteMutation, 'Danh mục', () => {
            untils.Category.invalidate();
          });
        }}
      >
        <IconTrash size={24} />
      </ActionIcon>
    </>
  );
}
