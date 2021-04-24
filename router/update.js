const express=require('express');
const md5 = require('md5-node');
const pool=require('../pool.js');//引入连接池模块
const r=express();//创建路由器对象
const multer = require('multer');

//设置模板引擎类型
r.set('view engine','ejs')
//设置模板的目录
var path=require('path')
r.set('views',path.resolve(__dirname,'../views'))

const storage = multer.diskStorage({

    destination(req,res,cb){
        cb(null,'./public/img/user');
    },
    filename(req,file,cb){
        const filenameArr = file.originalname.split('.');
        cb(null,Date.now() + '.' + filenameArr[filenameArr.length-1]);
    }
});

const upload = multer({storage});



//action="/update/1"
r.post('/1',(req,res)=>{
    //修改页面post uid
let obj=req.body
    pool.query('SELECT * FROM user WHERE uid=?',[obj.uid],(err,result)=> {
        if (err) throw err;
        var username=result[0].uname;
        var upwd=result[0].pwd;
        var uemail=result[0].email;
        var picvalue=result[0].pic;
        var udpt=result[0].description;
        res.render('update',{upic:picvalue,uname:username,upwd:upwd,email:uemail,picvalue:picvalue,udpt:udpt,uid:obj.uid})
    })
})
r.get('/',(req,res)=>{
    res.render('update')
})
r.post('/myupdate',upload.any(),(req,res)=>{
    let obj=req.body;
    // console.log('update-----------------------------')
    // console.log(obj);
    // console.log('-----------------------------')

    var str = String(obj.picvalue);

    if(str.search(/filename=/g) != -1 ){
        str = str.substring(9);
        //   console.log(str)
    }else{
        str=req.files[0]["filename"];
        //  console.log(str)
    }
    var md5pwd=md5(obj.upwd);
    console.log(str)
    var collect_sql="UPDATE user SET uname='"+obj.uname+"',pwd='"+md5pwd+"',email='"+obj.email+"',pic='"+str+"',description='"+obj.udpt+"' WHERE uid=?;"
    pool.query(collect_sql,[req.session.uid],
        (err,result0)=>{
            if(err){
                throw err;
            }
            res.redirect('/user/userinfo/'+req.session.uid);
        })

    // res.send({data:'100',msg:'success'})

})

//导出路由器
module.exports = r;