
/*
*
* 未作
* file的id 和 descript 的id
* */



/*全局步骤个数*/

var totalSteps=3;
$(document).ready(function() {


    var dataSteps;
    $.get("http://127.0.0.1:8080/editMenu/showMenu",function(data,status){
        dataSteps=data;
        // alert(data);
    });

    /*成品图显示*/
    $("#rect_pic").on("change",function(event){

        $("#rect_show").attr("src",URL.createObjectURL(event.target.files[0]));
    })

    $("#square_pic").on("change",function(event){

        $("#square_show").attr("src",URL.createObjectURL(event.target.files[0]));
    })

    $('#registEdit').on('submit', function(){
        // registPost()
        // event.preventDefault() //阻止form表单默认提交
        // alert("提交了");
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: '/editMenu/updateMenu',
            data: new FormData($('#registEdit')[0]),
            processData: false,
            contentType: false,
            success: result => {
                //alert(result)

            },
            error: err => {

                if(err.responseText.indexOf("caipu")!=-1)
                    window.location.href=err.responseText;
                else
                    alert(err.responseText);
            }
        });
        return false;
    })
    // $("#file1").on("change",function(event){
    //
    //     $(".img").attr("src",URL.createObjectURL(event.target.files[0]));
    // })

    //生成多个步骤的输入
    for(k=1;k<4;k++){
        // var div_row = addrow(k);
        // $(".steps_div").append(div_row);
    }

});

function refreshCourses(a){
    var index = parseInt($(a).attr("id").replace(/[^0-9]/ig,""));
    $(a).parent().find("#img_step"+index).attr("src",URL.createObjectURL(a.files[0]));
    $(a).parent().find("#span_for_filename"+index).attr("value",URL.createObjectURL(a.files[0]));
}


function step_handle(table){

    //先获取op的下标
    var j = parseInt($(table).find(".op_code").html());

    var div_row =$(table).parent().parent().parent().parent() ;
    // alert($(span).attr("id"));

    /*获取当前行数下标*/
    var index = parseInt($(div_row).attr("id").replace(/[^0-9]/ig,""));


    /*兄弟节点的个数*/
    var totalSteps=div_row.siblings().length-1;


    if(j==0){
        /*删除步骤*/

        //获取兄弟节点的个数
        if(totalSteps==1){
            alert("您至少填写1个步骤");
            return ;
        }else{
            /*fadeout隐藏当前删除的row*/
            div_row.fadeOut("slow");

            /*获取后续的row，更新步骤号*/
            var ne = div_row.next();
            $(div_row).remove();


            while(ne.html()!=undefined){
                /*改步骤号*/

                setIdNum(ne,index++);
                ne = ne.next();
            }
        }
    }

    else if(j==1){

        /*上移操作*/
        var prev = $(div_row).prev();


        if(prev.html()!=undefined && prev.html()!="" && prev.html()!=null){

            setIdNum(prev,index);
            setIdNum(div_row,(parseInt(index)-1));


            $(prev).fadeOut("slow",function(){
                $(prev).before($(div_row));
            }).fadeIn();

        }else{
            alert("已经是第一步了");
        }
    }

    else if(j==2){

        /*下移操作*/
        var ne = $(div_row).next();

        if(ne.html()!=undefined && ne.html()!="" && ne.html()!=null){


            setIdNum(ne,index);
            setIdNum(div_row,(parseInt(index)+1));


            $(ne).fadeOut("slow",function(){
                $(ne).after($(div_row));
            }).fadeIn();

        }else{
            alert("已经是最后一步了");
        }
    }

    else{
        /*添加步骤*/
        //totalSteps目前页面全部的步骤数


        var d_pre = $("#my_op_row"+totalSteps);

        var d_totalSteps = parseInt(totalSteps)+1;

        totalSteps = parseInt(totalSteps)+1;


        while(parseInt(d_totalSteps)>parseInt(index+1)){

            // d_pre.find(".form-control").attr("placeholder",d_totalSteps+"、请输入步骤说明");
            // d_pre.attr("id","my_op_row"+d_totalSteps--);

            setIdNum(d_pre,d_totalSteps);
            d_totalSteps--;

            d_pre=d_pre.prev();
        }

        // alert(index+1);
        var dd = addrow(div_row,parseInt(index+1));
    }

}


