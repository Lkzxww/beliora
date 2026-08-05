import type {
  Appointment,
  AppointmentViewMode,
  AppointmentWeekDay,
} from "@/types/appointment";

const weekDayLabels = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
] as const;

const shortWeekDayLabels = [
  "Dom",
  "Seg",
  "Ter",
  "Qua",
  "Qui",
  "Sex",
  "Sáb",
] as const;

const monthLabels = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
] as const;

const shortMonthLabels = [
  "jan",
  "fev",
  "mar",
  "abr",
  "mai",
  "jun",
  "jul",
  "ago",
  "set",
  "out",
  "nov",
  "dez",
] as const;

export type AppointmentCalendarSummary = Readonly<{
  monthLabel: string;
  selectedView: AppointmentViewMode;
  weekLabel: string;
}>;

export type CurrentTimeMarker = Readonly<{
  isoDate: string;
  timeLabel: string;
}>;

export type AppointmentLayout = Readonly<{
  appointment: Appointment;
  height: number;
  isOverlapping: boolean;
  left: string;
  top: number;
  width: string;
}>;

type TimeOffsetOptions = Readonly<{
  calendarHeightPixels: number;
  calendarStartMinutes: number;
  hourHeightPixels: number;
}>;

type AppointmentLayoutOptions = TimeOffsetOptions &
  Readonly<{
    columnGapPixels: number;
    minimumHeightPixels: number;
  }>;

type AppointmentTimeBounds = Readonly<{
  appointment: Appointment;
  endsAt: number;
  startsAt: number;
}>;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function padDatePart(value: number) {
  return String(value).padStart(2, "0");
}

export function addDays(date: Date, days: number) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

export function addWeeks(date: Date, weeks: number) {
  return addDays(date, weeks * 7);
}

export function formatIsoDate(date: Date) {
  return [
    date.getFullYear(),
    padDatePart(date.getMonth() + 1),
    padDatePart(date.getDate()),
  ].join("-");
}

export function parseIsoDate(isoDate: string) {
  const [year = 0, month = 1, day = 1] = isoDate.split("-").map(Number);

  return new Date(year, month - 1, day);
}

export function getStartOfWeek(date: Date) {
  const day = startOfDay(date);
  const weekDay = day.getDay();
  const diff = weekDay === 0 ? -6 : 1 - weekDay;

  return addDays(day, diff);
}

export function getAppointmentWeekDays(
  weekStart: Date,
  todayIsoDate: string,
): AppointmentWeekDay[] {
  return Array.from({ length: 7 }, (_, index) => {
    const date = addDays(weekStart, index);
    const isoDate = formatIsoDate(date);
    const weekDay = date.getDay();

    return {
      dayNumber: padDatePart(date.getDate()),
      isToday: isoDate === todayIsoDate,
      isoDate,
      shortLabel: shortWeekDayLabels[weekDay],
      weekDay: weekDayLabels[weekDay],
    };
  });
}

export function getAppointmentDayLabel(isoDate: string) {
  const date = parseIsoDate(isoDate);

  return `${weekDayLabels[date.getDay()]}, ${padDatePart(
    date.getDate(),
  )} ${shortMonthLabels[date.getMonth()]}`;
}

export function getAppointmentCalendarSummary({
  selectedView,
  weekDays,
}: {
  selectedView: AppointmentViewMode;
  weekDays: AppointmentWeekDay[];
}): AppointmentCalendarSummary {
  const firstDay = weekDays[0];
  const lastDay = weekDays.at(-1);

  if (!firstDay || !lastDay) {
    return {
      monthLabel: "",
      selectedView,
      weekLabel: "",
    };
  }

  const firstDate = parseIsoDate(firstDay.isoDate);
  const lastDate = parseIsoDate(lastDay.isoDate);
  const sameMonth = firstDate.getMonth() === lastDate.getMonth();
  const sameYear = firstDate.getFullYear() === lastDate.getFullYear();
  const monthLabel =
    sameMonth && sameYear
      ? `${monthLabels[firstDate.getMonth()]} ${firstDate.getFullYear()}`
      : `${monthLabels[firstDate.getMonth()]} ${firstDate.getFullYear()} / ${
          monthLabels[lastDate.getMonth()]
        } ${lastDate.getFullYear()}`;
  const weekLabel =
    sameMonth && sameYear
      ? `${firstDay.dayNumber} - ${lastDay.dayNumber} ${
          shortMonthLabels[lastDate.getMonth()]
        } ${lastDate.getFullYear()}`
      : `${firstDay.dayNumber} ${shortMonthLabels[firstDate.getMonth()]} - ${
          lastDay.dayNumber
        } ${shortMonthLabels[lastDate.getMonth()]} ${lastDate.getFullYear()}`;

  return {
    monthLabel,
    selectedView,
    weekLabel,
  };
}

