import { AppointmentStatus as PrismaAppointmentStatus } from "../apps/web/src/generated/prisma/client";
import { prisma } from "../apps/web/src/lib/prisma";
import {
  DEMO_COMPANY_ID,
  DEMO_COMPANY_SLUG,
} from "../apps/web/src/services/appointments/demo-company";

const demoEmployees = [
  {
    active: true,
    email: "lia.martins@beliora.demo",
    id: "demo-employee-lia",
    name: "Lia Martins",
    phone: "(11) 90000-1001",
  },
  {
    active: true,
    email: "bruna.costa@beliora.demo",
    id: "demo-employee-bruna",
    name: "Bruna Costa",
    phone: "(11) 90000-1002",
  },
  {
    active: true,
    email: "nina.paiva@beliora.demo",
    id: "demo-employee-nina",
    name: "Nina Paiva",
    phone: "(11) 90000-1003",
  },
  {
    active: true,
    email: "ana.souza@beliora.demo",
    id: "demo-employee-ana",
    name: "Ana Souza",
    phone: "(11) 90000-1004",
  },
] as const;

const demoCustomers = [
  {
    archivedAt: null,
    email: "marina.alves@cliente.demo",
    id: "demo-customer-marina",
    name: "Marina Alves",
    phone: "(11) 99822-4101",
  },
  {
    archivedAt: null,
    email: "camila.torres@cliente.demo",
    id: "demo-customer-camila",
    name: "Camila Torres",
    phone: "(11) 98774-3310",
  },
  {
    archivedAt: null,
    email: "renata.lima@cliente.demo",
    id: "demo-customer-renata",
    name: "Renata Lima",
    phone: "(11) 91245-8812",
  },
  {
    archivedAt: null,
    email: "helena.castro@cliente.demo",
    id: "demo-customer-helena",
    name: "Helena Castro",
    phone: "(11) 94427-6120",
  },
  {
    archivedAt: null,
    email: "bianca.rocha@cliente.demo",
    id: "demo-customer-bianca",
    name: "Bianca Rocha",
    phone: "(11) 97662-9044",
  },
  {
    archivedAt: null,
    email: "laura.mendes@cliente.demo",
    id: "demo-customer-laura",
    name: "Laura Mendes",
    phone: "(11) 93301-7782",
  },
  {
    archivedAt: null,
    email: "paula.nunes@cliente.demo",
    id: "demo-customer-paula",
    name: "Paula Nunes",
    phone: "(11) 95521-7064",
  },
  {
    archivedAt: new Date("2026-07-18T12:00:00.000Z"),
    email: "sofia.barreto@cliente.demo",
    id: "demo-customer-sofia",
    name: "Sofia Barreto",
    phone: "(11) 92241-5108",
  },
] as const;

const demoServices = [
  {
    description: "Corte com hidratação e finalização.",
    duration: 90,
    id: "demo-service-hair-hydration",
    name: "Corte + hidratação",
    price: "220.00",
  },
  {
    description: "Manicure em gel com acabamento premium.",
    duration: 60,
    id: "demo-service-gel-nails",
    name: "Manicure gel",
    price: "160.00",
  },
  {
    description: "Design de sobrancelhas com acabamento natural.",
    duration: 30,
    id: "demo-service-brow-design",
    name: "Design de sobrancelhas",
    price: "90.00",
  },
  {
    description: "Limpeza de pele com protocolo essencial.",
    duration: 60,
    id: "demo-service-skin-cleaning",
    name: "Limpeza de pele",
    price: "180.00",
  },
  {
    description: "Escova modelada para eventos e finalizações.",
    duration: 60,
    id: "demo-service-styled-blowout",
    name: "Escova modelada",
    price: "130.00",
  },
] as const;

const demoAppointmentIds = [
  "demo-appointment-confirmed-01",
  "demo-appointment-pending-01",
  "demo-appointment-completed-01",
  "demo-appointment-canceled-01",
  "demo-appointment-overlap-confirmed",
  "demo-appointment-overlap-pending",
  "demo-appointment-long-01",
] as const;

