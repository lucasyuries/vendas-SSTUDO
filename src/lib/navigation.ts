// ============================================================================
// NAVEGAÇÃO — os quatro eixos do mega menu
// ----------------------------------------------------------------------------
// Cada eixo responde a uma pergunta diferente que o visitante faz, e é a razão
// de existirem quatro em vez de uma lista única:
//
//   "posso confiar?"     → Institucional
//   "o que vocês têm?"   → Produtos
//   "quem é você?"       → Soluções, por tipo de cliente
//   "qual meu problema?" → Conformidade, por norma
//
// O eixo Conformidade é a aposta de busca orgânica: captura quem pesquisa
// "PGR" ou "NR-01" no Google sem conhecer a marca.
//
// ----------------------------------------------------------------------------
// O que já foi retirado, e por quê
// ----------------------------------------------------------------------------
// O menu já teve cinco eixos. "Conteúdo" saiu e não voltou: não tinha uma
// única página real por trás, só itens marcados como "em breve". Menu cheio de
// promessa não cumprida é pior que menu curto. "Soluções" saiu pelo mesmo
// motivo e voltou quando as quatro páginas por público passaram a existir.
//
// Duas regras inegociáveis, ambas garantidas por teste:
//
//   1. Nenhum item aponta para página ou seção inexistente. Ou o destino
//      existe, ou o item não é link.
//   2. Nenhum destino é âncora solta. O menu aparece em todas as páginas, e
//      "#faq" só funciona para quem já está na inicial — em qualquer outra
//      página o item fica morto, sem erro visível.
// ============================================================================

import { PRODUCTS } from "./products";
import { AUDIENCES } from "./audiences";

export interface NavItem {
  label: string;
  description: string;
  /** Destino real, ou null enquanto a página não existir. */
  href: string | null;
  /** Abre em nova aba: usado para os sistemas dos produtos. */
  external?: boolean;
}

export interface NavColumn {
  heading: string;
  items: NavItem[];
}

export interface NavAxis {
  id: string;
  label: string;
  /** Uma linha explicando o eixo, exibida no topo do painel. */
  summary: string;
  columns: NavColumn[];
}

/**
 * Caminhos de página que realmente existem hoje. O teste de navegação usa esta
 * lista para reprovar qualquer link para página inexistente.
 */
export const EXISTING_ROUTES = [
  "/",
  "/sobre",
  "/contato",
  "/login",
  "/esqueci-senha",
  "/reset-password",
  // Páginas de produto e de público são geradas por rotas parametrizadas; os
  // caminhos válidos são exatamente os declarados nos catálogos.
  ...PRODUCTS.map((p) => p.path),
  ...AUDIENCES.map((a) => a.path),
] as const;

/**
 * Páginas públicas, que devem aparecer no sitemap e ser indexadas.
 *
 * As páginas de conta e o painel administrativo ficam de fora de propósito:
 * são `noindex` e estão bloqueadas no robots.txt.
 */
export const PUBLIC_ROUTES = [
  "/",
  "/sobre",
  "/contato",
  ...PRODUCTS.map((p) => p.path),
  ...AUDIENCES.map((a) => a.path),
] as const;

/** Páginas que existem mas NÃO devem ser indexadas. */
export const PRIVATE_ROUTES = ["/login", "/esqueci-senha", "/reset-password", "/admin"] as const;

/** Âncoras de seção que existem na página inicial. */
export const HOME_ANCHORS = [
  "#top",
  "#o-problema",
  "#produtos",
  "#como-funciona",
  "#conformidade",
  "#por-que-sstudo",
  "#faq",
  "#contato",
] as const;

/** Âncoras de seção que existem na página institucional. */
export const SOBRE_ANCHORS = ["#top", "#missao-visao", "#valores", "#parceiros"] as const;

/**
 * Âncoras válidas por página. O teste de navegação usa este mapa para reprovar
 * link que aponte para uma seção inexistente — um erro que não quebra nada
 * visivelmente, só leva o visitante ao topo da página errada.
 */
export const PAGE_ANCHORS: Record<string, readonly string[]> = {
  "/": HOME_ANCHORS,
  "/sobre": SOBRE_ANCHORS,
  "/contato": ["#top", "#orcamento", "#duvida"],
};

