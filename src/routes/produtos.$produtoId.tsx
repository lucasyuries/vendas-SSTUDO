// ============================================================================
// Página de produto — um componente, quatro páginas
// ----------------------------------------------------------------------------
// As quatro páginas de produto são a mesma página, parametrizada pelo
// identificador na URL e alimentada pelo catálogo. Escrever quatro componentes
// separados seria quatro vezes o mesmo trabalho, e garantiria que uma hora eles
// divergissem.
//
// O endereço do sistema do produto NÃO é a chamada principal: ele aparece
// discreto, como "Acessar o sistema". Mandar um interessado direto para uma
// tela de login perde o lead, e o papel desta página é apresentar e captar.
// ============================================================================

import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { Check, ChevronRight, ExternalLink } from "lucide-react";
import { SectionLabel } from "@/components/SectionLabel";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { FadeInView } from "@/components/FadeInView";
import { FaqList } from "@/components/FaqList";
import { QuoteForm } from "@/components/QuoteForm";
import { getProduct, PRODUCTS, type Product } from "@/lib/products";
import { OG_IMAGE, absoluteUrl } from "@/lib/seo";

export const Route = createFileRoute("/produtos/$produtoId")({
  // O loader apenas valida e devolve o identificador. Devolver o objeto do
  // produto quebra a renderização no servidor: o TanStack Start serializa o
  // retorno do loader para enviar ao cliente, e o produto carrega o ícone, que
  // é uma função React e não é serializável.
  //
  // Não há perda: o catálogo é dado estático já presente no pacote do cliente,
  // então buscar por identificador dos dois lados sai de graça.
  loader: ({ params }) => {
    if (!getProduct(params.produtoId)) throw notFound();
    return { produtoId: params.produtoId };
  },
  head: ({ params }) => {
    const product = getProduct(params.produtoId);
    if (!product) return {};
    const titulo = `${product.name} — ${product.tagline} | SSTudo`;
    const descricao = `${product.problem} ${product.name}: ${product.tagline}. Peça um orçamento sem compromisso.`;
    return {
      meta: [
        { title: titulo },
        { name: "description", content: descricao },
        {
          name: "keywords",
          content: [...product.anchorNorms, product.name, "SST", "conformidade"]
            .join(", ")
            .toLowerCase(),
        },
        { name: "robots", content: "index, follow" },
        { property: "og:type", content: "website" },
        { property: "og:locale", content: "pt_BR" },
        { property: "og:title", content: titulo },
        { property: "og:description", content: descricao },
        { property: "og:url", content: absoluteUrl(product.path) },
        { property: "og:image", content: OG_IMAGE },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: OG_IMAGE },
      ],
      links: [{ rel: "canonical", href: absoluteUrl(product.path) }],
    };
  },
  component: PaginaDeProduto,
  notFoundComponent: ProdutoNaoEncontrado,
});

