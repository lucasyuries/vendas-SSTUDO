// ============================================================================
// Testes de SEO técnico
// ----------------------------------------------------------------------------
// O sitemap e o robots.txt são arquivos estáticos, escritos à mão, e por isso
// envelhecem em silêncio: cria-se uma página nova e ninguém lembra de
// acrescentá-la, ou remove-se uma rota e a referência fica.
//
// Estes testes leem os arquivos de verdade e comparam com as rotas declaradas
// no código, de modo que a divergência quebre a suíte em vez de passar
// despercebida por meses.
// ============================================================================

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { PRIVATE_ROUTES, PUBLIC_ROUTES } from "@/lib/navigation";
import { HOME_FAQ, faqToJsonLd } from "@/lib/faq";

const DOMINIO = "https://sstudo.com.br";
const raiz = process.cwd();

const sitemap = readFileSync(join(raiz, "public", "sitemap.xml"), "utf8");
const robots = readFileSync(join(raiz, "public", "robots.txt"), "utf8");

function locsDoSitemap(): string[] {
  return [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

describe("sitemap", () => {
  it("lista exatamente as páginas públicas, nem mais nem menos", () => {
    const esperado = PUBLIC_ROUTES.map((rota) => `${DOMINIO}${rota}`).sort();
    expect(locsDoSitemap().sort()).toEqual(esperado);
  });

  it("não lista nenhuma página que não deve ser indexada", () => {
    const locs = locsDoSitemap();
    PRIVATE_ROUTES.forEach((rota) => {
      expect(locs).not.toContain(`${DOMINIO}${rota}`);
    });
  });

  it("não lista rotas de pagamento, removidas do site", () => {
    ["checkout", "cadastro", "pedidos", "mercado-pago"].forEach((termo) => {
      expect(sitemap).not.toContain(termo);
    });
  });

  it("usa o domínio correto em todos os endereços", () => {
    locsDoSitemap().forEach((loc) => {
      expect(loc.startsWith(`${DOMINIO}/`)).toBe(true);
    });
  });

  it("não repete endereço", () => {
    const locs = locsDoSitemap();
    expect(new Set(locs).size).toBe(locs.length);
  });
});

describe("robots.txt", () => {
  it("bloqueia todas as páginas que não devem ser indexadas", () => {
    PRIVATE_ROUTES.forEach((rota) => {
      expect(robots).toContain(`Disallow: ${rota}`);
    });
  });

  it("não bloqueia nenhuma página pública", () => {
    PUBLIC_ROUTES.filter((rota) => rota !== "/").forEach((rota) => {
      expect(robots).not.toContain(`Disallow: ${rota}`);
    });
  });

  it("não menciona rotas de pagamento, que não existem mais", () => {
    expect(robots).not.toContain("checkout");
  });

  it("aponta para o sitemap", () => {
    expect(robots).toContain(`Sitemap: ${DOMINIO}/sitemap.xml`);
  });
});

describe("dados estruturados das perguntas frequentes", () => {
  it("gera uma entrada para cada pergunta exibida na página", () => {
    const jsonLd = faqToJsonLd(HOME_FAQ);
    expect(jsonLd.mainEntity).toHaveLength(HOME_FAQ.length);
    expect(jsonLd.mainEntity.map((e) => e.name)).toEqual(HOME_FAQ.map((f) => f.question));
  });

  it("usa o formato que o schema.org espera", () => {
    const jsonLd = faqToJsonLd(HOME_FAQ);
    expect(jsonLd["@type"]).toBe("FAQPage");
    jsonLd.mainEntity.forEach((entrada) => {
      expect(entrada["@type"]).toBe("Question");
      expect(entrada.acceptedAnswer["@type"]).toBe("Answer");
      expect(entrada.acceptedAnswer.text.length).toBeGreaterThan(0);
    });
  });

  it("não promete plano, preço nem assinatura em nenhuma resposta", () => {
    // O site deixou de vender por checkout; texto remanescente prometendo
    // "o melhor plano" contradizia a operação e chegou a ficar no ar.
    const tudo = HOME_FAQ.map((f) => `${f.question} ${f.answer}`)
      .join(" ")
      .toLowerCase();
    ["melhor plano", "assinatura", "assine", "cartão de crédito"].forEach((termo) => {
      expect(tudo).not.toContain(termo);
    });
  });
});
