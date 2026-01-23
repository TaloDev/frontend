import { IconPlus, IconTrash } from '@tabler/icons-react'
import Button from '../../components/Button'
import TextInput from '../../components/TextInput'
import DropdownMenu from '../../components/DropdownMenu'
import useGroupRules from '../../api/useGroupRules'
import Loading from '../../components/Loading'
import { useRecoilValue } from 'recoil'
import activeGameState, { SelectedActiveGame } from '../../state/activeGameState'
import ErrorMessage from '../../components/ErrorMessage'
import DateInput from '../../components/DateInput'
import { metaGroupFields } from '../../constants/metaProps'
import { AvailablePlayerGroupField, PlayerGroupRuleCastType, PlayerGroupRuleMode, PlayerGroupRuleName, PlayerGroupRuleOption } from '../../entities/playerGroup'
import { UnpackedGroupRule } from './GroupDetails'
import { Dispatch, SetStateAction, useCallback } from 'react'

const groupPropKeyField = 'prop with key'

function getRuleDescription(ruleName: PlayerGroupRuleName, negate: boolean) {
  switch (ruleName) {
    case PlayerGroupRuleName.EQUALS:
      return `is ${negate ? 'not ' : ''}equal to`
    case PlayerGroupRuleName.SET:
      return `is ${negate ? 'not ' : ''}set`
    case PlayerGroupRuleName.GT:
      return `is ${negate ? 'not ' : ''}greater than`
    case PlayerGroupRuleName.GTE:
      return `is ${negate ? 'not ' : ''}greater than or equal to`
    case PlayerGroupRuleName.LT:
      return `is ${negate ? 'not ' : ''}less than`
    case PlayerGroupRuleName.LTE:
      return `is ${negate ? 'not ' : ''}less than or equal to`
    default:
      return ruleName
  }
}

function getCastTypeDescription(castType: PlayerGroupRuleCastType) {
  switch (castType) {
    case PlayerGroupRuleCastType.CHAR:
      return 'text'
    case PlayerGroupRuleCastType.DOUBLE:
      return 'number'
    case PlayerGroupRuleCastType.DATETIME:
      return 'date'
    default:
      return castType
  }
}

type GroupRulesProps = {
  ruleModeState: [PlayerGroupRuleMode, (ruleMode: PlayerGroupRuleMode) => void]
  rulesState: [UnpackedGroupRule[], Dispatch<SetStateAction<UnpackedGroupRule[]>>]
}

