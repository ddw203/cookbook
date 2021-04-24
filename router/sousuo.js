const express=require('express');
const pool=require('../pool.js');//引入连接池模块
const r=express();//创建路由器对象
//设置模板引擎类型
// r.set('view engine','ejs')
//设置模板的目录
// var path=require('path')
// r.set('views',path.resolve(__dirname,'../views'))

r.get('/',(req,res)=>{
    let pageNum=req.query.page;
    let start;
    if(pageNum==undefined) {
        pageNum=1;
        start=0;
    } else {
        start=(pageNum-1)*10;
    }
    let context=req.query.sscontext;
    let loginuserid=req.query.loginuserid;
    // console.log(context);
    let sql="SELECT *,(select Count(*) from dishmenu WHERE title LIKE '%"+context+"%') as Count" +
        " FROM dishmenu WHERE title LIKE '%"+context+"%' limit "+ start +",10;";
    pool.query(sql,(err,result)=>{
        if(err){
            throw err;
        }
        // console.log(result);
        res.render('search.html',{upic:req.session.upic,dishmenus:result,pageNum:pageNum,sscontext:context,userid:loginuserid});
    })
})

r.get('/smallsousuo',(req,res)=>{
    let pageNum=req.query.page;
    let start;
    if(pageNum==undefined) {
        pageNum=1;
        start=0;
    } else {
        start=(pageNum-1)*10;
    }
    let context=req.query.sscontext2;
    let loginuserid=req.query.loginuserid;
    // console.log(context);
    let sql="SELECT *,(select Count(*) from dishmenu WHERE title LIKE '%"+context+"%') as Count" +
        " FROM dishmenu WHERE title LIKE '%"+context+"%' limit "+ start +",10;";
    pool.query(sql,(err,result)=>{
        if(err){
            throw err;
        }
        // console.log(result);
        res.render('search.html',{upic:req.session.upic,dishmenus:result,pageNum:pageNum,sscontext:context,userid:loginuserid});
    })
})

r.get('/typesousuo',(req,res)=>{
    let pageNum=req.query.page;
    let start;
    let tname=req.query.tname;
    let tnum=req.query.tnum;
    if(pageNum==undefined) {
        pageNum=1;
        start=0;
    } else {
        start=(pageNum-1)*10;
    }
    let loginuserid=req.query.uid;
    // console.log(context);
    if(tnum==1){
        let sql="SELECT *,(select Count(*) from dishmenu) as Count" +
            " FROM dishmenu limit "+ start +",10;";
        pool.query(sql,(err,result)=>{
            if(err){
                throw err;
            }
            console.log("全部-----------------------------------------------------------------------"+req.session.upic);
            res.render('all.html',{upic:req.query.upic,dishmenus:result,pageNum:pageNum,userid:loginuserid,typename:tname,typenum:tnum});
        })
    }else{
        let sql="SELECT *,(select Count(*) from dishmenu WHERE class= '"+tname+"') as Count" +
            " FROM dishmenu WHERE class= '"+tname+"' limit "+ start +",10;";
        pool.query(sql,(err,result)=>{
            if(err){
                throw err;
            }
            console.log("其他-----------------------------------------------------------------------"+result);
            res.render('all.html',{upic:req.session.upic,dishmenus:result,pageNum:pageNum,userid:loginuserid,typename:tname,typenum:tnum});
        })
    }
})

//导出路由器
module.exports = r;


