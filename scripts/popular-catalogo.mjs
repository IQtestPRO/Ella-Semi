// Popula data/products.json com peças do catálogo Outono 2026 (~141 total).
// Tabela hardcoded baseada em parse manual de .scratch/catalogo.txt (pdftotext -layout).
// Slugs atemporais com motif "Folhas de Outono". Existing 10 peças preservadas.
// SEED inicial: 8 peças com maisVendido:true (mix de categorias e faixas de preço).

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const PRODUCTS_PATH = resolve(ROOT, 'data/products.json');

const existing = JSON.parse(readFileSync(PRODUCTS_PATH, 'utf-8'));
const existingSlugs = new Set(existing.map(p => p.slug));
const existingByOrigin = new Map(existing.map(p => [`${p.origem.pagina}-${p.origem.letra}`, p]));

// Tabela: pg, letra, precoCentavos, isSemijoia, mods (TRIO/PERSONALIZADA/CADA/OURO/RODIO/CONJUNTO/TRIPLO/BRACELETE_ACRILICO)
const RAW = [
  // Página 4 — capa amostras (mix curado)
  { pg: 4, letra: 'A', preco: 6990, semijoia: true,  mods: [] },
  { pg: 4, letra: 'B', preco: 14990, semijoia: true,  mods: [] },
  { pg: 4, letra: 'C', preco: 7990, semijoia: true,  mods: [] },
  { pg: 4, letra: 'D', preco: 5990, semijoia: true,  mods: [] },
  { pg: 4, letra: 'F', preco: 4590, semijoia: true,  mods: [] },
  { pg: 4, letra: 'G', preco: 5990, semijoia: true,  mods: [] },
  { pg: 4, letra: 'H', preco: 9590, semijoia: true,  mods: [] },
  // Página 5 — brincos (E já existe: brinco-hoop-trio)
  { pg: 5, letra: 'A', preco: 6990, semijoia: false, mods: [] },
  { pg: 5, letra: 'B', preco: 18990, semijoia: true, mods: [] },
  { pg: 5, letra: 'C', preco: 18990, semijoia: true, mods: [] },
  { pg: 5, letra: 'D', preco: 6590, semijoia: true,  mods: [] },
  // Página 6 — conjuntos+brincos+colares (A,D já existem)
  { pg: 6, letra: 'B', preco: 8990, semijoia: true, mods: [] },
  { pg: 6, letra: 'C', preco: 12990, semijoia: true, mods: [] },
  { pg: 6, letra: 'E', preco: 10990, semijoia: true, mods: [] },
  { pg: 6, letra: 'F', preco: 8990, semijoia: true, mods: [] },
  { pg: 6, letra: 'G', preco: 10990, semijoia: true, mods: [] },
  // Página 7 — mix anéis+brincos
  { pg: 7, letra: 'A', preco: 2990, semijoia: false, mods: [] },
  { pg: 7, letra: 'B', preco: 6990, semijoia: false, mods: [] },
  { pg: 7, letra: 'C', preco: 5990, semijoia: false, mods: [] },
  { pg: 7, letra: 'D', preco: 5990, semijoia: false, mods: [] },
  { pg: 7, letra: 'E', preco: 6990, semijoia: false, mods: [] },
  { pg: 7, letra: 'F', preco: 6990, semijoia: false, mods: [] },
  { pg: 7, letra: 'G', preco: 6990, semijoia: false, mods: [] },
  { pg: 7, letra: 'H', preco: 4990, semijoia: false, mods: [] },
  { pg: 7, letra: 'I', preco: 6990, semijoia: true,  mods: [] },
  // Página 8 — anéis
  { pg: 8, letra: 'A', preco: 5990, semijoia: false, mods: [] },
  { pg: 8, letra: 'B', preco: 9890, semijoia: true,  mods: [] },
  { pg: 8, letra: 'C', preco: 6990, semijoia: false, mods: [] },
  { pg: 8, letra: 'D', preco: 4990, semijoia: false, mods: [] },
  { pg: 8, letra: 'E', preco: 5990, semijoia: false, mods: [] },
  { pg: 8, letra: 'F', preco: 5990, semijoia: false, mods: [] },
  { pg: 8, letra: 'G', preco: 3990, semijoia: false, mods: [] },
  { pg: 8, letra: 'H', preco: 6990, semijoia: false, mods: [] },
  // Página 9 — colares+pulseiras+brincos (B,D,E já existem)
  { pg: 9, letra: 'A', preco: 3990, semijoia: false, mods: [] },
  { pg: 9, letra: 'C', preco: 5990, semijoia: true,  mods: [] },
  { pg: 9, letra: 'F', preco: 6990, semijoia: true,  mods: [] },
  // Página 10 — brincos+braceletes
  { pg: 10, letra: 'A', preco: 2990, semijoia: false, mods: [] },
  { pg: 10, letra: 'B', preco: 8990, semijoia: false, mods: [] },
  { pg: 10, letra: 'C', preco: 5990, semijoia: false, mods: [] },
  { pg: 10, letra: 'D', preco: 8990, semijoia: true,  mods: [] },
  { pg: 10, letra: 'E', preco: 5990, semijoia: false, mods: [] },
  { pg: 10, letra: 'F', preco: 6990, semijoia: false, mods: ['TRIO'] },
  { pg: 10, letra: 'G', preco: 5990, semijoia: false, mods: [] },
  { pg: 10, letra: 'H', preco: 2990, semijoia: false, mods: ['BRACELETE_ACRILICO'] },
  // Página 11 — brincos+pulseiras
  { pg: 11, letra: 'A', preco: 3990, semijoia: false, mods: [] },
  { pg: 11, letra: 'B', preco: 8990, semijoia: false, mods: ['TRIO'] },
  { pg: 11, letra: 'C', preco: 2990, semijoia: false, mods: [] },
  { pg: 11, letra: 'D', preco: 5990, semijoia: false, mods: [] },
  { pg: 11, letra: 'E', preco: 5990, semijoia: false, mods: [] },
  { pg: 11, letra: 'F', preco: 3990, semijoia: false, mods: [] },
  { pg: 11, letra: 'G', preco: 8990, semijoia: false, mods: [] },
  { pg: 11, letra: 'H', preco: 3990, semijoia: false, mods: [] },
  // Página 12 — colares (D já existe)
  { pg: 12, letra: 'A', preco: 4590, semijoia: false, mods: [] },
  { pg: 12, letra: 'B', preco: 3990, semijoia: false, mods: ['CADA'] },
  { pg: 12, letra: 'C', preco: 6990, semijoia: false, mods: [] },
  { pg: 12, letra: 'E', preco: 10590, semijoia: true,  mods: [] },
  { pg: 12, letra: 'F', preco: 5990, semijoia: false, mods: [] },
  { pg: 12, letra: 'G', preco: 9890, semijoia: false, mods: [] },
  { pg: 12, letra: 'H', preco: 4990, semijoia: true,  mods: [] },
  // Página 13 — colares
  { pg: 13, letra: 'A', preco: 2990, semijoia: false, mods: [] },
  { pg: 13, letra: 'B', preco: 5990, semijoia: false, mods: [] },
  { pg: 13, letra: 'C', preco: 6990, semijoia: false, mods: [] },
  { pg: 13, letra: 'D', preco: 4590, semijoia: false, mods: [] },
  { pg: 13, letra: 'E', preco: 5990, semijoia: false, mods: [] },
  { pg: 13, letra: 'F', preco: 9890, semijoia: true,  mods: [] },
  { pg: 13, letra: 'G', preco: 5990, semijoia: false, mods: [] },
  { pg: 13, letra: 'H', preco: 4990, semijoia: false, mods: [] },
  { pg: 13, letra: 'I', preco: 3990, semijoia: false, mods: [] },
  // Página 14 — colares+gargantilhas
  { pg: 14, letra: 'A', preco: 2990, semijoia: false, mods: [] },
  { pg: 14, letra: 'B', preco: 7990, semijoia: false, mods: [] },
  { pg: 14, letra: 'C', preco: 7990, semijoia: false, mods: [] },
  { pg: 14, letra: 'D', preco: 5990, semijoia: false, mods: [] },
  { pg: 14, letra: 'E', preco: 3990, semijoia: false, mods: [] },
  { pg: 14, letra: 'F', preco: 3990, semijoia: false, mods: ['CADA'] },
  { pg: 14, letra: 'G', preco: 7990, semijoia: true,  mods: [] },
  { pg: 14, letra: 'H', preco: 2990, semijoia: false, mods: [] },
  { pg: 14, letra: 'I', preco: 5990, semijoia: false, mods: [] },
  { pg: 14, letra: 'J', preco: 3990, semijoia: false, mods: [] },
  // Página 15 — colares (E já existe)
  { pg: 15, letra: 'A', preco: 6990, semijoia: true,  mods: [] },
  { pg: 15, letra: 'B', preco: 6990, semijoia: false, mods: [] },
  { pg: 15, letra: 'C', preco: 12990, semijoia: true, mods: [] },
  { pg: 15, letra: 'D', preco: 6990, semijoia: false, mods: [] },
  { pg: 15, letra: 'F', preco: 7590, semijoia: true,  mods: [] },
  { pg: 15, letra: 'G', preco: 3990, semijoia: false, mods: [] },
  { pg: 15, letra: 'H', preco: 4990, semijoia: false, mods: [] },
  { pg: 15, letra: 'I', preco: 4990, semijoia: false, mods: [] },
  // Página 16 — colares (A,B PERSONALIZADA → sob-encomenda)
  { pg: 16, letra: 'A', preco: 2590, semijoia: false, mods: ['PERSONALIZADA'] },
  { pg: 16, letra: 'B', preco: 5990, semijoia: false, mods: ['PERSONALIZADA'] },
  { pg: 16, letra: 'C', preco: 5990, semijoia: false, mods: [] },
  { pg: 16, letra: 'D', preco: 3990, semijoia: false, mods: ['CADA'] },
  { pg: 16, letra: 'E', preco: 9890, semijoia: true,  mods: [] },
  { pg: 16, letra: 'F', preco: 15990, semijoia: true, mods: [] },
  // Página 17 — conjuntos (C já existe)
  { pg: 17, letra: 'A', preco: 6990, semijoia: false, mods: ['TRIO'] },
  { pg: 17, letra: 'B', preco: 14990, semijoia: true, mods: [] },
  { pg: 17, letra: 'D', preco: 16990, semijoia: true, mods: [] },
  { pg: 17, letra: 'E', preco: 8990, semijoia: true,  mods: [] },
  // Página 18 — conjuntos
  { pg: 18, letra: 'A', preco: 28990, semijoia: true, mods: ['CONJUNTO'] },
  { pg: 18, letra: 'B', preco: 8990, semijoia: true,  mods: ['OURO'] },
  { pg: 18, letra: 'C', preco: 8990, semijoia: true,  mods: ['RODIO'] },
  { pg: 18, letra: 'D', preco: 16990, semijoia: true, mods: ['CONJUNTO'] },
  { pg: 18, letra: 'E', preco: 29990, semijoia: true, mods: ['CONJUNTO'] },
  // Página 19 — anéis statement
  { pg: 19, letra: 'A', preco: 8990, semijoia: true,  mods: [] },
  { pg: 19, letra: 'B', preco: 14990, semijoia: true, mods: [] },
  { pg: 19, letra: 'C', preco: 16990, semijoia: true, mods: [] },
  { pg: 19, letra: 'D', preco: 5990, semijoia: false, mods: ['CADA'] },
  { pg: 19, letra: 'E', preco: 15990, semijoia: true, mods: [] },
  // Página 20 — anéis (D PERSONALIZADO → sob-encomenda)
  { pg: 20, letra: 'A', preco: 4990, semijoia: false, mods: [] },
  { pg: 20, letra: 'B', preco: 8990, semijoia: false, mods: ['TRIPLO'] },
  { pg: 20, letra: 'C', preco: 6990, semijoia: false, mods: ['TRIO'] },
  { pg: 20, letra: 'D', preco: 3990, semijoia: false, mods: ['CADA', 'PERSONALIZADA'] },
  { pg: 20, letra: 'E', preco: 5990, semijoia: true,  mods: [] },
  { pg: 20, letra: 'F', preco: 9890, semijoia: true,  mods: [] },
  // Página 21 — anéis
  { pg: 21, letra: 'A', preco: 3990, semijoia: false, mods: [] },
  { pg: 21, letra: 'B', preco: 5990, semijoia: false, mods: [] },
  { pg: 21, letra: 'C', preco: 22990, semijoia: true, mods: [] },
  { pg: 21, letra: 'D', preco: 4990, semijoia: false, mods: [] },
  { pg: 21, letra: 'E', preco: 5990, semijoia: false, mods: [] },
  { pg: 21, letra: 'F', preco: 7990, semijoia: false, mods: [] },
  { pg: 21, letra: 'G', preco: 6990, semijoia: false, mods: [] },
  { pg: 21, letra: 'H', preco: 12990, semijoia: true, mods: [] },
  // Página 22 — pulseiras (I já existe)
  { pg: 22, letra: 'A', preco: 2990, semijoia: false, mods: [] },
  { pg: 22, letra: 'B', preco: 4990, semijoia: false, mods: [] },
  { pg: 22, letra: 'C', preco: 5990, semijoia: false, mods: [] },
  { pg: 22, letra: 'D', preco: 7990, semijoia: false, mods: [] },
  { pg: 22, letra: 'E', preco: 8990, semijoia: true,  mods: [] },
  { pg: 22, letra: 'F', preco: 14990, semijoia: true, mods: [] },
  { pg: 22, letra: 'G', preco: 6990, semijoia: false, mods: [] },
  { pg: 22, letra: 'H', preco: 4990, semijoia: false, mods: [] },
  { pg: 22, letra: 'J', preco: 9890, semijoia: true,  mods: [] },
  { pg: 22, letra: 'K', preco: 16990, semijoia: true, mods: [] },
  { pg: 22, letra: 'L', preco: 5990, semijoia: false, mods: [] },
];

