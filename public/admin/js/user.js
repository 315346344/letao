$(function () {

    var curPage = 1;
    var pageSize = 5;

    function render() {
        $.ajax({
            type: 'get',
            url: '/user/queryUser',
            data: {
                page: curPage,
                pageSize: pageSize
            },
            success: function (data) {

                var html = template("tpl", data);
                $("tbody").html(html);


                //渲染分页
                $("#paginator").bootstrapPaginator({
                    bootstrapMajorVersion: 3,
                    totalPages: Math.ceil(data.total / data.size),
                    currentPage: curPage,
                    onPageClicked: function (a, b, c, p) {
                        curPage = p;
                        render();
                    }
                });

            }

        })
    }

    render();


//    启用禁用
    $("tbody").on("click", ".btn", function () {

        $("#userModal").modal("show");

        var id =$(this).parent().data("id");
        var isDelete = $(this).hasClass("btn-danger")? 0:1;
        $(".btn_confirm").off().on("click", function () {
            $.ajax({
                type: 'post',
                url: '/user/updateUser',
                data:{
                    id:id,
                    isDelete:isDelete
                },
                success: function () {
                    $("#userModal").modal("hide");
                    render();
                }
            })
        })
    })


})
