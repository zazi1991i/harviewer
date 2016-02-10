_This page is relevant only for HAR Viewer 1.1. HAR Viewer 2.0 is built on top of RequireJS and jQuery._

Custom Dojo build for HAR Viewer

### Introduction ###
See more information about Dojo's package system and custom builds here:

http://o.dojotoolkit.org/book/dojo-book-0-9/part-4-meta-dojo/package-system-and-custom-builds


### HAR Viewer Profile ###

```
dependencies ={
layers:  [
{
name: "har.dojo.js",
dependencies: [
"dojox.json.schema",
"dojox.json.ref",
"dojo._base.json",
"dojox.highlight",
"dojox.highlight.languages.javascript",
"dojo.fx",
"dijit.Menu"
]
}
],
prefixes: [
[ "dijit", "../dijit" ],
[ "dojox", "../dojox" ],
]
};```


### Build ###

```

$ cd util/buildscripts
$ build.sh profile=har.viewer action=release
```

on Windows PC's

```

$ cd util/buildscripts
$ build.bat profile=har.viewer action=release
```