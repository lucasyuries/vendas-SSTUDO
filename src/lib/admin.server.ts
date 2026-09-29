// ============================================================================
// PAINEL ADMINISTRATIVO — leitura dos leads
// ----------------------------------------------------------------------------
// SEGURANÇA: a tabela de orçamentos tem RLS habilitada e nenhuma policy, então
// ninguém a alcança pelo navegador. A leitura acontece aqui, com a chave de
// serviço — que IGNORA o RLS. Isso significa que a permissão precisa ser
// verificada explicitamente neste arquivo: sem essa checagem, qualquer pessoa
// autenticada conseguiria chamar a função e baixar todos os leads.
//
// E isso não é hipotético. Este projeto Supabase é compartilhado com o sistema
// PsicoHub, e a maior parte das contas com papel `admin` pertence a clientes
// dele — pessoas de fora da SSTudo. Checar apenas "está autenticado", ou
// aceitar `admin`, entregaria a carteira comercial a todas elas.
//
// A verificação da interface (a página redireciona quem não pode) é
// conveniência. A fronteira de segurança é esta.
// ============================================================================

import { createServerFn } from "@tanstack/react-start";
import { attachSupabaseAuth } from "@/integrations/supabase/auth-attacher";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/admin.server";

/** Papel exigido para abrir o painel, conforme decidido com o cliente. */
const PAPEL_EXIGIDO = "super_admin";

export interface QuoteLead {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  whatsapp: string;
  lives_range: string;
  sector: string;
  message: string | null;
  product_id: string | null;
  source_path: string | null;
  status: string;
}

export interface QuestionLead {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  phone: string | null;
  message: string;
  status: string;
}

export interface LeadsPayload {
  quotes: QuoteLead[];
  questions: QuestionLead[];
}

/**
 * Confirma que o usuário do token tem o papel exigido.
 * Lança 403 quando não tem — nunca devolve dado parcial.
 */
async function exigirPermissao(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", PAPEL_EXIGIDO)
    .limit(1);

  if (error) {
    console.error("[admin] erro ao verificar papel:", error);
    throw new Response("Não foi possível verificar sua permissão.", { status: 500 });
  }

  if (!data || data.length === 0) {
    throw new Response("Acesso restrito à equipe SSTudo.", { status: 403 });
  }
}

export const listLeads = createServerFn({ method: "GET" })
  .middleware([attachSupabaseAuth, requireSupabaseAuth])
  .handler(async ({ context }): Promise<LeadsPayload> => {
    await exigirPermissao(context.userId);

    const [orcamentos, duvidas] = await Promise.all([
      supabaseAdmin
        .from("quote_requests")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500),
      supabaseAdmin
        .from("contact_messages")
        .select("id, created_at, full_name, email, phone, message, status")
        .order("created_at", { ascending: false })
        .limit(500),
    ]);

    if (orcamentos.error) {
      console.error("[admin] erro ao listar orçamentos:", orcamentos.error);
      throw new Response("Não foi possível carregar os orçamentos.", { status: 500 });
    }
    if (duvidas.error) {
      console.error("[admin] erro ao listar dúvidas:", duvidas.error);
      throw new Response("Não foi possível carregar as dúvidas.", { status: 500 });
    }

    return {
      quotes: (orcamentos.data ?? []) as QuoteLead[],
      questions: (duvidas.data ?? []) as QuestionLead[],
    };
  });
