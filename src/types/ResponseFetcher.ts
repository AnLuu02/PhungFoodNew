export type Province = {
  province_id: string;
  province_name: string;
};

export type District = {
  district_id: string;
  district_name: string;
};

export type Ward = {
  ward_id: string;
  ward_name: string;
};

export type ProvinceResponse = {
  results: Province[];
};

export type DistrictResponse = {
  results: District[];
};

export type WardResponse = {
  results: Ward[];
};

export type ResponseTRPC = {
  code: 'CONFLICT' | 'OK' | 'UNAUTHORIZED' | 'FORBIDDEN' | 'NOT_FOUND' | 'ERROR';
  message: string;
  data: any;
};
