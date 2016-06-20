var bxpa;
(function (bxpa) {
    /*
     * This class will be used internally to keep track of global things like, Modules, Routes, Pages
     */
    var _Global = (function () {
        function _Global() {
        }
        _Global.createModule = function (moduleInstance) {
            for (var i in _Global.modules) {
                if (_Global.modules[i].name == moduleInstance.name) {
                    var e = 'Duplicate Module Error. Module "${moduleInstance.name}" is already present';
                    throw e;
                }
            }
            _Global.modules.push(moduleInstance);
        };
        _Global.createRoute = function (routeInstance) {
            for (var i in _Global.routes) {
                if (_Global.routes[i].url == routeInstance.url) {
                    var e = 'Duplicate Route Error. Route "${routeInstance.url}" is already present';
                    throw e;
                }
            }
            _Global.routes.push(routeInstance);
        };
        _Global.createPage = function (pageInstance) {
            for (var i in _Global.pages) {
                if (_Global.pages[i].name == pageInstance.name) {
                    var e = 'Duplicate Page Error. Page "${pageInstance.name}" is already present';
                    throw e;
                }
            }
            _Global.pages.push(pageInstance);
        };
        _Global.getRoute = function (url) {
            for (var i in _Global.routes) {
                if (_Global.routes[i].url == url) {
                    return _Global.routes[i];
                }
            }
            return undefined;
        };
        _Global.getPage = function (pageName) {
            for (var i in _Global.pages) {
                if (_Global.pages[i].name == pageName) {
                    return _Global.pages[i];
                }
            }
            var e = "No such page exists with page name= ${pageName}";
        };
        _Global.modules = [];
        _Global.routes = [];
        _Global.pages = [];
        return _Global;
    }());
    var _Module = (function () {
        function _Module(name) {
            this.name = name;
            _Global.createModule(this);
        }
        return _Module;
    }());
    var _Route = (function () {
        function _Route(c) {
            this.name = c.name;
            this.url = c.url;
            this.pageName = c.pageName;
            _Global.createRoute(this);
        }
        return _Route;
    }());
    var _Page = (function () {
        function _Page(c) {
            this.name = c.name;
            this.template = c.template;
            this.templateUrl = c.templateUrl;
            _Global.createPage(this);
        }
        return _Page;
    }());
    var _Events = (function () {
        function _Events() {
        }
        return _Events;
    }());
    var _RouterEngine = (function () {
        function _RouterEngine() {
        }
        _RouterEngine.start = function () {
            //1st time update
            _RouterEngine.updatePage();
            //subsequent watch
            _RouterEngine.watchRoute();
        };
        _RouterEngine.setOtherwise = function (url) {
            if (_Global.getRoute(url) == undefined) {
                var e = "The Otherwise Url is Not Found... It must be defined before the call to .otherwise.";
            }
            else {
                if (_RouterEngine.otherwiseUrl.length > 0) {
                    console.log("Otherwise URL was already present as ${_RouterEngine.otherwiseUrl}. Rewriting it with ${url}");
                }
                _RouterEngine.otherwiseUrl = url;
            }
        };
        _RouterEngine.watchRoute = function () {
            window.onhashchange = function () {
                _RouterEngine.updatePage();
            };
        };
        _RouterEngine.updatePage = function () {
            var hash = window.location.hash;
            while (hash[0] == '#' || hash[0] == '!') {
                hash = hash.substring(1);
            }
            var r = _Global.getRoute(hash);
            //if the route is undefined, re-route user to _RouterEngine.otherwiseUrl;
            if (r == undefined) {
                window.location.hash = "#" + _RouterEngine.otherwiseUrl;
                return;
            }
            var p = _Global.getPage(r.pageName);
            bx('bx-page').html(p.template);
        };
        _RouterEngine.otherwiseUrl = "";
        return _RouterEngine;
    }());
    var _Engine = (function () {
        function _Engine() {
        }
        _Engine.run = function () {
            if (_Engine.running) {
                var e = "Can't start the app engine twice. App Engine is already running...";
                throw e;
            }
            _RouterEngine.start();
        };
        _Engine.running = false;
        return _Engine;
    }());
    var module = (function () {
        function module() {
        }
        module.create = function (name) {
            return (new _Module(name));
        };
        return module;
    }());
    bxpa.module = module;
    var route = (function () {
        function route() {
        }
        route.when = function (c) {
            new _Route(c);
            return bxpa.route; //return bxpa.route for chainablility
        };
        route.otherwise = function (url) {
            _RouterEngine.setOtherwise(url);
        };
        return route;
    }());
    bxpa.route = route;
    var page = (function () {
        function page() {
        }
        page.create = function (c) {
            return (new _Page(c));
        };
        return page;
    }());
    bxpa.page = page;
    var main = (function () {
        function main() {
        }
        main.start = function () {
            console.log('main.start called');
            _Engine.run();
        };
        return main;
    }());
    bxpa.main = main;
})(bxpa || (bxpa = {}));
//# sourceMappingURL=barix-spa.js.map