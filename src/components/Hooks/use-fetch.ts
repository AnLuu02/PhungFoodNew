import { useMemo } from 'react';
import useSWR from 'swr';
import fetcher from '~/lib/FuncHandler/fetcher';
import { DistrictResponse, ProvinceResponse, WardResponse } from '~/types/ResponseFetcher';

export const useProvinces = () => {
  const swr = useSWR<ProvinceResponse>('https://api.vnappmob.com/api/v2/province/', fetcher);
  const provinceMap = useMemo(() => {
    return swr.data?.results.reduce(
      (acc, p) => {
        acc[p.province_id] = p.province_name;
        return acc;
      },
      {} as Record<string, string>
    );
  }, [swr.data]);

  return { ...swr, provinceMap };
};

export const useDistricts = (provinceId?: string) => {
  const swr = useSWR<DistrictResponse>(
    provinceId ? `https://api.vnappmob.com/api/v2/province/district/${provinceId}` : null,
    fetcher
  );
  const districtMap = useMemo(() => {
    return swr.data?.results.reduce(
      (acc, p) => {
        acc[p.district_id] = p.district_name;
        return acc;
      },
      {} as Record<string, string>
    );
  }, [swr.data]);

  return { ...swr, districtMap };
};

export const useWards = (districtId?: string) => {
  const swr = useSWR<WardResponse>(
    districtId ? `https://api.vnappmob.com/api/v2/province/ward/${districtId}` : null,
    fetcher
  );
  const wardMap = useMemo(() => {
    return swr.data?.results.reduce(
      (acc, p) => {
        acc[p.ward_id] = p.ward_name;
        return acc;
      },
      {} as Record<string, string>
    );
  }, [swr.data]);

  return { ...swr, wardMap };
};
