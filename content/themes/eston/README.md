### Ghost Eston

> A simple, notebook inspired, theme for Ghost. Includes four colour schemes to kick start your customisation.

Below are the build requirements and features.

##### Contents

+ [Build](#build)
+ [Partials](#partials)
	+ [Disqus](#disqus)
	+ [Post](#post)
	+ [Widget](#widget)
+ [Less](#less)
	+ [Base](#base)
	+ [Block](#block)
	+ [Config](#config)
	+ [Layout](#layout)
	+ [Skin](#skin)
+ [Javascript](#javascript)
	+ [Core](#core)
	+ [Directives](#directives)
	+ [Events](#events)
	+ [Helpers](#helpers)
	+ [Modules](#modules)

##### Build

[gulp.js](http://gulpjs.com/) handles the build process. To start the compile and watch processes, run the following command:

```javascript
gulp
```

To compile assets, run the following command:

```javascript
gulp compile
```

To compile minified assets, run the following command:

```javascript
gulp minify
```

To watch the assets for changes and refresh the browser, run the following command:

```javascript
gulp watch
```

##### Partials
[Handlebars](https://github.com/assemble/handlebars-helpers) is used serverside by Ghost to render certain markup. These are broken down into partials. Each partial is documented to explain the HTML / Microdata that is rendered.

| Partial           | Template      | 
|-------------------|---------------|
| `config.hbs`      | `default.hbs` |
| `credits.hbs`     | `default.hbs` |
| `description.hbs` | `default.hbs` |
| `widget-dribbble.hbs`    | `index.hbs`   |
| `widget-instagram.hbs`   | `index.hbs`   |
| `nagivation.hbs`  | `default.hbs` |
| `pagination.hbs`  | `default.hbs` |
| `post-preview.hbs`     | `index.hbs`   |
| `social-links.hbs`      | `default.hbs` |
| `title.hbs`       | `index.hbs`   |

###### Disqus
[`src/partials/disqus/*.hbs`](src/master/src/partials/disqus) contains partials that relate to [Disqus](https://disqus.com/) comments and counts.

| Partial       | Template          | 
|---------------|-------------------|
| `comments.hbs` | `post.hbs`        |
| `comments-count.hbs`   | `partials/post/meta.hbs`   |
| `javascript.hbs` | `default.hbs`   |

###### Post

[`src/partials/post/*.hbs`](src/master/src/partials/post) contains partials that relate to a post.

| Partial       | Template          | 
|---------------|-------------------|
| `author.hbs` | `partials/preview.hbs, post.hbs`        |
| `content.hbs`   | `post.hbs`   |
| `excerpt.hbs`   | `partials/preview.hbs`   |
| `media.hbs` | `partials/preview.hbs, post.hbs`   |
| `shares.hbs` | `partials/preview.hbs, post.hbs`   |
| `tags.hbs` | `partials/preview.hbs, post.hbs`   |
| `title.hbs` | `partials/preview.hbs, post.hbs, page.hbs`   |

###### Widget

[`src/partials/widget/*.hbs`](src/master/src/partials/widget) contains partials that relate to a widget.

| Partial       | Template          | 
|---------------|-------------------|
| `media.hbs` | `partials/dribbble.hbs, partials/instagram.hbs`        |
| `meta.hbs`   | `partials/dribbble.hbs, partials/instagram.hbs`   |


##### Less

[LESS](http://lesscss.org/) is used to create the CSS. The theme visuals are is split into two areas, [`src/less/layout.less`](src/master/src/less/layout.less) and [`src/less/skin-default.less`](src/master/src/less/skin-default.less).

Class names losely follow the [BEM](http://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/) methodology.

| Block   | Element           | Block Modifier              | 
|---------|-------------------|-----------------------------|
| `.post` | `.post-header`    | `.post--overlay`            |

###### Base

[`src/less/base/*.less`](src/master/src/less/base/) contains styles for default DOM elements.

###### Block

[`src/less/block/*.less`](src/master/src/less/block/) is an abstract style that is reusable in multiple areas of the layout. 

###### Config

[`src/less/config/*.less`](src/master/src/less/config/) is used in tandom with either [`src/less/layout.less`](src/master/src/less/layout.less) or [`src/less/skin-default.less`](src/master/src/less/skin-default.less). 

###### Layout

[`src/less/layout/*.less`](src/master/src/less/layout/) is a style that handles a specific part of the layout. It takes control of any child blocks and handles how the blocks adjust, via media queries.

###### Skin

[`src/less/skin/*.less`](src/master/src/less/skin/) is a style that handles the skin styles of either the base, a block or the layout.

##### Javascript

[jQuery](http://jquery.com/) is the only requirement the build process doesn't fulfill. This is included via the template tag `{{ghost_foot}}`.

DOM elements used within the core, are selected using `data-js`. DOM element that are required by a module, are prefixed with the module name. Example module `share` will require DOM elements `data-js="share"` and `data-js="share-list"`.

###### Core

[`src/js/core.js`](src/master/src/js/core.js) uses [browserify](http://browserify.org/) to piece together the themes functionality. The core consists of one function `start( options )`. This requires an object to be populated in [`partials/config.hbs`](src/master/partials/config.hbs).  This object is then extending into [`src/js/config.json`](src/master/src/js/config.json), to allow input from the outside world.

###### Directives

[`src/js/directives/*.js`](src/master/src/js/directive/) is an object that tells the template engine, [transparency](https://github.com/leonidas/transparency), the data we want to render to a DOM element. 

###### Events

[`src/js/helpers/events.js`](src/master/src/js/helpers/events.js) is an object used by modules and the core to pass events and DOM elements to the outside world:

| Module  | Event            | Objects                      | Notes                      |
|---------|------------------|------------------------------|----------------------------|
| Share   | `share.open`     | `$share, $list`              | Share list is open.        |
| Share   | `share.close`    | `$share, $list`              | Share list is closed.      |
| Start   | `start.complete` | `$posts`                     | Core tasks have completed. |
| Hover   | `hover.start`    | `$header, $cover, $footer`   | Element is hovered.        |
| Hover   | `hover.start`    | `$header, $cover, $footer`   | Element is not hovered.    |

###### Helpers

[`src/js/helper/*.js`](src/master/src/js/helpers/) is a utility method that is used in various places around the core.

###### Modules

[`src/js/modules/*.js`](src/master/src/js/modules/) is an object that takes care of one feature. Each module has a [`$.Deferred()`](http://api.jquery.com/category/deferred-object/) object, useful if the module makes changes to the DOM.

The two consistant methods for each module are `*.create()` and `*.start()`.  `*.create()` creates an instance of the module, while `*.start()` acts as a controller for the instance and also resolves `*.$deferred()`.



