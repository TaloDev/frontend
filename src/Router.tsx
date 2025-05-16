import { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import NavBar from './components/NavBar'
import routes from './constants/routes'
import AuthService from './services/AuthService'
import canViewPage from './utils/canViewPage'
import IntendedRouteHandler from './components/IntendedRouteHandler'
import userState from './state/userState'
import activeGameState from './state/activeGameState'
import Footer from './components/Footer'

const Login = lazy(() => import(/* webpackChunkName: 'login' */ './pages/Login'))
const Dashboard = lazy(() => import(/* webpackChunkName: 'dashboard' */ './pages/Dashboard'))
const EventsOverview = lazy(() => import(/* webpackChunkName: 'events-overview' */ './pages/EventsOverview'))
const Players = lazy(() => import(/* webpackChunkName: 'players' */ './pages/Players'))
const Register = lazy(() => import(/* webpackChunkName: 'register' */ './pages/Register'))
const PlayerProps = lazy(() => import(/* webpackChunkName: 'player-props' */ './pages/PlayerProps'))
const APIKeys = lazy(() => import(/* webpackChunkName: 'api-keys' */ './pages/APIKeys'))
const PlayerEvents = lazy(() => import(/* webpackChunkName: 'player-events' */ './pages/PlayerEvents'))
const Demo = lazy(() => import(/* webpackChunkName: 'demo' */ './pages/Demo'))
const DataExports = lazy(() => import(/* webpackChunkName: 'data-exports' */ './pages/DataExports'))
const Leaderboards = lazy(() => import(/* webpackChunkName: 'leaderboards' */ './pages/Leaderboards'))
const LeaderboardEntries = lazy(() => import(/* webpackChunkName: 'leaderboard-entries' */ './pages/LeaderboardEntries'))
const Account = lazy(() => import(/* webpackChunkName: 'account' */ './pages/Account'))
const ConfirmPassword = lazy(() => import(/* webpackChunkName: 'confirm-password' */ './pages/ConfirmPassword'))
const Verify2FA = lazy(() => import(/* webpackChunkName: 'verify-2FA' */ './pages/Verify2FA'))
const RecoverAccount = lazy(() => import(/* webpackChunkName: 'recover-account' */ './pages/RecoverAccount'))
const Activity = lazy(() => import(/* webpackChunkName: 'activity' */ './pages/Activity'))
const Stats = lazy(() => import(/* webpackChunkName: 'stats' */ './pages/Stats'))
const PlayerStats = lazy(() => import(/* webpackChunkName: 'player-stats' */ './pages/PlayerStats'))
const AcceptInvite = lazy(() => import(/* webpackChunkName: 'accept-invite' */ './pages/AcceptInvite'))
const Organisation = lazy(() => import(/* webpackChunkName: 'organisation' */ './pages/Organisation'))
const Billing = lazy(() => import(/* webpackChunkName: 'billing' */ './pages/Billing'))
const Integrations = lazy(() => import(/* webpackChunkName: 'integrations' */ './pages/Integrations'))
const Groups = lazy(() => import(/* webpackChunkName: 'groups' */ './pages/Groups'))
const GameProps = lazy(() => import(/* webpackChunkName: 'game-props' */ './pages/GameProps'))
const PlayerProfile = lazy(() => import(/* webpackChunkName: 'player-profile' */ './pages/PlayerProfile'))
const PlayerLeaderboardEntries = lazy(() => import(/* webpackChunkName: 'player-leaderboard-entries' */ './pages/PlayerLeaderboardEntries'))
const ForgotPassword = lazy(() => import(/* webpackChunkName: 'forgot-password' */ './pages/ForgotPassword'))
const ResetPassword = lazy(() => import(/* webpackChunkName: 'reset-password' */ './pages/ResetPassword'))
const PlayerSaves = lazy(() => import(/* webpackChunkName: 'player-saves' */ './pages/PlayerSaves'))
const PlayerSaveContent = lazy(() => import(/* webpackChunkName: 'player-save-content' */ './pages/PlayerSaveContent'))
const NotFound = lazy(() => import(/* webpackChunkName: 'not-found' */ './pages/NotFound'))
const Feedback = lazy(() => import(/* webpackChunkName: 'feedback' */ './pages/Feedback'))
const FeedbackCategories = lazy(() => import(/* webpackChunkName: 'feedback-categories' */ './pages/FeedbackCategories'))
const Channels = lazy(() => import(/* webpackChunkName: 'channels' */ './pages/Channels'))
const EventBreakdown = lazy(() => import(/* webpackChunkName: 'event-breakdown' */ './pages/EventBreakdown'))
const GameSettings = lazy(() => import(/* webpackChunkName: 'game-settings */ './pages/GameSettings'))

type RouterProps = {
  intendedRoute: string | null
}

function Router({
  intendedRoute
}: RouterProps) {
  const user = useRecoilValue(userState)
  const activeGame = useRecoilValue(activeGameState)

  return (
    <>
      {!AuthService.getToken() &&
        <div className='w-full flex flex-col'>
          <main className='bg-gray-800 w-full md:py-16 lg:py-32'>
            <Routes>
              <Route path={routes.login} element={<Login />} />
              <Route path={routes.register} element={<Register />} />
              <Route path={routes.demo} element={<Demo />} />
              <Route path={routes.verify2FA} element={<Verify2FA />} />
              <Route path={routes.recover} element={<RecoverAccount />} />
              <Route path={routes.acceptInvite} element={<AcceptInvite />} />
              <Route path={routes.forgotPassword} element={<ForgotPassword />} />
              <Route path={routes.resetPassword} element={<ResetPassword />} />

              <Route path='*' element={<IntendedRouteHandler intendedRoute={intendedRoute} />} />
            </Routes>
          </main>
          <Footer />
        </div>
      }

      {AuthService.getToken() &&
        <div className='w-full flex flex-col'>
          <NavBar />
          <main className='bg-gray-800 p-4 md:p-8 md:pb-16 lg:pb-32 text-white'>
            <Routes>
              <Route path={routes.dashboard} element={<Dashboard />} />
              <Route path={routes.account} element={<Account />} />
              <Route path={routes.confirmPassword} element={<ConfirmPassword />} />
              {canViewPage(user, routes.organisation) && <Route path={routes.organisation} element={<Organisation />} />}
              {canViewPage(user, routes.billing) && <Route path={routes.billing} element={<Billing />} />}

              {activeGame &&
                <>
                  <Route path={routes.players} element={<Players />} />
                  <Route path={routes.eventsOverview} element={<EventsOverview />} />
                  {canViewPage(user, routes.apiKeys) && <Route path={routes.apiKeys} element={<APIKeys />} />}
                  <Route path={routes.playerProps} element={<PlayerProps />} />
                  <Route path={routes.playerEvents} element={<PlayerEvents />} />
                  {canViewPage(user, routes.dataExports) && <Route path={routes.dataExports} element={<DataExports />} />}
                  <Route path={routes.leaderboards} element={<Leaderboards />} />
                  <Route path={routes.leaderboardEntries} element={<LeaderboardEntries />} />
                  {canViewPage(user, routes.activity) && <Route path={routes.activity} element={<Activity />} />}
                  <Route path={routes.stats} element={<Stats />} />
                  <Route path={routes.playerStats} element={<PlayerStats />} />
                  {canViewPage(user, routes.integrations) && <Route path={routes.integrations} element={<Integrations />} />}
                  <Route path={routes.groups} element={<Groups />} />
                  {canViewPage(user, routes.gameProps) && <Route path={routes.gameProps} element={<GameProps />} />}
                  <Route path={routes.playerProfile} element={<PlayerProfile />} />
                  <Route path={routes.playerLeaderboardEntries} element={<PlayerLeaderboardEntries />} />
                  <Route path={routes.playerSaveContent} element={<PlayerSaveContent />} />
                  <Route path={routes.playerSaves} element={<PlayerSaves />} />
                  <Route path={routes.feedback} element={<Feedback />} />
                  {canViewPage(user, routes.feedbackCategories) && <Route path={routes.feedbackCategories} element={<FeedbackCategories />} />}
                  <Route path={routes.channels} element={<Channels />} />
                  <Route path={routes.eventBreakdown} element={<EventBreakdown />} />
                  {canViewPage(user, routes.gameSettings) && <Route path={routes.gameSettings} element={<GameSettings />} />}
                </>
              }

              <Route path='*' element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      }
    </>
  )
}

export default Router
