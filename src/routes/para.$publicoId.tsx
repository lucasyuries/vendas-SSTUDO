// ============================================================================
// Página por público — um componente, quatro páginas
// ----------------------------------------------------------------------------
// Mesmo padrão das páginas de produto: uma rota parametrizada alimentada por um
// módulo de dados. A diferença é o eixo — a página de produto responde "o que
// esta ferramenta faz", esta responde "o que muda para mim".
//
// A ordem das seções é deliberada: contexto do público, obrigações que recaem
// sobre ele, dores que ele reconhece, e só então os produtos. Falar de produto
// antes de a pessoa se reconhecer é o erro mais comum em página de segmento.
// ============================================================================

import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { AlertTriangle, Check, ChevronRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { FadeInView } from "@/components/FadeInView";
import { FaqList } from "@/components/FaqList";
import { QuoteForm } from "@/components/QuoteForm";
import { SectionLabel } from "@/components/SectionLabel";
import { AUDIENCES, audienceProducts, getAudience } from "@/lib/audiences";
import { OG_IMAGE, absoluteUrl } from "@/lib/seo";

export const Route = createFileRoute("/para/$publicoId")({
  // Só o identificador é devolvido: o objeto do público carrega ícones, que são
  // funções React e não sobrevivem à serialização do loader.
  loader: ({ params }) => {
    if (!getAudience(params.publicoId)) throw notFound();
    return { publicoId: params.publicoId };
  },
  head: ({ params }) => {
    const publico = getAudience(params.publicoId);
    if (!publico) return {};
    // Sem forçar minúsculas: o nome carrega siglas — SST, SESMT — que viram
    // "sst" e "sesmt" e passam impressão de descuido no resultado de busca.
    const titulo = `${publico.name} — ${publico.tagline} | SSTudo`;
    const descricao = `${publico.headline}. ${publico.tagline}. Peça um orçamento sob medida.`;
    return {
      meta: [
        { title: titulo },
        { name: "description", content: descricao },
        { name: "robots", content: "index, follow" },
        { property: "og:type", content: "website" },
        { property: "og:locale", content: "pt_BR" },
        { property: "og:title", content: titulo },
        { property: "og:description", content: descricao },
        { property: "og:url", content: absoluteUrl(publico.path) },
        { property: "og:image", content: OG_IMAGE },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: OG_IMAGE },
      ],
      links: [{ rel: "canonical", href: absoluteUrl(publico.path) }],
    };
  },
  component: PaginaPorPublico,
  notFoundComponent: PublicoNaoEncontrado,
});

