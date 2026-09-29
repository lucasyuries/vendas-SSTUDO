// ============================================================================
// Rótulo de seção
// ----------------------------------------------------------------------------
// Os rótulos existiam antes como texto em CAIXA ALTA com espaçamento aberto —
// o tratamento mais genérico possível, e um dos sinais mais reconhecíveis de
// página gerada automaticamente. Foram removidos por causa disso, e a remoção
// foi longe demais: sem eles, quem varre a página perde a referência de onde
// está.
//
// O rótulo volta com tratamento próprio: caixa normal, cor de destaque e um
// traço curto que o ancora à esquerda. Ele informa a seção sem imitar o padrão
// de todo mundo.
// ============================================================================

export function SectionLabel({
  children,
  tone = "light",
  align = "center",
}: {
  children: React.ReactNode;
  /** "dark" quando a seção tem fundo escuro. */
  tone?: "light" | "dark";
  align?: "center" | "left";
}) {
  const cor = tone === "dark" ? "text-brand-highlight" : "text-primary";
  const traco = tone === "dark" ? "bg-brand-highlight/50" : "bg-primary/40";

  return (
    <span
      className={`flex items-center gap-2.5 text-sm font-semibold ${cor} ${
        align === "center" ? "justify-center" : ""
      }`}
    >
      <span aria-hidden className={`h-px w-6 ${traco}`} />
      {children}
    </span>
  );
}
