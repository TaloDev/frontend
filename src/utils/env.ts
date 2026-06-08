export function getEnv(key: string): string | undefined {
  const env = window.__ENV__

  if (env) {
    const value = env[key]
    // if the value is an unresolved placeholder like "${VAR}", fall through
    if (value && !/^\$\{[A-Z_][A-Z0-9_]*\}$/.test(value)) {
      return value
    }
  }

  return import.meta.env[key]
}
