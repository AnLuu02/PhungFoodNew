export type Province = {
  name: string;
  code: number;
  division_type: string;
  codename: string;
  phone_code: number;
  districts: District[];
};

export type District = {
  name: string;
  code: number;
  division_type: string;
  codename: string;
  province_code: number;
  wards: Ward[];
};

export type Ward = {
  name: string;
  code: number;
  division_type: string;
  codename: string;
  district_code: number;
};

export type ResponseTRPC = {
  code: 'CONFLICT' | 'OK' | 'UNAUTHORIZED' | 'FORBIDDEN' | 'NOT_FOUND' | 'ERROR';
  message: string;
  data: any;
};

export type TRPCErrorCode =
  | 'PARSE_ERROR'
  | 'BAD_REQUEST'
  | 'INTERNAL_SERVER_ERROR'
  | 'NOT_IMPLEMENTED'
  | 'BAD_GATEWAY'
  | 'SERVICE_UNAVAILABLE'
  | 'GATEWAY_TIMEOUT'
  | 'UNAUTHORIZED'
  | 'PAYMENT_REQUIRED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'METHOD_NOT_SUPPORTED'
  | 'TIMEOUT'
  | 'CONFLICT'
  | 'PRECONDITION_FAILED'
  | 'PAYLOAD_TOO_LARGE'
  | 'UNSUPPORTED_MEDIA_TYPE'
  | 'UNPROCESSABLE_CONTENT'
  | 'PRECONDITION_REQUIRED'
  | 'TOO_MANY_REQUESTS'
  | 'CLIENT_CLOSED_REQUEST';
