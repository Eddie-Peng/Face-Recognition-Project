<%@ page language="java" import="java.util.*" pageEncoding="UTF-8" %>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
    <title>楼栋管理系统-访客登记</title>
    <meta http-equiv="pragma" content="no-cache">
    <meta http-equiv="cache-control" content="no-cache">
    <meta http-equiv="expires" content="0">
    <meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
    <meta http-equiv="description" content="This is my page">

    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/stylelogin.css"/>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/example.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/buttons.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/sweetalert2.min.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/sweetalert2.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/sweetalert2.scss">
    <link href="${pageContext.request.contextPath}/css/bootstrap.min.css" rel="stylesheet">
    <link href="${pageContext.request.contextPath}/css/font-awesome.css?v=4.4.0" rel="stylesheet">
    <link href="${pageContext.request.contextPath}/css/animate.css" rel="stylesheet">
    <link href="${pageContext.request.contextPath}/css/style.css" rel="stylesheet">
    <link href="${pageContext.request.contextPath}/css/login.css" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/stylelogin.css">
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/visitorstyle.css">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css">

    <script type="text/javascript" src="${pageContext.request.contextPath}/js/jquerylogin.min.js"></script>
    <script type="text/javascript" src="${pageContext.request.contextPath}/js/vector.js"></script>

    <script src="${pageContext.request.contextPath}/js/jquery-2.1.1.min.js" type="text/javascript"></script>
    <script src="${pageContext.request.contextPath}/js/sweetalert2.min.js" type="text/javascript"></script>


    <style type="text/css">
        #jz {
            margin: 0 auto;
            width: 320px;
            height: 50px;
        }
    </style>
</head>

<body class="signin">
<div id="container">
    <div id="output">
        <div class="signinpanel">
            <div class="row">
                <div class="col-sm-12">
                    <form class="form" id="entry_form" action="InsertVisitor">
                        <h4 class="no-margins" style="text-align: center; font-size: 20px">访客登记</h4>
                        <input type="text"
                               onkeyup="this.value=this.value.replace(/[^\d]/g,'') "
                               onafterpaste="this.value=this.value.replace(/[^\d]/g,'') "
                               class="form-control uname" style="margin: 20px auto" placeholder="访客ID"
                               id="visitor_id" name="visitor_id"/>
                        <input type="text" class="form-control uname" style="margin: 30px auto" placeholder="姓名"
                               id="visitor_name" name="visitor_name"/>
                        <div id="jz" class="c-dropdown js-dropdown" style="width: 258px" align="center">
                            <input type="hidden" name="visitor_reason" id="visitor_reason" class="js-dropdown__input">
                            <span class="c-button c-button--dropdown js-dropdown__current"
                                  style="width: 200px;padding-right: 0px;padding-left: 0px">来访原因</span>
                            <ul class="c-dropdown__list">
                                <li class="c-dropdown__item" data-dropdown-value="探望朋友" value="探望朋友">探望朋友</li>
                                <li class="c-dropdown__item" data-dropdown-value="参加聚会" value="参加聚会">参加聚会</li>
                                <li class="c-dropdown__item" data-dropdown-value="检查卫生" value="检查卫生">检查卫生</li>
                                <li class="c-dropdown__item" data-dropdown-value="路过上厕所" value="路过上厕所">路过上厕所</li>
                                <li class="c-dropdown__item" data-dropdown-value="其他" value="其他">其他</li>
                            </ul>
                        </div>
                        <button type="button" class="btn btn-success btn-block" onclick="myfunction()">提交</button>
                        <script type="text/javascript">
                            function myfunction() {
                                var visitor_id = document.getElementById("visitor_id").value;
                                var visitor_name = document.getElementById("visitor_name").value;
                                var visitor_reason = document.getElementById("visitor_reason").value;
                                if(visitor_reason.toString() == "" || visitor_reason.toString() == null){
                                    swal({
                                        type: 'warning',
                                        title: "未选择探访原因，请重新选择",
                                        text: '3秒后将自动关闭',
                                        timer: 3000
                                    }).then(function (isConfirom) {
                                        if (isConfirom) {
                                            location.href = "visitor.jsp";
                                        }else{
                                            location.href = "visitor.jsp";
                                        }
                                    });
                                }else{
                                    // console.log(visitor_id+"---"+visitor_name+"----"+visitor_reason);
                                    $.ajax({

                                        type: "post",

                                        url: "${pageContext.request.contextPath}/InsertVisitor",

                                        data: {
                                            "visitor_id": visitor_id,
                                            "visitor_name": visitor_name,
                                            "visitor_reason": visitor_reason
                                        },
                                        success: function (data) {
                                            var jsonobj = eval("(" + data + ")");
                                            //data是服务器返回数据
                                            // console.log("我是回来的JSON====="+jsonobj.resl)
                                            if (jsonobj.resl) {
                                                swal({
                                                    type: 'success',
                                                    title: "数据记录成功",
                                                    text: '3秒后将自动关闭',
                                                    timer: 3000
                                                }).then(function (isConfirom) {
                                                    if (isConfirom) {
                                                        location.href = "index.jsp";
                                                    }else{
                                                        location.href = "index.jsp";
                                                    }
                                                });
                                            } else {
                                                swal({
                                                    type: 'warning',
                                                    title: "此ID已被记录，请重新输入",
                                                    text: '3秒后将自动关闭',
                                                    timer: 3000
                                                }).then(function (isConfirom) {
                                                    if (isConfirom) {
                                                        location.href = "visitor.jsp";
                                                    }else{
                                                        location.href = "visitor.jsp";
                                                    }
                                                });
                                            }
                                        }
                                    });
                                }
                            }
                        </script>

                    </form>
                </div>
            </div>
            <div class="signup-footer">
                <div style="font-size: 18px; text-align: center; color: black" class=> &copy; 广厦万间</div>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/jquery.min.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/index.js"></script>
<div style="text-align:center;"></div>
</body>
</html>
