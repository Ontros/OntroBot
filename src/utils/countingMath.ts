export type CountResult =
    | { value: number; tokens: number }
    | { error: string; lazy?: boolean };

export function evaluateCount(expression: string): CountResult {
    return { error: "not implemented" };
}
