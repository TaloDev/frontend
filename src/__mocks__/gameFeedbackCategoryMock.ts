import { GameFeedbackCategory } from '../entities/gameFeedbackCategory'

export default function gameFeedbackCategoryMock(
  extra: Partial<GameFeedbackCategory> = {},
): GameFeedbackCategory {
  return {
    id: 1,
    internalName: 'bugs',
    name: 'Bugs',
    description: 'Bug reports',
    anonymised: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...extra,
  }
}
