// ============================================================================
// Testes da navegação
// ----------------------------------------------------------------------------
// O risco aqui é o link morto: um item do menu que aponta para uma página que
// ainda não existe. Isso não quebra a compilação, não aparece em revisão de
// código, e só é descoberto pelo visitante caindo num erro 404.
//
// Estes testes tornam esse risco impossível de passar despercebido.
// ============================================================================

import { describe, expect, it } from "vitest";
import {
  EXISTING_ROUTES,
  HOME_ANCHORS,
  NAV_AXES,
  PAGE_ANCHORS,
  allNavItems,
  type NavItem,
} from "@/lib/navigation";
import { PRODUCTS } from "@/lib/products";

const rotas = new Set<string>(EXISTING_ROUTES);

function ehExterno(item: NavItem) {
  return item.href !== null && /^https?:\/\//.test(item.href);
}

/**
 * Um destino interno é válido quando a página existe E, havendo âncora, a seção
 * existe naquela página. Validar só o caminho deixaria passar um link que leva
 * o visitante ao topo da página errada, sem erro visível.
 *
 * Âncora solta é sempre inválida aqui. O menu é renderizado em todas as
 * páginas: "#faq" resolve na inicial e morre em qualquer outra, sem 404 e sem
 * nada na tela. O destino precisa dizer também em qual página a seção está.
 */
function destinoInternoValido(href: string): boolean {
  if (href.startsWith("#")) return false;

  const [caminho, ancora] = href.split("#");
  if (!rotas.has(caminho)) return false;
  if (!ancora) return true;
  return (PAGE_ANCHORS[caminho] ?? []).includes(`#${ancora}`);
}

describe("estrutura do menu", () => {
  it("tem os quatro eixos", () => {
    // "Soluções" chegou a ser removido por não ter página real por trás. Voltou
    // quando as quatro páginas por público foram criadas — agora cada item leva
    // a uma página que existe. "Conteúdo" continua fora pelo motivo original.
    expect(NAV_AXES).toHaveLength(4);
    expect(NAV_AXES.map((a) => a.id)).toEqual([
      "institucional",
      "produtos",
      "solucoes",
      "conformidade",
    ]);
  });

  it("não repete identificador de eixo", () => {
    const ids = NAV_AXES.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("dá a cada eixo rótulo, resumo e ao menos uma coluna", () => {
    NAV_AXES.forEach((axis) => {
      expect(axis.label.trim()).not.toBe("");
      expect(axis.summary.trim()).not.toBe("");
      expect(axis.columns.length).toBeGreaterThan(0);
    });
  });

  it("dá a cada coluna título e ao menos um item", () => {
    NAV_AXES.forEach((axis) => {
      axis.columns.forEach((column) => {
        expect(column.heading.trim()).not.toBe("");
        expect(column.items.length).toBeGreaterThan(0);
      });
    });
  });

  it("dá a todo item rótulo e descrição", () => {
    allNavItems().forEach((item) => {
      expect(item.label.trim()).not.toBe("");
      expect(item.description.trim()).not.toBe("");
    });
  });
});

describe("destinos do menu", () => {
  it("NENHUM item aponta para página ou seção inexistente", () => {
    const quebrados = allNavItems()
      .filter((item) => item.href !== null && !ehExterno(item))
      .filter((item) => !destinoInternoValido(item.href as string))
      .map((item) => `${item.label} → ${item.href}`);

    expect(quebrados).toEqual([]);
  });

  it("reprova âncora que não existe na página de destino", () => {
    // Prova que a validação acima realmente pega o erro, em vez de aprovar
    // tudo por engano.
    expect(destinoInternoValido("/sobre#valores")).toBe(true);
    expect(destinoInternoValido("/sobre#secao-que-nao-existe")).toBe(false);
    expect(destinoInternoValido("/pagina-que-nao-existe")).toBe(false);
    expect(destinoInternoValido("/#faq")).toBe(true);
    expect(destinoInternoValido("/#ancora-inexistente")).toBe(false);
  });

  it("reprova âncora solta, que morre fora da página inicial", () => {
    // "#faq" existe mesmo na inicial — e é justamente por isso que passava
    // despercebido. O menu aparece em todas as páginas, e nas outras o item
    // não faz nada: nem navega, nem erra visivelmente.
    expect(HOME_ANCHORS).toContain("#faq");
    expect(destinoInternoValido("#faq")).toBe(false);
  });

  it("usa HTTPS em todo destino externo", () => {
    allNavItems()
      .filter(ehExterno)
      .forEach((item) => {
        expect(new URL(item.href as string).protocol).toBe("https:");
      });
  });

  it("marca como externo todo item que sai do domínio, para abrir em nova aba", () => {
    allNavItems()
      .filter((item) => item.href !== null && /^https?:\/\//.test(item.href))
      .forEach((item) => {
        expect(item.external).toBe(true);
      });
  });

  it("não marca como externo item que fica no próprio site", () => {
    allNavItems()
      .filter((item) => item.href !== null && !/^https?:\/\//.test(item.href))
      .forEach((item) => {
        expect(item.external).not.toBe(true);
      });
  });
});

describe("eixo de produtos", () => {
  it("lista os quatro produtos do catálogo, sem texto duplicado", () => {
    const eixo = NAV_AXES.find((a) => a.id === "produtos");
    const nomes = eixo?.columns[0].items.map((i) => i.label);
    expect(nomes).toEqual(PRODUCTS.map((p) => p.name));
  });

  it("oferece acesso ao sistema de cada produto", () => {
    const eixo = NAV_AXES.find((a) => a.id === "produtos");
    const urls = eixo?.columns[1].items.map((i) => i.href);
    expect(urls).toEqual(PRODUCTS.map((p) => p.systemUrl));
  });
});

describe("promessa não cumprida", () => {
  it("nenhum item do menu está marcado como em breve", () => {
    // O menu chegou a ter treze itens sem destino, espalhados por dois eixos
    // que não tinham uma única página por trás. Menu cheio de promessa não
    // cumprida é pior que menu curto: os dois eixos foram removidos.
    //
    // Este teste impede que a situação volte sem alguém decidir por isso.
    const semDestino = allNavItems()
      .filter((item) => item.href === null)
      .map((item) => item.label);

    expect(semDestino).toEqual([]);
  });
});
