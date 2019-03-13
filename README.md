# Sample To File

> Takes a source file (sample file) containing a certain placeholder and replaces the placeholder with a given value and writes it to the destination file.

## Example

Real world example ;-). Lets say you have a local environment file called `environment.local.ts`. Whenever the local build is run the application uses this environment file which holds a base-url for the application's API calls. What if this base-url is for some reason dynamic? In this usecase it would be nice to add a flag to your `npm run build` which replaces a dynamic placeholder in the environment file with a given value. This is why I build the sample-to-file module.

Example:

1. Create a sample file called `environment.sample` and copy paste the contents of your `environment.local.ts` to this file.
2. For the dynamic value replace it with a custom placeholder surrounded by double curly brackets, like below:

```ts
// contents of the environment.local.ts
export const environment = {
  production: false,
  domain: {
    apiUrl: 'https://abcdefg.ngrok.io'
  }
};

// contents of the environment.sample
export const environment = {
  production: false,
  domain: {
    apiUrl: '{{apiUrl}}'
  }
};
```

```sh
$ stf --ph=apiUrl --value=https://hijklmnop.ngrok.io --src=./src/environments/environment.sample --dest=./src/environments/environment.local.ts
```

Et Voila! The cli command will replace the `{{apiUrl}}` placeholder in the `environment.sample` with the new value and will write it in the destination file.

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm i -D sample-to-file
```

## Usage

For this to work at least the sample file should exist and contain the desired placeholder WITH double curly brackets (see above examples).

```sh
$ stf --ph=placeholder --value=value-after-transformation --src=path/to/source.sample --dest=path/to/destination.js
```

### Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](../../issues/new).

### Author

**Marnix Harderwijk**

* [github/mrpharderwijk](https://github.com/mrpharderwijk)

### License

Copyright © 2017, [Marnix Harderwijk](https://github.com/mrpharderwijk).
Released under the [MIT License](LICENSE).