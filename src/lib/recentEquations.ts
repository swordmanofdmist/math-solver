const RECENT_LIMIT = 3;

export function readRecentEquations(storageKey: string) {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const savedEquations = window.localStorage.getItem(storageKey);
    const parsedEquations = savedEquations ? JSON.parse(savedEquations) : [];

    if (!Array.isArray(parsedEquations)) {
      return [];
    }

    return parsedEquations
      .filter((equation): equation is string => typeof equation === "string")
      .slice(0, RECENT_LIMIT);
  } catch {
    return [];
  }
}

export function rememberRecentEquation(storageKey: string, equation: string) {
  const trimmedEquation = equation.trim();

  if (!trimmedEquation) {
    return readRecentEquations(storageKey);
  }

  const recentEquations = readRecentEquations(storageKey);
  const nextEquations = [
    trimmedEquation,
    ...recentEquations.filter((recentEquation) => recentEquation !== trimmedEquation),
  ].slice(0, RECENT_LIMIT);

  if (typeof window !== "undefined") {
    window.localStorage.setItem(storageKey, JSON.stringify(nextEquations));
  }

  return nextEquations;
}
