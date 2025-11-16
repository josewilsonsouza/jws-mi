# WhatsApp Contact Manager 🚀

Um gerenciador inteligente de contatos do WhatsApp com contexto, tags e lembretes. Organize seus contatos por instituição, empresa, projeto e mais.

## 🎯 Visão Geral

**Problema:** Usuários não conseguem organizar contatos por contexto (instituição, empresa, projeto) no WhatsApp nativo.

**Solução:** App complementar que adiciona camada de contexto aos contatos do telefone, permitindo busca por tags, notas de interação e lembretes de follow-up.

### ✨ Funcionalidades MVP

- ✅ **Autenticação com Supabase** - Cadastro e login seguros
- ✅ **Gerenciamento de Contatos** - CRUD com validação
- ✅ **Gerenciamento com Tags** - Organize contatos por contexto
- ✅ **Busca Inteligente** - Procure por nome, telefone, email ou tags
- ✅ **Notas e Lembretes** - Registre última interação e defina follow-ups
- ✅ **Deep Linking WhatsApp** - Abra conversa diretamente do app
- ✅ **Modelo Freemium** - 50 contatos gratuitos, upgrade para ilimitado
- ✅ **PWA Ready** - Funciona como app mobile (iOS/Android)

## 🏗️ Stack Técnico

```
Frontend:      Next.js 16 + React 19 + TypeScript + Tailwind CSS v3
Backend:       Supabase (PostgreSQL)
Autenticação:  Supabase Auth
Database:      PostgreSQL com RLS
Deep Linking:  WhatsApp Web (wa.me)
PWA:           Next.js Built-in + Manifest.json
```

## 🚀 Quick Start

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta Supabase gratuita em https://supabase.com

### 1. Instalação Local

```bash
# Clone o repositório
git clone <repo-url>
cd jws-mi

# Instale dependências
npm install --legacy-peer-deps

# Crie arquivo .env.local
cp .env.example .env.local
```

### 2. Configure as Credenciais Supabase

Edite `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_aqui
```

### 3. Configure o Banco de Dados

Veja **SETUP.md** para executar as queries SQL que criam as tabelas e políticas de segurança.

### 4. Inicie o Servidor

```bash
npm run dev
```

Acesse http://localhost:3000

## 📱 Como Usar

### Fluxo de Uso

1. **Cadastre-se** com email e senha
2. **Crie Tags** para organizar (ex: "UFRJ", "Projeto X")
3. **Adicione Contatos** com nome e telefone
4. **Atribua Tags** aos contatos
5. **Adicione Notas** de follow-up e lembretes
6. **Busque** por nome, telefone ou tag
7. **Abra WhatsApp** diretamente do app

### Componentes Principais

| Componente | Funcionalidade |
|-----------|----------------|
| **ContactForm** | Criar/editar contatos |
| **ContactTagsModal** | Atribuir múltiplas tags |
| **ContactNotesModal** | Adicionar notas e datas de follow-up |
| **ContactList** | Grid com actions (edit, tags, notas, whatsapp, delete) |
| **TagManager** | CRUD de tags com cores customizáveis |
| **SearchBar** | Busca em tempo real |

## 📊 Modelo de Dados

### Tabelas

```sql
users (via Supabase Auth)
├─ id (UUID)
├─ email (string)
└─ password (hashed)

contacts
├─ id (UUID, PK)
├─ user_id (UUID, FK)
├─ name (string)
├─ phone (string)
├─ email (string, nullable)
├─ avatar_url (string, nullable)
├─ created_at (timestamp)
└─ updated_at (timestamp)

tags
├─ id (UUID, PK)
├─ user_id (UUID, FK)
├─ name (string)
├─ color (string)
└─ created_at (timestamp)

contact_tags (many-to-many)
├─ contact_id (UUID, FK)
├─ tag_id (UUID, FK)
└─ PK (contact_id, tag_id)

interactions
├─ id (UUID, PK)
├─ contact_id (UUID, FK)
├─ last_message (text, nullable)
├─ notes (text, nullable)
├─ last_contact_date (timestamp, nullable)
└─ updated_at (timestamp)
```

## 📊 Modelo Freemium

### Plano Gratuito
- ✅ Até 50 contatos enriquecidos
- ✅ Tags sem limite
- ✅ Busca por nome/telefone/email/tag
- ✅ Notas e lembretes
- ✅ Deep linking WhatsApp
- ✅ PWA (instalar como app)

### Plano Premium ($4.99/mês - Future)
- 🔓 Contatos ilimitados
- 🔓 Tags com emojis e mais cores
- 🔓 Notificações push
- 🔓 Exportar contatos
- 🔓 Integração com calendário

## 🗂️ Estrutura do Projeto

```
app/
  ├── page.tsx              # Login/signup
  ├── layout.tsx            # Root + PWA
  └── dashboard/
      ├── page.tsx          # Main dashboard
      └── layout.tsx        # Auth protection

components/
  ├── ContactForm.tsx       # Create/edit
  ├── ContactList.tsx       # Grid + actions
  ├── ContactTagsModal.tsx  # Assign tags
  ├── ContactNotesModal.tsx # Add notes
  ├── TagManager.tsx        # Manage tags
  └── SearchBar.tsx         # Search

lib/
  ├── supabase.ts          # Client + types
  └── whatsapp-utils.ts    # Deep linking

styles/
  └── globals.css          # Tailwind

public/
  └── manifest.json        # PWA

Config:
  ├── tailwind.config.ts
  ├── postcss.config.js
  ├── next.config.js
  └── tsconfig.json
```

## 🔐 Segurança

✅ **Row Level Security (RLS)** - Cada usuário só vê seus dados
✅ **Senhas Hashed** - Supabase Auth cuida da criptografia
✅ **HTTPS** - Obrigatório em produção
✅ **Ambiente Seguro** - Credenciais em .env.local (não commitadas)

## 🚢 Deploy

### Vercel (Recomendado)

```bash
# Conecte seu GitHub ao Vercel
# Configure as variáveis de ambiente no painel
# Deploy automático a cada push
```

### Outros Platforms

Qualquer hosting que suporte Next.js:
- Netlify
- Railway
- Render
- AWS Amplify

## 📦 Scripts Disponíveis

```bash
npm run dev      # Inicia servidor local em :3000
npm run build    # Build para produção
npm start        # Inicia servidor produção
npm run lint     # Executa linting
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie sua feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

- **Issues:** GitHub Issues
- **Docs:** SETUP.md para configuração completa
- **Email:** contato@example.com

## 📄 Licença

MIT License - veja LICENSE.md

---

**Desenvolvido com ❤️**
