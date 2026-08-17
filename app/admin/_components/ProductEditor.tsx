"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Advanced,
  Button,
  Label,
  PriceInput,
  SaveBar,
  Select,
  StepCard,
  TextArea,
  TextInput,
  Toggle,
  apiSend,
  useSaveState,
} from "./ui";
import { MultiImageField } from "./ImageUploader";
import { formatBRL } from "../../../lib/format/currency";
import { centsParaCampo, parsePrecoParaCents } from "../../../lib/format/preco";
import type { Product, Foto } from "../../../lib/schemas";

/**
 * Editor de peça pensado para quem nunca mexeu num site (ADR-0024).
 *
 * Regras que este arquivo obedece:
 * 1. A FOTO da peça fica sempre visível ao lado do nome — a pessoa vê o que
 *    está editando, nunca edita "no escuro".
 * 2. O caminho principal tem 4 passos numerados: nome, preço, fotos, onde
 *    aparece. Nada além disso.
 * 3. Jargão (código interno, banho, tipo, entrega, link de vídeo) mora atrás
 *    de "Opções avançadas", fechado por padrão.
 * 4. Excluir fica longe do Salvar, em bloco próprio.
 */

const CATEGORIAS = [
  { value: "brincos", label: "Brinco" },
  { value: "colares", label: "Colar" },
  { value: "pulseiras", label: "Pulseira" },
  { value: "aneis", label: "Anel" },
  { value: "conjuntos", label: "Conjunto" },
  { value: "gargantilhas", label: "Choker (gargantilha)" },
  { value: "tornozeleiras", label: "Tornozeleira" },
  { value: "piercings", label: "Piercing" },
  { value: "outros", label: "Outro" },
];
const BANHOS = [
  { value: "ouro", label: "Ouro" },
  { value: "prata", label: "Prata" },
  { value: "rodio", label: "Ródio" },
  { value: "ouro-rose", label: "Ouro rosé" },
  { value: "a-confirmar", label: "A confirmar" },
];
const TIPOS = [
  { value: "semijoia", label: "Semijoia" },
  { value: "bijuteria", label: "Bijuteria" },
];
const FULFILLMENT = [
  { value: "pronta-entrega", label: "Tenho pronta para entregar" },
  { value: "sob-encomenda", label: "Faço sob encomenda (cliente paga antes)" },
];

// Leitura de preço tolerante a ponto/vírgula vive em lib/format/preco.ts
// (coberta por teste — digitar "89.90" já publicou R$ 8.990,00 uma vez).
const centsToReais = centsParaCampo;
const reaisToCents = parsePrecoParaCents;

type Props = {
  mode: "create" | "edit";
  product?: Product;
};

