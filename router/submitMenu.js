//引入express框架 基于node.js
const express = require('express');
const multer=require("multer");     //导入multer模块
const ejs = require("ejs");

var path=require('path');
var rootPath=path.join(__dirname,'../');




//引入 将字符串解析为对象（key：value）
const querystring = require('querystring');

//创建 路由器对象
const r = express();


r.engine('html',ejs.__express)
r.engine('ejs',ejs.__express)

// 启动视图引擎
r.set('view engine','html')
//设置模板引擎类型
r.set('views engine','ejs');;
// //设置模板的目录
r.set('views',rootPath+'/views')

/*引入数据库sql模块*/
const db = require(rootPath+"/pool.js");

//往路由器中添加路由  用户列表路由 get /list
//http://127.0.0.1:8080/submitMenu/editMenu 调用
//app.js（web服务器）添加前缀/user = 路由器user挂载到web服务器


/*删除文件*/
var fs = require('fs'); // 引入fs模块


r.get('/editMenu1',(req,res)=>{
    //返回内容
    /*db.query("select * from user",(err,data)=>{

        // res.render("03_index.ejs",{data:data}); 发送数据
        res.send(data);
    });*/
    var deletPath = rootPath+"public/img/food/";
    if(fs.existsSync(deletPath+1+".jpg"))
        fs.unlinkSync(deletPath+1+".jpg");
    // res.send(req.body);
    // db("select * from user",(err,data)=>{
    //     console.log(data);
    //     // res.render("03_index.ejs",{data:data}); 发送数据
    // });

    // res.send("editMenu");
    // res.redirect("http://"+req.headers.host+'/html/submitMenu.ejs');
    res.send("删除成功");
})

r.get('/:uid',(req,res)=>{
    console.log("reqSessionUid:"+req.session.uid)
   res.render('submitMenu.ejs',{upic:req.session.upic,userid:req.session.uid});


})




/*文件上传*/
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

function deleteAllupLoadImgs(reqFiles){
    for(var i=0;i<reqFiles.length;i++){
        var deletPath = rootPath+`/public/img/food/${reqFiles[i].filename}`;
        if(fs.existsSync(deletPath))
            fs.unlinkSync(deletPath);
    }
}

var uploadMulter = multer({ storage: storage });
r.post("/img",uploadMulter.any(),(req,res,next)=>{
    //文件上传处理  对于一些类型的选择判断后续做
   /* let {size,mimetype,path}=req.files[0];
    console.log("mimetype"+mimetype);
    let types=['jpeg','jpg','png','gif'];//允许上传的类型
    let tmpType=mimetype.split('/')[1];

    console.log("tmpType"+tmpType)
    if(size>5000000){
        return res.send({err:-1,msg:'上传的内容不能超过5000000'})
    }else if(types.indexOf(tmpType)==-1){
        return res.send({err:-2,msg:'上传的类型错误'})
    }else{
        // 服务器静态化目录 app.use('/public',express.static(path.join(process.cwd(),'./uploads')));
        let url=`/public/img/menuSteps/${req.files[0].filename}`;
        // res.send({err:0,msg:'上传成功',img:url})
    }*/

    next();
})

function isValid(req){
    var reqObj = req.body;
    var stepsPicObj = req.files;
    var j = 2;



    if(isEmpty(reqObj["title"])){
        return ("请先将菜谱名称补充完整");
    }else if ( !stepsPicObj.length) {
        return ("请先设置成品图");
    }

    if(stepsPicObj[0]["fieldname"]!="square_pic"){
        /*如果出错就删除已经上传的图片*/
        deleteAllupLoadImgs(req.files);
        return ("请先设置首页缩略图");

    }

    if(stepsPicObj.length==1){
        deleteAllupLoadImgs(stepsPicObj);
        return ("请先设置详细成品图");
    }
    else if(stepsPicObj.length>1 && stepsPicObj[1]["fieldname"]!="rect_pic"){
        /*如果出错就删除已经上传的图片*/
        deleteAllupLoadImgs(stepsPicObj);
        return ("请先设置详细成品图");
    }else if(isEmpty(reqObj["description"])){
        return ("请将菜谱描述补充完整");
    }

    return "*";
}
/*判断字符串是否为空*/

function isEmpty(a){
    if(a == "" || a == null || a == undefined || a==null){ // "",null,undefined
        return true;
    }
    return false;
}

