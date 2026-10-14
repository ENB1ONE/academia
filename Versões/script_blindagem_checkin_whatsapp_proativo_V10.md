# PROMPT ESPECIALISTA DE CORREÇÃO E BLINDAGEM PROATIVA PARA O ANTIGRAVITY — FIM DO CRASH `athleteFound is not defined`, CORREÇÃO DOS BOTÕES DE WHATSAPP NO PERFIL DO ATLETA E VARREDURA PREVENTIVA COMPLETA

## 1. DIAGNÓSTICO CIRÚRGICO DO ERRO NAS IMAGENS ENVIADAS E DOS BUGS OCULTOS ENCONTRADOS NO BUNDLE (`index-m1oXrgVS.js`)

Inspecionamos linha por linha o arquivo compilado em produção (`index-m1oXrgVS.js`) na rota `https://app.formclub.com.br/#/checkin/formclub-hub?athleteId=3` e identificamos **exatamente** a causa da tela preta e mais **4 falhas ocultas** que iam quebrar o fluxo na sequência:

1. **CAUSA DA TELA PRETA (`Uncaught ReferenceError: athleteFound is not defined at woe`)**:
   - No componente `CheckinPage.jsx` (compilado como `function woe()`), o código referencia `athleteFound` e chama `setAthleteFound(...)` no `useEffect`, na validação das 3 letras, no envio do questionário e no JSX, **mas esqueceu de declarar o state no topo do componente**:
     `const [athleteFound, setAthleteFound] = useState(null);`
   - Além disso, dentro do `useEffect` que lê o parâmetro `pkg`, o código atual fez:
     `const D = decodeURIComponent(escape(atob(decodeURIComponent(i)))); C = JSON.parse(D); setAthleteFound(D);`
     Ele passou a **string bruta `D`** para `setAthleteFound(D)` em vez do objeto parseado `C`!
2. **BUG OCULTO GRAVÍSSIMO NO FILTRO DE TREINOS (`is_active == 0` invertido!)**:
   - Dentro de `CheckinPage.jsx`, na função que filtra os treinos do atleta após o questionário, o código em produção está escrito assim:
     `.filter(N => String(N.athlete_id) === String(C) && N.is_active == 0)`
   - Ele está filtrando por **`is_active == 0` (treinos INATIVOS)** em vez de treinos ativos! Por isso, mesmo depois de corrigir a tela preta, as fichas ativas (`Treino Teste Admin`, `Força`) não iriam aparecer para o atleta!
3. **POR QUE O BOTÃO VERDE "ENVIAR WHATSAPP" NO PERFIL DO ATLETA (`/#/athletes/3`) AINDA MANDOU `?athleteId=3` SEM `&pkg=`**:
   - Na tela do Perfil do Atleta (`AthleteDetailPage.jsx`, aba `Treinos Programados / Fichas (A/B/C/D)`), os botões **Enviar WhatsApp** e **Copiar Link** continuavam com a string antiga chumbada:
     `https://app.formclub.com.br/#/checkin/formclub-hub?athleteId=${athlete.id}`
   - Eles não estavam gerando o pacote assinado `&pkg=` (com o nome `"Eduardo Augusto de Brito Campos"` e as fichas `"Treino Teste Admin"` e `"Força"`) e nem haviam migrado o `Código: #3` que já estava salvo no `localStorage` do treinador!
4. **CACHE DE SERVICE WORKER (`registerSW.js`) E WARNING DE META TAG NO CONSOLE**:
   - Na aba Network do DevTools, o `ServiceWorker` (`registerSW.js` / `sw.js`) está interceptando os scripts. Se o Service Worker não forçar atualização imediata (`skipWaiting` + limpeza de cache antigo), celulares que já abriram o link antes podem ficar presos no bundle antigo.
   - O `index.html` está sem `<meta name="mobile-web-app-capable" content="yes">`, gerando aviso de depreciação no console.

---

## 2. CORREÇÕES OBRIGATÓRIAS E PROATIVAS QUE VOCÊ DEVE APLICAR AGORA

### PASSO 1: Corrigir e Blindar 100% o `frontend/src/pages/CheckinPage.jsx`
Abra `frontend/src/pages/CheckinPage.jsx` e aplique todas estas correções:

1. **Declarar Todos os Estados no Topo do Componente (Fim do `ReferenceError`)**:
   - Certifique-se de que logo nas primeiras linhas de `CheckinPage` estejam declarados explicitamente:
     `const [athleteFound, setAthleteFound] = useState(null);`
     `const [assignedWorkouts, setAssignedWorkouts] = useState([]);`
   - Faça uma busca por qualquer referência a `athleteFound` ou `setAthleteFound` no arquivo inteiro e confirme que **nenhuma** ocorre fora do escopo do componente ou antes da declaração do `useState`.

