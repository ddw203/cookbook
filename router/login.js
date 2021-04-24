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

//用于验证码 验证使用的session
var cookieParser = require('cookie-parser');
var session = require('express-session');


//验证码
const svgCaptcha = require('svg-captcha');

r.get('/svg',(req,res)=>{
    res.header('Access-Control-Allow-Origin','*');
    let options={
        size:4,
        ignoreChars:'0o1iqg',
        noise:5,
        color:true,
        background: "#EDE7D0",
        height:40
    }
    let captcha=svgCaptcha.create(options);
    let{text,data}=captcha;
    console.log("/svg.captcha.text------------"+captcha.text)
    session.mysvg=captcha.text;
    console.log("/svg.captcha.text/req.session.mysvg------------"+session.mysvg)
    req.session.save();
    res.type('svg');
    res.send(data);
    res.end();
})


r.get('/',(req,res)=>{
    res.render('login',{myerror:0,registsuccess:0,isfalse:0})
})


r.post('/mylogin',(req,res)=>{
    // console.log(__dirname)
    let obj = req.body;
    // console.log(obj);
    console.log("---------------------------------------------"+obj.yzm);
    console.log("----------------------------------------------"+req.session.mysvg);
    var inputsvg=(obj.yzm).toLowerCase();
    var sessionsvg=(session.mysvg).toLowerCase();
    console.log("---------------------------------------------"+inputsvg);
    console.log("----------------------------------------------"+sessionsvg);

    var md5pwd=md5(obj.pwd);
    //到数据库中查询是否有用户名和密码同时匹配的数据
    pool.query('SELECT * FROM user WHERE phone=? AND pwd=?',[obj.phone,md5pwd],(err,result)=>{
        if(err) throw err;
        //返回空数组，长度为0 ，说明登录失败
        if(result.length===0){
            res.render('login',{myerror:1,registsuccess:0,isfalse:1})
        }else{//查询到匹配的用户  登录成功
            console.log("0---------------------"+req.session.mysvg+req.session.uid)
            // if(obj.yzm!=1&&obj.yzm!='ab12'){
            if(inputsvg==sessionsvg){
                let typeNum=1;
                let typename='全部';
                req.user=result[0];
                // console.log("--------------------------1")
                console.log(result[0].uid)
                let uid=result[0].uid;
                req.session.upic=result[0].pic;
                req.session.uid=result[0].uid;
                req.session.save();
                // req.session.isLogin=true;
                // console.log("--------------------------2")
                pool.query('SELECT * FROM uandc',(err,result0)=>{
                    if(err){
                        throw err;
                    }
                    res.render('index',{userid:result[0].uid,upic:result[0].pic,username:result[0].uname,carousels:result0,typenum:typeNum,typename:typename})
                })
            }else{
                res.render('login',{myerror:1,registsuccess:0,isfalse:0})
            }

        }
    })
})

//导出路由器
module.exports = r;
