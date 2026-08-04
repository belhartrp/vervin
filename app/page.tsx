"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const PUBLIC_PREVIEW_URL = "https://vervin.vercel.app/belhartrp";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Template", href: "#templates" },
  { label: "FAQ", href: "#faq" },
];

const FEATURES = [
  {
    title: "Pilih template yang tersedia",
    desc: "Mulai dari template yang sudah tersedia untuk halaman publikmu. Saat ini Vervin berfokus pada Bio Link, sambil menyiapkan fondasi untuk template lain ke depannya.",
    img: "right",
    icon: "🧩",
    illustrationKey: "template",
  },
  {
    title: "Atur identitas halamanmu",
    desc: "Sesuaikan username, display name, avatar, bio, dan tampilan dasar agar halaman publikmu terasa personal, rapi, dan konsisten.",
    img: "left",
    icon: "🎨",
    illustrationKey: "profile",
  },
  {
    title: "Tambahkan link pentingmu",
    desc: "Masukkan link yang ingin kamu tampilkan, atur urutannya, lalu tampilkan konten pentingmu dalam satu halaman publik yang lebih ringkas.",
    img: "right",
    icon: "🔗",
    illustrationKey: "links",
  },
  {
    title: "Publish lalu bagikan",
    desc: "Setelah siap, publish halamanmu dan bagikan satu URL publik yang mudah diakses dari mana saja.",
    img: "left",
    icon: "🚀",
    illustrationKey: "publish",
  },
];

const FAQS = [
  {
    q: "Apa yang bisa saya buat di Vervin sekarang?",
    a: "Saat ini Vervin berfokus pada template Bio Link untuk halaman publik yang ringkas dan mudah dibagikan.",
  },
  {
    q: "Apakah saya perlu coding untuk menggunakannya?",
    a: "Tidak. Kamu cukup mengatur profil, menambahkan link, lalu membagikan URL publikmu dari dashboard.",
  },
  {
    q: "Apakah saya bisa punya URL publik sendiri?",
    a: "Bisa. Username akunmu digunakan sebagai bagian dari URL publik, misalnya /username.",
  },
  {
    q: "Apa saja yang bisa saya ubah dari halaman publik saya?",
    a: "Kamu bisa mengubah identitas dasar seperti username, display name, avatar, bio, serta daftar link yang tampil pada template aktif.",
  },
  {
    q: "Apakah template yang tersedia sudah banyak?",
    a: "Untuk saat ini, template yang tersedia dan aktif adalah Bio Link. Fokusnya adalah membuat pengalaman edit, publish, dan share tetap rapi dan jelas.",
  },
];

const TEMPLATES = [
  {
    name: "Bio Link",
    tag: "Active Template",
    color: "from-[#f4e5e7] via-[#f7efe6] to-[#ecd7df]",
    previewUrl: PUBLIC_PREVIEW_URL,
    image: "/images/template-biolink.png",
    sections: ["Avatar", "Name", "Bio", "Links"],
  },
];

declare global {
  interface Window {
    gsap?: any;
    AOS?: any;
  }
}

