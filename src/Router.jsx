import { lazy } from 'react'
import PropTypes from 'prop-types'
import { Route, Routes } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import userState from './state/userState'
import NavBar from './components/NavBar'
import routes from './constants/routes'
import activeGameState from './state/activeGameState'
import AuthService from './services/AuthService'
import canViewPage from './utils/canViewPage'
import IntendedRouteHandler from './components/IntendedRouteHandler'

const Login = lazy(() => import(/* webpackChunkName: 'login' */ './pages/Login'))
const Dashboard = lazy(() => import(/* webpackChunkName: 'dashboard' */ './pages/Dashboard'))
const Events = lazy(() => import(/* webpackChunkName: 'events' */ './pages/Events'))
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

function Router({ intendedRoute }) {
  const user = useRecoilValue(userState)
  const activeGame = useRecoilValue(activeGameState)

  return (
    <>
      {!AuthService.getToken() &&
        <main className='bg-gray-800 w-full'>
          <Routes>
            <Route exact path={routes.login} element={<Login />} />
            <Route exact path={routes.register} element={<Register />} />
            <Route exact path={routes.demo} element={<Demo />} />
            <Route exact path={routes.verify2FA} element={<Verify2FA />} />
            <Route exact path={routes.recover} element={<RecoverAccount />} />
            <Route exact path={routes.acceptInvite} element={<AcceptInvite />} />
            <Route exact path={routes.forgotPassword} element={<ForgotPassword />} />
            <Route exact path={routes.resetPassword} element={<ResetPassword />} />

            <Route path='*' element={<IntendedRouteHandler intendedRoute={intendedRoute} />} />
          </Routes>
        </main>
      }

      {AuthService.getToken() &&
        <div className='w-full flex flex-col'>
          <NavBar />
          <main className='bg-gray-800 p-4 md:p-8 text-white'>
            <Routes>
              <Route exact path={routes.dashboard} element={<Dashboard />} />
              <Route exact path={routes.account} element={<Account />} />
              <Route exact path={routes.confirmPassword} element={<ConfirmPassword />} />
              {canViewPage(user, routes.organisation) && <Route exact path={routes.organisation} element={<Organisation />} />}
              {canViewPage(user, routes.billing) && <Route exact path={routes.billing} element={<Billing />} />}

              {activeGame &&
                <>
                  <Route exact path={routes.players} element={<Players />} />
                  <Route exact path={routes.events} element={<Events />} />
                  {canViewPage(user, routes.apiKeys) && <Route exact path={routes.apiKeys} element={<APIKeys />} />}
                  <Route exact path={routes.playerProps} element={<PlayerProps />} />
                  <Route exact path={routes.playerEvents} element={<PlayerEvents />} />
                  {canViewPage(user, routes.dataExports) && <Route exact path={routes.dataExports} element={<DataExports />} />}
                  <Route exact path={routes.leaderboards} element={<Leaderboards />} />
                  <Route exact path={routes.leaderboardEntries} element={<LeaderboardEntries />} />
                  {canViewPage(user, routes.activity) && <Route exact path={routes.activity} element={<Activity />} />}
                  <Route exact path={routes.stats} element={<Stats />} />
                  <Route exact path={routes.playerStats} element={<PlayerStats />} />
                  {canViewPage(user, routes.integrations) && <Route exact path={routes.integrations} element={<Integrations />} />}
                  <Route exact path={routes.groups} element={<Groups />} />
                  {canViewPage(user, routes.gameProps) && <Route exact path={routes.gameProps} element={<GameProps />} />}
                  <Route exact path={routes.playerProfile} element={<PlayerProfile />} />
                  <Route exact path={routes.playerLeaderboardEntries} element={<PlayerLeaderboardEntries />} />
                  <Route exact path={routes.playerSaveContent} element={<PlayerSaveContent />} />
                  <Route exact path={routes.playerSaves} element={<PlayerSaves />} />
                </>
              }

              <Route path='*' element={<NotFound />} />
            </Routes>
          </main>
        </div>
      }
    </>
  )
}

Router.propTypes = {
  intendedRoute: PropTypes.string
}

export default Router
