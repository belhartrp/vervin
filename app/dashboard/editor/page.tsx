import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import {
  addBioLink,
  deleteBioLink,
  moveBioLinkDown,
  moveBioLinkUp,
  updateBioLink,
  updateBioLinkProfile,
} from "./actions";
import AvatarUploader from "./avatar-uploader";
import LinkList from "./link-list";

type BioLinkProfile = {
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
};

type BioLinkItem = {
  id: string;
  title: string;
  url: string;
  is_active: boolean;
  sort_order: number | null;
};

export default async function EditorPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string; saved?: string; link?: string }>;
}) {
  const params = searchParams ? await searchParams : {};
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, active_template")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || profile.active_template !== "biolink") {
    redirect("/dashboard/templates");
  }

  const [{ data: bioProfile }, { data: links }] = await Promise.all([
    supabase
      .from("biolink_profiles")
      .select("display_name, bio, avatar_url")
      .eq("user_id", user.id)
      .maybeSingle(),
    supabase
      .from("biolink_links")
      .select("id, title, url, is_active, sort_order")
      .eq("user_id", user.id)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true }),
  ]);

  const publicUrl = profile.username ? `/${profile.username}` : null;

  const profileData: BioLinkProfile = bioProfile ?? {
    display_name: "",
    bio: "",
    avatar_url: "",
  };

  const linkItems: BioLinkItem[] = (links ?? []) as BioLinkItem[];

  return (
    <main className="min-h-screen bg-[#f6f3ff] text-[#18181b]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <section className="relative overflow-hidden rounded-[32px] border border-white/70 bg-white/90 shadow-[0_20px_80px_rgba(109,40,217,0.10)] backdrop-blur">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.16),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(196,181,253,0.22),transparent_28%)]" />
          <div className="relative flex flex-col gap-8 px-6 py-7 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:px-10 lg:py-9">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-violet-700">
                Bio link editor
              </div>

              <h1 className="max-w-2xl text-3xl font-black leading-tight tracking-[-0.03em] text-[#111827] sm:text-4xl">
                Atur tampilan publikmu biar lebih rapi, konsisten, dan siap dibagikan.
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-600 sm:text-base">
                Edit identitas profil, upload avatar yang lebih proper, lalu susun
                link pentingmu dalam satu halaman publik yang bersih dan enak dilihat.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-zinc-500">
                <div className="rounded-full border border-zinc-200 bg-white px-3 py-2">
                  Username:{" "}
                  <span className="font-semibold text-zinc-800">
                    {profile.username ?? "-"}
                  </span>
                </div>
                <div className="rounded-full border border-zinc-200 bg-white px-3 py-2">
                  Total link:{" "}
                  <span className="font-semibold text-zinc-800">
                    {linkItems.length}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 lg:justify-end">
              {publicUrl ? (
                <Link
                  href={publicUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center justify-center rounded-2xl border border-violet-200 bg-white px-5 text-sm font-semibold text-violet-700 transition hover:border-violet-300 hover:bg-violet-50"
                >
                  Lihat halaman publik
                </Link>
              ) : null}

              <Link
                href="/dashboard/publish"
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-violet-600 px-5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(124,58,237,0.28)] transition hover:bg-violet-700"
              >
                Lanjut ke publish
              </Link>
            </div>
          </div>
        </section>

        {params?.error ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {params.error}
          </div>
        ) : null}

        {params?.saved || params?.link ? (
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-600">
            Perubahan berhasil disimpan.
          </div>
        ) : null}

        <div className="mt-8 grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
          <div className="space-y-6">
            <section className="overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0_16px_50px_rgba(17,24,39,0.06)]">
              <div className="border-b border-zinc-100 px-6 py-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-600">
                  Identity
                </p>
                <h2 className="mt-2 text-xl font-bold tracking-[-0.02em] text-zinc-900">
                  Profil biolink
                </h2>
                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  Lengkapi identitas utama yang akan tampil di halaman publikmu.
                </p>
              </div>

              <form action={updateBioLinkProfile} className="space-y-5 px-6 py-6">
                <div className="space-y-2">
                  <label
                    htmlFor="displayName"
                    className="text-sm font-medium text-zinc-700"
                  >
                    Display name
                  </label>
                  <input
                    id="displayName"
                    name="displayName"
                    defaultValue={profileData.display_name ?? ""}
                    placeholder="Misalnya Belhart Rajesky"
                    className="h-12 w-full rounded-2xl border border-zinc-200 bg-[#fcfcff] px-4 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="bio" className="text-sm font-medium text-zinc-700">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={5}
                    defaultValue={profileData.bio ?? ""}
                    placeholder="Tulis deskripsi singkat yang menjelaskan siapa kamu atau apa yang kamu kerjakan."
                    className="w-full rounded-2xl border border-zinc-200 bg-[#fcfcff] px-4 py-3 text-sm leading-6 text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex h-12 items-center justify-center rounded-2xl bg-zinc-950 px-5 text-sm font-semibold text-white transition hover:bg-zinc-800"
                >
                  Simpan perubahan profil
                </button>
              </form>
            </section>

            <section className="overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0_16px_50px_rgba(17,24,39,0.06)]">
              <div className="border-b border-zinc-100 px-6 py-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-600">
                  Avatar
                </p>
                <h2 className="mt-2 text-xl font-bold tracking-[-0.02em] text-zinc-900">
                  Foto profil
                </h2>
                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  Upload foto yang paling representatif, lalu sesuaikan crop supaya
                  tampil pas di preview publik.
                </p>
              </div>

              <div className="px-6 py-6">
                <div className="overflow-hidden rounded-[28px] border border-violet-100 bg-[linear-gradient(135deg,#faf7ff_0%,#f4efff_45%,#ffffff_100%)] p-4 sm:p-5">
                  <div className="grid gap-4 sm:grid-cols-[92px_minmax(0,1fr)] sm:items-center">
                    <div className="flex justify-center sm:justify-start">
                      <div className="relative h-24 w-24 overflow-hidden rounded-[28px] border border-white/80 bg-white shadow-[0_12px_30px_rgba(124,58,237,0.12)] ring-4 ring-white">
                        {profileData.avatar_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={profileData.avatar_url}
                            alt="Avatar preview"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-violet-100 text-2xl font-bold text-violet-600">
                            {(profileData.display_name?.[0] ?? "U").toUpperCase()}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-base font-semibold text-zinc-900">
                        Preview foto profil
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-zinc-600">
                        Gunakan foto yang jelas dan terpusat agar avatar tetap bagus
                        saat tampil dalam bentuk lingkaran di halaman publik.
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 rounded-[24px] border border-zinc-200 bg-white p-4 shadow-sm">
                    <AvatarUploader currentAvatarUrl={profileData.avatar_url} />
                  </div>
                </div>
              </div>
            </section>
          </div>

          <section className="overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0_16px_50px_rgba(17,24,39,0.06)]">
            <div className="flex flex-col gap-4 border-b border-zinc-100 px-6 py-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-600">
                  Links
                </p>
                <h2 className="mt-2 text-xl font-bold tracking-[-0.02em] text-zinc-900">
                  Daftar link publik
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
                  Tambahkan link penting, ubah judul, aktifkan atau nonaktifkan,
                  lalu susun urutannya sesuai prioritas.
                </p>
              </div>

              <div className="inline-flex h-10 items-center rounded-full border border-violet-200 bg-violet-50 px-4 text-sm font-semibold text-violet-700">
                {linkItems.length} link tersimpan
              </div>
            </div>

            <div className="px-6 py-6">
              <div className="rounded-[24px] border border-zinc-200 bg-[#fcfcff] p-4 sm:p-5">
                <h3 className="text-sm font-semibold text-zinc-900">
                  Tambah link baru
                </h3>
                <p className="mt-1 text-sm text-zinc-500">
                  Isi judul dan URL, lalu link akan masuk ke daftar editor.
                </p>

                <form
                  action={addBioLink}
                  className="mt-4 grid gap-3 lg:grid-cols-[0.9fr_1.2fr_auto]"
                >
                  <input
                    name="title"
                    placeholder="Contoh: Portfolio"
                    className="h-12 rounded-2xl border border-zinc-200 bg-white px-4 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                  />
                  <input
                    name="url"
                    placeholder="https://..."
                    className="h-12 rounded-2xl border border-zinc-200 bg-white px-4 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                  />
                  <button
                    type="submit"
                    className="inline-flex h-12 items-center justify-center rounded-2xl bg-violet-600 px-5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(124,58,237,0.22)] transition hover:bg-violet-700"
                  >
                    Tambah link
                  </button>
                </form>
              </div>

              <div className="mt-6">
                <LinkList
                  links={linkItems}
                  onUpdate={updateBioLink}
                  onDelete={deleteBioLink}
                  onMoveUp={moveBioLinkUp}
                  onMoveDown={moveBioLinkDown}
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}