import { getGradeColor } from '@/shared/api/dustApi'
import { useDustGrades } from '../model/hooks'
import { DUST_LEGEND_ITEMS } from '../model/constants'
import type { DustInfoProps } from '../model/types'
import './DustInfo.css'

export const DustInfo = ({ dustData, location, time, isLoading, error }: DustInfoProps) => {
  const { pm10Grade, pm25Grade } = useDustGrades(dustData)

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
    )
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
    )
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
    )
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
        {DUST_LEGEND_ITEMS.map((item) => (
          <div key={item.label} className="legend-item">
            <div className="legend-color" style={{ backgroundColor: item.color }}></div>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

