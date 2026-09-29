// ============================================================================
// CAPTAÇÃO DE LEAD — regras puras
// ----------------------------------------------------------------------------
// Este é o ponto de costura do projeto: aqui mora tudo que pode falhar em
// silêncio — validação, normalização de telefone, associação do produto de
// origem e a montagem da linha que vai para o banco.
//
// O módulo é deliberadamente PURO: não importa o cliente do Supabase nem nada
// de servidor. Isso o torna testável sem simulação e sem variáveis de
// ambiente. A gravação em si vive em leads.server.ts, que é uma casca fina.
// ============================================================================

import { z } from "zod";

// ----------------------------------------------------------------------------
// Opções dos campos de seleção
// ----------------------------------------------------------------------------

export const LIVES_RANGES = [
  { value: "1-10", label: "1 a 10 vidas" },
  { value: "11-50", label: "11 a 50 vidas" },
  { value: "51-200", label: "51 a 200 vidas" },
  { value: "201-500", label: "201 a 500 vidas" },
  { value: "500+", label: "Mais de 500 vidas" },
] as const;

export const SECTORS = [
  { value: "empresa", label: "Empresa ou empreendedor" },
  { value: "assessoria-sst", label: "Assessoria em SST" },
  { value: "clinica-ocupacional", label: "Clínica de medicina ocupacional" },
  { value: "tecnico-seguranca", label: "Técnico em segurança do trabalho" },
  { value: "sesmt", label: "SESMT" },
  { value: "psicologo", label: "Psicólogo" },
  { value: "outro", label: "Outro" },
] as const;

export type LivesRange = (typeof LIVES_RANGES)[number]["value"];
export type Sector = (typeof SECTORS)[number]["value"];

const livesValues = LIVES_RANGES.map((o) => o.value) as [LivesRange, ...LivesRange[]];
const sectorValues = SECTORS.map((o) => o.value) as [Sector, ...Sector[]];

// ----------------------------------------------------------------------------
// Normalização de telefone
// ----------------------------------------------------------------------------

/**
 * Reduz o telefone ao que interessa: só dígitos, com o código do país.
 *
 * O visitante digita "(93) 99100-9999", "93991009999" ou "+55 93 99100-9999".
 * O painel precisa de um número que sirva para montar o link do WhatsApp sem
 * ninguém ter que limpar na mão.
 *
 * Devolve null quando o que sobrou não pode ser um telefone brasileiro.
 */
export function normalizeWhatsapp(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 0) return null;

  // Já veio com o código do país.
  if (digits.startsWith("55") && (digits.length === 12 || digits.length === 13)) {
    return digits;
  }
  // DDD + número, fixo (10) ou celular (11).
  if (digits.length === 10 || digits.length === 11) {
    return `55${digits}`;
  }
  return null;
}

// ----------------------------------------------------------------------------
// Esquemas
// ----------------------------------------------------------------------------

const nameField = z.string().trim().min(2, "Informe seu nome").max(200, "Nome muito longo");

const emailField = z
  .string()
  .trim()
  .toLowerCase()
  .email("E-mail inválido")
  .max(255, "E-mail muito longo");

const whatsappField = z
  .string()
  .trim()
  .min(1, "Informe seu WhatsApp")
  .refine((value) => normalizeWhatsapp(value) !== null, "Informe o DDD e o número");

/**
 * Pedido de orçamento. Seis campos, cinco obrigatórios.
 *
 * CNPJ e nome da empresa foram deliberadamente deixados de fora: o comercial
 * obtém os dois na primeira conversa, e eram os campos que mais faziam
 * desistir no meio do preenchimento.
 */
export const quoteRequestSchema = z.object({
  fullName: nameField,
  email: emailField,
  whatsapp: whatsappField,
  livesRange: z.enum(livesValues, { message: "Selecione a faixa de vidas" }),
  sector: z.enum(sectorValues, { message: "Selecione sua área de atuação" }),
  message: z.string().trim().max(5000, "Mensagem muito longa").optional(),
  /** Preenchido pela página de origem, nunca digitado pelo visitante. */
  productId: z.string().trim().max(60).optional(),
  sourcePath: z.string().trim().max(200).optional(),
});

export type QuoteRequestInput = z.infer<typeof quoteRequestSchema>;

/** Dúvida rápida: quem não está comprando não deve passar pelo formulário longo. */
export const questionSchema = z.object({
  fullName: nameField,
  email: emailField,
  message: z
    .string()
    .trim()
    .min(10, "Conte um pouco mais (mínimo de 10 caracteres)")
    .max(5000, "Mensagem muito longa"),
});

export type QuestionInput = z.infer<typeof questionSchema>;

// ----------------------------------------------------------------------------
// Montagem das linhas gravadas
// ----------------------------------------------------------------------------

export interface QuoteRequestRow {
  full_name: string;
  email: string;
  whatsapp: string;
  lives_range: LivesRange;
  sector: Sector;
  message: string | null;
  product_id: string | null;
  source_path: string | null;
  status: string;
}

export function buildQuoteRequestRow(input: QuoteRequestInput): QuoteRequestRow {
  const whatsapp = normalizeWhatsapp(input.whatsapp);
  if (whatsapp === null) {
    // Inalcançável pelo esquema, que já recusa. Existe para que uma mudança
    // futura no esquema não deixe passar um número inválido em silêncio.
    throw new Error("WhatsApp inválido");
  }

  return {
    full_name: input.fullName,
    email: input.email,
    whatsapp,
    lives_range: input.livesRange,
    sector: input.sector,
    message: input.message?.length ? input.message : null,
    product_id: input.productId?.length ? input.productId : null,
    source_path: input.sourcePath?.length ? input.sourcePath : null,
    status: "new",
  };
}

export interface QuestionRow {
  full_name: string;
  email: string;
  message: string;
  status: string;
}

export function buildQuestionRow(input: QuestionInput): QuestionRow {
  return {
    full_name: input.fullName,
    email: input.email,
    message: input.message,
    status: "new",
  };
}

/** Rótulo legível de uma faixa de vidas, para o painel e a exportação. */
export function livesRangeLabel(value: string): string {
  return LIVES_RANGES.find((o) => o.value === value)?.label ?? value;
}

/** Rótulo legível de uma área de atuação, para o painel e a exportação. */
export function sectorLabel(value: string): string {
  return SECTORS.find((o) => o.value === value)?.label ?? value;
}
