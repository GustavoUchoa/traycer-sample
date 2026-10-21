#!/usr/bin/env node
import { load, save, addTask, completeTask, formatTasks } from "./store.js";

const FILE = process.env.TODO_FILE ?? "tasks.json";
const [command, ...args] = process.argv.slice(2);

try {
  let tasks = load(FILE);
  switch (command) {
    case "add":
      tasks = addTask(tasks, args.join(" "));
      save(FILE, tasks);
      console.log(`Adicionada: ${tasks.at(-1).title}`);
      break;
    case "done":
      tasks = completeTask(tasks, Number(args[0]));
      save(FILE, tasks);
      console.log(`Concluída: ${args[0]}`);
      break;
    case "list":
    case undefined:
      console.log(formatTasks(tasks));
      break;
    default:
      console.error(`Comando desconhecido: ${command}\nUso: todo [add <título> | done <id> | list]`);
      process.exitCode = 1;
  }
} catch (err) {
  console.error(err.message);
  process.exitCode = 1;
}
