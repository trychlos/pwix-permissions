/*
 * pwix:permissions/src/common/js/functions.js
 */

import _ from 'lodash';

Permissions._tasks = {};

Permissions._getAllowFn = function( task ){
    const words = task.split( '.' );
    let taskobj = Permissions._tasks;
    let allowFn = null;
    // try by splitting the dot.name
    words.every(( it ) => {
        if( taskobj[it] ){
            if( _.isFunction( taskobj[it] )){
                allowFn = taskobj[it];
            } else if( _.isObject( taskobj[it] )){
                taskobj = taskobj[it];
            } else {
                console.error( 'unmanaged task definition while expecting a function or an object', taskobj[it] );
            }
        }
        return allowFn === null;
    });
    // if not found, then try without the split
    if( !allowFn ){
        allowFn = Permissions._tasks[task] || null;
    }
    return allowFn;
};

// expects either an object or a 'task, allowfn' arguments
Permissions.set = function( defs ){
    if( _.isObject( defs )){
        Permissions._tasks = _.merge( Permissions._tasks, defs );
    } else if( arguments.length === 2 ){
        const task = arguments[0];
        const allowFn = arguments[1];
        Permissions._tasks[task] = allowFn;
    } else {
        console.error( 'Permissions.set() expects an object or a ( task<String>, allowfn<async Function> ) arguments list' );
    }
};

/**
 * @param {String} task can be dot.named 
 * @param {Object|String} user either a user identifier or a user document, mandatory server side, defaulting client side to current user
 * @returns {Boolean} whether the user is allowed to do that
 */
Permissions.isAllowed = async function( task, userId=null ){
    let allowed = true;
    if( Meteor.isClient && !userId ){
        userId = Meteor.userId();
    }
    const allowFn = Permissions._getAllowFn( task );
    if( allowFn ){
        let args = [ ...arguments ];
        args.shift(); // remove task
        args.shift(); // remove userId which may have been modified
        allowed = await allowFn( userId, ...args );
    } else {
        allowed = Permissions.configure().allowedIfTaskNotFound;
        if( Permissions.configure().warnIfTaskNotFound ){
            console.warn( 'pwix:permissions', 'task not found:', task );
        }
    }
    if( allowed && ( Permissions.configure().verbosity & Permissions.C.Verbose.ALLOWED )){
        console.log( 'pwix:permissions', 'task='+task, 'userId='+userId, 'allowed='+allowed );
    }
    if( !allowed && ( Permissions.configure().verbosity & Permissions.C.Verbose.NOT_ALLOWED )){
        console.log( 'pwix:permissions', 'task='+task, 'userId='+userId, 'allowed='+allowed );
    }
    return allowed;
};
