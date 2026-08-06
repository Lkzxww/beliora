export const appointmentTimePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

function padTimePart(value: number) {
  return String(value).padStart(2, "0");
}

export function isValidAppointmentTime(time: string) {
  return appointmentTimePattern.test(time);
}

export function timeToMinutes(time: string) {
  const [hours = 0, minutes = 0] = time.split(":").map(Number);

  return hours * 60 + minutes;
}

export function minutesToTime(minutes: number) {
  const minutesInDay = 24 * 60;
  const normalizedMinutes =
    ((Math.round(minutes) % minutesInDay) + minutesInDay) % minutesInDay;
  const hours = Math.floor(normalizedMinutes / 60);
  const remainingMinutes = normalizedMinutes % 60;

  return `${padTimePart(hours)}:${padTimePart(remainingMinutes)}`;
}

export function addMinutesToTime(time: string, minutesToAdd: number) {
  if (!isValidAppointmentTime(time)) {
    return time;
  }

  return minutesToTime(timeToMinutes(time) + minutesToAdd);
}

export function isEndTimeAfterStartTime({
  endTime,
  startTime,
}: {
  endTime: string;
  startTime: string;
}) {
  return timeToMinutes(endTime) > timeToMinutes(startTime);
}

export function getDurationMinutes({
  endTime,
  startTime,
}: {
  endTime: string;
  startTime: string;
}) {
  return Math.max(timeToMinutes(endTime) - timeToMinutes(startTime), 0);
}

export function parseAppointmentDateTime(isoDate: string, time: string) {
  const [year = 0, month = 1, day = 1] = isoDate.split("-").map(Number);
  const [hours = 0, minutes = 0] = time.split(":").map(Number);

  return new Date(year, month - 1, day, hours, minutes, 0, 0);
}
