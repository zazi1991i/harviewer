This page is intended to describe directory structure of HAR Viewer project. Development currently happens in the **svn/trunk** directory.

## Introduction ##

  * build-tools - various tools used for the build process (script minification, tools for generation doc from source code comments, etc.)
  * requirejs - RequireJS package + jQuery
  * selenium - HAR Viewer uses selenium for testing.
  * webapp - HAR Viewer implementation
    * css - all CSS and image files
    * examples - example HAR files.
    * scripts - All JS implementation files (modules)

## Modules ##
HAR Viewer is based on RequireJS and script file use asynchronous module definition (AMD). All modules are divided into following categories.

  * core - Core modules implementing basis features like logging, cookies manipulation, DOM & CSS manipulation, etc.
  * domplate - Templating system for the UI. Includes Cross browser Domplate implementation + domplate widgets/modules (tree, popup menu, tab view, etc.)
  * nls - Localization modules.
  * preview - Modules related to HAR preview logic (used on the Preview application tab)
  * tabs - Implementation of all application tabs (Home, Preview, etc.)
  * xhr-spy - Implementation of XHR Spy bookmarklet (in progress)

Third party libraries:
  * syntax-highlighter - Use for response bodies in cases where the response is: javascript, HTML, CSS, etc.
  * dowloadify - Third party library implementing client side download (based on flash).
  * excanvas - Canvas implementation for IE.
  * jquery-plugins - Plugins for jQuery.