// ============================================================================
// Testes do ponto de costura da captação de lead
// ----------------------------------------------------------------------------
// Este é o único ponto do projeto que merece teste dedicado: por ele passam os
// dois formulários e todas as páginas de produto, e é onde um erro falha em
// silêncio — um telefone mal normalizado ou um produto de origem perdido não
// quebram nada visivelmente, só chegam errados no painel do comercial.
//
// Testam comportamento na fronteira: dado um conjunto de campos, o pedido é
// aceito ou recusado, e o que seria gravado tem a forma esperada.
// ============================================================================

import { describe, expect, it } from "vitest";
import {
  LIVES_RANGES,
  SECTORS,
  buildQuestionRow,
  buildQuoteRequestRow,
  livesRangeLabel,
  normalizeWhatsapp,
  questionSchema,
  quoteRequestSchema,
  sectorLabel,
} from "@/lib/leads";

const pedidoValido = {
  fullName: "  Maria Souza  ",
  email: "  Maria@Exemplo.COM.BR ",
  whatsapp: "(93) 99100-9999",
  livesRange: "11-50",
  sector: "assessoria-sst",
};

describe("normalização de WhatsApp", () => {
  it("aceita o número como a pessoa costuma digitar", () => {
    expect(normalizeWhatsapp("(93) 99100-9999")).toBe("5593991009999");
    expect(normalizeWhatsapp("93 99100 9999")).toBe("5593991009999");
    expect(normalizeWhatsapp("93991009999")).toBe("5593991009999");
  });

  it("aceita fixo com DDD", () => {
    expect(normalizeWhatsapp("(11) 3333-4444")).toBe("551133334444");
  });

  it("não duplica o código do país quando já veio", () => {
    expect(normalizeWhatsapp("+55 93 99100-9999")).toBe("5593991009999");
    expect(normalizeWhatsapp("5593991009999")).toBe("5593991009999");
  });

  it("recusa o que não pode ser um telefone brasileiro", () => {
    expect(normalizeWhatsapp("")).toBeNull();
    expect(normalizeWhatsapp("99999")).toBeNull();
    expect(normalizeWhatsapp("sem número")).toBeNull();
    expect(normalizeWhatsapp("999999999999999999")).toBeNull();
  });
});

describe("pedido de orçamento", () => {
  it("aceita um pedido completo e válido", () => {
    const resultado = quoteRequestSchema.safeParse(pedidoValido);
    expect(resultado.success).toBe(true);
  });

  it("limpa espaços e normaliza o e-mail para minúsculas", () => {
    const resultado = quoteRequestSchema.parse(pedidoValido);
    expect(resultado.fullName).toBe("Maria Souza");
    expect(resultado.email).toBe("maria@exemplo.com.br");
  });

  it.each(["fullName", "email", "whatsapp", "livesRange", "sector"] as const)(
    "recusa quando falta o campo obrigatório %s",
    (campo) => {
      const incompleto = { ...pedidoValido };
      delete (incompleto as Record<string, unknown>)[campo];
      expect(quoteRequestSchema.safeParse(incompleto).success).toBe(false);
    },
  );

  it("recusa e-mail malformado", () => {
    const r = quoteRequestSchema.safeParse({ ...pedidoValido, email: "maria@" });
    expect(r.success).toBe(false);
  });

  it("recusa faixa de vidas fora da lista", () => {
    const r = quoteRequestSchema.safeParse({ ...pedidoValido, livesRange: "1000000" });
    expect(r.success).toBe(false);
  });

  it("recusa área de atuação fora da lista", () => {
    const r = quoteRequestSchema.safeParse({ ...pedidoValido, sector: "astronauta" });
    expect(r.success).toBe(false);
  });

  it("recusa WhatsApp sem DDD", () => {
    const r = quoteRequestSchema.safeParse({ ...pedidoValido, whatsapp: "99100-9999" });
    expect(r.success).toBe(false);
  });

  it("aceita todas as faixas e áreas oferecidas na interface", () => {
    LIVES_RANGES.forEach((faixa) => {
      const r = quoteRequestSchema.safeParse({ ...pedidoValido, livesRange: faixa.value });
      expect(r.success).toBe(true);
    });
    SECTORS.forEach((area) => {
      const r = quoteRequestSchema.safeParse({ ...pedidoValido, sector: area.value });
      expect(r.success).toBe(true);
    });
  });

  it("trata a mensagem como opcional", () => {
    expect(quoteRequestSchema.safeParse(pedidoValido).success).toBe(true);
    expect(
      quoteRequestSchema.safeParse({ ...pedidoValido, message: "Preciso adequar à NR-01." })
        .success,
    ).toBe(true);
  });
});

