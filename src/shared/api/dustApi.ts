// 타입 정의
import type { DustApiResponse, LocationInfo, DustGrade } from '@/shared/types/api';

// Kakao API 키
const KAKAO_API_KEY = '6bc3bb7db30d6057283b9bf04a9fec97';

// 미세먼지 API 엔드포인트
const DUST_API_URL = 'https://fine-dust-api.onrender.com/api/average-dust';

// Kakao 위치 API 엔드포인트
const KAKAO_GEO_API_URL = 'https://dapi.kakao.com/v2/local/geo/coord2regioncode.json';

/**
 * 미세먼지 데이터를 가져오는 함수
 */
export const fetchDustData = async (): Promise<DustApiResponse> => {
  try {
    const response = await fetch(DUST_API_URL);
    if (!response.ok) {
      throw new Error(`미세먼지 API 오류: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('미세먼지 데이터 로딩 실패:', error);
    throw error;
  }
};

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
