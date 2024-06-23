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
import { PlayerGroupRuleCastType, PlayerGroupRuleMode, PlayerGroupRuleName, PlayerGroupRuleOption } from '../../entities/playerGroup'
import { UnpackedGroupRule } from './GroupDetails'
import { Dispatch, SetStateAction } from 'react'

export const groupPropKeyField = 'prop with key'

function getRuleDescription(ruleName: PlayerGroupRuleName, negate: boolean) {
  switch (ruleName) {
    case 'EQUALS':
      return `is ${negate ? 'not ' : ''}equal to`
    case 'SET':
      return `is ${negate ? 'not ' : ''}set`
    case 'GT':
      return `is ${negate ? 'not ' : ''}greater than`
    case 'GTE':
      return `is ${negate ? 'not ' : ''}greater than or equal to`
    case 'LT':
      return `is ${negate ? 'not ' : ''}less than`
    case 'LTE':
      return `is ${negate ? 'not ' : ''}less than or equal to`
    default:
      return ruleName
  }
}

function getCastTypeDescription(castType: PlayerGroupRuleCastType) {
  switch (castType) {
    case 'CHAR':
      return 'text'
    case 'DOUBLE':
      return 'number'
    case 'DATETIME':
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

  const availableFields = [
    ...fields,
    ...metaGroupFields
  ].sort((a, b) => {
    if (a.field === groupPropKeyField) return -1
    if (b.field === groupPropKeyField) return 1
    return a.field.localeCompare(b.field)
  })

  const [ruleMode, setRuleMode] = ruleModeState
  const [rules, setRules] = rulesState

  const findRuleByName = (name: PlayerGroupRuleName): PlayerGroupRuleOption => {
    return availableRules.find((rule) => rule.name === name)!
  }

  const onAddFilterClick = () => {
    const rule = findRuleByName(PlayerGroupRuleName.EQUALS)!

    const newRule: UnpackedGroupRule = {
      name: rule.name,
      field: availableFields[0].field,
      castType: rule.castTypes[0],
      negate: false,
      operands: {},
      operandCount: rule.operandCount,
      mapsTo: availableFields[0].mapsTo,
      propKey: ''
    }

    setRules((rules) => [...rules, newRule])
  }

  const onDeleteClick = (deleteIdx: number) => {
    setRules((rules) => rules.filter((_, idx) => idx !== deleteIdx))
  }

  const updateRule = (ruleIdx: number, partial: Partial<UnpackedGroupRule>) => {
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
          } else if (Object.keys(partial).includes('field')) {
            const availableField = availableFields.find((f) => f.field === partial.field)!

            updatedRule.name = findRuleByName(PlayerGroupRuleName.EQUALS).name
            updatedRule.propKey = availableField.mapsTo.startsWith('META_') ? availableField.mapsTo : ''
            updatedRule.mapsTo = availableField.mapsTo.startsWith('META_') ? 'props' : availableField.mapsTo
            updatedRule.castType = availableField.defaultCastType
            for (const key in updatedRule.operands) {
              updatedRule.operands[key] = ''
            }
          }
          return updatedRule
        }
        return rule
      })
    })
  }

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

      {rules.length > 0 &&
        <div className='divide-y space-y-4'>
          {rules.map((rule, idx) => (
            <div key={idx} className='text-sm space-y-2 pt-4 first:pt-0'>
              <div className='flex items-center space-x-2'>
                <div className='-translate-y-0.5 w-[12px] h-[8px] border-l border-b border-gray-300' />

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
                  options={availableFields.map(({ field }) => ({
                    label: field,
                    onClick: () => {
                      updateRule(idx, { field })
                    }
                  }))}
                >
                  {(setOpen) => (
                    <Button
                      type='button'
                      onClick={() => setOpen(true)}
                      variant='small'
                    >
                      {rule.field}
                    </Button>
                  )}
                </DropdownMenu>

                {rule.field === groupPropKeyField &&
                  <TextInput
                    id='prop-key'
                    variant='modal'
                    containerClassName='w-24 md:w-32'
                    onChange={(propKey) => updateRule(idx, { propKey })}
                    value={rule.propKey ?? ''}
                  />
                }

                <div className='!ml-auto'>
                  <Button
                    type='button'
                    onClick={() => onDeleteClick(idx)}
                    variant='small'
                    icon={<IconTrash size={16} />}
                    extra={{ 'aria-label': `Delete rule ${idx + 1}` }}
                  />
                </div>
              </div>

              {rule.field === groupPropKeyField &&
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
        </div>
      }

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
  )
}
