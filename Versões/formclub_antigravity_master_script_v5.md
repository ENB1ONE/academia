# PROMPT MESTRE PARA O ANTIGRAVITY — CONFIGURAÇÃO DO DOMÍNIO app.formclub.com.br (GITHUB PAGES + OCI) E PENTE-FINO COMPLETO DE GRÁFICOS, DADOS E BOTÕES

## 1. NOVA CONFIGURAÇÃO OBRIGATÓRIA DE DOMÍNIO: https://app.formclub.com.br

O domínio customizado `app.formclub.com.br` já foi apontado no DNS e ativado no GitHub Pages (`DNS check successful`). Aplique imediatamente os 7 ajustes estruturais abaixo no Front-end e no Back-end (OCI) para garantir que nenhum erro 404, perda de domínio em deploy ou bloqueio de CORS aconteça:

### 1.1. Criar `frontend/public/CNAME` (Obrigatório para não perder o domínio no deploy)

* Crie o arquivo `frontend/public/CNAME` (sem extensão) contendo exatamente uma única linha:
  `app.formclub.com.br`

* Garanta no script de build/deploy (`package.json` ou workflow do GitHub Actions) que o arquivo `CNAME` esteja sempre na raiz da pasta `dist/` antes de publicar na branch `gh-pages`.

### 1.2. Ajustar `frontend/vite.config.js` (`base: './'`)

* No arquivo `frontend/vite.config.js`, altere a propriedade `base` de `'/academia/'` para `'./'` (caminho relativo):
  `export default defineConfig({ plugins: [react()], base: './' })`

* Com `base: './'` e `HashRouter`, todos os arquivos JS e CSS (`./assets/...`) carregarão sem erro 404 tanto na raiz `https://app.formclub.com.br/` quanto em `https://enb1one.github.io/academia/`.

### 1.3. Criar Redirecionador Anti-404 em `frontend/public/404.html`

* Crie o arquivo `frontend/public/404.html` com script de redirecionamento automático para que qualquer acesso direto sem `#` (ex: `https://app.formclub.com.br/dashboard`) redirecione para `https://app.formclub.com.br/#/dashboard`.

### 1.4. Atualizar URLs de Convite, Imagens e PWA (`manifest.json` e `index.html`)

* Procure em todo o diretório `frontend/src/` por `enb1one.github.io/academia` ou `/academia/`:

  * Na tela **Convite de Monitoramento (`/#/monitoring/invite`)**, o link gerado deve ser `https://app.formclub.com.br/#/checkin/formclub-hub` (ou dinâmico via `${window.location.origin}/#/checkin/formclub-hub`).

  * Em todas as tags `<img src="...">` (logo FormClub, avatares dos 98 atletas em `eloadSeedData.json`, ícones), substitua prefixos `/academia/` por caminhos relativos `./` (ex: `./avatars/athlete_20337.jpg`).

* No `frontend/public/manifest.json` (e Service Worker, se houver):

  * Atualize `"start_url": "./"` e `"scope": "./"`.

  * Atualize os caminhos de `icons` para `"./icon-192.png"` e `"./icon-512.png"`.

* No `frontend/index.html`:

  * Atualize as meta tags `og:url` e `<link rel="canonical">` para `https://app.formclub.com.br/`, e referencie o manifest e favicon com `./`.

### 1.5. Liberar CORS para `app.formclub.com.br` no Back-end da OCI

* No servidor de back-end rodando em background na **OCI**, atualize a configuração de CORS (`CORSMiddleware` / `cors`) para permitir explicitamente:
  `["https://app.formclub.com.br", "http://app.formclub.com.br", "https://enb1one.github.io", "http://localhost:5173", "http://localhost:3000"]`

* Certifique-se de que o endpoint da API na OCI está usando **HTTPS** (via Cloudflare Tunnel ou Nginx SSL) para evitar bloqueios de *Mixed Content* em `https://app.formclub.com.br`.

## 2. PENTE-FINO DE DADOS, GRÁFICOS E BOTÕES (PARIDADE 100% COM ELOAD MANTENDO PALETA PRETO+DOURADO E LOGO FORMCLUB)

Mantenha **100% da paleta de cores atual do FormClub (Preto / Dark + Dourado / Âmbar)** e o **Logo FORMCLUB**, aplicando todas as correções de dados, gráficos e botões abaixo:

### 2.1. Prontuário Completo de ARTHUR RIBEIRO (`/#/athletes/20337`) e Demais 97 Atletas

