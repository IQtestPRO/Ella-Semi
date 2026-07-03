"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  TextInput,
  TextArea,
  Toggle,
  Button,
  SaveBar,
  useSaveState,
  apiSend,
  Label,
} from "./ui";
import { SingleImageField } from "./ImageUploader";
import type {
  SettingValue,
} from "../../../lib/settings";

function useSettingSaver(key: string) {
  const router = useRouter();
  const save = useSaveState();
  async function persist(value: unknown) {
    const ok = await save.run(() =>
      apiSend("PUT", "/api/admin/settings", { key, value }),
    );
    if (ok) router.refresh();
  }
  return { save, persist };
}

// ── Hero ────────────────────────────────────────────────────────────────────

export function HeroEditor({ value }: { value: SettingValue<"hero"> }) {
  const { save, persist } = useSettingSaver("hero");
  const [subtitulo, setSubtitulo] = useState(value.subtitulo);
  const [fallbackUrl, setFallbackUrl] = useState(value.fallbackUrl);
  const [videoUrl, setVideoUrl] = useState(value.videoUrl);

  return (
    <Card
      title="Topo do site (Hero)"
      description="A primeira tela grande com o nome ELLA. Foto e textinho de baixo."
      footer={
        <SaveBar
          status={save.status}
          message={save.message}
          onSave={() => persist({ subtitulo, fallbackUrl, videoUrl })}
        />
      }
    >
      <div className="flex flex-col gap-4">
        <TextInput
          label="Frase de baixo"
          value={subtitulo}
          onChange={(e) => setSubtitulo(e.target.value)}
          placeholder="warm editorial soft glam · outono 2026"
        />
        <SingleImageField
          label="Foto do topo"
          hint="aparece atrás do nome ELLA"
          value={fallbackUrl}
          onChange={setFallbackUrl}
        />
        <TextInput
          label="Link do vídeo do topo (opcional)"
          hint="cole a URL de um .mp4 se tiver"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
        />
      </div>
    </Card>
  );
}

// ── Banner do meio ──────────────────────────────────────────────────────────

export function BannerEditor({
  value,
}: {
  value: SettingValue<"bannerMeio">;
}) {
  const { save, persist } = useSettingSaver("bannerMeio");
  const [texto, setTexto] = useState(value.texto);
  const [fallbackUrl, setFallbackUrl] = useState(value.fallbackUrl);
  const [videoUrl, setVideoUrl] = useState(value.videoUrl);

  return (
    <Card
      title="Banner do meio"
      description="A faixa com frase no meio da home."
      footer={
        <SaveBar
          status={save.status}
          message={save.message}
          onSave={() => persist({ texto, fallbackUrl, videoUrl })}
        />
      }
    >
      <div className="flex flex-col gap-4">
        <TextInput
          label="Frase"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Cada peça, uma história em ouro."
        />
        <SingleImageField
          label="Foto do banner"
          value={fallbackUrl}
          onChange={setFallbackUrl}
        />
        <TextInput
          label="Link do vídeo (opcional)"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
        />
      </div>
    </Card>
  );
}

// ── Sobre a ELLA ────────────────────────────────────────────────────────────

export function SobreEditor({ value }: { value: SettingValue<"sobre"> }) {
  const { save, persist } = useSettingSaver("sobre");
  const [titulo, setTitulo] = useState(value.titulo);
  const [subtitulo, setSubtitulo] = useState(value.subtitulo);
  const [paragrafos, setParagrafos] = useState<string[]>(value.paragrafos);
  const [ctaTexto, setCtaTexto] = useState(value.ctaTexto);
  const [ctaHref, setCtaHref] = useState(value.ctaHref);

  function setPar(i: number, v: string) {
    setParagrafos((cur) => cur.map((p, idx) => (idx === i ? v : p)));
  }

  return (
    <Card
      title="Sobre a ELLA"
      description="O texto que conta a história da marca."
      footer={
        <SaveBar
          status={save.status}
          message={save.message}
          onSave={() =>
            persist({
              titulo,
              subtitulo,
              paragrafos: paragrafos.map((p) => p.trim()).filter(Boolean),
              ctaTexto,
              ctaHref,
            })
          }
        />
      }
    >
      <div className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput
            label="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
          <TextInput
            label="Subtítulo"
            value={subtitulo}
            onChange={(e) => setSubtitulo(e.target.value)}
          />
        </div>
        <div>
          <Label>Parágrafos</Label>
          <div className="flex flex-col gap-3">
            {paragrafos.map((p, i) => (
              <div key={i} className="flex gap-2">
                <textarea
                  value={p}
                  onChange={(e) => setPar(i, e.target.value)}
                  className="min-h-[80px] w-full rounded-xl border border-[var(--color-areia)] bg-[var(--color-salmao-claro)]/40 px-4 py-3 leading-relaxed outline-none focus:border-[var(--color-dourado-claro)] focus:ring-2 focus:ring-[var(--color-dourado-claro)]/40"
                />
                <button
                  type="button"
                  onClick={() =>
                    setParagrafos((cur) => cur.filter((_, idx) => idx !== i))
                  }
                  className="self-start rounded-lg px-2 py-2 text-sm text-[#b3261e] hover:bg-[#b3261e]/10"
                  aria-label="Remover parágrafo"
                >
                  ✕
                </button>
              </div>
            ))}
            <Button
              variant="ghost"
              onClick={() => setParagrafos((cur) => [...cur, ""])}
            >
              + Adicionar parágrafo
            </Button>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput
            label="Texto do botão"
            value={ctaTexto}
            onChange={(e) => setCtaTexto(e.target.value)}
          />
          <TextInput
            label="Link do botão"
            value={ctaHref}
            onChange={(e) => setCtaHref(e.target.value)}
          />
        </div>
      </div>
    </Card>
  );
}

