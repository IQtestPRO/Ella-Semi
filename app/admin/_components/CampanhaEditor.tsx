"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  TextInput,
  TextArea,
  Toggle,
  SaveBar,
  StepCard,
  useSaveState,
  apiSend,
} from "./ui";
import type { CampanhaAtual } from "../../../lib/schemas";

type ProdOption = {
  slug: string;
  nome: string;
  categoria: string;
  fotoUrl?: string;
};

/**
 * Vitrine de destaque da página inicial (ADR-0024).
 *
 * Tirados desta tela: "Identificador (interno)" (slug cru, com regra de
 * minúsculas e hífen), "Texto do botão" e o cartão de imagem/vídeo. Os três
 * eram gravados no banco e NENHUM componente do site os lê — a Ellen editava,
 * lia "Salvo! Já aparece no site", não achava e concluía que o painel quebrou.
 * A escolha das peças agora é feita vendo a FOTO, não uma lista de texto.
 */
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
  const [manifesto, setManifesto] = useState(campanha.manifesto);
  const [ativa, setAtiva] = useState(campanha.ativa);
  const [selecionados, setSelecionados] = useState<string[]>(
    campanha.produtosDestaqueSlugs,
  );
  const [q, setQ] = useState("");

  const porSlug = useMemo(() => {
    const m = new Map<string, ProdOption>();
    for (const p of produtos) m.set(p.slug, p);
    return m;
  }, [produtos]);

  const filtrados = useMemo(() => {
    const n = q
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .trim();
    if (!n) return produtos;
    return produtos.filter((p) =>
      p.nome
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .toLowerCase()
        .includes(n),
    );
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
        error: "Escolha pelo menos uma peça para aparecer em destaque.",
      }));
      return;
    }
    const ok = await save.run(() =>
      apiSend("PUT", "/api/admin/campanha", {
        // Campos que o site não mostra continuam gravados como estavam, para
        // não perder dado — mas saíram da tela (ADR-0024).
        slug: campanha.slug || "destaque",
        nomeExibicao: nomeExibicao.trim(),
        manifesto: manifesto.trim(),
        ctaTexto: campanha.ctaTexto,
        heroImagem: campanha.heroImagem,
        heroVideo: campanha.heroVideo,
        produtosDestaqueSlugs: selecionados,
        ativa,
      }),
    );
    if (ok) router.refresh();
  }

  return (
    <div className="flex flex-col gap-5">
      <StepCard
        step={1}
        title="Ligar ou desligar a vitrine"
        hint="Desligada, essa parte some da página inicial."
      >
        <Toggle
          label="Mostrar a vitrine de destaque na página inicial"
          checked={ativa}
          onChange={setAtiva}
        />
      </StepCard>

      <StepCard
        step={2}
        title="Título e frase da vitrine"
        hint="Aparecem na página inicial, logo acima das peças escolhidas."
      >
        <div className="flex flex-col gap-4">
          <TextInput
            label="Título da vitrine"
            hint="ex.: Summer Glow"
            value={nomeExibicao}
            onChange={(e) => setNomeExibicao(e.target.value)}
            placeholder="Ex.: Summer Glow"
          />
          <TextArea
            label="Frase que aparece embaixo do título"
            value={manifesto}
            onChange={(e) => setManifesto(e.target.value)}
            placeholder="Uma frase curta sobre essas peças."
          />
          <div className="rounded-xl bg-[var(--color-salmao-claro)]/70 px-4 py-3">
            <p className="text-sm font-medium text-[var(--color-taupe)]">
              No site vai sair assim:
            </p>
            <p className="mt-1 text-[15px] text-[var(--color-preto-warm)]">
              <strong>Em destaque agora · {nomeExibicao || "—"}</strong>
              <br />
              {manifesto || "—"}
            </p>
          </div>
        </div>
      </StepCard>

      <StepCard
        step={3}
        title="Escolher as peças"
        hint="Elas aparecem na página inicial, logo abaixo das categorias. O ideal é de 6 a 10 peças."
      >
        {/* Escolhidas primeiro, com foto e na ordem em que saem no site */}
        <div className="mb-5">
          <p className="mb-2 text-[15px] font-medium text-[var(--color-preto-warm)]">
            Escolhidas: {selecionados.length}
            {selecionados.length > 0 && " — nesta ordem no site"}
          </p>
          {selecionados.length === 0 ? (
            <p className="rounded-xl border border-dashed border-[var(--color-areia)] px-4 py-5 text-center text-[15px] text-[var(--color-taupe)]">
              Nenhuma peça escolhida ainda. Toque nas peças abaixo.
            </p>
          ) : (
            <ul className="flex flex-wrap gap-2">
              {selecionados.map((s, i) => {
                const p = porSlug.get(s);
                return (
                  <li key={s} className="relative">
                    <button
                      type="button"
                      onClick={() => toggle(s)}
                      title={`Tirar ${p?.nome ?? s} da vitrine`}
                      className="block h-24 w-20 overflow-hidden rounded-lg border border-[var(--color-dourado-claro)] bg-[var(--color-salmao-claro)]"
                    >
                      {p?.fotoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.fotoUrl}
                          alt={p.nome}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center px-1 text-center text-[11px] text-[var(--color-taupe)]">
                          {p?.nome ?? s}
                        </span>
                      )}
                    </button>
                    <span className="absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-preto-warm)] text-xs font-semibold text-[var(--color-salmao-claro)]">
                      {i + 1}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <TextInput
          label="Procurar peça pelo nome"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Ex.: colar coração"
        />

        <ul className="mt-3 grid max-h-[420px] grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-4 md:grid-cols-5">
          {filtrados.map((p) => {
            const checked = selecionados.includes(p.slug);
            return (
              <li key={p.slug}>
                <button
                  type="button"
                  onClick={() => toggle(p.slug)}
                  aria-pressed={checked}
                  className={`relative block w-full overflow-hidden rounded-lg border-2 transition ${
                    checked
                      ? "border-[var(--color-preto-warm)]"
                      : "border-transparent hover:border-[var(--color-areia)]"
                  }`}
                >
                  <div className="aspect-[4/5] bg-[var(--color-salmao-claro)]">
                    {p.fotoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.fotoUrl}
                        alt={p.nome}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center px-1 text-center text-[11px] text-[var(--color-taupe)]">
                        sem foto
                      </span>
                    )}
                  </div>
                  {checked && (
                    <span className="absolute right-1 top-1 rounded-full bg-[var(--color-preto-warm)] px-2 py-0.5 text-[11px] font-semibold text-[var(--color-salmao-claro)]">
                      ✓
                    </span>
                  )}
                  <span className="block px-1.5 py-1.5 text-left text-[13px] leading-snug text-[var(--color-preto-warm)]">
                    {p.nome}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        {filtrados.length === 0 && (
          <p className="mt-3 text-[15px] text-[var(--color-taupe)]">
            Não achei nenhuma peça com esse nome.
          </p>
        )}
      </StepCard>

      <Card>
        <p className="text-[15px] leading-snug text-[var(--color-taupe)]">
          Quer trocar a <strong>foto grande</strong> do começo do site? Isso fica
          em{" "}
          <a
            href="/admin/conteudo#foto-topo"
            className="font-medium text-[var(--color-preto-warm)] underline underline-offset-4"
          >
            Textos e fotos do site
          </a>
          .
        </p>
      </Card>

      <div
        className="sticky bottom-0 -mx-4 border-t border-[var(--color-areia)] bg-[var(--color-salmao-claro)]/95 px-4 py-3 backdrop-blur md:mx-0 md:rounded-2xl md:border md:px-5"
        style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
      >
        <SaveBar
          status={save.status}
          message={save.message}
          onSave={handleSave}
          saveLabel="Salvar"
        />
      </div>
    </div>
  );
}