/*
* cNum:changeNum:需要改变为的数字
* dd_row: 父div
* */
function setIdNum(dd_row,cNum){
    //获取未修改前div 的 id号
    var indexStr = dd_row.attr("id").replace(/[^0-9]/ig,"");
    var index  =  parseInt(indexStr);


    //description 的placehold修改 和id 修改
    var des_step=$(dd_row).find("#decript_step"+index);
    des_step.attr("placeholder",cNum+"、请输入步骤说明");
    des_step.attr("id","decript_step"+cNum);
    des_step.attr("name","decript_step"+cNum);

    //照片输入修改id
    var pic = $(dd_row).find("#file_step"+index);
    pic.attr("id","file_step"+cNum);
    pic.attr("name","file_step"+cNum);

    //照片filename的修改
    var span_filename = $(dd_row).find("#span_for_filename"+index)
    span_filename.attr("id","span_for_filename"+cNum);
    span_filename.attr("name","span_for_filename"+cNum);

    //照片显示修改id
    $(dd_row).find("#img_step"+index).attr("id","img_step"+cNum);


    //照片label修改  id 和指向
    var label = $(dd_row).find("#label_step"+index);
    label.attr("for","file_step"+cNum);
    label.attr("id","label_step"+cNum);

    //设置 存储index 的span
    // var spans = $(dd_row).find(".row_index_in_table");
    // alert(".row_index_in_table");

    //修改div的id
    $(dd_row).attr("id","my_op_row"+cNum);
}

