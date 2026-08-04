"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const PUBLIC_PREVIEW_URL = "https://vervin.vercel.app/belhartrp";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Templates", href: "#templates" },
  { label: "FAQ", href: "#faq" },
];

const STEPS = [
  {
    tag: "Choose a Template",
    desc: "Browse professionally designed templates and pick the one that fits your personal style or purpose.",
    cta: "See Templates",
    ctaHref: "#templates",
    illustrationKey: "choose",
  },
  {
    tag: "Fill in Your Information",
    desc: "Simply enter your content from your profile and experience to projects, social links, and more.",
    illustrationKey: "fill",
  },
  {
    tag: "Customize Your Design",
    desc: "Adjust colors, fonts, sections, and layouts to create a page that truly represents you.",
    illustrationKey: "customize",
  },
  {
    tag: "Publish & Share",
    desc: "Deploy your page instantly and share it with a single public link that works anywhere.",
    illustrationKey: "publish",
  },
];

const TEMPLATES = [
  {
    badge: "Bio-Link",
    name: "Gradient Bio-Link",
    desc: "Clean layout for showcasing projects",
    color: "from-[#f4e5e7] via-[#f7efe6] to-[#ecd7df]",
    previewUrl: PUBLIC_PREVIEW_URL,
    image: "/images/template-biolink.png",
    tags: ["Avatar", "Name", "Bio", "Links"],
  },
  {
    badge: "Portfolio",
    name: "Programmer Portf",
    desc: "Perfect for developers and designers",
    color: "from-blue-50 via-slate-50 to-indigo-100",
    previewUrl: "/images/template-portfolio.png",
    image: "/images/template-portfolio.png",
    tags: ["Name", "Bio", "Projects", "Qualification"],
  },
];

