// ============================================================================
// Página de contato
// ----------------------------------------------------------------------------
// Existe por dois motivos.
//
// O primeiro é de conversão: dá um destino permanente para o botão principal
// do cabeçalho. Antes ele apontava para uma âncora que só existe na página
// inicial, então em toda página interna o botão não fazia nada.
//
// O segundo é de atrito: quem está comprando e quem só tem uma pergunta
// precisam de caminhos diferentes, lado a lado e claramente rotulados. Empurrar
// quem tem uma dúvida rápida para um formulário de qualificação comercial é a
// forma mais fácil de perder essa pessoa.
// ============================================================================

import { createFileRoute } from "@tanstack/react-router";
import { Clock, Mail, MessageCircleQuestion, MessageSquare, ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { FadeInView } from "@/components/FadeInView";
import { QuoteForm } from "@/components/QuoteForm";
import { QuestionForm } from "@/components/QuestionForm";
import { OG_IMAGE, absoluteUrl } from "@/lib/seo";
import { SectionLabel } from "@/components/SectionLabel";

const TITULO = "Fale com a SSTudo — orçamento e dúvidas sobre SST";
const DESCRICAO =
  "Peça um orçamento sob medida para a sua empresa ou tire uma dúvida sobre PGR, ASO, riscos psicossociais e canal de denúncias. Retornamos em até 1 dia útil.";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: `${TITULO} | SSTudo` },
      { name: "description", content: DESCRICAO },
      { name: "robots", content: "index, follow" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:title", content: TITULO },
      { property: "og:description", content: DESCRICAO },
      { property: "og:url", content: absoluteUrl("/contato") },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/contato") }],
  }),
  component: PaginaContato,
});

function PaginaContato() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <section id="top" className="bg-brand-deep">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
            <h1 className="mt-4 max-w-3xl font-display text-display font-bold text-on-deep">
              Um orçamento feito para a sua realidade
            </h1>
            <p className="mt-5 max-w-2xl text-lead text-on-deep-soft">
              Em SST não existe preço de tabela: o valor depende de quantas vidas você gerencia e do
              seu setor de atuação. Conte esses dois dados e devolvemos uma proposta.
            </p>
          </div>
        </section>

        <section id="orcamento" className="bg-background py-14 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid gap-8 lg:grid-cols-5">
              {/* Caminho principal: orçamento */}
              <div className="lg:col-span-3">
                <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] sm:p-8">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    <h2 className="font-display text-card font-semibold text-foreground">
                      Solicitar orçamento
                    </h2>
                  </div>
                  <p className="mt-1 text-sm text-foreground-soft">
                    Seis campos, sendo um opcional. Leva menos de um minuto.
                  </p>
                  <div className="mt-6">
                    <QuoteForm sourcePath="/contato" />
                  </div>
                </div>
              </div>

              {/* Caminho secundário: dúvida, e dados de atendimento */}
              <div className="space-y-6 lg:col-span-2">
                <div
                  id="duvida"
                  className="rounded-2xl border border-dashed border-border-strong bg-secondary p-6"
                >
                  <div className="flex items-center gap-2">
                    <MessageCircleQuestion className="h-5 w-5 text-primary" />
                    <h2 className="font-display text-base font-semibold text-foreground">
                      Só uma dúvida?
                    </h2>
                  </div>
                  <p className="mt-1 text-sm text-foreground-soft">
                    Se você ainda não está avaliando proposta, pergunte por aqui. Três campos.
                  </p>
                  <div className="mt-5">
                    <QuestionForm />
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-card p-6">
                  <h2 className="font-display text-base font-semibold text-foreground">
                    Outros canais
                  </h2>
                  <ul className="mt-4 space-y-4">
                    <li className="flex items-start gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-tint text-primary">
                        <Mail className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-sm font-medium text-foreground">E-mail</p>
                        <a
                          href="mailto:contato@sstudo.com.br"
                          className="inline-flex min-h-11 items-center text-sm text-foreground-soft hover:text-foreground"
                        >
                          contato@sstudo.com.br
                        </a>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-tint text-primary">
                        <MessageSquare className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-sm font-medium text-foreground">WhatsApp</p>
                        <a
                          href="https://wa.me/5593992397414"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-11 items-center text-sm text-foreground-soft hover:text-foreground"
                        >
                          (93) 99239-7414
                        </a>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-tint text-primary">
                        <Clock className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-sm font-medium text-foreground">Atendimento</p>
                        <p className="text-sm text-foreground-soft">Seg a sex, das 9h às 18h</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="flex items-start gap-3 rounded-2xl border border-border bg-surface-subtle p-5">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <p className="text-xs leading-relaxed text-foreground-soft">
                    Seus dados são usados apenas para responder a este contato e não são
                    compartilhados com terceiros.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-surface-subtle py-14 lg:py-16">
          <FadeInView className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <SectionLabel>Próximos passos</SectionLabel>
            <h2 className="font-display text-section font-bold tracking-tight text-foreground">
              O que acontece depois que você envia
            </h2>
            <ol className="mt-8 grid gap-4 text-left sm:grid-cols-3">
              {[
                {
                  titulo: "Recebemos o pedido",
                  texto:
                    "Ele chega direto para a equipe comercial, com os dados que você informou.",
                },
                {
                  titulo: "Retornamos em até 1 dia útil",
                  texto: "Pelo canal que você preferir: WhatsApp ou e-mail.",
                },
                {
                  titulo: "Você recebe a proposta",
                  texto:
                    "Com os produtos que resolvem o seu caso. Sem obrigação de contratar os quatro.",
                },
              ].map((passo, indice) => (
                <li key={passo.titulo} className="rounded-2xl border border-border bg-card p-5">
                  <span className="font-display text-2xl font-bold text-muted-foreground">
                    {String(indice + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-2 font-display text-base font-semibold text-foreground">
                    {passo.titulo}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-foreground-soft">{passo.texto}</p>
                </li>
              ))}
            </ol>
          </FadeInView>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
