/*!
 * Barix (https://github.com/codotronix/Barix)
 * Copyright 2016 Suman Barick
 * Licensed under the MIT license
 */
"use strict"
class Barix {
    elems: Array<Element>;

    /**********************************************************
	 * constructor
	 *********************************************************/
    constructor(elems: Array<Element>) {
        this.elems = elems;
    }
    ///////////////////////////////////////////////////////////


	/**********************************************************
	 * a jquery like selector
	 *********************************************************/
    public static select(selector: string | Node | Function): Barix | any {
        let elems: Array<Element> = new Array<Element>();

        //if selector is empty return the Barix class itself to make static calls easier
        if (typeof (selector) == "undefined") {
            return Barix;
        }

        //if bx(function(){}) is used as document ready
        if (selector && typeof (selector) == "function") {
            Barix.prototype["onReadyFnQueue"] = Barix.prototype["onReadyFnQueue"] || [];
            Barix.prototype["onReadyFnQueue"].push(selector);

            window.onload = () => {
                //execute all the doc ready function one by one
                for (let i in Barix.prototype["onReadyFnQueue"]) {
                    Barix.prototype["onReadyFnQueue"][i]();
                }
                //once done calling all, delete them to freeup memory
                delete Barix.prototype["onReadyFnQueue"];
            };
        }
        //if the selector is a css selector
        else if (selector && typeof (selector) == "string") {
            let elemList = document.querySelectorAll(selector as string);
            elems = Barix.ListToArray(elemList);
        }
        //if selector is already an element
        else if (selector && selector instanceof Element) {
            elems.push(selector);
        } else {
            var e: ExceptionInformation = 'Barix: ' + selector + ' is not a supported selector or Element.';
            throw e;
        }

        let b = new Barix(elems);
        return b;
    }
    ///////////////////////////////////////////////////////////


    /**********************************************************
	 * .remove()
	 *********************************************************/
    public remove(): Barix {
        for (let i in this.elems) {
            this.elems[i].parentNode.removeChild(this.elems[i]);
        }
        return this;
    }
    ///////////////////////////////////////////////////////////

    /**********************************************************
	 * .find('selector')
	 *********************************************************/
    public find(selector: string): Barix {
        var newElems: Element[] = [];
        var tempArray: Element[];
        for (let i in this.elems) {
            tempArray = Barix.ListToArray(this.elems[i].querySelectorAll(selector));
            //push all elements in newElems array
            for (let j in tempArray) {
                newElems.push(tempArray[j]);
            }
        }
        this.elems = newElems;
        return this;
    }
    ///////////////////////////////////////////////////////////


    /**********************************************************
	 * .attr('attrName', 'attrValue')
	 *********************************************************/
    public attr(...args): string | Barix {
        let attrJSON = {};
        //if it is a get request
        if (args.length == 1 && typeof (args[0]) === "string") {
            return this.elems[0].getAttribute(args[0]);
        }

        //if it is set request with multiple (key, value) as JSON
        if (args.length == 1 && typeof (args[0]) === "object") {
            attrJSON = args[0];
        }

        //if it is set request with single (key, value)
        else if (args.length == 2) {
            attrJSON[args[0]] = args[1];
        }

        else {
            var info = 'Barix: attr() method can be called in 3 ways \n 1. attr("attributeName") \n 2. attr("name", "value") \n 3. attr({"name1": "value1", "name2": "value2"....})';
            throw info;
        }

        //loop thru all the elements and then all the attributes
        for (let i in this.elems) {
            for (let key in attrJSON) {
                this.elems[i].setAttribute(key, attrJSON[key]);
            }
        }

        return this;
    }
    ///////////////////////////////////////////////////////////


    /***********************************************************
    * .css({styleNameValuePairObject})
    ***********************************************************/
    public css(...args): string | Barix {
        let styleObj: any = {};

        //if it is a get request
        if (args.length == 1 && typeof (args[0]) === "string") {
            return (this.elems[0] as HTMLElement).style[args[0]];
        }

        //if style is provided as json object
        if (args.length == 1 && typeof (args[0]) === "object") {
            styleObj = args[0];
        }

        //if style is provided as (name,value)
        else if (args.length == 2) {
            styleObj[args[0]] = args[1];
        }

        else {
            var e = 'Barix: css style can be provided as single (name,value) pair or as a json object.'
            throw e;
        }

        for (let i in this.elems) {
            for (let key in styleObj) {
                (this.elems[i] as HTMLElement).style[key] = styleObj[key];
            }
        }
        return this;
    }
    /////////////////////////////////////////////////////////////


	/**********************************************************
	 * addClass("class1 class2")
	 *********************************************************/
    public addClass(classNames: string): Barix {
        let classes = (classNames || "").trim();
        let classAddArr: string[] = classes.split(' ');
        let el: Element;
        for (let i in this.elems) {
            el = this.elems[i];
            for (let j in classAddArr) {
                if (el.className.indexOf(classAddArr[j]) < 0) {
                    el.className += " " + classAddArr[j];
                }
            }
            el.className = el.className.trim();
        }
        return this;
    }
    ///////////////////////////////////////////////////////////


	/**********************************************************
	 * removeClass...
	 *********************************************************/
    public removeClass(classNames: string): Barix {
        let classes = (classNames || "").trim();

        //if empty, then remove all classes
        if (classes == "") {
            for (let i in this.elems) {
                this.elems[i].className = '';
            }
            return this;
        }

        //if Not Empty
        let classRemArr: string[] = classes.split(' ');
        let existingClasses: string[];
        let newClasses: string;
        for (let i in this.elems) {
            newClasses = '';
            existingClasses = this.elems[i].className.split(' ');
            for (let j in existingClasses) {
                if (classRemArr.indexOf(existingClasses[j]) < 0) {
                    newClasses += " " + existingClasses[j];
                }
            }
            newClasses = newClasses.trim();
            this.elems[i].className = newClasses;
        }
        return this;
    }
    ///////////////////////////////////////////////////////////


