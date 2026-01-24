# Funcionalidades - Agenndar

Este documento detalha todas as funcionalidades do sistema Agenndar, organizadas por módulo.

## 🔐 Autenticação

### Prestador (Admin)
- **Login/Cadastro**: Firebase Auth com Google
- **Fluxo único**: Um botão "Entrar com Google"
- **Setup inicial obrigatório**:
  - Nome do negócio
  - Telefone de contato
  - Geração automática de slug para URL pública

### Cliente Final
- **Login obrigatório**: Apenas Google
- **Dados coletados**:
  - Nome
  - Telefone (para WhatsApp)
- **Sem distinção**: Login e cadastro são o mesmo fluxo

## 🏠 Dashboard do Prestador

### Home / Visão Geral
- **Métricas principais**:
  - Total de agendamentos
  - Cancelamentos
  - Faltas
  - Comparecimentos
- **Cards de métricas**: Visualização rápida com variação percentual
- **Próximos agendamentos**: Lista dos próximos agendamentos do dia

### Navegação
- **Mobile**: Menu inferior (bottom navigation)
- **Desktop**: Navegação lateral ou superior otimizada
- **Abas principais**:
  - Home / Dashboard
  - Usuários / Colaboradores
  - Serviços
  - Disponibilidade / Agenda
  - Analytics
  - Financeiro
  - Conta / Personalização

## 📅 Agenda e Disponibilidade

### Configuração de Horários
- **Horário padrão**: Definição de horário de trabalho padrão (ex: 06:00 às 18:00)
- **Aplicação automática**: Aplicado a todos os dias da semana
- **Dias de trabalho**: Seleção manual dos dias que trabalha
- **Horários de descanso**: 
  - Almoço
  - Pausas
  - Múltiplos períodos permitidos

### Calendário Mensal
- **Visualização mensal**: Todos os dias do mês visíveis
- **Edição por dia**: Cada dia pode sobrescrever o padrão
- **Interface interativa**: 
  - Arrastar blocos
  - Redimensionar
  - Otimizado para toque (mobile)
- **Status visual**:
  - Trabalho / Não trabalha
  - Ocupação (cheio, parcial, livre)

### Intervalo entre Atendimentos (Buffer)
- **Configuração opcional**: Intervalo entre um atendimento e outro
- **Opções**: 0, 5, 10, 15, 30 minutos
- **Bloqueio automático**: Sistema garante que não haja marcações consecutivas

### Bloqueio de Horários
- **Automático**: Ao confirmar agendamento, horário é bloqueado
- **Respeita**:
  - Prestador
  - Colaborador
  - Serviço
- **Visualização**: Horários indisponíveis aparecem trancados/inativos

## 👥 Colaboradores

### Gestão
- **Trabalho individual**: Prestador pode trabalhar sozinho
- **Múltiplos colaboradores**: Cadastro ilimitado
- **Associação**: Colaboradores associados a serviços
- **Seleção no agendamento**: Cliente escolhe colaborador ao agendar

## ✂️ Serviços

### Cadastro
- **Manual**: Prestador cadastra serviços oferecidos
- **Exemplos**: Corte de cabelo, Barba, Manicure, Pedicure
- **Associação**: Cada serviço pode ter um ou mais colaboradores
- **Informações**:
  - Nome do serviço
  - Duração estimada
  - Preço (opcional, para controle financeiro)

## 📊 Analytics

### Métricas Gerais
- **Visualizações**:
  - Por dia
  - Por mês
  - Por ano
- **Gráficos interativos**: Visualizações detalhadas

### Dados por Usuário
- Quantas vezes agendou
- Quantas vezes compareceu
- Quantas vezes faltou
- Quantas vezes cancelou
- Histórico completo

### Exportações
- Lista de usuários
- Procedimentos
- Valores
- Relatórios personalizados

### Cruzamento de Dados
- Usuário x período
- Serviço x faturamento
- Colaborador x faturamento

## 💰 Financeiro

### Controle Automático
- **Registro automático**:
  - Procedimentos agendados
  - Procedimentos confirmados (comparecimento)

### Entrada Manual
- **Procedimentos externos**: Prestador pode adicionar procedimentos feitos fora do sistema
- **Objetivo**: Controle financeiro completo

### Visualizações
- Receita por dia
- Receita por mês
- Receita por ano
- Por usuário: Histórico completo e valor gerado total
- Gráficos de evolução

