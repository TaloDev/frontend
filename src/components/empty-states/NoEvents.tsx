import { EmptyStateButtons, EmptyStateContent, EmptyStateTitle } from './EmptyState'

export function NoEvents() {
  return (
    <div className='mb-20 space-y-4 lg:mb-0'>
      <EmptyStateTitle>There are no events for this date range</EmptyStateTitle>
      <EmptyStateContent className='lg:w-1/2'>
        Event tracking is a simple way to understand your players and their actions. When you track
        an event, you can see how often it happens, when it happens and drill-down into its details.
      </EmptyStateContent>
      <EmptyStateButtons
        className='justify-start'
        learnMoreLink='https://trytalo.com/events'
        docs={{
          api: 'https://docs.trytalo.com/docs/http/event-api',
          godot: 'https://docs.trytalo.com/docs/godot/events',
          unity: 'https://docs.trytalo.com/docs/unity/events',
        }}
      />
    </div>
  )
}
