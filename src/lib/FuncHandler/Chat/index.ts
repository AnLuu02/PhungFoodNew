import { OpenRouter } from '@openrouter/sdk';

const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY!
});

export const cleanJSON = (text: string) => {
  return text
    .replace(/```(json|javascript|js|plaintext)?\n?/g, '')
    .replace(/```/g, '')
    .trim();
};

export const cleanHTML = (text?: string) => {
  return (text || '')
    .replace(/```(html|plaintext)?\n?/g, '')
    .replace(/```/g, '')
    .trim();
};

export const parseProductFilter = (message: string) => {
  const text = message.toLowerCase();

  const filter: Record<string, any> = {};

  if (text.includes('giảm giá') || text.includes('khuyến mãi') || text.includes('sale') || text.includes('discount')) {
    filter.loai = 'san-pham-giam-gia';
  }

  if (text.includes('bán chạy') || text.includes('best seller') || text.includes('nhiều người mua')) {
    filter.loai = 'san-pham-ban-chay';
  }

  if (text.includes('món mới') || text.includes('sản phẩm mới') || text.includes('mới nhất')) {
    filter.loai = 'san-pham-moi';
  }

  if (text.includes('món hot') || text.includes('hot trend') || text.includes('hot')) {
    filter.loai = 'san-pham-hot';
  }
  const priceMatch = text.match(/(\d+)\s*(k|ngàn|nghìn)/);

  if (priceMatch) {
    const price = Number(priceMatch[1]) * 1000;
    filter.minPrice = 0;
    filter.maxPrice = price;
  }

  const ingredients = ['thịt', 'rau', 'trứng', 'cá', 'tôm', 'mực', 'hải sản', 'thịt gà', 'thịt bò', 'thịt heo'];

  const matchedIngredients = ingredients.filter(item => text.includes(item));

  if (matchedIngredients.length > 0) {
    filter['nguyen-lieu'] = matchedIngredients;
  }

  const searchKeywords = ['cơm', 'bún', 'phở', 'lẩu', 'gà', 'bò', 'heo', 'tôm', 'mực', 'kem'];

  const matchedSearch = searchKeywords.find(item => text.includes(item));

  if (matchedSearch) {
    filter.s = matchedSearch;
  }

  const sorts: string[] = [];

  const sortRules = [
    {
      keywords: ['giá tăng dần', 'rẻ nhất', 'giá thấp', 'giá thấp nhất', 'cheap', 'từ thấp'],
      value: 'price-asc'
    },
    {
      keywords: ['giá giảm dần', 'đắt nhất', 'giá cao', 'giá cao nhất', 'expensive', 'từ cao'],
      value: 'price-desc'
    },

    {
      keywords: ['tên a-z', 'a-z', 'alphabet asc', 'abc'],
      value: 'name-asc'
    },
    {
      keywords: ['tên z-a', 'z-a', 'alphabet desc'],
      value: 'name-desc'
    },

    {
      keywords: ['đánh giá thấp', 'rating thấp', 'ít sao'],
      value: 'rating-asc'
    },
    {
      keywords: ['đánh giá cao', 'rating cao', 'nhiều sao', '5 sao'],
      value: 'rating-desc'
    },

    {
      keywords: ['ít mua', 'ít bán', 'sold thấp', 'bán ít', 'bán chậm'],
      value: 'soldQuantity-asc'
    },
    {
      keywords: ['bán chạy', 'nhiều người mua', 'nhiều bán', 'sold cao'],
      value: 'soldQuantity-desc'
    },

    {
      keywords: ['cũ nhất', 'update cũ', 'updated cũ'],
      value: 'updatedAt-asc'
    },
    {
      keywords: ['mới cập nhật', 'update mới', 'updated mới', 'mới nhất'],
      value: 'updatedAt-desc'
    }
  ];

  sortRules.forEach(rule => {
    const matched = rule.keywords.some(keyword => text.includes(keyword));

    if (matched) {
      sorts.push(rule.value);
    }
  });

  if (sorts.length > 0) {
    filter.sort = [...new Set(sorts)];
  }

  return filter;
};

export const callOpenRouter = async (prompt: string, systemPromt?: string) => {
  const response = await openrouter.chat.send({
    chatRequest: {
      model: 'baidu/cobuddy:free',
      messages: [
        ...(systemPromt
          ? [
              {
                role: 'system' as any,
                content: systemPromt
              }
            ]
          : []),
        {
          role: 'user',
          content: prompt
        }
      ],
      stream: false
    }
  });
  return response;
};
