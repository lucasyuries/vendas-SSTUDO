// ============================================================================
// Formulário de dúvida rápida
// ----------------------------------------------------------------------------
// Três campos. Existe para que quem só tem uma pergunta não seja empurrado
// para o formulário de orçamento e acabe indo embora.
// ============================================================================

import { useState, type FormEvent } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { questionSchema } from "@/lib/leads";

type Campo = "fullName" | "email" | "message";

const VAZIO: Record<Campo, string> = { fullName: "", email: "", message: "" };

export function QuestionForm() {
  const [form, setForm] = useState<Record<Campo, string>>(VAZIO);
  const [erros, setErros] = useState<Partial<Record<Campo, string>>>({});
  const [falha, setFalha] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  function validarCampo(campo: Campo, valor: string) {
    const resultado = questionSchema.safeParse({ ...form, [campo]: valor });
    if (resultado.success) {
      setErros((e) => ({ ...e, [campo]: undefined }));
      return;
    }
    const doCampo = resultado.error.issues.find((i) => i.path[0] === campo);
    setErros((e) => ({ ...e, [campo]: doCampo?.message }));
  }

  function alterar(campo: Campo, valor: string) {
    setForm((f) => ({ ...f, [campo]: valor }));
    if (erros[campo]) setErros((e) => ({ ...e, [campo]: undefined }));
  }

  async function enviar(evento: FormEvent) {
    evento.preventDefault();
    setFalha(null);

    const resultado = questionSchema.safeParse(form);
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
      const { submitQuestion } = await import("@/lib/leads.server");
      await submitQuestion({ data: resultado.data });
      setEnviado(true);
    } catch (erro) {
      setFalha(erro instanceof Error ? erro.message : "Erro inesperado.");
    } finally {
      setEnviando(false);
    }
  }

  if (enviado) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-success" />
        <h3 className="mt-3 font-display text-base text-foreground">Mensagem enviada</h3>
        <p className="mt-2 text-sm text-foreground-soft">Respondemos em até 1 dia útil.</p>
        <Button
          variant="outline"
          className="mt-5 min-h-12"
          onClick={() => {
            setForm(VAZIO);
            setEnviado(false);
          }}
        >
          Enviar outra
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} noValidate className="space-y-4">
      <div>
        <Label htmlFor="d-nome">
          Seu nome<span className="ml-0.5 text-destructive">*</span>
        </Label>
        <Input
          id="d-nome"
          className="mt-1.5 min-h-12"
          autoComplete="name"
          value={form.fullName}
          onChange={(e) => alterar("fullName", e.target.value)}
          onBlur={(e) => validarCampo("fullName", e.target.value)}
          disabled={enviando}
          aria-invalid={Boolean(erros.fullName)}
        />
        {erros.fullName && (
          <p className="mt-1.5 text-sm text-destructive" role="alert">
            {erros.fullName}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="d-email">
          E-mail<span className="ml-0.5 text-destructive">*</span>
        </Label>
        <Input
          id="d-email"
          type="email"
          className="mt-1.5 min-h-12"
          autoComplete="email"
          value={form.email}
          onChange={(e) => alterar("email", e.target.value)}
          onBlur={(e) => validarCampo("email", e.target.value)}
          disabled={enviando}
          aria-invalid={Boolean(erros.email)}
        />
        {erros.email && (
          <p className="mt-1.5 text-sm text-destructive" role="alert">
            {erros.email}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="d-msg">
          Sua dúvida<span className="ml-0.5 text-destructive">*</span>
        </Label>
        <Textarea
          id="d-msg"
          rows={4}
          className="mt-1.5"
          placeholder="O que você gostaria de saber?"
          value={form.message}
          onChange={(e) => alterar("message", e.target.value)}
          onBlur={(e) => validarCampo("message", e.target.value)}
          disabled={enviando}
          aria-invalid={Boolean(erros.message)}
        />
        {erros.message && (
          <p className="mt-1.5 text-sm text-destructive" role="alert">
            {erros.message}
          </p>
        )}
      </div>

      {falha && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive"
        >
          {falha}
        </div>
      )}

      <Button type="submit" disabled={enviando} variant="outline" className="min-h-12 w-full">
        {enviando ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Enviar dúvida
      </Button>
    </form>
  );
}
