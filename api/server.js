const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const authmw = require('../auth/authenticate-middleware.js');
const authRouter = require('../auth/auth-router.js');
const jokesRouter = require('../jokes/jokes-router.js');

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());

server.use('/api/auth', authRouter);
server.use('/api/jokes', authmw.loginValid('normal'), jokesRouter);

module.exports = server;
