import { ImageType } from '@prisma/client';
import { NextResponse } from 'next/server';
import { callOpenRouter, cleanJSON, parseProductFilter } from '~/lib/FuncHandler/Chat';
import { getImageProduct } from '~/lib/FuncHandler/getImageProduct';
import { db } from '~/server/db';
import { findProductService } from '~/server/services/product.service';
import { api } from '~/trpc/server';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL_DEPLOY;

    const lastUserMessage = [...messages].reverse().find(message => message.role === 'user')?.content || '';

    const restaurant = await api.Restaurant.getOneActiveClient();

    let keywords: Record<string, any> = {};

    try {
      keywords = parseProductFilter(lastUserMessage);
      if (!Boolean(Object.keys(keywords).length)) {
        const filterPrompt = `
                            Đây là câu hỏi của khách hàng: ${lastUserMessage}

                            Hãy phân tích câu hỏi và trả về JSON filter sản phẩm.

                            Các thuộc tính hợp lệ:

                            {
                              "s": string,
                              "discount": boolean,
                              "bestSaler": boolean,
                              "newProduct": boolean,
                              "hotProduct": boolean,
                              "price": {
                                "min": number,
                                "max": number
                              },
                              "sort": string[],
                              "nguyen-lieu": string[]
                            }

                            Quy tắc:
                            - s là tên món ăn hoặc tên danh mục.
                            - discount = true nếu hỏi khuyến mãi/giảm giá.
                            - bestSaler = true nếu hỏi bán chạy.
                            - newProduct = true nếu hỏi món mới.
                            - hotProduct = true nếu hỏi món hot.
                            - price dùng khi khách nhắc giá, ví dụ 10k = 10000.
                            - sort có thể là: name-asc, name-desc, price-asc, price-desc, old, new, best-seller.
                            - nguyen-lieu là danh sách nguyên liệu khách nhắc tới.

                            Chỉ trả về JSON thuần.
                            Nếu không có filter nào thì trả về {}.
                        `;
        const response = await callOpenRouter(filterPrompt);
        const content = response.choices?.[0]?.message?.content || '{}';

        keywords = JSON.parse(cleanJSON(content));
      }
    } catch {
      keywords = {};
    }

    const productsResult = await findProductService(db, { ...(keywords as any), page: 1, limit: 4 });

    const products =
      productsResult?.products?.map(product => ({
        id: product.id,
        name: product.name,
        tag: product.tag,
        price: product.price,
        discount: product.discount,
        finalPrice: product.discount ? product.price - product.discount : product.price,
        image: getImageProduct(product.imageForEntities || [], ImageType.THUMBNAIL),
        url: `${baseUrl}/san-pham/${product.tag}`
      })) || [];

    const timeIndex = new Date().getDay();

    const todayOpeningHour = restaurant?.openingHours?.find((item: any) => item?.dayOfWeek === timeIndex.toString());

    const restaurantInfo = {
      name: restaurant?.name || 'Phụng Food',
      address: restaurant?.address || 'Đang cập nhật',
      phone: restaurant?.phone || 'Đang cập nhật',
      email: restaurant?.email || 'Đang cập nhật',
      openTime: todayOpeningHour?.openTime || 'Đang cập nhật',
      closeTime: todayOpeningHour?.closeTime || 'Đang cập nhật'
    };

    const answerPrompt = `
                          Bạn là trợ lý bán hàng chuyên nghiệp của cửa hàng Phụng Food.
                          Cửa hàng chỉ bán online.

                          Câu hỏi mới nhất của khách:
                          ${lastUserMessage}

                          Lịch sử chat:
                          ${JSON.stringify(messages, null, 2)}

                          Thông tin cửa hàng:
                          ${JSON.stringify(restaurantInfo, null, 2)}

                          Danh sách sản phẩm tìm được:
                          ${JSON.stringify(products, null, 2)}

                          Yêu cầu trả lời:
                          - Trả lời bằng tiếng Việt.
                          - Thân thiện, ngắn gọn, tự nhiên.
                          - Nếu có sản phẩm phù hợp, hãy tư vấn dựa trên danh sách sản phẩm.
                          - Nếu khách hỏi thông tin cửa hàng, trả lời bằng thông tin cửa hàng.
                          - Nếu không có sản phẩm phù hợp, nói nhẹ nhàng rằng hiện chưa tìm thấy món phù hợp.
                          - Không trả HTML.
                          - Không markdown.

                          Bắt buộc trả về JSON thuần theo format:

                          {
                            "reply": "Nội dung trả lời cho khách",
                            "productIds": ["id sản phẩm liên quan"],
                            "showMoreUrl": "url xem thêm hoặc null"
                          }

                          Quy tắc productIds:
                          - Chỉ dùng id có trong danh sách sản phẩm tìm được.
                          - Nếu không cần hiển thị card sản phẩm thì productIds = [].

                          Quy tắc showMoreUrl:
                          - Nếu khách hỏi bán chạy: "${baseUrl}/thuc-don?loai=san-pham-ban-chay"
                          - Nếu khách hỏi giảm giá: "${baseUrl}/thuc-don?loai=san-pham-giam-gia"
                          - Nếu khách hỏi món mới: "${baseUrl}/thuc-don?loai=san-pham-moi"
                          - Nếu khách hỏi món hot: "${baseUrl}/thuc-don?loai=san-pham-hot"
                          - Nếu chỉ hỏi thực đơn chung: "${baseUrl}/thuc-don"
                          - Nếu không cần xem thêm: null
                          `;

    const response = await callOpenRouter(answerPrompt);
    const content = response.choices?.[0]?.message?.content || '{}';

    const answer = JSON.parse(cleanJSON(content));
    return NextResponse.json({
      reply: answer.reply || 'Em chưa hiểu rõ ý anh/chị, mình hỏi lại giúp em nhé.',
      productIds: Array.isArray(answer.productIds) ? answer.productIds : [],
      showMoreUrl: answer.showMoreUrl || null,
      products
    });
  } catch (error) {
    console.error('OpenRouter chat error:', error);

    return NextResponse.json(
      {
        reply: 'Chatbox đang bận. Anh/chị thử lại sau nhé.',
        productIds: [],
        showMoreUrl: null,
        products: []
      },
      { status: 500 }
    );
  }
}
