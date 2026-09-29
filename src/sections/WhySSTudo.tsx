import { ShieldCheck, Unlock, CheckCircle, Handshake } from "lucide-react";
import { SectionLabel } from "@/components/SectionLabel";

const ITEMS = [
  {
    icon: ShieldCheck,
    title: "Segurança",
    description:
      "A proteção do trabalhador é inegociável para nós. Cumprimos rigorosamente todas as normas vigentes e atualizamos nossas plataformas sempre que a legislação muda, para que sua empresa nunca fique desatualizada.",
  },
  {
    icon: Unlock,
    title: "Acessibilidade",
    description:
      "Construímos tecnologia simples de usar, mesmo para quem não é especialista em SST. Linguagem clara, sem jargões desnecessários, e suporte humano de verdade quando você precisar de ajuda — não apenas robôs automatizados.",
  },
  {
    icon: CheckCircle,
    title: "Integridade",
    description:
      "Não vendemos atalhos nem soluções que burlam a legislação. Nosso compromisso é educar nossos clientes sobre suas obrigações reais, para que a conformidade seja genuína — não apenas documental.",
  },
  {
    icon: Handshake,
    title: "Parceria",
    description:
      "Não somos apenas fornecedores de software — somos parceiros de conformidade. Acompanhamos sua empresa em toda a jornada de SST, desde o diagnóstico inicial até a manutenção contínua da documentação exigida por lei.",
  },
];

export function WhySSTudo() {
  return (
    <section id="por-que-sstudo" className="bg-background py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <SectionLabel>Por que a SSTudo</SectionLabel>
          <h2 className="mt-4 font-display text-section font-bold tracking-tight text-foreground">
            Tecnologia acessível para conformidade em SST
          </h2>
          <p className="mt-4 text-lead text-foreground-soft">
            Simplificamos a gestão de segurança e saúde do trabalho para empresas de todos os portes
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex gap-4 rounded-2xl border border-border bg-card p-6"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-tint">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-card font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground-soft">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
