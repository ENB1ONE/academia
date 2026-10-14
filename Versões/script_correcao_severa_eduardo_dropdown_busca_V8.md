# PROMPT DE CORREÇÃO SEVERA PARA O ANTIGRAVITY — 3 CORREÇÕES CRÍTICAS (DROPDOWN TIPO DE TREINO, CAMPO DE BUSCA DE ATLETAS E ERRO DO LINK WHATSAPP EDUARDO AUGUSTO vs. ADRIELLI) + ERROS OCULTOS

## 1. RESUMO DOS 3 BUGS CRÍTICOS QUE VOCÊ DEVE CORRIGIR AGORA EM https://app.formclub.com.br

1. **BUG 1 — Dropdown de "Tipo de Treino / Modalidade" Fica Todo Preto/Vazio no Planejamento Individual e Coletivo (`/#/planning` e demais telas)**:
   - **Causa no Código**: Em `eloadSeedData.json` e `api.js`, `workoutTypes` está salvo como array de strings (`["ACELERAÇÃO", "C.O.D", ...]`), mas o `<select>` em `PlanningPage.jsx` tenta ler `type.name` (`<option value={type.id}>{type.name}</option>`). Como uma string não tem `.name`, as 34 opções ficam com texto `undefined` (em branco) sobre fundo preto!
2. **BUG 2 — Campo de Seleção de Atleta em "Prescrição de Fichas (A/B/C/D)" (`/#/workouts/new`) Sem Busca por Nome**:
   - **Causa no Código**: Hoje é um `<select>` nativo simples com 100 nomes. O treinador precisa que o campo funcione **tanto como uma lista suspensa clicável quanto como um campo de busca digitável** para achar qualquer atleta instantaneamente.
3. **BUG 3 (GRAVÍSSIMO) — Treino Criado para "Eduardo Augusto de Brito Campos" Gerou Link `?athleteId=3` e Abriu no Celular como "ADRIELLI"**:
   - **Causa Exata no Código**:
     - Quando o treinador cadastrou o **Eduardo Augusto de Brito Campos** no computador, o sistema gerou o ID sequencial local `3` (`athleteId=3`) salvo apenas no `localStorage` do computador do treinador.
     - Quando o **Eduardo Augusto** abriu o link `https://app.formclub.com.br/#/checkin/formclub-hub?athleteId=3` no iPhone dele, o celular não tem acesso ao `localStorage` do computador do treinador e buscou `id = 3` na base `eloadSeedData.json` — onde o **`id = 3` pertence à atleta `ADRIELLI` (ALFA ACADEMY)**!
4. **BUGS OCULTOS ADICIONAIS ENCONTRADOS NA AUDITORIA**:
   - Dar Refresh (`F5`) em rotas internas (`/planning`, `/workouts/new`) desloga o usuário porque o `AuthContext` não hidrata o `localStorage` sincronamente no `useState` inicial.
   - O rodapé da Sidebar exibe `"Usuário Visitante"` mesmo quando logado como Administrador.

---

## 2. INSTRUÇÕES TÉCNICAS OBRIGATÓRIAS DE IMPLEMENTAÇÃO

### PASSO 1: Corrigir Definitivamente Todos os Dropdowns de "Tipo de Treino / Modalidade"
1. Em `frontend/src/data/eloadSeedData.json` e `frontend/src/services/api.js`, padronize os **34 Tipos de Treino oficiais do eLoad** para que cada item seja um objeto contendo simultaneamente `id`, `name`, `title` e `label`:
   Lista oficial dos 34 tipos:
   `ACELERAÇÃO`, `C.O.D`, `CAMPO`, `CORE`, `DESACELERAÇÃO`, `EMPURRA MMII`, `EMPURRA MMSS`, `ESTABILIDADE`, `ESTABILIDADE UNIPODAL`, `FÍSICO TÉCNICO`, `FORÇA EMPURRA`, `FORÇA MMII`, `FORÇA MMSS`, `FORÇA PUXA`, `FORÇA UNIPODAL`, `FORTALECIMENTO ESPECÍFICO`, `HIPERTROFIA MMII`, `HIPERTROFIA MMSS`, `MMII + CORE`, `MMSS + CORE`, `NEURAL`, `PERFORMANCE`, `POTENCIA MMII`, `POTENCIA MMSS`, `PUXA MMII`, `PUXA MMSS`, `R.F MMII`, `R.F MMSS`, `RECOVERY E PREVENTIVOS`, `TRIPLEX EMPURRA`, `TRIPLEX GERAL`, `TRIPLEX MMII`, `TRIPLEX PUXA`, `VELOCIDADE`.
   Função normalizadora obrigatória no `api.js`:
   `const normalizeWorkoutType = (t, i) => typeof t === 'string' ? { id: t, name: t, title: t, label: t } : { id: t.id || t.name || String(i + 1), name: t.name || t.title || t.label || String(t), title: t.name || t.title || t.label || String(t), label: t.name || t.title || t.label || String(t) };`
