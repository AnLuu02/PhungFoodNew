'use client';

import { ActionIcon, Box, Button, Flex, Group, List, Modal, rem, Stack, Text, Title } from '@mantine/core';
import { IconDots, IconLighter, IconMicrophone, IconSquare, IconTrash, IconVolume } from '@tabler/icons-react';
import Link from 'next/link';
import { useEffect, useReducer, useRef, useState } from 'react';
import { NotifyError } from '~/app/lib/utils/func-handler/toast';

const initialState: any = {
  searchState: 'initial',
  transcript: '',
  recordingTime: 0,
  audioUrl: null
};

function reducer(state: any, action: any) {
  switch (action.type) {
    case 'START_RECORDING':
      return { ...state, searchState: 'recording', transcript: '', recordingTime: 0, audioUrl: null };
    case 'STOP_RECORDING':
      return { ...state, searchState: 'completed' };
    case 'RESET':
      return initialState;
    case 'SET_TRANSCRIPT':
      return { ...state, transcript: action.payload };
    case 'SET_AUDIO_URL':
      return { ...state, audioUrl: action.payload };
    case 'INCREMENT_TIME':
      return { ...state, recordingTime: state.recordingTime + 1 };
    default:
      return state;
  }
}

export default function VoiceSearchModal() {
  const [opened, setOpened] = useState<any>(false);
  const [state, dispatch] = useReducer(reducer, initialState);
  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<any>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (state.searchState === 'recording') {
      timerRef.current = setInterval(() => dispatch({ type: 'INCREMENT_TIME' }), 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, [state.searchState]);

  const startRecording = async () => {
    if (!('webkitSpeechRecognition' in window) || !navigator.mediaDevices) {
      alert('Trình duyệt không hỗ trợ chức năng này!');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event: any) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data as Blob);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        if (state.audioUrl) {
          URL.revokeObjectURL(state.audioUrl);
        }
        dispatch({ type: 'SET_AUDIO_URL', payload: URL.createObjectURL(audioBlob) });
      };

      dispatch({ type: 'START_RECORDING' });
      recognitionRef.current = new (window as any).webkitSpeechRecognition();
      recognitionRef.current.lang = 'vi-VN';
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        dispatch({ type: 'SET_TRANSCRIPT', payload: event.results[0][0].transcript });
      };
      recognitionRef.current.start();
      mediaRecorderRef.current.start();
    } catch (error) {
      NotifyError('Không có quyền truy cập microphone');
      dispatch({ type: 'RESET' });
    }
  };

  const stopRecording = () => {
    recognitionRef.current?.stop();

    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }

    // Dừng tất cả tracks của microphone
    if (mediaRecorderRef.current?.stream) {
      mediaRecorderRef.current.stream.getTracks().forEach((track: any) => track.stop());
    }

    dispatch({ type: 'STOP_RECORDING' });
  };

  const resetRecording = () => {
    if (state.audioUrl) {
      URL.revokeObjectURL(state.audioUrl);
    }

    if (mediaRecorderRef.current?.stream) {
      mediaRecorderRef.current.stream.getTracks().forEach((track: any) => track.stop());
    }

    audioChunksRef.current = [];
    dispatch({ type: 'RESET' });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  return (
    <>
      <ActionIcon variant='subtle' color='gray' onClick={() => setOpened(true)}>
        <IconMicrophone size={18} />
      </ActionIcon>

      <Modal
        opened={opened}
        centered
        onClose={() => {
          setOpened(false);
          resetRecording();
          audioChunksRef.current = [];
        }}
        title={<Title order={3}>Tìm kiếm bằng giọng nói</Title>}
        size='md'
        radius={'lg'}
        padding='lg'
      >
        <Stack>
          {/* Hướng dẫn sử dụng */}
          <Box className='space-y-2 rounded-lg bg-amber-50 p-2'>
            <Group>
              <IconLighter size={24} className='text-amber-500' />
              <Text fw={500}>Mẹo để tìm kiếm chính xác hơn</Text>
            </Group>
            <List size='sm' mt={8} spacing='xs' p={2}>
              <List.Item>Nói to, rõ ràng, không bị nhiễu âm.</List.Item>
              <List.Item>Đọc đúng tên sản phẩm hoặc thành phần chính.</List.Item>
            </List>
          </Box>

          <Stack align='center' gap='lg' py={'md'}>
            {state.searchState === 'initial' && (
              <>
                <Text c='dimmed'>Ví dụ: "Vitamin C"</Text>
                <ActionIcon size='xl' radius='xl' variant='light' color='blue' onClick={startRecording}>
                  <IconMicrophone size={28} />
                </ActionIcon>
                <Text c='dimmed' size='sm'>
                  Nhấn để bắt đầu ghi âm
                </Text>
              </>
            )}

            {state.searchState === 'recording' && (
              <>
                <Text c='dimmed'>Đang ghi âm giọng nói của bạn</Text>
                <Flex justify='space-between' align='center' w='100%' maw={300}>
                  <ActionIcon size='xl' radius='xl' color='red' variant='filled' onClick={stopRecording}>
                    <IconSquare size={20} />
                  </ActionIcon>

                  <Flex gap={4} h={40} align='flex-end'>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Box
                        key={i}
                        w={rem(4)}
                        h={rem(Math.random() * 20 + 10)}
                        bg='var(--mantine-color-blue-6)'
                        style={{
                          animation: 'pulse 1s infinite',
                          animationDelay: `${i * 0.15}s`
                        }}
                      />
                    ))}
                  </Flex>

                  <ActionIcon size='xl' radius='xl' color='gray' variant='light' onClick={resetRecording}>
                    <IconTrash size={20} />
                  </ActionIcon>
                </Flex>
                <Text c='dimmed'>{formatTime(state.recordingTime)}</Text>
              </>
            )}

            {state.searchState === 'completed' && (
              <>
                <Text c='dimmed'>Bạn đã nói:</Text>
                <Text fw={600} size='lg' color='blue'>
                  "{state.transcript}"
                </Text>
                <Text c='dimmed'>Nghe lại</Text>
                <Flex justify='space-between' align='center' w='100%' maw={300}>
                  <ActionIcon
                    size='xl'
                    radius='xl'
                    color='blue'
                    variant='light'
                    onClick={() => {
                      if (state.audioUrl) {
                        new Audio(state.audioUrl).play();
                      }
                    }}
                  >
                    <IconVolume size={20} />
                  </ActionIcon>
                  {state.audioUrl && (
                    <audio controls hidden>
                      <source src={state.audioUrl} type='audio/wav' />
                      Trình duyệt của bạn không hỗ trợ nghe lại.
                    </audio>
                  )}

                  <IconDots size={24} color='var(--mantine-color-blue-6)' />

                  <ActionIcon size='xl' radius='xl' color='gray' variant='light' onClick={resetRecording}>
                    <IconTrash size={20} />
                  </ActionIcon>
                </Flex>
                <Text c='dimmed'>{formatTime(state.recordingTime)}</Text>
              </>
            )}
          </Stack>

          <Link href={`/thuc-don?s=${state.transcript}`}>
            <Button
              fullWidth
              size='md'
              color={state.searchState === 'completed' ? 'blue' : 'gray'}
              disabled={state.searchState !== 'completed'}
              onClick={() => {
                setOpened(false);
                resetRecording();
              }}
            >
              Tìm kiếm
            </Button>
          </Link>
        </Stack>

        <style jsx global>{`
          @keyframes pulse {
            0%,
            100% {
              transform: scaleY(1);
            }
            50% {
              transform: scaleY(1.5);
            }
          }
        `}</style>
      </Modal>
    </>
  );
}

