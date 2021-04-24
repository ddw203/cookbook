const express=require('express');
const pool=require('../pool.js');//引入连接池模块
const r=express();//创建路由器对象
//设置模板引擎类型
r.set('view engine','ejs')
//设置模板的目录
var path=require('path')
r.set('views',path.resolve(__dirname,'../views'))

r.get('/',(req,res)=>{
    let typeNum=1;
    let typename='全部';
    if(req.session.uid==""||req.session.uid==null){
        req.session.uid=0;
    }

    // 全部轮播图
    pool.query('SELECT * FROM uandc',(err,result)=>{
        if(err){
            throw err;
        }
        console.log("index-----------------------------------------------------------------"+req.session.uid);
        res.render('index',{carousels:result,userid:req.session.uid,typenum:typeNum,typename:typename,upic:req.session.upic})
    })

})

r.get('/type',(req,res)=>{
    let ctype=req.query.ctype;
    let typeNum;
    let sql='SELECT * FROM uandc';
    if(ctype=="全部"){
        sql='SELECT * FROM uandc';
        typeNum=1;
    }else{
        sql="SELECT * FROM uandc WHERE class='"+ctype+"'";
        if(ctype=="家常菜"){
            typeNum=2;
        }
        if(ctype=="汤"){
            typeNum=3;
        }
        if(ctype=="西餐"){
            typeNum=4;
        }
        if(ctype=="烘焙"){
            typeNum=5;
        }
    }
    // 全部轮播图
    pool.query(sql,(err,result)=>{
        if(err){
            throw err;
        }
        // console.log(result);
        res.render('index',{carousels:result,userid:req.session.uid,typenum:typeNum,typename:ctype,upic:req.session.upic})
    })

})

//导出路由器
module.exports = r;


