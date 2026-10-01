// ============================================================================
// Supabase ADMIN client (SERVER ONLY) — bypass RLS
// ----------------------------------------------------------------------------
// Usa a SERVICE ROLE KEY. NUNCA importar este arquivo em código de cliente.
// Usado pelas server functions que gravam orçamentos e dúvidas e pelo painel
// de leads.
//
// ----------------------------------------------------------------------------
// Por que a criação do cliente é preguiçosa
// ----------------------------------------------------------------------------
// Antes, a leitura das variáveis e o `throw` aconteciam na IMPORTAÇÃO do
// módulo. Isso transformava a falta de uma credencial de servidor numa falha
// total: qualquer caminho que puxasse este arquivo para o pacote do servidor
// derrubava a aplicação inteira, inclusive a página pública — que não usa a
// chave de serviço para absolutamente nada.
//
// E não é hipótese. No ambiente de publicação as duas variáveis não estão
// definidas, e TODO build vindo do GitHub falhava por causa disto, desde
// agosto. A prévia ficou congelada numa versão antiga sem que a causa
// aparecesse: o erro acontece no carregamento do módulo, longe de qualquer
// funcionalidade que use o banco.
//
// Agora o cliente só é criado no primeiro uso real. A falta de credencial
// passa a quebrar somente quem depende dela — envio de orçamento e painel de
// leads —, com a mensagem registrada no log do servidor. O site continua de pé.
//
// O mesmo padrão já era usado em client.server.ts; este arquivo é que estava
// fora do padrão.
// ============================================================================

import { createClient } from "@supabase/supabase-js";

function criarClienteAdmin() {
  const url = process.env.SYSTEM_SUPABASE_URL;
  const serviceRole = process.env.SYSTEM_SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRole) {
    throw new Error(
      "SYSTEM_SUPABASE_URL e SYSTEM_SUPABASE_SERVICE_ROLE_KEY são obrigatórios no servidor.",
    );
  }

  return createClient(url, serviceRole, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

let cliente: ReturnType<typeof criarClienteAdmin> | undefined;

export const supabaseAdmin = new Proxy({} as ReturnType<typeof criarClienteAdmin>, {
  get(_alvo, propriedade, receptor) {
    if (!cliente) cliente = criarClienteAdmin();
    return Reflect.get(cliente, propriedade, receptor);
  },
});
