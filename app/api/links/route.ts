import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

async function getCurrentProfileId() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized", status: 401, supabase, profileId: null };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return {
      error: "Profil tidak ditemukan.",
      status: 404,
      supabase,
      profileId: null,
    };
  }

  return { supabase, profileId: profile.id, status: 200, error: null };
}

export async function GET() {
  try {
    const result = await getCurrentProfileId();

    if (!result.profileId || !result.supabase) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status }
      );
    }

    const { data: links, error } = await result.supabase
      .from("links")
      .select("id, title, url, sort_order, is_active")
      .eq("user_id", result.profileId)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ links });
  } catch {
    return NextResponse.json(
      { error: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const result = await getCurrentProfileId();

    if (!result.profileId || !result.supabase) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status }
      );
    }

    const body = await request.json();
    const title = String(body.title || "").trim();
    const url = String(body.url || "").trim();

    if (!title || !url) {
      return NextResponse.json(
        { error: "Judul dan URL wajib diisi." },
        { status: 400 }
      );
    }

    const urlRegex = /^https?:\/\/.+/i;

    if (!urlRegex.test(url)) {
      return NextResponse.json(
        { error: "URL harus diawali http:// atau https://." },
        { status: 400 }
      );
    }

    const { data: existingLinks } = await result.supabase
      .from("links")
      .select("sort_order")
      .eq("user_id", result.profileId)
      .order("sort_order", { ascending: false })
      .limit(1);

    const nextSortOrder =
      existingLinks && existingLinks.length > 0
        ? existingLinks[0].sort_order + 1
        : 0;

    const { error } = await result.supabase.from("links").insert({
      user_id: result.profileId,
      title,
      url,
      sort_order: nextSortOrder,
      is_active: true,
    });

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

export async function PATCH(request: Request) {
  try {
    const result = await getCurrentProfileId();

    if (!result.profileId || !result.supabase) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status }
      );
    }

    const body = await request.json();
    const id = String(body.id || "").trim();
    const action = String(body.action || "").trim();
    const direction = String(body.direction || "").trim();
    const title = String(body.title || "").trim();
    const url = String(body.url || "").trim();

    if (!id) {
      return NextResponse.json(
        { error: "ID link wajib dikirim." },
        { status: 400 }
      );
    }

    if (action === "move") {
      const { data: currentLink, error: currentLinkError } = await result.supabase
        .from("links")
        .select("id, sort_order")
        .eq("id", id)
        .eq("user_id", result.profileId)
        .single();

      if (currentLinkError || !currentLink) {
        return NextResponse.json(
          { error: "Link tidak ditemukan." },
          { status: 404 }
        );
      }

      const operator = direction === "up" ? "lt" : "gt";
      const orderAscending = direction === "up" ? false : true;

      let query = result.supabase
        .from("links")
        .select("id, sort_order")
        .eq("user_id", result.profileId);

      if (operator === "lt") {
        query = query.lt("sort_order", currentLink.sort_order);
      } else {
        query = query.gt("sort_order", currentLink.sort_order);
      }

      const { data: swapCandidate, error: swapError } = await query
        .order("sort_order", { ascending: orderAscending })
        .limit(1)
        .maybeSingle();

      if (swapError) {
        return NextResponse.json(
          { error: swapError.message },
          { status: 500 }
        );
      }

      if (!swapCandidate) {
        return NextResponse.json(
          { error: "Link tidak bisa dipindahkan lagi." },
          { status: 400 }
        );
      }

      const { error: firstUpdateError } = await result.supabase
        .from("links")
        .update({ sort_order: swapCandidate.sort_order })
        .eq("id", currentLink.id)
        .eq("user_id", result.profileId);

      if (firstUpdateError) {
        return NextResponse.json(
          { error: firstUpdateError.message },
          { status: 500 }
        );
      }

      const { error: secondUpdateError } = await result.supabase
        .from("links")
        .update({ sort_order: currentLink.sort_order })
        .eq("id", swapCandidate.id)
        .eq("user_id", result.profileId);

      if (secondUpdateError) {
        return NextResponse.json(
          { error: secondUpdateError.message },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true });
    }

    if (!title || !url) {
      return NextResponse.json(
        { error: "Judul dan URL wajib diisi." },
        { status: 400 }
      );
    }

    const urlRegex = /^https?:\/\/.+/i;

    if (!urlRegex.test(url)) {
      return NextResponse.json(
        { error: "URL harus diawali http:// atau https://." },
        { status: 400 }
      );
    }

    const { error } = await result.supabase
      .from("links")
      .update({
        title,
        url,
      })
      .eq("id", id)
      .eq("user_id", result.profileId);

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

export async function DELETE(request: Request) {
  try {
    const result = await getCurrentProfileId();

    if (!result.profileId || !result.supabase) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status }
      );
    }

    const body = await request.json();
    const id = String(body.id || "").trim();

    if (!id) {
      return NextResponse.json(
        { error: "ID link wajib dikirim." },
        { status: 400 }
      );
    }

    const { error } = await result.supabase
      .from("links")
      .delete()
      .eq("id", id)
      .eq("user_id", result.profileId);

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

