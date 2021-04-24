//引入express框架 基于node.js
const express = require('express');
const multer=require("multer");     //导入multer模块
const ejs = require("ejs");
const fs = require("fs");

var path=require('path');
var rootPath=path.join(__dirname,'../');



//引入 将字符串解析为对象（key：value）
const querystring = require('querystring');

//创建 路由器对象
const r = express();

/*ejs*/
r.engine('html',ejs.__express)
r.engine('ejs',ejs.__express)

// 启动视图引擎
r.set('view engine','html')
//设置模板引擎类型
r.set('views engine','ejs');;
// //设置模板的目录
r.set('views',rootPath+'/views')


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/img/food')
    },
    filename: function (req, file, cb) {
        // console.log('---',file);
        //获取后缀名
        let exts=file.originalname.split('.');
        let ext=exts[exts.length-1];
        let tepname=(new Date()).getTime()+parseInt(Math.random()*9999);
        //拼接名字
        cb(null,`${tepname}.${ext}`);
    }
})
var uploadMulter = multer({ storage: storage });



/*引入数据库sql模块*/
const db = require(rootPath+"/pool.js");

//往路由器中添加路由  用户列表路由 get /list
//http://127.0.0.1:8080/submitMenu/editMenu 调用
//app.js（web服务器）添加前缀/user = 路由器user挂载到web服务器


// fs.readFile(path,'binary',function(err,filecon){
//     if(err){
//         console.log(err);
//     }else{
//         res.write(filecon,'binary');
//         res.end();
//     }
// });

function readImg(path,res){
    fs.readFile(path,'binary',function(err,file){
        if(err){
            console.log(err);
            return;
        }else{
            console.log("输出文件");
            //res.writeHead(200,{'Content-Type':'image/jpeg'});
            res.write(file,'binary');
            res.end();
        }
    });
}

r.get('/getImg',(req,res)=>{
    //返回文件
    //文件路径必须是绝对路径
    // res.sendfile(__dirname+'/public/html/submitMenu.ejs');
    if(req.query.filename==undefined || req.query.filename=="" || !req.query.filename)
        return res;

    res.sendFile(rootPath+"/public/img/food/"+req.query.filename);

    return res;
})


r.get('/',(req,res)=>{
    //返回文件
    //文件路径必须是绝对路径
    // res.sendfile(__dirname+'/public/html/submitMenu.ejs');
    // res.render('editMenu.ejs',{data:"datadsadsada"});
    // console.log("//test");
    res.send("过");
})

r.get('/showMenu',(req,res)=>{
    let cid=parseInt(req.query.cid);
    let uid=parseInt(req.query.uid);
    console.log("req.query:"+cid);
    console.log("req.uid:"+uid);

    var sql = "SELECT * from uandc where uid=? and cid=?";
    db.query(sql, [uid,cid], function (err, rows, fields) {
        if(err){
            console.log('SELECT dishmenu ERROR - ', err.message);
            return;
        }
        var upicc=rows[0].pic;
        var jsonObjArrs =[];

        jsonObjArrs.push(rows[0]);

        var sql_steps = "SELECT * from menustep where cid=?";
        db.query(sql_steps, [cid], function (err, rows, fields) {
            if(err){
                console.log('SELECT menustep ERROR - ', err.message);
                return;
            }

            for(var i=0;i<rows.length;i++){
                var jsonObj={};
                jsonObj["decript_step"] = rows[i]["step_content"]; //步骤描述
                jsonObj["file_step"] = rows[i]["step_pic"]; //步骤描述
                jsonObjArrs.push(jsonObj);
            }

            res.render('editMenu.ejs',{data:jsonObjArrs,userid:uid,upic:upicc});
            // res.send(jsonObjArrs);

            /*
            *
            * [{"uid":3,"cid":51,"title":"爱吃肉","class":"家常菜","click":0,"like":0,"collect":0,"square_pic":"1607257569496.jpg","rect_pic":"1607257567126.jpg","descript":"的撒旦"},
            * {"decript_step":"撒旦撒","file_step":""}
            * ,{"decript_step":"的撒","file_step":"1607257565815.jpg"}]
            * */
            console.log("query SUCCESS");
        });
    });
})

