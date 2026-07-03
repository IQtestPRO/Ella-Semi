"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Card,
  TextInput,
  TextArea,
  Select,
  Toggle,
  Button,
  SaveBar,
  useSaveState,
  apiSend,
  Label,
} from "./ui";
import { MultiImageField } from "./ImageUploader";
import type { Product, Foto } from "../../../lib/schemas";

const CATEGORIAS = [
  { value: "brincos", label: "Brincos" },
  { value: "colares", label: "Colares" },
  { value: "pulseiras", label: "Pulseiras" },
  { value: "aneis", label: "Anéis" },
  { value: "conjuntos", label: "Conjuntos" },
  { value: "gargantilhas", label: "Chokers" },
  { value: "tornozeleiras", label: "Tornozeleiras" },
  { value: "piercings", label: "Piercings" },
  { value: "outros", label: "Outros" },
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
  { value: "pronta-entrega", label: "Pronta-entrega" },
  { value: "sob-encomenda", label: "Sob encomenda (pagamento antes)" },
];

function centsToReais(cents: number): string {
  return (cents / 100).toFixed(2).replace(".", ",");
}
function reaisToCents(s: string): number {
  const n = Number(s.replace(/\./g, "").replace(",", "."));
  return Number.isFinite(n) ? Math.round(n * 100) : 0;
}

type Props = {
  mode: "create" | "edit";
  product?: Product;
};