const produtoItems: NavItem[] = PRODUCTS.map((product) => ({
  label: product.name,
  description: product.tagline,
  href: product.path,
}));

/** Usa a versão curta da descrição: a tagline é longa demais para o painel. */
function itemDoPublico(publico: (typeof AUDIENCES)[number]): NavItem {
  return {
    label: publico.name,
    description: publico.navSummary,
    href: publico.path,
  };
}

export const NAV_AXES: NavAxis[] = [
  {
    id: "institucional",
    label: "Institucional",
    summary: "Quem está por trás das ferramentas",
    columns: [
      {
        heading: "A empresa",
        items: [
          {
            label: "Sobre a SSTudo",
            description: "Quem está por trás das ferramentas",
            href: "/sobre",
          },
          {
            label: "Missão e visão",
            description: "Onde queremos chegar",
            href: "/sobre#missao-visao",
          },
          {
            label: "Valores",
            description: "No que acreditamos, na prática",
            href: "/sobre#valores",
          },
        ],
      },
      {
        heading: "Confiança",
        // Caminho absoluto, e não âncora solta: o menu aparece em todas as
        // páginas, então "#faq" só funcionava para quem já estava na inicial.
        // Em qualquer outra página o item não levava a lugar nenhum.
        items: [
          {
            label: "Por que a SSTudo",
            description: "O que nos diferencia no mercado de SST",
            href: "/#por-que-sstudo",
          },
          {
            label: "Perguntas frequentes",
            description: "As dúvidas mais comuns",
            href: "/#faq",
          },
        ],
      },
    ],
  },
  {
    id: "produtos",
    label: "Produtos",
    summary: "Quatro produtos, quatro frentes de conformidade",
    columns: [
      { heading: "Nossas soluções", items: produtoItems },
      {
        heading: "Acessar",
        items: PRODUCTS.map((product) => ({
          label: `Sistema ${product.name}`,
          description: "Entrar na plataforma",
          href: product.systemUrl,
          external: true,
        })),
      },
    ],
  },
  {
    id: "solucoes",
    label: "Soluções",
    summary: "Cada público entra na SST por um caminho diferente",
    // Duas colunas, e não uma lista única: com quatro rótulos longos empilhados,
    // o painel virava uma coluna estreita e alta. A divisão também é útil —
    // quem contrata e quem presta serviço compram por razões diferentes.
    columns: [
      {
        heading: "Quem contrata",
        items: AUDIENCES.filter((p) => p.navGroup === "contrata").map(itemDoPublico),
      },
      {
        heading: "Quem presta serviço",
        items: AUDIENCES.filter((p) => p.navGroup === "presta").map(itemDoPublico),
      },
    ],
  },
  {
    id: "conformidade",
    label: "Conformidade",
    summary: "O que a lei exige, e onde a SSTudo entra",
    columns: [
      // Cada norma leva ao produto que ajuda a cumpri-la. É o que torna este
      // eixo útil: quem pesquisa a sigla no Google chega direto na solução.
      {
        heading: "Normas",
        items: [
          {
            label: "NR-01 e riscos psicossociais",
            description: "A exigência sobre saúde mental",
            href: "/produtos/psicohub",
          },
          {
            label: "PGR e GRO",
            description: "Gerenciamento de riscos ocupacionais",
            href: "/produtos/diagnostico-pgr",
          },
          {
            label: "PCMSO",
            description: "Controle médico ocupacional",
            href: "/produtos/aso-digital",
          },
        ],
      },
      {
        heading: "Obrigações",
        items: [
          // Havia aqui um item de eSocial, prometendo os eventos S-2210,
          // S-2220 e S-2240. Foi removido: o ASO Digital não transmite eventos
          // do eSocial, e a afirmação nunca teve fonte — foi inferida por
          // engano na redação do catálogo.
          {
            label: "ASO",
            description: "Atestado de saúde ocupacional",
            href: "/produtos/aso-digital",
          },
          {
            label: "LGPD no canal de denúncias",
            description: "Anonimato e tratamento de dados",
            href: "/produtos/denuncia-proativa",
          },
        ],
      },
    ],
  },
];

/** Todos os itens de todos os eixos, achatados. Útil para testes e buscas. */
export function allNavItems(): NavItem[] {
  return NAV_AXES.flatMap((axis) => axis.columns.flatMap((column) => column.items));
}
