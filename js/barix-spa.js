/*
 *  RULES & CONVENTIONS
 *  1. Write the modules alphabatically so that becomes easier to find
 *  2. All public facing functions should promote chainability. To differentiate public facing functions
        use $ at the begining of the function name. And note, whener a function name starts with $, it must
        return 'this'
    3. Mark all internally shared functions with a starting _. e.g. _showPageToUser in _bxpa.Page.show
 */

"use strict"
var bxpa;
(function(){
    /*****************************************************************
    *************** ALL PRIVATE AND INTERNAL VARIABLES ***************
    ******************************************************************/
    var _bxpa = {
        Events: {
            listeners: {
                routeChange: []
            }
        },
        Page: {
            db: {},
            show: _showPageToUser
        },
        Route: {
            db: {},
            redirectDB: {}, //{from1:to1, from2:to2}
        }
    };
    //////////////////////////////////////////////////////////////////
    
    /*****************************************************************
    *************** ALL PUBLIC and USER FACING VARIABLES *************
    ******************************************************************/
    bxpa = {
        event: {
            on: $saveListenerFn
        },
        page: {
            add: $addPage
        },
        route: {
            when: $route_When,
            otherwise: $route_Otherwise,
            redirect: $route_Redirect
        },
        start: init
    };
    //////////////////////////////////////////////////////////////////
    
    
    
    /*****************************************************************
    * EVENTS MODULE
    * This module will fire internal and external events
    * It will store the list of eventHandlers
    * When any event occurs it will call the respective  eventHandlers
    ******************************************************************/
    
    //this function will take an eventName and callbackFuntion
    //and push the function to the appropriate callback array
    function $saveListenerFn (eventName, callbackFn) {
        switch(eventName) {
            case "routeChange":
                _bxpa.Events.listeners.routeChange.push(callbackFn);
                break;
        }
        
        return this;
    }
    
    function startRouteChangeWatcher () {
        var listnrs = _bxpa.Events.listeners.routeChange;
        
        if (typeof(window.onhashchange) != "undefined") {
            window.onhashchange = tellEveryoneRouteChanged;
            
            //for 1st time only force check route change
            tellEveryoneRouteChanged();
        } 
        else {
            var oldRoute = '';
            function checkRoute() {
                if (oldRoute != window.location.href) {
                    tellEveryoneRouteChanged();
                }
                oldRoute = window.location.href;
                setTimeout(checkRoute, 1000);
            }
            checkRoute();
        }
        
        function tellEveryoneRouteChanged () {
            for(var i in listnrs) {
              listnrs[i]();console.log('here');
            }
        }
    }
    
    function initEvents () {
        startRouteChangeWatcher();
    }
    ///////////////////////////////////////////////////////////////////
    
    
    
    /*****************************************************************
    * PAGE MODULE
    * This module will save pages internally
    * It will serve pages as required by other modules
    ******************************************************************/
    
    //it will add a new page to the page db
    function $addPage (pageObj) {
        _bxpa.Page.db[pageObj.name] = pageObj;
        return this;
    }
    
    function _showPageToUser (pageName) {
        bx("bx-page").html(_bxpa.Page.db[pageName].template);
    }
    
    ///////////////////////////////////////////////////////////////////
    
    
    
    /*****************************************************************
    * ROUTE MODULE
    * This module will save routes internally
    * It will call the Page Module to show the appropriate page
    ******************************************************************/
    
    //store the routeObj in the Route.db
    //use the url as key and routeObj as value
    function $route_When (routeObj) {
        _bxpa.Route.db[routeObj.url] = routeObj;
        return this;
    }
    
    function $route_Otherwise (url) {
        _bxpa.Route.db["otherwiseUrl"] = url;
        return this;
    }
    
    function $route_Redirect (fromUrl, toUrl) {
        _bxpa.Route.redirectDB[fromUrl] = toUrl;
        return this;
    }
    
    function routeHandler () {
        var hash = window.location.hash;
        while (hash[0] == "#" || hash[0] == "!") {
            hash = hash.substr(1);
        }
        
        var routeDef = _bxpa.Route.db[hash];
        
        //if no route definition present for this route
        if(routeDef == undefined) {
            var redirectUrl = _bxpa.Route.redirectDB[hash];
            if (redirectUrl == undefined) {
                redirectUrl = _bxpa.Route.db["otherwiseUrl"];
            }
            window.location.hash = '#'+redirectUrl;
            return;
        }
        
        _bxpa.Page.show(routeDef.pageName);        
    }
    
    function initRoute() {
        bxpa.event.on("routeChange", routeHandler);
    }
    
    ///////////////////////////////////////////////////////////////////
    
    /******************************************************************
    * The Init Function to START it all
    ******************************************************************/
    function init () {
        initRoute();
        initEvents();        
    }   
    
    ///////////////////////////////////////////////////////////////////
})()