export function ProductEditor({ mode, product }: Props) {
  const router = useRouter();
  const save = useSaveState();
  const [deleting, setDeleting] = useState(false);

  const [nome, setNome] = useState(product?.nome ?? "");
  const [codigo, setCodigo] = useState(product?.codigo ?? "");
  const [categoria, setCategoria] = useState<string>(
    product?.categoria ?? "brincos",
  );
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
      precoCents: reaisToCents(precoReais),
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
    if (!nome.trim()) return "Dê um nome para a peça.";
    if (reaisToCents(precoReais) <= 0) return "Informe um preço válido.";
    if (promocao && reaisToCents(precoPromoReais) <= 0)
      return "Informe o preço promocional.";
    return null;
  }

  async function handleSave() {
    const err = validate();
    if (err) {
      save.run(async () => ({ ok: false, error: err }));
      return;
    }
    const payload = buildPayload();
    const ok = await save.run(async () => {
      if (mode === "create") {
        const r = await apiSend("POST", "/api/admin/products", payload);
        return r;
      }
      return apiSend("PUT", `/api/admin/products/${product!.slug}`, payload);
    });
    if (ok) {
      router.push("/admin/produtos");
      router.refresh();
    }
  }

  async function handleDelete() {
    if (!product) return;
    if (
      !window.confirm(
        `Excluir "${product.nome}"? Isso remove a peça do site. Não dá pra desfazer.`,
      )
    )
      return;
    setDeleting(true);
    const r = await apiSend(
      "DELETE",
      `/api/admin/products/${product.slug}`,
    );
    setDeleting(false);
    if (r.ok) {
      router.push("/admin/produtos");
      router.refresh();
    } else {
      window.alert(r.error ?? "Não foi possível excluir.");
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <Card title="Informações da peça">
        <div className="flex flex-col gap-4">
          <TextInput
            label="Nome da peça"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex.: Colar Veneziana Banho Ouro"
          />
          <TextInput
            label="Código (opcional)"
            hint="BR brinco · CO colar · CH choker · BRA bracelete · PL pulseira · CJ conjunto"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value.toUpperCase())}
            placeholder="Ex.: CO763"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Categoria"
              value={categoria}
              onChange={setCategoria}
              options={CATEGORIAS}
            />
            <Select
              label="Banho"
              value={banho}
              onChange={setBanho}
              options={BANHOS}
            />
            <Select
              label="Tipo"
              value={tipo}
              onChange={setTipo}
              options={TIPOS}
            />
            <Select
              label="Entrega"
              hint="sob encomenda pede pagamento antes"
              value={tipoFulfillment}
              onChange={setTipoFulfillment}
              options={FULFILLMENT}
            />
          </div>
          <TextArea
            label="Descrição"
            hint="aparece na página da peça e no Google"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Ex.: Colar veneziana fininho, banho de ouro 18k, 45cm. Do dia a dia ao jantar."
          />
        </div>
      </Card>

      <Card title="Preço">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <Label>Preço (R$)</Label>
            <div className="flex items-center gap-2">
              <span className="text-[var(--color-taupe)]">R$</span>
              <input
                inputMode="decimal"
                value={precoReais}
                onChange={(e) => setPrecoReais(e.target.value)}
                placeholder="69,90"
                className="w-full rounded-xl border border-[var(--color-areia)] bg-[var(--color-salmao-claro)]/40 px-4 py-3 outline-none focus:border-[var(--color-dourado-claro)] focus:ring-2 focus:ring-[var(--color-dourado-claro)]/40"
              />
            </div>
          </label>
          <div className="flex flex-col gap-3">
            <Toggle
              label="Em promoção"
              hint="peça em promoção não pode ser trocada"
              checked={promocao}
              onChange={setPromocao}
            />
            {promocao && (
              <label className="block">
                <Label>Preço promocional (R$)</Label>
                <div className="flex items-center gap-2">
                  <span className="text-[var(--color-taupe)]">R$</span>
                  <input
                    inputMode="decimal"
                    value={precoPromoReais}
                    onChange={(e) => setPrecoPromoReais(e.target.value)}
                    placeholder="49,90"
                    className="w-full rounded-xl border border-[var(--color-areia)] bg-[var(--color-salmao-claro)]/40 px-4 py-3 outline-none focus:border-[var(--color-dourado-claro)] focus:ring-2 focus:ring-[var(--color-dourado-claro)]/40"
                  />
                </div>
              </label>
            )}
          </div>
        </div>
      </Card>

      <Card
        title="Fotos da peça"
        description="A primeira foto é a capa. Você pode enviar várias e reordenar."
      >
        <MultiImageField
          label="Fotos"
          altBase={nome}
          photos={fotos}
          onChange={setFotos}
        />
        <div className="mt-4">
          <TextInput
            label="Vídeo da peça (opcional)"
            hint="cole a URL de um .mp4 — aparece no fim da galeria"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="/assets/generated/products/videos/CO763.mp4"
          />
        </div>
      </Card>

      <Card title="Destaques e visibilidade">
        <div className="flex flex-col gap-3">
          <Toggle
            label="À venda no site"
            hint="desligue para esconder a peça sem excluir"
            checked={ativo}
            onChange={setAtivo}
          />
          <Toggle
            label="Mais vendido"
            hint='aparece na seção "Mais vendidos" da home'
            checked={maisVendido}
            onChange={setMaisVendido}
          />
          <Toggle
            label="Favorita da Ella"
            hint="curadoria especial sua"
            checked={destaqueHome}
            onChange={setDestaqueHome}
          />
          <TextInput
            label="Etiquetas (opcional)"
            hint="separe por vírgula"
            value={tagsStr}
            onChange={(e) => setTagsStr(e.target.value)}
            placeholder="lancamento, best-seller"
          />
        </div>
      </Card>

      <div className="sticky bottom-0 -mx-4 border-t border-[var(--color-areia)] bg-[var(--color-salmao-claro)]/95 px-4 py-3 backdrop-blur md:mx-0 md:rounded-2xl md:border md:px-5">
        <SaveBar
          status={save.status}
          message={save.message}
          onSave={handleSave}
          saveLabel={mode === "create" ? "Criar peça" : "Salvar alterações"}
          extra={
            mode === "edit" ? (
              <Button variant="danger" onClick={handleDelete} disabled={deleting}>
                {deleting ? "Excluindo…" : "Excluir"}
              </Button>
            ) : undefined
          }
        />
      </div>
    </div>
  );
}
