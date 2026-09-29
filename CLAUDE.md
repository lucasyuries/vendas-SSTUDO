# vendas-SSTUDO

Site da SSTudo — empresa de tecnologia aplicada a Saúde e Segurança do Trabalho
(SST). Stack: React 19, TypeScript, TanStack Start/Router, Vite 7, Tailwind 4,
shadcn/ui (Radix), Supabase.

## Publicação

O site é publicado pelo **Lovable**, com domínio registrado na **Hostinger**.

O repositório tem `wrangler.jsonc`, `@cloudflare/vite-plugin` e um
`vite.config.ts` que usa `@lovable.dev/vite-tanstack-config` — o pacote do
Lovable que já embute o plugin do Cloudflare no build. Isso descreve o
**runtime**: a aplicação de fato roda como Cloudflare Worker. Mas a
infraestrutura é do Lovable, e não uma conta Cloudflare da SSTudo.

Não presuma acesso ao painel do Cloudflare nem a `wrangler deploy`. Em especial,
instruções do tipo "cadastre o segredo nos secrets do Cloudflare" não se aplicam:
as variáveis secretas são configuradas onde o Lovable as expõe.

## Comandos

| Ação                        | Comando                                         |
| --------------------------- | ----------------------------------------------- |
| Instalar dependências       | `npm install`                                   |
| Servidor de desenvolvimento | `npm run dev` (sobe em `http://localhost:8080`) |
| Build de produção           | `npm run build`                                 |
| Lint                        | `npm run lint`                                  |
| Formatação                  | `npm run format`                                |

O projeto foi criado com Bun (existe um `bun.lockb`), mas também há
`package-lock.json` e o fluxo com npm funciona.

## Variáveis de ambiente

- `.env` (versionado) guarda apenas valores **públicos**: URL do Supabase,
  `PROJECT_ID` e a chave `publishable`/anon, que vai para o navegador de qualquer
  forma e é protegida por RLS.
- `.env.local` e `.dev.vars` são ignorados pelo Git e guardam os **segredos** de
  desenvolvimento. Em produção, eles vêm da configuração de ambiente do Lovable.
  **Nunca mova um segredo para o `.env`**: esse arquivo é versionado, e a chave
  de serviço do Supabase ignora o RLS — comitá-la expõe o banco inteiro,
  incluindo os dados do PsicoHub em produção.
- O arquivo de ambiente é lido **uma vez, na subida do processo**. Trocar um
  valor com o servidor no ar não tem efeito e nada avisa; é preciso reiniciar.
- `.env.example` documenta todas as variáveis e quais são secretas.
- Atenção: `src/integrations/supabase/admin.server.ts` lança exceção já na
  importação quando `SYSTEM_SUPABASE_URL` ou `SYSTEM_SUPABASE_SERVICE_ROLE_KEY`
  faltam. Como esse módulo entra na árvore de rotas pelo webhook, a ausência
  dessas variáveis derruba a aplicação inteira com erro 500, inclusive a landing
  page.

## Idioma

O produto, a interface e a documentação são em **português do Brasil**. Escreva
textos de UI, mensagens de commit, specs e tickets em português.

## Agent skills

### Issue tracker

Tickets e specs vivem como arquivos markdown em `.scratch/<feature>/`. Veja
`docs/agents/issue-tracker.md`.

**A pasta `.scratch/` é local e não entra no Git.** Este repositório é público,
e as anotações registram decisões de segurança, contas administrativas e
achados sobre o banco compartilhado com o PsicoHub. Mantenha-as fora do
controle de versão; para compartilhar com a equipe, use outro canal.

### Domain docs

Repositório de contexto único: um `CONTEXT.md` e um `docs/adr/` na raiz. Veja
`docs/agents/domain.md`.
