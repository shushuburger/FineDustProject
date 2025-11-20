// 타입 정의
import type { LocationInfo, DustGrade } from '@/shared/types/api';

// Kakao API 키
const KAKAO_API_KEY = '6bc3bb7db30d6057283b9bf04a9fec97';

// Kakao 위치 API 엔드포인트
const KAKAO_GEO_API_URL = 'https://dapi.kakao.com/v2/local/geo/coord2regioncode.json';

// 기본 위치 좌표 (maxAttempts 초과 시 사용)
const DEFAULT_LOCATION = {
  latitude: 36.3665,
  longitude: 127.3443,
  address: '대전광역시 유성구'
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
    interface KakaoDocument {
      region_type: string;
      region_1depth_name: string;
      region_2depth_name: string;
    }
    const region = (data.documents as KakaoDocument[]).find((doc) => doc.region_type === 'B');
    
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
 * 더 정확한 위치를 가져오는 함수
 * GPS 신호를 기다려 최대한 정확한 위치를 얻습니다.
 */
export const getCurrentLocation = (): Promise<LocationInfo> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('위치 정보를 지원하지 않는 브라우저입니다.'));
      return;
    }

    let bestPosition: GeolocationPosition | null = null;
    let attempts = 0;
    const maxAttempts = 5;
    const targetAccuracy = 50; // 50미터 이하의 정확도를 목표로 함

    const tryGetPosition = () => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          attempts++;
          const accuracy = position.coords.accuracy;

          // 더 정확한 위치를 찾았거나, 목표 정확도에 도달한 경우
          if (!bestPosition || accuracy < bestPosition.coords.accuracy) {
            bestPosition = position;
          }

          // 목표 정확도에 도달했거나 최대 시도 횟수에 도달한 경우
          if (accuracy <= targetAccuracy || attempts >= maxAttempts) {
            // 최대 시도 횟수 초과 + 목표 정확도 미달 시 기본 좌표 사용
            if (attempts >= maxAttempts && bestPosition && bestPosition.coords.accuracy > targetAccuracy) {
              console.warn(`⚠️ 최대 시도 횟수(${maxAttempts}회) 초과 및 목표 정확도(${targetAccuracy}m) 미달`);
              console.warn(`   최종 정확도: ${bestPosition.coords.accuracy.toFixed(1)}m`);
              console.log(`📍 기본 위치로 설정: ${DEFAULT_LOCATION.address}`);
              
              try {
                const address = await getAddressFromCoords(DEFAULT_LOCATION.latitude, DEFAULT_LOCATION.longitude);
                resolve({
                  latitude: DEFAULT_LOCATION.latitude,
                  longitude: DEFAULT_LOCATION.longitude,
                  address
                });
                return;
              } catch {
                // 주소 변환 실패 시 기본 주소 사용
                resolve({
                  latitude: DEFAULT_LOCATION.latitude,
                  longitude: DEFAULT_LOCATION.longitude,
                  address: DEFAULT_LOCATION.address
                });
                return;
              }
            }
            
            // 정상적으로 위치를 얻은 경우
            if (bestPosition) {
              try {
                const lat = bestPosition.coords.latitude;
                const lon = bestPosition.coords.longitude;
                const address = await getAddressFromCoords(lat, lon);
                
                console.log(`📍 위치 획득 완료 (정확도: ${bestPosition.coords.accuracy.toFixed(1)}m, 시도: ${attempts}회)`);
                
                resolve({
                  latitude: lat,
                  longitude: lon,
                  address
                });
              } catch (error) {
                reject(error);
              }
            } else {
              // bestPosition이 없으면 기본 좌표 사용
              console.warn(`⚠️ 위치 정보를 가져올 수 없어 기본 위치로 설정합니다.`);
              console.log(`📍 기본 위치로 설정: ${DEFAULT_LOCATION.address}`);
              
              try {
                const address = await getAddressFromCoords(DEFAULT_LOCATION.latitude, DEFAULT_LOCATION.longitude);
                resolve({
                  latitude: DEFAULT_LOCATION.latitude,
                  longitude: DEFAULT_LOCATION.longitude,
                  address
                });
              } catch {
                resolve({
                  latitude: DEFAULT_LOCATION.latitude,
                  longitude: DEFAULT_LOCATION.longitude,
                  address: DEFAULT_LOCATION.address
                });
              }
            }
          } else {
            // 정확도가 부족하면 다시 시도 (1초 대기)
            console.log(`📍 위치 정확도 개선 중... (현재: ${accuracy.toFixed(1)}m, 목표: ${targetAccuracy}m 이하)`);
            setTimeout(tryGetPosition, 1000);
          }
        },
        (error) => {
          if (bestPosition) {
            // 이전에 얻은 위치가 있으면 그것을 사용
            (async () => {
              try {
                const lat = bestPosition!.coords.latitude;
                const lon = bestPosition!.coords.longitude;
                const address = await getAddressFromCoords(lat, lon);
                
                console.log(`📍 위치 획득 완료 (정확도: ${bestPosition!.coords.accuracy.toFixed(1)}m, 경고: ${error.message})`);
                
                resolve({
                  latitude: lat,
                  longitude: lon,
                  address
                });
              } catch (err) {
                reject(err);
              }
            })();
          } else {
            // 위치 정보를 전혀 얻지 못한 경우 기본 좌표 사용
            console.warn(`⚠️ 위치 정보 오류: ${error.message}`);
            console.log(`📍 기본 위치로 설정: ${DEFAULT_LOCATION.address}`);
            
            (async () => {
              try {
                const address = await getAddressFromCoords(DEFAULT_LOCATION.latitude, DEFAULT_LOCATION.longitude);
                resolve({
                  latitude: DEFAULT_LOCATION.latitude,
                  longitude: DEFAULT_LOCATION.longitude,
                  address
                });
              } catch {
                // 주소 변환 실패 시 기본 주소 사용
                resolve({
                  latitude: DEFAULT_LOCATION.latitude,
                  longitude: DEFAULT_LOCATION.longitude,
                  address: DEFAULT_LOCATION.address
                });
              }
            })();
          }
        },
        {
          enableHighAccuracy: true,  // GPS 우선 사용
          timeout: 20000,             // 20초로 증가 (GPS 신호 대기)
          maximumAge: 0               // 캐시된 위치 사용 안 함 (항상 최신 위치)
        }
      );
    };

    tryGetPosition();
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
 * 주어진 좌표에서 가까운 순서대로 모든 측정소를 정렬하여 반환합니다.
 */
