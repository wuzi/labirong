var config = {};

config.port = process.env.PORT || 8080;

config.SIZE_X = process.env.SIZE_X || 64;
config.SIZE_Y = process.env.SIZE_Y || 64;

module.exports = config;