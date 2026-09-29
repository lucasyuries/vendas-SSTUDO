// ============================================================================
// Formulário de solicitação de orçamento
// ----------------------------------------------------------------------------
// Seis campos, etapa única, coluna única. Quando renderizado dentro da página
// de um produto, o produto de interesse já vem preenchido e não aparece como
// campo — o visitante não deve informar de novo algo que a página já sabe.
// ============================================================================

import { useState, type FormEvent } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LIVES_RANGES, SECTORS, quoteRequestSchema } from "@/lib/leads";

type Campo = "fullName" | "whatsapp" | "email" | "livesRange" | "sector" | "message";

const VAZIO: Record<Campo, string> = {
  fullName: "",
  whatsapp: "",
  email: "",
  livesRange: "",
  sector: "",
  message: "",
};

const CAMPO_SELECT =
  "flex min-h-12 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm";

export function QuoteForm({ productId, sourcePath }: { productId?: string; sourcePath?: string }) {
  const [form, setForm] = useState<Record<Campo, string>>(VAZIO);
  const [erros, setErros] = useState<Partial<Record<Campo, string>>>({});
  const [falha, setFalha] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  /** Valida um campo isolado, para o erro aparecer no momento certo. */
  function validarCampo(campo: Campo, valor: string) {
    const resultado = quoteRequestSchema.safeParse({ ...form, [campo]: valor });
    if (resultado.success) {
      setErros((e) => ({ ...e, [campo]: undefined }));
      return;
    }
    const doCampo = resultado.error.issues.find((i) => i.path[0] === campo);
    setErros((e) => ({ ...e, [campo]: doCampo?.message }));
  }

  function alterar(campo: Campo, valor: string) {
    setForm((f) => ({ ...f, [campo]: valor }));
    // O erro some assim que a pessoa começa a corrigir, em vez de ficar
    // piscando em vermelho enquanto ela digita.
    if (erros[campo]) setErros((e) => ({ ...e, [campo]: undefined }));
  }

  async function enviar(evento: FormEvent) {
    evento.preventDefault();
    setFalha(null);

    const resultado = quoteRequestSchema.safeParse({ ...form, productId, sourcePath });
    if (!resultado.success) {
      const porCampo: Partial<Record<Campo, string>> = {};
      resultado.error.issues.forEach((i) => {
        const campo = i.path[0] as Campo;
        if (!porCampo[campo]) porCampo[campo] = i.message;
      });
      setErros(porCampo);
      return;
    }

    setEnviando(true);
    try {
      const { submitQuoteRequest } = await import("@/lib/leads.server");
      await submitQuoteRequest({ data: resultado.data });
      setEnviado(true);
    } catch (erro) {
      // Não limpamos o formulário: quem errou não pode perder o que digitou.
      setFalha(erro instanceof Error ? erro.message : "Erro inesperado.");
    } finally {
      setEnviando(false);
    }
  }

  if (enviado) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-success" />
        <h3 className="mt-4 font-display text-card text-foreground">Pedido enviado</h3>
        <p className="mt-2 text-sm text-foreground-soft">
          Recebemos seu pedido de orçamento. Nossa equipe retorna em até 1 dia útil.
        </p>
        <Button
          variant="outline"
          className="mt-6 min-h-12"
          onClick={() => {
            setForm(VAZIO);
            setEnviado(false);
          }}
        >
          Enviar outro pedido
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} noValidate className="space-y-4">
      <Campo0
        id="q-nome"
        rotulo="Seu nome"
        erro={erros.fullName}
        obrigatorio
        input={
          <Input
            id="q-nome"
            className="min-h-12"
            autoComplete="name"
            value={form.fullName}
            onChange={(e) => alterar("fullName", e.target.value)}
            onBlur={(e) => validarCampo("fullName", e.target.value)}
            disabled={enviando}
            aria-invalid={Boolean(erros.fullName)}
          />
        }
      />

      <Campo0
        id="q-whats"
        rotulo="WhatsApp"
        erro={erros.whatsapp}
        obrigatorio
        input={
          <Input
            id="q-whats"
            type="tel"
            inputMode="tel"
            className="min-h-12"
            placeholder="(93) 99100-9999"
            autoComplete="tel"
            value={form.whatsapp}
            onChange={(e) => alterar("whatsapp", e.target.value)}
            onBlur={(e) => validarCampo("whatsapp", e.target.value)}
            disabled={enviando}
            aria-invalid={Boolean(erros.whatsapp)}
          />
        }
      />

      <Campo0
        id="q-email"
        rotulo="E-mail"
        erro={erros.email}
        obrigatorio
        input={
          <Input
            id="q-email"
            type="email"
            className="min-h-12"
            autoComplete="email"
            value={form.email}
            onChange={(e) => alterar("email", e.target.value)}
            onBlur={(e) => validarCampo("email", e.target.value)}
            disabled={enviando}
            aria-invalid={Boolean(erros.email)}
          />
        }
      />

      <Campo0
        id="q-vidas"
        rotulo="Quantas vidas são gerenciadas?"
        erro={erros.livesRange}
        obrigatorio
        input={
          <select
            id="q-vidas"
            className={CAMPO_SELECT}
            value={form.livesRange}
            onChange={(e) => {
              alterar("livesRange", e.target.value);
              validarCampo("livesRange", e.target.value);
            }}
            disabled={enviando}
            aria-invalid={Boolean(erros.livesRange)}
          >
            <option value="">Selecione</option>
            {LIVES_RANGES.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        }
      />

      <Campo0
        id="q-area"
        rotulo="Qual sua área de atuação?"
        erro={erros.sector}
        obrigatorio
        input={
          <select
            id="q-area"
            className={CAMPO_SELECT}
            value={form.sector}
            onChange={(e) => {
              alterar("sector", e.target.value);
              validarCampo("sector", e.target.value);
            }}
            disabled={enviando}
            aria-invalid={Boolean(erros.sector)}
          >
            <option value="">Selecione</option>
            {SECTORS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        }
      />

      <Campo0
        id="q-msg"
        rotulo="Como podemos lhe ajudar?"
        erro={erros.message}
        input={
          <Textarea
            id="q-msg"
            rows={4}
            placeholder="Opcional. Conte o que sua empresa precisa resolver."
            value={form.message}
            onChange={(e) => alterar("message", e.target.value)}
            disabled={enviando}
          />
        }
      />

      {falha && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive"
        >
          {falha}
        </div>
      )}

      <Button type="submit" disabled={enviando} size="lg" className="min-h-12 w-full">
        {enviando ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Solicitar orçamento
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Retornamos em até 1 dia útil. Seus dados não são compartilhados com terceiros.
      </p>
    </form>
  );
}

/** Rótulo, campo e mensagem de erro, sempre na mesma ordem e em coluna única. */
function Campo0({
  id,
  rotulo,
  erro,
  obrigatorio,
  input,
}: {
  id: string;
  rotulo: string;
  erro?: string;
  obrigatorio?: boolean;
  input: React.ReactNode;
}) {
  return (
    <div>
      <Label htmlFor={id}>
        {rotulo}
        {obrigatorio && <span className="ml-0.5 text-destructive">*</span>}
      </Label>
      <div className="mt-1.5">{input}</div>
      {erro && (
        <p className="mt-1.5 text-sm text-destructive" role="alert">
          {erro}
        </p>
      )}
    </div>
  );
}