function addrow(pre_original_div,idNum){

    var div_row = $("<div class='container  row op_row mt-2' id='my_op_row"+idNum+"' > </div>");

    var totalSteps=pre_original_div.siblings().length-1;

    // alert(div_row.attr("id"));
    for (i = 0; i < 3; i++) {
        var div_col;
        /*处理最外层的col分布*/
        if(i==0 )
            div_col = $("<div class='col-lg-5 col-12'></div>");
        else if(i==1){
            div_col = $("<div class='col-lg-5 col-9'></div>");
        }
        else if(i==2)
            div_col = $("<div class='col-lg-2 col-3'></div>");
        div_row.append(div_col);


        /*三个col共有部分*/
        var form_group = $("<div class='form-group' ></div>");
        div_col.append(form_group);


        if(i==0){
            /*第一个col 文件选择*/
            var file_label = $("<label for='file_step"+idNum+"' id='label_step"+idNum+"' class='file-step'></label>");
            form_group.append(file_label);



            var file_span=$("<span class='label-placeholder'>文件上传</span>");
            file_label.append(file_span);

            var file_img = $("<img src='/img/food/empty.jpg' alt='' id='img_step"+idNum+"' class='img-responsive img'>");
            file_label.append(file_img);

            var input_for_filename = $("<input name='span_for_filename"+idNum+"' style='display: none' id='span_for_filename"+idNum+"'  value='filename='></input>");
            file_label.append(input_for_filename);


            var file_input = $("<input type='file' multiple='multiple' name='file_step"+idNum+"' id='file_step"+idNum+"' class='file-input'>");
            form_group.append(file_input);


            $(file_input).on("change",function(event){
                $(file_img).attr("src",URL.createObjectURL(event.target.files[0]));
                $(input_for_filename).attr("value",URL.createObjectURL(event.target.files[0]));
            });

        }else if(i==1){
            /*第二个col  描述输入*/
            var file_textarea = $("<textarea class='form-control' name='decript_step"+idNum+"'  rows='13' id='decript_step"+idNum+"' placeholder='"+idNum+"、请输入步骤说明'></textarea>");
            // alert(file_textarea.attr("id"));
            form_group.append(file_textarea);
        }else{
            /*第三个col 操作控制*/
            for(j=0;j<4;j++){
                var op_div = $("<div class='container  pl-0 mb-2 text-center' ></div>");
                div_col.append(op_div);
                var op_table = $("<table border='1'    class='op_table'></table>");
                op_div.append(op_table);

                var op_tr = $("<tr></tr>");
                op_table.append(op_tr);

                var op_td = $("<td class='p-1'></td>");
                op_tr.append(op_td);

                var text_str;
                var imgPath;



                /*改变op图片*/
                if(j==0){
                    var totalSteps=div_row.siblings().length-1;
                    text_str="删除本步";
                    imgPath="delete";
                    $(op_table).click(function (){
                        /*删除步骤*/

                        /*获取当前div_row的id*/
                        var index  =  parseInt(div_row.attr("id").replace(/[^0-9]/ig,""));

                        if(totalSteps==1){
                            alert("您至少填写一个步骤");
                            return ;
                        }

                        /*fadeout隐藏当前删除的row*/
                        $("#my_op_row"+index).fadeOut("slow");


                        /*获取后续的row，更新步骤号*/
                        var ne = $("#my_op_row"+index).next();
                        $(div_row).remove();


                        while(ne.html()!=undefined){
                            /*改步骤号*/

                            setIdNum(ne,index++);
                            // ne.find(".form-control").attr("placeholder",index+"、请输入步骤说明");
                            // ne.attr("id","#my_op_row"+index++);
                            ne = ne.next();
                        }


                        /*改变总下标*/
                        totalSteps--;
                        // alert(totalSteps);
                    });
                }
                else if(j==1){
                    text_str="上移一步"
                    imgPath="up";

                    /*上移操作*/
                    $(op_table).click(function (){
                        var prev = $(div_row).prev();
                        // alert();
                        if(prev.html()!=undefined && prev.html()!="" && prev.html()!=null){
                            // alert(prev.html());

                            var index  =  parseInt(div_row.attr("id").replace(/[^0-9]/ig,""));

                            // $(prev).attr("id","#my_op_row"+index);
                            // $(prev).find(".form-control").attr("placeholder",index+"、请输入步骤说明");

                            setIdNum(prev,index);
                            setIdNum(div_row,(parseInt(index)-1));

                            // $(div_row).attr("id","#my_op_row"+(index-1));
                            // $(div_row).find(".form-control").attr("placeholder",(index-1)+"、请输入步骤说明");

                            $(prev).fadeOut("slow",function(){
                                $(prev).before($(div_row));
                            }).fadeIn();

                        }else{
                            alert("已经是第一步了");
                        }
                    });
                }

                else if(j==2){
                    text_str="下移一步"
                    imgPath="down";
                    /*下移操作*/
                    $(op_table).click(function (){
                        var ne = $(div_row).next();
                        if(ne.html()!=undefined && ne.html()!="" && ne.html()!=null){

                            var index  =  parseInt(div_row.attr("id").replace(/[^0-9]/ig,""));

                            // $(ne).attr("id","#my_op_row"+index);
                            // $(ne).find(".form-control").attr("placeholder",index+"、请输入步骤说明");
                            setIdNum(ne,index);
                            setIdNum(div_row,(parseInt(index)+1));

                            // $(div_row).attr("id","#my_op_row"+(index+1));
                            // $(div_row).find(".form-control").attr("placeholder",(index+1)+"、请输入步骤说明");


                            $(ne).fadeOut("slow",function(){
                                $(ne).after($(div_row));
                            }).fadeIn();

                            // alert($(div_row).attr("id"));
                        }else{
                            alert("已经是最后一步了");
                        }

                    });
                }
                else{
                    text_str="添加一步";
                    imgPath="add";
                    $(op_table).click(function (){
                        /*添加步骤*/
                        //totalSteps目前页面全部的步骤数

                        /*获取当前div_row的id*/
                        var index  =  parseInt(div_row.attr("id").replace(/[^0-9]/ig,""));

                        var totalSteps=div_row.siblings().length-1;

                        var d_pre = $("#my_op_row"+totalSteps);

                        var d_totalSteps = parseInt(totalSteps)+1;


                        while(parseInt(d_totalSteps)>parseInt(index+1)){

                            // d_pre.find(".form-control").attr("placeholder",d_totalSteps+"、请输入步骤说明");
                            // d_pre.attr("id","my_op_row"+d_totalSteps--);

                            setIdNum(d_pre,d_totalSteps);
                            d_totalSteps--;


                            d_pre=d_pre.prev();
                        }

                        // alert(index);
                        var dd = addrow(div_row,parseInt(index+1));

                    });

                }
                var op_img = $("<img src='../img/icon/"+imgPath+".png' style='display: block' class='img-fluid' alt='' >");
                op_td.append(op_img);

                var op_td2 = $("<td class='p-1'> <span>"+text_str+"</span> </td>");
                op_tr.append(op_td2);
            }
        }
    }
    $(pre_original_div).after(div_row);
    return div_row;
}