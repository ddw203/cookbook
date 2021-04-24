/*
SQLyog Community v13.1.6 (64 bit)
MySQL - 8.0.22 : Database - cook
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`cook` /*!40100 DEFAULT CHARACTER SET gbk */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `cook`;

/*Table structure for table `collection` */

DROP TABLE IF EXISTS `collection`;

CREATE TABLE `collection` (
  `uid` int NOT NULL COMMENT '用户id',
  `cid` int NOT NULL COMMENT '菜谱id',
  PRIMARY KEY (`uid`,`cid`),
  KEY `cid` (`cid`),
  CONSTRAINT `collection_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`),
  CONSTRAINT `collection_ibfk_2` FOREIGN KEY (`cid`) REFERENCES `dishmenu` (`cid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `collection` */

insert  into `collection`(`uid`,`cid`) values 
(3,1),
(3,3),
(3,15);

/*Table structure for table `comment` */

DROP TABLE IF EXISTS `comment`;

CREATE TABLE `comment` (
  `pid` int NOT NULL AUTO_INCREMENT COMMENT '评论id',
  `uid` int DEFAULT NULL,
  `cid` int NOT NULL COMMENT '菜谱id',
  `time_date` date NOT NULL COMMENT '评论时间',
  `stars` int DEFAULT '5' COMMENT '评星，最大5星',
  `content` varchar(40) NOT NULL COMMENT '评论内容',
  PRIMARY KEY (`pid`),
  KEY `cid` (`cid`),
  CONSTRAINT `comment_ibfk_1` FOREIGN KEY (`cid`) REFERENCES `dishmenu` (`cid`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

/*Data for the table `comment` */

insert  into `comment`(`pid`,`uid`,`cid`,`time_date`,`stars`,`content`) values 
(1,1,1,'2020-12-03',5,'按作者说的做，好好吃'),
(2,1,1,'2020-12-03',2,'2020-12-03'),
(3,1,1,'2020-12-03',4,'贝斯是傻子');

/*Table structure for table `dianzang` */

DROP TABLE IF EXISTS `dianzang`;

CREATE TABLE `dianzang` (
  `uid` int DEFAULT NULL,
  `cid` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=gbk;

/*Data for the table `dianzang` */

insert  into `dianzang`(`uid`,`cid`) values 
(1,1),
(3,1),
(3,3),
(3,15);

/*Table structure for table `dishmenu` */

DROP TABLE IF EXISTS `dishmenu`;

CREATE TABLE `dishmenu` (
  `uid` int NOT NULL DEFAULT '1' COMMENT '用户id',
  `cid` int NOT NULL AUTO_INCREMENT COMMENT '菜号',
  `title` varchar(30) NOT NULL COMMENT '菜谱名',
  `class` varchar(15) DEFAULT NULL COMMENT '菜单分类',
  `click` int DEFAULT '0' COMMENT '点击量，初始0',
  `dianzan` int DEFAULT '0' COMMENT '点赞数，初始0',
  `collect` int DEFAULT '0' COMMENT '收藏数，初始0',
  `square_pic` varchar(30) DEFAULT NULL COMMENT '正方形图片index，首页使用,',
  `rect_pic` varchar(30) DEFAULT NULL COMMENT '长方形图片*.1，详情页用',
  `descript` varchar(100) DEFAULT NULL COMMENT '轮播图描述',
  PRIMARY KEY (`cid`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8;

/*Data for the table `dishmenu` */

insert  into `dishmenu`(`uid`,`cid`,`title`,`class`,`click`,`dianzan`,`collect`,`square_pic`,`rect_pic`,`descript`) values 
(1,1,'猪肚鸡','汤',0,2,1,'1index.jpg','1.jpg','香溢天下，味满乾坤。'),
(2,2,'金牌红烧肉','家常菜',0,0,0,'2index.jpg','2.jpg','待他自熟莫催他，火候足时他自美。'),
(3,3,'清蒸鲈鱼','家常菜',0,1,1,'3index.jpg','3.jpg','江上往来人，但爱鲈鱼美。'),
(2,4,'海鲜披萨','西餐',0,0,0,'4index.jpg','4.jpg','自己动手做一款披萨，馅料全部都是自己喜欢的，幸福满满。'),
(3,5,'广式蛋黄莲蓉月饼','烘焙\r\n',0,0,0,'5index.jpg','5.jpg','小饼如嚼月，中有酥与饴。\r\n'),
(1,6,'水晶虾饺\r\n','家常菜',0,0,0,'6index.jpg','6.jpg','晶莹剔透，鲜香美味，饺中有虾，虾香满饺。\r\n'),
(2,7,'可可慕斯','烘焙',0,0,0,'7index.jpg','7.jpg','甜而不腻，丝滑香浓。\r\n'),
(1,8,'菠萝咕噜肉\r\n','家常菜',0,0,0,'8index.jpg','8.jpg',NULL),
(2,9,'花蛤\r\n','家常菜',0,0,0,'9index.jpg','9.jpg',NULL),
(3,10,'黄豆排骨汤\r\n','汤',0,0,0,'10index.jpg','10.jpg',NULL),
(1,11,'栗米甘筍排骨汤\r\n','汤',0,0,0,'11index.jpg','11.jpg',NULL),
(2,12,'银耳莲子羹\r\n','汤',0,0,0,'12index.jpg','12.jpg',NULL),
(1,13,'虫草花乌鸡汤','汤',0,0,0,'13index.jpg','13.jpg',NULL),
(2,14,'冬阴功汤\r\n','汤',0,0,0,'14index.jpg','14.jpg',NULL),
(3,15,'冬瓜薏仁鸭汤\r\n','汤\r\n',0,1,1,'15index.jpg','15.jpg',NULL),
(1,16,'海带排骨汤\r\n','汤',0,0,0,'16index.jpg','16.jpg',NULL),
(3,17,'山药红枣排骨汤\r\n','汤\r\n',0,0,0,'17index.jpg','17.jpg',NULL),
(1,18,'红枣莲藕猪蹄汤\r\n','汤',0,0,0,'18index.jpg','18.jpg',NULL),
(3,19,'奶油浓汤\r\n','汤\r\n',0,0,0,'19index.jpg','19.jpg',NULL),
(1,20,'鱼汤\r\n','汤',0,0,0,'20index.jpg','20.jpg',NULL),
(2,21,'蛋挞\r\n','烘焙',0,0,0,'21index.jpg','21.jpg',NULL),
(1,22,'蔓越莓曲奇\r\n','烘焙',0,0,0,'22index.jpg','22.jpg',NULL),
(3,23,'纸杯蛋糕\r\n','汤',0,0,0,'23index.jpg','23.jpg',NULL),
(1,24,'抹茶乳酪蛋糕\r\n','烘焙',0,0,0,'24index.jpg','24.jpg',NULL),
(3,25,'牛角包\r\n','烘焙',0,0,0,'25index.jpg','25.jpg',NULL),
(1,26,'菠萝包\r\n','烘焙',0,0,0,'26index.jpg','26.jpg',NULL),
(2,27,'黄油曲奇\r\n','烘焙',0,0,0,'27index.jpg','27.jpg',NULL),
(1,28,'饺子\r\n','家常菜',0,0,0,'28index.jpg','28.jpg',NULL),
(1,29,'辣子鸡\r\n','家常菜',0,0,0,'29index.jpg','29.jpg',NULL),
(3,30,'麻婆豆腐\r\n','家常菜',0,0,0,'30index.jpg','30.jpg',NULL),
(1,31,'葱香鸡\r\n','家常菜',0,0,0,'31index.jpg','31.jpg',NULL),
(1,32,'牛扒\r\n','西餐',0,0,0,'32index.jpg','32.jpg',NULL),
(2,33,'芝士奶油意面\r\n','西餐',0,0,0,'33index.jpg','33.jpg',NULL),
(1,34,'黑椒牛柳意面\r\n','西餐',0,0,0,'34index.jpg','34.jpg',NULL),
(1,35,'三文治\r\n','西餐',0,0,0,'35index.jpg','35.jpg',NULL),
(2,36,'黑鲈鱼扒\r\n','西餐',0,0,0,'36index.jpg','36.jpg',NULL),
(2,37,'芝士肉酱薯条\r\n','西餐',0,0,0,'37index.jpg','37.jpg',NULL),
(2,38,'牛油果蔬菜熏鸡肉色拉\r\n','西餐',0,0,0,'38index.jpg','38.jpg',NULL),
(2,39,'煎三文鱼\r\n','西餐',0,0,0,'39index.jpg','39.jpg',NULL),
(2,40,'清蒸石斑鱼\r\n','家常菜',0,0,0,'40index.jpg','40.jpg',NULL);

/*Table structure for table `follow` */

DROP TABLE IF EXISTS `follow`;

CREATE TABLE `follow` (
  `uid` int NOT NULL COMMENT '用户id',
  `followed_id` int NOT NULL COMMENT '被关注用户id',
  PRIMARY KEY (`uid`,`followed_id`),
  KEY `followed_id` (`followed_id`),
  CONSTRAINT `follow_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`),
  CONSTRAINT `follow_ibfk_2` FOREIGN KEY (`followed_id`) REFERENCES `user` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `follow` */

insert  into `follow`(`uid`,`followed_id`) values 
(2,1),
(1,2);

/*Table structure for table `menustep` */

DROP TABLE IF EXISTS `menustep`;

CREATE TABLE `menustep` (
  `cid` int NOT NULL COMMENT '菜谱id',
  `sid` int NOT NULL COMMENT '菜谱步骤id',
  `step_content` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '步骤内容',
  `step_pic` varchar(30) DEFAULT NULL COMMENT '步骤配图',
  PRIMARY KEY (`sid`,`cid`),
  KEY `cid` (`cid`),
  CONSTRAINT `menustep_ibfk_1` FOREIGN KEY (`cid`) REFERENCES `dishmenu` (`cid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `menustep` */

insert  into `menustep`(`cid`,`sid`,`step_content`,`step_pic`) values 
(1,1,'猪肚用面粉洗净，冷水下锅加花椒、桂皮、桂叶、八角煮沸去腥。','1.1.jpg'),
(2,1,'姜丝5克、葱末8克，五花肉250克切块。','2.1.jpg'),
(3,1,'鲈鱼清洗干净，用厨房纸吸去水份。','3.1.jpg'),
(4,1,'准备好全部的食材：高筋面粉 200g、低筋面粉 100g、橄榄油20g、牛奶 180g、鸡蛋 1个、细砂糖 20g。','4.1.jpg'),
(5,1,'123',NULL),
(6,1,'准备食材：澄粉 150g、玉米淀粉 50g、鲜虾 400g、猪肉 100g、胡萝卜 1根。','6.1.jpg'),
(7,1,'123',NULL),
(8,1,'123','8.jpg'),
(9,1,'123','9.jpg'),
(10,1,'123','10.jpg'),
(11,1,'123','11.jpg'),
(12,1,'123','12.jpg'),
(13,1,'123','13.jpg'),
(14,1,'123','14.jpg'),
(15,1,'123','15.jpg'),
(16,1,'123','16.jpg'),
(17,1,'123','17.jpg'),
(18,1,'123','18.jpg'),
(19,1,'123','19.jpg'),
(20,1,'123','20.jpg'),
(21,1,'123','21.jpg'),
(22,1,'123','22.jpg'),
(23,1,'123','23.jpg'),
(24,1,'123','24.jpg'),
(25,1,'123','25.jpg'),
(26,1,'123','26.jpg'),
(27,1,'123','27.jpg'),
(28,1,'123','28.jpg'),
(29,1,'123','29.jpg'),
(30,1,'123','30.jpg'),
(31,1,'123','31.jpg'),
(32,1,'123','32.jpg'),
(33,1,'123','33.jpg'),
(34,1,'123','34.jpg'),
(35,1,'123','35.jpg'),
(36,1,'123','36.jpg'),
(37,1,'123','37.jpg'),
(38,1,'123','38.jpg'),
(39,1,'123','39.jpg'),
(40,1,'123','40.jpg'),
(1,2,'整鸡去头去尾（不想吃的都可以去了~），鸡翅鸡腿切下塞进鸡肚子里，冷水下锅焯水后往鸡肚子里撒白胡椒粉，','1.2.jpg'),
(2,2,'将五花肉焯水去腥去血沫。','2.2.jpg'),
(3,2,'两面花刀，秣上细盐，肚子里面也要抹上。淋上蒸鱼油抹均匀。','3.2.jpg'),
(4,2,'先把饼皮食材一并放入面桶内，启动厨师机，直接搅打至拓展状态即可。','4.2.jpg'),
(6,2,'把虾的头、脚、壳、尾、虾线去掉，剩下的虾仁留用，如图。','6.2.jpg'),
(1,3,'砂锅底部垫姜片、大葱段后将塞好鸡的猪肚放入，添一半水。','1.3.jpg'),
(2,3,'食用油5ML，放入姜丝，倒入五花肉，翻炒均匀。','2.3.jpg'),
(3,3,'葱切段姜切片。','3.3.jpg'),
(4,3,'取出面团收拢光滑后放进打蛋盆内密封发酵，发酵至一倍大即可，无需发酵过久。','4.3.jpg'),
(6,3,'把一半的虾仁切成大块；另一半虾仁剁成馅儿；猪肉剁馅；姜切末，如图。','6.3.jpg'),
(1,4,'花生加水打500ML花生浆后倒入砂锅，再倒入100ML纯牛奶，往锅中撒适量胡椒粉。','1.4.jpg'),
(2,4,'加入生抽25克，老抽15克，翻炒均匀，加入清水20ML，大火煮沸，转小火煮40分钟。','2.4.jpg'),
(3,4,'摆在盘子里面。','3.4.jpg'),
(4,4,'把馅料食材准备好。','4.4.jpg'),
(6,4,'往馅料中放入2勺食用油、1勺料酒、半勺盐、1勺生抽、半勺白糖、少许白胡椒粉，然后朝一个方向用手开始搅拌，搅拌至肉馅起劲，然后再多摔打几次，如图，馅就做好了。','6.4.jpg'),
(1,5,'炖煮两个小时后将猪肚内的鸡取出切块待用，猪肚切条回锅继续炖一个小时后将鸡块放回锅中加盐与枸杞焖煮十分','1.5.jpg'),
(3,5,'放上腌好的鱼，鱼肚中可以放上葱和姜。','3.5.jpg'),
(4,5,'把面团分成三份，取出一份简单揉压成圆饼状，擀成一块圆形的薄薄的饼皮。','4.5.jpg'),
(6,5,'开始和面。把澄面和玉米淀粉混合，然后倒入开水，边倒边搅拌，搅拌至没有干粉为止。（一定是开水哦！）','6.5.jpg'),
(3,6,'水开后上锅，蒸10分钟。虚蒸三分钟。','3.6.jpg'),
(4,6,'把面皮放入披萨盘内，调整均匀，用叉子给饼底扎满小孔。','4.6.jpg'),
(6,6,'把面团取出放到面板上揉匀，如图。然后盖上保鲜膜，静置5分钟。（揉好的面团，一定要放到保鲜膜中，不然很容易风干。接下来的几步，也一定要注意把暂时不用的面团放到保鲜膜中盖好哦。）','6.6.jpg'),
(3,7,'出锅。将鱼换一下盘子，或者将汤汁倒出来。','3.7.jpg'),
(4,7,'在饼底涂满番茄酱。','4.7.jpg'),
(6,7,'将面团搓成长条，然后切成均匀大小的小剂子，如图。','6.7.jpg'),
(3,8,'将汤汁慢慢的烧在鱼身上。','3.8.jpg'),
(4,8,'撒上一层芝士碎。','4.8.jpg'),
(6,8,'取一个小剂子揉圆，压扁，放到保鲜膜中，如图。（一定要先在面板上铺一层保鲜膜，然后再盖一层，这样才可以防粘。）-18分钟。','6.8.jpg'),
(3,9,'另起一小锅，将一勺油烧热，浇在鱼身上。放上藿香，上桌就可以了。','3.9.jpg'),
(4,9,'铺上一层香肠，再撒上一层芝士碎。','4.9.jpg'),
(6,9,'用一个小板将小剂子压成圆形。（可以用菜刀、木板什么的来压，效果一样的。）','6.9.jpg'),
(4,10,'继续一层食材一层芝士碎，全部铺好后放入200度预热好的烤箱，烘烤15-18分钟。','4.10.jpg'),
(6,10,'如图，压好后的虾饺皮。（虾饺皮要现包现压哦，千万不要一次做太多，否则容易干裂。）','6.10.jpg'),
(4,11,'直接取出脱模就可以了哟。','4.11.jpg'),
(6,11,'往虾饺皮中放入适量的馅料，如图。（馅料中最好要有一到两块虾仁哦。）','4.11.jpg'),
(6,12,'由一边开始捏起，将虾饺捏严实，如图。（在包的时候，手要轻一点，否则容易将皮捏破。）','4.12.jpg'),
(6,13,'虾饺全部捏好后逐个放到胡萝卜片上，如图。（这样可以很好的防粘。）开水上锅，大火烧7-8分钟即可关火。然后趁热开动吧，味道非常好哦。','4.13.jpg');

/*Table structure for table `user` */

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `uid` int NOT NULL AUTO_INCREMENT COMMENT '用户id',
  `phone` varchar(11) NOT NULL COMMENT '电话号码唯一',
  `uname` varchar(15) NOT NULL COMMENT '用户名称，最长15个字',
  `pwd` varchar(20) NOT NULL COMMENT '密码，最多20个字符',
  `email` varchar(30) DEFAULT NULL COMMENT '邮箱',
  `pic` varchar(30) DEFAULT NULL COMMENT '头像',
  `level` int DEFAULT NULL COMMENT '用户等级',
  `description` varchar(50) DEFAULT NULL COMMENT '个人描述，最多50字',
  PRIMARY KEY (`uid`,`phone`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

/*Data for the table `user` */

insert  into `user`(`uid`,`phone`,`uname`,`pwd`,`email`,`pic`,`level`,`description`) values 
(1,'13558964259','张三','1','123@qq.com','2.jpg',0,'爱吃肉的小猪猪'),
(2,'13644598762','李四','2','123@qq.com','3.jpg',0,'不爱吃肉的李四'),
(3,'13422445678','王五','3','123@qq.com','1.jpg',0,'爱说张荧的王五');

/*Table structure for table `caipu` */

DROP TABLE IF EXISTS `caipu`;

/*!50001 DROP VIEW IF EXISTS `caipu` */;
/*!50001 DROP TABLE IF EXISTS `caipu` */;

/*!50001 CREATE TABLE  `caipu`(
 `uid` int ,
 `cid` int ,
 `title` varchar(30) ,
 `class` varchar(15) ,
 `click` int ,
 `dianzan` int ,
 `collect` int ,
 `square_pic` varchar(30) ,
 `rect_pic` varchar(30) ,
 `descript` varchar(100) ,
 `uname` varchar(15) ,
 `pic` varchar(30) ,
 `sid` int ,
 `step_content` varchar(200) ,
 `step_pic` varchar(30) 
)*/;

/*Table structure for table `pinglun` */

DROP TABLE IF EXISTS `pinglun`;

/*!50001 DROP VIEW IF EXISTS `pinglun` */;
/*!50001 DROP TABLE IF EXISTS `pinglun` */;

/*!50001 CREATE TABLE  `pinglun`(
 `pid` int ,
 `uid` int ,
 `cid` int ,
 `time_date` date ,
 `stars` int ,
 `content` varchar(40) ,
 `uname` varchar(15) ,
 `pic` varchar(30) 
)*/;

/*Table structure for table `uandc` */

DROP TABLE IF EXISTS `uandc`;

/*!50001 DROP VIEW IF EXISTS `uandc` */;
/*!50001 DROP TABLE IF EXISTS `uandc` */;

/*!50001 CREATE TABLE  `uandc`(
 `uid` int ,
 `cid` int ,
 `title` varchar(30) ,
 `class` varchar(15) ,
 `click` int ,
 `dianzan` int ,
 `collect` int ,
 `square_pic` varchar(30) ,
 `rect_pic` varchar(30) ,
 `descript` varchar(100) ,
 `uname` varchar(15) ,
 `pic` varchar(30) 
)*/;

/*View structure for view caipu */

/*!50001 DROP TABLE IF EXISTS `caipu` */;
/*!50001 DROP VIEW IF EXISTS `caipu` */;

/*!50001 CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `caipu` AS select `d`.`uid` AS `uid`,`d`.`cid` AS `cid`,`d`.`title` AS `title`,`d`.`class` AS `class`,`d`.`click` AS `click`,`d`.`dianzan` AS `dianzan`,`d`.`collect` AS `collect`,`d`.`square_pic` AS `square_pic`,`d`.`rect_pic` AS `rect_pic`,`d`.`descript` AS `descript`,`u`.`uname` AS `uname`,`u`.`pic` AS `pic`,`m`.`sid` AS `sid`,`m`.`step_content` AS `step_content`,`m`.`step_pic` AS `step_pic` from ((`dishmenu` `d` join `user` `u`) join `menustep` `m`) where ((`d`.`uid` = `u`.`uid`) and (`d`.`cid` = `m`.`cid`)) */;

/*View structure for view pinglun */

/*!50001 DROP TABLE IF EXISTS `pinglun` */;
/*!50001 DROP VIEW IF EXISTS `pinglun` */;

/*!50001 CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `pinglun` AS select `c`.`pid` AS `pid`,`c`.`uid` AS `uid`,`c`.`cid` AS `cid`,`c`.`time_date` AS `time_date`,`c`.`stars` AS `stars`,`c`.`content` AS `content`,`u`.`uname` AS `uname`,`u`.`pic` AS `pic` from (`comment` `c` join `user` `u`) where (`c`.`uid` = `u`.`uid`) */;

/*View structure for view uandc */

/*!50001 DROP TABLE IF EXISTS `uandc` */;
/*!50001 DROP VIEW IF EXISTS `uandc` */;

/*!50001 CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `uandc` AS select `d`.`uid` AS `uid`,`d`.`cid` AS `cid`,`d`.`title` AS `title`,`d`.`class` AS `class`,`d`.`click` AS `click`,`d`.`dianzan` AS `dianzan`,`d`.`collect` AS `collect`,`d`.`square_pic` AS `square_pic`,`d`.`rect_pic` AS `rect_pic`,`d`.`descript` AS `descript`,`u`.`uname` AS `uname`,`u`.`pic` AS `pic` from (`dishmenu` `d` join `user` `u`) where (`d`.`uid` = `u`.`uid`) */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