// "use client"

// import { useState, useEffect, useRef } from "react"
// import {
//   Modal,
//   Button,
//   Text,
//   Box,
//   Paper,
//   Flex,
//   Stack,
//   rem,
//   ActionIcon,
//   List,
//   ThemeIcon,
//   Loader,
//   Card,
//   Image,
//   Badge,
// } from "@mantine/core"
// import {
//   IconMicrophone,
//   IconX,
//   IconSquare,
//   IconTrash,
//   IconPlayerPlay,
//   IconDots,
//   IconLightbulb,
//   IconSearch,
// } from "@tabler/icons-react"
// import { notifications } from "@mantine/notifications"

// type Product = {
//   id: number
//   name: string
//   category: string
//   price: number
//   image: string
// }

// export default function VoiceSearchModal({ onClose }: { onClose: () => void }) {
//   const [opened, setOpened] = useState(true)
//   const [searchState, setSearchState] = useState<"initial" | "recording" | "completed" | "searching" | "results">(
//     "initial",
//   )
//   const [recordingTime, setRecordingTime] = useState(0)
//   const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
//   const [audioUrl, setAudioUrl] = useState<string | null>(null)
//   const [transcript, setTranscript] = useState("")
//   const [searchResults, setSearchResults] = useState<Product[]>([])
//   const [isLoading, setIsLoading] = useState(false)

