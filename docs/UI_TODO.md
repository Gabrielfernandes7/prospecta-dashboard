# UI TODO - Align com index.html

**Status:** Documento de análise das mudanças necessárias para alinhar a UI atual (React/Next.js) com o design do `index.html` (Vanilla JS + Tailwind).

**Data:** 2026-09-24

---

## 📋 Resumo Executivo

A aplicação atual está implementada em **React + Next.js** com um design system cinza/branco padrão. O `index.html` reference implementa o mesmo CRM em **Vanilla JS** com um **tema amarelo escuro (âmbar/dourado)** bem definido e refinado.

**Trabalho a fazer:** Aplicar o tema visual, melhorar UX de alguns componentes e garantir visual consistency com o reference design.

---

## 🎨 Mudanças de Tema (Prioridade Alta)

### 1. Color Palette - Substituir tema cinza por Amarelo Escuro

**Arquivo:** `src/app/globals.css`

**Mudanças:**

```diff
:root {
  /* OLD - Cinza/Branco padrão */
  - --background: 0 0% 100%;
  - --foreground: 240 10% 3.9%;
  - --primary: 240 5.9% 10%;
  
  /* NEW - Amarelo Escuro / Âmbar (do index.html) */
  + --background: 45 60% 97%;          /* fundo geral levemente amarelado */
  + --foreground: 35 40% 12%;          /* texto escuro quente */
  + --primary: 38 92% 40%;             /* amarelo escuro / âmbar forte */
  + --primary-foreground: 45 100% 97%;
  + --secondary: 42 60% 90%;           /* secundário suave */
  + --secondary-foreground: 35 45% 18%;
  + --card: 45 70% 99%;                /* cards quase brancos com calor */
  + --muted: 42 45% 92%;
  + --accent: 42 70% 88%;
  + --border: 40 40% 82%;
  + --input: 40 40% 82%;
  + --ring: 38 92% 40%;
}

.dark {
  /* Adicionar variantes dark mode com o tema amarelo */
  /* (atualmente não tem, pode manter simples ou adaptar) */
}
```

**Referência do index.html:** Lines 32-54

---

## 🧩 Componentes - Ajustes Visuais

### 2. Header

**Status:** ✅ Estrutura pronta, ❌ Tema precisa atualizar

**Mudanças em `src/components/Header.tsx`:**

- Remover classes `dark:` (tema dark mode) para simplificar
- Atualizar cores hardcoded `slate-*` para usar tokens CSS
- Badge do logo (LC) deve ser `bg-primary text-primary-foreground`
- Nav items ativos: `bg-secondary text-secondary-foreground`
- Botão "+ Novo lead": `bg-primary text-primary-foreground hover:bg-primary/90`

**Resultado esperado:** Header com fundo quase branco levemente amarelado, botão em âmbar.

---

### 3. Dashboard

**Status:** ⚠️ Precisa revisar estrutura

**Componentes a verificar:**

- [ ] KPI cards (5 no topo): devem ter `bg-card` com sombra suave
- [ ] Gráfico Funil por etapa: barras coloridas por stage
- [ ] Card "Conversão por nicho": layout limpo
- [ ] "Atividade recente": timeline com ícones ↑ (outbound) / ↓ (inbound)

**Mudanças necessárias:**

- Verificar se componentes existem em `src/app/dashboard/` ou similar
- Aplicar `Card` component com classes corretas
- Adicionar dots/badges coloridos por stage (ver tabela STAGES no index.html)

---

### 4. Kanban

**Status:** ⚠️ Estrutura pode existir, visual precisa verificar

**Requisitos do index.html (lines 393-443):**

- 6 colunas (NOVO, ABORDADO, RESPONDEU, NEGOCIANDO, FECHADO, PERDIDO)
- Cards arrastáveis com:
  - Nome do lead
  - Badge de nicho (com cor do nicho)
  - Valor proposto (se houver)
  - Badge de follow-up pendente (se houver)
- Drag & Drop: `draggable="true"` + handlers `onDragStart`, `onDragEnd`, `onDrop`
- Coluna com background `bg-muted/30`, hover `drop-active`

**Mudanças:**

- Se houver componente Kanban, aplicar estilos do tema
- Verificar se DnD está implementado (usar HTML5 nativo ou biblioteca)

---

### 5. Leads (Tabela)

**Status:** ✅ Componente `LeadsTable.tsx` existe

**Mudanças em `src/components/LeadsTable.tsx`:**

- Campos esperados (ver index.html lines 468-479):
  1. **Lead**: Nome + @handle Instagram (link)
  2. **Nicho**: Badge com cor
  3. **Solução**: Texto simples
  4. **Etapa**: Badge colorida
  5. **1º contato**: Data (apenas data, sem hora)
  6. **Proposto**: Valor formatado (R$ X.XXX,XX)
  7. **Vendido**: Valor (apenas se stage === FECHADO)

