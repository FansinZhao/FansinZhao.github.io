# hbase + hadoop 官方文档快速搭建

hbase版本1.26,hadoop版本2.8.1,jdk8+


# 简单单机

进入安装目录执行命令启动

    bin/start-hbase.sh

停止hbase

    bin/stop-hbase.sh

hbase提供了ui界面http://localhost:16010
同时可以通过`jps -l`查看

    jps -l
    32399 org.apache.hadoop.hbase.master.HMaster

现在就很简单的启动了hbase!

自定义配置文件`conf/hbase-site.xml`,添加单机配置,注意切换到自己的路径

    <configuration>
      <property>
        <name>hbase.rootdir</name>
        <value>file:////opt/hbase-1.2.6</value>
      </property>
      <property>
        <name>hbase.zookeeper.property.dataDir</name>
        <value>/opt/zookeeper-3.4.9</value>
      </property>
    </configuration>


简单测试hbase
连接控制台

   bin/hbase shell
   hbase(main):001:0>

创建表,新建记录,废止表,移除表(比较简单,摘抄官网)

    hbase(main):001:0> create 'test', 'cf'
    0 row(s) in 0.4170 seconds

    => Hbase::Table - test

    hbase(main):002:0> list 'test'
    TABLE
    test
    1 row(s) in 0.0180 seconds

    => ["test"]
    hbase(main):003:0> put 'test', 'row1', 'cf:a', 'value1'
    0 row(s) in 0.0850 seconds

    hbase(main):004:0> put 'test', 'row2', 'cf:b', 'value2'
    0 row(s) in 0.0110 seconds

    hbase(main):005:0> put 'test', 'row3', 'cf:c', 'value3'
    0 row(s) in 0.0100 seconds
    hbase(main):006:0> scan 'test'
    ROW                                      COLUMN+CELL
     row1                                    column=cf:a, timestamp=1421762485768, value=value1
     row2                                    column=cf:b, timestamp=1421762491785, value=value2
     row3                                    column=cf:c, timestamp=1421762496210, value=value3
    3 row(s) in 0.0230 seconds
    hbase(main):007:0> get 'test', 'row1'
    COLUMN                                   CELL
     cf:a                                    timestamp=1421762485768, value=value1
    1 row(s) in 0.0350 seconds
    hbase(main):008:0> disable 'test'
    0 row(s) in 1.1820 seconds

    hbase(main):009:0> enable 'test'
    0 row(s) in 0.1770 seconds

    hbase(main):008:0> disable 'test'
        0 row(s) in 1.1820 seconds
    hbase(main):011:0> drop 'test'
    0 row(s) in 0.1370 seconds

命令是比较简单的:

    create 表名 , 列名
    list 表名
    put 表名 ,行名 ,列名:列值 ,值
    get 表名,行名
    scan 表名
    disable 表名
    enable 表名
    drop 表名 //安全起见必须先disable

# 使用Hadoop
为了防止hbase的数据丢失,一般都是要跟hadoop结合使用.
关于hadoop的创建,请看我相关的[Hadoop 快速创建](https://fansinzhao.github.io/page/linux-hadoop-quickstart.html)

现在假设我们已经按照另一篇文章创建了hadoop.默认暴露的端口是9900
修改配置文件`conf/hbase-site.xml`(默认为空),添加以下内容

    <property>
      <name>hbase.cluster.distributed</name>
      <value>true</value>
    </property>

    <property>
      <name>hbase.rootdir</name>
      <value>hdfs://localhost:9900/hbase</value>
    </property>

设置jdk版本,修改启动脚本bin/start-hbase.sh

    export JAVA_HOME=/opt/jdk1.8.0_92

修改完配置后,重新启动hbase

    bin/start-hbase.sh

查看hadoop是否正常加入,进入hadoop安装目录

    zhaofeng@zhaofeng-pc:/opt/hadoop-2.8.1$ bin/hadoop fs -ls /hbase
    Found 9 items
    drwxr-xr-x   - zhaofeng supergroup          0 2017-08-29 16:47 /hbase/.tmp
    drwxr-xr-x   - zhaofeng supergroup          0 2017-08-29 16:47 /hbase/MasterProcWALs
    drwxr-xr-x   - zhaofeng supergroup          0 2017-08-29 16:47 /hbase/WALs
    drwxr-xr-x   - zhaofeng supergroup          0 2017-08-29 15:51 /hbase/archive
    drwxr-xr-x   - zhaofeng supergroup          0 2017-08-29 15:37 /hbase/corrupt
    drwxr-xr-x   - zhaofeng supergroup          0 2017-08-29 14:25 /hbase/data
    -rw-r--r--   3 zhaofeng supergroup         42 2017-08-29 14:25 /hbase/hbase.id
    -rw-r--r--   3 zhaofeng supergroup          7 2017-08-29 14:25 /hbase/hbase.version
    drwxr-xr-x   - zhaofeng supergroup          0 2017-08-29 16:47 /hbase/oldWALs

这时会比单机多一个进程,用于管理数据的RegionServer

    zhaofeng@zhaofeng-pc:/opt/hbase-1.2.6$ jps -l | grep hbase
    1618 org.apache.hadoop.hbase.regionserver.HRegionServer
    1448 org.apache.hadoop.hbase.zookeeper.HQuorumPeer
    1515 org.apache.hadoop.hbase.master.HMaster

为了方便学习我做了一个简单的[hbase镜像](https://hub.docker.com/r/fansin/hbase/),使用下面命令快速创建一个hbase单机容器.

    docker run --name my-hbase-nutch -itd fansin/hbase:0.98.8


Hbase 还提供了简单的master和region备份脚本

    //启动接口偏移量分别2 3 5的3个master的backup
    bin/local-master-backup.sh start 2 3 5

    //启动接口偏移量分别2 3 5的3个region的backup
    bin/local-regionservers.sh start 2 3 5

现在的进程应该是这样的

    jps -l | grep hbase
    2272 org.apache.hadoop.hbase.master.HMaster
    2343 org.apache.hadoop.hbase.master.HMaster
    1448 org.apache.hadoop.hbase.zookeeper.HQuorumPeer
    1515 org.apache.hadoop.hbase.master.HMaster
    2765 org.apache.hadoop.hbase.regionserver.HRegionServer
    2833 org.apache.hadoop.hbase.regionserver.HRegionServer
    1618 org.apache.hadoop.hbase.regionserver.HRegionServer
    2425 org.apache.hadoop.hbase.master.HMaster
    2909 org.apache.hadoop.hbase.regionserver.HRegionServer

可以直接kill pid,也可以使用脚本关闭

    bin/local-master-backup.sh stop 3

    bin/local-regionservers.sh stop 3


更详细分布式集群配置请查看官网.本文只做入门