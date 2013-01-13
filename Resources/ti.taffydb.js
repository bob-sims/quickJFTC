var TiHelpers = {};

(function() {
    function findPersistMode(settings) {
        var results = "file";
        settings.hasOwnProperty("persistMode") && settings.persistMode !== undefined && settings.persistMode !== null && (results = settings.persistMode);
        return results;
    }
    function createTaffyFolder() {
        var parent = Ti.Filesystem.applicationDataDirectory, taffFolder = Ti.Filesystem.getFile(parent, "titaffydb");
        taffFolder.exists() || taffFolder.createDirectory();
    }
    function fetchTaffyFile(dbName) {
        createTaffyFolder();
        var parent = Ti.Filesystem.applicationDataDirectory, taffFolder = parent + "titaffydb", taffyFile = Ti.Filesystem.getFile(taffFolder, dbName.toUpperCase());
        return taffyFile;
    }
    function deleteTaffyDbFile(dbName) {
        var taffyFile = fetchTaffyFile(dbName);
        taffyFile.exists() && taffyFile.deleteFile();
        taffyFile = null;
    }
    function taffyDbFileExists(dbName) {
        var taffyFile = fetchTaffyFile(dbName), results = taffyFile.exists();
        taffyFile = null;
        return results;
    }
    function taffyDbPropExists(dbName) {
        var fetchTest = Ti.App.Properties.getString("ti_taffydb_" + dbName.toUpperCase(), "");
        return TiHelpers.safeString(fetchTest).length === 0;
    }
    function readFromFile(dbName) {
        var taffyFile = fetchTaffyFile(dbName);
        if (!taffyFile.exists()) {
            taffyFile = null;
            return null;
        }
        try {
            var contents = taffyFile.read();
            taffyFile = null;
            return contents == null || contents == null ? null : JSON.parse(contents);
        } catch (err) {
            Ti.API.info("TaffyDb Load Error: " + err);
            throw "Invalid TaffyDb file";
        }
    }
    function readFromProp(dbName) {
        try {
            var fetchTest = Ti.App.Properties.getString("ti_taffydb_" + dbName.toUpperCase(), "");
            return TiHelpers.safeString(fetchTest).length === 0 ? null : JSON.parse(fetchTest);
        } catch (err) {
            Ti.API.info("TaffyDb Load Error: " + err);
            throw "Invalid TaffyDb file";
        }
    }
    function saveTaffyDbFile(dbName, dbObject) {
        var taffyFile = fetchTaffyFile(dbName);
        taffyFile.write(JSON.stringify(dbObject));
        taffyFile = null;
    }
    TiHelpers.safeString = function(value) {
        return value == undefined ? "" : value == null ? "" : value;
    };
    TiHelpers.readTaffyDb = function(dbName, settings) {
        var persistMode = findPersistMode(settings);
        if (persistMode.toLowerCase().trim() !== "property") return readFromFile(dbName);
        readFromProp(dbName);
    };
    TiHelpers.saveTaffyDb = function(dbName, dbObject, settings) {
        var persistMode = findPersistMode(settings);
        if (persistMode.toLowerCase().trim() !== "property") return saveTaffyDbFile(dbName, dbObject);
        Ti.App.Properties.setString("ti_taffydb_" + dbName.toUpperCase(), JSON.stringify(dbObject));
    };
    TiHelpers.taffyDbExists = function(dbName, settings) {
        var persistMode = findPersistMode(settings);
        return persistMode.toLowerCase().trim() === "property" ? taffyDbPropExists(dbName) : taffyDbFileExists(dbName);
    };
    TiHelpers.deleteTaffyDb = function(dbName, settings) {
        var persistMode = findPersistMode(settings);
        if (persistMode.toLowerCase().trim() !== "property") return deleteTaffyDbFile(dbName);
        Ti.App.Properties.removeProperty("ti_taffydb_" + dbName.toUpperCase());
    };
})();

var TAFFY;

