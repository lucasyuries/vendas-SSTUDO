// ============================================================================
// Matriz de risco — o elemento visual característico do hero
// ----------------------------------------------------------------------------
// Não é decoração. A matriz de probabilidade por severidade é o instrumento
// mais reconhecível da segurança do trabalho: quem trabalha com SST lê essa
// grade todo dia, e é exatamente o que o PsicoHub produz a partir da pesquisa
// psicossocial. Colocá-la no hero diz o que a empresa faz antes de o visitante
// ler uma linha.
//
// Sobre o movimento: é UM momento orquestrado no carregamento — as células
// acendem em varredura diagonal, como uma avaliação sendo preenchida — e não
// mais uma animação de entrada genérica. A animação é feita em CSS, então a
// regra de movimento reduzido do projeto já a desliga automaticamente.
// ============================================================================

const LINHAS = ["Muito alta", "Alta", "Média", "Baixa", "Muito baixa"];
const COLUNAS = ["Leve", "Moderada", "Grave", "Crítica", "Fatal"];

/**
 * Nível de risco de cada célula, de 0 (aceitável) a 3 (crítico).
 * Segue a leitura usual: probabilidade cresce para cima, severidade para a
 * direita, e o canto superior direito concentra o risco intolerável.
 */
const NIVEIS = [
  [1, 2, 3, 3, 3],
  [1, 2, 2, 3, 3],
  [0, 1, 2, 2, 3],
  [0, 1, 1, 2, 2],
  [0, 0, 1, 1, 2],
];

const CORES = ["bg-matrix-0", "bg-matrix-1", "bg-matrix-2", "bg-matrix-3"];

export function RiskMatrix() {
  return (
    <figure className="rounded-2xl border border-on-deep-soft/20 bg-on-deep/[0.04] p-5 sm:p-6">
      <figcaption className="flex items-baseline justify-between gap-3">
        <span className="font-display text-sm font-semibold text-on-deep">Matriz de risco</span>
        <span className="text-xs text-on-deep-soft">probabilidade × severidade</span>
      </figcaption>

      <div className="mt-4 flex gap-2">
        <div className="flex flex-col justify-between py-0.5 text-right text-[10px] leading-none text-on-deep-soft">
          {LINHAS.map((linha) => (
            <span key={linha} className="h-6 leading-6 sm:h-7 sm:leading-7">
              {linha}
            </span>
          ))}
        </div>

        <div className="flex-1">
          <div className="grid grid-cols-5 gap-1" role="img" aria-label={LEGENDA}>
            {NIVEIS.flatMap((linha, i) =>
              linha.map((nivel, j) => (
                <span
                  key={`${i}-${j}`}
                  className={`matrix-cell h-6 rounded-[3px] sm:h-7 ${CORES[nivel]}`}
                  // Varredura diagonal: células mais próximas do canto de maior
                  // risco acendem por último.
                  style={{ animationDelay: `${(i + j) * 55}ms` }}
                />
              )),
            )}
          </div>

          <div className="mt-2 flex justify-between text-[10px] text-on-deep-soft">
            {COLUNAS.map((coluna) => (
              <span key={coluna}>{coluna}</span>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-5 border-t border-on-deep-soft/15 pt-4 text-xs leading-relaxed text-on-deep-soft">
        É esta grade que a fiscalização espera ver — e que o PsicoHub monta sozinho, a partir das
        respostas dos seus colaboradores.
      </p>
    </figure>
  );
}

const LEGENDA =
  "Matriz de risco de cinco por cinco, cruzando probabilidade e severidade. O risco cresce das células verdes, no canto inferior esquerdo, até as vermelhas, no canto superior direito.";
