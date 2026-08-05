import { AppointmentCard } from "@/components/appointments/appointment-card";
import {
  getDayAppointmentLayouts,
  getTimeOffsetPixels,
  type CurrentTimeMarker,
} from "@/components/appointments/appointment-calendar-utils";
import type { Appointment, AppointmentWeekDay } from "@/types/appointment";
import { cn } from "@/lib/utils";

type AppointmentCalendarProps = Readonly<{
  appointments: Appointment[];
  currentTimeMarker?: CurrentTimeMarker;
  onSelectAppointment?: (appointment: Appointment) => void;
  selectedAppointmentId?: string;
  weekDays: AppointmentWeekDay[];
}>;

const timeSlots = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
];

const calendarStartMinutes = 8 * 60;
const calendarEndMinutes = 19 * 60;
const calendarDurationMinutes = calendarEndMinutes - calendarStartMinutes;
const hourHeightPixels = 84;
const calendarHeightPixels =
  (calendarDurationMinutes / 60) * hourHeightPixels;
const minimumAppointmentHeightPixels = 132;
const appointmentColumnGapPixels = 8;
const hourRows = timeSlots.slice(0, -1);

export function AppointmentCalendar({
  appointments,
  currentTimeMarker,
  onSelectAppointment,
  selectedAppointmentId,
  weekDays,
}: AppointmentCalendarProps) {
  const shouldShowCurrentTime =
    currentTimeMarker &&
    weekDays.some((day) => day.isoDate === currentTimeMarker.isoDate);
  const currentTimeOffset = shouldShowCurrentTime
    ? getTimeOffsetPixels(currentTimeMarker.timeLabel, {
        calendarHeightPixels,
        calendarStartMinutes,
        hourHeightPixels,
      })
    : undefined;

  return (
    <section className="hidden rounded-[2rem] border border-[#eadfd3] bg-white/[0.82] shadow-[0_18px_50px_rgba(48,37,28,0.08)] dark:border-white/10 dark:bg-card/[0.88] md:block">
      <div className="overflow-x-auto scroll-smooth rounded-[2rem] overscroll-x-contain [scrollbar-width:thin]">
        <div className="min-w-[1916px]">
          <div className="sticky top-[4.5rem] z-30 grid grid-cols-[96px_repeat(7,minmax(260px,1fr))] border-b border-[#efe4d8] bg-[#fffbf5]/95 backdrop-blur dark:border-white/10 dark:bg-[#161412]/95">
            <div className="sticky left-0 z-40 border-r border-[#efe4d8] bg-[#fffbf5]/95 px-4 py-4 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#9a8a7a] dark:border-white/10 dark:bg-[#161412]/95 dark:text-muted-foreground">
              Horário
            </div>

            {weekDays.map((day) => (
              <div
                key={day.isoDate}
                className={cn(
                  "border-r border-[#efe4d8] px-4 py-4 last:border-r-0 dark:border-white/10",
                  day.isToday && "bg-[#f8eedf] dark:bg-[#c9a76a]/10",
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#9a8a7a] dark:text-muted-foreground">
                      {day.shortLabel.toUpperCase()}
                    </p>
                    <p className="mt-1 text-3xl font-semibold leading-none text-[#211b18] dark:text-foreground">
                      {day.dayNumber}
                    </p>
                  </div>

                  {day.isToday ? (
                    <span className="rounded-full bg-[#7a2638] px-2.5 py-1 text-[0.68rem] font-semibold text-white shadow-sm">
                      Hoje
                    </span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          <div className="relative grid grid-cols-[96px_repeat(7,minmax(260px,1fr))]">
            <div
              className="sticky left-0 z-20 border-r border-[#efe4d8] bg-[#fffaf4]/95 dark:border-white/10 dark:bg-[#161412]/95"
              style={{ height: calendarHeightPixels }}
            >
              {hourRows.map((time) => (
                <div
                  key={`hour-row-${time}`}
                  className="border-b border-[#f0e5da] dark:border-white/10"
                  style={{ height: hourHeightPixels }}
                />
              ))}

              {timeSlots.map((time, index) => (
                <span
                  key={time}
                  className={cn(
                    "absolute right-3 -translate-y-1/2 text-[0.72rem] font-semibold text-[#9a8a7a] dark:text-muted-foreground",
                    index === 0 && "translate-y-0",
                    index === timeSlots.length - 1 && "-translate-y-full",
                  )}
                  style={{
                    top: getTimeOffsetPixels(time, {
                      calendarHeightPixels,
                      calendarStartMinutes,
                      hourHeightPixels,
                    }),
                  }}
                >
                  {time}
                </span>
              ))}
            </div>

            {currentTimeOffset !== undefined && currentTimeMarker ? (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-[96px] right-0 z-20 flex items-center"
                style={{ top: currentTimeOffset }}
              >
                <span className="ml-2 rounded-full bg-[#c53636] px-2 py-0.5 text-[0.65rem] font-semibold text-white shadow-sm">
                  {currentTimeMarker.timeLabel}
                </span>
                <span className="h-px flex-1 bg-[#c53636] shadow-[0_0_0_1px_rgba(197,54,54,0.16)]" />
              </div>
            ) : null}

            {weekDays.map((day) => {
              const dayAppointments = appointments.filter(
                (appointment) => appointment.isoDate === day.isoDate,
              );
              const dayAppointmentLayouts = getDayAppointmentLayouts(
                dayAppointments,
                {
                  calendarHeightPixels,
                  calendarStartMinutes,
                  columnGapPixels: appointmentColumnGapPixels,
                  hourHeightPixels,
                  minimumHeightPixels: minimumAppointmentHeightPixels,
                },
              );

              return (
                <div
                  key={day.isoDate}
                  className={cn(
                    "relative border-r border-[#efe4d8] last:border-r-0 dark:border-white/10",
                    day.isToday && "bg-[#fff6ed] dark:bg-[#c9a76a]/[0.06]",
                  )}
                  style={{ height: calendarHeightPixels }}
                >
                  <div className="absolute inset-0">
                    {hourRows.map((time, index) => (
                      <div
                        key={`${day.isoDate}-${time}`}
                        className={cn(
                          "border-b border-[#f3e9df] dark:border-white/[0.07]",
                          index === hourRows.length - 1 && "border-b-0",
                        )}
                        style={{ height: hourHeightPixels }}
                      />
                    ))}
                  </div>

                  {dayAppointmentLayouts.length > 0 ? (
                    <div className="absolute inset-x-3 inset-y-0 z-10">
                      {dayAppointmentLayouts.map((layout) => (
                        <div
                          key={layout.appointment.id}
                          className="absolute"
                          style={{
                            height: layout.height,
                            left: layout.left,
                            top: layout.top,
                            width: layout.width,
                          }}
                        >
                          <AppointmentCard
                            appointment={layout.appointment}
                            compact
                            dense={layout.isOverlapping}
                            isSelected={
                              layout.appointment.id === selectedAppointmentId
                            }
                            onSelectAppointment={onSelectAppointment}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="absolute inset-x-3 top-4 z-10 rounded-2xl border border-dashed border-[#ead9c4] bg-[#fffaf4]/80 px-4 py-5 text-center text-xs font-medium leading-5 text-[#9c8f84] dark:border-white/10 dark:bg-white/[0.03] dark:text-muted-foreground">
                      Agenda livre
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