export default function LandingPage() {
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroCTARef = useRef<HTMLDivElement>(null);
  const heroIllustrationRef = useRef<HTMLDivElement>(null);

  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";

    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    let gsapContext: any = null;

    const loadScript = (src: string) =>
      new Promise<void>((resolve, reject) => {
        const existing = document.querySelector(`script[src="${src}"]`);
        if (existing) {
          resolve();
          return;
        }

        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load ${src}`));
        document.head.appendChild(script);
      });

    const loadStylesheet = (href: string) =>
      new Promise<void>((resolve) => {
        const existing = document.querySelector(`link[href="${href}"]`);
        if (existing) {
          resolve();
          return;
        }

        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = href;
        link.onload = () => resolve();
        document.head.appendChild(link);
      });

    const initAnimations = async () => {
      try {
        if (!window.gsap) {
          await loadScript(
            "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"
          );
        }

        if (!window.AOS) {
          await loadStylesheet("https://unpkg.com/aos@2.3.4/dist/aos.css");
          await loadScript("https://unpkg.com/aos@2.3.4/dist/aos.js");
        }

        if (!isMounted || !window.gsap || !window.AOS) return;

        const { gsap, AOS } = window;

        AOS.init({
          duration: 700,
          easing: "ease-out-cubic",
          once: false,
          mirror: true,
          offset: 60,
        });

        setTimeout(() => {
          AOS.refreshHard?.();
        }, 150);

        gsapContext = gsap.context(() => {
          if (heroTitleRef.current) {
            gsap.from(heroTitleRef.current.children, {
              y: 60,
              opacity: 0,
              duration: 0.9,
              stagger: 0.15,
              ease: "power3.out",
              delay: 0.2,
            });
          }

          if (heroCTARef.current) {
            gsap.from(heroCTARef.current, {
              y: 30,
              opacity: 0,
              duration: 0.7,
              ease: "power3.out",
              delay: 0.8,
            });
          }

          if (heroIllustrationRef.current) {
            gsap.to(heroIllustrationRef.current, {
              y: -16,
              duration: 2.8,
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1,
            });

            gsap.from(heroIllustrationRef.current, {
              x: 60,
              opacity: 0,
              duration: 1,
              ease: "power3.out",
              delay: 0.4,
            });
          }
        });
      } catch (error) {
        console.error("Animation init failed:", error);
      }
    };

    initAnimations();

    return () => {
      isMounted = false;
      gsapContext?.revert?.();
    };
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (!href.startsWith("#")) return;
    e.preventDefault();

    const target = document.querySelector(href);
    if (!target) return;

    const headerOffset = 96;
    const top =
      target.getBoundingClientRect().top + window.scrollY - headerOffset;

    window.scrollTo({
      top,
      behavior: "smooth",
    });

    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-white font-sans text-gray-900">
      {/* HEADER */}
      <header
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur-md"
            : "bg-transparent"
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8 lg:px-10">
          <Link href="/" className="group flex items-center gap-2">
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              aria-label="Vervin logo"
            >
              <rect width="28" height="28" rx="7" fill="#7C3AED" />
              <path
                d="M8 14h4m4 0h4M14 8v4m0 4v4"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              vervin
            </span>
          </Link>

          {/* Desktop / large-tablet nav */}
          <div className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                onClick={(e) => handleNavClick(e, l.href)}
                className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/auth/login"
              className="rounded-full border-2 border-violet-600 px-5 py-2 text-sm font-semibold text-violet-600 transition-all duration-200 hover:bg-violet-600 hover:text-white"
            >
              Login
            </Link>
          </div>

          {/* Mobile + tablet menu button */}
          <button
            className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              {mobileMenuOpen ? (
                <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </nav>

        <div
          className={`overflow-hidden border-b border-gray-100 bg-white transition-all duration-300 lg:hidden ${
            mobileMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4 sm:px-8">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                onClick={(e) => handleNavClick(e, l.href)}
                className="py-1 text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/auth/login"
              className="w-full max-w-xs rounded-full border-2 border-violet-600 px-5 py-2.5 text-center text-sm font-semibold text-violet-600 transition-all duration-200 hover:bg-violet-600 hover:text-white sm:w-auto"
              onClick={() => setMobileMenuOpen(false)}
            >
              Login
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="mx-auto flex min-h-screen max-w-7xl items-center px-6 pb-16 pt-24 sm:px-8 sm:pt-28 lg:px-10 lg:pt-20">
        <div className="grid w-full items-center gap-12 md:grid-cols-2 md:gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16 xl:gap-24">
          <div>
            <h1
              ref={heroTitleRef}
              className="mb-6 text-4xl font-extrabold leading-tight text-gray-900 sm:mb-8 sm:text-5xl lg:text-6xl xl:text-7xl"
              style={{ overflow: "hidden" }}
            >
              <span className="block">Satu halaman publik</span>
              <span className="block">untuk semua</span>
              <span className="block text-violet-600">link pentingmu</span>
              <span className="block text-violet-600">yang rapi dan siap dibagikan.</span>
            </h1>

            <p className="max-w-xl text-base leading-relaxed text-gray-500 sm:text-lg lg:max-w-lg">
              Vervin membantumu membuat halaman Bio Link yang lebih rapi:
              mulai dari template yang tersedia, atur identitasmu, tambahkan
              link penting, lalu bagikan lewat satu URL publik.
            </p>

            <div
              ref={heroCTARef}
              className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap"
            >
              <Link
                href="/auth/sign-up"
                className="inline-flex items-center justify-center rounded-full bg-violet-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-violet-200 transition-all duration-200 hover:bg-violet-700 active:scale-95"
              >
                Get Started — Free
              </Link>

              <Link
                href="#features"
                onClick={(e) => handleNavClick(e, "#features")}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 px-7 py-3.5 font-medium text-gray-600 transition-all duration-200 hover:border-gray-400 hover:text-gray-900"
              >
                See how it works
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    d="M5 12h14M12 5l7 7-7 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
          </div>

          <div className="flex justify-center md:justify-end">
            <div
              ref={heroIllustrationRef}
              className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl"
            >
              <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl">
                <div className="flex items-center gap-1.5 border-b border-gray-100 px-4 py-3">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                  <div className="ml-3 flex h-8 flex-1 items-center overflow-hidden rounded-full bg-gray-100 px-3">
                    <span className="truncate text-xs text-gray-500">
                      vervin.vercel.app/belhartrp
                    </span>
                  </div>
                </div>

                <div className="relative h-[420px] w-full overflow-hidden bg-[#f7f3f1] sm:h-[520px] lg:h-[560px]">
                  <iframe
                    src={PUBLIC_PREVIEW_URL}
                    title="Preview halaman publik Vervin"
                    className="absolute left-0 top-0 h-[780px] w-full origin-top scale-[0.67] border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#f7f3f1] to-transparent" />
                </div>
              </div>

              <div className="absolute -right-2 -top-4 rounded-2xl border border-gray-100 bg-white px-3 py-2 shadow-lg sm:-right-4 sm:px-4">
                <span className="text-xs font-semibold text-gray-700">
                  Live preview
                </span>
              </div>

              <a
                href={PUBLIC_PREVIEW_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute -bottom-4 right-2 inline-flex items-center gap-2 rounded-full bg-gray-900 px-3.5 py-2.5 text-xs font-semibold text-white shadow-xl transition-all duration-200 hover:bg-black sm:right-4 sm:px-4 sm:text-sm"
              >
                Open full preview
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    d="M7 17L17 7M9 7h8v8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section
        id="features"
        className="bg-gray-50 px-6 py-20 [scroll-margin-top:96px] sm:px-8 sm:py-24 lg:px-10"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center sm:mb-16" data-aos="fade-up">
            <span className="text-sm font-semibold uppercase tracking-widest text-violet-600">
              How it works
            </span>
            <h2 className="mt-3 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Workflow Vervin dalam 4 langkah
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-gray-500 sm:text-lg">
              Alur yang sederhana untuk membuat halaman publikmu lebih rapi,
              lebih konsisten, dan lebih mudah dibagikan.
            </p>
          </div>

          <div className="space-y-16 sm:space-y-20 lg:space-y-28">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className="grid items-center gap-10 md:grid-cols-2 md:gap-12 lg:gap-16"
                data-aos={f.img === "right" ? "fade-right" : "fade-left"}
                data-aos-delay="100"
                data-aos-once="false"
                data-aos-mirror="true"
              >
                <div className={f.img === "left" ? "md:order-2" : ""}>
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-100 bg-violet-50 px-4 py-1.5 text-sm font-semibold text-violet-600">
                    <span className="text-base">{f.icon}</span>
                    Step {i + 1}
                  </div>
                  <h3 className="mb-4 text-2xl font-extrabold text-gray-900 sm:text-3xl">
                    {f.title}
                  </h3>
                  <p className="max-w-md text-base leading-relaxed text-gray-500 sm:text-lg">
                    {f.desc}
                  </p>
                </div>

                <div
                  className={`flex justify-center ${
                    f.img === "left" ? "md:order-1" : ""
                  }`}
                >
                  <FeatureIllustration type={f.illustrationKey} index={i} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEMPLATES */}
      <section
        id="templates"
        className="bg-white px-6 py-20 [scroll-margin-top:96px] sm:px-8 sm:py-24 lg:px-10"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center sm:mb-14" data-aos="fade-up">
            <span className="text-sm font-semibold uppercase tracking-widest text-violet-600">
              Template
            </span>
            <h2 className="mt-3 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Template yang tersedia saat ini
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-gray-500 sm:text-lg">
              Saat ini Vervin berfokus pada satu template Bio Link, dengan
              pengalaman edit dan publish yang dibuat tetap sederhana, jelas,
              dan siap dikembangkan.
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2 lg:gap-10 xl:max-w-6xl">
            {TEMPLATES.map((t) => (
              <div
                key={t.name}
                className="group relative overflow-hidden rounded-[28px] border border-gray-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                data-aos="fade-up"
                data-aos-once="false"
                data-aos-mirror="true"
              >
                <div
                  className={`relative aspect-[4/3] bg-gradient-to-br ${t.color} p-5`}
                >
                  <div className="h-full rounded-[28px] border border-white/50 bg-white/50 p-4 backdrop-blur-sm">
                    <div className="relative h-full w-full overflow-hidden rounded-[22px] shadow-sm">
                      <Image
                        src={t.image}
                        alt={`${t.name} preview`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-5 bg-white p-5 sm:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="text-base font-semibold text-gray-900">
                        {t.name}
                      </div>
                      <div className="mt-1 text-sm text-gray-400">{t.tag}</div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <span className="rounded-full border border-violet-100 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-600">
                        Available now
                      </span>
                      <a
                        href={t.previewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-violet-200 hover:text-violet-700"
                      >
                        Preview asli
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            d="M7 17L17 7M9 7h8v8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </a>
                    </div>
                  </div>

                  <div>
                    <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                      Sections
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {t.sections.map((section) => (
                        <span
                          key={section}
                          className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-600"
                        >
                          {section}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center" data-aos="fade-up">
            <Link
              href="/auth/sign-up"
              className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-8 py-4 font-semibold text-white shadow-lg shadow-violet-100 transition-all duration-200 hover:bg-violet-700"
            >
              Mulai Gratis Sekarang
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path
                  d="M5 12h14M12 5l7 7-7 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        id="faq"
        className="bg-white px-6 py-20 [scroll-margin-top:96px] sm:px-8 sm:py-24 lg:px-10"
      >
        <div className="mx-auto max-w-3xl lg:max-w-4xl">
          <div className="mb-12 text-center sm:mb-14" data-aos="fade-up">
            <span className="text-sm font-semibold uppercase tracking-widest text-violet-600">
              FAQ
            </span>
            <h2 className="mt-3 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Pertanyaan yang sering ditanya
            </h2>
            <p className="mt-4 text-base text-gray-500 sm:text-lg">
              Ringkas, jelas, dan sesuai dengan fitur yang tersedia sekarang.
            </p>
          </div>

          <div className="space-y-3" data-aos="fade-up" data-aos-delay="100">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className={`overflow-hidden rounded-2xl border transition-all duration-200 ${
                  openFaq === i
                    ? "border-violet-200 shadow-md shadow-violet-50"
                    : "border-gray-100 hover:border-gray-200"
                }`}
              >
                <button
                  className="flex w-full items-center justify-between px-5 py-4 text-left sm:px-6 sm:py-5"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                >
                  <span
                    className={`text-sm font-semibold transition-colors sm:text-base ${
                      openFaq === i ? "text-violet-600" : "text-gray-800"
                    }`}
                  >
                    {faq.q}
                  </span>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className={`ml-4 flex-shrink-0 transition-transform duration-300 ${
                      openFaq === i
                        ? "rotate-180 text-violet-600"
                        : "text-gray-400"
                    }`}
                  >
                    <path
                      d="M6 9l6 6 6-6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-out ${
                    openFaq === i ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="px-5 pb-5 text-sm leading-relaxed text-gray-500 sm:px-6 sm:text-base">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="bg-gray-950 px-6 py-16 text-white sm:px-8 sm:py-20 lg:px-10"
        data-aos="fade-up"
      >
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-5 text-3xl font-extrabold sm:text-4xl lg:text-5xl">
            Satu halaman publik untuk{" "}
            <span className="text-violet-400">semua link pentingmu</span>
          </h2>
          <p className="mb-10 text-base text-gray-400 sm:text-lg">
            Mulai dari template yang tersedia sekarang, atur identitasmu, lalu
            bagikan URL publikmu sendiri dengan lebih rapi.
          </p>
          <Link
            href="/auth/sign-up"
            className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-8 py-4 text-base font-semibold text-white shadow-2xl shadow-violet-900/30 transition-all duration-200 hover:bg-violet-500 sm:text-lg"
          >
            Mulai Sekarang — Gratis
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path
                d="M5 12h14M12 5l7 7-7 7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 bg-gray-950 px-6 py-12 text-gray-400 sm:px-8 sm:py-14 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4">
            <div className="sm:col-span-2">
              <div className="mb-4 flex items-center gap-2">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <rect width="28" height="28" rx="7" fill="#7C3AED" />
                  <path
                    d="M8 14h4m4 0h4M14 8v4m0 4v4"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="text-xl font-bold text-white">Vervin</span>
              </div>
              <p className="max-w-xs text-sm leading-relaxed">
                Vervin membantu kamu membuat halaman Bio Link yang rapi,
                sederhana, dan mudah dibagikan.
              </p>
            </div>

            <div>
              <div className="mb-4 text-sm font-semibold text-white">Produk</div>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#features" className="transition-colors hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#templates" className="transition-colors hover:text-white">
                    Template
                  </a>
                </li>
                <li>
                  <a href="#faq" className="transition-colors hover:text-white">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <div className="mb-4 text-sm font-semibold text-white">Akses</div>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/auth/login" className="transition-colors hover:text-white">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/auth/sign-up" className="transition-colors hover:text-white">
                    Daftar
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="transition-colors hover:text-white">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-3 border-t border-white/5 pt-6 text-xs text-gray-600 sm:flex-row">
            <span>© {new Date().getFullYear()} Vervin. All rights reserved.</span>
            <span>
              Created with <span className="text-violet-400">♥</span> by{" "}
              <span className="font-semibold text-gray-400">
                Belhart Rajesky Pasaribu
              </span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureIllustration({
  type,
  index,
}: {
  type: string;
  index: number;
}) {
  const colors = [
    {
      bg: "from-violet-50 to-purple-100",
      accent: "bg-violet-500",
      border: "border-violet-200",
    },
    {
      bg: "from-blue-50 to-cyan-100",
      accent: "bg-blue-500",
      border: "border-blue-200",
    },
    {
      bg: "from-rose-50 to-pink-100",
      accent: "bg-rose-500",
      border: "border-rose-200",
    },
    {
      bg: "from-amber-50 to-orange-100",
      accent: "bg-amber-500",
      border: "border-amber-200",
    },
  ];

  const c = colors[index % colors.length];

  const illustrations: Record<string, React.ReactNode> = {
    template: (
      <div
        className={`w-full max-w-xs rounded-3xl border bg-gradient-to-br p-6 sm:max-w-sm sm:p-8 lg:max-w-md ${c.bg} ${c.border}`}
      >
        <div className="grid gap-3 rounded-2xl bg-white p-5 shadow-sm">
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <div className="mb-2 h-3 w-28 rounded-full bg-gray-300" />
            <div className="h-2.5 w-20 rounded-full bg-gray-200" />
          </div>
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-4">
            <div className="mb-2 h-3 w-24 rounded-full bg-gray-300" />
            <div className="h-2.5 w-16 rounded-full bg-gray-200" />
          </div>
        </div>
      </div>
    ),
    profile: (
      <div
        className={`w-full max-w-xs rounded-3xl border bg-gradient-to-br p-6 sm:max-w-sm sm:p-8 lg:max-w-md ${c.bg} ${c.border}`}
      >
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-4">
            <div className={`h-14 w-14 rounded-2xl ${c.accent}`} />
            <div className="flex-1">
              <div className="mb-2 h-3 w-32 rounded-full bg-gray-200" />
              <div className="h-2.5 w-20 rounded-full bg-gray-100" />
            </div>
          </div>
          <div className="mb-2 h-2.5 w-full rounded-full bg-gray-100" />
          <div className="mb-2 h-2.5 w-4/5 rounded-full bg-gray-100" />
          <div className="h-2.5 w-2/3 rounded-full bg-gray-100" />
        </div>
      </div>
    ),
    links: (
      <div
        className={`w-full max-w-xs rounded-3xl border bg-gradient-to-br p-6 sm:max-w-sm sm:p-8 lg:max-w-md ${c.bg} ${c.border}`}
      >
        <div className="space-y-3 rounded-2xl bg-white p-5 shadow-sm">
          {["Instagram", "TikTok", "GitHub"].map((item, i) => (
            <div
              key={item}
              className={`flex items-center justify-between rounded-2xl px-4 py-4 ${
                i === 0 ? "border border-gray-800 bg-[#f9edef]" : "bg-gray-50"
              }`}
            >
              <div>
                <div className="text-sm font-semibold text-gray-800">{item}</div>
                <div className="mt-1 text-xs text-gray-400">Tap untuk buka</div>
              </div>
              <div className="h-9 w-9 rounded-full bg-white shadow-sm" />
            </div>
          ))}
        </div>
      </div>
    ),
    publish: (
      <div
        className={`relative w-full max-w-xs rounded-3xl border bg-gradient-to-br p-6 sm:max-w-sm sm:p-8 lg:max-w-md ${c.bg} ${c.border}`}
      >
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg text-white ${c.accent}`}
            >
              🚀
            </div>
            <div>
              <div className="text-sm font-bold text-gray-900">
                Halaman publik siap
              </div>
              <div className="text-xs text-gray-400">
                /belhartrp
              </div>
            </div>
          </div>
          <div className="mb-3 rounded-xl bg-gray-50 p-3">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <div className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
              URL siap disalin dan dibagikan
            </div>
          </div>
          <div className="space-y-2">
            <div className="rounded-lg bg-gray-50 px-3 py-3 text-sm text-gray-600">
              Template aktif: Bio Link
            </div>
            <div className="rounded-lg bg-gray-50 px-3 py-3 text-sm text-gray-600">
              Profil sudah diisi
            </div>
            <div className="rounded-lg bg-gray-50 px-3 py-3 text-sm text-gray-600">
              Link siap dipublikasikan
            </div>
          </div>
        </div>
        <div className="absolute -right-3 -top-3 rounded-full bg-green-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
          ✓ Ready
        </div>
      </div>
    ),
  };

  return illustrations[type] || <div />;
}
