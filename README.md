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

## Example

#### `config.js`

```js
module.exports =
{
  routes:
  [
    {
      endpoint  : '@superhero/core.resource',
      policy    : /^\/resource\/.+/
    },
    // ...
  ],
  // ...
}
```