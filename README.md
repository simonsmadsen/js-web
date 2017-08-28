# js-web

Javascript framework for building websites.

Docs: https://js-web-framework.com

## Getting Started

### Installing

```
npm install js-web
```

### Examples
Route displaying a html file
```
const web = require('js-web')

const injections = [
  web.inject.jquery(),
  web.inject.bootstrap(),
  web.inject.react('react/index.jsx','app')
]

web.htmlRoute('/','index.html', _ => {
 return {users: await users.select()}
},injections)

web.start()
```
Get route returning players
```
const web = require('js-web')

const playerTable = web.storage.mysql.table('players')
web.htmlRoute('/','index.html', async (input) => {
	const players = await playerTable.select()
    return players
})
web.start()

```
