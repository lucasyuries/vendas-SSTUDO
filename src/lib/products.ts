// ============================================================================
// CATÁLOGO DE PRODUTOS — SSTudo
// ----------------------------------------------------------------------------
// Fonte única de verdade sobre os quatro produtos. Alimenta, sem duplicação:
//   - os cartões de produto da página inicial
//   - o painel "Produtos" do mega menu
//   - as páginas de produto
//   - o seletor de produto de interesse do formulário de orçamento
//
// Cadastrar um produto novo é acrescentar uma entrada aqui, não criar uma
// página. Todo o conteúdo veio dos sites e sistemas reais de cada produto,
// levantado em .scratch/reestruturacao-site/conteudo-produtos.md. Nada aqui
// deve ser inventado: promessa não verificável não entra.
// ============================================================================

import { Brain, ClipboardCheck, FileSearch, ShieldAlert, type LucideIcon } from "lucide-react";

export type ProductId = "psicohub" | "aso-digital" | "denuncia-proativa" | "diagnostico-pgr";

/**
 * "produto" é oferta contratada por orçamento. "diagnostico" é a ferramenta
 * gratuita de entrada do funil, que se apresenta de forma diferente na página
 * inicial e não recebe proposta comercial direta.
 */
export type ProductKind = "produto" | "diagnostico";

export interface ProductStep {
  title: string;
  description: string;
}

export interface ProductFaq {
  question: string;
  answer: string;
}

export interface Product {
  id: ProductId;
  name: string;
  kind: ProductKind;
  /** Uma linha, usada no mega menu e como subtítulo do cartão. */
  tagline: string;
  /** Texto do cartão da página inicial. */
  cardDescription: string;
  /** O problema que o produto resolve, na abertura da página do produto. */
  problem: string;
  /**
   * Camada educativa da página, antes de qualquer argumento de venda.
   *
   * O padrão vem da referência de mercado escolhida pelo cliente: as páginas
   * dela explicam o conceito e a exigência legal antes de falar do produto.
   * Isso dá credibilidade a quem já conhece o assunto e captura quem chega
   * pesquisando a norma, não a marca.
   */
  concept: { title: string; paragraphs: string[] };
  legal: { title: string; intro: string; requirements: string[] };
  icon: LucideIcon;
  /** Classe utilitária da cor de destaque. Aplicada SOMENTE ao ícone. */
  accentClass: string;
  /** Normas e leis que o produto ajuda a cumprir. */
  anchorNorms: string[];
  /** Para quem o produto é. */
  audiences: string[];
  features: string[];
  steps: ProductStep[];
  faq: ProductFaq[];
  /** Endereço do sistema do produto. Não é a chamada principal da página. */
  systemUrl: string;
  /** Caminho da página de produto dentro deste site. */
  path: string;
  /** Ressalva legal obrigatória, quando o produto publica uma. */
  disclaimer?: string;
  /**
   * Imagem da página do produto. Só existe para quem tem material real —
   * nenhuma foto genérica de banco de imagens é usada no lugar.
   *
   * A imagem já vem recortada no arquivo (ver scripts/recortar-mockup.mjs).
   * A versão anterior recortava por CSS, com margem negativa, e cortava o
   * rodapé do painel: margem em porcentagem é relativa à largura do contêiner,
   * não à altura.
   */
  image?: { src: string; alt: string; width: number; height: number };
}

