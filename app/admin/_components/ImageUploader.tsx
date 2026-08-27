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
  /** Proporção alvo (largura/altura). O corte acontece no servidor. */
  proporcao?: number,
): Promise<SavedImage | { error: string }> {
  const form = new FormData();
  form.append("file", file);
  form.append("alt", alt);
  if (proporcao) form.append("proporcao", String(proporcao));
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
  proporcao,
  previewClassName,
  fotoAtual,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (url: string) => void;
  /** Recorta a foto nesta proporção no envio (ex.: 4/5 do card de categoria). */
  proporcao?: number;
  /** Formato da miniatura, para ela mostrar o mesmo recorte do site. */
  previewClassName?: string;
  /**
   * O que está no site quando ela ainda não enviou nada. Sem isto a miniatura
   * dizia "sem foto" mesmo havendo foto publicada — editar às cegas (ADR-0024).
   */
  fotoAtual?: string;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    setBusy(true);
    setError("");
    const r = await uploadImage(file, label, proporcao);
    setBusy(false);
    if ("error" in r) setError(r.error);
    else onChange(r.url);
  }

  return (
    <div>
      <Label hint={hint}>{label}</Label>
      <div className="flex items-center gap-4">
        <div
          className={`flex flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[var(--color-areia)] bg-[var(--color-salmao-claro)]/40 ${previewClassName ?? "h-24 w-24"}`}
        >
          {value || fotoAtual ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value || fotoAtual}
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
              className="inline-flex min-h-[44px] items-center text-left text-[15px] font-medium text-[#b3261e] transition hover:underline"
            >
              {fotoAtual ? "Voltar a foto original" : "Remover foto"}
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

  function remove(i: number) {
    onChange(photos.filter((_, idx) => idx !== i));
  }

  /** Promove a foto a capa (posição 1) num toque só — sem subir de 1 em 1. */
  function tornarCapa(i: number) {
    if (i === 0) return;
    const next = [...photos];
    const [alvo] = next.splice(i, 1);
    onChange([alvo, ...next]);
  }

  return (
    <div>
      {label && <Label hint={hint}>{label}</Label>}
      <div className="flex flex-col gap-3">
        {photos.length === 0 && (
          <p className="rounded-xl border border-dashed border-[var(--color-areia)] px-4 py-6 text-center text-[15px] text-[var(--color-taupe)]">
            Nenhuma foto ainda. Toque no botão abaixo para enviar a primeira.
          </p>
        )}
        {photos.map((p, i) => (
          <div
            key={`${p.url}-${i}`}
            className="flex items-center gap-3 rounded-xl border border-[var(--color-areia)] bg-white p-3"
          >
            <div className="relative flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.url}
                alt=""
                className="h-24 w-24 rounded-lg object-cover"
              />
              {i === 0 && (
                <span className="absolute left-1 top-1 rounded-full bg-[var(--color-preto-warm)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--color-salmao-claro)]">
                  Capa
                </span>
              )}
            </div>
            <div className="flex flex-1 flex-col items-start gap-2">
              <span className="text-[15px] text-[var(--color-preto-warm)]">
                {i === 0 ? "Aparece na vitrine" : `Foto ${i + 1}`}
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {i !== 0 && (
                  <button
                    type="button"
                    onClick={() => tornarCapa(i)}
                    className="inline-flex min-h-[44px] items-center rounded-lg border border-[var(--color-areia)] px-3 text-sm font-medium text-[var(--color-preto-warm)] transition hover:border-[var(--color-dourado-claro)] hover:bg-[var(--color-salmao-claro)]/60"
                  >
                    Usar como capa
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="inline-flex min-h-[44px] items-center rounded-lg px-3 text-sm font-medium text-[#b3261e] transition hover:bg-[#b3261e]/10"
                >
                  Tirar esta foto
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
          className="min-h-[52px] text-base"
        >
          {busy ? "Enviando…" : "📷  Enviar foto do celular ou computador"}
        </Button>
        {error && <span className="text-sm text-[#b3261e]">{error}</span>}
      </div>
    </div>
  );
}
