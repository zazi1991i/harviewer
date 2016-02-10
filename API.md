## Extension API ##
HAR Viewer provides APIs that can be used to customize viewer's UI. For example, you can remove default application tabs or toolbar buttons that are not necessary for your needs.

The customization can be done within index.php. This file represents the entry point of the HAR Viewer application.

Here is a simplified version of the file:

```
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>HAR Viewer Test</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
</head>
<body class="harBody">
    <div id="content" version="test"></div>
    <script src="scripts/jquery.js"></script>
    <script data-main="scripts/harViewer" src="scripts/require.js"></script>
    <link rel="stylesheet" href="css/harViewer.css" type="text/css"/>
</body>
</html>
```

  * `<div id="content">` element contains entire HAR Viewer UI
  * `scripts/jquery.js` includes JQuery.
  * `scripts/require.js` includes RequireJS. The _scripts/harViewer_ module is automatically loaded. This module represents the entire application.
  * `VERSION@` is dynamically replaced by the current version number during the [build](http://code.google.com/p/harviewer/wiki/Installation) process.


It is possible to registers an event listener to the `content` element and perform various customization of the UI at the right moment. There are following events you can handle.

  * `onViewerPreInit` Fired before the viewer renders itself into the page.
  * `onViewerInit` Fired after the viewer is fully initialized and rendered in the page.
  * `onViewerHARLoaded` Fired after a HAR file has been appended into the viewer.

See following example that shows how to register a listener.

```
<body class="harBody">
    <div id="content" version="@VERSION@"></div>
    <script src="scripts/jquery.js"></script>
    <script data-main="scripts/harViewer" src="scripts/require.js"></script>
    <script>
    $("#content").bind("onViewerPreInit", function(event)
    {
        // Get application object
        var viewer = event.target.repObject;
    });
    </script>
</body>
```

## Application Object ##
Most of the APIs described below require access to the main application object _HARView_ (defined in [harViewer.js](http://code.google.com/p/harviewer/source/browse/trunk/webapp/scripts/harViewer.js)). There are two ways how to get reference to the object.

Handle an existing event and use passed _event_ object.

```
$("#content").bind("onViewerPreInit", function(event)
{
    // Get application object
    var viewer = event.target.repObject;
});
```

Find the main application element (the container for entire HAR Viewer UI) and use its _repObject_ property. This approach is suitable in cases when handling events is not the right time and you need to use the application object at any time later.

```
var viewer = document.getElementById("content").repObject;
```


## Removing Unnecessary Tabs ##
Some of the application's tabs (such as _Home_, About, etc.) are not always necessary in production releases. Following example shows how we can remove them.

```
$("#content").bind("onViewerPreInit", function(event)
{
    // Get application object
    var viewer = event.target.repObject;

    // Remove unnecessary tabs
    viewer.removeTab("About");
    viewer.removeTab("Schema");
});
```


## Hide Tab Bar ##
In order to make the viewer easier to use for the end user we might want to hide the entire tab bar (the area where tab labels are displayed) and show only preview of HAR logs.

Following example removes all tabs except of _Preview_ and hides the
tab bar.

```
$("#content").bind("onViewerPreInit", function(event)
{
    // Get application object
    var viewer = event.target.repObject;

    // Remove unnecessary tabs
    viewer.removeTab("Home");
    viewer.removeTab("DOM");
    viewer.removeTab("About");
    viewer.removeTab("Schema");

    // Hide the tab bar
    viewer.showTabBar(false);
});
```

## Remove Toolbar Buttons ##
Similarly to tabs, you can also remove existing toolbar buttons. Again, see an example that removes _Download_ and _Clear_ buttons from the _Preview_ tab.


```
$("#content").bind("onViewerPreInit", function(event)
{
    // Get application object
    var viewer = event.target.repObject;

    // Remove toolbar buttons
    var preview = viewer.getTab("Preview");
    preview.toolbar.removeButton("download");
    preview.toolbar.removeButton("clear");
});
```


## Timeline & Statistics ##
In order to control visibility of a page _timeline_ and _statistics_ you can use following APIs:

```
$("#content").bind("onViewerPreInit", function(event)
{
    // Get application object
    var viewer = event.target.repObject;

    // Make sure stats and timeline is visible
    // to the user by default
    var preview = viewer.getTab("Preview");
    preview.showStats(true);
    preview.showTimeline(true);
});
```

## Custom Page Timings ##
_Available since HAR Viewer 2.0.8_

Timings of events related to the page load such as _onLoad_ and _DOMContentLoaded_ events are displayed as vertical lines drawn over network requests. Following example shows how to append new timings coming from HAR custom fields (see _Custom Fields_ in HAR 1.2 spec).

Let's imagine following HAR file snippet (the _page.pageTimings_ object) with one new custom field.

```
"pageTimings": {
    "onContentLoad": 5605, 
    "onLoad": 6964,
    "_onMyEvent": 4000
}, 
```

_Note that custom fields must start with an underscore_

There is a new field called _onMyEvent_ with a corresponding timing value that says when it happened since the page load beginning.

Now we need to register that field within the viewer as follows:

```
$("#content").bind("onViewerPreInit", function(event)
{
    // Get application object
    var viewer = event.target.repObject;

    // Add custom page timing displayed as a vertical line
    // over request in the first phase.
    var preview = viewer.getTab("Preview");
    preview.addPageTiming({
        name: "_onMyEvent",
        classes: "onMyEventBar",
        description: "A custom page timing"
    });
});
```

  * `name` Name of the field in HAR file.
  * `classes` Optional CSS class associated with the vertical line. Can be used to e.g. specify a color of the line. The line is green by default.
  * `description` Description of the timing/event that is displayed in the tooltip.

An example of a custom CSS class that changes the default color:

```
<style type="text/css">
.onMyEventBar {
    background-color: gray;
}
</style>
```

## Loading HAR Files ##
_Available since HAR Viewer 2.0.12_

Apart from specifying a HAR file in the URL, you can also load it manually using `loadHar` method.

Next example shows how to load HAR file from the same domain.

```
$("#content").bind("onViewerInit", function(event)
{
    var viewer = event.target.repObject;
    viewer.loadHar(<path-to-har-file>);
});
```

In case you want to load HARs from different domain you need to use HARP (JSONP) syntax. See another example:

```
$("#content").bind("onViewerInit", function(event)
{
    var viewer = event.target.repObject;
    var settings = {jsonp: true};
    viewer.loadHar(<path-to-har-file>, settings);
});
```

If you already have the HAR log object loaded and parsed, you can directly append it using `appendPreview` method.

```
$("#content").bind("onViewerInit", function(event)
{
    var viewer = event.target.repObject;
    var log = <har-file-loaded-and-parsed>;
    viewer.appendPreview(log);
});
```

The same works also for the `preview.php`. In such case you need to handle `onPreviewInit` event.

```
$("#content").bind("onPreviewInit", function(event)
{
    var viewer = event.target.repObject;
    viewer.loadHar(<path-to-har-file>);
});
```

## Request Column Customization ##
_Available since HAR Viewer 2.0.15_

List of visible columns used in HAR timeline waterfall graph can be customized through a cookie: _previewCols_ or through API.

```
$("#content").bind("onViewerInit", function(event)
{
    var viewer = event.target.repObject;

    // Display URL, Status, Size and Timeline columns by default
    // Do not touch cookies (the second parameter is true)
    viewer.setPreviewColumns("url status size timeline", true);
});
```

The first argument specifies list of column IDs separated by a space (see [available columns](http://code.google.com/p/harviewer/source/browse/trunk/webapp/scripts/preview/requestList.js#51)). The second argument says whether touching cookies should be avoided.


## Feedback ##
Do you need more? Please [create a report](http://code.google.com/p/harviewer/issues/list).