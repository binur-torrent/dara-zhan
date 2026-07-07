import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Dara-Zhan. Все права защищены.
        </p>
        <nav className="flex gap-6" aria-label="Подвал сайта">
          <Link
            href="/doctors"
            className="text-sm text-muted-foreground transition-colors duration-200 hover:text-slate-900 cursor-pointer"
          >
            Врачи
          </Link>
          <Link
            href="/book"
            className="text-sm text-muted-foreground transition-colors duration-200 hover:text-slate-900 cursor-pointer"
          >
            Запись на приём
          </Link>
          <Link
            href="/login"
            className="text-sm text-muted-foreground transition-colors duration-200 hover:text-slate-900 cursor-pointer"
          >
            Персонал
          </Link>
        </nav>
      </div>
    </footer>
  );
}
