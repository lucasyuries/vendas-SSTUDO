// ============================================================================
// Seção "o problema"
// ----------------------------------------------------------------------------
// Vem antes de qualquer solução, e em forma de pergunta, porque é assim que a
// referência de mercado escolhida pelo cliente faz — e funciona: o visitante se
// reconhece antes de ouvir uma oferta.
//
// As dores falam de consequência (multa, prazo, retrabalho), nunca de
// funcionalidade. Nenhuma delas cita número não comprovado.
// ============================================================================

import { AlertTriangle } from "lucide-react";
import { FadeInView } from "@/components/FadeInView";
import { SectionLabel } from "@/components/SectionLabel";

const DORES = [
  "Você só descobre que um exame venceu quando a fiscalização aponta?",
  "A NR-01 passou a exigir riscos psicossociais e sua empresa ainda não sabe como medir?",
  "A documentação de SST está espalhada entre planilhas, e-mails e papel?",
  "Precisa de quatro fornecedores diferentes para atender às obrigações de uma empresa só?",
];

export function Problem() {
  return (
    <section id="o-problema" className="bg-background py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <FadeInView className="mx-auto max-w-3xl text-center">
          <SectionLabel>O problema</SectionLabel>
          <h2 className="mt-4 font-display text-section font-bold tracking-tight text-foreground">
            Conformidade em SST costuma custar caro pelo motivo errado
          </h2>
          <p className="mt-4 text-lead text-foreground-soft">
            Não é o custo da ferramenta. É o retrabalho, o prazo perdido e a autuação que ninguém
            viu chegar.
          </p>
        </FadeInView>

        <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2">
          {DORES.map((dor) => (
            <div
              key={dor}
              className="flex items-start gap-3 rounded-xl border border-border bg-surface-subtle p-5"
            >
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
              <p className="text-sm leading-relaxed text-foreground-soft">{dor}</p>
            </div>
          ))}
        </div>

        <p className="mx-auto mt-8 max-w-2xl text-center text-lead text-foreground">
          Se você respondeu sim para alguma, o problema não é falta de esforço — é falta de
          integração.
        </p>
      </div>
    </section>
  );
}
