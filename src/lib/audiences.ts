// ============================================================================
// PÚBLICOS — as páginas do eixo "Soluções"
// ----------------------------------------------------------------------------
// Quatro páginas, definidas com o cliente: empresa, assessoria, clínica e
// SESMT. São os públicos com comportamento de compra distinto e com busca
// própria no Google ("sistema para assessoria em SST", "software para clínica
// de medicina ocupacional").
//
// Psicólogo ficou de fora por decisão do cliente: quem aplica análise
// psicossocial chega pela página do PsicoHub ou pela de assessorias, e uma
// página só para ele repetiria os mesmos argumentos.
//
// A lógica de cada página segue a mesma da página de produto: primeiro o que
// muda para aquele público, depois o que a lei cobra DELE especificamente, e
// só então quais ferramentas resolvem.
//
// Nada aqui afirma capacidade que os produtos não tenham. O texto fala de
// obrigação legal e de organização do trabalho, que são verificáveis, e não de
// funcionalidade não confirmada.
// ============================================================================

import { Building2, Briefcase, Stethoscope, HardHat, type LucideIcon } from "lucide-react";
import { PRODUCTS, type ProductId } from "./products";

export type AudienceId = "empresas" | "assessorias" | "clinicas" | "sesmt";

export interface Audience {
  id: AudienceId;
  /** Como o público se chama a si mesmo, não como o mercado o classifica. */
  name: string;
  /** Título da página. */
  headline: string;
  tagline: string;
  /**
   * Versão curta para o menu. A tagline é boa como subtítulo de página, mas
   * longa demais no painel do mega menu, onde empurra os itens para baixo e
   * deixa a coluna desalinhada.
   */
  navSummary: string;
  /** Agrupamento no menu: separa quem contrata de quem presta serviço. */
  navGroup: "contrata" | "presta";
  icon: LucideIcon;
  path: string;
  /** Também atende quem se identifica assim. */
  alsoFor: string[];
  /** O que muda para este público, em dois parágrafos. */
  context: string[];
  /** O que a lei cobra dele. */
  obligations: { title: string; detail: string }[];
  /** As dores próprias deste público. */
  pains: string[];
  /** Produtos que resolvem, em ordem de relevância para ele. */
  products: ProductId[];
  faq: { question: string; answer: string }[];
}

