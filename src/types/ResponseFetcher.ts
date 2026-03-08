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