## 📱 Página Pública do Prestador

### URL
- Formato: `agendex.com.br/{slug-do-usuario}`
- **Pública**: Sem necessidade de autenticação para visualizar

### Modo Visualização (Sem Login)
- Visualizar informações
- Ver serviços
- Ver colaboradores
- Ver disponibilidade
- **Não pode executar ações**

### Ações Protegidas
- Qualquer tentativa de:
  - Agendar
  - Editar
  - Confirmar horários
- **Dispara**: Fluxo de autenticação obrigatório

### Funcionalidades
- Seleção de prestador
- Seleção de serviço
- Seleção de colaborador
- Seleção de dia
- Seleção de horário disponível

## 📋 Agendamentos

### Visualização
- **Aba dedicada**: Lista de todos os agendamentos
- **Organização**:
  - Separada por dia
  - Ordenada por horário

### Informações Visíveis
- Serviço agendado
- Colaborador
- Horário
- Nome do cliente
- **Telefone**: Não exibido (privacidade)

### Status do Agendamento
- **Agendado**: Status inicial
- **Cancelado**: Automático pelo sistema
- **Remarcado**: Quando há remarcação
- **Pendente**: Após horário do agendamento
- **Compareceu**: Confirmação manual do prestador
- **Faltou**: Confirmação manual do prestador

### Confirmação de Comparecimento
- **Manual**: Prestador marca após o horário
- **Opções**:
  - ✔ Compareceu
  - ✖ Faltou
- **Base para**: Métricas, confiabilidade e dados financeiros

### Ações Permitidas

#### Cliente Final
- Agendar
- Desmarcar
- Remarcar horários

#### Prestador
- Desmarcar agendamentos
- Remarcar quando necessário

## 🔔 Notificações

### Canais
- **Notificações internas**: No sistema
- **Push notifications**: Via PWA (quando instalado)
- **Não usa WhatsApp**: Evita custo de API

### Eventos Notificados ao Cliente
- Cancelamento de agendamento pelo prestador
- Remarcação de agendamento

### Eventos Notificados ao Prestador
- Novo agendamento criado
- Cancelamento pelo cliente
- Remarcação pelo cliente

## 📱 PWA (Progressive Web App)

### Funcionalidades
- **Instalável**: Tanto para prestador quanto cliente
- **Offline**: Funcionalidades básicas offline
- **Notificações push**: Quando instalado
- **Experiência nativa**: Visual e comportamento de app

## 🎫 QR Code

### Geração Automática
- **QR Code exclusivo**: Gerado automaticamente para cada prestador
- **URL**: Aponta para `agendex.com.br/{slug-do-usuario}`

### Uso
- Impressão física
- Divulgação em estabelecimento
- Facilita acesso direto ao agendamento

## 🎨 Personalização

### Página Pública
- Nome do negócio
- Telefone de contato
- Logo (futuro)
- Cores (futuro)

## 🔄 Tempo Real

### Comunicação
- **Realtime do Supabase**: Para atualizações instantâneas
- **WebSockets**: Via Next.js quando necessário
- **Notificações**: Instantâneas para prestador

## 📱 Responsividade

### Mobile-First
- **Prioridade**: Design pensado primeiro para mobile
- **Totalmente funcional**: No desktop também
- **Bibliotecas avançadas**: Drag & drop, animações, timeline
- **Possível uso**: Three.js ou similares para visualização da agenda

## 🔍 Regras de Agendamento

### Disponibilidade
- **Bloqueio automático**: Horários ocupados não aparecem como opção
- **Dia indisponível**: Se todos os horários ocupados, dia aparece como indisponível
- **Mensagem clara**: Explicação do motivo da indisponibilidade
- **Navegação facilitada**: Direcionamento para datas alternativas

### Visualização

#### Cliente
- **Padrão**: Visualização semanal
- **Filtros**: Semanal (default) ou mensal (estilo Google Agenda)
- **Alternância fácil**: Entre semanas/dias

#### Prestador
- **Padrão**: Visualização mensal
- **Filtro opcional**: Visualização semanal
- **Status visual**: Trabalho / não trabalha, ocupação

## 📝 Documentação

### Regra Geral
- **Toda funcionalidade**: Deve possuir arquivo `.md` explicativo
- **Regras de negócio**: Documentadas
- **Lógica**: Explicada
- **Personalizações**: Registradas