export const PRODUCTS: Product[] = [
  {
    id: "psicohub",
    name: "PsicoHub",
    kind: "produto",
    tagline: "Risco psicossocial medido, não estimado",
    cardDescription:
      "Pesquisa anônima, heatmap por setor e relatório técnico pronto para anexar ao PGR.",
    problem:
      "A NR-01 passou a tratar o risco psicossocial como qualquer outro risco ocupacional: tem que ser identificado, avaliado e ter plano de ação. Só que ele não se mede com equipamento — se mede perguntando. E aí começa o problema real: pergunta sem anonimato garantido não recebe resposta honesta, e resposta não confiável não vira evidência técnica que se sustente diante de um auditor fiscal do trabalho.",
    concept: {
      title: "O que são riscos psicossociais",
      paragraphs: [
        "São características da organização do trabalho que afetam a saúde mental de quem trabalha: sobrecarga e ritmo excessivo, falta de autonomia sobre as próprias tarefas, metas inalcançáveis, assédio, conflito entre colegas, ausência de reconhecimento e insegurança sobre o futuro do emprego.",
        "O ponto que costuma ser mal compreendido é que o risco não está na pessoa, e sim em como o trabalho está organizado. Por isso ele não se resolve com palestra de bem-estar nem com programa de meditação: se resolve mudando processo, carga e liderança — e, antes disso, medindo onde o problema está.",
      ],
    },
    legal: {
      title: "O que a NR-01 exige",
      intro:
        "Com a atualização da NR-01, o risco psicossocial deixou de ser tema de recursos humanos e passou a integrar o Gerenciamento de Riscos Ocupacionais, no mesmo processo dos riscos físicos, químicos e biológicos.",
      requirements: [
        "Identificar e avaliar os fatores de risco psicossocial junto com os demais riscos do ambiente de trabalho",
        "Registrar cada risco no inventário de riscos, com probabilidade, severidade e número de expostos",
        "Definir plano de ação com medidas de prevenção, responsável e prazo",
        "Monitorar continuamente e reavaliar após acidente, adoecimento ou mudança relevante na organização",
        "Garantir a participação dos trabalhadores no processo de avaliação",
      ],
    },
    icon: Brain,
    accentClass: "text-product-psicohub",
    anchorNorms: ["NR-01"],
    audiences: [
      "Assessorias e consultorias em SST",
      "Psicólogos do trabalho",
      "Empresas com SESMT",
      "RH e departamento pessoal",
    ],
    features: [
      "Pesquisa 100% anônima",
      "Heatmap de satisfação por setor",
      "Matriz de risco",
      "Filtro por GHE",
      "Análise por pergunta",
      "Comparação entre empresas",
      "Perfil demográfico",
      "Evolução temporal",
      "Benchmark por pilar",
      "Respostas livres",
      "Relatório em PDF",
      "Exportação para Excel",
      "Plano de ação",
      "Gestão multi-empresa",
    ],
    steps: [
      {
        title: "Cadastre a empresa",
        description: "Estruture setores, cargos e os grupos que vão responder.",
      },
      {
        title: "Envie a pesquisa",
        description: "Os colaboradores respondem de forma totalmente anônima.",
      },
      {
        title: "Leia o heatmap",
        description: "Veja onde o risco se concentra, por setor e por pilar.",
      },
      {
        title: "Anexe ao PGR",
        description: "Gere o relatório técnico em PDF e o plano de ação.",
      },
    ],
    faq: [
      {
        question: "A pesquisa é realmente anônima?",
        answer:
          "Sim. As respostas não são vinculadas à identidade de quem respondeu, o que é a condição para que as pessoas relatem o que realmente sentem.",
      },
      {
        question: "O relatório serve para o PGR?",
        answer:
          "Sim. O relatório técnico é gerado em PDF para ser anexado ao Programa de Gerenciamento de Riscos, junto com a matriz de risco e o plano de ação.",
      },
      {
        question: "Consigo atender vários clientes na mesma conta?",
        answer:
          "Sim. A gestão é multi-empresa, pensada para assessorias e consultorias que administram uma carteira de clientes.",
      },
    ],
    systemUrl: "https://dashboard.sstudo.com.br",
    path: "/produtos/psicohub",
    image: {
      src: "/dashboard-psicohub.webp",
      alt: "Painel do PsicoHub: empresas ativas, total de respostas, média geral, benchmark por pilar e evolução temporal",
      width: 1120,
      height: 700,
    },
  },
  {
    id: "aso-digital",
    name: "ASO Digital",
    kind: "produto",
    tagline: "ASO e PCMSO sem controle em planilha",
    cardDescription:
      "Exames, ASO e documentos com alerta de vencimento, para toda a carteira de empresas.",
    problem:
      "Exame ocupacional vencido não avisa. Ele aparece na admissão que trava, no auditor que pede o PCMSO e recebe uma pasta, ou na reclamação trabalhista em que a empresa precisa provar que o exame existia na data certa. Quem controla vencimento em planilha compartilhada só descobre o problema pelo pior caminho possível.",
    concept: {
      title: "O que são o PCMSO e o ASO",
      paragraphs: [
        "O PCMSO é o programa que define quais exames cada trabalhador precisa fazer, e com que frequência, a partir dos riscos aos quais o cargo dele está exposto. Ele não é um documento avulso: nasce do inventário de riscos e acompanha cada mudança de função, de setor ou de processo.",
        "O ASO é o registro do resultado: o documento que atesta se a pessoa está apta para aquela função específica, naquele momento. É ele que a fiscalização pede, é ele que a perícia consulta, e é a falta dele — ou a data vencida — que aparece na reclamação trabalhista anos depois.",
      ],
    },
    legal: {
      title: "O que a NR-07 exige",
      intro:
        "Toda empresa que admite empregados precisa manter o PCMSO, independentemente do porte ou do grau de risco. O que muda é a extensão do programa, não a obrigação de tê-lo.",
      requirements: [
        "Manter o PCMSO alinhado ao inventário de riscos, com os exames definidos por função",
        "Realizar exame admissional antes do início das atividades",
        "Realizar exames periódicos nos intervalos previstos para cada risco",
        "Realizar exame de retorno ao trabalho após afastamento prolongado",
        "Realizar exame de mudança de risco quando a função ou a exposição mudar",
        "Realizar exame demissional dentro do prazo, sob pena de autuação",
        "Emitir o ASO e conservar o registro pelo prazo legal",
      ],
    },
    icon: ClipboardCheck,
    accentClass: "text-product-aso",
    anchorNorms: ["NR-07", "PCMSO"],
    audiences: [
      "Clínicas de medicina ocupacional",
      "Assessorias e consultorias em SST",
      "Empresas contratantes",
      "Laboratórios",
    ],
    features: [
      "ASO digital com emissão de laudos",
      "Encaminhamentos",
      "Histórico por funcionário",
      "Agentes de risco por cargo",
      "Matriz de risco",
      "Ações de prevenção",
      "Gestão multi-empresa",
      "Perfis de acesso",
      "Cadastro de setores e cargos",
      "Documentos com controle de vigência",
      "Alerta de vencimento",
      "Dashboard em tempo real",
      "Previsão de ASO",
    ],
    steps: [
      {
        title: "Estruture a empresa",
        description: "Cadastre funcionários, setores e cargos com seus riscos.",
      },
      {
        title: "Programe os exames",
        description: "Os procedimentos vêm dos riscos associados a cada cargo.",
      },
      {
        title: "Emita o ASO",
        description: "Gere o atestado e os encaminhamentos já preenchidos.",
      },
      {
        title: "Acompanhe os prazos",
        description: "Receba alerta antes do vencimento, não depois.",
      },
    ],
    faq: [
      {
        question: "Dá para gerenciar mais de uma empresa na mesma conta?",
        answer:
          "Sim. Uma conta de consultoria administra diversas empresas clientes, com controle de acesso por perfil de usuário.",
      },
      {
        question: "O sistema avisa sobre exames a vencer?",
        answer:
          "Sim. Os documentos têm controle de vigência e o painel acompanha exames vencidos e a previsão de ASO.",
      },
    ],
    systemUrl: "https://asodigital.net",
    path: "/produtos/aso-digital",
  },
  {
    id: "denuncia-proativa",
    name: "Denúncia Proativa",
    kind: "produto",
    tagline: "Um canal que o denunciante realmente usa",
    cardDescription:
      "Denúncia anônima com protocolo de acompanhamento e relatório para investigação.",
    problem:
      "Canal de denúncia que ninguém usa não protege a empresa: só documenta que ela tentou. E ninguém usa um canal em que não confia — caixa de e-mail interna, urna na parede ou formulário que pede login. Quando o colaborador não acredita no anonimato, ele não deixa de denunciar: ele denuncia em outro lugar, no sindicato, no Ministério Público do Trabalho ou na Justiça, e aí a empresa descobre junto com todo mundo.",
    concept: {
      title: "O que é um canal de denúncias",
      paragraphs: [
        "É a via pela qual colaborador, fornecedor ou cliente relata irregularidade sem precisar se expor: assédio moral ou sexual, discriminação, fraude, desvio de recursos, descumprimento de norma de segurança. Funciona porque é independente da cadeia hierárquica — quem denuncia não precisa contar o problema justamente para quem, muitas vezes, faz parte dele.",
        "O que separa um canal que funciona de um que só existe no papel é o anonimato real e o protocolo de acompanhamento. Sem anonimato, ninguém usa. Sem protocolo, quem denunciou não sabe se algo aconteceu, conclui que não aconteceu nada, e leva o caso para fora.",
      ],
    },
    legal: {
      title: "O que a legislação espera",
      intro:
        "Canal de denúncias deixou de ser boa prática de grandes empresas e passou a ter amparo legal explícito em mais de uma frente.",
      requirements: [
        "A Lei Anticorrupção considera a existência de canais de denúncia na avaliação do programa de integridade, o que pesa na dosimetria de eventual sanção",
        "A legislação trabalhista sobre prevenção ao assédio determina que empresas com CIPA adotem medidas de recebimento e apuração de denúncias",
        "A LGPD exige base legal e tratamento adequado dos dados pessoais que circulam na denúncia, inclusive os do denunciante",
        "A apuração precisa ser registrada: sem trilha documental, a empresa não consegue provar que agiu",
      ],
    },
    icon: ShieldAlert,
    accentClass: "text-product-denuncia",
    anchorNorms: ["LGPD", "Lei Anticorrupção"],
    audiences: [
      "Empresas de qualquer porte",
      "Setores regulados",
      "Áreas de compliance e jurídico",
      "RH e departamento pessoal",
    ],
    features: [
      "Anonimato garantido",
      "Disponível 24 horas",
      "Protocolo de acompanhamento",
      "Dados criptografados",
      "Backup automático",
      "Notificação de alta prioridade",
      "Dashboards gerenciais",
      "Relatórios de investigação",
      "Documentação de compliance",
      "Equipe especializada",
    ],
    steps: [
      {
        title: "Acesse o formulário",
        description: "O denunciante relata a situação com as informações relevantes.",
      },
      {
        title: "Receba o protocolo",
        description: "Um número de acompanhamento é gerado no envio.",
      },
      {
        title: "Análise profissional",
        description: "A equipe apura com sigilo e imparcialidade.",
      },
      {
        title: "Acompanhe o status",
        description: "O protocolo permite seguir o andamento da investigação.",
      },
    ],
    faq: [
      {
        question: "O que pode ser denunciado?",
        answer:
          "Assédio moral, assédio sexual, discriminação, corrupção, violação de normas de segurança do trabalho e violação do código de ética.",
      },
      {
        question: "Como o anonimato é preservado?",
        answer:
          "O sistema não vincula a denúncia à identidade do denunciante, e o acompanhamento é feito por protocolo, com dados criptografados.",
      },
      {
        question: "Atende à LGPD?",
        answer:
          "Sim. O canal opera em conformidade com a LGPD, com a Lei Anticorrupção e com as normas trabalhistas.",
      },
    ],
    systemUrl: "https://denunciaproativa.com.br",
    path: "/produtos/denuncia-proativa",
  },
  {
    id: "diagnostico-pgr",
    name: "Diagnóstico PGR",
    kind: "diagnostico",
    tagline: "PGR ou DIR? Descubra pelo CNPJ, de graça",
    cardDescription:
      "Consulta o CNPJ, classifica o grau de risco pela NR-04 e diz o que a lei exige de você.",
    problem:
      "Nem toda empresa precisa de PGR: dependendo do grau de risco e do porte, algumas podem apenas declarar inexistência de riscos. A diferença sai do CNAE e do Quadro I da NR-04, e quase ninguém sabe consultar isso. Errar para menos custa autuação. Errar para mais custa uma consultoria que você não precisava contratar.",
    concept: {
      title: "PGR, GRO e DIR: o que é cada coisa",
      paragraphs: [
        "O GRO é o processo de gerenciar riscos ocupacionais, e o PGR é o documento que registra esse processo: o inventário de riscos e o plano de ação. Toda empresa com empregado precisa gerenciar riscos — o que varia é como isso é documentado.",
        "A DIR é a declaração de inexistência de riscos, disponível para empresas de menor porte e menor grau de risco que, avaliadas, não identificam riscos que exijam o programa completo. Declarar quando não se podia é autuação; contratar um PGR quando bastaria a declaração é dinheiro gasto à toa.",
      ],
    },
    legal: {
      title: "Como a regra é determinada",
      intro:
        "A obrigação não depende de opinião: sai do cruzamento entre a atividade econômica da empresa, o grau de risco correspondente e o porte.",
      requirements: [
        "O CNAE da empresa define o grau de risco, conforme o Quadro I da NR-04",
        "O grau de risco e o número de empregados determinam se cabe PGR completo ou DIR",
        "Havendo PGR, ele precisa conter inventário de riscos e plano de ação",
        "O documento precisa ser revisado periodicamente e sempre que houver mudança relevante",
      ],
    },
    icon: FileSearch,
    accentClass: "text-product-pgr",
    anchorNorms: ["NR-01", "NR-04"],
    audiences: [
      "Empresas e empreendedores",
      "Contadores e assessorias contábeis",
      "Técnicos em segurança do trabalho",
    ],
    features: [
      "Consulta de CNPJ em tempo real",
      "Análise NR-04 automática",
      "Classificação do grau de risco",
      "Questionário oficial DIR/PGR",
      "Resultado com próximos passos",
      "Gratuito e sem cadastro",
      "Nenhum dado armazenado",
    ],
    steps: [
      {
        title: "Digite o CNPJ",
        description: "Os dados vêm da Receita Federal, pela BrasilAPI.",
      },
      {
        title: "Análise NR-04",
        description: "O CNAE é classificado pelo Quadro I da NR-04.",
      },
      {
        title: "Questionário oficial",
        description: "As perguntas são as do sistema DIR/PGR do Ministério do Trabalho.",
      },
      {
        title: "Receba o resultado",
        description: "PGR obrigatório ou DIR possível, com os próximos passos.",
      },
    ],
    faq: [
      {
        question: "É gratuito mesmo?",
        answer: "Sim. A ferramenta é gratuita e não exige cadastro.",
      },
      {
        question: "Meus dados ficam guardados?",
        answer:
          "Não. A consulta usa apenas informações públicas da Receita Federal e nenhum dado é armazenado.",
      },
      {
        question: "O resultado substitui uma consultoria?",
        answer:
          "Não. É um diagnóstico preliminar. Decisões definitivas exigem um profissional habilitado em SST.",
      },
    ],
    systemUrl: "https://cloudi.com.br/preciso-de-pgr/",
    path: "/produtos/diagnostico-pgr",
    disclaimer:
      "Ferramenta educacional e de diagnóstico preliminar em SST. Não substitui consultoria profissional especializada.",
  },
];

/** Os produtos contratados por orçamento, na ordem de exibição. */
export const CONTRACTED_PRODUCTS = PRODUCTS.filter((p) => p.kind === "produto");

/** A ferramenta gratuita de entrada do funil. */
export const DIAGNOSTIC_PRODUCT = PRODUCTS.find((p) => p.kind === "diagnostico");

export function getProduct(id: string | undefined): Product | null {
  if (!id) return null;
  return PRODUCTS.find((p) => p.id === id) ?? null;
}
