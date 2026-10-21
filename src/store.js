import { readFileSync, writeFileSync, existsSync } from "node:fs";

export function load(file) {
  if (!existsSync(file)) return [];
  return JSON.parse(readFileSync(file, "utf8"));
}

export function save(file, tasks) {
  writeFileSync(file, JSON.stringify(tasks, null, 2) + "\n");
}

export function addTask(tasks, title) {
  const text = title.trim();
  if (!text) throw new Error("O título da tarefa não pode ser vazio");
  const id = tasks.reduce((max, t) => Math.max(max, t.id), 0) + 1;
  return [...tasks, { id, title: text, done: false }];
}

export function completeTask(tasks, id) {
  if (!tasks.some((t) => t.id === id)) throw new Error(`Tarefa ${id} não encontrada`);
  return tasks.map((t) => (t.id === id ? { ...t, done: true } : t));
}

export function formatTasks(tasks) {
  if (tasks.length === 0) return "Nenhuma tarefa.";
  return tasks.map((t) => `${t.done ? "[x]" : "[ ]"} ${t.id}. ${t.title}`).join("\n");
}
