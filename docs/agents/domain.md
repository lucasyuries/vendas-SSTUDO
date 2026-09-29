# Domain docs

Como as skills de engenharia devem consumir a documentação de domínio deste
repositório ao explorar o código.

**Antes de explorar, leia**

- `CONTEXT.md` na raiz do repositório
- `docs/adr/`: leia as ADRs que tocam a área em que você vai trabalhar

Este é um repositório de **contexto único**: um `CONTEXT.md` e um `docs/adr/` na
raiz. Não há `CONTEXT-MAP.md` nem contextos por pacote.

Se algum desses arquivos não existir, siga em frente silenciosamente. Não sinalize
a ausência deles nem sugira criá-los antecipadamente — eles são criados de forma
preguiçosa, conforme termos ou decisões realmente precisem ser resolvidos durante
outro trabalho.

**Estrutura de arquivos**

```
/
├── CONTEXT.md
├── docs/adr/
│   ├── 0001-....md
│   └── 0002-....md
└── src/
```

**Use o vocabulário do glossário**

Quando sua saída nomear um conceito de domínio (no título de um ticket, numa
proposta de refatoração, numa hipótese, no nome de um teste), use o termo como
definido em `CONTEXT.md`. Não derive para sinônimos que o glossário evita
explicitamente.

Se o conceito de que você precisa ainda não estiver no glossário, isso é um
sinal: ou você está inventando uma linguagem que o projeto não usa (reconsidere),
ou existe uma lacuna real (anote para trabalho futuro de modelagem de domínio).

**Sinalize conflitos com ADRs**

Se sua saída contradisser uma ADR existente, traga isso à tona explicitamente em
vez de sobrescrever silenciosamente:

> _Contradiz a ADR-0007 (…), mas vale reabrir porque…_
