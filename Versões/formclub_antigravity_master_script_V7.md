# PROMPT MESTRE PARA O ANTIGRAVITY — ISOLAMENTO ESTRITO DE TREINOS POR ATLETA (FIM DOS EXERCÍCIOS ALEATÓRIOS), SINCRONIZAÇÃO REAL NA OCI, DOMÍNIO app.formclub.com.br E PENTE-FINO COMPLETO

## 1. CORREÇÃO CRÍTICA URGENTE: FIM DOS EXERCÍCIOS ALEATÓRIOS E ISOLAMENTO TOTAL DE TREINOS POR ATLETA (FEEDBACK DO TREINADOR MARCOS FREITAS)

### Diagnóstico do Bug Relatado pelo Treinador

Quando o treinador encaminhou o link de check-in para o celular do atleta, o atleta conseguiu responder o questionário, mas em seguida **apareceu uma ordem de exercícios aleatórios** em vez do treino específico criado para ele. A auditoria do código identificou **3 falhas graves** que você deve corrigir imediatamente:

1. **Mock de Exercícios Aleatórios no `CheckinPage` / `api.js`**: Quando a tela de check-in do celular do atleta não encontra o treino no servidor (ou no `localStorage` do celular), o código atual executa um *fallback* que sorteia/exibe exercícios aleatórios ou pega `workouts[0]` (o treino de outro atleta!). **Isso é clinicamente perigoso e pode lesionar um atleta!**

2. **Treino Salvo Apenas no `localStorage` do Computador do Treinador**: Quando o treinador cria um treino em `/#/workouts/new`, ele estava ficando salvo apenas no navegador do PC do treinador e não persistia no banco central da **OCI**, de modo que o celular do atleta nunca recebia a ficha real criada pelo treinador.

3. **Falta de `order_index` Explícito nos Exercícios**: Os exercícios prescritos precisam manter exatamente a ordem (`1º, 2º, 3º, 4º...`) definida pelo treinador.

### As 5 Regras de Segurança e Isolamento que Você Deve Implementar Agora

#### 1.1. PROIBIÇÃO ABSOLUTA de Exercícios Aleatórios ou Treinos Genéricos

* Vá em `frontend/src/pages/CheckinPage.jsx` (e qualquer componente de visão do atleta) e em `frontend/src/services/api.js`:

  * **REMOVA 100% de qualquer array mockado/aleatório de exercícios de fallback!**

  * **REMOVA qualquer lógica que retorne `workouts[0]` ou treinos sem validar `String(workout.athlete_id) === String(currentAthlete.id)`!**

  * Se o atleta finalizar o questionário e o treinador **não tiver cadastrado nenhum treino específico para aquele `athlete_id`**, exiba exclusivamente este aviso seguro: *"Check-in de prontidão enviado com sucesso! Seu treinador já recebeu seus indicadores de hoje. Nenhum treino individual foi liberado no aplicativo para hoje — siga a orientação presencial do seu treinador no CT."*

#### 1.2. Persistência Real na OCI (`POST /api/v1/workouts` e `GET /api/v1/workouts/athlete/:athleteId`)

* Quando o treinador criar ou editar um treino em `/#/workouts/new` (ou na aba `Treinos Programados` dentro de `/#/athletes/:id`):

  * Envie e grave obrigatoriamente no banco de dados da **OCI** (com backup espelhado local) o objeto completo contendo:

    * `id` (UUID único do treino)

    * `athlete_id` (ID exato do atleta designado — **obrigatório**)

    * `athlete_name` (Nome do atleta)

    * `title` (Ex: `Treino A - Força MMII`, `Sessão Preventiva`, etc.)

    * `workout_type` (Modalidade oficial do eLoad)

    * `scheduled_date` (Data ou dia da semana / ficha ativa)

    * `exercises`: Array de exercícios onde **cada exercício possui obrigatoriamente `order_index` numérico sequencial (`1, 2, 3, 4...`)**, `name`, `sets`, `reps`, `load_kg`, `rest_seconds` e `notes`.

* Ao exibir o treino para o atleta no celular, ordene sempre os exercícios por: `exercises.slice().sort((a, b) => (Number(a.order_index) || 0) - (Number(b.order_index) || 0))` Garantindo que a ordem criada pelo treinador Marcos Freitas seja **100% respeitada sem nunca embaralhar**!

#### 1.3. Isolamento Estrito de Privacidade entre Atletas (LGPD & Segurança Clínica)

