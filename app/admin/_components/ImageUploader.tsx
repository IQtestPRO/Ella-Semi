"use client";

import { useRef, useState } from "react";
import { Label, Button } from "./ui";
import type { Foto } from "../../../lib/schemas";

type SavedImage = {
  id: string;
  url: string;
  width: number;
  height: number;
};

async function uploadImage(
  file: File,
  alt: string,
): Promise<SavedImage | { error: string }> {
  const form = new FormData();
  form.append("file", file);
  form.append("alt", alt);
  const res = await fetch("/api/admin/images", { method: "POST", body: form });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return { error: data.error ?? "Falha no upload." };
  return data as SavedImage;
}

/** Campo de UMA imagem (ex.: foto do banner / hero). Guarda a URL. */
export function SingleImageField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    setBusy(true);
    setError("");
    const r = await uploadImage(file, label);
    setBusy(false);
    if ("error" in r) setError(r.error);
    else onChange(r.url);
  }

  return (
    <div>
      <Label hint={hint}>{label}</Label>
      <div className="flex items-center gap-4">
        <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[var(--color-areia)] bg-[var(--color-salmao-claro)]/40">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-xs text-[var(--color-taupe)]">sem foto</span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
              e.target.value = "";
            }}
          />
          <Button
            variant="ghost"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
          >
            {busy ? "Enviando…" : value ? "Trocar foto" : "Enviar foto"}
          </Button>
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-left text-xs text-[#b3261e] hover:underline"
            >
              Remover foto
            </button>
          )}
          {error && <span className="text-xs text-[#b3261e]">{error}</span>}
        </div>
      </div>
    </div>
  );
}

/** Galeria de várias fotos (produto). Adiciona via upload, remove, reordena. */
export function MultiImageField({
  label,
  hint,
  altBase,
  photos,
  onChange,
}: {
  label: string;
  hint?: string;
  altBase: string;
  photos: Foto[];
  onChange: (photos: Foto[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleFiles(files: FileList) {
    setBusy(true);
    setError("");
    const novas: Foto[] = [];
    for (const file of Array.from(files)) {
      const r = await uploadImage(file, altBase || label);
      if ("error" in r) {
        setError(r.error);
        continue;
      }
      novas.push({
        url: r.url,
        alt: altBase ? `${altBase}` : "Foto da peça",
        fonte: "upload-admin",
        width: r.width,
        height: r.height,
      });
    }
    setBusy(false);
    if (novas.length) onChange([...photos, ...novas]);
  }

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= photos.length) return;
    const next = [...photos];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }

  function remove(i: number) {
    onChange(photos.filter((_, idx) => idx !== i));
  }

  function setAlt(i: number, alt: string) {
    onChange(photos.map((p, idx) => (idx === i ? { ...p, alt } : p)));
  }

  return (
    <div>
      <Label hint={hint}>{label}</Label>
      <div className="flex flex-col gap-3">
        {photos.length === 0 && (
          <p className="rounded-xl border border-dashed border-[var(--color-areia)] px-4 py-6 text-center text-sm text-[var(--color-taupe)]">
            Nenhuma foto ainda. Sem foto, a peça mostra a silhueta padrão da
            marca no site.
          </p>
        )}
        {photos.map((p, i) => (
          <div
            key={`${p.url}-${i}`}
            className="flex items-start gap-3 rounded-xl border border-[var(--color-areia)] bg-white p-3"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.url}
              alt=""
              className="h-20 w-20 flex-shrink-0 rounded-lg object-cover"
            />
            <div className="flex flex-1 flex-col gap-2">
              <input
                value={p.alt}
                onChange={(e) => setAlt(i, e.target.value)}
                placeholder="Descrição da foto (para acessibilidade)"
                className="w-full rounded-lg border border-[var(--color-areia)] bg-[var(--color-salmao-claro)]/40 px-3 py-2 text-base md:text-sm"
              />
              <div className="flex items-center gap-3 text-xs">
                <span className="text-[var(--color-taupe)]">Foto {i + 1}</span>
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="rounded px-2 py-1 text-[var(--color-preto-warm)] disabled:opacity-30 hover:bg-[var(--color-salmao-claro)]"
                >
                  ↑ subir
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === photos.length - 1}
                  className="rounded px-2 py-1 text-[var(--color-preto-warm)] disabled:opacity-30 hover:bg-[var(--color-salmao-claro)]"
                >
                  ↓ descer
                </button>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="ml-auto rounded px-2 py-1 text-[#b3261e] hover:bg-[#b3261e]/10"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        ))}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <Button
          variant="ghost"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
        >
          {busy ? "Enviando…" : "+ Adicionar foto"}
        </Button>
        {error && <span className="text-xs text-[#b3261e]">{error}</span>}
      </div>
    </div>
  );
}
