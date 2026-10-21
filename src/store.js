import { readFileSync, writeFileSync, existsSync } from "node:fs";

export function load(file) {
  if (!existsSync(file)) return [];
  return JSON.parse(readFileSync(file, "utf8"));
}

export function save(file, tasks) {
  writeFileSync(file, JSON.stringify(tasks, null, 2) + "\n");
}

export const PRIORITIES = ["alta", "média", "baixa"];
export const DEFAULT_PRIORITY = "média";

// Aceita "media" sem acento como sinônimo de "média"; o valor gravado é sempre o canônico.
export function normalizePriority(value) {
  const text = String(value).trim().normalize("NFC");
  const priority = text === "media" ? "média" : text;
  if (!PRIORITIES.includes(priority)) {
    throw new Error(`Prioridade inválida: "${value}". Use alta, média ou baixa`);
  }
  return priority;
}

// Tarefas gravadas antes da prioridade existir não têm o campo e valem como média.
export function priorityOf(task) {
  return task.priority ?? DEFAULT_PRIORITY;
}

export function addTask(tasks, title, priority = DEFAULT_PRIORITY) {
  const text = title.trim();
  if (!text) throw new Error("O título da tarefa não pode ser vazio");
  const level = normalizePriority(priority);
  const id = tasks.reduce((max, t) => Math.max(max, t.id), 0) + 1;
  return [...tasks, { id, title: text, done: false, priority: level }];
}

export function completeTask(tasks, id) {
  if (!tasks.some((t) => t.id === id)) throw new Error(`Tarefa ${id} não encontrada`);
  return tasks.map((t) => (t.id === id ? { ...t, done: true } : t));
}

export function pendingTasks(tasks) {
  return tasks.filter((t) => !t.done);
}

export function formatTasks(tasks, { onlyPending = false } = {}) {
  if (tasks.length === 0) return "Nenhuma tarefa.";
  const shown = onlyPending ? pendingTasks(tasks) : tasks;
  if (shown.length === 0) return "Nenhuma tarefa pendente.";
  return shown
    .map((t) => `${t.done ? "[x]" : "[ ]"} ${t.id}. (${priorityOf(t)}) ${t.title}`)
    .join("\n");
}
