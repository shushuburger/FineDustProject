// 타입 정의
import type { LocationInfo, DustGrade } from '@/shared/types/api';

// Kakao API 키
const KAKAO_API_KEY = '6bc3bb7db30d6057283b9bf04a9fec97';

// Kakao 위치 API 엔드포인트
const KAKAO_GEO_API_URL = 'https://dapi.kakao.com/v2/local/geo/coord2regioncode.json';

/**
 * 좌표를 주소로 변환하는 함수
 */
export const getAddressFromCoords = async (lat: number, lon: number): Promise<string> => {
  try {
    const response = await fetch(`${KAKAO_GEO_API_URL}?x=${lon}&y=${lat}`, {
      headers: {
        Authorization: `KakaoAK ${KAKAO_API_KEY}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Kakao API 오류: ${response.status}`);
    }
    
    const data = await response.json();
    const region = data.documents.find((doc: any) => doc.region_type === 'B');
    
    if (region) {
      return `${region.region_1depth_name} ${region.region_2depth_name}`;
    }
    
    throw new Error('주소를 찾을 수 없습니다.');
  } catch (error) {
    console.error('주소 변환 실패:', error);
    throw error;
  }
};

/**
 * 현재 위치를 가져오는 함수
 */
export const getCurrentLocation = (): Promise<LocationInfo> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('위치 정보를 지원하지 않는 브라우저입니다.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const address = await getAddressFromCoords(lat, lon);
          
          resolve({
            latitude: lat,
            longitude: lon,
            address
          });
        } catch (error) {
          reject(error);
        }
      },
      (error) => {
        reject(new Error(`위치 정보 오류: ${error.message}`));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5분
      }
    );
  });
};

/**
 * PM10 등급을 반환하는 함수
 */
export const getPM10Grade = (value: number): DustGrade => {
  if (value <= 15) return '매우 좋음';
  if (value <= 30) return '좋음';
  if (value <= 55) return '양호';
  if (value <= 80) return '보통';
  if (value <= 115) return '주의';
  if (value <= 150) return '나쁨';
  return '매우 나쁨';
};

/**
 * PM2.5 등급을 반환하는 함수
 */
export const getPM25Grade = (value: number): DustGrade => {
  if (value <= 7.5) return '매우 좋음';
  if (value <= 15) return '좋음';
  if (value <= 25) return '양호';
  if (value <= 35) return '보통';
  if (value <= 55) return '주의';
  if (value <= 75) return '나쁨';
  return '매우 나쁨';
};

/**
 * 오존 등급을 반환하는 함수
 */
export const getO3Grade = (value: number): DustGrade => {
  if (value <= 0.015) return '매우 좋음';
  if (value <= 0.03) return '좋음';
  if (value <= 0.06) return '양호';
  if (value <= 0.09) return '보통';
  if (value <= 0.12) return '주의';
  if (value <= 0.15) return '나쁨';
  return '매우 나쁨';
};

/**
 * 등급에 따른 색상을 반환하는 함수
 */
export const getGradeColor = (grade: DustGrade): string => {
  const colorMap: Record<DustGrade, string> = {
    '매우 좋음': '#4285F4',
    '좋음': '#9CD5F9',
    '양호': '#22B14C',
    '보통': '#B5E61D',
    '주의': '#FFD400',
    '나쁨': '#FF7F27',
    '매우 나쁨': '#F52020'
  };
  return colorMap[grade] || '#7F7F7F';
};

/**
 * 현재 시간을 포맷하는 함수
 */
export const formatCurrentTime = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const hour = now.getHours();
  const minute = now.getMinutes().toString().padStart(2, '0');
  const period = hour < 12 ? '오전' : '오후';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  
  return `${year}.${month}.${day} ${period} ${hour12}:${minute} (${hour}시)`;
};

/**
 * 정적 리소스에서 측정소 좌표 목록을 가져옵니다.
 * 파일: public/data/stations_with_coords.json
 */
export type StationCoords = {
  address: string;
  latitude: number;
  longitude: number;
};

type StationsWithCoordsResponse = {
  updatedAt: string;
  count: number;
  data: Record<string, StationCoords>;
};

export const fetchStationsWithCoords = async (): Promise<StationsWithCoordsResponse> => {
  const res = await fetch('/data/stations_with_coords.json', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`stations_with_coords.json 로딩 실패: ${res.status}`);
  }
  return res.json();
};

/**
 * 하버사인 거리 계산 (km)
 */
export const haversineKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * 주어진 좌표에서 가장 가까운 측정소를 찾습니다.
 */
export const findNearestStation = async (
  latitude: number,
  longitude: number
): Promise<{ name: string; distanceKm: number; coords: StationCoords }> => {
  const { data } = await fetchStationsWithCoords();
  let best: { name: string; distanceKm: number; coords: StationCoords } | null = null;
  for (const [name, coords] of Object.entries(data)) {
    const d = haversineKm(latitude, longitude, coords.latitude, coords.longitude);
    if (!best || d < best.distanceKm) {
      best = { name, distanceKm: d, coords };
    }
  }
  if (!best) throw new Error('측정소 데이터를 찾을 수 없습니다.');
  return best;
};

/**
 * 정적 리소스에서 최근 수집된 대기질 스냅샷을 가져옵니다.
 * 파일: public/data/air-quality.json
 */
type AirItem = { pm10: number | null; pm25: number | null; dataTime: string | null };
type AirQualitySnapshot = { updatedAt: string; count: number; data: Record<string, AirItem> };

export const fetchAirQualitySnapshot = async (): Promise<AirQualitySnapshot> => {
  const res = await fetch('/data/air-quality.json', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`air-quality.json 로딩 실패: ${res.status}`);
  }
  return res.json();
};

/**
 * 측정소명으로 air-quality 스냅샷에서 값을 조회합니다.
 */
export const getAirForStation = async (
  stationName: string
): Promise<{ station: string; pm10: number | null; pm25: number | null; dataTime: string | null } | null> => {
  const snap = await fetchAirQualitySnapshot();
  const item = snap.data[stationName];
  if (!item) return null;
  return { station: stationName, pm10: item.pm10 ?? null, pm25: item.pm25 ?? null, dataTime: item.dataTime ?? null };
};

/**
 * 현재 위치 기반으로 최근접 측정소와 해당 대기정보를 함께 반환합니다.
 * 위치 권한이 없거나 실패 시 에러를 throw합니다.
 */
export const getNearestStationAir = async () => {
  const loc = await getCurrentLocation();
  const nearest = await findNearestStation(loc.latitude, loc.longitude);
  const air = await getAirForStation(nearest.name);
  return {
    location: loc,
    nearestStation: nearest,
    air,
  };
};