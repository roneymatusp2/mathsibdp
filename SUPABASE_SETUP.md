# Configuração do Supabase para IB MATHS CHOICE

Este documento detalha a configuração do banco de dados Supabase para o projeto IB MATHS CHOICE.

## Credenciais

**URL do Projeto**: https://azhtkpetziwxgkgmkmkb.supabase.co  
**ID do Projeto**: azhtkpetziwxgkgmkmkb

**Chaves de API**:
- **Anon Key** (pública): eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6aHRrcGV0eml3eGdrZ21rbWtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyNTE3NjUsImV4cCI6MjA1OTgyNzc2NX0.5iek9Sn7LLc7L5V-z7WjmSjE5osxK2uQGDEfUOUXOAk
- **Service Role Key** (privada, não compartilhar): eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6aHRrcGV0eml3eGdrZ21rbWtiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDI1MTc2NSwiZXhwIjoyMDU5ODI3NzY1fQ.Xf5eurVQ5Z8XTptFFZdlzRow9pqBYjvOYDnNKOr5ylU

## Estrutura do Banco de Dados

O banco de dados contém as seguintes tabelas:

### Tabela: `questionarios`

Armazena as respostas dos estudantes ao questionário.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Chave primária |
| name | TEXT | Nome do estudante |
| email | TEXT | Email do estudante |
| timestamp | TIMESTAMPTZ | Data e hora de submissão |
| recommended_course | TEXT | Curso recomendado |
| confidence_score | INTEGER | Pontuação de confiança na recomendação |
| answers | JSONB | Respostas individuais no formato JSON |
| school | TEXT | Escola do estudante (opcional) |
| gender | TEXT | Gênero do estudante (opcional) |

### Tabela: `questoes`

Contém as perguntas do questionário.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | TEXT | Chave primária |
| text | TEXT | Texto da pergunta |
| section | TEXT | Seção do questionário |
| options | JSONB | Opções de resposta no formato JSON |

### Tabela: `cursos`

Informações sobre os cursos de matemática do IB.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | TEXT | Chave primária |
| name | TEXT | Nome do curso |
| description | TEXT | Descrição do curso |
| level | TEXT | Nível do curso (HL ou SL) |
| path | TEXT | Caminho do curso (AA ou AI) |

### Tabela: `escolas`

Informações sobre as escolas participantes.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Chave primária |
| name | TEXT | Nome da escola |
| domain | TEXT | Domínio de email da escola |
| country | TEXT | País |
| city | TEXT | Cidade |

## Segurança e Políticas RLS

As seguintes políticas de Row Level Security (RLS) estão configuradas:

1. **Questões e Cursos**: Leitura pública permitida para todos os usuários
2. **Questionários**:
   - Inserção permitida para usuários anônimos
   - Leitura permitida apenas para administradores autenticados
3. **Escolas**: Leitura pública permitida para todos os usuários

## API e Integração

### Client-Side (Anon Key)

Use a Anon Key para:
- Ler informações sobre questões e cursos
- Enviar respostas de questionários
- Autenticar estudantes para receber resultados por email

### Server-Side (Service Role Key)

Use a Service Role Key apenas em ambientes seguros (servidor, funções serverless) para:
- Ler todos os questionários para análise administrativa
- Gerenciar usuários e permissões
- Realizar operações de administração do sistema

## Autenticação

A autenticação é configurada para permitir:

1. **Login de Administradores**: Usando email/senha
2. **Registro de Estudantes**: Para rastrear resultados e preferências de email

## Exemplos de Consultas SQL

### Obter Todos os Questionários

```sql
SELECT * FROM questionarios
ORDER BY timestamp DESC;
```

### Filtrar por Curso Recomendado

```sql
SELECT * FROM questionarios
WHERE recommended_course = 'AA HL'
ORDER BY timestamp DESC;
```

### Agrupar por Escola (Domínio de Email)

```sql
SELECT 
  split_part(email, '@', 2) as school_domain,
  COUNT(*) as student_count,
  AVG(confidence_score) as avg_confidence
FROM questionarios
GROUP BY school_domain
ORDER BY student_count DESC;
```

## Manutenção

Para aplicar o esquema completo ou reinicializar o banco de dados, use o arquivo `supabase_schema.sql`.