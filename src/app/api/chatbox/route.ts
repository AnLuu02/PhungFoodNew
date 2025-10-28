import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';
import { formatPriceLocaleVi } from '~/lib/FuncHandler/Format';
import { getImageProduct } from '~/lib/FuncHandler/getImageProduct';
import { LocalImageType } from '~/lib/ZodSchema/enum';
import { api } from '~/trpc/server';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function POST(req: Request) {
  const { message } = await req.json();
  const restaurant = await api.Restaurant.getOneActive();
  const subPrompt = `
      Đây là câu hỏi của khách hàng: ${message}
     
      Dưới đây là các thuộc tính để lọc sản phầm:
          
      - s kiểu string là key để tìm kiếm. giá trị s phải là tên món ăn (ví dụ: s="cơm tắm sườn bì chả") hoặc s phải là tên 1 danh mục của món ăn (ví dụ: s="kem", s="cơm", s="món chính")

      - discount kiểu boolean bằng true nếu trong câu hỏi khách hàng có liên quan đến khuyến mãi

      - bestSaler kiểu boolean bằng true nếu trong câu hỏi khách hàng có liên quan đến sản phẩm bán chạy
      
      - newProduct kiểu boolean bằng true nếu trong câu hỏi khách hàng có liên quan đến sản phẩm mới

      - hotProduct kiểu boolean bằng true nếu trong câu hỏi khách hàng có liên quan đến sản phẩm hot

      - price kiểu object bằng {min kiểu number mặc định bằng 0, max kiểu number mặc định bẳng 0} nếu trong câu hỏi khách hàng có liên quan đến giá (Ví dụ 10k, 10 ngàn, 10 nghìn, 10000 định dạng về kiểu number là 10000)
      
      - sort kiểu string array nếu trong câu hỏi khách hàng có liên quan đến sắp xếp. Sort thường có các giá trị sau name-acs, name-desc, price-asc, price-desc, price-asc, price-desc, old, new, best-seller. Ví dụ ["price-asc", "name-desc"]
      
      - nguyen-lieu kiểu string array nếu trong câu hỏi khách hàng có liên quan đến nguyên liệu. Ví dụ ["thịt", "rau", "trứng", "cá", "tôm", "mực", "hải sản", "thịt gà", "thịt bò", "thịt heo", "nguyên liệu tươi sống"]

      CHỈ CẦN TRẢ VỀ JSON TRONG JS với các thuộc tính có giá trị khác null, không cần nói gì thêm. Các thuộc tính không bắt buộc có thể không có trong JSON. Nếu không có thuộc tính nào thì trả về JSON rỗng {}. Không cần nói gì thêm.
    `;
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash-001',
    contents: subPrompt
  });

  let keywordsJSON = response.text;
  keywordsJSON = keywordsJSON?.replace(/```(javascript|json|plaintext)?\n?/g, '').trim();
  const keywords = JSON.parse(keywordsJSON || '{}');
  const products = await api.Product.find({ skip: 0, take: 4, ...keywords });

  let prompt = `Bạn là trợ lý bán hàng chuyên nghiệp của cửa hàng Phụng Food (Mama Reastaurant). Cửa hàng chỉ bán online.`;
  const productHTML = products?.products
    .map(
      product => `
            <div
              style="margin-top: 8px; margin-bottom: 8px; padding: 8px; background-color: #f3f4f6; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); display: flex; align-items: flex-start; gap: 16px;"
            >
              <img
                src="${getImageProduct(product?.images || [], LocalImageType.THUMBNAIL)}"
                alt="${product.name}"
                style="width: 50px; height: 50px; object-fit: cover; border-radius: 6px;"
              />
              <div style="display: flex; flex-direction: column; justify-content: space-between;">
                <h4 style="margin: 0; padding: 0; color: #1f2937;">${product.name}</h4>
                
                <div style="display: flex; align-items: center; gap: 8px; font-size: 14px;">
                  ${
                    product.discount
                      ? `
                        <span style="text-decoration: line-through; color: #9ca3af;">
                          ${formatPriceLocaleVi(product.price)}
                        </span>
                        <span style="color: #dc2626; font-weight: bold;">
                          ${formatPriceLocaleVi(product.price - product.discount)}
                        </span>
                        <span style="font-weight: bold; background-color: #fde047; color: #b45309; font-size: 12px; padding: 2px 6px; border-radius: 4px;">
                          -${Math.round((product.discount / product.price) * 100)}%
                        </span>
                      `
                      : `<span style="color: #dc2626; font-weight: bold;">${formatPriceLocaleVi(product.price)}</span>`
                  }
                </div>
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
  const timeOpen = () => {
    const timeIndex = new Date().getDay();
    const timeOpens = restaurant?.openingHours ?? [];
    return timeOpens[timeIndex];
  };
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
        <p style="margin: 8px 0; color: #555;"><strong>Thời gian mở cửa:</strong> ${timeOpen()?.openTime || 'Đang cập nhật'} - ${timeOpen()?.closeTime || 'Đang cập nhật'}</p>
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
    Câu hỏi của khách: ${message}.

    Đây là danh sách sản phẩm tìm được trong cửa hàng dưới dạng HTML: 
    ${productHTML}
    
    Hãy trả lời một cách thân thiện, phù hợp như một nhân viên nhà hang đang hỗ trợ khách hàng.
    
    Nếu kết quả trả về có nhiều hơn 3 sản phẩm thì trả về 3 sản phẩm dạng HTML và thêm 1 thẻ HTML và CSS chiếm trọn hàng, căn trái phải trên dưới phù hợp có nội dung "Xem thêm". Đây là các đường dẫn tương ứng với câu hỏi của khách hàng:
    (
       thuc-don
       thuc-don?loai=san-pham-ban-chay
       thuc-don?loai=san-pham-giam-gia
       thuc-don?loai=san-pham-moi
       thuc-don?loai=san-pham-hot
       thuc-don?nguyen-lieu=thit&nguyen-lieu=rau&...
       thuc-don?s=
    ) 
    
    Thay thế cho phù hợp. Ví dụ nếu câu hỏi có liên quan đến sản phẩm bán chạy sẽ điều hương đến đường dẫn ${process.env.NEXT_PUBLIC_BASE_URL_DEPLOY}/thuc-don?loai=san-pham-ban-chay.

    Nếu không có kết quả, hãy trả lời rằng cửa hàng không có sản phẩm phù hợp.`;

  prompt += ` 
    Đây là thông tin cửa hàng (dưới dạng HTML):
    ${restaurantHTML}
    
    Câu hỏi của khách hàng: ${message}.
    
    Nếu câu hỏi của khách có thông tin liên quan đến cửa hàng, trả về thông tin phù hợp với câu hỏi của khách hàng về cửa hàng với định dạng thân thiện, hợp lí. Hãy hiển thị dưới dạng HTML. 
    
    Nếu không có thông tin, hãy trả lời phù hợp.`;

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
    return NextResponse.json({ reply: 'Chatbox đang bận. Thử lại sau.' }, { status: 500 });
  }
}
