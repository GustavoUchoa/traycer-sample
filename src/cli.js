#!/usr/bin/env node
import { load, save, addTask, completeTask, formatTasks } from "./store.js";
import { USAGE, parseAddArgs, parseListArgs } from "./args.js";

const FILE = process.env.TODO_FILE ?? "tasks.json";
const [command, ...args] = process.argv.slice(2);

try {
  let tasks = load(FILE);
  switch (command) {
    case "add": {
      const { title, priority } = parseAddArgs(args);
      tasks = addTask(tasks, title, priority);
      save(FILE, tasks);
      console.log(`Adicionada: ${tasks.at(-1).title}`);
      break;
    }
    case "done":
      tasks = completeTask(tasks, Number(args[0]));
      save(FILE, tasks);
      console.log(`Concluída: ${args[0]}`);
      break;
    case "list":
    case undefined:
      console.log(formatTasks(tasks, parseListArgs(args)));
      break;
    default:
      console.error(`Comando desconhecido: ${command}\n${USAGE}`);
      process.exitCode = 1;
  }
} catch (err) {
  console.error(err.message);
  process.exitCode = 1;
}
