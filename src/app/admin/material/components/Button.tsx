'use client';

import {
  ActionIcon,
  Box,
  Button,
  FileButton,
  Flex,
  Group,
  Modal,
  ScrollAreaAutosize,
  Table,
  Title
} from '@mantine/core';
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import { useState } from 'react';
import { confirmDelete } from '~/lib/button-handle/ButtonDeleteConfirm';
import { formatDataExcel } from '~/lib/func-handler/Format';
import { NotifyError, NotifySuccess } from '~/lib/func-handler/toast';
import { api } from '~/trpc/react';
import CreateMaterial from './form/CreateMaterial';
import UpdateMaterial from './form/UpdateMaterial';
const mapFields: Record<string, string> = {
  'Tên nguyên liệu': 'name',
  Tag: 'tag',
  'Mô tả': 'description',
  'Loại nguyên liệu': 'category'
};

export function CreateManyMaterialButton() {
  const [data, setData] = useState<any[]>([]);
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const utils = api.useUtils();

  const resetFileInput = () => {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };
  const importMutation = api.Material.createMany.useMutation({
    onSuccess: data => {
      if (data.success) {
        NotifySuccess(data.message);
        utils.Material.invalidate();
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
  const fetchMaterials = api.Material.getAll.useQuery();
  const handleExport = async () => {
    if (!fetchMaterials.data || fetchMaterials.data.length === 0) {
      return NotifyError('Không có dữ liệu để xuất.');
    }
    const XLSX = await import('xlsx');

    const exportData = fetchMaterials.data.map((item: any) => ({
      ID: item.id,
      'Tên danh mục': item.name,
      Tag: item.tag,
      'Mô tả': item.description || '',
      'Loại nguyên liệu': item.category
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Categories');

    XLSX.writeFile(workbook, `Nguyên_liệu - ${new Date().getTime()}.xlsx`);
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
        <Button bg={'red'} onClick={handleExport} disabled={fetchMaterials?.data?.length === 0}>
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
          <Box className={`tableAdmin w-full overflow-x-auto`}>
            <Table striped highlightOnHover withTableBorder withColumnBorders>
              <Table.Thead className='rounded-lg text-sm uppercase leading-normal'>
                <Table.Tr>
                  <Table.Th className='text-sm' style={{ minWidth: 100 }}>
                    Tên nguyên liệu
                  </Table.Th>
                  <Table.Th className='text-sm' style={{ minWidth: 100 }}>
                    Tag
                  </Table.Th>
                  <Table.Th className='text-sm' style={{ minWidth: 100 }}>
                    Mô tả
                  </Table.Th>
                  <Table.Th className='text-sm' style={{ minWidth: 100 }}>
                    Loại nguyên liệu
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {data.map((row, index) => (
                  <Table.Tr key={index}>
                    <Table.Td className='text-sm'>{row['Tên nguyên liệu']}</Table.Td>
                    <Table.Td className='text-sm'>{row['Tag']}</Table.Td>
                    <Table.Td className='text-sm'>{row['Mô tả']}</Table.Td>
                    <Table.Th>{row['Loại nguyên liệu']}</Table.Th>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Box>
        </ScrollAreaAutosize>
        <Flex align={'center'} gap={'md'} mt='md' justify='flex-end'>
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
        </Flex>
      </Modal>
    </>
  );
}

export function CreateMaterialButton() {
  const [opened, setOpened] = useState(false);
  return (
    <>
      <Button leftSection={<IconPlus size={16} />} onClick={() => setOpened(true)}>
        Tạo mới
      </Button>
      <Modal
        opened={opened}
        closeOnClickOutside={false}
        onClose={() => setOpened(false)}
        title={<Title order={2}>Tạo danh mục</Title>}
      >
        <CreateMaterial setOpened={setOpened} />
      </Modal>
    </>
  );
}

export function UpdateMaterialButton({ id }: { id: string }) {
  const [opened, setOpened] = useState(false);
  return (
    <>
      <ActionIcon variant='subtle' color='blue' onClick={() => setOpened(true)}>
        <IconEdit size={24} />
      </ActionIcon>
      <Modal
        opened={opened}
        closeOnClickOutside={false}
        onClose={() => setOpened(false)}
        title={<Title order={2}>Cập nhật danh mục</Title>}
      >
        <UpdateMaterial materialId={id.toString()} setOpened={setOpened} />
      </Modal>
    </>
  );
}

export function DeleteMaterialButton({ id }: { id: string }) {
  const utils = api.useUtils();
  const mutationDelete = api.Material.delete.useMutation();
  return (
    <>
      <ActionIcon
        variant='subtle'
        color='red'
        onClick={() => {
          confirmDelete({
            id: { id },
            mutationDelete,
            entityName: 'nguyên liệu',
            callback: () => {
              utils.Material.invalidate();
            }
          });
        }}
      >
        <IconTrash size={24} />
      </ActionIcon>
    </>
  );
}
