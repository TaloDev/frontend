import routes from './routes'

export const secondaryNavRoutes = [
  { title: 'Dashboard', to: routes.dashboard },
  { title: 'Activity log', to: routes.activity },
  { title: 'Game settings', to: routes.gameSettings },
  { title: 'Organisation', to: routes.organisation },
  { title: 'Billing', to: routes.billing },
]

export const eventsSecondaryNavRoutes = [
  { title: 'Events overview', to: routes.eventsOverview },
  { title: 'Event funnels', to: routes.eventsFunnels },
  { title: 'Event catalogue', to: routes.eventsCatalogue },
]