2. **Corrigir a Decodificação do Parâmetro `pkg` no `useEffect` de `CheckinPage.jsx`**:
   - Quando `pkg` existir na URL:
     - Decodifique o JSON: `const parsed = JSON.parse(decodeURIComponent(escape(atob(decodeURIComponent(pkgParam)))));`
     - Monte o objeto completo do atleta a partir do `parsed` (nunca passe a string bruta para `setAthleteFound`!):
       `const pkgAthlete = { id: parsed.i || parsed.id, codigoAtleta: parsed.i || parsed.id, name: parsed.n || parsed.name, group: parsed.g || parsed.group || 'ALFA ACADEMY', birth_date: parsed.b || parsed.birth_date || '' };`
       `setAthleteFound(pkgAthlete);`
     - Se `parsed.w` (lista de treinos ou objeto de treino) vier no pacote `pkg`, normalize como array de fichas (ordenadas por `order_index` de cada exercício) e salve tanto em `setAssignedWorkouts(...)` quanto no `localStorage` local do celular para aquele atleta!

3. **Corrigir o Filtro Invertido `is_active` ao Carregar os Treinos do Atleta**:
   - Na função que busca os treinos do atleta (tanto do `pkg` quanto de `api.get('/api/v1/workouts')` / `localStorage`), **REMOVA o bug `N.is_active == 0`**!
   - Um treino é ativo quando `N.is_active !== 0 && N.is_active !== false && N.is_active !== '0'`.
   - Filtre os treinos daquele atleta verificando tanto o ID quanto o Nome Completo (case-insensitive):
     `const isSameAthlete = String(w.athlete_id) === String(targetId) || (targetName && String(w.athlete_name || '').trim().toLowerCase() === String(targetName).trim().toLowerCase());`
     `const isActive = w.is_active === undefined || w.is_active === null || w.is_active === true || w.is_active === 1 || w.is_active === '1';`
   - Ordene sempre os exercícios de cada treino por `order_index` crescente (`1, 2, 3...`).

---

### PASSO 2: Criar Função Única `buildAthleteWhatsappLink(athlete, workouts)` e Usar em TODOS os Botões de WhatsApp / Copiar Link
Crie `frontend/src/utils/shareWorkoutLink.js` e use-o em **TODOS** os lugares onde se copia link ou envia WhatsApp (**especialmente na aba `Treinos Programados / Fichas (A/B/C/D)` dentro de `AthleteDetailPage.jsx`**, em `CreateWorkoutPage.jsx` e em `InvitePage.jsx`):

1. **O que `buildAthleteWhatsappLink(athlete, allWorkouts)` deve fazer**:
   - Filtra todas as fichas de treino pertencentes àquele `athlete` (por `athlete_id` ou por `athlete_name`).
   - Gera um ID seguro não-conflitante caso o atleta tenha sido criado localmente com ID numérico colidente (ex: se `athlete.name` for `"Eduardo Augusto de Brito Campos"` e `athlete.id` for `3`, usa `"ath_eduardo_augusto_de_brito_campos"`).
   - Monta o payload compacto:
     `const payload = { i: safeId, n: athlete.name, g: athlete.group || 'ALFA ACADEMY', b: athlete.birth_date || '', w: athleteWorkouts.map(w => ({ id: w.id, title: w.title || w.name, type: w.workout_type || w.type || 'A', date: w.scheduled_date || w.date || '', exercises: (w.exercises || []).map((ex, idx) => ({ order_index: idx + 1, name: ex.name, sets: ex.sets, reps: ex.reps, load_kg: ex.load_kg ?? ex.load ?? '', rest_seconds: ex.rest_seconds ?? ex.rest ?? '', notes: ex.notes || '' })) })) };`
   - Codifica em Base64 URL-Safe:
     `const pkg = encodeURIComponent(btoa(unescape(encodeURIComponent(JSON.stringify(payload)))));`
   - Retorna a URL completa:
     `https://app.formclub.com.br/#/checkin/formclub-hub?athleteId=${encodeURIComponent(safeId)}&athleteName=${encodeURIComponent(athlete.name)}&pkg=${pkg}`

2. **Substituir nos Botões de `AthleteDetailPage.jsx` (Aba `Treinos Programados / Fichas`)**:
   - No botão verde **`Enviar WhatsApp`** e no botão **`Copiar Link`** (mostrados na imagem do usuário onde aparece *Eduardo Augusto de Brito Campos* com *Treino Teste Admin* e *Força*), chame `buildAthleteWhatsappLink(athlete, athleteWorkouts)`!
   - Assim, o link enviado no WhatsApp **sempre** levará o `athleteName` e o `&pkg=` com as fichas `Treino Teste Admin` e `Força` embutidas!

