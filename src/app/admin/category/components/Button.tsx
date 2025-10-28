'use client';

import { ActionIcon, Box, Button, FileButton, Group, Modal, ScrollAreaAutosize, Table, Title } from '@mantine/core';
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import { useState } from 'react';
import BButton from '~/components/Button/Button';
import { confirmDelete } from '~/lib/ButtonHandler/ButtonDeleteConfirm';
import { formatDataExcel } from '~/lib/FuncHandler/Format';
import { NotifyError, NotifySuccess } from '~/lib/FuncHandler/toast';
import { api } from '~/trpc/react';
import CreateCategory from './form/CreateCategory';
import CreateSubCategory from './form/CreateSubCategory';
import UpdateCategory from './form/UpdateCategory';
import UpdateSubCategory from './form/UpdateSubCategory';
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
      if (data.code === 'OK') {
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
    } catch {
      resetFileInput();
      NotifyError('Lỗi khi đọc file. Vui lòng kiểm tra lại.');
    }
  };

  const handleImport = async () => {
    try {
      setLoading(true);
      const formatData_: any = formatDataExcel(mapFields, data);
      await importMutation.mutateAsync({ data: formatData_ });
    } catch {
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
            <BButton disabled={opened} variant='outline' {...props}>
              Import dữ liệu
            </BButton>
          )}
        </FileButton>
        <Button
          bg={'red'}
          radius={'md'}
          size='sm'
          onClick={handleExport}
          disabled={fetchCategories?.data?.length === 0}
        >
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
        title={
          <Title order={3} className='font-quicksand'>
            Xem trước dữ liệu
          </Title>
        }
      >
        <ScrollAreaAutosize mah={480} scrollbarSize={5}>
          <Box className={`tableAdmin w-full overflow-x-auto`}>
            <Table striped highlightOnHover withTableBorder withColumnBorders>
              <Table.Thead className='rounded-lg text-sm uppercase leading-normal'>
                <Table.Tr>
                  <Table.Th className='text-sm' style={{ minWidth: 100 }}>
                    Tên danh mục
                  </Table.Th>
                  <Table.Th className='text-sm' style={{ minWidth: 100 }}>
                    Tag
                  </Table.Th>
                  <Table.Th className='text-sm' style={{ minWidth: 100 }}>
                    Mô tả
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {data.map((row, index) => (
                  <Table.Tr key={index}>
                    <Table.Td className='text-sm'>{row['Tên danh mục']}</Table.Td>
                    <Table.Td className='text-sm'>{row['Tag']}</Table.Td>
                    <Table.Td className='text-sm'>{row['Mô tả']}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Box>
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
      <BButton leftSection={<IconPlus size={16} />} onClick={() => setOpened(true)}>
        Tạo mới
      </BButton>
      <Modal
        closeOnClickOutside={false}
        opened={opened}
        onClose={() => setOpened(false)}
        title={
          <Title order={2} className='font-quicksand'>
            Tạo danh mục
          </Title>
        }
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
        title={
          <Title order={2} className='font-quicksand'>
            Cập nhật danh mục
          </Title>
        }
      >
        <UpdateCategory categoryId={id.toString()} setOpened={setOpened} />
      </Modal>
    </>
  );
}

export function DeleteCategoryButton({ id }: { id: string }) {
  const utils = api.useUtils();
  const mutationDelete = api.Category.delete.useMutation({
    onSuccess: () => {
      utils.Category.invalidate();
    },
    onError: e => {
      NotifyError(e.message);
    }
  });
  return (
    <>
      <ActionIcon
        variant='subtle'
        color='red'
        onClick={() => {
          confirmDelete({
            id: { id },
            mutationDelete,
            entityName: 'danh mục',

            callback: () => {
              utils.Category.invalidate();
            }
          });
        }}
      >
        <IconTrash size={24} />
      </ActionIcon>
    </>
  );
}

export function CreateSubCategoryButton() {
  const [opened, setOpened] = useState(false);
  return (
    <>
      <BButton leftSection={<IconPlus size={16} />} onClick={() => setOpened(true)}>
        Tạo mới
      </BButton>
      <Modal
        closeOnClickOutside={false}
        size={'xl'}
        opened={opened}
        onClose={() => setOpened(false)}
        title={
          <Title order={2} className='font-quicksand'>
            Tạo danh mục
          </Title>
        }
      >
        <CreateSubCategory setOpened={setOpened} />
      </Modal>
    </>
  );
}

export function UpdateSubCategoryButton({ id }: { id: string }) {
  const [opened, setOpened] = useState(false);
  return (
    <>
      <ActionIcon variant='subtle' color='blue' onClick={() => setOpened(true)}>
        <IconEdit size={24} />
      </ActionIcon>
      <Modal
        closeOnClickOutside={false}
        size={'xl'}
        opened={opened}
        onClose={() => setOpened(false)}
        title={
          <Title order={2} className='font-quicksand'>
            Cập nhật danh mục
          </Title>
        }
      >
        <UpdateSubCategory subCategoryId={id.toString()} setOpened={setOpened} />
      </Modal>
    </>
  );
}

export function DeleteSubCategoryButton({ id }: { id: string }) {
  const utils = api.useUtils();
  const mutationDelete = api.SubCategory.delete.useMutation();

  return (
    <>
      <ActionIcon
        variant='subtle'
        color='red'
        onClick={() => {
          confirmDelete({
            id: { id },
            mutationDelete,
            entityName: 'danh mục con',
            callback: () => {
              utils.SubCategory.invalidate();
            }
          });
        }}
      >
        <IconTrash size={24} />
      </ActionIcon>
    </>
  );
}