(function() {
    var version = "2.4.1", TC = 1, idpad = "000000", cmax = 1000, API = {}, JSONProtect = function(t) {
        return TAFFY.isArray(t) || TAFFY.isObject(t) ? t : JSON.parse(t);
    }, each = function(a, fun, u) {
        if (a && (T.isArray(a) && a.length == 1 || !T.isArray(a))) fun(T.isArray(a) ? a[0] : a, 0); else for (var r, i, x = 0, a = T.isArray(a) ? a : [ a ], y = a.length; x < y; x++) {
            var i = a[x];
            if (!T.isUndefined(i) || u || !1) {
                r = fun(i, x);
                if (r === T.EXIT) break;
            }
        }
    }, eachin = function(o, fun) {
        var x = 0, r;
        for (var i in o) {
            o.hasOwnProperty(i) && (r = fun(o[i], i, x++));
            if (r === T.EXIT) break;
        }
    };
    API.extend = function(m, f) {
        API[m] = function() {
            return f.apply(this, arguments);
        };
    };
    var isIndexable = function(f) {
        if (T.isString(f) && /[t][0-9]*[r][0-9]*/i.test(f)) return !0;
        if (T.isObject(f) && f.___id && f.___s) return !0;
        if (T.isArray(f)) {
            var i = !0;
            each(f, function(r) {
                if (!isIndexable(r)) {
                    i = !1;
                    return TAFFY.EXIT;
                }
            });
            return i;
        }
        return !1;
    }, returnFilter = function(f) {
        var nf = [];
        T.isString(f) && /[t][0-9]*[r][0-9]*/i.test(f) && (f = {
            ___id: f
        });
        if (T.isArray(f)) {
            each(f, function(r) {
                nf.push(returnFilter(r));
            });
            var f = function() {
                var that = this, match = !1;
                each(nf, function(f) {
                    runFilters(that, f) && (match = !0);
                });
                return match;
            };
            return f;
        }
        if (T.isObject(f)) {
            T.isObject(f) && f.___id && f.___s && (f = {
                ___id: f.___id
            });
            eachin(f, function(v, i) {
                T.isObject(v) || (v = {
                    is: v
                });
                eachin(v, function(mtest, s) {
                    var c = [], looper = s === "hasAll" ? function(mtest, func) {
                        func(mtest);
                    } : each;
                    looper(mtest, function(mtest) {
                        var su = !0, f = !1, matchFunc = function() {
                            var mvalue = this[i];
                            if (s.indexOf("!") === 0) {
                                su = !1;
                                s = s.substring(1, s.length);
                            }
                            var r = s === "regex" ? mtest.test(mvalue) : s === "lt" ? mvalue < mtest : s === "gt" ? mvalue > mtest : s === "lte" ? mvalue <= mtest : s === "gte" ? mvalue >= mtest : s === "left" ? mvalue.indexOf(mtest) === 0 : s === "leftnocase" ? mvalue.toLowerCase().indexOf(mtest.toLowerCase()) === 0 : s === "right" ? mvalue.substring(mvalue.length - mtest.length) === mtest : s === "rightnocase" ? mvalue.toLowerCase().substring(mvalue.length - mtest.length) === mtest.toLowerCase() : s === "like" ? mvalue.indexOf(mtest) >= 0 : s === "likenocase" ? mvalue.toLowerCase().indexOf(mtest.toLowerCase()) >= 0 : s === "is" ? mvalue === mtest : s === "isnocase" ? mvalue.toLowerCase() === mtest.toLowerCase() : s === "has" ? T.has(mvalue, mtest) : s === "hasall" ? T.hasAll(mvalue, mtest) : s.indexOf("is") === -1 && !TAFFY.isNull(mvalue) && !TAFFY.isUndefined(mvalue) && !TAFFY.isObject(mtest) && !TAFFY.isArray(mtest) ? mtest === mvalue[s] : T[s] && T.isFunction(T[s]) && s.indexOf("is") === 0 ? T[s](mvalue) === mtest : T[s] && T.isFunction(T[s]) ? T[s](mvalue, mtest) : su === f;
                            r = r && !su ? !1 : !r && !su ? !0 : r;
                            return r;
                        };
                        c.push(matchFunc);
                    });
                    c.length === 1 ? nf.push(c[0]) : nf.push(function() {
                        var that = this, match = !1;
                        each(c, function(f) {
                            f.apply(that) && (match = !0);
                        });
                        return match;
                    });
                });
            });
            var f = function() {
                var that = this, match = !0;
                match = nf.length == 1 && !nf[0].apply(that) ? !1 : nf.length == 2 && (!nf[0].apply(that) || !nf[1].apply(that)) ? !1 : nf.length == 3 && (!nf[0].apply(that) || !nf[1].apply(that) || !nf[2].apply(that)) ? !1 : nf.length == 4 && (!nf[0].apply(that) || !nf[1].apply(that) || !nf[2].apply(that) || !nf[3].apply(that)) ? !1 : !0;
                nf.length > 4 && each(nf, function(f) {
                    runFilters(that, f) || (match = !1);
                });
                return match;
            };
            return f;
        }
        if (T.isFunction(f)) return f;
    }, orderByCol = function(ar, o) {
        var sortFunc = function(a, b) {
            var r = 0;
            T.each(o, function(sd) {
                var o = sd.split(" "), col = o[0], dir = o.length === 1 ? "logical" : o[1];
                if (dir === "logical") {
                    var c = numcharsplit(a[col]), d = numcharsplit(b[col]);
                    T.each(c.length <= d.length ? c : d, function(x, i) {
                        if (c[i] < d[i]) {
                            r = -1;
                            return TAFFY.EXIT;
                        }
                        if (c[i] > d[i]) {
                            r = 1;
                            return TAFFY.EXIT;
                        }
                    });
                } else if (dir === "logicaldesc") {
                    var c = numcharsplit(a[col]), d = numcharsplit(b[col]);
                    T.each(c.length <= d.length ? c : d, function(x, i) {
                        if (c[i] > d[i]) {
                            r = -1;
                            return TAFFY.EXIT;
                        }
                        if (c[i] < d[i]) {
                            r = 1;
                            return TAFFY.EXIT;
                        }
                    });
                } else {
                    if (dir === "asec" && a[col] < b[col]) {
                        r = -1;
                        return T.EXIT;
                    }
                    if (dir === "asec" && a[col] > b[col]) {
                        r = 1;
                        return T.EXIT;
                    }
                    if (dir === "desc" && a[col] > b[col]) {
                        r = -1;
                        return T.EXIT;
                    }
                    if (dir === "desc" && a[col] < b[col]) {
                        r = 1;
                        return T.EXIT;
                    }
                }
                r === 0 && dir === "logical" && c.length < d.length ? r = -1 : r === 0 && dir === "logical" && c.length > d.length ? r = 1 : r === 0 && dir === "logicaldesc" && c.length > d.length ? r = -1 : r === 0 && dir === "logicaldesc" && c.length < d.length && (r = 1);
                if (r != 0) return T.EXIT;
            });
            return r;
        };
        return ar.sort(sortFunc);
    }, numcharsplit = null;
    (function() {
        var cache = {}, cachcounter = 0;
        numcharsplit = function(thing) {
            if (cachcounter > cmax) {
                cache = {};
                cachcounter = 0;
            }
            return cache["_" + thing] || function() {
                var nthing = String(thing), na = [], rv = "_", rt = "";
                for (var x = 0, xx = nthing.length; x < xx; x++) {
                    var c = nthing.charCodeAt(x);
                    if (c >= 48 && c <= 57 || c === 46) {
                        if (rt != "n") {
                            rt = "n";
                            na.push(rv.toLowerCase());
                            rv = "";
                        }
                        rv += nthing.charAt(x);
                    } else {
                        if (rt != "s") {
                            rt = "s";
                            na.push(parseFloat(rv));
                            rv = "";
                        }
                        rv += nthing.charAt(x);
                    }
                }
                na.push(rt === "n" ? parseFloat(rv) : rv.toLowerCase());
                na.shift();
                cache["_" + thing] = na;
                cachcounter++;
                return na;
            }();
        };
    })();
    var run = function() {
        this.context({
            results: this.getDBI().query(this.context())
        });
    };
    API.extend("filter", function() {
        var nc = TAFFY.mergeObj(this.context(), {
            run: null
        }), nq = [];
        each(nc.q, function(v) {
            nq.push(v);
        });
        nc.q = nq;
        each(arguments, function(f) {
            nc.q.push(returnFilter(f));
            nc.filterRaw.push(f);
        });
        return this.getroot(nc);
    });
    API.extend("order", function(o) {
        var o = o.split(","), x = [];
        each(o, function(r) {
            x.push(r.replace(/^\s*/, "").replace(/\s*$/, ""));
        });
        var nc = TAFFY.mergeObj(this.context(), {
            sort: null
        });
        nc.order = x;
        return this.getroot(nc);
    });
    API.extend("limit", function(n) {
        var nc = TAFFY.mergeObj(this.context(), {});
        nc.limit = n;
        if (nc.run && nc.sort) {
            var limitedresults = [];
            each(nc.results, function(i, x) {
                if (x + 1 > n) return TAFFY.EXIT;
                limitedresults.push(i);
            });
            nc.results = limitedresults;
        }
        return this.getroot(nc);
    });
    API.extend("start", function(n) {
        var nc = TAFFY.mergeObj(this.context(), {});
        nc.start = n;
        if (nc.run && nc.sort && !nc.limit) {
            var limitedresults = [];
            each(nc.results, function(i, x) {
                x + 1 > n && limitedresults.push(i);
            });
            nc.results = limitedresults;
        } else nc = TAFFY.mergeObj(this.context(), {
            run: null,
            start: n
        });
        return this.getroot(nc);
    });
    API.extend("update", function() {
        var runEvent = !0, o = {}, args = arguments;
        if (!TAFFY.isString(arguments[0]) || arguments.length != 2 && arguments.length != 3) {
            o = args[0];
            args.length == 2 && (runEvent = args[0]);
        } else {
            o[arguments[0]] = arguments[1];
            arguments.length == 3 && (runEvent = arguments[2]);
        }
        var that = this;
        run.call(this);
        each(this.context().results, function(r) {
            var c = o;
            TAFFY.isFunction(c) ? c = c.apply(TAFFY.mergeObj(r, {})) : T.isFunction(c) && (c = c(TAFFY.mergeObj(r, {})));
            TAFFY.isObject(c) && that.getDBI().update(r.___id, c, runEvent);
        });
        this.context().results.length && this.context({
            run: null
        });
        return this;
    });
    API.extend("remove", function(runEvent) {
        var that = this, c = 0;
        run.call(this);
        each(this.context().results, function(r) {
            that.getDBI().remove(r.___id);
            c++;
        });
        if (this.context().results.length) {
            this.context({
                run: null
            });
            that.getDBI().removeCommit(runEvent);
        }
        return c;
    });
    API.extend("count", function() {
        run.call(this);
        return this.context().results.length;
    });
    API.extend("callback", function(f, delay) {
        if (f) {
            var that = this;
            setTimeout(function() {
                run.call(that);
                f.call(that.getroot(that.context()));
            }, delay ? delay : 0);
        }
        return null;
    });
    API.extend("get", function() {
        run.call(this);
        return this.context().results;
    });
    API.extend("stringify", function() {
        return JSON.stringify(this.get());
    });
    API.extend("first", function() {
        run.call(this);
        return this.context().results[0] || !1;
    });
    API.extend("last", function() {
        run.call(this);
        return this.context().results[this.context().results.length - 1] || !1;
    });
    API.extend("sum", function() {
        var total = 0;
        run.call(this);
        var that = this;
        each(arguments, function(c) {
            each(that.context().results, function(r) {
                total += r[c];
            });
        });
        return total;
    });
    API.extend("min", function(c) {
        var lowest = null;
        run.call(this);
        each(this.context().results, function(r) {
            if (lowest === null || r[c] < lowest) lowest = r[c];
        });
        return lowest;
    });
    API.extend("max", function(c) {
        var highest = null;
        run.call(this);
        each(this.context().results, function(r) {
            if (highest === null || r[c] > highest) highest = r[c];
        });
        return highest;
    });
    API.extend("select", function() {
        var ra = [], args = arguments;
        run.call(this);
        arguments.length === 1 ? each(this.context().results, function(r) {
            ra.push(r[args[0]]);
        }) : each(this.context().results, function(r) {
            var row = [];
            each(args, function(c) {
                row.push(r[c]);
            });
            ra.push(row);
        });
        return ra;
    });
    API.extend("distinct", function() {
        var ra = [], args = arguments;
        run.call(this);
        arguments.length === 1 ? each(this.context().results, function(r) {
            var v = r[args[0]], dup = !1;
            each(ra, function(d) {
                if (v === d) {
                    dup = !0;
                    return TAFFY.EXIT;
                }
            });
            dup || ra.push(v);
        }) : each(this.context().results, function(r) {
            var row = [];
            each(args, function(c) {
                row.push(r[c]);
            });
            var dup = !1;
            each(ra, function(d) {
                var ldup = !0;
                each(args, function(c, i) {
                    if (row[i] != d[i]) {
                        ldup = !1;
                        return TAFFY.EXIT;
                    }
                });
                if (ldup) {
                    dup = !0;
                    return TAFFY.EXIT;
                }
            });
            dup || ra.push(row);
        });
        return ra;
    });
    API.extend("supplant", function(template, returnarray) {
        var ra = [];
        run.call(this);
        each(this.context().results, function(r) {
            ra.push(template.replace(/{([^{}]*)}/g, function(a, b) {
                var v = r[b];
                return typeof v == "string" || typeof v == "number" ? v : a;
            }));
        });
        return returnarray ? ra : ra.join("");
    });
    API.extend("each", function(m) {
        run.call(this);
        each(this.context().results, m);
        return this;
    });
    API.extend("map", function(m) {
        var ra = [];
        run.call(this);
        each(this.context().results, function(r) {
            ra.push(m(r));
        });
        return ra;
    });
    var runFilters = function(r, filter) {
        var match = !0;
        each(filter, function(mf) {
            switch (T.typeOf(mf)) {
              case "function":
                if (!mf.apply(r)) {
                    match = !1;
                    return TAFFY.EXIT;
                }
                break;
              case "array":
                match = mf.length == 1 ? runFilters(r, mf[0]) : mf.length == 2 ? runFilters(r, mf[0]) || runFilters(r, mf[1]) : mf.length == 3 ? runFilters(r, mf[0]) || runFilters(r, mf[1]) || runFilters(r, mf[2]) : mf.length == 4 ? runFilters(r, mf[0]) || runFilters(r, mf[1]) || runFilters(r, mf[2]) || runFilters(r, mf[3]) : !1;
                mf.length > 4 && each(mf, function(f) {
                    runFilters(r, f) && (match = !0);
                });
            }
        });
        return match;
    }, T = function(d) {
        var TOb = [], ID = {}, RC = 1, settings = {
            template: !1,
            onInsert: !1,
            onUpdate: !1,
            onRemove: !1,
            onDBChange: !1,
            storageName: !1,
            forcePropertyCase: null,
            cacheSize: 100,
            persistMode: "file",
            autoCommit: !1
        }, dm = new Date, CacheCount = 0, CacheClear = 0, dirtyTransCount = 0;
        Cache = {};
        var runIndexes = function(indexes) {
            if (indexes.length == 0) return TOb;
            var records = [], UniqueEnforce = !1;
            each(indexes, function(f) {
                if (T.isString(f) && /[t][0-9]*[r][0-9]*/i.test(f) && TOb[ID[f]]) {
                    records.push(TOb[ID[f]]);
                    UniqueEnforce = !0;
                }
                if (T.isObject(f) && f.___id && f.___s && TOb[ID[f.___id]]) {
                    records.push(TOb[ID[f.___id]]);
                    UniqueEnforce = !0;
                }
                T.isArray(f) && each(f, function(r) {
                    each(runIndexes(r), function(rr) {
                        records.push(rr);
                    });
                });
            });
            UniqueEnforce && records.length > 1 && (records = []);
            return records;
        }, DBI = {
            dm: function(nd) {
                dirtyTransCount++;
                if (nd) {
                    dm = nd;
                    Cache = {};
                    CacheCount = 0;
                    CacheClear = 0;
                }
                settings.onDBChange && setTimeout(function() {
                    settings.onDBChange.call(TOb);
                }, 0);
                settings.autoCommit && TiHelpers.safeString(settings.storageName).trim().length > 0 && setTimeout(function() {
                    root.saveDb(settings.storageName);
                });
                return dm;
            },
            insert: function(i, runEvent) {
                var columns = [], records = [], input = JSONProtect(i);
                each(input, function(v, i) {
                    if (T.isArray(v) && i === 0) {
                        each(v, function(av) {
                            columns.push(settings.forcePropertyCase === "lower" ? av.toLowerCase() : settings.forcePropertyCase === "upper" ? av.toUpperCase() : av);
                        });
                        return !0;
                    }
                    if (T.isArray(v)) {
                        var nv = {};
                        each(v, function(av, ai) {
                            nv[columns[ai]] = av;
                        });
                        v = nv;
                    } else if (T.isObject(v) && settings.forcePropertyCase) {
                        var o = {};
                        eachin(v, function(av, ai) {
                            o[settings.forcePropertyCase === "lower" ? ai.toLowerCase() : settings.forcePropertyCase === "upper" ? ai.toUpperCase() : ai] = v[ai];
                        });
                        v = o;
                    }
                    RC++;
                    v.___id = "T" + String(idpad + TC).slice(-6) + "R" + String(idpad + RC).slice(-6);
                    v.___s = !0;
                    records.push(v.___id);
                    settings.template && (v = T.mergeObj(settings.template, v));
                    TOb.push(v);
                    ID[v.___id] = TOb.length - 1;
                    settings.onInsert && (runEvent || TAFFY.isUndefined(runEvent)) && settings.onInsert.call(v);
                    DBI.dm(new Date);
                });
                return root(records);
            },
            sort: function(o) {
                TOb = orderByCol(TOb, o.split(","));
                ID = {};
                each(TOb, function(r, i) {
                    ID[r.___id] = i;
                });
                DBI.dm(new Date);
                return !0;
            },
            update: function(id, changes, runEvent) {
                var nc = {};
                if (settings.forcePropertyCase) {
                    eachin(changes, function(v, p) {
                        nc[settings.forcePropertyCase === "lower" ? p.toLowerCase() : settings.forcePropertyCase === "upper" ? p.toUpperCase() : p] = v;
                    });
                    changes = nc;
                }
                var or = TOb[ID[id]], nr = T.mergeObj(or, changes), tc = {}, hasChange = !1;
                eachin(nr, function(v, i) {
                    if (TAFFY.isUndefined(or[i]) || or[i] != v) {
                        tc[i] = v;
                        hasChange = !0;
                    }
                });
                if (hasChange) {
                    settings.onUpdate && (runEvent || TAFFY.isUndefined(runEvent)) && settings.onUpdate.call(nr, TOb[ID[id]], tc);
                    TOb[ID[id]] = nr;
                    DBI.dm(new Date);
                }
            },
            remove: function(id) {
                TOb[ID[id]].___s = !1;
                dirtyTransCount++;
            },
            resetDb: function() {
                TOb = [];
                ID = {};
                RC = 1;
                CacheCount = 0;
                CacheClear = 0;
                Cache = {};
                dm = new Date;
                dirtyTransCount = 0;
            },
            removeCommit: function(runEvent) {
                for (var x = TOb.length - 1; x > -1; x--) if (!TOb[x].___s) {
                    settings.onRemove && (runEvent || TAFFY.isUndefined(runEvent)) && settings.onRemove.call(TOb[x]);
                    ID[TOb[x].___id] = undefined;
                    TOb.splice(x, 1);
                }
                ID = {};
                each(TOb, function(r, i) {
                    ID[r.___id] = i;
                });
                DBI.dm(new Date);
            },
            query: function(context) {
                var returnq;
                if (settings.cacheSize) {
                    var cid = "";
                    each(context.filterRaw, function(r) {
                        if (T.isFunction(r)) {
                            cid = "nocache";
                            return TAFFY.EXIT;
                        }
                    });
                    cid == "" && (cid = JSON.stringify(T.mergeObj(context, {
                        q: !1,
                        run: !1,
                        sort: !1
                    })));
                }
                if (!context.results || !context.run || context.run && DBI.dm() > context.run) {
                    var results = [];
                    if (settings.cacheSize && Cache[cid]) {
                        Cache[cid].i = CacheCount++;
                        return Cache[cid].results;
                    }
                    if (context.q.length == 0 && context.index.length == 0) {
                        each(TOb, function(r) {
                            results.push(r);
                        });
                        returnq = results;
                    } else {
                        var indexed = runIndexes(context.index);
                        each(indexed, function(r) {
                            (context.q.length == 0 || runFilters(r, context.q)) && results.push(r);
                        });
                        returnq = results;
                    }
                } else returnq = context.results;
                context.order.length > 0 && (!context.run || !context.sort) && (returnq = orderByCol(returnq, context.order));
                if (returnq.length && (context.limit && context.limit < returnq.length || context.start)) {
                    var limitq = [];
                    each(returnq, function(r, i) {
                        if (!context.start || context.start && i + 1 >= context.start) if (context.limit) {
                            var ni = context.start ? i + 1 - context.start : i;
                            if (ni < context.limit) limitq.push(r); else if (ni > context.limit) return TAFFY.EXIT;
                        } else limitq.push(r);
                    });
                    returnq = limitq;
                }
                if (settings.cacheSize && cid != "nocache") {
                    CacheClear++;
                    setTimeout(function() {
                        if (CacheClear >= settings.cacheSize * 2) {
                            CacheClear = 0;
                            var bCounter = CacheCount - settings.cacheSize, nc = {};
                            eachin(function(r, k) {
                                r.i >= bCounter && (nc[k] = r);
                            });
                            Cache = nc;
                        }
                    }, 0);
                    Cache[cid] = {
                        i: CacheCount++,
                        results: returnq
                    };
                }
                return returnq;
            }
        }, helpers = {
            hasDbName: function(dbName) {
                if (TiHelpers.safeString(dbName).trim().length > 0) {
                    settings.storageName = dbName;
                    return !0;
                }
                return TiHelpers.safeString(settings.storageName).trim().length > 0;
            }
        }, root = function() {
            var iAPI = TAFFY.mergeObj(TAFFY.mergeObj(API, {
                insert: undefined
            }), {
                getSettings: function() {
                    return settings;
                },
                getDBI: function() {
                    return DBI;
                },
                getroot: function(c) {
                    return root.call(c);
                },
                context: function(n) {
                    n && (context = TAFFY.mergeObj(context, "results" in n ? TAFFY.mergeObj(n, {
                        run: new Date,
                        sort: new Date
                    }) : n));
                    return context;
                },
                extend: undefined
            }), context = this && this.q ? this : {
                limit: !1,
                start: !1,
                q: [],
                filterRaw: [],
                index: [],
                order: [],
                results: !1,
                run: null,
                sort: null
            };
            each(arguments, function(f) {
                isIndexable(f) ? context.index.push(f) : context.q.push(returnFilter(f));
                context.filterRaw.push(f);
            });
            return iAPI;
        };
        TC++;
        d && DBI.insert(d);
        root.insert = DBI.insert;
        root.TAFFY = !0;
        root.sort = DBI.sort;
        root.name = settings.storageName;
        root.readSettings = function() {
            return settings;
        };
        root.settings = function(n) {
            if (n) {
                settings = TAFFY.mergeObj(settings, n);
                n.template && root().update(n.template);
            }
            return settings;
        };
        root.exists = function(name) {
            return helpers.hasDbName(name) ? TiHelpers.taffyDbExists(settings.storageName, settings) : !1;
        };
        root.destroy = function(name) {
            if (!helpers.hasDbName(name)) throw "No db name provided";
            TiHelpers.deleteTaffyDb(settings.storageName, settings);
            DBI.resetDb();
            return;
        };
        root.open = function(name) {
            if (!helpers.hasDbName(name)) throw "No db name provided";
            var d = TiHelpers.readTaffyDb(name, settings);
            DBI.resetDb();
            DBI.insert(d);
            dirtyTransCount = 0;
            return root;
        };
        root.commit = function() {
            var dbName = TiHelpers.safeString(settings.storageName).trim();
            if (dbName.length === 0) return;
            root.save(dbName);
        };
        root.save = function(name) {
            if (TiHelpers.safeString(name).trim().length > 0) settings.storageName = name; else if (TiHelpers.safeString(settings.storageName).trim().length === 0) throw "No db name provided";
            TOb.length > 0 ? TiHelpers.saveTaffyDb(settings.storageName, TOb, settings) : dirtyTransCount > 0 && TiHelpers.deleteTaffyDb(settings.storageName, settings);
            dirtyTransCount = 0;
            return root;
        };
        return root;
    };
    TAFFY = T;
    T.each = each;
    T.eachin = eachin;
    T.extend = API.extend;
    TAFFY.EXIT = "TAFFYEXIT";
    TAFFY.mergeObj = function(ob1, ob2) {
        var c = {};
        eachin(ob1, function(v, n) {
            c[n] = ob1[n];
        });
        eachin(ob2, function(v, n) {
            c[n] = ob2[n];
        });
        return c;
    };
    TAFFY.has = function(var1, var2) {
        var re = !0;
        if (var1.TAFFY) {
            re = var1(var2);
            return re.length > 0 ? !0 : !1;
        }
        switch (T.typeOf(var1)) {
          case "object":
            if (T.isObject(var2)) eachin(var2, function(v, n) {
                if (re !== !0 || !!T.isUndefined(var1[n]) || !var1.hasOwnProperty(n)) {
                    re = !1;
                    return TAFFY.EXIT;
                }
                re = T.has(var1[n], var2[n]);
            }); else if (T.isArray(var2)) each(var2, function(v, n) {
                re = T.has(var1, var2[n]);
                if (re) return TAFFY.EXIT;
            }); else if (T.isString(var2)) return TAFFY.isUndefined(var1[var2]) ? !1 : !0;
            return re;
          case "array":
            if (T.isObject(var2)) each(var1, function(v, i) {
                re = T.has(var1[i], var2);
                if (re === !0) return TAFFY.EXIT;
            }); else if (T.isArray(var2)) each(var2, function(v2, i2) {
                each(var1, function(v1, i1) {
                    re = T.has(var1[i1], var2[i2]);
                    if (re === !0) return TAFFY.EXIT;
                });
                if (re === !0) return TAFFY.EXIT;
            }); else if (T.isString(var2) || T.isNumber(var2)) for (var n = 0; n < var1.length; n++) {
                re = T.has(var1[n], var2);
                if (re) return !0;
            }
            return re;
          case "string":
            if (T.isString(var2) && var2 === var1) return !0;
            break;
          default:
            if (T.typeOf(var1) === T.typeOf(var2) && var1 === var2) return !0;
        }
        return !1;
    };
    TAFFY.hasAll = function(var1, var2) {
        var T = TAFFY;
        if (T.isArray(var2)) {
            var ar = !0;
            each(var2, function(v) {
                ar = T.has(var1, v);
                if (ar === !1) return TAFFY.EXIT;
            });
            return ar;
        }
        return T.has(var1, var2);
    };
    TAFFY.typeOf = function(v) {
        var s = typeof v;
        s === "object" && (v ? typeof v.length == "number" && !v.propertyIsEnumerable("length") && (s = "array") : s = "null");
        return s;
    };
    TAFFY.getObjectKeys = function(ob) {
        var kA = [];
        eachin(ob, function(n, h) {
            kA.push(h);
        });
        kA.sort();
        return kA;
    };
    TAFFY.isSameArray = function(ar1, ar2) {
        return TAFFY.isArray(ar1) && TAFFY.isArray(ar2) && ar1.join(",") === ar2.join(",") ? !0 : !1;
    };
    TAFFY.isSameObject = function(ob1, ob2) {
        var T = TAFFY, rv = !0;
        T.isObject(ob1) && T.isObject(ob2) ? T.isSameArray(T.getObjectKeys(ob1), T.getObjectKeys(ob2)) ? eachin(ob1, function(v, n) {
            if (!(T.isObject(ob1[n]) && T.isObject(ob2[n]) && T.isSameObject(ob1[n], ob2[n]) || T.isArray(ob1[n]) && T.isArray(ob2[n]) && T.isSameArray(ob1[n], ob2[n]) || ob1[n] === ob2[n])) {
                rv = !1;
                return TAFFY.EXIT;
            }
        }) : rv = !1 : rv = !1;
        return rv;
    };
    (function(ts) {
        for (var z = 0; z < ts.length; z++) (function(y) {
            TAFFY["is" + y] = function(c) {
                return TAFFY.typeOf(c) === y.toLowerCase() ? !0 : !1;
            };
        })(ts[z]);
    })([ "String", "Number", "Object", "Array", "Boolean", "Null", "Function", "Undefined" ]);
})();

exports.taffyDb = TAFFY;