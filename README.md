[![Build Status](https://ci.tagcreativestudio.com/buildStatus/icon?job=grunt-translate-html)](https://ci.tagcreativestudio.com/job/grunt-translate-html/)

# grunt-translate-html

> An HTML preprocessor that translates strings from one language to another

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. 

Install this plugin with this command:

```shell
npm install grunt-translate-html --save-dev
```

Once the plugin has been installed, it can be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-translate-html');
```

## The "translate" task

Run this task in the command line with `grunt translate`

This task parses over an HTML file, and swaps out text contents based on an i18n.json.

### Overview
In your project's Gruntfile, add a section named `translate` to the data object passed into `grunt.initConfig()`. This data object can then be configured with the following options:


### Options

#### locale
Type: String, default value: `'en_US'`

This is the string name of the folder that holds your translation strings. Such a folder should contain a file called `i18n.json` which holds your translation values. This can be generated using the grunt task `grunt-locales`, [which can be found here.](https://github.com/blueimp/grunt-locales)

#### pathToLocFolders
Type: String, Default value: null

This is the string name of the folder that holds your locale folders. This is differentiated from the `locale` option in order to allow quick changes from one translation to another

### Files


The two file options available are `src` and `dest`. For more information on these options, see Grunt's [Configuring Tasks](http://gruntjs.com/configuring-tasks) guide

## Usage Example


```js
grunt.initConfig({
  translate: {
      options: {
        locale: 'de_DE',
        pathToLocFolders: 'tmp/test/fixtures/locales/',
      },
      files: {
          src: 'tmp/fixtures/**/*.html',
          dest: 'tmp/output/',
        },
    },
});
```

## Dependencies

This task makes use of the following dependencies for parsing and testing:

- [htmlparser2](https://github.com/fb55/htmlparser2)
- [assert](https://www.npmjs.com/package/assert)
- [jsonschema](https://www.npmjs.com/package/jsonschema)
- [html5-lint](https://github.com/mozilla/html5-lint)
- [grunt-mocha-test](https://github.com/pghalliday/grunt-mocha-test)