* **Cabeçalho Real de Arthur Ribeiro (`#20337`)**:

  * Nome: `ARTHUR RIBEIRO` | Idade: `16 anos` | Grupo: `Atleta sem grupo`

  * Situação Passada A:C: `DESTREINO` | Situação Atual A:C: `DESTREINO` | Razão A:C: `0,41`

  * Carga Crônica (Média últimas 4 semanas): `735` | Carga Aguda (Últimos 7 dias): `300`

* **Os 10 Gráficos da Aba `Monitoramento` Preenchidos (Zero gráficos vazios)**:

   1. `CARGA DIÁRIA` (`15/09` a `14/10`): Barras duplas de `Carga Planejada` e `Carga Realizada` com rótulos numéricos internos + linhas curvas suaves de `PSR` e `PSE` com bolinhas numeradas + seletor `Data do relatório`, botão `Emitir relatório` e botão `Legendas do Gráfico`. Dados reais de Arthur Ribeiro:

      * `16/09`: Planejada=480, Realizada=480, PSR=7, PSE=8, Duração=60, PSE_Planejado=8

      * `18/09`: Planejada=420, Realizada=300, PSR=7, PSE=5, Duração=60, PSE_Planejado=7

      * `21/09`: Planejada=420, Realizada=300, PSR=6, PSE=5, Duração=60, PSE_Planejado=7

      * `23/09`: Planejada=480, Realizada=480, PSR=6, PSE=8, Duração=60, PSE_Planejado=8

      * `25/09`: Planejada=300, Realizada=360, PSR=7, PSE=6, Duração=60, PSE_Planejado=5

      * `28/09`: Planejada=420, Realizada=0, PSR=0, PSE=0, Duração=0, PSE_Planejado=7

      * `30/09`: Planejada=480, Realizada=480, PSR=7, PSE=8, Duração=60, PSE_Planejado=8

      * `01/10`: Planejada=420, Realizada=420, PSR=6, PSE=7, Duração=60, PSE_Planejado=7

      * `02/10`: Planejada=480, Realizada=0, PSR=0, PSE=0, Duração=0, PSE_Planejado=8

      * `05/10`: Planejada=480, Realizada=300, PSR=9, PSE=5, Duração=60, PSE_Planejado=8

      * `07/10`: Planejada=420, Realizada=0, PSR=0, PSE=0, Duração=0, PSE_Planejado=7

      * `09/10`: Planejada=360, Realizada=300, PSR=6, PSE=5, Duração=60, PSE_Planejado=6

      * (Demais dias de `15/09` a `14/10` com valor `0`).

   2. `DURAÇÃO TOTAL (MINUTOS) X PSE`: Barras de `60 min` nos dias de treino + linhas `PSE` e `PSE Planejado` com marcadores numerados.

   3. `CARGA DA SEMANA`: Cards `Carga Crônica: 735` e `Carga Aguda: 300` no topo + gráfico semanal com 3 barras (`Carga Planejada`, `Carga Realizada`, `Strain`), 2 linhas (`AC Semana`, `Monotonia`) e variação percentual no eixo X:

      * `13/09 - 19/09`: Planejada=900, Realizada=780, Strain=468, AC=0.96, Monotonia=0.6

      * `20/09 - 26/09 (VAR C.T. 46,2%)`: Planejada=1200, Realizada=1140, Strain=912, AC=1.41, Monotonia=0.8

      * `27/09 - 03/10 (VAR C.T. -21,1%)`: Planejada=1800, Realizada=900, Strain=540, AC=1.26, Monotonia=0.6

      * `04/10 - 10/10 (VAR C.T. -33,3%)`: Planejada=1260, Realizada=600, Strain=360, AC=0.70, Monotonia=0.6

      * `11/10 - 17/10`: Planejada=0, Realizada=0, Strain=0, AC=0.41, Monotonia=0.0

   4. `QUESTIONÁRIO DE BEM-ESTAR`: Gráfico de barras empilhadas (0 a 25 pontos, de `15/09` a `09/10`) com `Dor Muscular`, `Fadiga`, `Humor`, `Noite de Sono` e `Stress` e números internos (`3, 4, 5`).

   5. `STATUS NEUROMUSCULAR (CMJ)`: Os 17 saltos reais de Arthur Ribeiro (`26/06: 37.01`, `06/07: 35.08`, `08/07: 36.34`, `17/07: 36.11`, `20/07: 38.24`, `22/07: 37.55`, `24/07: 38.38`, `27/07: 36.30`, `29/07: 39.38`, `05/08: 38.50`, `17/08: 36.47`, `21/08: 41.44`, `26/08: 37.60`, `01/09: 37.91`, `02/09: 39.53`, `04/09: 40.88`, `05/10: 38.96 cm`) + linhas de `Baseline`, `Limite Superior` e `Limite Inferior`.

   6. `SONO`: `Horas de Sono` (0-12h) x `Qualidade do Sono` (0-5).

   7. `NÍVEL HIDRATAÇÃO`: `Tonalidade da Urina` (Escala 1 a 8).

   8. `DORES REGISTRADAS`: Série `Panturrilha Direita` com pico `7` em `08/10`.

   9. `VARIAÇÃO DE VFC`: `VFC / rMSSD` + botão `Legendas do Gráfico`.

  10. `VARIAÇÃO DE MASSA CORPORAL`: `Massa Corporal Diária (kg)` x `Taxa de Desidratação (%)`.

