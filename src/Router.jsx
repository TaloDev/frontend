import React, { lazy } from 'react'
import PropTypes from 'prop-types'
import { Redirect, Route, Switch } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import userState from './state/userState'
import NavBar from './components/NavBar'
import routes from './constants/routes'
import activeGameState from './state/activeGameState'
import AuthService from './services/AuthService'
import canViewPage from './utils/canViewPage'

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

function Router({ intendedUrl }) {
  const user = useRecoilValue(userState)
  const activeGame = useRecoilValue(activeGameState)

  return (
    <div>
      {!AuthService.getToken() &&
        <main className='bg-gray-800 w-full'>
          <Switch>
            <Route exact path={routes.login} component={Login} />
            <Route exact path={routes.register} component={Register} />
            <Route exact path={routes.demo} component={Demo} />
            <Route exact path={routes.verify2FA} component={Verify2FA} />
            <Route exact path={routes.recover} component={RecoverAccount} />
            <Route exact path={routes.acceptInvite} component={AcceptInvite} />

            <Redirect to={`${routes.login}?next=${intendedUrl}`} />
          </Switch>
        </main>
      }

      {AuthService.getToken() &&
        <div className='w-full flex flex-col'>
          <NavBar />
          <main className='bg-gray-800 p-4 md:p-8 text-white'>
            <Switch>
              <Route exact path={routes.dashboard} component={Dashboard} />
              <Route exact path={routes.account} component={Account} />
              <Route exact path={routes.confirmPassword} component={ConfirmPassword} />
              {canViewPage(user, routes.organisation) && <Route exact path={routes.organisation} component={Organisation} />}

              {activeGame &&
                <>
                  <Route exact path={routes.players} component={Players} />
                  <Route exact path={routes.events} component={Events} />
                  {canViewPage(user, routes.apiKeys) && <Route exact path={routes.apiKeys} component={APIKeys} />}
                  <Route exact path={routes.playerProps} component={PlayerProps} />
                  <Route exact path={routes.playerEvents} component={PlayerEvents} />
                  {canViewPage(user, routes.dataExports) && <Route exact path={routes.dataExports} component={DataExports} />}
                  <Route exact path={routes.leaderboards} component={Leaderboards} />
                  <Route exact path={routes.leaderboardEntries} component={LeaderboardEntries} />
                  {canViewPage(user, routes.activity) && <Route exact path={routes.activity} component={Activity} />}
                  <Route exact path={routes.stats} component={Stats} />
                  <Route exact path={routes.playerStats} component={PlayerStats} />
                </>
              }

              <Redirect to={routes.dashboard} />
            </Switch>
          </main>
        </div>
      }
    </div>
  )
}

Router.propTypes = {
  intendedUrl: PropTypes.string
}

export default Router
