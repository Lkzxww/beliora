export type AppointmentStatus =
  | "confirmed"
  | "scheduled"
  | "completed"
  | "canceled";

export type AppointmentServerStatus =
  | "SCHEDULED"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELED";

export type AppointmentViewMode = "day" | "week" | "month";

export type AppointmentViewOption = {
  label: string;
  value: AppointmentViewMode;
};

export type AppointmentCustomerOption = {
  id: string;
  name: string;
  phone: string;
};

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
  id: string;
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

export type AppointmentOptions = {
  customers: AppointmentCustomerOption[];
  professionals: AppointmentProfessional[];
  services: AppointmentService[];
  statuses: AppointmentFilterOption[];
  viewOptions: AppointmentViewOption[];
};

export type AppointmentFormValues = {
  customerId: string;
  employeeId: string;
  endTime: string;
  isoDate: string;
  notes: string;
  serviceId: string;
  startTime: string;
};

export type AppointmentActionResult =
  | {
      appointment: Appointment;
      success: true;
    }
  | {
      message: string;
      success: false;
    };

export type AppointmentFilters = {
  professionalId: string;
  search: string;
  serviceId: string;
  status: string;
};
