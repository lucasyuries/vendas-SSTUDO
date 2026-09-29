// ============================================================================
// Recorta a moldura de navegador do mockup do dashboard
// ----------------------------------------------------------------------------
// O arquivo original desenha uma janela de navegador em volta do painel, e o
// campo de endereço traz uma URL desatualizada do sistema.
//
// A primeira tentativa recortou por CSS, com margem negativa e overflow
// escondido. Não funcionou: margem em porcentagem no Tailwind é relativa à
// LARGURA do contêiner, não à altura, então o deslocamento saía maior que o
// necessário — e, pior, a margem negativa encolhe a altura do contêiner, o que
// fazia o rodapé do painel ser cortado.
//
// Recortar o arquivo resolve de vez e sem gambiarra de layout.
// ============================================================================

import sharp from "sharp";

const ORIGEM = "public/hero-dashboard-mockup.webp";
const DESTINO = "public/dashboard-psicohub.webp";

// Limites medidos no arquivo de 1400x860, e não estimados: a moldura externa
// foi localizada por varredura de cor, e a fronteira entre a barra do navegador
// e o cabeçalho do próprio painel, por amostragem vertical de cor em x=700.
//
//   y 40..55  → barra de endereço do navegador (sai)
//   y 72..108 → cabeçalho do painel, com a busca (fica)
//   y 110+    → conteúdo do painel
// A barra lateral é descartada de propósito: no arquivo de origem os rótulos
// dela já vêm truncados ("ral" em vez de "Visão Geral"), porque o mockup foi
// gerado com a lateral parcialmente fora do quadro. Exibir texto cortado passa
// impressão de descuido; enquadrar no conteúdo do painel resolve.
const RECORTE = {
  left: 205,
  top: 72,
  width: 1120,
  height: 700,
};

const origem = sharp(ORIGEM);
const { width, height } = await origem.metadata();

await origem.extract(RECORTE).webp({ quality: 88 }).toFile(DESTINO);

const meta = await sharp(DESTINO).metadata();
console.log(`Recortado: ${width}x${height} -> ${meta.width}x${meta.height}`);
