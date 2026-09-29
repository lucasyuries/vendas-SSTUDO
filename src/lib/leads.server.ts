// ============================================================================
// CAPTAÇÃO DE LEAD — gravação
// ----------------------------------------------------------------------------
// Casca fina sobre leads.ts. Toda a regra que pode falhar em silêncio mora
// naquele módulo, que é puro e testado; aqui só sobra validar, montar a linha
// e gravar.
//
// Orçamentos vão para public.quote_requests. Dúvidas vão para
// public.contact_messages, que já existia e atende ao formulário curto.
// ============================================================================

import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/admin.server";
import {
  buildQuestionRow,
  buildQuoteRequestRow,
  questionSchema,
  quoteRequestSchema,
} from "./leads";

const FALHA_GENERICA = "Não foi possível enviar agora. Tente novamente em instantes.";

export const submitQuoteRequest = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => quoteRequestSchema.parse(input))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin.from("quote_requests").insert(buildQuoteRequestRow(data));

    if (error) {
      // O motivo real fica no log do servidor; o visitante recebe uma
      // mensagem que não expõe detalhe de infraestrutura.
      console.error("[orcamento] erro ao gravar:", error);
      throw new Error(FALHA_GENERICA);
    }

    return { ok: true as const };
  });

export const submitQuestion = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => questionSchema.parse(input))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin.from("contact_messages").insert(buildQuestionRow(data));

    if (error) {
      console.error("[duvida] erro ao gravar:", error);
      throw new Error(FALHA_GENERICA);
    }

    return { ok: true as const };
  });
