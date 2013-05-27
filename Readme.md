
# component-hogan

A plugin to transpile mustache templates for component builder, using Hogan.

Note the structure of this plugin is largely cargo-culted from 
[jade][segmentio/component-jade].

## Install

    $ npm install component-hogan

## Usage

Add your mustache files (`.mustache` or `.stache`) to the `templates`
array in your `component.json`:

```javascript
{
  "templates": [
    "template.stache",
    "another.mustache"
  ]
}
```

To use the plugin during your build process (component >= 0.13.0):

    $ component build --use component-hogan

## License

MIT


[jade]: https://github.com/segmentio/component-jade