- Filtros (4 inputs):
  - Busca por nome, @, ou nota (input text)
  - Nicho (select)
  - Etapa (select)
  - Solução (select)

- Hover: `hover:bg-muted/40 transition-colors`

---

### 6. Interações (Timeline Global)

**Status:** ⚠️ Componente `InteractionsTimeline.tsx` existe

**Mudanças:**

- Listar todas as interações ordenadas por data DESC
- Cada item tem:
  - Ícone direção: `↑` (outbound, âmbar) / `↓` (inbound, verde)
  - Nome do lead (clickable)
  - Canal (INSTAGRAM_DM, WHATSAPP, etc)
  - Badge resultado (se houver)
  - Conteúdo da interação (multiline)
  - Data/hora (datetime formatado)

**Referência:** index.html lines 521-554

---

### 7. Follow-ups

**Status:** ⚠️ Componente pode não existir

**Requisitos:**

- Listar interações com `followUpAt` não concluído
- Ordernar por data do follow-up ASC
- Cada item tem:
  - Nome do lead
  - Conteúdo (truncated)
  - Data follow-up
  - Badge status: "Vencido" (vermelho), "Hoje" (âmbar), "Agendado" (cinza)
  - Botão "Concluir" → marca `followUpDone = true`

**Referência:** index.html lines 556-591

---

### 8. Configurações

**Status:** ⚠️ Componentes `NichesSection` e `SolutionsSection` existem

**Mudanças:**

- Seção **Nichos**: lista com edit/delete
- Seção **Soluções digitais**: lista com edit/delete
- Botão "Resetar dados": destrói localStorage + reload seed

**Layout:** 2 colunas (grid md:grid-cols-2)

---

## 🎯 Modais

### 9. Lead Modal

**Status:** ✅ `src/components/LeadModal.tsx` existe

**Campos esperados (ver index.html lines 681-705):**

```
Nome | Etapa
Instagram URL
Google Maps URL
Origem | Nicho
Solução digital | Valor proposto
[Se FECHADO] Valor vendido | Data venda
[Se PERDIDO] Motivo da perda
Observações
---
[Se edit] Timeline de interações (inline)
```

**Mudanças:**

- Verificar se todos os campos existem
- Aplicar spacing/layout correto (grid 2 cols onde indicado)
- Timeline inline deve usar `renderTimeline(leadId)`

---

### 10. Interaction Modal

**Status:** ✅ `src/components/InteractionModal.tsx` existe

**Campos (index.html lines 802-814):**

```
Direção | Canal
Data e hora (datetime-local)
Conteúdo (textarea 4 linhas)
Resultado | Próximo follow-up (datetime-local)
```

**Lógica automática:**

- Se direction === OUTBOUND + stage === NOVO → stage muda para ABORDADO
- Se direction === INBOUND + stage em [NOVO, ABORDADO] → stage muda para RESPONDEU
- Se outcome === FECHOU → stage = FECHADO
- Se outcome em [BLOQUEOU, SEM_INTERESSE] → stage = PERDIDO

**Referência:** index.html lines 847-859

---

### 11. Niche Modal

**Status:** ✅ `src/components/NicheModal.tsx` existe

**Campos:**

```
Nome (input text)
Cor (input color)
```

---

### 12. Solution Modal

**Status:** ✅ `src/components/SolutionModal.tsx` existe

**Campos:**

```
Nome (input text)
Valor padrão (input number)
```

---

## 📊 Tabelas de Referência

### Stages

```javascript
const STAGES = [
  { id: 'NOVO',       label: 'Novo',       badge: 'bg-amber-50 text-amber-800 border-amber-200',  dot: 'bg-amber-300' },
  { id: 'ABORDADO',   label: 'Abordado',   badge: 'bg-yellow-100 text-yellow-900 border-yellow-300', dot: 'bg-yellow-500' },
  { id: 'RESPONDEU',  label: 'Respondeu',  badge: 'bg-orange-100 text-orange-800 border-orange-300',  dot: 'bg-orange-500' },
  { id: 'NEGOCIANDO', label: 'Negociando', badge: 'bg-amber-200 text-amber-900 border-amber-400', dot: 'bg-amber-600' },
  { id: 'FECHADO',    label: 'Fechado',    badge: 'bg-lime-100 text-lime-800 border-lime-300', dot: 'bg-lime-500' },
  { id: 'PERDIDO',    label: 'Perdido',    badge: 'bg-rose-100 text-rose-800 border-rose-300',     dot: 'bg-rose-500' },
];
```

### Channels

- INSTAGRAM_DM
- INSTAGRAM_COMENTARIO
- INSTAGRAM_STORY
- WHATSAPP
- EMAIL
- LIGACAO
- REUNIAO
- OUTRO

### Outcomes

