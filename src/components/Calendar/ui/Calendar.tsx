import type { CalendarProps } from '../model/types'
import { CALENDAR_DAYS } from '../model/constants'

export const Calendar = ({ dates }: CalendarProps) => {
  const today = new Date().getDate()

  return (
    <div className="calendar">
      <div className="calendar-header">
        {CALENDAR_DAYS.map((day) => (
          <div key={day} className="day">{day}</div>
        ))}
      </div>
      <div className="calendar-dates">
        {dates.map((date, index) => (
          <div key={index} className={`date ${date === today ? 'active' : ''}`}>
            {date > 0 ? date : ''}
          </div>
        ))}
      </div>
    </div>
  )
}