export const AUDIENCES: Audience[] = [
  {
    id: "empresas",
    name: "Empresas e empreendedores",
    headline: "Sua empresa tem obrigações de SST mesmo sem ter ninguém de SST",
    tagline: "O mínimo que a lei exige, sem estrutura interna cara",
    navSummary: "Sem equipe de SST própria",
    navGroup: "contrata",
    icon: Building2,
    path: "/para/empresas",
    alsoFor: ["Departamento pessoal", "RH", "Contadores que assessoram clientes"],
    context: [
      "A obrigação de gerenciar riscos ocupacionais não depende do tamanho da empresa. Ela nasce no primeiro empregado registrado, e vale igual para a construtora de trezentas pessoas e para o escritório de oito.",
      "O que muda é a extensão do que precisa ser documentado — e é justamente aí que a maioria erra para os dois lados: deixa de fazer o que devia, ou contrata consultoria completa quando bastaria uma declaração.",
    ],
    obligations: [
      {
        title: "Gerenciar riscos ocupacionais",
        detail:
          "Com PGR completo ou, quando cabível pelo grau de risco e pelo porte, com declaração de inexistência de riscos.",
      },
      {
        title: "Manter o controle médico ocupacional",
        detail:
          "PCMSO com os exames definidos por função, e ASO válido para cada pessoa que trabalha na empresa.",
      },
      {
        title: "Gerenciar riscos psicossociais",
        detail:
          "Desde a atualização da NR-01, eles entram no mesmo processo dos demais riscos, com avaliação e plano de ação.",
      },
      {
        title: "Receber e apurar denúncias",
        detail:
          "A legislação de prevenção ao assédio determina que empresas com CIPA adotem canais de recebimento e apuração.",
      },
    ],
    pains: [
      "Descobrir a exigência no dia da fiscalização",
      "Pagar consultoria recorrente por documento que muda pouco",
      "Não ter onde guardar evidência quando chega a reclamação trabalhista",
      "Depender de quatro fornecedores diferentes para obrigações da mesma empresa",
    ],
    products: ["diagnostico-pgr", "aso-digital", "psicohub", "denuncia-proativa"],
    faq: [
      {
        question: "Minha empresa é pequena. Preciso mesmo de tudo isso?",
        answer:
          "Precisa gerenciar riscos, sim — isso vale a partir do primeiro empregado. O que varia é a forma de documentar: dependendo do grau de risco e do porte, pode caber a declaração de inexistência de riscos em vez do programa completo. O Diagnóstico PGR responde isso de graça, a partir do CNPJ.",
      },
      {
        question: "Não tenho ninguém de segurança do trabalho na equipe. Consigo usar?",
        answer:
          "Sim. As ferramentas foram feitas para quem não é especialista, e há assessorias parceiras para as partes que exigem profissional habilitado, como a assinatura técnica de documentos.",
      },
      {
        question: "Preciso contratar os quatro produtos?",
        answer:
          "Não. Cada um resolve uma obrigação diferente, e o orçamento é montado com os que fazem sentido para o seu caso.",
      },
    ],
  },
  {
    id: "assessorias",
    name: "Assessorias e consultorias em SST",
    headline: "Sua carteira cresce e a planilha não acompanha",
    tagline: "Gerencie muitos clientes sem multiplicar o trabalho por cliente",
    navSummary: "Carteira de vários clientes",
    navGroup: "presta",
    icon: Briefcase,
    path: "/para/assessorias",
    alsoFor: ["Consultorias de SST", "Engenheiros de segurança", "Escritórios de assessoria"],
    context: [
      "Quem presta serviço em SST não tem um problema de conhecimento técnico: tem um problema de escala. Cada cliente novo significa mais prazos para acompanhar, mais documentos para versionar e mais gente perguntando o que já foi feito.",
      "O gargalo raramente é a análise em si. É o trabalho administrativo em volta dela — e é ele que limita quantos clientes cabem na operação sem contratar mais gente.",
    ],
    obligations: [
      {
        title: "Responder pelo que assina",
        detail:
          "O documento técnico leva o nome do profissional. Evidência organizada é proteção dele, não só do cliente.",
      },
      {
        title: "Acompanhar prazos de várias empresas ao mesmo tempo",
        detail: "Vencimento de exame e revisão de programa não esperam a agenda da consultoria.",
      },
      {
        title: "Aplicar metodologia defensável",
        detail:
          "Avaliação de risco psicossocial precisa de instrumento e registro que se sustentem em auditoria.",
      },
    ],
    pains: [
      "Controlar dezenas de empresas em planilhas separadas",
      "Refazer o mesmo relatório para cada cliente",
      "Descobrir vencimento depois que passou, e ouvir do cliente",
      "Perder proposta por não conseguir atender mais um cliente",
    ],
    products: ["psicohub", "aso-digital", "diagnostico-pgr", "denuncia-proativa"],
    faq: [
      {
        question: "Consigo administrar vários clientes na mesma conta?",
        answer:
          "Sim. Tanto o PsicoHub quanto o ASO Digital são multi-empresa, com controle de acesso por perfil — a conta da consultoria administra a carteira inteira.",
      },
      {
        question: "A análise psicossocial pode virar um serviço novo que eu vendo?",
        answer:
          "Pode. A exigência da NR-01 abriu uma frente de trabalho que antes não existia na maioria das carteiras, e a ferramenta reduz o custo de aplicar a pesquisa e produzir o relatório técnico.",
      },
      {
        question: "Meus clientes precisam acessar o sistema?",
        answer:
          "Só se você quiser. O controle de acesso por perfil permite liberar visualização para o cliente ou manter tudo dentro da consultoria.",
      },
    ],
  },
  {
    id: "clinicas",
    name: "Clínicas de medicina ocupacional",
    headline: "Exame realizado, ASO emitido, prazo controlado",
    tagline: "A operação da clínica sem papel solto e sem retrabalho",
    navSummary: "ASO, exames e PCMSO",
    navGroup: "presta",
    icon: Stethoscope,
    path: "/para/clinicas",
    alsoFor: ["Laboratórios", "Centros de saúde ocupacional", "Médicos do trabalho"],
    context: [
      "A clínica ocupacional vive de volume e de prazo. Cada empresa cliente chega com uma lista de funcionários, cada função exige um conjunto próprio de exames, e o resultado precisa virar documento válido no mesmo dia.",
      "Quando o vínculo entre risco, função e exame mora na cabeça de alguém — ou numa planilha —, o erro aparece na hora errada: no exame que faltou, no ASO emitido para a função errada, ou no cliente que cobra o que já pagou.",
    ],
    obligations: [
      {
        title: "Emitir o ASO com validade e função corretas",
        detail: "O documento precisa refletir os riscos daquele cargo específico.",
      },
      {
        title: "Manter o histórico por trabalhador",
        detail: "O registro é consultado em perícia e em ação trabalhista, às vezes anos depois.",
      },
      {
        title: "Sustentar o PCMSO de cada empresa atendida",
        detail: "O programa precisa acompanhar mudanças de função, de setor e de exposição.",
      },
    ],
    pains: [
      "Sala de espera parada porque falta informação do exame",
      "Refazer o ASO por erro de função ou de risco",
      "Não saber quais periódicos vencem no mês que vem",
      "Perder tempo do faturamento reconstruindo o que foi feito",
    ],
    products: ["aso-digital", "psicohub", "diagnostico-pgr", "denuncia-proativa"],
    faq: [
      {
        question: "Dá para atender várias empresas clientes na mesma conta?",
        answer:
          "Sim. O ASO Digital foi desenhado para operação multi-empresa, com cadastro de funcionários, setores e cargos por cliente.",
      },
      {
        question: "Os exames são puxados dos riscos do cargo?",
        answer:
          "Sim. Os agentes de risco são cadastrados por cargo, e é dessa associação que saem os procedimentos de cada funcionário.",
      },
      {
        question: "Consigo saber o que está por vencer?",
        answer:
          "Os documentos têm controle de vigência, com alerta de vencimento e previsão de ASO no painel.",
      },
    ],
  },
  {
    id: "sesmt",
    name: "SESMT e técnicos de segurança",
    headline: "Você sabe o que fazer. O trabalho é provar que foi feito",
    tagline: "Evidência organizada para a auditoria que vem depois",
    navSummary: "SST feita por dentro",
    navGroup: "contrata",
    icon: HardHat,
    path: "/para/sesmt",
    alsoFor: [
      "Técnicos em segurança do trabalho",
      "Engenheiros de segurança",
      "Coordenadores de SST",
      "CIPA",
    ],
    context: [
      "Quem faz SST por dentro da empresa raramente tem dúvida técnica sobre a norma. O problema é outro: o conhecimento está na cabeça do profissional e a evidência está espalhada entre pastas, e-mails, planilhas do RH e papel assinado guardado em armário.",
      "Isso cobra o preço no pior momento. Na auditoria, na fiscalização ou na perícia, não basta ter feito: é preciso mostrar quando foi feito, quem respondeu, qual medida foi tomada e o que aconteceu depois dela.",
    ],
    obligations: [
      {
        title: "Manter o inventário de riscos vivo",
        detail:
          "Não é documento de gaveta: precisa acompanhar mudança de processo, de função e de exposição.",
      },
      {
        title: "Demonstrar o plano de ação e seu andamento",
        detail:
          "Cada risco identificado exige medida, responsável, prazo — e registro do que foi concluído.",
      },
      {
        title: "Incluir os riscos psicossociais no mesmo processo",
        detail:
          "A NR-01 trouxe o tema para dentro do GRO, e a avaliação precisa de instrumento e evidência como qualquer outro risco.",
      },
      {
        title: "Manter o controle médico coerente com os riscos",
        detail: "O PCMSO nasce do inventário; exame que não conversa com o risco não se sustenta.",
      },
    ],
    pains: [
      "Reconstruir evidência na véspera da auditoria",
      "Depender do RH para saber quem fez qual exame",
      "Aplicar pesquisa psicossocial sem instrumento que se sustente tecnicamente",
      "Perder o histórico quando alguém da equipe sai",
    ],
    products: ["psicohub", "diagnostico-pgr", "aso-digital", "denuncia-proativa"],
    faq: [
      {
        question: "Já temos consultoria externa. Isso substitui?",
        answer:
          "Não substitui o profissional habilitado, e não é essa a proposta. As ferramentas organizam a evidência e o acompanhamento, que é justamente a parte que costuma ficar com a equipe interna entre uma visita e outra da consultoria.",
      },
      {
        question: "Como aplico a avaliação psicossocial sem expor quem responde?",
        answer:
          "A pesquisa do PsicoHub é anônima por construção: as respostas não são vinculadas à identidade de quem respondeu. Sem isso, o resultado não é confiável e não serve como evidência.",
      },
      {
        question: "Conseguimos usar só um produto?",
        answer:
          "Sim. Cada um resolve uma frente, e o orçamento é montado com o que faz sentido para a sua operação.",
      },
    ],
  },
];

export function getAudience(id: string | undefined): Audience | null {
  if (!id) return null;
  return AUDIENCES.find((a) => a.id === id) ?? null;
}

/** Produtos de um público, na ordem definida para ele. */
export function audienceProducts(audience: Audience) {
  return audience.products
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter((p): p is (typeof PRODUCTS)[number] => Boolean(p));
}