2. Em **TODAS** as páginas que possuem seletor de Tipo de Treino (`PlanningPage.jsx` tanto na aba Individual quanto na aba Por Turma/Coletivo, `CollectiveWorkoutPage.jsx`, `PreWorkoutPage.jsx`, `PsePage.jsx`, `CreateWorkoutPage.jsx`, `AthleteDetailPage.jsx`, `GroupMonitoringPage.jsx`, `WorkoutTypesPage.jsx`):
   - Extraia o texto com segurança: `const typeName = typeof t === 'string' ? t : (t?.name || t?.title || t?.label || '');`
   - Estilize cada `<option>` com fundo escuro `#111827` e texto branco `#FFFFFF` (`style={{ backgroundColor: '#111827', color: '#FFFFFF' }}`) para nunca ficar invisível no Windows/Chrome.

---

### PASSO 2: Criar o Componente `AthleteSearchSelect.jsx` (Lista Suspensa + Campo de Busca Simultâneos)
1. Crie `frontend/src/components/AthleteSearchSelect.jsx` (Combobox Híbrido no tema Preto + Dourado):
   - Possui um `<input type="text">` estilizado com ícone de lupa à esquerda e seta de dropdown à direita.
   - **Como Lista**: Assim que o treinador clica no campo ou na seta, abre um menu suspenso (`max-h-72 overflow-y-auto bg-[#111827] border border-amber-500/40`) exibindo todos os atletas em ordem alfabética (com avatar/inicial, Nome Completo e badge da Turma).
   - **Como Busca**: Conforme o treinador digita qualquer trecho do nome no próprio campo (ex: `"Eduardo"`, `"Arthur"`, `"Fernando"`, ignorando acentos e maiúsculas/minúsculas), a lista suspensa filtra instantaneamente os nomes correspondentes.
   - Ao clicar em um atleta da lista, preenche o campo com o nome selecionado e exibe um botão `"X"` para limpar/trocar rapidamente.
2. Substitua o `<select>` antigo de atleta pelo novo `<AthleteSearchSelect />` em:
   - **Prescrição de Fichas (A/B/C/D)** (`/#/workouts/new` — `CreateWorkoutPage.jsx`)
   - **Planejamento de Carga Individual** (`/#/planning` — `PlanningPage.jsx`)
   - **Pré-Treino (PSR)** (`/#/monitoring/pre-workout`)
   - **Treino Individual (PSE)** (`/#/monitoring/pse`)
   - **Registrar Avaliações** (`/#/assessments/record`)
   - **Objetivos e Metas** (`/#/goals`)

---

### PASSO 3 (CRÍTICO): Fim Definitivo da Colisão de ID (`Eduardo Augusto` vs. `ADRIELLI`) e Pacote Assinado no Link do WhatsApp (`&pkg=`)

Para garantir que **NUNCA MAIS** um link enviado para o **Eduardo Augusto de Brito Campos** (ou qualquer outro atleta) abra no celular como **ADRIELLI** (`id=3`) e para que o treino criado no computador do treinador chegue **100% das vezes** no celular do atleta:

1. **IDs Únicos Baseados no Nome (Proibido usar `id = 1, 2, 3...` para novos atletas)**:
   - No `eloadSeedData.json`, o `id = 3` já pertence à `ADRIELLI`.
   - Em `AthletesPage.jsx` e `api.js`, quando um atleta for criado, gere sempre um ID único determinístico a partir do nome completo:
     `const makeAthleteId = (name) => 'ath_' + String(name).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');`
     Assim, `"Eduardo Augusto de Brito Campos"` terá sempre `id = "ath_eduardo_augusto_de_brito_campos"` e `"Marcos Freitas"` terá `id = "ath_marcos_freitas"`.
   - Inclua já no `eloadSeedData.json` o atleta **EDUARDO AUGUSTO DE BRITO CAMPOS** (`id: "ath_eduardo_augusto_de_brito_campos"`) e **MARCOS FREITAS** (`id: "ath_marcos_freitas"`), e adicione uma rotina de migração no `api.js` que corrige automaticamente qualquer registro no `localStorage` em que `Eduardo Augusto de Brito Campos` estava salvo com `id: 3`!