// Categoria por (página, letra) — heurística baseada em existing + sinais textuais
function inferCategoria({ pg, letra, mods }) {
  // BRACELETE_ACRILICO → outros (peça acrílica não é semijoia padrão)
  if (mods.includes('BRACELETE_ACRILICO')) return 'pulseiras';
  // CONJUNTO modifier explicit → conjuntos
  if (mods.includes('CONJUNTO')) return 'conjuntos';

  const map = {
    // pg 4 — capa amostras (heurística mix)
    '4-A': 'brincos', '4-B': 'colares', '4-C': 'brincos',
    '4-D': 'brincos', '4-F': 'brincos', '4-G': 'colares', '4-H': 'colares',
    // pg 5 — brincos
    '5-A': 'brincos', '5-B': 'brincos', '5-C': 'brincos', '5-D': 'brincos',
    // pg 6 — conjuntos+brincos
    '6-B': 'conjuntos', '6-C': 'conjuntos', '6-E': 'brincos', '6-F': 'brincos', '6-G': 'conjuntos',
    // pg 7 — mix anéis+brincos
    '7-A': 'aneis', '7-B': 'brincos', '7-C': 'brincos', '7-D': 'aneis',
    '7-E': 'brincos', '7-F': 'aneis', '7-G': 'brincos', '7-H': 'brincos', '7-I': 'aneis',
    // pg 8 — anéis
    '8-A': 'aneis', '8-B': 'aneis', '8-C': 'aneis', '8-D': 'aneis',
    '8-E': 'aneis', '8-F': 'aneis', '8-G': 'aneis', '8-H': 'aneis',
    // pg 9 — colares
    '9-A': 'colares', '9-C': 'colares', '9-F': 'colares',
    // pg 10 — brincos+braceletes
    '10-A': 'brincos', '10-B': 'brincos', '10-C': 'brincos', '10-D': 'brincos',
    '10-E': 'brincos', '10-F': 'brincos', '10-G': 'brincos', '10-H': 'pulseiras',
    // pg 11 — brincos+anéis
    '11-A': 'brincos', '11-B': 'brincos', '11-C': 'brincos', '11-D': 'brincos',
    '11-E': 'brincos', '11-F': 'brincos', '11-G': 'brincos', '11-H': 'brincos',
    // pg 12 — colares
    '12-A': 'colares', '12-B': 'colares', '12-C': 'colares', '12-E': 'colares',
    '12-F': 'colares', '12-G': 'colares', '12-H': 'colares',
    // pg 13 — colares
    '13-A': 'colares', '13-B': 'colares', '13-C': 'colares', '13-D': 'colares',
    '13-E': 'colares', '13-F': 'colares', '13-G': 'colares', '13-H': 'colares', '13-I': 'colares',
    // pg 14 — colares+gargantilhas
    '14-A': 'gargantilhas', '14-B': 'colares', '14-C': 'colares', '14-D': 'colares',
    '14-E': 'gargantilhas', '14-F': 'colares', '14-G': 'colares',
    '14-H': 'gargantilhas', '14-I': 'colares', '14-J': 'gargantilhas',
    // pg 15 — colares
    '15-A': 'colares', '15-B': 'colares', '15-C': 'colares', '15-D': 'colares',
    '15-F': 'colares', '15-G': 'colares', '15-H': 'colares', '15-I': 'colares',
    // pg 16 — colares (PERSONALIZADA = cordões personalizados)
    '16-A': 'colares', '16-B': 'colares', '16-C': 'colares', '16-D': 'colares',
    '16-E': 'colares', '16-F': 'colares',
    // pg 17 — conjuntos
    '17-A': 'conjuntos', '17-B': 'conjuntos', '17-D': 'conjuntos', '17-E': 'conjuntos',
    // pg 18 — conjuntos (CONJUNTO mod já capturado)
    '18-B': 'conjuntos', '18-C': 'conjuntos',
    // pg 19 — anéis
    '19-A': 'aneis', '19-B': 'aneis', '19-C': 'aneis', '19-D': 'aneis', '19-E': 'aneis',
    // pg 20 — anéis
    '20-A': 'aneis', '20-B': 'aneis', '20-C': 'aneis', '20-D': 'aneis', '20-E': 'aneis', '20-F': 'aneis',
    // pg 21 — anéis
    '21-A': 'aneis', '21-B': 'aneis', '21-C': 'aneis', '21-D': 'aneis',
    '21-E': 'aneis', '21-F': 'aneis', '21-G': 'aneis', '21-H': 'aneis',
    // pg 22 — pulseiras
    '22-A': 'pulseiras', '22-B': 'pulseiras', '22-C': 'pulseiras', '22-D': 'pulseiras',
    '22-E': 'pulseiras', '22-F': 'pulseiras', '22-G': 'pulseiras', '22-H': 'pulseiras',
    '22-J': 'pulseiras', '22-K': 'pulseiras', '22-L': 'pulseiras',
  };

  const key = `${pg}-${letra}`;
  return map[key] || 'outros';
}

