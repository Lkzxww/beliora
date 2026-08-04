import {
  BadgeCheck,
  CalendarCheck,
  ChevronRight,
  Clock,
  DollarSign,
  Plus,
  TrendingUp,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const stats = [
  {
    label: "Agendamentos hoje",
    value: "18",
    helper: "4 próximos atendimentos",
    icon: CalendarCheck,
    color: "text-[#7a2638] dark:text-[#f0bcc8]",
    surface: "bg-[#f8e9e9] dark:bg-[#7a2638]/20",
  },
  {
    label: "Receita prevista",
    value: "R$ 3.420",
    helper: "Meta diária em 72%",
    icon: DollarSign,
    color: "text-[#8a6426] dark:text-[#f0d59d]",
    surface: "bg-[#f5ead2] dark:bg-[#c9a76a]/[0.16]",
  },
  {
    label: "Clientes ativos",
    value: "642",
    helper: "28 novos no mês",
    icon: Users,
    color: "text-[#345b57] dark:text-[#a9d2cc]",
    surface: "bg-[#e7f0ed] dark:bg-[#345b57]/20",
  },
  {
    label: "Ocupação da equipe",
    value: "84%",
    helper: "6 profissionais online",
    icon: TrendingUp,
    color: "text-[#5c4b35] dark:text-[#dfc6a3]",
    surface: "bg-[#eee5da] dark:bg-[#5c4b35]/[0.28]",
  },
] as const;

const appointments = [
  {
    time: "09:00",
    client: "Marina Alves",
    service: "Corte + hidratação",
    employee: "Lia",
    status: "Confirmado",
    statusClass:
      "border-[#c7dfcf] bg-[#edf8f0] text-[#2c6b42] dark:border-emerald-400/25 dark:bg-emerald-400/10 dark:text-emerald-200",
  },
  {
    time: "10:30",
    client: "Camila Torres",
    service: "Manicure gel",
    employee: "Bruna",
    status: "Em breve",
    statusClass:
      "border-[#dec98d] bg-[#fbf3dc] text-[#7a5d17] dark:border-[#c9a76a]/30 dark:bg-[#c9a76a]/12 dark:text-[#f0d59d]",
  },
  {
    time: "12:00",
    client: "Renata Lima",
    service: "Design de sobrancelhas",
    employee: "Nina",
    status: "Pendente",
    statusClass:
      "border-[#e8c7cf] bg-[#faedf0] text-[#8b3348] dark:border-[#f0bcc8]/25 dark:bg-[#7a2638]/[0.18] dark:text-[#f0bcc8]",
  },
] as const;

const financialHighlights = [
  {
    label: "Pagamentos recebidos",
    value: "R$ 2.780",
  },
  {
    label: "Ticket médio",
    value: "R$ 190",
  },
  {
    label: "Serviços concluídos",
    value: "14",
  },
] as const;

export function DashboardMainContent() {
  return (
    <div className="flex flex-col gap-7">
      <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-3">
          <Badge
            variant="secondary"
            className="w-fit border border-[#e6d5bf] bg-white/70 px-3 py-1 text-[#7a2638] shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-[#f0bcc8]"
          >
            Studio Central
          </Badge>
          <div>
            <h1 className="max-w-3xl text-3xl font-semibold tracking-normal text-[#211b18] sm:text-4xl dark:text-foreground">
              Visão geral do salão
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#74675d] sm:text-base dark:text-muted-foreground">
              Acompanhe agenda, clientes, equipe e financeiro com uma leitura
              elegante do movimento do dia.
            </p>
          </div>
        </div>

        <Button className="h-11 w-full rounded-2xl bg-[#7a2638] px-5 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(122,38,56,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#681f30] active:translate-y-px sm:w-auto dark:bg-[#9f3a50] dark:hover:bg-[#b0455d]">
          <Plus className="size-[1.125rem]" aria-hidden="true" />
          Novo agendamento
        </Button>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card
              key={stat.label}
              className="rounded-2xl bg-white/[0.88] shadow-[0_18px_50px_rgba(48,37,28,0.08)] ring-[#eadfd3] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_24px_68px_rgba(48,37,28,0.13)] dark:bg-card/[0.92] dark:ring-white/10"
            >
              <CardHeader className="flex-row items-start justify-between gap-4 pb-2">
                <div>
                  <CardDescription className="font-medium text-[#7c7067] dark:text-muted-foreground">
                    {stat.label}
                  </CardDescription>
                  <CardTitle className="mt-3 text-3xl font-semibold text-[#211b18] dark:text-foreground">
                    {stat.value}
                  </CardTitle>
                </div>
                <span
                  className={`grid size-12 place-items-center rounded-2xl ${stat.surface}`}
                >
                  <Icon
                    className={`size-6 ${stat.color}`}
                    aria-hidden="true"
                  />
                </span>
              </CardHeader>
              <CardContent>
                <p className="flex items-center gap-2 text-sm font-medium text-[#6f635a] dark:text-muted-foreground">
                  <BadgeCheck
                    className="size-4 text-[#a37732] dark:text-[#d8bd85]"
                    aria-hidden="true"
                  />
                  {stat.helper}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.8fr)]">
        <Card className="rounded-2xl bg-white/[0.88] shadow-[0_18px_50px_rgba(48,37,28,0.08)] ring-[#eadfd3] dark:bg-card/[0.92] dark:ring-white/10">
          <CardHeader className="border-b border-[#efe4d8] dark:border-white/10">
            <CardTitle className="text-lg text-[#211b18] dark:text-foreground">
              Agenda do dia
            </CardTitle>
            <CardDescription className="text-[#7c7067] dark:text-muted-foreground">
              Próximos atendimentos e responsáveis.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {appointments.map((appointment) => (
              <div
                key={`${appointment.time}-${appointment.client}`}
                className="group flex flex-col gap-4 rounded-2xl border border-[#efe4d8] bg-[#fffaf4] p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#dbc7ad] hover:bg-white hover:shadow-[0_16px_42px_rgba(48,37,28,0.09)] sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:bg-white/[0.035] dark:hover:bg-white/[0.06]"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <span className="flex size-14 shrink-0 flex-col items-center justify-center rounded-2xl border border-[#ead9c4] bg-white text-sm font-semibold text-[#7a2638] shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-[#f0bcc8]">
                    <span>{appointment.time}</span>
                    <span className="text-[0.64rem] font-medium uppercase tracking-[0.14em] text-[#9c8f84] dark:text-muted-foreground">
                      Hoje
                    </span>
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#211b18] dark:text-foreground">
                      {appointment.client}
                    </p>
                    <p className="mt-1 truncate text-sm text-[#74675d] dark:text-muted-foreground">
                      {appointment.service} com {appointment.employee}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:justify-end">
                  <Badge
                    variant="outline"
                    className={`shrink-0 px-2.5 ${appointment.statusClass}`}
                  >
                    {appointment.status}
                  </Badge>
                  <ChevronRight
                    className="size-4 text-[#a79b91] transition-transform duration-200 group-hover:translate-x-0.5 dark:text-muted-foreground"
                    aria-hidden="true"
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-2xl bg-white/[0.88] shadow-[0_18px_50px_rgba(48,37,28,0.08)] ring-[#eadfd3] dark:bg-card/[0.92] dark:ring-white/10">
          <CardHeader className="border-b border-[#efe4d8] dark:border-white/10">
            <CardTitle className="text-lg text-[#211b18] dark:text-foreground">
              Resumo financeiro
            </CardTitle>
            <CardDescription className="text-[#7c7067] dark:text-muted-foreground">
              Sinais rápidos para acompanhar o movimento.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="rounded-2xl border border-[#ead9c4] bg-[#fffaf4] p-4 dark:border-white/10 dark:bg-white/[0.035]">
              <p className="text-sm font-medium text-[#7c7067] dark:text-muted-foreground">
                Receita acompanhada
              </p>
              <p className="mt-2 text-3xl font-semibold text-[#211b18] dark:text-foreground">
                R$ 2.780
              </p>
              <p className="mt-1 text-sm font-medium text-[#8a6426] dark:text-[#f0d59d]">
                +12% em relação à terça anterior
              </p>
            </div>

            {financialHighlights.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between gap-4 border-b border-[#f0e5da] pb-3 last:border-b-0 last:pb-0 dark:border-white/10"
              >
                <span className="text-sm text-[#74675d] dark:text-muted-foreground">
                  {item.label}
                </span>
                <span className="text-sm font-semibold text-[#211b18] dark:text-foreground">
                  {item.value}
                </span>
              </div>
            ))}

            <div className="rounded-2xl border border-[#dfcaa9] bg-[#f8eedf] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] dark:border-[#c9a76a]/25 dark:bg-[#c9a76a]/10">
              <div className="flex items-start gap-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-white text-[#7a2638] shadow-sm dark:bg-white/10 dark:text-[#f0bcc8]">
                  <Clock className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-[#211b18] dark:text-foreground">
                    Fechamento previsto
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[#74675d] dark:text-muted-foreground">
                    Conferência do caixa às 19:30 com relatório consolidado.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
