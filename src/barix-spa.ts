namespace bxpa {
    /*
     * This class will be used internally to keep track of global things like, Modules, Routes, Pages
     */
    class _Global {
        private static modules: IModule[] = [];
        private static routes: IRoute[] = [];
        private static pages: IPage[] = [];

        public static createModule (moduleInstance: IModule) {
            for (let i in _Global.modules) {
                if (_Global.modules[i].name == moduleInstance.name) {
                    let e = 'Duplicate Module Error. Module "${moduleInstance.name}" is already present';
                    throw e;
                }
            }
            _Global.modules.push(moduleInstance);
        }

        public static createRoute (routeInstance: IRoute) {
            for (let i in _Global.routes) {
                if (_Global.routes[i].url == routeInstance.url) {
                    let e = 'Duplicate Route Error. Route "${routeInstance.url}" is already present';
                    throw e;
                }
            }
            _Global.routes.push(routeInstance);
        }

        public static createPage (pageInstance: IPage) {
            for (let i in _Global.pages) {
                if (_Global.pages[i].name == pageInstance.name) {
                    let e = 'Duplicate Page Error. Page "${pageInstance.name}" is already present';
                    throw e;
                }
            }
            _Global.pages.push(pageInstance);
        }

        public static getRoute(url: string): IRoute {
            for (let i in _Global.routes) {
                if (_Global.routes[i].url == url) {
                    return _Global.routes[i];
                }
            }
            return undefined;
        }

        public static getPage(pageName: string): IPage {
            for (let i in _Global.pages) {
                if (_Global.pages[i].name == pageName) {
                    return _Global.pages[i];
                }
            }
            let e = "No such page exists with page name= ${pageName}";
        } 
    }
   
    class _Module {
        name: string;
        constructor(name: string) {
            this.name = name;
            _Global.createModule(this);
        }
    }

    class _Route {
        name: string;
        url: string;
        pageName: string;

        constructor(c: IRoute) {
            this.name = c.name;
            this.url = c.url;
            this.pageName = c.pageName;

            _Global.createRoute(this);
        }        
    }

    class _Page {
        name: string;
        template: string;
        templateUrl: string;

        constructor(c: IPage) {
            this.name = c.name;
            this.template = c.template;
            this.templateUrl = c.templateUrl;
            _Global.createPage(this);
        }

    }

    class _Events {
        
    }

    class _RouterEngine {
        private static otherwiseUrl: string = "";

        static start() {
            //1st time update
            _RouterEngine.updatePage();

            //subsequent watch
            _RouterEngine.watchRoute();
        }

        static setOtherwise(url: string) {
            if (_Global.getRoute(url) == undefined) {
                let e = "The Otherwise Url is Not Found... It must be defined before the call to .otherwise.";
            } else {
                if (_RouterEngine.otherwiseUrl.length > 0) {
                    console.log("Otherwise URL was already present as ${_RouterEngine.otherwiseUrl}. Rewriting it with ${url}");
                }
                _RouterEngine.otherwiseUrl = url;
            }
        }

        private static watchRoute() {
            window.onhashchange = () => {
                _RouterEngine.updatePage();
            };
        }

        private static updatePage() {
            let hash = window.location.hash;
            while (hash[0] == '#' || hash[0] == '!') {
                hash = hash.substring(1);
            }

            let r = _Global.getRoute(hash);

            //if the route is undefined, re-route user to _RouterEngine.otherwiseUrl;
            if (r == undefined) {
                window.location.hash = "#" + _RouterEngine.otherwiseUrl;
                return;
            }

            let p = _Global.getPage(r.pageName);

            bx('bx-page').html(p.template);
        }
    }

    class _Engine {
        private static running: boolean = false;
        static run() {
            if (_Engine.running) {
                let e = "Can't start the app engine twice. App Engine is already running...";
                throw e;
            }
            _RouterEngine.start();            
        }
    }

    export class module {        
        static create(name: string) {
            return (new _Module(name));
        }
    }

    export class route {
        static when(c: IRoute) {
            new _Route(c);
            return bxpa.route;  //return bxpa.route for chainablility
        }

        static otherwise(url: string) {
            _RouterEngine.setOtherwise(url);
        }
    }

    export class page {
        static create(c: IPage) {
            return (new _Page(c));
        }
    }
    
    export class main {
        public static start() {
            console.log('main.start called');
            _Engine.run();
        }
    }
}







interface IRoute {
    name?: string;
    url: string;
    pageName: string;
}

interface IRouteRedirect {
    from: string;
    to: string;
}

interface IPage {
    name: string;
    template?: string;
    templateUrl?: string;
}

interface IModule {
    name: string;
}



