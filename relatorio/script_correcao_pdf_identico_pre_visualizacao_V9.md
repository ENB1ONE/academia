# PROMPT CIRÚRGICO PARA O ANTIGRAVITY — CORRIGIR GERAÇÃO DE PDF PARA SAIR 100% IDÊNTICO À PRÉ-VISUALIZAÇÃO (SEM LOGO GIGANTE, SEM FUNDO PRETO VAZANDO E SEM CORTAR NA PÁGINA 1)

## 1. DIAGNÓSTICO EXATO DO QUE ESTÁ DESCONFIGURANDO O PDF (COMPARAÇÃO ENTRE A PRÉ-VISUALIZAÇÃO E O PDF GERADO)

Ao comparar a tela de **Pré-visualização do Laudo Oficial** (que está perfeita) com o arquivo **PDF gerado (`FORMCLUB - Human Performance Center.pdf`)**, identificamos exatamente os **4 erros de CSS/DOM** que desconfiguram o PDF na hora de imprimir:

1. **ERRO 1 — Logo do FORMCLUB Fica Gigante no PDF e Esmaga o Cabeçalho**:
   - Na pré-visualização o logo aparece pequeno, mas na hora de gerar o PDF a tag `<img>` do logo perde a restrição de largura e expande para quase 500px, esmagando o título `"FORMCLUB HUMAN PERFORMANCE CENTER"` por cima da coluna `"Emissão: 14/10/2026 / Relatório Oficial de Desempenho"` no canto direito!
2. **ERRO 2 — O PDF Corta na Página 1 (`1/1`) e Engole os Demais Gráficos e Assinatura**:
   - Como o modal de pré-visualização usa `position: fixed; inset: 0; overflow-y: auto`, o motor de impressão do Chrome/Edge trava containers `position: fixed` com scroll em **apenas 1 página (`1/1`)**, cortando na metade o gráfico *Duração Total x PSE* e sumindo com os gráficos de *Sono*, *Dores Registradas* e o *Rodapé de Assinatura do Fisiologista*!
3. **ERRO 3 — O Fundo Preto da Tela de Trás Vaza nas Bordas e no Topo do PDF**:
   - A página escura do perfil do atleta (`Monitoramento Individual do Atleta`) continua visível no DOM atrás do modal durante o `window.print()`, gerando uma moldura preta ao redor da folha e texto cortado no topo do PDF.
4. **ERRO 4 — Gráficos Recharts (`ResponsiveContainer`) Redimensionam ou Desalinham no Print**:
   - Quando `window.print()` roda direto na janela principal, o `ResponsiveContainer` tenta recalcular a largura durante o evento de impressão.

---

## 2. A SOLUÇÃO DEFINITIVA: IMPRESSÃO ISOLADA EM JANELA/IFRAME A4 LIMPO COM ESTILOS TRAVADOS

Substitua a função do botão **"Imprimir / Salvar em PDF"** no modal de pré-visualização de relatório (em `AthleteDetailPage.jsx` / `ReportPrintModal.jsx`) pela implementação abaixo. Ela clona exatamente a folha branca `#a4-report-sheet` que o usuário está vendo na pré-visualização, trava o tamanho exato dos `<svg>` dos gráficos e do logo, e imprime em um documento A4 100% branco e paginado:

### PASSO 1: Travar o Tamanho do Logo e do Cabeçalho na Pré-Visualização e no Print
No cabeçalho do laudo branco (`#a4-report-sheet`), aplique estilos inline explícitos (`style={{ ... }}`) na imagem do logo e no container flex do cabeçalho para que **nunca** dependam apenas de classes externas:
- No container do cabeçalho do laudo:
  `style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', borderBottom: '2px solid #0f172a', paddingBottom: '16px', marginBottom: '20px', width: '100%' }}`
- No bloco esquerdo (Logo + Título):
  `style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0, flex: '1 1 auto' }}`
- Na tag `<img />` do logo FORMCLUB dentro do laudo:
  `style={{ width: '120px', maxWidth: '120px', height: '44px', maxHeight: '44px', objectFit: 'contain', flexShrink: 0, display: 'block' }}`
  *(Nota: Se a imagem original do logo for branca sobre transparente, aplique `filter: brightness(0)` apenas na imagem do laudo branco para que ela fique preta nítida sobre o papel branco sem precisar de fundo escuro!)*
- No bloco direito (`Emissão: 14/10/2026` / `Relatório Oficial de Desempenho`):
  `style={{ textAlign: 'right', flexShrink: 0, whiteSpace: 'nowrap' }}`

---

### PASSO 2: Implementar a Função `handlePrintExactA4()` ao Clicar em "Imprimir / Salvar em PDF"
Em vez de chamar `window.print()` diretamente na tela escura com modal `position: fixed`, implemente esta função para o botão **"Imprimir / Salvar em PDF"**:

