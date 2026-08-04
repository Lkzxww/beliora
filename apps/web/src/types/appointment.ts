export type AppointmentStatus =
  | "confirmed"
  | "scheduled"
  | "completed"
  | "canceled";

export type AppointmentViewMode = "day" | "week" | "month";

export type AppointmentProfessional = {
  id: string;
  name: string;
  role: string;
};

export type AppointmentService = {
  id: string;
  name: string;
  durationMinutes: number;
  priceLabel: string;
};

export type AppointmentCustomer = {
  name: string;
  phone: string;
  initials: string;
};

export type Appointment = {
  id: string;
  isoDate: string;
  dayLabel: string;
  startTime: string;
  endTime: string;
  customer: AppointmentCustomer;
  professional: AppointmentProfessional;
  service: AppointmentService;
  status: AppointmentStatus;
  room: string;
  paymentStatus: string;
  notes?: string;
};

export type AppointmentWeekDay = {
  isoDate: string;
  weekDay: string;
  shortLabel: string;
  dayNumber: string;
  isToday?: boolean;
};

export type AppointmentFilterOption = {
  value: string;
  label: string;
};

export type AppointmentFilters = {
  professionalId: string;
  search: string;
  serviceId: string;
  status: string;
};
