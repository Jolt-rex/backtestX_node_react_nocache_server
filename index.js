const winston = require('winston');
const express = require('express');
const app = express();
const cors = require('cors');

require('./startup/config')();
require('./startup/logging')();
require('./startup/database')();
require('./startup/routes')(app);
require('./startup/production')(app);

app.use(cors);

const port = process.env.PORT || 7373;
const server = app.listen(port, () => {
    winston.info(`Listening on port ${port}..`);
});

module.exports = server;