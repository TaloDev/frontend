import { Organisation, statusSchema } from '../entities/organisation'

export default function organisationMock(extra: Partial<Organisation> = {}): Organisation {
  return {
    id: 1,
    name: 'Sleepy Studios',
    games: [],
    pricingPlan: {
      status: statusSchema.enum.active,
    },
    ...extra,
  }
}
