# 🧪 Desafio Prático para QA – Sistema de Gestão de Clínicas

Este repositório contém o desafio prático para profissionais de QA, com foco em testes manuais, automatizados, de regressão e de performance. O cenário é baseado no sistema **CliniSys**, voltado para a gestão de clínicas médicas.

---

## 🩺 Contexto

Você está atuando como QA em um time que desenvolve o sistema **CliniSys**, que oferece funcionalidades como:

- Cadastro e edição de pacientes
- Agendamento e cancelamento de consultas
- Cadastro de médicos e especialidades
- Prontuários e histórico de atendimentos
- Emissão de relatórios

A missão é validar uma nova versão da aplicação, com mudanças no fluxo de **agendamento de consultas** e **emissão de relatórios**.

---

## ✅ Parte 1 – Testes Manuais

**Objetivo:** Avaliar os principais fluxos e impactos da nova versão.

### Tarefas:

1. Escolher **3 fluxos principais** do sistema.
2. Criar **casos de teste manuais** (em tabela ou formato Gherkin: Given/When/Then).
3. Reportar **5 bugs** com:
   - Passos para reprodução
   - Evidência (print ou descrição)
   - Severidade (crítico, alto, médio, baixo)

---

## 🔁 Parte 2 – Pensamento em Regressão

**Objetivo:** Garantir que alterações recentes não quebraram funcionalidades anteriores.

### Cenário:
Nova funcionalidade permite **marcar consultas com médicos de outras unidades**.

### Tarefas:

1. Listar as **áreas impactadas** que precisam de testes de regressão.
2. Criar um **checklist de regressão** ou **matriz de impacto**.
3. Reutilizar testes manuais da Parte 1, se desejar.

---

## 🤖 Parte 3 – Testes Automatizados

**Objetivo:** Automatizar um fluxo crítico com foco em estabilidade.

### Tarefas:

1. Automatizar pelo menos **3 testes end-to-end** (preferência: agendamento de consultas).
2. Utilizar o **Playwright** ou outra ferramenta de sua escolha.
3. Estruturar bem o projeto (pastas, comandos, boas práticas).
4. Utilizar **asserts claros** e **seletores robustos**.
5. Compartilhar o repositório (GitLab ou GitHub).

---

## ⚙️ Parte 4 – Testes de Carga / Performance

**Objetivo:** Avaliar a resiliência do sistema sob múltiplos acessos simultâneos.

### Cenário:
Simular pico de acessos entre **8h e 10h**, com centenas de usuários simultâneos acessando o módulo de agendamento.

### Tarefas:

1. Escolher ferramenta de carga (ex: **k6**, **JMeter**, **Artillery**, etc).
2. Criar cenário com:
   - 100 usuários acessando o **endpoint de login** e, em seguida, a **agenda**
   - Cada usuário realiza um agendamento
3. Apresentar resultados com análise:
   - **Tempo médio de resposta**
   - **Taxa de erro** (se houver)
   - **Ponto de gargalo ou limite observado**
4. Explicar a **interpretação dos resultados** para reportar ao time de engenharia.

---

## 📎 Observações

- Documente suas decisões e estratégias no repositório.
- Use este `README.md` para orientar o desenvolvimento e submissão do desafio.

---

