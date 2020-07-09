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

## Routes
### General
|path|description|
|:-|:-|
|`/`|show all routes|
|`/patreon`|send patreon updates to discord|

### GitHub
|path|description|
|:-|:-|
|`/github/repos`|get pinned repos|

### Discord
|path|description|
|:-|:-|
|`/discord/callback`||
|`/discord/login`||
|`/discord/revoke`||

### Jeanne
|path|description|
|:-|:-|
|`/jeanne/donators`|get jeanne donators|
|`/jeanne`|get settings/commands|
|`/jeanne/profile`|get user profile image|