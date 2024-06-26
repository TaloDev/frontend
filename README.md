# Talo dashboard

Talo's dashboard lets you see your players and interact with your game directly.

## Features
- ⚡️ [Event tracking](https://trytalo.com/events)
- 👥 [Player management](https://trytalo.com/players) (including cross-session data, groups and identity management)
- 🎮 [Unity package](https://trytalo.com/unity)
- 🎮 [Godot plugin](https://trytalo.com/godot)
- 🗃️ Data exports
- 🕹️ [Leaderboards](https://trytalo.com/leaderboards)
- 💾 [Game saves](https://trytalo.com/saves)
- 📊 [Game stats](https://trytalo.com/stats) (global and per-player)
- ⚙️ [Live config](https://trytalo.com/live-config) (update your game config from the web, no releases required)
- 🔧 [Steamworks integration](https://trytalo.com/steamworks-integration)
- 💬 [Game feedback](https://trytalo.com/feedback)

## Docs

Our docs are [available here](https://docs.trytalo.com).

## Self-hosting

See the [self-hosting docs](https://docs.trytalo.com/docs/selfhosting/overview) and the [self-hosting example repo](https://github.com/TaloDev/hosting).

## Discord

For help and support, [join our Discord](https://discord.gg/2RWwxXVY3v).

## Installing, building & running

Run `npm install` to install the dependencies.

### npm run dev

Runs the app in the development mode.
Open http://localhost:8080 to view it in the browser.

### npm run build

Builds a static copy of the site to the `dist/` folder.

## Docker?

We use Docker to build a production image of the dashboard (which is a simple NGINX server that hosts the static build files). It's not needed for development.
