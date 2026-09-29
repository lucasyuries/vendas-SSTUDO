// ============================================================================
// Geração de CSV
// ----------------------------------------------------------------------------
// Módulo puro, testável. A exportação existe para virar planilha na mão do
// comercial, e é aí que mora a armadilha: o Excel em português abre CSV usando
// a codificação do sistema, não UTF-8, a menos que o arquivo comece com a marca
// de ordem de bytes (BOM). Sem ela, "Denúncia Proativa" chega como
// "DenÃºncia Proativa".
// ============================================================================

export type CsvValue = string | number | null | undefined;

/**
 * Escapa um campo conforme o RFC 4180: aspas duplicadas, e o campo inteiro
 * entre aspas quando contém separador, aspas ou quebra de linha.
 */
export function escapeCsvField(value: CsvValue): string {
  if (value === null || value === undefined) return "";
  const texto = String(value);
  if (/[";\n\r]/.test(texto)) {
    return `"${texto.replace(/"/g, '""')}"`;
  }
  return texto;
}

/**
 * Monta o conteúdo do CSV.
 *
 * Usa ponto e vírgula como separador: é o que o Excel configurado em português
 * espera. Com vírgula, a planilha abre com tudo numa coluna só.
 */
export function buildCsv(headers: string[], rows: CsvValue[][]): string {
  const linhas = [
    headers.map(escapeCsvField).join(";"),
    ...rows.map((linha) => linha.map(escapeCsvField).join(";")),
  ];
  return linhas.join("\r\n");
}

/** Marca de ordem de bytes, para o Excel reconhecer UTF-8. */
export const CSV_BOM = "﻿";

/** Data e hora legíveis em português, para as colunas de data. */
export function formatDateTimeBR(iso: string): string {
  const data = new Date(iso);
  if (Number.isNaN(data.getTime())) return iso;
  return data.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