export default function GroupRules({
  ruleModeState,
  rulesState
}: GroupRulesProps) {
  const activeGame = useRecoilValue(activeGameState) as SelectedActiveGame
  const { availableRules, availableFields: fields, loading, error } = useGroupRules(activeGame)

  const availableFields: AvailablePlayerGroupField[] = [
    ...fields,
    ...metaGroupFields
  ].sort((a, b) => {
    if (a.fieldDisplayName === groupPropKeyField) return -1
    if (b.fieldDisplayName === groupPropKeyField) return 1
    return a.fieldDisplayName.localeCompare(b.fieldDisplayName)
  })

  const [ruleMode, setRuleMode] = ruleModeState
  const [rules, setRules] = rulesState

  const findRuleByName = useCallback((name: PlayerGroupRuleName): PlayerGroupRuleOption => {
    return availableRules.find((rule) => rule.name === name)!
  }, [availableRules])

  const onAddFilterClick = () => {
    const rule = findRuleByName(PlayerGroupRuleName.EQUALS)

    const newRule: UnpackedGroupRule = {
      name: rule.name,
      mapsTo: availableFields[0].mapsTo,
      castType: availableFields[0].defaultCastType,
      negate: false,
      operands: {},
      operandCount: rule.operandCount,
      namespaced: availableFields[0].namespaced,
      namespacedValue: ''
    }

    setRules((rules) => [...rules, newRule])
  }

  const onDeleteClick = (deleteIdx: number) => {
    setRules((rules) => rules.filter((_, idx) => idx !== deleteIdx))
  }

  const updateRule = useCallback((ruleIdx: number, partial: Partial<UnpackedGroupRule>) => {
    setRules((rules) => {
      return rules.map((rule, idx) => {
        if (idx === ruleIdx) {
          const updatedRule = Object.assign(rule, partial)
          const availableRule = findRuleByName(updatedRule.name)

          if (Object.keys(partial).includes('name')) {
            updatedRule.operandCount = availableRule.operandCount
            if (updatedRule.operandCount === 0) {
              updatedRule.operands = {}
            }
          }

          return updatedRule
        }

        return rule
      })
    })
  }, [findRuleByName, setRules])

  const updateRuleName = useCallback((ruleIdx: number, fieldName: string) => {
    setRules((rules) => {
      return rules.map((rule, idx) => {
        if (idx === ruleIdx) {
          const availableField = availableFields.find((f) => f.fieldDisplayName === fieldName)!
          rule.name = findRuleByName(PlayerGroupRuleName.EQUALS).name
          rule.mapsTo = availableField.mapsTo
          rule.namespaced = availableField.namespaced
          rule.namespacedValue = availableField.metaProp ?? ''
          rule.castType = availableField.defaultCastType

          for (const key in rule.operands) {
            rule.operands[key] = ''
          }

          return rule
        }

        return rule
      })
    })
  }, [availableFields, findRuleByName, setRules])

  const getFieldDisplayNameForRule = useCallback((rule: UnpackedGroupRule) => {
    const isMetaRule = metaGroupFields.some((f) => f.metaProp === rule.namespacedValue)
    return availableFields.find((f) =>
      f.mapsTo === rule.mapsTo &&
      (isMetaRule ? f.metaProp === rule.namespacedValue : !f.metaProp)
    )!.fieldDisplayName
  }, [availableFields])

  const updateOperands = (ruleIdx: number, operandIdx: number, value: string) => {
    setRules((rules) => rules.map((rule, idx) => {
      if (idx === ruleIdx) return {
        ...rule,
        operands: {
          ...rule.operands,
          [operandIdx]: value
        }
      }
      return rule
    }))
  }

  const getNamespacedRulePlaceholder = useCallback((field: string) => {
    if (field.includes('stat') || field.includes('leaderboard')) return 'Internal name'
    return 'Key' // prop with key
  }, [])

  if (loading) {
    return (
      <div className='flex justify-center'>
        <Loading size={24} thickness={180} />
      </div>
    )
  }

  if (error) {
    return <ErrorMessage error={error} />
  }

  return (
    <div className='border rounded border-gray-200 p-4 space-y-4 md:max-h-80 md:overflow-y-scroll'>
      <p className='text-sm'>All players</p>

      <div className='divide-y divide-gray-200 space-y-4'>
        {rules.map((rule, idx) => (
          <div key={idx} className='text-sm space-y-2 pb-4'>
            <div className='flex items-center space-x-2'>
              <div className='-translate-y-0.5 w-3 h-2 border-l border-b border-gray-300' />

              <div>
                {idx === 0 && <span className='text-gray-500'>where</span>}

                {idx > 0 &&
                  <DropdownMenu
                    options={[
                      { label: 'and', onClick: () => setRuleMode(PlayerGroupRuleMode.AND) },
                      { label: 'or', onClick: () => setRuleMode(PlayerGroupRuleMode.OR) }
                    ]}
                  >
                    {(setOpen) => (
                      <Button
                        type='button'
                        onClick={() => setOpen(true)}
                        variant='small'
                      >
                        {ruleMode.substring(1, ruleMode.length)}
                      </Button>
                    )}
                  </DropdownMenu>
                }
              </div>

              <DropdownMenu
                options={availableFields.map(({ fieldDisplayName }) => ({
                  label: fieldDisplayName,
                  onClick: () => {
                    updateRuleName(idx, fieldDisplayName)
                  }
                }))}
              >
                {(setOpen) => (
                  <Button
                    type='button'
                    onClick={() => setOpen(true)}
                    variant='small'
                  >
                    {getFieldDisplayNameForRule(rule)}
                  </Button>
                )}
              </DropdownMenu>

              {rule.namespaced && !metaGroupFields.some((f) => f.metaProp === rule.namespacedValue) &&
                <TextInput
                  id='namespaced-value'
                  variant='modal'
                  containerClassName='w-24 md:w-32'
                  onChange={(namespacedValue) => updateRule(idx, { namespacedValue })}
                  value={rule.namespacedValue ?? ''}
                  placeholder={getNamespacedRulePlaceholder(getFieldDisplayNameForRule(rule))}
                  data-testid='namespaced-value'
                />
              }

              <div className='ml-auto!'>
                <Button
                  type='button'
                  onClick={() => onDeleteClick(idx)}
                  variant='small'
                  icon={<IconTrash size={16} />}
                  extra={{ 'aria-label': `Delete rule ${idx + 1}` }}
                />
              </div>
            </div>

            {getFieldDisplayNameForRule(rule) === groupPropKeyField &&
              <div className='flex items-center space-x-2 ml-5'>
                <span>value as</span>

                <DropdownMenu
                  options={[
                    PlayerGroupRuleCastType.CHAR,
                    PlayerGroupRuleCastType.DOUBLE,
                    PlayerGroupRuleCastType.DATETIME
                  ].map((castType) => ({
                    label: getCastTypeDescription(castType),
                    onClick: () => {
                      updateRule(idx, { castType })
                    }
                  }))}
                >
                  {(setOpen) => (
                    <Button
                      type='button'
                      onClick={() => setOpen(true)}
                      variant='small'
                    >
                      <span>{getCastTypeDescription(rule.castType)}</span>
                    </Button>
                  )}
                </DropdownMenu>
              </div>
            }

            <div className='flex items-center space-x-2 ml-5'>
              <DropdownMenu
                options={availableRules.filter((availableRule) => availableRule.castTypes.includes(rule.castType)).map(({ name, negate }) => ({
                  label: getRuleDescription(name, negate),
                  onClick: () => {
                    updateRule(idx, { name, negate })
                  }
                }))}
              >
                {(setOpen) => (
                  <Button
                    type='button'
                    onClick={() => setOpen(true)}
                    variant='small'
                  >
                    {getRuleDescription(rule.name, rule.negate)}
                  </Button>
                )}
              </DropdownMenu>

              {[...new Array(findRuleByName(rule.name).operandCount)].map((_, operandIdx) => {
                if (rule.castType === 'DATETIME') {
                  return (
                    <DateInput
                      key={operandIdx}
                      id={`operand-${operandIdx}`}
                      onDateTimeStringChange={(value) => updateOperands(idx, operandIdx, value)}
                      value={rule.operands[operandIdx]}
                      textInputProps={{
                        containerClassName: '!w-28'
                      }}
                    />
                  )
                } else {
                  return (
                    <TextInput
                      key={operandIdx}
                      id={`operand-${operandIdx}`}
                      variant='modal'
                      containerClassName='w-14 md:w-20'
                      onChange={(value) => updateOperands(idx, operandIdx, value)}
                      value={rule.operands[operandIdx] ?? ''}
                    />
                  )
                }
              })}
            </div>
          </div>
        ))}
        <div className='w-32'>
          <Button
            type='button'
            onClick={onAddFilterClick}
            icon={<IconPlus size={16} />}
            variant='small'
          >
            <span>Add filter</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
