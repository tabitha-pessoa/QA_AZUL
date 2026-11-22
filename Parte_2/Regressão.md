# Parte 2 – Pensamento em Regressão

**Sistema:** CliniSys  
**Cenário:** Nova funcionalidade permite agendar consultas com médicos de outras unidades.

## Objetivo

Garantir que a nova funcionalidade de agendamento entre unidades funcione corretamente e que as alterações realizadas não comprometam funcionalidades existentes do sistema.

## 1. Áreas impactadas que precisam de testes de regressão

A inclusão de médicos de outras unidades pode impactar diretamente o fluxo de agendamento e, indiretamente, outras funcionalidades que utilizam informações de médicos, pacientes, consultas e unidades.

| Área impactada | O que deve ser validado |
|---|---|
| Cadastro de pacientes | Pacientes continuam podendo ser cadastrados e associados corretamente aos agendamentos. |
| Cadastro de médicos | Médicos permanecem vinculados às suas unidades de origem e podem ser identificados corretamente por outras unidades. |
| Cadastro de especialidades | Especialidades continuam associadas aos médicos corretos e disponíveis durante o agendamento. |
| Agendamento de consultas | É possível agendar consultas com médicos da própria unidade e de outras unidades, respeitando as regras de negócio. |
| Disponibilidade de agenda | Os horários disponíveis são apresentados corretamente e não permitem conflitos de agendamento. |
| Cancelamento de consultas | Consultas realizadas entre unidades podem ser canceladas corretamente, com atualização da disponibilidade da agenda. |
| Prontuários | Os atendimentos permanecem associados ao paciente e ao médico corretos, respeitando as permissões de acesso. |
| Histórico de atendimentos | As consultas são apresentadas corretamente no histórico do paciente, incluindo médico e unidade relacionados ao atendimento. |
| Emissão de relatórios | Os relatórios apresentam corretamente as consultas, os médicos e as unidades envolvidas, sem omissões ou duplicidades. |
| Permissões de acesso | Os usuários conseguem realizar agendamentos entre unidades somente quando possuem autorização. |

## 2. Casos de teste de regressão – Gherkin

Os cenários abaixo cobrem os principais fluxos existentes e os novos comportamentos relacionados ao agendamento entre unidades.

### Feature: Consulta de pacientes

## TC04 - Consultar pacientes cadastrados
  Scenario: Consultar pacientes cadastrados
    Given que o usuário esteja autenticado no sistema
    And existam pacientes cadastrados
    When acessar o menu "Pacientes"
    Then o sistema deve exibir a lista de pacientes cadastrados
    And os dados dos pacientes devem ser apresentados corretamente

### Feature: Cadastro de médicos e especialidades
## TC05 - Cadastro de médicos e especialidades
  Scenario: Consultar médicos cadastrados por unidade
    Given que o usuário esteja autenticado no sistema
    And existam médicos cadastrados em diferentes unidades
    When acessar a consulta de médicos
    And selecionar uma unidade
    Then o sistema deve exibir os médicos vinculados à unidade selecionada

## TC06 - Consultar especialidades dos médicos
  Scenario: Consultar especialidades dos médicos
    Given que o usuário esteja autenticado no sistema
    And existam médicos com especialidades cadastradas
    When consultar os dados de um médico
    Then o sistema deve apresentar as especialidades associadas ao médico

### Feature: Agendamento de consultas entre unidades

## TC07 - Agendar consulta com médico da própria unidade
  Scenario: Agendar consulta com médico da própria unidade
    Given que o usuário esteja autenticado no sistema
    And exista um paciente cadastrado
    And exista um médico vinculado à unidade do usuário
    And o médico possua horário disponível
    When acessar o menu "Agenda"
    And selecionar uma data e um horário disponíveis
    And selecionar o paciente
    And selecionar o médico
    And confirmar o agendamento
    Then o sistema deve criar o agendamento com sucesso
    And a consulta deve ser exibida na agenda do médico

## TC08 - Agendar consulta com médico de outra unidade
  Scenario: Agendar consulta com médico de outra unidade
    Given que o usuário esteja autenticado no sistema
    And possua permissão para realizar agendamentos entre unidades
    And exista um paciente cadastrado
    And exista um médico vinculado a outra unidade
    And o médico possua horário disponível
    When acessar o menu "Agenda"
    And selecionar a opção de agendamento entre unidades
    And selecionar a unidade de origem do médico
    And selecionar o médico e o horário disponíveis
    And selecionar o paciente
    And confirmar o agendamento
    Then o sistema deve criar o agendamento com sucesso
    And a consulta deve estar associada ao paciente selecionado
    And a consulta deve estar associada ao médico e à unidade corretos
    And o agendamento deve ser exibido na agenda correspondente

