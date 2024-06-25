import { z } from 'zod'
import { gameSchema } from './game'

export enum PlayerGroupRuleName {
  EQUALS = 'EQUALS',
  SET = 'SET',
  GT = 'GT',
  GTE = 'GTE',
  LT = 'LT',
  LTE = 'LTE'
}

export enum PlayerGroupRuleCastType {
  CHAR = 'CHAR',
  DOUBLE = 'DOUBLE',
  DATETIME = 'DATETIME'
}

export enum PlayerGroupRuleMode {
  AND = '$and',
  OR = '$or'
}

export enum PlayerField {
  PROPS = 'props',
  LAST_SEEN_AT = 'lastSeenAt',
  CREATED_AT = 'createdAt'
}

export const playerGroupRuleFieldSchema = z.object({
  field: z.string(),
  defaultCastType: z.nativeEnum(PlayerGroupRuleCastType),
  mapsTo: z.nativeEnum(PlayerField)
})

export type PlayerGroupRuleField = z.infer<typeof playerGroupRuleFieldSchema>

export const playerGroupRuleSchema = z.object({
  name: z.nativeEnum(PlayerGroupRuleName),
  negate: z.boolean(),
  field: z.string(),
  castType: z.nativeEnum(PlayerGroupRuleCastType),
  operands: z.array(z.string())
})

export type PlayerGroupRule = z.infer<typeof playerGroupRuleSchema>

export const playerGroupSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  rules: z.array(playerGroupRuleSchema),
  ruleMode: z.nativeEnum(PlayerGroupRuleMode),
  game: gameSchema,
  count: z.number(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
})

export type PlayerGroup = z.infer<typeof playerGroupSchema>

export const playerGroupRuleOptionSchema = z.object({
  name: z.nativeEnum(PlayerGroupRuleName),
  castTypes: z.array(z.nativeEnum(PlayerGroupRuleCastType)),
  operandCount: z.number(),
  negate: z.boolean(),
  negatable: z.boolean().optional()
})

export type PlayerGroupRuleOption = z.infer<typeof playerGroupRuleOptionSchema>
