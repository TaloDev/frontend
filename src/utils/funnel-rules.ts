import { EventFunnelPropOp, EventFunnelPropRule, EventFunnelStep } from '../entities/eventFunnel'

export const MAX_FUNNEL_STEPS = 5
export const MIN_FUNNEL_STEPS = 2

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
    ...step,
    props: {
      ...step.props,
      rules: step.props.rules.map((rule) => ({
        ...rule,
        value: rule.value.filter((value) => value !== ''),
      })),
    },
  }
}