---

### PASSO 3: Migração Automática dos Dados Já Salvos no `localStorage` do Treinador (Caso `Eduardo Augusto` com `Código: #3`)
No `frontend/src/services/api.js` (logo na inicialização do banco local `formclub_eload_db_v1`):
1. Verifique se existe no `localStorage` qualquer atleta cujo nome não seja `"ADRIELLI"` mas que esteja com `id == 3` (como `"Eduardo Augusto de Brito Campos"`), ou qualquer atleta cadastrado pelo treinador cujo ID numérico colida com os 98 atletas originais do `eloadSeedData.json`.
2. Converta automaticamente o `id` desse atleta para o formato slug único (`"ath_eduardo_augusto_de_brito_campos"`), **atualize todos os treinos (`workouts`) daquele atleta** para apontarem para `"ath_eduardo_augusto_de_brito_campos"` (mantendo também `athlete_name: "Eduardo Augusto de Brito Campos"` em cada treino), e se o treinador acessar `/#/athletes/3` mas o treino/contexto for do Eduardo, redirecione ou resolva sem perder as fichas `Treino Teste Admin` e `Força`!
3. E no `CheckinPage.jsx`, caso alguém clique no link antigo que já foi enviado no WhatsApp (`/#/checkin/formclub-hub?athleteId=3` sem `pkg`), o componente **não dará tela preta**: ele abrirá normalmente sem `ReferenceError` e permitirá ao atleta confirmar sua identidade ou buscar pelo seu nome/data de nascimento!

---

### PASSO 4: Varredura Proativa de Cache (`ServiceWorker`), Meta Tags e URLs de API
1. **Desregistrar / Atualizar Service Worker Antigo (`registerSW.js` / `main.jsx`)**:
   - Em `frontend/src/main.jsx` (e `frontend/public/registerSW.js`), adicione um limpador automático de versão de Service Worker e `CacheStorage` (ex: chave `formclub_sw_version = 'v2026.10.14.2'`) que execute `navigator.serviceWorker.getRegistrations().then(regs => regs.forEach(r => r.update()))` e limpe caches antigos de bundles JS para garantir que nem o PC do treinador nem o celular do atleta carreguem código antigo do `(ServiceWorker)`!
2. **Corrigir o Warning do Console em `frontend/index.html`**:
   - Adicione `<meta name="mobile-web-app-capable" content="yes" />` junto com `<meta name="apple-mobile-web-app-capable" content="yes" />`.
3. **Remover Qualquer Chamada Residual ao Túnel Antigo (`hour-tough-telescope-jill.trycloudflare.com`)**:
   - No `api.js`, não faça chamadas de rede para o túnel desligado `hour-tough-telescope-jill.trycloudflare.com` se não houver `VITE_API_BASE_URL` ativa, resolvendo diretamente pelo motor local sincronizado em <5ms sem gerar erros vermelhos de `CORS / ERR_FAILED` no console!
4. **Auditoria de `ReferenceError` / Variáveis Não Declaradas no Build**:
   - Antes de gerar o build final, passe o linter/compilador em todos os arquivos `.jsx` (`CheckinPage.jsx`, `AthleteDetailPage.jsx`, `CreateWorkoutPage.jsx`, `PlanningPage.jsx`, `DashboardPage.jsx`) para garantir que **nenhuma variável não declarada** exista em nenhum componente.

---

## 3. TESTE DE ACEITAÇÃO OBRIGATÓRIO ANTES DO DEPLOY
1. Rode `npm run build` no `/frontend` e inicie o preview.
2. Abra `http://localhost:4173/#/checkin/formclub-hub?athleteId=3` com o DevTools Console aberto:
   - Confirme que **NÃO ocorre `ReferenceError: athleteFound is not defined`** e que a tela carrega perfeitamente (zero tela preta!).
3. Entre no perfil do atleta **Eduardo Augusto de Brito Campos**, vá na aba **Treinos Programados / Fichas (A/B/C/D)** e clique no botão verde **Enviar WhatsApp** / **Copiar Link**:
   - Confirme que o link gerado contém `&athleteName=Eduardo...&pkg=...`.
   - Abra esse link em uma aba anônima mobile (443x824): confirme que exibe **"Você é: EDUARDO AUGUSTO DE BRITO CAMPOS?"** (`EX: EDU`), que após responder o questionário exibe as fichas **`Treino Teste Admin`** e **`Força`** com seus exercícios na ordem exata, e que o Console do DevTools tem **ZERO erros vermelhos**!
4. Confirme que `dist/CNAME` contém `app.formclub.com.br` e publique na branch `gh-pages`.
