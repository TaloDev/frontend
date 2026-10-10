# Plan: Expand JSON-encoded save values into nodes

## Goal

Decode JSON-in-string `value` fields before the node walker runs, so saves that
store their real data as a JSON string render as a subtree instead of one flat
text row.

## Why

`useNodeGraph` and `useLinearNodeGraph` treat strings as terminal — neither ever
parses a string as JSON. Measured against production `game_save` (20,999 rows):

- 265,716 `value` fields across SDK saves: **265,686 are JSON strings, 0 are
  objects or arrays.** The walker can never branch on save data.
- 93.89% of saves are `JSON_DEPTH = 6` — the fixed envelope
  `content → objects[] → [i] → data[] → [j] → {key,value,type}`. Every SDK save
  renders the same skeleton; the player's data only appears as text inside
  `value` rows.
- **6,888 SDK saves (32.8%) / 47 of 128 SDK games** hold a JSON object or array
  inside a `value` string. 87,096 values (32.8%) become subtrees after parsing.
- Today only 885 saves (4.2%) / 43 games render a branching tree. After:
  **7,752 saves (36.9%) / 88 games (50.9%)**.

## Scope

- `src/utils/nodeGraphHelpers.ts` — add `normaliseContent` and
  `stripGodotTypePrefix`.
- `src/utils/useNodeGraph.ts` — normalise before walking.
- `src/utils/useLinearNodeGraph.ts` — normalise before walking.
- `src/utils/__tests__/nodeGraphHelpers.test.ts` — new test file.

## Not in scope

- Compressed binary values (gzip/zlib base64). 440 saves (2.1%) / 6 games, each
  with a bespoke format. Needs per-game decoders, not worth it.
- `src/components/saves/SaveDataNode.tsx`. No rendering change — nodes arrive
  already structured.
- The `godot.v2` quoting special case in `renderItem`. Leave as-is.
- `MAX_NODE_CHILDREN` (50). A 52KB value becoming a 50-capped array is existing
  behaviour.
- Server/API changes. `content` is already parsed JSON on the client.
- The duplicated walkers themselves. Refactoring them into one is a separate job.

## Changes

### `src/utils/nodeGraphHelpers.ts`

Add `normaliseContent(content: Record<string, unknown>): Record<string, unknown>`:

- Return a new tree; do not mutate the input (it is React state).
- For each string leaf, attempt to decode. On success, replace the value and
  recurse into the result. On failure, keep the original string.
- Decode order, each step guarded by `try`/`catch` so it never throws:
  1. `JSON.parse(s)`. If the result is itself a string, `JSON.parse` once more
     — covers the double-encoded `payload` pattern.
  2. `stripGodotTypePrefix(s)` then `JSON.parse` — covers Godot's typed
     containers, e.g. `Array[String](["a"])` and
     `Dictionary[String, Dictionary]({...})`.
  3. Otherwise return `s` unchanged.

Add `stripGodotTypePrefix(s: string): string | null`:

- Match `^[A-Za-z_][A-Za-z0-9_]*\[`, then scan to the matching `]` by bracket
  depth (not a regex — the type args can nest, e.g. `Array[Array[String]]`).
- Require the next character to be `(` and the string to end with `)`.
- Return the text between that `(` and the final `)`, else `null`.
- Reject early if `s` does not end with `)`.

### `src/utils/useNodeGraph.ts`

- Read `formatVersion` from the **original** `save.content`, not the normalised
  tree, so a numeric `version` cannot be coerced into something else.
- Compute `const normalised = normaliseContent(content)` once inside the effect
  and iterate `for (const key in normalised)` instead of `content`.
- Nothing else in `processContent` changes. `objectToRows` already drops
  object/array entries, so a decoded `value` disappears from the row list and is
  picked up by the existing recursion into a child node. Node ids stay unique
  because they include the array index (`objects-0-data-3-value`).

### `src/utils/useLinearNodeGraph.ts`

Same two changes as above.

## Tests

New file `src/utils/__tests__/nodeGraphHelpers.test.ts`, pure unit tests on
`normaliseContent`:

1. Godot `var_to_str` dictionary value `'{\n"level": 3\n}'` → object. Proves the
   main case.
2. `'Array[String](["a", "b"])'` → `['a', 'b']`. Proves the prefix strip.
3. `'Dictionary[String, Dictionary]({"k": {"n": 1}})'` → nested object. Proves
   the typed dict with nested type args.
4. `'just a name'` → unchanged. Proves no false positives on plain strings.
5. `'Array[String](["a)b"])'` → `['a)b']`. Proves the balanced scan, not a regex.
6. `'"{\\"a\\": 1}"'` → object. Proves the double-encoded pattern.
7. `'Array[String]([broken'` → unchanged, no throw. Proves the guards.
8. Input object is not mutated. Proves it is safe as React state.

## Verify

```bash
cd /Users/tudor/orca/workspaces/frontend/save-value-nodes
pnpm test src/utils/__tests__/nodeGraphHelpers.test.ts
pnpm lint
pnpm fmt
pnpm build
```

Manual, after the above pass: open a player save whose `value` holds JSON —
MNEMONIC: Daily Puzzle or Deadline have the `payload` pattern — and confirm a
subtree appears in **both** Linear and Tree modes.
