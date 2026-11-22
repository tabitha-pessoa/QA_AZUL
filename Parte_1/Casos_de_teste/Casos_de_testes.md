## TC01 - Adicionar um novo paciente
Feature: Gerenciamento de pacientes

  Scenario: Adicionar um novo paciente com sucesso
    Given que o usuário esteja autenticado no sistema
    And possua permissão para cadastrar pacientes
    When acessar o menu "Pacientes"
    And clicar no botão "Mais (+)"
    And preencher todos os campos obrigatórios
    And clicar no botão "Salvar"
    Then o sistema deve cadastrar o novo paciente com sucesso
    And o paciente deve ser exibido na lista de pacientes

## TC02 - Criar um agendamento
Feature: Gerenciamento de agendamentos

  Scenario: Criar um agendamento para um paciente cadastrado
    Given que o usuário esteja autenticado no sistema
    And exista um paciente previamente cadastrado
    When acessar o menu "Agenda"
    And selecionar uma data e um horário disponíveis
    And clicar no botão "Mais (+)"
    And selecionar o paciente desejado
    And clicar no botão "Salvar"
    Then o sistema deve criar o agendamento com sucesso
    And o agendamento deve ser exibido na agenda
    And deve estar associado ao paciente selecionado

## TC03 - Excluir um agendamento

Feature: Gerenciamento de agendamentos

  Scenario: Excluir um agendamento existente
    Given que o usuário esteja autenticado no sistema
    And exista um agendamento previamente cadastrado
    When acessar o menu "Agenda"
    And selecionar a data e o horário do agendamento
    And abrir os detalhes do agendamento com dois cliques
    And clicar no botão "Excluir"
    Then o sistema deve excluir o agendamento com sucesso
    And o agendamento não deve mais ser exibido na agenda