export const findNearestStations = async (
  latitude: number,
  longitude: number
): Promise<Array<{ name: string; distanceKm: number; coords: StationCoords }>> => {
  const { data } = await fetchStationsWithCoords();
  const stations = [];
  for (const [name, coords] of Object.entries(data)) {
    const d = haversineKm(latitude, longitude, coords.latitude, coords.longitude);
    stations.push({ name, distanceKm: d, coords });
  }
  stations.sort((a, b) => a.distanceKm - b.distanceKm);
  return stations;
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
 * 가장 가까운 측정소의 데이터가 null이면, 다음으로 가까운 측정소 중 데이터가 있는 것을 사용합니다.
 * 위치 권한이 없거나 실패 시 에러를 throw합니다.
 */
export const getNearestStationAir = async () => {
  const loc = await getCurrentLocation();
  const nearestStations = await findNearestStations(loc.latitude, loc.longitude);
  
  // 데이터가 있는 가장 가까운 측정소 찾기
  let selectedStation = nearestStations[0];
  let air = await getAirForStation(selectedStation.name);
  
  // 가장 가까운 측정소의 데이터가 null이면 다음으로 가까운 측정소 확인
  if (!air || air.pm10 === null || air.pm25 === null) {
    for (let i = 1; i < nearestStations.length; i++) {
      const candidate = nearestStations[i];
      const candidateAir = await getAirForStation(candidate.name);
      if (candidateAir && candidateAir.pm10 !== null && candidateAir.pm25 !== null) {
        selectedStation = candidate;
        air = candidateAir;
        break;
      }
    }
  }
  
  return {
    location: loc,
    nearestStation: selectedStation,
    air,
  };
};