## TC09 - Consultar disponibilidade de médicos de outras unidades
  Scenario: Consultar disponibilidade de médicos de outras unidades
    Given que o usuário esteja autenticado no sistema
    And possua permissão para consultar agendas de outras unidades
    And exista um médico cadastrado em outra unidade
    When consultar a agenda desse médico
    Then o sistema deve apresentar os horários disponíveis corretamente
    And não deve apresentar horários já ocupados como disponíveis

## TC10 - Impedir agendamento entre unidades sem permissão
  Scenario: Impedir agendamento entre unidades sem permissão
    Given que o usuário esteja autenticado no sistema
    And não possua permissão para realizar agendamentos entre unidades
    When tentar agendar uma consulta com um médico de outra unidade
    Then o sistema deve impedir a operação
    And deve apresentar uma mensagem informando a restrição de acesso


### Feature: Cancelamento de consultas

## TC11 - Cancelar consulta com médico da própria unidade
  Scenario: Cancelar consulta com médico da própria unidade
    Given que o usuário esteja autenticado no sistema
    And exista uma consulta agendada com médico da própria unidade
    When acessar a agenda
    And localizar a consulta
    And selecionar a opção "Cancelar"
    And confirmar o cancelamento
    Then o sistema deve cancelar a consulta
    And a disponibilidade do horário deve ser atualizada conforme a regra de negócio

## TC12 - Cancelar consulta com médico de outra unidade
  Scenario: Cancelar consulta com médico de outra unidade
    Given que o usuário esteja autenticado no sistema
    And possua permissão para cancelar consultas entre unidades
    And exista uma consulta agendada com médico de outra unidade
    When acessar os detalhes da consulta
    And selecionar a opção "Cancelar"
    And confirmar o cancelamento
    Then o sistema deve cancelar a consulta
    And a agenda do médico deve ser atualizada corretamente


### Feature: Prontuário e histórico de atendimentos

## TC13 - Consultar prontuário do paciente
  Scenario: Consultar prontuário do paciente
    Given que o usuário esteja autenticado no sistema
    And possua permissão para acessar o prontuário
    And exista um paciente com atendimento registrado
    When acessar o prontuário do paciente
    Then o sistema deve apresentar os dados do paciente corretamente
    And deve apresentar as informações do atendimento associadas ao médico responsável

## TC14 - Consultar histórico de atendimentos do paciente
  Scenario: Consultar histórico de atendimentos do paciente
    Given que o usuário esteja autenticado no sistema
    And exista um paciente com atendimentos registrados em diferentes unidades
    When acessar o histórico de atendimentos do paciente
    Then o sistema deve apresentar os atendimentos registrados
    And deve identificar corretamente as datas, os médicos e as unidades correspondentes


### Feature: Emissão de relatórios

## TC14 - Emitir relatório de consultas por unidade
  Scenario: Emitir relatório de consultas por unidade
    Given que o usuário esteja autenticado no sistema
    And existam consultas registradas em diferentes unidades
    When acessar o módulo de relatórios
    And selecionar o relatório de consultas por unidade
    And informar a unidade desejada
    And solicitar a emissão do relatório
    Then o sistema deve apresentar as consultas relacionadas à unidade selecionada
    And os dados devem corresponder aos agendamentos registrados

## TC15 - Emitir relatório de consultas por médico
  Scenario: Emitir relatório de consultas por médico
    Given que o usuário esteja autenticado no sistema
    And existam consultas agendadas para diferentes médicos
    When acessar o módulo de relatórios
    And selecionar o relatório de consultas por médico
    And informar o médico desejado
    And solicitar a emissão do relatório
    Then o sistema deve apresentar as consultas associadas ao médico selecionado

