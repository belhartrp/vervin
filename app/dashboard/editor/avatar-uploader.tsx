"use client";

import { useCallback, useMemo, useRef, useState, useTransition } from "react";
import Cropper from "react-easy-crop";
import { uploadBioLinkAvatar } from "./actions";

type Props = {
  currentAvatarUrl: string | null;
};

type Area = {
  width: number;
  height: number;
  x: number;
  y: number;
};

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });
}

async function getCroppedFile(imageSrc: string, pixelCrop: Area) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("Canvas tidak tersedia");

  const size = 512;
  canvas.width = size;
  canvas.height = size;

  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    size,
    size
  );

  return new Promise<File>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Gagal membuat blob hasil crop"));
          return;
        }

        resolve(new File([blob], "avatar.jpg", { type: "image/jpeg" }));
      },
      "image/jpeg",
      0.92
    );
  });
}

export default function AvatarUploader({ currentAvatarUrl }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1.2);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentAvatarUrl ?? null
  );
  const [error, setError] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  const hasEditor = useMemo(() => Boolean(imageSrc), [imageSrc]);

  const onCropComplete = useCallback(
    (_: unknown, croppedAreaPixelsValue: Area) => {
      setCroppedAreaPixels(croppedAreaPixelsValue);
    },
    []
  );

  const handlePickFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Format file harus JPG, PNG, atau WEBP.");
      return;
    }

    if (file.size > 6 * 1024 * 1024) {
      setError("Ukuran file maksimal 6MB.");
      return;
    }

    setError("");
    const objectUrl = URL.createObjectURL(file);
    setImageSrc(objectUrl);
    setZoom(1.2);
    setCrop({ x: 0, y: 0 });
  };

  const handleSave = async () => {
    if (!imageSrc || !croppedAreaPixels) {
      setError("Area crop belum siap.");
      return;
    }

    try {
      setError("");
      const croppedFile = await getCroppedFile(imageSrc, croppedAreaPixels);
      const localPreview = URL.createObjectURL(croppedFile);
      setPreviewUrl(localPreview);

      const formData = new FormData();
      formData.append("avatar", croppedFile);

      startTransition(async () => {
        await uploadBioLinkAvatar(formData);
      });
    } catch {
      setError("Gagal memproses crop avatar.");
    }
  };

  const handleCancel = () => {
    setImageSrc(null);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-4">
      {previewUrl ? (
        <div className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4">
          <div className="h-16 w-16 overflow-hidden rounded-full border border-zinc-200 bg-white">
            <img
              src={previewUrl}
              alt="Preview avatar"
              className="h-full w-full object-cover"
            />
          </div>
          <p className="text-sm text-zinc-600">
            Pilih gambar baru lalu atur posisi crop di dalam lingkaran.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-4 py-4 text-sm text-zinc-500">
          Belum ada foto profil.
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handlePickFile}
          className="block w-full text-sm text-zinc-600 file:mr-4 file:cursor-pointer file:rounded-xl file:border-0 file:bg-zinc-100 file:px-4 file:py-2 file:font-semibold file:text-zinc-700 hover:file:bg-zinc-200 transition"
        />
      </div>

      {hasEditor ? (
        <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
          <div className="relative h-[320px] w-full bg-zinc-100">
            <Cropper
              image={imageSrc ?? ""}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              objectFit="cover"
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>

          <div className="space-y-4 p-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Zoom
              </label>
              <input
                type="range"
                min={1}
                max={3}
                step={0.01}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full accent-violet-600"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleSave}
                disabled={isPending}
                className="rounded-2xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? "Menyimpan..." : "Simpan avatar"}
              </button>

              <button
                type="button"
                onClick={handleCancel}
                disabled={isPending}
                className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      ) : null}
    </div>
  );
}