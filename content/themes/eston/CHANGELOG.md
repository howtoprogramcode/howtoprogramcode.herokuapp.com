# Changelog
All notable changes to this theme will be documented in this file.

## 1.1.0

### Added
- Support for Ghost 0.5.5
- Featured post on `index.hbs`
- Photo post
- Photo Overlay post
- Quote post
- Link post
- Chat post
- Audio post
- Video post
- Overlay option for Photo post
- Meta tag for designer
- Class `.post--index` to post previews
- Class `.post--permalink` to post permalinks
- Class `.post--page` to page
- Documentation for Navigation
- Documentation for Social Links
- Documentation for Photo post
- Documentation for Photo Overlay post
- Documentation for Quote post
- Documentation for Link post
- Documentation for Chat post
- Documentation for Audio post
- Documentation for Video post

### Fixed
- Missing `data-ani` attribute on `post.hbs`
- Social Shares total showing `x`, before rendering
- Whitespace on `.post-title` and `.post-tags`
- Unused attributes and classes
- IE9 fix for Post cover header background
- Documentation for Social Shares
- Renamed `disqus/count.hbs` to `disqus/comment-count.hbs`
- Renamed `preview.hbs` to `post-preview.hbs`
- Renamed `shares.hbs` to `social-shares.hbs`
- Renamed `social.hbs` to `social-links.hbs`
- Renamed `dribbble.hbs` to `widget-dribbble.hbs`
- Renamed `instagram.hbs` to `widget-instagram.hbs`
- Empty elements that can't be handled with template logic
- Font weights

### Removed
- Documentation for embed codes
- Support for embed codes

## 1.0.4

### Added
- `page.hbs` now supports media

### Fixed
- CSS Animations not supported on IE 9 or lower

## 1.0.3

### Added
- `config.hbs` ftw! Now handles configuration, dot notation style

### Fixed
- Instagram widget blocking `start` event if `access_token` unauthorised

## 1.0.2

### Removed
- Disqus API requirements. Now uses the standard implementation

### Fixed
- Google analytics not registering for certain account types
- Disqus Comments Counts not returning a value

## 1.0.1

### Added
- Google Analyics
- Theme credits

### Fixed
- Widgets with no config object silently fail, but don't block `start` event
- Media queries revised

## 1.0.0

### Added
- Initial release
