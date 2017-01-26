# branch-pipe v1.0.0

[![CircleCI](https://circleci.com/gh/kt3k/branch-pipe.svg?style=svg)](https://circleci.com/gh/kt3k/branch-pipe)
[![codecov](https://codecov.io/gh/kt3k/branch-pipe/branch/master/graph/badge.svg)](https://codecov.io/gh/kt3k/branch-pipe)
[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](http://standardjs.com/)
[![Greenkeeper badge](https://badges.greenkeeper.io/kt3k/branch-pipe.svg)](https://greenkeeper.io/)

> Simple syntax for branching and merging a stream

# :cd: Install

    npm i branch-pipe

# Feature

With this module, you can branch the input stream into any number of branches and transform them in different way branch by branch, and then merge the all the results.

# Example

For example, when you're working with gulp:

```js
const branch = require('branch-pipe')
const gulp = require('gulp')

gulp.src('src/**/*.md')
  .pipe(branch(src => [
    src.pipe(foo()),
    src.pipe(bar()),
    src.pipe(baz())
  ]))
  .pipe(gulp.dest('dist'));
```

The above splits the input stream `gulp.src('src/**/*.md')` into 3 different branches, and transform it with 3 different ways `foo()`, `bar()` and `baz()`.

The above is equivalent of the below:

```js
gulp.src('src/**/*.md')
  .pipe(foo())
  .pipe(gulp.dest('dist'));

gulp.src('src/**/*.md')
  .pipe(bar())
  .pipe(gulp.dest('dist'));

gulp.src('src/**/*.md')
  .pipe(baz())
  .pipe(gulp.dest('dist'));
```

That's it.

# API

```js
const branch = require('branch-pipe');
```

## branch([options,] func)

- @param {Object} options - The options
- @param {boolean} options.objectMode - Set this true when you're working with object stream. default is false.
- @param {number} options.highWaterMark - The high water mark of this stream.
- @param {Function} func - The branch description function
- @return {Transform}

This takes one argument `func` and it should return an array of readable streams. The returned streams are joined into a single stream and its output becomes the output of the returned transform stream of the entire call.

For example:

```js
const transform = branch(src => [src.pipe(foo()), src.pipe(bar())])
```

`transform` is a transform stream. Inputs are piped into both `foo()` and `bar()` and the outputs are the merged stream of the outputs of both `foo()` and `bar()`.

## branch.obj([options,] func)

The shorthand for the object mode of the above. The behavior is the same as the above exceptthat default of options.objectMode is `true` and default of options.highWaterMark is `16`.

# License

MIT