2. **Embutir o Pacote Assinado do Atleta + Treino no Próprio Link do WhatsApp (`&pkg=`) + Sincronizar na OCI**:
   - Quando o treinador salvar um treino em `CreateWorkoutPage.jsx` (`/#/workouts/new`) ou clicar em enviar para o WhatsApp do atleta:
     - Salve o treino na API da OCI (`POST /api/v1/workouts`) **E TAMBÉM** empacote os dados do atleta e do treino em Base64 URL-Safe direto no link gerado para o WhatsApp:
       - Campos do pacote `pkg`: `{ i: selectedAthlete.id, n: selectedAthlete.name, g: selectedAthlete.group || 'FORMCLUB', b: selectedAthlete.birth_date || '', w: { title: workoutTitle, type: workoutType, date: scheduledDate, exercises: exercises.map((ex, idx) => ({ order_index: idx + 1, name: ex.name, sets: ex.sets, reps: ex.reps, load_kg: ex.load_kg, rest_seconds: ex.rest_seconds, notes: ex.notes })) } }`
       - Codificação segura UTF-8: `const pkg = encodeURIComponent(btoa(unescape(encodeURIComponent(JSON.stringify(payload)))));`
       - Formato do Link de WhatsApp:
         `https://app.formclub.com.br/#/checkin/formclub-hub?athleteId=${encodeURIComponent(selectedAthlete.id)}&athleteName=${encodeURIComponent(selectedAthlete.name)}&pkg=${pkg}`
   - **Na Tela do Celular do Atleta (`CheckinPage.jsx` — `/#/checkin/formclub-hub`)**:
     - Ao abrir a página, leia `pkg`, `athleteName` e `athleteId` da query string do hash (`window.location.hash`).
     - Se `pkg` existir, decodifique-o imediatamente: exiba na tela **EXATAMENTE** o nome `payload.n` (ex: **"Você é: EDUARDO AUGUSTO DE BRITO CAMPOS?"**), peça as **3 primeiras letras do nome dele** (**`EX: EDU`**) e salve a ficha `payload.w` para aquele atleta!
     - Se houver `athleteName` na URL (mesmo sem `pkg`), busque pelo nome exato (`athleteName`) e **NUNCA** exiba `ADRIELLI` caso o `athleteId` numérico antigo fosse `3`!
     - Após o atleta confirmar as 3 letras do seu nome (`EDU`) e enviar o Questionário de Bem-Estar, exiba imediatamente a ficha de treino dele (`payload.w` ou o treino salvo na OCI para aquele `athlete_id`) na **ordem exata dos exercícios (`1, 2, 3...`)**, sem jamais sortear exercícios aleatórios!

---

### PASSO 4: Corrigir os Erros Ocultos de Sessão (F5), Sidebar e Lista de Fichas Criadas
1. **Manter Login ao Dar Refresh (F5)**:
   - Em `AuthContext` / `authStore`, inicialize `user` e `isAuthenticated` lendo sincronamente o `localStorage` dentro do `useState(() => ...)` inicial para que atualizar a página (`F5`) em `/#/planning` ou `/#/workouts/new` não redirecione para a tela de login.
2. **Corrigir Rodapé da Sidebar**:
   - No rodapé da Sidebar, exiba sempre o nome do treinador logado (`Administrador • Marcos Freitas`) em vez de `"Usuário Visitante"`.
3. **Lista de Fichas Prescritas Abaixo do Formulário em `/#/workouts/new`**:
   - Ao selecionar um atleta em `Prescrição de Fichas (A/B/C/D)`, exiba abaixo do formulário as fichas já cadastradas para aquele atleta, com botões para **Enviar Link no WhatsApp (com `&pkg=`)**, **Editar**, **Imprimir** e **Excluir**.

---

## 3. VALIDAÇÃO OBRIGATÓRIA ANTES DO DEPLOY EM https://app.formclub.com.br
1. Abra `/#/planning` (Individual e Coletivo), clique em **Tipo de Treino / Modalidade** e confirme que os **34 tipos** aparecem com texto branco legível.
2. Abra `/#/workouts/new`, digite `"Eduardo"` no novo campo de busca de atleta, selecione **Eduardo Augusto de Brito Campos**, crie um treino e gere o link de WhatsApp.
3. Abra o link gerado em uma janela anônima (simulando o iPhone do atleta) e confirme que aparece **"Você é: EDUARDO AUGUSTO DE BRITO CAMPOS?"** (`EX: EDU`) — nunca `ADRIELLI` — e que após o questionário aparece exatamente o treino criado para o Eduardo!
4. Garanta que `dist/CNAME` contém `app.formclub.com.br` e faça o deploy na branch `gh-pages`.
