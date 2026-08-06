export const SERVICE_CATEGORIES = [
  "Masculino",
  "Feminino",
  "Coloração",
  "Tratamento",
  "Estética",
  "Outros",
] as const;

export const SERVICE_DURATION_OPTIONS = [15, 30, 45, 60, 90, 120] as const;

export const SERVICE_COLOR_OPTIONS = [
  "#7a2638",
  "#c9a76a",
  "#52745e",
  "#9a6b21",
  "#8a4545",
  "#354052",
  "#b86b46",
  "#6f7f6d",
] as const;

export type ServiceCategory = (typeof SERVICE_CATEGORIES)[number];
export type ServiceColor = (typeof SERVICE_COLOR_OPTIONS)[number];
export type ServiceDuration = (typeof SERVICE_DURATION_OPTIONS)[number];
export type ServiceStatus = "active" | "archived";

export type Service = Readonly<{
  archivedAt?: string;
  appointmentCount: number;
  category: ServiceCategory;
  color: ServiceColor;
  createdAt: string;
  description?: string;
  duration: ServiceDuration;
  durationLabel: string;
  id: string;
  name: string;
  price: string;
  priceLabel: string;
  status: ServiceStatus;
}>;

export type ServiceFormValues = Readonly<{
  category: ServiceCategory;
  color: ServiceColor;
  description?: string;
  duration: ServiceDuration;
  name: string;
  price: string;
}>;

export type ServiceActionResult =
  | Readonly<{
      service: Service;
      success: true;
    }>
  | Readonly<{
      message: string;
      success: false;
    }>;

export type ServiceFilters = Readonly<{
  category: ServiceCategory | "all";
  search: string;
  status: ServiceStatus | "all";
}>;

export type ServiceCounters = Readonly<{
  active: number;
  archived: number;
  averageDurationLabel: string;
  averagePriceLabel: string;
  total: number;
}>;