//   const timerRef = useRef<NodeJS.Timeout | null>(null)
//   const mediaRecorderRef = useRef<MediaRecorder | null>(null)
//   const audioChunksRef = useRef<Blob[]>([])
//   const audioRef = useRef<HTMLAudioElement | null>(null)

//   useEffect(() => {
//     if (searchState === "recording") {
//       timerRef.current = setInterval(() => {
//         setRecordingTime((prev) => prev + 1)
//       }, 1000)
//     } else if (timerRef.current) {
//       clearInterval(timerRef.current)
//     }

//     return () => {
//       if (timerRef.current) {
//         clearInterval(timerRef.current)
//       }
//     }
//   }, [searchState])

//   useEffect(() => {
//     // Clean up audio URL when component unmounts
//     return () => {
//       if (audioUrl) {
//         URL.revokeObjectURL(audioUrl)
//       }
//     }
//   }, [audioUrl])

//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

//       const mediaRecorder = new MediaRecorder(stream)
//       mediaRecorderRef.current = mediaRecorder
//       audioChunksRef.current = []

//       mediaRecorder.ondataavailable = (event) => {
//         if (event.data.size > 0) {
//           audioChunksRef.current.push(event.data)
//         }
//       }

//       mediaRecorder.onstop = () => {
//         const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })
//         const audioUrl = URL.createObjectURL(audioBlob)
//         setAudioBlob(audioBlob)
//         setAudioUrl(audioUrl)

//         // Stop all tracks of the stream
//         stream.getTracks().forEach((track) => track.stop())
//       }

//       mediaRecorder.start()
//       setSearchState("recording")
//       setRecordingTime(0)
//     } catch (error) {
//       console.error("Error accessing microphone:", error)
//       notifications.show({
//         title: "Error",
//         message: "Could not access microphone. Please check permissions.",
//         color: "red",
//       })
//     }
//   }

//   const stopRecording = () => {
//     if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
//       mediaRecorderRef.current.stop()
//       setSearchState("completed")
//     }
//   }

//   const resetRecording = () => {
//     if (audioUrl) {
//       URL.revokeObjectURL(audioUrl)
//     }
//     setAudioBlob(null)
//     setAudioUrl(null)
//     setTranscript("")
//     setSearchState("initial")
//     setRecordingTime(0)
//     setSearchResults([])
//   }

//   const playRecording = () => {
//     if (audioRef.current && audioUrl) {
//       audioRef.current.play()
//     }
//   }

//   const handleSearch = async () => {
//     if (!audioBlob) return

//     setSearchState("searching")
//     setIsLoading(true)

//     try {
//       // Step 1: Transcribe the audio
//       const formData = new FormData()
//       formData.append("audio", audioBlob)

//       const transcribeResponse = await fetch("/api/transcribe", {
//         method: "POST",
//         body: formData,
//       })

