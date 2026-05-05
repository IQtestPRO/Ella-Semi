# ADR-0007 — Analytics, Privacidade e Meta Pixel Opcional via Env Var

- **Status**: aceito
- **Data**: 2026-05-05
- **Decisor**: Pak (com Claude)

## Contexto

Site-catálogo da ELLA tem fonte de tráfego única (Instagram bio link), funil curto que termina no WhatsApp (conversão fora do site), e exigências de privacidade compatíveis com LGPD e com a estética premium da marca (cookie banner gritando destrói UX da home). Precisamos:

1. Rastrear comportamento on-site (pageviews, eventos de funil, clique em "Finalizar pelo WhatsApp" como evento-conversão).
2. Captar dados de marketing para retargeting/Custom Audience futuro (Meta Pixel) — Ellen ainda não confirmou se já tem ID de Pixel ou não.
3. Eventualmente expandir para TikTok como canal — ainda não é momento.
4. Comunicar privacidade ao usuário sem comprometer estética.

A solução não pode bloquear deploy enquanto Ellen não confirma se tem Pixel ID; também não pode forçar cookie banner em quem só usa Plausible (cookie-less); também precisa permitir o usuário recusar cookies de marketing sem quebrar o site.

## Decisão

### 1. Stack final de analytics + marketing

- **Plausible cloud** ($9/mês, 10k pageviews) — privacy-first, cookie-less, eventos custom para o funil interno.
- **Meta Pixel** — implementação **opcional via env var** (ver ponto 2 abaixo). Cookies disparados só após opt-in via banner.
- **TikTok Pixel** — **não implementado agora**. Quando virar canal real (Ellen postar/anunciar), abre-se feature nova replicando o padrão deste ADR (env var opcional + opt-in).
- **Google Analytics** — **descartado** (cookie banner obrigatório degrada UX, integração caótica, privacy questionável).

### 2. Padrão "Pixel opcional via env var" — `NEXT_PUBLIC_META_PIXEL_ID`

Princípio: **um Pixel sem ID é um no-op completo**. Sem script carregado, sem evento disparado, sem custo de performance, sem warnings, sem deploy de código quando o ID chegar.

Implementação:

```ts
// lib/analytics/meta-pixel.ts
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export function MetaPixelScript() {
  if (!PIXEL_ID) return null;          // sem ID → componente não renderiza nada
  return <Script /* ... */ />;
}

export function trackMetaEvent(event: MetaEvent, payload?: Record<string, unknown>) {
  if (!PIXEL_ID) return;               // sem ID → noop
  if (!hasMarketingConsent()) return;  // sem consentimento → noop
  if (typeof window === "undefined") return;
  window.fbq?.("track", event, payload);
}
```

Quando Ellen entregar o Pixel ID:
1. Adicionar no `.env.production` (Vercel: Project Settings → Environment Variables → Production).
2. Re-deploy automático via Vercel (commit no main não-relacionado ou trigger manual).
3. Pixel passa a disparar para usuários que aceitaram cookies de marketing.

Sem deploy de código, sem PR, sem mudança de schema.

### 3. Banner de cookies + rota `/privacidade`

- **Banner**: simples, no rodapé inferior em primeira visita. Texto curto:
  > "Usamos cookies para melhorar sua experiência. Aceita cookies de marketing? Detalhes em [Privacidade](/privacidade)."
  > [Aceitar] [Recusar]
- **Comportamento**:
  - Default (sem decisão): apenas Plausible roda (cookie-less, LGPD-compatível por desenho). Meta Pixel **não dispara**.
  - "Aceitar": grava `ella-consent: marketing` em `localStorage` + cookie de 12 meses. Meta Pixel passa a disparar.
  - "Recusar": grava `ella-consent: essential-only` em `localStorage`. Meta Pixel **continua não disparando**. Plausible inalterado.
  - Banner some após decisão. Hyperlink "[Cookies](/privacidade)" no footer permite revogar.
- **Rota `/privacidade`**: rota fixa, conteúdo em **MDX** (ou JSON se preferir markdown puro) em `content/privacidade.mdx`. Texto base escrito por Claude com placeholders LGPD; Ellen revisa e edita sem deploy de código (basta editar o MDX e abrir PR — ou ela pode pedir alteração via Pak).
  - Conteúdo cobre: dados coletados (Plausible: pageviews agregados, sem IP individual; Meta Pixel: events de comportamento se opt-in), retenção, direitos do titular (LGPD art. 18), contato para exercer direitos (e-mail/WhatsApp da Ella), data da última atualização.

### 4. Eventos rastreados desde o dia 1

| Evento | Plausible (sempre) | Meta Pixel (se opt-in + ID set) |
|---|---|---|
| Pageview | ✅ auto | ✅ auto (`PageView`) |
| `view_product` | ✅ custom | ✅ `ViewContent` |
| `add_to_cart` | ✅ custom | ✅ `AddToCart` |
| `view_campaign_page` | ✅ custom | ✅ `ViewContent` |
| `whatsapp_finalize_click` | ✅ custom (= conversão norte) | ✅ `InitiateCheckout` |
| `whatsapp_geral_click` (botão flutuante) | ✅ custom | ✅ `Lead` |
| `instagram_click` (footer) | ✅ custom | — |

Plausible recebe **todos** os eventos para todos os usuários (cookie-less, LGPD ok). Meta Pixel só dispara quando `NEXT_PUBLIC_META_PIXEL_ID` está set **E** usuário aceitou marketing.

### 5. Posicionamento dos links no footer

- `/sobre` · `/como-comprar` · `/cuidados` · `/troca-e-devolucao` · `/faq` · `/privacidade` · `/contato`
- Mais hyperlink "Cookies" abrindo banner novamente para revogação.

## Consequências

- **Slice 1 não bloqueia esperando Pixel ID**. Site sai com Plausible funcional + Meta Pixel "armado e silencioso". Quando Ellen passar o ID, é uma var de ambiente — minutos de trabalho.
- **Cookie banner único** mesmo quando o site evolui — TikTok Pixel no futuro segue o mesmo padrão (`NEXT_PUBLIC_TIKTOK_PIXEL_ID` opcional, mesmo opt-in).
- **`/privacidade` editável sem deploy de código**: arquivo MDX em `content/`. Mudança de texto = commit ou PR pequeno; conteúdo nunca trava deploy.
- **LGPD**: política do site declara o que coletamos e como; opt-in granular (essential vs. marketing) atende ao princípio de finalidade e necessidade. Não somos consultoria jurídica — Ellen deve revisar com advogado se for paranóica.
- **Custo**: Plausible $9/mês = $108/ano. Meta Pixel free. Total operacional de analytics: ~$108/ano. Aceito.
- **Performance**: Plausible script ~1KB, async; Meta Pixel ~70KB defer + só carrega após opt-in. Impacto Lighthouse ≤ 1pt. Aceito.

## Notas

- Padrão "feature opcional via env var sem deploy de código" se torna **convenção** do projeto: aplica também a `NEXT_PUBLIC_WHATSAPP_NUMBER` (já planejado), `NEXT_PUBLIC_TIKTOK_PIXEL_ID` (futuro), e qualquer terceiro provider que entrar.
- Esta ADR não cobre o **conteúdo textual** de `/privacidade` — esse texto é entregável da Slice 1 e fica em PR separado, revisado por Ellen.
- Se Ellen entregar o Pixel ID antes do deploy da Slice 1, ele já entra no `.env.production` desde o lançamento — comportamento idêntico, só sem o passo "armar e esperar".