* **Zero Acesso Cruzado**: Um atleta logado ou em sessão de check-in (`/#/checkin/...`) **JAMAIS** pode visualizar nomes, métricas, prontidão, dores ou fichas de treino de outros atletas.

* **No Back-end (OCI) e no `api.js`**:

  * O endpoint `GET /api/v1/workouts/athlete/:athleteId` deve filtrar estritamente `WHERE athlete_id = :athleteId AND is_active = 1`.

  * Na tela de check-in (`/#/checkin/:token`), gere também links individuais por atleta (`/checkin/:token?athleteId=20337`) ou, quando o atleta entrar pelo link geral e digitar sua data de nascimento (`DD/MM/AAAA`), exija a confirmação das **3 primeiras letras do primeiro nome** + data de nascimento para evitar que um atleta curioso tente adivinhar datas de nascimento de outros colegas da academia!

  * Uma vez confirmado o atleta no aparelho celular, trave a sessão daquele check-in no `athlete_id` autenticado e mantenha a `Sidebar` e todas as rotas administrativas (`/dashboard`, `/athletes`, `/groups`, `/planning`) 100% bloqueadas para o perfil de atleta.

#### 1.4. Botão "Enviar Link Individual do Atleta via WhatsApp" na Prescrição de Treino

* Na tela de **Novo Treino (`/#/workouts/new`)** e no **Perfil do Atleta (`/#/athletes/:id`)**, após o treinador salvar o treino específico daquele atleta, exiba um botão dourado de confirmação: **"Copiar / Enviar Link do Check-in + Treino para \[Nome do Atleta\]"** (`https://app.formclub.com.br/#/checkin/formclub-hub?athlete=${athlete.id}`).

* Além de salvar na OCI, codifique um fallback assinado/compactado na própria URL ou busque direto da API na OCI em tempo real (`cache: 'no-store'`), garantindo que **100% das vezes que o treinador criar um treino no computador e mandar o link para o atleta, o celular do atleta exibirá exatamente aquele treino e naquela exata ordem de exercícios!**

## 2. CONFIGURAÇÃO OFICIAL DO DOMÍNIO: https://app.formclub.com.br

Aplique os 5 ajustes obrigatórios para o domínio próprio `app.formclub.com.br`:

1. **`frontend/public/CNAME`**: Crie o arquivo `frontend/public/CNAME` contendo apenas `app.formclub.com.br` para que o deploy no GitHub Pages nunca desconfigure o domínio customizado.

2. **`frontend/vite.config.js`**: Configure `base: './'` para que todos os scripts e estilos carreguem sem erro 404 na raiz `https://app.formclub.com.br/`.

3. **`frontend/public/404.html`**: Redirecione acessos sem `#` automaticamente para `https://app.formclub.com.br/#/...`.

4. **URLs de Convite, Imagens e `manifest.json`**: Use `https://app.formclub.com.br/#/checkin/formclub-hub` como domínio oficial de convite e caminhos relativos `./` para imagens/avatares e PWA.

5. **CORS na OCI**: Adicione `https://app.formclub.com.br` e `http://app.formclub.com.br` em `allow_origins` no servidor da OCI em background.

## 3. PENTE-FINO DE DADOS, 10 GRÁFICOS E BOTÕES (CASO REAL: ARTHUR RIBEIRO #20337 E TODOS OS 98 ATLETAS)

Mantenha **100% da paleta de cores atual (Preto + Dourado/Âmbar)** e o **Logo FORMCLUB**, garantindo:

