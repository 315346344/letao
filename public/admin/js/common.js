    //关闭进度环
    NProgress.configure({ showSpinner: false });

    //发送ajax请求时触发
    $(document).ajaxStart(function() {
        NProgress.start();
    });
    //发送ajax请求结束时触发
    $(document).ajaxStop(function() {
        NProgress.done();
    });



    if(location.href.indexOf("login.html") == -1){
        $.ajax({
            type: "get",
            url: "/employee/checkRootLogin",
            success: function (data) {
                if(data.error === 400){
                    location.href = "login.html";
                }
            }
        })
    }



    $(".child").prev().on("click", function() {
        $(this).next().slideToggle();
    })


    $(".icon_menu").on("click", function() {
        $(".lt_main").toggleClass("now");
        $(".lt_aside").toggleClass("now");
    })

    $(".icon_logout").on("click", function() {
        $("#logoutModal").modal("show");

        $(".btn_logout").off().on("click", function() {

            $.ajax({
                type: "get",
                url: "/employee/employeeLogout",
                success: function(data) {
                    if (data.success) {
                        location.href = "login.html";
                    }
                }
            })



        })

    })