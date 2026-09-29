// ============================================================================
// Mega menu de cinco eixos
// ----------------------------------------------------------------------------
// Decisão central: os painéis ficam SEMPRE no HTML e são revelados por CSS, em
// vez de serem montados por JavaScript ao passar o mouse.
//
// O motivo é concreto e veio da análise dos concorrentes: em um deles, todo o
// conteúdo depende de JavaScript para existir, e a página fica vazia para
// buscadores e leitores de tela. Aqui, os links do menu estão no HTML entregue
// pelo servidor, e o JavaScript só acrescenta o fechamento pela tecla Escape.
//
// No desktop o painel abre ao passar o mouse E ao receber foco pelo teclado —
// por isso o gatilho é um botão focável dentro do grupo. No celular vira
// acordeão nativo, que já é acessível por teclado e funciona sem JavaScript.
// ============================================================================

import { useEffect } from "react";
import { ChevronDown, ExternalLink } from "lucide-react";
import { NAV_AXES, type NavItem } from "@/lib/navigation";

/** Item que já tem destino: vira link. Sem destino: vira texto marcado. */
function ItemDoMenu({ item }: { item: NavItem }) {
  const conteudo = (
    <>
      <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
        {item.label}
        {item.external && <ExternalLink className="h-3 w-3 text-muted-foreground" />}
      </span>
      <span className="mt-0.5 block text-xs leading-snug text-foreground-soft">
        {item.description}
      </span>
    </>
  );

  if (item.href === null) {
    return (
      <div className="block rounded-lg px-3 py-2 opacity-60">
        <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
          {item.label}
          <span className="rounded-full bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
            em breve
          </span>
        </span>
        <span className="mt-0.5 block text-xs leading-snug text-foreground-soft">
          {item.description}
        </span>
      </div>
    );
  }

  return (
    <a
      href={item.href}
      {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      // O contorno de foco do navegador é mantido de propósito: mudança de cor
      // de fundo sozinha é indicador fraco para quem navega por teclado.
      className="flex min-h-11 flex-col justify-center rounded-lg px-3 py-2 transition-colors hover:bg-surface-tint focus-visible:bg-surface-tint"
    >
      {conteudo}
    </a>
  );
}

/**
 * Grade de colunas conforme o eixo realmente tem, e não um número fixo.
 * Com três colunas fixas, um eixo de duas ficava com um vão vazio à direita, e
 * um de uma só virava coluna estreita e alta.
 */
const GRADE_POR_COLUNAS: Record<number, string> = {
  1: "sm:grid-cols-2",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
};

/** Colunas de um eixo. Mesma composição no desktop e no celular. */
function ColunasDoEixo({ axis }: { axis: (typeof NAV_AXES)[number] }) {
  const grade = GRADE_POR_COLUNAS[axis.columns.length] ?? "sm:grid-cols-2 lg:grid-cols-3";
  return (
    <>
      <p className="px-3 pb-3 text-xs text-muted-foreground">{axis.summary}</p>
      <div className={`grid gap-x-6 gap-y-4 ${grade}`}>
        {axis.columns.map((column) => (
          <div key={column.heading}>
            <p className="px-3 pb-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              {column.heading}
            </p>
            <ul>
              {column.items.map((item) => (
                <li key={item.label}>
                  <ItemDoMenu item={item} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}

export function MegaMenuDesktop() {
  useEffect(() => {
    // Única função do JavaScript aqui: Escape fecha o painel aberto. Sem ele o
    // menu continua inteiramente utilizável.
    function aoTeclar(evento: KeyboardEvent) {
      if (evento.key !== "Escape") return;
      const ativo = document.activeElement;
      if (ativo instanceof HTMLElement) ativo.blur();
    }
    document.addEventListener("keydown", aoTeclar);
    return () => document.removeEventListener("keydown", aoTeclar);
  }, []);

  return (
    <nav aria-label="Navegação principal" className="hidden lg:block">
      <ul className="flex items-center gap-1">
        {NAV_AXES.map((axis) => (
          <li key={axis.id} className="group relative">
            <button
              type="button"
              aria-haspopup="true"
              className="inline-flex min-h-11 items-center gap-1 rounded-lg px-3 text-sm text-foreground-soft transition-colors hover:text-foreground focus-visible:text-foreground group-hover:text-foreground"
            >
              {axis.label}
              <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
            </button>

            <div
              className={`invisible absolute left-0 top-full z-50 pt-2 opacity-0 transition-opacity group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100 ${
                axis.columns.length >= 3
                  ? "w-[min(46rem,calc(100vw-3rem))]"
                  : "w-[min(34rem,calc(100vw-3rem))]"
              }`}
            >
              <div className="rounded-2xl border border-border bg-popover p-4 shadow-[var(--shadow-elevated)]">
                <ColunasDoEixo axis={axis} />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function MegaMenuMobile() {
  return (
    <nav aria-label="Navegação principal" className="lg:hidden">
      <ul className="divide-y divide-border">
        {NAV_AXES.map((axis) => (
          <li key={axis.id}>
            {/* Acordeão nativo: acessível por teclado e funcional sem JavaScript. */}
            <details className="group">
              <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between px-1 text-sm font-medium text-foreground marker:hidden">
                {axis.label}
                <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" />
              </summary>
              <div className="pb-3">
                <ColunasDoEixo axis={axis} />
              </div>
            </details>
          </li>
        ))}
      </ul>
    </nav>
  );
}
