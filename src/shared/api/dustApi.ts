// 타입 정의
import type { LocationInfo, DustGrade, DustData } from '@/shared/types/api';

// Kakao API 키 (env)
const KAKAO_API_KEY: string | undefined = import.meta.env.VITE_KAKAO_REST_API_KEY;

// 기존 서버 기반 미세먼지 API는 더 이상 사용하지 않습니다.

// Kakao 위치/좌표변환 엔드포인트 (env 전용)
const KAKAO_GEO_API_URL = import.meta.env.VITE_KAKAO_GEO_API_URL as string;
const KAKAO_TRANSCORD_API_URL = import.meta.env.VITE_KAKAO_TRANSCORD_API_URL as string;

// 공공데이터포털 측정소 정보 조회 엔드포인트 및 키
const DATAGOKR_BASE_URL = import.meta.env.VITE_DATA_GO_KR_MSRS_BASE_URL as string;
// URLSearchParams에서 자동 인코딩되므로 디코딩된 키를 환경변수로 주입
const DATAGOKR_SERVICE_KEY: string | undefined = import.meta.env.VITE_DATA_GO_KR_SERVICE_KEY;

// 공공데이터포털 대기정보 조회 엔드포인트 (측정소별 실시간)
const ARPLTN_BASE_URL = import.meta.env.VITE_DATA_GO_KR_ARPLTN_BASE_URL as string;

// 서버 기반 미세먼지 데이터 요청 로직 제거됨

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
      // 시/도 + 구/군 + 동 까지 표시
      const r1 = region.region_1depth_name;
      const r2 = region.region_2depth_name;
      const r3 = region.region_3depth_name;
      return [r1, r2, r3].filter(Boolean).join(' ');
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
 * WGS84 위경도 -> TM 좌표 변환 (카카오 Local API 사용)
 */
const convertWgs84ToTm = async (lat: number, lon: number): Promise<{ tmX: number; tmY: number }> => {
  const url = `${KAKAO_TRANSCORD_API_URL}?x=${lon}&y=${lat}&input_coord=WGS84&output_coord=TM`;
  const response = await fetch(url, {
    headers: { Authorization: `KakaoAK ${KAKAO_API_KEY}` }
  });
  if (!response.ok) {
    throw new Error(`Kakao 좌표변환 API 오류: ${response.status}`);
  }
  const data = await response.json();
  const doc = data.documents?.[0];
  if (!doc) throw new Error('TM 좌표 변환 결과가 없습니다.');
  return { tmX: doc.x, tmY: doc.y };
};

/**
 * 내 위치 기준 가장 가까운 측정소 이름 조회
 * Data.go.kr getNearbyMsrstnList 사용
 */
export const getNearestStationName = async (): Promise<string> => {
  const { latitude, longitude } = await getCurrentLocation();
  const { tmX, tmY } = await convertWgs84ToTm(latitude, longitude);

  // 좌표를 반올림하여 캐시 키 생성 (소수점 0.1m 단위까지 보존할 필요 없음)
  const tmXr = Math.round(tmX);
  const tmYr = Math.round(tmY);
  const cacheKey = `nearestStation:${tmXr}:${tmYr}`;

  // 세션 캐시 확인 (유효기간 1일)
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) {
    try {
      const parsed = JSON.parse(cached) as { value: string; ts: number };
      if (Date.now() - parsed.ts < 24 * 60 * 60 * 1000 && parsed.value) {
        return parsed.value;
      }
    } catch {}
  }

  if (!DATAGOKR_SERVICE_KEY) {
    throw new Error('환경변수 VITE_DATA_GO_KR_SERVICE_KEY가 설정되지 않았습니다.');
  }
  const params = new URLSearchParams({
    serviceKey: DATAGOKR_SERVICE_KEY as string,
    returnType: 'json',
    tmX: String(tmX),
    tmY: String(tmY),
    ver: '1.1'
  });
  const url = `${DATAGOKR_BASE_URL}/getNearbyMsrstnList?${params.toString()}`;

  // 간단한 재시도 로직 (429 등) 최대 2회 백오프
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
  let lastError: any;
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(url);
    if (res.ok) {
      const json = await res.json();
      const items = json?.response?.body?.items;
      if (!items || items.length === 0) throw new Error('근접 측정소를 찾을 수 없습니다.');
      const stationName = items[0]?.stationName as string | undefined;
      if (!stationName) throw new Error('측정소 이름을 파싱할 수 없습니다.');
      sessionStorage.setItem(cacheKey, JSON.stringify({ value: stationName, ts: Date.now() }));
      return stationName;
    }
    lastError = new Error(`근접측정소 API 오류: ${res.status}`);
    if (res.status === 429 || res.status === 503) {
      await sleep(400 * (attempt + 1));
      continue;
    }
    break;
  }
  throw lastError;
};

/**
 * 측정소별 실시간 대기정보 조회 → DustData로 매핑
 */
export const getStationRealtimeDust = async (stationName: string): Promise<DustData> => {
  if (!DATAGOKR_SERVICE_KEY) {
    throw new Error('환경변수 VITE_DATA_GO_KR_SERVICE_KEY가 설정되지 않았습니다.');
  }
  const params = new URLSearchParams({
    serviceKey: DATAGOKR_SERVICE_KEY as string,
    returnType: 'json',
    numOfRows: '1',
    pageNo: '1',
    stationName,
    dataTerm: 'DAILY',
    ver: '1.0'
  });
  const url = `${ARPLTN_BASE_URL}/getMsrstnAcctoRltmMesureDnsty?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`실시간 대기정보 API 오류: ${res.status}`);
  }
  const json = await res.json();
  const item = json?.response?.body?.items?.[0];
  if (!item) throw new Error('실시간 대기정보가 없습니다.');

  const parseNum = (v: any) => {
    if (v === '-' || v === null || v === undefined || v === '') return undefined;
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
  };

  const data: DustData = {
    PM10: parseNum(item.pm10Value),
    'PM2.5': parseNum(item.pm25Value),
    오존: parseNum(item.o3Value)
  };
  return data;
};
