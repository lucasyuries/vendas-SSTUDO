// ============================================================================
// Seção de contato — dois caminhos, lado a lado
// ----------------------------------------------------------------------------
// Quem está comprando não pode se perder no formulário curto, e quem só tem
// uma pergunta não pode ser empurrado para o longo. Por isso os dois aparecem
// juntos, rotulados, com o de orçamento em destaque.
// ============================================================================

import { Mail, MapPin, MessageCircleQuestion } from "lucide-react";
import { FadeInView } from "@/components/FadeInView";
import { QuoteForm } from "@/components/QuoteForm";
import { QuestionForm } from "@/components/QuestionForm";
import { SectionLabel } from "@/components/SectionLabel";

export function Contact() {
  return (
    <section id="contato" className="bg-surface-subtle py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <FadeInView className="mx-auto max-w-2xl text-center">
          <SectionLabel>Fale com a SSTudo</SectionLabel>
          <h2 className="mt-4 font-display text-section font-bold tracking-tight text-foreground">
            Peça um orçamento para a sua realidade
          </h2>
          <p className="mt-4 text-lead text-foreground-soft">
            O preço em SST depende de quantas vidas você gerencia e do seu setor. Conte esses dois
            dados e devolvemos uma proposta, sem compromisso.
          </p>
        </FadeInView>

        <div className="mt-12 grid gap-8 lg:grid-cols-5">
          {/* Orçamento — o caminho principal */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] sm:p-8">
              <h3 className="font-display text-card font-semibold text-foreground">
                Solicitar orçamento
              </h3>
              <p className="mt-1 text-sm text-foreground-soft">
                Seis campos. Leva menos de um minuto.
              </p>
              <div className="mt-6">
                <QuoteForm sourcePath="/" />
              </div>
            </div>
          </div>

          {/* Dúvida e dados de atendimento */}
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-2xl border border-dashed border-border-strong bg-secondary p-6">
              <div className="flex items-center gap-2">
                <MessageCircleQuestion className="h-5 w-5 text-primary" />
                <h3 className="font-display text-base font-semibold text-foreground">
                  Só uma dúvida?
                </h3>
              </div>
              <p className="mt-1 text-sm text-foreground-soft">
                Se você ainda não está pedindo proposta, pergunte por aqui.
              </p>
              <div className="mt-5">
                <QuestionForm />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
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
              </div>
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-tint text-primary">
                  <MapPin className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-medium text-foreground">Atendimento</p>
                  <p className="text-sm text-foreground-soft">Seg a sex, das 9h às 18h</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
