-- ============================================================================
-- Tabela de pedidos de orçamento do site institucional
-- ----------------------------------------------------------------------------
-- Contexto: este projeto Supabase é COMPARTILHADO com o sistema PsicoHub em
-- produção. Esta migration é puramente ADITIVA: cria uma tabela nova e isolada
-- e não altera, não remove e não referencia nenhuma tabela existente.
--
-- As dúvidas curtas continuam em public.contact_messages, que já atende
-- (nome, e-mail, mensagem). Só o orçamento precisava de estrutura nova, por
-- causa dos campos de qualificação comercial.
--
-- Segurança: a tabela tem RLS habilitada e NENHUMA policy. Isso é intencional
-- e não é esquecimento — com RLS ligada e sem policy, nem visitantes anônimos
-- nem usuários autenticados conseguem ler ou escrever diretamente. Todo acesso
-- passa pelas funções de servidor da aplicação, que usam a chave de serviço e
-- verificam a autenticação antes de devolver qualquer dado. Lead comercial
-- contém dado pessoal e não deve ficar exposto ao cliente do navegador.
-- ============================================================================

create table if not exists public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  -- Contato
  full_name text not null,
  email text not null,
  whatsapp text not null,

  -- Qualificação comercial: as duas informações sem as quais o comercial não
  -- consegue precificar.
  lives_range text not null,
  sector text not null,

  -- Contexto
  message text,
  product_id text,
  source_path text,

  -- Acompanhamento pela equipe. Sem filtros na fase 1, mas a coluna já existe
  -- para o painel evoluir sem nova migration.
  status text not null default 'new'
);

comment on table public.quote_requests is
  'Pedidos de orçamento vindos do site institucional sstudo.com.br.';
comment on column public.quote_requests.lives_range is
  'Faixa de vidas gerenciadas: 1-10, 11-50, 51-200, 201-500, 500+.';
comment on column public.quote_requests.sector is
  'Área de atuação de quem pediu: empresa, assessoria-sst, clinica-ocupacional, tecnico-seguranca, sesmt, psicologo, outro.';
comment on column public.quote_requests.product_id is
  'Produto de interesse, quando o pedido veio de uma página de produto.';

-- Índice para a listagem do painel, que ordena do mais recente para o mais
-- antigo.
create index if not exists quote_requests_created_at_idx
  on public.quote_requests (created_at desc);

alter table public.quote_requests enable row level security;