describe("linha gravada do orçamento", () => {
  it("grava o telefone normalizado, não o que foi digitado", () => {
    const linha = buildQuoteRequestRow(quoteRequestSchema.parse(pedidoValido));
    expect(linha.whatsapp).toBe("5593991009999");
  });

  it("associa o produto de origem quando o pedido veio de uma página de produto", () => {
    const linha = buildQuoteRequestRow(
      quoteRequestSchema.parse({
        ...pedidoValido,
        productId: "psicohub",
        sourcePath: "/produtos/psicohub",
      }),
    );
    expect(linha.product_id).toBe("psicohub");
    expect(linha.source_path).toBe("/produtos/psicohub");
  });

  it("guarda nulo, e não string vazia, quando não há produto nem mensagem", () => {
    const linha = buildQuoteRequestRow(quoteRequestSchema.parse(pedidoValido));
    expect(linha.product_id).toBeNull();
    expect(linha.source_path).toBeNull();
    expect(linha.message).toBeNull();
  });

  it("nasce com status de pedido novo, para o comercial saber o que não foi tratado", () => {
    const linha = buildQuoteRequestRow(quoteRequestSchema.parse(pedidoValido));
    expect(linha.status).toBe("new");
  });

  it("usa os nomes de coluna do banco, não os nomes do formulário", () => {
    const linha = buildQuoteRequestRow(quoteRequestSchema.parse(pedidoValido));
    expect(Object.keys(linha).sort()).toEqual(
      [
        "email",
        "full_name",
        "lives_range",
        "message",
        "product_id",
        "sector",
        "source_path",
        "status",
        "whatsapp",
      ].sort(),
    );
  });
});

describe("dúvida rápida", () => {
  const duvidaValida = {
    fullName: "João Lima",
    email: "joao@exemplo.com.br",
    message: "Vocês atendem empresa do Pará?",
  };

  it("aceita nome, e-mail e mensagem", () => {
    expect(questionSchema.safeParse(duvidaValida).success).toBe(true);
  });

  it("não pede telefone, para não criar atrito em quem só tem uma pergunta", () => {
    const linha = buildQuestionRow(questionSchema.parse(duvidaValida));
    expect(linha).not.toHaveProperty("phone");
    expect(linha).not.toHaveProperty("whatsapp");
  });

  it("recusa mensagem curta demais para ser respondida", () => {
    expect(questionSchema.safeParse({ ...duvidaValida, message: "oi" }).success).toBe(false);
  });

  it("nasce com status de mensagem nova", () => {
    expect(buildQuestionRow(questionSchema.parse(duvidaValida)).status).toBe("new");
  });
});

describe("rótulos para o painel e a exportação", () => {
  it("traduz os códigos gravados para texto legível", () => {
    expect(livesRangeLabel("11-50")).toBe("11 a 50 vidas");
    expect(sectorLabel("clinica-ocupacional")).toBe("Clínica de medicina ocupacional");
  });

  it("devolve o próprio código quando não conhece o valor", () => {
    expect(livesRangeLabel("valor-antigo")).toBe("valor-antigo");
    expect(sectorLabel("valor-antigo")).toBe("valor-antigo");
  });
});
