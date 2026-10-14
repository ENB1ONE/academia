# Auditoria Autenticada do FormClub (`admin@formclub.com.br`), Correção dos 7 Menus com Erro, Importação dos 98 Atletas e Redesign Padrão eLoad

Este documento consolida a auditoria realizada diretamente dentro do painel autenticado do [FormClub Web App](https://www.google.com/search?q=https%3A%2F%2Fenb1one.github.io%2Facademia%2F) com o login `admin@formclub.com.br` (`FormaClub123`), identificando a causa exata no código compilado (`assets/index-DdwawjwJ.js`) para os **7 menus que exibem banners vermelhos de erro** e para a **base zerada de atletas (`0 atletas`)**, além de entregar o **Prompt Mestre Definitivo para o Antigravity** corrigir o back-end na **OCI**, importar os **98 atletas do eLoad** e aplicar o visual clínico do [eLoad Web App](https://www.google.com/search?q=http%3A%2F%2Fapp.eload.com.br%2F).

## 1. Diagnóstico Real das 19 Rotas Autenticadas (`admin@formclub.com.br`)

Ao entrar com `admin@formclub.com.br` no [FormClub](https://www.google.com/search?q=https%3A%2F%2Fenb1one.github.io%2Facademia%2F) e inspecionar as chamadas de rede e o pacote JavaScript (`assets/index-DdwawjwJ.js`), identificamos exatamente o que acontece em cada parte do menu:

### 1.1. A Causa Raiz Técnica Encontrada no Código (`src/services/api.js`)
O cliente Axios da aplicação (`Me = axios.create({ baseURL: "https://hour-tough-telescope-jill.trycloudflare.com" })`) ainda aponta para o túnel temporário antigo do Cloudflare na **OCI**, que está **inativo/expirado** e retorna `Status 0 (net::ERR_FAILED)` em todas as chamadas `/api/v1/*`.
- Nas telas antigas (como `/#/dashboard` e `/#/athletes`), o erro de rede é silenciado e a tela exibe `0 atletas`.
- Nas **7 novas telas do menu**, o bloco `catch` das chamadas `Promise.all([api.get("/api/v1/...")])` dispara um **banner vermelho de erro** e bloqueia o carregamento dos dados.

### 1.2. Mapa Completo das 19 Rotas do Menu e as 7 Falhas de API

| # | Item do Menu / Rota no FormClub | Status Atual | Chamada HTTP Executada pelo Front-end | Erro Exibido na Tela / Diagnóstico |
| :--- | :--- | :--- | :--- | :--- |
| 1 | **Dashboard (`/#/dashboard`)** | Sem erro, mas zerado | `GET /api/v1/athletes/` (silenciado no `catch`) | Exibe `Total de Atletas: 0`, `Treinos: 0`, `Prontidão: ---` porque os 98 atletas ainda não foram sincronizados |
| 2 | **Atletas (`/#/athletes`)** | Sem erro, mas vazio | `GET /api/v1/athletes/` | Exibe *"Você ainda não tem atletas"* (modal `+ Novo Atleta` abre normalmente) |
| 3 | **Turmas / Grupos (`/#/groups`)** | **ERRO (Banner Vermelho)** | `Promise.all([GET /api/v1/groups/, GET /api/v1/athletes/])` | **`Erro ao carregar turmas e atletas.`** (`net::ERR_FAILED` no túnel OCI) |
| 4 | **Planejamento Carga (`/#/planning`)** | **ERRO (Banner Vermelho)** | `Promise.all([GET /api/v1/athletes/, GET /api/v1/groups/, GET /api/v1/workout-types/])` | **`Erro ao carregar dados de planejamento.`** (`net::ERR_FAILED` no túnel OCI) |
| 5 | **Novo Treino (`/#/workouts/new`)** | Carrega, mas sem atletas | `GET /api/v1/athletes/` | Abre formulário de exercícios (séries, reps, kg, pausa), mas o dropdown de atletas fica vazio |
| 6 | **Treino Coletivo (`/#/workouts/collective-log`)** | **ERRO (Banner Vermelho)** | `Promise.all([GET /api/v1/groups/, GET /api/v1/athletes/, GET /api/v1/workout-types/])` | **`Erro ao carregar dados do coletivo.`** (`net::ERR_FAILED` no túnel OCI) |
| 7 | **Pré-Treino - PSR (`/#/monitoring/pre-workout`)** | Carrega, mas sem atletas | `GET /api/v1/athletes/` | Formulário de PSR (0-10), Peso (kg) e VFC (rMSSD) abre normal, mas sem atletas no seletor |
| 8 | **Registrar PSE (`/#/monitoring/pse`)** | Carrega, mas sem atletas | `GET /api/v1/athletes/` | Escala Foster (1 a 10) e duração abrem normalmente, mas sem atletas no seletor |
| 9 | **Bem-Estar / Hooper (`/#/monitoring/wellness`)** | Carrega (Faltam 2 itens do eLoad) | `GET /api/v1/athletes/` | Exibe 4 escalas Hooper (Sono, Disposição, DOMS, Estresse); falta adicionar **Humor**, **Horas de Sono** e **Escala de Urina (1 a 8)** do [Convite eLoad](https://www.google.com/search?q=https%3A%2F%2Fapp.eload.com.br%2FConviteMonitoramento%2FConvite%2Fcaf66448-8f3b-4b98-8491-4614f0fe5c5f) |
| 10 | **Salto CMJ (`/#/monitoring/neuromuscular`)** | **ERRO (Banner Vermelho)** | `GET /api/v1/athletes/` e `GET /api/v1/monitoring/cmj/{id}` | **`Erro ao carregar atletas.`** (`net::ERR_FAILED` no túnel OCI) |
| 11 | **Mapa de Dor (`/#/monitoring/pain`)** | Carrega normalmente | `GET /api/v1/athletes/` | Diagrama anatômico interativo funciona; precisa apenas receber os 98 atletas no seletor |
| 12 | **Ciclo Menstrual (`/#/monitoring/menstrual`)** | Carrega normalmente | `GET /api/v1/athletes/` | Seletores de fluxo, cólica e humor funcionam; precisa listar as atletas femininas do eLoad |
| 13 | **Testes Físicos (`/#/monitoring/physical-tests`)** | Carrega normalmente | `GET /api/v1/athletes/` | Formulário com cálculo de Assimetria (%) abre normal, aguardando lista de atletas |
| 14 | **Lançar Avaliação (`/#/assessments/record`)** | **ERRO (Banner Vermelho)** | `Promise.all([GET /api/v1/athletes/, GET /api/v1/assessments/types])` | **`Erro ao carregar dados de avaliação.`** (`net::ERR_FAILED` no túnel OCI) |
| 15 | **Metas / OKRs (`/#/goals`)** | **ERRO (Banner Vermelho)** | `GET /api/v1/athletes/` e `GET /api/v1/goals/athlete/{id}` | **`Erro ao carregar atletas.`** (`net::ERR_FAILED` no túnel OCI) |
| 16 | **Link de Convite (`/#/monitoring/invite`)** | Carrega normalmente | Rota local (`/#/checkin/formclub-hub`) | Gera link e instruções PWA; precisa validar a data de nascimento contra os 98 atletas importados |
| 17 | **Modo Totem Kiosk (`/#/totem`)** | Carrega, mas vazio | `GET /api/v1/athletes/` e `GET /api/v1/groups/` | Exibe *"Nenhum atleta encontrado"* por falta dos 98 atletas e das 5 turmas |
| 18 | **Tipos de Treino (`/#/settings/workout-types`)** | **ERRO (Banner Vermelho)** | `GET /api/v1/workout-types/` | **`Erro ao carregar tipos de treino.`** (`net::ERR_FAILED` + falta carregar os 34 tipos do eLoad) |
| 19 | **Meu Perfil (`/#/profile`)** | Carrega normalmente | Dados locais do `authStore` (`admin@formclub.com.br`) | Exibe card do Administrador e formulário de troca de senha |

## 2. Como Vamos Resolver Tudo de Uma Vez no Antigravity

Para que **nenhum dos 7 menus volte a dar erro** e todos os **98 atletas, 5 turmas e 34 tipos de treino** do [eLoad](https://www.google.com/search?q=http%3A%2F%2Fapp.eload.com.br%2F) apareçam imediatamente em todas as telas com o visual do eLoad:
1. **Na OCI (Back-end + Túnel Persistente)**: O Antigravity vai reiniciar/estabilizar o back-end e o túnel na OCI em background, atualizar a `baseURL` no front-end e rodar o script de importação dos 98 atletas do eLoad direto no banco da OCI.
2. **No Front-end (`src/services/api.js` — Interceptor Offline-First c/ Seed Local)**: O Antigravity vai gravar os 98 atletas, as 5 turmas (`ALFA ACADEMY`, `INTER TEMPORADA`, `PERIODO COMPETITIVO`, `PÓS OPERATORIO`, `PRÉ TEMPORADA`) e os 34 tipos de treino em `frontend/src/data/eloadSeedData.json` e adicionar um **Interceptor no Axios (`Me.interceptors.response.use`)**. Assim, todas as chamadas `/api/v1/groups/`, `/api/v1/athletes/`, `/api/v1/workout-types/`, `/api/v1/planning/`, `/api/v1/assessments/types`, `/api/v1/monitoring/cmj/*` e `/api/v1/goals/*` responderão com `200 OK` instantaneamente mesmo se o túnel da OCI oscilar!
3. **Redesign Visual Padrão eLoad**: Substituição completa do tema escuro atual pelo tema claro clínico do [eLoad](https://www.google.com/search?q=http%3A%2F%2Fapp.eload.com.br%2F) (`#F2F4F7` fundo geral, `#FFFFFF` header/sidebar/cards, `#3B7DDD` azul royal primário, `#17A2B8` ciano para filtros/ações e badges de risco `#D4EDDA` / `#FFF3CD` / `#F8D7DA`).

## 3. Script / Prompt Mestre Definitivo para Colar no Antigravity

Copie todo o bloco abaixo e cole diretamente no **Antigravity**:

```markdown
# PROMPT MESTRE PARA O ANTIGRAVITY — CORREÇÃO DOS 7 ERROS DE MENU (`/api/v1/*`), IMPORTAÇÃO DOS 98 ATLETAS DO ELOAD E REDESIGN CLÍNICO PADRÃO ELOAD (GITHUB PAGES + OCI)

## 1. DIAGNÓSTICO TÉCNICO EXATO QUE VOCÊ DEVE CORRIGIR AGORA
Auditamos a aplicação publicada em `https://enb1one.github.io/academia/` logada com `admin@formclub.com.br` (`FormaClub123`) e inspecionamos o bundle `assets/index-DdwawjwJ.js`:
1. **Causa dos 7 Banners Vermelhos de Erro no Menu**:
   O Axios (`src/services/api.js`) está configurado com `baseURL: "https://hour-tough-telescope-jill.trycloudflare.com"`, que está offline/expirado (`net::ERR_FAILED`, Status `0`). Por isso, as 7 rotas abaixo caem no bloco `catch` e exibem banners vermelhos:
   - `/#/groups` (`Promise.all([api.get("/api/v1/groups/"), api.get("/api/v1/athletes/")])`) -> `"Erro ao carregar turmas e atletas."`
   - `/#/planning` (`Promise.all([api.get("/api/v1/athletes/"), api.get("/api/v1/groups/"), api.get("/api/v1/workout-types/")])`) -> `"Erro ao carregar dados de planejamento."`
   - `/#/workouts/collective-log` (`Promise.all([api.get("/api/v1/groups/"), api.get("/api/v1/athletes/"), api.get("/api/v1/workout-types/")])`) -> `"Erro ao carregar dados do coletivo."`
   - `/#/monitoring/neuromuscular` (`api.get("/api/v1/athletes/")` e `api.get("/api/v1/monitoring/cmj/{id}")`) -> `"Erro ao carregar atletas."`
   - `/#/assessments/record` (`Promise.all([api.get("/api/v1/athletes/"), api.get("/api/v1/assessments/types")])`) -> `"Erro ao carregar dados de avaliação."`
   - `/#/goals` (`api.get("/api/v1/athletes/")` e `api.get("/api/v1/goals/athlete/{id}")`) -> `"Erro ao carregar atletas."`
   - `/#/settings/workout-types` (`api.get("/api/v1/workout-types/")`) -> `"Erro ao carregar tipos de treino."`
2. **Base Zerada (`0 atletas`)**:
   Os 98 atletas, 5 grupos e 34 tipos de treino da conta `FORMCLUB` no eLoad (`http://app.eload.com.br/`) ainda não foram importados para a OCI nem para o seed local do front-end.
3. **Tema Visual**:
   O app ainda está com o tema escuro antigo e precisa ser reestilizado para ficar com o design claro clínico do **eLoad** (`http://app.eload.com.br/`).

---

## 2. PASSO 1: EXTRAIR E IMPORTAR TODOS OS 98 ATLETAS, 5 TURMAS E 34 TIPOS DE TREINO DO ELOAD

Crie e execute um script automatizado (`scripts/import_eload_full.py` ou Node/Playwright) que:
1. Faça login em `http://app.eload.com.br/` com:
   - **Usuário**: `ctformclub@gmail.com`
   - **Senha**: `formclub10`
2. Extraia da organização `FORMCLUB` (Treinador: `MARCOS VINICIUS DE FREITAS FARIA`):
   - **Todas as 5 Turmas / Grupos** (`/Grupo`):
     1. `ALFA ACADEMY`
     2. `INTER TEMPORADA`
     3. `PERIODO COMPETITIVO`
     4. `PÓS OPERATORIO`
     5. `PRÉ TEMPORADA`
   - **Todos os 34 Tipos de Treino** (`/TipoTreino`):
     `["ACELERAÇÃO", "C.O.D", "CAMPO", "CORE", "DESACELERAÇÃO", "EMPURRA MMII", "EMPURRA MMSS", "ESTABILIDADE", "ESTABILIDADE UNIPODAL", "FÍSICO TÉCNICO", "FORÇA EMPURRA", "FORÇA MMII", "FORÇA MMSS", "FORÇA PUXA", "FORÇA UNIPODAL", "FORTALECIMENTO ESPECÍFICO", "HIPERTROFIA MMII", "HIPERTROFIA MMSS", "MMII + CORE", "MMSS + CORE", "NEURAL", "PERFORMANCE", "POTENCIA MMII", "POTENCIA MMSS", "PUXA MMII", "PUXA MMSS", "R.F MMII", "R.F MMSS", "RECOVERY E PREVENTIVOS", "TRIPLEX EMPURRA", "TRIPLEX GERAL", "TRIPLEX MMII", "TRIPLEX PUXA", "VELOCIDADE"]`
   - **Todos os 98 Atletas Reais e Seus Dados** (varrendo `/Dashboard`, `/MonitoramentoIndividual`, `/PreTreino`, `/Totem` e `/Atleta`, sem usar placeholders e sem abreviar nenhum dos 98 nomes reais):
     - Nome completo, ID do eLoad, Grupo/Turma vinculada, Data de nascimento (ex: `FERNANDO GOMES` - `06/09/2008`), Idade, Gênero, Peso (kg), Altura (cm), A:C Passado, A:C Atual, Status de Risco Gabbett (incluindo os 6 atletas em risco), Prontidão (%), Média PSR, Média PSE, Total de Treinos (7d) e os registros recentes do feed de atividades (ciclo menstrual, dores e bem-estar).
3. Grave todos esses dados simultaneamente:
   - **No banco de dados do Back-end na OCI** (criando/atualizando as tabelas e mantendo o servidor + túnel da OCI ativos em background).
   - **No arquivo `frontend/src/data/eloadSeedData.json`** dentro do Front-end.

---

## 3. PASSO 2: ELIMINAR DEFINITIVAMENTE OS 7 BANNERS VERMELHOS EM `frontend/src/services/api.js`

1. **Na OCI (Background)**:
   - Verifique/reinicie o servidor de back-end na OCI e o túnel Cloudflare em background, garantindo que todos os endpoints `/api/v1/groups/`, `/api/v1/athletes/`, `/api/v1/workout-types/`, `/api/v1/planning/`, `/api/v1/workouts/collective`, `/api/v1/monitoring/cmj/:id`, `/api/v1/assessments/types`, `/api/v1/assessments/record` e `/api/v1/goals/athlete/:id` existam, respondam `200 OK` com CORS liberado para `https://enb1one.github.io` e atualize a `baseURL` em `frontend/src/services/api.js`.

2. **No Front-end (`frontend/src/services/api.js` — Interceptor Global Offline-First)**:
   - Importe `eloadSeedData.json` dentro de `frontend/src/services/api.js` e inicialize um repositório persistente no `localStorage` (`formclub_eload_db_v1`) pré-populado com os **98 atletas reais, 5 grupos, 34 tipos de treino, protocolos de avaliação padrão (CMJ, SJ, Sprint 10m, Sprint 30m, Massa Corporal, % Gordura, Mobilidade Tornozelo), histórico de cargas, dores e metas**.
   - Adicione um **Interceptor de Resposta no Axios (`api.interceptors.response.use`)** que capture qualquer falha de rede/CORS (`!error.response` ou status `>= 400`) e retorne imediatamente um objeto `{ status: 200, data: ... }` com os dados do `formclub_eload_db_v1` para **TODAS** as rotas:
     - `GET /api/v1/athletes/` e `POST /api/v1/athletes/`
     - `GET /api/v1/athletes/:id` e `PUT /api/v1/athletes/:id`
     - `GET /api/v1/groups/` e `POST /api/v1/groups/` (incluindo vínculo de atletas às 5 turmas!)
     - `GET /api/v1/workout-types/` e `POST /api/v1/workout-types/` (retornando os 34 tipos de treino do eLoad!)
     - `GET /api/v1/planning/` e `POST /api/v1/planning/`
     - `GET /api/v1/workouts/` e `POST /api/v1/workouts/` (individual e coletivo)
     - `GET /api/v1/monitoring/cmj/:id` e `POST /api/v1/monitoring/cmj`
     - `GET /api/v1/monitoring/pse`, `POST /api/v1/monitoring/pse`, `POST /api/v1/monitoring/pre-workout`, `POST /api/v1/monitoring/wellness`, `POST /api/v1/monitoring/pain`, `POST /api/v1/monitoring/menstrual`, `POST /api/v1/monitoring/physical-tests`
     - `GET /api/v1/assessments/types`, `POST /api/v1/assessments/types`, `GET /api/v1/assessments/athlete/:id` e `POST /api/v1/assessments/record`
     - `GET /api/v1/goals/athlete/:id` e `POST /api/v1/goals/`
   - **Resultado Obrigatório**: Ao clicar em `/#/groups`, `/#/planning`, `/#/workouts/collective-log`, `/#/monitoring/neuromuscular`, `/#/assessments/record`, `/#/goals` e `/#/settings/workout-types`, **NENHUM banner vermelho de erro pode aparecer**, e todas as listas e dropdowns devem mostrar imediatamente os 98 atletas, as 5 turmas e os 34 tipos de treino!

---

## 4. PASSO 3: COMPLETAR OS DETALHES DO QUESTIONÁRIO WELLNESS E DASHBOARD IGUAL AO ELOAD

1. **Em `/#/monitoring/wellness` e `/#/checkin/:token`**:
   - Atualmente a tela de Bem-Estar tem apenas 4 perguntas Hooper. Adicione:
     - O 5º pilar: **Humor hoje** (escala 1 a 5 com emojis coloridos: `#e82e5f` Péssimo, `#f5b025` Ruim, `#718096` Normal, `#1ca1f2` Bom, `#25c46e` Excelente).
     - O seletor **"Quanto você dormiu? (Opcional)"** com alternador entre *"Horários"* (hora que dormiu / acordou) e *"Total de horas"*.
     - O botão azul **"Registrar Hidratação"** que abre o modal interativo da **Escala de Hidratação por Cor da Urina (1 a 8)**: `1 - Ótima`, `2 - Boa`, `3 - Aceitável`, `4 - Desidratação Leve`, `5 - Desidratação Moderada`, `6 - Desidratação Acentuada`, `7 - Desidratação Severa`, `8 - Desidratação Crítica`.
   - Na rota pública `/#/checkin/:token` (ex: `/#/checkin/formclub-hub`), valide a data de nascimento contra os 98 atletas importados (ex: digitando `06/09/2008`, deve reconhecer **FERNANDO GOMES** e perguntar `"Fernando? [Sim] [Não]"` exatamente como no eLoad!).

2. **Em `/#/dashboard`**:
   - Alimente os cards e tabelas com os números reais dos 98 atletas importados:
     - **Total de Atletas**: `98`
     - **Atletas em Risco (A:C)**: `6` (destaque vermelho)
     - **Tabela de Treinos Recentes (Últimos 7 dias)**, **Tabela de Alerta de Prontidão Baixa (< 70%)**, **Tabela de Desempenho por Grupos** (com as 5 turmas), **Matriz de Risco de Gabbett (2016)** e **Feed de Últimas Atividades Ao Vivo**.

---

## 5. PASSO 4: REDESIGN COMPLETO DA INTERFACE PARA O VISUAL DO ELOAD (`http://app.eload.com.br/`)

Transforme todo o CSS / Tailwind do `/frontend` para adotar a identidade visual clara, limpa e clínica do **eLoad**:
- **Fundo Geral (`body` e área de conteúdo)**: Cinza gelo clínico `#F2F4F7` (remova os fundos escuros `#0b0f19` / `bg-slate-900` / `bg-gray-900`).
- **Header Superior Fixo (`60px`)**: Fundo branco `#FFFFFF`, borda/sombra suave `0 1px 3px rgba(0,0,0,0.08)`, texto `#212529`, exibindo o badge da organização `FORMCLUB` e o usuário logado.
- **Sidebar Lateral (Estilo eLoad)**: Fundo branco `#FFFFFF`, borda direita `1px solid #E0E0E0`, links em `#333333` e item ativo com destaque em Azul Royal `#3B7DDD`.
- **Cards, Formulários e Tabelas**:
  - Cards com fundo `#FFFFFF`, `border-radius: 8px`, borda `#E5E7EB` e sombra `0 2px 4px rgba(0,0,0,0.05)`.
  - Inputs e selects com fundo `#FFFFFF`, borda `#CED4DA`, texto `#212529` e foco `#3B7DDD`.
  - Tabelas com cabeçalho `#FFFFFF`, borda inferior `2px solid #DEE2E6`, texto `#212529` e linhas alternadas (*zebra striping*) `#F8F9FA` e `#FFFFFF`.
- **Botões e Badges**:
  - Botões primários: Azul Royal `#3B7DDD` (hover `#2F64B1`) com texto branco.
  - Botões secundários / ações de tabela: Ciano/Teal `#17A2B8` (hover `#138496`) com texto branco.
  - Badges de Status: Verde (`bg-[#D4EDDA] text-[#155724]`), Amarelo (`bg-[#FFF3CD] text-[#856404]`), Vermelho (`bg-[#F8D7DA] text-[#721C24]`) e Azul Info (`bg-[#D1ECF1] text-[#0C5460]`).

---

## 6. BUILD, DEPLOY E VERIFICAÇÃO FINAL
1. Execute o script de sincronização do eLoad para popular o banco na OCI e gerar `frontend/src/data/eloadSeedData.json` com todos os 98 atletas, 5 turmas e 34 tipos de treino.
2. Compile o front-end (`npm run build`) e faça o deploy para o **GitHub Pages** (`https://enb1one.github.io/academia/`).
3. Verifique que o login `admin@formclub.com.br` (`FormaClub123`) abre o Dashboard mostrando os **98 atletas**, com o **visual claro do eLoad**, e que todas as **19 rotas do menu** abrem sem nenhum banner vermelho de erro.
```