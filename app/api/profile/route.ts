import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

const RESERVED_USERNAMES = [
  "api",
  "auth",
  "dashboard",
  "protected",
  "login",
  "signup",
  "sign-up",
  "sign-in",
  "logout",
  "about",
  "contact",
  "pricing",
  "features",
  "templates",
  "admin",
  "support",
  "settings",
  "terms",
  "privacy",
  "favicon.ico",
  "robots.txt",
  "sitemap.xml",
];

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const username = String(body.username || "")
      .trim()
      .toLowerCase();
    const display_name = String(body.display_name || "").trim();
    const bio = String(body.bio || "").trim();

    if (!username) {
      return NextResponse.json(
        { error: "Username wajib diisi." },
        { status: 400 }
      );
    }

    const usernameRegex = /^[a-z0-9_]+$/;

    if (!usernameRegex.test(username)) {
      return NextResponse.json(
        { error: "Username hanya boleh huruf kecil, angka, dan underscore." },
        { status: 400 }
      );
    }

    if (RESERVED_USERNAMES.includes(username)) {
      return NextResponse.json(
        { error: "Username ini tidak bisa digunakan. Pilih username lain." },
        { status: 400 }
      );
    }

    const { data: existingUsername, error: usernameCheckError } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username)
      .neq("id", user.id)
      .maybeSingle();

    if (usernameCheckError) {
      return NextResponse.json(
        { error: usernameCheckError.message },
        { status: 500 }
      );
    }

    if (existingUsername) {
      return NextResponse.json(
        { error: "Username sudah dipakai. Coba username lain." },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        username,
        display_name,
        bio,
      })
      .eq("id", user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}