r.post("/img",(req,res)=>{


    var submitMenuUid = parseInt(req.body["submitMenuUid"]);

    // res.send("hhhh00");
    var validResult = isValid(req);
    if(validResult!="*"){
        return res.send(validResult);
    }
    /*req.files  == req.file*n 内容*/
    /*
    * [{"fieldname":"square_pic",
    * "originalname":"1.jpg",
    * "encoding":"7bit",
    * "mimetype":"image/jpeg",
    * "destination":"./public/img/menuSteps",
    * "filename":"1607235127182.jpg",
    * "path":"public\\img\\menuSteps\\1607235127182.jpg",
    * "size":81507}  * n个
    * */



    var steps_num=Object.keys(req.body).length-3;
    /*判断步骤是否合理*/
    //步骤 __出现不连续的步骤描述，就是出错
    var stepsObj = req.body;
    var stepsPicObj = req.files;
    var j = 2;

    console.log(steps_num);
    console.log(stepsPicObj.length);
    // if(parseInt(steps_num)<parseInt(stepsPicObj.length-2))
    //     return res.send("请不要只添加照片，缺少步骤描述");


    //先处理跳步
    for(var i=0;i<steps_num;i++){
        //步骤描述文字
        var step_detail = stepsObj["decript_step"+(i+1)];
        //每一步都是有内容的，一旦出现无内容部分，直接跳出

        if(i<steps_num-1 && isEmpty(step_detail)){
            while(i<steps_num && isEmpty(stepsObj["decript_step"+(i+2)])){
                i++;
            }
            if(i<steps_num-1){
                return res.send("请不要跳步，某个步骤描述请补充完整");
            }
        }
    }

    if(isEmpty(stepsObj["decript_step1"])){
        return res.send("请至少填写一个步骤");
    }

    //预处理照片 filename
    var imgArrs = {};
    for(var i=2;i<stepsPicObj.length;i++){
        var pic_index=parseInt(stepsPicObj[i]["fieldname"].replace(/[^0-9]/ig,""));
        imgArrs[pic_index]=stepsPicObj[i]["filename"];
    }


    console.log(imgArrs);
    for(var i=0;i<steps_num;i++){
        var step_detail = stepsObj["decript_step"+(i+1)];
        if(isEmpty(step_detail) && !isEmpty(imgArrs[(i+1)])){
            return res.send("请不要只添加照片，缺少步骤描述");
        }
    }


    /*处理sql插入*/
    //dishMenu插入 菜谱名

    /********************************************************************************************
     *
     *
     * 聪聪添加uid----↓    就是修改2
     *var values = [2,req.body.title,req.body.class,req.files[0]["filename"],req.files[1]["filename"],req.body.description];
     *
     *
     * ********************************************************************************************/


    var values = [submitMenuUid,req.body.title,req.body.class,req.files[0]["filename"],req.files[1]["filename"],req.body.description];

    var sql = "INSERT INTO dishmenu(uid,title,class,square_pic,rect_pic,descript) VALUES(?,?,?,?,?,?)";

    db.query(sql, values, function (err, rows, fields) {
        if(err){
            deleteAllupLoadImgs(req.files);
            console.log('INSERT ERROR - ', err.message);
            return;
        }
        var cid=rows.insertId;
        console.log("INSERT SUCCESS"+rows.insertId);

        //插入步骤
        //每一步都是有内容的，一旦出现无内容部分，直接跳出

        for(var i=0;i<steps_num;i++){
            //步骤描述文字
            var step_detail = stepsObj["decript_step"+(i+1)];


            //每一步都是有内容的，一旦出现无内容部分，直接跳出
            if(isEmpty(step_detail))
                break;

            //插入语句
            var values;
            if(isEmpty(imgArrs[i+1])){
                values= [(i+1),parseInt(cid),step_detail,""];
            }else{
                values= [(i+1),parseInt(cid),step_detail,imgArrs[i+1]];
            }

            var sql = "INSERT INTO menustep(sid,cid,step_content,step_pic) VALUES(?,?,?,?)";
            db.query(sql, values, function (err, rows, fields) {
                if(err){
                    deleteAllupLoadImgs(req.files);
                    console.log('INSERT ERROR - ', err.message);
                    return;
                }
                console.log("INSERT SUCCESS");
            });

        }

    });
    // res.send("输入成功");

    res.send('/user/userinfo/'+submitMenuUid);


    /*var jsonObj = {};

    jsonObj["files"]=req.files;
    jsonObj["key_value"]= req.body;

    res.send(jsonObj);
*/

})


//导出路由器对象
module.exports=r;



