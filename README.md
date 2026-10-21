# traycer-sample

Pequeno CLI de tarefas, sem dependências, usado para testar os fluxos do Traycer
(planejamento, tickets, implementação delegada e revisão).

## Uso

```sh
npm start -- add Comprar pão
npm start -- add Pagar conta --prioridade alta
npm start -- list
npm start -- list --pendentes
npm start -- done 1
```

Toda tarefa tem uma prioridade: `alta`, `média` (também aceita como `media`) ou
`baixa`. Sem `--prioridade`, a tarefa é criada como `média`; tarefas gravadas antes
da prioridade existir também valem como `média`. O `list` mostra a prioridade em
cada linha, sem mudar a ordem:

```
[ ] 1. (média) Comprar pão
[ ] 2. (alta) Pagar conta
```

Com `--pendentes`, o `list` mostra só as tarefas ainda não concluídas, no mesmo
formato e na mesma ordem. Se todas estiverem concluídas, imprime
`Nenhuma tarefa pendente.`

As tarefas ficam em `tasks.json` (ou no arquivo indicado em `TODO_FILE`).

## Testes

```sh
npm test
```

Requer Node 20 ou superior.
