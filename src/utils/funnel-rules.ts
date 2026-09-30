import { EventFunnelPropOp, EventFunnelPropRule, EventFunnelStep } from '../entities/eventFunnel'

export const MAX_FUNNEL_STEPS = 5
export const MIN_FUNNEL_STEPS = 2

// steps have no server id, so the editor attaches one for motion keys
export type EditableFunnelStep = EventFunnelStep & { id: string }

let nextStepId = 0

export function makeFunnelStepId() {
  return `step-${nextStepId++}`
}

export function reorderFunnelSteps<T extends { id: string }>(
  steps: T[],
  orderedIds: string[],
): T[] {
  const byId = new Map(steps.map((step) => [step.id, step]))

  return orderedIds.flatMap((id) => {
    const step = byId.get(id)
    return step ? [step] : []
  })
}

export function getRuleOperandCount(op: EventFunnelPropOp) {
  switch (op) {
    case 'set':
      return 0
    case 'between':
      return 2
    default:
      return 1
  }
}

export function isFunnelRuleValid(rule: EventFunnelPropRule) {
  if (!rule.key) {
    return false
  }

  const filledValues = rule.value.filter((value) => value !== '').length
  return filledValues === getRuleOperandCount(rule.op)
}

export function isFunnelStepValid(step: EventFunnelStep) {
  return step.name.length > 0 && step.props.rules.every(isFunnelRuleValid)
}

export function isFunnelStepsValid(steps: EventFunnelStep[]) {
  if (steps.length < MIN_FUNNEL_STEPS || steps.length > MAX_FUNNEL_STEPS) {
    return false
  }

  const names = steps.map((step) => step.name)
  if (new Set(names).size !== names.length) {
    return false
  }

  return steps.every(isFunnelStepValid)
}

export function prepareFunnelStep(step: EventFunnelStep): EventFunnelStep {
  return {
    name: step.name,
    props: {
      ruleMode: step.props.ruleMode,
      rules: step.props.rules.map((rule) => ({
        key: rule.key,
        op: rule.op,
        value: rule.value.filter((value) => value !== ''),
      })),
    },
  }
}
