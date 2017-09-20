const {
    route,
    start
} = require('js-web')

route('/', async (input, session) => {
return {hello: 'world'}
})

start()