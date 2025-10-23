import { useState, useEffect } from 'react';
import type { DustData, DustGrade } from '@/shared/types/api';
import { getPM10Grade, getPM25Grade, getGradeColor } from '@/shared/api/dustApi';
import './DustInfo.css';

interface DustInfoProps {
  dustData?: DustData | null;
  location?: string | null;
  time?: string;
  isLoading?: boolean;
  error?: string | null;
}

export const DustInfo = ({ dustData, location, time, isLoading, error }: DustInfoProps) => {
  const [pm10Grade, setPm10Grade] = useState<DustGrade>('보통');
  const [pm25Grade, setPm25Grade] = useState<DustGrade>('보통');

  useEffect(() => {
    if (dustData) {
      if (dustData.PM10 !== undefined) {
        setPm10Grade(getPM10Grade(dustData.PM10));
      }
      if (dustData['PM2.5'] !== undefined) {
        setPm25Grade(getPM25Grade(dustData['PM2.5']));
      }
    }
  }, [dustData]);

  if (isLoading) {
    return (
      <div className="dust-info-container">
        <div className="dust-info-header">
          <h3>미세먼지 정보</h3>
          <div className="loading-spinner"></div>
        </div>
        <div className="dust-loading">
          <p>데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dust-info-container">
        <div className="dust-info-header">
          <h3>미세먼지 정보</h3>
        </div>
        <div className="dust-error">
          <p>❌ {error}</p>
        </div>
      </div>
    );
  }

  if (!dustData) {
    return (
      <div className="dust-info-container">
        <div className="dust-info-header">
          <h3>미세먼지 정보</h3>
        </div>
        <div className="dust-no-data">
          <p>데이터가 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dust-info-container">
      <div className="dust-info-header">
        <h3>미세먼지 정보</h3>
        {location && <p className="location-text">📍 {location}</p>}
        {time && <p className="time-text">{time}</p>}
      </div>
      
      <div className="dust-data-grid">
        {/* PM10 */}
        <div className="dust-item">
          <div className="dust-label">PM10</div>
          <div 
            className="dust-value"
            style={{ color: getGradeColor(pm10Grade) }}
          >
            {dustData.PM10 ? Math.round(dustData.PM10) : '-'}
          </div>
          <div 
            className="dust-grade"
            style={{ color: getGradeColor(pm10Grade) }}
          >
            {pm10Grade}
          </div>
        </div>

        {/* PM2.5 */}
        <div className="dust-item">
          <div className="dust-label">PM2.5</div>
          <div 
            className="dust-value"
            style={{ color: getGradeColor(pm25Grade) }}
          >
            {dustData['PM2.5'] ? Math.round(dustData['PM2.5']) : '-'}
          </div>
          <div 
            className="dust-grade"
            style={{ color: getGradeColor(pm25Grade) }}
          >
            {pm25Grade}
          </div>
        </div>
      </div>

      {/* 등급 설명 */}
      <div className="dust-legend">
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#4285F4' }}></div>
          <span>매우 좋음</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#9CD5F9' }}></div>
          <span>좋음</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#22B14C' }}></div>
          <span>양호</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#B5E61D' }}></div>
          <span>보통</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#FFD400' }}></div>
          <span>주의</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#FF7F27' }}></div>
          <span>나쁨</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#F52020' }}></div>
          <span>매우 나쁨</span>
        </div>
      </div>
    </div>
  );
};