// ── FAQ ─────────────────────────────────────────────────────────────────────

export function FaqEditor({ value }: { value: SettingValue<"faq"> }) {
  const { save, persist } = useSettingSaver("faq");
  const [itens, setItens] = useState(value.itens);

  function set(i: number, field: "q" | "a", v: string) {
    setItens((cur) =>
      cur.map((it, idx) => (idx === i ? { ...it, [field]: v } : it)),
    );
  }

  return (
    <Card
      title="Perguntas frequentes (FAQ)"
      description="As perguntas e respostas que aparecem na seção Sobre."
      footer={
        <SaveBar
          status={save.status}
          message={save.message}
          onSave={() =>
            persist({
              itens: itens.filter((it) => it.q.trim() && it.a.trim()),
            })
          }
        />
      }
    >
      <div className="flex flex-col gap-4">
        {itens.map((it, i) => (
          <div
            key={i}
            className="rounded-xl border border-[var(--color-areia)] p-3"
          >
            <input
              value={it.q}
              onChange={(e) => set(i, "q", e.target.value)}
              placeholder="Pergunta"
              className="mb-2 w-full rounded-lg border border-[var(--color-areia)] bg-white px-3 py-2 font-medium outline-none focus:border-[var(--color-dourado-claro)]"
            />
            <textarea
              value={it.a}
              onChange={(e) => set(i, "a", e.target.value)}
              placeholder="Resposta"
              className="min-h-[70px] w-full rounded-lg border border-[var(--color-areia)] bg-[var(--color-salmao-claro)]/40 px-3 py-2 leading-relaxed outline-none focus:border-[var(--color-dourado-claro)]"
            />
            <button
              type="button"
              onClick={() => setItens((cur) => cur.filter((_, idx) => idx !== i))}
              className="mt-2 text-sm text-[#b3261e] hover:underline"
            >
              Remover pergunta
            </button>
          </div>
        ))}
        <Button
          variant="ghost"
          onClick={() => setItens((cur) => [...cur, { q: "", a: "" }])}
        >
          + Adicionar pergunta
        </Button>
      </div>
    </Card>
  );
}

// ── Contato / WhatsApp / redes (key: marca) ─────────────────────────────────

export function ContatoEditor({ value }: { value: SettingValue<"marca"> }) {
  const { save, persist } = useSettingSaver("marca");
  const [whatsappNumero, setWhatsappNumero] = useState(value.whatsappNumero);
  const [whatsappLinkGeral, setWhatsappLinkGeral] = useState(
    value.whatsappLinkGeral,
  );
  const [instagram, setInstagram] = useState(value.instagram);
  const [instagramHandle, setInstagramHandle] = useState(value.instagramHandle);
  const [email, setEmail] = useState(value.email);

  return (
    <Card
      title="Contato e redes"
      description="O número de WhatsApp aqui é o que recebe os pedidos do carrinho."
      footer={
        <SaveBar
          status={save.status}
          message={save.message}
          onSave={() =>
            persist({
              whatsappNumero: whatsappNumero.replace(/\D/g, ""),
              whatsappLinkGeral,
              instagram,
              instagramHandle,
              email,
            })
          }
        />
      }
    >
      <div className="flex flex-col gap-4">
        <TextInput
          label="WhatsApp (com DDD e país)"
          hint="só números, ex.: 5521999998888"
          value={whatsappNumero}
          onChange={(e) => setWhatsappNumero(e.target.value)}
          placeholder="5521999998888"
        />
        <TextInput
          label="Link curto do WhatsApp (atendimento geral)"
          value={whatsappLinkGeral}
          onChange={(e) => setWhatsappLinkGeral(e.target.value)}
          placeholder="https://wa.link/xxxxxx"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput
            label="Link do Instagram"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
          />
          <TextInput
            label="@ do Instagram"
            value={instagramHandle}
            onChange={(e) => setInstagramHandle(e.target.value)}
          />
        </div>
        <TextInput
          label="E-mail de contato"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
    </Card>
  );
}

