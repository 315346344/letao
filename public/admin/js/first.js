$(function () {


    var page = 1;
    var pageSize = 5;

   function render(){
       $.ajax({
           type: 'get',
           url: '/category/queryTopCategoryPaging',
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
        $("#firstModal").modal("show");
    })


    var $form = $("form");
    $form.bootstrapValidator({
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields:{
            categoryName: {
                validators:{
                    notEmpty:{
                        message:"一级分类名称不能为空"
                    }
                }
            }
        }
    })

    $form.on("success.form.bv", function (e) {
        e.preventDefault();
        $.ajax({
            type:'post',
            url:'/category/addTopCategory',
            data:$form.serialize(),
            success: function (data) {
                if(data.success){
                    $("#firstModal").modal("hide");
                    page=1;
                    render();

                    $form.data('bootstrapValidator').resetForm();

                    $form[0].reset();
                }
            }
        })
    })





})


