/* See license.txt for terms of usage */

HAR.ns(function() { with (HAR) {

//-----------------------------------------------------------------------------

/**
 * HAR Model implementation. This object represents application data model.
 * This model implements all data manipulation methods.
 */
HAR.Model = extend(
{
    inputData: null,

    parseData: function(jsonString)
    {
        try
        {
            var start = HAR.now();
            var result = dojo.fromJson(jsonString);
            HAR.log("har; parse data: " + HAR.Lib.formatTime(HAR.now() - start));
            return result;
        }
        catch (err)
        {
            this.errors = [
                {
                    "message": "Failed to parse JSON",
                    "property": "JSON evaluation"
                },
                {
                    "message": err.name,
                    "property": err.message
                }
            ];
        }
        return null;
    },

    setData: function(inputData)
    {
        return this.inputData = inputData;
    },

    appendData: function(inputData)
    {
        if (!inputData)
            return this.inputData;

        if (this.inputData)
        {
            if (inputData.log.pages)
            {
                var start = HAR.now();
                for (var i=0; i<inputData.log.pages.length; i++)
                    this.importPage(inputData.log.pages[i], inputData.log.entries);
                HAR.log("har; Merge Data: " + HAR.Lib.formatTime(HAR.now() - start));
            }
            else
            {
                HAR.error("Import of additional data without a page is not yet supported.");
                //xxxHonza: how to properly import data with not page?
                //for (var i=0; i<inputData.log.entries.length; i++)
                //    this.inputData.log.entries.push(inputData.log.entries[i]);
                return null;
            }
        }
        else
        {
            this.inputData = inputData;
        }

        return this.inputData;
    },

    // Support for pages.
    getPages: function()
    {
        if (!this.inputData)
            return [];

        return this.inputData.log.pages ? this.inputData.log.pages : [];
    },

    getFirstPage: function()
    {
        var pages = this.getPages();
        return pages.length > 0 ? pages[0] : null;
    },

    removePage: function(page)
    {
        // Remove the page from the page list.
        var pages = this.inputData.log.pages;
        for (var i=0; i<pages.length; i++)
        {
            if (page == pages[i]) {
                pages.splice(i, 1);
                break;
            }
        }

        // Remove all associated entries.
        var entries = this.inputData.log.entries;
        for (var i=0; i<entries.length; i++)
        {
            var entry = entries[i];
            if (entries[i].pageref == page.id)
            {
                entries.splice(i, 1);
                i--;
            }
        }

        return this.inputData;
    },

    // xxxHonza: optimalization using a map?
    getPageEntries: function(page)
    {
        var result = [];
        var entries = this.inputData ? this.inputData.log.entries : null;
        if (!entries)
            return result;

        for (var i=0; i<entries.length; i++)
        {
            var entry = entries[i];

            // Return all requests that doesn't have a parent page.
            if (!entry.pageref && !page)
                result.push(entry);

            // Return all requests for the specified page.
            if (page && entry.pageref == page.id)
                result.push(entry);
        }
        return result;
    },

    // xxxHonza: optimize using a map?
    getParentPage: function(file)
    {
        var pages = this.inputData.log.pages;
        if (!pages)
            return null;

        for (var i=0; i<pages.length; i++)
        {
            if (pages[i].id == file.pageref)
                return pages[i];
        }
        return null;
    },

    importPage: function(page, entries)
    {
        var pageId = this.getUniquePageID(page.id);
        var prevPageId = page.id;
        page.id = pageId;

        this.inputData.log.pages.push(page);
        for (var i=0; i<entries.length; i++)
        {
            var entry = entries[i];
            if (entry.pageref == prevPageId)
            {
                entry.pageref = pageId;
                this.inputData.log.entries.push(entry);
            }
        }
    },

    getUniquePageID: function(defaultId)
    {
        var pages = this.inputData.log.pages;
        var hashTable = {};
        for (var i=0; i<pages.length; i++)
            hashTable[pages[i].id] = true;

        if (!hashTable[defaultId])
            return defaultId;

        var counter = 1;
        while (true)
        {
            var pageId = defaultId + counter;
            if (!hashTable[pageId])
                return pageId;
            counter++;
        }
    },

    toJSON : function(inputData)
    {
        if (!inputData)
            inputData = this.inputData;

        if (!inputData)
            return "";

        // xxxHonza: we don't have to iterate all entries again if it did already.
        var entries = this.inputData.log.entries;
        for (var i=0; i<entries.length; i++) {
            var entry = entries[i];
            if (entry.response.content.text)
                entry.response.content.__json__ = contentToUnicode;
        }

        var jsonString = dojo.toJson(this.inputData, true);
        var result = jsonString.replace(/\\\\u/g, "\\u");
        return result;
    },

    getSize: function(inputData)
    {
        if (!inputData)
            inputData = this.inputData;

        if (!inputData)
            return 0;

        var jsonString = dojo.toJson(inputData, true);
        return jsonString.length;
    }
});

// Make sure the response (it can be binary) is converted to Unicode.
function contentToUnicode()
{
    var newContent = {};
    for (var prop in this) {
        if (prop != "__json__")
            newContent[prop] = this[prop];
    }

    if (!this.text)
        return newContent;

    newContent.text = Array.map(this.text, function(x) {
        var charCode = x.charCodeAt(0);
        if ((charCode >= 0x20 && charCode < 0x7F) ||
             charCode == 0xA || charCode == 0xD)
            return x.charAt(0);

        var unicode = charCode.toString(16).toUpperCase();
        while (unicode.length < 4)
            unicode = "0" + unicode;
        return "\\u" + unicode;
    }).join("");

    return newContent;
}

//-----------------------------------------------------------------------------

/**
 * This object represents a phase that joins related requests into 
 * groups (phases).
 */
HAR.Model.Phase = function(file)
{
    this.files = [];
    this.addFile(file);
};

HAR.Model.Phase.prototype =
{
    addFile: function(file)
    {
        this.files.push(file);
        file.phase = this;
    },

    getLastStartTime: function()
    {
        return this.files[this.files.length - 1].startedDateTime;
    }
};

//-----------------------------------------------------------------------------
}});
