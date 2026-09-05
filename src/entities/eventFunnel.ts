import { z } from 'zod'

export const eventFunnelPropOps = [
  'set',
  '=',
  '!=',
  '>',
  '>=',
  '<',
  '<=',
  'between',
  'contains',
] as const

export type EventFunnelPropOp = (typeof eventFunnelPropOps)[number]

export enum EventFunnelRuleMode {
  AND = 'and',
  OR = 'or',
}

export const eventFunnelPropRuleSchema = z.object({
  key: z.string(),
  op: z.enum(eventFunnelPropOps),
  value: z.array(z.string()),
})

export type EventFunnelPropRule = z.infer<typeof eventFunnelPropRuleSchema>

export const eventFunnelStepPropsSchema = z.object({
  ruleMode: z.nativeEnum(EventFunnelRuleMode),
  rules: z.array(eventFunnelPropRuleSchema),
})

export type EventFunnelStepProps = z.infer<typeof eventFunnelStepPropsSchema>

export const eventFunnelStepSchema = z.object({
  name: z.string(),
  props: eventFunnelStepPropsSchema,
})

export type EventFunnelStep = z.infer<typeof eventFunnelStepSchema>

export const eventFunnelSchema = z.object({
  id: z.number(),
  name: z.string(),
  steps: z.array(eventFunnelStepSchema),
  maxGap: z.number(),
  updatedAt: z.string().datetime(),
})

export type EventFunnel = z.infer<typeof eventFunnelSchema>

export const funnelResultStepSchema = z.object({
  eventName: z.string(),
  players: z.number(),
  percentage: z.number().nullable(),
  avgSecondsToNext: z.number().nullable(),
})

export type FunnelResultStep = z.infer<typeof funnelResultStepSchema>
