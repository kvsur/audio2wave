const Express = require('express');
const path = require('path');

const App = Express();

const PORT = 3000;

App.use(Express.static(path.resolve(__dirname, './')))

App.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
})