r.post('/updateMenu',uploadMulter.any(),(req,res,next)=>{
    // 提交的时候就判断过首页缩略图和成品图，这里不用判断

    next();
})

/*判断字符串是否为空*/

function isEmpty(a){
    if(a == "" || a == null || a == undefined){ // "",null,undefined
        return true;
    }
    return false;
}



function isNotValid(req){

    var hasUpdateMenu=false;
    var dishMenuUpdate={};
    //第一步 先将square_pic 和rect_pic 撇开
    var files_index = 0;

    //获取下标 照片
    if( req.files.length){ //有图片
        //首页缩略图修改
        if(req.files[0]["fieldname"]=="square_pic"){
            dishMenuUpdate["square_pic"]=req.files[0]["filename"];
            files_index++;
        } //修改成品图
        if(req.files[0]["fieldname"]=="rect_pic"){
            dishMenuUpdate["rect_pic"]=req.files[0]["filename"];
            files_index++;
        }else if(req.files.length>1 && req.files[1]["fieldname"]=="rect_pic"){
            dishMenuUpdate["rect_pic"]=req.files[1]["filename"];
            files_index++;
        }
    }



    // 先确定那些图片是不能删除的
    //第一步 对比 img_filename 与 files.filename

    //img与步骤图匹配  获得img filename 数组
    var steps_num=parseInt(Object.keys(req.body).length-4)/2;
    var imgArrs=[];
    var reqObj = req.body;
    var filesObj = req.files;

    if(isEmpty(reqObj["description"])){
        return 4;
    }
    if(isEmpty(reqObj["title"])){
        return 5;
    }

    for(var i=0;i<steps_num;i++){
        var str = String(reqObj["span_for_filename"+(i+1)]);

        if(str.search(/filename=/g) != -1 ){
            str = str.substring(9);
            imgArrs.push(str);
        }else if(files_index<filesObj.length){
            imgArrs.push(filesObj[files_index++]["filename"]);

        }
    }

    //判断是否跳步
    for(var i=0;i<steps_num;i++){
        //步骤描述文字
        var step_detail = reqObj["decript_step"+(i+1)];
        //每一步都是有内容的，一旦出现无内容部分，直接跳出

        if(i<steps_num-1 && isEmpty(step_detail)){
            while(i<steps_num && isEmpty(reqObj["decript_step"+(i+2)])){
                i++;
            }
            if(i<steps_num-1){
                return 2;
            }
        }
    }

    if(isEmpty(reqObj["decript_step1"])){
        return 3;
    }

    // return 3;
    //判断是否出现无描述
    for(var i=0;i<steps_num;i++){
        //步骤描述文字
        var step_detail = reqObj["decript_step"+(i+1)];

        //每一步都是有内容的，一旦出现无内容部分，直接跳出
        if(isEmpty(step_detail) && !isEmpty(imgArrs[i])){
            return 1;
        }
        // console.log("描述："+step_detail);
        // console.log("img:"+imgArrs[i]);
    }

    return -1;
}






