// ============================================================================
// Lista de perguntas frequentes
// ----------------------------------------------------------------------------
// Usa <details> nativo em vez de acordeão de biblioteca, e o motivo é
// concreto: acordeões controlados por JavaScript não renderizam o conteúdo
// fechado, então as RESPOSTAS não existem no HTML entregue pelo servidor. Quem
// chega sem JavaScript vê só as perguntas, e um rastreador de texto simples
// idem.
//
// Com <details>, pergunta e resposta estão sempre no HTML, o elemento é
// acessível por teclado por natureza, e nenhuma biblioteca é necessária.
//
// Aceita tema claro e escuro porque a seção da página inicial fica sobre fundo
// azul, enquanto as das páginas de produto ficam sobre fundo claro.
// ============================================================================

import { ChevronDown } from "lucide-react";

export interface FaqEntry {
  question: string;
  answer: string;
}

export function FaqList({
  entries,
  tone = "light",
}: {
  entries: FaqEntry[];
  tone?: "light" | "dark";
}) {
  const escuro = tone === "dark";

  return (
    <div className={escuro ? "divide-y divide-border/30" : "divide-y divide-border"}>
      {entries.map((entry) => (
        <details key={entry.question} className="group">
          <summary
            className={`flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-left font-medium marker:hidden ${
              escuro ? "text-background" : "text-foreground"
            }`}
          >
            {entry.question}
            <ChevronDown
              className={`h-4 w-4 shrink-0 transition-transform group-open:rotate-180 ${
                escuro ? "text-background/70" : "text-muted-foreground"
              }`}
            />
          </summary>
          <p
            className={`pb-5 text-sm leading-relaxed ${
              escuro ? "text-background/85" : "text-foreground-soft"
            }`}
          >
            {entry.answer}
          </p>
        </details>
      ))}
    </div>
  );
}
