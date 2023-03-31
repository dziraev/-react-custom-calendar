import { useMemo, useState } from 'react';
import {
  createMonth,
  createDate,
  getMonthNames,
  getNumbersOfDaysInMonth,
  getWeekDaysNames
} from '../../../utils/helpers/date';

interface IUseCalendarParams {
  locale?: string;
  selectedDate: Date;
  firstWeekDay: number;
}

const getYearsInterval = (year: number) => {
  const startYear = Math.floor(year / 10) * 10;
  return [...Array(10)].map((_, i) => startYear + i);
};

export const useCalendar = ({
  firstWeekDay = 2,
  locale = 'default',
  selectedDate: date
}: IUseCalendarParams) => {
  const [mode, setMode] = useState<'days' | 'months' | 'years'>('days');
  const [selectedDate, setSelectedDate] = useState(() => createDate({ date }));
  const [selectedMonth, setSelectedMonth] = useState(() =>
    createMonth({ date: new Date(selectedDate.year, selectedDate.monthIndex), locale })
  );

  const [selectedYear, setSelectedYear] = useState(selectedDate.year);
  const [selectedYearInterval, setSelectedYearInterval] = useState(() =>
    getYearsInterval(selectedDate.year)
  );

  const monthsNames = useMemo(() => getMonthNames(locale), []);
  const weekDaysNames = useMemo(() => getWeekDaysNames(firstWeekDay, locale), []);

  const days = useMemo(() => selectedMonth.createMonthDays(), [selectedMonth, selectedDate]);

  const calendarDays = useMemo(() => {
    const numbersOfDaysInMonth = getNumbersOfDaysInMonth(selectedMonth.monthIndex, selectedYear);

    const prevMonthDays = createMonth({
      date: new Date(selectedYear, selectedMonth.monthIndex - 1),
      locale
    }).createMonthDays();

    const nextMonthDays = createMonth({
      date: new Date(selectedYear, selectedMonth.monthIndex + 1),
      locale
    }).createMonthDays();

    const firstDay = days[0];
    const lastDay = days[numbersOfDaysInMonth - 1];

    const shiftIndex = firstWeekDay - 1;

    const numberOfPrevDays =
      firstDay.dayNumberInWeek - 1 - shiftIndex < 0
        ? 7 - (firstWeekDay - firstDay.dayNumberInWeek)
        : firstDay.dayNumberInWeek - 1 - shiftIndex;

    const numberOfNextDays =
      7 - lastDay.dayNumberInWeek + shiftIndex > 6
        ? 7 - lastDay.dayNumberInWeek - (7 - shiftIndex)
        : 7 - lastDay.dayNumberInWeek + shiftIndex;

    const totalCalendarDays = days.length + numberOfNextDays + numberOfPrevDays;

    const result = [];

    for (let i = 0; i < numberOfPrevDays; i++) {
      const inverted = numberOfPrevDays - i;
      result[i] = prevMonthDays[prevMonthDays.length - inverted];
    }

    for (let i = numberOfPrevDays; i < totalCalendarDays - numberOfNextDays; i++) {
      result[i] = days[i - numberOfPrevDays];
    }

    for (let i = totalCalendarDays - numberOfNextDays; i < totalCalendarDays; i++) {
      result[i] = nextMonthDays[i - totalCalendarDays + numberOfNextDays];
    }

    return result;
  }, [selectedMonth.year, selectedMonth.monthIndex, selectedYear]);

  const onClickArrow = (direction: 'right' | 'left') => {
    if (mode === 'days') {
      const monthIndex =
        direction === 'left' ? selectedMonth.monthIndex - 1 : selectedMonth.monthIndex + 1;
      if (monthIndex === -1) {
        const year = selectedYear - 1;
        setSelectedYear(year);
        if (!selectedYearInterval.includes(year)) setSelectedYearInterval(getYearsInterval(year));
        return setSelectedMonth(createMonth({ date: new Date(year, 11), locale }));
      }

      if (monthIndex === 12) {
        const year = selectedYear + 1;
        setSelectedYear(year);
        if (!selectedYearInterval.includes(year)) setSelectedYearInterval(getYearsInterval(year));
        return setSelectedMonth(createMonth({ date: new Date(year, 0), locale }));
      }
      return setSelectedMonth(createMonth({ date: new Date(selectedYear, monthIndex), locale }));
    }

    if (mode === 'months' && direction === 'left') {
      const year = selectedYear - 1;
      if (!selectedYearInterval.includes(year)) setSelectedYearInterval(getYearsInterval(year));
      return setSelectedYear(year);
    }

    if (mode === 'months' && direction === 'right') {
      const year = selectedYear + 1;
      if (!selectedYearInterval.includes(year)) setSelectedYearInterval(getYearsInterval(year));
      return setSelectedYear(year);
    }
    if (mode === 'years' && direction === 'left') {
      return setSelectedYearInterval(getYearsInterval(selectedYearInterval[0] - 10));
    }
    if (mode === 'years' && direction === 'right') {
      return setSelectedYearInterval(getYearsInterval(selectedYearInterval[0] + 10));
    }
  };

  const setSelectedMonthByIndex = (monthIndex: number) => {
    setSelectedMonth(createMonth({ date: new Date(selectedYear, monthIndex), locale }));
  };

  return {
    state: {
      mode,
      calendarDays,
      weekDaysNames,
      monthsNames,
      selectedDate,
      selectedMonth,
      selectedYear,
      selectedYearInterval
    },
    functions: {
      setMode,
      setSelectedDate,
      setSelectedMonthByIndex,
      onClickArrow,
      setSelectedYear
    }
  };
};
