# Instruções para Configuração do Supabase - IB MATHS CHOICE

Este documento contém instruções passo a passo para configurar o projeto no Supabase.

## Credenciais do Projeto

**URL do Projeto:** https://azhtkpetziwxgkgmkmkb.supabase.co  
**ID do Projeto:** azhtkpetziwxgkgmkmkb

**Chaves API:**
- **Anon Key:** eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6aHRrcGV0eml3eGdrZ21rbWtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyNTE3NjUsImV4cCI6MjA1OTgyNzc2NX0.5iek9Sn7LLc7L5V-z7WjmSjE5osxK2uQGDEfUOUXOAk
- **Service Role Key:** eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6aHRrcGV0eml3eGdrZ21rbWtiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDI1MTc2NSwiZXhwIjoyMDU5ODI3NzY1fQ.Xf5eurVQ5Z8XTptFFZdlzRow9pqBYjvOYDnNKOr5ylU

## Instruções de Configuração

### 1. Criar as Tabelas no Banco de Dados

1. Acesse o Dashboard do Supabase: https://app.supabase.com/
2. Selecione o projeto "ibmathschoice"
3. Navegue até "SQL Editor" no menu lateral
4. Clique em "New Query"
5. Cole o conteúdo do arquivo `create_tables.sql` que criamos
6. Clique em "Run" para executar o script e criar todas as tabelas

### 2. Verificar a Criação das Tabelas

1. No Dashboard do Supabase, vá para "Table Editor"
2. Você deve ver as seguintes tabelas:
   - `questionarios`
   - `questoes`
   - `cursos`
   - `escolas`
3. Verifique se os dados iniciais foram inseridos corretamente em cada tabela

### 3. Configurar as Políticas de Segurança (RLS)

O script já configura as políticas básicas de segurança, mas você pode ajustá-las:

1. No Dashboard do Supabase, vá para "Authentication" > "Policies"
2. Verifique as políticas criadas para cada tabela e ajuste se necessário

### 4. Configurar Autenticação

1. No Dashboard do Supabase, vá para "Authentication" > "Settings"
2. Configure o "Site URL" para apontar para o URL do seu frontend
3. Habilite os provedores de login desejados (Email, Magic Link, etc.)

### 5. Executar o Projeto

Após configurar o Supabase, você pode iniciar o projeto localmente:

1. Certifique-se de que o arquivo `.env` na raiz do projeto contém as credenciais corretas
2. Instale as dependências: `npm install`
3. Execute os scripts de instalação adicionais: `./install-dependencies.bat`
4. Inicie o servidor de desenvolvimento: `npm run dev`

## Configuração do MCP (Model Context Protocol)

A configuração do MCP para Supabase parece estar correta no arquivo de configuração:

```json
"supabase": {
  "command": "npx",
  "args": [
    "-y",
    "@supabase/mcp-server-supabase@latest",
    "--access-token",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6aHRrcGV0eml3eGdrZ21rbWtiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDI1MTc2NSwiZXhwIjoyMDU5ODI3NzY1fQ.Xf5eurVQ5Z8XTptFFZdlzRow9pqBYjvOYDnNKOr5ylU"
  ],
  "env": {
    "SUPABASE_URL": "https://azhtkpetziwxgkgmkmkb.supabase.co"
  }
}
```

Esta configuração está utilizando o Service Role Key, que fornece acesso completo ao banco de dados, conforme recomendado para fins administrativos.

## Troubleshooting

Se encontrar problemas com a conexão MCP, verifique:

1. Se o token de acesso ainda é válido
2. Se o MCP do Supabase está instalado corretamente
3. Se o URL do projeto está correto

Para verificar manualmente a conexão com o Supabase, você pode usar a seguinte consulta SQL no Editor SQL do Supabase:

```sql
SELECT version();
```

Isso deve retornar a versão do PostgreSQL se tudo estiver funcionando corretamente.