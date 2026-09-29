// ============================================================================
// Painel administrativo de leads
// ----------------------------------------------------------------------------
// Duas listas separadas, porque são atendimentos diferentes: orçamento é
// oportunidade comercial, dúvida é atendimento. Misturá-las faz o comercial
// perder tempo triando.
//
// A verificação de permissão aqui é conveniência de interface. A fronteira de
// segurança de verdade está na função de servidor, que confere o papel antes de
// devolver qualquer dado — ver admin.server.ts.
// ============================================================================

import { useCallback, useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Download, Loader2, MessageCircleQuestion, RefreshCw, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/integrations/supabase/auth-context";
import { CSV_BOM, buildCsv, formatDateTimeBR } from "@/lib/csv";
import { livesRangeLabel, sectorLabel } from "@/lib/leads";
import { getProduct } from "@/lib/products";
import type { LeadsPayload, QuestionLead, QuoteLead } from "@/lib/admin.server";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Painel de leads — SSTudo" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: PainelAdmin,
});

type Aba = "orcamentos" | "duvidas";

function PainelAdmin() {
  const { user, loading: carregandoAuth, signOut } = useAuth();
  const navigate = useNavigate();

  const [dados, setDados] = useState<LeadsPayload | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [aba, setAba] = useState<Aba>("orcamentos");

  // Quem não está autenticado vai para o login, guardando o destino.
  useEffect(() => {
    if (!carregandoAuth && !user) {
      navigate({ to: "/login", search: { redirect: "/admin" } as never });
    }
  }, [carregandoAuth, user, navigate]);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const { listLeads } = await import("@/lib/admin.server");
      setDados(await listLeads());
    } catch (e) {
      // O framework encapsula a resposta lançada pelo servidor e entrega
      // "HTTPError" como mensagem, que não diz nada a quem está olhando a tela.
      // O motivo real fica no log; aqui vai um texto que orienta.
      console.error("[admin] falha ao carregar leads:", e);
      setErro(
        "Não foi possível carregar os leads. Verifique se sua conta tem permissão de acesso ao painel.",
      );
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    if (user) void carregar();
  }, [user, carregar]);

  if (carregandoAuth || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const orcamentos = dados?.quotes ?? [];
  const duvidas = dados?.questions ?? [];

  return (
    <div className="min-h-screen bg-surface-subtle">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div>
            <h1 className="font-display text-card font-semibold text-foreground">
              Painel de leads
            </h1>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => void carregar()}
              className="min-h-11"
            >
              <RefreshCw className="h-4 w-4" /> Atualizar
            </Button>
            <Button variant="ghost" size="sm" onClick={() => signOut()} className="min-h-11">
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="flex flex-wrap gap-2">
          <BotaoAba
            ativa={aba === "orcamentos"}
            onClick={() => setAba("orcamentos")}
            icone={<MessageSquare className="h-4 w-4" />}
            rotulo="Orçamentos"
            quantidade={orcamentos.length}
          />
          <BotaoAba
            ativa={aba === "duvidas"}
            onClick={() => setAba("duvidas")}
            icone={<MessageCircleQuestion className="h-4 w-4" />}
            rotulo="Dúvidas"
            quantidade={duvidas.length}
          />
        </div>

        {erro && (
          <div
            role="alert"
            className="mt-6 rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive"
          >
            {erro}
          </div>
        )}

        {carregando && !dados && (
          <div className="mt-10 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Carregando…
          </div>
        )}

        {dados && aba === "orcamentos" && <ListaOrcamentos itens={orcamentos} />}
        {dados && aba === "duvidas" && <ListaDuvidas itens={duvidas} />}
      </main>
    </div>
  );
}

function BotaoAba({
  ativa,
  onClick,
  icone,
  rotulo,
  quantidade,
}: {
  ativa: boolean;
  onClick: () => void;
  icone: React.ReactNode;
  rotulo: string;
  quantidade: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={ativa ? "true" : undefined}
      className={`inline-flex min-h-11 items-center gap-2 rounded-lg border px-4 text-sm font-medium transition-colors ${
        ativa
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-foreground-soft hover:border-border-strong"
      }`}
    >
      {icone}
      {rotulo}
      <span
        className={`rounded-full px-2 py-0.5 text-xs ${
          ativa ? "bg-primary-foreground/20" : "bg-secondary text-muted-foreground"
        }`}
      >
        {quantidade}
      </span>
    </button>
  );
}

