// ============================================================================
// Gerador da imagem de compartilhamento (Open Graph), 1200x630
// ----------------------------------------------------------------------------
// Roda sob demanda: `node scripts/gerar-og-image.mjs`. O resultado é versionado
// em public/og-image-sstudo.png, para não depender de geração no build.
//
// Existe como script, e não como imagem feita à mão, porque o texto muda junto
// com a proposta de valor do site — regerar é mais barato que reabrir um editor
// gráfico. As cores vêm dos tokens em src/styles.css.
// ============================================================================

import sharp from "sharp";
import { readFileSync } from "node:fs";

const LARGURA = 1200;
const ALTURA = 630;

const FUNDO = "#0a1628";
const BRILHO = "#0f2040";
const DESTAQUE = "#60a5fa";
const CLARO = "#ffffff";
const SUAVE = "#94a3b8";

const svg = `<svg width="${LARGURA}" height="${ALTURA}" viewBox="0 0 ${LARGURA} ${ALTURA}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="brilho" cx="22%" cy="42%" r="72%">
      <stop offset="0%" stop-color="${BRILHO}"/>
      <stop offset="100%" stop-color="${FUNDO}"/>
    </radialGradient>
  </defs>
  <rect width="${LARGURA}" height="${ALTURA}" fill="${FUNDO}"/>
  <rect width="${LARGURA}" height="${ALTURA}" fill="url(#brilho)"/>

  <text x="80" y="330" font-family="Roboto, Arial, Helvetica, sans-serif" font-size="72" font-weight="700" fill="${CLARO}">Conformidade em SST.</text>
  <text x="80" y="416" font-family="Roboto, Arial, Helvetica, sans-serif" font-size="72" font-weight="700" fill="${DESTAQUE}">Sem complicação.</text>

  <text x="80" y="482" font-family="Roboto, Arial, Helvetica, sans-serif" font-size="28" fill="${SUAVE}">PGR · ASO · Riscos psicossociais · Canal de denúncias</text>

  <rect x="80" y="530" width="1040" height="1.5" fill="${SUAVE}" opacity="0.22"/>

  <text x="80" y="580" font-family="Roboto, Arial, Helvetica, sans-serif" font-size="25" fill="${SUAVE}">NR-01</text>
  <text x="196" y="580" font-family="Roboto, Arial, Helvetica, sans-serif" font-size="25" fill="${SUAVE}">eSocial SST</text>
  <text x="380" y="580" font-family="Roboto, Arial, Helvetica, sans-serif" font-size="25" fill="${SUAVE}">PCMSO</text>
  <text x="518" y="580" font-family="Roboto, Arial, Helvetica, sans-serif" font-size="25" fill="${SUAVE}">LGPD</text>
</svg>`;

// O logo é azul sobre transparente, então precisa de uma placa branca para
// permanecer legível contra o fundo azul-escuro.
const logo = await sharp(readFileSync("public/logo-sstudo.png"))
  .resize({ width: 264 })
  .toBuffer();

const placa = await sharp({
  create: {
    width: 312,
    height: 108,
    channels: 4,
    background: { r: 255, g: 255, b: 255, alpha: 1 },
  },
})
  .composite([{ input: logo, gravity: "centre" }])
  .png()
  .toBuffer();

await sharp(Buffer.from(svg))
  .composite([{ input: placa, top: 92, left: 80 }])
  .png({ compressionLevel: 9 })
  .toFile("public/og-image-sstudo.png");

const meta = await sharp("public/og-image-sstudo.png").metadata();
console.log(`Imagem gerada: ${meta.width}x${meta.height}`);
