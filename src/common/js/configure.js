/*
 * pwix:permissions/src/common/js/configure.js
 */

import _ from 'lodash';

import { ReactiveVar } from 'meteor/reactive-var';

let _conf = {};
Permissions._conf = new ReactiveVar( _conf );

Permissions._defaults = {
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
        // check that keys exist
        let built_conf = {};
        Object.keys( o ).forEach(( it ) => {
            if( Object.keys( Permissions._defaults ).includes( it )){
                built_conf[it] = o[it];
            } else {
                console.warn( 'pwix:permissions configure() ignore unmanaged key \''+it+'\'' );
            }
        });
        if( Object.keys( built_conf ).length ){
            _conf = _.merge( Permissions._defaults, _conf, built_conf );
            Permissions._conf.set( _conf );
            // be verbose if asked for
            if( _conf.verbosity & Permissions.C.Verbose.CONFIGURE ){
                console.log( 'pwix:permissions configure() with', built_conf );
            }
        }
    }
    // also acts as a getter
    return Permissions._conf.get();
};

_conf = _.merge( {}, Permissions._defaults );
Permissions._conf.set( _conf );