	/**********************************************************
	 * hasClass
	 *********************************************************/
    public hasClass(classNames: string): boolean {
        let classes = (classNames || "").trim();

        //if empty, return true
        if (classes == "") {
            return true;
        }

        //if Not Empty
        let classArgArr: string[] = classes.split(' ');
        let existingClasses: string[];
        let el: Element;
        let newClasses: string;
        let hasClass: boolean = true;

        for (let i in this.elems) {
            el = this.elems[i];
            for (let j in classArgArr) {
                if (el.className.indexOf(classArgArr[j]) < 0) {
                    hasClass = false;
                    return hasClass;
                }
            }
        }
        return hasClass;
    }
    ///////////////////////////////////////////////////////////

    /**********************************************************
	 * .hide() - it saves the displayValue as attr to use in .show()
	 *********************************************************/
    public hide(): Barix {
        let displayValue: string;
        for (let i in this.elems) {
            displayValue = (this.elems[i] as HTMLElement).style.display;
            if (displayValue) {
                (this.elems[i] as HTMLElement).setAttribute("barix-internal-oldDiplayVal", displayValue);
            }
            (this.elems[i] as HTMLElement).style.display = "none";
        }
        return this;
    }
    ///////////////////////////////////////////////////////////


    /**********************************************************
	 * .show(displayValue?)
	 *********************************************************/
    public show(dispVal: string): Barix {
        let displayValue: string;
        for (let i in this.elems) {
            displayValue = dispVal || (this.elems[i] as HTMLElement).getAttribute("barix-internal-oldDiplayVal") || "block";
            (this.elems[i] as HTMLElement).style.display = displayValue;
        }
        return this;
    }
    ///////////////////////////////////////////////////////////



	/**********************************************************
	 * .each(callback)
	 *********************************************************/
    public each(callback: Function): Barix {
        let c: Function;
        for (let i in this.elems) {
            c = callback.bind(this.elems[i]);		//so that this=element
            c(i, this.elems[i]);				//param1=index, param2=element=this
        }
        return this;
    }
    ////////////////////////////////////////////////////////////


    /***********************************************************
    * .on
    ***********************************************************/
    public on(...args): Barix {
        let eventName: string = args[0];
        let selector: string;
        let callback: EventListener;

        if (args.length == 2) {
            callback = args[1];
            for (let i in this.elems) {
                this.elems[i].addEventListener(eventName, callback);
            }
        }
        else if (args.length == 3) {
            selector = args[1];
            callback = args[2];
            let parentEl: Element;
            let selectorEl: NodeListOf<Element>;
            let selectorElArr: Element[];
            let el: Element;
            let cb: Function;

            for (let i in this.elems) {
                parentEl = this.elems[i];

                parentEl.addEventListener(eventName, function (ev) {
                    selectorEl = parentEl.querySelectorAll(selector);
                    selectorElArr = Barix.ListToArray(selectorEl);
                    el = ev.target as Element;
                    while (el != parentEl) {
                        if (selectorElArr.indexOf(el) > -1) {
                            cb = callback.bind(el);
                            cb(ev);
                            break;
                        }
                        else {
                            el = el.parentElement;
                        }
                    }
                })
            }
        }
        return this;
    }
    ////////////////////////////////////////////////////////////


    /***********************************************************
    * .text(textContent) -> overwrites text Content
    ***********************************************************/
    public text(textContent: string): Barix {
        for (let i in this.elems) {
            this.elems[i].textContent = textContent;
        }
        return this;
    }
    ////////////////////////////////////////////////////////////


    /***********************************************************
    * .appendText(textContent) -> appends text Content
    ***********************************************************/
    public appendText(textContent: string): Barix {
        for (let i in this.elems) {
            this.elems[i].textContent += textContent;
        }
        return this;
    }
    ////////////////////////////////////////////////////////////


    /***********************************************************
    * .html(htmlContent) -> overwrites HTML Content
    ***********************************************************/
    public html(htmlContent: string): Barix {
        for (let i in this.elems) {
            this.elems[i].innerHTML = htmlContent;
        }
        return this;
    }
    ////////////////////////////////////////////////////////////


    /***********************************************************
    * .append(htmlContent) -> Appends HTML Content
    ***********************************************************/
    public append(htmlContent: string): Barix {
        for (let i in this.elems) {
            this.elems[i].innerHTML += htmlContent;
        }
        return this;
    }
    ////////////////////////////////////////////////////////////

    /***********************************************************
    * .trigger (eventName: string)
    ***********************************************************/
    public trigger(evName: string): Barix {
        var event = document.createEvent('HTMLEvents');
        event.initEvent(evName, true, false);
        for (let i in this.elems) {
            this.elems[i].dispatchEvent(event);
        }
        return this;
    }
    ////////////////////////////////////////////////////////////


    /***********************************************************
    * .addFunc("funcName", Function, isStatic) to extend functionality of Barix
    ***********************************************************/
    public static addFunc(funcName: string, func: Function, isStatic?: boolean) {
        if (isStatic) {
            Barix[funcName] = func;
        } else {
            Barix.prototype[funcName] = func;
        }
    }
    ////////////////////////////////////////////////////////////


    /***********************************************************
    * List to Array Converter
    ***********************************************************/
    public static ListToArray(list: any) {
        let arr: any = [];
        for (let i = 0; i < list.length; i++) {
            arr.push(list[i]);
        }
        return arr;
    }
    ////////////////////////////////////////////////////////////

    public static get(url: string, success: Function, error: Function) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = () => {
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
    }
}
var bx = Barix.select;