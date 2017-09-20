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
const {
    htmlRoute,
    inject,
    start
} = require('js-web')

const injections = [
  inject.jquery(),
  inject.bootstrap(),
  inject.react('react/index.jsx','app')
]

htmlRoute('/','index.html', _ => {
 return {users: await users.select()}
},injections)

start()
```
Get route returning players
```
const {
    htmlRoute,
    start,
    storage
} = require('js-web')

const { local, mysql } = storage
const playerTable = mysql.table('players')

htmlRoute('/','index.html', async (input) => {
	const players = await playerTable.select()
    return players
})
start()
```
