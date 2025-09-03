'use client';
import {
  Alert,
  Anchor,
  Box,
  Card,
  Divider,
  Grid,
  Group,
  List,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title
} from '@mantine/core';
import {
  IconAlertTriangle,
  IconChevronRight,
  IconCreditCard,
  IconGift,
  IconInfoCircle,
  IconPhone,
  IconShield,
  IconTruck
} from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';

const MAIN_YELLOW = '#f8c144';
const MAIN_GREEN = '#008b4b';

const sections: { id: string; label: string; icon: JSX.Element }[] = [
  { id: 'general', label: 'Chính sách chung', icon: <IconShield size={18} color={MAIN_GREEN} /> },
  { id: 'payment', label: 'Phương thức thanh toán', icon: <IconCreditCard size={18} color={MAIN_GREEN} /> },
  { id: 'delivery', label: 'Chính sách giao hàng', icon: <IconTruck size={18} color={MAIN_GREEN} /> },
  { id: 'order-guide', label: 'Hướng dẫn đặt món', icon: <IconGift size={18} color={MAIN_GREEN} /> },
  { id: 'support', label: 'Hỗ trợ & liên hệ', icon: <IconPhone size={18} color={MAIN_GREEN} /> },
  { id: 'promotion', label: 'Chính sách khuyến mãi', icon: <IconGift size={18} color={MAIN_GREEN} /> },
  { id: 'security', label: 'Bảo mật & điều khoản', icon: <IconInfoCircle size={18} color={MAIN_GREEN} /> }
];

