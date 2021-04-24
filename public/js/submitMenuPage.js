
/*
*
* 未作
* file的id 和 descript 的id
* */



/*全局步骤个数*/

var totalSteps=3;
$(document).ready(function() {

    /*成品图显示*/
    $("#rect_pic").on("change",function(event){

        $("#rect_show").attr("src",URL.createObjectURL(event.target.files[0]));
    })

    $("#square_pic").on("change",function(event){

        $("#square_show").attr("src",URL.createObjectURL(event.target.files[0]));
    })

    // $("#file1").on("change",function(event){
    //
    //     $(".img").attr("src",URL.createObjectURL(event.target.files[0]));
    // })

    $('#registSubmit').on('submit', function(){
        // registPost()
        // event.preventDefault() //阻止form表单默认提交
        // alert("提交了");
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: '/submitMenu/img',
            data: new FormData($('#registSubmit')[0]),
            processData: false,
            contentType: false,
            success: result => {
                //alert(result)

            },
            error: err => {
                if(err.responseText.indexOf("userinfo")!=-1)
                    window.location.href=err.responseText;
                else
                    alert(err.responseText);
            }
        });
        return false;
    })


    //生成多个步骤的输入
    for(k=1;k<4;k++){
        var div_row = addrow(k);
        $(".steps_div").append(div_row);
    }

});

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
    var file_step_img = $(dd_row).find("#file_step"+index);
    file_step_img.attr("id","file_step"+cNum);
    file_step_img.attr("name","file_step"+cNum);
    // file_step_img.name="file_stepsadsad"+cNum;

    //照片显示修改id
    $(dd_row).find("#img_step"+index).attr("id","img_step"+cNum);


    //照片label修改  id 和指向
    var label = $(dd_row).find("#label_step"+index);
    label.attr("for","file_step"+cNum);
    label.attr("id","label_step"+cNum);

    //修改div的id
    $(dd_row).attr("id","my_op_row"+cNum);
}

function addrow(idNum){

    var div_row = $("<div class='container  row op_row mb-2' id='my_op_row"+idNum+"' > </div>");
    for (i = 0; i < 3; i++) {
        var div_col;
        /*处理最外层的col分布*/
        if(i==0 )
            div_col = $("<div class='col-lg-5 col-12'></div>")
        else if(i==1){
            div_col = $("<div class='col-lg-5 col-9'></div>")
        }
        else if(i==2)
            div_col = $("<div class='col-lg-2 col-3'></div>")
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



            var file_input = $("<input type='file' multiple='multiple' name='file_step"+idNum+"' id='file_step"+idNum+"' class='file-input'>");
            form_group.append(file_input);


            $(file_input).on("change",function(event){
                $(file_img).attr("src",URL.createObjectURL(event.target.files[0]));
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

                            setIdNum(prev,index);
                            setIdNum(div_row,(parseInt(index)-1));


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
                        var dd = addrow(parseInt(index+1));
                        $(div_row).after(dd);

                    });

                }
                var op_img = $("<img src='../img/icon/"+imgPath+".png' style='display: block' class='img-fluid' alt='' >");
                op_td.append(op_img);

                var op_td2 = $("<td class='p-1'> <span>"+text_str+"</span> </td>");
                op_tr.append(op_td2);
            }
        }
    }

    return div_row;
}