/** Dispara o download de um CSV já com a marca de codificação. */
function baixarCsv(nomeArquivo: string, conteudo: string) {
  const blob = new Blob([CSV_BOM + conteudo], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = nomeArquivo;
  link.click();
  URL.revokeObjectURL(url);
}

function hoje() {
  return new Date().toISOString().slice(0, 10);
}

function linkWhatsapp(numero: string) {
  return `https://wa.me/${numero.replace(/\D/g, "")}`;
}

function ListaOrcamentos({ itens }: { itens: QuoteLead[] }) {
  function exportar() {
    const csv = buildCsv(
      [
        "Data",
        "Nome",
        "WhatsApp",
        "E-mail",
        "Vidas gerenciadas",
        "Área de atuação",
        "Produto de interesse",
        "Origem",
        "Mensagem",
        "Status",
      ],
      itens.map((i) => [
        formatDateTimeBR(i.created_at),
        i.full_name,
        i.whatsapp,
        i.email,
        livesRangeLabel(i.lives_range),
        sectorLabel(i.sector),
        i.product_id ? (getProduct(i.product_id)?.name ?? i.product_id) : "",
        i.source_path ?? "",
        i.message ?? "",
        i.status,
      ]),
    );
    baixarCsv(`orcamentos-sstudo-${hoje()}.csv`, csv);
  }

  if (itens.length === 0) {
    return <Vazio texto="Nenhum pedido de orçamento recebido ainda." />;
  }

  return (
    <div className="mt-6">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={exportar} className="min-h-11">
          <Download className="h-4 w-4" /> Exportar CSV
        </Button>
      </div>

      <ul className="mt-4 space-y-4">
        {itens.map((lead) => (
          <li key={lead.id} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-display text-base font-semibold text-foreground">
                  {lead.full_name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDateTimeBR(lead.created_at)}
                  {lead.product_id && (
                    <> · interesse em {getProduct(lead.product_id)?.name ?? lead.product_id}</>
                  )}
                </p>
              </div>
              <a
                href={linkWhatsapp(lead.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-whatsapp px-4 text-sm font-semibold text-white"
              >
                <MessageSquare className="h-4 w-4" /> Abrir WhatsApp
              </a>
            </div>

            <dl className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
              <Campo rotulo="Vidas gerenciadas" valor={livesRangeLabel(lead.lives_range)} />
              <Campo rotulo="Área de atuação" valor={sectorLabel(lead.sector)} />
              <Campo rotulo="E-mail" valor={lead.email} href={`mailto:${lead.email}`} />
              <Campo rotulo="Origem" valor={lead.source_path ?? "—"} />
            </dl>

            {lead.message && (
              <div className="mt-4 rounded-lg bg-surface-subtle p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Mensagem
                </p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-foreground-soft">
                  {lead.message}
                </p>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ListaDuvidas({ itens }: { itens: QuestionLead[] }) {
  function exportar() {
    const csv = buildCsv(
      ["Data", "Nome", "E-mail", "Telefone", "Mensagem", "Status"],
      itens.map((i) => [
        formatDateTimeBR(i.created_at),
        i.full_name,
        i.email,
        i.phone ?? "",
        i.message,
        i.status,
      ]),
    );
    baixarCsv(`duvidas-sstudo-${hoje()}.csv`, csv);
  }

  if (itens.length === 0) {
    return <Vazio texto="Nenhuma dúvida recebida ainda." />;
  }

  return (
    <div className="mt-6">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={exportar} className="min-h-11">
          <Download className="h-4 w-4" /> Exportar CSV
        </Button>
      </div>

      <ul className="mt-4 space-y-4">
        {itens.map((lead) => (
          <li key={lead.id} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-display text-base font-semibold text-foreground">
                  {lead.full_name}
                </p>
                <p className="text-xs text-muted-foreground">{formatDateTimeBR(lead.created_at)}</p>
              </div>
              <a
                href={`mailto:${lead.email}`}
                className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border px-4 text-sm font-medium text-foreground"
              >
                Responder por e-mail
              </a>
            </div>

            <dl className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
              <Campo rotulo="E-mail" valor={lead.email} href={`mailto:${lead.email}`} />
              {lead.phone && (
                <Campo rotulo="Telefone" valor={lead.phone} href={linkWhatsapp(lead.phone)} />
              )}
            </dl>

            <div className="mt-4 rounded-lg bg-surface-subtle p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Mensagem
              </p>
              <p className="mt-1 whitespace-pre-wrap text-sm text-foreground-soft">
                {lead.message}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Campo({ rotulo, valor, href }: { rotulo: string; valor: string; href?: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {rotulo}
      </dt>
      <dd className="mt-0.5 text-sm text-foreground">
        {href ? (
          <a href={href} className="hover:underline">
            {valor}
          </a>
        ) : (
          valor
        )}
      </dd>
    </div>
  );
}

function Vazio({ texto }: { texto: string }) {
  return (
    <div className="mt-10 rounded-2xl border border-dashed border-border-strong bg-card p-10 text-center">
      <p className="text-sm text-foreground-soft">{texto}</p>
    </div>
  );
}
