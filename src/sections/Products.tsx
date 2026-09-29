// ============================================================================
// Os quatro produtos, na página inicial
// ----------------------------------------------------------------------------
// Cartões compactos, os quatro lado a lado. O papel desta seção é responder
// "o que a SSTudo tem?" em uma olhada — não explicar cada produto. Quem se
// interessa clica e lê a página dedicada, que é onde o argumento cabe.
//
// A versão anterior trazia parágrafos inteiros em cada cartão e o Diagnóstico
// PGR num bloco separado, o que fazia a seção ocupar quase duas telas para
// dizer uma coisa só.
// ============================================================================

import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PRODUCTS } from "@/lib/products";
import { FadeInView } from "@/components/FadeInView";
import { SectionLabel } from "@/components/SectionLabel";

export function Products() {
  return (
    <section id="produtos" className="bg-surface-subtle py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <FadeInView className="mx-auto max-w-2xl text-center">
          <SectionLabel>Produtos</SectionLabel>
          <h2 className="mt-3 font-display text-section font-bold tracking-tight text-foreground">
            Quatro frentes, quatro ferramentas
          </h2>
          <p className="mt-3 text-lead text-foreground-soft">
            Cada uma resolve uma obrigação diferente. Você leva só as que precisa.
          </p>
        </FadeInView>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.map((product) => {
            const Icon = product.icon;
            return (
              <li key={product.id}>
                <Link
                  to="/produtos/$produtoId"
                  params={{ produtoId: product.id }}
                  className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-border-strong hover:shadow-[var(--shadow-elevated)]"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface-tint transition-transform duration-300 group-hover:scale-110">
                    <Icon className={`h-5 w-5 ${product.accentClass}`} />
                  </span>

                  <h3 className="mt-4 font-display text-card font-semibold text-foreground">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-foreground-soft">{product.tagline}</p>

                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {product.cardDescription}
                  </p>

                  <span className="mt-5 flex flex-wrap items-center gap-1.5">
                    {product.anchorNorms.map((norma) => (
                      <span
                        key={norma}
                        className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                      >
                        {norma}
                      </span>
                    ))}
                  </span>

                  <span className="mt-4 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-primary">
                    Ver detalhes
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
