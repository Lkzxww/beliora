export type CustomerStatus = "active" | "archived";

export type Customer = Readonly<{
  archivedAt?: string;
  appointmentCount: number;
  createdAt: string;
  email?: string;
  id: string;
  initials: string;
  lastAppointmentLabel?: string;
  name: string;
  phone: string;
  status: CustomerStatus;
  upcomingAppointmentCount: number;
}>;

export type CustomerFormValues = Readonly<{
  email?: string;
  name: string;
  phone: string;
}>;

export type CustomerActionResult =
  | Readonly<{
      customer: Customer;
      success: true;
    }>
  | Readonly<{
      message: string;
      success: false;
    }>;

export type CustomerFilters = Readonly<{
  search: string;
  status: CustomerStatus | "all";
}>;

export type CustomerCounters = Readonly<{
  active: number;
  archived: number;
  total: number;
  upcomingAppointments: number;
}>;
