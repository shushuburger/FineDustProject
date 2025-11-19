interface CalendarProps {
  dates: number[]
}

export const Calendar = ({ dates }: CalendarProps) => {
  const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
  const today = new Date().getDate()

  return (
    <div className="calendar">
      <div className="calendar-header">
        {days.map((day) => (
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

