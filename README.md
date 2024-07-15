# pwix:permissions

## What is it ?

A Meteor package which provides the thinnest Javascript permissions manager.

### Rationale

An application, or at least the applications I use to write, typically use the `alanning:roles` roles, which I find practical to extend in `pwix:roles` package.

But a bunch of permissions are actually involved into applications which would be a minimal itself involved in security management: permission to run such or sunch method on such or such object, permission to subscribe to a publication with such and sunch arguments, and so on.

This may be rather complex, and, even if you are using roles in your application, you may not always want use these roles to manages which can be called technical permissions.

This package tries to provide an extensible interface to let:

- other packages provide suggested permissions

- application centralyze all code to compute the permissions.

Basically, all permissions managed here are defined by a single string which is expected to identify the to-be-run task, a user on behalf the task will be executed, and, maybe some additional arguments.

The question is rather simple: this user is he/she allowed to do this task (with these arguments) ? And the answer is given by our allow function.


## Installation

As simple as:

```sh
    meteor add pwix:permissions
```

## Usage

When this package is added to your application, it provides a `Permissions.isAllowed()` function which defaults to always return `true`.

Your application, or your calling packages, should define for each task the computing function by calling `Permissions.set()` function.

Example:

```js
    Permissions.set( 'my_task', ( userId ) => async {
        return userId !== null;
    });
```

or:

```js
    Permissions.set({
        async my_first_task( userId ){
            return userId !== null;
        },
        async my_second_task( userId, arg ){
            return userId !== null && await isSuitable( arg );
        }
    });
```

Then the compatible callers just have to do:

```js
    const allowed = await Permissions.isAllowed( 'my_task', this.userId );
```

## What does it provide ?

### `Permissions`
The globally exported object.

#### Functions

##### `Permissions.configure( o<Object> )`

See [below](#configuration)

##### `Permissions.isAllowed( task, userId )`

An async function which returns `true` if the `userId` is allowed to execute the given `task`.

##### `Permissions.set( task, async fn<Function> )`

##### `Permissions.set( o<Object> )`

Feeds the task referentiel with a task and its allow function, or with a list of tasks and their allowed functions.

All calls to `Permissions.set()` are cumulative.

## Task naming and tasks namespace

At the application level, all tasks share the same single namespace.

You - as a code writer - should name your tasks so that you do not risk a name collision between your packages and your application.

As a writing facility, this package considers that dot.named tasks are organized as hierachical objects, so that allow functions for the `my.task.first` and `my.task.second` tasks can be set as:

```js
    Permissions.set({
        my: {
            task: {
                async first( userId ){
                    return userId !== null;
                },
                async second( userId, arg ){
                    return userId !== null && await isSuitable( arg );
                }
            }
        }
    });
```

as well as:

```js
    Permissions.set({
        async 'my.task.first'( userId ){
            return userId !== null;
        },
        async 'my.task.second'( userId ){
            return userId !== null && await isSuitable( arg );
        }
    });
```

## Configuration

The package's behavior can be configured through a call to the `Permissions.configure()` method, with just a single javascript object argument, which itself should only contains the options you want override.

Known configuration options are:

- `verbosity`

    The verbosity level as:

    - `Permissions.C.Verbose.NONE`
    
    or an OR-ed value of integer constants:

    - `Permissions.C.Verbose.CONFIGURE`

        Trace configuration operations

    Defaults to `Permissions.C.Verbose.CONFIGURE`.

Remind too that Meteor packages are instanciated at application level. They are so only configurable once, or, in other words, only one instance has to be or can be configured. Addtionnal calls to `Permissions.configure()` will just override the previous one. You have been warned: **only the application should configure a package**.

## NPM peer dependencies

Starting with v 1.0.0, and in accordance with advices from [the Meteor Guide](https://guide.meteor.com/writing-atmosphere-packages.html#peer-npm-dependencies), we no more hardcode NPM dependencies in the `Npm.depends` clause of the `package.js`. 

Instead we check npm versions of installed packages at runtime, on server startup, in development environment.

Dependencies as of v 2.1.0:
```
    '@popperjs/core': '^2.11.6',
    'bootstrap': '^5.2.1',
    'lodash': '^4.17.0'
```

Each of these dependencies should be installed at application level:
```
    meteor npm install <package> --save
```

## Translations

None at the moment.

## Cookies and comparable technologies

None at the moment.

---
P. Wieser
- Last updated on 2024, Jul. 10th
