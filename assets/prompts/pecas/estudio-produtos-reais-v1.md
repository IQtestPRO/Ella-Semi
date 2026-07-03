# Estúdio de produto — lote 1 (produtos reais, 02/07/2026)

- **Mecânica**: image-to-image com a foto REAL da peça como input (`role: image`)
  — regra dura no prompt: "Keep the EXACT same jewelry piece… Do NOT redesign".
  Só fundo/luz/limpeza mudam. Fidelidade conferida visualmente peça a peça.
- **Imagens**: Nano Banana (`nano_banana_2` / roteado `nano_banana_flash` p/ 6)
  · 2K (1856×2304) · 4:5 · cena: travertino + linho, luz de manhã, paleta warm.
- **Vídeos**: Cinema Studio 3.0 (`cinematic_studio_3_0`) · 3:4 · 5s · 1080p ·
  sem áudio · start_image = capa nova → comprimidos p/ ~0,5MB (720px, CRF 27).

## Aplicado

| Código | Ação | Job (imagem) |
|---|---|---|
| CO15830 | capa nova substitui foto de caixa de loja | 925ea5d8 |
| BR102 | capa nova substitui foto com barras pretas | 0899b312 |
| CJ1107 | capa nova substitui foto com barras/ícone | 3c77f3ee |
| BRA129 | capa nova sem tarja %OFF (mesma cena braço) | fd2db3aa |
| CO544 | capa nova sem fragmento de tarja (mesma cena) | 86e52a0d |
| CJ10642 | capa editorial nova + original mantida + **vídeo** | 066ac17d / vídeo b3abc923 |
| CJ18161 | capa editorial nova + original mantida + **vídeo** | edf593b6 / vídeo a0671dd5 |
| BRA14671 | capa editorial nova + original mantida + **vídeo** | ca082672 / vídeo dfe911ae |
| CO13334 | capa editorial nova + original mantida | 74673da8 |
| CH006 | capa editorial nova + original mantida | ecb29af4 |

Imagens de capa servidas via tabela `images` (Turso); vídeos em
`public/assets/generated/products/videos/<COD>.mp4` (campo `videoUrl`).

## Prompt base (imagem)

> Professional e-commerce jewelry product photography retouch. Keep the EXACT
> same {peça descrita em detalhe} from the reference image. Do NOT redesign,
> add or remove any element. Replace only the background and lighting: {cena
> travertino/linho}, soft professional studio lighting, warm editorial palette
> (#FFF1ED, #F0DCC4), subtle golden glints. Clean minimalist high-end online
> store product photo, sharp focus, no people, no text, no watermark.

## Prompt base (vídeo)

> Luxury jewelry product video: very slow subtle orbit/push-in, soft light
> sweeps across the piece making it sparkle. The jewelry stays perfectly still
> and identical. Warm cream editorial atmosphere, shallow depth of field,
> high-end e-commerce product cinematography, no people, no text.
