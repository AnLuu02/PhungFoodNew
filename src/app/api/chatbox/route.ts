import { GoogleGenAI } from '@google/genai';
import { ImageType } from '@prisma/client';
import { NextResponse } from 'next/server';
import { formatPriceLocaleVi } from '~/app/lib/utils/func-handler/formatPrice';
import { getImageProduct } from '~/app/lib/utils/func-handler/getImageProduct';
import { api } from '~/trpc/server';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
export async function POST(req: Request) {
  const { message } = await req.json();
  const containsProductKeyword = message.match(
    /sản phẩm|món|mặt hàng|giá|menu|thực đơn|có gì|bán|giảm|khuyến mãi|đánh giá|nổi bật/i
  );
  const containsRestaurantKeyword = message.match(/cửa hàng|địa chỉ|giờ|số điện thoại|nhà hàng|liên hệ|email/i);

  let prompt = `Bạn là trợ lý bán hàng chuyên nghiệp của cửa hàng Phụng Food (Mama Reastaurant). Cửa hàng chỉ bán online.`;

  if (containsProductKeyword) {
    let subPrompt = `
      Bây giờ bạn là trợ lí bán hàng của website của tôi.

      Đây là message của người dùng: ${message}

      Đây là các thuộc tính cần để lọc sản phầm. Các thuộc tính có thể có hoặc không.

      Bạn chỉ cần trả về cho tôi JSON js với các thuộc tính có giá trị, không cần nói gì thêm. Dưới đây là các thuộc tính:
          
      s kiểu string là key để search. Ví dụ s="cơm"

      discount kiểu boolean bằng true nếu trong message người dùng có liên quan đến khuyến mãi

      bestSaler kiểu boolean bằng true nếu trong message người dùng có liên quan đến sản phẩm bán chạy
      
      newProduct kiểu boolean bằng true nếu trong message người dùng có liên quan đến sản phẩm mới

      hotProduct kiểu boolean bằng true nếu trong message người dùng có liên quan đến sản phẩm hot

      price kiểu object bằng {min kiểu number mặc định bằng 0, max kiểu number mặc định bẳng 0} nếu trong message người dùng có liên quan đến giá (Ví dụ 10k, 10 ngàn, 10 nghìn,10000 định dạng về kiểm number là 10000)
      
      sort kiểu array bằng [string, string] nếu trong message người dùng có liên quan đến sắp xếp. Sort thường có các giá trị sau name-acs, name-desc, price-asc, price-desc,price-asc, price-desc,old,new,best-seller
      
      nguyen-lieu kiểu array bằng [string, string] nếu trong message người dùng có liên quan đến nguyên liệu
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-001',
      contents: subPrompt
    });

    let keywordsJSON = response.text;

    console.log('keywordsJSON', keywordsJSON);
    keywordsJSON = keywordsJSON?.replace(/```(javascript|json|plaintext)?\n?/g, '').trim();

    const keywords = JSON.parse(keywordsJSON || '{}');
    const products = await api.Product.find({ skip: 0, take: 200, ...keywords });
    const productHTML = products?.products
      .map(
        product => `
                <div
                  style="margin-top: 8px; margin-bottom: 8px; padding: 8px; background-color: #f3f4f6; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); display: flex; align-items: flex-start; gap: 16px;"
                >
                  <img
                    src="${getImageProduct(product?.images || [], ImageType.THUMBNAIL)}"
                    alt="${product.name}"
                    style="width: 50px; height: 50px; object-fit: cover; border-radius: 6px;"
                  />
                  <div style="display: flex; flex-direction: column; justify-content: space-between;">
                    <h4 style="margin: 0; padding: 0; color: #1f2937;">${product.name}</h4>
                    <p style="font-size: 12px; margin: 0; padding: 0; color: #4b5563;">
                      Giá: ${formatPriceLocaleVi(product.price)}
                    </p>
                    <a
                      href="${process.env.NEXT_PUBLIC_BASE_URL_DEPLOY}/san-pham/${product.tag}"
                      style="font-size: 12px; margin: 0; padding: 0; color: #2563eb; text-decoration: none; font-weight: 500;"
                      onmouseover="this.style.textDecoration='underline'"
                      onmouseout="this.style.textDecoration='none'"
                    >
                      Xem chi tiết
                    </a>
                  </div>
                </div>
        `
      )
      .join('');
    prompt += ` 
    Đây là danh sách sản phẩm hiện có trong cửa hàng (dưới dạng HTML): 
    ${productHTML}
    
    Câu hỏi của khách: ${message}
      
    Nếu kết quả trả về có nhiều hơn 3 sản phẩm thì trả về 3 sản phẩm dạng HTML và thêm 1 thẻ HTML và CSS chiếm trọn hàng, căn trái phải trên dưới phù hợp có nội dung "Xem thực đơn" để điều hướng đến đường dẫn ${process.env.NEXT_PUBLIC_BASE_URL_DEPLOY}/thuc-don

    Nếu không, hãy trả lời rằng cửa hàng không có sản phẩm phù hợp.`;
  } else if (containsRestaurantKeyword) {
    const restaurant = await api.Restaurant.getOne();
    const restaurantHTML = `
        <div style="margin: 10px 0; max-width: 400px; padding: 16px; background-color: #f9f9f9; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); font-family: Arial, sans-serif;">
        <h3 style="margin: 0; padding-bottom: 8px; color: #333; border-bottom: 2px solid #ddd;">An Luu</h3>
        <p style="margin: 8px 0; color: #555;"><strong>Địa chỉ:</strong> ${restaurant?.address}</p>
        <p style="margin: 8px 0; color: #555;"><strong>Số điện thoại:</strong> <a href="${restaurant?.phone}" style="color: #007bff; text-decoration: none;">${restaurant?.phone}</a></p>
        <p style="margin: 8px 0; color: #555; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 200px;">
          <strong>Email:</strong> 
          <a href="${restaurant?.email}" style="color: #007bff; text-decoration: none;">
             ${restaurant?.email}
          </a>
        </p>
        <p style="margin: 8px 0; color: #555;"><strong>Thời gian mở cửa:</strong> ${restaurant?.openedHours || 'Đang cập nhật'} - ${restaurant?.closedHours || 'Đang cập nhật'}</p>
        ${
          restaurant && restaurant?.socials?.length > 0
            ? restaurant?.socials
                ?.map(
                  (social: any) =>
                    `<p style="margin: 8px 0; color: #555;"><strong style="text-transform:capitalize;">${social.key}:</strong> <a href="${social.url}" style="color: #007bff; text-decoration: none;">${social.url}</a></p>`
                )
                .join('')
            : ''
        }
      </div>
  `;
    prompt += ` 
    Đây là thông tin cửa hàng (dưới dạng HTML):
    ${restaurantHTML}
    
    Câu hỏi của khách: ${message}
    
    Nếu câu hỏi của khách có thông tin liên quan đến cửa hàng, trả về thông tin phù hợp với câu hỏi của khách hàng về cửa hàng với định dạng thân thiện, hợp lí. Hãy hiển thị dưới dạng HTML. 
    
    Nếu không có thông tin, hãy trả lời phù hợp.`;
  } else {
    prompt += ` Câu hỏi của khách hàng: ${message}. Trả lời một cách thân thiện mà không cần HTML.`;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-001',
      contents: prompt
    });

    let answer = response.text;
    answer = answer?.replace(/```(html|plaintext)?\n?/g, '').trim();
    return NextResponse.json({ reply: answer });
  } catch (error) {
    console.error('Lỗi API Together AI:', error);
    return NextResponse.json({ reply: 'Lỗi hệ thống, vui lòng thử lại.' }, { status: 500 });
  }
}

// Nếu kết quả trả về có nhiều hơn 3 sản phẩm thì trả về 3 sản phẩm dạng HTML và thêm 1 thẻ HTML có nô để điều hướng đến đường dẫn  ${process.env.NEXT_PUBLIC_BASE_URL_DEPLOY}/san-pham

//     Nếu có sản phẩm phù hợp, hãy trả lời và chỉ cần hiển thị dưới dạng HTML.
