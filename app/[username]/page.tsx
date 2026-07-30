import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import PublicBiolinkView from "./public-biolink-view";

type PublicProfilePageProps = {
  params: Promise<{
    username: string;
  }>;
};

export async function generateMetadata({
  params,
}: PublicProfilePageProps) {
  const { username } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, active_template")
    .eq("username", username)
    .maybeSingle();

  if (!profile || profile.active_template !== "biolink") {
    return {
      title: "Vervin",
      description: "Halaman publik Vervin",
    };
  }

  const { data: biolinkProfile } = await supabase
    .from("biolink_profiles")
    .select("display_name, bio")
    .eq("user_id", profile.id)
    .maybeSingle();

  return {
    title: `${biolinkProfile?.display_name?.trim() || profile.username} | Vervin`,
    description:
      biolinkProfile?.bio?.trim() ||
      `Halaman publik ${profile.username} di Vervin`,
  };
}

export default async function PublicProfilePage({
  params,
}: PublicProfilePageProps) {
  const { username } = await params;
  const supabase = await createClient();

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, username, active_template")
    .eq("username", username)
    .maybeSingle();

  if (profileError || !profile) {
    notFound();
  }

  if (profile.active_template !== "biolink") {
    notFound();
  }

  const [{ data: biolinkProfile }, { data: links }] = await Promise.all([
    supabase
      .from("biolink_profiles")
      .select("display_name, bio, avatar_url")
      .eq("user_id", profile.id)
      .maybeSingle(),
    supabase
      .from("biolink_links")
      .select("id, title, url, sort_order, is_active")
      .eq("user_id", profile.id)
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true }),
  ]);

  return (
    <PublicBiolinkView
      username={profile.username}
      displayName={biolinkProfile?.display_name?.trim() || profile.username}
      bio={biolinkProfile?.bio?.trim() || "Bio pengguna ini belum diisi."}
      avatarUrl={biolinkProfile?.avatar_url?.trim() || ""}
      links={(links ?? []).map((item) => ({
        id: item.id,
        title: item.title,
        url: item.url,
      }))}
    />
  );
}