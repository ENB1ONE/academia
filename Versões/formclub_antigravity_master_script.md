# Dossiê Multidisciplinar FormClub (FormaSync) vs. eLoad & Script Mestre para o Antigravity

Este documento consolida a auditoria técnica do código-fonte do [FormClub no GitHub](https://www.google.com/search?q=https%3A%2F%2Fgithub.com%2Fenb1one%2Facademia) e da aplicação publicada no [FormClub GitHub Pages](https://www.google.com/search?q=https%3A%2F%2Fenb1one.github.io%2Facademia%2F), cruzada com o mapeamento integral da visão do treinador no [eLoad Web App](https://www.google.com/search?q=http%3A%2F%2Fapp.eload.com.br%2F) e da visão do atleta no [Convite de Monitoramento eLoad](https://www.google.com/search?q=https%3A%2F%2Fapp.eload.com.br%2FConviteMonitoramento%2FConvite%2Fcaf66448-8f3b-4b98-8491-4614f0fe5c5f). Ao final, encontra-se o **Script/Prompt Mestre de Engenharia** pronto para ser enviado ao **Antigravity** (considerando a arquitetura atual com Front-end no GitHub Pages e Back-end na OCI).

## 1. Matriz Comparativa: O Que Manter do FormClub vs. O Que Absorver do eLoad

A tabela abaixo sintetiza a decisão arquitetural módulo a módulo, preservando as vantagens competitivas já construídas no [FormClub](https://www.google.com/search?q=https%3A%2F%2Fenb1one.github.io%2Facademia%2F) e incorporando as ferramentas analíticas e operacionais do [eLoad](https://www.google.com/search?q=http%3A%2F%2Fapp.eload.com.br%2F).

| Domínio / Módulo | Implementação Atual no FormClub | Implementação Mapeada no eLoad | Veredito Estratégico (O Que Fazer) |
| :--- | :--- | :--- | :--- |
| **Identidade Visual & UI** | **Design System "Dark Performance"** (`#0b0f19` / `#111827`, acentos em roxo `#8b5cf6` / `#7c3aed`), alto contraste, responsivo com `dvh` e Tailwind CSS | Interface clara tradicional centrada em tabelas densas e formulários multipágina | **MANTER FormClub**: Preservar 100% do tema *Dark Performance* e adaptá-lo com cores semânticas para zonas de risco fisiológico |
| **Arquitetura de Acesso & Governança (RBAC)** | 3 níveis explícitos (`admin`, `trainer`, `athlete`), gestão de treinadores (`/admin/trainers`), validação de **CREF**, especialidades e aceite formal de **LGPD** e confidencialidade | Conta organizacional focada no treinador/clube e acesso de atleta via link de convite | **COMBINAR (Híbrido)**: Manter o RBAC de 3 níveis, CREF e governança LGPD do FormClub, adicionando o **Link Mágico de Check-in Rápido** do eLoad |
| **Acesso Rápido do Atleta & Chão de Academia** | Login tradicional com e-mail e senha obrigatória | **Link de Convite por Data de Nascimento** (`06/09/2008` + confirmação `"Fernando? Sim"`) + **Modo Totem / Kiosk** (`/Totem`) para tablet na academia | **ABSORVER do eLoad**: Criar rota pública `/#/checkin/:inviteToken` (validação por data de nascimento + PIN/confirmação) e tela `/#/totem` para tablet no CT |
| **Prescrição de Treinos de Força e Rotinas** | **Módulo Completo (`/workouts/new`)**: Fichas divididas (A, B, C, D), exercícios, séries, repetições, carga (kg), descanso, notas técnicas e execução guiada | Planejamento apenas macro de carga (duração x PSE planejada), sem prescrição detalhada de exercícios e séries | **MANTER FormClub + EXPANDIR**: O FormClub é superior na prescrição de treinos. Adicionar apenas o campo de **PSE Planejada x Duração Planejada** do eLoad para cruzar carga prevista vs. realizada |
| **Monitoramento de Carga (PSE / Foster)** | Cálculo de Session Load ($\text{PSE} \times \text{Duração}$) e razão Aguda:Crônica (ACWR) em `/monitoring/pse` | **ACWR (Gabbett, 2016)** com matriz de zonas (*Destreino* `<0.8`, *Ótimo* `0.8-1.3`, *Risco* `1.3-1.5`, *Risco Extremo* `>1.5`), **Monotonia**, **Strain**, **PSR Pré-Treino (0-10)**, **VFC (rMSSD)** e separação por **Tipo de Treino** | **EVOLUIR FormClub**: Incluir PSR (0-10), VFC (rMSSD), Massa Corporal pré-treino, cálculo de Monotonia e Strain (Foster, 1998) e filtro por modalidade/tipo de treino |
| **Bem-Estar Diário (Wellness)** | 5 indicadores (Sono, Fadiga, DOMS, Estresse, Humor) e Score de Prontidão em `/monitoring/wellness` | 5 indicadores com emojis semânticos + **Duração/Horário de Sono** + **Escala de Hidratação por Cor da Urina (1 a 8)** + Índice `0-100%` com alerta automático `< 70%` | **EVOLUIR FormClub**: Integrar o seletor de Horas de Sono (horário que dormiu/acordou ou total) e o modal visual de **Cor da Urina (8 níveis)** ao Wellness do FormClub |
| **Mapa Anatômico de Dor (Pain Map)** | Mapeamento clínico em `/monitoring/pain` com tipo de dor (*muscular, articular, tendinite*) e escala 1 a 10 | Registro de dor acoplado ao pré-treino/wellness e tabela semanal de histórico de dores com inspeção anatômica | **MANTER FormClub + INTEGRAR**: A classificação clínica do FormClub (*muscular, articular, tendinite*) é superior. Integrá-la como gatilho automático quando o atleta relatar dor no Wellness ou Pré-Treino |
| **Ciclo Menstrual** | Módulo dedicado (`/monitoring/menstrual`) com fluxo, cólicas, impacto no humor e suporte à periodização hormonal | Registro básico no questionário diário exibido no feed de atividades | **MANTER FormClub + INTEGRAR**: O módulo dedicado do FormClub é superior. Exibir alertas de fase hormonal diretamente no Dashboard e no card de prescrição do treinador |
| **Testes Físicos & Prontidão Neuromuscular** | Registro de CMJ, SJ, Sprints (10m, 30m) e **Cálculo de Assimetria entre Membros (% Esquerda vs. Direita)** em `/monitoring/physical-tests` | **Status Neuromuscular CMJ (`/StatusNeuromuscular`)** com Média, Desvio Padrão, Coeficiente de Variação (CV %) e status (*Supercompensação, Referência, Fadiga*) + **Construtor Dinâmico de Avaliações** (`kg, cm, tempo, W, m/s, km, m, °, %`) | **COMBINAR**: Manter o controle de Assimetria (%) e Sprints do FormClub, e adicionar o cálculo estatístico de **CV % / Z-Score de CMJ** e o **Construtor de Avaliações Customizadas** do eLoad |
| **Gestão por Grupos, OKRs e Relatórios** | Lista geral de atletas (`/athletes`) e perfil individual (`/athletes/:id`) | **Gestão de Grupos/Turmas** (*Pré-Temporada, Competitivo, Pós-Operatório*), **Objetivos e Metas (OKRs)** (`/Objetivo`), **Feed Ao Vivo** e **Exportação de Relatórios PDF** | **ABSORVER do eLoad**: Adicionar entidade `Groups`, módulo de `Goals/OKRs`, Feed em Tempo Real no Dashboard e geração de relatórios imprimíveis |

## 2. Avaliação e Diretrizes dos 10 Especialistas

### 2.1. Estratégia e Conteúdo

#### Product Manager (PM)
A estratégia de produto do [FormClub](https://www.google.com/search?q=https%3A%2F%2Fenb1one.github.io%2Facademia%2F) posiciona a plataforma um degrau acima do [eLoad](https://www.google.com/search?q=http%3A%2F%2Fapp.eload.com.br%2F): enquanto o eLoad atua exclusivamente como um coletor de carga e prontidão, o FormClub une **prescrição de treino (fichas A/B/C/D)** + **fisiologia e monitoramento de carga** + **governança clínica (CREF/LGPD)**. Para alcançar paridade total com o eLoad sem perder a essência do FormClub, o backlog deve ser priorizado em 4 épicos:
1. **Épico 1 — Redução de Atrito de Coleta (Chão de Academia)**: Implementar o **Modo Totem (`/totem`)** e o **Link de Convite Rápido (`/checkin/:token`)** validado por data de nascimento, além de unificar o fluxo de Pré-Treino (PSR + Peso + Hidratação + Wellness) e Pós-Treino (PSE + Duração).
2. **Épico 2 — Motor Matemático de Fisiologia (Foster & Gabbett)**: Expandir o back-end na OCI para calcular automaticamente Carga Aguda (7d), Carga Crônica (28d EWMA ou média móvel), ACWR com histórico de situação passada vs. atual, Monotonia, Strain e Status Neuromuscular por CMJ (Média, DP, CV % e classificação *Supercompensação / Referência / Fadiga*).
3. **Épico 3 — Gestão Coletiva, Planejamento e Avaliação Customizada**: Criar a entidade de **Grupos/Elencos** (ex: *Pós-Operatório, Base, Principal*), o módulo de **Planejamento de Carga (Previsto vs. Realizado)**, o **Construtor de Avaliações Físicas Multi-Unidades** e o módulo de **Objetivos e Metas (OKRs)**.
4. **Épico 4 — Inteligência Executiva no Dashboard**: Transformar o `/dashboard` em uma central de comando com Cards de Risco ACWR, Tabela de Alerta de Prontidão (`< 70%` com delta diário), Desempenho por Grupos, Matriz de Gabbett e **Feed Ao Vivo de Atividades**.

#### Especialista em SEO e Descoberta Web (PWA & Meta Architecture)
Por operar atualmente no [GitHub Pages](https://www.google.com/search?q=https%3A%2F%2Fenb1one.github.io%2Facademia%2F) com roteamento em `HashRouter` (`/#/`), os motores de busca enxergam apenas o `index.html` raiz. As ações recomendadas são:
- Estruturar uma **Landing Page Institucional Pública** indexável na rota raiz (ou seção pré-login) com semântica HTML5 (`<header>`, `<main>`, `<section>`, `<article>`, `<footer>`), dados estruturados `Schema.org` (`SoftwareApplication` e `SportsActivityLocation`) e meta tags OpenGraph/Twitter Cards para compartilhamento de links de convite no WhatsApp com preview rico.
- Configurar `manifest.json` completo com `short_name: "FormClub"`, `display: "standalone"`, `theme_color: "#0b0f19"`, `background_color: "#0b0f19"` e ícones maskable para instalação imediata no iOS e Android.

#### Copywriter e UX Writer
A microcópia deve substituir jargões puramente acadêmicos na visão do atleta por perguntas humanas e diretas (inspiradas na saudação *"Olá Fernando, como você está hoje?"* do [Convite eLoad](https://www.google.com/search?q=https%3A%2F%2Fapp.eload.com.br%2FConviteMonitoramento%2FConvite%2Fcaf66448-8f3b-4b98-8491-4614f0fe5c5f)), mantendo o rigor científico na visão do treinador:
- **No Check-in do Atleta**: Usar rótulos acionáveis e diretos: *"Como foi sua noite de sono?"*, *"Nível de energia e disposição"*, *"Sentiu alguma dor muscular ou articular hoje?"* (com abertura automática do Mapa Anatômico caso o atleta marque níveis de dor) e *"Cor da Urina (Hidratação)"* com descrições educativas (*1 - Hidratação Ótima* até *8 - Desidratação Crítica — procure orientação*).
- **No Painel do Treinador**: Microcópias orientadas à decisão imediata nos alertas: *"Alerta de Sobrecarga: ACWR em 1.58 (Risco Extremo) + queda de 18% na prontidão matinal. Recomendação: reduzir volume da sessão de hoje em 30% ou converter para sessão regenerativa."*

### 2.2. Design e Experiência do Usuário

#### UX Designer (User Experience)
A análise comparativa revela dois fluxos no [eLoad](https://www.google.com/search?q=http%3A%2F%2Fapp.eload.com.br%2F) que reduzem drasticamente o abandono de preenchimento pelos atletas e devem ser trazidos para o [FormClub](https://www.google.com/search?q=https%3A%2F%2Fenb1one.github.io%2Facademia%2F):
1. **Fluxo "Zero-Password" para Check-in Diário**: Atletas esquecem senhas constantemente. Manter o login autenticado completo para quando o atleta quiser ver sua ficha de treino completa e histórico, mas oferecer o **Link Rápido da Equipe** (onde ele digita apenas a data de nascimento + confirmação em 2 toques) e o **Modo Totem** para preenchimento em menos de 20 segundos na recepção ou vestiário.
2. **Encadeamento Inteligente (Progressive Disclosure)**: No FormClub atual, `WellnessPage`, `PainMapPage`, `MenstrualCyclePage` e `PsePage` estão em rotas separadas no menu. A UX ideal unifica o **Check-in Matinal / Pré-Treino** em um único *wizard* fluido de 1 tela:
   - Passo 1: 5 pilares de Wellness + Horas de Sono + Hidratação (Urina 1-8) + Peso/PSR.
   - Passo 2 (Condicional): Se o score de Dor Muscular for $\le 3$ ou o botão *"Registrar dor localizada"* for acionado, abre-se o **Mapa Anatômico de Dor** na mesma tela.
   - Passo 3 (Condicional): Se a atleta for do sexo feminino, exibe o card rápido de **Ciclo Menstrual** (fluxo, cólicas, fase).

#### UI Designer (User Interface)
O Design System **"Dark Performance"** do [FormClub](https://www.google.com/search?q=https%3A%2F%2Fenb1one.github.io%2Facademia%2F) (`#0b0f19` background, `#111827` cards, `#8b5cf6` violeta primário) é visualmente superior ao layout claro datado do eLoad. Para acomodar as novas escalas visuais e matrizes de risco sem poluir a interface:
- **Tokens Semânticos de Fisiologia e Escalas (WCAG AAA no escuro)**:
  - **Nível 5 / Ótimo / Supercompensação**: Esmeralda Neon (`#10b981` / `#25c46e`)
  - **Nível 4 / Bom / Referência**: Azul Ciano (`#0ea5e9` / `#1ca1f2`)
  - **Nível 3 / Normal / Atenção**: Cinza Azulado ou Âmbar Suave (`#94a3b8` / `#eab308`)
  - **Nível 2 / Ruim / Sobrecarga**: Laranja Vibrante (`#f59e0b` / `#f97316`)
  - **Nível 1 / Crítico / Risco Extremo**: Carmesim Vibrante (`#ef4444` / `#e82e5f`)
- **Escala Visual de Hidratação (Armstrong 1-8)**: Renderizar barras horizontais estilizadas no modal com gradiente real de tons palha (`#fef9c3`) até âmbar escuro/castanho (`#713f12`), com borda luminosa no item selecionado.
- **Responsividade `100dvh`**: Manter todos os modais e *drawers* inferiores (*bottom sheets* no mobile) ancorados com `max-h-[90dvh]` para evitar sobreposição pelo teclado virtual do iOS/Android.

### 2.3. Engenharia e Desenvolvimento

#### Desenvolvedor Front-end (React + Vite + Tailwind + Zustand)
A inspeção do repositório [enb1one/academia](https://www.google.com/search?q=https%3A%2F%2Fgithub.com%2Fenb1one%2Facademia) mostrou que o front-end já utiliza React, Vite, React Router DOM (`HashRouter`), Tailwind CSS, Lucide-React, Axios e Zustand. As melhorias técnicas necessárias no front-end são:
- **Gerenciamento de Estado & Offline-First (PWA)**: Implementar fila de sincronização offline (`localStorage` / `IndexedDB` via Zustand middleware) para o **Modo Totem** e **Check-in de Atletas**, garantindo que respostas registradas em áreas da academia com sinal Wi-Fi/4G instável sejam sincronizadas automaticamente quando a conexão voltar.
- **Motor Gráfico Interativo**: Utilizar gráficos combinados (Barras para Carga Diária Planejada vs. Realizada + Linhas para ACWR, Monotonia, Strain e Prontidão %) com filtros reativos por período (7, 14, 28, 90 dias) e separação por Tipo de Treino.
- **Exportação Nativa de Relatórios**: Adicionar folha de estilo `@media print` dedicada e gerador de relatório em PDF limpo para o perfil analítico do atleta (`/athletes/:id`) e para o relatório coletivo de grupo.

#### Desenvolvedor Back-end (API & Banco de Dados na OCI)
O back-end hospedado na OCI precisa expandir sua modelagem relacional e seus endpoints REST para sustentar todas as funcionalidades mapeadas no [eLoad](https://www.google.com/search?q=http%3A%2F%2Fapp.eload.com.br%2F) integradas às do [FormClub](https://www.google.com/search?q=https%3A%2F%2Fenb1one.github.io%2Facademia%2F):
- **Novas Tabelas / Entidades**:
  1. `groups` (Turmas/Elencos: `id, name, category, season_phase, trainer_id`).
  2. `workout_types` (Tipos de Treino: `id, name, color, icon` — ex: Força, Técnico, Tático, Jogo, Cardio, Fisioterapia).
  3. `planned_loads` (Planejamento Individual e Coletivo: `id, athlete_id, group_id, workout_type_id, date, planned_duration_min, planned_pse, planned_load_au`).
  4. `pre_workout_logs` (Pré-Treino: `id, athlete_id, date, psr_score, body_mass_kg, hrv_rmssd, readiness_pct`).
  5. `wellness_logs` (Expandir tabela existente com: `sleep_hours, sleep_start, sleep_end, urine_color_scale_1_8, readiness_pct`).
  6. `cmj_logs` (Prontidão Neuromuscular: `id, athlete_id, date, jump_height_cm, peak_power_w, left_leg_pct, right_leg_pct, asymmetry_pct, baseline_mean, baseline_sd, cv_pct, neuromuscular_status`).
  7. `custom_assessment_types` (`id, name, description, unit_enum` [`kg`, `cm`, `hh:mm:ss:ms`, `W`, `m/s`, `km`, `m`, `deg`, `pct`]) e `custom_assessment_results` (`id, assessment_type_id, athlete_id, date, value_numeric, value_text, notes`).
  8. `athlete_goals` (OKRs e Metas: `id, athlete_id, title, metric_unit, start_value, target_value, current_value, deadline, status`).
  9. `invite_tokens` (Links de Convite: `id, organization_id, group_id, token_uuid, is_active`).
- **Serviço de Cálculo Fisiológico no Servidor**:
  - $\text{Session Load (UA)} = \text{PSE} \times \text{Duração (min)}$
  - $\text{Carga Aguda (7d)} = \sum_{i=0}^{6} \text{Carga Diária}_i$ (ou média diária de 7 dias compatível com a janela crônica)
  - $\text{Carga Crônica (28d)} = \frac{1}{4} \sum_{s=1}^{4} \text{Carga Semanal}_s$ (ou EWMA de 28 dias)
  - $\text{ACWR} = \frac{\text{Carga Aguda}}{\text{Carga Crônica}}$ (Classificação: `< 0.8` Destreino, `0.8–1.3` Ótimo, `1.3–1.5` Risco Moderado, `> 1.5` Risco Extremo)
  - $\text{Monotonia} = \frac{\mu_{\text{Carga Diária (7d)}}}{\sigma_{\text{Carga Diária (7d)}}}$ (evitando divisão por zero quando $\sigma = 0$)
  - $\text{Strain} = \text{Carga Semanal Total} \times \text{Monotonia}$
  - $\text{Prontidão Wellness (\%)} = \left(\frac{\text{Sono} + \text{Disposição} + \text{Sem Dor} + \text{Baixo Estresse} + \text{Humor}}{25}\right) \times 100$ (onde cada item varia de 1=Pior a 5=Melhor).

### 2.4. Infraestrutura, Segurança e Qualidade

#### Arquiteto Cloud / DevOps (GitHub Pages + OCI)
Na inspeção do arquivo `src/services/api.js` no repositório [enb1one/academia](https://www.google.com/search?q=https%3A%2F%2Fgithub.com%2Fenb1one%2Facademia), identificou-se que o back-end na OCI está sendo exposto por um túnel efêmero do Cloudflare (`https://hour-tough-telescope-jill.trycloudflare.com`), o que muda de URL caso o processo reinicie e quebra o login no GitHub Pages:
- **Estabilização do Endpoint OCI**: Configurar um **Cloudflare Named Tunnel permanente** (`cloudflared` como serviço `systemd` na instância OCI apontando para um subdomínio fixo ou reverso Nginx + Let's Encrypt com IP Público Reservado na OCI).
- **CI/CD Automatizado**: Manter o GitHub Actions compilando o `/frontend` (`npm run build`) para a branch `gh-pages` com variável de ambiente `VITE_API_URL` injetada de forma limpa.

#### Especialista em Segurança (NetSecOps & LGPD)
Dados de saúde, dor articular, escala de urina e ciclo menstrual são **Dados Pessoais Sensíveis (Art. 5º, II e Art. 11 da LGPD)**:
- **Proteção do Link de Convite (`/checkin/:token`)**: No [eLoad](https://www.google.com/search?q=https%3A%2F%2Fapp.eload.com.br%2FConviteMonitoramento%2FConvite%2Fcaf66448-8f3b-4b98-8491-4614f0fe5c5f), a validação por data de nascimento retorna o nome completo do atleta. No FormClub, devemos adicionar **Rate Limiting** por IP na OCI (máx. 5 tentativas por minuto), exigir Data de Nascimento + iniciais/confirmação ou PIN de 4 dígitos opcional no Modo Totem, e emitir um JWT de escopo restrito (`scope: checkin_only`, válido por 15 minutos) que permite apenas **inserir** o check-in diário (`POST`), jamais ler o histórico médico completo sem senha.
- **Trilha de Auditoria LGPD**: Manter o fluxo obrigatório de aceite de Termos de Uso, Política de Privacidade e Confidencialidade Técnica já criado no FormClub (`add_lgpd.cjs` / `add_lgpd_profile.py`), gravando `consent_timestamp`, `ip_hash` e `terms_version` no banco na OCI.

#### Analista de QA (Quality Assurance)
- **Casos de Borda Matemáticos**: Testar atletas recém-cadastrados com menos de 7 ou 28 dias de histórico (exibir badge *"Calibrando Carga Crônica"* em vez de dividir por zero ou gerar ACWR infinito) e semanas sem variação de carga ($\sigma = 0$ na Monotonia).
- **Testes de Dispositivos e Totem**: Validar uso contínuo em tablet (Modo Totem) garantindo limpeza completa do estado (`reset` do Zustand) imediatamente após cada atleta clicar em *"Enviar respostas"*, impedindo vazamento de sessão para o próximo atleta da fila.

## 3. Script / Prompt Mestre para o Antigravity

Copie o bloco abaixo e envie diretamente para o **Antigravity**. Ele já contém todo o contexto da sua infraestrutura atual (Front-end no GitHub Pages e Back-end na OCI), o que deve ser mantido do FormClub e todas as especificações técnicas mapeadas do eLoad para implementação imediata.

```markdown
# PROMPT MESTRE DE ENGENHARIA PARA O ANTIGRAVITY — EVOLUÇÃO FORMCLUB (FORMASYNC) FULL PARITY + ELOAD

## 1. CONTEXTO DE ARQUITETURA E INFRAESTRUTURA ATUAL
Você vai evoluir o aplicativo **FormClub (FormaSync)**.
- **Front-end atual**: SPA em React + Vite + Tailwind CSS + React Router DOM (`HashRouter`) + Lucide-React + Zustand + Axios, hospedado no **GitHub Pages** (`https://enb1one.github.io/academia/`, pasta `/frontend`).
- **Back-end atual**: Hospedado na **OCI (Oracle Cloud Infrastructure)**, consumido pelo front-end via `src/services/api.js`. Configure o back-end na OCI e mantenha a integração com o front-end no GitHub Pages funcionando perfeitamente (garantindo CORS para `https://enb1one.github.io` e persistência do túnel/serviço em background na OCI).

## 2. REGRA DE OURO: O QUE MANTER DO FORMCLUB ATUAL (NÃO REMOVER!)
O FormClub já possui diferenciais superiores aos concorrentes que DEVEM ser 100% preservados e integrados aos novos módulos:
1. **Design System "Dark Performance"**: Fundo escuro (`#0b0f19` / `#111827`), acentos em roxo/violeta (`#8b5cf6` / `#7c3aed`), tipografia de alto contraste e responsividade dinâmica Mobile-First (`dvh`).
2. **Três Níveis de Acesso (RBAC)**:
   - `admin`: Gestão de treinadores (`/admin/trainers`), validação de **CREF**, especialidades e governança de acesso.
   - `trainer`: Prescrição, monitoramento fisiológico, gestão de grupos e relatórios.
   - `athlete`: Visualização de treinos guiados, check-ins de prontidão/PSE e evolução.
3. **Conformidade LGPD & Segurança**: Troca obrigatória de senha no primeiro acesso, aceite formal de Termos de Uso, Privacidade (LGPD) e Confidencialidade Técnica, além do `CookieConsent` e `PwaInstallPrompt`.
4. **Módulo de Prescrição de Treinos (`/workouts/new`)**: Montagem de fichas divididas (Treinos A, B, C, D...), exercícios, séries, repetições, carga (kg), descanso, recomendações técnicas e acompanhamento guiado pelo atleta no celular.
5. **Mapa Anatômico de Dor (`/monitoring/pain`)**: Registro clínico com seleção de região corporal, classificação do tipo de dor (**Muscular, Articular ou Tendinite**) e intensidade (1 a 10).
6. **Monitoramento do Ciclo Menstrual (`/monitoring/menstrual`)**: Registro de fluxo, cólicas, impacto no humor, início de ciclo e suporte à periodização hormonal feminina.
7. **Testes Físicos com Controle de Assimetria (`/monitoring/physical-tests`)**: CMJ, SJ e Sprints (10m, 30m) mantendo o cálculo de **Assimetria entre Membros (% Perna Esquerda vs. Direita)**.

## 3. NOVOS MÓDULOS E EVOLUÇÕES A IMPLEMENTAR (MAPEADOS DO ELOAD)

### MÓDULO 1: Motor Fisiológico Avançado (Foster 1998 & Gabbett 2016) no Back-end (OCI) e Front-end
Atualize o banco de dados e os endpoints na OCI para calcular e retornar automaticamente por atleta e por grupo:
1. **Cadastro de Tipos de Treino (`/settings/workout-types`)**: Permitir criar/editar modalidades (ex: *Força/Musculação, Técnico, Tático, Jogo/Competição, Cárdio, Fisioterapia, Preventivo*) com cor identificadora.
2. **Pré-Treino (`/monitoring/pre-workout`)**:
   - **PSR (Percepção Subjetiva de Recuperação)**: Slider de 0 a 10 com cores semânticas.
   - **Massa Corporal (kg)** pré-treino e **VFC / HRV (rMSSD em ms)** opcional.
   - **Tipo de Treino** e **Duração Prevista (min)**.
   - Atalhos rápidos integrados na mesma tela para: *Responder Questionário de Bem-Estar*, *Registrar Dor (Pain Map)* e *Gerenciar Dores Ativas*.
3. **Cálculos de Carga de Treino (`/monitoring/pse` e API de Analytics)**:
   - `Session Load (UA) = PSE (0-10) * Duração Realizada (min)`.
   - `Carga Aguda`: Soma/média da carga dos últimos 7 dias.
   - `Carga Crônica`: Média móvel das últimas 4 semanas (28 dias).
   - `ACWR (Razão Agudo:Crônica) = Carga Aguda / Carga Crônica`, salvando **Situação Passada A:C** (semana anterior) e **Situação Atual A:C**, com classificação automática de risco (Gabbett, 2016):
     - `< 0.80`: **Destreino** (Azul/Cinza)
     - `0.80 a 1.30`: **Zona Ótima** (Verde `#10b981`)
     - `1.31 a 1.49`: **Zona de Atenção / Risco** (Amarelo/Laranja `#f59e0b`)
     - `>= 1.50`: **Risco Extremo de Lesão** (Vermelho `#ef4444`)
   - `Monotonia (Foster, 1998) = Média da Carga Diária Semanal / Desvio Padrão da Carga Diária Semanal` (tratar divisão por zero quando DP = 0).
   - `Strain (Esforço Acumulado) = Carga Semanal Total * Monotonia`.

### MÓDULO 2: Evolução do Questionário Diário de Bem-Estar (`/monitoring/wellness`)
Expanda o módulo de Wellness mantendo os 5 pilares (Qualidade do Sono, Disposição/Fadiga, Dor Muscular/DOMS, Nível de Estresse, Humor) e adicione:
1. **Interface de Escala Visual de 5 Níveis com Emojis e Cores Semânticas**:
   - `1 - Péssimo / Muito Dolorido` (`#e82e5f`)
   - `2 - Ruim / Dolorido` (`#f5b025`)
   - `3 - Normal / Neutro` (`#718096`)
   - `4 - Bom` (`#1ca1f2`)
   - `5 - Excelente / Sem Dor` (`#25c46e`)
2. **Registro de Tempo de Sono**: Alternador (*toggle*) entre **"Por Horários"** (Horário que dormiu e Horário que acordou, calculando a duração automaticamente) e **"Total de Horas"**.
3. **Escala de Hidratação por Cor da Urina (Armstrong 1 a 8)**:
   - Botão **"Registrar Hidratação"** com ícone de gota d'água que abre um modal interativo com 8 barras horizontais representando as cores reais da urina:
     - `1 - Ótima` (`#fef9c3`)
     - `2 - Boa` (`#fef08a`)
     - `3 - Aceitável` (`#fde047`)
     - `4 - Desidratação Leve` (`#facc15`)
     - `5 - Desidratação Moderada` (`#eab308`)
     - `6 - Desidratação Acentuada` (`#ca8a04`)
     - `7 - Desidratação Severa` (`#a16207`)
     - `8 - Desidratação Crítica` (`#713f12`)
4. **Índice de Prontidão (0 a 100%) e Gatilhos Inteligentes**:
   - Converter a soma dos 5 pilares (máx. 25 pontos) em porcentagem (`0% a 100%`).
   - Se `Prontidão < 70%`, gerar alerta automático no Dashboard do treinador com a variação percentual em relação ao dia anterior.
   - Se o atleta marcar nível 1, 2 ou 3 em "Dor Muscular", exibir imediatamente o botão/drawer do **Mapa Anatômico de Dor** para mapear a região e o tipo (*muscular, articular, tendinite*).
   - Se a atleta for do sexo feminino, exibir seção rápida integrada para registro do **Ciclo Menstrual** no próprio check-in.

### MÓDULO 3: Fluxo de Convite Sem Senha (`/checkin/:token`) e Modo Totem (`/totem`)
1. **Central de Convite de Monitoramento (`/monitoring/invite`)**:
   - Na visão do treinador, gerar link público exclusivo da organização/grupo (ex: `https://enb1one.github.io/academia/#/checkin/:token`) com botão **"Copiar Link"** para envio via WhatsApp.
2. **Visão Rápida do Atleta via Convite (`/#/checkin/:token`)**:
   - Exibe logo FormClub, nome do Treinador responsável e Organização.
   - O atleta informa sua **Data de Nascimento (`DD/MM/AAAA`)**.
   - O sistema localiza o atleta e exibe o modal de confirmação: **"[Primeiro Nome]?"** com botões **"Sim"** e **"Não"**, mais opções **"Instalar Aplicativo (PWA)"** ou **"Seguir pelo navegador"**.
   - Ao confirmar, emite um token temporário restrito (`scope: checkin`) e abre diretamente o Questionário Diário de Bem-Estar ("OLÁ [NOME DO ATLETA], COMO VOCÊ ESTÁ HOJE?").
3. **Modo Totem / Kiosk de Academia (`/#/totem`)**:
   - Interface otimizada para tablet fixo na recepção/sala de treino.
   - Barra de busca instantânea por nome, filtro por Grupos/Turmas, badge visual de % de Prontidão de cada atleta e dois botões de ação rápida por atleta:
     - **"Check-in Pré-Treino"** (abre modal de Wellness + Hidratação + PSR + Dor).
     - **"Finalizar Treino"** (abre modal rápido de PSE 0-10 + Duração em minutos).
   - Limpa o estado automaticamente após cada envio para o próximo atleta usar.

### MÓDULO 4: Gestão de Grupos, Planejamento (Individual e Coletivo) e Treino Coletivo
1. **Cadastro de Grupos/Turmas (`/groups`)**:
   - Criar grupos (ex: *Pré-Temporada, Período Competitivo, Pós-Operatório, Sub-20, Personal Premium*) e vincular atletas.
2. **Planejamento Individual (`/planning/individual`) e Coletivo (`/planning/collective`)**:
   - Permitir ao treinador planejar a carga da semana (Tipo de Treino, Duração Prevista e PSE Prevista -> gerando `Carga Planejada em UA`) tanto para um atleta individual quanto em lote para um Grupo inteiro.
   - Integrar com a ficha de treino (`/workouts/new`) para que a prescrição de força já possa carregar uma PSE/Duração planejada.
3. **Lançamento de Treino Coletivo (`/workouts/collective-log`)**:
   - Permitir que o treinador lance a sessão realizada (Tipo de Treino, Duração e PSE individualizada em tabela rápida) para todos os atletas de um grupo de uma só vez.

### MÓDULO 5: Prontidão Neuromuscular (CMJ), Avaliações Customizadas e OKRs
1. **Prontidão Neuromuscular CMJ (`/monitoring/neuromuscular`)**:
   - Expandir os testes de salto CMJ para calcular automaticamente por atleta: **Média Histórica (Baseline)**, **Desvio Padrão (SD)**, **Coeficiente de Variação (CV %)** e filtro ajustável por fator de Desvio Padrão.
   - Exibir badges automáticos de status neuromuscular: **Supercompensação** (acima da banda superior), **Referência** (dentro da normalidade) e **Fadiga Neuromuscular** (abaixo da banda inferior), mantendo o gráfico de **Assimetria Esquerda vs. Direita (%)** do FormClub.
2. **Construtor de Avaliações de Desempenho (`/assessments/types` e `/assessments/record`)**:
   - Permitir ao treinador criar protocolos customizados informando Nome, Descrição e **Unidade de Medida**: Quilograma (`kg`), Centímetro (`cm`), Tempo (`hh:mm:ss:ms`), Potência (`W`), Velocidade (`m/s`), Quilômetros (`km`), Metros (`m`), Graus (`°`) ou Percentual (`%`).
   - Tela de registro em 2 passos: Passo 1 (Selecionar Avaliação) -> Passo 2 (Selecionar Grupo/Atletas e lançar resultados com emissão de relatório).
3. **Objetivos e Metas — OKRs de Atletas (`/goals`)**:
   - Cadastro de metas mensuráveis por atleta (`+ Novo Objetivo`), com indicador inicial, meta alvo, prazo de entrega, barra de progresso (`%`) e filtros por status (*Em andamento*, *Concluído*), atleta e período.

### MÓDULO 6: Dashboard Executivo do Treinador (`/dashboard`) e Perfil Analítico 360º (`/athletes/:id`)
1. **Reestruturação do `/dashboard`**:
   - **KPIs de Topo**: Total de Atletas Ativos, Card Vermelho de Alerta (*Atletas em Risco na Relação A:C*), Média de Prontidão do Dia e Check-ins Realizados Hoje.
   - **Tabela de Alerta de Prontidão Baixa (`< 70%`)**: Lista atletas com baixa prontidão hoje, variação `%` frente ao dia anterior, indicadores críticos (sono, dor, urina) e botão de ação rápida.
   - **Tabela de Treinos Recentes (Últimos 7 dias)**: Atleta, Grupo, A:C atual, Total de Treinos, Média PSR e Média PSE.
   - **Tabela de Desempenho por Grupos**: Visão agregada por turma com médias de A:C, PSR, PSE e Prontidão.
   - **Matriz de Classificação de Risco (Gabbett, 2016)**: Contagem e lista de atletas em *Risco Extremo*, *Risco*, *Ótimo* e *Destreino*.
   - **Feed de Últimas Atividades em Tempo Real**: Lista cronológica ao vivo com os últimos registros enviados pelos atletas (exibindo badge de Wellness %, nível de dor, hidratação, fase do ciclo menstrual e carimbo de data/hora).
2. **Reestruturação do Perfil Analítico do Atleta (`/athletes/:id`)**:
   - Topo com botão *"Trocar Atleta"*, botão *"Imprimir / Exportar Relatório PDF"*, cards de Grupo, **Situação Passada A:C**, **Situação Atual A:C** e valor numérico da **Razão Agudo:Crônica**.
   - Barra de Filtros: Tipo de Treino, Período (*Últimos 7, 14, 30, 90 dias*) e checkbox *"Separar a carga de treino pelos tipos de treino"*.
   - **5 Abas Analíticas Completas**:
     - `Aba 1: Monitoramento`: Gráfico combinado de Carga Diária (PSR, PSE, Carga Planejada vs. Carga Realizada), Gráficos de Duração x PSE, Monotonia e Strain, Acumulados (Carga Crônica, Carga Aguda, Carga da Semana) e Cartões de Saúde (Wellness, Status Neuromuscular CMJ + Assimetria, Histórico de Sono, Hidratação, Ciclo Menstrual e Peso Corporal).
     - `Aba 2: Prescrição de Treinos (Exclusivo FormClub)`: Fichas A, B, C, D ativas, cargas em kg e histórico de execução de exercícios.
     - `Aba 3: Histórico de Dores (Pain Map)`: Tabela semanal de dores registradas com tipo (*muscular, articular, tendinite*), intensidade e modal de inspeção no mapa anatômico.
     - `Aba 4: Histórico de Treinos`: Tabela semanal consolidada com Carga da Semana, A:C da Semana, Monotonia e Strain.
     - `Aba 5: Histórico de Avaliações e Metas`: Resultados de todos os testes físicos, CMJ/Sprints e progresso dos OKRs com botão de emissão de relatório.

## 4. DIRETRIZES DE EXECUÇÃO E DEPLOY
1. Atualize o schema do banco de dados e crie as rotas REST correspondentes no servidor da **OCI**, garantindo que o processo do back-end e o túnel/proxy fiquem ativos em background.
2. Implemente todas as páginas, modais, cálculos e gráficos no `/frontend` mantendo o Design System *Dark Performance* em Tailwind CSS.
3. Execute o build de produção do front-end (`npm run build`) e publique no **GitHub Pages** (`enb1one.github.io/academia`), validando que todas as rotas e chamadas à API na OCI estão operacionais.
```