//       if (!transcribeResponse.ok) {
//         throw new Error("Failed to transcribe audio")
//       }

//       const { text } = await transcribeResponse.json()
//       setTranscript(text)

//       // Step 2: Search for products based on the transcript
//       const searchResponse = await fetch(`/api/search?q=${encodeURIComponent(text)}`)

//       if (!searchResponse.ok) {
//         throw new Error("Failed to search products")
//       }

//       const { products } = await searchResponse.json()
//       setSearchResults(products)
//       setSearchState("results")
//     } catch (error) {
//       console.error("Search error:", error)
//       notifications.show({
//         title: "Error",
//         message: "Failed to process your search. Please try again.",
//         color: "red",
//       })
//       setSearchState("completed")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const formatTime = (seconds: number) => {
//     const mins = Math.floor(seconds / 60)
//     const secs = seconds % 60
//     return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
//   }

//   const formatPrice = (price: number) => {
//     return new Intl.NumberFormat("vi-VN", {
//       style: "currency",
//       currency: "VND",
//       minimumFractionDigits: 0,
//     }).format(price)
//   }

//   const handleClose = () => {
//     // Stop recording if active
//     if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
//       mediaRecorderRef.current.stop()
//     }

//     // Clean up audio URL
//     if (audioUrl) {
//       URL.revokeObjectURL(audioUrl)
//     }

//     setOpened(false)
//     onClose()
//   }

//   return (
//     <>
//       {/* Hidden audio element for playback */}
//       <audio ref={audioRef} src={audioUrl || ""} style={{ display: "none" }} />

//       <Modal
//         opened={opened}
//         onClose={handleClose}
//         title="Tìm kiếm với giọng nói"
//         centered
//         size="md"
//         padding={0}
//         withCloseButton={false}
//       >
//         <Box>
//           {/* Header with close button */}
//           <Flex
//             justify="space-between"
//             align="center"
//             p="md"
//             style={{ borderBottom: "1px solid var(--mantine-color-gray-3)" }}
//           >
//             <Text size="lg" fw={500}>
//               Tìm kiếm với giọng nói
//             </Text>
//             <ActionIcon onClick={handleClose} variant="subtle" color="gray">
//               <IconX size={18} />
//             </ActionIcon>
//           </Flex>

//           {searchState !== "results" && (
//             <Paper p="md" bg="var(--mantine-color-yellow-0)" radius={0}>
//               <Flex gap="sm">
//                 <ThemeIcon color="yellow" variant="light" size="md" radius="xl">
//                   <IconLightbulb size={16} />
//                 </ThemeIcon>
//                 <Box>
//                   <Text fw={500}>Mẹo để tìm kiếm sản phẩm chính xác nhất</Text>
//                   <List size="sm" mt={8} spacing="xs">
//                     <List.Item>Nói to, rõ ràng, không tạp âm.</List.Item>
//                     <List.Item>Đọc đúng tên sản phẩm hoặc thành phần, tránh từ ngữ mơ hồ.</List.Item>
//                   </List>
//                 </Box>
//               </Flex>
//             </Paper>
//           )}

//           {/* Content area */}
//           {searchState === "initial" && (
//             <Stack align="center" py={40} px="md" spacing="lg">
//               <Text c="dimmed">Ví dụ: "Vitamin C"</Text>
//               <ActionIcon size="xl" radius="xl" variant="light" color="blue" onClick={startRecording}>
//                 <IconMicrophone size={28} />
//               </ActionIcon>
//               <Text c="dimmed" size="sm">
//                 Nhấn để bắt đầu ghi âm
//               </Text>
//             </Stack>
//           )}

//           {searchState === "recording" && (
//             <Stack align="center" py={40} px="md" spacing="lg">
//               <Text c="dimmed">Đang ghi âm giọng nói của bạn</Text>
//               <Flex justify="space-between" align="center" w="100%" maw={300}>
//                 <ActionIcon size="xl" radius="xl" color="red" variant="filled" onClick={stopRecording}>
//                   <IconSquare size={20} />
//                 </ActionIcon>

