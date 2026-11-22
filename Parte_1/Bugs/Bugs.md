## BUGS encontrados nos testes

## BUG01 - É possivel relizar agendamentos com agenda bloqueada
# Passos:
1 - Abrir a funcionalidade Agenda<br>
2 - Selecionar um dia em que a agenda está bloqueada<br>
3 - Clicar no botão mais<br>
4 - Selecionar um paciente cadastrado e o dia que está bloqueada a agenda<br>
5 - Clicar em agendar<br>

Resultado Obtido: Agendamento é feito mesmo com a agenda bloqueada<br>
Evidencia: Parte_1\Bugs\Bug1_Bloqueio_Agenda.mp4<br>
Video anexado com nome de BUGS_1-2.7z<br>

## BUG02 - Erro ao ativar o portal do Paciente
# Passos:
1 - Abrir a funcionalidade Pacientes<br>
2 - Selecionar um paciente cadastrado<br>
3 - Clicar no campo portal do paciente e mudar de inativado para ativado<br>
4 - Clicar em Salvar<br>

Resultado Obtido: Mensagem de erro: "Erro ao autalizar cadastro"<br>
Evidencia: Parte_1\Bugs\Bug2_Ativar_portal_paciente.mp4<br>
Video anexado com nome de BUGS_1-2.7z<br>

## BUG03 - É possivel realizar agendamento no passado
# Passos:
1 - Abrir a funcionalidade Agenda<br>
2 - Selecionar uma data no passado<br>
3 - Clicar no botão mais<br>
4 - Selecionar um paciente cadastrado e data no passado<br>
5 - Clicar em agendar<br>

Resultado Obtido: Agendamento é feito mesmo no passado<br>
Evidencia: Parte_1\Bugs\Bug3_AgendamentoPassado.mp4<br>
Video anexado com nome de BUGS_3-4-5.7z<br>

## BUG04 - É possivel realizar agendamento duplicado para o mesmo paciente
# Passos:
1 - Abrir a funcionalidade Agenda<br>
2 - Selecionar uma data e hora valida<br>
3 - Clicar no botão mais<br>
4 - Selecionar um paciente cadastrado<br>
5 - Clicar no botão mais<br>
6 - Selecionar o mesmo paciente e mesma data e hora do agendamento anterior<br>
5 - Clicar em agendar<br>

Resultado Obtido: Agendamento é feito duas vezes para o mesmo paciente<br>
Evidencia: Parte_1\Bugs\Bug4_2agendamentos_paciente.mp4<br>
Video anexado com nome de BUGS_3-4-5.7z<br>

## BUG05 - É possivel realizar Bloqueio/Desbloqueio em dia que já está Bloqueado/Desbloqueado
# Passos:
1 - Abrir a funcionalidade Agenda<br>
2 - Selecionar uma data que a agenda esteja bloqueada<br>
3 - Clicar no icone Bloquear Agenda<br>
4 - Preencher os campos com data que a agenda esteja bloqueada<br>
5 - Clicar Continuar<br>

Resultado Obtido: O sistema realiza o bloqueio em um dia que ja estava bloqueado<br>
OBS: O mesmo ocorre com a funcionalidade desbleio em dia desbloqueado<br>
Evidencia: Parte_1\Bugs\BUG5_bloqueio_desbloqueio.mp4<br>
Video anexado com nome de BUGS_3-4-5.7z<br>
