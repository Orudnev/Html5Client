/*
 jqGridMobile  1.1   - jQuery Grid for mobile devices
 Copyright (c) 2012, Tony Tomov, tony@trirand.com

 license http://www.trirand.com/blog/jqgrid/mobile/Trial-License.txt
*/
(function(b) {
    b.jgrid = b.jgrid || {};
    b.extend(b.jgrid, {
        version: "1.1",
        htmlDecode: function(b) {
            return b && ("&nbsp;" == b || "&#160;" == b || 1 === b.length && 160 === b.charCodeAt(0)) ? "" : !b ? b : ("" + b).replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&quot;/g, '"').replace(/&amp;/g, "&")
        },
        htmlEncode: function(b) {
            return !b ? b : ("" + b).replace(/&/g, "&amp;").replace(/\"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        },
        format: function(f) {
            var d = b.makeArray(arguments).slice(1);
            null == f && (f = "");
            return f.replace(/\{(\d+)\}/g, function(b,
                e) {
                return d[e]
            })
        },
        msie: "Microsoft Internet Explorer" == navigator.appName,
        msiever: function() {
            var b = -1;
            null != /MSIE ([0-9]{1,}[.0-9]{0,})/.exec(navigator.userAgent) && (b = parseFloat(RegExp.$1));
            return b
        },
        getCellIndex: function(f) {
            f = b(f);
            if (f.is("tr")) return -1;
            f = (!f.is("td") && !f.is("th") ? f.closest("td,th") : f)[0];
            return b.jgrid.msie ? b.inArray(f, f.parentNode.cells) : f.cellIndex
        },
        stripHtml: function(b) {
            var b = "" + b,
                d = /<("[^"]*"|'[^']*'|[^'">])*>/gi;
            return b ? (b = b.replace(d, "")) && "&nbsp;" !== b && "&#160;" !== b ? b.replace(/\"/g,
                "'") : "" : b
        },
        stripPref: function(f, d) {
            var c = b.type(f);
            if ("string" == c || "number" == c) f = "" + f, d = "" !== f ? ("" + d).replace("" + f, "") : d;
            return d
        },
        stringToDoc: function(b) {
            var d;
            if ("string" !== typeof b) return b;
            try {
                d = (new DOMParser).parseFromString(b, "text/xml")
            } catch (c) {
                d = new ActiveXObject("Microsoft.XMLDOM"), d.async = !1, d.loadXML(b)
            }
            return d && d.documentElement && "parsererror" != d.documentElement.tagName ? d : null
        },
        parse: function(f) {
            "while(1);" == f.substr(0, 9) && (f = f.substr(9));
            "/*" == f.substr(0, 2) && (f = f.substr(2, f.length -
                4));
            f || (f = "{}");
            return !0 === b.jgrid.useJSON && "object" === typeof JSON && "function" === typeof JSON.parse ? JSON.parse(f) : eval("(" + f + ")")
        },
        parseDate: function(f, d) {
            var c = {
                    m: 1,
                    d: 1,
                    y: 1970,
                    h: 0,
                    i: 0,
                    s: 0,
                    u: 0
                },
                e, a, i;
            e = /[\\\/:_;.,\t\s-]/;
            if (d && null != d) {
                d = b.trim(d);
                d = d.split(e);
                void 0 !== b.jgrid.formatter.date.masks[f] && (f = b.jgrid.formatter.date.masks[f]);
                var f = f.split(e),
                    g = b.jgrid.formatter.date.monthNames,
                    h = b.jgrid.formatter.date.AmPm,
                    j = function(a, b) {
                        0 === a ? 12 === b && (b = 0) : 12 !== b && (b += 12);
                        return b
                    };
                e = 0;
                for (a = f.length; e <
                    a; e++) "M" == f[e] && (i = b.inArray(d[e], g), -1 !== i && 12 > i && (d[e] = i + 1, c.m = d[e])), "F" == f[e] && (i = b.inArray(d[e], g), -1 !== i && 11 < i && (d[e] = i + 1 - 12, c.m = d[e])), "a" == f[e] && (i = b.inArray(d[e], h), -1 !== i && (2 > i && d[e] == h[i]) && (d[e] = i, c.h = j(d[e], c.h))), "A" == f[e] && (i = b.inArray(d[e], h), -1 !== i && (1 < i && d[e] == h[i]) && (d[e] = i - 2, c.h = j(d[e], c.h))), "g" === f[e] && (c.h = parseInt(d[e], 10)), void 0 !== d[e] && (c[f[e].toLowerCase()] = parseInt(d[e], 10));
                c.m = parseInt(c.m, 10) - 1;
                e = c.y;
                70 <= e && 99 >= e ? c.y = 1900 + c.y : 0 <= e && 69 >= e && (c.y = 2E3 + c.y);
                void 0 !== c.j &&
                    (c.d = c.j);
                void 0 !== c.n && (c.m = parseInt(c.n, 10) - 1)
            }
            return new Date(c.y, c.m, c.d, c.h, c.i, c.s, c.u)
        },
        jqID: function(b) {
            return ("" + b).replace(/[!"#$%&'()*+,.\/:;<=>?@\[\\\]\^`{|}~]/g, "\\$&")
        },
        guid: 1,
        uidPref: "jqg",
        randId: function(f) {
            return (f || b.jgrid.uidPref) + b.jgrid.guid++
        },
        getAccessor: function(b, d) {
            var c, e, a = [],
                i;
            if ("function" === typeof d) return d(b);
            c = b[d];
            if (void 0 === c) try {
                if ("string" === typeof d && (a = d.split(".")), i = a.length)
                    for (c = b; c && i--;) e = a.shift(), c = c[e]
            } catch (g) {}
            return c
        },
        getXmlData: function(f, d, c) {
            var e =
                "string" === typeof d ? d.match(/^(.*)\[(\w+)\]$/) : null;
            if ("function" === typeof d) return d(f);
            if (e && e[2]) return e[1] ? b(e[1], f).attr(e[2]) : b(f).attr(e[2]);
            f = b(d, f);
            return c ? f : 0 < f.length ? b(f).text() : void 0
        },
        cellWidth: function() {
            var f = b("<div class='ui-jqgrid' style='left:10000px'><table class='ui-jqgrid-btable' style='width:5px;'><tr class='jqgrow'><td style='width:5px;'></td></tr></table></div>"),
                d = f.appendTo("body").find("td").width();
            f.remove();
            return 5 !== d
        },
        cell_width: !0,
        ajaxOptions: {},
        from: function(f) {
            return new function(d,
                c) {
                "string" === typeof d && (d = b.data(d));
                var e = this,
                    a = d,
                    f = !0,
                    g = !1,
                    h = c,
                    j = /[\$,%]/g,
                    k = null,
                    l = null,
                    n = 0,
                    p = !1,
                    m = "",
                    v = [],
                    s = !0;
                if ("object" === typeof d && d.push) 0 < d.length && (s = "object" !== typeof d[0] ? !1 : !0);
                else throw "data provides is not an array";
                this._hasData = function() {
                    return null === a ? !1 : 0 === a.length ? !1 : !0
                };
                this._getStr = function(a) {
                    var b = [];
                    g && b.push("jQuery.trim(");
                    b.push("String(" + a + ")");
                    g && b.push(")");
                    f || b.push(".toLowerCase()");
                    return b.join("")
                };
                this._strComp = function(a) {
                    return "string" === typeof a ? ".toString()" :
                        ""
                };
                this._group = function(a, b) {
                    return {
                        field: a.toString(),
                        unique: b,
                        items: []
                    }
                };
                this._toStr = function(a) {
                    g && (a = b.trim(a));
                    a = a.toString().replace(/\\/g, "\\\\").replace(/\"/g, '\\"');
                    return f ? a : a.toLowerCase()
                };
                this._funcLoop = function(e) {
                    var c = [];
                    b.each(a, function(a, b) {
                        c.push(e(b))
                    });
                    return c
                };
                this._append = function(a) {
                    var b;
                    h = null === h ? "" : h + ("" === m ? " && " : m);
                    for (b = 0; b < n; b++) h += "(";
                    p && (h += "!");
                    h += "(" + a + ")";
                    p = !1;
                    m = "";
                    n = 0
                };
                this._setCommand = function(a, b) {
                    k = a;
                    l = b
                };
                this._resetNegate = function() {
                    p = !1
                };
                this._repeatCommand =
                    function(a, b) {
                        return null === k ? e : null !== a && null !== b ? k(a, b) : null === l || !s ? k(a) : k(l, a)
                    };
                this._equals = function(a, b) {
                    return 0 === e._compare(a, b, 1)
                };
                this._compare = function(a, b, e) {
                    var c = Object.prototype.toString;
                    void 0 === e && (e = 1);
                    void 0 === a && (a = null);
                    void 0 === b && (b = null);
                    if (null === a && null === b) return 0;
                    if (null === a && null !== b) return 1;
                    if (null !== a && null === b) return -1;
                    if ("[object Date]" === c.call(a) && "[object Date]" === c.call(b)) return a < b ? -e : a > b ? e : 0;
                    !f && ("number" !== typeof a && "number" !== typeof b) && (a = ("" + a).toLowerCase(),
                        b = ("" + b).toLowerCase());
                    return a < b ? -e : a > b ? e : 0
                };
                this._performSort = function() {
                    0 !== v.length && (a = e._doSort(a, 0))
                };
                this._doSort = function(a, b) {
                    var c = v[b].by,
                        f = v[b].dir,
                        d = v[b].type,
                        g = v[b].datefmt;
                    if (b == v.length - 1) return e._getOrder(a, c, f, d, g);
                    b++;
                    for (var c = e._getGroup(a, c, f, d, g), f = [], h, d = 0; d < c.length; d++) {
                        h = e._doSort(c[d].items, b);
                        for (g = 0; g < h.length; g++) f.push(h[g])
                    }
                    return f
                };
                this._getOrder = function(a, c, f, d, g) {
                    var h = [],
                        i = [],
                        k = "a" == f ? 1 : -1,
                        l, n;
                    void 0 === d && (d = "text");
                    n = "float" == d || "number" == d || "currency" ==
                        d || "numeric" == d ? function(a) {
                            a = parseFloat(("" + a).replace(j, ""));
                            return isNaN(a) ? 0 : a
                        } : "int" == d || "integer" == d ? function(a) {
                            return a ? parseFloat(("" + a).replace(j, "")) : 0
                        } : "date" == d || "datetime" == d ? function(a) {
                            return b.jgrid.parseDate(g, a).getTime()
                        } : b.isFunction(d) ? d : function(a) {
                            a || (a = "");
                            return b.trim(("" + a).toUpperCase())
                        };
                    b.each(a, function(a, e) {
                        l = "" !== c ? b.jgrid.getAccessor(e, c) : e;
                        void 0 === l && (l = "");
                        l = n(l, e);
                        i.push({
                            vSort: l,
                            index: a
                        })
                    });
                    i.sort(function(a, b) {
                        a = a.vSort;
                        b = b.vSort;
                        return e._compare(a, b, k)
                    });
                    for (var d = 0, p = a.length; d < p;) f = i[d].index, h.push(a[f]), d++;
                    return h
                };
                this._getGroup = function(a, c, d, f, g) {
                    var h = [],
                        i = null,
                        j = null,
                        k;
                    b.each(e._getOrder(a, c, d, f, g), function(a, d) {
                        k = b.jgrid.getAccessor(d, c);
                        null == k && (k = "");
                        e._equals(j, k) || (j = k, null !== i && h.push(i), i = e._group(c, k));
                        i.items.push(d)
                    });
                    null !== i && h.push(i);
                    return h
                };
                this.ignoreCase = function() {
                    f = !1;
                    return e
                };
                this.useCase = function() {
                    f = !0;
                    return e
                };
                this.trim = function() {
                    g = !0;
                    return e
                };
                this.noTrim = function() {
                    g = !1;
                    return e
                };
                this.execute = function() {
                    var c =
                        h,
                        d = [];
                    if (null === c) return e;
                    b.each(a, function() {
                        eval(c) && d.push(this)
                    });
                    a = d;
                    return e
                };
                this.data = function() {
                    return a
                };
                this.select = function(c) {
                    e._performSort();
                    if (!e._hasData()) return [];
                    e.execute();
                    if (b.isFunction(c)) {
                        var d = [];
                        b.each(a, function(a, b) {
                            d.push(c(b))
                        });
                        return d
                    }
                    return a
                };
                this.hasMatch = function() {
                    if (!e._hasData()) return !1;
                    e.execute();
                    return 0 < a.length
                };
                this.andNot = function(a, b, c) {
                    p = !p;
                    return e.and(a, b, c)
                };
                this.orNot = function(a, b, c) {
                    p = !p;
                    return e.or(a, b, c)
                };
                this.not = function(a, b, c) {
                    return e.andNot(a,
                        b, c)
                };
                this.and = function(a, b, c) {
                    m = " && ";
                    return void 0 === a ? e : e._repeatCommand(a, b, c)
                };
                this.or = function(a, b, c) {
                    m = " || ";
                    return void 0 === a ? e : e._repeatCommand(a, b, c)
                };
                this.orBegin = function() {
                    n++;
                    return e
                };
                this.orEnd = function() {
                    null !== h && (h += ")");
                    return e
                };
                this.isNot = function(a) {
                    p = !p;
                    return e.is(a)
                };
                this.is = function(a) {
                    e._append("this." + a);
                    e._resetNegate();
                    return e
                };
                this._compareValues = function(a, c, d, f, g) {
                    var h;
                    h = s ? "jQuery.jgrid.getAccessor(this,'" + c + "')" : "this";
                    void 0 === d && (d = null);
                    var i = d,
                        k = void 0 ===
                        g.stype ? "text" : g.stype;
                    if (null !== d) switch (k) {
                        case "int":
                        case "integer":
                            i = isNaN(Number(i)) || "" === i ? "0" : i;
                            h = "parseInt(" + h + ",10)";
                            i = "parseInt(" + i + ",10)";
                            break;
                        case "float":
                        case "number":
                        case "numeric":
                            i = ("" + i).replace(j, "");
                            i = isNaN(Number(i)) || "" === i ? "0" : i;
                            h = "parseFloat(" + h + ")";
                            i = "parseFloat(" + i + ")";
                            break;
                        case "date":
                        case "datetime":
                            i = "" + b.jgrid.parseDate(g.newfmt || "Y-m-d", i).getTime();
                            h = 'jQuery.jgrid.parseDate("' + g.srcfmt + '",' + h + ").getTime()";
                            break;
                        default:
                            h = e._getStr(h), i = e._getStr('"' + e._toStr(i) +
                                '"')
                    }
                    e._append(h + " " + f + " " + i);
                    e._setCommand(a, c);
                    e._resetNegate();
                    return e
                };
                this.equals = function(a, b, c) {
                    return e._compareValues(e.equals, a, b, "==", c)
                };
                this.notEquals = function(a, b, c) {
                    return e._compareValues(e.equals, a, b, "!==", c)
                };
                this.isNull = function(a, b, c) {
                    return e._compareValues(e.equals, a, null, "===", c)
                };
                this.greater = function(a, b, c) {
                    return e._compareValues(e.greater, a, b, ">", c)
                };
                this.less = function(a, b, c) {
                    return e._compareValues(e.less, a, b, "<", c)
                };
                this.greaterOrEquals = function(a, b, c) {
                    return e._compareValues(e.greaterOrEquals,
                        a, b, ">=", c)
                };
                this.lessOrEquals = function(a, b, c) {
                    return e._compareValues(e.lessOrEquals, a, b, "<=", c)
                };
                this.startsWith = function(a, c) {
                    var d = null == c ? a : c,
                        d = g ? b.trim(d.toString()).length : d.toString().length;
                    s ? e._append(e._getStr("jQuery.jgrid.getAccessor(this,'" + a + "')") + ".substr(0," + d + ") == " + e._getStr('"' + e._toStr(c) + '"')) : (d = g ? b.trim(c.toString()).length : c.toString().length, e._append(e._getStr("this") + ".substr(0," + d + ") == " + e._getStr('"' + e._toStr(a) + '"')));
                    e._setCommand(e.startsWith, a);
                    e._resetNegate();
                    return e
                };
                this.endsWith = function(a, c) {
                    var d = null == c ? a : c,
                        d = g ? b.trim(d.toString()).length : d.toString().length;
                    s ? e._append(e._getStr("jQuery.jgrid.getAccessor(this,'" + a + "')") + ".substr(" + e._getStr("jQuery.jgrid.getAccessor(this,'" + a + "')") + ".length-" + d + "," + d + ') == "' + e._toStr(c) + '"') : e._append(e._getStr("this") + ".substr(" + e._getStr("this") + '.length-"' + e._toStr(a) + '".length,"' + e._toStr(a) + '".length) == "' + e._toStr(a) + '"');
                    e._setCommand(e.endsWith, a);
                    e._resetNegate();
                    return e
                };
                this.contains = function(a, b) {
                    s ?
                        e._append(e._getStr("jQuery.jgrid.getAccessor(this,'" + a + "')") + '.indexOf("' + e._toStr(b) + '",0) > -1') : e._append(e._getStr("this") + '.indexOf("' + e._toStr(a) + '",0) > -1');
                    e._setCommand(e.contains, a);
                    e._resetNegate();
                    return e
                };
                this.groupBy = function(b, c, d, f) {
                    return !e._hasData() ? null : e._getGroup(a, b, c, d, f)
                };
                this.orderBy = function(a, c, d, f) {
                    c = null == c ? "a" : b.trim(c.toString().toLowerCase());
                    null == d && (d = "text");
                    null == f && (f = "Y-m-d");
                    if ("desc" == c || "descending" == c) c = "d";
                    if ("asc" == c || "ascending" == c) c = "a";
                    v.push({
                        by: a,
                        dir: c,
                        type: d,
                        datefmt: f
                    });
                    return e
                };
                return e
            }(f, null)
        },
        getMethod: function(f) {
            return this.getAccessor(b.fn.jqGrid, f)
        },
        extend: function(f) {
            b.extend(b.fn.jqGrid, f);
            this.no_legacy_api || b.fn.extend(f)
        }
    });
    b.fn.jqGrid = function(f) {
        if ("string" === typeof f) {
            var d = b.jgrid.getMethod(f);
            if (!d) throw "jqGrid - No such method: " + f;
            var c = b.makeArray(arguments).slice(1);
            return d.apply(this, c)
        }
        return this.each(function() {
            if (!this.grid) {
                var c = b.extend(!0, {
                        url: "",
                        height: 150,
                        page: 1,
                        rowNum: 20,
                        rowTotal: null,
                        records: 0,
                        pager: "",
                        pgbuttons: !0,
                        pginput: !0,
                        colModel: [],
                        rowList: [],
                        colNames: [],
                        sortorder: "asc",
                        sortname: "",
                        datatype: "xml",
                        mtype: "GET",
                        altRows: !1,
                        selarrrow: [],
                        savedRow: [],
                        shrinkToFit: !0,
                        xmlReader: {},
                        jsonReader: {},
                        subGrid: !1,
                        subGridModel: [],
                        reccount: 0,
                        lastpage: 0,
                        lastsort: 0,
                        selrow: null,
                        beforeSelectRow: null,
                        onSelectRow: null,
                        onSortCol: null,
                        ondblClickRow: null,
                        onRightClickRow: null,
                        onPaging: null,
                        onSelectAll: null,
                        loadComplete: null,
                        gridComplete: null,
                        loadError: null,
                        loadBeforeSend: null,
                        afterInsertRow: null,
                        beforeRequest: null,
                        beforeProcessing: null,
                        onHeaderClick: null,
                        viewrecords: !1,
                        loadonce: !1,
                        multiselect: !1,
                        multikey: !1,
                        editurl: null,
                        search: !1,
                        caption: "",
                        hidegrid: !0,
                        hiddengrid: !1,
                        postData: {},
                        userData: {},
                        treeGrid: !1,
                        treeGridModel: "nested",
                        treeReader: {},
                        treeANode: -1,
                        ExpandColumn: null,
                        tree_root_level: 0,
                        prmNames: {
                            page: "page",
                            rows: "rows",
                            sort: "sidx",
                            order: "sord",
                            search: "_search",
                            nd: "nd",
                            id: "id",
                            oper: "oper",
                            editoper: "edit",
                            addoper: "add",
                            deloper: "del",
                            subgridid: "id",
                            npage: null,
                            totalrows: "totalrows"
                        },
                        forceFit: !1,
                        gridstate: "visible",
                        cellEdit: !1,
                        cellsubmit: "remote",
                        nv: 0,
                        loadui: "enable",
                        toolbar: [!1, ""],
                        scroll: !1,
                        multiboxonly: !1,
                        deselectAfterSort: !0,
                        scrollrows: !1,
                        autowidth: !1,
                        scrollOffset: 9,
                        cellLayout: 5,
                        subGridWidth: 40,
                        multiselectWidth: 40,
                        gridview: !1,
                        rownumWidth: 25,
                        rownumbers: !1,
                        pagerpos: "center",
                        recordpos: "right",
                        footerrow: !1,
                        userDataOnFooter: !1,
                        hoverrows: !0,
                        altclass: "ui-priority-secondary",
                        viewsortcols: [!1, "vertical", !0],
                        resizeclass: "",
                        autoencode: !1,
                        remapColumns: [],
                        ajaxGridOptions: {},
                        direction: "ltr",
                        toppager: !1,
                        headertitles: !1,
                        scrollTimeout: 1E3,
                        data: [],
                        _index: {},
                        grouping: !1,
                        groupingView: {
                            groupField: [],
                            groupOrder: [],
                            groupText: [],
                            groupColumnShow: [],
                            groupSummary: [],
                            showSummaryOnHide: !1,
                            sortitems: [],
                            sortnames: [],
                            summary: [],
                            summaryval: [],
                            plusicon: "ui-icon-circlesmall-plus",
                            minusicon: "ui-icon-circlesmall-minus"
                        },
                        ignoreCase: !1,
                        cmTemplate: {},
                        idPrefix: "",
                        iScroll: {
                            bounce: !1
                        },
                        scrollPaging: !1,
                        dataTheme: "",
                        refreshContent: !1
                    }, b.jgrid.defaults, b.jgrid.mobile || {}, f || {}),
                    a = this,
                    d, g = {
                        headers: [],
                        cols: [],
                        footers: [],
                        selectionPreserver: function(a) {
                            var c = a.p,
                                e = c.selrow,
                                d = c.selarrrow ?
                                b.makeArray(c.selarrrow) : null,
                                f = a.grid.bDiv.scrollLeft,
                                g = function() {
                                    var h;
                                    c.selrow = null;
                                    c.selarrrow = [];
                                    if (c.multiselect && d && 0 < d.length)
                                        for (h = 0; h < d.length; h++) d[h] != e && b(a).jqGrid("setSelection", d[h], !1, null);
                                    e && b(a).jqGrid("setSelection", e, !1, null);
                                    a.grid.bDiv.scrollLeft = f;
                                    b(a).unbind(".selectionPreserver", g)
                                };
                            b(a).bind("jqGridGridComplete.selectionPreserver", g)
                        }
                    };
                if ("TABLE" != this.tagName.toUpperCase()) alert("Element is not a table");
                else if (void 0 !== document.documentMode && 5 >= document.documentMode) alert("Grid can not be used in this ('quirks') mode!");
                else {
                    b(this).empty().attr("tabindex", "0");
                    this.p = c;
                    this.p.useProp = !!b.fn.prop;
                    this.p.scroll = !1;
                    var h, j;
                    if (0 === this.p.colNames.length)
                        for (h = 0; h < this.p.colModel.length; h++) this.p.colNames[h] = this.p.colModel[h].label || this.p.colModel[h].name;
                    if (this.p.colNames.length !== this.p.colModel.length) alert(b.jgrid.errors.model);
                    else {
                        c = b(this).closest("div:jqmData(role='page')");
                        a.p.dataTheme || (a.p.dataTheme = "b", c.length && c.attr("data-theme") && (a.p.dataTheme = c.attr("data-theme")));
                        var k = b("<div class='ui-jqgrid-view'></div>"),
                            l = b.jgrid.msie;
                        a.p.direction = b.trim(a.p.direction.toLowerCase()); - 1 == b.inArray(a.p.direction, ["ltr", "rtl"]) && (a.p.direction = "ltr");
                        j = a.p.direction;
                        b(k).insertBefore(this);
                        b(this).appendTo(k);
                        var n = b("<div class='ui-jqgrid ui-corner-all'></div>");
                        b(n).insertBefore(k).attr({
                            id: "gbox_" + this.id,
                            dir: j,
                            "data-theme": a.p.dataTheme
                        });
                        b(k).appendTo(n).attr("id", "gview_" + this.id);
                        b(this).attr({
                            cellspacing: "0",
                            cellpadding: "0",
                            border: "0",
                            role: "grid",
                            "aria-multiselectable": !!this.p.multiselect,
                            "aria-labelledby": "gbox_" +
                                this.id
                        });
                        var p = function(a, b) {
                                a = parseInt(a, 10);
                                return isNaN(a) ? b || 0 : a
                            },
                            m = function(c, d, e, f, h, i) {
                                var j = a.p.colModel[c],
                                    k = j.align,
                                    E = 'style="',
                                    K = j.classes,
                                    u = j.name,
                                    o = [];
                                k && (E = E + ("text-align:" + k + ";"));
                                j.hidden === true && (E = E + "display:none;");
                                if (d === 0) E = E + ("width: " + g.headers[c].width + "px;");
                                else if (j.cellattr && b.isFunction(j.cellattr))
                                    if ((c = j.cellattr.call(a, h, e, f, j, i)) && typeof c === "string") {
                                        c = c.replace(/style/i, "style").replace(/title/i, "title");
                                        if (c.indexOf("title") > -1) j.title = false;
                                        c.indexOf("class") >
                                            -1 && (K = void 0);
                                        o = c.split("style");
                                        if (o.length === 2) {
                                            o[1] = b.trim(o[1].replace("=", ""));
                                            if (o[1].indexOf("'") === 0 || o[1].indexOf('"') === 0) o[1] = o[1].substring(1);
                                            E = E + o[1].replace(/'/gi, '"')
                                        } else E = E + '"'
                                    }
                                if (!o.length) {
                                    o[0] = "";
                                    E = E + '"'
                                }
                                E = E + ((K !== void 0 ? ' class="' + K + '"' : "") + (j.title && e ? ' title="' + b.jgrid.stripHtml(e) + '"' : ""));
                                E = E + (' aria-describedby="' + a.p.id + "_" + u + '"');
                                return E + o[0]
                            },
                            v = function(c) {
                                return c == null || c === "" ? "&#160;" : a.p.autoencode ? b.jgrid.htmlEncode(c) : "" + c
                            },
                            s = function(c, e, d, f, g) {
                                var h = a.p.colModel[d];
                                if (h.formatter !== void 0) {
                                    c = "" + a.p.idPrefix !== "" ? b.jgrid.stripPref(a.p.idPrefix, c) : c;
                                    c = {
                                        rowId: c,
                                        colModel: h,
                                        gid: a.p.id,
                                        pos: d
                                    };
                                    e = b.isFunction(h.formatter) ? h.formatter.call(a, e, c, f, g) : b.fmatter ? b.fn.fmatter.call(a, h.formatter, e, c, f, g) : v(e)
                                } else e = v(e);
                                return e
                            },
                            O = function(a, b, c, e, d, f) {
                                b = s(a, b, c, d, "add");
                                return '<td role="gridcell" ' + m(c, e, b, d, a, f) + ">" + b + "</td>"
                            },
                            J = function(b, c, e) {
                                var d = '<input data-role="none" data-role="none" data-theme="' + a.p.dataTheme + '" role="checkbox" type="checkbox" id="jqg_' + a.p.id +
                                    "_" + b + '" class="cbox" name="jqg_' + a.p.id + "_" + b + '"/>';
                                return '<td role="gridcell" ' + m(c, e, "", null, b, true) + ">" + d + "</td>"
                            },
                            X = function(a, b, c, e) {
                                c = (parseInt(c, 10) - 1) * parseInt(e, 10) + 1 + b;
                                return '<td role="gridcell" class="jqgrid-rownum" ' + m(a, b, c, null, b, true) + ">" + c + "</td>"
                            },
                            V = function(b) {
                                var c, e = [],
                                    d = 0,
                                    f;
                                for (f = 0; f < a.p.colModel.length; f++) {
                                    c = a.p.colModel[f];
                                    if (c.name !== "cb" && c.name !== "subgrid" && c.name !== "rn") {
                                        e[d] = b == "local" ? c.name : b == "xml" || b === "xmlstring" ? c.xmlmap || c.name : c.jsonmap || c.name;
                                        d++
                                    }
                                }
                                return e
                            },
                            W = function(c) {
                                var e = a.p.remapColumns;
                                if (!e || !e.length) e = b.map(a.p.colModel, function(a, b) {
                                    return b
                                });
                                c && (e = b.map(e, function(a) {
                                    return a < c ? null : a - c
                                }));
                                return e
                            },
                            P = function(a, c) {
                                var e;
                                if (this.p.deepempty) b(this.rows).slice(1).remove();
                                else {
                                    e = this.rows.length > 0 ? this.rows[0] : null;
                                    b(this.firstChild).empty().append(e)
                                }
                                if (c === true && this.p.treeGrid) {
                                    this.p.data = [];
                                    this.p._index = {}
                                }
                            },
                            M = function() {
                                var c = a.p.data.length,
                                    e, d, f;
                                e = a.p.rownumbers === true ? 1 : 0;
                                d = a.p.multiselect === true ? 1 : 0;
                                f = a.p.subGrid === true ? 1 : 0;
                                e =
                                    a.p.keyIndex === false || a.p.loadonce === true ? a.p.localReader.id : a.p.colModel[a.p.keyIndex + d + f + e].name;
                                for (d = 0; d < c; d++) {
                                    f = b.jgrid.getAccessor(a.p.data[d], e);
                                    f === void 0 && (f = "" + (d + 1));
                                    a.p._index[f] = d
                                }
                            },
                            N = function(c, e, d, f, g, h) {
                                var i = "-1",
                                    j = "",
                                    k, e = e ? "display:none;" : "",
                                    d = "jqgrow ui-row-" + a.p.direction + d + (h ? " ui-btn-active" : ""),
                                    f = b.isFunction(a.p.rowattr) ? a.p.rowattr.call(a, f, g) : {};
                                if (!b.isEmptyObject(f)) {
                                    if (f.hasOwnProperty("id")) {
                                        c = f.id;
                                        delete f.id
                                    }
                                    if (f.hasOwnProperty("tabindex")) {
                                        i = f.tabindex;
                                        delete f.tabindex
                                    }
                                    if (f.hasOwnProperty("style")) {
                                        e =
                                            e + f.style;
                                        delete f.style
                                    }
                                    if (f.hasOwnProperty("class")) {
                                        d = d + (" " + f["class"]);
                                        delete f["class"]
                                    }
                                    try {
                                        delete f.role
                                    } catch (K) {}
                                    for (k in f) f.hasOwnProperty(k) && (j = j + (" " + k + "=" + f[k]))
                                }
                                return '<tr role="row" id="' + c + '" tabindex="' + i + '" class="' + d + '"' + (e === "" ? "" : ' style="' + e + '"') + j + ">"
                            },
                            Y = function(c, e, d, f, g) {
                                var h = new Date,
                                    i = a.p.datatype != "local" && a.p.loadonce || a.p.datatype == "xmlstring",
                                    j = a.p.xmlReader,
                                    k = a.p.datatype == "local" ? "local" : "xml";
                                if (i) {
                                    a.p.data = [];
                                    a.p._index = {};
                                    a.p.localReader.id = "_id_"
                                }
                                a.p.reccount =
                                    0;
                                if (b.isXMLDoc(c)) {
                                    if (a.p.treeANode === -1 && !a.p.scroll) {
                                        P.call(a, false, true);
                                        d = 1
                                    } else d = d > 1 ? d : 1;
                                    var K = b(a),
                                        u, o, l = 0,
                                        q, B = a.p.multiselect === true ? 1 : 0,
                                        n = 0,
                                        p, m = a.p.rownumbers === true ? 1 : 0,
                                        s, z = [],
                                        t, r = {},
                                        x, D, C = [],
                                        v = a.p.altRows === true ? " " + a.p.altclass : "",
                                        w;
                                    if (a.p.subGrid === true) {
                                        n = 1;
                                        p = b.jgrid.getMethod("addSubGridCell")
                                    }
                                    j.repeatitems || (z = V(k));
                                    s = a.p.keyIndex === false ? b.isFunction(j.id) ? j.id.call(a, c) : j.id : a.p.keyIndex;
                                    if (z.length > 0 && !isNaN(s)) {
                                        a.p.remapColumns && a.p.remapColumns.length && (s = b.inArray(s, a.p.remapColumns));
                                        s = z[s]
                                    }
                                    k = ("" + s).indexOf("[") === -1 ? z.length ? function(a, c) {
                                        return b(s, a).text() || c
                                    } : function(a, c) {
                                        return b(j.cell, a).eq(s).text() || c
                                    } : function(a, b) {
                                        return a.getAttribute(s.replace(/[\[\]]/g, "")) || b
                                    };
                                    a.p.userData = {};
                                    a.p.page = b.jgrid.getXmlData(c, j.page) || a.p.page || 0;
                                    a.p.lastpage = b.jgrid.getXmlData(c, j.total);
                                    if (a.p.lastpage === void 0) a.p.lastpage = 1;
                                    a.p.records = b.jgrid.getXmlData(c, j.records) || 0;
                                    b.isFunction(j.userdata) ? a.p.userData = j.userdata.call(a, c) || {} : b.jgrid.getXmlData(c, j.userdata, true).each(function() {
                                        a.p.userData[this.getAttribute("name")] =
                                            b(this).text()
                                    });
                                    c = b.jgrid.getXmlData(c, j.root, true);
                                    (c = b.jgrid.getXmlData(c, j.row, true)) || (c = []);
                                    var T = c.length,
                                        H = 0,
                                        y = [],
                                        A = parseInt(a.p.rowNum, 10),
                                        G = a.p.scroll ? b.jgrid.randId() : 1;
                                    if (T > 0 && a.p.page <= 0) a.p.page = 1;
                                    if (c && T) {
                                        g && (A = A * (g + 1));
                                        var g = b.isFunction(a.p.afterInsertRow),
                                            F = false,
                                            I;
                                        if (a.p.grouping) {
                                            F = a.p.groupingView.groupCollapse === true;
                                            I = b.jgrid.getMethod("groupingPrepare")
                                        }
                                        for (; H < T;) {
                                            x = c[H];
                                            D = k(x, G + H);
                                            D = a.p.idPrefix + D;
                                            u = d === 0 ? 0 : d + 1;
                                            w = (u + H) % 2 == 1 ? v : "";
                                            var L = C.length;
                                            C.push("");
                                            m && C.push(X(0, H, a.p.page,
                                                a.p.rowNum));
                                            B && C.push(J(D, m, H));
                                            n && C.push(p.call(K, B + m, H + d));
                                            if (j.repeatitems) {
                                                t || (t = W(B + n + m));
                                                var M = b.jgrid.getXmlData(x, j.cell, true);
                                                b.each(t, function(b) {
                                                    var c = M[this];
                                                    if (!c) return false;
                                                    q = c.textContent || c.text;
                                                    r[a.p.colModel[b + B + n + m].name] = q;
                                                    C.push(O(D, q, b + B + n + m, H + d, x, r))
                                                })
                                            } else
                                                for (u = 0; u < z.length; u++) {
                                                    q = b.jgrid.getXmlData(x, z[u]);
                                                    r[a.p.colModel[u + B + n + m].name] = q;
                                                    C.push(O(D, q, u + B + n + m, H + d, x, r))
                                                }
                                            C[L] = N(D, F, w, r, x, false);
                                            C.push("</tr>");
                                            if (a.p.grouping) {
                                                y = I.call(K, C, y, r, H);
                                                C = []
                                            }
                                            if (i || a.p.treeGrid ===
                                                true) {
                                                r._id_ = D;
                                                a.p.data.push(r);
                                                a.p._index[D] = a.p.data.length - 1
                                            }
                                            if (a.p.gridview === false) {
                                                b("tbody:first", e).append(C.join(""));
                                                K.triggerHandler("jqGridAfterInsertRow", [D, r, x]);
                                                g && a.p.afterInsertRow.call(a, D, r, x);
                                                C = []
                                            }
                                            r = {};
                                            l++;
                                            H++;
                                            if (l == A) break
                                        }
                                    }
                                    if (a.p.gridview === true) {
                                        o = a.p.treeANode > -1 ? a.p.treeANode : 0;
                                        if (a.p.grouping) {
                                            K.jqGrid("groupingRender", y, a.p.colModel.length);
                                            y = null
                                        } else a.p.treeGrid === true && o > 0 ? b(a.rows[o]).after(C.join("")) : b("tbody:first", e).append(C.join(""))
                                    }
                                    if (a.p.subGrid === true) try {
                                        K.jqGrid("addSubGrid",
                                            B + m)
                                    } catch (R) {}
                                    a.p.totaltime = new Date - h;
                                    if (l > 0 && a.p.records === 0) a.p.records = T;
                                    C = null;
                                    if (a.p.treeGrid === true) try {
                                        K.jqGrid("setTreeNode", o + 1, l + o + 1)
                                    } catch (U) {}
                                    if (!a.p.treeGrid && !a.p.scroll) a.grid.bDiv.scrollTop = 0;
                                    a.p.reccount = l;
                                    a.p.treeANode = -1;
                                    a.p.userDataOnFooter && K.jqGrid("footerData", "set", a.p.userData, true);
                                    if (i) {
                                        a.p.records = T;
                                        a.p.lastpage = Math.ceil(T / A)
                                    }
                                    f || a.updatepager(false, true);
                                    if (i)
                                        for (; l < T;) {
                                            x = c[l];
                                            D = k(x, l + G);
                                            D = a.p.idPrefix + D;
                                            if (j.repeatitems) {
                                                t || (t = W(B + n + m));
                                                var Q = b.jgrid.getXmlData(x, j.cell,
                                                    true);
                                                b.each(t, function(b) {
                                                    var c = Q[this];
                                                    if (!c) return false;
                                                    q = c.textContent || c.text;
                                                    r[a.p.colModel[b + B + n + m].name] = q
                                                })
                                            } else
                                                for (u = 0; u < z.length; u++) {
                                                    q = b.jgrid.getXmlData(x, z[u]);
                                                    r[a.p.colModel[u + B + n + m].name] = q
                                                }
                                            r._id_ = D;
                                            a.p.data.push(r);
                                            a.p._index[D] = a.p.data.length - 1;
                                            r = {};
                                            l++
                                        }
                                }
                            },
                            Z = function(c, e, d, f, g) {
                                e = new Date;
                                if (c) {
                                    if (a.p.treeANode === -1 && !a.p.scroll) {
                                        P.call(a, false, true);
                                        d = 1
                                    } else d = d > 1 ? d : 1;
                                    var h, i, j = a.p.datatype != "local" && a.p.loadonce || a.p.datatype == "jsonstring";
                                    if (j) {
                                        a.p.data = [];
                                        a.p._index = {};
                                        a.p.localReader.id =
                                            "_id_"
                                    }
                                    a.p.reccount = 0;
                                    if (a.p.datatype == "local") {
                                        h = a.p.localReader;
                                        i = "local"
                                    } else {
                                        h = a.p.jsonReader;
                                        i = "json"
                                    }
                                    var k = b(a),
                                        l = 0,
                                        u, o, n = [],
                                        q, B = a.p.multiselect ? 1 : 0,
                                        m = 0,
                                        s = a.p.rownumbers === true ? 1 : 0,
                                        p, t, z = {},
                                        v, r, x = [],
                                        D = a.p.altRows === true ? " " + a.p.altclass : "",
                                        C;
                                    a.p.page = b.jgrid.getAccessor(c, h.page) || a.p.page || 0;
                                    p = b.jgrid.getAccessor(c, h.total);
                                    if (a.p.subGrid === true) {
                                        m = 1;
                                        b.jgrid.getMethod("addSubGridCell")
                                    }
                                    a.p.lastpage = p === void 0 ? 1 : p;
                                    a.p.records = b.jgrid.getAccessor(c, h.records) || 0;
                                    a.p.userData = b.jgrid.getAccessor(c,
                                        h.userdata) || {};
                                    h.repeatitems || (q = n = V(i));
                                    i = a.p.keyIndex === false ? b.isFunction(h.id) ? h.id.call(a, c) : h.id : a.p.keyIndex;
                                    if (n.length > 0 && !isNaN(i)) {
                                        a.p.remapColumns && a.p.remapColumns.length && (i = b.inArray(i, a.p.remapColumns));
                                        i = n[i]
                                    }(t = b.jgrid.getAccessor(c, h.root)) || (t = []);
                                    p = t.length;
                                    c = 0;
                                    if (p > 0 && a.p.page <= 0) a.p.page = 1;
                                    var y = parseInt(a.p.rowNum, 10),
                                        w = a.p.scroll ? b.jgrid.randId() : 1,
                                        A = false,
                                        H;
                                    g && (y = y * (g + 1));
                                    a.p.datatype === "local" && !a.p.deselectAfterSort && (A = true);
                                    var G = b.isFunction(a.p.afterInsertRow),
                                        F = [],
                                        I = false,
                                        L;
                                    if (a.p.grouping) {
                                        I = a.p.groupingView.groupCollapse === true;
                                        L = b.jgrid.getMethod("groupingPrepare")
                                    }
                                    for (; c < p;) {
                                        g = t[c];
                                        r = b.jgrid.getAccessor(g, i);
                                        if (r === void 0) {
                                            r = w + c;
                                            if (n.length === 0 && h.cell) {
                                                u = b.jgrid.getAccessor(g, h.cell);
                                                r = u !== void 0 ? u[i] || r : r
                                            }
                                        }
                                        r = a.p.idPrefix + r;
                                        u = d === 1 ? 0 : d;
                                        C = (u + c) % 2 == 1 ? D : "";
                                        A && (H = a.p.multiselect ? b.inArray(r, a.p.selarrrow) !== -1 : r === a.p.selrow);
                                        var M = x.length;
                                        x.push("");
                                        s && x.push(X(0, c, a.p.page, a.p.rowNum));
                                        B && x.push(J(r, s, c, H));
                                        m && x.push(b(a).jqGrid("addSubGridCell", B + s, c +
                                            d));
                                        if (h.repeatitems) {
                                            h.cell && (g = b.jgrid.getAccessor(g, h.cell));
                                            q || (q = W(B + m + s))
                                        }
                                        for (o = 0; o < q.length; o++) {
                                            u = b.jgrid.getAccessor(g, q[o]);
                                            z[a.p.colModel[o + B + m + s].name] = u;
                                            x.push(O(r, u, o + B + m + s, c + d, g, z))
                                        }
                                        x[M] = N(r, I, C, z, g, H);
                                        x.push("</tr>");
                                        if (a.p.grouping) {
                                            F = L.call(k, x, F, z, c);
                                            x = []
                                        }
                                        if (j || a.p.treeGrid === true) {
                                            z._id_ = r;
                                            a.p.data.push(z);
                                            a.p._index[r] = a.p.data.length - 1
                                        }
                                        if (a.p.gridview === false) {
                                            b("#" + b.jgrid.jqID(a.p.id) + " tbody:first").append(x.join(""));
                                            k.triggerHandler("jqGridAfterInsertRow", [r, z, g]);
                                            G && a.p.afterInsertRow.call(a,
                                                r, z, g);
                                            x = []
                                        }
                                        z = {};
                                        l++;
                                        c++;
                                        if (l == y) break
                                    }
                                    if (a.p.gridview === true) {
                                        v = a.p.treeANode > -1 ? a.p.treeANode : 0;
                                        a.p.grouping ? k.jqGrid("groupingRender", F, a.p.colModel.length) : a.p.treeGrid === true && v > 0 ? b(a.rows[v]).after(x.join("")) : b("#" + b.jgrid.jqID(a.p.id) + " tbody:first").append(x.join(""))
                                    }
                                    if (a.p.subGrid === true) try {
                                        k.jqGrid("addSubGrid", B + s)
                                    } catch (Q) {}
                                    a.p.totaltime = new Date - e;
                                    if (l > 0 && a.p.records === 0) a.p.records = p;
                                    if (a.p.treeGrid === true) try {
                                        k.jqGrid("setTreeNode", v + 1, l + v + 1)
                                    } catch (R) {}
                                    if (!a.p.treeGrid && !a.p.scroll) a.grid.bDiv.scrollTop =
                                        0;
                                    a.p.reccount = l;
                                    a.p.treeANode = -1;
                                    a.p.userDataOnFooter && k.jqGrid("footerData", "set", a.p.userData, true);
                                    if (j) {
                                        a.p.records = p;
                                        a.p.lastpage = Math.ceil(p / y)
                                    }
                                    f || a.updatepager(false, true);
                                    if (j)
                                        for (; l < p && t[l];) {
                                            g = t[l];
                                            r = b.jgrid.getAccessor(g, i);
                                            if (r === void 0) {
                                                r = w + l;
                                                n.length === 0 && h.cell && (r = b.jgrid.getAccessor(g, h.cell)[i] || r)
                                            }
                                            if (g) {
                                                r = a.p.idPrefix + r;
                                                if (h.repeatitems) {
                                                    h.cell && (g = b.jgrid.getAccessor(g, h.cell));
                                                    q || (q = W(B + m + s))
                                                }
                                                for (o = 0; o < q.length; o++) {
                                                    u = b.jgrid.getAccessor(g, q[o]);
                                                    z[a.p.colModel[o + B + m + s].name] =
                                                        u
                                                }
                                                z._id_ = r;
                                                a.p.data.push(z);
                                                a.p._index[r] = a.p.data.length - 1;
                                                z = {}
                                            }
                                            l++
                                        }
                                }
                            },
                            ka = function() {
                                function c(e) {
                                    var d = 0,
                                        g, h, i, j, S;
                                    if (e.groups != null) {
                                        (h = e.groups.length && e.groupOp.toString().toUpperCase() === "OR") && q.orBegin();
                                        for (g = 0; g < e.groups.length; g++) {
                                            d > 0 && h && q.or();
                                            try {
                                                c(e.groups[g])
                                            } catch (la) {
                                                alert(la)
                                            }
                                            d++
                                        }
                                        h && q.orEnd()
                                    }
                                    if (e.rules != null) {
                                        if (d > 0) {
                                            h = q.select();
                                            q = b.jgrid.from(h);
                                            a.p.ignoreCase && (q = q.ignoreCase())
                                        }
                                        try {
                                            (i = e.rules.length && e.groupOp.toString().toUpperCase() === "OR") && q.orBegin();
                                            for (g = 0; g < e.rules.length; g++) {
                                                S =
                                                    e.rules[g];
                                                j = e.groupOp.toString().toUpperCase();
                                                if (n[S.op] && S.field) {
                                                    d > 0 && (j && j === "OR") && (q = q.or());
                                                    q = n[S.op](q, j)(S.field, S.data, f[S.field])
                                                }
                                                d++
                                            }
                                            i && q.orEnd()
                                        } catch (k) {
                                            alert(k)
                                        }
                                    }
                                }
                                var e, d = false,
                                    f = {},
                                    g = [],
                                    h = [],
                                    i, j, k;
                                if (b.isArray(a.p.data)) {
                                    var l = a.p.grouping ? a.p.groupingView : false,
                                        u, o;
                                    b.each(a.p.colModel, function() {
                                        j = this.sorttype || "text";
                                        if (j == "date" || j == "datetime") {
                                            if (this.formatter && typeof this.formatter === "string" && this.formatter == "date") {
                                                i = this.formatoptions && this.formatoptions.srcformat ? this.formatoptions.srcformat :
                                                    b.jgrid.formatter.date.srcformat;
                                                k = this.formatoptions && this.formatoptions.newformat ? this.formatoptions.newformat : b.jgrid.formatter.date.newformat
                                            } else i = k = this.datefmt || "Y-m-d";
                                            f[this.name] = {
                                                stype: j,
                                                srcfmt: i,
                                                newfmt: k
                                            }
                                        } else f[this.name] = {
                                            stype: j,
                                            srcfmt: "",
                                            newfmt: ""
                                        };
                                        if (a.p.grouping) {
                                            o = 0;
                                            for (u = l.groupField.length; o < u; o++)
                                                if (this.name == l.groupField[o]) {
                                                    var c = this.name;
                                                    if (this.index) c = this.index;
                                                    g[o] = f[c];
                                                    h[o] = c
                                                }
                                        }
                                        if (!d && (this.index == a.p.sortname || this.name == a.p.sortname)) {
                                            e = this.name;
                                            d = true
                                        }
                                    });
                                    if (a.p.treeGrid) b(a).jqGrid("SortTree",
                                        e, a.p.sortorder, f[e].stype, f[e].srcfmt);
                                    else {
                                        var n = {
                                                eq: function(a) {
                                                    return a.equals
                                                },
                                                ne: function(a) {
                                                    return a.notEquals
                                                },
                                                lt: function(a) {
                                                    return a.less
                                                },
                                                le: function(a) {
                                                    return a.lessOrEquals
                                                },
                                                gt: function(a) {
                                                    return a.greater
                                                },
                                                ge: function(a) {
                                                    return a.greaterOrEquals
                                                },
                                                cn: function(a) {
                                                    return a.contains
                                                },
                                                nc: function(a, b) {
                                                    return b === "OR" ? a.orNot().contains : a.andNot().contains
                                                },
                                                bw: function(a) {
                                                    return a.startsWith
                                                },
                                                bn: function(a, b) {
                                                    return b === "OR" ? a.orNot().startsWith : a.andNot().startsWith
                                                },
                                                en: function(a, b) {
                                                    return b ===
                                                        "OR" ? a.orNot().endsWith : a.andNot().endsWith
                                                },
                                                ew: function(a) {
                                                    return a.endsWith
                                                },
                                                ni: function(a, b) {
                                                    return b === "OR" ? a.orNot().equals : a.andNot().equals
                                                },
                                                "in": function(a) {
                                                    return a.equals
                                                },
                                                nu: function(a) {
                                                    return a.isNull
                                                },
                                                nn: function(a, b) {
                                                    return b === "OR" ? a.orNot().isNull : a.andNot().isNull
                                                }
                                            },
                                            q = b.jgrid.from(a.p.data);
                                        a.p.ignoreCase && (q = q.ignoreCase());
                                        if (a.p.search === true) {
                                            var m = a.p.postData.filters;
                                            if (m) {
                                                typeof m === "string" && (m = b.jgrid.parse(m));
                                                c(m)
                                            } else try {
                                                q = n[a.p.postData.searchOper](q)(a.p.postData.searchField,
                                                    a.p.postData.searchString, f[a.p.postData.searchField])
                                            } catch (p) {}
                                        }
                                        if (a.p.grouping)
                                            for (o = 0; o < u; o++) q.orderBy(h[o], l.groupOrder[o], g[o].stype, g[o].srcfmt);
                                        e && (a.p.sortorder && d) && (a.p.sortorder.toUpperCase() == "DESC" ? q.orderBy(a.p.sortname, "d", f[e].stype, f[e].srcfmt) : q.orderBy(a.p.sortname, "a", f[e].stype, f[e].srcfmt));
                                        var m = q.select(),
                                            s = parseInt(a.p.rowNum, 10),
                                            t = m.length,
                                            v = parseInt(a.p.page, 10),
                                            y = Math.ceil(t / s),
                                            w = {},
                                            m = m.slice((v - 1) * s, v * s),
                                            f = q = null;
                                        w[a.p.localReader.total] = y;
                                        w[a.p.localReader.page] = v;
                                        w[a.p.localReader.records] = t;
                                        w[a.p.localReader.root] = m;
                                        w[a.p.localReader.userdata] = a.p.userData;
                                        m = null;
                                        return w
                                    }
                                }
                            },
                            $ = function() {
                                a.grid.hDiv.loading = true;
                                if (!a.p.hiddengrid) switch (a.p.loadui) {
                                    case "disable":
                                        break;
                                    default:
                                        try {
                                            b.mobile.loading("show", a.p.dataTheme, a.p.loadtext)
                                        } catch (c) {}
                                }
                            },
                            R = function() {
                                a.grid.hDiv.loading = false;
                                d && setTimeout(function() {
                                    d.refresh()
                                }, 0);
                                switch (a.p.loadui) {
                                    case "disable":
                                        break;
                                    default:
                                        try {
                                            b.mobile.loading("hide")
                                        } catch (c) {}
                                }
                            },
                            I = function(c) {
                                if (!a.grid.hDiv.loading) {
                                    var e =
                                        a.p.scroll && c === false,
                                        d = {},
                                        f, g = a.p.prmNames;
                                    if (a.p.page <= 0) a.p.page = 1;
                                    if (g.search !== null) d[g.search] = a.p.search;
                                    g.nd !== null && (d[g.nd] = (new Date).getTime());
                                    if (g.rows !== null) d[g.rows] = a.p.rowNum;
                                    if (g.page !== null) d[g.page] = a.p.page;
                                    if (g.sort !== null) d[g.sort] = a.p.sortname;
                                    if (g.order !== null) d[g.order] = a.p.sortorder;
                                    if (a.p.rowTotal !== null && g.totalrows !== null) d[g.totalrows] = a.p.rowTotal;
                                    var h = b.isFunction(a.p.loadComplete),
                                        i = h ? a.p.loadComplete : null,
                                        j = 0,
                                        c = c || 1;
                                    if (c > 1) {
                                        d[g.page] = c;
                                        if (g.npage !== null) {
                                            d[g.npage] =
                                                c;
                                            j = c - 1;
                                            c = 1
                                        } else i = function(b) {
                                            a.p.page++;
                                            a.grid.hDiv.loading = false;
                                            h && a.p.loadComplete.call(a, b);
                                            I(c - 1)
                                        }
                                    } else g.npage !== null && delete a.p.postData[g.npage];
                                    if (a.p.grouping) {
                                        b(a).jqGrid("groupingSetup");
                                        var k = a.p.groupingView,
                                            l, u = "";
                                        for (l = 0; l < k.groupField.length; l++) {
                                            var o = k.groupField[l];
                                            b.each(a.p.colModel, function(a, b) {
                                                if (b.name == o && b.index) o = b.index
                                            });
                                            u = u + (o + " " + k.groupOrder[l] + ", ")
                                        }
                                        d[g.sort] = u + d[g.sort]
                                    }
                                    d[g.npage] = c;
                                    b.extend(true, a.p.postData, d);
                                    var m = !a.p.scroll ? 1 : a.rows.length - 1,
                                        d = b(a).triggerHandler("jqGridBeforeRequest");
                                    if (!(d === false || d === "stop"))
                                        if (b.isFunction(a.p.datatype)) a.p.datatype.call(a, a.p.postData, "load_" + a.p.id);
                                        else {
                                            if (b.isFunction(a.p.beforeRequest)) {
                                                d = a.p.beforeRequest.call(a);
                                                d === void 0 && (d = true);
                                                if (d === false) return
                                            }
                                            f = a.p.datatype.toLowerCase();
                                            switch (f) {
                                                case "json":
                                                case "jsonp":
                                                case "xml":
                                                case "script":
                                                    b.ajax(b.extend({
                                                        url: a.p.url,
                                                        type: a.p.mtype,
                                                        dataType: f,
                                                        data: b.isFunction(a.p.serializeGridData) ? a.p.serializeGridData.call(a, a.p.postData) : a.p.postData,
                                                        success: function(d, g, h) {
                                                            if (!(b.isFunction(a.p.beforeProcessing) &&
                                                                    a.p.beforeProcessing.call(a, d, g, h) === false)) {
                                                                f === "xml" ? Y(d, a.grid.bDiv, m, c > 1, j) : Z(d, a.grid.bDiv, m, c > 1, j);
                                                                b(a).triggerHandler("jqGridLoadComplete", [d]);
                                                                i && i.call(a, d);
                                                                b(a).triggerHandler("jqGridAfterLoadComplete", [d]);
                                                                e && a.grid.populateVisible();
                                                                if (a.p.loadonce || a.p.treeGrid) a.p.datatype = "local"
                                                            }
                                                            R()
                                                        },
                                                        error: function(c, d, e) {
                                                            b.isFunction(a.p.loadError) && a.p.loadError.call(a, c, d, e);
                                                            R()
                                                        },
                                                        beforeSend: function(c, d) {
                                                            var e = true;
                                                            b.isFunction(a.p.loadBeforeSend) && (e = a.p.loadBeforeSend.call(a, c, d));
                                                            e === void 0 &&
                                                                (e = true);
                                                            if (e === false) return false;
                                                            $()
                                                        }
                                                    }, b.jgrid.ajaxOptions, a.p.ajaxGridOptions));
                                                    break;
                                                case "xmlstring":
                                                    $();
                                                    d = b.jgrid.stringToDoc(a.p.datastr);
                                                    Y(d, a.grid.bDiv);
                                                    b(a).triggerHandler("jqGridLoadComplete", [d]);
                                                    h && a.p.loadComplete.call(a, d);
                                                    b(a).triggerHandler("jqGridAfterLoadComplete", [d]);
                                                    a.p.datatype = "local";
                                                    a.p.datastr = null;
                                                    R();
                                                    break;
                                                case "jsonstring":
                                                    $();
                                                    d = typeof a.p.datastr === "string" ? b.jgrid.parse(a.p.datastr) : a.p.datastr;
                                                    Z(d, a.grid.bDiv);
                                                    b(a).triggerHandler("jqGridLoadComplete", [d]);
                                                    h && a.p.loadComplete.call(a,
                                                        d);
                                                    b(a).triggerHandler("jqGridAfterLoadComplete", [d]);
                                                    a.p.datatype = "local";
                                                    a.p.datastr = null;
                                                    R();
                                                    break;
                                                case "local":
                                                case "clientside":
                                                    $();
                                                    a.p.datatype = "local";
                                                    d = ka();
                                                    Z(d, a.grid.bDiv, m, c > 1, j);
                                                    b(a).triggerHandler("jqGridLoadComplete", [d]);
                                                    i && i.call(a, d);
                                                    b(a).triggerHandler("jqGridAfterLoadComplete", [d]);
                                                    e && a.grid.populateVisible();
                                                    R()
                                            }
                                        }
                                }
                            },
                            aa = function(c) {
                                b("#cb_" + b.jgrid.jqID(a.p.id), a.grid.hDiv)[a.p.useProp ? "prop" : "attr"]("checked", c);
                                if (a.p.frozenColumns && a.p.id + "_frozen") b("#cb_" + b.jgrid.jqID(a.p.id),
                                    a.grid.fhDiv)[a.p.useProp ? "prop" : "attr"]("checked", c)
                            },
                            ha = function(c, d) {
                                var e = "",
                                    f = "<table cellspacing='0' cellpadding='0' border='0' style='table-layout:auto;width:100%;' class='ui-pg-table'><tbody><tr>",
                                    g, h, i, k, l = function(c) {
                                        var d;
                                        b.isFunction(a.p.onPaging) && (d = a.p.onPaging.call(a, c));
                                        a.p.selrow = null;
                                        if (a.p.multiselect) {
                                            a.p.selarrrow = [];
                                            aa(false)
                                        }
                                        a.p.savedRow = [];
                                        return d == "stop" ? false : true
                                    },
                                    c = c.substr(1),
                                    d = d + ("_" + c);
                                g = "pg_" + c;
                                h = c + "_left";
                                i = c + "_center";
                                k = c + "_right";
                                b("#" + b.jgrid.jqID(c)).append("<div id='" +
                                    g + "' class='ui-pager-control' role='group' data-role='footer' data-theme='" + a.p.dataTheme + "'><table cellspacing='0' cellpadding='0' border='0' class='ui-pg-table' style='width:100%;table-layout:fixed;height:100%;' role='row'><tbody><tr><td id='" + h + "' align='left'></td><td id='" + i + "' align='center' style='white-space:pre;'></td><td id='" + k + "' align='right'></td></tr></tbody></table></div>").attr("dir", "ltr");
                                h = "";
                                if (a.p.rowList.length > 0) {
                                    h = "<tr>" + ('<td><label for="select-choice-1" class="select" data-inline="true"></label>' +
                                        a.p.recordPage + "</td>");
                                    h = h + "<td><select data-mini='true' name='select-choice-1' id='select-choice-1' class='ui-pg-selbox'>";
                                    for (i = 0; i < a.p.rowList.length; i++) h = h + ('<option role="option" value="' + a.p.rowList[i] + '"' + (a.p.rowNum == a.p.rowList[i] ? ' selected="selected"' : "") + ">" + a.p.rowList[i] + "</option>");
                                    h = h + "</select></td></tr>"
                                }
                                j == "rtl" && (f = f + "");
                                a.p.pginput === true && (e = "<td dir='" + j + '\'style="text-align:center"><a class="pagersettings" href="#" data-rel="popup" data-role="button" data-inline="true" data-transition="pop" data-iconpos="notext" data-icon="gear" style="top:-6px;"></a></td>');
                                if (a.p.pgbuttons === true) {
                                    i = ["first" + d, "prev" + d, "next" + d, "last" + d];
                                    j == "rtl" && i.reverse();
                                    f = f + ("<td id='" + i[1] + "' style='text-align:center'><a href='#' data-iconpos='notext' data-icon='arrow-l' data-mini='true' data-role='button' style='top:-6px;' data-inline='true'></a></td>");
                                    f = f + (e !== "" ? "<td class='' style='width:4px;'></span></td>" + e + "<td class='' style='width:4px;'></span></td>" : "") + ("<td id='" + i[2] + "' style='text-align:center'><a href='#' data-iconpos='notext' data-icon='arrow-r' data-mini='true' data-role='button' style='top:-6px;' data-inline='true'></a></td>")
                                } else e !==
                                    "" && (f = f + e);
                                j == "ltr" && (f = f + "");
                                f = f + "</tr></tbody></table>";
                                a.p.viewrecords === true && b("td#" + c + "_" + a.p.recordpos, "#" + g).append("<div dir='" + j + "' style='text-align:" + a.p.recordpos + "' class='ui-paging-info'></div>");
                                b("td#" + c + "_" + a.p.pagerpos, "#" + g).append(f);
                                f = null;
                                a.p.pgbuttons === true && b("#first" + b.jgrid.jqID(d) + ", #prev" + b.jgrid.jqID(d) + ", #next" + b.jgrid.jqID(d) + ", #last" + b.jgrid.jqID(d)).click(function() {
                                    var b = p(a.p.page, 1),
                                        c = p(a.p.lastpage, 1),
                                        e = false,
                                        f = true,
                                        g = true,
                                        h = true,
                                        i = true;
                                    if (c === 0 || c === 1) i =
                                        h = g = f = false;
                                    else if (c > 1 && b >= 1)
                                        if (b === 1) g = f = false;
                                        else {
                                            if (b === c) i = h = false
                                        } else if (c > 1 && b === 0) {
                                        i = h = false;
                                        b = c - 1
                                    }
                                    if (this.id === "first" + d && f) {
                                        a.p.page = 1;
                                        e = true
                                    }
                                    if (this.id === "prev" + d && g) {
                                        a.p.page = b - 1;
                                        e = true
                                    }
                                    if (this.id === "next" + d && h) {
                                        a.p.page = b + 1;
                                        e = true
                                    }
                                    if (this.id === "last" + d && i) {
                                        a.p.page = c;
                                        e = true
                                    }
                                    if (e) {
                                        if (!l(this.id)) return false;
                                        I()
                                    }
                                    return false
                                });
                                if (a.p.pginput === true) {
                                    b("#" + c).before('<div data-role="popup"  data-position-to="#gbox_' + a.p.id + '" data-overlay-theme="a" data-theme="' + a.p.dataTheme + '" style="min-width:200px;" class="ui-corner-all" id="pgpop_' +
                                        c + '"><div data-role="header" data-theme="' + a.p.dataTheme + '" class="ui-corner-top"><h1>' + a.p.pagerCaption + '</h1></div><table style="width:100%"><tr><td style="width:28%"><label for="slider-1">' + a.p.pageText + '</label></td><td "width:72%"><input id="slider-1" name="slider-1" type="range" class="ui-pg-input" type="text" size="2" maxlength="7" value="0" role="textbox" style="width:29px;height:30px" min="1" max="5"/></td></tr>' + h + '</table><div style="text-align:right"><a href="#" data-role="button" data-inline="true" data-rel="back" data-mini="true" data-theme="' +
                                        a.p.dataTheme + '">Cancel</a><a class="setpage" href="#" data-role="button" data-inline="true" data-mini="true" data-transition="flow" data-theme="' + a.p.dataTheme + '">Update</a></div></div>');
                                    b(".pagersettings", "#" + c).click(function() {
                                        b("#slider-1").val(a.p.page).attr("max", a.p.lastpage).slider("refresh");
                                        b("#select-choice-1").val(a.p.rowNum).selectmenu("refresh");
                                        b("#pgpop_" + c).popup("open")
                                    });
                                    b(".setpage", "#pgpop_" + c).click(function() {
                                        var d = parseInt(b("#slider-1").val(), 10),
                                            e = parseInt(b("#select-choice-1").val(),
                                                10);
                                        if (isNaN(e)) e = a.p.rowNum;
                                        isNaN(d) && (d = 1);
                                        a.p.page = d > 0 ? d : a.p.page;
                                        a.p.page = d > a.p.lastpage ? a.p.lastpage : a.p.page;
                                        a.p.page = Math.round(a.p.rowNum * (a.p.page - 1) / e - 0.5) + 1;
                                        a.p.rowNum = e;
                                        if (!l("user")) return false;
                                        I();
                                        b("#pgpop_" + c).popup("close");
                                        return false
                                    })
                                }
                            },
                            ia = function(c, d, e, f) {
                                if (a.p.colModel[d].sortable && !(a.p.savedRow.length > 0)) {
                                    if (!e) {
                                        if (a.p.lastsort == d)
                                            if (a.p.sortorder == "asc") a.p.sortorder = "desc";
                                            else {
                                                if (a.p.sortorder == "desc") a.p.sortorder = "asc"
                                            } else a.p.sortorder = a.p.colModel[d].firstsortorder ||
                                            "asc";
                                        a.p.page = 1
                                    }
                                    if (f) {
                                        if (a.p.lastsort == d && a.p.sortorder == f && !e) return;
                                        a.p.sortorder = f
                                    }
                                    e = a.grid.headers[a.p.lastsort].el;
                                    f = a.grid.headers[d].el;
                                    b("a.ui-grid-ico-sort", e).hide();
                                    b(e).attr("aria-selected", "false");
                                    b("a.ui-icon-" + a.p.sortorder, f).show();
                                    b(f).attr("aria-selected", "true");
                                    if (!a.p.viewsortcols[0] && a.p.lastsort != d) {
                                        b("span.s-ico", e).hide();
                                        b("span.s-ico", f).show()
                                    }
                                    c = c.substring(5 + a.p.id.length + 1);
                                    a.p.sortname = a.p.colModel[d].index || c;
                                    e = a.p.sortorder;
                                    if (b(a).triggerHandler("jqGridSortCol", [c, d, e]) === "stop") a.p.lastsort = d;
                                    else if (b.isFunction(a.p.onSortCol) && a.p.onSortCol.call(a, c, d, e) == "stop") a.p.lastsort = d;
                                    else {
                                        if (a.p.datatype == "local") a.p.deselectAfterSort && b(a).jqGrid("resetSelection");
                                        else {
                                            a.p.selrow = null;
                                            a.p.multiselect && aa(false);
                                            a.p.selarrrow = [];
                                            a.p.savedRow = []
                                        }
                                        if (a.p.scroll) {
                                            e = a.grid.bDiv.scrollLeft;
                                            P.call(a, true, false);
                                            a.grid.hDiv.scrollLeft = e
                                        }
                                        a.p.subGrid && a.p.datatype == "local" && b("td.sgexpanded", "#" + b.jgrid.jqID(a.p.id)).each(function() {
                                            b(this).trigger("click")
                                        });
                                        I();
                                        a.p.lastsort =
                                            d;
                                        if (a.p.sortname != c && d) a.p.lastsort = d
                                    }
                                }
                            };
                        this.p.id = this.id; - 1 == b.inArray(a.p.multikey, ["shiftKey", "altKey", "ctrlKey"]) && (a.p.multikey = !1);
                        a.p.keyIndex = !1;
                        for (h = 0; h < a.p.colModel.length; h++) a.p.colModel[h] = b.extend(!0, {}, a.p.cmTemplate, a.p.colModel[h].template || {}, a.p.colModel[h]), !1 === a.p.keyIndex && !0 === a.p.colModel[h].key && (a.p.keyIndex = h);
                        a.p.sortorder = a.p.sortorder.toLowerCase();
                        b.jgrid.cell_width = b.jgrid.cellWidth();
                        !0 === a.p.grouping && (a.p.scroll = !1, a.p.rownumbers = !1, a.p.treeGrid = !1, a.p.gridview = !0);
                        if (!0 === this.p.treeGrid) {
                            try {
                                b(this).jqGrid("setTreeGrid")
                            } catch (na) {}
                            "local" != a.p.datatype && (a.p.localReader = {
                                id: "_id_"
                            })
                        }
                        if (this.p.subGrid) try {
                            b(a).jqGrid("setSubGrid")
                        } catch (oa) {}
                        this.p.multiselect && (this.p.colNames.unshift("<input role='checkbox' id='cb_" + this.p.id + "' class='cbox' type='checkbox' style='left:33%; border: 1px solid;'/>"), this.p.colModel.unshift({
                            name: "cb",
                            width: b.jgrid.cell_width ? a.p.multiselectWidth + a.p.cellLayout : a.p.multiselectWidth,
                            sortable: !1,
                            resizable: !1,
                            hidedlg: !0,
                            search: !1,
                            align: "center",
                            fixed: !0
                        }));
                        this.p.rownumbers && (this.p.colNames.unshift(""), this.p.colModel.unshift({
                            name: "rn",
                            width: a.p.rownumWidth,
                            sortable: !1,
                            resizable: !1,
                            hidedlg: !0,
                            search: !1,
                            align: "center",
                            fixed: !0
                        }));
                        a.p.xmlReader = b.extend(!0, {
                            root: "rows",
                            row: "row",
                            page: "rows>page",
                            total: "rows>total",
                            records: "rows>records",
                            repeatitems: !0,
                            cell: "cell",
                            id: "[id]",
                            userdata: "userdata",
                            subgrid: {
                                root: "rows",
                                row: "row",
                                repeatitems: !0,
                                cell: "cell"
                            }
                        }, a.p.xmlReader);
                        a.p.jsonReader = b.extend(!0, {
                            root: "rows",
                            page: "page",
                            total: "total",
                            records: "records",
                            repeatitems: !0,
                            cell: "cell",
                            id: "id",
                            userdata: "userdata",
                            subgrid: {
                                root: "rows",
                                repeatitems: !0,
                                cell: "cell"
                            }
                        }, a.p.jsonReader);
                        a.p.localReader = b.extend(!0, {
                            root: "rows",
                            page: "page",
                            total: "total",
                            records: "records",
                            repeatitems: !1,
                            cell: "cell",
                            id: "id",
                            userdata: "userdata",
                            subgrid: {
                                root: "rows",
                                repeatitems: !0,
                                cell: "cell"
                            }
                        }, a.p.localReader);
                        a.p.scroll && (a.p.pgbuttons = !1, a.p.pginput = !1, a.p.rowList = []);
                        a.p.data.length && M();
                        var A = "<thead><tr class='ui-jqgrid-labels' role='rowheader'>",
                            ja, ba, ca, da,
                            w, t, fa;
                        if (!0 === a.p.shrinkToFit && !0 === a.p.forceFit)
                            for (h = a.p.colModel.length - 1; 0 <= h; h--)
                                if (!a.p.colModel[h].hidden) {
                                    a.p.colModel[h].resizable = !1;
                                    break
                                }
                        ja = l ? "class='ui-th-div-ie'" : "";
                        fa = "<span class='s-ico' style='display:none;float:left;'><a href='#' data-iconpos='notext' data-icon='arrow-u' data-mini='true' data-role='button' sort='asc' class='ui-grid-ico-sort ui-icon-asc ui-sort-" + j + "' style='display:none;'></a>" + ("<a href='#' data-iconpos='notext' data-inline='true' data-mini='true' data-role='button' data-icon='arrow-d' sort='desc' class='ui-grid-ico-sort ui-icon-desc ui-sort-" +
                            j + "' style='display:none;'></span></span>");
                        for (h = 0; h < this.p.colNames.length; h++) ba = a.p.headertitles ? ' title="' + b.jgrid.stripHtml(a.p.colNames[h]) + '"' : "", A += "<th id='" + a.p.id + "_" + a.p.colModel[h].name + "' role='columnheader' class='ui-th-column ui-th-" + j + "'" + ba + ">", ba = a.p.colModel[h].index || a.p.colModel[h].name, A += "<div id='jqgh_" + a.p.id + "_" + a.p.colModel[h].name + "' " + ja + ">" + a.p.colNames[h], a.p.colModel[h].width = a.p.colModel[h].width ? parseInt(a.p.colModel[h].width, 10) : 150, "boolean" !== typeof a.p.colModel[h].title &&
                            (a.p.colModel[h].title = !0), ba == a.p.sortname && (a.p.lastsort = h), A += fa + "</div></th>";
                        fa = null;
                        b(this).append(A + "</tr></thead>");
                        if (this.p.multiselect) {
                            var ea = [],
                                U;
                            b("#cb_" + b.jgrid.jqID(a.p.id), this).bind("click", function() {
                                a.p.selarrrow = [];
                                var c = a.p.frozenColumns === true ? a.p.id + "_frozen" : "";
                                if (this.checked) {
                                    b(a.rows).each(function(d) {
                                        if (d > 0 && !b(this).hasClass("ui-subgrid") && !b(this).hasClass("jqgroup") && !b(this).hasClass("ui-disabled")) {
                                            b("#jqg_" + b.jgrid.jqID(a.p.id) + "_" + b.jgrid.jqID(this.id))[a.p.useProp ?
                                                "prop" : "attr"]("checked", true);
                                            b(this).addClass("ui-btn-active").attr("aria-selected", "true");
                                            a.p.selarrrow.push(this.id);
                                            a.p.selrow = this.id;
                                            if (c) {
                                                b("#jqg_" + b.jgrid.jqID(a.p.id) + "_" + b.jgrid.jqID(this.id), a.grid.fbDiv)[a.p.useProp ? "prop" : "attr"]("checked", true);
                                                b("#" + b.jgrid.jqID(this.id), a.grid.fbDiv).addClass("ui-btn-active")
                                            }
                                        }
                                    });
                                    U = true;
                                    ea = []
                                } else {
                                    b(a.rows).each(function(d) {
                                        if (d > 0 && !b(this).hasClass("ui-subgrid") && !b(this).hasClass("ui-disabled")) {
                                            b("#jqg_" + b.jgrid.jqID(a.p.id) + "_" + b.jgrid.jqID(this.id))[a.p.useProp ?
                                                "prop" : "attr"]("checked", false);
                                            b(this).removeClass("ui-btn-active").attr("aria-selected", "false");
                                            ea.push(this.id);
                                            if (c) {
                                                b("#jqg_" + b.jgrid.jqID(a.p.id) + "_" + b.jgrid.jqID(this.id), a.grid.fbDiv)[a.p.useProp ? "prop" : "attr"]("checked", false);
                                                b("#" + b.jgrid.jqID(this.id), a.grid.fbDiv).removeClass("ui-btn-active")
                                            }
                                        }
                                    });
                                    a.p.selrow = null;
                                    U = false
                                }
                                b(a).triggerHandler("jqGridSelectAll", [U ? a.p.selarrrow : ea, U]);
                                b.isFunction(a.p.onSelectAll) && a.p.onSelectAll.call(a, U ? a.p.selarrrow : ea, U)
                            })
                        }!0 === a.p.autowidth && (A = b(n).parent().innerWidth() -
                            2, a.p.width = 0 < A ? A : "nw");
                        (function() {
                            var c = 0,
                                d = b.jgrid.cell_width ? 0 : p(a.p.cellLayout, 0),
                                e = 0,
                                f, h = p(a.p.scrollOffset, 0),
                                i, j = false,
                                k, l = 0,
                                m = 0,
                                n;
                            b.each(a.p.colModel, function() {
                                if (this.hidden === void 0) this.hidden = false;
                                if (a.p.grouping && a.p.autowidth) {
                                    var f = b.inArray(this.name, a.p.groupingView.groupField);
                                    if (f !== -1) this.hidden = !a.p.groupingView.groupColumnShow[f]
                                }
                                this.widthOrg = i = p(this.width, 0);
                                if (this.hidden === false) {
                                    c = c + (i + d);
                                    this.fixed ? l = l + (i + d) : e++;
                                    m++
                                }
                            });
                            if (isNaN(a.p.width)) a.p.width = c + (a.p.shrinkToFit ===
                                false && !isNaN(a.p.height) ? h : 0);
                            g.width = a.p.width;
                            a.p.tblwidth = c;
                            if (a.p.shrinkToFit === false && a.p.forceFit === true) a.p.forceFit = false;
                            if (a.p.shrinkToFit === true && e > 0) {
                                k = g.width - d * e - l;
                                if (!isNaN(a.p.height)) {
                                    k = k - h;
                                    j = true
                                }
                                c = 0;
                                b.each(a.p.colModel, function(b) {
                                    if (this.hidden === false && !this.fixed) {
                                        this.width = i = Math.round(k * this.width / (a.p.tblwidth - d * e - l));
                                        c = c + i;
                                        f = b
                                    }
                                });
                                n = 0;
                                j ? g.width - l - (c + d * e) !== h && (n = g.width - l - (c + d * e) - h) : !j && Math.abs(g.width - l - (c + d * e)) !== 1 && (n = g.width - l - (c + d * e));
                                a.p.colModel[f].width = a.p.colModel[f].width +
                                    n;
                                a.p.tblwidth = c + n + d * e + l;
                                if (a.p.tblwidth > a.p.width) {
                                    a.p.colModel[f].width = a.p.colModel[f].width - (a.p.tblwidth - parseInt(a.p.width, 10));
                                    a.p.tblwidth = a.p.width
                                }
                            }
                        })();
                        b(n).css("width", g.width + "px").append("<div class='ui-jqgrid-resize-mark' id='rs_m" + a.p.id + "'>&#160;</div>");
                        b(k).css("width", g.width + "px");
                        var A = b("thead:first", a).get(0),
                            L = "";
                        a.p.footerrow && (L += "<table role='grid' style='width:" + a.p.tblwidth + "px;' class='ui-jqgrid-ftable' cellspacing='0' cellpadding='0' border='0'><tbody><tr role='row' class='ui-widget-content footrow footrow-" +
                            j + "'>");
                        var k = b("tr:first", A),
                            Q = "<tr class='jqgfirstrow' role='row' style='height:auto'>";
                        a.p.disableClick = !1;
                        b("th", k).each(function(c) {
                            ca = a.p.colModel[c].width;
                            if (typeof a.p.colModel[c].resizable === "undefined") a.p.colModel[c].resizable = true;
                            b(this).css("width", ca + "px");
                            var d = "";
                            if (a.p.colModel[c].hidden) {
                                b(this).css("display", "none");
                                d = "display:none;"
                            }
                            Q = Q + ("<td role='gridcell' style='height:0px;width:" + ca + "px;" + d + "'></td>");
                            g.headers[c] = {
                                width: ca,
                                el: this
                            };
                            da = a.p.colModel[c].sortable;
                            if (typeof da !==
                                "boolean") da = a.p.colModel[c].sortable = true;
                            d = a.p.colModel[c].name;
                            d == "cb" || (d == "subgrid" || d == "rn") || a.p.viewsortcols[2] && b(">div", this).addClass("ui-jqgrid-sortable");
                            if (da)
                                if (a.p.viewsortcols[0]) {
                                    b("div span.s-ico", this).show();
                                    c == a.p.lastsort && b("div a.ui-icon-" + a.p.sortorder, this).show()
                                } else if (c == a.p.lastsort) {
                                b("div span.s-ico", this).show();
                                b("div a.ui-icon-" + a.p.sortorder, this).show()
                            }
                            a.p.footerrow && (L = L + ("<td role='gridcell' " + m(c, 0, "", null, "", false) + ">&#160;</td>"))
                        }).click(function(c) {
                            if (a.p.disableClick) return a.p.disableClick =
                                false;
                            var d = "th>div.ui-jqgrid-sortable",
                                e, f;
                            a.p.viewsortcols[2] || (d = "th>div>span>a.ui-grid-ico-sort");
                            c = b(c.target).closest(d);
                            if (c.length == 1) {
                                for (var g = a.grid.headers, h = b.jgrid.getCellIndex(this), d = 0; d < g.length; d++)
                                    if (this === g[d].el) {
                                        h = d;
                                        break
                                    }
                                d = h;
                                if (!a.p.viewsortcols[2]) {
                                    e = true;
                                    f = c.attr("sort")
                                }
                                ia(b("div", this)[0].id, d, e, f);
                                return false
                            }
                        });
                        if (a.p.sortable && b.fn.sortable) try {
                            b(a).jqGrid("sortableColumns", k)
                        } catch (pa) {}
                        a.p.footerrow && (L += "</tr></tbody></table>");
                        Q += "</tr>";
                        this.appendChild(document.createElement("tbody"));
                        b(this).addClass("ui-jqgrid-btable").append(Q);
                        var Q = null,
                            k = b("<table class='ui-jqgrid-htable' style='width:" + a.p.tblwidth + "px' role='grid' aria-labelledby='gbox_" + this.id + "' cellspacing='0' cellpadding='0' border='0'></table>").append(A),
                            G = a.p.caption && !0 === a.p.hiddengrid ? !0 : !1;
                        h = b("<div class='ui-jqgrid-hbox" + ("rtl" == j ? "-rtl" : "") + "'></div>");
                        A = null;
                        g.hDiv = b('<div data-role="header" data-theme="' + a.p.dataTheme + '"></div>')[0];
                        b(g.hDiv).css({
                            width: g.width + "px"
                        }).addClass("ui-jqgrid-hdiv").append(h);
                        b(h).append(k);
                        k = null;
                        G && b(g.hDiv).hide();
                        a.p.pager && ("string" === typeof a.p.pager ? "#" != a.p.pager.substr(0, 1) && (a.p.pager = "#" + a.p.pager) : a.p.pager = "#" + b(a.p.pager).attr("id"), b(a.p.pager).css({
                            width: g.width + "px"
                        }).appendTo(n).addClass("ui-jqgrid-pager ui-corner-bottom"), G && b(a.p.pager).hide(), ha(a.p.pager, ""));
                        !1 === a.p.cellEdit && !0 === a.p.hoverrows && b(a).bind("vmouseover", function(a) {
                            t = b(a.target).closest("tr.jqgrow");
                            b(t).attr("class") !== "ui-subgrid" && b(t).addClass("ui-btn-hover-b")
                        }).bind("vmouseout",
                            function(a) {
                                t = b(a.target).closest("tr.jqgrow");
                                b(t).removeClass("ui-btn-hover-b")
                            });
                        var y, F, ga;
                        b(a).before(g.hDiv).click(function(c) {
                            w = c.target;
                            t = b(w, a.rows).closest("tr.jqgrow");
                            if (b(t).length === 0 || t[0].className.indexOf("ui-disabled") > -1 || (b(w, a).closest("table.ui-jqgrid-btable").attr("id") || "").replace("_frozen", "") !== a.id) return this;
                            var d = b(w).hasClass("cbox"),
                                e = b(a).triggerHandler("jqGridBeforeSelectRow", [t[0].id, c]);
                            (e = e === false || e === "stop" ? false : true) && b.isFunction(a.p.beforeSelectRow) && (e =
                                a.p.beforeSelectRow.call(a, t[0].id, c));
                            if (!(w.tagName == "A" || (w.tagName == "INPUT" || w.tagName == "TEXTAREA" || w.tagName == "OPTION" || w.tagName == "SELECT") && !d) && e === true) {
                                y = t[0].id;
                                F = b.jgrid.getCellIndex(w);
                                ga = b(w).closest("td,th").html();
                                b(a).triggerHandler("jqGridCellSelect", [y, F, ga, c]);
                                b.isFunction(a.p.onCellSelect) && a.p.onCellSelect.call(a, y, F, ga, c);
                                if (a.p.cellEdit === true)
                                    if (a.p.multiselect && d) b(a).jqGrid("setSelection", y, true, c);
                                    else {
                                        y = t[0].rowIndex;
                                        try {
                                            b(a).jqGrid("editCell", y, F, true)
                                        } catch (f) {}
                                    } else if (a.p.multikey)
                                    if (c[a.p.multikey]) b(a).jqGrid("setSelection",
                                        y, true, c);
                                    else {
                                        if (a.p.multiselect && d) {
                                            d = b("#jqg_" + b.jgrid.jqID(a.p.id) + "_" + y).is(":checked");
                                            b("#jqg_" + b.jgrid.jqID(a.p.id) + "_" + y)[a.p.useProp ? "prop" : "attr"]("checked", d)
                                        }
                                    } else {
                                    if (a.p.multiselect && a.p.multiboxonly && !d) {
                                        var g = a.p.frozenColumns ? a.p.id + "_frozen" : "";
                                        b(a.p.selarrrow).each(function(c, d) {
                                            var e = a.rows.namedItem(d);
                                            b(e).removeClass("ui-btn-active");
                                            b("#jqg_" + b.jgrid.jqID(a.p.id) + "_" + b.jgrid.jqID(d))[a.p.useProp ? "prop" : "attr"]("checked", false);
                                            if (g) {
                                                b("#" + b.jgrid.jqID(d), "#" + b.jgrid.jqID(g)).removeClass("ui-btn-active");
                                                b("#jqg_" + b.jgrid.jqID(a.p.id) + "_" + b.jgrid.jqID(d), "#" + b.jgrid.jqID(g))[a.p.useProp ? "prop" : "attr"]("checked", false)
                                            }
                                        });
                                        a.p.selarrrow = []
                                    }
                                    b(a).jqGrid("setSelection", y, true, c)
                                }
                            }
                        }).bind("reloadGrid", function(c, d) {
                            if (a.p.treeGrid === true) a.p.datatype = a.p.treedatatype;
                            d && d.current && a.grid.selectionPreserver(a);
                            if (a.p.datatype == "local") {
                                b(a).jqGrid("resetSelection");
                                a.p.data.length && M()
                            } else if (!a.p.treeGrid) {
                                a.p.selrow = null;
                                if (a.p.multiselect) {
                                    a.p.selarrrow = [];
                                    aa(false)
                                }
                                a.p.savedRow = []
                            }
                            a.p.scroll && P.call(a,
                                true, false);
                            if (d && d.page) {
                                var e = d.page;
                                if (e > a.p.lastpage) e = a.p.lastpage;
                                e < 1 && (e = 1);
                                a.p.page = e
                            }
                            a.grid.populate();
                            a.p._inlinenav === true && b(a).jqGrid("showAddEditButtons");
                            return false
                        }).dblclick(function(c) {
                            w = c.target;
                            t = b(w, a.rows).closest("tr.jqgrow");
                            if (b(t).length !== 0) {
                                y = t[0].rowIndex;
                                F = b.jgrid.getCellIndex(w);
                                b(a).triggerHandler("jqGridDblClickRow", [b(t).attr("id"), y, F, c]);
                                b.isFunction(this.p.ondblClickRow) && a.p.ondblClickRow.call(a, b(t).attr("id"), y, F, c)
                            }
                        }).bind("contextmenu", function(c) {
                            w = c.target;
                            t = b(w, a.rows).closest("tr.jqgrow");
                            if (b(t).length !== 0) {
                                a.p.multiselect || b(a).jqGrid("setSelection", t[0].id, true, c);
                                y = t[0].rowIndex;
                                F = b.jgrid.getCellIndex(w);
                                b(a).triggerHandler("jqGridRightClickRow", [b(t).attr("id"), y, F, c]);
                                b.isFunction(this.p.onRightClickRow) && a.p.onRightClickRow.call(a, b(t).attr("id"), y, F, c)
                            }
                        });
                        g.bDiv = b('<div data-role="content" data-theme="' + a.p.dataTheme + '" id="bdiv_' + a.p.id + '"></div')[0];
                        b(g.bDiv).append(b('<div style="overflow:auto;display:table;"></div>').append(a.p.scrollPaging ||
                            a.p.scroll ? '<div id="pullDown_' + a.p.id + '" class="pullDown"><span class="pullDownIcon"></span><span class="pullDownLabel">Pull down to refresh...</span></div>' : "").append(this).append(a.p.scrollPaging || a.p.scroll ? '<div id="pullUp_' + a.p.id + '" class=pullUp"><span class="pullUpIcon"></span><span class="pullUpLabel">Pull up to refresh...</span></div>' : "")).addClass("ui-jqgrid-bdiv").css({
                            height: a.p.height + (isNaN(a.p.height) ? "" : "px"),
                            width: g.width + "px"
                        });
                        b("table:first", g.bDiv).css({
                            width: a.p.tblwidth +
                                "px"
                        });
                        l ? (2 == b("tbody", this).size() && b("tbody:gt(0)", this).remove(), a.p.multikey && b(g.bDiv).bind("selectstart", function() {
                            return false
                        })) : a.p.multikey && b(g.bDiv).bind("vmousedown", function() {
                            return false
                        });
                        G && b(g.bDiv).hide();
                        g.cDiv = b("<div data-role='header' data-theme='" + a.p.dataTheme + "'></div>");
                        l = !0 === a.p.hidegrid ? b("<a role='link' href='javascript:void(0)' data-iconpos='notext' data-icon='close' data-mini='true' data-role='button' data-inline='true' style='left:94%;'/>").addClass("ui-jqgrid-titlebar-close HeaderButton").append("").css("rtl" ==
                            j ? "left" : "right", "0px") : "";
                        b(g.cDiv).append(l).append("<span class='ui-jqgrid-title" + ("rtl" == j ? "-rtl" : "") + "'>" + a.p.caption + "</span>").addClass("ui-jqgrid-titlebar ui-corner-top");
                        b(g.cDiv).insertBefore(g.hDiv);
                        a.p.toolbar[0] && (g.uDiv = document.createElement("div"), "top" == a.p.toolbar[1] ? b(g.uDiv).insertBefore(g.hDiv) : "bottom" == a.p.toolbar[1] && b(g.uDiv).insertAfter(g.hDiv), "both" == a.p.toolbar[1] ? (g.ubDiv = document.createElement("div"), b(g.uDiv).insertBefore(g.hDiv).addClass("ui-userdata").attr("id", "t_" +
                            this.id), b(g.ubDiv).insertAfter(g.hDiv).addClass("ui-userdata").attr("id", "tb_" + this.id), G && b(g.ubDiv).hide()) : b(g.uDiv).width(g.width).addClass("ui-userdata").attr("id", "t_" + this.id), G && b(g.uDiv).hide());
                        a.p.toppager && (a.p.toppager = b.jgrid.jqID(a.p.id) + "_toppager", g.topDiv = b("<div class = 'ui-jqgrid-toppager' data-role='header' data-theme='" + a.p.dataTheme + "' id='" + a.p.toppager + "'></div>")[0], a.p.toppager = "#" + a.p.toppager, b(g.topDiv).insertBefore(g.hDiv).width(g.width), ha(a.p.toppager, "_t"));
                        a.p.footerrow &&
                            (g.sDiv = b("<div class='ui-jqgrid-sdiv' data-role='content' data-theme='" + a.p.dataTheme + "'></div>")[0], h = b("<div class='ui-jqgrid-hbox" + ("rtl" == j ? "-rtl" : "") + "'></div>"), b(g.sDiv).append(h).insertAfter(g.hDiv).width(g.width), b(h).append(L), g.footers = b(".ui-jqgrid-ftable", g.sDiv)[0].rows[0].cells, a.p.rownumbers && (g.footers[0].className = "jqgrid-rownum"), G && b(g.sDiv).hide());
                        h = null;
                        if (a.p.caption) {
                            var ma = a.p.datatype;
                            !0 === a.p.hidegrid && (b(".ui-jqgrid-titlebar-close", g.cDiv).click(function(c) {
                                var d = b.isFunction(a.p.onHeaderClick),
                                    e = ".ui-jqgrid-bdiv, .ui-jqgrid-hdiv, .ui-jqgrid-pager, .ui-jqgrid-sdiv",
                                    f;
                                if (a.p.toolbar[0] === true) {
                                    a.p.toolbar[1] == "both" && (e = e + (", #" + b(g.ubDiv).attr("id")));
                                    e = e + (", #" + b(g.uDiv).attr("id"))
                                }
                                f = b(e, "#gview_" + b.jgrid.jqID(a.p.id)).length;
                                a.p.gridstate == "visible" ? b(e, "#gbox_" + b.jgrid.jqID(a.p.id)).slideUp("fast", function() {
                                    f--;
                                    if (f === 0) {
                                        a.p.gridstate = "hidden";
                                        b(a).triggerHandler("jqGridHeaderClick", [a.p.gridstate, c]);
                                        d && (G || a.p.onHeaderClick.call(a, a.p.gridstate, c))
                                    }
                                }) : a.p.gridstate == "hidden" && b(e,
                                    "#gbox_" + b.jgrid.jqID(a.p.id)).slideDown("fast", function() {
                                    f--;
                                    if (f === 0) {
                                        if (G) {
                                            a.p.datatype = ma;
                                            I();
                                            G = false
                                        }
                                        a.p.gridstate = "visible";
                                        b(a).triggerHandler("jqGridHeaderClick", [a.p.gridstate, c]);
                                        d && (G || a.p.onHeaderClick.call(a, a.p.gridstate, c))
                                    }
                                });
                                return false
                            }), G && (a.p.datatype = "local", b(".ui-jqgrid-titlebar-close", g.cDiv).trigger("click")))
                        } else b(g.cDiv).hide();
                        b(g.hDiv).after(g.bDiv);
                        b(".ui-jqgrid-labels", g.hDiv).bind("selectstart", function() {
                            return false
                        });
                        a.formatCol = m;
                        a.sortData = ia;
                        a.updatepager =
                            function(c, d) {
                                var e, f, g, h, i, j, k, l = "",
                                    m = a.p.pager ? "_" + b.jgrid.jqID(a.p.pager.substr(1)) : "",
                                    n = a.p.toppager ? "_" + a.p.toppager.substr(1) : "";
                                g = parseInt(a.p.page, 10) - 1;
                                g < 0 && (g = 0);
                                g = g * parseInt(a.p.rowNum, 10);
                                i = g + a.p.reccount;
                                l = a.p.pager ? a.p.pager : "";
                                if (l = l + (a.p.toppager ? l ? "," + a.p.toppager : a.p.toppager : "")) {
                                    k = b.jgrid.formatter.integer || {};
                                    e = p(a.p.page);
                                    f = p(a.p.lastpage);
                                    b(".selbox", l)[this.p.useProp ? "prop" : "attr"]("disabled", false);
                                    if (a.p.viewrecords)
                                        if (a.p.reccount === 0) b(".ui-paging-info", l).html(a.p.emptyrecords);
                                        else {
                                            h = g + 1;
                                            j = a.p.records;
                                            if (b.fmatter) {
                                                h = b.fmatter.util.NumberFormat(h, k);
                                                i = b.fmatter.util.NumberFormat(i, k);
                                                j = b.fmatter.util.NumberFormat(j, k)
                                            }
                                            b(".ui-paging-info", l).html(b.jgrid.format(a.p.recordtext, h, i, j))
                                        }
                                    if (a.p.pgbuttons === true) {
                                        e <= 0 && (e = f = 0);
                                        if (e == 1 || e === 0) {
                                            b("#first" + m + ", #prev" + m).addClass("ui-disabled").removeClass("ui-btn-hover-b");
                                            a.p.toppager && b("#first_t" + n + ", #prev_t" + n).addClass("ui-disabled").removeClass("ui-btn-hover-b")
                                        } else {
                                            b("#first" + m + ", #prev" + m).removeClass("ui-disabled");
                                            a.p.toppager && b("#first_t" + n + ", #prev_t" + n).removeClass("ui-disabled")
                                        }
                                        if (e == f || e === 0) {
                                            b("#next" + m + ", #last" + m).addClass("ui-disabled").removeClass("ui-btn-hover-b");
                                            a.p.toppager && b("#next_t" + n + ", #last_t" + n).addClass("ui-disabled").removeClass("ui-btn-hover-b")
                                        } else {
                                            b("#next" + m + ", #last" + m).removeClass("ui-disabled");
                                            a.p.toppager && b("#next_t" + n + ", #last_t" + n).removeClass("ui-disabled")
                                        }
                                    }
                                }
                                c === true && a.p.rownumbers === true && b("td.jqgrid-rownum", a.rows).each(function(a) {
                                    b(this).html(g + 1 + a)
                                });
                                d && a.p.jqgdnd &&
                                    b(a).jqGrid("gridDnD", "updateDnD");
                                b(a).triggerHandler("jqGridGridComplete");
                                b.isFunction(a.p.gridComplete) && a.p.gridComplete.call(a);
                                b(a).triggerHandler("jqGridAfterGridComplete")
                            };
                        a.refreshIndex = M;
                        a.setHeadCheckBox = aa;
                        a.constructTr = N;
                        a.formatter = function(a, b, c, d, e) {
                            return s(a, b, c, d, e)
                        };
                        b.extend(g, {
                            populate: I,
                            emptyRows: P
                        });
                        this.grid = g;
                        a.addXmlData = function(b) {
                            Y(b, a.grid.bDiv)
                        };
                        a.addJSONData = function(b) {
                            Z(b, a.grid.bDiv)
                        };
                        a.endReq = function() {
                            R()
                        };
                        this.grid.cols = this.rows[0].cells;
                        b(a).triggerHandler("jqGridInitGrid");
                        b.isFunction(a.p.onInitGrid) && a.p.onInitGrid.call(a);
                        I();
                        a.p.hiddengrid = !1;
                        c.bind("pageshow", function() {
                            var c = {
                                onScrollMove: function() {
                                    if (this.x <= 0) {
                                        g.hDiv.scrollLeft = -this.x;
                                        if (a.p.footerrow) g.sDiv.scrollLeft = -this.x
                                    }
                                }
                            };
                            if (a.p.scrollPaging || a.p.scroll) {
                                a.p.iScroll.bounce = true;
                                var e = b("#pullUp_" + b.jgrid.jqID(a.p.id))[0],
                                    f = b("#pullDown_" + b.jgrid.jqID(a.p.id))[0],
                                    h = e.offsetHeight,
                                    j = f.offsetHeight;
                                c.onRefresh = function() {
                                    if (f.className.match("loading1")) {
                                        f.className = "";
                                        f.querySelector(".pullDownLabel").innerHTML =
                                            a.p.scrollPulldown
                                    } else if (e.className.match("loading1")) {
                                        e.className = "";
                                        e.querySelector(".pullUpLabel").innerHTML = a.p.scrollPullup
                                    }
                                };
                                c.onScrollMove = function() {
                                    if (this.x <= 0) {
                                        g.hDiv.scrollLeft = -this.x;
                                        if (a.p.footerrow) g.sDiv.scrollLeft = -this.x
                                    }
                                    if (this.y > 5 && !f.className.match("gridflip")) {
                                        f.className = "gridflip";
                                        f.querySelector(".pullDownLabel").innerHTML = a.p.scrollRefresh;
                                        this.minScrollY = 0
                                    } else if (this.y < 5 && f.className.match("gridflip")) {
                                        f.className = "";
                                        f.querySelector(".pullDownLabel").innerHTML = a.p.scrollPulldown;
                                        this.minScrollY = -j
                                    } else if (this.y < this.maxScrollY - 5 && !e.className.match("gridflip")) {
                                        e.className = "gridflip";
                                        e.querySelector(".pullUpLabel").innerHTML = a.p.scrollRefresh;
                                        this.maxScrollY = this.maxScrollY
                                    } else if (this.y > this.maxScrollY + 5 && e.className.match("gridflip")) {
                                        e.className = "";
                                        e.querySelector(".pullUpLabel").innerHTML = a.p.scrollPullup;
                                        this.maxScrollY = h
                                    }
                                };
                                c.onScrollEnd = function() {
                                    if (f.className.match("gridflip")) {
                                        f.className = "loading1";
                                        f.querySelector(".pullDownLabel").innerHTML = a.p.loadtext;
                                        if (a.p.page >
                                            1) {
                                            a.p.page--;
                                            I()
                                        } else {
                                            f.className = "";
                                            f.querySelector(".pullDownLabel").innerHTML = a.p.nomorerecs
                                        }
                                    } else if (e.className.match("gridflip")) {
                                        e.className = "loading1";
                                        e.querySelector(".pullUpLabel").innerHTML = a.p.loadtext;
                                        if (a.p.lastpage >= a.p.page + 1) {
                                            a.p.page++;
                                            I()
                                        } else {
                                            e.className = "";
                                            e.querySelector(".pullUpLabel").innerHTML = a.p.nomorerecs
                                        }
                                    }
                                }
                            }
                            c = b.extend(true, c, a.p.iScroll || {});
                            setTimeout(function() {
                                    a.p.prmNames.npage = 1;
                                    d = new iScroll("bdiv_" + a.p.id, c);
                                    (a.p.scrollPaging || a.p.scroll) && d.scrollTo(0, -45, 100)
                                },
                                0)
                        });
                        a.p.refreshContent && b("#" + b.jgrid.jqID(a.p.id)).bind("jqGridAfterGridComplete.Mobile", function() {
                            b(this).trigger("create")
                        });
                        b(window).unload(function() {
                            a = null
                        }).bind("orientationchange", function() {
                            setTimeout(function() {
                                var c = b(window).width(),
                                    e = b("#gbox_" + b.jgrid.jqID(a.p.id)).parent().width();
                                b("#" + b.jgrid.jqID(a.p.id)).jqGrid("setGridWidth", c - e > 3 ? e : c);
                                d.refresh()
                            }, 600)
                        })
                    }
                }
            }
        })
    };
    b.jgrid.extend({
        getGridParam: function(b) {
            var d = this[0];
            if (d && d.grid) return !b ? d.p : void 0 !== d.p[b] ? d.p[b] : null
        },
        setGridParam: function(f) {
            return this.each(function() {
                this.grid &&
                    "object" === typeof f && b.extend(!0, this.p, f)
            })
        },
        getDataIDs: function() {
            var f = [],
                d = 0,
                c, e = 0;
            this.each(function() {
                if ((c = this.rows.length) && 0 < c)
                    for (; d < c;) b(this.rows[d]).hasClass("jqgrow") && (f[e] = this.rows[d].id, e++), d++
            });
            return f
        },
        setSelection: function(f, d, c) {
            return this.each(function() {
                var e, a, i, g, h, j;
                if (void 0 !== f && (d = !1 === d ? !1 : !0, (a = this.rows.namedItem(f + "")) && a.className && !(-1 < a.className.indexOf("ui-disabled"))))(!0 === this.p.scrollrows && (i = this.rows.namedItem(f).rowIndex, 0 <= i && (e = b(this.grid.bDiv)[0].clientHeight,
                    g = b(this.grid.bDiv)[0].scrollTop, h = b(this.rows[i]).position().top, i = this.rows[i].clientHeight, h + i >= e + g ? b(this.grid.bDiv)[0].scrollTop = h - (e + g) + i + g : h < e + g && h < g && (b(this.grid.bDiv)[0].scrollTop = h))), !0 === this.p.frozenColumns && (j = this.p.id + "_frozen"), this.p.multiselect) ? (this.setHeadCheckBox(!1), this.p.selrow = a.id, g = b.inArray(this.p.selrow, this.p.selarrrow), -1 === g ? ("ui-subgrid" !== a.className && b(a).addClass("ui-btn-active").attr("aria-selected", "true"), e = !0, this.p.selarrrow.push(this.p.selrow)) : ("ui-subgrid" !==
                    a.className && b(a).removeClass("ui-btn-active").attr("aria-selected", "false"), e = !1, this.p.selarrrow.splice(g, 1), h = this.p.selarrrow[0], this.p.selrow = void 0 === h ? null : h), b("#jqg_" + b.jgrid.jqID(this.p.id) + "_" + b.jgrid.jqID(a.id))[this.p.useProp ? "prop" : "attr"]("checked", e), j && (-1 === g ? b("#" + b.jgrid.jqID(f), "#" + b.jgrid.jqID(j)).addClass("ui-btn-active") : b("#" + b.jgrid.jqID(f), "#" + b.jgrid.jqID(j)).removeClass("ui-btn-active"), b("#jqg_" + b.jgrid.jqID(this.p.id) + "_" + b.jgrid.jqID(f), "#" + b.jgrid.jqID(j))[this.p.useProp ?
                    "prop" : "attr"]("checked", e)), b(this).triggerHandler("jqGridSelectRow", [a.id, e, c]), this.p.onSelectRow && d && this.p.onSelectRow.call(this, a.id, e, c)) : "ui-subgrid" !== a.className && (this.p.selrow != a.id ? (b(this.rows.namedItem(this.p.selrow)).removeClass("ui-btn-active").attr({
                        "aria-selected": "false",
                        tabindex: "-1"
                    }), b(a).addClass("ui-btn-active").attr({
                        "aria-selected": "true",
                        tabindex: "0"
                    }), j && (b("#" + b.jgrid.jqID(this.p.selrow), "#" + b.jgrid.jqID(j)).removeClass("ui-btn-active"), b("#" + b.jgrid.jqID(f), "#" + b.jgrid.jqID(j)).addClass("ui-btn-active")),
                    e = !0) : e = !1, this.p.selrow = a.id, b(this).triggerHandler("jqGridSelectRow", [a.id, e, c]), this.p.onSelectRow && d && this.p.onSelectRow.call(this, a.id, e, c))
            })
        },
        resetSelection: function(f) {
            return this.each(function() {
                var d = this,
                    c, e, a;
                !0 === d.p.frozenColumns && (a = d.p.id + "_frozen");
                if (void 0 !== f) {
                    e = f === d.p.selrow ? d.p.selrow : f;
                    b("#" + b.jgrid.jqID(d.p.id) + " tbody:first tr#" + b.jgrid.jqID(e)).removeClass("ui-btn-active").attr("aria-selected", "false");
                    a && b("#" + b.jgrid.jqID(e), "#" + b.jgrid.jqID(a)).removeClass("ui-btn-active");
                    if (d.p.multiselect) {
                        b("#jqg_" + b.jgrid.jqID(d.p.id) + "_" + b.jgrid.jqID(e), "#" + b.jgrid.jqID(d.p.id))[d.p.useProp ? "prop" : "attr"]("checked", !1);
                        if (a) b("#jqg_" + b.jgrid.jqID(d.p.id) + "_" + b.jgrid.jqID(e), "#" + b.jgrid.jqID(a))[d.p.useProp ? "prop" : "attr"]("checked", !1);
                        d.setHeadCheckBox(!1)
                    }
                    e = null
                } else d.p.multiselect ? (b(d.p.selarrrow).each(function(e, f) {
                    c = d.rows.namedItem(f);
                    b(c).removeClass("ui-btn-active").attr("aria-selected", "false");
                    b("#jqg_" + b.jgrid.jqID(d.p.id) + "_" + b.jgrid.jqID(f))[d.p.useProp ? "prop" : "attr"]("checked", !1);
                    a && (b("#" + b.jgrid.jqID(f), "#" + b.jgrid.jqID(a)).removeClass("ui-btn-active"), b("#jqg_" + b.jgrid.jqID(d.p.id) + "_" + b.jgrid.jqID(f), "#" + b.jgrid.jqID(a))[d.p.useProp ? "prop" : "attr"]("checked", !1))
                }), d.setHeadCheckBox(!1), d.p.selarrrow = []) : d.p.selrow && (b("#" + b.jgrid.jqID(d.p.id) + " tbody:first tr#" + b.jgrid.jqID(d.p.selrow)).removeClass("ui-btn-active").attr("aria-selected", "false"), a && b("#" + b.jgrid.jqID(d.p.selrow), "#" + b.jgrid.jqID(a)).removeClass("ui-btn-active"), d.p.selrow = null);
                !0 === d.p.cellEdit && (0 <=
                    parseInt(d.p.iCol, 10) && 0 <= parseInt(d.p.iRow, 10)) && (b("td:eq(" + d.p.iCol + ")", d.rows[d.p.iRow]).removeClass("edit-cell ui-btn-active"), b(d.rows[d.p.iRow]).removeClass("selected-row ui-btn-hover-b"));
                d.p.savedRow = []
            })
        },
        getRowData: function(f) {
            var d = {},
                c, e = !1,
                a, i = 0;
            this.each(function() {
                var g = this,
                    h, j;
                if (void 0 === f) e = !0, c = [], a = g.rows.length;
                else {
                    j = g.rows.namedItem(f);
                    if (!j) return d;
                    a = 2
                }
                for (; i < a;) e && (j = g.rows[i]), b(j).hasClass("jqgrow") && (b('td[role="gridcell"]', j).each(function(a) {
                    h = g.p.colModel[a].name;
                    if ("cb" !== h && "subgrid" !== h && "rn" !== h)
                        if (!0 === g.p.treeGrid && h == g.p.ExpandColumn) d[h] = b.jgrid.htmlDecode(b("span:first", this).html());
                        else try {
                            d[h] = b.unformat.call(g, this, {
                                rowId: j.id,
                                colModel: g.p.colModel[a]
                            }, a)
                        } catch (c) {
                            d[h] = b.jgrid.htmlDecode(b(this).html())
                        }
                }), e && (c.push(d), d = {})), i++
            });
            return c || d
        },
        delRowData: function(f) {
            var d = !1,
                c, e;
            this.each(function() {
                c = this.rows.namedItem(f);
                if (!c) return !1;
                b(c).remove();
                this.p.records--;
                this.p.reccount--;
                this.updatepager(!0, !1);
                d = !0;
                this.p.multiselect && (e = b.inArray(f,
                    this.p.selarrrow), -1 != e && this.p.selarrrow.splice(e, 1));
                this.p.selrow = this.p.multiselect && 0 < this.p.selarrrow.length ? this.p.selarrrow[this.p.selarrrow.length - 1] : null;
                if ("local" == this.p.datatype) {
                    var a = this.p._index[b.jgrid.stripPref(this.p.idPrefix, f)];
                    void 0 !== a && (this.p.data.splice(a, 1), this.refreshIndex())
                }
                if (!0 === this.p.altRows && d) {
                    var i = this.p.altclass;
                    b(this.rows).each(function(a) {
                        a % 2 == 1 ? b(this).addClass(i) : b(this).removeClass(i)
                    })
                }
            });
            return d
        },
        setRowData: function(f, d, c) {
            var e, a = !0,
                i;
            this.each(function() {
                if (!this.grid) return !1;
                var g = this,
                    h, j, k = typeof c,
                    l = {};
                j = g.rows.namedItem(f);
                if (!j) return !1;
                if (d) try {
                    if (b(this.p.colModel).each(function(a) {
                            e = this.name;
                            void 0 !== d[e] && (l[e] = this.formatter && "string" === typeof this.formatter && "date" == this.formatter ? b.unformat.date.call(g, d[e], this) : d[e], h = g.formatter(f, d[e], a, d, "edit"), i = this.title ? {
                                title: b.jgrid.stripHtml(h)
                            } : {}, !0 === g.p.treeGrid && e == g.p.ExpandColumn ? b("td[role='gridcell']:eq(" + a + ") > span:first", j).html(h).attr(i) : b("td[role='gridcell']:eq(" + a + ")", j).html(h).attr(i))
                        }), "local" ==
                        g.p.datatype) {
                        var n = b.jgrid.stripPref(g.p.idPrefix, f),
                            p = g.p._index[n],
                            m;
                        if (g.p.treeGrid)
                            for (m in g.p.treeReader) g.p.treeReader.hasOwnProperty(m) && delete l[g.p.treeReader[m]];
                        void 0 !== p && (g.p.data[p] = b.extend(!0, g.p.data[p], l));
                        l = null
                    }
                } catch (v) {
                    a = !1
                }
                a && ("string" === k ? b(j).addClass(c) : "object" === k && b(j).css(c), b(g).triggerHandler("jqGridAfterGridComplete"))
            });
            return a
        },
        addRowData: function(f, d, c, e) {
            c || (c = "last");
            var a = !1,
                i, g, h, j, k, l, n, p, m = "",
                v, s, O, J, X, V;
            d && (b.isArray(d) ? (v = !0, c = "last", s = f) : (d = [d], v = !1),
                this.each(function() {
                    var W = d.length;
                    k = this.p.rownumbers === true ? 1 : 0;
                    h = this.p.multiselect === true ? 1 : 0;
                    j = this.p.subGrid === true ? 1 : 0;
                    if (!v)
                        if (f !== void 0) f = "" + f;
                        else {
                            f = b.jgrid.randId();
                            if (this.p.keyIndex !== false) {
                                s = this.p.colModel[this.p.keyIndex + h + j + k].name;
                                d[0][s] !== void 0 && (f = d[0][s])
                            }
                        }
                    O = this.p.altclass;
                    for (var P = 0, M = "", N = {}, Y = b.isFunction(this.p.afterInsertRow) ? true : false; P < W;) {
                        J = d[P];
                        g = [];
                        if (v) {
                            try {
                                f = J[s];
                                f === void 0 && (f = b.jgrid.randId())
                            } catch (Z) {
                                f = b.jgrid.randId()
                            }
                            M = this.p.altRows === true ? (this.rows.length -
                                1) % 2 === 0 ? O : "" : ""
                        }
                        V = f;
                        f = this.p.idPrefix + f;
                        if (k) {
                            m = this.formatCol(0, 1, "", null, f, true);
                            g[g.length] = '<td role="gridcell" class="jqgrid-rownum" ' + m + ">0</td>"
                        }
                        if (h) {
                            p = '<input data-role="none" role="checkbox" type="checkbox" id="jqg_' + this.p.id + "_" + f + '" class="cbox"/>';
                            m = this.formatCol(k, 1, "", null, f, true);
                            g[g.length] = '<td role="gridcell" ' + m + ">" + p + "</td>"
                        }
                        j && (g[g.length] = b(this).jqGrid("addSubGridCell", h + k, 1));
                        for (n = h + j + k; n < this.p.colModel.length; n++) {
                            X = this.p.colModel[n];
                            i = X.name;
                            N[i] = J[i];
                            p = this.formatter(f,
                                b.jgrid.getAccessor(J, i), n, J);
                            m = this.formatCol(n, 1, p, J, f, N);
                            g[g.length] = '<td role="gridcell" ' + m + ">" + p + "</td>"
                        }
                        g.unshift(this.constructTr(f, false, M, N, J, false));
                        g[g.length] = "</tr>";
                        if (this.rows.length === 0) b("table:first", this.grid.bDiv).append(g.join(""));
                        else switch (c) {
                            case "last":
                                b(this.rows[this.rows.length - 1]).after(g.join(""));
                                l = this.rows.length - 1;
                                break;
                            case "first":
                                b(this.rows[0]).after(g.join(""));
                                l = 1;
                                break;
                            case "after":
                                (l = this.rows.namedItem(e)) && (b(this.rows[l.rowIndex + 1]).hasClass("ui-subgrid") ?
                                    b(this.rows[l.rowIndex + 1]).after(g) : b(l).after(g.join("")));
                                l++;
                                break;
                            case "before":
                                if (l = this.rows.namedItem(e)) {
                                    b(l).before(g.join(""));
                                    l = l.rowIndex
                                }
                                l--
                        }
                        this.p.subGrid === true && b(this).jqGrid("addSubGrid", h + k, l);
                        this.p.records++;
                        this.p.reccount++;
                        b(this).triggerHandler("jqGridAfterInsertRow", [f, J, J]);
                        Y && this.p.afterInsertRow.call(this, f, J, J);
                        P++;
                        if (this.p.datatype == "local") {
                            N[this.p.localReader.id] = V;
                            this.p._index[V] = this.p.data.length;
                            this.p.data.push(N);
                            N = {}
                        }
                    }
                    this.p.altRows === true && !v && (c == "last" ?
                        (this.rows.length - 1) % 2 == 1 && b(this.rows[this.rows.length - 1]).addClass(O) : b(this.rows).each(function(a) {
                            a % 2 == 1 ? b(this).addClass(O) : b(this).removeClass(O)
                        }));
                    this.updatepager(true, true);
                    a = true
                }));
            return a
        },
        footerData: function(f, d, c) {
            function e(a) {
                for (var b in a)
                    if (a.hasOwnProperty(b)) return !1;
                return !0
            }
            var a, i = !1,
                g = {},
                h;
            void 0 === f && (f = "get");
            "boolean" !== typeof c && (c = !0);
            f = f.toLowerCase();
            this.each(function() {
                var j = this,
                    k;
                if (!j.grid || !j.p.footerrow || "set" == f && e(d)) return !1;
                i = !0;
                b(this.p.colModel).each(function(e) {
                    a =
                        this.name;
                    "set" == f ? void 0 !== d[a] && (k = c ? j.formatter("", d[a], e, d, "edit") : d[a], h = this.title ? {
                        title: b.jgrid.stripHtml(k)
                    } : {}, b("tr.footrow td:eq(" + e + ")", j.grid.sDiv).html(k).attr(h), i = !0) : "get" == f && (g[a] = b("tr.footrow td:eq(" + e + ")", j.grid.sDiv).html())
                })
            });
            return "get" == f ? g : i
        },
        showHideCol: function(f, d) {
            return this.each(function() {
                var c = this,
                    e = !1,
                    a = b.jgrid.cell_width ? 0 : c.p.cellLayout,
                    i;
                if (c.grid) {
                    "string" === typeof f && (f = [f]);
                    d = "none" != d ? "" : "none";
                    var g = "" === d ? !0 : !1,
                        h = c.p.groupHeader && ("object" === typeof c.p.groupHeader ||
                            b.isFunction(c.p.groupHeader));
                    h && b(c).jqGrid("destroyGroupHeader", !1);
                    b(this.p.colModel).each(function(h) {
                        if (-1 !== b.inArray(this.name, f) && this.hidden === g) {
                            if (!0 === c.p.frozenColumns && !0 === this.frozen) return !0;
                            b("tr", c.grid.hDiv).each(function() {
                                b(this.cells[h]).css("display", d)
                            });
                            b(c.rows).each(function() {
                                b(this).hasClass("jqgroup") || b(this.cells[h]).css("display", d)
                            });
                            c.p.footerrow && b("tr.footrow td:eq(" + h + ")", c.grid.sDiv).css("display", d);
                            i = parseInt(this.width, 10);
                            c.p.tblwidth = "none" === d ? c.p.tblwidth -
                                (i + a) : c.p.tblwidth + (i + a);
                            this.hidden = !g;
                            e = !0;
                            b(c).triggerHandler("jqGridShowHideCol", [g, this.name, h])
                        }
                    });
                    !0 === e && (!0 === c.p.shrinkToFit && !isNaN(c.p.height) && (c.p.tblwidth += parseInt(c.p.scrollOffset, 10)), b(c).jqGrid("setGridWidth", !0 === c.p.shrinkToFit ? c.p.tblwidth : c.p.width));
                    h && b(c).jqGrid("setGroupHeaders", c.p.groupHeader)
                }
            })
        },
        hideCol: function(f) {
            return this.each(function() {
                b(this).jqGrid("showHideCol", f, "none")
            })
        },
        showCol: function(f) {
            return this.each(function() {
                b(this).jqGrid("showHideCol", f, "")
            })
        },
        remapColumns: function(f, d, c) {
            function e(a) {
                var c;
                c = a.length ? b.makeArray(a) : b.extend({}, a);
                b.each(f, function(b) {
                    a[b] = c[this]
                })
            }

            function a(a, c) {
                b(">tr" + (c || ""), a).each(function() {
                    var a = this,
                        c = b.makeArray(a.cells);
                    b.each(f, function() {
                        var b = c[this];
                        b && a.appendChild(b)
                    })
                })
            }
            var i = this.get(0);
            e(i.p.colModel);
            e(i.p.colNames);
            e(i.grid.headers);
            a(b("thead:first", i.grid.hDiv), c && ":not(.ui-jqgrid-labels)");
            d && a(b("#" + b.jgrid.jqID(i.p.id) + " tbody:first"), ".jqgfirstrow, tr.jqgrow, tr.jqfoot");
            i.p.footerrow && a(b("tbody:first",
                i.grid.sDiv));
            i.p.remapColumns && (i.p.remapColumns.length ? e(i.p.remapColumns) : i.p.remapColumns = b.makeArray(f));
            i.p.lastsort = b.inArray(i.p.lastsort, f);
            i.p.treeGrid && (i.p.expColInd = b.inArray(i.p.expColInd, f));
            b(i).triggerHandler("jqGridRemapColumns", [f, d, c])
        },
        setGridWidth: function(f, d) {
            return this.each(function() {
                if (this.grid) {
                    var c = this,
                        e, a = 0,
                        i = b.jgrid.cell_width ? 0 : c.p.cellLayout,
                        g, h = 0,
                        j = !1,
                        k = c.p.scrollOffset,
                        l, n = 0,
                        p = 0,
                        m;
                    "boolean" !== typeof d && (d = c.p.shrinkToFit);
                    if (!isNaN(f)) {
                        f = parseInt(f, 10);
                        c.grid.width =
                            c.p.width = f;
                        b("#gbox_" + b.jgrid.jqID(c.p.id)).css("width", f + "px");
                        b("#gview_" + b.jgrid.jqID(c.p.id)).css("width", f + "px");
                        b(c.grid.bDiv).css("width", f + "px");
                        b(c.grid.hDiv).css("width", f + "px");
                        c.p.pager && b(c.p.pager).css("width", f + "px");
                        c.p.toppager && b(c.p.toppager).css("width", f + "px");
                        !0 === c.p.toolbar[0] && (b(c.grid.uDiv).css("width", f + "px"), "both" == c.p.toolbar[1] && b(c.grid.ubDiv).css("width", f + "px"));
                        c.p.footerrow && b(c.grid.sDiv).css("width", f + "px");
                        !1 === d && !0 === c.p.forceFit && (c.p.forceFit = !1);
                        if (!0 ===
                            d) {
                            b.each(c.p.colModel, function() {
                                if (this.hidden === false) {
                                    e = this.widthOrg;
                                    a = a + (e + i);
                                    this.fixed ? n = n + (e + i) : h++;
                                    p++
                                }
                            });
                            if (0 === h) return;
                            c.p.tblwidth = a;
                            l = f - i * h - n;
                            if (!isNaN(c.p.height) && (b(c.grid.bDiv)[0].clientHeight < b(c.grid.bDiv)[0].scrollHeight || 1 === c.rows.length)) j = !0, l -= k;
                            var a = 0,
                                v = 0 < c.grid.cols.length;
                            b.each(c.p.colModel, function(b) {
                                if (this.hidden === false && !this.fixed) {
                                    e = this.widthOrg;
                                    e = Math.round(l * e / (c.p.tblwidth - i * h - n));
                                    if (!(e < 0)) {
                                        this.width = e;
                                        a = a + e;
                                        c.grid.headers[b].width = e;
                                        c.grid.headers[b].el.style.width =
                                            e + "px";
                                        if (c.p.footerrow) c.grid.footers[b].style.width = e + "px";
                                        if (v) c.grid.cols[b].style.width = e + "px";
                                        g = b
                                    }
                                }
                            });
                            if (!g) return;
                            m = 0;
                            j ? f - n - (a + i * h) !== k && (m = f - n - (a + i * h) - k) : 1 !== Math.abs(f - n - (a + i * h)) && (m = f - n - (a + i * h));
                            c.p.colModel[g].width += m;
                            c.p.tblwidth = a + m + i * h + n;
                            c.p.tblwidth > f ? (j = c.p.tblwidth - parseInt(f, 10), c.p.tblwidth = f, e = c.p.colModel[g].width -= j) : e = c.p.colModel[g].width;
                            c.grid.headers[g].width = e;
                            c.grid.headers[g].el.style.width = e + "px";
                            v && (c.grid.cols[g].style.width = e + "px");
                            c.p.footerrow && (c.grid.footers[g].style.width =
                                e + "px")
                        }
                        c.p.tblwidth && (b("table:first", c.grid.bDiv).css("width", c.p.tblwidth + "px"), b("table:first", c.grid.hDiv).css("width", c.p.tblwidth + "px"), c.grid.hDiv.scrollLeft = c.grid.bDiv.scrollLeft, c.p.footerrow && b("table:first", c.grid.sDiv).css("width", c.p.tblwidth + "px"))
                    }
                }
            })
        },
        setGridHeight: function(f) {
            return this.each(function() {
                if (this.grid) {
                    var d = b(this.grid.bDiv);
                    d.css({
                        height: f + (isNaN(f) ? "" : "px")
                    });
                    !0 === this.p.frozenColumns && b("#" + b.jgrid.jqID(this.p.id) + "_frozen").parent().height(d.height() - 16);
                    this.p.height =
                        f;
                    this.p.scroll && this.grid.populateVisible()
                }
            })
        },
        setCaption: function(f) {
            return this.each(function() {
                this.p.caption = f;
                b("span.ui-jqgrid-title, span.ui-jqgrid-title-rtl", this.grid.cDiv).html(f);
                b(this.grid.cDiv).show()
            })
        },
        setLabel: function(f, d, c, e) {
            return this.each(function() {
                var a = -1;
                if (this.grid && void 0 !== f && (b(this.p.colModel).each(function(b) {
                        if (this.name == f) return a = b, !1
                    }), 0 <= a)) {
                    var i = b("tr.ui-jqgrid-labels th:eq(" + a + ")", this.grid.hDiv);
                    if (d) {
                        var g = b(".s-ico", i);
                        b("[id^=jqgh_]", i).empty().html(d).append(g);
                        this.p.colNames[a] = d
                    }
                    c && ("string" === typeof c ? b(i).addClass(c) : b(i).css(c));
                    "object" === typeof e && b(i).attr(e)
                }
            })
        },
        setCell: function(f, d, c, e, a, i) {
            return this.each(function() {
                var g = -1,
                    h, j;
                if (this.grid && (isNaN(d) ? b(this.p.colModel).each(function(a) {
                        if (this.name == d) return g = a, !1
                    }) : g = parseInt(d, 10), 0 <= g && (h = this.rows.namedItem(f)))) {
                    var k = b("td:eq(" + g + ")", h);
                    if ("" !== c || !0 === i) h = this.formatter(f, c, g, h, "edit"), j = this.p.colModel[g].title ? {
                            title: b.jgrid.stripHtml(h)
                        } : {}, this.p.treeGrid && 0 < b(".tree-wrap", b(k)).length ?
                        b("span", b(k)).html(h).attr(j) : b(k).html(h).attr(j), "local" == this.p.datatype && (h = this.p.colModel[g], c = h.formatter && "string" === typeof h.formatter && "date" == h.formatter ? b.unformat.date.call(this, c, h) : c, j = this.p._index[f], void 0 !== j && (this.p.data[j][h.name] = c));
                    "string" === typeof e ? b(k).addClass(e) : e && b(k).css(e);
                    "object" === typeof a && b(k).attr(a)
                }
            })
        },
        getCell: function(f, d) {
            var c = !1;
            this.each(function() {
                var e = -1;
                if (this.grid && (isNaN(d) ? b(this.p.colModel).each(function(a) {
                            if (this.name === d) return e = a, !1
                        }) :
                        e = parseInt(d, 10), 0 <= e)) {
                    var a = this.rows.namedItem(f);
                    if (a) try {
                        c = b.unformat.call(this, b("td:eq(" + e + ")", a), {
                            rowId: a.id,
                            colModel: this.p.colModel[e]
                        }, e)
                    } catch (i) {
                        c = b.jgrid.htmlDecode(b("td:eq(" + e + ")", a).html())
                    }
                }
            });
            return c
        },
        getCol: function(f, d, c) {
            var e = [],
                a, i = 0,
                g, h, j, d = "boolean" !== typeof d ? !1 : d;
            void 0 === c && (c = !1);
            this.each(function() {
                var k = -1;
                if (this.grid && (isNaN(f) ? b(this.p.colModel).each(function(a) {
                        if (this.name === f) return k = a, !1
                    }) : k = parseInt(f, 10), 0 <= k)) {
                    var l = this.rows.length,
                        n = 0;
                    if (l && 0 < l) {
                        for (; n <
                            l;) {
                            if (b(this.rows[n]).hasClass("jqgrow")) {
                                try {
                                    a = b.unformat.call(this, b(this.rows[n].cells[k]), {
                                        rowId: this.rows[n].id,
                                        colModel: this.p.colModel[k]
                                    }, k)
                                } catch (p) {
                                    a = b.jgrid.htmlDecode(this.rows[n].cells[k].innerHTML)
                                }
                                c ? (j = parseFloat(a), i += j, void 0 === h && (h = g = j), g = Math.min(g, j), h = Math.max(h, j)) : d ? e.push({
                                    id: this.rows[n].id,
                                    value: a
                                }) : e.push(a)
                            }
                            n++
                        }
                        if (c) switch (c.toLowerCase()) {
                            case "sum":
                                e = i;
                                break;
                            case "avg":
                                e = i / l;
                                break;
                            case "count":
                                e = l;
                                break;
                            case "min":
                                e = g;
                                break;
                            case "max":
                                e = h
                        }
                    }
                }
            });
            return e
        },
        clearGridData: function(f) {
            return this.each(function() {
                if (this.grid) {
                    "boolean" !==
                    typeof f && (f = !1);
                    if (this.p.deepempty) b("#" + b.jgrid.jqID(this.p.id) + " tbody:first tr:gt(0)").remove();
                    else {
                        var d = b("#" + b.jgrid.jqID(this.p.id) + " tbody:first tr:first")[0];
                        b("#" + b.jgrid.jqID(this.p.id) + " tbody:first").empty().append(d)
                    }
                    this.p.footerrow && f && b(".ui-jqgrid-ftable td", this.grid.sDiv).html("&#160;");
                    this.p.selrow = null;
                    this.p.selarrrow = [];
                    this.p.savedRow = [];
                    this.p.records = 0;
                    this.p.page = 1;
                    this.p.lastpage = 0;
                    this.p.reccount = 0;
                    this.p.data = [];
                    this.p._index = {};
                    this.updatepager(!0, !1)
                }
            })
        },
        getInd: function(b,
            d) {
            var c = !1,
                e;
            this.each(function() {
                (e = this.rows.namedItem(b)) && (c = !0 === d ? e : e.rowIndex)
            });
            return c
        },
        bindKeys: function(f) {
            var d = b.extend({
                onEnter: null,
                onSpace: null,
                onLeftKey: null,
                onRightKey: null,
                scrollingRows: !0
            }, f || {});
            return this.each(function() {
                var c = this;
                b("body").is("[role]") || b("body").attr("role", "application");
                c.p.scrollrows = d.scrollingRows;
                b(c).keydown(function(e) {
                    var a = b(c).find("tr[tabindex=0]")[0],
                        f, g, h, j = c.p.treeReader.expanded_field;
                    if (a)
                        if (h = c.p._index[a.id], 37 === e.keyCode || 38 === e.keyCode ||
                            39 === e.keyCode || 40 === e.keyCode) {
                            if (38 === e.keyCode) {
                                g = a.previousSibling;
                                f = "";
                                if (g)
                                    if (b(g).is(":hidden"))
                                        for (; g;) {
                                            if (g = g.previousSibling, !b(g).is(":hidden") && b(g).hasClass("jqgrow")) {
                                                f = g.id;
                                                break
                                            }
                                        } else f = g.id;
                                b(c).jqGrid("setSelection", f, !0, e);
                                e.preventDefault()
                            }
                            if (40 === e.keyCode) {
                                g = a.nextSibling;
                                f = "";
                                if (g)
                                    if (b(g).is(":hidden"))
                                        for (; g;) {
                                            if (g = g.nextSibling, !b(g).is(":hidden") && b(g).hasClass("jqgrow")) {
                                                f = g.id;
                                                break
                                            }
                                        } else f = g.id;
                                b(c).jqGrid("setSelection", f, !0, e);
                                e.preventDefault()
                            }
                            37 === e.keyCode && (c.p.treeGrid &&
                                c.p.data[h][j] && b(a).find("div.treeclick").trigger("click"), b(c).triggerHandler("jqGridKeyLeft", [c.p.selrow]), b.isFunction(d.onLeftKey) && d.onLeftKey.call(c, c.p.selrow));
                            39 === e.keyCode && (c.p.treeGrid && !c.p.data[h][j] && b(a).find("div.treeclick").trigger("click"), b(c).triggerHandler("jqGridKeyRight", [c.p.selrow]), b.isFunction(d.onRightKey) && d.onRightKey.call(c, c.p.selrow))
                        } else 13 === e.keyCode ? (b(c).triggerHandler("jqGridKeyEnter", [c.p.selrow]), b.isFunction(d.onEnter) && d.onEnter.call(c, c.p.selrow)) : 32 ===
                            e.keyCode && (b(c).triggerHandler("jqGridKeySpace", [c.p.selrow]), b.isFunction(d.onSpace) && d.onSpace.call(c, c.p.selrow))
                })
            })
        },
        unbindKeys: function() {
            return this.each(function() {
                b(this).unbind("keydown")
            })
        },
        getLocalRow: function(b) {
            var d = !1,
                c;
            this.each(function() {
                void 0 !== b && (c = this.p._index[b], 0 <= c && (d = this.p.data[c]))
            });
            return d
        }
    })
})(jQuery);
(function(a) {
    a.jgrid.extend({
        getColProp: function(a) {
            var d = {},
                c = this[0];
            if (!c.grid) return !1;
            for (var c = c.p.colModel, e = 0; e < c.length; e++)
                if (c[e].name == a) {
                    d = c[e];
                    break
                }
            return d
        },
        setColProp: function(b, d) {
            return this.each(function() {
                if (this.grid && d)
                    for (var c = this.p.colModel, e = 0; e < c.length; e++)
                        if (c[e].name == b) {
                            a.extend(this.p.colModel[e], d);
                            break
                        }
            })
        },
        sortGrid: function(a, d, c) {
            return this.each(function() {
                var e = -1;
                if (this.grid) {
                    a || (a = this.p.sortname);
                    for (var h = 0; h < this.p.colModel.length; h++)
                        if (this.p.colModel[h].index ==
                            a || this.p.colModel[h].name == a) {
                            e = h;
                            break
                        } - 1 != e && (h = this.p.colModel[e].sortable, "boolean" !== typeof h && (h = !0), "boolean" !== typeof d && (d = !1), h && this.sortData("jqgh_" + this.p.id + "_" + a, e, d, c))
                }
            })
        },
        clearBeforeUnload: function() {
            return this.each(function() {
                var b = this.grid;
                b.emptyRows.call(this, !0, !0);
                a(b.hDiv).unbind("mousemove");
                a(this).unbind();
                b.dragEnd = null;
                b.dragMove = null;
                b.dragStart = null;
                b.emptyRows = null;
                b.populate = null;
                b.populateVisible = null;
                b.scrollGrid = null;
                b.selectionPreserver = null;
                b.bDiv = null;
                b.cDiv =
                    null;
                b.hDiv = null;
                b.cols = null;
                var d, c = b.headers.length;
                for (d = 0; d < c; d++) b.headers[d].el = null;
                this.addJSONData = this.addXmlData = this.formatter = this.constructTr = this.setHeadCheckBox = this.refreshIndex = this.updatepager = this.sortData = this.formatCol = null
            })
        },
        GridDestroy: function() {
            return this.each(function() {
                if (this.grid) {
                    this.p.pager && a(this.p.pager).remove();
                    try {
                        a(this).jqGrid("clearBeforeUnload"), a("#gbox_" + a.jgrid.jqID(this.id)).remove()
                    } catch (b) {}
                }
            })
        },
        GridUnload: function() {
            return this.each(function() {
                if (this.grid) {
                    var b =
                        a(this).attr("id"),
                        d = a(this).attr("class");
                    this.p.pager && a(this.p.pager).empty().removeClass("ui-state-default ui-jqgrid-pager corner-bottom");
                    var c = document.createElement("table");
                    a(c).attr({
                        id: b
                    });
                    c.className = d;
                    b = a.jgrid.jqID(this.id);
                    a(c).removeClass("ui-jqgrid-btable");
                    1 === a(this.p.pager).parents("#gbox_" + b).length ? (a(c).insertBefore("#gbox_" + b).show(), a(this.p.pager).insertBefore("#gbox_" + b)) : a(c).insertBefore("#gbox_" + b).show();
                    a(this).jqGrid("clearBeforeUnload");
                    a("#gbox_" + b).remove()
                }
            })
        },
        setGridState: function(b) {
            return this.each(function() {
                this.grid && ("hidden" == b ? (a(".ui-jqgrid-bdiv, .ui-jqgrid-hdiv", "#gview_" + a.jgrid.jqID(this.p.id)).slideUp("fast"), this.p.pager && a(this.p.pager).slideUp("fast"), this.p.toppager && a(this.p.toppager).slideUp("fast"), !0 === this.p.toolbar[0] && ("both" == this.p.toolbar[1] && a(this.grid.ubDiv).slideUp("fast"), a(this.grid.uDiv).slideUp("fast")), this.p.footerrow && a(".ui-jqgrid-sdiv", "#gbox_" + a.jgrid.jqID(this.p.id)).slideUp("fast"), a(".ui-jqgrid-titlebar-close span",
                    this.grid.cDiv).removeClass("ui-icon-circle-triangle-n").addClass("ui-icon-circle-triangle-s"), this.p.gridstate = "hidden") : "visible" == b && (a(".ui-jqgrid-hdiv, .ui-jqgrid-bdiv", "#gview_" + a.jgrid.jqID(this.p.id)).slideDown("fast"), this.p.pager && a(this.p.pager).slideDown("fast"), this.p.toppager && a(this.p.toppager).slideDown("fast"), !0 === this.p.toolbar[0] && ("both" == this.p.toolbar[1] && a(this.grid.ubDiv).slideDown("fast"), a(this.grid.uDiv).slideDown("fast")), this.p.footerrow && a(".ui-jqgrid-sdiv", "#gbox_" +
                    a.jgrid.jqID(this.p.id)).slideDown("fast"), a(".ui-jqgrid-titlebar-close span", this.grid.cDiv).removeClass("ui-icon-circle-triangle-s").addClass("ui-icon-circle-triangle-n"), this.p.gridstate = "visible"))
            })
        },
        filterToolbar: function(b) {
            b = a.extend({
                autosearch: !0,
                searchOnEnter: !0,
                beforeSearch: null,
                afterSearch: null,
                beforeClear: null,
                afterClear: null,
                searchurl: "",
                stringResult: !1,
                groupOp: "AND",
                defaultSearch: "bw"
            }, b || {});
            return this.each(function() {
                function d(b, c) {
                    var d = a(b);
                    d[0] && jQuery.each(c, function() {
                        void 0 !==
                            this.data ? d.bind(this.type, this.data, this.fn) : d.bind(this.type, this.fn)
                    })
                }
                var c = this;
                if (!this.ftoolbar) {
                    var e = function() {
                            var d = {},
                                j = 0,
                                g, f, h = {},
                                m;
                            a.each(c.p.colModel, function() {
                                f = this.index || this.name;
                                m = this.searchoptions && this.searchoptions.sopt ? this.searchoptions.sopt[0] : "select" == this.stype ? "eq" : b.defaultSearch;
                                if (g = a("#gs_" + a.jgrid.jqID(this.name), !0 === this.frozen && !0 === c.p.frozenColumns ? c.grid.fhDiv : c.grid.hDiv).val()) d[f] = g, h[f] = m, j++;
                                else try {
                                    delete c.p.postData[f]
                                } catch (e) {}
                            });
                            var e = 0 < j ? !0 :
                                !1;
                            if (!0 === b.stringResult || "local" == c.p.datatype) {
                                var k = '{"groupOp":"' + b.groupOp + '","rules":[',
                                    l = 0;
                                a.each(d, function(a, b) {
                                    0 < l && (k += ",");
                                    k += '{"field":"' + a + '",';
                                    k += '"op":"' + h[a] + '",';
                                    k += '"data":"' + (b + "").replace(/\\/g, "\\\\").replace(/\"/g, '\\"') + '"}';
                                    l++
                                });
                                k += "]}";
                                a.extend(c.p.postData, {
                                    filters: k
                                });
                                a.each(["searchField", "searchString", "searchOper"], function(a, b) {
                                    c.p.postData.hasOwnProperty(b) && delete c.p.postData[b]
                                })
                            } else a.extend(c.p.postData, d);
                            var p;
                            c.p.searchurl && (p = c.p.url, a(c).jqGrid("setGridParam", {
                                url: c.p.searchurl
                            }));
                            var r = "stop" === a(c).triggerHandler("jqGridToolbarBeforeSearch") ? !0 : !1;
                            !r && a.isFunction(b.beforeSearch) && (r = b.beforeSearch.call(c));
                            r || a(c).jqGrid("setGridParam", {
                                search: e
                            }).trigger("reloadGrid", [{
                                page: 1
                            }]);
                            p && a(c).jqGrid("setGridParam", {
                                url: p
                            });
                            a(c).triggerHandler("jqGridToolbarAfterSearch");
                            a.isFunction(b.afterSearch) && b.afterSearch.call(c)
                        },
                        h = a("<tr class='ui-search-toolbar' role='rowheader' data-role='content'></tr>"),
                        g;
                    a.each(c.p.colModel, function() {
                        var i = this,
                            j, q, f, n;
                        q =
                            a("<th role='columnheader' class='ui-th-column ui-th-" + c.p.direction + "'></th>");
                        j = a("<div style='position:relative;height:100%;padding-right:0.3em;padding-top:0.0em;' class='ui-searchdiv'></div>");
                        !0 === this.hidden && a(q).css("display", "none");
                        this.search = !1 === this.search ? !1 : !0;
                        "undefined" == typeof this.stype && (this.stype = "text");
                        f = a.extend({}, this.searchoptions || {});
                        if (this.search) switch (this.stype) {
                            case "select":
                                if (n = this.surl || f.dataUrl) a.ajax(a.extend({
                                    url: n,
                                    dataType: "html",
                                    success: function(c) {
                                        if (f.buildSelect !==
                                            void 0)(c = f.buildSelect(c)) && a(j).append(c);
                                        else a(j).append(c);
                                        f.defaultValue !== void 0 && a("select", j).val(f.defaultValue);
                                        a("select", j).attr({
                                            name: i.index || i.name,
                                            id: "gs_" + i.name
                                        });
                                        f.attr && a("select", j).attr(f.attr);
                                        f.dataInit !== void 0 && f.dataInit(a("select", j)[0]);
                                        f.dataEvents !== void 0 && d(a("select", j)[0], f.dataEvents);
                                        b.autosearch === true && a("select", j).change(function() {
                                            e();
                                            return false
                                        });
                                        c = null
                                    }
                                }, a.jgrid.ajaxOptions, c.p.ajaxSelectOptions || {}));
                                else {
                                    var m, o, k;
                                    i.searchoptions ? (m = void 0 === i.searchoptions.value ?
                                        "" : i.searchoptions.value, o = void 0 === i.searchoptions.separator ? ":" : i.searchoptions.separator, k = void 0 === i.searchoptions.delimiter ? ";" : i.searchoptions.delimiter) : i.editoptions && (m = void 0 === i.editoptions.value ? "" : i.editoptions.value, o = void 0 === i.editoptions.separator ? ":" : i.editoptions.separator, k = void 0 === i.editoptions.delimiter ? ";" : i.editoptions.delimiter);
                                    if (m) {
                                        n = document.createElement("select");
                                        a(n).attr({
                                            name: i.index || i.name,
                                            id: "gs_" + i.name,
                                            "data-inline": "true",
                                            "data-mini": "true"
                                        });
                                        var l;
                                        if ("string" ===
                                            typeof m) {
                                            m = m.split(k);
                                            for (var p = 0; p < m.length; p++) l = m[p].split(o), k = document.createElement("option"), k.value = l[0], k.innerHTML = l[1], n.appendChild(k)
                                        } else if ("object" === typeof m)
                                            for (l in m) m.hasOwnProperty(l) && (k = document.createElement("option"), k.value = l, k.innerHTML = m[l], n.appendChild(k));
                                        void 0 !== f.defaultValue && a(n).val(f.defaultValue);
                                        f.attr && a(n).attr(f.attr);
                                        void 0 !== f.dataInit && f.dataInit(n);
                                        void 0 !== f.dataEvents && d(n, f.dataEvents);
                                        a(j).append(n);
                                        !0 === b.autosearch && a(n).change(function() {
                                            e();
                                            return false
                                        })
                                    }
                                }
                                break;
                            case "text":
                                o = void 0 !== f.defaultValue ? f.defaultValue : "", a(j).append("<input type='text' style='float:right;padding:0.2em;margin-top:0.3em;' name='" + (i.index || i.name) + "' id='gs_" + i.name + "' value='" + o + "'/>"), f.attr && a("input", j).attr(f.attr), void 0 !== f.dataInit && f.dataInit(a("input", j)[0]), void 0 !== f.dataEvents && d(a("input", j)[0], f.dataEvents), !0 === b.autosearch && (b.searchOnEnter ? a("input", j).keypress(function(a) {
                                        if ((a.charCode ? a.charCode : a.keyCode ? a.keyCode : 0) == 13) {
                                            e();
                                            return false
                                        }
                                        return this
                                    }) :
                                    a("input", j).keydown(function(a) {
                                        switch (a.which) {
                                            case 13:
                                                return false;
                                            case 9:
                                            case 16:
                                            case 37:
                                            case 38:
                                            case 39:
                                            case 40:
                                            case 27:
                                                break;
                                            default:
                                                g && clearTimeout(g);
                                                g = setTimeout(function() {
                                                    e()
                                                }, 500)
                                        }
                                    }))
                        }
                        a(q).append(j);
                        a(h).append(q)
                    });
                    a("table thead", c.grid.hDiv).append(h);
                    this.ftoolbar = !0;
                    this.triggerToolbar = e;
                    this.clearToolbar = function(d) {
                        var j = {},
                            g = 0,
                            f, d = "boolean" != typeof d ? !0 : d;
                        a.each(c.p.colModel, function() {
                            var b;
                            this.searchoptions && void 0 !== this.searchoptions.defaultValue && (b = this.searchoptions.defaultValue);
                            f = this.index || this.name;
                            switch (this.stype) {
                                case "select":
                                    a("#gs_" + a.jgrid.jqID(this.name) + " option", !0 === this.frozen && !0 === c.p.frozenColumns ? c.grid.fhDiv : c.grid.hDiv).each(function(c) {
                                        if (c === 0) this.selected = true;
                                        if (a(this).val() == b) {
                                            this.selected = true;
                                            return false
                                        }
                                    });
                                    if (void 0 !== b) j[f] = b, g++;
                                    else try {
                                        delete c.p.postData[f]
                                    } catch (d) {}
                                    break;
                                case "text":
                                    if (a("#gs_" + a.jgrid.jqID(this.name), !0 === this.frozen && !0 === c.p.frozenColumns ? c.grid.fhDiv : c.grid.hDiv).val(b), void 0 !== b) j[f] = b, g++;
                                    else try {
                                        delete c.p.postData[f]
                                    } catch (e) {}
                            }
                        });
                        var h = 0 < g ? !0 : !1;
                        if (!0 === b.stringResult || "local" == c.p.datatype) {
                            var e = '{"groupOp":"' + b.groupOp + '","rules":[',
                                o = 0;
                            a.each(j, function(a, b) {
                                0 < o && (e += ",");
                                e += '{"field":"' + a + '",';
                                e += '"op":"eq",';
                                e += '"data":"' + (b + "").replace(/\\/g, "\\\\").replace(/\"/g, '\\"') + '"}';
                                o++
                            });
                            e += "]}";
                            a.extend(c.p.postData, {
                                filters: e
                            });
                            a.each(["searchField", "searchString", "searchOper"], function(a, b) {
                                c.p.postData.hasOwnProperty(b) && delete c.p.postData[b]
                            })
                        } else a.extend(c.p.postData, j);
                        var k;
                        c.p.searchurl && (k = c.p.url, a(c).jqGrid("setGridParam", {
                            url: c.p.searchurl
                        }));
                        var l = "stop" === a(c).triggerHandler("jqGridToolbarBeforeClear") ? !0 : !1;
                        !l && a.isFunction(b.beforeClear) && (l = b.beforeClear.call(c));
                        l || d && a(c).jqGrid("setGridParam", {
                            search: h
                        }).trigger("reloadGrid", [{
                            page: 1
                        }]);
                        k && a(c).jqGrid("setGridParam", {
                            url: k
                        });
                        a(c).triggerHandler("jqGridToolbarAfterClear");
                        a.isFunction(b.afterClear) && b.afterClear()
                    };
                    this.toggleToolbar = function() {
                        var b = a("tr.ui-search-toolbar", c.grid.hDiv),
                            d = !0 === c.p.frozenColumns ? a("tr.ui-search-toolbar", c.grid.fhDiv) : !1;
                        "none" ==
                        b.css("display") ? (b.show(), d && d.show()) : (b.hide(), d && d.hide())
                    }
                }
            })
        },
        destroyGroupHeader: function(b) {
            "undefined" == typeof b && (b = !0);
            return this.each(function() {
                var d, c, e, h, g, i;
                c = this.grid;
                var j = a("table.ui-jqgrid-htable thead", c.hDiv),
                    q = this.p.colModel;
                if (c) {
                    a(this).unbind(".setGroupHeaders");
                    d = a("<tr>", {
                        role: "rowheader"
                    }).addClass("ui-jqgrid-labels");
                    h = c.headers;
                    c = 0;
                    for (e = h.length; c < e; c++) {
                        g = q[c].hidden ? "none" : "";
                        g = a(h[c].el).width(h[c].width).css("display", g);
                        try {
                            g.removeAttr("rowSpan")
                        } catch (f) {
                            g.attr("rowSpan",
                                1)
                        }
                        d.append(g);
                        i = g.children("span.ui-jqgrid-resize");
                        0 < i.length && (i[0].style.height = "");
                        g.children("div")[0].style.top = ""
                    }
                    a(j).children("tr.ui-jqgrid-labels").remove();
                    a(j).prepend(d);
                    !0 === b && a(this).jqGrid("setGridParam", {
                        groupHeader: null
                    })
                }
            })
        },
        setGroupHeaders: function(b) {
            b = a.extend({
                useColSpanStyle: !1,
                groupHeaders: []
            }, b || {});
            return this.each(function() {
                this.p.groupHeader = b;
                var d, c, e = 0,
                    h, g, i, j, q, f = this.p.colModel,
                    n = f.length,
                    m = this.grid.headers,
                    o = a("table.ui-jqgrid-htable", this.grid.hDiv),
                    k = o.children("thead").children("tr.ui-jqgrid-labels:last").addClass("jqg-second-row-header");
                h = o.children("thead");
                var l = o.find(".jqg-first-row-header");
                void 0 === l[0] ? l = a("<tr>", {
                    role: "row",
                    "aria-hidden": "true"
                }).addClass("jqg-first-row-header").css("height", "auto") : l.empty();
                var p, r = function(a, b) {
                    for (var c = 0, d = b.length; c < d; c++)
                        if (b[c].startColumnName === a) return c;
                    return -1
                };
                a(this).prepend(h);
                h = a("<tr>", {
                    role: "rowheader"
                }).addClass("ui-jqgrid-labels jqg-third-row-header");
                for (d = 0; d < n; d++)
                    if (i = m[d].el, j = a(i), c = f[d], g = {
                            height: "0px",
                            width: m[d].width + "px",
                            display: c.hidden ? "none" : ""
                        }, a("<th>", {
                            role: "gridcell"
                        }).css(g).addClass("ui-first-th-" + this.p.direction).appendTo(l), i.style.width = "", g = r(c.name, b.groupHeaders), 0 <= g) {
                        g = b.groupHeaders[g];
                        e = g.numberOfColumns;
                        q = g.titleText;
                        for (g = c = 0; g < e && d + g < n; g++) f[d + g].hidden || c++;
                        g = a("<th>").attr({
                            role: "columnheader"
                        }).addClass("ui-state-default ui-th-column-header ui-th-" + this.p.direction).css({
                            height: "22px",
                            "border-top": "0px none"
                        }).html(q);
                        0 < c && g.attr("colspan", "" + c);
                        this.p.headertitles && g.attr("title", g.text());
                        0 === c && g.hide();
                        j.before(g);
                        h.append(i);
                        e -= 1
                    } else 0 === e ? b.useColSpanStyle ? j.attr("rowspan", "2") : (a("<th>", {
                        role: "columnheader"
                    }).addClass("ui-state-default ui-th-column-header ui-th-" + this.p.direction).css({
                        display: c.hidden ? "none" : "",
                        "border-top": "0px none"
                    }).insertBefore(j), h.append(i)) : (h.append(i), e--);
                f = a(this).children("thead");
                f.prepend(l);
                h.insertAfter(k);
                o.append(f);
                b.useColSpanStyle && (o.find("span.ui-jqgrid-resize").each(function() {
                        var b = a(this).parent();
                        b.is(":visible") && (this.style.cssText = "height: " + b.height() + "px !important; cursor: col-resize;")
                    }),
                    o.find("div.ui-jqgrid-sortable").each(function() {
                        var b = a(this),
                            c = b.parent();
                        c.is(":visible") && c.is(":has(span.ui-jqgrid-resize)") && b.css("top", (c.height() - b.outerHeight()) / 2 + "px")
                    }));
                p = f.find("tr.jqg-first-row-header");
                a(this).bind("jqGridResizeStop.setGroupHeaders", function(a, b, c) {
                    p.find("th").eq(c).width(b)
                })
            })
        },
        setFrozenColumns: function() {
            return this.each(function() {
                if (this.grid) {
                    var b = this,
                        d = b.p.colModel,
                        c = 0,
                        e = d.length,
                        h = -1,
                        g = !1;
                    if (!(!0 === b.p.subGrid || !0 === b.p.treeGrid || !0 === b.p.cellEdit || b.p.sortable ||
                            b.p.scroll || b.p.grouping)) {
                        b.p.rownumbers && c++;
                        for (b.p.multiselect && c++; c < e;) {
                            if (!0 === d[c].frozen) g = !0, h = c;
                            else break;
                            c++
                        }
                        if (0 <= h && g) {
                            d = b.p.caption ? a(b.grid.cDiv).outerHeight() : 0;
                            c = a(".ui-jqgrid-htable", "#gview_" + a.jgrid.jqID(b.p.id)).height();
                            b.p.toppager && (d += a(b.grid.topDiv).outerHeight());
                            !0 === b.p.toolbar[0] && "bottom" != b.p.toolbar[1] && (d += a(b.grid.uDiv).outerHeight());
                            b.grid.fhDiv = a('<div style="position:absolute;left:0px;top:' + d + "px;height:" + c + 'px;" class="frozen-div ui-state-default ui-jqgrid-hdiv"></div>');
                            b.grid.fbDiv = a('<div style="position:absolute;left:0px;top:' + (parseInt(d, 10) + parseInt(c, 10) + 1) + 'px;overflow-y:hidden" class="frozen-bdiv ui-jqgrid-bdiv"></div>');
                            a("#gview_" + a.jgrid.jqID(b.p.id)).append(b.grid.fhDiv);
                            d = a(".ui-jqgrid-htable", "#gview_" + a.jgrid.jqID(b.p.id)).clone(!0);
                            if (b.p.groupHeader) {
                                a("tr.jqg-first-row-header, tr.jqg-third-row-header", d).each(function() {
                                    a("th:gt(" + h + ")", this).remove()
                                });
                                var i = -1,
                                    j = -1;
                                a("tr.jqg-second-row-header th", d).each(function() {
                                    var b = parseInt(a(this).attr("colspan"),
                                        10);
                                    b && (i += b, j++);
                                    if (i === h) return !1
                                });
                                i !== h && (j = h);
                                a("tr.jqg-second-row-header", d).each(function() {
                                    a("th:gt(" + j + ")", this).remove()
                                })
                            } else a("tr", d).each(function() {
                                a("th:gt(" + h + ")", this).remove()
                            });
                            a(d).width(1);
                            a(b.grid.fhDiv).append(d).mousemove(function(a) {
                                if (b.grid.resizing) return b.grid.dragMove(a), !1
                            });
                            a(b).bind("jqGridResizeStop.setFrozenColumns", function(c, d, e) {
                                c = a(".ui-jqgrid-htable", b.grid.fhDiv);
                                a("th:eq(" + e + ")", c).width(d);
                                c = a(".ui-jqgrid-btable", b.grid.fbDiv);
                                a("tr:first td:eq(" + e + ")",
                                    c).width(d)
                            });
                            a(b).bind("jqGridOnSortCol.setFrozenColumns", function(c, d) {
                                var e = a("tr.ui-jqgrid-labels:last th:eq(" + b.p.lastsort + ")", b.grid.fhDiv),
                                    g = a("tr.ui-jqgrid-labels:last th:eq(" + d + ")", b.grid.fhDiv);
                                a("span.ui-grid-ico-sort", e).addClass("ui-state-disabled");
                                a(e).attr("aria-selected", "false");
                                a("span.ui-icon-" + b.p.sortorder, g).removeClass("ui-state-disabled");
                                a(g).attr("aria-selected", "true");
                                !b.p.viewsortcols[0] && b.p.lastsort != d && (a("span.s-ico", e).hide(), a("span.s-ico", g).show())
                            });
                            a("#gview_" +
                                a.jgrid.jqID(b.p.id)).append(b.grid.fbDiv);
                            jQuery(b.grid.bDiv).scroll(function() {
                                jQuery(b.grid.fbDiv).scrollTop(jQuery(this).scrollTop())
                            });
                            !0 === b.p.hoverrows && a("#" + a.jgrid.jqID(b.p.id)).unbind("mouseover").unbind("mouseout");
                            a(b).bind("jqGridAfterGridComplete.setFrozenColumns", function() {
                                a("#" + a.jgrid.jqID(b.p.id) + "_frozen").remove();
                                jQuery(b.grid.fbDiv).height(jQuery(b.grid.bDiv).height() - 16);
                                var c = a("#" + a.jgrid.jqID(b.p.id)).clone(!0);
                                a("tr", c).each(function() {
                                    a("td:gt(" + h + ")", this).remove()
                                });
                                a(c).width(1).attr("id", b.p.id + "_frozen");
                                a(b.grid.fbDiv).append(c);
                                !0 === b.p.hoverrows && (a("tr.jqgrow", c).hover(function() {
                                    a(this).addClass("ui-state-hover");
                                    a("#" + a.jgrid.jqID(this.id), "#" + a.jgrid.jqID(b.p.id)).addClass("ui-state-hover")
                                }, function() {
                                    a(this).removeClass("ui-state-hover");
                                    a("#" + a.jgrid.jqID(this.id), "#" + a.jgrid.jqID(b.p.id)).removeClass("ui-state-hover")
                                }), a("tr.jqgrow", "#" + a.jgrid.jqID(b.p.id)).hover(function() {
                                    a(this).addClass("ui-state-hover");
                                    a("#" + a.jgrid.jqID(this.id), "#" + a.jgrid.jqID(b.p.id) +
                                        "_frozen").addClass("ui-state-hover")
                                }, function() {
                                    a(this).removeClass("ui-state-hover");
                                    a("#" + a.jgrid.jqID(this.id), "#" + a.jgrid.jqID(b.p.id) + "_frozen").removeClass("ui-state-hover")
                                }));
                                c = null
                            });
                            b.p.frozenColumns = !0
                        }
                    }
                }
            })
        },
        destroyFrozenColumns: function() {
            return this.each(function() {
                if (this.grid && !0 === this.p.frozenColumns) {
                    a(this.grid.fhDiv).remove();
                    a(this.grid.fbDiv).remove();
                    this.grid.fhDiv = null;
                    this.grid.fbDiv = null;
                    a(this).unbind(".setFrozenColumns");
                    if (!0 === this.p.hoverrows) {
                        var b;
                        a("#" + a.jgrid.jqID(this.p.id)).bind("mouseover",
                            function(d) {
                                b = a(d.target).closest("tr.jqgrow");
                                "ui-subgrid" !== a(b).attr("class") && a(b).addClass("ui-state-hover")
                            }).bind("mouseout", function(d) {
                            b = a(d.target).closest("tr.jqgrow");
                            a(b).removeClass("ui-state-hover")
                        })
                    }
                    this.p.frozenColumns = !1
                }
            })
        }
    })
})(jQuery);
(function(b) {
    b.fmatter = {};
    b.extend(b.fmatter, {
        isBoolean: function(a) {
            return "boolean" === typeof a
        },
        isObject: function(a) {
            return a && ("object" === typeof a || b.isFunction(a)) || !1
        },
        isString: function(a) {
            return "string" === typeof a
        },
        isNumber: function(a) {
            return "number" === typeof a && isFinite(a)
        },
        isNull: function(a) {
            return null === a
        },
        isUndefined: function(a) {
            return "undefined" === typeof a
        },
        isValue: function(a) {
            return this.isObject(a) || this.isString(a) || this.isNumber(a) || this.isBoolean(a)
        },
        isEmpty: function(a) {
            if (!this.isString(a) &&
                this.isValue(a)) return !1;
            if (!this.isValue(a)) return !0;
            a = b.trim(a).replace(/\&nbsp\;/ig, "").replace(/\&#160\;/ig, "");
            return "" === a
        }
    });
    b.fn.fmatter = function(a, c, d, e, f) {
        var g = c,
            d = b.extend({}, b.jgrid.formatter, d);
        try {
            g = b.fn.fmatter[a].call(this, c, d, e, f)
        } catch (h) {}
        return g
    };
    b.fmatter.util = {
        NumberFormat: function(a, c) {
            b.fmatter.isNumber(a) || (a *= 1);
            if (b.fmatter.isNumber(a)) {
                var d = 0 > a,
                    e = a + "",
                    f = c.decimalSeparator ? c.decimalSeparator : ".",
                    g;
                if (b.fmatter.isNumber(c.decimalPlaces)) {
                    var h = c.decimalPlaces,
                        e = Math.pow(10,
                            h),
                        e = Math.round(a * e) / e + "";
                    g = e.lastIndexOf(".");
                    if (0 < h) {
                        0 > g ? (e += f, g = e.length - 1) : "." !== f && (e = e.replace(".", f));
                        for (; e.length - 1 - g < h;) e += "0"
                    }
                }
                if (c.thousandsSeparator) {
                    h = c.thousandsSeparator;
                    g = e.lastIndexOf(f);
                    g = -1 < g ? g : e.length;
                    for (var f = e.substring(g), i = -1, j = g; 0 < j; j--) {
                        i++;
                        if (0 === i % 3 && j !== g && (!d || 1 < j)) f = h + f;
                        f = e.charAt(j - 1) + f
                    }
                    e = f
                }
                e = c.prefix ? c.prefix + e : e;
                return e = c.suffix ? e + c.suffix : e
            }
            return a
        },
        DateFormat: function(a, c, d, e) {
            var f = /^\/Date\((([-+])?[0-9]+)(([-+])([0-9]{2})([0-9]{2}))?\)\/$/,
                g = "string" ===
                typeof c ? c.match(f) : null,
                f = function(a, b) {
                    a = "" + a;
                    for (b = parseInt(b, 10) || 2; a.length < b;) a = "0" + a;
                    return a
                },
                h = {
                    m: 1,
                    d: 1,
                    y: 1970,
                    h: 0,
                    i: 0,
                    s: 0,
                    u: 0
                },
                i = 0,
                j, k = ["i18n"];
            k.i18n = {
                dayNames: e.dayNames,
                monthNames: e.monthNames
            };
            a in e.masks && (a = e.masks[a]);
            if (!isNaN(c - 0) && "u" == ("" + a).toLowerCase()) i = new Date(1E3 * parseFloat(c));
            else if (c.constructor === Date) i = c;
            else if (null !== g) i = new Date(parseInt(g[1], 10)), g[3] && (a = 60 * Number(g[5]) + Number(g[6]), a *= "-" == g[4] ? 1 : -1, a -= i.getTimezoneOffset(), i.setTime(Number(Number(i) + 6E4 * a)));
            else {
                c = ("" + c).split(/[\\\/:_;.,\t\s-]/);
                a = a.split(/[\\\/:_;.,\t\s-]/);
                g = 0;
                for (j = a.length; g < j; g++) "M" == a[g] && (i = b.inArray(c[g], k.i18n.monthNames), -1 !== i && 12 > i && (c[g] = i + 1)), "F" == a[g] && (i = b.inArray(c[g], k.i18n.monthNames), -1 !== i && 11 < i && (c[g] = i + 1 - 12)), c[g] && (h[a[g].toLowerCase()] = parseInt(c[g], 10));
                h.f && (h.m = h.f);
                if (0 === h.m && 0 === h.y && 0 === h.d) return "&#160;";
                h.m = parseInt(h.m, 10) - 1;
                i = h.y;
                70 <= i && 99 >= i ? h.y = 1900 + h.y : 0 <= i && 69 >= i && (h.y = 2E3 + h.y);
                i = new Date(h.y, h.m, h.d, h.h, h.i, h.s, h.u)
            }
            d in e.masks ? d = e.masks[d] :
                d || (d = "Y-m-d");
            a = i.getHours();
            c = i.getMinutes();
            h = i.getDate();
            g = i.getMonth() + 1;
            j = i.getTimezoneOffset();
            var l = i.getSeconds(),
                r = i.getMilliseconds(),
                n = i.getDay(),
                m = i.getFullYear(),
                o = (n + 6) % 7 + 1,
                p = (new Date(m, g - 1, h) - new Date(m, 0, 1)) / 864E5,
                q = {
                    d: f(h),
                    D: k.i18n.dayNames[n],
                    j: h,
                    l: k.i18n.dayNames[n + 7],
                    N: o,
                    S: e.S(h),
                    w: n,
                    z: p,
                    W: 5 > o ? Math.floor((p + o - 1) / 7) + 1 : Math.floor((p + o - 1) / 7) || (4 > ((new Date(m - 1, 0, 1)).getDay() + 6) % 7 ? 53 : 52),
                    F: k.i18n.monthNames[g - 1 + 12],
                    m: f(g),
                    M: k.i18n.monthNames[g - 1],
                    n: g,
                    t: "?",
                    L: "?",
                    o: "?",
                    Y: m,
                    y: ("" +
                        m).substring(2),
                    a: 12 > a ? e.AmPm[0] : e.AmPm[1],
                    A: 12 > a ? e.AmPm[2] : e.AmPm[3],
                    B: "?",
                    g: a % 12 || 12,
                    G: a,
                    h: f(a % 12 || 12),
                    H: f(a),
                    i: f(c),
                    s: f(l),
                    u: r,
                    e: "?",
                    I: "?",
                    O: (0 < j ? "-" : "+") + f(100 * Math.floor(Math.abs(j) / 60) + Math.abs(j) % 60, 4),
                    P: "?",
                    T: (("" + i).match(/\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g) || [""]).pop().replace(/[^-+\dA-Z]/g, ""),
                    Z: "?",
                    c: "?",
                    r: "?",
                    U: Math.floor(i / 1E3)
                };
            return d.replace(/\\.|[dDjlNSwzWFmMntLoYyaABgGhHisueIOPTZcrU]/g,
                function(a) {
                    return a in q ? q[a] : a.substring(1)
                })
        }
    };
    b.fn.fmatter.defaultFormat = function(a, c) {
        return b.fmatter.isValue(a) && "" !== a ? a : c.defaultValue ? c.defaultValue : "&#160;"
    };
    b.fn.fmatter.email = function(a, c) {
        return b.fmatter.isEmpty(a) ? b.fn.fmatter.defaultFormat(a, c) : '<a href="mailto:' + a + '">' + a + "</a>"
    };
    b.fn.fmatter.checkbox = function(a, c) {
        var d = b.extend({}, c.checkbox),
            e;
        void 0 !== c.colModel && !b.fmatter.isUndefined(c.colModel.formatoptions) && (d = b.extend({}, d, c.colModel.formatoptions));
        e = !0 === d.disabled ? 'disabled="disabled"' :
            "";
        if (b.fmatter.isEmpty(a) || b.fmatter.isUndefined(a)) a = b.fn.fmatter.defaultFormat(a, d);
        a = (a + "").toLowerCase();
        d = 0 > a.search(/(false|0|no|off)/i) ? " checked='checked' " : "";
        return '<input data-role="none"  id="jqgridcheck' + Math.floor(11 * Math.random()) + '" type="checkbox" ' + d + ' value="' + a + '" offval="no" ' + e + "/>"
    };
    b.fn.fmatter.link = function(a, c) {
        var d = {
                target: c.target
            },
            e = "";
        void 0 !== c.colModel && !b.fmatter.isUndefined(c.colModel.formatoptions) && (d = b.extend({}, d, c.colModel.formatoptions));
        d.target && (e = "target=" +
            d.target);
        return !b.fmatter.isEmpty(a) ? "<a " + e + ' href="' + a + '">' + a + "</a>" : b.fn.fmatter.defaultFormat(a, c)
    };
    b.fn.fmatter.showlink = function(a, c) {
        var d = {
                baseLinkUrl: c.baseLinkUrl,
                showAction: c.showAction,
                addParam: c.addParam || "",
                target: c.target,
                idName: c.idName
            },
            e = "";
        void 0 !== c.colModel && !b.fmatter.isUndefined(c.colModel.formatoptions) && (d = b.extend({}, d, c.colModel.formatoptions));
        d.target && (e = "target=" + d.target);
        d = d.baseLinkUrl + d.showAction + "?" + d.idName + "=" + c.rowId + d.addParam;
        return b.fmatter.isString(a) ||
            b.fmatter.isNumber(a) ? "<a " + e + ' href="' + d + '">' + a + "</a>" : b.fn.fmatter.defaultFormat(a, c)
    };
    b.fn.fmatter.integer = function(a, c) {
        var d = b.extend({}, c.integer);
        void 0 !== c.colModel && !b.fmatter.isUndefined(c.colModel.formatoptions) && (d = b.extend({}, d, c.colModel.formatoptions));
        return b.fmatter.isEmpty(a) ? d.defaultValue : b.fmatter.util.NumberFormat(a, d)
    };
    b.fn.fmatter.number = function(a, c) {
        var d = b.extend({}, c.number);
        void 0 !== c.colModel && !b.fmatter.isUndefined(c.colModel.formatoptions) && (d = b.extend({}, d, c.colModel.formatoptions));
        return b.fmatter.isEmpty(a) ? d.defaultValue : b.fmatter.util.NumberFormat(a, d)
    };
    b.fn.fmatter.currency = function(a, c) {
        var d = b.extend({}, c.currency);
        void 0 !== c.colModel && !b.fmatter.isUndefined(c.colModel.formatoptions) && (d = b.extend({}, d, c.colModel.formatoptions));
        return b.fmatter.isEmpty(a) ? d.defaultValue : b.fmatter.util.NumberFormat(a, d)
    };
    b.fn.fmatter.date = function(a, c, d, e) {
        d = b.extend({}, c.date);
        void 0 !== c.colModel && !b.fmatter.isUndefined(c.colModel.formatoptions) && (d = b.extend({}, d, c.colModel.formatoptions));
        return !d.reformatAfterEdit && "edit" == e || b.fmatter.isEmpty(a) ? b.fn.fmatter.defaultFormat(a, c) : b.fmatter.util.DateFormat(d.srcformat, a, d.newformat, d)
    };
    b.fn.fmatter.select = function(a, c) {
        var a = a + "",
            d = !1,
            e = [],
            f, g;
        b.fmatter.isUndefined(c.colModel.formatoptions) ? b.fmatter.isUndefined(c.colModel.editoptions) || (d = c.colModel.editoptions.value, f = void 0 === c.colModel.editoptions.separator ? ":" : c.colModel.editoptions.separator, g = void 0 === c.colModel.editoptions.delimiter ? ";" : c.colModel.editoptions.delimiter) : (d = c.colModel.formatoptions.value,
            f = void 0 === c.colModel.formatoptions.separator ? ":" : c.colModel.formatoptions.separator, g = void 0 === c.colModel.formatoptions.delimiter ? ";" : c.colModel.formatoptions.delimiter);
        if (d) {
            var h = !0 === c.colModel.editoptions.multiple ? !0 : !1,
                i = [];
            h && (i = a.split(","), i = b.map(i, function(a) {
                return b.trim(a)
            }));
            if (b.fmatter.isString(d))
                for (var j = d.split(g), k = 0, l = 0; l < j.length; l++)
                    if (g = j[l].split(f), 2 < g.length && (g[1] = b.map(g, function(a, b) {
                            if (b > 0) return a
                        }).join(f)), h) - 1 < b.inArray(g[0], i) && (e[k] = g[1], k++);
                    else {
                        if (b.trim(g[0]) ==
                            b.trim(a)) {
                            e[0] = g[1];
                            break
                        }
                    } else b.fmatter.isObject(d) && (h ? e = b.map(i, function(a) {
                return d[a]
            }) : e[0] = d[a] || "")
        }
        a = e.join(", ");
        return "" === a ? b.fn.fmatter.defaultFormat(a, c) : a
    };
    b.fn.fmatter.rowactions = function(a, c, d, e) {
        var f = {
                keys: !1,
                onEdit: null,
                onSuccess: null,
                afterSave: null,
                onError: null,
                afterRestore: null,
                extraparam: {},
                url: null,
                restoreAfterError: !0,
                mtype: "POST",
                delOptions: {},
                editOptions: {}
            },
            a = b.jgrid.jqID(a),
            c = b.jgrid.jqID(c),
            e = b("#" + c)[0].p.colModel[e];
        b.fmatter.isUndefined(e.formatoptions) || (f = b.extend(f,
            e.formatoptions));
        b.fmatter.isUndefined(b("#" + c)[0].p.editOptions) || (f.editOptions = b("#" + c)[0].p.editOptions);
        b.fmatter.isUndefined(b("#" + c)[0].p.delOptions) || (f.delOptions = b("#" + c)[0].p.delOptions);
        var g = b("#" + c)[0],
            e = function(d) {
                b.isFunction(f.afterRestore) && f.afterRestore.call(g, d);
                b("tr#" + a + " div.ui-inline-edit, tr#" + a + " div.ui-inline-del", "#" + c + ".ui-jqgrid-btable:first").show();
                b("tr#" + a + " div.ui-inline-save, tr#" + a + " div.ui-inline-cancel", "#" + c + ".ui-jqgrid-btable:first").hide()
            };
        if (b("#" + a,
                "#" + c).hasClass("jqgrid-new-row")) {
            var h = g.p.prmNames;
            f.extraparam[h.oper] = h.addoper
        }
        h = {
            keys: f.keys,
            oneditfunc: f.onEdit,
            successfunc: f.onSuccess,
            url: f.url,
            extraparam: f.extraparam,
            aftersavefunc: function(d, e) {
                b.isFunction(f.afterSave) && f.afterSave.call(g, d, e);
                b("tr#" + a + " div.ui-inline-edit, tr#" + a + " div.ui-inline-del", "#" + c + ".ui-jqgrid-btable:first").show();
                b("tr#" + a + " div.ui-inline-save, tr#" + a + " div.ui-inline-cancel", "#" + c + ".ui-jqgrid-btable:first").hide()
            },
            errorfunc: f.onError,
            afterrestorefunc: e,
            restoreAfterError: f.restoreAfterError,
            mtype: f.mtype
        };
        switch (d) {
            case "edit":
                b("#" + c).jqGrid("editRow", a, h);
                b("tr#" + a + " div.ui-inline-edit, tr#" + a + " div.ui-inline-del", "#" + c + ".ui-jqgrid-btable:first").hide();
                b("tr#" + a + " div.ui-inline-save, tr#" + a + " div.ui-inline-cancel", "#" + c + ".ui-jqgrid-btable:first").show();
                b(g).triggerHandler("jqGridAfterGridComplete");
                break;
            case "save":
                b("#" + c).jqGrid("saveRow", a, h) && (b("tr#" + a + " div.ui-inline-edit, tr#" + a + " div.ui-inline-del", "#" + c + ".ui-jqgrid-btable:first").show(), b("tr#" + a + " div.ui-inline-save, tr#" +
                    a + " div.ui-inline-cancel", "#" + c + ".ui-jqgrid-btable:first").hide(), b(g).triggerHandler("jqGridAfterGridComplete"));
                break;
            case "cancel":
                b("#" + c).jqGrid("restoreRow", a, e);
                b("tr#" + a + " div.ui-inline-edit, tr#" + a + " div.ui-inline-del", "#" + c + ".ui-jqgrid-btable:first").show();
                b("tr#" + a + " div.ui-inline-save, tr#" + a + " div.ui-inline-cancel", "#" + c + ".ui-jqgrid-btable:first").hide();
                b(g).triggerHandler("jqGridAfterGridComplete");
                break;
            case "del":
                b("#" + c).jqGrid("delGridRow", a, f.delOptions);
                break;
            case "formedit":
                b("#" +
                    c).jqGrid("setSelection", a), b("#" + c).jqGrid("editGridRow", a, f.editOptions)
        }
    };
    b.fn.fmatter.actions = function(a, c) {
        var d = {
            keys: !1,
            editbutton: !0,
            delbutton: !0,
            editformbutton: !1
        };
        b.fmatter.isUndefined(c.colModel.formatoptions) || (d = b.extend(d, c.colModel.formatoptions));
        var e = c.rowId,
            f = "",
            g;
        if ("undefined" == typeof e || b.fmatter.isEmpty(e)) return "";
        d.editformbutton ? (g = "onclick=jQuery.fn.fmatter.rowactions('" + e + "','" + c.gid + "','formedit'," + c.pos + "); onmouseover=jQuery(this).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-hover'); ",
            f = f + "<div title='" + b.jgrid.nav.edittitle + "' style='float:left;cursor:pointer;' class='ui-pg-div ui-inline-edit' " + g + "><span class='ui-icon ui-icon-pencil'></span></div>") : d.editbutton && (g = "onclick=jQuery.fn.fmatter.rowactions('" + e + "','" + c.gid + "','edit'," + c.pos + "); onmouseover=jQuery(this).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-hover') ", f = f + "<div title='" + b.jgrid.nav.edittitle + "' style='float:left;cursor:pointer;' class='ui-pg-div ui-inline-edit' " + g + "><span class='ui-icon ui-icon-pencil'></span></div>");
        d.delbutton && (g = "onclick=jQuery.fn.fmatter.rowactions('" + e + "','" + c.gid + "','del'," + c.pos + "); onmouseover=jQuery(this).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-hover'); ", f = f + "<div title='" + b.jgrid.nav.deltitle + "' style='float:left;margin-left:5px;' class='ui-pg-div ui-inline-del' " + g + "><span class='ui-icon ui-icon-trash'></span></div>");
        g = "onclick=jQuery.fn.fmatter.rowactions('" + e + "','" + c.gid + "','save'," + c.pos + "); onmouseover=jQuery(this).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-hover'); ";
        f = f + "<div title='" + b.jgrid.edit.bSubmit + "' style='float:left;display:none' class='ui-pg-div ui-inline-save' " + g + "><span class='ui-icon ui-icon-disk'></span></div>";
        g = "onclick=jQuery.fn.fmatter.rowactions('" + e + "','" + c.gid + "','cancel'," + c.pos + "); onmouseover=jQuery(this).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-hover'); ";
        f = f + "<div title='" + b.jgrid.edit.bCancel + "' style='float:left;display:none;margin-left:5px;' class='ui-pg-div ui-inline-cancel' " + g + "><span class='ui-icon ui-icon-cancel'></span></div>";
        return "<div style='margin-left:8px;'>" + f + "</div>"
    };
    b.unformat = function(a, c, d, e) {
        var f, g = c.colModel.formatter,
            h = c.colModel.formatoptions || {},
            i = /([\.\*\_\'\(\)\{\}\+\?\\])/g,
            j = c.colModel.unformat || b.fn.fmatter[g] && b.fn.fmatter[g].unformat;
        if ("undefined" !== typeof j && b.isFunction(j)) f = j.call(this, b(a).text(), c, a);
        else if (!b.fmatter.isUndefined(g) && b.fmatter.isString(g)) switch (f = b.jgrid.formatter || {}, g) {
            case "integer":
                h = b.extend({}, f.integer, h);
                c = h.thousandsSeparator.replace(i, "\\$1");
                f = b(a).text().replace(RegExp(c,
                    "g"), "");
                break;
            case "number":
                h = b.extend({}, f.number, h);
                c = h.thousandsSeparator.replace(i, "\\$1");
                f = b(a).text().replace(RegExp(c, "g"), "").replace(h.decimalSeparator, ".");
                break;
            case "currency":
                h = b.extend({}, f.currency, h);
                c = h.thousandsSeparator.replace(i, "\\$1");
                c = RegExp(c, "g");
                f = b(a).text();
                h.prefix && h.prefix.length && (f = f.substr(h.prefix.length));
                h.suffix && h.suffix.length && (f = f.substr(0, f.length - h.suffix.length));
                f = f.replace(c, "").replace(h.decimalSeparator, ".");
                break;
            case "checkbox":
                h = c.colModel.editoptions ?
                    c.colModel.editoptions.value.split(":") : ["Yes", "No"];
                f = b("input", a).is(":checked") ? h[0] : h[1];
                break;
            case "select":
                f = b.unformat.select(a, c, d, e);
                break;
            case "actions":
                return "";
            default:
                f = b(a).text()
        }
        return void 0 !== f ? f : !0 === e ? b(a).text() : b.jgrid.htmlDecode(b(a).html())
    };
    b.unformat.select = function(a, c, d, e) {
        d = [];
        a = b(a).text();
        if (!0 === e) return a;
        var e = b.extend({}, !b.fmatter.isUndefined(c.colModel.formatoptions) ? c.colModel.formatoptions : c.colModel.editoptions),
            c = void 0 === e.separator ? ":" : e.separator,
            f = void 0 ===
            e.delimiter ? ";" : e.delimiter;
        if (e.value) {
            var g = e.value,
                e = !0 === e.multiple ? !0 : !1,
                h = [];
            e && (h = a.split(","), h = b.map(h, function(a) {
                return b.trim(a)
            }));
            if (b.fmatter.isString(g))
                for (var i = g.split(f), j = 0, k = 0; k < i.length; k++)
                    if (f = i[k].split(c), 2 < f.length && (f[1] = b.map(f, function(a, b) {
                            if (b > 0) return a
                        }).join(c)), e) - 1 < b.inArray(f[1], h) && (d[j] = f[0], j++);
                    else {
                        if (b.trim(f[1]) == b.trim(a)) {
                            d[0] = f[0];
                            break
                        }
                    } else if (b.fmatter.isObject(g) || b.isArray(g)) e || (h[0] = a), d = b.map(h, function(a) {
                var c;
                b.each(g, function(b, d) {
                    if (d ==
                        a) {
                        c = b;
                        return false
                    }
                });
                if (typeof c != "undefined") return c
            });
            return d.join(", ")
        }
        return a || ""
    };
    b.unformat.date = function(a, c) {
        var d = b.jgrid.formatter.date || {};
        b.fmatter.isUndefined(c.formatoptions) || (d = b.extend({}, d, c.formatoptions));
        return !b.fmatter.isEmpty(a) ? b.fmatter.util.DateFormat(d.newformat, a, d.srcformat, d) : b.fn.fmatter.defaultFormat(a, c)
    }
})(jQuery);
(function(a) {
    a.extend(a.jgrid, {
        showModal: function(a) {
            a.w.show()
        },
        closeModal: function(a) {
            a.w.hide().attr("aria-hidden", "true");
            a.o && a.o.remove()
        },
        hideModal: function(d, b) {
            b = a.extend({
                jqm: !0,
                gb: ""
            }, b || {});
            if (b.onClose) {
                var c = b.gb && "string" === typeof b.gb && "#gbox_" === b.gb.substr(0, 6) ? b.onClose.call(a("#" + b.gb.substr(6))[0], d) : b.onClose(d);
                if ("boolean" === typeof c && !c) return
            }
            if (a.fn.jqm && !0 === b.jqm) a(d).attr("aria-hidden", "true").jqmHide();
            else {
                if ("" !== b.gb) try {
                    a(".jqgrid-overlay:first", b.gb).hide()
                } catch (e) {}
                a(d).hide().attr("aria-hidden",
                    "true")
            }
        },
        findPos: function(a) {
            var b = 0,
                c = 0;
            if (a.offsetParent) {
                do b += a.offsetLeft, c += a.offsetTop; while (a = a.offsetParent)
            }
            return [b, c]
        },
        createModal: function(d, b, c, e, g, h, f) {
            var c = a.extend(!0, {}, a.jgrid.jqModal || {}, c),
                i = document.createElement("div"),
                j, n = this,
                f = a.extend({}, f || {});
            j = "rtl" == a(c.gbox).attr("dir") ? !0 : !1;
            i.className = "ui-widget ui-widget-content ui-corner-all ui-jqdialog";
            i.id = d.themodal;
            var k = document.createElement("div");
            k.className = "ui-jqdialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix";
            k.id = d.modalhead;
            a(k).append("<span class='ui-jqdialog-title'>" + c.caption + "</span>");
            var l = a("<a href='javascript:void(0)' class='ui-jqdialog-titlebar-close ui-corner-all'></a>").hover(function() {
                l.addClass("ui-state-hover")
            }, function() {
                l.removeClass("ui-state-hover")
            }).append("<span class='ui-icon ui-icon-closethick'></span>");
            a(k).append(l);
            j ? (i.dir = "rtl", a(".ui-jqdialog-title", k).css("float", "right"), a(".ui-jqdialog-titlebar-close", k).css("left", "0.3em")) : (i.dir = "ltr", a(".ui-jqdialog-title", k).css("float",
                "left"), a(".ui-jqdialog-titlebar-close", k).css("right", "0.3em"));
            var m = document.createElement("div");
            a(m).addClass("ui-jqdialog-content ui-widget-content").attr("id", d.modalcontent);
            a(m).append(b);
            i.appendChild(m);
            a(i).prepend(k);
            !0 === h ? a("body").append(i) : "string" === typeof h ? a(h).append(i) : a(i).insertBefore(e);
            a(i).css(f);
            void 0 === c.jqModal && (c.jqModal = !0);
            b = {};
            if (a.fn.jqm && !0 === c.jqModal) 0 === c.left && 0 === c.top && c.overlay && (f = [], f = a.jgrid.findPos(g), c.left = f[0] + 4, c.top = f[1] + 4), b.top = c.top + "px", b.left =
                c.left;
            else if (0 !== c.left || 0 !== c.top) b.left = c.left, b.top = c.top + "px";
            a("a.ui-jqdialog-titlebar-close", k).click(function() {
                var b = a("#" + a.jgrid.jqID(d.themodal)).data("onClose") || c.onClose,
                    e = a("#" + a.jgrid.jqID(d.themodal)).data("gbox") || c.gbox;
                n.hideModal("#" + a.jgrid.jqID(d.themodal), {
                    gb: e,
                    jqm: c.jqModal,
                    onClose: b
                });
                return false
            });
            if (0 === c.width || !c.width) c.width = 300;
            if (0 === c.height || !c.height) c.height = 200;
            c.zIndex || (e = a(e).parents("*[role=dialog]").filter(":first").css("z-index"), c.zIndex = e ? parseInt(e,
                10) + 2 : 950);
            e = 0;
            j && b.left && !h && (e = a(c.gbox).width() - (!isNaN(c.width) ? parseInt(c.width, 10) : 0) - 8, b.left = parseInt(b.left, 10) + parseInt(e, 10));
            b.left && (b.left += "px");
            a(i).css(a.extend({
                width: isNaN(c.width) ? "auto" : c.width + "px",
                height: isNaN(c.height) ? "auto" : c.height + "px",
                zIndex: c.zIndex,
                overflow: "hidden"
            }, b)).attr({
                tabIndex: "-1",
                role: "dialog",
                "aria-labelledby": d.modalhead,
                "aria-hidden": "true"
            });
            void 0 === c.drag && (c.drag = !0);
            void 0 === c.resize && (c.resize = !0);
            if (c.drag)
                if (a(k).css("cursor", "move"), a.fn.jqDrag) a(i).jqDrag(k);
                else try {
                    a(i).draggable({
                        handle: a("#" + a.jgrid.jqID(k.id))
                    })
                } catch (o) {}
                if (c.resize)
                    if (a.fn.jqResize) a(i).append("<div class='jqResize ui-resizable-handle ui-resizable-se ui-icon ui-icon-gripsmall-diagonal-se'></div>"), a("#" + a.jgrid.jqID(d.themodal)).jqResize(".jqResize", d.scrollelm ? "#" + a.jgrid.jqID(d.scrollelm) : !1);
                    else try {
                        a(i).resizable({
                            handles: "se, sw",
                            alsoResize: d.scrollelm ? "#" + a.jgrid.jqID(d.scrollelm) : !1
                        })
                    } catch (p) {}!0 === c.closeOnEscape && a(i).keydown(function(b) {
                        if (b.which == 27) {
                            b = a("#" + a.jgrid.jqID(d.themodal)).data("onClose") ||
                                c.onClose;
                            n.hideModal("#" + a.jgrid.jqID(d.themodal), {
                                gb: c.gbox,
                                jqm: c.jqModal,
                                onClose: b
                            })
                        }
                    })
        },
        viewModal: function(d, b) {
            b = a.extend({
                toTop: !0,
                overlay: 10,
                modal: !1,
                overlayClass: "ui-widget-overlay",
                onShow: a.jgrid.showModal,
                onHide: a.jgrid.closeModal,
                gbox: "",
                jqm: !0,
                jqM: !0
            }, b || {});
            if (a.fn.jqm && !0 === b.jqm) b.jqM ? a(d).attr("aria-hidden", "false").jqm(b).jqmShow() : a(d).attr("aria-hidden", "false").jqmShow();
            else {
                "" !== b.gbox && (a(".jqgrid-overlay:first", b.gbox).show(), a(d).data("gbox", b.gbox));
                a(d).show().attr("aria-hidden",
                    "false");
                try {
                    a(":input:visible", d)[0].focus()
                } catch (c) {}
            }
        },
        info_dialog: function(d, b, c, e) {
            var g = {
                width: 290,
                height: "auto",
                dataheight: "auto",
                drag: !0,
                resize: !1,
                left: 250,
                top: 170,
                zIndex: 1E3,
                jqModal: !0,
                modal: !1,
                closeOnEscape: !0,
                align: "center",
                buttonalign: "center",
                buttons: []
            };
            a.extend(!0, g, a.jgrid.jqModal || {}, {
                caption: "<b>" + d + "</b>"
            }, e || {});
            var h = g.jqModal,
                f = this;
            a.fn.jqm && !h && (h = !1);
            d = "";
            if (0 < g.buttons.length)
                for (e = 0; e < g.buttons.length; e++) void 0 === g.buttons[e].id && (g.buttons[e].id = "info_button_" + e), d +=
                    "<a href='javascript:void(0)' id='" + g.buttons[e].id + "' class='fm-button ui-state-default ui-corner-all'>" + g.buttons[e].text + "</a>";
            e = isNaN(g.dataheight) ? g.dataheight : g.dataheight + "px";
            b = "<div id='info_id'>" + ("<div id='infocnt' style='margin:0px;padding-bottom:1em;width:100%;overflow:auto;position:relative;height:" + e + ";" + ("text-align:" + g.align + ";") + "'>" + b + "</div>");
            b += c ? "<div class='ui-widget-content ui-helper-clearfix' style='text-align:" + g.buttonalign + ";padding-bottom:0.8em;padding-top:0.5em;background-image: none;border-width: 1px 0 0 0;'><a href='javascript:void(0)' id='closedialog' class='fm-button ui-state-default ui-corner-all'>" +
                c + "</a>" + d + "</div>" : "" !== d ? "<div class='ui-widget-content ui-helper-clearfix' style='text-align:" + g.buttonalign + ";padding-bottom:0.8em;padding-top:0.5em;background-image: none;border-width: 1px 0 0 0;'>" + d + "</div>" : "";
            b += "</div>";
            try {
                "false" == a("#info_dialog").attr("aria-hidden") && a.jgrid.hideModal("#info_dialog", {
                    jqm: h
                }), a("#info_dialog").remove()
            } catch (i) {}
            a.jgrid.createModal({
                themodal: "info_dialog",
                modalhead: "info_head",
                modalcontent: "info_content",
                scrollelm: "infocnt"
            }, b, g, "", "", !0);
            d && a.each(g.buttons,
                function(d) {
                    a("#" + a.jgrid.jqID(this.id), "#info_id").bind("click", function() {
                        g.buttons[d].onClick.call(a("#info_dialog"));
                        return !1
                    })
                });
            a("#closedialog", "#info_id").click(function() {
                f.hideModal("#info_dialog", {
                    jqm: h
                });
                return !1
            });
            a(".fm-button", "#info_dialog").hover(function() {
                a(this).addClass("ui-state-hover")
            }, function() {
                a(this).removeClass("ui-state-hover")
            });
            a.isFunction(g.beforeOpen) && g.beforeOpen();
            a.jgrid.viewModal("#info_dialog", {
                onHide: function(a) {
                    a.w.hide().remove();
                    a.o && a.o.remove()
                },
                modal: g.modal,
                jqm: h
            });
            a.isFunction(g.afterOpen) && g.afterOpen();
            try {
                a("#info_dialog").focus()
            } catch (j) {}
        },
        bindEv: function(d, b, c) {
            a.isFunction(b.dataInit) && b.dataInit.call(c, d);
            b.dataEvents && a.each(b.dataEvents, function() {
                void 0 !== this.data ? a(d).bind(this.type, this.data, this.fn) : a(d).bind(this.type, this.fn)
            })
        },
        createEl: function(d, b, c, e, g) {
            function h(d, b, c) {
                var e = "dataInit,dataEvents,dataUrl,buildSelect,sopt,searchhidden,defaultValue,attr,custom_element,custom_value".split(",");
                void 0 !== c && a.isArray(c) && a.merge(e,
                    c);
                a.each(b, function(b, c) {
                    -1 === a.inArray(b, e) && a(d).attr(b, c)
                });
                b.hasOwnProperty("id") || a(d).attr("id", a.jgrid.randId())
            }
            var f = "",
                i = this;
            switch (d) {
                case "textarea":
                    f = document.createElement("textarea");
                    !e && !b.cols && (b.cols = 20);
                    b.rows || (b.rows = 2);
                    if ("&nbsp;" == c || "&#160;" == c || 1 == c.length && 160 == c.charCodeAt(0)) c = "";
                    f.value = c;
                    h(f, b);
                    a(f).attr({
                        role: "textbox",
                        multiline: "true"
                    });
                    break;
                case "checkbox":
                    f = document.createElement("input");
                    f.type = "checkbox";
                    b.value ? (d = b.value.split(":"), c === d[0] && (f.checked = !0,
                        f.defaultChecked = !0), f.value = d[0], a(f).attr("offval", d[1])) : (d = c.toLowerCase(), 0 > d.search(/(false|0|no|off|undefined)/i) && "" !== d ? (f.checked = !0, f.defaultChecked = !0, f.value = c) : f.value = "on", a(f).attr("offval", "off"));
                    h(f, b, ["value"]);
                    a(f).attr("role", "checkbox");
                    break;
                case "select":
                    f = document.createElement("select");
                    f.setAttribute("role", "select");
                    e = [];
                    !0 === b.multiple ? (d = !0, f.multiple = "multiple", a(f).attr("aria-multiselectable", "true")) : d = !1;
                    if (void 0 !== b.dataUrl) d = b.name ? ("" + b.id).substring(0, ("" + b.id).length -
                        ("" + b.name).length - 1) : "" + b.id, e = b.postData || g.postData, i.p && i.p.idPrefix ? d = a.jgrid.stripPref(i.p.idPrefix, d) : e = void 0, a.ajax(a.extend({
                        url: b.dataUrl,
                        type: "GET",
                        dataType: "html",
                        data: a.isFunction(e) ? e.call(i, d, c, "" + b.name) : e,
                        context: {
                            elem: f,
                            options: b,
                            vl: c
                        },
                        success: function(d) {
                            var b = [],
                                c = this.elem,
                                e = this.vl,
                                f = a.extend({}, this.options),
                                g = f.multiple === true;
                            a.isFunction(f.buildSelect) && (d = f.buildSelect.call(i, d));
                            if (d = a(d).html()) {
                                a(c).append(d);
                                h(c, f);
                                if (f.size === void 0) f.size = g ? 3 : 1;
                                if (g) {
                                    b = e.split(",");
                                    b = a.map(b, function(d) {
                                        return a.trim(d)
                                    })
                                } else b[0] = a.trim(e);
                                setTimeout(function() {
                                    a("option", c).each(function(d) {
                                        if (d === 0 && c.multiple) this.selected = false;
                                        a(this).attr("role", "option");
                                        if (a.inArray(a.trim(a(this).text()), b) > -1 || a.inArray(a.trim(a(this).val()), b) > -1) this.selected = "selected"
                                    })
                                }, 0)
                            }
                        }
                    }, g || {}));
                    else if (b.value) {
                        var j;
                        void 0 === b.size && (b.size = d ? 3 : 1);
                        d && (e = c.split(","), e = a.map(e, function(d) {
                            return a.trim(d)
                        }));
                        "function" === typeof b.value && (b.value = b.value());
                        var n, k, l = void 0 === b.separator ?
                            ":" : b.separator,
                            g = void 0 === b.delimiter ? ";" : b.delimiter;
                        if ("string" === typeof b.value) {
                            n = b.value.split(g);
                            for (j = 0; j < n.length; j++) {
                                k = n[j].split(l);
                                2 < k.length && (k[1] = a.map(k, function(a, d) {
                                    if (d > 0) return a
                                }).join(l));
                                g = document.createElement("option");
                                g.setAttribute("role", "option");
                                g.value = k[0];
                                g.innerHTML = k[1];
                                f.appendChild(g);
                                if (!d && (a.trim(k[0]) == a.trim(c) || a.trim(k[1]) == a.trim(c))) g.selected = "selected";
                                if (d && (-1 < a.inArray(a.trim(k[1]), e) || -1 < a.inArray(a.trim(k[0]), e))) g.selected = "selected"
                            }
                        } else if ("object" ===
                            typeof b.value)
                            for (j in l = b.value, l)
                                if (l.hasOwnProperty(j)) {
                                    g = document.createElement("option");
                                    g.setAttribute("role", "option");
                                    g.value = j;
                                    g.innerHTML = l[j];
                                    f.appendChild(g);
                                    if (!d && (a.trim(j) == a.trim(c) || a.trim(l[j]) == a.trim(c))) g.selected = "selected";
                                    if (d && (-1 < a.inArray(a.trim(l[j]), e) || -1 < a.inArray(a.trim(j), e))) g.selected = "selected"
                                }
                        h(f, b, ["value"])
                    }
                    break;
                case "text":
                case "password":
                case "button":
                    j = "button" == d ? "button" : "textbox";
                    f = document.createElement("input");
                    f.type = d;
                    f.value = c;
                    h(f, b);
                    "button" !=
                    d && !e && !b.size && (b.size = 20);
                    a(f).attr("role", j);
                    break;
                case "image":
                case "file":
                    f = document.createElement("input");
                    f.type = d;
                    h(f, b);
                    break;
                case "custom":
                    f = document.createElement("span");
                    try {
                        if (a.isFunction(b.custom_element))
                            if (l = b.custom_element.call(i, c, b)) l = a(l).addClass("customelement").attr({
                                id: b.id,
                                name: b.name
                            }), a(f).empty().append(l);
                            else throw "e2";
                        else throw "e1";
                    } catch (m) {
                        "e1" == m && a.jgrid.info_dialog(a.jgrid.errors.errcap, "function 'custom_element' " + a.jgrid.edit.msg.nodefined, a.jgrid.edit.bClose),
                            "e2" == m ? a.jgrid.info_dialog(a.jgrid.errors.errcap, "function 'custom_element' " + a.jgrid.edit.msg.novalue, a.jgrid.edit.bClose) : a.jgrid.info_dialog(a.jgrid.errors.errcap, "string" === typeof m ? m : m.message, a.jgrid.edit.bClose)
                    }
            }
            return f
        },
        checkDate: function(a, b) {
            var c = {},
                e, a = a.toLowerCase();
            e = -1 != a.indexOf("/") ? "/" : -1 != a.indexOf("-") ? "-" : -1 != a.indexOf(".") ? "." : "/";
            a = a.split(e);
            b = b.split(e);
            if (3 != b.length) return !1;
            e = -1;
            var g, h = -1,
                f = -1,
                i;
            for (i = 0; i < a.length; i++) g = isNaN(b[i]) ? 0 : parseInt(b[i], 10), c[a[i]] = g, g =
                a[i], -1 != g.indexOf("y") && (e = i), -1 != g.indexOf("m") && (f = i), -1 != g.indexOf("d") && (h = i);
            g = "y" == a[e] || "yyyy" == a[e] ? 4 : "yy" == a[e] ? 2 : -1;
            i = function(a) {
                var b;
                for (b = 1; b <= a; b++) {
                    this[b] = 31;
                    if (4 == b || 6 == b || 9 == b || 11 == b) this[b] = 30;
                    2 == b && (this[b] = 29)
                }
                return this
            }(12);
            var j;
            if (-1 === e) return !1;
            j = c[a[e]].toString();
            2 == g && 1 == j.length && (g = 1);
            if (j.length != g || 0 === c[a[e]] && "00" != b[e] || -1 === f) return !1;
            j = c[a[f]].toString();
            if (1 > j.length || 1 > c[a[f]] || 12 < c[a[f]] || -1 === h) return !1;
            j = c[a[h]].toString();
            return 1 > j.length || 1 > c[a[h]] ||
                31 < c[a[h]] || 2 == c[a[f]] && c[a[h]] > (0 === c[a[e]] % 4 && (0 !== c[a[e]] % 100 || 0 === c[a[e]] % 400) ? 29 : 28) || c[a[h]] > i[c[a[f]]] ? !1 : !0
        },
        isEmpty: function(a) {
            return a.match(/^\s+$/) || "" === a ? !0 : !1
        },
        checkTime: function(d) {
            var b = /^(\d{1,2}):(\d{2})([ap]m)?$/;
            if (!a.jgrid.isEmpty(d))
                if (d = d.match(b)) {
                    if (d[3]) {
                        if (1 > d[1] || 12 < d[1]) return !1
                    } else if (23 < d[1]) return !1;
                    if (59 < d[2]) return !1
                } else return !1;
            return !0
        },
        checkValues: function(d, b, c, e, g) {
            var h, f;
            if (void 0 === e)
                if ("string" === typeof b) {
                    e = 0;
                    for (g = c.p.colModel.length; e < g; e++)
                        if (c.p.colModel[e].name ==
                            b) {
                            h = c.p.colModel[e].editrules;
                            b = e;
                            try {
                                f = c.p.colModel[e].formoptions.label
                            } catch (i) {}
                            break
                        }
                } else 0 <= b && (h = c.p.colModel[b].editrules);
            else h = e, f = void 0 === g ? "_" : g;
            if (h) {
                f || (f = c.p.colNames[b]);
                if (!0 === h.required && a.jgrid.isEmpty(d)) return [!1, f + ": " + a.jgrid.edit.msg.required, ""];
                e = !1 === h.required ? !1 : !0;
                if (!0 === h.number && !(!1 === e && a.jgrid.isEmpty(d)) && isNaN(d)) return [!1, f + ": " + a.jgrid.edit.msg.number, ""];
                if (void 0 !== h.minValue && !isNaN(h.minValue) && parseFloat(d) < parseFloat(h.minValue)) return [!1, f + ": " +
                    a.jgrid.edit.msg.minValue + " " + h.minValue, ""
                ];
                if (void 0 !== h.maxValue && !isNaN(h.maxValue) && parseFloat(d) > parseFloat(h.maxValue)) return [!1, f + ": " + a.jgrid.edit.msg.maxValue + " " + h.maxValue, ""];
                if (!0 === h.email && !(!1 === e && a.jgrid.isEmpty(d)) && (g = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i, !g.test(d))) return [!1, f + ": " + a.jgrid.edit.msg.email, ""];
                if (!0 === h.integer && !(!1 === e && a.jgrid.isEmpty(d)) && (isNaN(d) || 0 !== d % 1 || -1 != d.indexOf("."))) return [!1, f + ": " + a.jgrid.edit.msg.integer, ""];
                if (!0 === h.date && !(!1 === e && a.jgrid.isEmpty(d)) && (b = c.p.colModel[b].formatoptions && c.p.colModel[b].formatoptions.newformat ? c.p.colModel[b].formatoptions.newformat : c.p.colModel[b].datefmt || "Y-m-d", !a.jgrid.checkDate(b, d))) return [!1, f + ": " + a.jgrid.edit.msg.date + " - " + b, ""];
                if (!0 === h.time && !(!1 === e && a.jgrid.isEmpty(d)) &&
                    !a.jgrid.checkTime(d)) return [!1, f + ": " + a.jgrid.edit.msg.date + " - hh:mm (am/pm)", ""];
                if (!0 === h.url && !(!1 === e && a.jgrid.isEmpty(d)) && (g = /^(((https?)|(ftp)):\/\/([\-\w]+\.)+\w{2,3}(\/[%\-\w]+(\.\w{2,})?)*(([\w\-\.\?\\\/+@&#;`~=%!]*)(\.\w{2,})?)*\/?)/i, !g.test(d))) return [!1, f + ": " + a.jgrid.edit.msg.url, ""];
                if (!0 === h.custom && !(!1 === e && a.jgrid.isEmpty(d))) return a.isFunction(h.custom_func) ? (d = h.custom_func.call(c, d, f), a.isArray(d) ? d : [!1, a.jgrid.edit.msg.customarray, ""]) : [!1, a.jgrid.edit.msg.customfcheck,
                    ""
                ]
            }
            return [!0, "", ""]
        }
    })
})(jQuery);
(function(a) {
    a.fn.jqFilter = function(d) {
        if ("string" === typeof d) {
            var n = a.fn.jqFilter[d];
            if (!n) throw "jqFilter - No such method: " + d;
            var u = a.makeArray(arguments).slice(1);
            return n.apply(this, u)
        }
        var p = a.extend(!0, {
            filter: null,
            columns: [],
            onChange: null,
            afterRedraw: null,
            checkValues: null,
            error: !1,
            errmsg: "",
            errorcheck: !0,
            showQuery: !0,
            sopt: null,
            ops: [{
                name: "eq",
                description: "equal",
                operator: "="
            }, {
                name: "ne",
                description: "not equal",
                operator: "<>"
            }, {
                name: "lt",
                description: "less",
                operator: "<"
            }, {
                name: "le",
                description: "less or equal",
                operator: "<="
            }, {
                name: "gt",
                description: "greater",
                operator: ">"
            }, {
                name: "ge",
                description: "greater or equal",
                operator: ">="
            }, {
                name: "bw",
                description: "begins with",
                operator: "LIKE"
            }, {
                name: "bn",
                description: "does not begin with",
                operator: "NOT LIKE"
            }, {
                name: "in",
                description: "in",
                operator: "IN"
            }, {
                name: "ni",
                description: "not in",
                operator: "NOT IN"
            }, {
                name: "ew",
                description: "ends with",
                operator: "LIKE"
            }, {
                name: "en",
                description: "does not end with",
                operator: "NOT LIKE"
            }, {
                name: "cn",
                description: "contains",
                operator: "LIKE"
            }, {
                name: "nc",
                description: "does not contain",
                operator: "NOT LIKE"
            }, {
                name: "nu",
                description: "is null",
                operator: "IS NULL"
            }, {
                name: "nn",
                description: "is not null",
                operator: "IS NOT NULL"
            }],
            numopts: "eq,ne,lt,le,gt,ge,nu,nn,in,ni".split(","),
            stropts: "eq,ne,bw,bn,ew,en,cn,nc,nu,nn,in,ni".split(","),
            strarr: ["text", "string", "blob"],
            _gridsopt: [],
            groupOps: [{
                op: "AND",
                text: "AND"
            }, {
                op: "OR",
                text: "OR"
            }],
            groupButton: !0,
            ruleButtons: !0,
            direction: "ltr"
        }, a.jgrid.filter, d || {});
        return this.each(function() {
            if (!this.filter) {
                this.p = p;
                if (null ===
                    this.p.filter || void 0 === this.p.filter) this.p.filter = {
                    groupOp: this.p.groupOps[0].op,
                    rules: [],
                    groups: []
                };
                var d, n = this.p.columns.length,
                    f, t = /msie/i.test(navigator.userAgent) && !window.opera;
                if (this.p._gridsopt.length)
                    for (d = 0; d < this.p._gridsopt.length; d++) this.p.ops[d].description = this.p._gridsopt[d];
                this.p.initFilter = a.extend(!0, {}, this.p.filter);
                if (n) {
                    for (d = 0; d < n; d++)
                        if (f = this.p.columns[d], f.stype ? f.inputtype = f.stype : f.inputtype || (f.inputtype = "text"), f.sorttype ? f.searchtype = f.sorttype : f.searchtype ||
                            (f.searchtype = "string"), void 0 === f.hidden && (f.hidden = !1), f.label || (f.label = f.name), f.index && (f.name = f.index), f.hasOwnProperty("searchoptions") || (f.searchoptions = {}), !f.hasOwnProperty("searchrules")) f.searchrules = {};
                    this.p.showQuery && a(this).append("<table class='queryresult' style='display:block;max-width:440px;border:0px none;' dir='" + this.p.direction + "'><tbody><tr><td class='query'></td></tr></tbody></table>");
                    var r = function(g, l) {
                        var b = [!0, ""];
                        if (a.isFunction(l.searchrules)) b = l.searchrules(g, l);
                        else if (a.jgrid && a.jgrid.checkValues) try {
                            b = a.jgrid.checkValues(g, -1, null, l.searchrules, l.label)
                        } catch (c) {}
                        b && b.length && !1 === b[0] && (p.error = !b[0], p.errmsg = b[1])
                    };
                    this.onchange = function() {
                        this.p.error = !1;
                        this.p.errmsg = "";
                        return a.isFunction(this.p.onChange) ? this.p.onChange.call(this, this.p) : !1
                    };
                    this.reDraw = function() {
                        a("table.group:first", this).remove();
                        var g = this.createTableForGroup(p.filter, null);
                        a(this).append(g);
                        a.isFunction(this.p.afterRedraw) && this.p.afterRedraw.call(this, this.p)
                    };
                    this.createTableForGroup =
                        function(g, l) {
                            var b = this,
                                c, e = a("<table class='group' style='border:0px none;'><tbody></tbody></table>"),
                                d = "left";
                            "rtl" === this.p.direction && (d = "right", e.attr("dir", "rtl"));
                            null === l && e.append("<tr class='error' style='display:none;'><th colspan='5' class = 'ui-state-error' align='" + d + "'></th></tr>");
                            var h = a("<tr></tr>");
                            e.append(h);
                            d = a("<th colspan='5' align='" + d + "'></th>");
                            h.append(d);
                            if (!0 === this.p.ruleButtons) {
                                var i = a("<select class='opsel searchselect'></select>");
                                d.append(i);
                                var h = "",
                                    f;
                                for (c = 0; c <
                                    p.groupOps.length; c++) f = g.groupOp === b.p.groupOps[c].op ? " selected='selected'" : "", h += "<option value='" + b.p.groupOps[c].op + "'" + f + ">" + b.p.groupOps[c].text + "</option>";
                                i.append(h).selectmenu({
                                    mini: !0,
                                    inline: !0
                                }).bind("change", function() {
                                    g.groupOp = a(i).val();
                                    b.onchange()
                                })
                            }
                            h = "<span></span>";
                            this.p.groupButton && (h = a("<a href='#' title='Add subgroup' class='add-group'>+ {}</a>").buttonMarkup({
                                inline: !0,
                                mini: !0
                            }), h.bind("click", function() {
                                if (g.groups === void 0) g.groups = [];
                                g.groups.push({
                                    groupOp: p.groupOps[0].op,
                                    rules: [],
                                    groups: []
                                });
                                b.reDraw();
                                b.onchange();
                                return false
                            }));
                            d.append(h);
                            if (!0 === this.p.ruleButtons) {
                                var h = a("<a href='#' title='Add rule' class='add-rule ui-add' >+</a>"),
                                    m;
                                h.buttonMarkup({
                                    inline: !0,
                                    mini: !0,
                                    theme: "b"
                                }).bind("click", function() {
                                    if (g.rules === void 0) g.rules = [];
                                    for (c = 0; c < b.p.columns.length; c++) {
                                        var e = b.p.columns[c].search === void 0 ? true : b.p.columns[c].search,
                                            d = b.p.columns[c].hidden === true;
                                        if (b.p.columns[c].searchoptions.searchhidden === true && e || e && !d) {
                                            m = b.p.columns[c];
                                            break
                                        }
                                    }
                                    e = m.searchoptions.sopt ?
                                        m.searchoptions.sopt : b.p.sopt ? b.p.sopt : a.inArray(m.searchtype, b.p.strarr) !== -1 ? b.p.stropts : b.p.numopts;
                                    g.rules.push({
                                        field: m.name,
                                        op: e[0],
                                        data: ""
                                    });
                                    b.reDraw();
                                    return false
                                });
                                d.append(h)
                            }
                            null !== l && (h = a("<a href='#' title='Delete group' class='delete-group'>-</a>"), d.append(h), h.buttonMarkup({
                                inline: !0,
                                mini: !0,
                                theme: "b"
                            }).bind("click", function() {
                                for (c = 0; c < l.groups.length; c++)
                                    if (l.groups[c] === g) {
                                        l.groups.splice(c, 1);
                                        break
                                    }
                                b.reDraw();
                                b.onchange();
                                return false
                            }));
                            if (void 0 !== g.groups)
                                for (c = 0; c < g.groups.length; c++) d =
                                    a("<tr></tr>"), e.append(d), h = a("<td class='first'></td>"), d.append(h), h = a("<td colspan='4'></td>"), h.append(this.createTableForGroup(g.groups[c], g)), d.append(h);
                            void 0 === g.groupOp && (g.groupOp = b.p.groupOps[0].op);
                            if (void 0 !== g.rules)
                                for (c = 0; c < g.rules.length; c++) e.append(this.createTableRowForRule(g.rules[c], g));
                            return e
                        };
                    this.createTableRowForRule = function(g, d) {
                        var b = this,
                            c = a("<tr></tr>"),
                            e, f, h, i, k = "",
                            m;
                        c.append("<td class='first'></td>");
                        var j = a("<td class='columns'></td>");
                        c.append(j);
                        var n = a("<select class='searchselect'></select>"),
                            o, q = [];
                        j.append(n);
                        n.selectmenu({
                            mini: !0,
                            inline: !0
                        }).bind("change", function() {
                            g.field = a(n).val();
                            h = a(this).parents("tr:first");
                            for (e = 0; e < b.p.columns.length; e++)
                                if (b.p.columns[e].name === g.field) {
                                    i = b.p.columns[e];
                                    break
                                }
                            if (i) {
                                i.searchoptions.id = a.jgrid.randId();
                                t && "text" === i.inputtype && !i.searchoptions.size && (i.searchoptions.size = 10);
                                var c = a.jgrid.createEl(i.inputtype, i.searchoptions, "", !0, b.p.ajaxSelectOptions, !0);
                                a(c).addClass("input-elm").attr({
                                    "data-mini": "true",
                                    "data-inline": "true"
                                });
                                f = i.searchoptions.sopt ?
                                    i.searchoptions.sopt : b.p.sopt ? b.p.sopt : -1 !== a.inArray(i.searchtype, b.p.strarr) ? b.p.stropts : b.p.numopts;
                                var d = "",
                                    l = 0;
                                q = [];
                                a.each(b.p.ops, function() {
                                    q.push(this.name)
                                });
                                for (e = 0; e < f.length; e++) o = a.inArray(f[e], q), -1 !== o && (0 === l && (g.op = b.p.ops[o].name), d += "<option value='" + b.p.ops[o].name + "'>" + b.p.ops[o].description + "</option>", l++);
                                a("select.selectopts", h).empty().append(d);
                                a("select.selectopts", h)[0].selectedIndex = 0;
                                a.jgrid.msie && 9 > a.jgrid.msiever() && (d = parseInt(a("select.selectopts", h)[0].offsetWidth,
                                    10) + 1, a("select.selectopts", h).width(d), a("select.selectopts", h).css("width", "auto"));
                                a("select.selectopts", h).selectmenu("refresh");
                                a(".data", h).empty().append(c);
                                switch (i.inputtype) {
                                    case "text":
                                    case "textarea":
                                    case "password":
                                        a(c).textinput();
                                        break;
                                    case "select":
                                        a(c).selectmenu()
                                }
                                a.jgrid.bindEv(c, i.searchoptions, b);
                                a(".input-elm", h).bind("change", function(c) {
                                    var e = a(this).hasClass("ui-autocomplete-input") ? 200 : 0;
                                    setTimeout(function() {
                                        var e = c.target;
                                        g.data = e.nodeName.toUpperCase() === "SPAN" && i.searchoptions &&
                                            a.isFunction(i.searchoptions.custom_value) ? i.searchoptions.custom_value(a(e).children(".customelement:first"), "get") : e.value;
                                        b.onchange()
                                    }, e)
                                });
                                setTimeout(function() {
                                    g.data = a(c).val();
                                    b.onchange()
                                }, 0)
                            }
                        });
                        for (e = j = 0; e < b.p.columns.length; e++) {
                            m = void 0 === b.p.columns[e].search ? !0 : b.p.columns[e].search;
                            var r = !0 === b.p.columns[e].hidden;
                            if (!0 === b.p.columns[e].searchoptions.searchhidden && m || m && !r) m = "", g.field === b.p.columns[e].name && (m = " selected='selected'", j = e), k += "<option value='" + b.p.columns[e].name + "'" +
                                m + ">" + b.p.columns[e].label + "</option>"
                        }
                        n.append(k).selectmenu("refresh");
                        k = a("<td class='operators'></td>");
                        c.append(k);
                        i = p.columns[j];
                        i.searchoptions.id = a.jgrid.randId();
                        t && "text" === i.inputtype && !i.searchoptions.size && (i.searchoptions.size = 10);
                        j = a.jgrid.createEl(i.inputtype, i.searchoptions, g.data, !0, b.p.ajaxSelectOptions, !0);
                        if ("nu" === g.op || "nn" === g.op) a(j).attr("readonly", "true"), a(j).attr("disabled", "true");
                        a(j).attr({
                            "data-mini": "true",
                            "data-inline": "true"
                        });
                        var s = a("<select class='selectopts searchselect'></select>");
                        k.append(s);
                        s.selectmenu({
                            mini: !0,
                            inline: !0
                        }).bind("change", function() {
                            g.op = a(s).val();
                            h = a(this).parents("tr:first");
                            var c = a(".input-elm", h)[0];
                            if (g.op === "nu" || g.op === "nn") {
                                g.data = "";
                                c.value = "";
                                c.setAttribute("readonly", "true");
                                c.setAttribute("disabled", "true")
                            } else {
                                c.removeAttribute("readonly");
                                c.removeAttribute("disabled")
                            }
                            b.onchange()
                        });
                        f = i.searchoptions.sopt ? i.searchoptions.sopt : b.p.sopt ? b.p.sopt : -1 !== a.inArray(i.searchtype, b.p.strarr) ? b.p.stropts : b.p.numopts;
                        k = "";
                        a.each(b.p.ops, function() {
                            q.push(this.name)
                        });
                        for (e = 0; e < f.length; e++) o = a.inArray(f[e], q), -1 !== o && (m = g.op === b.p.ops[o].name ? " selected='selected'" : "", k += "<option value='" + b.p.ops[o].name + "'" + m + ">" + b.p.ops[o].description + "</option>");
                        s.append(k).selectmenu("refresh");
                        k = a("<td class='data'></td>");
                        c.append(k);
                        k.append(j);
                        switch (i.inputtype) {
                            case "text":
                            case "textarea":
                            case "password":
                                a(j).textinput();
                                break;
                            case "select":
                                a(j).selectmenu()
                        }
                        a.jgrid.bindEv(j, i.searchoptions, b);
                        a(j).addClass("input-elm").bind("change", function() {
                            g.data = i.inputtype ===
                                "custom" ? i.searchoptions.custom_value(a(this).children(".customelement:first"), "get") : a(this).val();
                            b.onchange()
                        });
                        k = a("<td></td>");
                        c.append(k);
                        !0 === this.p.ruleButtons && (j = a("<a href='# title='Delete rule' class='delete-rule ui-del'>-</a>"), k.append(j), j.buttonMarkup({
                            inline: !0,
                            mini: !0,
                            theme: "b"
                        }).bind("click", function() {
                            for (e = 0; e < d.rules.length; e++)
                                if (d.rules[e] === g) {
                                    d.rules.splice(e, 1);
                                    break
                                }
                            b.reDraw();
                            b.onchange();
                            return false
                        }));
                        return c
                    };
                    this.getStringForGroup = function(a) {
                        var d = "(",
                            b;
                        if (void 0 !==
                            a.groups)
                            for (b = 0; b < a.groups.length; b++) {
                                1 < d.length && (d += " " + a.groupOp + " ");
                                try {
                                    d += this.getStringForGroup(a.groups[b])
                                } catch (c) {
                                    alert(c)
                                }
                            }
                        if (void 0 !== a.rules) try {
                            for (b = 0; b < a.rules.length; b++) 1 < d.length && (d += " " + a.groupOp + " "), d += this.getStringForRule(a.rules[b])
                        } catch (e) {
                            alert(e)
                        }
                        d += ")";
                        return "()" === d ? "" : d
                    };
                    this.getStringForRule = function(d) {
                        var f = "",
                            b = "",
                            c, e;
                        for (c = 0; c < this.p.ops.length; c++)
                            if (this.p.ops[c].name === d.op) {
                                f = this.p.ops[c].operator;
                                b = this.p.ops[c].name;
                                break
                            }
                        for (c = 0; c < this.p.columns.length; c++)
                            if (this.p.columns[c].name ===
                                d.field) {
                                e = this.p.columns[c];
                                break
                            }
                        if (null == e) return "";
                        c = d.data;
                        if ("bw" === b || "bn" === b) c += "%";
                        if ("ew" === b || "en" === b) c = "%" + c;
                        if ("cn" === b || "nc" === b) c = "%" + c + "%";
                        if ("in" === b || "ni" === b) c = " (" + c + ")";
                        p.errorcheck && r(d.data, e);
                        return -1 !== a.inArray(e.searchtype, ["int", "integer", "float", "number", "currency"]) || "nn" === b || "nu" === b ? d.field + " " + f + " " + c : d.field + " " + f + ' "' + c + '"'
                    };
                    this.resetFilter = function() {
                        this.p.filter = a.extend(!0, {}, this.p.initFilter);
                        this.reDraw();
                        this.onchange()
                    };
                    this.hideError = function() {
                        a("th.ui-state-error",
                            this).html("");
                        a("tr.error", this).hide()
                    };
                    this.showError = function() {
                        a("th.ui-state-error", this).html(this.p.errmsg);
                        a("tr.error", this).show()
                    };
                    this.toUserFriendlyString = function() {
                        return this.getStringForGroup(p.filter)
                    };
                    this.toString = function() {
                        function a(b) {
                            var c = "(",
                                e;
                            if (void 0 !== b.groups)
                                for (e = 0; e < b.groups.length; e++) 1 < c.length && (c = "OR" === b.groupOp ? c + " || " : c + " && "), c += a(b.groups[e]);
                            if (void 0 !== b.rules)
                                for (e = 0; e < b.rules.length; e++) {
                                    1 < c.length && (c = "OR" === b.groupOp ? c + " || " : c + " && ");
                                    var f = b.rules[e];
                                    if (d.p.errorcheck) {
                                        for (var h = void 0, i = void 0, h = 0; h < d.p.columns.length; h++)
                                            if (d.p.columns[h].name === f.field) {
                                                i = d.p.columns[h];
                                                break
                                            }
                                        i && r(f.data, i)
                                    }
                                    c += f.op + "(item." + f.field + ",'" + f.data + "')"
                                }
                            c += ")";
                            return "()" === c ? "" : c
                        }
                        var d = this;
                        return a(this.p.filter)
                    };
                    this.reDraw();
                    if (this.p.showQuery) this.onchange();
                    this.filter = !0
                }
            }
        })
    };
    a.extend(a.fn.jqFilter, {
        toSQLString: function() {
            var a = "";
            this.each(function() {
                a = this.toUserFriendlyString()
            });
            return a
        },
        filterData: function() {
            var a;
            this.each(function() {
                a = this.p.filter
            });
            return a
        },
        getParameter: function(a) {
            return void 0 !== a && this.p.hasOwnProperty(a) ? this.p[a] : this.p
        },
        resetFilter: function() {
            return this.each(function() {
                this.resetFilter()
            })
        },
        addFilter: function(d) {
            "string" === typeof d && (d = a.jgrid.parse(d));
            this.each(function() {
                this.p.filter = d;
                this.reDraw();
                this.onchange()
            })
        }
    })
})(jQuery);
(function(a) {
    var c = {};
    a.jgrid.extend({
        searchGrid: function(c) {
            c = a.extend(!0, {
                recreateFilter: !1,
                drag: !0,
                sField: "searchField",
                sValue: "searchString",
                sOper: "searchOper",
                sFilter: "filters",
                loadDefaults: !0,
                beforeShowSearch: null,
                afterShowSearch: null,
                onInitializeSearch: null,
                afterRedraw: null,
                afterChange: null,
                closeAfterSearch: !1,
                closeAfterReset: !1,
                closeOnEscape: !1,
                searchOnEnter: !1,
                multipleSearch: !1,
                multipleGroup: !1,
                top: 0,
                left: 0,
                jqModal: !0,
                modal: !1,
                resize: !0,
                width: 450,
                height: "auto",
                dataheight: "auto",
                showQuery: !1,
                errorcheck: !0,
                sopt: null,
                stringResult: void 0,
                onClose: null,
                onSearch: null,
                onReset: null,
                toTop: !0,
                overlay: 30,
                columns: [],
                tmplNames: null,
                tmplFilters: null,
                tmplLabel: " Template: ",
                showOnLoad: !1,
                layer: null
            }, a.jgrid.search, c || {});
            return this.each(function() {
                var d, e, p;

                function m(b) {
                    n = a(i).triggerHandler("jqGridFilterBeforeShow", [b]);
                    void 0 === n && (n = !0);
                    n && a.isFunction(c.beforeShowSearch) && (n = c.beforeShowSearch.call(i, b));
                    n && (a.jgrid.viewModal("#" + a.jgrid.jqID(d), {
                        gbox: "#gbox_" + a.jgrid.jqID(h),
                        jqm: c.jqModal,
                        modal: c.modal,
                        overlay: c.overlay,
                        toTop: c.toTop
                    }), a(i).triggerHandler("jqGridFilterAfterShow", [b]), a.isFunction(c.afterShowSearch) && c.afterShowSearch.call(i, b))
                }
                var i = this;
                if (i.grid) {
                    var h = "fbox_" + i.p.id,
                        n = !0;
                    d = "searchmod" + h;
                    e = "searchhd" + h;
                    p = "searchcnt" + h;
                    var f = i.p.postData[c.sFilter];
                    f && "string" === typeof f && (f = a.jgrid.parse(f));
                    !0 === c.recreateFilter && a("#" + a.jgrid.jqID(d)).remove();
                    if (void 0 !== a("#" + a.jgrid.jqID(d))[0]) m(a("#fbox_" + a.jgrid.jqID(+i.p.id)));
                    else {
                        var g = a("<div><div id='" + h + "' class='searchFilter' style='overflow:auto'></div></div>").insertBefore("#gview_" +
                                a.jgrid.jqID(i.p.id)),
                            v = "left",
                            w = "";
                        "rtl" === i.p.direction && (v = "right", w = " style='text-align:left'", g.attr("dir", "rtl"));
                        var u = a.extend([], i.p.colModel),
                            A = "<a href='#' id='" + h + "_search' data-role='button' data-inline='true' data-mini='true'>" + c.Find + "</a>",
                            q = "<a href='#' id='" + h + "_reset' data-role='button' data-inline='true' data-mini='true'>" + c.Reset + "</a>",
                            b = "",
                            o = "",
                            k, z = !1,
                            l = -1;
                        c.showQuery && (b = "<a href='#' id='" + h + "_query' data-role='button' data-inline='true' data-mini='true'>Query</a>");
                        c.columns.length ?
                            u = c.columns : a.each(u, function(a, b) {
                                if (!b.label) b.label = i.p.colNames[a];
                                if (!z) {
                                    var c = b.search === void 0 ? true : b.search,
                                        d = b.hidden === true;
                                    if (b.searchoptions && b.searchoptions.searchhidden === true && c || c && !d) {
                                        z = true;
                                        k = b.index || b.name;
                                        l = a
                                    }
                                }
                            });
                        if (!f && k || !1 === c.multipleSearch) {
                            var y = "eq";
                            0 <= l && u[l].searchoptions && u[l].searchoptions.sopt ? y = u[l].searchoptions.sopt[0] : c.sopt && c.sopt.length && (y = c.sopt[0]);
                            f = {
                                groupOp: "AND",
                                rules: [{
                                    field: k,
                                    op: y,
                                    data: ""
                                }]
                            }
                        }
                        z = !1;
                        c.tmplNames && c.tmplNames.length && (z = !0, o = c.tmplLabel,
                            o += "<select class='ui-template'>", o += "<option value='default'>Default</option>", a.each(c.tmplNames, function(a, b) {
                                o = o + ("<option value='" + a + "'>" + b + "</option>")
                            }), o += "</select>");
                        v = "<table class='EditTable' style='border:0px none;margin-top:5px' id='" + h + "_2'><tbody><tr><td colspan='2'><hr class='ui-widget-content' style='margin:1px'/></td></tr><tr><td class='EditButton' style='text-align:" + v + "'>" + q + o + "</td><td class='EditButton' " + w + ">" + b + A + "</td></tr></tbody></table>";
                        h = a.jgrid.jqID(h);
                        a("#" + h).jqFilter({
                            columns: u,
                            filter: c.loadDefaults ? f : null,
                            showQuery: c.showQuery,
                            errorcheck: c.errorcheck,
                            sopt: c.sopt,
                            groupButton: c.multipleGroup,
                            ruleButtons: c.multipleSearch,
                            afterRedraw: c.afterRedraw,
                            _gridsopt: a.jgrid.search.odata,
                            ajaxSelectOptions: i.p.ajaxSelectOptions,
                            groupOps: c.groupOps,
                            onChange: function() {
                                this.p.showQuery && a(".query", this).html(this.toUserFriendlyString());
                                a.isFunction(c.afterChange) && c.afterChange.call(i, a("#" + h), c)
                            },
                            direction: i.p.direction
                        });
                        g.append(v);
                        z && c.tmplFilters && c.tmplFilters.length && a(".ui-template",
                            g).bind("change", function() {
                            var b = a(this).val();
                            b === "default" ? a("#" + h).jqFilter("addFilter", f) : a("#" + h).jqFilter("addFilter", c.tmplFilters[parseInt(b, 10)]);
                            return false
                        });
                        !0 === c.multipleGroup && (c.multipleSearch = !0);
                        a(i).triggerHandler("jqGridFilterInitialize", [a("#" + h)]);
                        a.isFunction(c.onInitializeSearch) && c.onInitializeSearch.call(i, a("#" + h));
                        c.gbox = "#gbox_" + h;
                        e = a('<div id="' + d + '" data-role="popup" data-overlay-theme="a"><a href="#" data-rel="back" data-role="button" data-icon="delete" data-iconpos="notext" data-theme="a" class="ui-btn-right">Close</a><div id="' +
                            e + '"  data-role="header"> <h1>' + c.caption + '</h1></div><div id="' + p + '"  data-role="content" class="ui-jqdialog-content"></div></div>');
                        a("#" + p, e).append(g);
                        a.mobile.activePage.append(e).trigger("pagecreate");
                        b && a("#" + h + "_query").bind("click", function() {
                            a(".queryresult", g).toggle();
                            return false
                        });
                        void 0 === c.stringResult && (c.stringResult = c.multipleSearch);
                        a("#" + h + "_search").bind("click", function() {
                            var b = a("#" + h),
                                e = {},
                                t, f = b.jqFilter("filterData");
                            if (c.errorcheck) {
                                b[0].hideError();
                                c.showQuery || b.jqFilter("toSQLString");
                                if (b[0].p.error) {
                                    b[0].showError();
                                    return false
                                }
                            }
                            if (c.stringResult) {
                                try {
                                    t = xmlJsonClass.toJson(f, "", "", false)
                                } catch (k) {
                                    try {
                                        t = JSON.stringify(f)
                                    } catch (l) {}
                                }
                                if (typeof t === "string") {
                                    e[c.sFilter] = t;
                                    a.each([c.sField, c.sValue, c.sOper], function() {
                                        e[this] = ""
                                    })
                                }
                            } else if (c.multipleSearch) {
                                e[c.sFilter] = f;
                                a.each([c.sField, c.sValue, c.sOper], function() {
                                    e[this] = ""
                                })
                            } else {
                                e[c.sField] = f.rules[0].field;
                                e[c.sValue] = f.rules[0].data;
                                e[c.sOper] = f.rules[0].op;
                                e[c.sFilter] = ""
                            }
                            i.p.search = true;
                            a.extend(i.p.postData, e);
                            a(i).triggerHandler("jqGridFilterSearch");
                            a.isFunction(c.onSearch) && c.onSearch.call(i);
                            a(i).trigger("reloadGrid", [{
                                page: 1
                            }]);
                            c.closeAfterSearch && a("#" + d).popup("close");
                            return false
                        });
                        a("#" + h + "_reset").bind("click", function() {
                            var b = {},
                                d = a("#" + h);
                            i.p.search = false;
                            c.multipleSearch === false ? b[c.sField] = b[c.sValue] = b[c.sOper] = "" : b[c.sFilter] = "";
                            d[0].resetFilter();
                            z && a(".ui-template", g).val("default");
                            a.extend(i.p.postData, b);
                            a(i).triggerHandler("jqGridFilterReset");
                            a.isFunction(c.onReset) && c.onReset.call(i);
                            a(i).trigger("reloadGrid", [{
                                page: 1
                            }]);
                            return false
                        });
                        setTimeout(function() {
                            a("#" + d).popup("open", {
                                positionTo: c.gbox
                            })
                        }, 100);
                        a(document).on("popupafterclose", "#" + d, function() {
                            a(this).remove()
                        })
                    }
                }
            })
        },
        editGridRow: function(s, d) {
            d = a.extend(!0, {
                top: 0,
                left: 0,
                width: 500,
                datawidth: "auto",
                height: "auto",
                dataheight: "auto",
                modal: !1,
                overlay: 30,
                drag: !0,
                resize: !0,
                url: null,
                mtype: "POST",
                clearAfterAdd: !0,
                closeAfterEdit: !1,
                reloadAfterSubmit: !0,
                onInitializeForm: null,
                beforeInitData: null,
                beforeShowForm: null,
                afterShowForm: null,
                beforeSubmit: null,
                afterSubmit: null,
                onclickSubmit: null,
                afterComplete: null,
                onclickPgButtons: null,
                afterclickPgButtons: null,
                editData: {},
                recreateForm: !1,
                jqModal: !0,
                closeOnEscape: !1,
                addedrow: "first",
                topinfo: "",
                bottominfo: "",
                saveicon: [],
                closeicon: [],
                savekey: [!1, 13],
                navkeys: [!1, 38, 40],
                checkOnSubmit: !1,
                checkOnUpdate: !1,
                _savedData: {},
                processing: !1,
                onClose: null,
                ajaxEditOptions: {},
                serializeEditData: null,
                viewPagerButtons: !0
            }, a.jgrid.edit, d || {});
            c[a(this)[0].p.id] = d;
            return this.each(function() {
                var e, p, m;

                function i() {
                    a(".FormElement", l).each(function() {
                        var c =
                            a(".customelement", this);
                        if (c.length) {
                            var d = a(c[0]).attr("name");
                            a.each(b.p.colModel, function() {
                                if (this.name === d && this.editoptions && a.isFunction(this.editoptions.custom_value)) {
                                    try {
                                        if (j[d] = this.editoptions.custom_value.call(b, a("#" + a.jgrid.jqID(d), l), "get"), void 0 === j[d]) throw "e1";
                                    } catch (c) {
                                        "e1" === c ? a.jgrid.info_dialog(a.jgrid.errors.errcap, "function 'custom_value' " + a.jgrid.edit.msg.novalue, a.jgrid.edit.bClose) : a.jgrid.info_dialog(a.jgrid.errors.errcap, c.message, a.jgrid.edit.bClose)
                                    }
                                    return !0
                                }
                            })
                        } else {
                            switch (a(this).get(0).type) {
                                case "checkbox":
                                    a(this).is(":checked") ?
                                        j[this.name] = a(this).val() : (c = a(this).attr("offval"), j[this.name] = c);
                                    break;
                                case "select-one":
                                    j[this.name] = a("option:selected", this).val();
                                    break;
                                case "select-multiple":
                                    j[this.name] = a(this).val();
                                    j[this.name] = j[this.name] ? j[this.name].join(",") : "";
                                    a("option:selected", this).each(function(b, c) {
                                        a(c).text()
                                    });
                                    break;
                                case "password":
                                case "text":
                                case "textarea":
                                case "button":
                                    j[this.name] = a(this).val()
                            }
                            b.p.autoencode && (j[this.name] = a.jgrid.htmlEncode(j[this.name]))
                        }
                    });
                    return !0
                }

                function h(d, e, j, t) {
                    var f, h, l,
                        r = 0,
                        g, i, o, p = [],
                        s = !1,
                        m = "",
                        n;
                    for (n = 1; n <= t; n++) m += "<td class='CaptionTD'>&#160;</td><td class='DataTD'>&#160;</td>";
                    "_empty" !== d && (s = a(e).jqGrid("getInd", d));
                    a(b.p.colModel).each(function(n) {
                        f = this.name;
                        i = (h = this.editrules && !0 === this.editrules.edithidden ? !1 : !0 === this.hidden ? !0 : !1) ? "style='display:none'" : "";
                        if ("cb" !== f && "subgrid" !== f && !0 === this.editable && "rn" !== f) {
                            if (!1 === s) g = "";
                            else if (f === e.p.ExpandColumn && !0 === e.p.treeGrid) g = a("td[role='gridcell']:eq(" + n + ")", e.rows[s]).text();
                            else {
                                try {
                                    g = a.unformat.call(e,
                                        a("td[role='gridcell']:eq(" + n + ")", e.rows[s]), {
                                            rowId: d,
                                            colModel: this
                                        }, n)
                                } catch (x) {
                                    g = this.edittype && "textarea" === this.edittype ? a("td[role='gridcell']:eq(" + n + ")", e.rows[s]).text() : a("td[role='gridcell']:eq(" + n + ")", e.rows[s]).html()
                                }
                                if (!g || "&nbsp;" === g || "&#160;" === g || 1 === g.length && 160 === g.charCodeAt(0)) g = ""
                            }
                            var q = a.extend({}, this.editoptions || {}, {
                                    id: f,
                                    name: f
                                }),
                                y = a.extend({}, {
                                    elmprefix: "",
                                    elmsuffix: "",
                                    rowabove: !1,
                                    rowcontent: ""
                                }, this.formoptions || {}),
                                B = parseInt(y.rowpos, 10) || r + 1,
                                D = parseInt(2 * (parseInt(y.colpos,
                                    10) || 1), 10);
                            "_empty" === d && q.defaultValue && (g = a.isFunction(q.defaultValue) ? q.defaultValue.call(b) : q.defaultValue);
                            this.edittype || (this.edittype = "text");
                            b.p.autoencode && (g = a.jgrid.htmlDecode(g));
                            o = a.jgrid.createEl.call(b, this.edittype, q, g, !1, a.extend({}, a.jgrid.ajaxOptions, e.p.ajaxSelectOptions || {}));
                            if (c[b.p.id].checkOnSubmit || c[b.p.id].checkOnUpdate) c[b.p.id]._savedData[f] = g;
                            a(o).addClass("FormElement");
                            a(o).attr({
                                "data-mini": "true",
                                "data-inline": "true",
                                "data-theme": b.p.dataTheme
                            });
                            var u = "";
                            "checkbox" ===
                            this.edittype && (u = '<label for="' + f + '">&nbsp;</label>');
                            l = a(j).find("tr[rowpos=" + B + "]");
                            if (y.rowabove) {
                                var v = a("<tr><td class='contentinfo' colspan='" + 2 * t + "'>" + y.rowcontent + "</td></tr>");
                                a(j).append(v);
                                v[0].rp = B
                            }
                            0 === l.length && (l = a("<tr " + i + " rowpos='" + B + "'></tr>").addClass("FormData").attr("id", "tr_" + f), a(l).append(m), a(j).append(l), l[0].rp = B);
                            a("td:eq(" + (D - 2) + ")", l[0]).html(void 0 === y.label ? e.p.colNames[n] : y.label);
                            a("td:eq(" + (D - 1) + ")", l[0]).append(y.elmprefix).append(u).append(o).append(y.elmsuffix);
                            a.isFunction(q.custom_value) && "_empty" !== d && q.custom_value.call(b, a("#" + f, "#" + k), "set", g);
                            a.jgrid.bindEv(o, q, b);
                            p[r] = n;
                            r++
                        }
                    });
                    if (0 < r && (n = a("<tr class='FormData' style='display:none'><td class='CaptionTD'></td><td colspan='" + (2 * t - 1) + "' class='DataTD'><input class='FormElement' id='id_g' type='text' name='" + e.p.id + "_id' value='" + d + "'/></td></tr>"), n[0].rp = r + 999, a(j).append(n), c[b.p.id].checkOnSubmit || c[b.p.id].checkOnUpdate)) c[b.p.id]._savedData[e.p.id + "_id"] = d;
                    return p
                }

                function n(d, e, j) {
                    var f, t = 0,
                        g, h, r, k, o;
                    if (c[b.p.id].checkOnSubmit || c[b.p.id].checkOnUpdate) c[b.p.id]._savedData = {}, c[b.p.id]._savedData[e.p.id + "_id"] = d;
                    var i = e.p.colModel;
                    if ("_empty" === d) a(i).each(function() {
                        f = this.name;
                        r = a.extend({}, this.editoptions || {});
                        if ((h = a("#" + a.jgrid.jqID(f), "#" + j)) && h.length && null !== h[0])
                            if (k = "", r.defaultValue ? (k = a.isFunction(r.defaultValue) ? r.defaultValue.call(b) : r.defaultValue, "checkbox" === h[0].type ? (o = k.toLowerCase(), 0 > o.search(/(false|0|no|off|undefined)/i) && "" !== o ? (h[0].checked = !0, h[0].defaultChecked = !0, h[0].value = k) : (h[0].checked = !1, h[0].defaultChecked = !1)) : h.val(k)) : "checkbox" === h[0].type ? (h[0].checked = !1, h[0].defaultChecked = !1, k = a(h).attr("offval")) : h[0].type && "select" === h[0].type.substr(0, 6) ? h[0].selectedIndex = 0 : h.val(k), !0 === c[b.p.id].checkOnSubmit || c[b.p.id].checkOnUpdate) c[b.p.id]._savedData[f] = k
                    }), a("#id_g", "#" + j).val(d);
                    else {
                        var n = a(e).jqGrid("getInd", d, !0);
                        n && (a('td[role="gridcell"]', n).each(function(h) {
                            f = i[h].name;
                            if ("cb" !== f && "subgrid" !== f && "rn" !== f && !0 === i[h].editable) {
                                if (f === e.p.ExpandColumn &&
                                    !0 === e.p.treeGrid) g = a(this).text();
                                else try {
                                    g = a.unformat.call(e, a(this), {
                                        rowId: d,
                                        colModel: i[h]
                                    }, h)
                                } catch (r) {
                                    g = "textarea" === i[h].edittype ? a(this).text() : a(this).html()
                                }
                                i[h].edittype || (i[h].edittype = "text");
                                b.p.autoencode && (g = a.jgrid.htmlDecode(g));
                                if (!0 === c[b.p.id].checkOnSubmit || c[b.p.id].checkOnUpdate) c[b.p.id]._savedData[f] = g;
                                f = a.jgrid.jqID(f);
                                switch (i[h].edittype) {
                                    case "password":
                                    case "text":
                                    case "button":
                                    case "image":
                                    case "textarea":
                                        if ("&nbsp;" === g || "&#160;" === g || 1 === g.length && 160 === g.charCodeAt(0)) g =
                                            "";
                                        a("#" + f, "#" + j).val(g);
                                        break;
                                    case "select":
                                        var k = g.split(","),
                                            k = a.map(k, function(b) {
                                                return a.trim(b)
                                            });
                                        a("#" + f + " option", "#" + j).each(function() {
                                            this.selected = !i[h].editoptions.multiple && (a.trim(g) === a.trim(a(this).text()) || k[0] === a.trim(a(this).text()) || k[0] === a.trim(a(this).val())) ? true : i[h].editoptions.multiple ? a.inArray(a.trim(a(this).text()), k) > -1 || a.inArray(a.trim(a(this).val()), k) > -1 ? true : false : false
                                        });
                                        a("#" + f, "#" + j).selectmenu("refresh");
                                        break;
                                    case "checkbox":
                                        g = "" + g;
                                        if (i[h].editoptions &&
                                            i[h].editoptions.value)
                                            if (i[h].editoptions.value.split(":")[0] === g) a("#" + f, "#" + j)[b.p.useProp ? "prop" : "attr"]("checked", !0);
                                            else a("#" + f, "#" + j)[b.p.useProp ? "prop" : "attr"]("checked", !1);
                                        else if (g = g.toLowerCase(), 0 > g.search(/(false|0|no|off|undefined)/i) && "" !== g) a("#" + f, "#" + j)[b.p.useProp ? "prop" : "attr"]({
                                            checked: !0,
                                            defaultChecked: !0
                                        });
                                        else a("#" + f, "#" + j)[b.p.useProp ? "prop" : "attr"]({
                                            checked: !1,
                                            defaultChecked: !1
                                        });
                                        a("#" + f, "#" + j).checkboxradio("refresh");
                                        break;
                                    case "custom":
                                        try {
                                            if (i[h].editoptions && a.isFunction(i[h].editoptions.custom_value)) i[h].editoptions.custom_value.call(b,
                                                a("#" + f, "#" + j), "set", g);
                                            else throw "e1";
                                        } catch (l) {
                                            "e1" === l ? a.jgrid.info_dialog(a.jgrid.errors.errcap, "function 'custom_value' " + a.jgrid.edit.msg.nodefined, a.jgrid.edit.bClose) : a.jgrid.info_dialog(a.jgrid.errors.errcap, l.message, a.jgrid.edit.bClose)
                                        }
                                }
                                t++
                            }
                        }), 0 < t && a("#id_g", l).val(d))
                    }
                }

                function f() {
                    a.each(b.p.colModel, function(a, b) {
                        b.editoptions && !0 === b.editoptions.NullIfEmpty && j.hasOwnProperty(b.name) && "" === j[b.name] && (j[b.name] = "null")
                    })
                }

                function g() {
                    var h, g = [!0, "", ""],
                        t = {},
                        i = b.p.prmNames,
                        r, o, s, p, m,
                        q = a(b).triggerHandler("jqGridAddEditBeforeCheckValues", [a("#" + k), B]);
                    q && "object" === typeof q && (j = q);
                    a.isFunction(c[b.p.id].beforeCheckValues) && (q = c[b.p.id].beforeCheckValues.call(b, j, a("#" + k), "_empty" === j[b.p.id + "_id"] ? i.addoper : i.editoper)) && "object" === typeof q && (j = q);
                    for (s in j)
                        if (j.hasOwnProperty(s) && (g = a.jgrid.checkValues.call(b, j[s], s, b), !1 === g[0])) break;
                    f();
                    g[0] && (t = a(b).triggerHandler("jqGridAddEditClickSubmit", [c[b.p.id], j, B]), void 0 === t && a.isFunction(c[b.p.id].onclickSubmit) && (t = c[b.p.id].onclickSubmit.call(b,
                        c[b.p.id], j) || {}), g = a(b).triggerHandler("jqGridAddEditBeforeSubmit", [j, a("#" + k), B]), void 0 === g && (g = [!0, "", ""]), g[0] && a.isFunction(c[b.p.id].beforeSubmit) && (g = c[b.p.id].beforeSubmit.call(b, j, a("#" + k))));
                    if (g[0] && !c[b.p.id].processing) {
                        c[b.p.id].processing = !0;
                        a("#sData", l + "_2").addClass("ui-btn-active");
                        o = i.oper;
                        r = i.id;
                        j[o] = "_empty" === a.trim(j[b.p.id + "_id"]) ? i.addoper : i.editoper;
                        j[o] !== i.addoper ? j[r] = j[b.p.id + "_id"] : void 0 === j[r] && (j[r] = j[b.p.id + "_id"]);
                        delete j[b.p.id + "_id"];
                        j = a.extend(j, c[b.p.id].editData,
                            t);
                        if (!0 === b.p.treeGrid)
                            for (m in j[o] === i.addoper && (p = a(b).jqGrid("getGridParam", "selrow"), j["adjacency" === b.p.treeGridModel ? b.p.treeReader.parent_id_field : "parent_id"] = p), b.p.treeReader) b.p.treeReader.hasOwnProperty(m) && (t = b.p.treeReader[m], j.hasOwnProperty(t) && !(j[o] === i.addoper && "parent_id_field" === m) && delete j[t]);
                        j[r] = a.jgrid.stripPref(b.p.idPrefix, j[r]);
                        m = a.extend({
                            url: c[b.p.id].url || a(b).jqGrid("getGridParam", "editurl"),
                            type: c[b.p.id].mtype,
                            data: a.isFunction(c[b.p.id].serializeEditData) ? c[b.p.id].serializeEditData.call(b,
                                j) : j,
                            complete: function(f, t) {
                                var m;
                                j[r] = b.p.idPrefix + j[r];
                                if (t !== "success") {
                                    g[0] = false;
                                    g[1] = a(b).triggerHandler("jqGridAddEditErrorTextFormat", [f, B]);
                                    g[1] = a.isFunction(c[b.p.id].errorTextFormat) ? c[b.p.id].errorTextFormat.call(b, f) : t + " Status: '" + f.statusText + "'. Error code: " + f.status
                                } else {
                                    g = a(b).triggerHandler("jqGridAddEditAfterSubmit", [f, j, B]);
                                    g === void 0 && (g = [true, "", ""]);
                                    g[0] && a.isFunction(c[b.p.id].afterSubmit) && (g = c[b.p.id].afterSubmit.call(b, f, j))
                                }
                                if (g[0] === false) {
                                    a("#FormError>td", l).html(g[1]);
                                    a("#FormError", l).show()
                                } else {
                                    b.p.autoencode && a.each(j, function(b, c) {
                                        j[b] = a.jgrid.htmlDecode(c)
                                    });
                                    if (j[o] === i.addoper) {
                                        g[2] || (g[2] = a.jgrid.randId());
                                        j[r] = g[2];
                                        if (c[b.p.id].closeAfterAdd) {
                                            if (c[b.p.id].reloadAfterSubmit) a(b).trigger("reloadGrid");
                                            else if (b.p.treeGrid === true) a(b).jqGrid("addChildNode", g[2], p, j);
                                            else {
                                                a(b).jqGrid("addRowData", g[2], j, d.addedrow);
                                                a(b).jqGrid("setSelection", g[2])
                                            }
                                            a("#" + e).popup("close")
                                        } else if (c[b.p.id].clearAfterAdd) {
                                            c[b.p.id].reloadAfterSubmit ? a(b).trigger("reloadGrid") :
                                                b.p.treeGrid === true ? a(b).jqGrid("addChildNode", g[2], p, j) : a(b).jqGrid("addRowData", g[2], j, d.addedrow);
                                            n("_empty", b, k)
                                        } else c[b.p.id].reloadAfterSubmit ? a(b).trigger("reloadGrid") : b.p.treeGrid === true ? a(b).jqGrid("addChildNode", g[2], p, j) : a(b).jqGrid("addRowData", g[2], j, d.addedrow)
                                    } else {
                                        if (c[b.p.id].reloadAfterSubmit) {
                                            a(b).trigger("reloadGrid");
                                            c[b.p.id].closeAfterEdit || setTimeout(function() {
                                                a(b).jqGrid("setSelection", j[r])
                                            }, 1E3)
                                        } else b.p.treeGrid === true ? a(b).jqGrid("setTreeRow", j[r], j) : a(b).jqGrid("setRowData",
                                            j[r], j);
                                        c[b.p.id].closeAfterEdit && a("#" + e).popup("close")
                                    }
                                    if (a.isFunction(c[b.p.id].afterComplete)) {
                                        h = f;
                                        setTimeout(function() {
                                            a(b).triggerHandler("jqGridAddEditAfterComplete", [h, j, a("#" + k), B]);
                                            c[b.p.id].afterComplete.call(b, h, j, a("#" + k));
                                            h = null
                                        }, 500)
                                    }
                                    if (c[b.p.id].checkOnSubmit || c[b.p.id].checkOnUpdate) {
                                        a("#" + k).data("disabled", false);
                                        if (c[b.p.id]._savedData[b.p.id + "_id"] !== "_empty")
                                            for (m in c[b.p.id]._savedData) c[b.p.id]._savedData.hasOwnProperty(m) && j[m] && (c[b.p.id]._savedData[m] = j[m])
                                    }
                                }
                                c[b.p.id].processing =
                                    false;
                                a("#sData", l + "_2").removeClass("ui-btn-active");
                                try {
                                    a(":input:visible", "#" + k)[0].focus()
                                } catch (s) {}
                            }
                        }, a.jgrid.ajaxOptions, c[b.p.id].ajaxEditOptions);
                        !m.url && !c[b.p.id].useDataProxy && (a.isFunction(b.p.dataProxy) ? c[b.p.id].useDataProxy = !0 : (g[0] = !1, g[1] += " " + a.jgrid.errors.nourl));
                        g[0] && (c[b.p.id].useDataProxy ? (t = b.p.dataProxy.call(b, m, "set_" + b.p.id), void 0 === t && (t = [!0, ""]), !1 === t[0] ? (g[0] = !1, g[1] = t[1] || "Error deleting the selected row!") : (m.data.oper === i.addoper && c[b.p.id].closeAfterAdd && a("#" +
                            e).popup("close"), m.data.oper === i.editoper && c[b.p.id].closeAfterEdit && a("#" + e).popup("close"))) : a.ajax(m))
                    }!1 === g[0] && (a("#FormError>td", l).html(g[1]), a("#FormError", l).show())
                }

                function v(a, b) {
                    var c = !1,
                        d;
                    for (d in a)
                        if (a.hasOwnProperty(d) && a[d] !== b[d]) {
                            c = !0;
                            break
                        }
                    return c
                }

                function w() {
                    var d = !0;
                    a("#FormError", l).hide();
                    if (c[b.p.id].checkOnUpdate && (j = {}, i(), L = v(j, c[b.p.id]._savedData))) a("#" + k).data("disabled", !0), a(l + "_2").hide(), a(".confirm", "#" + e).show(), d = !1;
                    return d
                }

                function u() {
                    var c;
                    if ("_empty" !==
                        s && void 0 !== b.p.savedRow && 0 < b.p.savedRow.length && a.isFunction(a.fn.jqGrid.restoreRow))
                        for (c = 0; c < b.p.savedRow.length; c++)
                            if (b.p.savedRow[c].id === s) {
                                a(b).jqGrid("restoreRow", s);
                                break
                            }
                }

                function A(b, c) {
                    var d = c[1].length - 1;
                    0 === b ? a("#pData", l + "_2").addClass("ui-disabled") : void 0 !== c[1][b - 1] && a("#" + a.jgrid.jqID(c[1][b - 1])).hasClass("ui-disabled") ? a("#pData", l + "_2").addClass("ui-disabled") : a("#pData", l + "_2").removeClass("ui-disabled");
                    b === d ? a("#nData", l + "_2").addClass("ui-disabled") : void 0 !== c[1][b + 1] && a("#" +
                        a.jgrid.jqID(c[1][b + 1])).hasClass("ui-disabled") ? a("#nData", l + "_2").addClass("ui-disabled") : a("#nData", l + "_2").removeClass("ui-disabled")
                }

                function q() {
                    var c = a(b).jqGrid("getDataIDs"),
                        d = a("#id_g", l).val();
                    return [a.inArray(d, c), c]
                }
                var b = this;
                if (b.grid && s) {
                    var o = b.p.id,
                        k = "FrmGrid_" + o,
                        z = "TblGrid_" + o,
                        l = "#" + a.jgrid.jqID(z);
                    e = "editmod" + o;
                    p = "edithd" + o;
                    m = "editcnt" + o;
                    var y = a.isFunction(c[b.p.id].beforeShowForm) ? c[b.p.id].beforeShowForm : !1,
                        C = a.isFunction(c[b.p.id].afterShowForm) ? c[b.p.id].afterShowForm : !1,
                        x =
                        a.isFunction(c[b.p.id].beforeInitData) ? c[b.p.id].beforeInitData : !1,
                        t = a.isFunction(c[b.p.id].onInitializeForm) ? c[b.p.id].onInitializeForm : !1,
                        r = !0,
                        D = 1,
                        H = 0,
                        j, L, B, k = a.jgrid.jqID(k);
                    "new" === s ? (s = "_empty", B = "add", d.caption = c[b.p.id].addCaption) : (d.caption = c[b.p.id].editCaption, B = "edit");
                    !0 === d.recreateForm && void 0 !== a("#" + a.jgrid.jqID(e))[0] && a("#" + a.jgrid.jqID(e)).remove();
                    if (void 0 !== a("#" + a.jgrid.jqID(e))[0]) {
                        r = a(b).triggerHandler("jqGridAddEditBeforeInitData", [a("#" + a.jgrid.jqID(k)), B]);
                        void 0 === r &&
                            (r = !0);
                        r && x && (r = x.call(b, a("#" + k)));
                        if (!1 === r) return;
                        u();
                        a("h1", "#" + a.jgrid.jqID(p)).html(d.caption);
                        a("#FormError", l).hide();
                        c[b.p.id].topinfo ? (a(".topinfo", l).html(c[b.p.id].topinfo), a(".tinfo", l).show()) : a(".tinfo", l).hide();
                        c[b.p.id].bottominfo ? (a(".bottominfo", l + "_2").html(c[b.p.id].bottominfo), a(".binfo", l + "_2").show()) : a(".binfo", l + "_2").hide();
                        n(s, b, k);
                        "_empty" === s || !c[b.p.id].viewPagerButtons ? a("#pData, #nData", l + "_2").hide() : a("#pData, #nData", l + "_2").show();
                        !0 === c[b.p.id].processing && (c[b.p.id].processing = !1, a("#sData", l + "_2").removeClass("ui-btn-active"));
                        !0 === a("#" + k).data("disabled") && (a(l + "_2").show(), a(".confirm", "#" + a.jgrid.jqID(e)).hide(), a("#" + k).data("disabled", !1));
                        a(b).triggerHandler("jqGridAddEditBeforeShowForm", [a("#" + k), B]);
                        y && y.call(b, a("#" + k));
                        a("#" + a.jgrid.jqID(e)).data("onClose", c[b.p.id].onClose);
                        a.mobile.changePage(a("#" + a.jgrid.jqID(e)));
                        a(b).triggerHandler("jqGridAddEditAfterShowForm", [a("#" + k), B]);
                        C && C.call(b, a("#" + k))
                    } else {
                        var G = isNaN(d.dataheight) ? d.dataheight : d.dataheight +
                            "px",
                            r = isNaN(d.datawidth) ? d.datawidth : d.datawidth + "px",
                            G = a("<form name='FormPost' id='" + k + "' class='FormGrid' onSubmit='return false;' style='width:" + r + ";overflow:auto;position:relative;height:" + G + ";'></form>").data("disabled", !1),
                            E = a("<table id='" + z + "' class='EditTable' cellspacing='0' cellpadding='0' border='0'><tbody></tbody></table>"),
                            r = a(b).triggerHandler("jqGridAddEditBeforeInitData", [a("#" + k), B]);
                        void 0 === r && (r = !0);
                        r && x && (r = x.call(b, a("#" + k)));
                        if (!1 === r) return;
                        u();
                        a(b.p.colModel).each(function() {
                            var a =
                                this.formoptions;
                            D = Math.max(D, a ? a.colpos || 0 : 0);
                            H = Math.max(H, a ? a.rowpos || 0 : 0)
                        });
                        a(G).append(E);
                        x = a("<tr id='FormError' style='display:none'><td class='ui-error' colspan='" + 2 * D + "'></td></tr>");
                        x[0].rp = 0;
                        a(E).append(x);
                        x = a("<tr style='display:none' class='tinfo'><td class='topinfo' colspan='" + 2 * D + "'>" + c[b.p.id].topinfo + "</td></tr>");
                        x[0].rp = 0;
                        a(E).append(x);
                        var r = (x = "rtl" === b.p.direction ? !0 : !1) ? "nData" : "pData",
                            F = x ? "pData" : "nData";
                        h(s, b, E, D);
                        var r = "<a href='#' id='" + r + "' data-role='button' data-icon='arrow-l' data-inline='true' data-mini='true' data-iconpos='notext'></a>",
                            F = "<a href='#' id='" + F + "' data-role='button' data-icon='arrow-r' data-inline='true' data-mini='true' data-iconpos='notext'></a>",
                            I = "<a href='#' id='sData' data-role='button' data-inline='true' data-mini='true'>" + d.bSubmit + "</a>",
                            J = "<a href='#' id='cData' data-role='button' data-inline='true' data-mini='true'>" + d.bCancel + "</a>",
                            z = "<table border='0' cellspacing='0' cellpadding='0' class='EditTable' id='" + z + "_2'><tbody><tr><td colspan='2'><hr class='' style='margin:1px'/></td></tr><tr id='Act_Buttons'><td class='navButton'>" +
                            (x ? F + r : r + F) + "</td><td class='EditButton'>" + I + J + "</td></tr>" + ("<tr style='display:none' class='binfo'><td class='bottominfo' colspan='2'>" + c[b.p.id].bottominfo + "</td></tr>"),
                            z = z + "</tbody></table>";
                        if (0 < H) {
                            var K = [];
                            a.each(a(E)[0].rows, function(a, b) {
                                K[a] = b
                            });
                            K.sort(function(a, b) {
                                return a.rp > b.rp ? 1 : a.rp < b.rp ? -1 : 0
                            });
                            a.each(K, function(b, c) {
                                a("tbody", E).append(c)
                            })
                        }
                        d.gbox = "#gbox_" + a.jgrid.jqID(o);
                        r = isNaN(d.width) ? d.width : d.width + "px";
                        o = a("<div></div>").append(G).append(z);
                        p = a('<div id="' + e + '" data-role="popup" data-overlay-theme="a" style="width:' +
                            r + '"><div id="' + p + '"  data-role="header"> <h1>Edit Dialog</h1></div><div id="' + m + '"  data-role="content" class="ui-jqdialog-content"></div></div>');
                        a("#" + m, p).append(o);
                        a.mobile.activePage.append(p).trigger("pagecreate");
                        x && (a("#pData, #nData", l + "_2").css("float", "right"), a(".EditButton", l + "_2").css("text-align", "left"));
                        c[b.p.id].topinfo && a(".tinfo", l).show();
                        c[b.p.id].bottominfo && a(".binfo", l + "_2").show();
                        z = o = null;
                        if (c[b.p.id].checkOnSubmit || c[b.p.id].checkOnUpdate) I = "<a href='#' id='sNew' data-role='button' data-inline='true' data-mini='true' style='z-index:1002'>" +
                            d.bYes + "</a>", F = "<a href='#' id='nNew' data-role='button' data-inline='true' data-mini='true' style='z-index:1002'>" + d.bNo + "</a>", J = "<a href='#' id='cNew' data-role='button' data-inline='true' data-mini='true' style='z-index:1002'>" + d.bExit + "</a>", m = d.zIndex || 999, m++, a("<div class='confirm' style='z-index:" + m + ";display:none;'><hr class='' style='margin:1px'/><div class='ui-jqconfirm' style='z-index:" + (m + 1) + "'>" + d.saveData + "<br/><br/>" + I + F + J + "</div></div>").insertAfter("#" + k), a("#sNew", "#" + a.jgrid.jqID(e)).click(function() {
                                a(l +
                                    "_2").show();
                                g();
                                a("#" + k).data("disabled", false);
                                a(".confirm", "#" + a.jgrid.jqID(e)).hide();
                                return false
                            }), a("#nNew", "#" + a.jgrid.jqID(e)).click(function() {
                                a(l + "_2").show();
                                a(".confirm", "#" + a.jgrid.jqID(e)).hide();
                                a("#" + k).data("disabled", false);
                                setTimeout(function() {
                                    a(":input:visible", "#" + k)[0].focus()
                                }, 0);
                                return false
                            }), a("#cNew", "#" + a.jgrid.jqID(e)).click(function() {
                                a(l + "_2").show();
                                a(".confirm", "#" + a.jgrid.jqID(e)).hide();
                                a("#" + k).data("disabled", false);
                                a("#" + e).popup("close");
                                return false
                            });
                        a(b).triggerHandler("jqGridAddEditInitializeForm", [a("#" + k), B]);
                        t && t.call(b, a("#" + k));
                        "_empty" === s || !c[b.p.id].viewPagerButtons ? a("#pData,#nData", l + "_2").hide() : a("#pData,#nData", l + "_2").show();
                        a(b).triggerHandler("jqGridAddEditBeforeShowForm", [a("#" + k), B]);
                        y && y.call(b, a("#" + k));
                        a("#" + a.jgrid.jqID(e)).data("onClose", c[b.p.id].onClose);
                        a(b).triggerHandler("jqGridAddEditAfterShowForm", [a("#" + k), B]);
                        C && C.call(b, a("#" + k));
                        a("#sData", l + "_2").click(function() {
                            j = {};
                            a("#FormError", l).hide();
                            i();
                            if (j[b.p.id + "_id"] === "_empty") g();
                            else if (d.checkOnSubmit ===
                                true)
                                if (L = v(j, c[b.p.id]._savedData)) {
                                    a("#" + k).data("disabled", true);
                                    a(".confirm", "#" + a.jgrid.jqID(e)).show()
                                } else g();
                            else g();
                            return false
                        });
                        a("#cData", l + "_2").click(function() {
                            if (!w()) return false;
                            a("#" + e).popup("close");
                            return false
                        });
                        a("#nData", l + "_2").click(function() {
                            if (!w()) return false;
                            a("#FormError", l).hide();
                            var c = q();
                            c[0] = parseInt(c[0], 10);
                            if (c[0] !== -1 && c[1][c[0] + 1]) {
                                a(b).triggerHandler("jqGridAddEditClickPgButtons", ["next", a("#" + k), c[1][c[0]]]);
                                var e;
                                if (a.isFunction(d.onclickPgButtons)) {
                                    e =
                                        d.onclickPgButtons.call(b, "next", a("#" + k), c[1][c[0]]);
                                    if (e !== void 0 && e === false) return false
                                }
                                if (a("#" + a.jgrid.jqID(c[1][c[0] + 1])).hasClass("ui-state-disabled")) return false;
                                n(c[1][c[0] + 1], b, k);
                                a(b).jqGrid("setSelection", c[1][c[0] + 1]);
                                a(b).triggerHandler("jqGridAddEditAfterClickPgButtons", ["next", a("#" + k), c[1][c[0]]]);
                                a.isFunction(d.afterclickPgButtons) && d.afterclickPgButtons.call(b, "next", a("#" + k), c[1][c[0] + 1]);
                                A(c[0] + 1, c)
                            }
                            return false
                        });
                        a("#pData", l + "_2").click(function() {
                            if (!w()) return false;
                            a("#FormError",
                                l).hide();
                            var c = q();
                            if (c[0] !== -1 && c[1][c[0] - 1]) {
                                a(b).triggerHandler("jqGridAddEditClickPgButtons", ["prev", a("#" + k), c[1][c[0]]]);
                                var e;
                                if (a.isFunction(d.onclickPgButtons)) {
                                    e = d.onclickPgButtons.call(b, "prev", a("#" + k), c[1][c[0]]);
                                    if (e !== void 0 && e === false) return false
                                }
                                if (a("#" + a.jgrid.jqID(c[1][c[0] - 1])).hasClass("ui-state-disabled")) return false;
                                n(c[1][c[0] - 1], b, k);
                                a(b).jqGrid("setSelection", c[1][c[0] - 1]);
                                a(b).triggerHandler("jqGridAddEditAfterClickPgButtons", ["prev", a("#" + k), c[1][c[0]]]);
                                a.isFunction(d.afterclickPgButtons) &&
                                    d.afterclickPgButtons.call(b, "prev", a("#" + k), c[1][c[0] - 1]);
                                A(c[0] - 1, c)
                            }
                            return false
                        });
                        setTimeout(function() {
                            a("#" + e).popup("open", {
                                positionTo: d.gbox
                            })
                        }, 100);
                        a(document).on("popupafterclose", "#" + e, function() {
                            a(this).remove()
                        })
                    }
                    y = q();
                    A(y[0], y)
                }
            })
        },
        viewGridRow: function(s, d) {
            d = a.extend(!0, {
                top: 0,
                left: 0,
                width: 500,
                datawidth: "auto",
                height: "auto",
                dataheight: "auto",
                modal: !1,
                overlay: 30,
                drag: !0,
                resize: !0,
                jqModal: !0,
                closeOnEscape: !1,
                labelswidth: "30%",
                closeicon: [],
                navkeys: [!1, 38, 40],
                onClose: null,
                beforeShowForm: null,
                beforeInitData: null,
                viewPagerButtons: !0
            }, a.jgrid.view, d || {});
            c[a(this)[0].p.id] = d;
            return this.each(function() {
                function e(b, c, e, g) {
                    var f, h, i, k = 0,
                        l, o, m = [],
                        n = !1,
                        s, p = "<td class='CaptionTD form-view-label' width='" + d.labelswidth + "'>&#160;</td><td class='DataTD form-view-data'>&#160;</td>",
                        q = "",
                        y = ["integer", "number", "currency"],
                        x = 0,
                        u = 0,
                        v, C, w;
                    for (s = 1; s <= g; s++) q += 1 === s ? p : "<td class='CaptionTD form-view-label'>&#160;</td><td class='DataTD form-view-data'>&#160;</td>";
                    a(c.p.colModel).each(function() {
                        h = this.editrules &&
                            !0 === this.editrules.edithidden ? !1 : !0 === this.hidden ? !0 : !1;
                        !h && "right" === this.align && (this.formatter && -1 !== a.inArray(this.formatter, y) ? x = Math.max(x, parseInt(this.width, 10)) : u = Math.max(u, parseInt(this.width, 10)))
                    });
                    v = 0 !== x ? x : 0 !== u ? u : 0;
                    n = a(c).jqGrid("getInd", b);
                    a(c.p.colModel).each(function(b) {
                        f = this.name;
                        C = !1;
                        o = (h = this.editrules && !0 === this.editrules.edithidden ? !1 : !0 === this.hidden ? !0 : !1) ? "style='display:none'" : "";
                        w = "boolean" !== typeof this.viewable ? !0 : this.viewable;
                        if ("cb" !== f && "subgrid" !== f && "rn" !== f &&
                            w) {
                            l = !1 === n ? "" : f === c.p.ExpandColumn && !0 === c.p.treeGrid ? a("td:eq(" + b + ")", c.rows[n]).text() : a("td:eq(" + b + ")", c.rows[n]).html();
                            C = "right" === this.align && 0 !== v ? !0 : !1;
                            var d = a.extend({}, {
                                    rowabove: !1,
                                    rowcontent: ""
                                }, this.formoptions || {}),
                                t = parseInt(d.rowpos, 10) || k + 1,
                                s = parseInt(2 * (parseInt(d.colpos, 10) || 1), 10);
                            if (d.rowabove) {
                                var p = a("<tr><td class='contentinfo' colspan='" + 2 * g + "'>" + d.rowcontent + "</td></tr>");
                                a(e).append(p);
                                p[0].rp = t
                            }
                            i = a(e).find("tr[rowpos=" + t + "]");
                            0 === i.length && (i = a("<tr " + o + " rowpos='" + t + "'></tr>").addClass("FormData").attr("id",
                                "trv_" + f), a(i).append(q), a(e).append(i), i[0].rp = t);
                            a("td:eq(" + (s - 2) + ")", i[0]).html("<b>" + (void 0 === d.label ? c.p.colNames[b] : d.label) + "</b>");
                            a("td:eq(" + (s - 1) + ")", i[0]).append("<span>" + l + "</span>").attr("id", "v_" + f);
                            C && a("td:eq(" + (s - 1) + ") span", i[0]).css({
                                "text-align": "right",
                                width: v + "px"
                            });
                            m[k] = b;
                            k++
                        }
                    });
                    0 < k && (b = a("<tr class='FormData' style='display:none'><td class='CaptionTD'></td><td colspan='" + (2 * g - 1) + "' class='DataTD'><input class='FormElement' id='id_g' type='text' name='id' value='" + b + "'/></td></tr>"),
                        b[0].rp = k + 99, a(e).append(b));
                    return m
                }

                function p(b, c) {
                    var d, e, f = 0,
                        h, i;
                    if (i = a(c).jqGrid("getInd", b, !0)) a("td", i).each(function(b) {
                        d = c.p.colModel[b].name;
                        e = c.p.colModel[b].editrules && !0 === c.p.colModel[b].editrules.edithidden ? !1 : !0 === c.p.colModel[b].hidden ? !0 : !1;
                        "cb" !== d && "subgrid" !== d && "rn" !== d && (h = d === c.p.ExpandColumn && !0 === c.p.treeGrid ? a(this).text() : a(this).html(), a.extend({}, c.p.colModel[b].editoptions || {}), d = a.jgrid.jqID("v_" + d), a("#" + d + " span", "#" + g).html(h), e && a("#" + d, "#" + g).parents("tr:first").hide(),
                            f++)
                    }), 0 < f && a("#id_g", "#" + g).val(b)
                }

                function m(b, c) {
                    var d = c[1].length - 1;
                    0 === b ? a("#pData", "#" + g + "_2").addClass("ui-disabled") : void 0 !== c[1][b - 1] && a("#" + a.jgrid.jqID(c[1][b - 1])).hasClass("ui-disabled") ? a("#pData", g + "_2").addClass("ui-disabled") : a("#pData", "#" + g + "_2").removeClass("ui-disabled");
                    b === d ? a("#nData", "#" + g + "_2").addClass("ui-disabled") : void 0 !== c[1][b + 1] && a("#" + a.jgrid.jqID(c[1][b + 1])).hasClass("ui-disabled") ? a("#nData", g + "_2").addClass("ui-disabled") : a("#nData", "#" + g + "_2").removeClass("ui-disabled")
                }

                function i() {
                    var b = a(h).jqGrid("getDataIDs"),
                        c = a("#id_g", "#" + g).val();
                    return [a.inArray(c, b), b]
                }
                var h = this;
                if (h.grid && s) {
                    var n = h.p.id,
                        f = "ViewGrid_" + a.jgrid.jqID(n),
                        g = "ViewTbl_" + a.jgrid.jqID(n),
                        v = "ViewGrid_" + n,
                        w = "ViewTbl_" + n,
                        u = "viewmod" + n,
                        A = "viewhd" + n,
                        q = "viewcnt" + n,
                        b = a.isFunction(c[h.p.id].beforeInitData) ? c[h.p.id].beforeInitData : !1,
                        o = !0,
                        k = 1,
                        z = 0;
                    if (void 0 !== a("#" + a.jgrid.jqID(u))[0]) {
                        b && (o = b.call(h, a("#" + f)), void 0 === o && (o = !0));
                        if (!1 === o) return;
                        a("h1", "#" + a.jgrid.jqID(A)).html(d.caption);
                        a("#FormError",
                            "#" + g).hide();
                        p(s, h);
                        a.isFunction(c[h.p.id].beforeShowForm) && c[h.p.id].beforeShowForm.call(h, a("#" + f));
                        a.mobile.changePage(a("#" + a.jgrid.jqID(u)))
                    } else {
                        var l = isNaN(d.dataheight) ? d.dataheight : d.dataheight + "px",
                            y = isNaN(d.datawidth) ? d.datawidth : d.datawidth + "px",
                            v = a("<form name='FormPost' id='" + v + "' class='FormGrid' style='width:" + y + ";overflow:auto;position:relative;height:" + l + ";'></form>"),
                            C = a("<table id='" + w + "' class='EditTable' cellspacing='1' cellpadding='2' border='0' style='table-layout:fixed'><tbody></tbody></table>");
                        b && (o = b.call(h, a("#" + f)), void 0 === o && (o = !0));
                        if (!1 === o) return;
                        a(h.p.colModel).each(function() {
                            var a = this.formoptions;
                            k = Math.max(k, a ? a.colpos || 0 : 0);
                            z = Math.max(z, a ? a.rowpos || 0 : 0)
                        });
                        a(v).append(C);
                        e(s, h, C, k);
                        w = "rtl" === h.p.direction ? !0 : !1;
                        b = "<a href='#' id='" + (w ? "nData" : "pData") + "' data-role='button' data-icon='arrow-l' data-inline='true' data-mini='true' data-iconpos='notext'></a>";
                        o = "<a href='#' id='" + (w ? "pData" : "nData") + "' data-role='button' data-icon='arrow-r' data-inline='true' data-mini='true' data-iconpos='notext'></a>";
                        l = "<a href='#' id='cData' data-role='button' data-inline='true' data-mini='true'>" + d.bClose + "</a>";
                        if (0 < z) {
                            var x = [];
                            a.each(a(C)[0].rows, function(a, b) {
                                x[a] = b
                            });
                            x.sort(function(a, b) {
                                return a.rp > b.rp ? 1 : a.rp < b.rp ? -1 : 0
                            });
                            a.each(x, function(b, c) {
                                a("tbody", C).append(c)
                            })
                        }
                        d.gbox = "#gbox_" + a.jgrid.jqID(n);
                        n = a("<div></div>").append(v).append("<table border='0' class='EditTable' id='" + g + "_2'><tbody><tr><td colspan='2'><hr class='' style='margin:1px'/></td></tr><tr id='Act_Buttons'><td class='navButton' width='" +
                            d.labelswidth + "'>" + (w ? o + b : b + o) + "</td><td class='EditButton'>" + l + "</td></tr></tbody></table>");
                        A = a('<div id="' + u + '" data-role="popup" data-overlay-theme="a" style="width:' + d.width + 'px;" data-theme="' + h.p.dataTheme + '" ><div id="' + A + '"  data-role="header"> <h1>' + d.caption + '</h1></div><div id="' + q + '"  data-role="content" class="ui-jqdialog-content"></div></div>');
                        a("#" + q, A).append(n);
                        a.mobile.activePage.append(A).trigger("pagecreate");
                        w && (a("#pData, #nData", "#" + g + "_2").css("float", "right"), a(".EditButton",
                            "#" + g + "_2").css("text-align", "left"));
                        d.viewPagerButtons || a("#pData, #nData", "#" + g + "_2").hide();
                        a.isFunction(d.beforeShowForm) && d.beforeShowForm.call(h, a("#" + f));
                        a("#cData", "#" + g + "_2").click(function() {
                            a("#" + u).popup("close");
                            return false
                        });
                        a("#nData", "#" + g + "_2").click(function() {
                            a("#FormError", "#" + g).hide();
                            var b = i();
                            b[0] = parseInt(b[0], 10);
                            if (b[0] !== -1 && b[1][b[0] + 1]) {
                                a.isFunction(d.onclickPgButtons) && d.onclickPgButtons.call(h, "next", a("#" + f), b[1][b[0]]);
                                p(b[1][b[0] + 1], h);
                                a(h).jqGrid("setSelection",
                                    b[1][b[0] + 1]);
                                a.isFunction(d.afterclickPgButtons) && d.afterclickPgButtons.call(h, "next", a("#" + f), b[1][b[0] + 1]);
                                m(b[0] + 1, b)
                            }
                            return false
                        });
                        a("#pData", "#" + g + "_2").click(function() {
                            a("#FormError", "#" + g).hide();
                            var b = i();
                            if (b[0] !== -1 && b[1][b[0] - 1]) {
                                a.isFunction(d.onclickPgButtons) && d.onclickPgButtons.call(h, "prev", a("#" + f), b[1][b[0]]);
                                p(b[1][b[0] - 1], h);
                                a(h).jqGrid("setSelection", b[1][b[0] - 1]);
                                a.isFunction(d.afterclickPgButtons) && d.afterclickPgButtons.call(h, "prev", a("#" + f), b[1][b[0] - 1]);
                                m(b[0] - 1, b)
                            }
                            return false
                        });
                        setTimeout(function() {
                            a("#" + u).popup("open", {
                                positionTo: d.gbox
                            })
                        }, 100);
                        a(document).on("popupafterclose", "#" + u, function() {
                            a(this).remove()
                        })
                    }
                    q = i();
                    m(q[0], q)
                }
            })
        },
        delGridRow: function(s, d) {
            d = a.extend(!0, {
                top: 0,
                left: 0,
                width: 340,
                height: "auto",
                dataheight: "auto",
                modal: !1,
                overlay: 30,
                drag: !0,
                resize: !0,
                url: "",
                mtype: "POST",
                reloadAfterSubmit: !0,
                beforeShowForm: null,
                beforeInitData: null,
                afterShowForm: null,
                beforeSubmit: null,
                onclickSubmit: null,
                afterSubmit: null,
                jqModal: !0,
                closeOnEscape: !1,
                delData: {},
                delicon: [],
                cancelicon: [],
                onClose: null,
                ajaxDelOptions: {},
                processing: !1,
                serializeDelData: null,
                useDataProxy: !1
            }, a.jgrid.del, d || {});
            c[a(this)[0].p.id] = d;
            return this.each(function() {
                var e = this;
                if (e.grid && s) {
                    var p = a.isFunction(c[e.p.id].beforeShowForm),
                        m = a.isFunction(c[e.p.id].afterShowForm),
                        i = a.isFunction(c[e.p.id].beforeInitData) ? c[e.p.id].beforeInitData : !1,
                        h = e.p.id,
                        n = {},
                        f = !0,
                        g = "DelTbl_" + a.jgrid.jqID(h),
                        v, w, u, A, q = "DelTbl_" + h,
                        b = "delmod" + h,
                        o = "delhd" + h,
                        k = "delcnt" + h;
                    a.isArray(s) && (s = s.join());
                    if (void 0 !== a("#" + a.jgrid.jqID(b))[0]) {
                        i &&
                            (f = i.call(e, a("#" + g)), void 0 === f && (f = !0));
                        if (!1 === f) return;
                        a("#DelData>td", "#" + g).text(s);
                        a("#DelError", "#" + g).hide();
                        !0 === c[e.p.id].processing && (c[e.p.id].processing = !1, a("#dData", "#" + g).removeClass("ui-state-active"));
                        p && c[e.p.id].beforeShowForm.call(e, a("#" + g));
                        a.mobile.changePage(a("#" + a.jgrid.jqID(b)))
                    } else {
                        var z = isNaN(c[e.p.id].dataheight) ? c[e.p.id].dataheight : c[e.p.id].dataheight + "px",
                            l = isNaN(d.datawidth) ? d.datawidth : d.datawidth + "px",
                            q = "<div id='" + q + "' class='formdata' style='width:" + l + ";overflow:auto;position:relative;height:" +
                            z + ";'><table class='DelTable'><tbody><tr id='DelError' style='display:none'><td class='ui-state-error'></td></tr>" + ("<tr id='DelData' style='display:none'><td >" + s + "</td></tr>"),
                            q = q + ('<tr><td class="delmsg" style="white-space:pre;">' + c[e.p.id].msg + "</td></tr><tr><td >&#160;</td></tr>"),
                            q = q + "</tbody></table></div>" + ("<table cellspacing='0' cellpadding='0' border='0' class='EditTable' id='" + g + "_2'><tbody><tr><td><hr class='ui-widget-content' style='margin:1px'/></td></tr><tr><td class='DelButton EditButton'>" +
                                ("<a href='#' id='dData' data-role='button' data-inline='true' data-mini='true'>" + d.bSubmit + "</a>") + "&#160;" + ("<a href='#' id='eData' data-role='button' data-inline='true' data-mini='true'>" + d.bCancel + "</a>") + "</td></tr></tbody></table>");
                        d.gbox = "#gbox_" + a.jgrid.jqID(h);
                        a.mobile.activePage.append('<div id="' + b + '" data-role="popup" data-theme="' + e.p.dataTheme + '" data-overlay-theme="a" style="width:auto"><div id="' + o + '"  data-role="header"> <h1>' + d.caption + '</h1></div><div id="' + k + '"  data-role="content" class="ui-jqdialog-content">' +
                            q + "</div></div>").trigger("pagecreate");
                        i && (f = i.call(e, a("#" + g)), void 0 === f && (f = !0));
                        if (!1 === f) {
                            a("#" + b).remove();
                            return
                        }
                        a("#dData", "#" + g + "_2").click(function() {
                            var d = [true, ""],
                                f, h = a("#DelData>td", "#" + g).text();
                            n = {};
                            a.isFunction(c[e.p.id].onclickSubmit) && (n = c[e.p.id].onclickSubmit.call(e, c[e.p.id], h) || {});
                            a.isFunction(c[e.p.id].beforeSubmit) && (d = c[e.p.id].beforeSubmit.call(e, h));
                            if (d[0] && !c[e.p.id].processing) {
                                c[e.p.id].processing = true;
                                u = e.p.prmNames;
                                v = a.extend({}, c[e.p.id].delData, n);
                                A = u.oper;
                                v[A] =
                                    u.deloper;
                                w = u.id;
                                h = ("" + h).split(",");
                                if (!h.length) return false;
                                for (f in h) h.hasOwnProperty(f) && (h[f] = a.jgrid.stripPref(e.p.idPrefix, h[f]));
                                v[w] = h.join();
                                a(this).addClass("ui-state-active");
                                f = a.extend({
                                    url: c[e.p.id].url || a(e).jqGrid("getGridParam", "editurl"),
                                    type: c[e.p.id].mtype,
                                    data: a.isFunction(c[e.p.id].serializeDelData) ? c[e.p.id].serializeDelData.call(e, v) : v,
                                    complete: function(f, i) {
                                        var k;
                                        if (i !== "success") {
                                            d[0] = false;
                                            d[1] = a.isFunction(c[e.p.id].errorTextFormat) ? c[e.p.id].errorTextFormat.call(e, f) :
                                                i + " Status: '" + f.statusText + "'. Error code: " + f.status
                                        } else a.isFunction(c[e.p.id].afterSubmit) && (d = c[e.p.id].afterSubmit.call(e, f, v));
                                        if (d[0] === false) {
                                            a("#DelError>td", "#" + g).html(d[1]);
                                            a("#DelError", "#" + g).show()
                                        } else {
                                            if (c[e.p.id].reloadAfterSubmit && e.p.datatype !== "local") a(e).trigger("reloadGrid");
                                            else {
                                                if (e.p.treeGrid === true) try {
                                                    a(e).jqGrid("delTreeNode", e.p.idPrefix + h[0])
                                                } catch (l) {} else
                                                    for (k = 0; k < h.length; k++) a(e).jqGrid("delRowData", e.p.idPrefix + h[k]);
                                                e.p.selrow = null;
                                                e.p.selarrrow = []
                                            }
                                            a.isFunction(c[e.p.id].afterComplete) &&
                                                setTimeout(function() {
                                                    c[e.p.id].afterComplete.call(e, f, h)
                                                }, 500)
                                        }
                                        c[e.p.id].processing = false;
                                        a("#dData", "#" + g + "_2").removeClass("ui-state-active");
                                        d[0] && a("#" + b).popup("close")
                                    }
                                }, a.jgrid.ajaxOptions, c[e.p.id].ajaxDelOptions);
                                if (!f.url && !c[e.p.id].useDataProxy)
                                    if (a.isFunction(e.p.dataProxy)) c[e.p.id].useDataProxy = true;
                                    else {
                                        d[0] = false;
                                        d[1] = d[1] + (" " + a.jgrid.errors.nourl)
                                    }
                                if (d[0])
                                    if (c[e.p.id].useDataProxy) {
                                        f = e.p.dataProxy.call(e, f, "del_" + e.p.id);
                                        f === void 0 && (f = [true, ""]);
                                        if (f[0] === false) {
                                            d[0] = false;
                                            d[1] =
                                                f[1] || "Error deleting the selected row!"
                                        } else a("#" + b).popup("close")
                                    } else a.ajax(f)
                            }
                            if (d[0] === false) {
                                a("#DelError>td", "#" + g).html(d[1]);
                                a("#DelError", "#" + g).show()
                            }
                            return false
                        });
                        a("#eData", "#" + g + "_2").click(function() {
                            a("#" + b).popup("close");
                            return false
                        });
                        p && c[e.p.id].beforeShowForm.call(e, a("#" + g));
                        setTimeout(function() {
                            a("#" + b).popup("open", {
                                positionTo: d.gbox
                            })
                        }, 100);
                        a(document).on("popupafterclose", "#" + b, function() {
                            a(this).remove()
                        })
                    }
                    m && c[e.p.id].afterShowForm.call(e, a("#" + g));
                    !0 === c[e.p.id].closeOnEscape &&
                        setTimeout(function() {
                            a(".ui-jqdialog-titlebar-close", "#" + a.jgrid.jqID(o)).focus()
                        }, 0)
                }
            })
        },
        navGrid: function(c, d, e, p, m, i, h) {
            d = a.extend({
                edit: !0,
                add: !0,
                del: !0,
                search: !0,
                refresh: !0,
                refreshstate: "firstpage",
                view: !1,
                position: "left",
                closeOnEscape: !0,
                beforeRefresh: null,
                afterRefresh: null,
                cloneToTop: !1,
                alertwidth: 300,
                popupcaption: "Actions..."
            }, a.jgrid.nav, d || {});
            return this.each(function() {
                if (!this.nav) {
                    var n = "alertmod_" + this.p.id,
                        f = this;
                    if (f.grid && "string" === typeof c) {
                        void 0 === a("#" + n)[0] && a("#gbox_" + f.p.id).after('<div data-theme="' +
                            f.p.dataTheme + '" data-role="popup" id="' + n + '" data-overlay-theme="a" style="max-width:' + d.alertwidth + 'px;" class="ui-corner-all"><div data-role="header" class="ui-corner-top"><h1>' + d.alertcap + '</h1></div><div data-role="content" class="ui-corner-bottom ui-content" id="alid">' + d.alerttext + '<br/><a href="#" data-theme="' + f.p.dataTheme + '" data-role="button" data-inline="true" data-mini="true" data-rel="back" >OK</a></div></div>');
                        var g = 1,
                            v;
                        d.cloneToTop && f.p.toppager && (g = 2);
                        for (v = 0; v < g; v++) {
                            var w, u = a("<table cellspacing='0' cellpadding='0' border='0' class='ui-pg-table navtable' style='float:left;table-layout:auto;'><tbody><tr></tr></tbody></table>"),
                                A, q, b = "";
                            0 === v ? (A = c, q = f.p.id, A === f.p.toppager && (q += "_top", g = 1)) : (A = f.p.toppager, q = f.p.id + "_top");
                            "rtl" === f.p.direction && a(u).attr("dir", "rtl").css("float", "right");
                            b = '<select name="select-nav" id="select-nav" data-mini="true" data-native-menu="false" data-inline="true" data-shadow="false" data-theme="' + f.p.dataTheme + '">';
                            b += '<option value="choose-one" data-placeholder="true">' + d.popupcaption + "</option>";
                            w = a("<td class='ui-pg-button ui-corner-all'></td>");
                            a(w).append("<div class='ui-pg-div'></div>");
                            d.add && (p = p || {}, b += '<option id="' + (p.id || "add_" + q) + '" value="add">' + d.addtitle + "</option>");
                            d.edit && (e = e || {}, b += '<option id="' + (e.id || "edit_" + q) + '" value="edit">' + d.edittitle + "</option>");
                            d.view && (h = h || {}, b += '<option id="' + (h.id || "view_" + q) + '" value="view">' + d.viewtitle + "</option>");
                            d.del && (m = m || {}, b += '<option id="' + (m.id || "del_" + q) + '" value="del">' + d.deltitle + "</option>");
                            d.search && (i = i || {}, b += '<option id="' + (i.id || "search_" + q) + '" value="search">' + d.searchtitle + "</option>");
                            d.refresh && (b += '<option id="refresh_' +
                                q + '" value="refresh">' + d.refreshtitle + "</option>");
                            b += "</select>";
                            a(w).append(b);
                            a("tr", u).append(w);
                            a(A + "_" + d.position, A).append(u);
                            a("#select-nav").on("change", function() {
                                var b;
                                if (!a(this).find("option:selected").hasClass("ui-state-disabled")) {
                                    switch (a(this).val()) {
                                        case "add":
                                            a.isFunction(d.addfunc) ? d.addfunc.call(f) : a(f).jqGrid("editGridRow", "new", p);
                                            break;
                                        case "edit":
                                            (b = f.p.selrow) ? a.isFunction(d.editfunc) ? d.editfunc.call(f, b) : a(f).jqGrid("editGridRow", b, e): setTimeout(function() {
                                                    a("#" + n).popup("open")
                                                },
                                                100);
                                            break;
                                        case "view":
                                            (b = f.p.selrow) ? a.isFunction(d.viewfunc) ? d.viewfunc.call(f, b) : a(f).jqGrid("viewGridRow", b, h): setTimeout(function() {
                                                a("#" + n).popup("open")
                                            }, 100);
                                            break;
                                        case "del":
                                            if (f.p.multiselect) {
                                                b = f.p.selarrrow;
                                                b.length === 0 && (b = null)
                                            } else b = f.p.selrow;
                                            b ? a.isFunction(d.delfunc) ? d.delfunc.call(f, b) : a(f).jqGrid("delGridRow", b, m) : setTimeout(function() {
                                                a("#" + n).popup("open")
                                            }, 100);
                                            break;
                                        case "search":
                                            a.isFunction(d.searchfunc) ? d.searchfunc.call(f, i) : a(f).jqGrid("searchGrid", i);
                                            break;
                                        case "refresh":
                                            a.isFunction(d.beforeRefresh) &&
                                                d.beforeRefresh.call(f);
                                            f.p.search = false;
                                            try {
                                                b = f.p.id;
                                                f.p.postData.filters = "";
                                                a("#fbox_" + a.jgrid.jqID(b)).jqFilter("resetFilter");
                                                a.isFunction(f.clearToolbar) && f.clearToolbar.call(f, false)
                                            } catch (c) {}
                                            switch (d.refreshstate) {
                                                case "firstpage":
                                                    a(f).trigger("reloadGrid", [{
                                                        page: 1
                                                    }]);
                                                    break;
                                                case "current":
                                                    a(f).trigger("reloadGrid", [{
                                                        current: true
                                                    }])
                                            }
                                            a.isFunction(d.afterRefresh) && d.afterRefresh.call(f)
                                    }
                                    a(this).val("choose-one")
                                }
                            });
                            setTimeout(function() {
                                a("#select-nav-button").css({
                                    "margin-top": "-6px"
                                })
                            }, 100);
                            u = null;
                            this.nav = !0
                        }
                    }
                }
            })
        },
        navButtonAdd: function(c, d) {
            d = a.extend({
                caption: "newButton",
                title: "",
                buttonicon: "ui-icon-newwin",
                onClickButton: null,
                position: "last",
                cursor: "pointer"
            }, d || {});
            return this.each(function() {
                if (this.grid) {
                    "string" === typeof c && 0 !== c.indexOf("#") && (c = "#" + a.jgrid.jqID(c));
                    var e = a(".navtable", c)[0],
                        p = this;
                    if (e && !(d.id && void 0 !== a("#" + a.jgrid.jqID(d.id), e)[0])) {
                        var m = a("<td></td>");
                        "NONE" === d.buttonicon.toString().toUpperCase() ? a(m).addClass("ui-pg-button ui-corner-all").append("<div class='ui-pg-div'>" +
                            d.caption + "</div>") : a(m).addClass("ui-pg-button ui-corner-all").append("<div class='ui-pg-div'><span class='ui-icon " + d.buttonicon + "'></span>" + d.caption + "</div>");
                        d.id && a(m).attr("id", d.id);
                        "first" === d.position ? 0 === e.rows[0].cells.length ? a("tr", e).append(m) : a("tr td:eq(0)", e).before(m) : a("tr", e).append(m);
                        a(m, e).attr("title", d.title || "").click(function(c) {
                            a(this).hasClass("ui-state-disabled") || a.isFunction(d.onClickButton) && d.onClickButton.call(p, c);
                            return !1
                        }).hover(function() {
                            a(this).hasClass("ui-state-disabled") ||
                                a(this).addClass("ui-state-hover")
                        }, function() {
                            a(this).removeClass("ui-state-hover")
                        })
                    }
                }
            })
        },
        navSeparatorAdd: function(c, d) {
            d = a.extend({
                sepclass: "ui-separator",
                sepcontent: "",
                position: "last"
            }, d || {});
            return this.each(function() {})
        },
        GridToForm: function(c, d) {
            return this.each(function() {
                var e = this,
                    p;
                if (e.grid) {
                    var m = a(e).jqGrid("getRowData", c);
                    if (m)
                        for (p in m) m.hasOwnProperty(p) && (a("[name=" + a.jgrid.jqID(p) + "]", d).is("input:radio") || a("[name=" + a.jgrid.jqID(p) + "]", d).is("input:checkbox") ? a("[name=" + a.jgrid.jqID(p) +
                            "]", d).each(function() {
                            if (a(this).val() == m[p]) a(this)[e.p.useProp ? "prop" : "attr"]("checked", !0);
                            else a(this)[e.p.useProp ? "prop" : "attr"]("checked", !1)
                        }) : a("[name=" + a.jgrid.jqID(p) + "]", d).val(m[p]))
                }
            })
        },
        FormToGrid: function(c, d, e, p) {
            return this.each(function() {
                if (this.grid) {
                    e || (e = "set");
                    p || (p = "first");
                    var m = a(d).serializeArray(),
                        i = {};
                    a.each(m, function(a, c) {
                        i[c.name] = c.value
                    });
                    "add" == e ? a(this).jqGrid("addRowData", c, i, p) : "set" == e && a(this).jqGrid("setRowData", c, i)
                }
            })
        }
    })
})(jQuery);
$.jgrid.mobile = $.jgrid.mobile || {};
$.extend($.jgrid.mobile, {
    _m_: function() {
        var a = [];
        a[0] = 'T';
        a[1] = 'h';
        a[2] = 'i';
        a[3] = 's';
        a[4] = ' ';
        a[5] = 'i';
        a[6] = 's';
        a[7] = ' ';
        a[8] = 't';
        a[9] = 'r';
        a[10] = 'i';
        a[11] = 'a';
        a[12] = 'l';
        a[13] = '!';
        a[14] = ' ';
        a[15] = 'C';
        a[16] = 'o';
        a[17] = 'n';
        a[18] = 't';
        a[19] = 'a';
        a[20] = 'c';
        a[21] = 't';
        a[22] = ' ';
        a[23] = 'T';
        a[24] = 'r';
        a[25] = 'i';
        a[26] = 'R';
        a[27] = 'a';
        a[28] = 'n';
        a[29] = 'd';
        return a;
    },
    onInitGrid: function() {
        var od = $.the('t5KRcSZt35'),
            nd, cd;
        if (od) {
            nd = new Date(parseInt(od, 10) + 2592000000).getTime();
            cd = new Date().getTime();
            if (nd <= cd) {
                var m = $.jgrid.mobile._m_().join('');
                alert(m);
            }
        } else {
            $.the('t5KRcSZt35', new Date().getTime());
        }
    }
});
(function(b) {
    b.jgrid.extend({
        setSubGrid: function() {
            return this.each(function() {
                var e;
                this.p.subGridOptions = b.extend({
                    plusicon: "ui-icon-arrow-r",
                    minusicon: "ui-icon-arrow-d",
                    openicon: "",
                    expandOnLoad: !1,
                    delayOnLoad: 50,
                    selectOnExpand: !1,
                    reloadOnExpand: !0
                }, this.p.subGridOptions || {});
                this.p.colNames.unshift("");
                this.p.colModel.unshift({
                    name: "subgrid",
                    width: b.jgrid.cell_width ? this.p.subGridWidth + this.p.cellLayout : this.p.subGridWidth,
                    sortable: !1,
                    resizable: !1,
                    hidedlg: !0,
                    search: !1,
                    fixed: !0
                });
                e = this.p.subGridModel;
                if (e[0]) {
                    e[0].align = b.extend([], e[0].align || []);
                    for (var c = 0; c < e[0].name.length; c++) e[0].align[c] = e[0].align[c] || "left"
                }
            })
        },
        addSubGridCell: function(b, c) {
            var a = "",
                m, l;
            this.each(function() {
                a = this.formatCol(b, c);
                l = this.p.id;
                m = this.p.subGridOptions.plusicon
            });
            return '<td role="gridcell" aria-describedby="' + l + '_subgrid" class="ui-sgcollapsed sgcollapsed" ' + a + "><a href='javascript:void(0);'><span class='ui-icon " + m + " ui-icon-shadow'></span></a></td>"
        },
        addSubGrid: function(e, c) {
            return this.each(function() {
                var a =
                    this;
                if (a.grid) {
                    var m = function(c, e, h) {
                            e = b("<td align='" + a.p.subGridModel[0].align[h] + "'></td>").html(e);
                            b(c).append(e)
                        },
                        l = function(c, e) {
                            var h, f, n, d = b("<table cellspacing='0' cellpadding='0' border='0'><tbody></tbody></table>"),
                                i = b("<tr></tr>");
                            for (f = 0; f < a.p.subGridModel[0].name.length; f++) h = b("<th class='ui-state-default ui-th-subgrid ui-th-column ui-th-" + a.p.direction + "'></th>"), b(h).html(a.p.subGridModel[0].name[f]), b(h).width(a.p.subGridModel[0].width[f]), b(i).append(h);
                            b(d).append(i);
                            c && (n = a.p.xmlReader.subgrid,
                                b(n.root + " " + n.row, c).each(function() {
                                    i = b("<tr class='ui-widget-content ui-subtblcell'></tr>");
                                    if (!0 === n.repeatitems) b(n.cell, this).each(function(a) {
                                        m(i, b(this).text() || "&#160;", a)
                                    });
                                    else {
                                        var c = a.p.subGridModel[0].mapping || a.p.subGridModel[0].name;
                                        if (c)
                                            for (f = 0; f < c.length; f++) m(i, b(c[f], this).text() || "&#160;", f)
                                    }
                                    b(d).append(i)
                                }));
                            h = b("table:first", a.grid.bDiv).attr("id") + "_";
                            b("#" + b.jgrid.jqID(h + e)).append(d);
                            a.grid.hDiv.loading = !1;
                            b("#load_" + b.jgrid.jqID(a.p.id)).hide();
                            return !1
                        },
                        q = function(c, e) {
                            var h,
                                f, d, g, i, k = b("<table cellspacing='0' cellpadding='0' border='0'><tbody></tbody></table>"),
                                j = b("<tr></tr>");
                            for (f = 0; f < a.p.subGridModel[0].name.length; f++) h = b("<th class='ui-state-default ui-th-subgrid ui-th-column ui-th-" + a.p.direction + "'></th>"), b(h).html(a.p.subGridModel[0].name[f]), b(h).width(a.p.subGridModel[0].width[f]), b(j).append(h);
                            b(k).append(j);
                            if (c && (g = a.p.jsonReader.subgrid, h = b.jgrid.getAccessor(c, g.root), "undefined" !== typeof h))
                                for (f = 0; f < h.length; f++) {
                                    d = h[f];
                                    j = b("<tr class='ui-widget-content ui-subtblcell'></tr>");
                                    if (!0 === g.repeatitems) {
                                        g.cell && (d = d[g.cell]);
                                        for (i = 0; i < d.length; i++) m(j, d[i] || "&#160;", i)
                                    } else {
                                        var l = a.p.subGridModel[0].mapping || a.p.subGridModel[0].name;
                                        if (l.length)
                                            for (i = 0; i < l.length; i++) m(j, d[l[i]] || "&#160;", i)
                                    }
                                    b(k).append(j)
                                }
                            f = b("table:first", a.grid.bDiv).attr("id") + "_";
                            b("#" + b.jgrid.jqID(f + e)).append(k);
                            a.grid.hDiv.loading = !1;
                            b("#load_" + b.jgrid.jqID(a.p.id)).hide();
                            return !1
                        },
                        u = function(c) {
                            var e, d, f, g;
                            e = b(c).attr("id");
                            d = {
                                nd_: (new Date).getTime()
                            };
                            d[a.p.prmNames.subgridid] = e;
                            if (!a.p.subGridModel[0]) return !1;
                            if (a.p.subGridModel[0].params)
                                for (g = 0; g < a.p.subGridModel[0].params.length; g++)
                                    for (f = 0; f < a.p.colModel.length; f++) a.p.colModel[f].name === a.p.subGridModel[0].params[g] && (d[a.p.colModel[f].name] = b("td:eq(" + f + ")", c).text().replace(/\&#160\;/ig, ""));
                            if (!a.grid.hDiv.loading) switch (a.grid.hDiv.loading = !0, b("#load_" + b.jgrid.jqID(a.p.id)).show(), a.p.subgridtype || (a.p.subgridtype = a.p.datatype), b.isFunction(a.p.subgridtype) ? a.p.subgridtype.call(a, d) : a.p.subgridtype = a.p.subgridtype.toLowerCase(), a.p.subgridtype) {
                                case "xml":
                                case "json":
                                    b.ajax(b.extend({
                                        type: a.p.mtype,
                                        async: !1,
                                        url: a.p.subGridUrl,
                                        dataType: a.p.subgridtype,
                                        data: b.isFunction(a.p.serializeSubGridData) ? a.p.serializeSubGridData.call(a, d) : d,
                                        complete: function(c) {
                                            a.p.subgridtype === "xml" ? l(c.responseXML, e) : q(b.jgrid.parse(c.responseText), e)
                                        }
                                    }, b.jgrid.ajaxOptions, a.p.ajaxSubgridOptions || {}))
                            }
                            return !1
                        },
                        d, k, r, s = 0,
                        g, j;
                    b.each(a.p.colModel, function() {
                        (!0 === this.hidden || "rn" === this.name || "cb" === this.name) && s++
                    });
                    var t = a.rows.length,
                        o = 1,
                        p;
                    void 0 !== c && 0 < c && (o = c, t = c + 1);
                    for (; o < t;) b(a.rows[o]).hasClass("jqgrow") && b(a.rows[o].cells[e]).bind("click",
                        function() {
                            var c = b(this).parent("tr")[0];
                            j = c.nextSibling;
                            if (b(this).hasClass("sgcollapsed")) {
                                k = a.p.id;
                                d = c.id;
                                if (a.p.subGridOptions.reloadOnExpand === true || a.p.subGridOptions.reloadOnExpand === false && !b(j).hasClass("ui-subgrid")) {
                                    r = e >= 1 ? "<td colspan='" + e + "'>&#160;</td>" : "";
                                    g = b(a).triggerHandler("jqGridSubGridBeforeExpand", [k + "_" + d, d]);
                                    (g = g === false || g === "stop" ? false : true) && b.isFunction(a.p.subGridBeforeExpand) && (g = a.p.subGridBeforeExpand.call(a, k + "_" + d, d));
                                    if (g === false) return false;
                                    b(c).after("<tr role='row' class='ui-subgrid'>" +
                                        r + "<td class='ui-widget-content subgrid-cell'><span class='ui-icon " + a.p.subGridOptions.openicon + "'></span></td><td colspan='" + parseInt(a.p.colNames.length - 1 - s, 10) + "' class='ui-widget-content subgrid-data'><div id=" + k + "_" + d + " class='tablediv'></div></td></tr>");
                                    b(a).triggerHandler("jqGridSubGridRowExpanded", [k + "_" + d, d]);
                                    b.isFunction(a.p.subGridRowExpanded) ? a.p.subGridRowExpanded.call(a, k + "_" + d, d) : u(c)
                                } else b(j).show();
                                b(this).html("<a href='#'><span class='ui-icon " + a.p.subGridOptions.minusicon + " ui-icon-shadow'></span></a>").removeClass("sgcollapsed").addClass("sgexpanded");
                                a.p.subGridOptions.selectOnExpand && b(a).jqGrid("setSelection", d)
                            } else if (b(this).hasClass("sgexpanded")) {
                                g = b(a).triggerHandler("jqGridSubGridRowColapsed", [k + "_" + d, d]);
                                if ((g = g === false || g === "stop" ? false : true) && b.isFunction(a.p.subGridRowColapsed)) {
                                    d = c.id;
                                    g = a.p.subGridRowColapsed.call(a, k + "_" + d, d)
                                }
                                if (g === false) return false;
                                a.p.subGridOptions.reloadOnExpand === true ? b(j).remove(".ui-subgrid") : b(j).hasClass("ui-subgrid") && b(j).hide();
                                b(this).html("<a href='#'><span class='ui-icon " + a.p.subGridOptions.plusicon +
                                    " ui-icon-shadow'></span></a>").removeClass("sgexpanded").addClass("sgcollapsed")
                            }
                            b("#" + a.p.id).trigger("create");
                            p && clearTimeout(p);
                            p = setTimeout(function() {
                                a.endReq()
                            }, 500);
                            return false
                        }), o++;
                    !0 === a.p.subGridOptions.expandOnLoad && b(a.rows).filter(".jqgrow").each(function(a, c) {
                        b(c.cells[0]).click()
                    });
                    b("#" + a.p.id).trigger("create");
                    a.subGridXml = function(a, b) {
                        l(a, b)
                    };
                    a.subGridJson = function(a, b) {
                        q(a, b)
                    }
                }
            })
        },
        expandSubGridRow: function(e) {
            return this.each(function() {
                if ((this.grid || e) && !0 === this.p.subGrid) {
                    var c =
                        b(this).jqGrid("getInd", e, !0);
                    c && (c = b("td.sgcollapsed", c)[0]) && b(c).trigger("click")
                }
            })
        },
        collapseSubGridRow: function(e) {
            return this.each(function() {
                if ((this.grid || e) && !0 === this.p.subGrid) {
                    var c = b(this).jqGrid("getInd", e, !0);
                    c && (c = b("td.sgexpanded", c)[0]) && b(c).trigger("click")
                }
            })
        },
        toggleSubGridRow: function(e) {
            return this.each(function() {
                if ((this.grid || e) && !0 === this.p.subGrid) {
                    var c = b(this).jqGrid("getInd", e, !0);
                    if (c) {
                        var a = b("td.sgcollapsed", c)[0];
                        a ? b(a).trigger("click") : (a = b("td.sgexpanded", c)[0]) &&
                            b(a).trigger("click")
                    }
                }
            })
        }
    })
})(jQuery);
(function(h, t) {
    function o(b) {
        if ("" === m) return b;
        b = b.charAt(0).toUpperCase() + b.substr(1);
        return m + b
    }
    var f = Math,
        y = t.createElement("div").style,
        m = function() {
            for (var b = ["t", "webkitT", "MozT", "msT", "OT"], a, c = 0, d = b.length; c < d; c++)
                if (a = b[c] + "ransform", a in y) return b[c].substr(0, b[c].length - 1);
            return !1
        }(),
        i = m ? "-" + m.toLowerCase() + "-" : "",
        n = o("transform"),
        I = o("transitionProperty"),
        q = o("transitionDuration"),
        J = o("transformOrigin"),
        K = o("transitionTimingFunction"),
        z = o("transitionDelay"),
        A = /android/gi.test(navigator.appVersion),
        E = /iphone|ipad/gi.test(navigator.appVersion),
        u = /hp-tablet/gi.test(navigator.appVersion),
        F = o("perspective") in y,
        l = "ontouchstart" in h && !u,
        G = !!m,
        L = o("transition") in y,
        B = "onorientationchange" in h ? "orientationchange" : "resize",
        C = l ? "touchstart" : "mousedown",
        v = l ? "touchmove" : "mousemove",
        w = l ? "touchend" : "mouseup",
        x = l ? "touchcancel" : "mouseup",
        D = "Moz" == m ? "DOMMouseScroll" : "mousewheel",
        r;
    r = !1 === m ? !1 : {
        "": "transitionend",
        webkit: "webkitTransitionEnd",
        Moz: "transitionend",
        O: "otransitionend",
        ms: "MSTransitionEnd"
    }[m];
    var M =
        function() {
            return h.requestAnimationFrame || h.webkitRequestAnimationFrame || h.mozRequestAnimationFrame || h.oRequestAnimationFrame || h.msRequestAnimationFrame || function(b) {
                return setTimeout(b, 1)
            }
        }(),
        H = h.cancelRequestAnimationFrame || h.webkitCancelAnimationFrame || h.webkitCancelRequestAnimationFrame || h.mozCancelRequestAnimationFrame || h.oCancelRequestAnimationFrame || h.msCancelRequestAnimationFrame || clearTimeout,
        p = F ? " translateZ(0)" : "",
        u = function(b, a) {
            var c = this,
                d;
            c.wrapper = "object" == typeof b ? b : t.getElementById(b);
            c.wrapper.style.overflow = "hidden";
            c.scroller = c.wrapper.children[0];
            c.options = {
                hScroll: !0,
                vScroll: !0,
                x: 0,
                y: 0,
                bounce: !0,
                bounceLock: !1,
                momentum: !0,
                lockDirection: !0,
                useTransform: !0,
                useTransition: !1,
                topOffset: 0,
                checkDOMChanges: !1,
                handleClick: !0,
                hScrollbar: !0,
                vScrollbar: !0,
                fixedScrollbar: A,
                hideScrollbar: E,
                fadeScrollbar: E && F,
                scrollbarClass: "",
                zoom: !1,
                zoomMin: 1,
                zoomMax: 4,
                doubleTapZoom: 2,
                wheelAction: "scroll",
                snap: !1,
                snapThreshold: 1,
                onRefresh: null,
                onBeforeScrollStart: function(a) {
                    a.preventDefault()
                },
                onScrollStart: null,
                onBeforeScrollMove: null,
                onScrollMove: null,
                onBeforeScrollEnd: null,
                onScrollEnd: null,
                onTouchEnd: null,
                onDestroy: null,
                onZoomStart: null,
                onZoom: null,
                onZoomEnd: null
            };
            for (d in a) c.options[d] = a[d];
            c.x = c.options.x;
            c.y = c.options.y;
            c.options.useTransform = G && c.options.useTransform;
            c.options.hScrollbar = c.options.hScroll && c.options.hScrollbar;
            c.options.vScrollbar = c.options.vScroll && c.options.vScrollbar;
            c.options.zoom = c.options.useTransform && c.options.zoom;
            c.options.useTransition = L && c.options.useTransition;
            c.options.zoom &&
                A && (p = "");
            c.scroller.style[I] = c.options.useTransform ? i + "transform" : "top left";
            c.scroller.style[q] = "0";
            c.scroller.style[J] = "0 0";
            c.options.useTransition && (c.scroller.style[K] = "cubic-bezier(0.33,0.66,0.66,1)");
            c.options.useTransform ? c.scroller.style[n] = "translate(" + c.x + "px," + c.y + "px)" + p : c.scroller.style.cssText += ";position:absolute;top:" + c.y + "px;left:" + c.x + "px";
            c.options.useTransition && (c.options.fixedScrollbar = !0);
            c.refresh();
            c._bind(B, h);
            c._bind(C);
            l || "none" != c.options.wheelAction && c._bind(D);
            c.options.checkDOMChanges &&
                (c.checkDOMTime = setInterval(function() {
                    c._checkDOMChanges()
                }, 500))
        };
    u.prototype = {
        enabled: !0,
        x: 0,
        y: 0,
        steps: [],
        scale: 1,
        currPageX: 0,
        currPageY: 0,
        pagesX: [],
        pagesY: [],
        aniTime: null,
        wheelZoomCount: 0,
        handleEvent: function(b) {
            switch (b.type) {
                case C:
                    if (!l && 0 !== b.button) break;
                    this._start(b);
                    break;
                case v:
                    this._move(b);
                    break;
                case w:
                case x:
                    this._end(b);
                    break;
                case B:
                    this._resize();
                    break;
                case D:
                    this._wheel(b);
                    break;
                case r:
                    this._transitionEnd(b)
            }
        },
        _checkDOMChanges: function() {
            !this.moved && !this.zoomed && !(this.animating ||
                this.scrollerW == this.scroller.offsetWidth * this.scale && this.scrollerH == this.scroller.offsetHeight * this.scale) && this.refresh()
        },
        _scrollbar: function(b) {
            var a;
            this[b + "Scrollbar"] ? (this[b + "ScrollbarWrapper"] || (a = t.createElement("div"), this.options.scrollbarClass ? a.className = this.options.scrollbarClass + b.toUpperCase() : a.style.cssText = "position:absolute;z-index:100;" + ("h" == b ? "height:7px;bottom:1px;left:2px;right:" + (this.vScrollbar ? "7" : "2") + "px" : "width:7px;bottom:" + (this.hScrollbar ? "7" : "2") + "px;top:2px;right:1px"),
                a.style.cssText += ";pointer-events:none;" + i + "transition-property:opacity;" + i + "transition-duration:" + (this.options.fadeScrollbar ? "350ms" : "0") + ";overflow:hidden;opacity:" + (this.options.hideScrollbar ? "0" : "1"), this.wrapper.appendChild(a), this[b + "ScrollbarWrapper"] = a, a = t.createElement("div"), this.options.scrollbarClass || (a.style.cssText = "position:absolute;z-index:100;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);" + i + "background-clip:padding-box;" + i + "box-sizing:border-box;" + ("h" == b ? "height:100%" :
                    "width:100%") + ";" + i + "border-radius:3px;border-radius:3px"), a.style.cssText += ";pointer-events:none;" + i + "transition-property:" + i + "transform;" + i + "transition-timing-function:cubic-bezier(0.33,0.66,0.66,1);" + i + "transition-duration:0;" + i + "transform: translate(0,0)" + p, this.options.useTransition && (a.style.cssText += ";" + i + "transition-timing-function:cubic-bezier(0.33,0.66,0.66,1)"), this[b + "ScrollbarWrapper"].appendChild(a), this[b + "ScrollbarIndicator"] = a), "h" == b ? (this.hScrollbarSize = this.hScrollbarWrapper.clientWidth,
                this.hScrollbarIndicatorSize = f.max(f.round(this.hScrollbarSize * this.hScrollbarSize / this.scrollerW), 8), this.hScrollbarIndicator.style.width = this.hScrollbarIndicatorSize + "px", this.hScrollbarMaxScroll = this.hScrollbarSize - this.hScrollbarIndicatorSize, this.hScrollbarProp = this.hScrollbarMaxScroll / this.maxScrollX) : (this.vScrollbarSize = this.vScrollbarWrapper.clientHeight, this.vScrollbarIndicatorSize = f.max(f.round(this.vScrollbarSize * this.vScrollbarSize / this.scrollerH), 8), this.vScrollbarIndicator.style.height =
                this.vScrollbarIndicatorSize + "px", this.vScrollbarMaxScroll = this.vScrollbarSize - this.vScrollbarIndicatorSize, this.vScrollbarProp = this.vScrollbarMaxScroll / this.maxScrollY), this._scrollbarPos(b, !0)) : this[b + "ScrollbarWrapper"] && (G && (this[b + "ScrollbarIndicator"].style[n] = ""), this[b + "ScrollbarWrapper"].parentNode.removeChild(this[b + "ScrollbarWrapper"]), this[b + "ScrollbarWrapper"] = null, this[b + "ScrollbarIndicator"] = null)
        },
        _resize: function() {
            var b = this;
            setTimeout(function() {
                b.refresh()
            }, A ? 200 : 0)
        },
        _pos: function(b,
            a) {
            this.zoomed || (b = this.hScroll ? b : 0, a = this.vScroll ? a : 0, this.options.useTransform ? this.scroller.style[n] = "translate(" + b + "px," + a + "px) scale(" + this.scale + ")" + p : (b = f.round(b), a = f.round(a), this.scroller.style.left = b + "px", this.scroller.style.top = a + "px"), this.x = b, this.y = a, this._scrollbarPos("h"), this._scrollbarPos("v"))
        },
        _scrollbarPos: function(b, a) {
            var c = "h" == b ? this.x : this.y;
            this[b + "Scrollbar"] && (c *= this[b + "ScrollbarProp"], 0 > c ? (this.options.fixedScrollbar || (c = this[b + "ScrollbarIndicatorSize"] + f.round(3 * c),
                    8 > c && (c = 8), this[b + "ScrollbarIndicator"].style["h" == b ? "width" : "height"] = c + "px"), c = 0) : c > this[b + "ScrollbarMaxScroll"] && (this.options.fixedScrollbar ? c = this[b + "ScrollbarMaxScroll"] : (c = this[b + "ScrollbarIndicatorSize"] - f.round(3 * (c - this[b + "ScrollbarMaxScroll"])), 8 > c && (c = 8), this[b + "ScrollbarIndicator"].style["h" == b ? "width" : "height"] = c + "px", c = this[b + "ScrollbarMaxScroll"] + (this[b + "ScrollbarIndicatorSize"] - c))), this[b + "ScrollbarWrapper"].style[z] = "0", this[b + "ScrollbarWrapper"].style.opacity = a && this.options.hideScrollbar ?
                "0" : "1", this[b + "ScrollbarIndicator"].style[n] = "translate(" + ("h" == b ? c + "px,0)" : "0," + c + "px)") + p)
        },
        _start: function(b) {
            var a = l ? b.touches[0] : b,
                c, d;
            if (this.enabled) {
                this.options.onBeforeScrollStart && this.options.onBeforeScrollStart.call(this, b);
                (this.options.useTransition || this.options.zoom) && this._transitionTime(0);
                this.zoomed = this.animating = this.moved = !1;
                this.dirY = this.dirX = this.absDistY = this.absDistX = this.distY = this.distX = 0;
                this.options.zoom && l && 1 < b.touches.length && (d = f.abs(b.touches[0].pageX - b.touches[1].pageX),
                    c = f.abs(b.touches[0].pageY - b.touches[1].pageY), this.touchesDistStart = f.sqrt(d * d + c * c), this.originX = f.abs(b.touches[0].pageX + b.touches[1].pageX - 2 * this.wrapperOffsetLeft) / 2 - this.x, this.originY = f.abs(b.touches[0].pageY + b.touches[1].pageY - 2 * this.wrapperOffsetTop) / 2 - this.y, this.options.onZoomStart && this.options.onZoomStart.call(this, b));
                if (this.options.momentum && (this.options.useTransform ? (c = getComputedStyle(this.scroller, null)[n].replace(/[^0-9\-.,]/g, "").split(","), d = +c[4], c = +c[5]) : (d = +getComputedStyle(this.scroller,
                        null).left.replace(/[^0-9-]/g, ""), c = +getComputedStyle(this.scroller, null).top.replace(/[^0-9-]/g, "")), d != this.x || c != this.y)) this.options.useTransition ? this._unbind(r) : H(this.aniTime), this.steps = [], this._pos(d, c), this.options.onScrollEnd && this.options.onScrollEnd.call(this);
                this.absStartX = this.x;
                this.absStartY = this.y;
                this.startX = this.x;
                this.startY = this.y;
                this.pointX = a.pageX;
                this.pointY = a.pageY;
                this.startTime = b.timeStamp || Date.now();
                this.options.onScrollStart && this.options.onScrollStart.call(this, b);
                this._bind(v, h);
                this._bind(w, h);
                this._bind(x, h)
            }
        },
        _move: function(b) {
            var a = l ? b.touches[0] : b,
                c = a.pageX - this.pointX,
                d = a.pageY - this.pointY,
                e = this.x + c,
                g = this.y + d,
                h = b.timeStamp || Date.now();
            this.options.onBeforeScrollMove && this.options.onBeforeScrollMove.call(this, b);
            if (this.options.zoom && l && 1 < b.touches.length) e = f.abs(b.touches[0].pageX - b.touches[1].pageX), g = f.abs(b.touches[0].pageY - b.touches[1].pageY), this.touchesDist = f.sqrt(e * e + g * g), this.zoomed = !0, a = 1 / this.touchesDistStart * this.touchesDist * this.scale,
                a < this.options.zoomMin ? a = 0.5 * this.options.zoomMin * Math.pow(2, a / this.options.zoomMin) : a > this.options.zoomMax && (a = 2 * this.options.zoomMax * Math.pow(0.5, this.options.zoomMax / a)), this.lastScale = a / this.scale, e = this.originX - this.originX * this.lastScale + this.x, g = this.originY - this.originY * this.lastScale + this.y, this.scroller.style[n] = "translate(" + e + "px," + g + "px) scale(" + a + ")" + p, this.options.onZoom && this.options.onZoom.call(this, b);
            else {
                this.pointX = a.pageX;
                this.pointY = a.pageY;
                if (0 < e || e < this.maxScrollX) e = this.options.bounce ?
                    this.x + c / 2 : 0 <= e || 0 <= this.maxScrollX ? 0 : this.maxScrollX;
                if (g > this.minScrollY || g < this.maxScrollY) g = this.options.bounce ? this.y + d / 2 : g >= this.minScrollY || 0 <= this.maxScrollY ? this.minScrollY : this.maxScrollY;
                this.distX += c;
                this.distY += d;
                this.absDistX = f.abs(this.distX);
                this.absDistY = f.abs(this.distY);
                6 > this.absDistX && 6 > this.absDistY || (this.options.lockDirection && (this.absDistX > this.absDistY + 5 ? (g = this.y, d = 0) : this.absDistY > this.absDistX + 5 && (e = this.x, c = 0)), this.moved = !0, this._pos(e, g), this.dirX = 0 < c ? -1 : 0 > c ? 1 : 0, this.dirY =
                    0 < d ? -1 : 0 > d ? 1 : 0, 300 < h - this.startTime && (this.startTime = h, this.startX = this.x, this.startY = this.y), this.options.onScrollMove && this.options.onScrollMove.call(this, b))
            }
        },
        _end: function(b) {
            if (!(l && 0 !== b.touches.length)) {
                var a = this,
                    c = l ? b.changedTouches[0] : b,
                    d, e, g = {
                        dist: 0,
                        time: 0
                    },
                    j = {
                        dist: 0,
                        time: 0
                    },
                    s = (b.timeStamp || Date.now()) - a.startTime,
                    k = a.x,
                    i = a.y;
                a._unbind(v, h);
                a._unbind(w, h);
                a._unbind(x, h);
                a.options.onBeforeScrollEnd && a.options.onBeforeScrollEnd.call(a, b);
                if (a.zoomed) k = a.scale * a.lastScale, k = Math.max(a.options.zoomMin,
                    k), k = Math.min(a.options.zoomMax, k), a.lastScale = k / a.scale, a.scale = k, a.x = a.originX - a.originX * a.lastScale + a.x, a.y = a.originY - a.originY * a.lastScale + a.y, a.scroller.style[q] = "200ms", a.scroller.style[n] = "translate(" + a.x + "px," + a.y + "px) scale(" + a.scale + ")" + p, a.zoomed = !1, a.refresh(), a.options.onZoomEnd && a.options.onZoomEnd.call(a, b);
                else {
                    if (a.moved) {
                        if (300 > s && a.options.momentum) {
                            g = k ? a._momentum(k - a.startX, s, -a.x, a.scrollerW - a.wrapperW + a.x, a.options.bounce ? a.wrapperW : 0) : g;
                            j = i ? a._momentum(i - a.startY, s, -a.y, 0 >
                                a.maxScrollY ? a.scrollerH - a.wrapperH + a.y - a.minScrollY : 0, a.options.bounce ? a.wrapperH : 0) : j;
                            k = a.x + g.dist;
                            i = a.y + j.dist;
                            if (0 < a.x && 0 < k || a.x < a.maxScrollX && k < a.maxScrollX) g = {
                                dist: 0,
                                time: 0
                            };
                            if (a.y > a.minScrollY && i > a.minScrollY || a.y < a.maxScrollY && i < a.maxScrollY) j = {
                                dist: 0,
                                time: 0
                            }
                        }
                        g.dist || j.dist ? (g = f.max(f.max(g.time, j.time), 10), a.options.snap && (j = k - a.absStartX, s = i - a.absStartY, f.abs(j) < a.options.snapThreshold && f.abs(s) < a.options.snapThreshold ? a.scrollTo(a.absStartX, a.absStartY, 200) : (j = a._snap(k, i), k = j.x, i = j.y,
                            g = f.max(j.time, g))), a.scrollTo(f.round(k), f.round(i), g)) : a.options.snap ? (j = k - a.absStartX, s = i - a.absStartY, f.abs(j) < a.options.snapThreshold && f.abs(s) < a.options.snapThreshold ? a.scrollTo(a.absStartX, a.absStartY, 200) : (j = a._snap(a.x, a.y), (j.x != a.x || j.y != a.y) && a.scrollTo(j.x, j.y, j.time))) : a._resetPos(200)
                    } else l && (a.doubleTapTimer && a.options.zoom ? (clearTimeout(a.doubleTapTimer), a.doubleTapTimer = null, a.options.onZoomStart && a.options.onZoomStart.call(a, b), a.zoom(a.pointX, a.pointY, 1 == a.scale ? a.options.doubleTapZoom :
                        1), a.options.onZoomEnd && setTimeout(function() {
                        a.options.onZoomEnd.call(a, b)
                    }, 200)) : this.options.handleClick && (a.doubleTapTimer = setTimeout(function() {
                        a.doubleTapTimer = null;
                        for (d = c.target; 1 != d.nodeType;) d = d.parentNode;
                        "SELECT" != d.tagName && "INPUT" != d.tagName && "TEXTAREA" != d.tagName && (e = t.createEvent("MouseEvents"), e.initMouseEvent("click", !0, !0, b.view, 1, c.screenX, c.screenY, c.clientX, c.clientY, b.ctrlKey, b.altKey, b.shiftKey, b.metaKey, 0, null), e._fake = !0, d.dispatchEvent(e))
                    }, a.options.zoom ? 250 : 0))), a._resetPos(400);
                    a.options.onTouchEnd && a.options.onTouchEnd.call(a, b)
                }
            }
        },
        _resetPos: function(b) {
            var a = 0 <= this.x ? 0 : this.x < this.maxScrollX ? this.maxScrollX : this.x,
                c = this.y >= this.minScrollY || 0 < this.maxScrollY ? this.minScrollY : this.y < this.maxScrollY ? this.maxScrollY : this.y;
            if (a == this.x && c == this.y) {
                if (this.moved && (this.moved = !1, this.options.onScrollEnd && this.options.onScrollEnd.call(this)), this.hScrollbar && this.options.hideScrollbar && ("webkit" == m && (this.hScrollbarWrapper.style[z] = "300ms"), this.hScrollbarWrapper.style.opacity =
                        "0"), this.vScrollbar && this.options.hideScrollbar) "webkit" == m && (this.vScrollbarWrapper.style[z] = "300ms"), this.vScrollbarWrapper.style.opacity = "0"
            } else this.scrollTo(a, c, b || 0)
        },
        _wheel: function(b) {
            var a = this,
                c, d;
            if ("wheelDeltaX" in b) c = b.wheelDeltaX / 12, d = b.wheelDeltaY / 12;
            else if ("wheelDelta" in b) c = d = b.wheelDelta / 12;
            else if ("detail" in b) c = d = 3 * -b.detail;
            else return;
            if ("zoom" == a.options.wheelAction) {
                if (d = a.scale * Math.pow(2, 1 / 3 * (d ? d / Math.abs(d) : 0)), d < a.options.zoomMin && (d = a.options.zoomMin), d > a.options.zoomMax &&
                    (d = a.options.zoomMax), d != a.scale) !a.wheelZoomCount && a.options.onZoomStart && a.options.onZoomStart.call(a, b), a.wheelZoomCount++, a.zoom(b.pageX, b.pageY, d, 400), setTimeout(function() {
                    a.wheelZoomCount--;
                    !a.wheelZoomCount && a.options.onZoomEnd && a.options.onZoomEnd.call(a, b)
                }, 400)
            } else c = a.x + c, d = a.y + d, 0 < c ? c = 0 : c < a.maxScrollX && (c = a.maxScrollX), d > a.minScrollY ? d = a.minScrollY : d < a.maxScrollY && (d = a.maxScrollY), 0 > a.maxScrollY && a.scrollTo(c, d, 0)
        },
        _transitionEnd: function(b) {
            b.target == this.scroller && (this._unbind(r),
                this._startAni())
        },
        _startAni: function() {
            var b = this,
                a = b.x,
                c = b.y,
                d = Date.now(),
                e, g, h;
            b.animating || (b.steps.length ? (e = b.steps.shift(), e.x == a && e.y == c && (e.time = 0), b.animating = !0, b.moved = !0, b.options.useTransition) ? (b._transitionTime(e.time), b._pos(e.x, e.y), b.animating = !1, e.time ? b._bind(r) : b._resetPos(0)) : (h = function() {
                var i = Date.now();
                if (i >= d + e.time) {
                    b._pos(e.x, e.y);
                    b.animating = false;
                    b.options.onAnimationEnd && b.options.onAnimationEnd.call(b);
                    b._startAni()
                } else {
                    i = (i - d) / e.time - 1;
                    g = f.sqrt(1 - i * i);
                    i = (e.x - a) *
                        g + a;
                    b._pos(i, (e.y - c) * g + c);
                    if (b.animating) b.aniTime = M(h)
                }
            }, h()) : b._resetPos(400))
        },
        _transitionTime: function(b) {
            b += "ms";
            this.scroller.style[q] = b;
            this.hScrollbar && (this.hScrollbarIndicator.style[q] = b);
            this.vScrollbar && (this.vScrollbarIndicator.style[q] = b)
        },
        _momentum: function(b, a, c, d, e) {
            var a = f.abs(b) / a,
                g = a * a / 0.0012;
            0 < b && g > c ? (c += e / (6 / (6.0E-4 * (g / a))), a = a * c / g, g = c) : 0 > b && g > d && (d += e / (6 / (6.0E-4 * (g / a))), a = a * d / g, g = d);
            return {
                dist: g * (0 > b ? -1 : 1),
                time: f.round(a / 6.0E-4)
            }
        },
        _offset: function(b) {
            for (var a = -b.offsetLeft,
                    c = -b.offsetTop; b = b.offsetParent;) a -= b.offsetLeft, c -= b.offsetTop;
            b != this.wrapper && (a *= this.scale, c *= this.scale);
            return {
                left: a,
                top: c
            }
        },
        _snap: function(b, a) {
            var c, d, e;
            e = this.pagesX.length - 1;
            c = 0;
            for (d = this.pagesX.length; c < d; c++)
                if (b >= this.pagesX[c]) {
                    e = c;
                    break
                }
            e == this.currPageX && 0 < e && 0 > this.dirX && e--;
            b = this.pagesX[e];
            d = (d = f.abs(b - this.pagesX[this.currPageX])) ? 500 * (f.abs(this.x - b) / d) : 0;
            this.currPageX = e;
            e = this.pagesY.length - 1;
            for (c = 0; c < e; c++)
                if (a >= this.pagesY[c]) {
                    e = c;
                    break
                }
            e == this.currPageY && 0 < e && 0 > this.dirY &&
                e--;
            a = this.pagesY[e];
            c = (c = f.abs(a - this.pagesY[this.currPageY])) ? 500 * (f.abs(this.y - a) / c) : 0;
            this.currPageY = e;
            e = f.round(f.max(d, c)) || 200;
            return {
                x: b,
                y: a,
                time: e
            }
        },
        _bind: function(b, a, c) {
            (a || this.scroller).addEventListener(b, this, !!c)
        },
        _unbind: function(b, a, c) {
            (a || this.scroller).removeEventListener(b, this, !!c)
        },
        destroy: function() {
            this.scroller.style[n] = "";
            this.vScrollbar = this.hScrollbar = !1;
            this._scrollbar("h");
            this._scrollbar("v");
            this._unbind(B, h);
            this._unbind(C);
            this._unbind(v, h);
            this._unbind(w, h);
            this._unbind(x,
                h);
            this.options.hasTouch || this._unbind(D);
            this.options.useTransition && this._unbind(r);
            this.options.checkDOMChanges && clearInterval(this.checkDOMTime);
            this.options.onDestroy && this.options.onDestroy.call(this)
        },
        refresh: function() {
            var b, a, c, d = 0;
            a = 0;
            this.scale < this.options.zoomMin && (this.scale = this.options.zoomMin);
            this.wrapperW = this.wrapper.clientWidth || 1;
            this.wrapperH = this.wrapper.clientHeight || 1;
            this.minScrollY = -this.options.topOffset || 0;
            this.scrollerW = f.round(this.scroller.offsetWidth * this.scale);
            this.scrollerH = f.round((this.scroller.offsetHeight + this.minScrollY) * this.scale);
            this.maxScrollX = this.wrapperW - this.scrollerW;
            this.maxScrollY = this.wrapperH - this.scrollerH + this.minScrollY;
            this.dirY = this.dirX = 0;
            this.options.onRefresh && this.options.onRefresh.call(this);
            this.hScroll = this.options.hScroll && 0 > this.maxScrollX;
            this.vScroll = this.options.vScroll && (!this.options.bounceLock && !this.hScroll || this.scrollerH > this.wrapperH);
            this.hScrollbar = this.hScroll && this.options.hScrollbar;
            this.vScrollbar = this.vScroll &&
                this.options.vScrollbar && this.scrollerH > this.wrapperH;
            b = this._offset(this.wrapper);
            this.wrapperOffsetLeft = -b.left;
            this.wrapperOffsetTop = -b.top;
            if ("string" == typeof this.options.snap) {
                this.pagesX = [];
                this.pagesY = [];
                c = this.scroller.querySelectorAll(this.options.snap);
                b = 0;
                for (a = c.length; b < a; b++) d = this._offset(c[b]), d.left += this.wrapperOffsetLeft, d.top += this.wrapperOffsetTop, this.pagesX[b] = d.left < this.maxScrollX ? this.maxScrollX : d.left * this.scale, this.pagesY[b] = d.top < this.maxScrollY ? this.maxScrollY : d.top *
                    this.scale
            } else if (this.options.snap) {
                for (this.pagesX = []; d >= this.maxScrollX;) this.pagesX[a] = d, d -= this.wrapperW, a++;
                this.maxScrollX % this.wrapperW && (this.pagesX[this.pagesX.length] = this.maxScrollX - this.pagesX[this.pagesX.length - 1] + this.pagesX[this.pagesX.length - 1]);
                a = d = 0;
                for (this.pagesY = []; d >= this.maxScrollY;) this.pagesY[a] = d, d -= this.wrapperH, a++;
                this.maxScrollY % this.wrapperH && (this.pagesY[this.pagesY.length] = this.maxScrollY - this.pagesY[this.pagesY.length - 1] + this.pagesY[this.pagesY.length - 1])
            }
            this._scrollbar("h");
            this._scrollbar("v");
            this.zoomed || (this.scroller.style[q] = "0", this._resetPos(400))
        },
        scrollTo: function(b, a, c, d) {
            var e = b;
            this.stop();
            e.length || (e = [{
                x: b,
                y: a,
                time: c,
                relative: d
            }]);
            b = 0;
            for (a = e.length; b < a; b++) e[b].relative && (e[b].x = this.x - e[b].x, e[b].y = this.y - e[b].y), this.steps.push({
                x: e[b].x,
                y: e[b].y,
                time: e[b].time || 0
            });
            this._startAni()
        },
        scrollToElement: function(b, a) {
            var c;
            if (b = b.nodeType ? b : this.scroller.querySelector(b)) c = this._offset(b), c.left += this.wrapperOffsetLeft, c.top += this.wrapperOffsetTop, c.left =
                0 < c.left ? 0 : c.left < this.maxScrollX ? this.maxScrollX : c.left, c.top = c.top > this.minScrollY ? this.minScrollY : c.top < this.maxScrollY ? this.maxScrollY : c.top, a = void 0 === a ? f.max(2 * f.abs(c.left), 2 * f.abs(c.top)) : a, this.scrollTo(c.left, c.top, a)
        },
        scrollToPage: function(b, a, c) {
            c = void 0 === c ? 400 : c;
            this.options.onScrollStart && this.options.onScrollStart.call(this);
            if (this.options.snap) b = "next" == b ? this.currPageX + 1 : "prev" == b ? this.currPageX - 1 : b, a = "next" == a ? this.currPageY + 1 : "prev" == a ? this.currPageY - 1 : a, b = 0 > b ? 0 : b > this.pagesX.length -
                1 ? this.pagesX.length - 1 : b, a = 0 > a ? 0 : a > this.pagesY.length - 1 ? this.pagesY.length - 1 : a, this.currPageX = b, this.currPageY = a, b = this.pagesX[b], a = this.pagesY[a];
            else if (b *= -this.wrapperW, a *= -this.wrapperH, b < this.maxScrollX && (b = this.maxScrollX), a < this.maxScrollY) a = this.maxScrollY;
            this.scrollTo(b, a, c)
        },
        disable: function() {
            this.stop();
            this._resetPos(0);
            this.enabled = !1;
            this._unbind(v, h);
            this._unbind(w, h);
            this._unbind(x, h)
        },
        enable: function() {
            this.enabled = !0
        },
        stop: function() {
            this.options.useTransition ? this._unbind(r) :
                H(this.aniTime);
            this.steps = [];
            this.animating = this.moved = !1
        },
        zoom: function(b, a, c, d) {
            var e = c / this.scale;
            this.options.useTransform && (this.zoomed = !0, d = void 0 === d ? 200 : d, b = b - this.wrapperOffsetLeft - this.x, a = a - this.wrapperOffsetTop - this.y, this.x = b - b * e + this.x, this.y = a - a * e + this.y, this.scale = c, this.refresh(), this.x = 0 < this.x ? 0 : this.x < this.maxScrollX ? this.maxScrollX : this.x, this.y = this.y > this.minScrollY ? this.minScrollY : this.y < this.maxScrollY ? this.maxScrollY : this.y, this.scroller.style[q] = d + "ms", this.scroller.style[n] =
                "translate(" + this.x + "px," + this.y + "px) scale(" + c + ")" + p, this.zoomed = !1)
        },
        isReady: function() {
            return !this.moved && !this.zoomed && !this.animating
        }
    };
    y = null;
    "undefined" !== typeof exports ? exports.iScroll = u : h.iScroll = u
})(window, document);
jQuery.the = function(e, b, a) {
    if (1 < arguments.length && (null === b || "object" !== typeof b)) {
        a = jQuery.extend({}, a);
        null === b && (a.expires = -1);
        if ("number" === typeof a.expires) {
            var d = a.expires,
                c = a.expires = new Date;
            c.setDate(c.getDate() + d)
        }
        return document.cookie = [encodeURIComponent(e), "=", a.raw ? "" + b : encodeURIComponent("" + b), a.expires ? "; expires=" + a.expires.toUTCString() : "", a.path ? "; path=" + a.path : "", a.domain ? "; domain=" + a.domain : "", a.secure ? "; secure" : ""].join("")
    }
    a = b || {};
    c = a.raw ? function(a) {
        return a
    } : decodeURIComponent;
    return (d = RegExp("(?:^|; )" + encodeURIComponent(e) + "=([^;]*)").exec(document.cookie)) ? c(d[1]) : null
};