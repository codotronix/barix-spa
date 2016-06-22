/*!
 * Barix (https://github.com/codotronix/Barix)
 * Copyright 2016 Suman Barick
 * Licensed under the MIT license
 */
"use strict";
var Barix = (function () {
    /**********************************************************
     * constructor
     *********************************************************/
    function Barix(elems) {
        this.elems = elems;
    }
    ///////////////////////////////////////////////////////////
    /**********************************************************
     * a jquery like selector
     *********************************************************/
    Barix.select = function (selector) {
        var elems = new Array();
        //if selector is empty return the Barix class itself to make static calls easier
        if (typeof (selector) == "undefined") {
            return Barix;
        }
        //if bx(function(){}) is used as document ready
        if (selector && typeof (selector) == "function") {
            Barix.prototype["onReadyFnQueue"] = Barix.prototype["onReadyFnQueue"] || [];
            Barix.prototype["onReadyFnQueue"].push(selector);
            window.onload = function () {
                //execute all the doc ready function one by one
                for (var i in Barix.prototype["onReadyFnQueue"]) {
                    Barix.prototype["onReadyFnQueue"][i]();
                }
                //once done calling all, delete them to freeup memory
                delete Barix.prototype["onReadyFnQueue"];
            };
        }
        else if (selector && typeof (selector) == "string") {
            var elemList = document.querySelectorAll(selector);
            elems = Barix.ListToArray(elemList);
        }
        else if (selector && selector instanceof Element) {
            elems.push(selector);
        }
        else {
            var e = 'Barix: ' + selector + ' is not a supported selector or Element.';
            throw e;
        }
        var b = new Barix(elems);
        return b;
    };
    ///////////////////////////////////////////////////////////
    /**********************************************************
     * .remove()
     *********************************************************/
    Barix.prototype.remove = function () {
        for (var i in this.elems) {
            this.elems[i].parentNode.removeChild(this.elems[i]);
        }
        return this;
    };
    ///////////////////////////////////////////////////////////
    /**********************************************************
     * .find('selector')
     *********************************************************/
    Barix.prototype.find = function (selector) {
        var newElems = [];
        var tempArray;
        for (var i in this.elems) {
            tempArray = Barix.ListToArray(this.elems[i].querySelectorAll(selector));
            //push all elements in newElems array
            for (var j in tempArray) {
                newElems.push(tempArray[j]);
            }
        }
        this.elems = newElems;
        return this;
    };
    ///////////////////////////////////////////////////////////
    /**********************************************************
     * .attr('attrName', 'attrValue')
     *********************************************************/
    Barix.prototype.attr = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        var attrJSON = {};
        //if it is a get request
        if (args.length == 1 && typeof (args[0]) === "string") {
            return this.elems[0].getAttribute(args[0]);
        }
        //if it is set request with multiple (key, value) as JSON
        if (args.length == 1 && typeof (args[0]) === "object") {
            attrJSON = args[0];
        }
        else if (args.length == 2) {
            attrJSON[args[0]] = args[1];
        }
        else {
            var info = 'Barix: attr() method can be called in 3 ways \n 1. attr("attributeName") \n 2. attr("name", "value") \n 3. attr({"name1": "value1", "name2": "value2"....})';
            throw info;
        }
        //loop thru all the elements and then all the attributes
        for (var i in this.elems) {
            for (var key in attrJSON) {
                this.elems[i].setAttribute(key, attrJSON[key]);
            }
        }
        return this;
    };
    ///////////////////////////////////////////////////////////
    /***********************************************************
    * .css({styleNameValuePairObject})
    ***********************************************************/
    Barix.prototype.css = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        var styleObj = {};
        //if it is a get request
        if (args.length == 1 && typeof (args[0]) === "string") {
            return this.elems[0].style[args[0]];
        }
        //if style is provided as json object
        if (args.length == 1 && typeof (args[0]) === "object") {
            styleObj = args[0];
        }
        else if (args.length == 2) {
            styleObj[args[0]] = args[1];
        }
        else {
            var e = 'Barix: css style can be provided as single (name,value) pair or as a json object.';
            throw e;
        }
        for (var i in this.elems) {
            for (var key in styleObj) {
                this.elems[i].style[key] = styleObj[key];
            }
        }
        return this;
    };
    /////////////////////////////////////////////////////////////
    /**********************************************************
     * addClass("class1 class2")
     *********************************************************/
    Barix.prototype.addClass = function (classNames) {
        var classes = (classNames || "").trim();
        var classAddArr = classes.split(' ');
        var el;
        for (var i in this.elems) {
            el = this.elems[i];
            for (var j in classAddArr) {
                if (el.className.indexOf(classAddArr[j]) < 0) {
                    el.className += " " + classAddArr[j];
                }
            }
            el.className = el.className.trim();
        }
        return this;
    };
    ///////////////////////////////////////////////////////////
    /**********************************************************
     * removeClass...
     *********************************************************/
    Barix.prototype.removeClass = function (classNames) {
        var classes = (classNames || "").trim();
        //if empty, then remove all classes
        if (classes == "") {
            for (var i in this.elems) {
                this.elems[i].className = '';
            }
            return this;
        }
        //if Not Empty
        var classRemArr = classes.split(' ');
        var existingClasses;
        var newClasses;
        for (var i in this.elems) {
            newClasses = '';
            existingClasses = this.elems[i].className.split(' ');
            for (var j in existingClasses) {
                if (classRemArr.indexOf(existingClasses[j]) < 0) {
                    newClasses += " " + existingClasses[j];
                }
            }
            newClasses = newClasses.trim();
            this.elems[i].className = newClasses;
        }
        return this;
    };
    ///////////////////////////////////////////////////////////
    /**********************************************************
     * hasClass
     *********************************************************/
    Barix.prototype.hasClass = function (classNames) {
        var classes = (classNames || "").trim();
        //if empty, return true
        if (classes == "") {
            return true;
        }
        //if Not Empty
        var classArgArr = classes.split(' ');
        var existingClasses;
        var el;
        var newClasses;
        var hasClass = true;
        for (var i in this.elems) {
            el = this.elems[i];
            for (var j in classArgArr) {
                if (el.className.indexOf(classArgArr[j]) < 0) {
                    hasClass = false;
                    return hasClass;
                }
            }
        }
        return hasClass;
    };
    ///////////////////////////////////////////////////////////
    /**********************************************************
     * .hide() - it saves the displayValue as attr to use in .show()
     *********************************************************/
    Barix.prototype.hide = function () {
        var displayValue;
        for (var i in this.elems) {
            displayValue = this.elems[i].style.display;
            if (displayValue) {
                this.elems[i].setAttribute("barix-internal-oldDiplayVal", displayValue);
            }
            this.elems[i].style.display = "none";
        }
        return this;
    };
    ///////////////////////////////////////////////////////////
    /**********************************************************
     * .show(displayValue?)
     *********************************************************/
    Barix.prototype.show = function (dispVal) {
        var displayValue;
        for (var i in this.elems) {
            displayValue = dispVal || this.elems[i].getAttribute("barix-internal-oldDiplayVal") || "block";
            this.elems[i].style.display = displayValue;
        }
        return this;
    };
    ///////////////////////////////////////////////////////////
    /**********************************************************
     * .each(callback)
     *********************************************************/
    Barix.prototype.each = function (callback) {
        var c;
        for (var i in this.elems) {
            c = callback.bind(this.elems[i]); //so that this=element
            c(i, this.elems[i]); //param1=index, param2=element=this
        }
        return this;
    };
    ////////////////////////////////////////////////////////////
    /***********************************************************
    * .on
    ***********************************************************/
    Barix.prototype.on = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        var eventName = args[0];
        var selector;
        var callback;
        if (args.length == 2) {
            callback = args[1];
            for (var i in this.elems) {
                this.elems[i].addEventListener(eventName, callback);
            }
        }
        else if (args.length == 3) {
            selector = args[1];
            callback = args[2];
            var parentEl_1;
            var selectorEl_1;
            var selectorElArr_1;
            var el_1;
            var cb_1;
            for (var i in this.elems) {
                parentEl_1 = this.elems[i];
                parentEl_1.addEventListener(eventName, function (ev) {
                    selectorEl_1 = parentEl_1.querySelectorAll(selector);
                    selectorElArr_1 = Barix.ListToArray(selectorEl_1);
                    el_1 = ev.target;
                    while (el_1 != parentEl_1) {
                        if (selectorElArr_1.indexOf(el_1) > -1) {
                            cb_1 = callback.bind(el_1);
                            cb_1(ev);
                            break;
                        }
                        else {
                            el_1 = el_1.parentElement;
                        }
                    }
                });
            }
        }
        return this;
    };
    ////////////////////////////////////////////////////////////
    /***********************************************************
    * .text(textContent) -> overwrites text Content
    ***********************************************************/
    Barix.prototype.text = function (textContent) {
        for (var i in this.elems) {
            this.elems[i].textContent = textContent;
        }
        return this;
    };
    ////////////////////////////////////////////////////////////
    /***********************************************************
    * .appendText(textContent) -> appends text Content
    ***********************************************************/
    Barix.prototype.appendText = function (textContent) {
        for (var i in this.elems) {
            this.elems[i].textContent += textContent;
        }
        return this;
    };
    ////////////////////////////////////////////////////////////
    /***********************************************************
    * .html(htmlContent) -> overwrites HTML Content
    ***********************************************************/
    Barix.prototype.html = function (htmlContent) {
        for (var i in this.elems) {
            this.elems[i].innerHTML = htmlContent;
        }
        return this;
    };
    ////////////////////////////////////////////////////////////
    /***********************************************************
    * .append(htmlContent) -> Appends HTML Content
    ***********************************************************/
    Barix.prototype.append = function (htmlContent) {
        for (var i in this.elems) {
            this.elems[i].innerHTML += htmlContent;
        }
        return this;
    };
    ////////////////////////////////////////////////////////////
    /***********************************************************
    * .trigger (eventName: string)
    ***********************************************************/
    Barix.prototype.trigger = function (evName) {
        var event = document.createEvent('HTMLEvents');
        event.initEvent(evName, true, false);
        for (var i in this.elems) {
            this.elems[i].dispatchEvent(event);
        }
        return this;
    };
    ////////////////////////////////////////////////////////////
    /***********************************************************
    * .addFunc("funcName", Function, isStatic) to extend functionality of Barix
    ***********************************************************/
    Barix.addFunc = function (funcName, func, isStatic) {
        if (isStatic) {
            Barix[funcName] = func;
        }
        else {
            Barix.prototype[funcName] = func;
        }
    };
    ////////////////////////////////////////////////////////////
    /***********************************************************
    * List to Array Converter
    ***********************************************************/
    Barix.ListToArray = function (list) {
        var arr = [];
        for (var i = 0; i < list.length; i++) {
            arr.push(list[i]);
        }
        return arr;
    };
    ////////////////////////////////////////////////////////////
    Barix.get = function (url, success, error) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState == 4) {
                if (xhttp.status == 200) {
                    success(xhttp.responseText);
                }
                else if (xhttp.status == 400) {
                    error(xhttp.responseText);
                }
            }
        };
        xhttp.open("GET", url, true);
        xhttp.send();
    };
    return Barix;
}());
var bx = Barix.select;
//# sourceMappingURL=barix.js.map