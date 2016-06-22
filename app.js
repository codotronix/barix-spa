bx(function(){
    bxpa.page
        .add({
            "name": "HomePage",
            "template": "<br/><b>Welcome to Home Page</b>"
        })
        .add({
            "name": "AboutPage",
            "template": "<br/><b>I am Suman Barick</b>"
        });
        
    bxpa.route
        .when({
            "url": "/home",
            "pageName": "HomePage"
        })
        .when({
            "url": "/about",
            "pageName": "AboutPage"
        })
        .otherwise("/home");
    
    
    bxpa.start();
    
})