const FAQS = [
  {
    q: "What can I create with Vervin?",
    a: "You can create portfolios, bio links, CVs, resumes, personal websites, and other professional pages using ready-to-use templates.",
  },
  {
    q: "Do I need coding skills?",
    a: "No. You can pick a template, fill in your content, and publish your page without writing any code.",
  },
  {
    q: "Can I customize the templates?",
    a: "Yes. You can adjust colors, fonts, sections, and layouts to match your personal style.",
  },
  {
    q: "Is my page mobile-friendly?",
    a: "Every template is built to look great on mobile, tablet, and desktop out of the box.",
  },
  {
    q: "How do I publish my page?",
    a: "Once you're happy with your design, hit publish and your page goes live instantly on a shareable link.",
  },
  {
    q: "Can I edit my page after publishing?",
    a: "Absolutely. You can keep editing your content and design anytime, and changes go live immediately.",
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
  const [openFaq, setOpenFaq] = useState<number | null>(0);
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
        if (existing) return resolve();
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
        if (existing) return resolve();
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = href;
        link.onload = () => resolve();
        document.head.appendChild(link);
      });

    const initAnimations = async () => {
      try {
        if (!window.gsap) {
          await loadScript("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js");
        }
        if (!window.AOS) {
          await loadStylesheet("https://unpkg.com/aos@2.3.4/dist/aos.css");
          await loadScript("https://unpkg.com/aos@2.3.4/dist/aos.js");
        }
        if (!isMounted || !window.gsap || !window.AOS) return;

        const { gsap, AOS } = window;
        AOS.init({ duration: 700, easing: "ease-out-cubic", once: false, mirror: true, offset: 60 });
        setTimeout(() => AOS.refreshHard?.(), 150);

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

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith("#")) return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (!target) return;
    const headerOffset = 96;
    const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top, behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-white font-[fredoka] text-gray-900">
      <header
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${scrolled ? "border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur-md" : "bg-transparent"}`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8 lg:px-10">
          <Link href="/" className="group flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-gray-900">vervin</span>
          </Link>

          <div className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((l) => (
              <Link key={l.label} href={l.href} onClick={(e) => handleNavClick(e, l.href)} className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900">
                {l.label}
              </Link>
            ))}
            <Link href="/auth/login" className="rounded-full border-2 border-violet-600 px-5 py-2 text-sm font-semibold text-violet-600 transition-all duration-200 hover:bg-violet-600 hover:text-white">
              Login
            </Link>
          </div>

          <button className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 lg:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileMenuOpen ? <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" /> : <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round" />}
            </svg>
          </button>
        </nav>

        <div className={`overflow-hidden border-b border-gray-100 bg-white transition-all duration-300 lg:hidden ${mobileMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"}`}>
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4 sm:px-8">
            {NAV_LINKS.map((l) => (
              <Link key={l.label} href={l.href} onClick={(e) => handleNavClick(e, l.href)} className="py-1 text-sm font-medium text-gray-600 hover:text-gray-900">
                {l.label}
              </Link>
            ))}
            <Link href="/auth/login" className="w-full max-w-xs rounded-full border-2 border-violet-600 px-5 py-2.5 text-center text-sm font-semibold text-violet-600 transition-all duration-200 hover:bg-violet-600 hover:text-white sm:w-auto" onClick={() => setMobileMenuOpen(false)}>
              Login
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto flex min-h-screen max-w-7xl flex-col items-center px-6 pb-16 pt-28 text-center sm:px-8 lg:flex-row lg:gap-16 lg:px-10 lg:pt-20 lg:text-left">
        <div className="mx-auto max-w-3xl lg:mx-0 lg:max-w-none lg:flex-1">
          <h1 ref={heroTitleRef} className="mb-6 text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl lg:text-6xl xl:text-7xl">
            <span className="block">
              Create your professional page <span className="text-violet-600">in minutes</span>
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-gray-500 sm:text-lg lg:mx-0">
            Everything you need to create a professional online presence. Pick a template, add your content, customize it to match your style, and publish it in minutes.
          </p>
          <div ref={heroCTARef} className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
            <Link href="/auth/sign-up" className="inline-flex items-center justify-center rounded-full bg-violet-600 px-8 py-3.5 font-semibold text-white shadow-lg shadow-violet-200 transition-all duration-200 hover:bg-violet-700 active:scale-95">
              Get Started
            </Link>
          </div>
        </div>

        <div className="mt-14 flex w-full justify-center lg:mt-0 lg:flex-1 lg:justify-end">
          <div ref={heroIllustrationRef} className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl">
            <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl">
              <div className="flex items-center gap-1.5 border-b border-gray-100 px-4 py-3">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                <div className="h-3 w-3 rounded-full bg-green-400" />
                <div className="ml-3 flex h-8 flex-1 items-center overflow-hidden rounded-full bg-gray-100 px-3">
                  <span className="truncate text-xs text-gray-500">vervin.vercel.app/belhartrp</span>
                </div>
              </div>
              <div className="relative h-[520px] w-full overflow-hidden bg-[#f7f3f1]">
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
              <span className="text-xs font-semibold text-gray-700">Live preview</span>
            </div>
            <a href={PUBLIC_PREVIEW_URL} target="_blank" rel="noopener noreferrer" className="absolute -bottom-4 right-2 inline-flex items-center gap-2 rounded-full bg-gray-900 px-3.5 py-2.5 text-xs font-semibold text-white shadow-xl transition-all duration-200 hover:bg-black sm:right-4 sm:px-4 sm:text-sm">
              Open full preview
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 17L17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      <section id="features" className="bg-white px-6 py-20 [scroll-margin-top:96px] sm:px-8 sm:py-24 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-16 text-center text-3xl font-extrabold text-gray-900 sm:mb-20 sm:text-4xl lg:text-5xl" data-aos="fade-up">
            Create your page <span className="text-violet-600">in four easy steps</span>
          </h2>

          <div className="space-y-16 sm:space-y-20 lg:space-y-28">
            {STEPS.map((s, i) => (
              <div key={s.tag} className="grid items-center gap-10 md:grid-cols-2 md:gap-12 lg:gap-16" data-aos={i % 2 === 0 ? "fade-right" : "fade-left"} data-aos-delay="100" data-aos-once="false" data-aos-mirror="true">
                <div className={i % 2 === 1 ? "md:order-2" : ""}>
                  <h3 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl">
                    <span className="text-violet-600">{s.tag.replace(/\s*([^\s].*)$/, "")}</span>{" "}
                    <span>{s.tag.replace(/^.*?\s(?=[^\s]+$)/, "")}</span>
                  </h3>
                  <p className="mb-5 max-w-md text-base leading-relaxed text-gray-500 sm:text-lg">{s.desc}</p>
                  {s.cta && (
                    <Link href={s.ctaHref || "#"} onClick={(e) => s.ctaHref && handleNavClick(e, s.ctaHref)} className="inline-flex items-center justify-center rounded-full border-2 border-violet-600 px-6 py-2.5 text-sm font-semibold text-violet-600 transition-all duration-200 hover:bg-violet-600 hover:text-white">
                      {s.cta}
                    </Link>
                  )}
                </div>
                <div className={`flex justify-center ${i % 2 === 1 ? "md:order-1" : ""}`}>
                  <StepIllustration type={s.illustrationKey} index={i} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="templates" className="bg-gray-50 px-6 py-20 [scroll-margin-top:96px] sm:px-8 sm:py-24 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center" data-aos="fade-up">
            <h2 className="mx-auto max-w-3xl text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl">
              Start with a <span className="text-violet-600">professionally designed template</span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base text-gray-500 sm:text-lg">
              Choose from a growing collection of templates for portfolios, bio links, CVs, resumes, personal websites, and more. Pick one that matches your style, then make it your own.
            </p>
            <Link href="#templates" className="mt-6 inline-flex items-center justify-center rounded-full border-2 border-violet-600 px-6 py-2.5 text-sm font-semibold text-violet-600 transition-all duration-200 hover:bg-violet-600 hover:text-white">
              All Templates
            </Link>
          </div>

          <div className="mx-auto mt-14 grid max-w-5xl gap-8 sm:grid-cols-2 lg:gap-10 xl:max-w-6xl">
            {TEMPLATES.map((t) => (
              <div key={t.name} className="group relative overflow-hidden rounded-[28px] border border-gray-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl" data-aos="fade-up" data-aos-once="false" data-aos-mirror="true">
                <div className="absolute left-5 top-5 z-10 rounded-full bg-gray-900 px-3 py-1 text-xs font-semibold text-white">{t.badge}</div>
                <div className={`relative aspect-[4/3] bg-gradient-to-br ${t.color} p-5`}>
                  <div className="h-full rounded-[24px] border border-white/50 bg-white/50 p-3 backdrop-blur-sm">
                    <div className="relative h-full w-full overflow-hidden rounded-[18px] shadow-sm">
                      <Image src={t.image} alt={`${t.name} preview`} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-4 bg-white p-5 sm:p-6">
                  <div>
                    <div className="text-lg font-bold text-gray-900">{t.name}</div>
                    <div className="mt-1 text-sm text-gray-500">{t.desc}</div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {t.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-violet-100 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-600">{tag}</span>
                    ))}
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <a href={t.previewUrl} target="_blank" rel="noopener noreferrer" className="flex-1 rounded-full border border-gray-200 px-5 py-2.5 text-center text-sm font-semibold text-gray-700 transition hover:border-violet-200 hover:text-violet-700">
                      Preview
                    </a>
                    <Link href="/auth/sign-up" className="flex-1 rounded-full bg-violet-600 px-5 py-2.5 text-center text-sm font-semibold text-white shadow-md shadow-violet-100 transition hover:bg-violet-700">
                      Use Template
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="bg-white px-6 py-20 [scroll-margin-top:96px] sm:px-8 sm:py-24 lg:px-10">
        <div className="mx-auto max-w-3xl lg:max-w-4xl">
          <div className="mb-12 text-center sm:mb-14" data-aos="fade-up">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Everything <span className="text-violet-600">you need to know</span>
            </h2>
            <p className="mt-4 text-base text-gray-500 sm:text-lg">
              Find answers to common questions about creating, customizing, and publishing your page with Vervin.
            </p>
          </div>
          <div className="space-y-3" data-aos="fade-up" data-aos-delay="100">
            {FAQS.map((faq, i) => (
              <div key={i} className={`overflow-hidden rounded-2xl border transition-all duration-200 ${openFaq === i ? "border-violet-200 shadow-md shadow-violet-50" : "border-gray-100 hover:border-gray-200"}`}>
                <button className="flex w-full items-center justify-between px-5 py-4 text-left sm:px-6 sm:py-5" onClick={() => setOpenFaq(openFaq === i ? null : i)} aria-expanded={openFaq === i}>
                  <span className={`text-sm font-semibold transition-colors sm:text-base ${openFaq === i ? "text-violet-600" : "text-gray-800"}`}>
                    {faq.q}
                  </span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`ml-4 flex-shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-180 text-violet-600" : "text-gray-400"}`}>
                    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ease-out ${openFaq === i ? "max-h-48 opacity-100" : "max-h-0 opacity-0"}`}>
                  <p className="px-5 pb-5 text-sm leading-relaxed text-gray-500 sm:px-6 sm:text-base">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-950 px-6 py-16 text-center text-white sm:px-8 sm:py-20 lg:px-10" data-aos="fade-up">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-5 text-3xl font-extrabold sm:text-4xl lg:text-5xl">
            Ready to build your <span className="text-violet-400">professional page?</span>
          </h2>
          <p className="mb-10 text-base text-gray-400 sm:text-lg">
            Create your portfolio, CV, or bio link in just four simple steps.
          </p>
          <Link href="/auth/sign-up" className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-8 py-4 text-base font-semibold text-white shadow-2xl shadow-violet-900/30 transition-all duration-200 hover:bg-violet-500 sm:text-lg">
            Get Started for Free
          </Link>
        </div>
      </section>

      <footer className="bg-gray-950 px-6 py-12 text-gray-400 sm:px-8 sm:py-14 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4">
            <div className="sm:col-span-2">
              <div className="mb-4 text-xl font-bold text-white">Vervin</div>
              <p className="max-w-xs text-sm leading-relaxed">
                Build portfolios, bio links, CVs, and more with ready-to-use templates in four simple steps.
              </p>
            </div>
            <div>
              <div className="mb-4 text-sm font-semibold text-white">Product</div>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="transition-colors hover:text-white">Features</a></li>
                <li><a href="#templates" className="transition-colors hover:text-white">Templates</a></li>
                <li><a href="#faq" className="transition-colors hover:text-white">FAQ</a></li>
                <li><Link href="/auth/login" className="transition-colors hover:text-white">Login</Link></li>
              </ul>
            </div>
            <div>
              <div className="mb-4 text-sm font-semibold text-white">Resources</div>
              <ul className="space-y-2 text-sm">
                <li><a href="#templates" className="transition-colors hover:text-white">Templates</a></li>
                <li><a href="#faq" className="transition-colors hover:text-white">FAQ</a></li>
                <li><Link href="/blog" className="transition-colors hover:text-white">Blog</Link></li>
                <li><Link href="/help" className="transition-colors hover:text-white">Help Center</Link></li>
              </ul>
            </div>
            <div>
              <div className="mb-4 text-sm font-semibold text-white">Company</div>
              <ul className="space-y-2 text-sm">
                <li><Link href="/company" className="transition-colors hover:text-white">Company</Link></li>
                <li><Link href="/contact" className="transition-colors hover:text-white">Contact</Link></li>
                <li><Link href="/privacy" className="transition-colors hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="transition-colors hover:text-white">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 pt-6 text-center text-xs text-gray-600">
            © {new Date().getFullYear()} Vervin. All rights reserved.
          </div>
        </div>
      </footer>

      <div className="bg-violet-600 px-6 py-3 text-center text-sm font-medium text-white">
        Created with <span className="text-white">♥</span> by <span className="font-semibold">Belhart Rajesky Pasaribu</span>
      </div>
    </div>
  );
}

function StepIllustration({ type, index }: { type: string; index: number }) {
  const colors = [
    { bg: "from-violet-50 to-purple-100", accent: "bg-violet-500", border: "border-violet-200" },
    { bg: "from-blue-50 to-cyan-100", accent: "bg-blue-500", border: "border-blue-200" },
    { bg: "from-rose-50 to-pink-100", accent: "bg-rose-500", border: "border-rose-200" },
    { bg: "from-amber-50 to-orange-100", accent: "bg-amber-500", border: "border-amber-200" },
  ];
  const c = colors[index % colors.length];

  const illustrations: Record<string, React.ReactNode> = {
    choose: (
      <div className={`w-full max-w-xs rounded-3xl border bg-gradient-to-br p-6 sm:max-w-sm sm:p-8 lg:max-w-md ${c.bg} ${c.border}`}>
        <Image src="/images/Select-amico.png" alt="Choose a Template" width={700} height={700} className="h-auto w-full object-contain" />
      </div>
    ),
    fill: (
      <div className={`w-full max-w-xs rounded-3xl border bg-gradient-to-br p-6 sm:max-w-sm sm:p-8 lg:max-w-md ${c.bg} ${c.border}`}>
        <Image src="/images/Fill out-amico.png" alt="Fill in Your Information" width={700} height={700} className="h-auto w-full object-contain" />
      </div>
    ),
    customize: (
      <div className={`w-full max-w-xs rounded-3xl border bg-gradient-to-br p-6 sm:max-w-sm sm:p-8 lg:max-w-md ${c.bg} ${c.border}`}>
        <Image src="/images/Advanced customization-amico.png" alt="Customize Your Design" width={700} height={700} className="h-auto w-full object-contain" />
      </div>
    ),
    publish: (
      <div className={`w-full max-w-xs rounded-3xl border bg-gradient-to-br p-6 sm:max-w-sm sm:p-8 lg:max-w-md ${c.bg} ${c.border}`}>
        <Image src="/images/Blog post-amico.png" alt="Publish & Share" width={700} height={700} className="h-auto w-full object-contain" />
      </div>
    ),
  };

  return illustrations[type] || <div />;
}
