// ============================================================================
// DADOS INSTITUCIONAIS DA SSTUDO
// ----------------------------------------------------------------------------
// Fonte: o planejamento estratégico da empresa (mapa mental fornecido pelo
// cliente). Nada aqui é inventado.
//
// Duas ausências são deliberadas:
//
// 1. Os objetivos estratégicos de 2026-2030 (número de empresas atendidas,
//    ASOs emitidos) NÃO entram. São metas futuras, e numa página institucional
//    correriam o risco de ser lidos como resultado já alcançado.
//
// 2. Dois valores do planejamento — simplicidade e transparência — aparecem
//    lá apenas como palavra, sem a consequência prática descrita. Ficaram de
//    fora em vez de receberem um texto inventado só para completar a grade.
// ============================================================================

import {
  ShieldCheck,
  Unlock,
  Scale,
  Lightbulb,
  Handshake,
  Leaf,
  Award,
  type LucideIcon,
} from "lucide-react";

export const MISSION =
  "Democratizar o acesso à conformidade em Segurança e Saúde do Trabalho por meio de tecnologia acessível e integrada.";

export const VISION =
  "Ser referência em tecnologia aplicada à área de SST na região norte do Brasil.";

export interface CompanyValue {
  name: string;
  icon: LucideIcon;
  /** O que a empresa acredita. */
  principle: string;
  /** O que isso significa, na prática, para o cliente. */
  inPractice: string;
}

export const VALUES: CompanyValue[] = [
  {
    name: "Segurança",
    icon: ShieldCheck,
    principle: "A proteção do trabalhador é inegociável.",
    inPractice:
      "Nunca comprometemos a qualidade em prol do lucro, e atualizamos as plataformas sempre que a legislação muda — sua empresa não fica desatualizada sem saber.",
  },
  {
    name: "Acessibilidade",
    icon: Unlock,
    principle: "Tecnologia deve ser simples de usar, mesmo para quem não é especialista.",
    inPractice:
      "Linguagem clara, sem jargão desnecessário, preços escalonados por porte de empresa e suporte humano de verdade — não apenas atendimento automatizado.",
  },
  {
    name: "Integridade",
    icon: Scale,
    principle: "Não vendemos atalhos nem soluções que burlam a lei.",
    inPractice:
      "Explicamos suas obrigações reais, mesmo quando a resposta honesta é que você precisa de menos do que imaginava. Só firmamos parceria com profissionais e clínicas regulamentados.",
  },
  {
    name: "Inovação",
    icon: Lightbulb,
    principle: "Desenvolvemos funcionalidades que resolvem problemas reais.",
    inPractice:
      "Medimos sucesso pelo impacto na redução de riscos e multas, não pelo número de telas. O que não resolve um problema concreto não entra.",
  },
  {
    name: "Parceria",
    icon: Handshake,
    principle: "Não somos apenas fornecedores, somos parceiros de conformidade.",
    inPractice:
      "Acompanhamos sua empresa em toda a jornada, e oferecemos orientação quando necessário — inclusive além do que o software faz.",
  },
  {
    name: "Responsabilidade",
    icon: Leaf,
    principle: "Contribuímos para ambientes de trabalho mais dignos e saudáveis.",
    inPractice:
      "Incentivamos práticas sustentáveis nas empresas clientes e apoiamos iniciativas de educação em SST para comunidades carentes.",
  },
  {
    name: "Excelência",
    icon: Award,
    principle: "Plataforma estável, segura e de alta disponibilidade.",
    inPractice:
      "Respostas rápidas a incidentes e dúvidas, processos internos documentados e melhoria contínua em todas as áreas.",
  },
];

// A seção de time foi removida do site a pedido do cliente. Os dados dos
// integrantes saíram junto, em vez de ficarem aqui como código morto: o
// planejamento da empresa continua sendo a fonte, caso a seção volte.

export interface PartnerCategory {
  title: string;
  description: string;
}

export const PARTNER_CATEGORIES: PartnerCategory[] = [
  {
    title: "Clínicas de saúde ocupacional",
    description:
      "Emissão de ASO e PCMSO, exames complementares e agendamento integrado à plataforma.",
  },
  {
    title: "Assessorias e consultorias em SST",
    description:
      "Profissionais que usam as ferramentas da SSTudo para atender a carteiras de múltiplos clientes.",
  },
  {
    title: "Proativa",
    description:
      "Assessoria especializada em SST, parceira na operação do canal de denúncias e em consultoria de implantação.",
  },
];
