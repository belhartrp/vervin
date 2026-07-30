"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

type LinkItem = {
  id: string;
  title: string;
  url: string;
};

type Props = {
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  links: LinkItem[];
};

export default function PublicBiolinkView({
  username,
  displayName,
  bio,
  avatarUrl,
  links,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);

  const initial =
    displayName?.trim()?.charAt(0)?.toUpperCase() ||
    username?.trim()?.charAt(0)?.toUpperCase() ||
    "L";

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const cleanups: Array<() => void> = [];

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) {
        gsap.set(
          [
            ".js-page-shell",
            ".js-avatar",
            ".js-name",
            ".js-handle",
            ".js-divider",
            ".js-bio",
            ".js-link-card",
            ".js-footer",
          ],
          {
            opacity: 1,
            clearProps: "all",
          }
        );

        return () => {
          mm.revert();
          cleanups.forEach((fn) => fn());
        };
      }

      gsap.set(
        [
          ".js-page-shell",
          ".js-avatar",
          ".js-name",
          ".js-handle",
          ".js-divider",
          ".js-bio",
          ".js-link-card",
          ".js-footer",
        ],
        { opacity: 0 }
      );

      gsap.set(".js-page-shell", { y: 40, scale: 0.97 });
      gsap.set(".js-avatar", { y: 20, scale: 0.88, rotate: -4 });
      gsap.set(".js-name", { y: 24 });
      gsap.set(".js-handle", { y: 18 });
      gsap.set(".js-divider", { scaleX: 0.4, y: 10 });
      gsap.set(".js-bio", { y: 18 });
      gsap.set(".js-link-card", { y: 30, scale: 0.98 });
      gsap.set(".js-footer", { y: 18 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.to(".js-page-shell", {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
      })
        .to(
          ".js-avatar",
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotate: 0,
            duration: 0.8,
          },
          "-=0.65"
        )
        .to(
          ".js-name",
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
          },
          "-=0.4"
        )
        .to(
          ".js-handle",
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
          },
          "-=0.3"
        )
        .to(
          ".js-divider",
          {
            opacity: 1,
            y: 0,
            scaleX: 1,
            duration: 0.5,
          },
          "-=0.25"
        )
        .to(
          ".js-bio",
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
          },
          "-=0.25"
        )
        .to(
          ".js-link-card",
          {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: 0.1,
            duration: 0.6,
          },
          "-=0.18"
        )
        .to(
          ".js-footer",
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
          },
          "-=0.2"
        );

      gsap.to(".js-aurora-a", {
        x: 120,
        y: -50,
        duration: 9,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".js-aurora-b", {
        x: -100,
        y: 60,
        duration: 11,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".js-aurora-c", {
        x: 80,
        y: 30,
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".js-shell-border", {
        rotate: 360,
        duration: 18,
        repeat: -1,
        ease: "none",
        transformOrigin: "center center",
      });

      gsap.to(".js-avatar-ring", {
        rotate: -360,
        duration: 12,
        repeat: -1,
        ease: "none",
        transformOrigin: "center center",
      });

      mm.add("(min-width: 768px)", () => {
        const shell = rootRef.current?.querySelector(
          ".js-page-shell"
        ) as HTMLElement | null;

        if (!shell) return;

        const onMove = (e: MouseEvent) => {
          const rect = shell.getBoundingClientRect();
          const px = (e.clientX - rect.left) / rect.width;
          const py = (e.clientY - rect.top) / rect.height;

          const rx = (py - 0.5) * -8;
          const ry = (px - 0.5) * 10;
          const mx = (px - 0.5) * 14;
          const my = (py - 0.5) * 10;

          gsap.to(shell, {
            rotateX: rx,
            rotateY: ry,
            x: mx,
            y: my,
            duration: 0.45,
            ease: "power3.out",
            transformPerspective: 1400,
            transformOrigin: "center center",
          });
        };

        const onLeave = () => {
          gsap.to(shell, {
            rotateX: 0,
            rotateY: 0,
            x: 0,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
          });
        };

        shell.addEventListener("mousemove", onMove);
        shell.addEventListener("mouseleave", onLeave);

        cleanups.push(() => {
          shell.removeEventListener("mousemove", onMove);
          shell.removeEventListener("mouseleave", onLeave);
        });
      });

      const cards = gsap.utils.toArray<HTMLElement>(".js-link-card");

      cards.forEach((card) => {
        const arrow = card.querySelector(".js-link-arrow");
        const glow = card.querySelector(".js-link-glow");
        const shine = card.querySelector(".js-link-shine");
        const border = card.querySelector(".js-link-border");

        const enter = () => {
          gsap.to(card, {
            y: -8,
            scale: 1.018,
            duration: 0.35,
            ease: "power2.out",
          });

          gsap.to(arrow, {
            x: 8,
            duration: 0.35,
            ease: "power2.out",
          });

          gsap.to(glow, {
            opacity: 1,
            duration: 0.3,
            ease: "power2.out",
          });

          gsap.to(border, {
            opacity: 1,
            duration: 0.3,
            ease: "power2.out",
          });

          gsap.fromTo(
            shine,
            { x: "-140%", opacity: 0 },
            {
              x: "140%",
              opacity: 0.9,
              duration: 0.9,
              ease: "power2.out",
            }
          );
        };

        const leave = () => {
          gsap.to(card, {
            y: 0,
            scale: 1,
            duration: 0.45,
            ease: "power3.out",
          });

          gsap.to(arrow, {
            x: 0,
            duration: 0.35,
            ease: "power2.out",
          });

          gsap.to(glow, {
            opacity: 0,
            duration: 0.35,
            ease: "power2.out",
          });

          gsap.to(border, {
            opacity: 0.72,
            duration: 0.35,
            ease: "power2.out",
          });
        };

        card.addEventListener("mouseenter", enter);
        card.addEventListener("mouseleave", leave);

        cleanups.push(() => {
          card.removeEventListener("mouseenter", enter);
          card.removeEventListener("mouseleave", leave);
        });
      });

      return () => {
        mm.revert();
        cleanups.forEach((fn) => fn());
      };
    },
    { scope: rootRef, dependencies: [links.length, avatarUrl, displayName, username] }
  );

  return (
    <main
      ref={rootRef}
      className="relative min-h-screen overflow-hidden bg-[#f8f3f0] px-4 py-8 text-[#2f2626] sm:px-6 sm:py-10"
    >
      <style jsx>{`
        @keyframes meshShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes lineFlow {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .mesh-gradient {
          background: linear-gradient(
            120deg,
            rgba(248, 201, 214, 0.98),
            rgba(220, 205, 255, 1),
            rgba(255, 224, 196, 0.94),
            rgba(248, 201, 214, 0.98)
          );
          background-size: 220% 220%;
          animation: meshShift 10s ease-in-out infinite;
        }

        .divider-flow {
          background: linear-gradient(
            90deg,
            #efc4cf,
            #d9c8ff,
            #f1d7c0,
            #efc4cf
          );
          background-size: 200% 200%;
          animation: lineFlow 4.5s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .mesh-gradient,
          .divider-flow {
            animation: none !important;
          }
        }
      `}</style>

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="js-aurora-a absolute -left-20 top-6 h-[320px] w-[320px] rounded-full bg-[#f2bfd0]/90 blur-[78px]" />
        <div className="js-aurora-b absolute right-[-50px] top-20 h-[340px] w-[340px] rounded-full bg-[#d7c8ff]/88 blur-[82px]" />
        <div className="js-aurora-c absolute bottom-[-50px] left-[28%] h-[300px] w-[300px] rounded-full bg-[#ffd9b8]/88 blur-[76px]" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-3xl items-center justify-center">
        <section className="js-page-shell relative w-full will-change-transform">
          <div className="relative rounded-[36px] p-[2px] sm:rounded-[42px]">
            <div className="js-shell-border mesh-gradient absolute inset-0 rounded-[36px] opacity-90 blur-[1px] sm:rounded-[42px]" />
            <div className="relative overflow-hidden rounded-[36px] bg-white/72 p-4 shadow-[0_35px_90px_rgba(96,63,63,0.12)] backdrop-blur-xl sm:rounded-[42px] sm:p-6">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.75),transparent_55%)]" />

              <div className="relative rounded-[30px] bg-[linear-gradient(180deg,rgba(255,255,255,0.97)_0%,rgba(255,248,250,0.90)_100%)] px-5 py-8 sm:rounded-[34px] sm:px-10 sm:py-12">
                <div className="text-center">
                  <div className="mb-6 flex justify-center sm:mb-7">
                    {avatarUrl ? (
                      <div className="js-avatar relative h-28 w-28 sm:h-32 sm:w-32">
                        <div className="js-avatar-ring mesh-gradient absolute inset-0 rounded-full p-[4px]">
                          <div className="h-full w-full rounded-full bg-transparent" />
                        </div>
                        <div className="absolute inset-[4px] overflow-hidden rounded-full border-4 border-white bg-white shadow-[0_18px_44px_rgba(127,93,93,0.14)]">
                          <Image
                            src={avatarUrl}
                            alt={`Avatar ${displayName}`}
                            fill
                            className="object-cover"
                            sizes="128px"
                            priority
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="js-avatar relative h-28 w-28 sm:h-32 sm:w-32">
                        <div className="js-avatar-ring mesh-gradient absolute inset-0 rounded-full p-[4px]" />
                        <div className="absolute inset-[4px] flex items-center justify-center rounded-full bg-[linear-gradient(135deg,#f6d7dc,#efe7ff)] text-4xl font-bold uppercase text-[#6a5252] shadow-[0_18px_44px_rgba(127,93,93,0.14)]">
                          {initial}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mx-auto max-w-xl">
                    <h1 className="js-name text-4xl font-semibold tracking-tight text-[#2f2626] sm:text-5xl">
                      {displayName}
                    </h1>

                    <p className="js-handle mt-3 text-sm font-medium uppercase tracking-[0.18em] text-[#b6868f]">
                      @{username}
                    </p>

                    <div className="js-divider divider-flow mx-auto mt-5 h-[3px] w-20 rounded-full" />

                    <p className="js-bio mx-auto mt-6 max-w-md text-sm leading-7 text-[#6d5c5c] sm:text-base">
                      {bio}
                    </p>
                  </div>
                </div>

                <div className="mt-10 space-y-4 sm:mt-12">
                  {links.length > 0 ? (
                    links.map((link) => (
                      <Link
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="js-link-card relative flex items-center gap-4 overflow-hidden rounded-[24px] bg-white/92 px-4 py-4 shadow-[0_18px_38px_rgba(109,79,79,0.10)] sm:px-5"
                      >
                        <div className="js-link-border mesh-gradient absolute inset-0 rounded-[24px] opacity-70 p-[1px]">
                          <div className="h-full w-full rounded-[24px] bg-transparent" />
                        </div>

                        <div className="js-link-glow pointer-events-none absolute inset-0 opacity-0">
                          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(247,220,227,0.28),rgba(235,228,255,0.22),rgba(249,232,216,0.24))]" />
                        </div>

                        <div className="js-link-shine pointer-events-none absolute inset-y-0 left-0 w-28 -skew-x-12 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.95),transparent)] opacity-0" />

                        <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#f8dbe1,#efe7ff)] text-[#9a6f76] shadow-inner">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="h-5 w-5"
                          >
                            <path d="M10 14L21 3" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M21 8V3H16" strokeLinecap="round" strokeLinejoin="round" />
                            <path
                              d="M21 14v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>

                        <div className="relative z-10 min-w-0 flex-1 text-left">
                          <p className="truncate text-base font-semibold text-[#2f2626] sm:text-lg">
                            {link.title}
                          </p>
                          <p className="mt-1 truncate text-sm text-[#8c7b7b]">
                            Tap untuk buka
                          </p>
                        </div>

                        <div className="js-link-arrow relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#f0e2de] bg-[#fff8f8] text-[#a67b83] shadow-[0_6px_18px_rgba(177,136,145,0.12)]">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="h-5 w-5"
                          >
                            <path d="M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="rounded-[24px] border border-dashed border-[#e9d9d9] bg-white/70 px-5 py-6 text-center text-[#9b8a8a]">
                      Belum ada link yang ditampilkan.
                    </div>
                  )}
                </div>

                <div className="js-footer mt-12 text-center">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-[#b7a4a4]">
                    Crafted with Vervin
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
