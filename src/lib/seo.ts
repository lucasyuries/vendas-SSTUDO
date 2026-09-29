// ============================================================================
// Constantes de SEO
// ----------------------------------------------------------------------------
// O domínio estava repetido em cada arquivo de rota, em canonical, og:url e
// og:image. Domínio repetido é domínio que uma hora fica desatualizado só em
// alguns lugares — e o erro passa despercebido porque o site continua
// funcionando.
// ============================================================================

/** Domínio público do site institucional. */
export const SITE_URL = "https://sstudo.com.br";

/**
 * Imagem exibida quando alguém cola um link do site no WhatsApp ou nas redes.
 * Gerada por `scripts/gerar-og-image.mjs`, em 1200x630 — a proporção que as
 * plataformas esperam.
 */
export const OG_IMAGE = `${SITE_URL}/og-image-sstudo.png`;

/** Monta o endereço absoluto de uma página, para canonical e og:url. */
export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path}`;
}
