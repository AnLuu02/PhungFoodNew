'use client';

import { ActionIcon, Button, Flex, Group, Paper, ScrollAreaAutosize, Stack, Text, TextInput } from '@mantine/core';
import { RichTextEditor } from '@mantine/tiptap';
import { IconSend, IconTrash, IconX } from '@tabler/icons-react';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import SubScript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TextAlign from '@tiptap/extension-text-align';
import { FontSize, TextStyle } from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import Youtube from '@tiptap/extension-youtube';
import { Editor, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Dispatch, SetStateAction, useState } from 'react';
import BButton from '~/components/Button/Button';
import { AttachmentButton } from '~/components/Tiptap/AttachmentButton';
import { EmojiPickerButton } from '~/components/Tiptap/EmojiPickerButton';
import { FontFamily } from '~/components/Tiptap/extensions/FontFamilyExtension';
import { ResizableImageExtension } from '~/components/Tiptap/extensions/ResizableImageView';
import { Video } from '~/components/Tiptap/extensions/VideoExtension';
import { MediaButtons } from '~/components/Tiptap/MediaButtons';
import { TiptapControl } from '~/components/Tiptap/TiptapControl';
import { NotifyError, NotifySuccess } from '~/lib/FuncHandler/toast';
import { api } from '~/trpc/react';

export default function MailResponse({
  userContactInfo,
  setOpenedModal
}: {
  userContactInfo: { id: string; email: string; name: string; message: string; responded: boolean };
  setOpenedModal: Dispatch<SetStateAction<boolean>>;
}) {
  const [files, setFiles] = useState<File[]>([]);
  const [openeEdit, setOpenEdit] = useState(true);
  const [subject, setSubject] = useState('Phản hồi từ Phụng Food Restaurant');
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState<{ json: any; html: any }>({ json: {}, html: '' });

  const editor: Editor | null = useEditor({
    extensions: [
      StarterKit,
      ResizableImageExtension.configure({
        defaultWidth: 200,
        defaultHeight: 200,
        allowBase64: true
      }),
      Youtube.configure({
        width: 640,
        height: 360,
        autoplay: false
      }),
      Video,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyle,
      FontSize,
      FontFamily
    ],
    content: value,
    onUpdate: ({ editor }) => {
      setValue({ json: editor.getJSON(), html: editor.getHTML() });
    },
    immediatelyRender: false
  });

  const updateMutation = api.Contact.update.useMutation();

  const handleSendEmail = async ({ type }: { type: 'default' | 'auto' }) => {
    setLoading(true);
    let html = value.html;
    if (type === 'auto') {
      const resp = await fetch('/api/agent-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userContactInfo.name,
          email: userContactInfo.email,
          message: userContactInfo.message
        })
      });
      const data = await resp.json();
      if (data?.message) {
        html = data.message;
      }
    }
    if (html) {
      const res = await fetch('/api/send-mail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'Phụng Food Restaurant',
          to_n: [userContactInfo.email],
          idRecord: userContactInfo.id,
          subject: subject || 'Phản hồi từ Phụng Food Restaurant',
          data: html
        })
      });

      const json = await res.json();
      if (json?.success) {
        if (!userContactInfo.responded) {
          await updateMutation.mutateAsync({
            where: {
              id: json?.data?.idRecord
            },
            data: {
              responded: true
            }
          });
        }
        NotifySuccess('Thao tác thành công!', 'Phản hồi thành công! ');
        setOpenedModal(false);
        setLoading(false);
      }
    } else {
      setLoading(false);
      NotifyError('Chưa đủ thông tin.', 'Chưa tạo phản hồi.');
    }
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
  };
  if (!editor) {
    return null;
  }
  return (
    <RichTextEditor editor={editor} className='border-0'>
      <Stack gap='xs'>
        <Group p={0} align='center' gap={'md'}>
          <Text c={'dimmed'} size={'sm'}>
            Người nhận
          </Text>
          <TextInput
            flex={1}
            placeholder='Người nhận'
            value={userContactInfo.email}
            variant='unstyled'
            styles={{
              input: {
                fontSize: '15px',
                borderBottom: '1px solid #eee',
                padding: '8px 0'
              }
            }}
          />
        </Group>

        <Group p={0} align='center' gap={'md'}>
          <Text c={'dimmed'} size={'sm'}>
            Tiêu đề
          </Text>
          <TextInput
            placeholder='Tiêu đề'
            flex={1}
            variant='unstyled'
            value={subject}
            onChange={e => setSubject(e.target.value)}
            styles={{
              input: {
                fontSize: '15px',
                borderBottom: '1px solid #eee',
                padding: '8px 0'
              }
            }}
          />
        </Group>

        <ScrollAreaAutosize mih={300} mah={350}>
          <RichTextEditor.Content />
        </ScrollAreaAutosize>
        {files.length > 0 && (
          <Flex gap={'sm'}>
            {files.map((file, i) => (
              <Paper key={i} withBorder w={'max-content'}>
                <Group
                  key={i}
                  gap='xs'
                  align='center'
                  w={'max-content'}
                  justify='space-between'
                  className='rounded-md border px-2 py-1 text-sm dark:border-dark-dimmed'
                >
                  <Text size='sm' truncate>
                    {file.name} ({(file.size / 1024).toFixed(1)} KB)
                  </Text>
                  <IconX
                    size={14}
                    className='cursor-pointer text-red-500 hover:text-red-700'
                    onClick={() => removeFile(i)}
                  />
                </Group>
              </Paper>
            ))}
          </Flex>
        )}
        {openeEdit && <TiptapControl editor={editor} />}
        <Group align='center' justify='space-between'>
          <Group align='center' gap={'xs'}>
            <Button
              leftSection={<IconSend size={16} />}
              type='submit'
              color='blue'
              radius='xl'
              loading={loading}
              onClick={() => handleSendEmail({ type: 'default' })}
            >
              Gửi
            </Button>
            <ActionIcon
              onClick={() => setOpenEdit(!openeEdit)}
              variant={openeEdit ? 'light' : 'subtle'}
              radius='xl'
              size={'lg'}
            >
              <Text size='lg' fw={700}>
                Aa
              </Text>
            </ActionIcon>

            <MediaButtons editor={editor} />
            <AttachmentButton files={files} setFiles={setFiles} />
            <EmojiPickerButton editor={editor} />

            <BButton children={'Trả lời tự động'} loading={loading} onClick={() => handleSendEmail({ type: 'auto' })} />
          </Group>
          <ActionIcon color='red' variant='subtle' radius='xl' size={'lg'} onClick={() => setOpenedModal(false)}>
            <IconTrash size={20} />
          </ActionIcon>
        </Group>
      </Stack>
    </RichTextEditor>
  );
}
