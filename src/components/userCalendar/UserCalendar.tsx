import React, { useEffect, useState } from "react";
import "./UserCalendar.scss";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isToday,
} from "date-fns";

interface DayActivity {
  [day: string]: boolean; // ex: "2025-03-12": true
}

interface CalendarProps {
  activities?: DayActivity;
}

const UserCalendar: React.FC<CalendarProps> = ({ activities = {} }) => {
  const [daysInMonth, setDaysInMonth] = useState<Date[]>([]);
  const today = new Date();

  useEffect(() => {
    const start = startOfMonth(today);
    const end = endOfMonth(today);
    setDaysInMonth(eachDayOfInterval({ start, end }));
  }, []);

  const weekDays = ["L", "M", "M", "J", "V", "S", "D"];

  const getFrenchDayIndex = (date: Date) => {
    const day = getDay(date);
    return day === 0 ? 6 : day - 1;
  };

  const firstDayIndex = daysInMonth.length
    ? getFrenchDayIndex(daysInMonth[0])
    : 0;

  return (
    <div className="calendar-container">
      <div className="weekdays">
        {weekDays.map((day, idx) => (
          <span key={idx}>{day}</span>
        ))}
      </div>

      <div className="calendar-grid">
        {Array.from({ length: firstDayIndex }).map((_, idx) => (
          <span key={`empty-${idx}`} className="calendar-day empty"></span>
        ))}

        {daysInMonth.map((day) => {
          const formattedDate = format(day, "yyyy-MM-dd");
          const hasActivity = activities[formattedDate];

          return (
            <span
              key={formattedDate}
              className={`calendar-day ${hasActivity ? "active" : ""} ${
                isToday(day) ? "today" : ""
              }`}
            >
              {isToday(day) && (
                <span className="today-label">{format(day, "d")}</span>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default UserCalendar;
