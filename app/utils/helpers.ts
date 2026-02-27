export function splitLines(input: string): string[] {
  return input
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function makeId(): string {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
