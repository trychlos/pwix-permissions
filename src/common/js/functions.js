/*
 * pwix:permissions/src/common/js/functions.js
 */

Permissions._tasks = {};

Permissions.set = function({ definitions }){

};

Permissions.isAllowed = async function( task, userId=null ){
    const allowed = true;
    if( allowed && ( Permissions.configure().verbosity & Permissions.C.Verbose.ALLOWED )){
        console.log( 'pwix:permissions', 'task='+task, 'userId='+userId, 'allowed='+allowed );
    }
    if( !allowed && ( Permissions.configure().verbosity & Permissions.C.Verbose.NOT_ALLOWED )){
        console.log( 'pwix:permissions', 'task='+task, 'userId='+userId, 'allowed='+allowed );
    }
    return allowed;
};
