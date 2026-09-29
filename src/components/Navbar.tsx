// ============================================================================
// Barra de navegação
// ----------------------------------------------------------------------------
// O menu do celular é um <details> nativo, não um painel controlado por estado
// do React. A diferença importa: com estado, quem chega sem JavaScript não
// consegue abrir o menu e fica sem navegação nenhuma. Com <details>, o menu
// abre, fecha e é operável por teclado sem uma linha de script.
//
// O JavaScript entra só como melhoria: fechar o menu depois de clicar em um
// link, para a âncora não deixar o painel aberto por cima do conteúdo.
// ============================================================================

import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/integrations/supabase/auth-context";
import { MegaMenuDesktop, MegaMenuMobile } from "@/components/MegaMenu";

export function Navbar() {
  const { user, signOut, loading } = useAuth();
  const menuCelular = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const detalhes = menuCelular.current;
    if (!detalhes) return;

    function fecharAoNavegar(evento: MouseEvent) {
      const alvo = evento.target as HTMLElement | null;
      if (alvo?.closest("a") && detalhes) detalhes.open = false;
    }

    detalhes.addEventListener("click", fecharAoNavegar);
    return () => detalhes.removeEventListener("click", fecharAoNavegar);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Link para a página inicial, não âncora: com âncora, clicar no logo
              dentro de uma página interna apenas rolava para o topo dela. */}
          <Link
            to="/"
            className="flex min-h-11 shrink-0 items-center gap-2"
            aria-label="SSTudo, ir para a página inicial"
          >
            <img
              src="/logo-sstudo.webp"
              alt="SSTudo"
              width={368}
              height={122}
              fetchPriority="high"
              decoding="async"
              className="h-8 w-auto"
            />
          </Link>

          <MegaMenuDesktop />

          <div className="flex items-center gap-2">
            {!loading && user && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => signOut()}
                title="Sair"
                className="hidden lg:inline-flex"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            )}

            {/* Chamada principal, presente em todas as páginas. Aponta para a
                página de contato, e não para uma âncora: a âncora só existe na
                página inicial, então em toda página interna o botão ficava
                morto. */}
            <Link
              to="/contato"
              className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Solicitar orçamento
            </Link>
          </div>
        </div>
      </div>

      {/* Menu do celular: acordeão nativo, funcional sem JavaScript. */}
      <details ref={menuCelular} className="group border-t border-border lg:hidden">
        <summary
          className="mx-auto flex min-h-12 max-w-7xl cursor-pointer list-none items-center gap-2 px-4 text-sm font-medium text-foreground marker:hidden sm:px-6"
          aria-label="Abrir menu de navegação"
        >
          <Menu className="h-5 w-5 group-open:hidden" />
          <X className="hidden h-5 w-5 group-open:block" />
          Menu
        </summary>
        <div className="mx-auto max-w-7xl px-4 pb-4 sm:px-6">
          <MegaMenuMobile />
          {!loading && user && (
            <Button variant="outline" className="mt-4 min-h-12 w-full" onClick={() => signOut()}>
              <LogOut className="h-4 w-4" /> Sair
            </Button>
          )}
        </div>
      </details>
    </header>
  );
}
