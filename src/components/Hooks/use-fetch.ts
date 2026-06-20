import { useCallback, useEffect, useState } from 'react';
import districtsData from '~/lib/HardData/provinces_vietnam/districts.json';
import provincesData from '~/lib/HardData/provinces_vietnam/provinces.json';
import wardsData from '~/lib/HardData/provinces_vietnam/wards.json';
import { District, Province, Ward } from '~/types/ResponseFetcher';
export const useProvinces = () => {
  const getProvince = (code: number, provincesData: Province[]) => {
    return provincesData.find(p => p.code == code)!;
  };
  return { provinces: provincesData, getProvince };
};

export const useDistricts = (province_code?: number) => {
  const [districts, setDistricts] = useState<District[]>([]);
  const getDistrict = useCallback(
    (code: number, districts: District[]) => {
      return districts.find(d => d.code == code);
    },
    [province_code]
  );
  useEffect(() => {
    const data = districtsData.filter(d => d.province_code == province_code);
    setDistricts(data);
  }, [province_code]);
  return { districts, getDistrict };
};

export const useWards = (district_code?: number) => {
  const [wards, setWards] = useState<Ward[]>([]);
  const getWard = useCallback(
    (code: number, wards: Ward[]) => {
      return wards.find(w => w.code == code);
    },
    [district_code]
  );
  useEffect(() => {
    const data = wardsData.filter(d => d.district_code == district_code);
    setWards(data);
  }, [district_code]);
  return { wards, getWard };
};