//                 <Flex gap={4} h={40} align="flex-end">
//                   {Array.from({ length: 5 }).map((_, i) => (
//                     <Box
//                       key={i}
//                       w={rem(4)}
//                       h={rem(Math.random() * 20 + 10)}
//                       bg="var(--mantine-color-blue-6)"
//                       style={{
//                         animation: "pulse 1s infinite",
//                         animationDelay: `${i * 0.15}s`,
//                       }}
//                     />
//                   ))}
//                 </Flex>

//                 <ActionIcon size="xl" radius="xl" color="gray" variant="light" onClick={resetRecording}>
//                   <IconTrash size={20} />
//                 </ActionIcon>
//               </Flex>
//               <Text c="dimmed">{formatTime(recordingTime)}</Text>
//             </Stack>
//           )}

//           {searchState === "completed" && (
//             <Stack align="center" py={40} px="md" spacing="lg">
//               <Text c="dimmed">Nghe lại</Text>
//               <Flex justify="space-between" align="center" w="100%" maw={300}>
//                 <ActionIcon size="xl" radius="xl" color="blue" variant="light" onClick={playRecording}>
//                   <IconPlayerPlay size={20} />
//                 </ActionIcon>

//                 <IconDots size={24} color="var(--mantine-color-blue-6)" />

//                 <ActionIcon size="xl" radius="xl" color="gray" variant="light" onClick={resetRecording}>
//                   <IconTrash size={20} />
//                 </ActionIcon>
//               </Flex>
//               <Text c="dimmed">{formatTime(recordingTime)}</Text>
//             </Stack>
//           )}

//           {searchState === "searching" && (
//             <Stack align="center" py={40} px="md" spacing="lg">
//               <Loader size="md" />
//               <Text>Đang xử lý...</Text>
//             </Stack>
//           )}

//           {searchState === "results" && (
//             <Box p="md">
//               <Text fw={500} mb="xs">
//                 Kết quả tìm kiếm cho: "{transcript}"
//               </Text>

//               {searchResults.length === 0 ? (
//                 <Text c="dimmed" ta="center" py="xl">
//                   Không tìm thấy sản phẩm nào phù hợp
//                 </Text>
//               ) : (
//                 <Stack>
//                   {searchResults.map((product) => (
//                     <Card key={product.id} withBorder padding="sm">
//                       <Flex gap="md">
//                         <Image src={product.image || "/placeholder.svg"} width={60} height={60} alt={product.name} />
//                         <Box>
//                           <Text fw={500}>{product.name}</Text>
//                           <Badge color="blue" variant="light" size="sm">
//                             {product.category}
//                           </Badge>
//                           <Text c="blue" fw={700} mt={5}>
//                             {formatPrice(product.price)}
//                           </Text>
//                         </Box>
//                       </Flex>
//                     </Card>
//                   ))}
//                 </Stack>
//               )}

//               <Button fullWidth mt="md" leftSection={<IconSearch size={16} />} onClick={resetRecording}>
//                 Tìm kiếm mới
//               </Button>
//             </Box>
//           )}

//           {/* Footer with search button */}
//           {(searchState === "initial" || searchState === "recording" || searchState === "completed") && (
//             <Box p="md">
//               <Button
//                 fullWidth
//                 size="md"
//                 onClick={
//                   searchState === "initial"
//                     ? startRecording
//                     : searchState === "recording"
//                       ? stopRecording
//                       : handleSearch
//                 }
//                 color={searchState === "completed" ? "blue" : "gray"}
//                 disabled={searchState === "initial"}
//                 loading={isLoading}
//               >
//                 Tìm kiếm
//               </Button>
//             </Box>
//           )}
//         </Box>

//         <style jsx global>{`
//           @keyframes pulse {
//             0%, 100% { transform: scaleY(1); }
//             50% { transform: scaleY(1.5); }
//           }
//         `}</style>
//       </Modal>
//     </>
//   )
// }
