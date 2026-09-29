// ============================================================================
// Hero da página inicial
// ----------------------------------------------------------------------------
// Sem foto, por decisão: banco de imagem genérico enfraquece em vez de ajudar.
// No lugar entra a matriz de risco, que é o instrumento mais reconhecível da
// segurança do trabalho e exatamente o que o PsicoHub produz. Ela diz o que a
// empresa faz antes de o visitante ler uma linha.
//
// Havia aqui uma faixa de autosseleção de público — "Sou empresa", "Sou
// assessoria" e assim por diante. Ela foi removida a pedido do cliente. Os
// quatro botões mandavam todos para /contato, então prometiam uma bifurcação
// que não existia; a segmentação real vive no eixo Soluções do menu, onde cada
// público tem página própria.
// ============================================================================

import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { RiskMatrix } from "@/components/RiskMatrix";

const NORMAS = ["NR-01", "NR-04", "PCMSO", "LGPD"];

export function Hero() {
  return (
    <>
      <section id="top" className="relative overflow-hidden bg-brand-deep">
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse 70% 80% at 18% 35%, var(--brand-deep-glow) 0%, transparent 70%)",
          }}
        />

        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h1 className="max-w-2xl font-display text-display text-on-deep">
                Conformidade em SST, do diagnóstico ao documento assinado
              </h1>

              <p className="mt-6 max-w-xl text-lead text-on-deep-soft">
                PGR, ASO, riscos psicossociais e canal de denúncias em ferramentas que conversam
                entre si. Para empresas, assessorias e clínicas que não podem errar prazo nem perder
                documento.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/contato"
                  className="inline-flex min-h-12 items-center justify-center rounded-lg bg-primary px-7 py-3 text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Solicitar orçamento
                </Link>
                <a
                  href="#produtos"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-on-deep-soft/35 px-7 py-3 text-base font-semibold text-on-deep transition-colors hover:bg-on-deep/10"
                >
                  Ver os quatro produtos
                </a>
              </div>

              <ul className="mt-9 flex flex-wrap gap-x-7 gap-y-3">
                {NORMAS.map((norma) => (
                  <li key={norma} className="flex items-center gap-2 text-sm text-on-deep-soft">
                    <Check className="h-4 w-4 shrink-0 text-brand-highlight" />
                    {norma}
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-5">
              <RiskMatrix />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