export default function StorePolicyPage() {
  const [activeSection, setActiveSection] = useState(sections[0]?.id);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const handleNavClick = (id: string) => {
    setActiveSection(id);
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + 120;
      let current = sections[0]?.id;
      for (const sec of sections) {
        const ref = sectionRefs.current[sec.id];
        if (ref && ref.offsetTop <= scrollY) {
          current = sec.id;
        }
      }
      setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Box className='min-h-screen'>
      <Title order={1} ta='center' fw={900} c={MAIN_GREEN} mb={24} size={36}>
        Chính Sách & Hỗ Trợ Khách Hàng
      </Title>
      <Text ta='center' c={'dimmed'} size='lg' mb={32}>
        Tìm hiểu các chính sách về thanh toán, giao hàng, đặt món, khuyến mãi và hỗ trợ khách hàng của Phụng Food.
      </Text>
      <Grid gutter={32}>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Paper withBorder radius={'md'} shadow='md' p={'md'} pos={'sticky'} top={80} className='z-[10]'>
            <Stack gap={0}>
              {sections.map(sec => (
                <Anchor
                  key={sec.id}
                  onClick={() => handleNavClick(sec.id)}
                  px={16}
                  className={`${
                    activeSection === sec.id
                      ? 'font-bold text-mainColor'
                      : 'bg-transparent font-medium text-black dark:text-white'
                  } flex cursor-pointer items-center gap-2.5 rounded-md py-3 transition-colors`}
                  style={{
                    backgroundColor: activeSection === sec.id ? `${MAIN_YELLOW}22` : 'transparent'
                  }}
                >
                  {sec.icon}
                  {sec.label}
                  {activeSection === sec.id && <IconChevronRight size={16} color={MAIN_YELLOW} className='ml-auto' />}
                </Anchor>
              ))}
            </Stack>
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 8 }}>
          <Box
            className='scroll-mt-[80px]'
            ref={el => {
              sectionRefs.current['general'] = el;
            }}
            id='general'
          >
            <Card shadow='sm' radius='md' p={32} withBorder mb={32}>
              <Group mb={8}>
                <ThemeIcon color={MAIN_GREEN} size='lg' radius='xl'>
                  <IconShield size={24} />
                </ThemeIcon>
                <Title order={2} size={24} fw={700} c={MAIN_GREEN}>
                  Chính sách chung
                </Title>
              </Group>
              <Text size='sm' mb={12}>
                Phụng Food cam kết cung cấp sản phẩm chất lượng, an toàn thực phẩm và dịch vụ tận tâm. Mọi quy trình chế
                biến, bảo quản và phục vụ đều tuân thủ tiêu chuẩn HACCP, ISO 22000 và VietGAP.
              </Text>
              <List spacing='xs' size='sm'>
                <List.Item>Nguyên liệu tươi mới, nguồn gốc rõ ràng, kiểm tra định kỳ</List.Item>
                <List.Item>Chế biến trong môi trường sạch sẽ, khử khuẩn, kiểm soát nhiệt độ</List.Item>
                <List.Item>
                  Nhân viên được đào tạo định kỳ về vệ sinh, an toàn thực phẩm và xử lý tình huống khẩn cấp
                </List.Item>
                <List.Item>Chính sách đổi trả, hoàn tiền minh bạch, hỗ trợ khách hàng 24/7</List.Item>
                <List.Item>Thực đơn thay đổi theo mùa, cập nhật món mới thường xuyên</List.Item>
                <List.Item>Hỗ trợ khách hàng có nhu cầu ăn kiêng, dị ứng thực phẩm</List.Item>
              </List>
              <Alert icon={<IconInfoCircle size={18} />} color='yellow' mt={16}>
                <Text size='sm'>
                  <strong>Lưu ý:</strong> Vui lòng kiểm tra kỹ đơn hàng trước khi xác nhận. Mọi khiếu nại về chất lượng
                  cần được gửi trong vòng 24h sau khi nhận hàng. Đối với các trường hợp dị ứng thực phẩm, hãy thông báo
                  rõ với nhân viên khi đặt món.
                </Text>
              </Alert>
            </Card>
          </Box>
          <Box
            className='scroll-mt-[80px]'
            ref={el => {
              sectionRefs.current['payment'] = el;
            }}
            id='payment'
          >
            <Card shadow='sm' radius='md' p={32} withBorder mb={32}>
              <Group mb={8}>
                <ThemeIcon color={MAIN_GREEN} size='lg' radius='xl'>
                  <IconCreditCard size={24} />
                </ThemeIcon>
                <Title order={2} size={24} fw={700} c={MAIN_GREEN}>
                  Phương thức thanh toán
                </Title>
              </Group>
              <List spacing='sm' size='sm'>
                <List.Item>Tiền mặt khi nhận hàng hoặc tại quầy</List.Item>
                <List.Item>Thẻ tín dụng/ghi nợ (Visa, MasterCard, JCB)</List.Item>
                <List.Item>Ví điện tử (Momo, ZaloPay, VNPay, ShopeePay)</List.Item>
                <List.Item>Chuyển khoản ngân hàng qua số tài khoản được cung cấp</List.Item>
                <List.Item>Thanh toán qua QR code tại cửa hàng</List.Item>
                <List.Item>Hóa đơn VAT xuất theo yêu cầu</List.Item>
              </List>
              <Alert icon={<IconInfoCircle size={18} />} color='green' mt={16}>
                <Text size='sm'>
                  Tất cả giao dịch đều được mã hóa SSL 256-bit. Chúng tôi không lưu trữ thông tin thẻ của bạn. Nếu có
                  vấn đề về thanh toán, vui lòng liên hệ hotline để được hỗ trợ ngay.
                </Text>
              </Alert>
              <Divider my={16} />
              <Text size='sm'>
                <strong>Nhắc nhở:</strong> Kiểm tra kỹ thông tin trước khi xác nhận thanh toán. Đối với các giao dịch
                chuyển khoản, vui lòng ghi rõ nội dung và giữ lại biên lai.
              </Text>
            </Card>
          </Box>
          <Box
            className='scroll-mt-[80px]'
            ref={el => {
              sectionRefs.current['delivery'] = el;
            }}
            id='delivery'
          >
            <Card shadow='sm' radius='md' p={32} withBorder mb={32}>
              <Group mb={8}>
                <ThemeIcon color={MAIN_GREEN} size='lg' radius='xl'>
                  <IconTruck size={24} />
                </ThemeIcon>
                <Title order={2} size={24} fw={700} c={MAIN_GREEN}>
                  Chính sách giao hàng
                </Title>
              </Group>
              <List spacing='sm' size='sm'>
                <List.Item>Giao hàng trong vòng 30-45 phút trong bán kính 15km</List.Item>
                <List.Item>Phí giao hàng: 70.000đ (miễn phí cho đơn từ 800.000đ)</List.Item>
                <List.Item>Giao hàng nhanh: 120.000đ (20-30 phút, tùy khu vực)</List.Item>
                <List.Item>Thời gian giao hàng: 9:00 - 21:30 hàng ngày, trừ ngày lễ</List.Item>
                <List.Item>Kiểm tra món ăn khi nhận, báo ngay nếu có vấn đề về chất lượng hoặc số lượng</List.Item>
                <List.Item>Hỗ trợ đổi/trả món nếu phát hiện lỗi hoặc không đúng đơn hàng</List.Item>
                <List.Item>Đơn hàng tối thiểu cho giao hàng: 350.000đ</List.Item>
              </List>
              <Alert icon={<IconAlertTriangle size={18} />} color='red' mt={16}>
                <Text size='sm'>
                  <strong>Cảnh báo:</strong> Nếu phát hiện món ăn không đảm bảo chất lượng, vui lòng liên hệ ngay để
                  được hỗ trợ đổi/trả hoặc hoàn tiền. Đối với các trường hợp giao hàng trễ do thời tiết hoặc sự cố,
                  chúng tôi sẽ thông báo sớm nhất có thể.
                </Text>
              </Alert>
            </Card>
          </Box>
          <Box
            className='scroll-mt-[80px]'
            ref={el => {
              sectionRefs.current['order-guide'] = el;
            }}
            id='order-guide'
          >
            <Card shadow='sm' radius='md' p={32} withBorder mb={32}>
              <Group mb={8}>
                <ThemeIcon color={MAIN_YELLOW} size='lg' radius='xl'>
                  <IconGift size={24} />
                </ThemeIcon>
                <Title order={2} size={24} fw={700} c={MAIN_GREEN}>
                  Hướng dẫn đặt món
                </Title>
              </Group>
              <List spacing='sm' size='sm'>
                <List.Item>
                  Chọn món từ menu, tùy chỉnh topping, khẩu vị và yêu cầu đặc biệt (ăn kiêng, dị ứng...)
                </List.Item>
                <List.Item>Thêm món vào giỏ hàng, kiểm tra lại đơn, cập nhật số lượng</List.Item>
                <List.Item>Áp dụng mã khuyến mãi nếu có, kiểm tra điều kiện sử dụng</List.Item>
                <List.Item>Chọn hình thức giao hàng hoặc tự lấy tại cửa hàng</List.Item>
                <List.Item>Nhập thông tin cá nhân, địa chỉ, số điện thoại chính xác</List.Item>
                <List.Item>Xác nhận và thanh toán, nhận thông báo trạng thái đơn hàng qua website/app/SMS</List.Item>
                <List.Item>Liên hệ hotline nếu cần hỗ trợ hoặc thay đổi đơn hàng trong vòng 5 phút</List.Item>
              </List>
              <Alert icon={<IconInfoCircle size={18} />} color='yellow' mt={16}>
                <Text size='sm'>
                  <strong>Nhắc nhở:</strong> Đơn hàng có thể thay đổi hoặc hủy trong vòng 5 phút sau khi đặt. Sau đó,
                  món sẽ được chuẩn bị ngay. Vui lòng kiểm tra kỹ thông tin trước khi xác nhận.
                </Text>
              </Alert>
            </Card>
          </Box>
          <Box
            className='scroll-mt-[80px]'
            ref={el => {
              sectionRefs.current['support'] = el;
            }}
            id='support'
          >
            <Card shadow='sm' radius='md' p={32} withBorder mb={32}>
              <Group mb={8}>
                <ThemeIcon color={MAIN_GREEN} size='lg' radius='xl'>
                  <IconPhone size={24} />
                </ThemeIcon>
                <Title order={2} size={24} fw={700} c={MAIN_GREEN}>
                  Hỗ trợ & liên hệ
                </Title>
              </Group>
              <Text size='sm' mb={8}>
                Nếu cần hỗ trợ, khiếu nại hoặc góp ý, vui lòng liên hệ:
              </Text>
              <List spacing='xs' size='sm'>
                <List.Item>
                  Hotline: <b className='text-mainColor'>09180646181</b> (8:00 - 22:00)
                </List.Item>
                <List.Item>
                  Email: <b className='text-mainColor'>anluu099@gmail.com</b>
                </List.Item>
                <List.Item>
                  Zalo: <b className='text-mainColor'>09180646181</b>
                </List.Item>
                <List.Item>
                  Địa chỉ: <b className='text-mainColor'>Đầu lộ Tân Thành, Cà Mau</b>
                </List.Item>
                <List.Item>
                  Fanpage:{' '}
                  <Anchor href='https://facebook.com/phungfood' target='_blank' className='text-mainColor'>
                    facebook.com/phungfood
                  </Anchor>
                </List.Item>
              </List>
              <Alert icon={<IconInfoCircle size={18} />} color='green' mt={16}>
                <Text size='sm'>
                  <strong>Lưu ý:</strong> Mọi khiếu nại về chất lượng món ăn sẽ được xử lý trong vòng 24h. Đối với các
                  trường hợp khẩn cấp về an toàn thực phẩm, hãy liên hệ ngay để được hỗ trợ kịp thời.
                </Text>
              </Alert>
            </Card>
          </Box>
          <Box
            className='scroll-mt-[80px]'
            ref={el => {
              sectionRefs.current['promotion'] = el;
            }}
            id='promotion'
          >
            <Card shadow='sm' radius='md' p={32} withBorder mb={32}>
              <Group mb={8}>
                <ThemeIcon color={MAIN_YELLOW} size='lg' radius='xl'>
                  <IconGift size={24} />
                </ThemeIcon>
                <Title order={2} size={24} fw={700} c={MAIN_GREEN}>
                  Chính sách khuyến mãi
                </Title>
              </Group>
              <List spacing='sm' size='sm'>
                <List.Item>Khuyến mãi áp dụng theo chương trình từng thời điểm, thông báo trên website/app</List.Item>
                <List.Item>Mã giảm giá không cộng dồn, chỉ áp dụng 1 mã/lần đặt</List.Item>
                <List.Item>Ưu đãi sinh viên: 10% với thẻ sinh viên hợp lệ</List.Item>
                <List.Item>Ưu đãi người cao tuổi: 15% (65+)</List.Item>
                <List.Item>Ưu đãi khách hàng mới: 20% giảm giá lần đầu</List.Item>
                <List.Item>Chương trình tích điểm, đổi quà cho khách hàng thân thiết</List.Item>
                <List.Item>Khuyến mãi đặc biệt vào các dịp lễ, sinh nhật, ngày hội</List.Item>
              </List>
              <Alert icon={<IconGift size={18} />} color='yellow' mt={16}>
                <Text size='sm'>
                  <strong>Nhắc nhở:</strong> Vui lòng kiểm tra điều kiện áp dụng trước khi sử dụng mã khuyến mãi. Một số
                  ưu đãi có giới hạn số lượng hoặc thời gian.
                </Text>
              </Alert>
            </Card>
          </Box>
          <Box
            className='scroll-mt-[80px]'
            ref={el => {
              sectionRefs.current['security'] = el;
            }}
            id='security'
          >
            <Card shadow='sm' radius='md' p={32} withBorder mb={32}>
              <Group mb={8}>
                <ThemeIcon color={MAIN_GREEN} size='lg' radius='xl'>
                  <IconInfoCircle size={24} />
                </ThemeIcon>
                <Title order={2} size={24} fw={700} c={MAIN_GREEN}>
                  Bảo mật & điều khoản
                </Title>
              </Group>
              <Text size='sm' mb={8}>
                <strong>Chính sách bảo mật:</strong> Chúng tôi cam kết bảo vệ thông tin cá nhân của khách hàng, không
                chia sẻ với bên thứ ba nếu không có sự đồng ý. Dữ liệu được lưu trữ an toàn, tuân thủ quy định pháp
                luật.
              </Text>
              <Text size='sm' mb={8}>
                <strong>Điều khoản dịch vụ:</strong> Khi đặt hàng, bạn đồng ý với điều khoản dịch vụ của chúng tôi.
                Chúng tôi có quyền thay đổi chính sách với thông báo trước. Mọi tranh chấp sẽ được giải quyết theo quy
                định pháp luật Việt Nam.
              </Text>
              <Text size='sm'>
                <strong>Trách nhiệm:</strong> Phụng Food không chịu trách nhiệm về chậm trễ do thời tiết, giao thông
                hoặc các tình huống ngoài kiểm soát. Dị ứng thực phẩm cần được thông báo rõ khi đặt hàng. Khách hàng nên
                kiểm tra kỹ thông tin trước khi xác nhận.
              </Text>
              <Alert icon={<IconAlertTriangle size={18} />} color='red' mt={16}>
                <Text size='sm'>
                  <strong>Cảnh báo:</strong> Vui lòng đọc kỹ chính sách bảo mật và điều khoản trước khi sử dụng dịch vụ.
                  Nếu có thắc mắc, hãy liên hệ bộ phận hỗ trợ để được giải đáp.
                </Text>
              </Alert>
            </Card>
          </Box>
        </Grid.Col>
      </Grid>
      <Box ta='center' py={24} c='gray.6'>
        <Divider mb={12} />
        <Text size='sm'>
          Chính sách này được cập nhật lần cuối vào tháng 1 năm 2025. Chúng tôi có quyền thay đổi để duy trì tiêu chuẩn
          cao nhất về an toàn và chất lượng thực phẩm.
        </Text>
      </Box>
    </Box>
  );
}
