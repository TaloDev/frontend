import { useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import Modal from '../../components/Modal'
import TextInput from '../../components/TextInput'
import Button from '../../components/Button'
import buildError from '../../utils/buildError'
import ErrorMessage from '../../components/ErrorMessage'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import createGroup from '../../api/createGroup'
import activeGameState from '../../state/activeGameState'
import { useRecoilValue } from 'recoil'
import updateGroup from '../../api/updateGroup'
import deleteGroup from '../../api/deleteGroup'
import canPerformAction, { permissionBasedActions } from '../../utils/canPerformAction'
import userState from '../../state/userState'
import GroupRules, { groupPropKeyField } from './GroupRules'
import useGroupPreviewCount from '../../api/useGroupPreviewCount'
import Loading from '../../components/Loading'
import { useDebounce } from 'use-debounce'
import prepareRule from '../../utils/group-rules/prepareRule'
import isGroupRuleValid from '../../utils/group-rules/isGroupRuleValid'
import { useEffect } from 'react'

const validationSchema = yup.object({
  name: yup.string().label('Name').required(),
  description: yup.string().label('Description').required()
})

export function unpackRules(rules) {
  if (!rules) return rules
  return rules.map((rule) => {
    return {
      name: rule.name,
      negate: rule.negate,
      castType: rule.castType,
      field: rule.field.startsWith('props.') ? groupPropKeyField : rule.field,
      propKey: rule.field.startsWith('props.') ? rule.field.split('props.')[1] : '',
      operands: rule.operands.reduce((acc, curr, idx) => ({
        ...acc,
        [idx]: curr
      }), {}),
      operandCount: rule.operands.length
    }
  })
}

export default function GroupDetails({ modalState, mutate, editingGroup }) {
  const activeGame = useRecoilValue(activeGameState)
  const user = useRecoilValue(userState)

  const [, setOpen] = modalState
  const [isLoading, setLoading] = useState(false)
  const [isDeleting, setDeleting] = useState(false)
  const [error, setError] = useState(null)

  const [ruleMode, setRuleMode] = useState(editingGroup?.ruleMode ?? '$and')
  const [rules, setRules] = useState(unpackRules(editingGroup?.rules) ?? [])

  const [debouncedRules] = useDebounce(rules, 300)
  const { count, loading: countLoading } = useGroupPreviewCount(activeGame, ruleMode, debouncedRules)
  const [displayableCount, setDisplayableCount] = useState(count)

  useEffect(() => {
    if (count !== undefined) {
      setDisplayableCount(count)
    }
  }, [count])

  const allRulesValid = useMemo(() => {
    return rules.every(isGroupRuleValid)
  }, [rules])

  const { register, handleSubmit, formState: { isValid, errors } } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: editingGroup?.name ?? '',
      description: editingGroup?.description ?? ''
    },
    mode: 'onChange'
  })

  const onCreateClick = async (data, e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await createGroup(activeGame.id, { ...data, ruleMode, rules: rules.map(prepareRule) })

      mutate((data) => {
        return {
          ...data,
          groups: [
            ...data.groups,
            res.data.group
          ]
        }
      }, true)

      setOpen(false)
    } catch (err) {
      setError(buildError(err))
      setLoading(false)
    }
  }

  const onUpdateClick = async (data, e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await updateGroup(activeGame.id, editingGroup.id, { ...data, ruleMode, rules: rules.map(prepareRule) })

      mutate((data) => {
        return {
          ...data,
          groups: data.groups.map((existingGroup) => {
            if (existingGroup.id === res.data.group.id) return res.data.group
            return existingGroup
          })
        }
      }, true)

      setOpen(false)
    } catch (err) {
      setError(buildError(err))
      setLoading(false)
    }
  }

  const onDeleteClick = async () => {
    /* c8 ignore next */
    if (!window.confirm('Are you sure you want to delete this group?')) return

    setDeleting(true)
    setError(null)

    try {
      await deleteGroup(activeGame.id, editingGroup.id)

      mutate((data) => {
        return {
          ...data,
          groups: data.groups.filter((existingGroup) => {
            return existingGroup.id !== editingGroup.id
          })
        }
      }, false)

      setOpen(false)
    } catch (err) {
      setError(buildError(err))
      setDeleting(false)
    }
  }

  return (
    <Modal
      scroll
      id='group-details'
      title={editingGroup ? 'Update group' : 'Create group'}
      modalState={modalState}
    >
      <form onSubmit={handleSubmit(editingGroup ? onUpdateClick : onCreateClick)}>
        <div className='p-4 space-y-4'>
          <TextInput
            id='name'
            variant='modal'
            label='Name'
            placeholder='Group name'
            inputExtra={{ ...register('name') }}
            errors={[errors.name?.message]}
          />

          <TextInput
            id='description'
            variant='modal'
            label='Description'
            placeholder='Group description'
            inputExtra={{ ...register('description') }}
            errors={[errors.description?.message]}
          />

          <div>
            <p className='font-semibold mb-2'>Membership</p>
            <GroupRules
              ruleModeState={[ruleMode, setRuleMode]}
              rulesState={[rules, setRules]}
            />
          </div>

          {error && <ErrorMessage error={error} />}

          <div className='flex'>
            {countLoading &&
              <div className='mr-2'>
                <Loading size={24} thickness={180} />
              </div>
            }
            <p>{displayableCount} player{displayableCount !== 1 ? 's' : ''} in group</p>
          </div>
        </div>

        <div className='flex flex-col md:flex-row-reverse md:justify-between space-y-4 md:space-y-0 p-4 border-t border-gray-200'>
          {!editingGroup &&
            <div className='w-full md:w-32'>
              <Button
                disabled={!isValid || !allRulesValid}
                isLoading={isLoading}
              >
                Create
              </Button>
            </div>
          }

          {editingGroup &&
            <div className='flex space-x-2'>
              {canPerformAction(user, permissionBasedActions.DELETE_GROUP) &&
                <div className='w-full md:w-32'>
                  <Button
                    type='button'
                    isLoading={isDeleting}
                    onClick={onDeleteClick}
                    variant='red'
                  >
                    Delete
                  </Button>
                </div>
              }

              <div className='w-full md:w-32'>
                <Button
                  disabled={!isValid || isDeleting || !allRulesValid}
                  isLoading={isLoading}
                >
                  Update
                </Button>
              </div>
            </div>
          }

          <div className='w-full md:w-32'>
            <Button type='button' variant='grey' onClick={() => setOpen(false)}>Close</Button>
          </div>
        </div>
      </form>
    </Modal>
  )
}

GroupDetails.propTypes = {
  modalState: PropTypes.array.isRequired,
  mutate: PropTypes.func.isRequired,
  editingGroup: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    ruleMode: PropTypes.oneOf(['$and', '$or']).isRequired,
    rules: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      negate: PropTypes.bool.isRequired,
      castType: PropTypes.string.isRequired,
      field: PropTypes.string.isRequired,
      operands: PropTypes.arrayOf(PropTypes.string).isRequired
    })).isRequired
  })
}
