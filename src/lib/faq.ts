// ============================================================================
// PERGUNTAS FREQUENTES DA PÁGINA INICIAL
// ----------------------------------------------------------------------------
// Fonte única, consumida em dois lugares: a seção visível e os dados
// estruturados que vão para o Google.
//
// Estavam duplicados antes, e divergiram: os dados estruturados ainda
// prometiam orientar sobre "o melhor plano" depois de o site ter deixado de
// vender por assinatura. Com uma fonte só, a divergência deixa de ser possível.
// ============================================================================

import type { FaqEntry } from "@/components/FaqList";

export const HOME_FAQ: FaqEntry[] = [
  {
    question: "O que é a SSTudo?",
    answer:
      "A SSTudo é uma empresa de tecnologia com quatro produtos voltados para conformidade em Segurança e Saúde no Trabalho: Diagnóstico PGR, Denúncia Proativa, ASO Digital e PsicoHub.",
  },
  {
    question: "Preciso contratar os 4 produtos juntos?",
    answer:
      "Não. Cada produto funciona de forma independente e pode ser contratado separadamente, de acordo com a necessidade da sua empresa.",
  },
  {
    question: "A SSTudo atende empresas de qualquer porte?",
    answer:
      "Sim. Atendemos desde pequenas empresas até consultorias que gerenciam múltiplos clientes simultaneamente.",
  },
  {
    question: "Como faço para contratar algum dos produtos?",
    answer:
      "Peça um orçamento pelo formulário desta página. Cada contrato é montado sob medida, porque o preço em SST depende de quantas vidas a empresa gerencia e do setor de atuação. Retornamos em até 1 dia útil.",
  },
  {
    question: "Por que o site não mostra preços?",
    answer:
      "Porque não existe preço único que sirva para uma empresa de 8 funcionários e para uma consultoria que administra 3 mil vidas. Preferimos entender seu caso e apresentar um valor real a publicar uma tabela que não se aplicaria a você.",
  },
  {
    question: "Quero só tirar uma dúvida, preciso pedir orçamento?",
    answer:
      "Não. Há um formulário curto de dúvidas na seção de contato, com três campos, para quem ainda não está avaliando proposta.",
  },
  {
    question: "A SSTudo oferece suporte técnico?",
    answer: "Sim, oferecemos suporte via WhatsApp, e-mail e chat para todos os clientes.",
  },
];

/** Converte as perguntas no formato de dados estruturados do schema.org. */
export function faqToJsonLd(entries: FaqEntry[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entries.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: { "@type": "Answer", text: entry.answer },
    })),
  };
}
