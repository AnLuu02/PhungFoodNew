'use client';

import { AreaChart, LineChart } from '@mantine/charts';
import {
  Accordion,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Grid,
  Group,
  JsonInput,
  List,
  Modal,
  MultiSelect,
  NumberInput,
  Paper,
  Progress,
  RingProgress,
  ScrollArea,
  SegmentedControl,
  Select,
  SimpleGrid,
  Stack,
  Stepper,
  Switch,
  Table,
  Tabs,
  Text,
  Textarea,
  ThemeIcon,
  Title
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconAlertTriangle,
  IconBolt,
  IconBrain,
  IconChartDots,
  IconCheck,
  IconDatabase,
  IconDeviceAnalytics,
  IconFlame,
  IconPlus,
  IconRobot,
  IconRocket,
  IconShoppingCart,
  IconSparkles,
  IconTarget,
  IconTrendingUp,
  IconUsers,
  IconWand
} from '@tabler/icons-react';
import { useState } from 'react';
import { formatPriceLocaleVi } from '~/lib/FuncHandler/Format';
import { buildChangeRateData } from '~/lib/FuncHandler/Statistics';
import { AnalyticsMetricCard } from '../../components/AnalyticsMetricCard';
import { AIInsightHero } from './AIInsightHero';
import { ConversionFunnel } from './ConversionFunnel';
import { LiveActivityStream } from './LiveActivityStream';
import { PeakHourHeatmap } from './PeakHourHeatmap';
const recommendations = [
  {
    id: 1,
    title: 'Đẩy banner Combo Gia Đình',
    desc: 'Sản phẩm đang có tín hiệu tăng trưởng mạnh vào khung trưa.',
    impact: 'Cao',

    expectedRevenue: '+3.2M',
    confidence: 86,

    actions: ['Pin sản phẩm ở homepage', 'Hiển thị badge trending', 'Tăng priority recommendation engine']
  },

  {
    id: 2,
    title: 'Tăng nhân sự bếp 11:00 - 13:00',
    desc: 'Heatmap cho thấy đây là khung có áp lực đơn hàng cao nhất.',
    impact: 'Cao',

    expectedRevenue: '-28% thời gian chờ',
    confidence: 81,

    actions: ['Tăng 2 staff bếp', 'Pre-cook nguyên liệu', 'Ưu tiên món trending']
  },

  {
    id: 3,
    title: 'Tạo voucher chống bỏ giỏ hàng',
    desc: 'Có 31% khách dừng ở bước checkout.',
    impact: 'Trung bình',

    expectedRevenue: '+12% conversion',
    confidence: 74,

    actions: ['Voucher 15 phút', 'Popup countdown', 'Trigger khi abandon checkout']
  }
];
const revenueRealtime = [
  { time: '08:00', revenue: 1200000, users: 24 },
  { time: '09:00', revenue: 2100000, users: 38 },
  { time: '10:00', revenue: 3800000, users: 61 },
  { time: '11:00', revenue: 6200000, users: 94 },
  { time: '12:00', revenue: 8900000, users: 132 },
  { time: '13:00', revenue: 7600000, users: 118 },
  { time: '14:00', revenue: 4900000, users: 76 }
];

