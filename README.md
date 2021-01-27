[![Build Status](https://travis-ci.org/{{github-user-name}}/{{github-app-name}}.svg?branch=main)](https://travis-ci.org/{{github-user-name}}/{{github-app-name}}.svg?branch=main)
[![Coverage Status](https://coveralls.io/repos/github/{{github-user-name}}/{{github-app-name}}/badge?branch=main)](https://coveralls.io/github/{{github-user-name}}/{{github-app-name}}?branch=main)
[![MIT license](https://img.shields.io/badge/license-GPL%203.0-brightgreen)](http://opensource.org/licenses/MIT)

# ReadEx
> Readable regular expressions

See `demo.js` for an example of the ways ReadEx can improve an ugly,
unreadable regular expression.

## Goals

1. **Composability.** ReadExes should be able to combine other ReadExes so indiviual component patterns can be named and reused.
2. **Free Formatting.** ReadExes should only pay attention to whitespace when it is explicitly quoted and called out. All other whitespace should be ignored to allow free formatting by the programmer.
3. **Verbosity.** ReadExes should use full names rather than obscure symbols and single letters to denote patterns and operations. Comments should be allowed.

## Using this module in other modules

Here is a quick example of how this module can be used in other modules. The [TypeScript Module Resolution Logic](https://www.typescriptlang.org/docs/handbook/module-resolution.html) makes it quite easy. The file `src/index.ts` is a [barrel](https://basarat.gitbooks.io/typescript/content/docs/tips/barrel.html) that re-exports selected exports from other files. The _package.json_ file contains `main` attribute that points to the generated `lib/index.js` file and `typings` attribute that points to the generated `lib/index.d.ts` file.

> If you are planning to have code in multiple files (which is quite natural for a NodeJS module) that users can import, make sure you update `src/index.ts` file appropriately.

Now assuming you have published this amazing module to _npm_ with the name `my-amazing-lib`, and installed it in the module in which you need it -

- To use the `Greeter` class in a TypeScript file -

```ts
import { Greeter } from "my-amazing-lib";

const greeter = new Greeter("World!");
greeter.greet();
```

- To use the `Greeter` class in a JavaScript file -

```js
const Greeter = require('my-amazing-lib').Greeter;

const greeter = new Greeter('World!');
greeter.greet();
```

## Setting travis and coveralls badges
1. Sign in to [travis](https://travis-ci.org/) and activate the build for your project.
2. Sign in to [coveralls](https://coveralls.io/) and activate the build for your project.
3. Replace {{github-user-name}}/{{github-app-name}} with your repo details like: "ospatil/generator-node-typescript".

--------------------------------------------------------------------------------

This project was initialized with [generator-node-typescript](https://github.com/ospatil/generator-node-typescript)
