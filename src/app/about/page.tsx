import type { Metadata } from "next";
import { Award, HeartHandshake, ShieldCheck, Users } from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import {
  PhotoCarousel,
  type PhotoCarouselItem,
} from "@/features/about/components/photo-carousel";

export const metadata: Metadata = {
  title: "О нас",
  description:
    "Узнайте больше о клинике Dara-Zhan: наши ценности, лицензии и сертификаты, фотогалерея клиники.",
};

const highlights = [
  {
    icon: Users,
    title: "Команда специалистов",
    description:
      "Врачи общей практики и узкие специалисты с многолетним опытом работы.",
  },
  {
    icon: ShieldCheck,
    title: "Лицензировано",
    description:
      "Клиника работает в соответствии со всеми требованиями Минздрава РК.",
  },
  {
    icon: HeartHandshake,
    title: "Забота о пациентах",
    description:
      "Внимательное отношение и индивидуальный подход к каждому визиту.",
  },
  {
    icon: Award,
    title: "Современное оборудование",
    description:
      "Диагностика и приём проходят с использованием современной техники.",
  },
];

const certificates: PhotoCarouselItem[] = [
  {
    id: "license-medical",
    src: "/images/clinic-about.jpg",
    alt: "Лицензия на медицинскую деятельность",
    title: "Лицензия на медицинскую деятельность",
    subtitle: "Министерство здравоохранения РК",
  },
  {
    id: "license-sanpin",
    src: "/images/gallery-1.jpg",
    alt: "Санитарно-эпидемиологическое заключение",
    title: "Сан.-эпидемиологическое заключение",
    subtitle: "Соответствие нормам СанПиН",
  },
  {
    id: "license-iso",
    src: "/images/gallery-2.jpg",
    alt: "Сертификат соответствия ISO",
    title: "Сертификат соответствия",
    subtitle: "Система менеджмента качества",
  },
  {
    id: "license-accreditation",
    src: "/images/clinic-about.jpg",
    alt: "Аккредитация врачей клиники",
    title: "Аккредитация специалистов",
    subtitle: "Ежегодное подтверждение квалификации",
  },
];

const galleryPhotos: PhotoCarouselItem[] = [
  {
    id: "gallery-reception",
    src: "/images/clinic-about.jpg",
    alt: "Ресепшн клиники Dara-Zhan",
    title: "Ресепшн",
  },
  {
    id: "gallery-hallway",
    src: "/images/gallery-1.jpg",
    alt: "Коридор клиники Dara-Zhan",
    title: "Коридор клиники",
  },
  {
    id: "gallery-room",
    src: "/images/gallery-2.jpg",
    alt: "Кабинет приёма клиники Dara-Zhan",
    title: "Кабинет приёма",
  },
  {
    id: "gallery-waiting",
    src: "/images/clinic-about.jpg",
    alt: "Зона ожидания клиники Dara-Zhan",
    title: "Зона ожидания",
  },
  {
    id: "gallery-hallway-2",
    src: "/images/gallery-1.jpg",
    alt: "Интерьер клиники Dara-Zhan",
    title: "Интерьер клиники",
  },
];

export default function AboutPage() {
  return (
    <SiteShell>
      <section className="bg-linear-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-4 text-sm font-medium uppercase tracking-wider text-primary">
              О клинике
            </p>
            <h1 className="text-balance text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              Dara-Zhan — клиника, которой доверяют
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Мы объединяем опытных врачей, современное оборудование и заботу
              о каждом пациенте, чтобы забота о здоровье была простой и
              доступной.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
              Кто мы
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Клиника Dara-Zhan оказывает многопрофильную медицинскую помощь:
              от консультаций врачей общей практики до узкоспециализированных
              приёмов. Мы работаем для того, чтобы каждый пациент получил
              внимательный осмотр, точную диагностику и понятные рекомендации
              по лечению.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Наша команда — это врачи с многолетним практическим опытом,
              а вся деятельность клиники ведётся в строгом соответствии с
              лицензионными и санитарными требованиями.
            </p>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {highlights.map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <item.icon className="h-5 w-5" aria-hidden />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {item.title}
                    </p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="order-1 overflow-hidden rounded-2xl border border-slate-200/80 shadow-sm lg:order-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/clinic-about.jpg"
              alt="Клиника Dara-Zhan"
              className="aspect-4/3 w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200/80 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
              Лицензии и сертификаты
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Подтверждающие документы деятельности клиники.
            </p>
          </div>
          <PhotoCarousel
            items={certificates}
            itemClassName="basis-full sm:basis-1/2 lg:basis-1/4"
            imageAspectClassName="aspect-3/4"
          />
        </div>
      </section>

      <section className="border-t border-slate-200/80 bg-slate-50/60">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
              Галерея клиники
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Загляните внутрь клиники Dara-Zhan.
            </p>
          </div>
          <PhotoCarousel items={galleryPhotos} />
        </div>
      </section>
    </SiteShell>
  );
}