// Pool de motifs Folhas de Outono por categoria — gera slugs únicos
const MOTIFS = {
  brincos: [
    'folha-suspensa', 'folha-curva', 'folha-pequena', 'folha-grande', 'folha-fina',
    'folha-pousada', 'folha-abraco', 'folha-pavé', 'folha-rosé', 'folha-cravada',
    'gota-folha', 'gota-pingente', 'gota-pequena', 'gota-grande', 'broto-pequeno',
    'broto-suspenso', 'broto-pavé', 'broto-pingente', 'broto-cravado', 'sumo-dourado',
    'sumo-pavé', 'veia-fina-brinco', 'veia-pequena', 'galho-curvo-brinco', 'galho-pingente',
    'galho-fino-brinco', 'argola-folha', 'argola-broto', 'argola-veia', 'argola-galho',
    'argola-pavé', 'gancho-folha', 'gancho-broto', 'pingente-folha-brinco', 'pingente-broto-brinco',
    'pingente-gota', 'aro-folha', 'aro-pavé', 'aro-cravado', 'pousada-pavé',
    'fina-pavé', 'cravada-rosé', 'curva-rosé', 'grande-pavé', 'pequena-pavé',
    'simples-folha', 'duplo-folha', 'mosaico-folha',
  ],
  colares: [
    'galho-fino', 'galho-pendente', 'galho-curvo', 'galho-pousado', 'galho-coracao-fino',
    'galho-perola', 'galho-cravado', 'veia-dourada', 'veia-veneziana', 'veia-perlada',
    'veia-cravada', 'veia-quadradinho', 'veia-rosé', 'pingente-folha-colar', 'pingente-galho',
    'pingente-broto', 'pingente-perola-fina', 'pingente-coracao-fino', 'pingente-cruz-fina', 'pingente-zirconia',
    'pingente-gota', 'pingente-pavé', 'corrente-folha', 'corrente-veia', 'corrente-galho',
    'corrente-broto', 'corrente-perola', 'corrente-fina', 'corrente-grossa', 'corrente-elo',
    'mosaico-veia', 'mosaico-galho', 'fina-perlada', 'longa-folha', 'longa-perlada',
    'curta-pendente', 'pendente-coracao-pequeno', 'pendente-folha-pequena', 'pendente-galho-rosé', 'pendente-broto-rosé',
  ],
  pulseiras: [
    'broto-dourado', 'broto-link', 'broto-perlado', 'broto-fino', 'broto-grosso',
    'elo-folha', 'elo-perola', 'elo-fino', 'elo-grosso', 'elo-galho',
    'elo-coracao', 'galho-pulseira', 'galho-pulseira-fina', 'veia-pulseira', 'veia-fina-pulseira',
    'corrente-pulseira', 'corrente-veia-pulseira', 'pendente-folha-pulseira', 'pendente-broto-pulseira', 'pendente-galho-pulseira',
    'pingente-folha-pulseira', 'fina-perlada-pulseira', 'fina-cravada', 'grossa-veneziana', 'rigida-folha',
    'rigida-broto', 'rigida-galho', 'rigida-fina', 'fina-elo', 'grossa-elo',
    'fina-galho', 'mista-folha', 'mista-broto', 'mista-galho', 'duplo-galho',
    'duplo-broto', 'pearl-galho', 'pearl-folha', 'pearl-broto', 'aberta-folha',
    'aberta-galho', 'aberta-broto', 'fechada-folha', 'fechada-broto', 'fechada-galho',
    'acrílica-folha',
  ],
  aneis: [
    'veia-fina', 'veia-grossa', 'veia-cravada', 'veia-perola', 'veia-rose',
    'veia-pavé', 'folha-anel', 'folha-fina-anel', 'folha-pavé-anel', 'folha-cravada-anel',
    'galho-anel', 'galho-fino-anel', 'galho-curvo-anel', 'galho-pavé-anel', 'broto-anel',
    'broto-fino-anel', 'broto-cravado-anel', 'broto-pavé-anel', 'pousada-anel', 'pousada-pavé-anel',
    'aro-folha-anel', 'aro-fino', 'aro-grosso', 'aro-pavé-anel', 'aro-cravado-anel',
    'duplo-anel', 'duplo-folha-anel', 'duplo-broto-anel', 'duplo-galho-anel', 'triplo-veia',
    'triplo-folha', 'triplo-broto', 'mosaico-anel', 'mosaico-pavé', 'rigido-folha-anel',
    'rigido-galho-anel', 'fino-zirconia', 'fino-rose', 'grosso-zirconia', 'grosso-rose',
    'aberto-folha', 'aberto-galho', 'fechado-pavé', 'fechado-cravado', 'simples-folha-anel',
    'simples-broto-anel', 'curvo-pavé', 'curvo-cravado',
  ],
  conjuntos: [
    'folha-conjunto', 'galho-conjunto', 'broto-conjunto', 'veia-conjunto', 'coracao-conjunto-fino',
    'perola-conjunto', 'cruz-conjunto', 'pingente-conjunto', 'zirconia-conjunto', 'pavé-conjunto',
    'cravado-conjunto', 'rosé-conjunto', 'rodio-conjunto', 'ouro-conjunto', 'duplo-conjunto',
    'triplo-conjunto', 'argolinha-conjunto', 'galho-fino-conjunto', 'fina-conjunto',
  ],
  gargantilhas: [
    'galho-gargantilha', 'folha-gargantilha', 'veia-gargantilha', 'broto-gargantilha',
    'pingente-folha-gargantilha', 'pingente-galho-gargantilha', 'fina-gargantilha', 'perola-gargantilha',
    'cravada-gargantilha',
  ],
  outros: [
    'peça-folha', 'peça-broto', 'peça-galho',
  ],
};

