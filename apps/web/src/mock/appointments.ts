import type {
  Appointment,
  AppointmentFilterOption,
  AppointmentProfessional,
  AppointmentService,
  AppointmentViewMode,
} from "@/types/appointment";

export const appointmentProfessionals: AppointmentProfessional[] = [
  {
    id: "lia",
    name: "Lia Martins",
    role: "Cabeleireira",
  },
  {
    id: "bruna",
    name: "Bruna Costa",
    role: "Nail designer",
  },
  {
    id: "nina",
    name: "Nina Paiva",
    role: "Designer de sobrancelhas",
  },
  {
    id: "ana",
    name: "Ana Souza",
    role: "Esteticista",
  },
];

export const appointmentServices: AppointmentService[] = [
  {
    id: "hair-hydration",
    name: "Corte + hidratação",
    durationMinutes: 90,
    priceLabel: "R$ 220",
  },
  {
    id: "gel-nails",
    name: "Manicure gel",
    durationMinutes: 75,
    priceLabel: "R$ 160",
  },
  {
    id: "brow-design",
    name: "Design de sobrancelhas",
    durationMinutes: 45,
    priceLabel: "R$ 90",
  },
  {
    id: "skin-cleaning",
    name: "Limpeza de pele",
    durationMinutes: 60,
    priceLabel: "R$ 180",
  },
];

export const appointmentStatusOptions: AppointmentFilterOption[] = [
  {
    value: "all",
    label: "Todos os status",
  },
  {
    value: "confirmed",
    label: "Confirmados",
  },
  {
    value: "scheduled",
    label: "Agendados",
  },
  {
    value: "completed",
    label: "Concluídos",
  },
  {
    value: "canceled",
    label: "Cancelados",
  },
];

export const appointmentViewOptions: Array<{
  value: AppointmentViewMode;
  label: string;
}> = [
  {
    value: "day",
    label: "Dia",
  },
  {
    value: "week",
    label: "Semana",
  },
  {
    value: "month",
    label: "Mês",
  },
];

const [hairHydration, gelNails, browDesign, skinCleaning] =
  appointmentServices;
const [lia, bruna, nina, ana] = appointmentProfessionals;

export const mockAppointments: Appointment[] = [
  {
    id: "apt-001",
    isoDate: "2026-08-04",
    dayLabel: "Terça, 04 ago",
    startTime: "09:00",
    endTime: "10:30",
    customer: {
      id: "mock-customer-marina",
      name: "Marina Alves",
      phone: "(11) 99822-4101",
      initials: "MA",
    },
    professional: lia,
    service: hairHydration,
    status: "confirmed",
    room: "Sala 01",
    paymentStatus: "Sinal pago",
    notes: "Cliente prefere finalização com escova modelada.",
  },
  {
    id: "apt-002",
    isoDate: "2026-08-04",
    dayLabel: "Terça, 04 ago",
    startTime: "10:45",
    endTime: "12:00",
    customer: {
      id: "mock-customer-camila",
      name: "Camila Torres",
      phone: "(11) 98774-3310",
      initials: "CT",
    },
    professional: bruna,
    service: gelNails,
    status: "scheduled",
    room: "Mesa 02",
    paymentStatus: "A receber",
  },
  {
    id: "apt-003",
    isoDate: "2026-08-05",
    dayLabel: "Quarta, 05 ago",
    startTime: "11:00",
    endTime: "11:45",
    customer: {
      id: "mock-customer-renata",
      name: "Renata Lima",
      phone: "(11) 91245-8812",
      initials: "RL",
    },
    professional: nina,
    service: browDesign,
    status: "confirmed",
    room: "Sala 03",
    paymentStatus: "A receber",
    notes: "Retorno em 30 dias sugerido.",
  },
  {
    id: "apt-007",
    isoDate: "2026-08-05",
    dayLabel: "Quarta, 05 ago",
    startTime: "11:15",
    endTime: "12:15",
    customer: {
      id: "mock-customer-helena",
      name: "Helena Castro",
      phone: "(11) 94427-6120",
      initials: "HC",
    },
    professional: bruna,
    service: gelNails,
    status: "scheduled",
    room: "Mesa 02",
    paymentStatus: "A receber",
    notes: "Atendimento sobreposto para validar layout lado a lado.",
  },
  {
    id: "apt-004",
    isoDate: "2026-08-06",
    dayLabel: "Quinta, 06 ago",
    startTime: "14:00",
    endTime: "15:00",
    customer: {
      id: "mock-customer-bianca",
      name: "Bianca Rocha",
      phone: "(11) 97662-9044",
      initials: "BR",
    },
    professional: ana,
    service: skinCleaning,
    status: "scheduled",
    room: "Cabine 01",
    paymentStatus: "A receber",
  },
  {
    id: "apt-005",
    isoDate: "2026-08-07",
    dayLabel: "Sexta, 07 ago",
    startTime: "16:30",
    endTime: "18:00",
    customer: {
      id: "mock-customer-laura",
      name: "Laura Mendes",
      phone: "(11) 93301-7782",
      initials: "LM",
    },
    professional: lia,
    service: hairHydration,
    status: "completed",
    room: "Sala 01",
    paymentStatus: "Pago",
  },
  {
    id: "apt-006",
    isoDate: "2026-08-08",
    dayLabel: "Sábado, 08 ago",
    startTime: "13:15",
    endTime: "14:00",
    customer: {
      id: "mock-customer-paula",
      name: "Paula Nunes",
      phone: "(11) 94511-0090",
      initials: "PN",
    },
    professional: nina,
    service: browDesign,
    status: "canceled",
    room: "Sala 03",
    paymentStatus: "Cancelado",
  },
];
