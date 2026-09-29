// ============================================================================
// Barra fixa de orçamento no celular
// ----------------------------------------------------------------------------
// Aparece depois que o visitante passa do hero, para que a ação principal
// esteja sempre a um toque de distância durante a rolagem — que no celular é
// longa.
//
// É melhoria progressiva: sem JavaScript ela simplesmente não aparece, e o
// visitante continua com o botão do topo e o do final da página. Nada é
// perdido.
// ============================================================================

import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

export function StickyQuoteBar() {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("top");
    if (!hero) return;

    // Escuta passiva da rolagem, sem agendamento por quadro de pintura. São
    // duas leituras numéricas e um setState que o React descarta quando o
    // valor não muda — o custo é irrelevante e o comportamento fica simples de
    // verificar.
    function avaliar() {
      const limite = hero!.offsetTop + hero!.offsetHeight - 80;
      setVisivel(window.scrollY > limite);
    }

    avaliar();
    window.addEventListener("scroll", avaliar, { passive: true });
    window.addEventListener("resize", avaliar, { passive: true });
    return () => {
      window.removeEventListener("scroll", avaliar);
      window.removeEventListener("resize", avaliar);
    };
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md transition-transform lg:hidden ${
        visivel ? "translate-y-0" : "translate-y-full"
      }`}
      aria-hidden={!visivel}
    >
      <Link
        to="/contato"
        tabIndex={visivel ? undefined : -1}
        className="flex min-h-12 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground"
      >
        Solicitar orçamento
      </Link>
    </div>
  );
}