type SeedCounts = {
  appointments: number;
  companies: number;
  customers: number;
  employees: number;
  services: number;
};

function getStartOfCurrentWeek(date = new Date()) {
  const day = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const weekDay = day.getDay();
  const diff = weekDay === 0 ? -6 : 1 - weekDay;

  return new Date(day.getFullYear(), day.getMonth(), day.getDate() + diff);
}

function getDateInCurrentWeek(dayOffset: number, time: string) {
  const [hours = 0, minutes = 0] = time.split(":").map(Number);
  const weekStart = getStartOfCurrentWeek();

  return new Date(
    weekStart.getFullYear(),
    weekStart.getMonth(),
    weekStart.getDate() + dayOffset,
    hours,
    minutes,
    0,
    0,
  );
}

function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60_000);
}

async function countDemoRecords(): Promise<SeedCounts> {
  const [companies, employees, customers, services, appointments] =
    await Promise.all([
      prisma.company.count({
        where: {
          slug: DEMO_COMPANY_SLUG,
        },
      }),
      prisma.employee.count({
        where: {
          id: {
            in: demoEmployees.map((employee) => employee.id),
          },
        },
      }),
      prisma.customer.count({
        where: {
          id: {
            in: demoCustomers.map((customer) => customer.id),
          },
        },
      }),
      prisma.service.count({
        where: {
          id: {
            in: demoServices.map((service) => service.id),
          },
        },
      }),
      prisma.appointment.count({
        where: {
          id: {
            in: [...demoAppointmentIds],
          },
        },
      }),
    ]);

  return {
    appointments,
    companies,
    customers,
    employees,
    services,
  };
}

function subtractCounts(after: SeedCounts, before: SeedCounts): SeedCounts {
  return {
    appointments: after.appointments - before.appointments,
    companies: after.companies - before.companies,
    customers: after.customers - before.customers,
    employees: after.employees - before.employees,
    services: after.services - before.services,
  };
}

async function seedCompany() {
  return prisma.company.upsert({
    create: {
      email: "contato@beliora.demo",
      id: DEMO_COMPANY_ID,
      name: "Beliora Demo",
      phone: "(11) 4002-2026",
      slug: DEMO_COMPANY_SLUG,
    },
    update: {
      email: "contato@beliora.demo",
      name: "Beliora Demo",
      phone: "(11) 4002-2026",
    },
    where: {
      slug: DEMO_COMPANY_SLUG,
    },
  });
}

async function seedEmployees(companyId: string) {
  for (const employee of demoEmployees) {
    await prisma.employee.upsert({
      create: {
        ...employee,
        company: {
          connect: {
            id: companyId,
          },
        },
      },
      update: {
        active: employee.active,
        email: employee.email,
        name: employee.name,
        phone: employee.phone,
      },
      where: {
        id: employee.id,
      },
    });
  }
}

async function seedCustomers(companyId: string) {
  for (const customer of demoCustomers) {
    await prisma.customer.upsert({
      create: {
        ...customer,
        company: {
          connect: {
            id: companyId,
          },
        },
      },
      update: {
        archivedAt: customer.archivedAt,
        email: customer.email,
        name: customer.name,
        phone: customer.phone,
      },
      where: {
        id: customer.id,
      },
    });
  }
}

async function seedServices(companyId: string) {
  for (const service of demoServices) {
    await prisma.service.upsert({
      create: {
        ...service,
        company: {
          connect: {
            id: companyId,
          },
        },
      },
      update: {
        description: service.description,
        duration: service.duration,
        name: service.name,
        price: service.price,
      },
      where: {
        id: service.id,
      },
    });
  }
}

