import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import CopyPublishUrlButton from "./copy-publish-url-button";

export default async function PublishPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, username, active_template")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || !profile) {
    redirect("/auth/login");
  }

  const publicUrl = profile.username ? `/${profile.username}` : null;

  let totalLinks = 0;
  let displayName = "";

  if (profile.active_template === "biolink") {
    const { data: biolinkProfile } = await supabase
      .from("biolink_profiles")
      .select("display_name")
      .eq("user_id", profile.id)
      .maybeSingle();

    displayName = biolinkProfile?.display_name ?? "";

    const { count } = await supabase
      .from("biolink_links")
      .select("*", { count: "exact", head: true })
      .eq("user_id", profile.id)
      .eq("is_active", true);

    totalLinks = count ?? 0;
  }

  return (
    <main className="min-h-screen bg-[#f8f7fc] px-6 py-12 text-zinc-800">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-violet-600">
              Publish
            </p>
            <h1 className="text-3xl font-black tracking-[-0.02em] text-zinc-900 md:text-4xl">
              Publish halaman publik
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500 md:text-base">
              Lihat alamat publikmu, salin link, dan pastikan konten sudah siap
              dibagikan.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard/editor"
              className="inline-flex items-center justify-center rounded-2xl border border-violet-200 bg-white px-5 py-3 text-sm font-semibold text-violet-700 transition hover:border-violet-300 hover:bg-violet-50"
            >
              Edit konten
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-2xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(124,58,237,0.18)] transition hover:bg-violet-700"
            >
              Kembali ke dashboard
            </Link>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="overflow-hidden rounded-[28px] border border-zinc-200 bg-white p-6 shadow-[0_12px_40px_rgba(17,24,39,0.05)] sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
              Public URL
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-[-0.02em] text-zinc-900">
              {publicUrl ?? "Username belum tersedia"}
            </h2>

            <p className="mt-3 text-sm leading-6 text-zinc-500">
              {publicUrl
                ? "Ini adalah URL yang bisa kamu bagikan ke orang lain."
                : "Atur username terlebih dahulu agar URL publik tersedia."}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {publicUrl ? (
                <>
                  <CopyPublishUrlButton value={publicUrl} />
                  <Link
                    href={publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-2xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(124,58,237,0.18)] transition hover:bg-violet-700"
                  >
                    Buka halaman publik
                  </Link>
                </>
              ) : null}
            </div>
          </section>

          <section className="overflow-hidden rounded-[28px] border border-zinc-200 bg-white p-6 shadow-[0_12px_40px_rgba(17,24,39,0.05)] sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
              Publish status
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-[-0.02em] text-zinc-900">
              {profile.active_template === "biolink"
                ? "Siap dipublish"
                : "Belum ada template"}
            </h2>

            <div className="mt-6 space-y-3 text-sm text-zinc-600">
              <div className="flex items-center justify-between rounded-2xl border border-zinc-100 bg-zinc-50 px-4 py-3">
                <span>Template aktif</span>
                <span className="font-semibold text-zinc-900">
                  {profile.active_template === "biolink"
                    ? "Bio Link"
                    : profile.active_template || "-"}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-zinc-100 bg-zinc-50 px-4 py-3">
                <span>Nama tampilan</span>
                <span className="font-semibold text-zinc-900">
                  {displayName || "Belum diisi"}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-zinc-100 bg-zinc-50 px-4 py-3">
                <span>Link aktif</span>
                <span className="font-semibold text-zinc-900">
                  {totalLinks}
                </span>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-4 py-4 text-sm text-zinc-500">
              Kalau konten sudah sesuai, halaman publikmu sudah siap untuk
              dibagikan.
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}