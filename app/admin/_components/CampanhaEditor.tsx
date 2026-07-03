"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  TextInput,
  TextArea,
  Toggle,
  SaveBar,
  useSaveState,
  apiSend,
  Label,
} from "./ui";
import { SingleImageField } from "./ImageUploader";
import type { CampanhaAtual } from "../../../lib/schemas";

type ProdOption = { slug: string; nome: string; categoria: string };

export function CampanhaEditor({
  campanha,
  produtos,
}: {
  campanha: CampanhaAtual;
  produtos: ProdOption[];
}) {
  const router = useRouter();
  const save = useSaveState();

  const [nomeExibicao, setNomeExibicao] = useState(campanha.nomeExibicao);
  const [slug, setSlug] = useState(campanha.slug);
  const [manifesto, setManifesto] = useState(campanha.manifesto);
  const [ctaTexto, setCtaTexto] = useState(campanha.ctaTexto);
  const [heroImagem, setHeroImagem] = useState(campanha.heroImagem ?? "");
  const [heroVideo, setHeroVideo] = useState(campanha.heroVideo ?? "");
  const [ativa, setAtiva] = useState(campanha.ativa);
  const [selecionados, setSelecionados] = useState<string[]>(
    campanha.produtosDestaqueSlugs,
  );
  const [q, setQ] = useState("");

  const filtrados = useMemo(() => {
    const n = q.trim().toLowerCase();
    return produtos.filter((p) => !n || p.nome.toLowerCase().includes(n));
  }, [produtos, q]);

  function toggle(slugSel: string) {
    setSelecionados((cur) =>
      cur.includes(slugSel)
        ? cur.filter((s) => s !== slugSel)
        : [...cur, slugSel],
    );
  }

  async function handleSave() {
    if (selecionados.length === 0) {
      save.run(async () => ({
        ok: false,
        error: "Escolha pelo menos uma peça em destaque.",
      }));
      return;
    }
    const ok = await save.run(() =>
      apiSend("PUT", "/api/admin/campanha", {
        slug: slug.trim() || "campanha",
        nomeExibicao: nomeExibicao.trim(),
        manifesto: manifesto.trim(),
        ctaTexto: ctaTexto.trim(),
        heroImagem: heroImagem || undefined,
        heroVideo: heroVideo || undefined,
        produtosDestaqueSlugs: selecionados,
        ativa,
      }),
    );
    if (ok) router.refresh();
  }

  return (
    <div className="flex flex-col gap-5">
      <Card
        title="Campanha em destaque"
        description="É a seção sazonal da home (ex.: Outono na ELLA). Some da home quando desligada."
      >
        <div className="flex flex-col gap-4">
          <Toggle
            label="Mostrar campanha na home"
            checked={ativa}
            onChange={setAtiva}
          />
          <TextInput
            label="Nome que aparece"
            value={nomeExibicao}
            onChange={(e) => setNomeExibicao(e.target.value)}
            placeholder="Ex.: Folhas de Outono"
          />
          <TextInput
            label="Identificador (interno)"
            hint="só letras minúsculas e hífen"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="outono-2026"
          />
          <TextArea
            label="Texto / manifesto"
            value={manifesto}
            onChange={(e) => setManifesto(e.target.value)}
          />
          <TextInput
            label="Texto do botão"
            value={ctaTexto}
            onChange={(e) => setCtaTexto(e.target.value)}
            placeholder="Ver peças desta estação"
          />
        </div>
      </Card>

      <Card title="Imagem / vídeo da campanha">
        <div className="flex flex-col gap-4">
          <SingleImageField
            label="Imagem de destaque"
            hint="usada quando não há vídeo"
            value={heroImagem}
            onChange={setHeroImagem}
          />
          <TextInput
            label="Link do vídeo (opcional)"
            hint="cole a URL de um .mp4 se tiver"
            value={heroVideo}
            onChange={(e) => setHeroVideo(e.target.value)}
            placeholder="/assets/generated/campanha/...mp4"
          />
        </div>
      </Card>

      <Card
        title="Peças em destaque"
        description={`${selecionados.length} selecionada(s). Aparecem na home e na página /campanha.`}
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar peça…"
          className="mb-3 w-full rounded-xl border border-[var(--color-areia)] bg-white px-4 py-3 outline-none focus:border-[var(--color-dourado-claro)] focus:ring-2 focus:ring-[var(--color-dourado-claro)]/40"
        />
        <div className="max-h-80 overflow-y-auto rounded-xl border border-[var(--color-areia)]">
          {filtrados.map((p) => {
            const checked = selecionados.includes(p.slug);
            return (
              <button
                type="button"
                key={p.slug}
                onClick={() => toggle(p.slug)}
                className={`flex w-full items-center gap-3 border-b border-[var(--color-areia)]/60 px-4 py-2.5 text-left transition last:border-0 ${
                  checked
                    ? "bg-[var(--color-dourado-claro)]/20"
                    : "hover:bg-[var(--color-salmao-claro)]/50"
                }`}
              >
                <span
                  className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border ${
                    checked
                      ? "border-[var(--color-preto-warm)] bg-[var(--color-preto-warm)] text-white"
                      : "border-[var(--color-taupe)]"
                  }`}
                >
                  {checked ? "✓" : ""}
                </span>
                <span className="text-sm text-[var(--color-preto-warm)]">
                  {p.nome}
                </span>
                <span className="ml-auto text-xs text-[var(--color-taupe)]">
                  {p.categoria}
                </span>
              </button>
            );
          })}
        </div>
      </Card>

      <div className="sticky bottom-0 -mx-4 border-t border-[var(--color-areia)] bg-[var(--color-salmao-claro)]/95 px-4 py-3 backdrop-blur md:mx-0 md:rounded-2xl md:border md:px-5">
        <SaveBar
          status={save.status}
          message={save.message}
          onSave={handleSave}
          saveLabel="Salvar campanha"
        />
      </div>
    </div>
  );
}
