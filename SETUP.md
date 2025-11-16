# WhatsApp Contact Manager - Setup Guide

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta Supabase (gratuita em https://supabase.com)

## 🚀 Instalação Local

### 1. Clone o repositório e instale dependências

```bash
npm install
```

### 2. Configure as variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```bash
cp .env.example .env.local
```

Edite `.env.local` e adicione suas credenciais do Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_aqui
```

### 3. Configure o banco de dados no Supabase

Acesse seu projeto Supabase e execute as seguintes queries no SQL Editor:

#### Criar tabela `tags`

```sql
CREATE TABLE public.tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#16a34a',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_tags_user_id ON tags(user_id);
```

#### Criar tabela `contacts`

```sql
CREATE TABLE public.contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_contacts_user_id ON contacts(user_id);
```

#### Criar tabela `contact_tags`

```sql
CREATE TABLE public.contact_tags (
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (contact_id, tag_id)
);

CREATE INDEX idx_contact_tags_contact ON contact_tags(contact_id);
CREATE INDEX idx_contact_tags_tag ON contact_tags(tag_id);
```

#### Criar tabela `interactions`

```sql
CREATE TABLE public.interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  last_message TEXT,
  notes TEXT,
  last_contact_date TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_interactions_contact ON interactions(contact_id);
```

### 4. Configure as políticas RLS (Row Level Security)

No Supabase, vá para **Authentication > Policies** e adicione as seguintes políticas:

#### Para tabela `tags`

```sql
CREATE POLICY "Users can view their own tags"
ON tags FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tags"
ON tags FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tags"
ON tags FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tags"
ON tags FOR DELETE
USING (auth.uid() = user_id);
```

#### Para tabela `contacts`

```sql
CREATE POLICY "Users can view their own contacts"
ON contacts FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own contacts"
ON contacts FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own contacts"
ON contacts FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own contacts"
ON contacts FOR DELETE
USING (auth.uid() = user_id);
```

### 5. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em http://localhost:3000

## 🔧 Desenvolvimento

### Build para produção

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## 📱 PWA (Progressive Web App)

A aplicação já está configurada como PWA. Para testar:

1. Abra o DevTools (F12)
2. Vá para **Application > Manifest**
3. Verifique se o manifest está carregando corretamente

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente no painel
3. Faça deploy

### Outras plataformas

Funciona com qualquer plataforma que suporte Next.js (Netlify, Railway, etc)

## 📝 Funcionalidades MVP

- ✅ Autenticação com Supabase
- ✅ Listagem de contatos (mock data)
- ✅ Busca por contato
- ✅ Gerenciador de tags
- ✅ Deep linking WhatsApp
- ✅ Limite de 50 contatos (freemium)
- ⏳ Sincronização com contatos do dispositivo
- ⏳ Notas e lembretes
- ⏳ Sistema de pagamento

## 🐛 Troubleshooting

### Erro: "Missing Supabase credentials"

Certifique-se de que `.env.local` existe e contém `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

### Erro de autenticação

1. Verifique se a URL do Supabase está correta
2. Regenere as chaves de API no Supabase
3. Limpe o cache do navegador (Ctrl+Shift+Delete)

## 📞 Suporte

Para dúvidas, abra uma issue no GitHub.
