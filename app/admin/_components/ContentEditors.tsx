"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Advanced,
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
import {
  formatarWhatsAppVisivel,
  normalizarWhatsAppBR,
} from "../../../lib/format/whatsapp";
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
      title="A foto grande que abre o site"
      description="É a primeira coisa que a cliente vê, com o nome ELLA por cima."
      footer={
        <SaveBar
          status={save.status}
          message={save.message}
          onSave={() => persist({ subtitulo, fallbackUrl, videoUrl })}
        />
      }
    >
      <div className="flex flex-col gap-4">
        <SingleImageField
          label="Foto do começo do site"
          hint="fica atrás do nome ELLA"
          value={fallbackUrl}
          onChange={setFallbackUrl}
        />
        <TextInput
          label="Frase pequena embaixo do nome ELLA"
          value={subtitulo}
          onChange={(e) => setSubtitulo(e.target.value)}
          placeholder="warm editorial soft glam"
        />
        <Advanced label="Opções avançadas (mexer só com ajuda)">
          <TextInput
            label="Endereço do vídeo do começo do site"
            hint="deixe vazio para mostrar só a foto"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="/hero/hero-loop.mp4"
          />
        </Advanced>
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
      title="A foto com frase no meio do site"
      description="A faixa larga que aparece no meio da página inicial."
      footer={
        <SaveBar
          status={save.status}
          message={save.message}
          onSave={() => persist({ texto, fallbackUrl, videoUrl })}
        />
      }
    >
      <div className="flex flex-col gap-4">
        <SingleImageField
          label="Foto dessa faixa"
          value={fallbackUrl}
          onChange={setFallbackUrl}
        />
        <TextInput
          label="Frase que aparece por cima da foto"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Cada peça, uma história em ouro."
        />
        <Advanced label="Opções avançadas (mexer só com ajuda)">
          <TextInput
            label="Endereço do vídeo dessa faixa"
            hint="deixe vazio para mostrar só a foto"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="/banners/banner-meio.mp4"
          />
        </Advanced>
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
      title="Minha história"
      description='O texto "Sobre a ELLA" que aparece perto do fim da página inicial.'
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
          <Label hint="cada trecho vira um parágrafo no site">
            O texto da sua história
          </Label>
          <div className="flex flex-col gap-4">
            {paragrafos.map((p, i) => (
              <div key={i}>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-[var(--color-preto-warm)]">
                    {i + 1}º trecho
                  </span>
                  <textarea
                    value={p}
                    onChange={(e) => setPar(i, e.target.value)}
                    className="min-h-[96px] w-full rounded-xl border border-[var(--color-areia)] bg-[var(--color-salmao-claro)]/40 px-4 py-3 text-base leading-relaxed outline-none focus:border-[var(--color-dourado-claro)] focus:ring-2 focus:ring-[var(--color-dourado-claro)]/40"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const trecho = p.trim().slice(0, 60);
                    if (
                      window.confirm(
                        `Apagar o ${i + 1}º trecho?\n\n"${trecho}${p.length > 60 ? "…" : ""}"\n\nEle some do site.`,
                      )
                    ) {
                      setParagrafos((cur) => cur.filter((_, idx) => idx !== i));
                    }
                  }}
                  className="mt-1.5 inline-flex min-h-[44px] items-center rounded-lg px-3 text-[15px] font-medium text-[#b3261e] transition hover:bg-[#b3261e]/10"
                >
                  Apagar este trecho
                </button>
              </div>
            ))}
            <Button
              variant="ghost"
              onClick={() => setParagrafos((cur) => [...cur, ""])}
            >
              + Adicionar mais um trecho
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
      title="Perguntas e respostas para as clientes"
      description="Aparecem no fim da página inicial, do lado da sua história."
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
            <label className="mb-2 block">
              <Label>Pergunta {i + 1} — o que a cliente quer saber</Label>
              <input
                value={it.q}
                onChange={(e) => set(i, "q", e.target.value)}
                placeholder="Ex.: Vocês entregam para todo o Brasil?"
                className="w-full rounded-lg border border-[var(--color-areia)] bg-white px-3 py-2.5 text-base font-medium outline-none focus:border-[var(--color-dourado-claro)]"
              />
            </label>
            <label className="block">
              <Label>Sua resposta</Label>
              <textarea
                value={it.a}
                onChange={(e) => set(i, "a", e.target.value)}
                placeholder="Ex.: Sim! O frete a gente combina pelo WhatsApp."
                className="min-h-[80px] w-full rounded-lg border border-[var(--color-areia)] bg-[var(--color-salmao-claro)]/40 px-3 py-2.5 text-base leading-relaxed outline-none focus:border-[var(--color-dourado-claro)]"
              />
            </label>
            <button
              type="button"
              onClick={() => {
                if (
                  window.confirm(
                    `Apagar a pergunta "${it.q || "(sem texto)"}"?\n\nEla some do site.`,
                  )
                ) {
                  setItens((cur) => cur.filter((_, idx) => idx !== i));
                }
              }}
              className="mt-2 inline-flex min-h-[44px] items-center rounded-lg px-3 text-[15px] font-medium text-[#b3261e] transition hover:bg-[#b3261e]/10"
            >
              Apagar esta pergunta
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
  const [instagramHandle, setInstagramHandle] = useState(value.instagramHandle);
  const [email, setEmail] = useState(value.email);

  // Consertamos o número na hora: quem digita "(21) 99624-9802" salvava sem o
  // 55 e todo pedido do carrinho parava de chegar, sem erro nenhum na tela.
  const numeroOk = normalizarWhatsAppBR(whatsappNumero);
  const arroba = instagramHandle.replace(/^@+/, "").trim();

  return (
    <Card
      title="WhatsApp e redes"
      description="É para este WhatsApp que chegam os pedidos do carrinho do site."
      footer={
        <SaveBar
          status={save.status}
          message={save.message}
          onSave={() =>
            persist({
              whatsappNumero: numeroOk ?? whatsappNumero,
              whatsappLinkGeral,
              instagram: `https://www.instagram.com/${arroba}/`,
              instagramHandle: `@${arroba}`,
              email,
            })
          }
        />
      }
    >
      <div className="flex flex-col gap-4">
        <div>
          <TextInput
            label="Seu número de WhatsApp"
            hint="com o DDD, do jeito que você fala"
            value={whatsappNumero}
            onChange={(e) => setWhatsappNumero(e.target.value)}
            placeholder="(21) 99624-9802"
          />
          {numeroOk ? (
            <div className="mt-2 rounded-xl bg-[#e8f2e5] px-4 py-3">
              <p className="text-[15px] text-[#2f5127]">
                Os pedidos vão chegar em{" "}
                <strong>{formatarWhatsAppVisivel(numeroOk)}</strong>
              </p>
              <a
                href={`https://wa.me/${numeroOk}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex min-h-[44px] items-center text-[15px] font-medium text-[#2f5127] underline underline-offset-4"
              >
                Testar: abrir esta conversa no WhatsApp ↗
              </a>
            </div>
          ) : (
            <p className="mt-2 rounded-xl bg-[#fdecea] px-4 py-3 text-[15px] text-[#8c1d18]">
              Falta alguma coisa nesse número. Escreva com o DDD, assim:{" "}
              <strong>(21) 99624-9802</strong>
            </p>
          )}
        </div>

        <TextInput
          label="Seu @ do Instagram"
          hint="só o nome, sem o resto do endereço"
          value={instagramHandle}
          onChange={(e) => setInstagramHandle(e.target.value)}
          placeholder="@ella_usasemijoias"
        />
        <TextInput
          label="Seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ellasemijoiasebijuterias@gmail.com"
        />

        <Advanced label="Opções avançadas (mexer só com ajuda)">
          <TextInput
            label="Link curto do WhatsApp"
            hint="aquele wa.link que você criou — deixe como está se não souber"
            value={whatsappLinkGeral}
            onChange={(e) => setWhatsappLinkGeral(e.target.value)}
            placeholder="https://wa.link/xxxxxx"
          />
        </Advanced>
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
      title="O finalzinho do site"
      description="As duas frases e os menus que ficam lá embaixo, no fim da página."
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
            label="Frase logo abaixo do nome ELLA"
            value={wordmarkTagline}
            onChange={(e) => setWordmarkTagline(e.target.value)}
          />
          <TextInput
            label="Última linha do site"
            hint="onde fica a cidade, por exemplo"
            value={microcopy}
            onChange={(e) => setMicrocopy(e.target.value)}
          />
        </div>
        <Advanced label="Os menus do finalzinho (mexer só com ajuda)">
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
                      onClick={() => {
                        if (
                          window.confirm(
                            `Apagar o link "${l.label || "(sem texto)"}" do finalzinho do site?`,
                          )
                        )
                          removeLink(ci, li);
                      }}
                      className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-[#b3261e] transition hover:bg-[#b3261e]/10"
                      aria-label={`Apagar o link ${l.label || "sem texto"}`}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addLink(ci)}
                  className="inline-flex min-h-[44px] items-center rounded-lg px-2 text-left text-[15px] font-medium text-[var(--color-preto-warm)] transition hover:bg-[var(--color-salmao-claro)]"
                >
                  + Adicionar link
                </button>
              </div>
            </div>
          ))}
        </div>
        </Advanced>
      </div>
    </Card>
  );
}

// ── Fotos das categorias (ADR-0030) ─────────────────────────────────────────

/**
 * Cada quadradinho da seção "Explore por Categoria" da página inicial. A Ellen
 * manda foto de qualquer formato (celular, print, quadrada do Instagram) e o
 * site recorta sozinho no formato do card — ela não precisa saber o que é 4:5.
 */
const CATEGORIAS_CARD = [
  { chave: "colares" as const, titulo: "Colares" },
  { chave: "brincos" as const, titulo: "Brincos" },
  { chave: "pulseiras" as const, titulo: "Pulseiras" },
  { chave: "conjuntos" as const, titulo: "Conjuntos" },
  { chave: "mixes" as const, titulo: "Mixes" },
];

/** Foto que o site usa enquanto a Ellen não enviar a dela. */
const FOTO_ORIGINAL: Record<string, string> = {
  colares: "/assets/generated/categorias/colares.webp",
  brincos: "/assets/generated/categorias/brincos.webp",
  pulseiras: "/assets/generated/categorias/pulseiras.webp",
  conjuntos: "/assets/generated/categorias/conjuntos.webp",
  mixes: "/assets/generated/categorias/mixes.webp",
};

/** 4:5 — o mesmo formato em pé usado no card da página inicial. */
const PROPORCAO_CARD = 4 / 5;

export function CategoriasFotosEditor({
  value,
}: {
  value: SettingValue<"categoriasFotos">;
}) {
  const { save, persist } = useSettingSaver("categoriasFotos");
  const [fotos, setFotos] = useState(value);

  function setFoto(chave: keyof typeof value, url: string) {
    setFotos((cur) => ({ ...cur, [chave]: url }));
  }

  return (
    <Card
      title="Fotos dos quadradinhos de categoria"
      description="São os quadros da página inicial: Colares, Brincos, Pulseiras, Conjuntos e Mixes. Envie a foto que quiser — o site corta sozinho no tamanho certo."
      footer={
        <SaveBar
          status={save.status}
          message={save.message}
          onSave={() => persist(fotos)}
        />
      }
    >
      <div className="grid gap-6 sm:grid-cols-2">
        {CATEGORIAS_CARD.map((c) => (
          <div key={c.chave}>
            <SingleImageField
              label={c.titulo}
              hint={
                fotos[c.chave]
                  ? "sua foto"
                  : "esta é a foto que está no site agora"
              }
              value={fotos[c.chave]}
              onChange={(url) => setFoto(c.chave, url)}
              proporcao={PROPORCAO_CARD}
              previewClassName="h-32 w-[102px]"
              fotoAtual={FOTO_ORIGINAL[c.chave]}
            />
          </div>
        ))}
      </div>
      <p className="mt-5 rounded-xl bg-[var(--color-salmao-claro)]/70 px-4 py-3 text-[15px] leading-snug text-[var(--color-preto-warm)]">
        Pode mandar foto do celular, print ou foto quadrada do Instagram: o site
        deixa todas no mesmo formato em pé, sem esticar a joia. Se quiser voltar
        a foto original de alguma, toque em <strong>Remover foto</strong>.
      </p>
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
      title="Como o site aparece no Google"
      description="Não muda a aparência do site — é o textinho que sai na busca do Google e quando alguém manda o site no WhatsApp."
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
