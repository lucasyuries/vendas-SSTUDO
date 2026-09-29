// ============================================================================
// Seção "como funciona"
// ----------------------------------------------------------------------------
// Quatro passos numerados. O padrão vem de uma das referências de mercado, e a
// função é reduzir o medo de complexidade: transforma "contratar um sistema de
// SST" em uma sequência que cabe na cabeça.
//
// Descreve o processo comercial da SSTudo, não o de um produto — o passo a
// passo de cada produto vive no catálogo e aparece na página dele.
// ============================================================================

import { FadeInView } from "@/components/FadeInView";
import { SectionLabel } from "@/components/SectionLabel";

const PASSOS = [
  {
    titulo: "Diagnóstico gratuito",
    descricao:
      "Comece descobrindo o que a lei exige da sua empresa. O Diagnóstico PGR consulta o CNPJ e aponta o que falta, sem custo e sem cadastro.",
  },
  {
    titulo: "Conversa com especialista",
    descricao:
      "Você informa quantas vidas gerencia e sua área de atuação. É o que define o escopo — e o preço.",
  },
  {
    titulo: "Proposta sob medida",
    descricao:
      "Recebe um orçamento com os produtos que resolvem o seu caso. Cada um funciona de forma independente; ninguém é obrigado a levar os quatro.",
  },
  {
    titulo: "Implantação e acompanhamento",
    descricao: "A equipe acompanha a configuração e segue disponível conforme a legislação muda.",
  },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="bg-background py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <FadeInView className="mx-auto max-w-3xl text-center">
          <SectionLabel>Como funciona</SectionLabel>
          <h2 className="mt-4 font-display text-section font-bold tracking-tight text-foreground">
            Do diagnóstico à conformidade, em quatro passos
          </h2>
        </FadeInView>

        <ol className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {PASSOS.map((passo, indice) => (
            <li
              key={passo.titulo}
              className="relative rounded-2xl border border-border bg-card p-6"
            >
              {/* Cor de texto, não de borda: em cinza-claro o numeral ficava em
                  1,48:1 de contraste, abaixo do mínimo de acessibilidade. */}
              <span className="font-display text-3xl font-bold text-muted-foreground">
                {String(indice + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 font-display text-card font-semibold text-foreground">
                {passo.titulo}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground-soft">{passo.descricao}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