function PaginaPorPublico() {
  const { publicoId } = Route.useLoaderData();
  const publico = getAudience(publicoId)!;
  const Icon = publico.icon;
  const produtos = audienceProducts(publico);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <section id="top" className="bg-brand-deep">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-16">
            <nav aria-label="Você está aqui" className="mb-6">
              <ol className="flex flex-wrap items-center gap-1 text-xs text-on-deep-soft">
                <li>
                  <Link to="/" className="inline-flex min-h-11 items-center hover:text-on-deep">
                    Início
                  </Link>
                </li>
                <ChevronRight className="h-3 w-3" aria-hidden />
                <li aria-current="page" className="text-on-deep">
                  {publico.name}
                </li>
              </ol>
            </nav>

            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-on-deep/10">
              <Icon className="h-6 w-6 text-brand-highlight" />
            </span>
            <h1 className="mt-5 max-w-3xl font-display text-display text-on-deep">
              {publico.headline}
            </h1>
            <p className="mt-4 max-w-2xl text-lead text-on-deep-soft">{publico.tagline}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#orcamento"
                className="inline-flex min-h-12 items-center justify-center rounded-lg bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Solicitar orçamento
              </a>
            </div>

            <p className="mt-8 text-xs text-on-deep-soft">
              Também atende: {publico.alsoFor.join(" · ")}
            </p>
          </div>
        </section>

        {/* Contexto: o visitante precisa se reconhecer antes de ouvir oferta */}
        <section className="bg-background py-16 lg:py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <div className="space-y-5">
              {publico.context.map((paragrafo) => (
                <p
                  key={paragrafo.slice(0, 24)}
                  className="text-lead leading-relaxed text-foreground-soft"
                >
                  {paragrafo}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* O que a lei cobra deste público */}
        <section className="bg-surface-subtle py-16 lg:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <FadeInView className="mx-auto max-w-2xl text-center">
              <SectionLabel>Obrigações</SectionLabel>
              <h2 className="mt-3 font-display text-section font-bold tracking-tight text-foreground">
                O que recai sobre você
              </h2>
            </FadeInView>

            <ul className="mt-10 grid gap-4 md:grid-cols-2">
              {publico.obligations.map((obrigacao) => (
                <li
                  key={obrigacao.title}
                  className="flex items-start gap-3 rounded-xl border border-border bg-card p-5"
                >
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-display text-base font-semibold text-foreground">
                      {obrigacao.title}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-foreground-soft">
                      {obrigacao.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Dores reconhecíveis */}
        <section className="bg-background py-16 lg:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <FadeInView className="mx-auto max-w-2xl text-center">
              <SectionLabel>O problema</SectionLabel>
              <h2 className="mt-3 font-display text-section font-bold tracking-tight text-foreground">
                Se alguma destas soa familiar
              </h2>
            </FadeInView>

            <ul className="mt-10 grid gap-3 sm:grid-cols-2">
              {publico.pains.map((dor) => (
                <li
                  key={dor}
                  className="flex items-start gap-3 rounded-xl border border-border bg-surface-subtle p-4"
                >
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                  <span className="text-sm leading-relaxed text-foreground-soft">{dor}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Produtos, na ordem que importa para este público */}
        <section className="bg-surface-subtle py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <FadeInView className="mx-auto max-w-2xl text-center">
              <SectionLabel>Ferramentas</SectionLabel>
              <h2 className="mt-3 font-display text-section font-bold tracking-tight text-foreground">
                Por onde começar
              </h2>
              <p className="mt-3 text-lead text-foreground-soft">
                Na ordem que costuma fazer sentido para o seu caso. Você leva só o que precisa.
              </p>
            </FadeInView>

            <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {produtos.map((produto) => {
                const ProdutoIcon = produto.icon;
                return (
                  <li key={produto.id}>
                    <Link
                      to="/produtos/$produtoId"
                      params={{ produtoId: produto.id }}
                      className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-border-strong hover:shadow-[var(--shadow-elevated)]"
                    >
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface-tint transition-transform duration-300 group-hover:scale-110">
                        <ProdutoIcon className={`h-5 w-5 ${produto.accentClass}`} />
                      </span>
                      <h3 className="mt-4 font-display text-card font-semibold text-foreground">
                        {produto.name}
                      </h3>
                      <p className="mt-1 flex-1 text-sm leading-relaxed text-foreground-soft">
                        {produto.tagline}
                      </p>
                      <span className="mt-4 text-sm font-semibold text-primary">Ver detalhes</span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        <section className="bg-background py-16 lg:py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <FadeInView className="text-center">
              <h2 className="font-display text-section font-bold tracking-tight text-foreground">
                Perguntas frequentes
              </h2>
            </FadeInView>
            <div className="mt-8">
              <FaqList entries={publico.faq} />
            </div>
          </div>
        </section>

        <section id="orcamento" className="bg-surface-subtle py-16 lg:py-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <FadeInView className="text-center">
              <h2 className="font-display text-section font-bold tracking-tight text-foreground">
                Peça um orçamento
              </h2>
              <p className="mt-4 text-lead text-foreground-soft">
                Conte quantas vidas você gerencia e sua área de atuação. Retornamos em até 1 dia
                útil.
              </p>
            </FadeInView>
            <div className="mt-10 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] sm:p-8">
              <QuoteForm sourcePath={publico.path} />
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}

function PublicoNaoEncontrado() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <h1 className="font-display text-section font-bold text-foreground">
          Página não encontrada
        </h1>
        <p className="mt-4 text-lead text-foreground-soft">
          O endereço que você acessou não corresponde a nenhum dos públicos atendidos.
        </p>
        <ul className="mt-10 grid gap-3 sm:grid-cols-2">
          {AUDIENCES.map((publico) => (
            <li key={publico.id}>
              <Link
                to="/para/$publicoId"
                params={{ publicoId: publico.id }}
                className="flex min-h-12 items-center justify-center rounded-lg border border-border bg-card px-4 text-sm font-medium text-foreground"
              >
                {publico.name}
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </div>
  );
}
