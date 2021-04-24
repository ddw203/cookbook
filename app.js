const express=require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const ejs=require('ejs');
const async = require('async');
const app=express();
app.use(cookieParser());
var FileStore = require('session-file-store')(session);
var identityKey = 'skey';
app.use(session({
    name: identityKey,
    secret: 'chyingp', // 用来对session id相关的cookie进行签名
    store: new FileStore(), // 本地存储session（文本文件，也可以选择其他store，比如redis的）
    saveUninitialized: false, // 是否自动保存未初始化的会话，建议false
    resave: false, // 是否每次都重新保存会话，建议false
    cookie: {
        maxAge: 24*60*60 * 1000  // 有效期，单位是毫秒, 这里设置的是1天
    }
}));
//     cookie:{maxAge:1000*60*60*24*30},       //30天

const loginRouter=require('./router/cooklogin.js');
const userRouter=require('./router/user.js');
const indexRouter=require('./router/index.js');
const sousuoRouter=require('./router/sousuo.js');
const caipuRouter=require('./router/caipu.js');
const submitMenuRouter=require('./router/submitMenu.js');
const editMenuRouter=require('./router/editMenu.js');
const updateRouter=require('./router/update.js');
const regRouter=require('./router/register.js');

const bodyParser=require('body-parser');

app.listen(8080);
app.use(bodyParser.urlencoded({
    extended:false
}))

app.use(function (req, res, next) {
    if (!req.session) {
        return next(new Error('session错误'))
    }else {
     //   console.log(req.session)//正常打印当前session
    }
    next() // 正常 载入下一个中间件
})

app.use(express.static('./public'));
app.use('/login',loginRouter);
app.use('/user',userRouter);
app.use('/index',indexRouter);
app.use('/sousuo',sousuoRouter);
app.use('/caipu',caipuRouter);
app.use('/submitMenu',submitMenuRouter);
app.use('/editMenu',editMenuRouter);
app.use('/update',updateRouter);
app.use('/register',regRouter);

app.engine('.html',ejs.__express);
app.set('views engine', 'html');
app.engine('ejs',ejs.__express);
app.set('views engine','ejs');
app.set('views',__dirname+'/views')