## TC16 - Emitir relatório incluindo consultas entre unidades
  Scenario: Emitir relatório incluindo consultas entre unidades
    Given que o usuário esteja autenticado no sistema
    And existam consultas agendadas com médicos de outras unidades
    When acessar o módulo de relatórios
    And selecionar o relatório de consultas
    And aplicar os filtros desejados
    And solicitar a emissão do relatório
    Then o sistema deve apresentar corretamente as consultas entre unidades
    And deve identificar os médicos e as unidades correspondentes
    And não deve apresentar registros duplicados ou omitir consultas


## 3. Matriz de impacto

A matriz relaciona a alteração implementada às funcionalidades que podem sofrer impacto e orienta a priorização dos testes.

| Funcionalidade | Tipo de impacto | Prioridade de regressão | Justificativa |
|---|---|---|---|
| Cadastro de pacientes | Indireto | Média | O cadastro é utilizado no fluxo de agendamento. |
| Cadastro de médicos | Direto | Alta | A nova funcionalidade utiliza médicos vinculados a diferentes unidades. |
| Especialidades | Direto | Alta | A seleção do médico pode depender da especialidade cadastrada. |
| Agendamento | Direto | Crítica | É a funcionalidade principal alterada. |
| Disponibilidade de agenda | Direto | Crítica | É necessário evitar conflitos entre agendamentos e unidades. |
| Cancelamento | Direto | Alta | O cancelamento deve atualizar corretamente a agenda envolvida. |
| Prontuários | Indireto | Alta | Os dados do atendimento devem permanecer vinculados ao paciente e ao médico corretos. |
| Histórico de atendimentos | Indireto | Alta | O histórico deve refletir corretamente os atendimentos realizados em outras unidades. |
| Relatórios | Direto | Alta | Os relatórios devem considerar corretamente a unidade e o médico relacionados à consulta. |
| Permissões de acesso | Direto | Alta | O acesso ao agendamento entre unidades deve respeitar as regras de autorização. |

**Legenda de prioridade:**

- **Crítica:** fluxo essencial para a nova funcionalidade ou risco elevado de comprometer o agendamento.
- **Alta:** funcionalidade importante para a integridade dos dados e continuidade do atendimento.
- **Média:** funcionalidade de suporte que também deve ser preservada.

## 4. Reutilização dos casos de teste da Parte 1

Os casos de teste manuais elaborados na Parte 1 podem ser reutilizados como base para a regressão, com complementação dos cenários necessários para a nova funcionalidade.

| Caso de teste da Parte 1 | Reutilização na regressão |
|---|---|
| TC01 – Adicionar um novo paciente | Reutilizar o cenário de cadastro de paciente. |
| TC02 – Criar um agendamento | Reutilizar e ampliar para validar agendamentos com médicos da própria unidade e de outras unidades. |
| TC03 – Excluir um agendamento | Adaptar para validar o cancelamento de consultas nas duas situações. |

## 5. Estratégia de execução dos testes de regressão

1. **Análise de impacto:** identificar as funcionalidades, integrações, regras de negócio e permissões que podem ser afetadas pela alteração.
2. **Priorização:** executar primeiro os testes relacionados ao agendamento, à disponibilidade de horários e à associação entre médico e unidade.
3. **Execução:** reutilizar os casos de teste existentes da Parte 1 e executar os novos cenários específicos de agendamento entre unidades.
4. **Validação de dados:** verificar a consistência das informações de pacientes, médicos, unidades e consultas.
5. **Validação dos relatórios:** garantir que os relatórios reflitam corretamente os agendamentos e atendimentos realizados entre unidades.
6. **Registro de defeitos:** documentar as falhas encontradas com passos para reprodução, evidências, resultado esperado, resultado obtido e severidade.
7. **Reteste e regressão:** após as correções, repetir os cenários que apresentaram falhas e executar novamente os testes das funcionalidades impactadas.

## 6. Conclusão

A estratégia de testes de regressão foi definida considerando os possíveis impactos da nova funcionalidade de agendamento de consultas entre diferentes unidades.

Foram identificadas funcionalidades diretamente relacionadas à alteração, como cadastro de médicos, especialidades, agendamento, disponibilidade de horários, cancelamento e permissões de acesso, além de funcionalidades indiretamente impactadas, como prontuários, histórico de atendimentos e emissão de relatórios.

Os cenários foram descritos em Gherkin para padronizar a documentação e facilitar o entendimento dos comportamentos esperados. A execução será priorizada conforme o impacto e o risco para o negócio, garantindo que a nova funcionalidade opere corretamente sem comprometer os fluxos já existentes.
