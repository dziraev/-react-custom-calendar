import React from 'react';
import { useCalendar } from './hooks/useCalendar';

import './Calendar.css';
import { checkDateIsEqual, checkIsToday } from '../../utils/helpers/date';

interface ICalendarProps {
  locale?: string;
  selectedDate: Date;
  selectDate: (date: Date) => void;
  firstWeekDay?: number;
}

export const Calendar: React.FC<ICalendarProps> = ({
  locale = 'default',
  selectedDate,
  selectDate,
  firstWeekDay = 2
}) => {
  const { state, functions } = useCalendar({ firstWeekDay, locale, selectedDate });

  return (
    <div className='calendar'>
      <div className='calendar__header'>
        <div
          aria-hidden
          className='calendar__arrowLeft'
          onClick={() => functions.onClickArrow('left')}
        />
        {state.mode === 'days' && (
          <div aria-hidden onClick={() => functions.setMode('months')}>
            {state.monthsNames[state.selectedMonth.monthIndex].month}
          </div>
        )}
        {state.mode === 'months' && (
          <div aria-hidden onClick={() => functions.setMode('years')}>
            {state.selectedYear}
          </div>
        )}
        {state.mode === 'years' && (
          <div aria-hidden onClick={() => functions.setMode('days')}>
            {state.selectedYearInterval[0]} -{' '}
            {state.selectedYearInterval[state.selectedYearInterval.length - 1]}
          </div>
        )}
        <div
          aria-hidden
          className='calendar__arrowRight'
          onClick={() => functions.onClickArrow('right')}
        />
      </div>
      <div className='calendar__body'>
        {state.mode === 'days' && (
          <>
            <div className='calendar__weekNames'>
              {state.weekDaysNames.map((weekDayName) => (
                <div key={weekDayName.dayShort}>{weekDayName.dayShort}</div>
              ))}
            </div>
            <div className='calendar__days'>
              {state.calendarDays.map((day) => {
                const isToday = checkIsToday(day.date);
                const isSelectedDay = checkDateIsEqual(day.date, state.selectedDate.date);
                const isAdditionalDay = day.monthIndex !== state.selectedMonth.monthIndex;

                return (
                  <div
                    aria-hidden
                    key={`${day.dayNumber}-${day.monthIndex}`}
                    className={[
                      'calendar__day',
                      isToday ? 'calendar__todayItem' : '',
                      isSelectedDay ? 'calendar__selectedItem' : '',
                      isAdditionalDay ? 'calendar__additionalDay' : ''
                    ].join(' ')}
                    onClick={() => {
                      functions.setSelectedDate(day);
                      selectDate(day.date);
                    }}
                  >
                    {day.dayNumber}
                  </div>
                );
              })}
            </div>
          </>
        )}
        {state.mode === 'months' && (
          <div className='calendar__pickItems__container'>
            {state.monthsNames.map((monthName) => {
              const isCurrentMonth =
                new Date().getMonth() === monthName.monthIndex &&
                new Date().getFullYear() === state.selectedYear;
              const isSelectedMonth = monthName.monthIndex === state.selectedMonth.monthIndex;

              return (
                <div
                  aria-hidden
                  key={monthName.monthIndex}
                  className={[
                    'calendar__pickItem',
                    isCurrentMonth ? 'calendar__todayItem' : '',
                    isSelectedMonth ? 'calendar__selectedItem' : ''
                  ].join(' ')}
                  onClick={() => {
                    functions.setMode('days');
                    functions.setSelectedMonthByIndex(monthName.monthIndex);
                  }}
                >
                  {monthName.monthShort}
                </div>
              );
            })}
          </div>
        )}
        {state.mode === 'years' && (
          <div className='calendar__pickItems__container'>
            <div className='calendar__uncontrolledYear'>{state.selectedYearInterval[0] - 1}</div>
            {state.selectedYearInterval.map((year) => {
              const isCurrentYear = year === new Date().getFullYear();
              const isSelectedYear = year === state.selectedYear;

              return (
                <div
                  aria-hidden
                  key={year}
                  className={[
                    'calendar__pickItem',
                    isCurrentYear ? 'calendar__todayItem' : '',
                    isSelectedYear ? 'calendar__selectedItem' : ''
                  ].join(' ')}
                  onClick={() => {
                    functions.setMode('months');
                    functions.setSelectedYear(year);
                  }}
                >
                  {year}
                </div>
              );
            })}
            <div className='calendar__uncontrolledYear'>
              {state.selectedYearInterval[state.selectedYearInterval.length - 1] + 1}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