* **Abas `Histórico de Dores`, `Histórico de Treinos` e `Histórico de Avaliações`**:

  * `Histórico de Dores`: 5 semanas reais (`04/10 - 10/10: 1 dor`) com botão de **Lupa** que abre o modal do Mapa Anatômico destacando *Panturrilha Direita = 7*.

  * `Histórico de Treinos`: 5 semanas reais (`0`, `600`, `900`, `1140`, `780 UA`) com botão de **Lupa** que abre o detalhamento das sessões daquela semana.

* **Séries Completas para Todos os 98 Atletas**: Garanta que todos os 98 atletas em `eloadSeedData.json` possuam fotos reais e séries históricas preenchidas para que nenhum perfil exiba *"Nenhum registro para o período selecionado"*.

### 2.2. Funcionalidade Real de Impressão / Exportação PDF e Todos os Botões

* **Botões `Imprimir relatórios`, `Exportar PDF` e `Emitir relatório`**: Devem abrir o **Modal/Tela de Configuração de Relatório para Impressão** com:

  * Campo para *"Adicionar observação geral / parecer fisiológico"*.

  * Botão **`[X]`** em cada seção/gráfico para ocultar blocos específicos antes de imprimir.

  * Botão *"Limpar alterações e observações"*.

  * Botão *"Imprimir / Salvar em PDF"* acionando `window.print()` com folha de estilo `@media print` própria para A4.

* **Botão `Trocar atleta`**: Abre modal rápido pesquisável com os 98 atletas para alternar de perfil imediatamente.

* **Botão `Aplicar filtros`**: Filtra reativamente os gráficos por *Tipo de Treino*, *Período* e *Separar carga por tipo de treino*.

* **Botão `Legendas do Gráfico`**: Expande/recolhe a explicação científica das métricas abaixo do gráfico.

* **Telas Coletivas (`Monitoramento de Grupo` e `Prontidão CMJ`)**:

  * `Monitoramento de Grupo`: Seleção das 5 turmas -> 4 gráficos coletivos + 2 tabelas + botão amarelo `Relatório de Risco` + `Imprimir relatórios`.

  * `Prontidão (CMJ)`: Tabela dos 98 atletas (Arthur Ribeiro: `05/10/2026 | Média: 38,96 | CV%: 2,8% | SUPERCOMPENSAÇÃO`) + filtro de Desvio Padrão e botão `IMPRIMIR`.

### 2.3. Visão do Atleta (`https://app.formclub.com.br/#/checkin/formclub-hub`)

* Campo de data de nascimento com máscara brasileira estrita **`DD/MM/AAAA`** (`06/09/2008` identifica **FERNANDO GOMES** -> `"Fernando? [Sim] [Não]"`).

* Questionário Diário completo (5 pilares com emojis, horas de sono e hidratação por cor da urina 1-8) que, ao ser enviado, **abre imediatamente na sequência a tela do Treino Programado do Dia do atleta**!

## 3. VALIDAÇÃO FINAL E DEPLOY

1. Rode `npm run build` dentro de `/frontend` e verifique que `dist/CNAME` contém `app.formclub.com.br` e `dist/index.html` usa caminhos relativos `./assets/...`.

2. Publique o build na branch `gh-pages`.

3. Acesse `https://app.formclub.com.br`, faça login com `admin@formclub.com.br` / `FormaClub123` e valide que o site abre sem erros de rede/CORS, exibe o prontuário completo do Arthur Ribeiro (`#20337`) e imprime relatórios perfeitamente.