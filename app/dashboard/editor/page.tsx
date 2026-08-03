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
    <main className="min-h-screen bg-[#F7F5FF] px-6 py-12 text-zinc-900">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-sm uppercase tracking-[0.2em] text-violet-500">
              Editor
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl">
              Edit biolink
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500 md:text-base">
              Kelola profil utama dan daftar link yang tampil di halaman publikmu.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {publicUrl ? (
              <Link
                href={publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl border border-violet-200 bg-white px-4 py-3 text-sm font-medium text-violet-600 transition hover:border-violet-300 hover:bg-violet-50"
              >
                Lihat publik
              </Link>
            ) : null}

            <Link
              href="/dashboard/publish"
              className="rounded-2xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-violet-200 transition hover:bg-violet-700"
            >
              Ke publish
            </Link>
          </div>
        </div>

        {params?.error ? (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {params.error}
          </div>
        ) : null}

        {params?.saved || params?.link ? (
          <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-600">
            Perubahan berhasil disimpan.
          </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-3xl border border-violet-100 bg-white p-6 shadow-sm shadow-violet-100/50">
            <h2 className="text-xl font-semibold text-zinc-900">Profil biolink</h2>
            <p className="mt-2 text-sm text-zinc-500">
              Data ini dipakai sebagai identitas utama halaman publik.
            </p>

            <form action={updateBioLinkProfile} className="mt-6 space-y-5">
              <div>
                <label
                  className="mb-2 block text-sm text-zinc-600"
                  htmlFor="displayName"
                >
                  Display name
                </label>
                <input
                  id="displayName"
                  name="displayName"
                  defaultValue={profileData.display_name ?? ""}
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
                />
              </div>

              <div>
                <label
                  className="mb-2 block text-sm text-zinc-600"
                  htmlFor="bio"
                >
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows={4}
                  defaultValue={profileData.bio ?? ""}
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
                />
              </div>

              <button
                type="submit"
                className="rounded-2xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-violet-200 transition hover:bg-violet-700"
              >
                Simpan profil
              </button>
            </form>

            <div className="mt-8 space-y-3">
              <label className="block text-sm text-zinc-600">Foto profil</label>
              <AvatarUploader currentAvatarUrl={profileData.avatar_url} />
            </div>
          </section>

          <section className="rounded-3xl border border-violet-100 bg-white p-6 shadow-sm shadow-violet-100/50">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-zinc-900">Daftar link</h2>
                <p className="mt-2 text-sm text-zinc-500">
                  Tambah, ubah, aktif/nonaktif, hapus, dan atur urutan link yang tampil di publik.
                </p>
              </div>

              <div className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-medium text-violet-600">
                {linkItems.length} link
              </div>
            </div>

            <div className="mt-6">
              <form
                action={addBioLink}
                className="grid gap-3 md:grid-cols-[1fr_1.2fr_auto]"
              >
                <input
                  name="title"
                  placeholder="Judul link"
                  className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
                />
                <input
                  name="url"
                  placeholder="https://..."
                  className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
                />
                <button
                  type="submit"
                  className="rounded-2xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-violet-200 transition hover:bg-violet-700"
                >
                  Tambah
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
          </section>
        </div>
      </div>
    </main>
  );
}