async function seedAppointments(companyId: string) {
  const appointmentSeeds = [
    {
      customerId: "demo-customer-marina",
      employeeId: "demo-employee-lia",
      id: "demo-appointment-confirmed-01",
      notes: "Cliente prefere finalização com escova modelada.",
      serviceId: "demo-service-hair-hydration",
      startsAt: getDateInCurrentWeek(1, "09:00"),
      status: PrismaAppointmentStatus.CONFIRMED,
    },
    {
      customerId: "demo-customer-camila",
      employeeId: "demo-employee-bruna",
      id: "demo-appointment-pending-01",
      notes: "Confirmar preferência de esmalte no início do atendimento.",
      serviceId: "demo-service-gel-nails",
      startsAt: getDateInCurrentWeek(1, "11:00"),
      status: PrismaAppointmentStatus.SCHEDULED,
    },
    {
      customerId: "demo-customer-renata",
      employeeId: "demo-employee-nina",
      id: "demo-appointment-completed-01",
      notes: "Retorno em 30 dias sugerido.",
      serviceId: "demo-service-brow-design",
      startsAt: getDateInCurrentWeek(2, "15:00"),
      status: PrismaAppointmentStatus.COMPLETED,
    },
    {
      customerId: "demo-customer-bianca",
      employeeId: "demo-employee-ana",
      id: "demo-appointment-canceled-01",
      notes: "Cancelado pela cliente.",
      serviceId: "demo-service-skin-cleaning",
      startsAt: getDateInCurrentWeek(3, "14:00"),
      status: PrismaAppointmentStatus.CANCELED,
    },
    {
      customerId: "demo-customer-helena",
      employeeId: "demo-employee-bruna",
      id: "demo-appointment-overlap-confirmed",
      notes: "Atendimento sobreposto para validar layout lado a lado.",
      serviceId: "demo-service-gel-nails",
      startsAt: getDateInCurrentWeek(2, "11:15"),
      status: PrismaAppointmentStatus.CONFIRMED,
    },
    {
      customerId: "demo-customer-renata",
      employeeId: "demo-employee-nina",
      id: "demo-appointment-overlap-pending",
      notes: "Horário curto para manutenção.",
      serviceId: "demo-service-brow-design",
      startsAt: getDateInCurrentWeek(2, "11:00"),
      status: PrismaAppointmentStatus.SCHEDULED,
    },
    {
      customerId: "demo-customer-laura",
      employeeId: "demo-employee-lia",
      id: "demo-appointment-long-01",
      notes: "Reservar tempo extra para finalização.",
      serviceId: "demo-service-hair-hydration",
      startsAt: getDateInCurrentWeek(4, "16:30"),
      status: PrismaAppointmentStatus.SCHEDULED,
    },
  ] as const;

  for (const appointment of appointmentSeeds) {
    const service = demoServices.find(
      (item) => item.id === appointment.serviceId,
    );

    if (!service) {
      throw new Error(`Serviço de demonstração não encontrado: ${appointment.serviceId}`);
    }

    await prisma.appointment.upsert({
      create: {
        company: {
          connect: {
            id: companyId,
          },
        },
        customer: {
          connect: {
            id: appointment.customerId,
          },
        },
        employee: {
          connect: {
            id: appointment.employeeId,
          },
        },
        endsAt: addMinutes(appointment.startsAt, service.duration),
        id: appointment.id,
        notes: appointment.notes,
        service: {
          connect: {
            id: appointment.serviceId,
          },
        },
        startsAt: appointment.startsAt,
        status: appointment.status,
      },
      update: {
        company: {
          connect: {
            id: companyId,
          },
        },
        customer: {
          connect: {
            id: appointment.customerId,
          },
        },
        employee: {
          connect: {
            id: appointment.employeeId,
          },
        },
        endsAt: addMinutes(appointment.startsAt, service.duration),
        notes: appointment.notes,
        service: {
          connect: {
            id: appointment.serviceId,
          },
        },
        startsAt: appointment.startsAt,
        status: appointment.status,
      },
      where: {
        id: appointment.id,
      },
    });
  }
}

async function main() {
  const before = await countDemoRecords();
  const company = await seedCompany();

  await seedEmployees(company.id);
  await seedCustomers(company.id);
  await seedServices(company.id);
  await seedAppointments(company.id);

  const after = await countDemoRecords();
  const created = subtractCounts(after, before);

  console.log("Seed Beliora Demo concluído.");
  console.log({ created, totals: after });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
