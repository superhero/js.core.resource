# Core › Resource

Licence: [MIT](https://opensource.org/licenses/MIT)

---

[![npm version](https://badge.fury.io/js/%40superhero%2Fcore.resource.svg)](https://badge.fury.io/js/%40superhero%2Fcore.resource)

This is an addon module to the [superhero/core](https://github.com/superhero/js.core) module. This addon is a simple dispatcher that can be used to serve public resources.

## Install

`npm install @superhero/core.resource`

...or just set the dependency in your `package.json` file:

```json
{
  "dependencies":
  {
    "@superhero/core.resource": "*"
  }
}
```

## Example Application

### Example Application › File structure

```
App
├── view
│   ├── resource
│   │   └── js
│   │       └── foo.js
|   └── config.js
├── index.js
└── package.json
```

#### `package.js`

```js
{
  "name": "Super Duper App",
  "version": "0.0.1",
  "description": "An example meant to describe the libraries fundamentals",
  "license": "MIT",
  "dependencies": {
    "superhero": "*",
    "@superhero/core.resource": "*"
  }
}

```

#### `config.js`

```js
module.exports =
{
  core:
  {
    resource:
    {
      directory: 'view'
    },
    http:
    {
      server:
      {
        routes:
        {
          resource:
          {
            url       : '/resource/.+',
            endpoint  : '@superhero/core.resource',
            input     : false
          }
        }
      }
    }
  }
}
```

#### `index.js`

```js
const
CoreFactory = require('superhero/core/factory'),
coreFactory = new CoreFactory,
core        = coreFactory.create()

core.add('view')
core.add('@superhero/core.resource')

core.load()

core.locate('bootstrap').bootstrap().then(() =>
core.locate('http/server').listen(process.env.HTTP_PORT))
```
