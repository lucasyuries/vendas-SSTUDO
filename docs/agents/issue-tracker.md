# Issue tracker

Issues e specs deste repositório vivem como arquivos markdown em `.scratch/`.

**Convenções**

- Uma feature por diretório: `.scratch/<feature-slug>/`
- A spec é `.scratch/<feature-slug>/spec.md`
- Tickets de implementação são um arquivo por ticket em
  `.scratch/<feature-slug>/issues/<NN>-<slug>.md`, numerados a partir de `01`,
  nunca um único arquivo combinado com todos os tickets
- O estado de triagem é uma linha `Status:` no topo de cada arquivo de issue
- Comentários são acrescentados ao final do arquivo, sob um cabeçalho `## Comments`

Quando uma skill disser "publish to the issue tracker": crie um novo arquivo em
`.scratch/<feature-slug>/` (criando o diretório se necessário). Quando disser
"fetch the relevant ticket": leia o arquivo no caminho referenciado.

**Wayfinding operations**: o mapa é `.scratch/<effort>/map.md`; os tickets filhos
são `.scratch/<effort>/issues/NN-<slug>.md` com uma linha `Type:`
(`research`/`prototype`/`grilling`/`task`) e uma linha `Status:`
(`claimed`/`resolved`); o bloqueio é uma linha `Blocked by: NN, NN`, liberada
quando todos os arquivos listados estiverem `resolved`. Para reivindicar, defina
`Status: claimed`; para resolver, acrescente a resposta sob `## Answer`, defina
`Status: resolved` e acrescente um ponteiro em `map.md`.

**Observação**: o repositório tem remote no GitHub
(`lucasyuries/vendas-SSTUDO`), mas o GitHub CLI (`gh`) não está instalado na
máquina de desenvolvimento. Se um dia o fluxo migrar para GitHub Issues, instale
o `gh`, autentique e substitua o conteúdo deste arquivo pelo modelo de GitHub.
