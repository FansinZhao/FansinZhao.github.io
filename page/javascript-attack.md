重拾javascript之安全攻击

1 表单攻击

       <script>alert(“Attack!”)</script>

2 地址栏攻击

    javascript:alert("Hello World")

或者修改页面资源

    javascript:alert(document.hi.src="http://www.mysite.com/bye.jpeg")

修改页面变量

    javascript:alert(a="hello")

修改表单

    javascript:alert(document.format.mail.value="me@hacker.com")
    javascript:alert(document. .mail.value="me@hacker.com")



在地址栏和搜索栏合并的浏览器中,地址栏攻击已经不能使用了.
