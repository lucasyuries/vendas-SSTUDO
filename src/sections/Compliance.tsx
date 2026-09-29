// ============================================================================
// Faixa de conformidade normativa
// ----------------------------------------------------------------------------
// Ocupa o lugar que era dos depoimentos fictícios, removidos por não serem
// verificáveis. Diferente deles, cada item aqui é checável: ou o produto atende
// à norma, ou não atende.
//
// Serve a dois propósitos ao mesmo tempo. Para o visitante técnico — que é o
// comprador neste mercado — é sinal de competência: ele varre a lista
// procurando a sigla que o aflige. Para busca orgânica, é o vocabulário que as
// pessoas realmente pesquisam.
//
// O espaço para uma futura faixa de logos de parceiros fica previsto abaixo,
// para quando os arquivos e as autorizações de uso existirem.
// ============================================================================

import { FadeInView } from "@/components/FadeInView";
import { SectionLabel } from "@/components/SectionLabel";

const NORMAS = [
  { sigla: "NR-01", oque: "Gerenciamento de riscos e riscos psicossociais" },
  { sigla: "NR-04", oque: "Classificação do grau de risco" },
  { sigla: "NR-07", oque: "PCMSO e exames ocupacionais" },
  { sigla: "ASO", oque: "Atestado de saúde ocupacional por função" },
  { sigla: "LGPD", oque: "Tratamento de dados no canal de denúncias" },
  { sigla: "Lei Anticorrupção", oque: "Canal de denúncias e compliance" },
];

export function Compliance() {
  return (
    <section id="conformidade" className="bg-surface-subtle py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <FadeInView className="mx-auto max-w-3xl text-center">
          <SectionLabel>Conformidade</SectionLabel>
          <h2 className="mt-4 font-display text-section font-bold tracking-tight text-foreground">
            As normas que nossos produtos ajudam a cumprir
          </h2>
          <p className="mt-4 text-lead text-foreground-soft">
            Cada exigência abaixo é atendida por pelo menos uma das ferramentas da SSTudo.
          </p>
        </FadeInView>

        <ul className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {NORMAS.map((norma) => (
            <li
              key={norma.sigla}
              className="rounded-xl border border-border bg-card px-5 py-4 text-center"
            >
              <p className="font-display text-card font-bold text-primary">{norma.sigla}</p>
              <p className="mt-1 text-xs leading-snug text-foreground-soft">{norma.oque}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