1. **Capturar a Folha Exata da Pré-Visualização (`#a4-report-sheet`)**:
   - Adicione `id="a4-report-sheet"` na `div` branca da folha A4 dentro do modal de pré-visualização.
   - Adicione a classe `no-print-in-pdf` em todos os botões `[X] Remover Seção` e no texto auxiliar `(Digite suas observações aqui. O texto sairá impresso no laudo)`.
2. **Congelar as Dimensões Exatas dos Gráficos (`<svg>`) e do Parecer Fisiológico**:
   - Quando o usuário clicar em **"Imprimir / Salvar em PDF"**:
     - Clone o nó `#a4-report-sheet` (`const clone = sheetEl.cloneNode(true)`).
     - Para cada `<svg>` dentro de `sheetEl`, leia `const rect = origSvg.getBoundingClientRect()` e grave no `<svg>` correspondente do `clone`:
       `clonedSvg.setAttribute('width', rect.width);`
       `clonedSvg.setAttribute('height', rect.height);`
       `clonedSvg.style.width = rect.width + 'px';`
       `clonedSvg.style.height = rect.height + 'px';`
       *(Isso garante que todos os gráficos saiam no PDF com a exata proporção, cores e linhas que aparecem na pré-visualização!)*
     - Substitua o `<textarea>` do Parecer Fisiológico no `clone` por uma `<div style="font-size: 13px; color: #1e293b; line-height: 1.5; white-space: pre-wrap; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 8px; background: #f8fafc;">` contendo o texto digitado pelo treinador (ou o texto padrão caso o treinador não tenha digitado nada).
     - Remova do `clone` todos os elementos com `.no-print-in-pdf` (como os botões vermelhos `[X] Remover Seção`).
3. **Imprimir a partir de um `iframe` A4 Limpo (Zero Fundo Preto e Paginação Completa de Todas as Seções)**:
   - Crie um `iframe` invisível temporário no `document.body`, copie todas as tags `<style>` e `<link rel="stylesheet">` do `document.head` para o `<head>` do `iframe`, e adicione este bloco `<style>` de impressão no `iframe`:
     `
     @page { size: A4 portrait; margin: 10mm; }
     html, body {
       margin: 0 !important;
       padding: 0 !important;
       background: #ffffff !important;
       color: #0f172a !important;
       font-family: Inter, system-ui, -apple-system, sans-serif !important;
       -webkit-print-color-adjust: exact !important;
       print-color-adjust: exact !important;
       height: auto !important;
       overflow: visible !important;
     }
     #a4-report-sheet {
       width: 100% !important;
       max-width: 100% !important;
       margin: 0 !important;
       padding: 0 !important;
       box-shadow: none !important;
       border: none !important;
       border-radius: 0 !important;
       background: #ffffff !important;
       overflow: visible !important;
     }
     .report-section-card {
       page-break-inside: avoid !important;
       break-inside: avoid !important;
       margin-bottom: 16px !important;
       border: 1px solid #e2e8f0 !important;
       border-radius: 10px !important;
       padding: 16px !important;
       background: #ffffff !important;
     }
     .report-footer-signature {
       page-break-inside: avoid !important;
       break-inside: avoid !important;
       margin-top: 24px !important;
     }
     `
   - Adicione a classe `report-section-card` em cada bloco de gráfico/seção dentro de `#a4-report-sheet` (para que nenhum gráfico seja cortado ao meio na virada da Página 1 para a Página 2!).
   - Insira o `clone` no `<body>` do `iframe`, aguarde `300ms` para as imagens carregarem e chame `iframe.contentWindow.focus(); iframe.contentWindow.print();`.

---

## 3. VALIDAÇÃO OBRIGATÓRIA ANTES DO DEPLOY EM https://app.formclub.com.br

1. Abra o perfil de um atleta (ex: `BRYAN JEAN` em `/#/athletes/29264` ou `ARTHUR RIBEIRO` em `/#/athletes/20337`) e clique em **"Imprimir relatórios"** / **"Exportar PDF"**.
2. Na tela de **Pré-visualização do Laudo Oficial**, clique no botão amarelo **"Imprimir / Salvar em PDF"** e verifique na visualização de impressão do navegador que:
   - **O fundo é 100% branco** (sem nenhuma borda preta e sem a tela de fundo vazando no topo).
   - **O logo FORMCLUB no topo esquerdo está no tamanho correto (`120px x 44px`)**, alinhado ao lado de `"FORMCLUB HUMAN PERFORMANCE CENTER"` e com `"Emissão: 14/10/2026"` perfeitamente alinhado à direita sem nenhuma sobreposição de texto.
   - **Todos os gráficos e seções da pré-visualização aparecem completos** distribuídos em múltiplas páginas A4 (`Carga Diária`, `Duração x PSE`, `Carga da Semana`, `Questionário de Bem-Estar`, `Status Neuromuscular CMJ`, `Sono`, `Dores Registradas` e o `Rodapé de Assinatura do Fisiologista / Treinador Responsável`), sem cortar na Página 1 e sem exibir os botões `[X] Remover Seção`.
3. Faça o `npm run build` (mantendo `dist/CNAME` com `app.formclub.com.br`) e publique na branch `gh-pages`.
