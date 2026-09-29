// ============================================================================
// Configuração do Vitest
// ----------------------------------------------------------------------------
// Deliberadamente separada do vite.config.ts do aplicativo. Aquele arquivo
// carrega os plugins do TanStack Start, do Cloudflare e do Tailwind, que servem
// para construir e servir o site e só atrapalhariam a execução dos testes.
//
// Aqui entra apenas o que os testes precisam: a resolução do atalho de caminho
// "@/", lida do tsconfig.json, para que o teste importe da mesma forma que o
// código de produção.
// ============================================================================

import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    // Restringe a varredura ao código do projeto. Sem isso, o runner tentaria
    // executar os milhares de testes das próprias dependências.
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    environment: "node",
    clearMocks: true,
  },
});
