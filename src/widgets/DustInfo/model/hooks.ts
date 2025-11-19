import { useState, useEffect } from 'react'
import type { DustData, DustGrade } from '@/shared/types/api'
import { getPM10Grade, getPM25Grade } from '@/shared/api/dustApi'

export const useDustGrades = (dustData?: DustData | null) => {
  const [pm10Grade, setPm10Grade] = useState<DustGrade>('보통')
  const [pm25Grade, setPm25Grade] = useState<DustGrade>('보통')

  useEffect(() => {
    if (dustData) {
      if (dustData.PM10 !== undefined) {
        setPm10Grade(getPM10Grade(dustData.PM10))
      }
      if (dustData['PM2.5'] !== undefined) {
        setPm25Grade(getPM25Grade(dustData['PM2.5']))
      }
    }
  }, [dustData])

  return { pm10Grade, pm25Grade }
}

