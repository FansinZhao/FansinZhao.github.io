## tee
从标准输入读取,写入标准输出和(多个)文件.
更简明的说,就是可以写入并在控制台上输出,就像IDE应用日志一样

语法

    tee -aip file1 file2 ...
参数

    -a 向文件中追加
    -i 忽略中断,不能使用ctr+c,只能使用ctr+d
    -p 诊断写入非管道的异常 <mark>不知道怎么用</mark>

示例:

1 控制台输入

1.1 默认覆盖写入

    $tee test
    test
    test

1.2 追加写入

    $tee -a test
    append
    append

1.3 限制中断为ctr+d

    $tee -a -i test
    ^C

1.4 同时向多个文件写入

    $tee test1 test2
    test
    test

2 管道流输入

2.1 输入输出流,仅显示

    $echo "hello tee" | tee
    hello tee

2.2 写入文件

    $echo "file" | tee test
    file
    $echo "file1" | tee -a test
    file1
    $echo "test test" | tee test1 test2
    test test
2.3 记录异常日志

    $cat XXX | tee
    cat: XXX: 没有那个文件或目录