// ============================================================================
// Teste de fumaça da cadeia de testes
// ----------------------------------------------------------------------------
// Não valida regra de negócio. Existe para provar que o runner executa, que o
// TypeScript é compilado e que o atalho de caminho "@/" resolve — as três
// coisas que precisam funcionar antes de qualquer teste de comportamento ser
// escrito nos tickets seguintes.
//
// Se este arquivo falhar, o problema é de configuração, não do produto.
// ============================================================================

import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";
import { loginSchema } from "@/lib/validations";

describe("cadeia de testes", () => {
  it("resolve o atalho de caminho e executa código do projeto", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("carrega um esquema de validação real do projeto", () => {
    const valido = loginSchema.safeParse({
      email: "pessoa@exemplo.com.br",
      password: "uma-senha",
    });
    expect(valido.success).toBe(true);

    const invalido = loginSchema.safeParse({ email: "nao-e-email", password: "x" });
    expect(invalido.success).toBe(false);
  });
});
