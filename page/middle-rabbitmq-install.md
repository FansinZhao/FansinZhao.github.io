rabbitmq 安装基本步骤(其中一种)

1 下载安装包

打开官网 http://www.rabbitmq.com/ ,点击导航栏的[Get Started]
(http://www.rabbitmq.com/#getstarted),点击"Download + Installation"下载.

这里有个小建议,不要点击上面下载链接,而是点击下面的"Installation Guides",因为这个链接既有下载链接又有安装说明.

根据自己的系统选择下载版本,例如我的系统是Ubuntu 16.04LTS,选择下载的erlang版本就是18.X,rabbitmq版本就是deb格式的.

2 安装软件

先安装erlang,然后再安装rabbitmq-server,安装比较简单.

3 简单配置

启动server `sudo service rabbitmq-server start`,启动成功后,可以通过 'sudo service rabbitmq-server status',就可以看到绿色"active(running)".
注意rabbitmq的进程名称为`beam.smp`

    $sudo netstat -pan | grep beam.smp
    tcp        0      0 0.0.0.0:25672           0.0.0.0:*               LISTEN      17446/beam.smp
    tcp        0      0 127.0.0.1:59925         127.0.0.1:4369          ESTABLISHED 17446/beam.smp
    tcp6       0      0 :::5672                 :::*                    LISTEN      17446/beam.smp
    unix  3      [ ]         流        已连接     466590   17446/beam.smp

现在启动了,但是你只能通过客户端才能连接到.官方提供了简单的ui管理界面,并以插件的形式提供的.

    $rabbitmq-plugins enable rabbitmq_management
    The following plugins have been enabled:
      amqp_client
      cowlib
      cowboy
      rabbitmq_web_dispatch
      rabbitmq_management_agent
      rabbitmq_management

    Applying plugin configuration to rabbit@zhaofeng-pc... started 6 plugins.

再次查看端口

        $sudo netstat -pan | grep beam.smp
        tcp        0      0 0.0.0.0:25672           0.0.0.0:*               LISTEN      17446/beam.smp
        tcp        0      0 0.0.0.0:15672           0.0.0.0:*               LISTEN      17446/beam.smp
        tcp        0      0 127.0.0.1:59925         127.0.0.1:4369          ESTABLISHED 17446/beam.smp
        tcp6       0      0 :::5672                 :::*                    LISTEN      17446/beam.smp
        unix  3      [ ]         流        已连接     466590   17446/beam.smp

现在就可以访问管理ui,http://127.0.0.1:15672. 默认用户密码都是guest,这个用户只能本地访问,不能远程访问.



