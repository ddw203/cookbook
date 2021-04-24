const express=require('express');
const pool=require('../pool.js');//引入连接池模块
const r=express();//创建路由器对象
//设置模板引擎类型
r.set('view engine','ejs')
//设置模板的目录
var path=require('path')
r.set('views',path.resolve(__dirname,'../views'))

r.get('/pinglun',(req,res)=>{
    let obj=req.query;//获取前端数据
    let cid=req.query.cid
    let uid=req.session.uid
    // console.log(obj);
    if(uid==0){//用户没有登录
        // console.log(cid)
        var s='/caipu?cid='+cid
        res.render('login',{myerror:0,registsuccess:0,isfalse:0})//跳到登录界面
    }else{//有用户登录
        // console.log(cid)
        pool.query("INSERT INTO comment (cid,uid,time_date,stars,content) VALUES (?,?,'2020-12-03',?,?)",[cid,uid,obj.star,obj.addpl],(err,result)=>{
            if(err) throw err;
        })
        var s='/caipu?cid='+cid
        res.redirect(s)
    }
})

r.get('/dianzang',(req,res)=>{
    let cid=parseInt(req.query.cid)
    let uid=req.session.uid
    if(uid==0){//用户没有登录
        // console.log(cid)
        var s='/caipu?cid='+cid
        res.render('login',{myerror:0,registsuccess:0,isfalse:0})//跳到登录界面
    }else{//有用户登录
        pool.query("INSERT INTO dianzang VALUES (?,?);" +
                                 "SELECT COUNT(uid) a FROM dianzang WHERE cid=?;",[uid,cid,cid],(err,result)=>{
            if(err) throw err;
            var dian=parseInt(result[1][0].a);
            var dian_sql="UPDATE dishmenu SET dianzan="+dian+" WHERE cid=?;"
            pool.query(dian_sql,[cid],(err,result)=>{
                if(err) throw err;
            })
            var s='/caipu?cid='+cid
            res.redirect(s)
        })

    }
})
r.get('/quxiaodianzang',(req,res)=>{
    let cid=parseInt(req.query.cid)
    let uid=req.session.uid
    pool.query("delete from dianzang where uid=?;" +
                             "SELECT COUNT(uid) a FROM dianzang WHERE cid=?;",[uid,cid],(err,result)=>{
        if(err) throw err;
        var dian=parseInt(result[1][0].a);
        var dian_sql="UPDATE dishmenu SET dianzan="+dian+" WHERE cid=?;"
        pool.query(dian_sql,[cid],(err,result)=>{
            if(err) throw err;
        })
        var s='/caipu?cid='+cid
        res.redirect(s)
    })
})

r.get('/shoucang',(req,res)=>{
    let cid=parseInt(req.query.cid)
    let uid=req.session.uid
    if(uid==0){//用户没有登录
        // console.log(cid)
        var s='/caipu?cid='+cid
        res.render('login',{myerror:0,registsuccess:0,isfalse:0})//跳到登录界面
    }else{//有用户登录
        pool.query("INSERT INTO collection VALUES (?,?);" +
                                 "SELECT COUNT(uid) a FROM collection WHERE cid=?;",[uid,cid,cid],(err,result)=>{
            if(err) throw err;
            var collect=parseInt(result[1][0].a);
            var collect_sql="UPDATE dishmenu SET collect="+collect+" WHERE cid=?;"
            pool.query(collect_sql,[cid],(err,result)=>{
                if(err) throw err;
            })
            var s='/caipu?cid='+cid
            res.redirect(s)
        })

    }
})
r.get('/quxiaoshoucang',(req,res)=>{
    let cid=parseInt(req.query.cid)
    let uid=req.session.uid
    pool.query("delete from collection where uid=? and cid=?;" +
                             "SELECT COUNT(uid) a FROM collection WHERE cid=?;",[uid,cid,cid],(err,result)=>{
        if(err) throw err;
        var collect=parseInt(result[1][0].a);
        var collect_sql="UPDATE dishmenu SET collect="+collect+" WHERE cid=?;"
        pool.query(collect_sql,[cid],(err,result)=>{
            if(err) throw err;
        })
        var s='/caipu?cid='+cid
        res.redirect(s)
    })
})

r.get('/',(req,res)=>{
    let cid,upic,uid;
    let arrayCid = String(req.query.cid).split('_')
    cid=arrayCid[0];

    if(arrayCid.length>1){
        upic=arrayCid[1];
    }

    if(req.session.upic==""||req.session.upic==null){
        let arrayCid = String(req.query.cid).split('_');
        if(arrayCid.length>1){
            upic=arrayCid[1];
        }
    }else{
        upic=req.session.upic;
    }

    console.log("caipuPicc:___________________"+upic);
    console.log("caipuPcid:___________________"+cid);
    if(req.session.uid==""||req.session.uid==null){
        let arrayCid = String(req.query.cid).split('_');
        if(arrayCid.length>2){
            uid=arrayCid[2];
        }
        else{
            uid=0;
        }
    }else{
        uid=req.session.uid
    }
    console.log("-------------------uid----------------"+uid)
    console.log("caipu UID UID:_________-----------__________"+uid);


    //点击量
    pool.query('SELECT click FROM dishmenu WHERE cid=?;',[cid],(err,result)=>{
        if(err) throw err;
        var click_num=result[0].click+1;
        pool.query("UPDATE dishmenu SET click="+click_num+" WHERE cid=?;",[cid],(err,result)=>{
            if(err) throw err;
        })

    })
    console.log("caipu=========="+cid);
    // res.render('caipu',{msg:'hello'})
    pool.query('SELECT * FROM caipu WHERE cid=?;' +
               /*查找收藏总数*/'SELECT COUNT(uid) a FROM collection WHERE cid=?;' +
        /*查找该用户有没有收藏*/'SELECT * FROM collection WHERE cid=? AND uid=?;' +
                             'SELECT * FROM pinglun WHERE cid=?;' +
                             'SELECT * FROM dianzang WHERE cid=? AND uid=?;' +
                             'SELECT COUNT(uid) a FROM dianzang WHERE cid=?',[cid,cid,cid,uid,cid,cid,uid,cid],(err,result)=>{
        if(err) throw err;
        // console.log(result[3])
        var isLogin=0;/*放用户登录状态*/
        var collect=1;/*放用户收藏状态 1：没有收藏 2：收藏了*/
        if(result[2].length==1){
            console.log("有收藏")
            collect=2
        }
        if(uid==0){
            isLogin=0;/*用户没有登录*/
            collect=1;
        }
        var dian=1;/*放用户收藏状态 1：没有收藏 2：收藏了*/
        if(result[4].length==1){
            console.log("有收藏")
            dian=2
        }
        if(uid==0){
            isLogin=0;/*用户没有登录*/
            dian=1;
        }
        // console.log(result[1])
        res.render('caipu',{userid:uid,upic:upic,cai:result[0],shoucang:result[1],shoucangma:collect,uidd:uid,pinglun:result[3],dianma:dian,dian_num:result[5]})
    })

})

//导出路由器
module.exports = r;