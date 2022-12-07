const config = require('config');

module.exports = function() {
    if(!config.get('jwtPrivateKey'))
        throw new Error('FATAL ERROR: jwtPrivateKey has not been set');

    console.log(config.get('jwtPrivateKey'));
};