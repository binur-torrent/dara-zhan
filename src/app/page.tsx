import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  Clock,
  MapPin,
  Phone,
  Shield,
  Stethoscope,
} from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: CalendarCheck,
    title: "Запись за пару минут",
    description:
      "Выберите врача, процедуру и время — достаточно указать имя и телефон.",
  },
  {
    icon: Shield,
    title: "Подтверждение администратором",
    description:
      "Каждую заявку проверяет медсестра клиники перед подтверждением визита.",
  },
  {
    icon: Stethoscope,
    title: "Опытные специалисты",
    description:
      "Врачи общей практики, кардиологии и дерматологии с многолетним опытом.",
  },
];

const CLINIC_ADDRESS = "г. Астана, Туран 50/5";
const MAP_QUERY = encodeURIComponent("Астана, Туран 50/5");
const MAP_SRC = `https://www.google.com/maps?q=${MAP_QUERY}&z=16&output=embed`;

export default function HomePage() {
  return (
    <SiteShell>
      <section className="bg-linear-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-4 text-sm font-medium uppercase tracking-wider text-primary">
              Система записи в клинику
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              Забота о здоровье,{" "}
              <span className="text-primary">стало проще</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Запишитесь на приём онлайн в 1–2 клика. Регистрация не нужна —
              наш администратор лично подтвердит ваш визит.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/book"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "w-full cursor-pointer justify-between px-8 sm:w-auto sm:min-w-[230px]",
                )}
              >
                <span className="flex-1 text-center">Записаться на приём</span>
                <ArrowRight className="ml-2 h-4 w-4 shrink-0" aria-hidden />
              </Link>
              <Link
                href="/doctors"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "w-full cursor-pointer px-8 sm:w-auto sm:min-w-[230px]",
                )}
              >
                Наши врачи
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="border-slate-200/80 shadow-sm transition-shadow duration-200 hover:shadow-md"
            >
              <CardContent className="pt-6">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <feature.icon className="h-5 w-5" aria-hidden />
                </div>
                <h2 className="mb-2 font-semibold text-slate-900">
                  {feature.title}
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-t border-slate-200/80 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6">
          <h2 className="text-2xl font-semibold text-slate-900">
            Готовы записаться на приём?
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Выберите врача и удобное время — остальное мы возьмём на себя.
          </p>
          <Link
            href="/book"
            className={cn(buttonVariants({ size: "lg" }), "mt-6 cursor-pointer")}
          >
            Начать запись
          </Link>
        </div>
      </section>

      <section className="border-t border-slate-200/80 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
              Как нас найти
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Ждём вас по адресу клиники Dara-Zhan.
            </p>
          </div>
          <div className="grid gap-6 overflow-hidden rounded-2xl border border-slate-200/80 shadow-sm sm:grid-cols-5">
            <div className="order-2 flex flex-col justify-center gap-5 bg-white p-6 sm:order-1 sm:col-span-2 sm:p-8">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <MapPin className="h-5 w-5" aria-hidden />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Адрес</p>
                  <p className="text-sm text-muted-foreground">
                    {CLINIC_ADDRESS}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Clock className="h-5 w-5" aria-hidden />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Часы работы
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Пн–Пт: 09:00–17:00
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Phone className="h-5 w-5" aria-hidden />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Телефон
                  </p>
                  <p className="text-sm text-muted-foreground">
                    +7 (700) 000-00-00
                  </p>
                </div>
              </div>
            </div>
            <div className="order-1 h-72 w-full sm:order-2 sm:col-span-3 sm:h-auto">
              <iframe
                src={MAP_SRC}
                title="Карта проезда до клиники Dara-Zhan"
                width="100%"
                height="100%"
                style={{ border: 0, display: "block", minHeight: "18rem" }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
