import { useMemo, useState } from 'react'
import Modal from '../../components/Modal'
import TextInput from '../../components/TextInput'
import Button from '../../components/Button'
import buildError from '../../utils/buildError'
import ErrorMessage, { TaloError } from '../../components/ErrorMessage'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import createGroup from '../../api/createGroup'
import activeGameState, { SelectedActiveGame } from '../../state/activeGameState'
import { useRecoilValue } from 'recoil'
import updateGroup from '../../api/updateGroup'
import deleteGroup from '../../api/deleteGroup'
import canPerformAction, { PermissionBasedAction } from '../../utils/canPerformAction'
import userState, { AuthedUser } from '../../state/userState'
import GroupRules from './GroupRules'
import useGroupPreviewCount from '../../api/useGroupPreviewCount'
import Loading from '../../components/Loading'
import { useDebounce } from 'use-debounce'
import prepareRule from '../../utils/group-rules/prepareRule'
import isGroupRuleValid from '../../utils/group-rules/isGroupRuleValid'
import { useEffect } from 'react'
import { PlayerGroup, PlayerGroupRuleCastType, PlayerGroupRuleName, PlayerGroupRuleMode } from '../../entities/playerGroup'
import { KeyedMutator } from 'swr'
import { z } from 'zod'
import Toggle from '../../components/toggles/Toggle'
import Link from '../../components/Link'
import { unpackRules } from '../../utils/group-rules/unpackRules'

const validationSchema = z.object({
  name: z.string(),
  description: z.string(),
  membersVisible: z.boolean()
})

type FormValues = z.infer<typeof validationSchema>

export type UnpackedGroupRule = {
  name: PlayerGroupRuleName
  negate: boolean
  castType: PlayerGroupRuleCastType
  namespaced: boolean
  namespacedValue: string
  operands: Record<number, string>
  operandCount: number
  mapsTo: string
}

type GroupDetailsProps = {
  modalState: [boolean, (open: boolean) => void]
  mutate: KeyedMutator<{ groups: PlayerGroup[] }>
  editingGroup: PlayerGroup | null
}

export default function GroupDetails({
  modalState,
  mutate,
  editingGroup
}: GroupDetailsProps) {
  const activeGame = useRecoilValue(activeGameState) as SelectedActiveGame
  const user = useRecoilValue(userState) as AuthedUser

  const [, setOpen] = modalState
  const [isLoading, setLoading] = useState(false)
  const [isDeleting, setDeleting] = useState(false)
  const [apiError, setAPIError] = useState<TaloError | null>(null)

  const [ruleMode, setRuleMode] = useState(editingGroup?.ruleMode ?? PlayerGroupRuleMode.AND)
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

  const { register, handleSubmit, formState: { isValid, errors }, control } = useForm<FormValues>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      name: editingGroup?.name ?? '',
      description: editingGroup?.description ?? '',
      membersVisible: editingGroup?.membersVisible ?? false
    },
    mode: 'onChange'
  })

  const onCreateClick: SubmitHandler<FormValues> = async (FormValues, e) => {
    e?.preventDefault()
    setLoading(true)
    setAPIError(null)

    try {
      const { group } = await createGroup(activeGame.id, { ...FormValues, ruleMode, rules: rules.map(prepareRule) })

      mutate((data) => {
        return {
          ...data,
          groups: [
            ...data!.groups,
            group
          ]
        }
      }, true)

      setOpen(false)
    } catch (err) {
      setAPIError(buildError(err))
      setLoading(false)
    }
  }

  const onUpdateClick: SubmitHandler<FormValues> = async (FormValues, e) => {
    e?.preventDefault()
    setLoading(true)
    setAPIError(null)

    try {
      const { group } = await updateGroup(activeGame.id, editingGroup!.id, { ...FormValues, ruleMode, rules: rules.map(prepareRule) })

      mutate((data) => {
        return {
          ...data,
          groups: data!.groups.map((existingGroup) => {
            if (existingGroup.id === group.id) return group
            return existingGroup
          })
        }
      }, true)

      setOpen(false)
    } catch (err) {
      setAPIError(buildError(err))
      setLoading(false)
    }
  }

  const onDeleteClick = async () => {
    /* v8ignore next */
    if (!window.confirm('Are you sure you want to delete this group?')) return

    setDeleting(true)
    setAPIError(null)

    try {
      await deleteGroup(activeGame.id, editingGroup!.id)

      mutate((data) => {
        return {
          ...data,
          groups: data!.groups.filter((existingGroup) => {
            return existingGroup.id !== editingGroup!.id
          })
        }
      }, false)

      setOpen(false)
    } catch (err) {
      setAPIError(buildError(err))
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

          <Controller
            control={control}
            name='membersVisible'
            render={({
              field: { onChange, value, ref }
            }) => (
              <div className='flex justify-between items-start'>
                <div>
                  <label htmlFor='members-visible' className='font-semibold'>Members visible</label>
                  <p className='text-sm text-gray-500'>If enabled, player data will be returned in the <Link to='https://docs.trytalo.com/docs/http/player-group-api?utm_source=dashboard&utm_medium=group-details-modal'>player group API</Link></p>
                </div>
                <div className='flex items-center space-x-4'>
                  <Toggle
                    id='members-visible'
                    inputRef={ref}
                    enabled={value}
                    onToggle={onChange}
                  />
                </div>
              </div>
            )}
          />

          <div>
            <p className='font-semibold mb-2'>Membership</p>
            <GroupRules
              ruleModeState={[ruleMode, setRuleMode]}
              rulesState={[rules, setRules]}
            />
          </div>

          {apiError && <ErrorMessage error={apiError} />}

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
              {canPerformAction(user, PermissionBasedAction.DELETE_GROUP) &&
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
