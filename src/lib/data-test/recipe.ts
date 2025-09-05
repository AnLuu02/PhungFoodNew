export const recipes = [
  {
    id: 1,
    title: 'Cách làm mandu (thịt, kim chi, rau củ)',
    description: 'Mandu – bánh bao Hàn Quốc làm với nhân thịt, kim chi hoặc rau củ, dễ làm tại nhà và thơm ngon.',
    image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=I1qHVVbYG8Y', // YouTube xem được
    duration: '25 phút',
    difficulty: 'Trung bình',
    servings: '4 người',
    category: 'Món chính',
    rating: 4.8,
    views: '125K',
    prepTime: '15 phút',
    cookTime: '10 phút',
    totalTime: '25 phút',
    ingredients: {
      Chính: ['1 gói Vỏ mandu (bánh bao)', '200 g Thịt heo xay', '100 g Kim chi'],
      'Rau củ': ['1 củ Cà rốt', '1/2 củ Hành tây'],
      'Gia vị': [
        '3 tép Tỏi',
        '1 lát Gừng',
        '1 thìa cà phê Dầu mè',
        '2 thìa cà phê Nước tương',
        '1/2 thìa cà phê Muối',
        '1/4 thìa cà phê Tiêu'
      ]
    },
    instructions: [
      {
        step: 1,
        title: 'Chuẩn bị nguyên liệu',
        description: 'Rửa sạch và thái nhỏ rau củ; băm tỏi và gừng.',
        time: '5 phút',
        image: 'https://images.unsplash.com/photo-1510627498534-cf7e9002facc?auto=format&fit=crop&w=800&q=80'
      },
      {
        step: 2,
        title: 'Trộn nhân thịt',
        description: 'Trộn thịt, tỏi, gừng, nước tương, dầu mè, muối, tiêu. Ướp trong 10 phút.',
        time: '3 phút',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'
      },
      {
        step: 3,
        title: 'Gói mandu',
        description: 'Đặt nhân vào vỏ, thoa nước quanh mép, gấp lại tạo bánh hình bán nguyệt.',
        time: '8 phút',
        image: 'https://images.unsplash.com/photo-1584270354949-10b003777f99?auto=format&fit=crop&w=800&q=80'
      },
      {
        step: 4,
        title: 'Luộc hoặc chiên',
        description: 'Luộc trong 8–10 phút hoặc chiên vàng giòn. Thưởng thức nóng.',
        time: '10 phút',
        image: 'https://images.unsplash.com/photo-1624390411074-3f9a6b1238d1?auto=format&fit=crop&w=800&q=80'
      }
    ],
    tips: [
      'Không nhồi quá nhiều nhân, tránh bánh bị rách.',
      'Làm sẵn rồi cấp đông trước khi dùng.',
      'Chấm với tương ớt hoặc nước chấm Hàn Quốc sẽ ngon hơn.'
    ],
    nutrition: {
      calories: 280,
      protein: 18,
      carbs: 32,
      fat: 8,
      fiber: 3
    },
    tags: ['Hàn Quốc', 'Bánh bao', 'Món chính', 'Kim chi']
  },
  {
    id: 2,
    title: 'Cách làm phở bò Hà Nội',
    description: 'Phở bò Hà Nội — nước dùng trong chiều sâu, bánh phở mềm, thịt bò tái, món ăn độc đáo Việt Nam.',
    image: 'https://foodish-api.com/images/biryani/biryani9.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=NtGx5dL1GsM',
    duration: '2 giờ',
    difficulty: 'Khó',
    servings: '4 người',
    category: 'Món chính',
    rating: 4.9,
    views: '234K',
    prepTime: '30 phút',
    cookTime: '90 phút',
    totalTime: '2 giờ',
    ingredients: {
      Chính: ['1.5 kg Xương bò', '400 g Thịt bò tái', '500 g Bánh phở'],
      'Rau củ': ['1 củ Hành tây'],
      'Gia vị': [
        '1 củ Gừng',
        '3 cái Hoa hồi',
        '1 thanh Quế',
        '2 quả Thảo quả',
        '3 thìa canh Nước mắm',
        '1 thìa cà phê Muối'
      ]
    },
    instructions: [
      {
        step: 1,
        title: 'Chần xương',
        description: 'Chần xương qua nước sôi để loại bỏ bọt và mùi không mong muốn.',
        time: '10 phút',
        image: 'https://foodish-api.com/images/biryani/biryani38.jpg'
      },
      {
        step: 2,
        title: 'Nướng gừng & hành',
        description: 'Nướng hành tây và gừng để tạo mùi thơm.',
        time: '10 phút',
        image: 'https://foodish-api.com/images/dessert/dessert7.jpg'
      },
      {
        step: 3,
        title: 'Hầm nước dùng',
        description: 'Hầm xương với gừng, hành và gia vị trong 1.5 giờ để lấy vị ngọt tự nhiên.',
        time: '90 phút',
        image: 'https://foodish-api.com/images/pizza/pizza82.jpg'
      },
      {
        step: 4,
        title: 'Trụng phở',
        description: 'Chần bánh phở qua nước sôi nhanh rồi cho vào tô.',
        time: '5 phút',
        image: 'https://foodish-api.com/images/pasta/pasta7.jpg'
      },
      {
        step: 5,
        title: 'Hoàn thiện tô',
        description: 'Xếp thịt tái, chan nước dùng, thêm hành ngò và thưởng thức.',
        time: '5 phút',
        image: 'https://foodish-api.com/images/idly/idly38.jpg'
      }
    ],
    tips: [
      'Hầm xương lâu sẽ giúp nước ngọt tinh khiết hơn.',
      'Nướng hành & gừng giúp khử mùi và tăng mùi thơm.',
      'Dùng quẩy để ăn kèm sẽ ngon hơn.'
    ],
    nutrition: {
      calories: 350,
      protein: 25,
      carbs: 45,
      fat: 10,
      fiber: 2
    },
    tags: ['Việt Nam', 'Phở', 'Bò', 'Nước dùng', 'Món chính']
  },
  {
    id: 3,
    title: 'Cách làm bánh mì Việt Nam',
    description: 'Bánh mì Việt Nam – món ăn đường phố nổi tiếng thế giới, với vỏ giòn rụm và nhân đa dạng.',
    image: 'https://foodish-api.com/images/butter-chicken/butter-chicken20.jpg ',
    videoUrl: 'https://www.youtube.com/watch?v=kf_7fQGzGJY',
    duration: '20 phút',
    difficulty: 'Dễ',
    servings: '2 người',
    category: 'Ăn sáng',
    rating: 4.8,
    views: '178K',
    prepTime: '10 phút',
    cookTime: '10 phút',
    totalTime: '20 phút',
    ingredients: {
      Chính: ['2 ổ Bánh mì', '100 g Thịt nguội', '50 g Pate'],
      'Rau củ': ['Dưa leo cắt lát', 'Ngò rí'],
      'Gia vị': ['2 muỗng Mayonnaise', 'Tương ớt', 'Nước tương']
    },
    instructions: [
      {
        step: 1,
        title: 'Chuẩn bị nguyên liệu',
        description: 'Cắt lát dưa leo, chuẩn bị thịt nguội và pate.',
        time: '5 phút',
        image: 'https://foodish-api.com/images/pizza/pizza81.jpg '
      },
      {
        step: 2,
        title: 'Chuẩn bị bánh mì',
        description: 'Cắt đôi bánh mì, phết pate và mayonnaise.',
        time: '3 phút',
        image: 'https://foodish-api.com/images/butter-chicken/butter-chicken3.jpg '
      },
      {
        step: 3,
        title: 'Thêm nhân',
        description: 'Cho thịt nguội, dưa leo, ngò và tương ớt vào.',
        time: '5 phút',
        image: 'https://foodish-api.com/images/pizza/pizza62.jpg '
      },
      {
        step: 4,
        title: 'Thưởng thức',
        description: 'Bánh mì ăn ngon nhất khi còn giòn nóng.',
        time: '2 phút',
        image: 'https://foodish-api.com/images/burger/burger9.jpg '
      }
    ],
    tips: ['Nướng nóng lại bánh mì cho giòn hơn.', 'Có thể thay pate bằng bơ.', 'Ăn kèm đồ chua để cân bằng vị.'],
    nutrition: {
      calories: 320,
      protein: 12,
      carbs: 40,
      fat: 12,
      fiber: 3
    },
    tags: ['Việt Nam', 'Bánh mì', 'Ăn sáng', 'Đường phố']
  },

  {
    id: 4,
    title: 'Cách làm sushi cuộn cá hồi',
    description: 'Sushi cuộn cá hồi – món ăn Nhật Bản thanh mát, bổ dưỡng và dễ làm tại nhà.',
    image: 'https://foodish-api.com/images/dosa/dosa11.jpg ',
    videoUrl: 'https://www.youtube.com/watch?v=I1Q7M3Y7fSg',
    duration: '40 phút',
    difficulty: 'Trung bình',
    servings: '3 người',
    category: 'Món chính',
    rating: 4.7,
    views: '145K',
    prepTime: '25 phút',
    cookTime: '15 phút',
    totalTime: '40 phút',
    ingredients: {
      Chính: ['200 g Cá hồi tươi', '200 g Gạo sushi', '3 lá Rong biển'],
      'Rau củ': ['1 quả Dưa leo', '1 quả Bơ'],
      'Gia vị': ['2 muỗng Giấm gạo', '1 muỗng Đường', '1/2 muỗng Muối']
    },
    instructions: [
      {
        step: 1,
        title: 'Nấu cơm sushi',
        description: 'Nấu gạo sushi, trộn giấm gạo, đường và muối.',
        time: '20 phút',
        image: 'https://foodish-api.com/images/dosa/dosa11.jpg '
      },
      {
        step: 2,
        title: 'Chuẩn bị nhân',
        description: 'Cắt lát cá hồi, bơ và dưa leo.',
        time: '10 phút',
        image: 'https://foodish-api.com/images/biryani/biryani76.jpg '
      },
      {
        step: 3,
        title: 'Cuộn sushi',
        description: 'Đặt rong biển, cơm và nhân lên mành tre, cuộn chặt.',
        time: '7 phút',
        image: 'https://foodish-api.com/images/rice/rice20.jpg '
      },
      {
        step: 4,
        title: 'Cắt và thưởng thức',
        description: 'Cắt sushi thành khoanh nhỏ, ăn kèm nước tương và wasabi.',
        time: '3 phút',
        image: ' https://foodish-api.com/images/butter-chicken/butter-chicken8.jpg'
      }
    ],
    tips: [
      'Dùng dao bén để cắt sushi không bị nát.',
      'Nên chọn cá hồi sashimi để đảm bảo an toàn.',
      'Ăn kèm gừng ngâm để cân bằng vị.'
    ],
    nutrition: {
      calories: 350,
      protein: 20,
      carbs: 45,
      fat: 10,
      fiber: 4
    },
    tags: ['Nhật Bản', 'Sushi', 'Cá hồi', 'Món chính']
  }
];
