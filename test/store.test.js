import { test } from "node:test";
import assert from "node:assert/strict";
import { addTask, completeTask, formatTasks, normalizePriority, pendingTasks, priorityOf } from "../src/store.js";

test("normalizePriority apara espaços, normaliza Unicode e rejeita maiúsculas", () => {
  assert.equal(normalizePriority(" alta "), "alta");
  const decomposta = "média".normalize("NFD");
  assert.notEqual(decomposta, "média");
  assert.equal(normalizePriority(decomposta), "média");
  assert.throws(() => normalizePriority("ALTA"), /Prioridade inválida/);
});

test("addTask gera ids sequenciais", () => {
  const tasks = addTask(addTask([], "a"), "b");
  assert.deepEqual(tasks.map((t) => t.id), [1, 2]);
});

test("addTask rejeita título vazio", () => {
  assert.throws(() => addTask([], "   "));
});

test("completeTask marca a tarefa como concluída", () => {
  const tasks = completeTask(addTask([], "a"), 1);
  assert.equal(tasks[0].done, true);
});

test("completeTask falha para id inexistente", () => {
  assert.throws(() => completeTask([], 42));
});

test("formatTasks mostra mensagem quando vazio", () => {
  assert.equal(formatTasks([]), "Nenhuma tarefa.");
});

test("addTask sem prioridade usa média", () => {
  const tasks = addTask([], "a");
  assert.equal(tasks[0].priority, "média");
});

test("addTask grava a prioridade explícita", () => {
  const tasks = addTask(addTask([], "a", "alta"), "b", "baixa");
  assert.deepEqual(tasks.map((t) => t.priority), ["alta", "baixa"]);
});

test("addTask aceita 'media' sem acento e grava 'média'", () => {
  const tasks = addTask([], "a", "media");
  assert.equal(tasks[0].priority, "média");
});

test("addTask rejeita prioridade inválida e não altera a lista original", () => {
  const original = addTask([], "a");
  const copia = structuredClone(original);
  assert.throws(() => addTask(original, "b", "urgente"), /Prioridade inválida/);
  assert.deepEqual(original, copia);
});

test("tarefa antiga sem priority vale como média", () => {
  const antiga = { id: 1, title: "Antiga", done: false };
  assert.equal(priorityOf(antiga), "média");
  assert.equal(formatTasks([antiga]), "[ ] 1. (média) Antiga");
});

test("completeTask preserva a prioridade", () => {
  const tasks = completeTask(addTask([], "a", "alta"), 1);
  assert.equal(tasks[0].priority, "alta");
});

test("formatTasks sem opção mostra todas, com prioridade e na ordem de entrada", () => {
  assert.equal(
    formatTasks(listaMista()),
    [
      "[ ] 1. (alta) Comprar pão",
      "[x] 2. (média) Outra",
      "[ ] 3. (baixa) Regar plantas",
    ].join("\n"),
  );
});

function listaMista() {
  let tasks = addTask([], "Comprar pão", "alta");
  tasks = addTask(tasks, "Outra");
  tasks = addTask(tasks, "Regar plantas", "baixa");
  return completeTask(tasks, 2);
}

test("pendingTasks exclui as concluídas", () => {
  const pendentes = pendingTasks(listaMista());
  assert.equal(pendentes.every((t) => !t.done), true);
  assert.equal(pendentes.length, 2);
});

test("pendingTasks mantém as pendentes na ordem original", () => {
  const pendentes = pendingTasks(listaMista());
  assert.deepEqual(pendentes.map((t) => t.id), [1, 3]);
});

test("pendingTasks não altera a lista original", () => {
  const tasks = listaMista();
  const copia = structuredClone(tasks);
  pendingTasks(tasks);
  assert.deepEqual(tasks, copia);
});

test("formatTasks com onlyPending mostra só as pendentes, com prioridade e na ordem", () => {
  assert.equal(
    formatTasks(listaMista(), { onlyPending: true }),
    ["[ ] 1. (alta) Comprar pão", "[ ] 3. (baixa) Regar plantas"].join("\n"),
  );
});

test("formatTasks com onlyPending e todas concluídas mostra mensagem de sem pendentes", () => {
  const tasks = completeTask(addTask([], "a"), 1);
  assert.equal(formatTasks(tasks, { onlyPending: true }), "Nenhuma tarefa pendente.");
});

test("formatTasks com onlyPending e lista vazia mostra 'Nenhuma tarefa.'", () => {
  assert.equal(formatTasks([], { onlyPending: true }), "Nenhuma tarefa.");
});
