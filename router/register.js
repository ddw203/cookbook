const express = require('express');
const md5 = require('md5-node');
//引入连接池的模块
const pool = require('../pool.js');

const  r = express();
//设置模板引擎类型
r.set('view engine','ejs')
//设置模板的目录
var path=require('path')
r.set('views',path.resolve(__dirname,'../views'))

const multer = require('multer');

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

r.get('/regist1',(req,res)=>{
    res.render('regist',{isRegist:1})
})

//用户注册
r.post('/myreg',upload.any(),(req,res)=>{
    //1.获取post 请求数据
    let obj = req.body;
    var str = String(obj.picvalue);
        // console.log(str)
    if(str.search(/filename=/g) != -1 ){
        str = str.substring(9);
      //  console.log(str)
    }else{
        str=req.files[0]["filename"];
    }


    pool.query('SELECT * FROM user WHERE phone=?' ,[obj.uphone],(err,result)=>{
        if(err) throw err;

        if(result.length==0){
            var a='1'
            var md5pwd=md5(obj.upwd);
            //执行sql命令  将数据添加到数据库
            pool.query('INSERT INTO user VALUES (?,?,?,?,?,?,?,?)',
                [null,obj.uphone,obj.uname,md5pwd,obj.email,str,a,obj.udpt],(err,result)=>{
                    if(err) throw err;
                    console.log("注册成功");
                    //注册成功
                 res.redirect('/login/isregisted')
                })
        }else{
            var isRegist=0
            res.render('regist',{isRegist:isRegist})
        }

    })


})



//导出路由器
module.exports = r;