// ── Rodapé ──────────────────────────────────────────────────────────────────

export function FooterEditor({ value }: { value: SettingValue<"footer"> }) {
  const { save, persist } = useSettingSaver("footer");
  const [wordmarkTagline, setWordmarkTagline] = useState(value.wordmarkTagline);
  const [microcopy, setMicrocopy] = useState(value.microcopy);
  const [colunas, setColunas] = useState(value.colunas);

  function setColHeading(ci: number, v: string) {
    setColunas((cur) =>
      cur.map((c, i) => (i === ci ? { ...c, heading: v } : c)),
    );
  }
  function setLink(
    ci: number,
    li: number,
    field: "label" | "href",
    v: string,
  ) {
    setColunas((cur) =>
      cur.map((c, i) =>
        i === ci
          ? {
              ...c,
              links: c.links.map((l, j) =>
                j === li ? { ...l, [field]: v } : l,
              ),
            }
          : c,
      ),
    );
  }
  function removeLink(ci: number, li: number) {
    setColunas((cur) =>
      cur.map((c, i) =>
        i === ci ? { ...c, links: c.links.filter((_, j) => j !== li) } : c,
      ),
    );
  }
  function addLink(ci: number) {
    setColunas((cur) =>
      cur.map((c, i) =>
        i === ci
          ? {
              ...c,
              links: [...c.links, { label: "", href: "/", external: false }],
            }
          : c,
      ),
    );
  }

  return (
    <Card
      title="Rodapé"
      description="As colunas de links e o textinho final do site."
      footer={
        <SaveBar
          status={save.status}
          message={save.message}
          onSave={() =>
            persist({
              wordmarkTagline,
              microcopy,
              colunas: colunas.map((c) => ({
                ...c,
                links: c.links.filter((l) => l.label.trim() && l.href.trim()),
              })),
            })
          }
        />
      }
    >
      <div className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput
            label="Frase sob o nome ELLA"
            value={wordmarkTagline}
            onChange={(e) => setWordmarkTagline(e.target.value)}
          />
          <TextInput
            label="Linha final"
            value={microcopy}
            onChange={(e) => setMicrocopy(e.target.value)}
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {colunas.map((c, ci) => (
            <div
              key={ci}
              className="rounded-xl border border-[var(--color-areia)] p-3"
            >
              <input
                value={c.heading}
                onChange={(e) => setColHeading(ci, e.target.value)}
                className="mb-2 w-full rounded-lg border border-[var(--color-areia)] bg-white px-3 py-2 font-semibold outline-none focus:border-[var(--color-dourado-claro)]"
                placeholder="Título da coluna"
              />
              <div className="flex flex-col gap-2">
                {c.links.map((l, li) => (
                  <div key={li} className="flex gap-2">
                    <input
                      value={l.label}
                      onChange={(e) => setLink(ci, li, "label", e.target.value)}
                      placeholder="Texto"
                      className="w-1/2 rounded-lg border border-[var(--color-areia)] bg-[var(--color-salmao-claro)]/40 px-2 py-1.5 text-base md:text-sm outline-none focus:border-[var(--color-dourado-claro)]"
                    />
                    <input
                      value={l.href}
                      onChange={(e) => setLink(ci, li, "href", e.target.value)}
                      placeholder="/link"
                      className="w-1/2 rounded-lg border border-[var(--color-areia)] bg-[var(--color-salmao-claro)]/40 px-2 py-1.5 text-base md:text-sm outline-none focus:border-[var(--color-dourado-claro)]"
                    />
                    <button
                      type="button"
                      onClick={() => removeLink(ci, li)}
                      className="px-1.5 text-[#b3261e]"
                      aria-label="Remover link"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addLink(ci)}
                  className="text-left text-xs text-[var(--color-preto-warm)] hover:underline"
                >
                  + link
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

// ── SEO ─────────────────────────────────────────────────────────────────────

export function SeoEditor({ value }: { value: SettingValue<"seo"> }) {
  const { save, persist } = useSettingSaver("seo");
  const [siteTitle, setSiteTitle] = useState(value.siteTitle);
  const [siteDescription, setSiteDescription] = useState(value.siteDescription);

  return (
    <Card
      title="Google e compartilhamento (SEO)"
      description="Título e descrição do site no Google e quando o link é colado no WhatsApp."
      footer={
        <SaveBar
          status={save.status}
          message={save.message}
          onSave={() => persist({ siteTitle, siteDescription })}
        />
      }
    >
      <div className="flex flex-col gap-4">
        <TextInput
          label="Título do site"
          value={siteTitle}
          onChange={(e) => setSiteTitle(e.target.value)}
        />
        <TextArea
          label="Descrição do site"
          value={siteDescription}
          onChange={(e) => setSiteDescription(e.target.value)}
        />
      </div>
    </Card>
  );
}