export function ProductEditor({ mode, product }: Props) {
  const router = useRouter();
  const save = useSaveState();
  const [deleting, setDeleting] = useState(false);
  const [salvou, setSalvou] = useState(false);

  const [nome, setNome] = useState(product?.nome ?? "");
  const [codigo, setCodigo] = useState(product?.codigo ?? "");
  // Peça nova NÃO nasce com tipo chutado: antes o padrão era "brincos", então
  // um colar cadastrado sem tocar no campo ia parar na página de Brincos.
  const [categoria, setCategoria] = useState<string>(product?.categoria ?? "");
  const [banho, setBanho] = useState<string>(product?.banho ?? "ouro");
  const [tipo, setTipo] = useState<string>(product?.tipo ?? "semijoia");
  const [precoReais, setPrecoReais] = useState(
    product ? centsToReais(product.precoCents) : "",
  );
  const [promocao, setPromocao] = useState(product?.promocao ?? false);
  const [precoPromoReais, setPrecoPromoReais] = useState(
    product?.precoPromocionalCents
      ? centsToReais(product.precoPromocionalCents)
      : "",
  );
  const [descricao, setDescricao] = useState(product?.descricao ?? "");
  const [fotos, setFotos] = useState<Foto[]>(product?.fotos ?? []);
  const [videoUrl, setVideoUrl] = useState(product?.videoUrl ?? "");
  const [tipoFulfillment, setTipoFulfillment] = useState<string>(
    product?.tipoFulfillment ?? "pronta-entrega",
  );
  const [ativo, setAtivo] = useState(product?.ativo ?? true);
  const [maisVendido, setMaisVendido] = useState(product?.maisVendido ?? false);
  const [destaqueHome, setDestaqueHome] = useState(
    product?.destaqueHome ?? false,
  );
  const [tagsStr, setTagsStr] = useState((product?.tags ?? []).join(", "));

  // Capa = primeira foto. Acompanha a edição ao vivo (trocou a ordem, o
  // cabeçalho troca junto), então a pessoa sempre vê a peça que está mexendo.
  const capa = fotos[0];
  const precoCents = reaisToCents(precoReais);

  // Mexeu em qualquer coisa depois de salvar? A faixa "já está no site" some —
  // senão ela passa a mentir sobre o que está publicado.
  useEffect(() => {
    setSalvou(false);
  }, [
    nome,
    precoReais,
    precoPromoReais,
    promocao,
    fotos,
    categoria,
    ativo,
    maisVendido,
    destaqueHome,
    descricao,
    codigo,
    banho,
    tipo,
    tipoFulfillment,
    videoUrl,
    tagsStr,
  ]);

  function buildPayload() {
    const tags = tagsStr
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    return {
      nome: nome.trim(),
      codigo: codigo.trim() || undefined,
      categoria,
      banho,
      tipo,
      precoCents,
      precoPromocionalCents:
        promocao && precoPromoReais ? reaisToCents(precoPromoReais) : undefined,
      descricao: descricao.trim() || nome.trim(),
      fotos,
      videoUrl: videoUrl.trim() || undefined,
      tags: tags.length ? tags : undefined,
      promocao,
      tipoFulfillment,
      destaqueHome,
      maisVendido,
      ativo,
      // preserva campos não-editáveis na UI (sem perda de dados):
      variantes: product?.variantes,
      origem: product?.origem,
      fonteFotoFraca: product?.fonteFotoFraca,
    };
  }

  function validate(): string | null {
    if (!nome.trim()) return "Escreva o nome da peça no passo 1.";
    if (precoCents <= 0) return "Escreva o preço da peça no passo 2.";
    if (promocao && reaisToCents(precoPromoReais) <= 0)
      return "Escreva o preço com desconto.";
    if (!categoria)
      return "No passo 4, diga o que é esta peça: colar, brinco, anel…";
    return null;
  }

  async function handleSave() {
    const err = validate();
    if (err) {
      save.run(async () => ({ ok: false, error: err }));
      return;
    }
    const payload = buildPayload();
    let slugCriado: string | undefined;
    const ok = await save.run(async () => {
      if (mode === "create") {
        const r = await apiSend("POST", "/api/admin/products", payload);
        slugCriado = (r.data as { product?: { slug?: string } } | undefined)
          ?.product?.slug;
        return r;
      }
      return apiSend("PUT", `/api/admin/products/${product!.slug}`, payload);
    });
    if (!ok) return;

    if (mode === "create") {
      // Peça nova: abre a peça criada (ela vê a joia cadastrada, não uma lista).
      router.push(
        slugCriado ? `/admin/produtos/${slugCriado}` : "/admin/produtos",
      );
      router.refresh();
      return;
    }
    // Editando: NÃO joga a pessoa para outra tela — a mensagem de "salvo" mal
    // piscava e dava a sensação de que nada tinha sido gravado.
    setSalvou(true);
    router.refresh();
  }

  async function handleDelete() {
    if (!product) return;
    if (
      !window.confirm(
        `Apagar "${product.nome}" para sempre?\n\nA peça some do site e não dá para trazer de volta.\n\nSe você só quer escondê-la, cancele e desligue "Aparecer no site" no passo 4.`,
      )
    )
      return;
    setDeleting(true);
    const r = await apiSend("DELETE", `/api/admin/products/${product.slug}`);
    setDeleting(false);
    if (r.ok) {
      router.push("/admin/produtos");
      router.refresh();
    } else {
      window.alert(r.error ?? "Não foi possível apagar.");
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Prova de que salvou — fica na tela até ela sair, com o caminho pronto
          para conferir no site. Antes, a tela trocava e parecia que não salvou. */}
      {salvou && mode === "edit" && product && (
        <div
          role="status"
          className="rounded-2xl border border-[#8fb083] bg-[#e8f2e5] px-4 py-4 md:px-6"
        >
          <p className="text-lg font-semibold text-[#2f5127]">
            Pronto! Já está no site. ✓
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href={`/${categoria || product.categoria}/${product.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[48px] items-center rounded-xl bg-[var(--color-preto-warm)] px-4 text-[15px] font-semibold text-[var(--color-salmao-claro)]"
            >
              Ver esta peça no site ↗
            </a>
            <button
              type="button"
              onClick={() => router.push("/admin/produtos")}
              className="inline-flex min-h-[48px] items-center rounded-xl border border-[#8fb083] bg-white px-4 text-[15px] font-medium text-[#2f5127]"
            >
              Voltar para minhas peças
            </button>
          </div>
        </div>
      )}

      {/* ── Passo 1: nome, COM a foto da peça do lado ───────────────────── */}
      <StepCard
        step={1}
        title="Nome da peça"
        hint="É o nome que a cliente lê no site."
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          {/* Foto da peça — o pedido central: ver o que se está editando */}
          <figure className="flex-shrink-0">
            <div className="h-40 w-32 overflow-hidden rounded-xl border border-[var(--color-areia)] bg-[var(--color-salmao-claro)] sm:h-44 sm:w-36">
              {capa ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={capa.url}
                  alt={capa.alt || nome}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center px-2 text-center text-sm text-[var(--color-taupe)]">
                  Sem foto ainda
                </span>
              )}
            </div>
            <figcaption className="mt-1.5 text-center text-xs text-[var(--color-taupe)]">
              {capa ? "Foto desta peça" : "Adicione no passo 3"}
            </figcaption>
          </figure>

          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <label className="block">
              <Label>Escreva o nome aqui</Label>
              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex.: Colar coração madrepérola"
                className="w-full rounded-xl border border-[var(--color-areia)] bg-[var(--color-salmao-claro)]/40 px-4 py-3.5 text-lg text-[var(--color-preto-warm)] outline-none transition focus:border-[var(--color-dourado-claro)] focus:bg-white focus:ring-2 focus:ring-[var(--color-dourado-claro)]/40"
              />
            </label>
            <p className="rounded-xl bg-[var(--color-salmao-claro)]/70 px-4 py-3 text-[15px] leading-snug text-[var(--color-preto-warm)]">
              No site vai aparecer assim:
              <br />
              <strong className="text-lg">{nome.trim() || "—"}</strong>
              {precoCents > 0 && (
                <>
                  {" "}
                  <span className="text-[var(--color-taupe)]">
                    · {formatBRL(precoCents)}
                  </span>
                </>
              )}
            </p>
            {mode === "edit" && product && (
              <a
                href={`/${product.categoria}/${product.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-fit items-center gap-1.5 text-[15px] font-medium text-[var(--color-preto-warm)] underline underline-offset-4"
              >
                Ver esta peça no site ↗
              </a>
            )}
          </div>
        </div>
      </StepCard>

      {/* ── Passo 2: preço ──────────────────────────────────────────────── */}
      <StepCard step={2} title="Preço" hint="Quanto a cliente paga.">
        <div className="flex flex-col gap-4">
          <div className="max-w-xs">
            <PriceInput
              label="Preço da peça"
              value={precoReais}
              onChange={setPrecoReais}
            />
          </div>
          <Toggle
            label="Esta peça está com desconto"
            hint="Ligue só se quiser mostrar um preço mais barato."
            checked={promocao}
            onChange={setPromocao}
          />
          {promocao && (
            <div className="max-w-xs">
              <PriceInput
                label="Preço com desconto"
                hint="precisa ser menor que o de cima"
                value={precoPromoReais}
                onChange={setPrecoPromoReais}
                placeholder="49,90"
              />
            </div>
          )}
        </div>
      </StepCard>

      {/* ── Passo 3: fotos ──────────────────────────────────────────────── */}
      <StepCard
        step={3}
        title="Fotos da peça"
        hint="A primeira foto é a que aparece na vitrine. Pode enviar do celular."
      >
        <MultiImageField label="" altBase={nome} photos={fotos} onChange={setFotos} />
      </StepCard>

      {/* ── Passo 4: onde aparece ───────────────────────────────────────── */}
      <StepCard
        step={4}
        title="Onde esta peça aparece"
        hint="Escolha o tipo e se ela fica visível para as clientes."
      >
        <div className="flex flex-col gap-4">
          <div className="max-w-xs">
            <Select
              label="O que é esta peça?"
              hint="decide em qual parte do site ela aparece"
              value={categoria}
              onChange={setCategoria}
              options={
                categoria
                  ? CATEGORIAS
                  : [{ value: "", label: "— Escolha —" }, ...CATEGORIAS]
              }
            />
            {!categoria && (
              <p className="mt-1.5 text-[15px] text-[#8c1d18]">
                Escolha aqui, senão a peça não sabe onde aparecer.
              </p>
            )}
          </div>
          <Toggle
            label="Aparecer no site"
            hint="Desligue para esconder a peça sem apagar (ex.: acabou o estoque)."
            checked={ativo}
            onChange={setAtivo}
          />
          <Toggle
            label='Mostrar na vitrine "Mais vendidos" da página inicial'
            hint="Use nas peças que mais saem."
            checked={maisVendido}
            onChange={setMaisVendido}
          />
          <Toggle
            label="Marcar como favorita da Ellen"
            hint="Coloca um selinho de escolha da casa."
            checked={destaqueHome}
            onChange={setDestaqueHome}
          />
        </div>
      </StepCard>

      {/* ── Avançado: tudo que leiga nenhuma precisa tocar ──────────────── */}
      <Advanced>
        <div className="flex flex-col gap-4">
          <TextArea
            label="Texto que descreve a peça"
            hint="se deixar vazio, usamos o nome"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Ex.: Colar veneziana fininho, banho de ouro 18k, 45cm."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextInput
              label="Código do catálogo"
              hint="o número da peça na sua lista"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.toUpperCase())}
              placeholder="Ex.: CO763"
            />
            <Select
              label="Banho"
              value={banho}
              onChange={setBanho}
              options={BANHOS}
            />
            <Select
              label="Semijoia ou bijuteria"
              value={tipo}
              onChange={setTipo}
              options={TIPOS}
            />
            <Select
              label="Como você entrega"
              value={tipoFulfillment}
              onChange={setTipoFulfillment}
              options={FULFILLMENT}
            />
          </div>
          <TextInput
            label="Endereço de um vídeo da peça"
            hint="deixe vazio se não tiver"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="/assets/generated/products/videos/CO763.mp4"
          />
          <TextInput
            label="Etiquetas internas"
            hint="separe por vírgula — não aparecem para a cliente"
            value={tagsStr}
            onChange={(e) => setTagsStr(e.target.value)}
            placeholder="lancamento, best-seller"
          />
        </div>
      </Advanced>

      {/* ── Salvar (grudado embaixo) ────────────────────────────────────── */}
      <div
        className="sticky bottom-0 -mx-4 border-t border-[var(--color-areia)] bg-[var(--color-salmao-claro)]/95 px-4 py-3 backdrop-blur md:mx-0 md:rounded-2xl md:border md:px-5"
        style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
      >
        <SaveBar
          status={save.status}
          message={save.message}
          onSave={handleSave}
          saveLabel={mode === "create" ? "Criar peça" : "Salvar"}
        />
      </div>

      {/* ── Apagar: longe do Salvar, de propósito ───────────────────────── */}
      {mode === "edit" && (
        <div className="rounded-2xl border border-[#b3261e]/25 bg-[#b3261e]/[0.04] px-4 py-4 md:px-6">
          <h3 className="text-[15px] font-semibold text-[var(--color-preto-warm)]">
            Apagar esta peça
          </h3>
          <p className="mt-1 max-w-xl text-sm leading-snug text-[var(--color-taupe)]">
            Some do site para sempre e não dá para desfazer. Para tirar do site
            só por um tempo, desligue <strong>&ldquo;Aparecer no site&rdquo;</strong>{" "}
            no passo 4.
          </p>
          <Button
            variant="danger"
            onClick={handleDelete}
            disabled={deleting}
            className="mt-3"
          >
            {deleting ? "Apagando…" : "Apagar para sempre"}
          </Button>
        </div>
      )}
    </div>
  );
}