r.post('/updateMenu',(req,res,next)=>{
    // 提交的时候就判断过首页缩略图和成品图，这里不用判断
    var jsonObj = {};

    jsonObj["files"]=req.files;
    jsonObj["key_value"]= req.body;
    console.log(jsonObj);
    // res.send(jsonObj);
    var flag = isNotValid(req);
    if(flag!=-1){
        if(flag==1)
            return res.send("请不要只添加图片，不添加描述");
        else if(flag==2){
            return res.send("请不要跳步填写,缺少某个步骤的描述");
        }else if(flag==3){
            return res.send("请至少填写一个步骤");
        }else if(flag==4){
            return res.send("请先将菜谱描述补充完整");
        }else if(flag==5){
            return res.send("请先将菜谱名称补充完整");
        }
    }else{
        var hasUpdateMenu=false;
        var dishMenuUpdate={};
        //第一步 先将square_pic 和rect_pic 撇开
        var files_index = 0;
        if( req.files.length){ //有图片
            //首页缩略图修改
            if(req.files[0]["fieldname"]=="square_pic"){
                dishMenuUpdate["square_pic"]=req.files[0]["filename"];
                files_index++;
            } //修改成品图

            if(req.files[0]["fieldname"]=="rect_pic"){
                dishMenuUpdate["rect_pic"]=req.files[0]["filename"];
                files_index++;
            }else if(req.files.length>1 && req.files[1]["fieldname"]=="rect_pic"){
                dishMenuUpdate["rect_pic"]=req.files[1]["filename"];
                files_index++;
            }

            var values=[];
            var sqlStr="UPDATE dishmenu SET ";

            for (var key in dishMenuUpdate) {
                values.push(dishMenuUpdate[key]);
                sqlStr = sqlStr+key+" =? , ";
            }

            sqlStr=sqlStr.substr(0,sqlStr.length-2);
            values.push(req.body.cid);
            sqlStr = sqlStr+"WHERE cid =?";
            // res.send(values);


            db.query(sqlStr, values, function (err, rows, fields) {
                if(err){
                    // deleteAllupLoadImgs(req.files);
                    console.log('UPDATE ERROR - ', err.message);
                    return;
                }
                console.log("UPDATE SUCCESS");
                // res.send("更新菜单描述和照片成功");
            });
            hasUpdateMenu=true;
        }

        //
        if(!hasUpdateMenu){
            var values = [req.body.title,req.body.class,req.body.description,req.body.cid];


            var sql = "UPDATE dishmenu SET title=?,class=?,descript = ? WHERE cid = ? ";

            db.query(sql, values, function (err, rows, fields) {
                if(err){
                    deleteAllupLoadImgs(req.files);
                    console.log('UPDATE ERROR - ', err.message);
                    return;
                }

                console.log("UPDATE SUCCESS");
                // res.send("更新菜单描述成功");
            });
        }

        // 先确定那些图片是不能删除的
        //第一步 对比 img_filename 与 files.filename

        //img与步骤图匹配  获得img filename 数组
        var steps_num=parseInt(Object.keys(req.body).length-5)/2;
        var imgArrs=[];
        var reqObj = req.body;
        var filesObj = req.files;

        for(var i=0;i<steps_num;i++){
            var str = String(reqObj["span_for_filename"+(i+1)]);


            if(str.search(/filename=/g) != -1 ){
                str = str.substring(9);
                imgArrs.push(str);
            }else{
                console.log(str.search(/filename=/g) != -1);
                console.log(str);
                imgArrs.push(filesObj[files_index++]["filename"]);
            }
        }

        //第二步删除所有的rows
        var sql = "DELETE FROM menuStep WHERE  cid = ?";

        db.query(sql, [req.body.cid], function (err, rows, fields) {
            if(err){
                deleteAllupLoadImgs(req.files);
                console.log('Query ERROR - ', err.message);
                return;
            }
            console.log("Query SUCCESS");

            //第三步 更新菜谱名
            //然后重新插入到 菜谱步骤中去

            for(var i=0;i<steps_num;i++){
                //步骤描述文字
                var step_detail = reqObj["decript_step"+(i+1)];

                //每一步都是有内容的，一旦出现无内容部分，直接跳出
                if(isEmpty(step_detail))
                    break;

                //获取照片

                //插入语句
                var values = [(i+1),parseInt(req.body.cid),step_detail,imgArrs[i]];
                var sql = "INSERT INTO menustep(sid,cid,step_content,step_pic) VALUES(?,?,?,?)";
                db.query(sql, values, function (err, rows, fields) {
                    if(err){
                        // deleteAllupLoadImgs(req.files);
                        console.log('INSERT ERROR - ', err.message);
                        return;
                    }

                    console.log("INSERT SUCCESS");
                });
            }

            db.query('SELECT * FROM uandc WHERE cid=?',[req.body.cid] ,(err,result)=>{
                if(err){
                    throw err;
                }
                console.log("index-----------------------------------------------------------------"+req.session.uid);
                res.send('/caipu?cid='+req.body.cid+"_"+req.body.upicc+"_"+result[0].uid);
                // res.render('index',{carousels:result,userid:req.session.uid,typenum:typeNum,typename:typename,upic:req.session.upic})
            })

            //菜谱的更新
            // res.redirect('/caipu?cid='+req.body.cid+"_"+req.body.upicc);
            // res.redirect('/caipu?cid='+req.body.cid);
            // res.send({imgArrs:imgArrs,reqs:req.files});

        });
    }
})


module.exports=r;