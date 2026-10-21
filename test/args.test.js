import { test } from "node:test";
import assert from "node:assert/strict";
import { USAGE, parseAddArgs, parseListArgs } from "../src/args.js";

test("parseAddArgs só com título deixa priority indefinida e une as palavras", () => {
  const r = parseAddArgs(["Comprar", "pão"]);
  assert.equal(r.title, "Comprar pão");
  assert.equal(r.priority, undefined);
});

test("parseAddArgs aceita --prioridade no fim do título", () => {
  assert.deepEqual(parseAddArgs(["Comprar", "pão", "--prioridade", "alta"]), {
    title: "Comprar pão",
    priority: "alta",
  });
});

test("parseAddArgs aceita --prioridade no início do título", () => {
  assert.deepEqual(parseAddArgs(["--prioridade", "alta", "Comprar", "pão"]), {
    title: "Comprar pão",
    priority: "alta",
  });
});

test("parseAddArgs aceita --prioridade no meio do título", () => {
  assert.deepEqual(parseAddArgs(["Comprar", "--prioridade", "alta", "pão"]), {
    title: "Comprar pão",
    priority: "alta",
  });
});

test("parseAddArgs rejeita --prioridade sem valor", () => {
  assert.throws(() => parseAddArgs(["Comprar", "--prioridade"]), /exige um valor/);
});

test("parseAddArgs rejeita --prioridade=alta", () => {
  assert.throws(() => parseAddArgs(["Comprar", "--prioridade=alta"]), /não é suportado/);
});

test("parseAddArgs com --prioridade repetida vale a última", () => {
  const r = parseAddArgs(["a", "--prioridade", "alta", "--prioridade", "baixa"]);
  assert.equal(r.priority, "baixa");
  assert.equal(r.title, "a");
});

test("parseAddArgs mantém no título argumentos com -- que não são --prioridade", () => {
  const r = parseAddArgs(["--foo", "bar"]);
  assert.equal(r.title, "--foo bar");
  assert.equal(r.priority, undefined);
});

test("parseListArgs sem argumentos não filtra", () => {
  assert.deepEqual(parseListArgs([]), { onlyPending: false });
});

test("parseListArgs com --pendentes filtra", () => {
  assert.deepEqual(parseListArgs(["--pendentes"]), { onlyPending: true });
});

test("parseListArgs aceita --pendentes repetida", () => {
  assert.deepEqual(parseListArgs(["--pendentes", "--pendentes"]), { onlyPending: true });
});

test("parseListArgs rejeita argumento posicional e mostra o uso", () => {
  assert.throws(() => parseListArgs(["foo"]), (e) => /Opção desconhecida/.test(e.message) && e.message.includes(USAGE));
});

test("parseListArgs rejeita opção desconhecida e mostra o uso", () => {
  assert.throws(() => parseListArgs(["--foo"]), (e) => /Opção desconhecida/.test(e.message) && e.message.includes(USAGE));
});
