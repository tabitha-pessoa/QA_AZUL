## BUGS encontrados nos testes

## BUG01 - É possivel relizar agendamentos com agenda bloqueada
# Passos:
1 - Abrir a funcionalidade Agenda
2 - Selecionar um dia em que a agenda está bloqueada
3 - Clicar no botão mais
4 - Selecionar um paciente cadastrado e o dia que está bloqueada a agenda
5 - Clicar em agendar

Resultado Obtido: Agendamento é feito mesmo com a agenda bloqueada
Evidencia: Parte_1\Bugs\Bug1_Bloqueio_Agenda.mp4
Video anexado com nome de BUGS_1-2.7z

## BUG02 - Erro ao ativar o portal do Paciente
# Passos:
1 - Abrir a funcionalidade Pacientes
2 - Selecionar um paciente cadastrado 
3 - Clicar no campo portal do paciente e mudar de inativado para ativado
4 - Clicar em Salvar

Resultado Obtido: Mensagem de erro: "Erro ao autalizar cadastro"
Evidencia: Parte_1\Bugs\Bug2_Ativar_portal_paciente.mp4
Video anexado com nome de BUGS_1-2.7z

## BUG03 - É possivel realizar agendamento no passado
# Passos:
1 - Abrir a funcionalidade Agenda
2 - Selecionar uma data no passado
3 - Clicar no botão mais
4 - Selecionar um paciente cadastrado e data no passado
5 - Clicar em agendar

Resultado Obtido: Agendamento é feito mesmo no passado
Evidencia: Parte_1\Bugs\Bug3_AgendamentoPassado.mp4
Video anexado com nome de BUGS_3-4-5.7z

## BUG04 - É possivel realizar agendamento duplicado para o mesmo paciente
# Passos:
1 - Abrir a funcionalidade Agenda
2 - Selecionar uma data e hora valida
3 - Clicar no botão mais
4 - Selecionar um paciente cadastrado
5 - Clicar no botão mais
6 - Selecionar o mesmo paciente e mesma data e hora do agendamento anterior
5 - Clicar em agendar

Resultado Obtido: Agendamento é feito duas vezes para o mesmo paciente
Evidencia: Parte_1\Bugs\Bug4_2agendamentos_paciente.mp4
Video anexado com nome de BUGS_3-4-5.7z

## BUG05 - É possivel realizar Bloqueio/Desbloqueio em dia que já está Bloqueado/Desbloqueado
# Passos:
1 - Abrir a funcionalidade Agenda
2 - Selecionar uma data que a agenda esteja bloqueada
3 - Clicar no icone Bloquear Agenda
4 - Preencher os campos com data que a agenda esteja bloqueada
5 - Clicar Continuar

Resultado Obtido: O sistema realiza o bloqueio em um dia que ja estava bloqueado
OBS: O mesmo ocorre com a funcionalidade desbleio em dia desbloqueado
Evidencia: Parte_1\Bugs\BUG5_bloqueio_desbloqueio.mp4
Video anexado com nome de BUGS_3-4-5.7z
