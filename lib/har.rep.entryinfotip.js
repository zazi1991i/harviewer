/* See license.txt for terms of usage */

HAR.ns(function() { with (HAR.Domplate) { with (HAR.Lib) {

//-----------------------------------------------------------------------------

/**
 * This object represents a popup info tip with detailed timing info for an 
 * entry (request).
 */
HAR.Rep.EntryTimeInfoTip = domplate(
{
    tableTag:
        TABLE({"class": "timeInfoTip"},
            TBODY()
        ),

    timingsTag:
        FOR("time", "$timings",
            TR({"class": "timeInfoTipRow", $collapsed: "$time|hideBar"},
                TD({"class": "$time|getBarClass timeInfoTipBar",
                    $loaded: "$time.loaded",
                    $fromCache: "$time.fromCache"
                }),
                TD({"class": "timeInfoTipCell startTime"},
                    "$time.start|formatStartTime"
                ),
                TD({"class": "timeInfoTipCell elapsedTime"},
                    "$time.elapsed|formatTime"
                ),
                TD("$time|getLabel")
            )
        ),

    startTimeTag:
        TR(
            TD(),
            TD("$startTime.time|formatStartTime"),
            TD({"colspan": 2},
                "$startTime|getLabel"
            )
        ),

    separatorTag:
        TR(
            TD({"colspan": 4, "height": "10px"})
        ),

    eventsTag:
        FOR("event", "$events",
            TR({"class": "timeInfoTipEventRow"},
                TD({"class": "timeInfoTipBar", align: "center"},
                    DIV({"class": "$event|getBarClass timeInfoTipEventBar"})
                ),
                TD("$event.start|formatStartTime"),
                TD({"colspan": 2},
                    "$event|getLabel"
                )
            )
        ),

    hideBar: function(obj)
    {
        return !obj.elapsed && obj.bar == "request.phase.Blocking";
    },

    getBarClass: function(obj)
    {
        var className = obj.bar.substr(obj.bar.lastIndexOf(".") + 1);
        return "net" + className + "Bar";
    },

    formatTime: function(time)
    {
        return HAR.Lib.formatTime(time);
    },

    formatStartTime: function(time)
    {
        var positive = time > 0;
        var label = HAR.Lib.formatTime(Math.abs(time));
        if (!time)
            return label;

        return (positive > 0 ? "+" : "-") + label;
    },

    getLabel: function(obj)
    {
        return $STR(obj.bar);
    },

    render: function(row, parentNode)
    {
        var file = row.repObject;
        var page = HAR.Model.getParentPage(file);
        var pageStart = page ? parseISO8601(page.startedDateTime) : null;
        var requestStart = parseISO8601(file.startedDateTime);
        var infoTip = HAR.Rep.EntryTimeInfoTip.tableTag.replace({}, parentNode);

        // Insert start request time.
        var startTimeObj = {};

        //xxxHonza: the request start-time should be since the page start-time
        // but what to do if there was no parent page and the parent phase
        // is not the first one?
        startTimeObj.time = requestStart - row.phase.startTime;
        startTimeObj.bar = "request.Started";
        this.startTimeTag.insertRows({startTime: startTimeObj}, infoTip.firstChild);

        // Insert separator.
        this.separatorTag.insertRows({}, infoTip.firstChild);

        var startTime = 0;
        var timings = [];

        // Helper shortcuts
        var dns = file.timings.dns;
        var ssl = file.timings.ssl; // new in HAR 1.2 xxxHonza: TODO
        var connect = file.timings.connect;
        var blocked = file.timings.blocked;
        var send = file.timings.send;
        var wait = file.timings.wait;
        var receive = file.timings.receive;

        if (dns >= 0)
        {
            timings.push({bar: "request.phase.Resolving",
                elapsed: dns,
                start: startTime});
        }

        if (connect >= 0)
        {
            timings.push({bar: "request.phase.Connecting",
                elapsed: connect,
                start: startTime += (dns < 0) ? 0 : dns});
        }

        if (blocked >= 0)
        {
            timings.push({bar: "request.phase.Blocking",
                elapsed: blocked,
                start: startTime += (connect < 0) ? 0 : connect});
        }

        if (send >= 0)
        {
            timings.push({bar: "request.phase.Sending",
                elapsed: send,
                start: startTime += (blocked < 0) ? 0 : blocked});
        }

        if (wait >= 0)
        {
            timings.push({bar: "request.phase.Waiting",
                elapsed: wait,
                start: startTime += (send < 0) ? 0 : send});
        }

        if (receive >= 0)
        {
            timings.push({bar: "request.phase.Receiving",
                elapsed: receive,
                start: startTime += (wait < 0) ? 0 : wait,
                loaded: file.loaded, fromCache: file.fromCache});
        }

        // Insert request timing info.
        this.timingsTag.insertRows({timings: timings}, infoTip.firstChild);

        // Get page event timing info (if the page exists).
        var events = [];

        if (page && page.pageTimings.onContentLoad > 0)
            events.push({bar: "ContentLoad",
                start: pageStart + page.pageTimings.onContentLoad - requestStart});

        if (page && page.pageTimings.onLoad > 0)
            events.push({bar: "WindowLoad",
                start: pageStart + page.pageTimings.onLoad - requestStart});

        if (!events.length)
            return;

        // Insert separator.
        this.separatorTag.insertRows({}, infoTip.firstChild);

        // Insert events timing info.
        this.eventsTag.insertRows({events: events}, infoTip.firstChild);

        return true;
    }
});

//-----------------------------------------------------------------------------

HAR.Rep.EntrySizeInfoTip = domplate(
{
    tag:
        DIV({"class": "sizeInfoTip"}, "$file|getSize"),

    zippedTag:
        DIV(
            DIV({"class": "sizeInfoTip"}, "$file|getBodySize"),
            DIV({"class": "sizeInfoTip"}, "$file|getContentSize")
        ),

    getSize: function(file)
    {
        var bodySize = file.response.bodySize;
        return $STRF("tooltip.size", [formatSize(bodySize),
            ((bodySize.size < 0) ? "?" : formatNumber(bodySize))]);
    },

    getBodySize: function(file)
    {
        var bodySize = file.response.bodySize;
        return $STRF("tooltip.zippedSize", [formatSize(bodySize),
            ((bodySize.size < 0) ? "?" : formatNumber(bodySize))]);
    },

    getContentSize: function(file)
    {
        var contentSize = file.response.content.size;
        return $STRF("tooltip.unzippedSize", [formatSize(contentSize),
            ((contentSize.size < 0) ? "?" : formatNumber(contentSize))]);
    },

    render: function(file, parentNode)
    {
        if (file.response.bodySize == file.response.content.size)
            return this.tag.replace({file: file}, parentNode);

        return this.zippedTag.replace({file: file}, parentNode);
    }
});

//-----------------------------------------------------------------------------
}}});
