"use client";

import { useState } from "react";

type LinkItem = {
  id: string;
  title: string;
  url: string;
  is_active: boolean;
  sort_order: number | null;
};

export default function LinkList({
  links,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
}: {
  links: LinkItem[];
  onUpdate: (formData: FormData) => Promise<void>;
  onDelete: (formData: FormData) => Promise<void>;
  onMoveUp: (formData: FormData) => Promise<void>;
  onMoveDown: (formData: FormData) => Promise<void>;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);

  if (!links.length) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-4 py-8 text-center text-sm text-zinc-500">
        Belum ada link. Tambahkan link pertama di form atas.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {links.map((link, index) => {
        const isEditing = editingId === link.id;
        const isFirst = index === 0;
        const isLast = index === links.length - 1;

        return (
          <div
            key={link.id}
            className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm"
          >
            <div className="space-y-4">
              <form action={onUpdate} className="space-y-4">
                <input type="hidden" name="id" value={link.id} />

                <div className="grid gap-3 md:grid-cols-[1fr_1.2fr_auto]">
                  <input
                    name="title"
                    defaultValue={link.title}
                    disabled={!isEditing}
                    className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100 disabled:opacity-70"
                  />
                  <input
                    name="url"
                    defaultValue={link.url}
                    disabled={!isEditing}
                    className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100 disabled:opacity-70"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingId(isEditing ? null : link.id)}
                      className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
                    >
                      {isEditing ? "Batal" : "Edit"}
                    </button>

                    {isEditing ? (
                      <button
                        type="submit"
                        className="rounded-2xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700"
                      >
                        Simpan
                      </button>
                    ) : null}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-zinc-700">
                    <input
                      type="checkbox"
                      name="is_active"
                      defaultChecked={link.is_active}
                      className="h-4 w-4 cursor-pointer rounded border-zinc-300 bg-white text-violet-600 focus:ring-violet-500 disabled:cursor-not-allowed"
                      disabled={!isEditing}
                    />
                    Aktif
                  </label>
                </div>
              </form>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex gap-2">
                  <form action={onMoveUp}>
                    <input type="hidden" name="id" value={link.id} />
                    <input
                      type="hidden"
                      name="sort_order"
                      value={link.sort_order ?? 0}
                    />
                    <button
                      type="submit"
                      disabled={isFirst}
                      className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Naik
                    </button>
                  </form>

                  <form action={onMoveDown}>
                    <input type="hidden" name="id" value={link.id} />
                    <input
                      type="hidden"
                      name="sort_order"
                      value={link.sort_order ?? 0}
                    />
                    <button
                      type="submit"
                      disabled={isLast}
                      className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Turun
                    </button>
                  </form>
                </div>

                <form action={onDelete}>
                  <input type="hidden" name="id" value={link.id} />
                  <button
                    type="submit"
                    className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-100"
                  >
                    Hapus
                  </button>
                </form>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}