```javascript
const OUTCOMES = [
  { id: 'SEM_RESPOSTA',  label: 'Sem resposta',    color: 'text-stone-600 bg-stone-100 border-stone-200' },
  { id: 'RESPONDEU',     label: 'Respondeu',       color: 'text-yellow-800 bg-yellow-50 border-yellow-200' },
  { id: 'INTERESSADO',   label: 'Interessado',     color: 'text-amber-800 bg-amber-50 border-amber-200' },
  { id: 'SEM_INTERESSE', label: 'Sem interesse',   color: 'text-orange-800 bg-orange-50 border-orange-200' },
  { id: 'AGENDOU',       label: 'Agendou',         color: 'text-indigo-700 bg-indigo-50 border-indigo-200' },
  { id: 'FECHOU',        label: 'Fechou',          color: 'text-lime-800 bg-lime-50 border-lime-200' },
  { id: 'BLOQUEOU',      label: 'Bloqueou',        color: 'text-rose-800 bg-rose-50 border-rose-200' },
  { id: 'OUTRO',         label: 'Outro',           color: 'text-stone-700 bg-stone-50 border-stone-200' },
];
```

---

## 🔄 Utilitários - Verificar/Implementar

- [ ] `fmtDate(d)`: formata data para `DD/MM/YYYY` (pt-BR)
- [ ] `fmtDateTime(d)`: formata para `DD/MM/YYYY HH:MM`
- [ ] `fmtMoney(v)`: formata para `R$ X.XXX,XX`
- [ ] `igHandle(url)`: extrai `@usuario` de URL Instagram
- [ ] `nowLocalISO()`: retorna datetime-local value (sem timezone offset)
- [ ] `esc(s)`: escapa HTML (evita XSS)

---

## 🧪 Checklist de Implementação

### Fase 1: Tema & Layout (🔴 Bloqueador)

- [ ] Atualizar `globals.css` com paleta amarelo escuro
- [ ] Remover hard-coded `slate-*`, usar tokens CSS
- [ ] Testar em light mode (dark mode pode desabilitar por agora)
- [ ] Verificar que todos os componentes respeitam novos tokens

### Fase 2: Dashboard

- [ ] Verificar se todas as 5 KPIs estão renderizando
- [ ] Implementar gráfico Funil
- [ ] Implementar "Conversão por nicho"
- [ ] Implementar "Atividade recente" com ícones ↑/↓

### Fase 3: Kanban

- [ ] Verificar estrutura (6 colunas por stage)
- [ ] Implementar/ajustar Drag & Drop
- [ ] Aplicar estilos corretos (cards, dots, badges)

### Fase 4: Leads Table

- [ ] Verificar se todos os 7 campos existem
- [ ] Implementar 4 filtros corretamente
- [ ] Aplicar sorting/ordering por data criação

### Fase 5: Interações

- [ ] Implementar timeline global se não existe
- [ ] Ordenar por date DESC
- [ ] Adicionar ícones direção (↑/↓)

### Fase 6: Follow-ups

- [ ] Criar página/componente se não existe
- [ ] Implementar badges de status (Vencido/Hoje/Agendado)
- [ ] Botão "Concluir" marca interação como `followUpDone`

### Fase 7: Modais (Refine)

- [ ] Lead Modal: verificar todos os campos + timeline inline
- [ ] Interaction Modal: verificar lógica automática de stage update
- [ ] Niche/Solution: verificar CRUD

### Fase 8: Polish

- [ ] Consistência de spacing/padding
- [ ] Hover states em todos os botões/links
- [ ] Verificar responsividade mobile (grid adjusts)
- [ ] Testar seed data (4 leads + 6 interactions)

---

## 📝 Notas Técnicas

### localStorage & Seed

O index.html usa:
- `STORAGE_KEY = 'leadcrm_mvp_v1'`
- Se não existir ou corrompido, carrega `seed()` com 3 nichos, 3 soluções, 4 leads, 6 interações

### Drag & Drop (Kanban)

```javascript
// No index.html usa HTML5 nativo:
- draggable="true" + ondragstart/ondragend/ondrop
- dataTransfer.effectAllowed = 'move'
- classList.add/remove 'dragging' e 'drop-active'
```

React pode usar a mesma abordagem ou biblioteca como `react-beautiful-dnd`.

### Modais

Index.html usa modal global com `#modal-root` e overlay com `onclick` para fechar.
React pode usar componente de Dialog do próprio componentes (radix-ui, headless-ui, etc).

---

## 🚀 Próximas Etapas

1. **Imediato:** Atualizar `globals.css` com novo tema
2. **Curto prazo:** Ajustar Header, Dashboard, componentes principais
3. **Médio prazo:** Implementar/refinar Kanban e Follow-ups
4. **Longo prazo:** Polish, responsividade, acessibilidade

---

**Última atualização:** 2026-09-24
