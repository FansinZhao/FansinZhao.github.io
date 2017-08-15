
# Federation Cluster

官方提供的另外一种集群方式,基本工作原理:通过使用rabbitmq的插件的形式提供集群功能.
每个节点都启用rabbitmq_federation,rabbitmq_federation_management.节点之间通过
amqp协议传输消息,由于是遵循协议,所以节点之间的版本可以不同,不想原生集群那么多限制.
绑定关系,通过设定parameter和policy关联集群.

我使用docker创建两个容器

    docker run -d --hostname my-rabbit-cluster-federation --name my-rabbit-cluster-federation -e RABBITMQ_ERLANG_COOKIE='secret cookie here' fansin/rabbitmq-cluster
    docker run -d  --link my-rabbit-cluster-federation --hostname my-rabbit-cluster-federation-1 --name my-rabbit-cluster-federation-1 -e RABBITMQ_ERLANG_COOKIE='secret cookie here' fansin/rabbitmq-cluster

<!-- 第一步 创建一个vhost,`注意vhost不能带有'/'`,并添加至少一个用户

    rabbitmqctl add_user rabbit rabbit
    rabbitmqctl set_user_tags rabbit administrator
    rabbitmqctl authenticate_user rabbit rabbit
    rabbitmqctl add_vhost my-vhost
    rabbitmqctl set_permissions -p my-vhost rabbit '.*' '.*' '.*' -->

第一步启动插件 启动每个节点的插件

    rabbitmq-plugins enable rabbitmq_federation rabbitmq_federation_management

第二步 downstream节点 设置加入集群目标节点 设置/清楚参数,用来关联集群节点

    rabbitmqctl set_parameter federation-upstream my-upstream '{"uri":"amqp://admin:admin@my-rabbit-cluster-federation/%2f","expires":3600000}'

    rabbitmqctl clear_parameter federation-upstream my-upstream

第三步 `downstream节点`  设置集群内容 设置/清除策略,用来确定加入集群exchange,无法加载""空exchange

    rabbitmqctl set_policy --apply-to queues federate-me "^queue\." '{"federation-upstream-set":"all"}'

    rabbitmqctl clear_policy federate-me

第四步验证集群

现在看my-rabbit-cluster-federation的集群会看到多个连接,然后再看
my-rabbit-cluster-federation-1也会看到多个连接,同时exchange上会有"federate-me"
特性.
通过federation可以实现exchange或者queue的高可用.测试中发现,无法实现消息复制功能.
当downstream启动客户端时,可以发送消息,证实队列正常创建,但是无消息.
federation经常同shovel一块使用,实现消息复制.

*注意:我测试代码的时候,发现exchange一直无法使用,不知道问什么,有知道的朋友告知一下*

[代码测试用例](http://dwz.cn/6orLGq)



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


# Federation搭档Shovel

shovel跟federation使用类似,比federation更加的灵活,federation用在局域网,而shovel
可以用在互联网中.

第一步启动插件 启动每个节点的插件

    rabbitmq-plugins enable rabbitmq_shovel rabbitmq_shovel_management

第二步 `upstream节点` 设置加入集群目标节点 设置/清楚参数,用来关联集群节点

    echo "172.17.0.4 my-rabbit-cluster-federation-1" >> /etc/hosts
    <!-- rabbitmqctl set_parameter shovel my-exchange-shovel '{"src-uri": "amqp://admin:admin@my-rabbit-cluster-federation/%2f", "src-exchange": "amq.direct", "dest-uri": "amqp://admin:admin@172.17.0.4/%2f", "dest-exchange": "amq.direct"}' -->
    rabbitmqctl set_parameter shovel my-queue-shovel '{"src-uri": "amqp://admin:admin@my-rabbit-cluster-federation/%2f", "src-queue": "queue.shovel", "dest-uri": "amqp://admin:admin@my-rabbit-cluster-federation-1/%2f", "dest-queue": "queue.shovel"}'

    rabbitmqctl clear_parameter shovel my-queue-shovel

*注意:我测试代码的时候,发现exchange一直无法使用,不知道问什么,有知道的朋友告知一下*

[代码测试用例](http://dwz.cn/6orM5N)


