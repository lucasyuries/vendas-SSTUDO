// ============================================================================
// Página institucional
// ----------------------------------------------------------------------------
// Responde à terceira pergunta que o visitante faz — "posso confiar?" — depois
// de "quem é você?" e "qual o seu problema?". Num mercado em que o cliente
// entrega a conformidade legal da própria empresa a um fornecedor, essa
// pergunta pesa.
//
// Os valores aparecem em duas camadas: o princípio e a consequência prática.
// Só o princípio vira texto institucional vazio, do tipo que ninguém lê.
// ============================================================================

import { createFileRoute, Link } from "@tanstack/react-router";
import { Compass, Target } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { FadeInView } from "@/components/FadeInView";
import { MISSION, PARTNER_CATEGORIES, VALUES, VISION } from "@/lib/company";
import { OG_IMAGE, absoluteUrl } from "@/lib/seo";
import { SectionLabel } from "@/components/SectionLabel";

const TITULO = "Sobre a SSTudo — quem está por trás das ferramentas";
const DESCRICAO =
  "Missão, visão, valores e time da SSTudo, empresa de tecnologia aplicada a Segurança e Saúde do Trabalho.";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: `${TITULO} | SSTudo` },
      { name: "description", content: DESCRICAO },
      { name: "robots", content: "index, follow" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:title", content: TITULO },
      { property: "og:description", content: DESCRICAO },
      { property: "og:url", content: absoluteUrl("/sobre") },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/sobre") }],
  }),
  component: PaginaSobre,
});

function PaginaSobre() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <section id="top" className="bg-brand-deep">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20">
            <h1 className="mt-4 max-w-3xl font-display text-display font-bold text-on-deep">
              Conformidade em SST não deveria depender do tamanho da sua empresa
            </h1>
            <p className="mt-5 max-w-2xl text-lead text-on-deep-soft">
              A SSTudo nasceu para que micro e pequenas empresas tenham acesso às mesmas ferramentas
              de conformidade que grandes operações usam — sem estrutura interna cara e sem
              consultoria permanente.
            </p>
          </div>
        </section>

        {/* Missão e visão */}
        <section id="missao-visao" className="bg-background py-16 lg:py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-border bg-card p-7">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-tint">
                  <Compass className="h-5 w-5 text-primary" />
                </span>
                <h2 className="mt-5 font-display text-card font-semibold text-foreground">
                  Missão
                </h2>
                <p className="mt-3 text-lead leading-relaxed text-foreground-soft">{MISSION}</p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-7">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-tint">
                  <Target className="h-5 w-5 text-primary" />
                </span>
                <h2 className="mt-5 font-display text-card font-semibold text-foreground">Visão</h2>
                <p className="mt-3 text-lead leading-relaxed text-foreground-soft">{VISION}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Valores: princípio e consequência prática */}
        <section id="valores" className="bg-surface-subtle py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <FadeInView className="mx-auto max-w-3xl text-center">
              <SectionLabel>Valores</SectionLabel>
              <h2 className="mt-4 font-display text-section font-bold tracking-tight text-foreground">
                No que acreditamos, e o que isso muda para você
              </h2>
              <p className="mt-4 text-lead text-foreground-soft">
                Valor que não muda nada na prática é só palavra bonita. Cada um abaixo vem com a
                consequência concreta.
              </p>
            </FadeInView>

            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {VALUES.map((valor) => {
                const Icon = valor.icon;
                return (
                  <div
                    key={valor.name}
                    className="flex flex-col rounded-2xl border border-border bg-card p-6"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-tint">
                      <Icon className="h-5 w-5 text-primary" />
                    </span>
                    <h3 className="mt-5 font-display text-card font-semibold text-foreground">
                      {valor.name}
                    </h3>
                    <p className="mt-3 text-sm font-medium leading-relaxed text-foreground">
                      {valor.principle}
                    </p>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-foreground-soft">
                      {valor.inPractice}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Parceiros */}
        <section id="parceiros" className="bg-surface-subtle py-16 lg:py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <FadeInView className="text-center">
              <SectionLabel>Parceiros</SectionLabel>
              <h2 className="mt-4 font-display text-section font-bold tracking-tight text-foreground">
                Conformidade não se entrega sozinha
              </h2>
              <p className="mt-4 text-lead text-foreground-soft">
                Parte do que a SSTudo oferece depende de profissionais habilitados. Trabalhamos
                apenas com parceiros regulamentados.
              </p>
            </FadeInView>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {PARTNER_CATEGORIES.map((categoria) => (
                <div key={categoria.title} className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="font-display text-card font-semibold text-foreground">
                    {categoria.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-foreground-soft">
                    {categoria.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Chamada final */}
        <section className="bg-primary py-16 lg:py-20">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <h2 className="font-display text-section font-bold text-primary-foreground">
              Quer conversar sobre a conformidade da sua empresa?
            </h2>
            <p className="mt-4 text-lead text-primary-foreground/90">
              Conte quantas vidas você gerencia e sua área de atuação. Retornamos em até 1 dia útil.
            </p>
            <Link
              to="/"
              hash="contato"
              className="mt-8 inline-flex min-h-12 items-center justify-center rounded-lg bg-background px-8 py-3 text-base font-semibold text-primary transition-opacity hover:opacity-90"
            >
              Solicitar orçamento
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
