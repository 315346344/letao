$(function () {

    var page = 1;
    var pageSize = 5;

    function render() {
        $.ajax({
            type: 'get',
            url: '/category/querySecondCategoryPaging',
            data: {
                page: page,
                pageSize: pageSize
            },
            success: function (data) {

                var html = template("tpl", data);
                $("tbody").html(html);

                //渲染分页
                $("#paginator").bootstrapPaginator({
                    bootstrapMajorVersion: 3,
                    totalPages: Math.ceil(data.total / data.size),
                    currentPage: page,
                    onPageClicked: function (a, b, c, p) {
                        page = p;
                        render();
                    }
                });


            }
        })

    }

    render();

    $(".btn_add").on("click", function () {
        $("#secondModal").modal("show");

        $.ajax({
            type: 'get',
            url: '/category/queryTopCategoryPaging',
            data: {
                page: 1,
                pageSize: 100
            },
            success: function (data) {
                $('.dropdown-menu').html(template('tpl2', data));
            }
        })
    })


    $(".dropdown-menu").on("click", "a", function () {
        $(".dropdown-text").text($(this).text());

        $("[name='categoryId']").val($(this).data("id"));

        $form.data("bootstrapValidator").updateStatus("categoryId", "VALID");
    })


    $("#fileupload").fileupload({
        dataType: "json",
        //e：事件对象
        //data：图片上传后的对象，通过e.result.picAddr可以获取上传后的图片地址
        done: function (e, data) {
            $(".img_box img").attr("src", data.result.picAddr);

            $("[name='brandLogo']").val(data.result.picAddr);

            $form.data("bootstrapValidator").updateStatus("brandLogo", "VALID");
        }
    });


//使用表单校验插件
    $form = $("form");
    $form.bootstrapValidator({
        excluded: [],

        //2. 指定校验时的图标显示，默认是bootstrap风格
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },


        fields: {
            //校验用户名，对应name表单的name属性
            categoryId: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '请选择'
                    },
                }
            },

            brandName: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '请填写'
                    },
                }
            },

            brandLogo: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '请上传图片'
                    },
                }
            },


        }


    });


    $form.on('success.form.bv', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/category/addSecondCategory',
            data: $form.serialize(),
            success: function (data) {
                if(data.success){
                    $("#secondModal").modal("hide");
                    page = 1;
                    render();

                    $form.data("bootstrapValidator").resetForm();
                    $form[0].reset();

                    $(".dropdown-text").text("请选择一级分类");
                    $(".img_box img").attr("src", "images/none.png");
                    $("[type='hidden']").val('');
                }
            }
        })
    });
})
