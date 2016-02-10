## Distribution Package ##
The easiest way to install HAR Viewer is downloading the latest distribution from [Downloads](http://code.google.com/p/harviewer/downloads/list) section, unzip and copy on your PHP enabled web server.

## Resources ##
HAR Viewer is a web application that allows to visualize HTTP tracing logs based on HTTP Archive format (HAR). These files contain recorded information about HTTP traffic performed by web pages. A HAR log can be created by [HTTP tracking tools](http://www.softwareishard.com/blog/har-adopters/) such as Firebug.

  * See [HAR spec](http://www.softwareishard.com/blog/har-12-spec/) to understand structure of HAR file.
  * See [List of tools](http://www.softwareishard.com/blog/har-adopters/) supporting HAR.
  * Check out [HAR Viewer](http://www.softwareishard.com/har/viewer/) online.
  * Use [Firebug/NetExport](http://www.softwareishard.com/blog/netexport/) to monitor HTTP traffic and save collected info into a HAR file.
  * Use HAR [newsgroup](http://groups.google.com/group/http-archive-specification?hl=en) to discuss HAR spec.

## Build ##
Following steps describe how to build your own distribution of HAR Viewer.

  * Checkout HAR Viewer source code from GIT
> `git clone git@github.com:janodvarko/harviewer.git`

  * Build distribution by running [ant](http://ant.apache.org/) in the root directory
> `ant`

  * New **Release** directory is created. Copy content of this directory on to your PHP enabled web server.

## Customize Build ##

As explained in the section above, the build process is based on `ant`. This process utilizes a `ant.properties` file that can be used to customize:

  * `VERSION` Version number of the viewer.
  * `GOOGLE-ANALYTICS-PROFILE` ID of google analytics profile. If set, google analytics will apply automatically using provided ID (not set by default). This property is available since HAR Viewer 1.1-9

## PHP ##
The viewer provides two default PHP files that can be used to preview a HAR file. See [API](http://code.google.com/p/harviewer/wiki/API) for more nformation how to further customize these files.

  * `index.php` The main HAR Viewer page that shows detailed information summary about loaded HAR file(s).

  * `pagelist.php` Simplified preview of a single HAR file. Can be used as embedded iframe withing another page (e.g. blog post). This page expects one parameter `path` that specifies location of the input HAR file.


Online examples:

[HAR Viewer](http://www.softwareishard.com/har/viewer/index.php):
`http://www.softwareishard.com/har/viewer/index.php`

[Load specified HAR by default](http://www.softwareishard.com/har/viewer/index.php?path=examples/google.com.har):
`http://www.softwareishard.com/har/viewer/index.php?path=examples/google.com.har`

[Simple Preview](http://www.softwareishard.com/har/viewer/pagelist.php?path=examples/google.com.har):
`http://www.softwareishard.com/har/viewer/pagelist.php?path=examples/google.com.har`


## Known Issues ##
  * On CentOS you need to install the Apache Ant version 1.6.5 and then the optional Ant trax package to successfully build harviewer.

```
$ yum install ant.x86_64
$ yum install ant-trax.x86_64
```