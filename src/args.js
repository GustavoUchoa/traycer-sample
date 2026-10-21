export const USAGE =
  "Uso: todo [add <título> [--prioridade <alta|média|baixa>] | done <id> | list [--pendentes]]";

export function parseAddArgs(args) {
  const words = [];
  let priority;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--prioridade") {
      if (i + 1 >= args.length) throw new Error("A opção --prioridade exige um valor: alta, média ou baixa");
      priority = args[++i];
    } else if (args[i].startsWith("--prioridade=")) {
      // A forma com "=" não é suportada; rejeitar evita que ela vire parte do título.
      throw new Error("Use --prioridade <valor>, com espaço: --prioridade=<valor> não é suportado");
    } else {
      words.push(args[i]);
    }
  }
  return { title: words.join(" "), priority };
}

export function parseListArgs(args) {
  for (const arg of args) {
    if (arg !== "--pendentes") throw new Error(`Opção desconhecida: ${arg}\n${USAGE}`);
  }
  return { onlyPending: args.includes("--pendentes") };
}
