import { IconPlus, IconTrash } from '@tabler/icons-react'
import { Dispatch, SetStateAction } from 'react'
import {
  EventFunnelPropOp,
  EventFunnelRuleMode,
  EventFunnelStep,
  eventFunnelPropOps,
} from '../../entities/eventFunnel'
import { getRuleOperandCount, MAX_FUNNEL_STEPS } from '../../utils/funnel-rules'
import Button from '../Button'
import DropdownMenu from '../DropdownMenu'
import TextInput from '../TextInput'

const ruleOpLabels: Record<EventFunnelPropOp, string> = {
  set: 'is set',
  '=': 'is equal to',
  '!=': 'is not equal to',
  '>': 'is greater than',
  '>=': 'is greater than or equal to',
  '<': 'is less than',
  '<=': 'is less than or equal to',
  between: 'is between',
  contains: 'contains',
}

type EventFunnelStepsProps = {
  stepsState: [EventFunnelStep[], Dispatch<SetStateAction<EventFunnelStep[]>>]
  showErrors?: boolean
}

export function EventFunnelSteps({ stepsState, showErrors = false }: EventFunnelStepsProps) {
  const [steps, setSteps] = stepsState

  const updateStep = (stepIdx: number, partial: Partial<EventFunnelStep>) => {
    setSteps((steps) =>
      steps.map((step, idx) => (idx === stepIdx ? { ...step, ...partial } : step)),
    )
  }

  const updateRuleMode = (stepIdx: number, ruleMode: EventFunnelRuleMode) => {
    setSteps((steps) =>
      steps.map((step, idx) =>
        idx === stepIdx ? { ...step, props: { ...step.props, ruleMode } } : step,
      ),
    )
  }

  const updateRule = (
    stepIdx: number,
    ruleIdx: number,
    partial: Partial<EventFunnelStep['props']['rules'][number]>,
  ) => {
    setSteps((steps) =>
      steps.map((step, idx) =>
        idx === stepIdx
          ? {
              ...step,
              props: {
                ...step.props,
                rules: step.props.rules.map((rule, rIdx) =>
                  rIdx === ruleIdx ? { ...rule, ...partial } : rule,
                ),
              },
            }
          : step,
      ),
    )
  }

  const updateRuleOp = (stepIdx: number, ruleIdx: number, op: EventFunnelPropOp) => {
    setSteps((steps) =>
      steps.map((step, idx) =>
        idx === stepIdx
          ? {
              ...step,
              props: {
                ...step.props,
                rules: step.props.rules.map((rule, rIdx) =>
                  rIdx === ruleIdx
                    ? {
                        ...rule,
                        op,
                        value: Array.from({ length: getRuleOperandCount(op) }, () => ''),
                      }
                    : rule,
                ),
              },
            }
          : step,
      ),
    )
  }

  const updateRuleValue = (stepIdx: number, ruleIdx: number, valueIdx: number, value: string) => {
    setSteps((steps) =>
      steps.map((step, idx) =>
        idx === stepIdx
          ? {
              ...step,
              props: {
                ...step.props,
                rules: step.props.rules.map((rule, rIdx) =>
                  rIdx === ruleIdx
                    ? {
                        ...rule,
                        value: rule.value.map((v, vIdx) => (vIdx === valueIdx ? value : v)),
                      }
                    : rule,
                ),
              },
            }
          : step,
      ),
    )
  }

  const onAddStepClick = () => {
    setSteps((steps) => [
      ...steps,
      { name: '', props: { ruleMode: EventFunnelRuleMode.AND, rules: [] } },
    ])
  }

  const onRemoveStepClick = (stepIdx: number) => {
    setSteps((steps) => steps.filter((_, idx) => idx !== stepIdx))
  }

  const onAddRuleClick = (stepIdx: number) => {
    setSteps((steps) =>
      steps.map((step, idx) =>
        idx === stepIdx
          ? {
              ...step,
              props: {
                ...step.props,
                rules: [...step.props.rules, { key: '', op: '=', value: [''] }],
              },
            }
          : step,
      ),
    )
  }

  const onRemoveRuleClick = (stepIdx: number, ruleIdx: number) => {
    setSteps((steps) =>
      steps.map((step, idx) =>
        idx === stepIdx
          ? {
              ...step,
              props: {
                ...step.props,
                rules: step.props.rules.filter((_, rIdx) => rIdx !== ruleIdx),
              },
            }
          : step,
      ),
    )
  }

  return (
    <div className='space-y-4'>
      <p className='font-semibold'>Steps</p>

      <div className='space-y-4'>
        {steps.map((step, stepIdx) => (
          <div key={stepIdx} className='text-sm'>
            <div className='grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-2'>
              <span className='text-white'>Step {stepIdx + 1}</span>

              <div className='flex w-full items-center space-x-2 md:w-[calc(66.666667%_-_20px)]'>
                <div className='min-w-0 grow'>
                  <TextInput
                    id={`step-name-${stepIdx}`}
                    onChange={(value) => updateStep(stepIdx, { name: value })}
                    value={step.name}
                    placeholder='Event name'
                    errors={[showErrors && !step.name ? '' : undefined]}
                  />
                </div>

                <Button
                  type='button'
                  onClick={() => onRemoveStepClick(stepIdx)}
                  variant='white-small'
                  icon={<IconTrash size={16} />}
                  extra={{ 'aria-label': `Remove step ${stepIdx + 1}` }}
                />
              </div>

              <div />

              <div className='space-y-2'>
                {step.props.rules.length > 0 && (
                  <div className='space-y-2'>
                    {step.props.rules.map((rule, ruleIdx) => (
                      <div key={ruleIdx} className='flex flex-wrap items-center gap-2'>
                        <DropdownMenu
                          options={[
                            {
                              label: 'and',
                              onClick: () => updateRuleMode(stepIdx, EventFunnelRuleMode.AND),
                            },
                            {
                              label: 'or',
                              onClick: () => updateRuleMode(stepIdx, EventFunnelRuleMode.OR),
                            },
                          ]}
                        >
                          {(setOpen) => (
                            <Button
                              type='button'
                              onClick={() => setOpen(true)}
                              variant='white-small'
                            >
                              {step.props.ruleMode === EventFunnelRuleMode.AND ? 'and' : 'or'}
                            </Button>
                          )}
                        </DropdownMenu>

                        <TextInput
                          id={`rule-key-${stepIdx}-${ruleIdx}`}
                          containerClassName='w-32 md:w-40'
                          onChange={(value) => updateRule(stepIdx, ruleIdx, { key: value })}
                          value={rule.key}
                          placeholder='Prop key'
                          errors={[showErrors && !rule.key ? '' : undefined]}
                        />

                        <DropdownMenu
                          options={eventFunnelPropOps.map((op) => ({
                            label: ruleOpLabels[op],
                            onClick: () => updateRuleOp(stepIdx, ruleIdx, op),
                          }))}
                        >
                          {(setOpen) => (
                            <Button
                              type='button'
                              onClick={() => setOpen(true)}
                              variant='white-small'
                            >
                              {ruleOpLabels[rule.op]}
                            </Button>
                          )}
                        </DropdownMenu>

                        {[...new Array(getRuleOperandCount(rule.op))].map((_, operandIdx) => (
                          <TextInput
                            key={operandIdx}
                            id={`rule-value-${stepIdx}-${ruleIdx}-${operandIdx}`}
                            containerClassName='w-20 md:w-24'
                            onChange={(value) =>
                              updateRuleValue(stepIdx, ruleIdx, operandIdx, value)
                            }
                            value={rule.value[operandIdx] ?? ''}
                            placeholder={
                              rule.op === 'between' ? (operandIdx === 0 ? 'Min' : 'Max') : 'Value'
                            }
                            errors={[showErrors && !rule.value[operandIdx] ? '' : undefined]}
                          />
                        ))}

                        <Button
                          type='button'
                          onClick={() => onRemoveRuleClick(stepIdx, ruleIdx)}
                          variant='white-small'
                          icon={<IconTrash size={16} />}
                          extra={{
                            'aria-label': `Remove rule ${ruleIdx + 1} from step ${stepIdx + 1}`,
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div>
                  <Button
                    type='button'
                    onClick={() => onAddRuleClick(stepIdx)}
                    variant='white-small'
                    icon={<IconPlus size={14} />}
                  >
                    <span>Prop filter</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className='w-40'>
          <Button
            type='button'
            onClick={onAddStepClick}
            disabled={steps.length >= MAX_FUNNEL_STEPS}
            icon={<IconPlus size={16} />}
            variant='white-small'
          >
            <span>New step</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
