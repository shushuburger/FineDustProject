// 미세먼지 데이터 타입
export interface DustData {
  PM10?: number;
  'PM2.5'?: number;
  오존?: number;
}

// 미세먼지 API 응답 타입
export interface DustApiResponse {
  [key: string]: DustData;
}

// 미세먼지 등급 타입
export type DustGrade = '매우 좋음' | '좋음' | '양호' | '보통' | '주의' | '나쁨' | '매우 나쁨';

// 위치 정보 타입
export interface LocationInfo {
  latitude: number;
  longitude: number;
  address: string;
  dustData?: DustData;
}