// Mapping plural → singular pt-br (pra slug atemporal correto)
const SINGULAR = {
  brincos: 'brinco',
  colares: 'colar',
  pulseiras: 'pulseira',
  aneis: 'anel',
  conjuntos: 'conjunto',
  gargantilhas: 'gargantilha',
  tornozeleiras: 'tornozeleira',
  piercings: 'piercing',
  outros: 'peca',
};

// Normaliza slug pra ASCII (remove acentos, mantém só [a-z0-9-])
function normalizeSlug(s) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9-]/g, '');
}

// Counters por categoria
const counters = {};
function nextSlug(categoria, semijoia) {
  counters[categoria] = (counters[categoria] || 0);
  const pool = MOTIFS[categoria] || MOTIFS.outros;
  const baseCat = SINGULAR[categoria] || 'peca';
  let candidate;
  let attempts = 0;
  do {
    const motif = pool[counters[categoria] % pool.length];
    const tipoSuffix = semijoia ? '-semijoia' : '-bijuteria';
    candidate = normalizeSlug(`${baseCat}-${motif}${tipoSuffix}`);
    counters[categoria]++;
    attempts++;
    if (attempts > pool.length * 3) {
      candidate = normalizeSlug(`${baseCat}-${pool[0]}-${counters[categoria]}${semijoia ? '-semijoia' : '-bijuteria'}`);
      break;
    }
  } while (existingSlugs.has(candidate));
  existingSlugs.add(candidate);
  return candidate;
}

