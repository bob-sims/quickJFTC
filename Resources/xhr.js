Ti.taffy = require("ti.taffydb").taffyDb;

var cacheManager = Ti.taffy();

XHR = function() {
    cacheManager.exists("cache") && cacheManager.open("cache");
};

XHR.prototype.get = function(url, onSuccess, onError, extraParams) {
    var onSuccess = onSuccess || function() {}, onError = onError || function() {}, extraParams = extraParams || {};
    extraParams.async = extraParams.async || !0;
    extraParams.ttl = extraParams.ttl || !1;
    extraParams.shouldAuthenticate = extraParams.shouldAuthenticate || !1;
    extraParams.contentType = extraParams.contentType || "application/json";
    var cache = readCache(url);
    if (!extraParams.ttl || cache == 0) {
        var xhr = Titanium.Network.createHTTPClient({
            enableKeepAlive: !1
        }), result = {};
        xhr.open("GET", url, extraParams.async);
        xhr.setRequestHeader("Content-Type", extraParams.contentType);
        if (extraParams.shouldAuthenticate) {
            var authstr = "Basic " + Titanium.Utils.base64encode(extraParams.username + ":" + extraParams.password);
            xhr.setRequestHeader("Authorization", authstr);
        }
        xhr.onload = function() {
            result.status = xhr.status == 200 ? "ok" : xhr.status;
            result.data = xhr.responseText;
            onSuccess(result);
            writeCache(result.data, url, extraParams.ttl);
        };
        xhr.onerror = function(e) {
            result.status = "error";
            result.data = e;
            onError(result);
        };
        xhr.send();
    } else {
        var result = {};
        result.status = "cache";
        result.data = cache;
        onSuccess(result);
    }
};

XHR.prototype.post = function(url, data, onSuccess, onError, extraParams) {
    Titanium.API.info(url + " " + JSON.stringify(data));
    var onSuccess = onSuccess || function() {}, onError = onError || function() {}, extraParams = extraParams || {};
    extraParams.async = extraParams.async || !0;
    extraParams.shouldAuthenticate = extraParams.shouldAuthenticate || !1;
    extraParams.contentType = extraParams.contentType || "application/json";
    var xhr = Titanium.Network.createHTTPClient({
        enableKeepAlive: !1
    }), result = {};
    xhr.open("POST", url, extraParams.async);
    xhr.setRequestHeader("Content-Type", extraParams.contentType);
    if (extraParams.shouldAuthenticate) {
        var authstr = "Basic " + Titanium.Utils.base64encode(extraParams.username + ":" + extraParams.password);
        xhr.setRequestHeader("Authorization", authstr);
    }
    xhr.onload = function() {
        result.status = xhr.status == 200 ? "ok" : xhr.status;
        result.data = xhr.responseText;
        onSuccess(result);
    };
    xhr.onerror = function(e) {
        result.status = "error";
        result.data = e.error;
        onError(result);
    };
    xhr.send(data);
};

XHR.prototype.put = function(url, data, onSuccess, onError, extraParams) {
    var onSuccess = onSuccess || function() {}, onError = onError || function() {}, extraParams = extraParams || {};
    extraParams.async = extraParams.async || !0;
    extraParams.shouldAuthenticate = extraParams.shouldAuthenticate || !1;
    extraParams.contentType = extraParams.contentType || "application/json";
    var xhr = Titanium.Network.createHTTPClient({
        enableKeepAlive: !1
    }), result = {};
    xhr.open("PUT", url, extraParams.async);
    xhr.setRequestHeader("Content-Type", extraParams.contentType);
    if (extraParams.shouldAuthenticate) {
        var authstr = "Basic " + Titanium.Utils.base64encode(extraParams.username + ":" + extraParams.password);
        xhr.setRequestHeader("Authorization", authstr);
    }
    xhr.onload = function() {
        result.status = xhr.status == 200 ? "ok" : xhr.status;
        result.data = xhr.responseText;
        onSuccess(result);
    };
    xhr.onerror = function(e) {
        result.status = "error";
        result.data = e.error;
        onError(result);
    };
    xhr.send(data);
};

XHR.prototype.destroy = function(url, onSuccess, onError, extraParams) {
    var onSuccess = onSuccess || function() {}, onError = onError || function() {}, extraParams = extraParams || {};
    extraParams.async = extraParams.async || !0;
    extraParams.shouldAuthenticate = extraParams.shouldAuthenticate || !1;
    extraParams.contentType = extraParams.contentType || "application/json";
    var xhr = Titanium.Network.createHTTPClient({
        enableKeepAlive: !1
    }), result = {};
    xhr.open("DELETE", url, extraParams.async);
    xhr.setRequestHeader("Content-Type", extraParams.contentType);
    if (extraParams.shouldAuthenticate) {
        var authstr = "Basic " + Titanium.Utils.base64encode(extraParams.username + ":" + extraParams.password);
        xhr.setRequestHeader("Authorization", authstr);
    }
    xhr.onload = function() {
        result.status = xhr.status == 200 ? "ok" : xhr.status;
        result.data = xhr.responseText;
        onSuccess(result);
    };
    xhr.onerror = function(e) {
        result.status = "error";
        result.data = e.error;
        onError(result);
    };
    xhr.send();
};

readCache = function(url) {
    var hashedURL = Titanium.Utils.md5HexDigest(url), cache = cacheManager({
        file: hashedURL
    }).first(), result = !1;
    if (cache != 0) {
        var file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, cache.file);
        if (cache.timestamp >= (new Date).getTime()) result = file.read(); else {
            cacheManager(cache).remove();
            file.deleteFile();
            cacheManager.save();
        }
    }
    return result;
};

writeCache = function(data, url, ttl) {
    var hashedURL = Titanium.Utils.md5HexDigest(url), file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, hashedURL);
    if (file.write(data)) {
        cacheManager.insert({
            file: hashedURL,
            timestamp: (new Date).getTime() + ttl * 60 * 1000
        });
        cacheManager.save("cache");
    }
};

XHR.prototype.clearCache = function() {
    var cachedDocuments = cacheManager({
        timestamp: {
            lte: (new Date).getTime()
        }
    }).get(), cachedDocumentsCount = cachedDocuments.length;
    if (cachedDocumentsCount > 0) {
        for (var i = 0; i <= cachedDocumentsCount - 1; i++) {
            var file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, cachedDocuments[i].file);
            cacheManager(cachedDocuments[i].file).remove();
            file.deleteFile();
        }
        cacheManager.save();
    }
    return cachedDocumentsCount;
};

XHR.prototype.paramsToQueryString = function(formdata, numeric_prefix, arg_separator) {
    var value, key, tmp = [], that = this, _http_build_query_helper = function(key, val, arg_separator) {
        var k, tmp = [];
        val === !0 ? val = "1" : val === !1 && (val = "0");
        if (val != null) {
            if (typeof val == "object") {
                for (k in val) val[k] != null && tmp.push(_http_build_query_helper(key + "[" + k + "]", val[k], arg_separator));
                return tmp.join(arg_separator);
            }
            if (typeof val != "function") return Ti.Network.encodeURIComponent(key) + "=" + Ti.Network.encodeURIComponent(val);
            throw new Error("There was an error processing for http_build_query().");
        }
        return "";
    };
    arg_separator || (arg_separator = "&");
    for (key in formdata) {
        value = formdata[key];
        numeric_prefix && !isNaN(key) && (key = String(numeric_prefix) + key);
        var query = _http_build_query_helper(key, value, arg_separator);
        query != "" && tmp.push(query);
    }
    return tmp.join(arg_separator);
};

module.exports = XHR;