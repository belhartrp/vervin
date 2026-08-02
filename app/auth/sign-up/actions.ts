"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

function safe(value: unknown) {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

function makeUsername(email: string) {
  return email
    .split("@")[0]
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "")
    .slice(0, 20);
}

export async function signUp(formData: FormData) {
  const supabase = await createClient();

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();

  console.log("[SIGNUP] email:", email);
  console.log("[SIGNUP] password length:", password.length);

  if (!email || !password) {
    redirect(`/auth/sign-up?error=${encodeURIComponent("Email dan password wajib diisi")}`);
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";

  console.log("[SIGNUP] siteUrl:", siteUrl);
  console.log("[SIGNUP] callback:", `${siteUrl}/auth/callback`);

  const result = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback`,
    },
  });

  console.log("[SIGNUP] full result:", safe(result));
  console.log("[SIGNUP] data:", safe(result.data));
  console.log("[SIGNUP] error:", safe(result.error));

  if (result.error) {
    const message =
      typeof result.error.message === "string" && result.error.message.trim()
        ? result.error.message.trim()
        : "Signup gagal dari Supabase";

    redirect(`/auth/sign-up?error=${encodeURIComponent(message)}`);
  }

  if (!result.data?.user) {
    redirect(`/auth/sign-up?error=${encodeURIComponent("User gagal dibuat.")}`);
  }

  if (
    Array.isArray(result.data.user.identities) &&
    result.data.user.identities.length === 0
  ) {
    redirect(
      `/auth/sign-up?error=${encodeURIComponent(
        "Email ini sudah terdaftar. Silakan masuk atau cek email verifikasi."
      )}`
    );
  }

  if (!result.data.session) {
    redirect("/auth/check-email");
  }

  // Safety net: pastikan profile ada meski trigger gagal
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", result.data.user.id)
    .maybeSingle();

  if (!existingProfile) {
    const baseUsername = makeUsername(result.data.user.email ?? email);

    const { error: profileError } = await supabase.from("profiles").insert({
      id: result.data.user.id,
      email: result.data.user.email ?? email,
      username: `${baseUsername}_${result.data.user.id.slice(0, 6)}`,
      active_template: "biolink",
    });

    if (profileError) {
      console.error("[SIGNUP] profile insert error:", profileError.message);
    }
  }

  redirect("/dashboard");
}