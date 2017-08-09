下面的命令参数,均可以在[ui](http://localhost:15672)上进行操作,界面更加直观,但是命令在一些情况下,比较灵活

1 权限系统/多租户系统

rabbitmq通过vhost来实现多租户权限.一个rabbitmq 服务器可以有多个vhost,默认vhost为"/",
可以通过命令行或者管理界面添加vhost

通过控制命令

    $ sudo rabbitmqctl | grep _vhost
    add_vhost <vhost> 一次只能添加一个
    delete_vhost <vhost> 一次只能删除一个
    list_vhosts [<vhostinfoitem> ...]


关于vhost有3条简单命令,增加,删除,查询

    $sudo rabbitmqctl -n rabbit@zhaofeng-pc list_vhosts
    Listing vhosts
    /
    $ sudo rabbitmqctl -n rabbit@zhaofeng-pc add_vhost /test_host
    Creating vhost "/test_host"
    $sudo rabbitmqctl -n rabbit@zhaofeng-pc list_vhosts
    Listing vhosts
    /test_host
    /
    $sudo rabbitmqctl -n rabbit@zhaofeng-pc delete_vhost /test_host
    Deleting vhost "/test_host"
    $sudo rabbitmqctl -n rabbit@zhaofeng-pc list_vhosts
    Listing vhosts
    /

为vhost添加用户,通过命令

    $ sudo rabbitmqctl | egrep "_permission|_user|_password"
    add_user <username> <password>
    delete_user <username>
    authenticate_user <username> <password>
    set_user_tagsset_user_tags <username> <tag> ... management:可以进入ui policymaker:可以进入ui并管理策略和vhosts参数 monitoring:可以进入ui,并能查看节点相关channel和connection administrator:可以操作一切
    list_users
    set_permissions [-p <vhost>] <user> <conf> <write> <read>
    clear_permissions [-p <vhost>] <username>
    list_permissions [-p <vhost>]
    list_user_permissions <username>
    change_password <username> <newpassword>
    clear_password <username>


提供了11条关于user的命令,增加,删除,授权,设置标签,查询用户,查询权限,设置权限,清除权限,修改密码,清楚密码
比如我创建一个管理员ui用户

    $ sudo rabbitmqctl -n rabbit@zhaofeng-pc add_user fansin 1234
    Creating user "fansin"
    $ sudo rabbitmqctl -n rabbit@zhaofeng-pc set_user_tags fansin administrator
    Setting tags for user "fansin" to [administrator]
    $ sudo rabbitmqctl -n rabbit@zhaofeng-pc list_users
    Listing users
    fansin	[administrator]
    guest	[administrator]
    test	[adminstrator]
    $ sudo rabbitmqctl -n rabbit@zhaofeng-pc delete_user fansin
    Deleting user "fansin"

    $sudo rabbitmqctl -n rabbit@zhaofeng-pc add_user fansin 1234
    Creating user "fansin"
    $ sudo rabbitmqctl -n rabbit@zhaofeng-pc authenticate_user fansin 1234
    Authenticating user "fansin"
    Success
    $sudo rabbitmqctl -n rabbit@zhaofeng-pc add_vhost /test_host
    Creating vhost "/test_host"
    $ sudo rabbitmqctl -n rabbit@zhaofeng-pc set_permissions -p /test_host fansin '.*' '.*' '.*'
    Setting permissions for user "fansin" in vhost "/test_host"
    $sudo rabbitmqctl -n rabbit@zhaofeng-pc list_permissions -p /test_host
    Listing permissions in vhost "/test_host"
    fansin	.*	.*	.*
    $sudo rabbitmqctl -n rabbit@zhaofeng-pc list_user_permissions fansin
    Listing permissions for user "fansin"
    /test_host	.*	.*	.*
    $sudo rabbitmqctl -n rabbit@zhaofeng-pc clear_permissions -p /test_host fansin
    Clearing permissions for user "fansin" in vhost "/test_host"

注意,如果用户不存在,则查询为空,authenticate_user必须是已经创建的用户,可以为用户提供更多的权限控制.



2 监控rabbitmq使用

    $ sudo rabbitmqctl | grep list_
        list_users
        list_vhosts [<vhostinfoitem> ...]
        list_permissions [-p <vhost>]
        list_user_permissions <username>
        list_parameters [-p <vhost>]
        list_global_parameters
        list_policies [-p <vhost>]
        list_queues [-p <vhost>] [--offline|--online|--local] [<queueinfoitem> ...]
        list_exchanges [-p <vhost>] [<exchangeinfoitem> ...]
        list_bindings [-p <vhost>] [<bindinginfoitem> ...]
        list_connections [<connectioninfoitem> ...]
        list_channels [<channelinfoitem> ...]
        list_consumers [-p <vhost>]

可以通过命令查询用户,vhost,队列,exchange,bindings,connection,channel,Consumer等,查询时
list_"要查询的参数+s",除了简单查询外,还可以限定参数.

    <vhostinfoitem> 属性
        [name, tracing].

    <queueinfoitem> 属性
        [name, durable, auto_delete,
        arguments, policy, pid, owner_pid, exclusive, exclusive_consumer_pid,
        exclusive_consumer_tag, messages_ready, messages_unacknowledged, messages,
        messages_ready_ram, messages_unacknowledged_ram, messages_ram,
        messages_persistent, message_bytes, message_bytes_ready,
        message_bytes_unacknowledged, message_bytes_ram, message_bytes_persistent,
        head_message_timestamp, disk_reads, disk_writes, consumers,
        consumer_utilisation, memory, slave_pids, synchronised_slave_pids, state].

    <exchangeinfoitem> 属性
        [name, type, durable,
        auto_delete, internal, arguments, policy].

    <bindinginfoitem> 属性
        [source_name, source_kind,
        destination_name, destination_kind, routing_key, arguments].

    <connectioninfoitem> 属性
        [pid, name, port, host,
        peer_port, peer_host, ssl, ssl_protocol, ssl_key_exchange, ssl_cipher,
        ssl_hash, peer_cert_subject, peer_cert_issuer, peer_cert_validity, state,
        channels, protocol, auth_mechanism, user, vhost, timeout, frame_max,
        channel_max, client_properties, recv_oct, recv_cnt, send_oct, send_cnt,
        send_pend, connected_at].

    <channelinfoitem> 属性
        [pid, connection, name, number,
        user, vhost, transactional, confirm, consumer_count, messages_unacknowledged,
        messages_uncommitted, acks_uncommitted, messages_unconfirmed, prefetch_count,
        global_prefetch_count].



3 动态切换log文件

通过rotate_log,动态切换log文件

    $ sudo rabbitmqctl |grep _logs
        rotate_logs <suffix>
    $sudo rabbitmqctl rotate_logs .2
    Rotating logs to files with suffix ".2"
    $ ls /var/log/rabbitmq/
    rabbit@zhaofeng-pc.log      rabbit@zhaofeng-pc-sasl.log
    rabbit@zhaofeng-pc.log.1    rabbit@zhaofeng-pc-sasl.log.1
    rabbit@zhaofeng-pc.log.2    rabbit@zhaofeng-pc-sasl.log.2
    rabbit@zhaofeng-pc.log.log  rabbit@zhaofeng-pc-sasl.log.log












