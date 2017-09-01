
# shell 编程小助手

在众多命令中,一个命令可以帮助你进行shell编程,这个命令就是--- help.参数很多,对新老手都有帮助.

直接在命令行输出help,可以看到命令简述,显示结果已做简单排版,方便查看

    zhaofeng@zhaofeng-pc:~$ help
    GNU bash，版本 4.3.48(1)-release (x86_64-pc-linux-gnu)
    这些 shell 命令是内部定义的。请输入 `help' 以获取一个列表。
    输入 `help 名称' 以得到有关函数`名称'的更多信息。
    使用 `info bash' 来获得关于 shell 的更多一般性信息。
    使用 `man -k' 或 `info' 来获取不在列表中的命令的更多信息。

    名称旁边的星号(*)表示该命令被禁用。

     job_spec [&]
     history [-c] [-d 偏移量] [n] 或 history -anrw [文件名] 或 history -ps 参数 [参数...]>
     (( 表达式 ))
     if 命令; then 命令; [ elif 命令; then 命令; ]... [ else 命令; ] fi
     . 文件名 [参数]
     jobs [-lnprs] [任务声明 ...] 或 jobs -x 命令 [参数]
     :
     kill [-s 信号声明 | -n 信号编号 | -信号声明] 进程号 | 任务声明 ... 或 kill -l [信号声明]
     [ 参数... ]
     let 参数 [参数 ...]
     [[ 表达式 ]]
     local [option] 名称[=值] ...
     alias [-p] [名称[=值] ... ]
     logout [n]
     bg [任务声明 ...]
     mapfile [-n 计数] [-O 起始序号] [-s 计数] [-t] [-u fd] [-C 回调] [-c 量子] [数组]
     bind [-lpsvPSVX] [-m keymap] [-f filename] [-q name] [-u name] [-r keyseq>
     popd [-n] [+N | -N]
     break [n]
     printf [-v var] 格式 [参数]
     builtin [shell 内建 [参数 ...]]
     pushd [-n] [+N | -N | 目录]
     caller [表达式]
     pwd [-LP]
     case 词 in [模式 [| 模式]...) 命令 ;;]... esac
     read [-ers] [-a 数组] [-d 分隔符] [-i 缓冲区文字] [-n 读取字符数] [-N 读取字符数] [-p 提示符] [>
     cd [-L|[-P [-e]] [-@]] [dir]
     readarray [-n 计数] [-O 起始序号] [-s 计数] [-t] [-u fd] [-C 回调] [-c 量子] [数组]
     command [-pVv] 命令 [参数 ...]
     readonly [-aAf] [名称[=值] ...] 或 readonly -p
     compgen [-abcdefgjksuv] [-o 选项]  [-A 动作] [-G 全局模式] [-W 词语列表]  [-F 函数] [-C>
     return [n]
     complete [-abcdefgjksuv] [-pr] [-DE] [-o 选项] [-A 动作] [-G 全局模式] [-W 词语列表] >
     select NAME [in 词语 ... ;] do 命令; done
     compopt [-o|+o 选项] [-DE] [名称 ...]
     set [--abefhkmnptuvxBCHP] [-o 选项名] [--] [参数 ...]
     continue [n]
     shift [n]
     coproc [名称] 命令 [重定向]
     shopt [-pqsu] [-o] [选项名 ...]
     declare [-aAfFgilnrtux] [-p] [name[=value] ...]
     source 文件名 [参数]
     dirs [-clpv] [+N] [-N]
     suspend [-f]
     disown [-h] [-ar] [任务声明 ...]
     test [表达式]
     echo [-neE] [参数 ...]
     time [-p] 管道
     enable [-a] [-dnps] [-f 文件名] [名称 ...]
     times
     eval [参数 ...]
     trap [-lp] [[参数] 信号声明 ...]
     exec [-cl] [-a 名称] [命令 [参数 ...]] [重定向 ...]
     true
     exit [n]
     type [-afptP] 名称 [名称 ...]
     export [-fn] [名称[=值] ...] 或 export -p
     typeset [-aAfFgilrtux] [-p] 名称[=值] ...
     false
     ulimit [-SHabcdefilmnpqrstuvxT] [limit]
     fc [-e 编辑器名] [-lnr] [起始] [终结] 或 fc -s [模式=替换串] [命令]
     umask [-p] [-S] [模式]
     fg [任务声明]
     unalias [-a] 名称 [名称 ...]
     for 名称 [in 词语 ... ] ; do 命令; done
     unset [-f] [-v] [-n] [name ...]
     for (( 表达式1; 表达式2; 表达式3 )); do 命令; done
     until 命令; do 命令; done
     function 名称 { 命令 ; } 或 name () { 命令 ; }
     variables - 一些 shell 变量的名称和含义
     getopts 选项字符串 名称 [参数]
     wait [-n] [id ...]
     hash [-lr] [-p 路径名] [-dt] [名称 ...]
     while 命令; do 命令; done
     help [-dms] [模式 ...]
     { 命令 ; }

可以看到,涉及的命令非常之多,如果想学习或者了解某个命令的用法,例如,我想看看while循环,

    help while
    while: while 命令; do 命令; done
        只要测试成功即执行命令。

        只要在 `while' COMMANDS 中的最终命令返回结果为0，则
        展开并执行 COMMANDS 命令。

        退出状态：
        返回最后一个执行的命令的状态。

也可以使用man查看更详细的

    man help

然后查找while

    while list; do list; done
    until list; do list; done
          while  命令不断地执行序列  do list，直到序列中最后一个命令返回 0。 until 命令和 while 命令等价，除了对条件的测试恰好相反；序列 do list
          执行直到序列中最后一个命令返回非零状态值。  while  和   until   命令的退出状态是序列   do   list   中最后一个命令的退出状态，   或者是
          0，如果没有执行任何命令。

现在有了help,随时随地都可以学习或者快速写出正确的shell脚本了.