function nomeFromSlug(slug) {
  return slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
    .replace('Pavé', 'Pavé')
    .replace('Rosé', 'Rosé')
    .replace('Rodio', 'Ródio');
}

function descricao(categoria, mods, semijoia) {
  const tipoTxt = semijoia ? 'semijoia' : 'bijuteria';
  const baseCat = SINGULAR[categoria] || 'peca';
  const trio = mods.includes('TRIO') ? ' Trio.' : '';
  const triplo = mods.includes('TRIPLO') ? ' Triplo.' : '';
  const personalizada = mods.includes('PERSONALIZADA') ? ' Personalizada (sob encomenda).' : '';
  const cada = mods.includes('CADA') ? ' Vendido por unidade.' : '';
  return `${baseCat.charAt(0).toUpperCase() + baseCat.slice(1)} ${tipoTxt} da Coleção Folhas de Outono.${trio}${triplo}${personalizada}${cada}`.trim();
}

const TS = '2026-05-06T18:00:00Z';

const novos = [];
for (const raw of RAW) {
  const key = `${raw.pg}-${raw.letra}`;
  if (existingByOrigin.has(key)) continue; // skip já cadastradas

  const categoria = inferCategoria(raw);
  const banho = raw.mods.includes('RODIO') ? 'rodio' : 'ouro';
  const tipo = raw.semijoia ? 'semijoia' : 'bijuteria';
  const slug = nextSlug(categoria, raw.semijoia);

  const tags = [
    SINGULAR[categoria] || 'peca',
    raw.semijoia ? 'semijoia' : 'bijuteria',
    'folhas-de-outono',
  ];
  if (raw.mods.includes('TRIO')) tags.push('trio');
  if (raw.mods.includes('TRIPLO')) tags.push('triplo');
  if (raw.mods.includes('PERSONALIZADA')) tags.push('personalizada');

  const tipoFulfillment = raw.mods.includes('PERSONALIZADA') ? 'sob-encomenda' : 'pronta-entrega';

  novos.push({
    slug,
    nome: nomeFromSlug(slug),
    categoria,
    banho,
    tipo,
    precoCents: raw.preco,
    descricao: descricao(categoria, raw.mods, raw.semijoia),
    fotos: [],
    tags,
    promocao: false,
    tipoFulfillment,
    destaqueHome: false,
    maisVendido: false,
    ativo: true,
    origem: {
      catalogoArquivo: 'catalogo-outono-2026.pdf',
      pagina: raw.pg,
      letra: raw.letra,
    },
    fonteFotoFraca: false,
    cadastradoEm: TS,
    atualizadoEm: TS,
  });
}

