const express=require('express');
const pool=require('../pool.js');
const r=express.Router();
r.get('/userinfo/:uid',(req,res)=>{
    let pageNum=req.query.page;
    let start;
    if(pageNum==undefined) {
        pageNum=1;
        start=0;
    } else {
        start=(pageNum-1)*10;
    }
    // let uid=req.uid;
    // console.log(req.params.uid);
    pool.query('SELECT * FROM user WHERE uid=?;' +
        'SELECT followed_id FROM follow WHERE uid=?;' +
        'SELECT uid FROM follow WHERE followed_id=?;' +
        'SELECT cid FROM collection WHERE uid=?;' +
        'SELECT *,(select Count(*) from dishmenu WHERE uid=?) as Count FROM dishmenu WHERE uid=? order by cid desc limit ?,10;'+
        'SELECT * FROM follow WHERE uid=? AND followed_id=?;'+
        'SELECT d.* FROM dishmenu d,collection c WHERE c.uid=? AND d.cid=c.cid;'+
        'SELECT u.* FROM follow f,USER u WHERE f.uid=? AND f.followed_id=u.uid;'+
        'SELECT u.* FROM follow f,USER u WHERE f.uid=u.uid AND f.followed_id=?;'
        ,[req.params.uid,req.params.uid,req.params.uid,req.params.uid,req.params.uid,req.params.uid,start,req.session.uid,req.params.uid,req.params.uid,req.params.uid,req.params.uid],(err,result)=>{
            if(err) throw err;
            if(result[0].length==0){
                res.send({code:301,msg:'login err'});
            }else{
                // req.session.user = result[0];
                // res.redirect("http://" + req.headers.host + '/myself.html');
                // console.log(result[4]);
                // req.session.loginuserid=null;
                res.render('myself.html',{upic:req.session.upic,userid:req.session.uid,user:result[0][0],loginuserid:req.session.uid,
                    followcount:result[1].length,fanscount:result[2].length,
                    collectioncount:result[3].length,dishmenus:result[4],islike:result[5].length,pageNum:pageNum,
                    collectionlist:result[6],followlist:result[7],fanslist:result[8],iscollect:0});//相对于views的路径
            }
        })
})
r.get('/like/:uid',(req,res)=>{//uid:被关注人的id
    if(req.session.uid==0){
        res.render('login.ejs',{myerror:0,registsuccess:0,isfalse:0})
    }else {pool.query('INSERT INTO follow SET uid=?,followed_id=?',[req.session.uid,req.params.uid],(err,result)=>{
        if(err) throw err;
        res.redirect('/user/userinfo/'+req.params.uid);
    })}

})
r.get('/unlike/:uid',(req,res)=>{//uid:被关注人的id
    pool.query('DELETE FROM follow WHERE uid=? and followed_id=?',[req.session.uid,req.params.uid],(err,result)=>{
        if(err) throw err;
        res.redirect('/user/userinfo/'+req.params.uid);
    })
})
r.get('/deletedishmenu/:uid/:cid',(req,res)=>{//uid:被关注人的id
    pool.query('DELETE FROM menustep WHERE cid=?;' +
        'DELETE FROM collection WHERE cid=?;' +
        'DELETE FROM comment WHERE cid=?;' +
        'DELETE FROM dianzang WHERE cid=?;' +
        'DELETE FROM dishmenu WHERE cid=?',[req.params.cid,req.params.cid,req.params.cid,req.params.cid,req.params.cid],(err,result)=>{
        if(err) throw err;
        res.redirect('/user/userinfo/'+req.params.uid);
    })
})
r.get('/collectioninfo/:uid',(req,res)=>{
    let pageNum=req.query.page;
    let start;
    if(pageNum==undefined) {
        pageNum=1;
        start=0;
    } else {
        start=(pageNum-1)*10;
    }
    // let uid=req.uid;
    // console.log(req.params.uid);
    pool.query('SELECT * FROM user WHERE uid=?;' +
        'SELECT followed_id FROM follow WHERE uid=?;' +
        'SELECT uid FROM follow WHERE followed_id=?;' +
        'SELECT cid FROM collection WHERE uid=?;' +
        'SELECT *,(select Count(*) from dishmenu WHERE uid=?) as Count FROM dishmenu WHERE uid=? limit ?,10;'+
        'SELECT * FROM follow WHERE uid=? AND followed_id=?;'+
        'SELECT d.* FROM dishmenu d,collection c WHERE c.uid=? AND d.cid=c.cid;'+
        'SELECT u.* FROM follow f,USER u WHERE f.uid=? AND f.followed_id=u.uid;'+
        'SELECT u.* FROM follow f,USER u WHERE f.uid=u.uid AND f.followed_id=?;'
        ,[req.params.uid,req.params.uid,req.params.uid,req.params.uid,req.params.uid,req.params.uid,start,req.session.uid,req.params.uid,req.params.uid,req.params.uid,req.params.uid],(err,result)=>{
            if(err) throw err;
            if(result[0].length==0){
                res.send({code:301,msg:'login err'});
            }else{
                // req.session.user = result[0];
                // res.redirect("http://" + req.headers.host + '/myself.html');
                // console.log("==========================================="+result[4].cid);
                // req.session.loginuserid=null;
                res.render('myself.html',{upic:req.session.upic,userid:req.session.uid,user:result[0][0],loginuserid:req.session.uid,
                    followcount:result[1].length,fanscount:result[2].length,
                    collectioncount:result[3].length,dishmenus:result[4],islike:result[5].length,pageNum:pageNum,
                    collectionlist:result[6],followlist:result[7],fanslist:result[8],iscollect:1});//相对于views的路径
            }
        })
})
module.exports=r;
