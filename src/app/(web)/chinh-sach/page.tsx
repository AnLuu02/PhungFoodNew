import { Alert, Badge, Box, Card, Container, Divider, Group, List, ListItem, Stack, Text, Title } from '@mantine/core';
import { IconAlertTriangle, IconClock, IconInfoCircle, IconShield } from '@tabler/icons-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chính sách an toàn thực phẩm - Phụng Food',
  description:
    'Chính sách an toàn thực phẩm của Phụng Food, bao gồm tiêu chuẩn an toàn, quản lý dị ứng, chất lượng món ăn và hướng dẫn khách hàng.'
};

export default function RestaurantPolicyPage() {
  return (
    <Box className='min-h-screen bg-gradient-to-br from-orange-50 to-red-50'>
      <Container size='lg' className='py-12'>
        {/* Header */}
        <div className='mb-12 text-center'>
          <Title order={1} className='mb-4 text-4xl font-bold text-gray-800'>
            Chính Sách An Toàn Thực Phẩm
          </Title>
          <Text size='lg' className='mx-auto max-w-2xl text-gray-600'>
            Cam kết của chúng tôi về an toàn thực phẩm, chất lượng món ăn và sự hài lòng của khách hàng. Vui lòng xem kỹ
            các chính sách liên quan đến chế biến món ăn, dị ứng thực phẩm và quy định dùng bữa.
          </Text>
        </div>

        {/* Cảnh báo quan trọng */}
        <Alert icon={<IconAlertTriangle size='1rem' />} title='Lưu ý quan trọng' color='orange' className='mb-8'>
          <Text size='sm'>
            Nếu bạn có dị ứng thực phẩm hoặc yêu cầu ăn kiêng, vui lòng thông báo cho nhân viên trước khi gọi món. Chúng
            tôi luôn đặt sự an toàn thực phẩm lên hàng đầu và sẽ cố gắng hết sức để đáp ứng nhu cầu của bạn.
          </Text>
        </Alert>

        <div className='grid gap-8'>
          {/* An toàn thực phẩm & Vệ sinh */}
          <Card shadow='sm' padding='xl' radius='md' className='border border-gray-200'>
            <Group align='flex-start' className='mb-4'>
              <IconShield size={24} className='mt-1 text-mainColor' />
              <div>
                <Title order={2} className='mb-2 text-2xl font-semibold text-gray-800'>
                  Tiêu chuẩn An toàn & Vệ sinh
                </Title>
                <Badge color='green' variant='light' className='mb-4'>
                  Đạt chứng nhận HACCP
                </Badge>
              </div>
            </Group>

            <Stack gap='md'>
              <Text className='text-gray-700'>
                Chúng tôi duy trì các tiêu chuẩn cao nhất về an toàn thực phẩm và vệ sinh theo quy định của địa phương
                và nguyên tắc HACCP.
              </Text>

              <List spacing='sm' className='text-gray-700'>
                <ListItem>Chế biến món ăn trong môi trường sạch sẽ, khử khuẩn</ListItem>
                <ListItem>Nhân viên được đào tạo thường xuyên và kiểm tra sức khỏe định kỳ</ListItem>
                <ListItem>Kiểm soát nhiệt độ trong quá trình bảo quản và chế biến</ListItem>
                <ListItem>Nguyên liệu tươi mới được nhập hàng ngày từ nhà cung cấp uy tín</ListItem>
                <ListItem>Vệ sinh thiết bị và bề mặt sau mỗi lần sử dụng</ListItem>
                <ListItem>Tuân thủ quy trình vệ sinh tay và trang bị bảo hộ cá nhân nghiêm ngặt</ListItem>
              </List>
            </Stack>
          </Card>

          {/* Dị ứng & Ăn kiêng */}
          <Card shadow='sm' padding='xl' radius='md' className='border border-gray-200'>
            <Group align='flex-start' className='mb-4'>
              <IconAlertTriangle size={24} className='mt-1 text-red-600' />
              <Title order={2} className='text-2xl font-semibold text-gray-800'>
                Dị ứng thực phẩm & Yêu cầu ăn kiêng
              </Title>
            </Group>

            <Stack gap='md'>
              <Text className='text-gray-700'>
                Chúng tôi hiểu tầm quan trọng của việc quản lý dị ứng thực phẩm và luôn cẩn trọng để tránh tình trạng
                nhiễm chéo.
              </Text>

              <div className='grid gap-6 md:grid-cols-2'>
                <div>
                  <Text fw={600} className='mb-2 text-gray-800'>
                    Các loại dị ứng phổ biến:
                  </Text>
                  <List spacing='xs' className='text-gray-700'>
                    <ListItem>Gluten (Lúa mì, Lúa mạch, Lúa mạch đen)</ListItem>
                    <ListItem>Sản phẩm từ sữa</ListItem>
                    <ListItem>Trứng</ListItem>
                    <ListItem>Hạt (hạt cây, đậu phộng)</ListItem>
                    <ListItem>Hải sản & Cá</ListItem>
                    <ListItem>Đậu nành</ListItem>
                    <ListItem>Hạt mè</ListItem>
                  </List>
                </div>

                <div>
                  <Text fw={600} className='mb-2 text-gray-800'>
                    Cam kết của chúng tôi:
                  </Text>
                  <List spacing='xs' className='text-gray-700'>
                    <ListItem>Khu vực chế biến riêng cho món không chứa dị ứng</ListItem>
                    <ListItem>Dụng cụ riêng biệt khi có thể</ListItem>
                    <ListItem>Ghi nhãn rõ ràng thông tin dị ứng trên thực đơn</ListItem>
                    <ListItem>Đào tạo nhân viên về nhận biết và xử lý dị ứng</ListItem>
                    <ListItem>Cung cấp danh sách nguyên liệu chi tiết theo yêu cầu</ListItem>
                  </List>
                </div>
              </div>

              <Alert icon={<IconInfoCircle size='1rem' />} color='blue' className='mt-4'>
                <Text size='sm'>
                  <strong>Lưu ý:</strong> Dù đã cẩn thận hết mức, chúng tôi không thể đảm bảo 100% không có nhiễm chéo.
                  Quý khách có dị ứng nghiêm trọng nên cẩn trọng và thông báo kỹ cho nhân viên.
                </Text>
              </Alert>
            </Stack>
          </Card>

          {/* Chất lượng & tươi mới */}
          <Card shadow='sm' padding='xl' radius='md' className='border border-gray-200'>
            <Group align='flex-start' className='mb-4'>
              <IconClock size={24} className='mt-1 text-blue-600' />
              <Title order={2} className='text-2xl font-semibold text-gray-800'>
                Tiêu chuẩn chất lượng & độ tươi mới
              </Title>
            </Group>

            <Stack gap='md'>
              <Text className='text-gray-700'>
                Chúng tôi cam kết phục vụ thực phẩm tươi ngon, chất lượng cao nhất đến với khách hàng.
              </Text>

              <div className='grid gap-6 md:grid-cols-2'>
                <div>
                  <Text fw={600} className='mb-2 text-gray-800'>
                    Nguồn nguyên liệu:
                  </Text>
                  <List spacing='xs' className='text-gray-700'>
                    <ListItem>Ưu tiên nhà cung cấp địa phương</ListItem>
                    <ListItem>Có lựa chọn rau củ hữu cơ</ListItem>
                    <ListItem>Hải sản tươi được giao hàng ngày</ListItem>
                    <ListItem>Thịt cao cấp từ nhà cung cấp uy tín</ListItem>
                    <ListItem>Thực đơn thay đổi theo mùa để đảm bảo tươi mới</ListItem>
                  </List>
                </div>

                <div>
                  <Text fw={600} className='mb-2 text-gray-800'>
                    Quy trình chế biến:
                  </Text>
                  <List spacing='xs' className='text-gray-700'>
                    <ListItem>Chế biến món theo yêu cầu nếu có thể</ListItem>
                    <ListItem>Tuân thủ nhiệt độ bảo quản thực phẩm</ListItem>
                    <ListItem>Xoay vòng nguyên liệu theo nguyên tắc "nhập trước - dùng trước"</ListItem>
                    <ListItem>Kiểm tra chất lượng thường xuyên</ListItem>
                    <ListItem>Không giữ thức ăn quá thời gian an toàn</ListItem>
                  </List>
                </div>
              </div>
            </Stack>
          </Card>

          {/* Hướng dẫn khách hàng */}
          <Card shadow='sm' padding='xl' radius='md' className='border border-gray-200'>
            <Title order={2} className='mb-4 text-2xl font-semibold text-gray-800'>
              Hướng Dẫn & Trách Nhiệm Khách Hàng
            </Title>

            <Stack gap='md'>
              <div>
                <Text fw={600} className='mb-2 text-gray-800'>
                  Trước khi gọi món:
                </Text>
                <List spacing='xs' className='text-gray-700'>
                  <ListItem>Thông báo dị ứng hoặc yêu cầu ăn kiêng</ListItem>
                  <ListItem>Hỏi kỹ về nguyên liệu nếu cần</ListItem>
                  <ListItem>Tham khảo bảng thông tin dị ứng</ListItem>
                  <ListItem>Yêu cầu cách chế biến (mức độ chín, cay,...)</ListItem>
                </List>
              </div>

              <div>
                <Text fw={600} className='mb-2 text-gray-800'>
                  An toàn thực phẩm cho khách hàng:
                </Text>
                <List spacing='xs' className='text-gray-700'>
                  <ListItem>Dùng món ngay sau khi phục vụ</ListItem>
                  <ListItem>Báo ngay với nhân viên nếu phát hiện vấn đề</ListItem>
                  <ListItem>Giữ vệ sinh khi dùng món dùng chung</ListItem>
                  <ListItem>Làm theo hướng dẫn bảo quản nếu có</ListItem>
                </List>
              </div>

              <div>
                <Text fw={600} className='mb-2 text-gray-800'>
                  Món mang đi & giao hàng:
                </Text>
                <List spacing='xs' className='text-gray-700'>
                  <ListItem>Dùng món trong vòng 2 tiếng sau khi nhận</ListItem>
                  <ListItem>Bảo quản lạnh nếu chưa dùng ngay</ListItem>
                  <ListItem>Hâm nóng đủ nhiệt trước khi dùng lại</ListItem>
                  <ListItem>Kiểm tra nhiệt độ món khi nhận hàng</ListItem>
                </List>
              </div>
            </Stack>
          </Card>

          {/* Liên hệ & Khiếu nại */}
          <Card shadow='sm' padding='xl' radius='md' className='border border-gray-200 bg-gray-50'>
            <Title order={2} className='mb-4 text-2xl font-semibold text-gray-800'>
              Liên Hệ & Khiếu Nại An Toàn Thực Phẩm
            </Title>

            <Stack gap='md'>
              <Text className='text-gray-700'>
                Chúng tôi trân trọng mọi phản hồi và cam kết xử lý nghiêm túc các vấn đề liên quan đến an toàn thực
                phẩm. Nếu bạn có câu hỏi hoặc khiếu nại, vui lòng liên hệ với chúng tôi ngay.
              </Text>

              <div className='grid gap-6 md:grid-cols-2'>
                <div>
                  <Text fw={600} className='mb-2 text-gray-800'>
                    Quản lý nhà hàng:
                  </Text>
                  <Text className='text-gray-700'>Điện thoại: (555) 123-4567</Text>
                  <Text className='text-gray-700'>Email: manager@restaurant.com</Text>
                </div>

                <div>
                  <Text fw={600} className='mb-2 text-gray-800'>
                    Nhân viên phụ trách an toàn thực phẩm:
                  </Text>
                  <Text className='text-gray-700'>Điện thoại: (555) 123-4568</Text>
                  <Text className='text-gray-700'>Email: safety@restaurant.com</Text>
                </div>
              </div>

              <Divider className='my-4' />

              <Text size='sm' className='text-gray-600'>
                <strong>Trường hợp khẩn cấp:</strong> Nếu bạn có dấu hiệu ngộ độc thực phẩm có liên quan đến nhà hàng,
                vui lòng liên hệ ngay và tìm kiếm sự hỗ trợ y tế. Chúng tôi sẽ phối hợp đầy đủ với cơ quan y tế nếu có
                điều tra.
              </Text>
            </Stack>
          </Card>
        </div>

        {/* Footer */}
        <div className='mt-12 border-t border-gray-200 pt-8 text-center'>
          <Text size='sm' className='text-gray-600'>
            Chính sách này được cập nhật lần cuối vào tháng 1 năm 2025. Chúng tôi có quyền thay đổi chính sách để duy
            trì tiêu chuẩn cao nhất về an toàn và chất lượng thực phẩm.
          </Text>
          <Text size='sm' className='mt-2 text-gray-600'>
            Để xem phiên bản mới nhất, vui lòng truy cập website của chúng tôi hoặc hỏi nhân viên nhà hàng.
          </Text>
        </div>
      </Container>
    </Box>
  );
}
