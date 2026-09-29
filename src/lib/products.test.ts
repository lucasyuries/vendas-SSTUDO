// ============================================================================
// Testes de integridade do catálogo de produtos
// ----------------------------------------------------------------------------
// O catálogo alimenta os cartões da página inicial, o mega menu, as páginas de
// produto e o seletor do formulário de orçamento. Um campo faltando não quebra
// a compilação — some silenciosamente de uma dessas quatro superfícies. Estes
// testes existem para que isso falhe alto.
//
// Testam a forma dos dados, não o texto: reescrever uma descrição não pode
// quebrar teste, mas apagar um campo obrigatório precisa quebrar.
// ============================================================================

import { describe, expect, it } from "vitest";
import { CONTRACTED_PRODUCTS, DIAGNOSTIC_PRODUCT, PRODUCTS, getProduct } from "@/lib/products";

describe("catálogo de produtos", () => {
  it("tem os quatro produtos da SSTudo", () => {
    expect(PRODUCTS).toHaveLength(4);
  });

  it("não repete identificador", () => {
    const ids = PRODUCTS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("não repete caminho de página", () => {
    const paths = PRODUCTS.map((p) => p.path);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("separa os produtos contratados da ferramenta gratuita", () => {
    expect(CONTRACTED_PRODUCTS).toHaveLength(3);
    expect(DIAGNOSTIC_PRODUCT?.id).toBe("diagnostico-pgr");
  });

  it("encontra produto pelo identificador e devolve nulo para o que não existe", () => {
    expect(getProduct("psicohub")?.name).toBe("PsicoHub");
    expect(getProduct("produto-inexistente")).toBeNull();
    expect(getProduct(undefined)).toBeNull();
  });

  describe.each(PRODUCTS.map((p) => [p.id, p] as const))("%s", (_id, product) => {
    it("tem nome, chamada e descrição de cartão preenchidos", () => {
      expect(product.name.trim()).not.toBe("");
      expect(product.tagline.trim()).not.toBe("");
      expect(product.cardDescription.trim()).not.toBe("");
      expect(product.problem.trim()).not.toBe("");
    });

    it("declara pelo menos uma norma âncora", () => {
      expect(product.anchorNorms.length).toBeGreaterThan(0);
      product.anchorNorms.forEach((norm) => expect(norm.trim()).not.toBe(""));
    });

    it("declara público-alvo", () => {
      expect(product.audiences.length).toBeGreaterThan(0);
    });

    it("lista funcionalidades suficientes para a grade de chips", () => {
      expect(product.features.length).toBeGreaterThanOrEqual(5);
      product.features.forEach((feature) => expect(feature.trim()).not.toBe(""));
    });

    it("descreve o funcionamento em quatro passos", () => {
      expect(product.steps).toHaveLength(4);
      product.steps.forEach((step) => {
        expect(step.title.trim()).not.toBe("");
        expect(step.description.trim()).not.toBe("");
      });
    });

    it("tem perguntas frequentes respondidas", () => {
      expect(product.faq.length).toBeGreaterThanOrEqual(2);
      product.faq.forEach((entry) => {
        expect(entry.question.trim()).not.toBe("");
        expect(entry.answer.trim()).not.toBe("");
      });
    });

    it("aponta para um endereço de sistema válido e seguro", () => {
      const url = new URL(product.systemUrl);
      expect(url.protocol).toBe("https:");
    });

    it("tem caminho interno começando em /produtos/", () => {
      expect(product.path.startsWith("/produtos/")).toBe(true);
      expect(product.path).toBe(`/produtos/${product.id}`);
    });

    it("usa uma classe de cor de destaque do sistema de tokens", () => {
      expect(product.accentClass).toMatch(/^text-product-[a-z-]+$/);
    });
  });

  it("dá ao Diagnóstico PGR a ressalva de que não substitui consultoria", () => {
    expect(DIAGNOSTIC_PRODUCT?.disclaimer).toBeTruthy();
    expect(DIAGNOSTIC_PRODUCT?.disclaimer).toMatch(/não substitui/i);
  });

  it("não promete resultado numérico que a empresa não possa comprovar", () => {
    // Métrica de desempenho é prova social e só entra no site quando for
    // apurada e verificável — decisão tomada ao remover os depoimentos
    // fictícios e os números não auditados.
    //
    // "100%" é a exceção deliberada: não é medição, é afirmação categórica
    // sobre como o produto funciona ("100% anônimo", "100% digital"). Qualquer
    // outro percentual é resultado e precisa de prova.
    const textos = PRODUCTS.flatMap((p) => [
      p.tagline,
      p.cardDescription,
      p.problem,
      ...p.features,
      ...p.faq.map((f) => f.answer),
    ]);
    textos.forEach((texto) => {
      const percentuais = [...texto.matchAll(/(\d+)\s*%/g)].map((m) => m[1]);
      expect(percentuais.filter((valor) => valor !== "100")).toEqual([]);
      expect(texto).not.toMatch(/mais de \d/i);
      expect(texto).not.toMatch(/\+\s*\d+\s*(empresas|clientes|vidas)/i);
    });
  });
});
