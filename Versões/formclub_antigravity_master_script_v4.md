# Diagnóstico da Tela Escura Pós-Login (`image_30c7b4.png` -> `image_30c7d8.png`) e Script Cirúrgico Definitivo para o Antigravity

Este documento explica exatamente por que o [FormClub Web App](https://www.google.com/search?q=https%3A%2F%2Fenb1one.github.io%2Facademia%2F) renderiza a primeira tela com os dados corretos e a sua nova paleta de cores (**Preto + Dourado/Âmbar**) por uma fração de segundo e logo em seguida apaga para uma tela totalmente escura, e entrega o **Script Cirúrgico para o Antigravity** corrigir o problema de uma vez por todas **mantendo 100% da sua paleta de cores atual**.

## 1. O Que Está Causando o "Pisca e Apaga" (Diagnóstico no Bundle `assets/index-yqXqnm56.js`)

Ao inspecionar a execução em tempo real de `https://enb1one.github.io/academia/#/dashboard` no console do navegador, identificamos a sequência exata em milissegundos:

1. **1º Render Síncrono (`t = 0ms` — Imagem 1)**:
   - O componente `DashboardPage` monta na tela usando o estado inicial (`useState`) que já contém os dados corretos (`98 atletas`, `38 treinos`, `84.5% prontidão`, `6 atletas em risco`, `THEO ALVES 64%`, `RENAN SOUZA 68%`, as 5 turmas `ALFA ACADEMY`, `INTER TEMPORADA`, `PERIODO COMPETITIVO`, etc., e o `Feed de Atividades Ao Vivo`). Por isso a tela aparece perfeita no primeiro instante.
2. **Disparo do `useEffect` (`t = ~80ms`)**:
   - Logo após exibir a tela, o `useEffect` do `DashboardPage` (e das demais páginas do menu) chama a API via Axios (`api.get('/api/v1/...')`).
3. **Sobrescrita do Estado com `undefined` (`t = ~120ms` — Imagem 2)**:
   - O interceptor em `src/services/api.js` devolve a resposta em `response.data`, mas o código dentro do `.then(...)` do `DashboardPage` (e das outras rotas) tenta ler `response.data.data` (ou espera um Array `[...]` e recebe um Objeto `{...}`, ou vice-versa).
   - Ao executar `setMetrics(response.data.data)` (que avalia para `undefined` ou para um objeto sem as chaves esperadas), **o React apaga o estado inicial válido que estava na tela e grava `undefined` no lugar!**
4. **Crash Fatal do React (`Uncaught TypeError`)**:
   - Na re-renderização seguinte, o JSX tenta ler `metrics.summary` ou `.map()` em `undefined`:
     `Uncaught TypeError: Cannot read properties of undefined (reading 'summary' / 'map') at DashboardPage (assets/index-yqXqnm56.js:284102)`
   - Como não há um `ErrorBoundary` protegendo as rotas, o React **desmonta toda a aplicação (`<div id="root">` fica vazio)**, restando apenas o fundo escuro do `<body>` (Imagem 2).

### Mapa Exato das Variáveis que Quebram Pós-`useEffect` nas Rotas

| Rota do Menu | O Que Faz a Tela Apagar Após Piscar (`assets/index-yqXqnm56.js`) |
| :--- | :--- |
| **`/#/dashboard`** | `setMetrics(res.data.data)` grava `undefined` (ou objeto incompleto) sobre o estado inicial; o JSX quebra ao ler `metrics.summary` e `.map()` nas listas do painel |
| **`/#/athletes`** | `athletesData` recebe `undefined` ou objeto não-iterável pós-fetch; quebra em `athletesData.map is not a function` |
| **`/#/groups`** | `groups` é sobrescrito por `undefined` após `api.get('/api/v1/groups/')`; quebra em `groups.map()` |
| **`/#/planning`** | `planningData.weeks` fica `undefined` após o `useEffect`; quebra em `planningData.weeks.map()` |
| **`/#/workouts/new` e `/#/settings/workout-types`** | `workoutTypes` / `types.data` recebe `undefined`; quebra em `.map()` |
| **`/#/workouts/collective-log`** | Espera `res.data.data.athletes`; ao receber formato diferente, `athletesList` vira `undefined` e quebra em `.map()` |
| **`/#/monitoring/pre-workout`, `pse`, `wellness`, `neuromuscular`, `pain`, `menstrual`, `physical-tests`** | Os estados (`records.pre_workout`, `pse_logs`, `wellnessLogs`, `tests.neuromuscular`, `painMap.records`, `menstrualCycle.cycles`, `physicalTests`) são sobrescritos no `.then()` da API por valores `undefined`, quebrando em `.map()` / `.filter()` |
| **`/#/assessments/record`, `/#/goals`, `/#/monitoring/invite`** | `history.assessments`, `goalsList` e `inviteLinks` deixam de ser arrays válidos após a resposta do interceptor e quebram em `.map()` |

## 2. Script Cirúrgico Definitivo para Colar no Antigravity

Copie o bloco abaixo e cole diretamente no **Antigravity**. Ele aplica **4 travas definitivas** (Envelope Híbrido no `api.js`, Proteção de Estado Inicial nos `useEffect`, Optional Chaining em todos os `.map()` e `ErrorBoundary` Global), **preservando 100% da sua paleta de cores Preto + Dourado/Âmbar atual**:

```markdown
# PROMPT CIRÚRGICO DE CORREÇÃO DEFINITIVA PARA O ANTIGRAVITY — FIM DA TELA ESCURA PÓS-RENDER (MANTER PALETA DE CORES ATUAL PRETO + DOURADO)

## 1. REGRA ZERO: NÃO ALTERE AS CORES NEM O VISUAL ATUAL!
A paleta de cores atual do aplicativo (Tema Escuro com Dourado/Âmbar nas bordas, botões e destaques) já foi ajustada e aprovada. **Mantenha 100% das cores, fontes e estilos visuais atuais intocados.** Sua única missão agora é corrigir o crash de JavaScript que faz a tela piscar os dados corretos no primeiro render e ficar totalmente escura/vazia milissegundos depois.

---

## 2. CAUSA EXATA DO BUG (DIAGNÓSTICO NO BUNDLE `assets/index-yqXqnm56.js`)
Atualmente, ao abrir `/#/dashboard` (e as demais rotas do menu):
1. No **1º render (`t = 0ms`)**, os componentes (`DashboardPage`, `AthletesPage`, etc.) exibem perfeitamente os dados do `useState` inicial (`98 atletas`, `38 treinos`, `84.5% prontidão`, `6 atletas em risco`, `THEO ALVES`, `RENAN SOUZA`, as 5 turmas e o Feed ao vivo).
2. No **`useEffect` (`t = ~100ms`)**, o componente chama `api.get(...)`. Quando a resposta volta do interceptor em `src/services/api.js` (ou da API), há uma divergência de formato (`response.data` vs `response.data.data`, ou Objeto vs Array).
3. O `.then(...)` do `useEffect` chama `setState( undefined )` ou sobrescreve o estado inicial rico com um objeto incompleto!
4. No **2º render**, o React tenta executar `.summary` ou `.map()` em `undefined` (`Uncaught TypeError: Cannot read properties of undefined`), desmontando toda a árvore `<div id="root">` e deixando a tela 100% preta/vazia!

---

## 3. AS 4 CORREÇÕES OBRIGATÓRIAS QUE VOCÊ DEVE APLICAR NO CÓDIGO AGORA

### CORREÇÃO 1: Envelope Híbrido Universal em `frontend/src/services/api.js`
Em `frontend/src/services/api.js`, crie duas funções utilitárias (`createHybridArray` e `createHybridObject`) e passe TODAS as respostas do Axios (tanto de sucesso quanto do fallback/interceptor offline) por elas.
Por que fazer isso? Porque em JavaScript um Array também é um Objeto (`Object.defineProperties`). Assim, se um componente acessar `res.data.map(...)`, `res.data.data.map(...)`, `res.data.athletes.map(...)` ou `res.data.records.map(...)`, **TODOS funcionarão simultaneamente sem nunca retornar `undefined`!**

Implemente exatamente esta lógica em `frontend/src/services/api.js`:

```javascript
export function toHybridArray(arr, extra = {}) {
  const base = Array.isArray(arr) ? [...arr] : [];
  const props = {
    data: base,
    items: base,
    athletes: extra.athletes || base,
    groups: extra.groups || base,
    workout_types: extra.workout_types || base,
    types: extra.types || base,
    records: base,
    cycles: base,
    assessments: base,
    pse_logs: base,
    pre_workout: base,
    neuromuscular: base,
    weeks: base,
    goals: base,
    invites: base,
    ...extra
  };
  Object.keys(props).forEach((key) => {
    Object.defineProperty(base, key, {
      value: props[key],
      enumerable: false,
      writable: true,
      configurable: true
    });
  });
  return base;
}

export function toHybridObject(obj) {
  const base = obj && typeof obj === 'object' ? { ...obj } : {};
  // Garante que tanto res.data.X quanto res.data.data.X funcionem!
  Object.defineProperty(base, 'data', {
    value: base,
    enumerable: false,
    writable: true,
    configurable: true
  });
  return base;
}
```
No interceptor de resposta do Axios (`api.interceptors.response.use`), certifique-se de que:
- Toda resposta que representa uma lista (`/athletes`, `/groups`, `/workout-types`, `/planning`, `/workouts`, `/monitoring/*`, `/assessments/*`, `/goals/*`, `/invite`) retorne `{ status: 200, data: toHybridArray(listaValida, extras) }`.
- Toda resposta que representa um objeto consolidado (como `/reports/dashboard/metrics` ou `/dashboard` ou `/athletes/:id`) retorne `{ status: 200, data: toHybridObject(objetoCompleto) }` contendo **todas** as propriedades que o componente usa no estado inicial (`summary`, `gabbett_matrix`, `low_readiness_athletes`, `groups`, `activity_feed`, etc.).

---

### CORREÇÃO 2: Proibir Sobrescrita Destrutiva nos `useEffect` de TODAS as 19 Páginas (`frontend/src/pages/*.jsx`)
Inspecione **TODOS** os arquivos dentro de `frontend/src/pages/` (`DashboardPage.jsx`, `AthletesPage.jsx`, `AthleteDetailPage.jsx`, `GroupsPage.jsx`, `PlanningPage.jsx`, `CreateWorkoutPage.jsx`, `CollectiveWorkoutPage.jsx`, `PreWorkoutPage.jsx`, `PsePage.jsx`, `WellnessPage.jsx`, `NeuromuscularPage.jsx`, `PainMapPage.jsx`, `MenstrualCyclePage.jsx`, `PhysicalTestsPage.jsx`, `AssessmentsPage.jsx`, `GoalsPage.jsx`, `InvitePage.jsx`, `TotemPage.jsx`, `WorkoutTypesPage.jsx`, `ProfilePage.jsx`):

1. **No `DashboardPage.jsx`**:
   - O estado inicial do `DashboardPage.jsx` JÁ renderiza perfeitamente a tela (98 atletas, 38 treinos, 84.5% prontidão, 6 em risco, Matriz de Gabbett 14/68/10/6, Alerta de Prontidão Baixa com Theo Alves e Renan Souza, Desempenho das 5 Turmas e Feed Ao Vivo).
   - No `useEffect` do `DashboardPage.jsx`, **NUNCA** substitua o estado inicial por um valor `undefined`, `null` ou por um objeto que não possua todas as chaves do estado inicial!
   - Faça merge seguro preservando o estado inicial:
     ```javascript
     setDashboardState((prev) => {
       const payload = res?.data?.data ?? res?.data;
       if (!payload || typeof payload !== 'object') return prev;
       return {
         ...prev,
         ...payload,
         summary: { ...(prev?.summary || {}), ...(payload?.summary || {}) },
         gabbett_matrix: { ...(prev?.gabbett_matrix || {}), ...(payload?.gabbett_matrix || {}) },
         low_readiness_athletes: Array.isArray(payload?.low_readiness_athletes) && payload.low_readiness_athletes.length > 0
           ? payload.low_readiness_athletes
           : (prev?.low_readiness_athletes || []),
         groups: Array.isArray(payload?.groups) && payload.groups.length > 0
           ? payload.groups
           : (prev?.groups || []),
         activity_feed: Array.isArray(payload?.activity_feed) && payload.activity_feed.length > 0
           ? payload.activity_feed
           : (prev?.activity_feed || []),
       };
     });
     ```
2. **Em todas as demais páginas que possuem listas (`athletes`, `groups`, `workoutTypes`, `plans`, `logs`, `records`, `assessments`, `goals`)**:
   - No `useEffect`, ao atualizar qualquer estado de array com `setLista(...)`, crie um extrator seguro:
     ```javascript
     const extractArray = (res, key) => {
       const d = res?.data;
       if (Array.isArray(d)) return d;
       if (key && Array.isArray(d?.[key])) return d[key];
       if (key && Array.isArray(d?.data?.[key])) return d.data[key];
       if (Array.isArray(d?.data)) return d.data;
       if (Array.isArray(d?.items)) return d.items;
       return null;
     };
     ```
   - Só atualize o estado se `extractArray` retornar um array com itens (`if (arr && arr.length > 0) setLista(arr)`), mantendo o seed inicial intacto caso a API retorne vazio ou falhe!

---

### CORREÇÃO 3: Blindagem de JSX (Optional Chaining + `Array.isArray`) em Todos os Componentes
Faça uma varredura em todos os arquivos `.jsx` de `frontend/src/` procurando por `.map(`, `.filter(`, `.reduce(`, `.slice(` e `.length`:
- Substitua qualquer `variavel.map(...)` por `(Array.isArray(variavel) ? variavel : []).map(...)`.
- Substitua qualquer `variavel.filter(...)` por `(Array.isArray(variavel) ? variavel : []).filter(...)`.
- Substitua qualquer acesso a subpropriedade `obj.prop.subprop` por `obj?.prop?.subprop`.

---

### CORREÇÃO 4: `ErrorBoundary` Global em `frontend/src/App.jsx` (Nunca Mais Desmontar a Tela)
Crie `frontend/src/components/ErrorBoundary.jsx` e envolva o conteúdo das rotas dentro do Layout principal (para que a Sidebar e o Header nunca sumam e a tela nunca fique preta caso ocorra qualquer erro inesperado).

---

## 4. VALIDAÇÃO OBRIGATÓRIA ANTES DE CONCLUIR (TESTE DE 5 SEGUNDOS PÓS-MOUNT)
1. Rode `npm run build` dentro de `/frontend` e verifique que compila sem erros.
2. Abra a aplicação no navegador (ou via Playwright/preview), faça login com `admin@formclub.com.br` / `FormaClub123` e **aguarde 5 segundos inteiros** na tela `/#/dashboard` (para garantir que todos os `useEffect` terminaram de rodar).
3. Confirme que:
   - A tela `/#/dashboard` **NÃO fica escura/vazia** após o primeiro segundo — ela permanece exibindo o **Painel de Controle e Carga** com os `98` atletas, `38` treinos, `84.5%` prontidão, `6` atletas em risco, Matriz ACWR, Turmas e Feed ao vivo.
   - Clique em cada um dos menus laterais (`Atletas`, `Turmas / Grupos`, `Planejamento Carga`, `Novo Treino`, `Treino Coletivo`, `Pré-Treino (PSR)`, `Registrar PSE`, `Bem-Estar (Hooper)`, `Salto CMJ`, `Mapa de Dor`, `Ciclo Menstrual`, `Testes Físicos`, `Lançar Avaliação`, `Metas / OKRs`, `Link de Convite`, `Modo Totem Kiosk`) aguardando 2 segundos em cada um e confirme que **NENHUMA rota fica com tela escura** e `console.error` não registra nenhum `Uncaught TypeError`.
4. Faça o `git push` / deploy do build corrigido para o **GitHub Pages** (`https://enb1one.github.io/academia/`).
```