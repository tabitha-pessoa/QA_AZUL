# Parte 4 - Plano e automacao de teste de carga

## Objetivo

Avaliar o fluxo de autenticacao, acesso a agenda e criacao de agendamento sob concorrencia, tomando como referencia os passos ja cobertos pelos testes POM de `Parte_3`.

**Este material foi criado sem executar testes nem enviar requisicoes.** A automacao incluida e um scaffold k6 restrito a `localhost`/`127.0.0.1`; ela recusa destinos externos, incluindo a homologacao compartilhada.

## Ferramenta e estrategia

- **Ferramenta:** k6, adequada para exercitar endpoints HTTP com muitas sessoes virtuais sem iniciar um navegador completo para cada usuario.
- **Jornada por usuario:** login -> consulta da agenda para a data configurada -> criacao de um agendamento -> verificacao da resposta -> limpeza do registro pela API.
- **Concorrencia:** 100 VUs, uma jornada por VU. Cada VU usa uma conta de teste e uma massa de agendamento distintas.
- **Janela:** executar somente entre 08h e 10h apos aprovacao formal do responsavel pelo ambiente.
- **Limpeza:** a automacao local exige um endpoint de exclusao e remove cada agendamento criado. A equipe deve confirmar que o endpoint e compativel e que a exclusao nao aciona efeitos colaterais.

Os testes Playwright em `Parte_3` validam o fluxo da interface. Eles nao revelam o contrato HTTP do backend; portanto, os caminhos, formatos dos payloads, autenticacao e identificador de exclusao do `config.json` precisam ser preenchidos a partir de uma especificacao/API autorizada. Os valores de exemplo sao placeholders e nao representam endpoints reais do App Health.

## Portao de autorizacao antes de qualquer teste real

Nao apontar a automacao para homologacao compartilhada ou producao. Antes de planejar um teste em um ambiente dedicado, registrar:

1. autorizacao explicita do responsavel pelo sistema;
2. URL e ambiente dedicados, isolados de usuarios e dados reais;
3. VUs, ramp-up, duracao, janela e limites de taxa aprovados;
4. contas e pacientes de teste, sem dados pessoais reais;
5. contrato dos endpoints e comportamento de sessao;
6. procedimento de limpeza e pessoa responsavel por acompanhar o teste;
7. criterio de parada (erros, latencia, saturacao ou impacto no servico).

Sem esses itens, a automacao permanece bloqueada. O guard do script tambem limita a URL a loopback, como protecao adicional.

## Preparacao local

1. Instalar k6 conforme o procedimento aprovado pela equipe.
2. Copiar `k6\config.example.json` para `k6\config.json` e substituir os placeholders pelo contrato de uma API **local**.
3. Copiar `k6\users.example.csv` para `k6\users.csv` e fornecer 100 contas ficticias/de teste com senhas, nomes, telefones, datas e horarios unicos. Nao salvar credenciais reais no repositorio.
4. Manter `baseUrl` em `http://localhost` ou `http://127.0.0.1`. O script rejeita outros hosts.
5. Criar a pasta `results` antes da execucao, se for salvar o resumo.

Para executar futuramente no ambiente local, a partir de `Parte_4`:

```powershell
k6 run --summary-export .\results\summary.json .\k6\appointment-load.js
```

**O comando acima nao foi executado.** O exemplo nao funcionara ate que o contrato local esteja preenchido e existam 100 linhas validas de usuarios. O script e limitado a no maximo 100 VUs e uma jornada por VU.

## Resultados a coletar

Registrar a data/hora, versao da aplicacao, configuracao do ambiente, carga aprovada e os resultados abaixo. k6 reporta duracao media e percentis; a automacao tambem separa login, consulta da agenda, criacao e limpeza.

| Indicador | Como interpretar |
|---|---|
| Tempo medio por etapa | Media do tempo de resposta de login, agenda, criacao e limpeza. Comparar entre etapas; a media sozinha pode esconder caudas longas. |
| p95/p99 por etapa | Mostra a experiencia dos usuarios mais lentos e ajuda a identificar degradacao sob concorrencia. |
| Taxa de erro HTTP | Requisicoes nao-2xx ou falhas de transporte divididas pelas requisicoes. Separar por endpoint. |
| Jornadas concluidas/falhas | Quantidade de VUs que completaram a jornada e criaram/removeram o agendamento. |
| Gargalo | Correlacionar a etapa mais lenta com CPU/memoria, pool de conexoes, banco, logs e metricas do servidor. Latencia alta de login aponta para autenticacao; agenda para consulta; criacao para validacao/escrita/transacao. |

Nao ha SLO/limites de aceitacao definidos neste exercicio. O time de engenharia deve aprovar os limites de latencia e erro antes do teste; nao interpretar este plano como resultado medido.

## Modelo de relatorio

- **Status:** nao executado
- **Ambiente/versao:**
- **Autorizacao e janela:**
- **Carga aprovada (VUs/duracao):**
- **Contas e massa de teste:**
- **Media / p95 / p99 por etapa:**
- **Taxa de erro por etapa:**
- **Jornadas concluidas / falhas:**
- **Limite ou gargalo observado:**
- **Limpeza confirmada:**
- **Interpretacao e recomendacoes para engenharia:**
- **Evidencias (resumo k6, dashboards, logs):**
