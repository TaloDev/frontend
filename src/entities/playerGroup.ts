import { z } from 'zod'

export enum PlayerGroupRuleName {
  EQUALS = 'EQUALS',
  SET = 'SET',
  GT = 'GT',
  GTE = 'GTE',
  LT = 'LT',
  LTE = 'LTE',
}

export enum PlayerGroupRuleCastType {
  CHAR = 'CHAR',
  DOUBLE = 'DOUBLE',
  DATETIME = 'DATETIME',
}

export enum PlayerGroupRuleMode {
  AND = '$and',
  OR = '$or',
}

export enum PlayerField {
  PROPS = 'props',
  LAST_SEEN_AT = 'lastSeenAt',
  CREATED_AT = 'createdAt',
  STAT_VALUE = 'statValue',
  LEADERBOARD_ENTRY_SCORE = 'leaderboardEntryScore',
}

export const availablePlayerGroupFieldSchema = z.object({
  fieldDisplayName: z.string(),
  defaultCastType: z.enum(PlayerGroupRuleCastType),
  mapsTo: z.union([z.enum(PlayerField), z.string().startsWith('META_')]),
  namespaced: z.boolean(),
  metaProp: z.string().optional(), // client-side only
})

export type AvailablePlayerGroupField = z.infer<typeof availablePlayerGroupFieldSchema>

export const playerGroupRuleSchema = z.object({
  name: z.enum(PlayerGroupRuleName),
  negate: z.boolean(),
  field: z.string(),
  castType: z.enum(PlayerGroupRuleCastType),
  operands: z.array(z.string()),
  namespaced: z.boolean(),
})

export type PlayerGroupRule = z.infer<typeof playerGroupRuleSchema>

export const playerGroupSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  rules: z.array(playerGroupRuleSchema),
  ruleMode: z.enum(PlayerGroupRuleMode),
  count: z.number(),
  membersVisible: z.boolean(),
  updatedAt: z.iso.datetime(),
})

export type PlayerGroup = z.infer<typeof playerGroupSchema>

export const playerGroupRuleOptionSchema = z.object({
  name: z.enum(PlayerGroupRuleName),
  castTypes: z.array(z.enum(PlayerGroupRuleCastType)),
  operandCount: z.number(),
  negate: z.boolean(),
  negatable: z.boolean().optional(),
})

export type PlayerGroupRuleOption = z.infer<typeof playerGroupRuleOptionSchema>