export default function AnalyticsDashboard() {
  const [recommendOpened, recommendHandler] = useDisclosure(false);
  const [rawDataOpened, rawDataHandler] = useDisclosure(false);
  const [selectedRecommendation, setSelectedRecommendation] = useState<any>(null);

  const [recommendationOpened, recommendationHandler] = useDisclosure(false);
  const [createStrategyOpened, createStrategyHandler] = useDisclosure(false);
  return (
    <>
      <Box className='space-y-6'>
        <Group justify='space-between'>
          <Box>
            <Title order={2} className='font-quicksand'>
              Trung tâm phân tích
            </Title>
            <Text c='dimmed'>Phân tích realtime, hành vi khách hàng, dự đoán và đề xuất vận hành.</Text>
          </Box>

          <SegmentedControl
            radius='xl'
            data={[
              { label: 'Realtime', value: 'realtime' },
              { label: '7 ngày', value: '7days' },
              { label: '30 ngày', value: '30days' }
            ]}
            defaultValue='realtime'
          />
        </Group>

        <AIInsightHero onOpenRecommendations={recommendHandler.open} onOpenRawData={rawDataHandler.open} />

        <SimpleGrid cols={{ base: 1, sm: 2, xl: 4 }}>
          <AnalyticsMetricCard
            title='Người dùng online'
            value='132'
            descObj={buildChangeRateData(20, '_all')}
            color='blue'
            icon={<IconUsers size={24} />}
            currentSparkline={[20, 28, 32, 45, 62, 80, 132]}
            previousSparkline={[28, 62, 20, 45, 36, 200, 56]}
          />

          <AnalyticsMetricCard
            title='Checkout active'
            value='31'
            descObj={buildChangeRateData(-10, '_all')}
            color='green'
            icon={<IconShoppingCart size={24} />}
            previousSparkline={[8, 12, 9, 18, 22, 26, 31]}
            currentSparkline={[20, 28, 32, 45, 62, 80, 132]}
          />

          <AnalyticsMetricCard
            title='Sản phẩm đang hot'
            value='Combo'
            descObj={buildChangeRateData(0, '_all')}
            color='orange'
            icon={<IconFlame size={24} />}
            currentSparkline={[12, 18, 24, 35, 48, 61, 78]}
            previousSparkline={[8, 12, 9, 18, 22, 26, 31]}
          />

          <AnalyticsMetricCard
            title='Dự đoán doanh thu'
            value='12.8M'
            descObj={buildChangeRateData(50, '_all')}
            color='violet'
            icon={<IconBrain size={24} />}
            previousSparkline={[3, 4, 5, 6, 7, 9, 12.8]}
            currentSparkline={[12, 18, 24, 35, 48, 61, 78]}
          />
        </SimpleGrid>

        <Grid>
          <Grid.Col span={{ base: 12, xl: 8 }}>
            <Paper withBorder radius='xl' p='lg' className='shadow-sm'>
              <Group justify='space-between' mb='md'>
                <Box>
                  <Title order={4}>Doanh thu theo thời gian thực</Title>
                  <Text size='sm' c='dimmed'>
                    Doanh thu và lượng user đang hoạt động theo giờ
                  </Text>
                </Box>

                <Badge color='blue' className='border-blue-600 py-3' variant='light'>
                  Cập nhật trực tiếp
                </Badge>
              </Group>

              <AreaChart
                h={340}
                data={revenueRealtime}
                dataKey='time'
                series={[{ name: 'revenue', label: 'Doanh thu', color: 'blue.6' }]}
                valueFormatter={formatPriceLocaleVi}
                withGradient
                withLegend
                curveType='natural'
              />
            </Paper>
          </Grid.Col>

          <Grid.Col span={{ base: 12, xl: 4 }}>
            <LiveActivityStream />
          </Grid.Col>
        </Grid>

        <Grid>
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <PeakHourHeatmap />
          </Grid.Col>

          <Grid.Col span={{ base: 12, lg: 6 }}>
            <ConversionFunnel />
          </Grid.Col>
        </Grid>

        <Grid>
          <Grid.Col span={{ base: 12, xl: 7 }}>
            <Paper withBorder radius='xl' p='lg' className='shadow-sm'>
              <Group justify='space-between' mb='md'>
                <Box>
                  <Title order={4}>Dự báo doanh thu</Title>
                  <Text size='sm' c='dimmed'>
                    Dự đoán doanh thu dựa trên tốc độ đơn hiện tại
                  </Text>
                </Box>

                <Badge
                  color='violet'
                  variant='light'
                  className='border-violet-600'
                  leftSection={<IconTrendingUp size={12} />}
                >
                  Dự đoán
                </Badge>
              </Group>

              <LineChart
                h={300}
                data={[
                  { time: '08:00', actual: 1.2, forecast: 1.1 },
                  { time: '10:00', actual: 3.8, forecast: 3.5 },
                  { time: '12:00', actual: 8.9, forecast: 8.4 },
                  { time: '14:00', actual: 4.9, forecast: 5.2 },
                  { time: '16:00', actual: null, forecast: 7.6 },
                  { time: '18:00', actual: null, forecast: 10.8 },
                  { time: '20:00', actual: null, forecast: 12.8 }
                ]}
                dataKey='time'
                series={[
                  { name: 'actual', label: 'Thực tế', color: 'blue.6' },
                  { name: 'forecast', label: 'Dự đoán', color: 'violet.6' }
                ]}
                withLegend
                curveType='natural'
              />
            </Paper>
          </Grid.Col>

          <Grid.Col span={{ base: 12, xl: 5 }}>
            <Paper withBorder radius='xl' p='lg' className='shadow-sm'>
              <Group mb='md'>
                <ThemeIcon color='violet' radius='xl' variant='light'>
                  <IconDeviceAnalytics size={20} />
                </ThemeIcon>

                <Box>
                  <Title order={4}>Giữ chân khách hàng</Title>
                  <Text size='sm' c='dimmed'>
                    Phân tích khả năng quay lại của khách
                  </Text>
                </Box>
              </Group>

              <SimpleGrid cols={2}>
                <Card withBorder radius='lg'>
                  <Text size='sm' c='dimmed'>
                    Returning rate
                  </Text>
                  <Title order={2}>41.2%</Title>
                </Card>

                <Card withBorder radius='lg'>
                  <Text size='sm' c='dimmed'>
                    Repeat purchase
                  </Text>
                  <Title order={2}>2.8x</Title>
                </Card>

                <Card withBorder radius='lg'>
                  <Text size='sm' c='dimmed'>
                    Churn risk
                  </Text>
                  <Title order={2}>8.6%</Title>
                </Card>

                <Card withBorder radius='lg'>
                  <Text size='sm' c='dimmed'>
                    Loyalty users
                  </Text>
                  <Title order={2}>326</Title>
                </Card>
              </SimpleGrid>
            </Paper>
          </Grid.Col>
        </Grid>

        <Paper withBorder radius='xl' p='lg' className='shadow-sm'>
          <Group justify='space-between' mb='md'>
            <Box>
              <Title order={4}>Khuyến nghị AI</Title>
              <Text size='sm' c='dimmed'>
                Đề xuất hành động dựa trên dữ liệu realtime
              </Text>
            </Box>

            <Button variant='light' leftSection={<IconSparkles size={16} />} onClick={createStrategyHandler.open}>
              Tạo chiến lược mới
            </Button>
          </Group>

          <SimpleGrid cols={{ base: 1, md: 3 }}>
            {recommendations.map(item => (
              <Card key={item.title} withBorder radius='xl' p='lg'>
                <Group justify='space-between' mb='sm'>
                  <Avatar color='blue' radius='xl'>
                    <IconRobot size={20} />
                  </Avatar>

                  <Badge
                    color={item.impact === 'Cao' ? 'red' : 'yellow'}
                    variant='light'
                    className={`${item.impact === 'Cao' ? 'border-red-600' : 'border-yellow-600'} py-3`}
                  >
                    Impact {item.impact}
                  </Badge>
                </Group>

                <Title order={5}>{item.title}</Title>

                <Text size='sm' c='dimmed' mt={8}>
                  {item.desc}
                </Text>

                <Divider my='md' />

                <Button
                  fullWidth
                  variant='default'
                  onClick={() => {
                    setSelectedRecommendation(item);
                    recommendationHandler.open();
                  }}
                >
                  Xem chiến lược
                </Button>
              </Card>
            ))}
          </SimpleGrid>
        </Paper>
      </Box>

      <Modal
        opened={recommendOpened}
        onClose={recommendHandler.close}
        size='xl'
        radius='xl'
        title={
          <Group gap='sm'>
            <ThemeIcon color='blue' radius='xl' variant='light'>
              <IconRobot size={20} />
            </ThemeIcon>
            <Box>
              <Title order={4}>Đề xuất hành động từ AI</Title>
              <Text size='sm' c='dimmed'>
                Các hành động nên ưu tiên dựa trên dữ liệu realtime
              </Text>
            </Box>
          </Group>
        }
      >
        <Stack gap='md'>
          <Card withBorder radius='lg' p='md'>
            <Group justify='space-between' mb='xs'>
              <Title order={5}>1. Đẩy Combo Gia Đình lên hero banner</Title>
              <Badge color='red' variant='light'>
                Ưu tiên cao
              </Badge>
            </Group>

            <Text size='sm' c='dimmed'>
              Sản phẩm này đang tăng 38% trong 2 giờ gần nhất. Nên đưa lên vị trí nổi bật ở homepage và section món bán
              chạy.
            </Text>

            <List mt='md' spacing='xs' size='sm'>
              <List.Item icon={<IconCheck size={16} />}>Gắn badge “Đang bán chạy”</List.Item>
              <List.Item icon={<IconCheck size={16} />}>Hiển thị ở vị trí đầu danh sách sản phẩm</List.Item>
              <List.Item icon={<IconCheck size={16} />}>Tạo combo upsell kèm nước uống</List.Item>
            </List>
          </Card>

          <Card withBorder radius='lg' p='md'>
            <Group justify='space-between' mb='xs'>
              <Title order={5}>2. Tăng năng lực xử lý đơn 11:00 - 13:00</Title>
              <Badge color='orange' variant='light'>
                Vận hành
              </Badge>
            </Group>

            <Text size='sm' c='dimmed'>
              Heatmap cho thấy khung trưa là thời điểm có áp lực đơn hàng cao nhất. Nếu không tối ưu, khả năng huỷ đơn
              và giao trễ sẽ tăng.
            </Text>

            <Progress mt='md' value={84} radius='xl' />
          </Card>

          <Card withBorder radius='lg' p='md'>
            <Group justify='space-between' mb='xs'>
              <Title order={5}>3. Kích hoạt voucher chống bỏ giỏ hàng</Title>
              <Badge color='yellow' variant='light'>
                Conversion
              </Badge>
            </Group>

            <Text size='sm' c='dimmed'>
              Có 31% khách dừng ở bước checkout. Có thể tạo voucher nhỏ trong 15 phút để kéo khách hoàn tất đơn.
            </Text>
          </Card>

          <Group justify='flex-end'>
            <Button variant='default' onClick={recommendHandler.close}>
              Đóng
            </Button>
            <Button leftSection={<IconSparkles size={16} />}>Áp dụng chiến lược</Button>
          </Group>
        </Stack>
      </Modal>

      <Modal
        opened={rawDataOpened}
        onClose={rawDataHandler.close}
        size='xl'
        radius='xl'
        title={
          <Group gap='sm'>
            <ThemeIcon color='gray' radius='xl' variant='light'>
              <IconDatabase size={20} />
            </ThemeIcon>
            <Box>
              <Title order={4}>Dữ liệu gốc phân tích</Title>
              <Text size='sm' c='dimmed'>
                Dữ liệu realtime được dùng để tạo insight
              </Text>
            </Box>
          </Group>
        }
      >
        <Stack>
          <SimpleGrid cols={{ base: 1, sm: 3 }}>
            <Card withBorder radius='lg'>
              <Text size='sm' c='dimmed'>
                Tổng đơn khung trưa
              </Text>
              <Title order={3}>186</Title>
            </Card>

            <Card withBorder radius='lg'>
              <Text size='sm' c='dimmed'>
                Tăng trưởng
              </Text>
              <Title order={3}>+34%</Title>
            </Card>

            <Card withBorder radius='lg'>
              <Text size='sm' c='dimmed'>
                Độ tin cậy
              </Text>
              <Title order={3}>84%</Title>
            </Card>
          </SimpleGrid>

          <ScrollArea>
            <Table striped highlightOnHover verticalSpacing='sm'>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Khung giờ</Table.Th>
                  <Table.Th>Doanh thu</Table.Th>
                  <Table.Th>Người dùng</Table.Th>
                  <Table.Th>Ghi chú</Table.Th>
                </Table.Tr>
              </Table.Thead>

              <Table.Tbody>
                {revenueRealtime.map(item => (
                  <Table.Tr key={item.time}>
                    <Table.Td>{item.time}</Table.Td>
                    <Table.Td>{formatPriceLocaleVi(item.revenue)}</Table.Td>
                    <Table.Td>{item.users}</Table.Td>
                    <Table.Td>
                      <Badge variant='light' color={item.users > 100 ? 'red' : 'blue'}>
                        {item.users > 100 ? 'Cao điểm' : 'Ổn định'}
                      </Badge>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </ScrollArea>

          <Card withBorder radius='lg' p='md'>
            <Group mb='xs'>
              <IconChartDots size={18} />
              <Text fw={700}>Logic phân tích</Text>
            </Group>

            <Text size='sm' c='dimmed'>
              Insight được tạo khi doanh thu, số user online và số đơn checkout cùng tăng vượt ngưỡng trung bình 7 ngày
              gần nhất. Confidence càng cao khi các tín hiệu tăng đồng thời trong nhiều khung giờ liên tiếp.
            </Text>
          </Card>

          <Group justify='flex-end'>
            <Button variant='default' onClick={rawDataHandler.close}>
              Đóng
            </Button>
          </Group>
        </Stack>
      </Modal>
      <Modal
        opened={recommendationOpened}
        onClose={recommendationHandler.close}
        size='70%'
        radius='xl'
        title={
          <Group gap='sm'>
            <ThemeIcon radius='xl' color='blue' variant='light'>
              <IconRocket size={20} />
            </ThemeIcon>

            <Box>
              <Title order={4}>AI Strategy Execution Center</Title>

              <Text size='sm' c='dimmed'>
                Chi tiết chiến lược được AI đề xuất
              </Text>
            </Box>
          </Group>
        }
      >
        {selectedRecommendation && (
          <Stack gap='lg'>
            <Paper radius='xl' p='lg' className='border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50'>
              <Group justify='space-between'>
                <Stack gap={4}>
                  <Group>
                    <Title order={3}>{selectedRecommendation.title}</Title>

                    <Badge color={selectedRecommendation.impact === 'Cao' ? 'red' : 'yellow'} variant='light'>
                      Impact {selectedRecommendation.impact}
                    </Badge>
                  </Group>

                  <Text c='dimmed'>{selectedRecommendation.desc}</Text>
                </Stack>

                <RingProgress
                  size={130}
                  thickness={12}
                  sections={[
                    {
                      value: selectedRecommendation.confidence,
                      color: 'blue'
                    }
                  ]}
                  label={
                    <Stack gap={0} align='center'>
                      <Title order={3}>{selectedRecommendation.confidence}%</Title>

                      <Text size='xs'>Confidence</Text>
                    </Stack>
                  }
                />
              </Group>
            </Paper>

            <SimpleGrid cols={{ base: 1, md: 3 }}>
              <Card withBorder radius='xl'>
                <Group justify='space-between'>
                  <Text size='sm' c='dimmed'>
                    Expected Impact
                  </Text>

                  <ThemeIcon color='green' variant='light'>
                    <IconTrendingUp size={18} />
                  </ThemeIcon>
                </Group>

                <Title order={2} mt='md'>
                  {selectedRecommendation.expectedRevenue}
                </Title>
              </Card>

              <Card withBorder radius='xl'>
                <Group justify='space-between'>
                  <Text size='sm' c='dimmed'>
                    Estimated Risk
                  </Text>

                  <ThemeIcon color='yellow' variant='light'>
                    <IconAlertTriangle size={18} />
                  </ThemeIcon>
                </Group>

                <Title order={2} mt='md'>
                  Low
                </Title>
              </Card>

              <Card withBorder radius='xl'>
                <Group justify='space-between'>
                  <Text size='sm' c='dimmed'>
                    Execution Time
                  </Text>

                  <ThemeIcon color='violet' variant='light'>
                    <IconBolt size={18} />
                  </ThemeIcon>
                </Group>

                <Title order={2} mt='md'>
                  15m
                </Title>
              </Card>
            </SimpleGrid>

            <Tabs defaultValue='steps'>
              <Tabs.List>
                <Tabs.Tab value='steps'>Execution Steps</Tabs.Tab>

                <Tabs.Tab value='simulation'>Simulation</Tabs.Tab>

                <Tabs.Tab value='config'>AI Config</Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value='steps' pt='md'>
                <Stepper active={1} orientation='vertical'>
                  {selectedRecommendation.actions.map((action: string) => (
                    <Stepper.Step key={action} label={action} description='AI generated action' />
                  ))}

                  <Stepper.Completed>Ready to deploy</Stepper.Completed>
                </Stepper>
              </Tabs.Panel>

              <Tabs.Panel value='simulation' pt='md'>
                <Paper withBorder radius='xl' p='lg'>
                  <Group justify='space-between' mb='md'>
                    <Text fw={700}>Predicted Conversion Growth</Text>

                    <Badge color='green'>+18%</Badge>
                  </Group>

                  <LineChart
                    h={260}
                    data={[
                      {
                        day: 'Mon',
                        current: 12,
                        predicted: 12
                      },
                      {
                        day: 'Tue',
                        current: 14,
                        predicted: 16
                      },
                      {
                        day: 'Wed',
                        current: 15,
                        predicted: 19
                      },
                      {
                        day: 'Thu',
                        current: 16,
                        predicted: 23
                      },
                      {
                        day: 'Fri',
                        current: 18,
                        predicted: 28
                      }
                    ]}
                    dataKey='day'
                    series={[
                      {
                        name: 'current',
                        color: 'gray.5',
                        label: 'Current'
                      },
                      {
                        name: 'predicted',
                        color: 'blue.6',
                        label: 'Predicted'
                      }
                    ]}
                  />
                </Paper>
              </Tabs.Panel>

              <Tabs.Panel value='config' pt='md'>
                <Accordion radius='xl'>
                  <Accordion.Item value='logic'>
                    <Accordion.Control>Recommendation Logic</Accordion.Control>

                    <Accordion.Panel>
                      <Text size='sm' c='dimmed'>
                        AI detects trend spikes based on:
                      </Text>

                      <List mt='sm' spacing='xs'>
                        <List.Item>Revenue velocity</List.Item>

                        <List.Item>Checkout conversion rate</List.Item>

                        <List.Item>Session duration</List.Item>

                        <List.Item>Product interaction score</List.Item>
                      </List>
                    </Accordion.Panel>
                  </Accordion.Item>

                  <Accordion.Item value='json'>
                    <Accordion.Control>Raw AI Config</Accordion.Control>

                    <Accordion.Panel>
                      <JsonInput
                        autosize
                        minRows={10}
                        formatOnBlur
                        defaultValue={JSON.stringify(
                          {
                            trigger_threshold: 0.78,
                            confidence: selectedRecommendation.confidence,
                            strategy: selectedRecommendation.title,
                            realtime: true,
                            rollout: 'instant'
                          },
                          null,
                          2
                        )}
                      />
                    </Accordion.Panel>
                  </Accordion.Item>
                </Accordion>
              </Tabs.Panel>
            </Tabs>

            <Paper withBorder radius='xl' p='md' className='bg-gray-50'>
              <Group justify='space-between'>
                <Group>
                  <ThemeIcon color='blue' variant='light'>
                    <IconBrain size={18} />
                  </ThemeIcon>

                  <Box>
                    <Text fw={700}>AI Recommendation Engine</Text>

                    <Text size='sm' c='dimmed'>
                      Last updated 12 seconds ago
                    </Text>
                  </Box>
                </Group>

                <Group>
                  <Button variant='default'>Save Draft</Button>

                  <Button leftSection={<IconTarget size={18} />}>Execute Strategy</Button>
                </Group>
              </Group>
            </Paper>
          </Stack>
        )}
      </Modal>
      <Modal
        opened={createStrategyOpened}
        onClose={createStrategyHandler.close}
        size='70%'
        radius='xl'
        title={
          <Group gap='sm'>
            <ThemeIcon color='violet' radius='xl' variant='light'>
              <IconWand size={20} />
            </ThemeIcon>

            <Box>
              <Title order={4}>AI Strategy Generator</Title>
              <Text size='sm' c='dimmed'>
                Tạo chiến lược mới dựa trên mục tiêu kinh doanh
              </Text>
            </Box>
          </Group>
        }
      >
        <Grid>
          <Grid.Col span={{ base: 12, md: 7 }}>
            <Stack>
              <Paper withBorder radius='xl' p='lg'>
                <Title order={5} mb='md'>
                  Cấu hình mục tiêu
                </Title>

                <Stack>
                  <Textarea
                    label='Mục tiêu'
                    placeholder='Ví dụ: Tăng doanh thu khung trưa, giảm bỏ giỏ hàng, đẩy món mới...'
                    minRows={4}
                  />

                  <MultiSelect
                    label='Nguồn dữ liệu phân tích'
                    placeholder='Chọn nguồn dữ liệu'
                    defaultValue={['orders', 'customers', 'products']}
                    data={[
                      { value: 'orders', label: 'Đơn hàng' },
                      { value: 'customers', label: 'Khách hàng' },
                      { value: 'products', label: 'Sản phẩm' },
                      { value: 'inventory', label: 'Tồn kho' },
                      { value: 'campaigns', label: 'Chiến dịch' },
                      { value: 'channels', label: 'Kênh bán' }
                    ]}
                  />

                  <SimpleGrid cols={{ base: 1, sm: 2 }}>
                    <Select
                      label='Mức độ ưu tiên'
                      defaultValue='growth'
                      data={[
                        { value: 'growth', label: 'Tăng trưởng' },
                        { value: 'profit', label: 'Tối ưu lợi nhuận' },
                        { value: 'retention', label: 'Giữ chân khách hàng' },
                        { value: 'operation', label: 'Tối ưu vận hành' }
                      ]}
                    />

                    <Select
                      label='Thời gian triển khai'
                      defaultValue='today'
                      data={[
                        { value: 'today', label: 'Trong hôm nay' },
                        { value: '3days', label: '3 ngày tới' },
                        { value: '7days', label: '7 ngày tới' },
                        { value: '30days', label: '30 ngày tới' }
                      ]}
                    />

                    <NumberInput
                      label='Ngân sách tối đa'
                      placeholder='Ví dụ: 500000'
                      min={0}
                      thousandSeparator=','
                      suffix=' đ'
                    />

                    <Select
                      label='Kênh áp dụng'
                      defaultValue='website'
                      data={[
                        { value: 'website', label: 'Website' },
                        { value: 'mobile', label: 'Mobile app' },
                        { value: 'shopeefood', label: 'ShopeeFood' },
                        { value: 'grabfood', label: 'GrabFood' },
                        { value: '_all', label: 'Tất cả kênh' }
                      ]}
                    />
                  </SimpleGrid>

                  <Switch
                    label='Cho phép AI tự tối ưu sau khi triển khai'
                    description='AI có thể điều chỉnh mức ưu tiên sản phẩm, voucher hoặc banner theo dữ liệu realtime'
                    defaultChecked
                  />
                </Stack>
              </Paper>

              <Group justify='flex-end'>
                <Button variant='default' onClick={createStrategyHandler.close}>
                  Huỷ
                </Button>

                <Button leftSection={<IconPlus size={16} />}>Tạo chiến lược</Button>
              </Group>
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 5 }}>
            <Stack>
              <Paper
                radius='xl'
                p='lg'
                className='border border-violet-200 bg-gradient-to-br from-violet-50 via-white to-blue-50'
              >
                <Group mb='md'>
                  <ThemeIcon color='violet' radius='xl' variant='light'>
                    <IconBrain size={20} />
                  </ThemeIcon>

                  <Box>
                    <Title order={5}>AI Preview</Title>
                    <Text size='sm' c='dimmed'>
                      Mô phỏng chiến lược có thể được tạo
                    </Text>
                  </Box>
                </Group>

                <Stack>
                  <Card withBorder radius='lg'>
                    <Badge mb='sm' color='violet' variant='light'>
                      Suggested strategy
                    </Badge>

                    <Title order={5}>Tối ưu doanh thu khung trưa</Title>

                    <Text size='sm' c='dimmed' mt={6}>
                      AI sẽ phân tích sản phẩm bán chạy, áp lực đơn hàng, tỉ lệ checkout và tồn kho để tạo kế hoạch tăng
                      doanh thu.
                    </Text>
                  </Card>

                  <Card withBorder radius='lg'>
                    <Text size='sm' c='dimmed'>
                      Expected impact
                    </Text>

                    <Title order={3} c='green'>
                      +12% - 18%
                    </Title>

                    <Text size='xs' c='dimmed'>
                      Dự kiến tăng conversion nếu áp dụng đúng khung giờ
                    </Text>
                  </Card>

                  <Card withBorder radius='lg'>
                    <Text size='sm' c='dimmed' mb='sm'>
                      Strategy components
                    </Text>

                    <Stack gap={8}>
                      {[
                        'Tự động chọn sản phẩm nên đẩy',
                        'Đề xuất voucher phù hợp',
                        'Dự đoán rủi ro quá tải bếp',
                        'Theo dõi hiệu quả realtime'
                      ].map(item => (
                        <Group key={item} gap={8}>
                          <ThemeIcon size={22} radius='xl' color='green' variant='light'>
                            <IconCheck size={14} />
                          </ThemeIcon>

                          <Text size='sm'>{item}</Text>
                        </Group>
                      ))}
                    </Stack>
                  </Card>
                </Stack>
              </Paper>
            </Stack>
          </Grid.Col>
        </Grid>
      </Modal>
    </>
  );
}
