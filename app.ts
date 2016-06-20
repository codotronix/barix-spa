bx(function () {
    bx('bx-page').html('<br><br><b>bx is ON</b>');

    bxpa.page.create({
        "name": "page_Home",
        "template": "<span>Welcome Home...</span>",
        "templateUrl": ""
    })

    bxpa.page.create({
        "name": "page_Work",
        "template": "<span>Work is Worship...</span>",
        "templateUrl": ""
    })

    bxpa.route
        .when({
            "url": "/home",
            "pageName": "page_Home"
        })
        .when({
            "url": "/work",
            "pageName": "page_Work"
        })
        .otherwise("/home");

    bxpa.main.start();
})