1. **Prontuário Real de ARTHUR RIBEIRO (`/#/athletes/20337`)**:

   * Cabeçalho: Grupo `Atleta sem grupo` | Situação Passada A:C: `DESTREINO` | Situação Atual A:C: `DESTREINO` | Razão A:C: `0,41` | Carga Crônica: `735` | Carga Aguda: `300`.

   * **Os 10 Gráficos da Aba `Monitoramento` Preenchidos**:

      1. `CARGA DIÁRIA` (`15/09` a `14/10`: barras de Carga Planejada e Realizada com rótulos internos + linhas suaves de PSR e PSE com bolinhas numeradas + seletor `Data do relatório`, botão `Emitir relatório` e botão `Legendas do Gráfico`. Dados reais: `16/09: 480/480 PSR 7 PSE 8`, `18/09: 420/300 PSR 7 PSE 5`, `21/09: 420/300 PSR 6 PSE 5`, `23/09: 480/480 PSR 6 PSE 8`, `25/09: 300/360 PSR 7 PSE 6`, `28/09: 420/0`, `30/09: 480/480 PSR 7 PSE 8`, `01/10: 420/420 PSR 6 PSE 7`, `02/10: 480/0`, `05/10: 480/300 PSR 9 PSE 5`, `07/10: 420/0`, `09/10: 360/300 PSR 6 PSE 5`).

      2. `DURAÇÃO TOTAL (MINUTOS) X PSE` (barras de `60 min` + linhas `PSE` e `PSE Planejado`).

      3. `CARGA DA SEMANA` (Cards `Carga Crônica: 735` e `Carga Aguda: 300` + gráfico semanal com `VAR C.T. %`: `13/09-19/09: 900/780/468 AC 0.96 Mon 0.6`, `20/09-26/09 VAR C.T. 46,2%: 1200/1140/912 AC 1.41 Mon 0.8`, `27/09-03/10 VAR C.T. -21,1%: 1800/900/540 AC 1.26 Mon 0.6`, `04/10-10/10 VAR C.T. -33,3%: 1260/600/360 AC 0.70 Mon 0.6`).

      4. `QUESTIONÁRIO DE BEM-ESTAR` (Barras empilhadas de 0 a 25 pontos com `Dor Muscular`, `Fadiga`, `Humor`, `Noite de Sono` e `Stress`).

      5. `STATUS NEUROMUSCULAR (CMJ)` (os 17 saltos reais de `26/06: 37.01 cm` até `05/10: 38.96 cm` com `Baseline`, `Limite Superior` e `Limite Inferior`).

      6. `SONO` (`Horas de Sono` x `Qualidade do Sono`).

      7. `NÍVEL HIDRATAÇÃO` (`Tonalidade da Urina` 1 a 8).

      8. `DORES REGISTRADAS` (`Panturrilha Direita = 7` no dia `08/10`).

      9. `VARIAÇÃO DE VFC` (`rMSSD` + `Legendas do Gráfico`).

     10. `VARIAÇÃO DE MASSA CORPORAL` (`Massa Corporal kg` x `Taxa de Desidratação %`).

   * **Abas `Histórico de Dores`, `Histórico de Treinos` e `Histórico de Avaliações`**:

     * `Histórico de Dores`: 5 semanas reais (`04/10 - 10/10: 1 dor`) com botão de **Lupa** abrindo o Mapa Anatômico em *Panturrilha Direita = 7*.

     * `Histórico de Treinos`: 5 semanas reais (`0`, `600`, `900`, `1140`, `780 UA`) com botão de **Lupa** abrindo os treinos da semana.

2. **Funcionalidade Real de Impressão / Exportação PDF e Todos os Botões**:

   * **Botões `Imprimir relatórios`, `Exportar PDF` e `Emitir relatório`**: Abrem o configurador de impressão A4 (`@media print`) com campo *"Adicionar observação geral"*, botão **`[X]`** para ocultar seções individuais antes de imprimir, *"Limpar alterações"* e acionamento de `window.print()`.

   * **Botões `Trocar atleta`, `Aplicar filtros` e `Legendas do Gráfico`**: Totalmente funcionais e reativos.

## 4. TESTE DE ACEITAÇÃO OBRIGATÓRIO ANTES DO DEPLOY

1. Como Treinador (`admin@formclub.com.br`), crie um treino específico para um atleta (ex: `FERNANDO GOMES` ou `ARTHUR RIBEIRO`) com 4 exercícios em uma ordem exata (`1. Agachamento Livre`, `2. Leg Press 45`, `3. Stiff com Barra`, `4. Panturrilha em Pé`).

2. Abra uma aba anônima (simulando o celular do atleta) no link de check-in, faça o check-in daquele atleta, responda o questionário e verifique que:

   * Aparecem **EXATAMENTE** os 4 exercícios criados pelo treinador para aquele atleta e **NA EXATA ORDEM (`1, 2, 3, 4`)** — nunca exercícios aleatórios!

   * Faça o check-in de outro atleta que ainda não tem treino cadastrado e confirme que **NÃO aparecem exercícios aleatórios nem o treino do primeiro atleta**, exibindo apenas a mensagem de que o treinador ainda não liberou ficha para hoje.

3. Rode `npm run build` (verificando `dist/CNAME`) e publique na branch `gh-pages` (`https://app.formclub.com.br`).