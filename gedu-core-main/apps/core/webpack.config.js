const getSharedConfig = require('../../webpack.shared');


/**
 * This file is now a simple pass-through to the shared webpack configuration.
 * The shared config function is called with this app's name ('core'),
 * and the resulting function is exported for Nx to use.
 */
module.exports = getSharedConfig('core'); 