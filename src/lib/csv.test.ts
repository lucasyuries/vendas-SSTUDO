import { describe, expect, it } from "vitest";
import { buildCsv, escapeCsvField, formatDateTimeBR } from "@/lib/csv";

describe("escape de campo CSV", () => {
  it("deixa em paz o texto simples", () => {
    expect(escapeCsvField("Maria Souza")).toBe("Maria Souza");
  });

  it("trata nulo e indefinido como campo vazio", () => {
    expect(escapeCsvField(null)).toBe("");
    expect(escapeCsvField(undefined)).toBe("");
  });

  it("protege o campo que contém o separador", () => {
    expect(escapeCsvField("Souza; Maria")).toBe('"Souza; Maria"');
  });

  it("duplica as aspas e envolve o campo", () => {
    expect(escapeCsvField('Ela disse "sim"')).toBe('"Ela disse ""sim"""');
  });

  it("protege mensagem com quebra de linha, que é comum em texto livre", () => {
    expect(escapeCsvField("Primeira linha\nSegunda")).toBe('"Primeira linha\nSegunda"');
  });

  it("converte número para texto", () => {
    expect(escapeCsvField(42)).toBe("42");
  });
});

describe("montagem do CSV", () => {
  it("monta cabeçalho e linhas separados por ponto e vírgula", () => {
    const csv = buildCsv(
      ["Nome", "E-mail"],
      [
        ["Maria", "maria@exemplo.com.br"],
        ["João", "joao@exemplo.com.br"],
      ],
    );
    expect(csv).toBe("Nome;E-mail\r\nMaria;maria@exemplo.com.br\r\nJoão;joao@exemplo.com.br");
  });

  it("usa quebra de linha do Windows, que é o que o Excel espera", () => {
    const csv = buildCsv(["A"], [["1"], ["2"]]);
    expect(csv.split("\r\n")).toHaveLength(3);
  });

  it("não quebra quando a mensagem do lead tem ponto e vírgula e aspas", () => {
    const csv = buildCsv(["Mensagem"], [['Preciso de PGR; urgente. Ele disse "não temos"']]);
    expect(csv).toBe('Mensagem\r\n"Preciso de PGR; urgente. Ele disse ""não temos"""');
  });

  it("aceita tabela sem nenhuma linha", () => {
    expect(buildCsv(["Nome"], [])).toBe("Nome");
  });
});

describe("data legível", () => {
  it("formata no padrão brasileiro", () => {
    const formatada = formatDateTimeBR("2026-09-07T14:30:00.000Z");
    // Depende do fuso de quem exporta; o que importa é o formato.
    expect(formatada).toMatch(/^\d{2}\/\d{2}\/\d{4},? \d{2}:\d{2}$/);
  });

  it("devolve o valor original quando a data é inválida", () => {
    expect(formatDateTimeBR("nao-e-data")).toBe("nao-e-data");
  });
});
