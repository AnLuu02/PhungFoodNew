import { notificationPriorityInfo } from '~/app/admin/settings/notification/helpers';
import { Notification } from '~/app/admin/settings/notification/types';
const colors = {
  SYSTEM: {
    primary: '#3b82f6',
    light: '#eff6ff'
  },
  ORDER: {
    primary: '#22c55e',
    light: '#ecfdf5'
  },
  PROMOTION: {
    primary: '#ec4899',
    light: '#fdf2f8'
  },
  USER_ACTIVITY: {
    primary: '#a855f7',
    light: '#f5f3ff'
  },
  SECURITY: {
    primary: '#f59e0b',
    light: '#fffbeb'
  },
  SUPPORT: {
    primary: '#06b6d4',
    light: '#ecfeff'
  },
  REMINDER: {
    primary: '#6366f1',
    light: '#eef2ff'
  }
};

export function generateNotifyHtml(notification: Notification) {
  const { primary, light } = colors[notification.type] || colors.SYSTEM;

  const formattedDate = new Date(notification.createdAt || new Date()).toLocaleString('vi-VN', {
    hour12: false
  });

  return `
  <div style="font-family: 'Inter', Arial, sans-serif; background-color: #f3f4f6; padding: 40px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 640px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
      <tr>
        <td style="background: ${light}; padding: 24px 32px; border-bottom: 1px solid #e5e7eb;">
          <table width="100%">
            <tr>
              <td style="font-size: 20px; font-weight: 600; color: ${primary};">
                ${notification.title}
              </td>
              <td style="text-align: right;">
                <img src="${process.env.NEXT_PUBLIC_BASE_URL_DEPLOY}/logo/logo_phungfood_1.png" alt="QuickBuy" width="100" style="opacity: 0.85;" />
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding: 32px;">
          <p style="font-size: 16px; color: #111827; line-height: 1.6; margin: 0;">
            ${notification.message}
          </p>

          ${
            notification.tags?.length
              ? `<p style="margin-top: 20px; font-size: 14px; color: #6b7280;">
                   <strong>Thẻ:</strong> ${notification.tags.map(t => `#${t}`).join(' ')}
                 </p>`
              : ''
          }

          <div style="margin-top: 28px; padding: 16px 20px; border-left: 4px solid ${primary}; background: ${light}; border-radius: 8px;">
            <p style="margin: 0; font-size: 14px; color: #374151;">
              <strong>Mức ưu tiên:</strong> ${notificationPriorityInfo[notification.priority]?.viName || 'Không xác định'}<br/>
              <strong>Thời gian:</strong> ${formattedDate}
            </p>
          </div>

          <div style="margin-top: 36px; text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_BASE_URL_DEPLOY}" style="display: inline-block; padding: 12px 24px; background: ${primary}; color: white; font-size: 15px; border-radius: 8px; text-decoration: none;">
              Xem chi tiết thông báo
            </a>
          </div>
        </td>
      </tr>
      <tr>
        <td style="padding: 20px 32px; background-color: #f9fafb; text-align: center; font-size: 13px; color: #9ca3af;">
          © ${new Date().getFullYear()} PhungFood. Mọi quyền được bảo lưu.<br/>
          Đây là email tự động, vui lòng không phản hồi.
        </td>
      </tr>
    </table>
  </div>
  `;
}
