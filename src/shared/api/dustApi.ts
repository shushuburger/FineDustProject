// 타입 정의
interface LocationInfo {
  latitude: number;
  longitude: number;
  address: string;
}

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
