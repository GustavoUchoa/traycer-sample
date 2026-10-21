import { test } from "node:test";
import assert from "node:assert/strict";
import { addTask, completeTask, formatTasks } from "../src/store.js";

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
