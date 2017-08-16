
# Federation Cluster

官方提供的另外一种集群方式,基本工作原理:通过使用rabbitmq的插件的形式提供集群功能.
每个节点都启用rabbitmq_federation,rabbitmq_federation_management.节点之间通过
amqp协议传输消息,由于是遵循协议,所以节点之间的版本可以不同,不想原生集群那么多限制.
绑定关系,通过设定parameter和policy关联集群.

特性:

1. 松耦合 不限制vhost,user甚至erlang/rabbitmq的版本
2. 网络友好 不限制网络范围,遵循amqp协议即可
3. 自定义集群 可以自定义集群方式
4. 可扩展性 不必两两互联,可以单向传输

我使用docker创建两个容器

    docker run -d --hostname my-rabbit-cluster-federation --name my-rabbit-cluster-federation -e RABBITMQ_ERLANG_COOKIE='secret cookie here' fansin/rabbitmq-cluster

    docker run -d  --link my-rabbit-cluster-federation --hostname my-rabbit-cluster-federation-1 --name my-rabbit-cluster-federation-1 -e RABBITMQ_ERLANG_COOKIE='secret cookie here' fansin/rabbitmq-cluster

第一步启动插件 启动每个节点的插件

    rabbitmq-plugins enable rabbitmq_federation rabbitmq_federation_management

第二步 downstream节点 设置加入集群目标节点 设置/清楚参数,用来关联集群节点

    rabbitmqctl set_parameter federation-upstream my-upstream '{"uri":"amqp://admin:admin@my-rabbit-cluster-federation/%2f","expires":3600000}'

    rabbitmqctl clear_parameter federation-upstream my-upstream

第三步 `downstream节点`  设置集群内容 设置/清除策略,用来确定加入集群exchange,无法加载""空exchange


    rabbitmqctl set_policy --apply-to all federate-all "^fed\." '{"federation-upstream-set":"all"}'

    rabbitmqctl clear_policy federate-all

单独设置exchange 或 queue

    rabbitmqctl set_policy --apply-to queues federate-queue "^queue\." '{"federation-upstream-set":"all"}'

    rabbitmqctl set_policy --apply-to exchanges federate-exchange "^exchange\." '{"federation-upstream-set":"all"}'


第四步验证集群

现在看my-rabbit-cluster-federation的集群会看到多个连接,然后再看
my-rabbit-cluster-federation-1也会看到多个连接,同时exchange上会有"federate-all"
特性.


[代码测试用例](http://dwz.cn/6orLGq)

建议先创建好queue或者exchange,如果不提前创建,代码第一次启动会报错.第二次就正常了.
队列默认创建的是durable的exchange或者queue,如果遇到durable的问题,需要重新删掉对应的exchange或者queue,重新创建.


再次贴一下与[原生集群](https://fansinzhao.github.io/page/linux-rabbitmq-cluster.html)的区别:


分布式原理:
Federation / Shovel: exchange 逻辑上是分离的,可能有不同的拥有者


Federation/Shovel                  | cluster
-----------------                  | ---
exchange是逻辑分离的,可能有不同拥有者  |单个逻辑exchange
不限制rabbitmq和erlang 版本          | rabbitmq和erlang 版本要保持一致
exchange可以通过不可靠(公网)网络连接,<br/>直接使用amqp连接,但是需要设置用户权限.|可靠(内网)网络,通信依赖Erlang interode,共享erlang cookie
拓扑结构可以是单项或双向               |节点两两互联
cap理论中的ap                        |cap理论中的cp
exchange可以有单独的信息,有些消息是本地的|每个节点的消息都是相同的
客户端只能看到连接的服务器队列           |客户端可以看到集群内所有队列

![无法正常显示markdown表格](image/rabbitmq-distribute.png)

## Federation的高级用法

官网介绍了提供了5种基本集群格式:

1 基本集群方式,这个是单向的集群

![](http://www.rabbitmq.com/img/federation01.png)

2 两节点相互federation,默认参数`max_hops=1`不需要特殊设置

![](http://www.rabbitmq.com/img/federation02.png)

3 三节点两两federation,上面的节点+1,默认参数`max_hops=1`不需要特殊设置

![](http://www.rabbitmq.com/img/federation03.png) 

4 扇出(p/s订阅)树型 跟fanout的exchange类似功能, 注意设置参数`max_hops=0`,
如果确定树的深度,max_hops应当大于等于树的深度

![](http://www.rabbitmq.com/img/federation04.png)

5 环形 参数设置为`max_hops=5` 有一点,一旦环中一个节点down,整个环也就断了.

![](http://www.rabbitmq.com/img/federation05.png)

# 比Federation更灵活的Shovel

shovel跟federation使用类似,但使用的是erlang client,更底层,更多配置,也更灵活.
默认使用动态配置,关于静态配置请详看[官网shovel](http://www.rabbitmq.com/shovel.html)

特性:

1. 松耦合 不限制vhost,user甚至erlang/rabbitmq的版本
2. 网络友好 不限制网络范围,遵循amqp协议即可
3. 高自由度 每个节点可以随意组合其他节点


同样使用docker重新创建两个新容器

    docker run -d --hostname my-rabbit-cluster-federation --name my-rabbit-cluster-federation -e RABBITMQ_ERLANG_COOKIE='secret cookie here' fansin/rabbitmq-cluster

    docker run -d  --link my-rabbit-cluster-federation --hostname my-rabbit-cluster-federation-1 --name my-rabbit-cluster-federation-1 -e RABBITMQ_ERLANG_COOKIE='secret cookie here' fansin/rabbitmq-cluster


第一步启动插件 启动每个节点的插件

    rabbitmq-plugins enable rabbitmq_shovel rabbitmq_shovel_management

第二步 `dest节点`(在src节点也可以,比较灵活) 设置加入集群目标节点 设置/清楚参数,用来关联集群节点


    rabbitmqctl set_parameter shovel my-shovel-queue '{"src-uri": "amqp://admin:admin@my-rabbit-cluster-federation/%2f", "src-queue": "shovel.queue", "dest-uri": "amqp://admin:admin@my-rabbit-cluster-federation-1/%2f", "dest-queue": "shovel.queue"}'

    rabbitmqctl clear_parameter shovel my-shovel-queue



设置exchange

    rabbitmqctl set_parameter shovel my-shovel-exchange '{"src-uri": "amqp://admin:admin@my-rabbit-cluster-federation/%2f", "src-exchange": "shovel.exchange", "dest-uri": "amqp://admin:admin@my-rabbit-cluster-federation-1/%2f", "dest-exchange": "shovel.exchange"}'

    rabbitmqctl set_parameter shovel my-shovel-exchange-1 '{"src-uri": "amqp://admin:admin@my-rabbit-cluster-federation-1/%2f", "src-exchange": "shovel.exchange", "dest-uri": "amqp://admin:admin@my-rabbit-cluster-federation/%2f", "dest-exchange": "shovel.exchange"}'


在docker容器中,后启动的容器link了前面的容器,但是前面的无法识别到后面容器ip,如果要在`src节点` 设置shovel,注意加入域名映射

    echo "172.17.0.4 my-rabbit-cluster-federation-1" >> /etc/hosts

[代码测试用例](http://dwz.cn/6orM5N)

建议先创建好queue或者exchange,如果不提前创建,代码第一次启动会报错.第二次就正常了.
队列默认创建的是durable的exchange或者queue,如果遇到durable的问题,需要重新删掉对应的exchange或者queue,重新创建.

