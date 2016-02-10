Download latest distribution from [Downloads](http://code.google.com/p/harviewer/downloads/list) section, unzip and copy on your PHP enabled web server.

## Cookies ##
There is a few cookies that you can use to customize look and feel of HAR Viewer. See following list:

  * **timeline** (_boolean_) - Use this cookie to show/hide a timeline section displayed on the Preview tab. Set to true by default.
  * **stats** (_boolean_) - Use this cookie to show/hide a statistics section displayed on the Preview tab. Set to true by default.
  * **phaseInterval** (_number, ms_) - Number of milliseconds (1000 by default) specifying a maximum gap between two requests. If a time lag between two HTTP requests (counted from the end of the first till the beginning of the second) exceeds the limit, the graphical timeline breaks layout and requests are drawn again from the beginning (left side) of the waterfall diagram. Disable this feature by setting to zero (or less). See [more](http://www.softwareishard.com/blog/firebug/firebug-net-panel-timings/) about this feature.
  * **validate** (_boolean_) If set to true, viewer is automatically validating input HAR logs against JSON schema.

  * **previewCols** (_string_) List of columns (used in the Preview tab) that should be initially displayed. Individual column names are separated by a space (e.g. _domain size type_)

  * **searchCaseSensitive** (_boolean_) Set to true if you want to use case sensitive search within HAR log (DOM tab)

## UI Customization ##
HAR Viewer also provides APIs that can be used to customize viewer's UI. Check [API](http://code.google.com/p/harviewer/wiki/API) page for documentation and examples.


## HAR Preview Embedding ##
HAR Viewer also allows creating simplified previews that can be easily inserted in other pages.

Here is an example of a simple preview:
http://www.softwareishard.com/har/viewer/preview.php?inputUrl=http://www.janodvarko.cz/har/viewer/examples/inline-scripts-block.harp&expand=true

In order to insert the preview in a page, you can either create an iframe pointing to the right URL or utilize a script that generates the iframe code for you. The script is part of HAR Viewer distribution package as _har.js_.

The following example shows how to asynchronously load _har.js_ script:
```
<script>
(function() {
    var har = document.createElement("script");
    har.src = "http://www.softwareishard.com/har/viewer/har.js";
    har.setAttribute("id", "har");
    har.setAttribute("async", "true");
    document.documentElement.firstChild.appendChild(har);
})();
</script>
```

Notice the **id** attribute. The attribute is used by _har.js_ script in order to find out where the HAR Viewer (and so HAR preview) should be loaded from.

The synchronous way:

```
<script id="har" src="http://www.softwareishard.com/har/viewer/har.js">
```

Consequently you can insert following markup into the page:

```
<div class="har" data-har="http://www.janodvarko.cz/har/viewer/examples/inline-scripts-block.harp"></div>
```

Every element with class _har_ is processed an appropriate iframe preview inserted into it.

Here is a list of attributes you can set on such element:

  * `class` (mandatory) elements with this class are considered as HAR preview elements. The class is removed as soon as the element is processed. Possible additional classes are not touched.

  * `data-har` (mandatory) source URL for target file. The URL must start with 'http:' in case where the target file is located on a different domain. The file must use HARP syntax (JSONP) in these cases. Otherwise the URL is considered to be from the same domain and path relative to the current location. The file must use HAR syntax (JSON) in such case.

  * `width` (optional, default: '100%') width of the preview.

  * `height` (optional, default: '150px') height of the preview.

  * `expand` (optional, default: 'true') true if individual pages should be expanded.

Further examples:

_Load HARP file from an external domain using JSONP:_
```
<div class="har" data-har="http://example.com/my.harp"></div>
```

_Load HAR file from the same domain:_
```
<div class="har" data-har="my.har"></div>
```

_Load HAR file from an external domain and expand its content:_

```
<div class="har" data-har="http://example.com/my.harp" expand="true"></div>
```

_Set custom height of the generated preview:_

```
<div class="har" data-har="http://example.com/my.harp" height="250px"></div>
```

## Word Press Plugin ##
Simple HAR previews can be also inserted into your pages via [WordPress](http://wordpress.org/) plugin. As soon as you have the plugin installed, type following into your blog post:

```
[har path="/path/to/your/har/file/example.har" height="100px"]
```

Following parameters are available:

  * `path` (mandatory) This is the only mandatory parameter that specifies path to the HAR file.
  * `height` (optional, default 220px) Height of the preview.
  * `resizer` (optional, default: true) True if vertical resizer should be displayed a the bottom of the preview.
  * `expand` (optional, default: false) True if content should be expanded by default.
  * `loader` (optional, default: false) True if the HAR content shouldn't be loaded automatically, but wait till user explicitly loads it.

See an example of such embedded preview in [this](http://www.softwareishard.com/blog/firebug/firebug-1-8-console-timestamp/) blog post.

TODO: plugin distribution link