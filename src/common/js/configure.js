/*
 * pwix:permissions/src/common/js/configure.js
 */

import _ from 'lodash';

import { ReactiveVar } from 'meteor/reactive-var';

let _conf = {};

const _defaults = {
    allowedIfTaskNotFound: true,
    warnIfTaskNotFound: true,
    verbosity: Permissions.C.Verbose.CONFIGURE
};

/**
 * @summary Package configuration
 *  Should be called *in same terms* both by the client and the server.
 * @locus Anywhere
 * @param {Object} o the runtime configuration of the package
 * @returns {Object} the package configuration
 */
Permissions.configure = function( o ){
    if( o && _.isObject( o )){
        _conf = _.merge( _defaults, _conf, o );
        Permissions._conf.set( _conf );
        // be verbose if asked for
        if( Permissions._conf.verbosity & Permissions.C.Verbose.CONFIGURE ){
            console.log( 'pwix:permissions configure() with', o );
        }
    }
    // also acts as a getter
    return Permissions._conf.get();
};

_conf = _.merge( {}, Permissions._defaults );
Permissions._conf = new ReactiveVar( _conf );
