import type {
  Appointment as PrismaAppointment,
  Service as PrismaService,
} from "@/generated/prisma/client";
import {
  SERVICE_CATEGORIES,
  SERVICE_COLOR_OPTIONS,
  SERVICE_DURATION_OPTIONS,
  type Service,
  type ServiceCategory,
  type ServiceColor,
  type ServiceDuration,
} from "@/types/service";

export type PrismaServiceWithAppointments = PrismaService & {
  appointments: Array<Pick<PrismaAppointment, "id">>;
};

function formatPriceLabel(service: PrismaService) {
  return new Intl.NumberFormat("pt-BR", {
    currency: "BRL",
    style: "currency",
  }).format(service.price.toNumber());
}

function normalizeServiceCategory(category: string): ServiceCategory {
  const knownCategory = SERVICE_CATEGORIES.find((item) => item === category);

  return knownCategory ?? "Outros";
}

function normalizeServiceDuration(duration: number): ServiceDuration {
  const knownDuration = SERVICE_DURATION_OPTIONS.find(
    (durationOption) => durationOption === duration,
  );

  return knownDuration ?? 60;
}

function normalizeServiceColor(color: string): ServiceColor {
  const knownColor = SERVICE_COLOR_OPTIONS.find((item) => item === color);

  return knownColor ?? SERVICE_COLOR_OPTIONS[0];
}

export function mapPrismaServiceToService(
  service: PrismaServiceWithAppointments,
): Service {
  const duration = normalizeServiceDuration(service.duration);

  return {
    archivedAt: service.archivedAt?.toISOString(),
    appointmentCount: service.appointments.length,
    category: normalizeServiceCategory(service.category),
    color: normalizeServiceColor(service.color),
    createdAt: service.createdAt.toISOString(),
    description: service.description ?? undefined,
    duration,
    durationLabel: `${duration} min`,
    id: service.id,
    name: service.name,
    price: service.price.toFixed(2),
    priceLabel: formatPriceLabel(service),
    status: service.archivedAt ? "archived" : "active",
  };
}
