# Apollo
Private API Service

## Usage
- clone: `git clone git@github.com:KurozeroPB/Apollo.git`
- install dependencies: `npm install`
- test: `npm run dev`
- run: `npm run start`
- build: `npm run build`

## Info
- dev will run on http://localhost:3000
- prod will run on http://localhost:8081
- (/) redirects to https://vdbroek.dev
- (/api) is all the api routes

## API Routes
### General
|path|description|
|:-|:-|
|`/`|show all routes|
|`/patreon`|send patreon updates to discord|

### GitHub
|path|description|
|:-|:-|
|`/github/pinned`|get pinned repos|

### Discord
|path|description|
|:-|:-|
|`/discord/callback`|handle discord's response and redirect user back to the website|
|`/discord/login`|redirect user to discord's oauth login page|
|`/discord/revoke`|revoke authorised user's token|

### Jeanne
|path|description|
|:-|:-|
|`/jeanne/donators`|get jeanne's donators|
|`/jeanne`|get settings/commands|
|`/jeanne/profile`|get user profile image|