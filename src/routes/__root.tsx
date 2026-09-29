import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/integrations/supabase/auth-context";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Página não encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          A página que você procura não existe ou foi movida.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "SSTudo — NR-01 Riscos Psicossociais" },
      {
        name: "description",
        content:
          "Gerencie riscos psicossociais e atenda a NR-01 com o SSTudo. Pesquisa anônima, heatmap automático e relatório PDF para o PGR. Experimente agora.",
      },
      { name: "author", content: "SSTudo" },
      { property: "og:title", content: "SSTudo — Conformidade NR-01" },
      {
        property: "og:description",
        content:
          "Plataforma para Gestão de Riscos Psicossociais. Heatmap, planos de ação e PDF pronto para o PGR.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "SSTudo" },
      { name: "twitter:description", content: "Conformidade NR-01 sem planilhas." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      // As fontes estavam declaradas no CSS e nunca eram carregadas: o site
      // inteiro renderizava na fonte padrão do sistema operacional, sem
      // nenhuma identidade tipográfica.
      //
      // A escolha é deliberada e ligada ao assunto. Archivo é um grotesco de
      // sinalização — segurança do trabalho vive de placa e de documento
      // normativo, e o peso fechado nos títulos soa autoridade sem soar
      // corporativo genérico. IBM Plex Sans foi desenhada para documentação
      // técnica: aguenta parágrafo longo de texto normativo sem cansar.
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Archivo:wght@600;700;800&family=IBM+Plex+Sans:wght@400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}
