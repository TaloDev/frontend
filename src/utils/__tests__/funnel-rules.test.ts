import { describe, expect, it } from 'vitest'
import {
  EventFunnelPropRule,
  EventFunnelRuleMode,
  EventFunnelStep,
} from '../../entities/eventFunnel'
import {
  isFunnelRuleValid,
  isFunnelStepsValid,
  isFunnelStepValid,
  prepareFunnelStep,
} from '../funnel-rules'

function rule(overrides: Partial<EventFunnelPropRule> = {}): EventFunnelPropRule {
  return {
    key: 'amount',
    op: '>=',
    value: ['10'],
    ...overrides,
  }
}

function step(name = 'purchase_started', rules = [rule()]): EventFunnelStep {
  return {
    name,
    props: { ruleMode: EventFunnelRuleMode.OR, rules },
  }
}

describe('isFunnelRuleValid', () => {
  it('validates operand count per op', () => {
    expect(isFunnelRuleValid(rule())).toBe(true)
    expect(isFunnelRuleValid(rule({ op: 'set', value: [] }))).toBe(true)
    expect(isFunnelRuleValid(rule({ op: 'between', value: ['1', '10'] }))).toBe(true)
  })

  it('rejects missing keys and wrong arity', () => {
    expect(isFunnelRuleValid(rule({ key: '' }))).toBe(false)
    expect(isFunnelRuleValid(rule({ op: 'between', value: ['1'] }))).toBe(false)
    expect(isFunnelRuleValid(rule({ op: 'set', value: ['10'] }))).toBe(false)
  })
})

describe('isFunnelStepValid', () => {
  it('requires a name and valid rules', () => {
    expect(isFunnelStepValid(step())).toBe(true)
    expect(isFunnelStepValid(step(''))).toBe(false)
    expect(isFunnelStepValid(step('x', [rule({ key: '' })]))).toBe(false)
  })
})

describe('isFunnelStepsValid', () => {
  it('requires between 2 and 5 distinct steps', () => {
    expect(isFunnelStepsValid([step('a'), step('b')])).toBe(true)
    expect(isFunnelStepsValid([step('a')])).toBe(false)
    expect(isFunnelStepsValid(['a', 'b', 'c', 'd', 'e', 'f'].map((name) => step(name)))).toBe(false)
    expect(isFunnelStepsValid([step('a'), step('a')])).toBe(false)
  })
})

describe('prepareFunnelStep', () => {
  it('strips empty values', () => {
    const prepared = prepareFunnelStep(step('a', [rule({ op: 'between', value: ['1', ''] })]))

    expect(prepared.props.rules[0].value).toEqual(['1'])
  })
})
