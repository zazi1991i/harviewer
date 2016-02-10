Use this page to learn about changes in HAR Viewer releases. For complete summary of all changes see also [Release Notes](http://code.google.com/p/harviewer/source/browse/trunk/webapp/ReleaseNotes.txt) within the distribution.

## HAR Viewer 2.0.15 ##
  * API for [column customization](http://code.google.com/p/harviewer/wiki/API#Request_Column_Customization) in the Preview tab.
  * Cookies: _hiddenCols_ replaced by _previewCols_
  * JSON Query based search in HAR file

## HAR Viewer 2.0.14 ##
  * Column customization in the Preview tab.
  * Support for search within HAR log in the DOM tab.
  * New [cookies](http://code.google.com/p/harviewer/wiki/Customization?ts=1315753789&updated=Customization)

## HAR Viewer 2.0.13 ##
  * Support for embedding of HAR preview in a web page, see [HAR Preview Embedding](http://code.google.com/p/harviewer/wiki/Customization#HAR_Preview_Embedding).

## HAR Viewer 2.0.12 ##
  * New API for loading HAR files, see [Loading HAR Files](http://code.google.com/p/harviewer/wiki/API#Loading_HAR_Files) docs.

## HAR Viewer 2.0.11 ##
  * Support for console.timeStamp() introduced in Firebug 1.8b3
  * Better information in time info tip (for the waterfall timeline)
  * Visual separator between two requests groups.
  * Home tab provides a short note about loading HARs through JSONP.

## HAR Viewer 2.0.10 ##
  * Replace '$' by 'jQuery' so, the code works even in jQuery safe mode.
  * If 'expand=true' is specified in the URL all page lists are expanded by default.
  * Wordpress plugin for embedding HAR log preview within a blog post. (documentation: TBD)

## HAR Viewer 2.0.9 ##

  * Update to RequireJS 0.24.0. This update required changes in index.php file. In case you are customizing your distribution using different index.php file, check [API](http://code.google.com/p/harviewer/wiki/API). All examples are up to date. RequireJS is not bundled together with jQuery.js anymore and you need to explicitly include both these files.

  * Resizeable HTML Previews
  * Disable phase-break by setting phaseInterval cookie to zero or less