function PaginaDeProduto() {
  const { produtoId } = Route.useLoaderData();
  const product = getProduct(produtoId)!;
  const Icon = product.icon;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero do produto */}
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
                <li>
                  <Link
                    to="/"
                    hash="produtos"
                    className="inline-flex min-h-11 items-center hover:text-on-deep"
                  >
                    Produtos
                  </Link>
                </li>
                <ChevronRight className="h-3 w-3" aria-hidden />
                <li aria-current="page" className="text-on-deep">
                  {product.name}
                </li>
              </ol>
            </nav>

            <div className="grid items-center gap-10 lg:grid-cols-2">
              <div>
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-on-deep/10">
                  <Icon className={`h-6 w-6 ${product.accentClass}`} />
                </span>
                <h1 className="mt-5 font-display text-display font-bold text-on-deep">
                  {product.name}
                </h1>
                <p className="mt-3 text-lead text-on-deep-soft">{product.tagline}</p>

                <ul className="mt-6 flex flex-wrap gap-2">
                  {product.anchorNorms.map((norma) => (
                    <li
                      key={norma}
                      className="rounded-full border border-brand-highlight/40 bg-brand-highlight/15 px-3 py-1 text-xs font-medium text-brand-highlight"
                    >
                      {norma}
                    </li>
                  ))}
                </ul>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <a
                    href="#orcamento"
                    className="inline-flex min-h-12 items-center justify-center rounded-lg bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    Solicitar orçamento
                  </a>
                  {/* Discreto de propósito: não é a chamada principal. */}
                  <a
                    href={product.systemUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-12 items-center justify-center gap-2 text-sm text-on-deep-soft underline underline-offset-4 transition-colors hover:text-on-deep"
                  >
                    Acessar o sistema <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>

              {product.image && (
                <div className="hidden lg:block">
                  <img
                    src={product.image.src}
                    alt={product.image.alt}
                    width={product.image.width}
                    height={product.image.height}
                    decoding="async"
                    className="h-auto w-full rounded-xl border border-on-deep-soft/20 shadow-[var(--shadow-elevated)]"
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Camada educativa: o conceito, antes de qualquer argumento de venda */}
        <section className="bg-background py-16 lg:py-20">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <SectionLabel align="left">Entenda</SectionLabel>
              <h2 className="mt-3 font-display text-section font-bold tracking-tight text-foreground">
                {product.concept.title}
              </h2>
            </div>
            <div className="space-y-4 lg:col-span-3">
              {product.concept.paragraphs.map((paragrafo) => (
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

        {/* Camada legal: o que a norma cobra */}
        <section className="bg-surface-subtle py-16 lg:py-20">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <SectionLabel align="left">A exigência</SectionLabel>
              <h2 className="mt-3 font-display text-section font-bold tracking-tight text-foreground">
                {product.legal.title}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-foreground-soft">
                {product.legal.intro}
              </p>
            </div>
            <ul className="space-y-3 lg:col-span-3">
              {product.legal.requirements.map((exigencia) => (
                <li
                  key={exigencia.slice(0, 24)}
                  className="flex items-start gap-3 rounded-xl border border-border bg-card p-4"
                >
                  <Check className={`mt-0.5 h-5 w-5 shrink-0 ${product.accentClass}`} />
                  <span className="text-sm leading-relaxed text-foreground-soft">{exigencia}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* O problema que sobra depois de conhecer a exigência */}
        <section className="bg-brand-deep py-14 lg:py-16">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <p className="text-lead leading-relaxed text-on-deep">{product.problem}</p>
          </div>
        </section>

        {/* Como funciona */}
        <section className="bg-surface-subtle py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <FadeInView className="mx-auto max-w-3xl text-center">
              <h2 className="font-display text-section font-bold tracking-tight text-foreground">
                Como funciona
              </h2>
            </FadeInView>
            <ol className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {product.steps.map((step, indice) => (
                <li key={step.title} className="rounded-2xl border border-border bg-card p-6">
                  <span className="font-display text-3xl font-bold text-muted-foreground">
                    {String(indice + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 font-display text-card font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground-soft">
                    {step.description}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Funcionalidades: varredura rápida para público técnico */}
        <section className="bg-background py-16 lg:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <FadeInView className="text-center">
              <h2 className="font-display text-section font-bold tracking-tight text-foreground">
                O que está incluído
              </h2>
              <p className="mt-4 text-lead text-foreground-soft">
                Tudo que o {product.name} entrega, sem letra miúda
              </p>
            </FadeInView>
            <ul className="mt-10 flex flex-wrap justify-center gap-2">
              {product.features.map((feature) => (
                <li
                  key={feature}
                  className="rounded-full border border-border bg-surface-subtle px-4 py-2 text-sm text-foreground-soft"
                >
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Para quem é */}
        <section className="bg-surface-subtle py-16 lg:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <FadeInView className="text-center">
              <h2 className="font-display text-section font-bold tracking-tight text-foreground">
                Para quem é o {product.name}
              </h2>
            </FadeInView>
            <ul className="mt-10 grid gap-4 sm:grid-cols-2">
              {product.audiences.map((audience) => (
                <li
                  key={audience}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card px-5 py-4"
                >
                  <span
                    className={`h-2 w-2 shrink-0 rounded-full ${product.accentClass} bg-current`}
                  />
                  <span className="text-sm text-foreground-soft">{audience}</span>
                </li>
              ))}
            </ul>

            {product.disclaimer && (
              <p className="mx-auto mt-8 max-w-2xl rounded-xl border border-dashed border-border-strong bg-background px-5 py-4 text-center text-xs text-muted-foreground">
                {product.disclaimer}
              </p>
            )}
          </div>
        </section>

        {/* FAQ do produto */}
        <section className="bg-background py-16 lg:py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <FadeInView className="text-center">
              <h2 className="font-display text-section font-bold tracking-tight text-foreground">
                Perguntas frequentes
              </h2>
            </FadeInView>
            <div className="mt-8">
              <FaqList entries={product.faq} />
            </div>
          </div>
        </section>

        {/* Orçamento, com o produto já preenchido */}
        <section id="orcamento" className="bg-surface-subtle py-16 lg:py-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <FadeInView className="text-center">
              <h2 className="font-display text-section font-bold tracking-tight text-foreground">
                Peça um orçamento do {product.name}
              </h2>
              <p className="mt-4 text-lead text-foreground-soft">
                Conte quantas vidas você gerencia e sua área de atuação. Retornamos em até 1 dia
                útil.
              </p>
            </FadeInView>
            <div className="mt-10 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] sm:p-8">
              <QuoteForm productId={product.id} sourcePath={product.path} />
            </div>
          </div>
        </section>

        <OutrosProdutos atual={product} />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}

function OutrosProdutos({ atual }: { atual: Product }) {
  const outros = PRODUCTS.filter((p) => p.id !== atual.id);
  return (
    <section className="bg-background py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="text-center font-display text-section font-bold tracking-tight text-foreground">
          Os outros produtos da SSTudo
        </h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {outros.map((produto) => {
            const Icon = produto.icon;
            return (
              <Link
                key={produto.id}
                to="/produtos/$produtoId"
                params={{ produtoId: produto.id }}
                className="rounded-2xl border border-border bg-card p-5 transition-colors hover:border-border-strong"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-tint">
                  <Icon className={`h-5 w-5 ${produto.accentClass}`} />
                </span>
                <h3 className="mt-4 font-display text-card font-semibold text-foreground">
                  {produto.name}
                </h3>
                <p className="mt-1 text-sm text-foreground-soft">{produto.tagline}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ProdutoNaoEncontrado() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <h1 className="font-display text-section font-bold text-foreground">
          Produto não encontrado
        </h1>
        <p className="mt-4 text-lead text-foreground-soft">
          O endereço que você acessou não corresponde a nenhum produto da SSTudo.
        </p>
        <ul className="mt-10 grid gap-3 sm:grid-cols-2">
          {PRODUCTS.map((produto) => (
            <li key={produto.id}>
              <Link
                to="/produtos/$produtoId"
                params={{ produtoId: produto.id }}
                className="flex min-h-12 items-center justify-center rounded-lg border border-border bg-card px-4 text-sm font-medium text-foreground"
              >
                {produto.name}
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </div>
  );
}
