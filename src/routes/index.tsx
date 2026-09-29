import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { StickyQuoteBar } from "@/components/StickyQuoteBar";
import { Hero } from "@/sections/Hero";
import { Problem } from "@/sections/Problem";
import { Products } from "@/sections/Products";
import { HowItWorks } from "@/sections/HowItWorks";
import { Compliance } from "@/sections/Compliance";
import { WhySSTudo } from "@/sections/WhySSTudo";
import { FAQ } from "@/sections/FAQ";
import { FinalCTA } from "@/sections/FinalCTA";
import { Contact } from "@/sections/Contact";
import { HOME_FAQ, faqToJsonLd } from "@/lib/faq";
// Gerada por scripts/gerar-og-image.mjs, em 1200x630. Regenerar sempre que o
// título ou a proposta de valor do hero mudarem.
const OG_IMAGE_URL = "https://sstudo.com.br/og-image-sstudo.png";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "SSTudo — Soluções em SST: PGR, ASO, Denúncias e Riscos Psicossociais" },
      {
        name: "description",
        content:
          "A SSTudo reúne quatro soluções para conformidade em Segurança e Saúde no Trabalho: Diagnóstico PGR, Denúncia Proativa, ASO Digital e PsicoHub. Fale com um especialista.",
      },
      {
        name: "keywords",
        content:
          "sst, pgr, aso, canal de denúncias, riscos psicossociais, conformidade sst, segurança do trabalho, gestão de sst, nr1, burnout",
      },
      { name: "author", content: "SSTudo" },
      { name: "robots", content: "index, follow" },
      { name: "language", content: "pt-BR" },
      { name: "theme-color", content: "#0a1628" },
      { name: "msapplication-TileImage", content: "/favicon-192x192.png" },
      { name: "msapplication-TileColor", content: "#225395" },

      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:site_name", content: "SSTudo" },
      {
        property: "og:title",
        content: "SSTudo — Soluções em SST: PGR, ASO, Denúncias e Riscos Psicossociais",
      },
      {
        property: "og:description",
        content:
          "A SSTudo reúne quatro soluções para conformidade em Segurança e Saúde no Trabalho: Diagnóstico PGR, Denúncia Proativa, ASO Digital e PsicoHub. Fale com um especialista.",
      },
      { property: "og:url", content: "https://sstudo.com.br/" },
      { property: "og:image", content: OG_IMAGE_URL },

      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "SSTudo — Conformidade NR-01 | PGR e Burnout sem Planilhas",
      },
      {
        name: "twitter:description",
        content:
          "Adeque sua empresa à NR-01. Pesquisa anônima de burnout, heatmap de riscos e relatório PDF para o PGR. Rápido, seguro e sem planilhas.",
      },
      { name: "twitter:image", content: OG_IMAGE_URL },
    ],
    links: [
      { rel: "canonical", href: "https://sstudo.com.br/" },
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
      { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
      { rel: "icon", type: "image/png", sizes: "48x48", href: "/favicon-48x48.png" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
      { rel: "icon", type: "image/png", sizes: "192x192", href: "/favicon-192x192.png" },
      { rel: "icon", type: "image/png", sizes: "512x512", href: "/favicon-512x512.png" },
    ],
    scripts: [
      {
        src: "https://www.googletagmanager.com/gtag/js?id=G-2HCS0RWKLH",
        async: true,
      },
      {
        children: `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-2HCS0RWKLH');
`,
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              name: "SSTudo",
              url: "https://sstudo.com.br",
              description:
                "Ecossistema de tecnologia para conformidade em Segurança e Saúde no Trabalho, com quatro produtos integrados.",
              contactPoint: {
                "@type": "ContactPoint",
                email: "sstudo.oficial@gmail.com",
                contactType: "sales",
                areaServed: "BR",
                availableLanguage: ["Portuguese"],
              },
            },
          ],
        }),
      },
      {
        type: "application/ld+json",
        // Gerado a partir da mesma fonte que a seção visível da página, para
        // que os dois não possam divergir. Antes eram duas listas separadas, e
        // a estruturada ficou prometendo orientar sobre "o melhor plano"
        // depois de o site ter deixado de vender por assinatura.
        children: JSON.stringify(faqToJsonLd(HOME_FAQ)),
      },
    ],
  }),
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <Products />
        <HowItWorks />
        {/* Ocupa o lugar dos depoimentos fictícios, removidos por não serem
            verificáveis. Diferente deles, cada norma aqui é checável. */}
        <Compliance />
        <WhySSTudo />
        <FAQ />
        <FinalCTA />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFloat />
      <StickyQuoteBar />
    </div>
  );
}
