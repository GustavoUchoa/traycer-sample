# traycer-sample

Pequeno CLI de tarefas, sem dependências, usado para testar os fluxos do Traycer
(planejamento, tickets, implementação delegada e revisão).

## Uso

```sh
npm start -- add Comprar pão
npm start -- list
npm start -- done 1
```

As tarefas ficam em `tasks.json` (ou no arquivo indicado em `TODO_FILE`).

## Testes

```sh
npm test
```

Requer Node 20 ou superior.
