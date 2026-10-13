# FORMCLUB — Centro de Treinamento e Performance
> **Site Oficial & Plataforma de Agendamento Consultivo de Alta Conversão**  
> Vila Galvão, Guarulhos - SP • Instagram: [@form.club](https://www.instagram.com/form.club/) • WhatsApp: `(11) 98996-0961`

---

## 💎 Visão Geral do Projeto
A **FORMCLUB** é um Centro de Treinamento e Performance boutique de alto padrão localizado na **Av. Dr. Timóteo Penteado, 3738 - 1º andar (Salas 7 e 8)** na Vila Galvão em Guarulhos - SP.

Este projeto foi concebido e desenvolvido sob a diretriz de **10 especialistas multidisciplinares** (Product Manager, SEO, Copywriter/UX Writer, UX Designer, UI Designer, Desenvolvedor Front-end, Desenvolvedor Back-end, Arquiteto Cloud/DevOps, NetSecOps e QA), unindo a estética **"Quiet Luxury & Dark Architectural Performance"** (inspirada em referências como Les Cinq Gym, Six Sport Life, SETT, Bio Ritmo e Reebok Sports Club) com engenharia de software de ponta, velocidade de carregamento extrema e estrita conformidade com a LGPD.

---

## 🏛️ Stack Técnica e Arquitetura

* **Framework:** [Next.js 15 (App Router)](https://nextjs.org/)
* **Linguagem:** TypeScript (strict mode)
* **Estilização & Design System:** Tailwind CSS com paleta proprietária:
  - `--bg-obsidian`: `#0A0A0B` (Preto Obsidiana)
  - `--bg-charcoal`: `#121316` (Carvão Arquitetônico)
  - `--surface-glass`: `rgba(24, 25, 29, 0.72)` com `backdrop-filter: blur(16px)`
  - `--accent-bronze`: `#C8A97E` (Champagne Gold / Bronze Acetinado)
  - `--accent-volt`: `#E2F163` (Indicador de Performance e Status)
  - `--text-alabaster`: `#F4F4F6`
* **Tipografia (`next/font/google`):**
  - Headings: `Syne` e `Plus Jakarta Sans`
  - Corpo: `Inter`
  - Métricas e Horários: `JetBrains Mono`
* **Ícones:** `lucide-react`
* **Animações:** `framer-motion` & CSS-first hardware accelerated transitions
* **Validação de Schemas:** `zod`
* **Segurança & LGPD:** NetSecOps com rate limiting por IP, anonimização SHA-256 de IPs para log de consentimento (Art. 8º da LGPD) e HTTP Security Headers (HSTS, CSP, X-Frame-Options DENY, X-Content-Type-Options nosniff).

---

## 🗺️ Arquitetura de Rotas e Páginas

| Rota | Descrição |
| :--- | :--- |
| `/` | **Home Page de Alta Conversão:** Hero Section com Trust Bar 5.0★, Manifesto Comparativo, Vitrine das 6 Modalidades, Bento Grid de Amenities, Seção Wellhub Silver+, Depoimentos Verificados, Planos Consultivos, Wizard de 3 Passos e FAQ Accordion. |
| `/modalidades` | **Página Detalhada de Modalidades:** Exploração técnica dos 6 pilares de movimento (Musculação, Híbrido, Funcional, Core, Mobilidade e Futebol de Velocidade). |
| `/estrutura` | **Tour Visual & Hospitalidade:** Destaques de biomecânica, pesos livres, vestiários privativos com duchas aquecidas, armários (lockers) e mini bar. |
| `/wellhub` | **Landing Page Wellhub Silver+:** Guia exclusivo para usuários corporativos, janela de horários e regras de check-in com hora marcada. |
| `/agendar` | **Squeeze Page de Alta Conversão:** Página sem distrações focada em tráfego pago (Meta Ads / Google Ads) com o Wizard em 3 passos e integração WhatsApp. |
| `/privacidade` | **Política de Privacidade & LGPD:** Transparência total sobre minimização de dados (Art. 6º, III), base legal de consentimento, direitos do titular e canal do DPO. |
| `/api/leads` | **Endpoint Serverless:** Validação estrita via Zod, rate limiting (5 req/min por IP), hash SHA-256 e geração de link parametrizado do WhatsApp. |
| `/sitemap.xml` | Sitemap dinâmico otimizado para SEO local em Guarulhos. |
| `/robots.txt` | Diretrizes de indexação para rastreadores de busca. |

---

## ⚡ Como Executar o Projeto Localmente

```bash
# 1. Instalar dependências (caso não tenha instalado)
npm install

# 2. Executar o servidor de desenvolvimento
npm run dev

# Acesse no navegador:
# http://localhost:3000
```

Para gerar a build de produção otimizada:
```bash
npm run build
npm run start
```

---

## 🛡️ Dados Reais e Contatos Oficiais
* **Marca:** FORMCLUB — Centro de Treinamento e Performance
* **Endereço:** Av. Dr. Timóteo Penteado, 3738 - 1º andar (Salas 7 e 8) - Vila Galvão, Guarulhos - SP, CEP 07061-002
* **Ponto de Referência:** Em frente à Cantina Giovanni e próximo ao McDonald's
* **WhatsApp Oficial:** `+55 (11) 98996-0961`
* **Instagram:** [@form.club](https://www.instagram.com/form.club/)
* **Avaliação Verificada:** 5.0 estrelas no Google Maps (72+ avaliações)
