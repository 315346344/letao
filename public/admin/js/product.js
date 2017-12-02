$(function () {
    var page = 1;
    var pageSize = 5;

    var imgs = [];

    function render() {
        $.ajax({
            type: 'get',
            url: '/product/queryProductDetailList',
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
                    itemTexts: function (type, page, current) {
                        if (type == "next") {
                            return "下一页";
                        } else if (type == "last") {
                            return "尾页";
                        } else if (type == "prev") {
                            return "上一页";
                        } else if (type == "first") {
                            return "首页";
                        } else {
                            return page;
                        }
                    },
                    bootstrapTooltipOptions: {
                        animation: true
                    },
                    tooltipTitles: function (type, page, current) {
                        if (type == "next") {
                            return "下一页";
                        } else if (type == "last") {
                            return "尾页";
                        } else if (type == "prev") {
                            return "上一页";
                        } else if (type == "first") {
                            return "首页";
                        } else {
                            return page;
                        }
                    },
                    useBootstrapTooltip: true,
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
        $("#productModal").modal("show");

        $.ajax({
            type: 'get',
            url: '/category/querySecondCategoryPaging',
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

        $("[name='brandId']").val($(this).data("id"));

        $form.data("bootstrapValidator").updateStatus("brandId", "VALID");
    })


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
            brandId: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '请选择品牌'
                    },
                }
            },

            proName: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '请选择'
                    },
                }
            },

            proDesc: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '请填写'
                    },
                }
            },

            num: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '请填写'
                    },
                    regexp: {
                        regexp: /^[1-9]\d*$/,
                        message: '库存要大于0',
                    },
                }
            },

            size: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '请填写'
                    },
                    regexp: {
                        regexp: /^\d{2}-\d{2}$/,
                        message: '格式错误',
                    },

                }
            },

            oldPrice: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '请填写'
                    },
                }
            },

            price: {
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
                        message: '需要三张图片'
                    },
                }
            },

        }

    });


    $("#fileupload").fileupload({
        dataType: "json",
        //e：事件对象
        //data：图片上传后的对象，通过e.result.picAddr可以获取上传后的图片地址
        done: function (e, data) {
            //console.log(data.result);
            $(".img_box").append('<img src="' + data.result.picAddr + '" width="100" height="100" >');

            imgs.push(data.result);

            if (imgs.length === 3) {
                $form.data("bootstrapValidator").updateStatus("brandLogo", "VALID");
            } else {
                $form.data("bootstrapValidator").updateStatus("brandLogo", "INVALID");
            }
        }


    });



    $("form").on("success.form.bv", function (e) {
        e.preventDefault();

        var param = $("form").serialize();
        param += "&picName1="+imgs[0].picName + "&picAddr1=" + imgs[0].picAddr;
        param += "&picName2="+imgs[1].picName + "&picAddr2=" + imgs[1].picAddr;             param += "&picName3="+imgs[2].picName + "&picAddr3=" + imgs[2].picAddr;

        $.ajax({
            type:"post",
            url:"/product/addProduct",
            data: param,
            success: function (data) {
                if(data.success){
                    $("#productModal").modal("hide");
                    page = 1;
                    render();

                    imgs = [];
                    $(".dropdown-text").text("请选择二级分类");
                    $("form").data("bootstrapValidator").resetForm();
                    $form[0].reset();
                    $("[name='brandLogo']").val('');
                    $(".img_box").remove();
                }
            }
        })
    })


})