export function timeToMinutes(time: string) {
  const [hours = 0, minutes = 0] = time.split(":").map(Number);

  return hours * 60 + minutes;
}

export function getCurrentTimeMarker(date: Date = new Date()) {
  return {
    isoDate: formatIsoDate(date),
    timeLabel: `${padDatePart(date.getHours())}:${padDatePart(
      date.getMinutes(),
    )}`,
  };
}

export function getTimeOffsetPixels(
  time: string,
  {
    calendarHeightPixels,
    calendarStartMinutes,
    hourHeightPixels,
  }: TimeOffsetOptions,
) {
  const minutes = timeToMinutes(time);
  const offset = ((minutes - calendarStartMinutes) / 60) * hourHeightPixels;

  return clamp(offset, 0, calendarHeightPixels);
}

export function sortAppointmentsByTime(appointments: Appointment[]) {
  return [...appointments].sort((firstAppointment, secondAppointment) => {
    const firstStart = timeToMinutes(firstAppointment.startTime);
    const secondStart = timeToMinutes(secondAppointment.startTime);

    if (firstStart !== secondStart) {
      return firstStart - secondStart;
    }

    return (
      timeToMinutes(firstAppointment.endTime) -
      timeToMinutes(secondAppointment.endTime)
    );
  });
}

function getAppointmentHeight(
  appointment: AppointmentTimeBounds,
  options: AppointmentLayoutOptions,
) {
  const durationMinutes = Math.max(appointment.endsAt - appointment.startsAt, 30);
  const proportionalHeight =
    (durationMinutes / 60) * options.hourHeightPixels;

  return Math.max(proportionalHeight, options.minimumHeightPixels);
}

function getAppointmentTop(
  appointment: AppointmentTimeBounds,
  options: AppointmentLayoutOptions,
  height: number,
) {
  const rawTop =
    ((appointment.startsAt - options.calendarStartMinutes) / 60) *
    options.hourHeightPixels;
  const maximumTop = Math.max(options.calendarHeightPixels - height - 12, 0);

  return clamp(rawTop, 0, maximumTop);
}

function getGroupLayouts(
  group: AppointmentTimeBounds[],
  options: AppointmentLayoutOptions,
) {
  const columnEndMinutes: number[] = [];
  const assignments = group.map((appointment) => {
    const reusableColumnIndex = columnEndMinutes.findIndex(
      (endMinutes) => endMinutes <= appointment.startsAt,
    );
    const columnIndex =
      reusableColumnIndex === -1
        ? columnEndMinutes.length
        : reusableColumnIndex;

    columnEndMinutes[columnIndex] = appointment.endsAt;

    return {
      appointment,
      columnIndex,
    };
  });
  const columnCount = Math.max(columnEndMinutes.length, 1);
  const columnWidthPercentage = 100 / columnCount;
  const width =
    columnCount === 1
      ? "100%"
      : `calc(${columnWidthPercentage}% - ${
          ((columnCount - 1) * options.columnGapPixels) / columnCount
        }px)`;

  return assignments.map<AppointmentLayout>((assignment) => {
    const height = getAppointmentHeight(assignment.appointment, options);
    const left =
      columnCount === 1
        ? "0%"
        : `calc(${assignment.columnIndex * columnWidthPercentage}% + ${
            (assignment.columnIndex * options.columnGapPixels) / columnCount
          }px)`;

    return {
      appointment: assignment.appointment.appointment,
      height,
      isOverlapping: columnCount > 1,
      left,
      top: getAppointmentTop(assignment.appointment, options, height),
      width,
    };
  });
}

export function getDayAppointmentLayouts(
  appointments: Appointment[],
  options: AppointmentLayoutOptions,
) {
  const sortedAppointments = sortAppointmentsByTime(appointments).map(
    (appointment) => ({
      appointment,
      endsAt: timeToMinutes(appointment.endTime),
      startsAt: timeToMinutes(appointment.startTime),
    }),
  );
  const groups: AppointmentTimeBounds[][] = [];
  let currentGroup: AppointmentTimeBounds[] = [];
  let currentGroupEnd = -Infinity;

  for (const appointment of sortedAppointments) {
    if (
      currentGroup.length === 0 ||
      appointment.startsAt < currentGroupEnd
    ) {
      currentGroup.push(appointment);
      currentGroupEnd = Math.max(currentGroupEnd, appointment.endsAt);
      continue;
    }

    groups.push(currentGroup);
    currentGroup = [appointment];
    currentGroupEnd = appointment.endsAt;
  }

  if (currentGroup.length > 0) {
    groups.push(currentGroup);
  }

  return groups.flatMap((group) => getGroupLayouts(group, options));
}
