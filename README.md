# 🏋️ FormClub Training

Sistema completo de gestão de carga de treinamento para treinadores e atletas.

## 🚀 Stack

- **Frontend:** React 18 + Vite + TailwindCSS (hospedado no GitHub Pages)
- **Backend:** Python FastAPI + SQLAlchemy + PostgreSQL (hospedado em OCI)
- **Auth:** JWT

## 📦 Instalação

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou: venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## 🔧 Configuração

Copie `.env.example` para `.env` no diretório `backend/` e configure:

```env
DATABASE_URL=postgresql://formclub:formclub123@localhost:5432/formclub_db
SECRET_KEY=sua-chave-secreta-aqui
```

## 📋 Funcionalidades

- ✅ Autenticação (treinador/atleta)
- ✅ Gestão de atletas
- ✅ Prescrição de treinos
- ✅ Registro de PSE-sessão
- ✅ Questionário de bem-estar
- ✅ Gráficos de carga (ACWR)
- 🔜 Mapa de dor
- 🔜 Relatórios em PDF
- 🔜 Monitoramento de ciclo menstrual

## 🎨 Design

Tema escuro com cores vibrantes:
- Roxo `#7C3AED` | Verde `#10B981` | Laranja `#F59E0B`

## 📄 Licença

Projeto privado - FormClub © 2026
