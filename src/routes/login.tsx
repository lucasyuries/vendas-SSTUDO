// ============================================================================
// /login — autenticação por email + senha
// ============================================================================

import { useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { Loader2, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema } from "@/lib/validations";

type Search = { redirect?: string };

// SEGURANÇA: aceita apenas paths internos relativos (mesma origem) para
// impedir open-redirect (ex.: ?redirect=https://evil.com).
function sanitizeRedirect(value: unknown): string | undefined {
  if (typeof value !== "string" || value.length === 0) return undefined;
  // precisa começar com "/" e NÃO pode ser "//..." (protocolo-relativo) nem "/\..."
  if (!value.startsWith("/")) return undefined;
  if (value.startsWith("//") || value.startsWith("/\\")) return undefined;
  return value;
}

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    redirect: sanitizeRedirect(s.redirect),
  }),
  head: () => ({
    meta: [
      { title: "Entrar — SSTudo" },
      { name: "description", content: "Acesse sua conta SSTudo." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { redirect } = useSearch({ from: "/login" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Dados inválidos");
      return;
    }
    setLoading(true);
    const { error: authError } = await supabase.auth.signInWithPassword(parsed.data);
    setLoading(false);
    if (authError) {
      setError(
        authError.message === "Invalid login credentials"
          ? "E-mail ou senha incorretos."
          : authError.message,
      );
      return;
    }
    navigate({ to: redirect ?? "/", search: {} as never });
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 justify-center mb-8">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ShieldCheck className="h-5 w-5" strokeWidth={2.2} />
          </span>
          <span className="font-display text-2xl text-foreground">SSTudo</span>
        </Link>

        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-[var(--shadow-soft)]">
          <h1 className="font-display text-2xl text-foreground text-center">Entrar</h1>
          <p className="mt-1 text-center text-sm text-muted-foreground">
            Acesse sua conta para continuar
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <Link
                  to="/esqueci-senha"
                  className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
                >
                  Esqueci minha senha
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            {error && (
              <div className="rounded-lg border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button type="submit" disabled={loading} size="lg" className="w-full">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Entrar
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Acesso restrito à equipe SSTudo. Fale com o administrador para solicitar uma conta.
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">
            ← Voltar para o site
          </Link>
        </p>
      </div>
    </div>
  );
}