// SEED inicial: 8 peças com maisVendido:true (mix categorias e faixas de preço)
const seedSlugs = [
  novos.find(p => p.categoria === 'brincos' && p.precoCents < 7000)?.slug,
  novos.find(p => p.categoria === 'brincos' && p.precoCents > 14000)?.slug,
  novos.find(p => p.categoria === 'colares' && p.precoCents < 7000)?.slug,
  novos.find(p => p.categoria === 'colares' && p.precoCents > 9000)?.slug,
  novos.find(p => p.categoria === 'pulseiras' && p.precoCents > 8000 && p.precoCents < 16000)?.slug,
  novos.find(p => p.categoria === 'pulseiras' && p.precoCents > 16000)?.slug,
  novos.find(p => p.categoria === 'aneis' && p.precoCents > 8000)?.slug,
  novos.find(p => p.categoria === 'conjuntos' && p.precoCents > 14000)?.slug,
].filter(Boolean);

for (const p of novos) {
  if (seedSlugs.includes(p.slug)) p.maisVendido = true;
}

const merged = [...existing, ...novos];

// Sort por (pg, letra) pra estabilidade visual
merged.sort((a, b) => {
  const pa = a.origem?.pagina ?? 99;
  const pb = b.origem?.pagina ?? 99;
  if (pa !== pb) return pa - pb;
  return (a.origem?.letra ?? 'Z').localeCompare(b.origem?.letra ?? 'Z');
});

writeFileSync(PRODUCTS_PATH, JSON.stringify(merged, null, 2) + '\n');

console.log(`Total: ${merged.length} peças (${existing.length} existentes + ${novos.length} novas)`);
console.log(`maisVendido true: ${merged.filter(p => p.maisVendido).length}`);
console.log(`destaqueHome true: ${merged.filter(p => p.destaqueHome).length}`);
console.log(`Categorias:`);
const cats = {};
for (const p of merged) cats[p.categoria] = (cats[p.categoria] || 0) + 1;
for (const [k, v] of Object.entries(cats).sort()) console.log(`  ${k}: ${v}`);
console.log(`SEED maisVendido slugs: ${seedSlugs.join(', ')}`);
