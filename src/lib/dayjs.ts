import dayjs from 'dayjs';

import 'dayjs/locale/vi';
import arraySupport from 'dayjs/plugin/arraySupport';
import isBetween from 'dayjs/plugin/isBetween';
import localeData from 'dayjs/plugin/localeData';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(isBetween);
dayjs.extend(arraySupport);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localeData);
dayjs.locale('vi');

dayjs.tz.setDefault('Asia/Ho_Chi_Minh');

export default dayjs;
