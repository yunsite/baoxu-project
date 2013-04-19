<!DOCTYPE html>
<html>
<head>
    <meta charset = "utf-8" />
    <meta content = "width=device-width, initial-scale=1.0" name = "viewport">
    <title>借阅列表—Just Read</title>
    <link rel = "shortcut icon" href = "../favicon.ico">
    <link rel = "stylesheet" href = "../css/bootstrap.min.css">
    <link rel = "stylesheet" href = "../css/global.css">
    <link rel = "stylesheet" href = "../css/bootstrap-responsive.min.css">
    <link rel = "stylesheet" href = "../css/function.css">
    <style type = "text/css">
        .bx-borrow-list-subnav{ margin-bottom: 20px; }
    </style>
</head>
<body>

<!--引入导航文件-->
<?php include "../common/nav.php"; ?>

<!--判断用户权限-->
<?php include "../common/check_admin_permission.php"; ?>

<!--读取数据库，获取用户列表-->
<?php

//判断GET中是否有page参数
if(!array_key_exists("page", $_GET)){
    $nowPage = 1;
} else{
    if($_GET["page"] <= 0){
        $nowPage = 1;
    } else{
        $nowPage = $_GET["page"];
    }
}

//判断GET中是否有type参数
if(!array_key_exists("type", $_GET)){
    $nowType = "all";
    //记录条数
    $borrowCount = getListCount("borrow", $conn, array());

    //查全部书籍列表
    $sql = "SELECT * FROM `borrow` ORDER BY `borrow_id` DESC LIMIT " . ($nowPage - 1) * PAGE_SIZE . "," . PAGE_SIZE;
    //分类导航
    $subNav = '<a class = "btn" href = "?type=apply">申请中</a>
            <a class = "btn" href = "?type=borrow">借阅中</a>
            <a class = "btn" href = "?type=return">已归还</a>
            <a class = "btn btn-primary" href = "?type=">全部</i></a>';
    //管理菜单
    $manageMenu = "";
} else{
    $nowType = $_GET["type"];
    switch($nowType){
        case "apply":
            //申请状态记录条数
            $borrowCount = getListCount("borrow", $conn, array("type", 0));
            //选择所有申请状态的数据
            $sql = "SELECT * FROM `borrow` WHERE `type` = '0' ORDER BY `borrow_id` DESC LIMIT " . ($nowPage - 1) * PAGE_SIZE . "," . PAGE_SIZE;
            //分类导航
            $subNav = '<a class = "btn btn-primary" href = "?type=apply">申请中</a>
            <a class = "btn" href = "?type=borrow">借阅中</a>
            <a class = "btn" href = "?type=return">已归还</a>
            <a class = "btn" href = "?type=">全部</i></a>';
            break;
        case "borrow":
            //借阅状态记录条数
            $borrowCount = getListCount("borrow", $conn, array("type", 1));
            //选择所有借阅状态的数据
            $sql = "SELECT * FROM `borrow` WHERE `type` = '1' ORDER BY `borrow_id` DESC LIMIT " . ($nowPage - 1) * PAGE_SIZE . "," . PAGE_SIZE;
            //分类导航
            $subNav = '<a class = "btn" href = "?type=apply">申请中</a>
            <a class = "btn btn-primary" href = "?type=borrow">借阅中</a>
            <a class = "btn" href = "?type=return">已归还</a>
            <a class = "btn" href = "?type=">全部</i></a>';
            break;
        case "return":
            //归还状态记录条数
            $borrowCount = getListCount("borrow", $conn, array("type", 2));
            //选择所有归还状态的数据
            $sql = "SELECT * FROM `borrow` WHERE `type` = '2' ORDER BY `borrow_id` DESC LIMIT " . ($nowPage - 1) * PAGE_SIZE . "," . PAGE_SIZE;
            //分类导航
            $subNav = '<a class = "btn" href = "?type=apply">申请中</a>
            <a class = "btn" href = "?type=borrow">借阅中</a>
            <a class = "btn btn-primary" href = "?type=return">已归还</a>
            <a class = "btn" href = "?type=">全部</i></a>';
            break;
        default:
            //全部记录条数
            $borrowCount = getListCount("borrow", $conn, array());
            //默认选取全部数据
            $sql = "SELECT * FROM `borrow` ORDER BY `borrow_id` DESC LIMIT " . ($nowPage - 1) * PAGE_SIZE . "," . PAGE_SIZE;
            //分类导航
            $subNav = '<a class = "btn" href = "?type=apply">申请中</a>
            <a class = "btn" href = "?type=borrow">借阅中</a>
            <a class = "btn" href = "?type=return">已归还</a>
            <a class = "btn btn-primary" href = "?type=">全部</i></a>';
            break;
    }
}

//总页数
$borrowPageCount = ceil($borrowCount / PAGE_SIZE);

//设置分页导航
if($nowPage == 1){
    if($borrowPageCount == 1){
        //如果是第一页，且只有一页
        $pageNav = '<li class="active"><span>&laquo; Prev</span></li>
                    <li class="active"><span>Next &raquo;</span></li>';
    } else{
        //第一页，但不止一页
        $pageNav = '<li class="active"><span>&laquo; Prev</span></li>
                    <li><a href="?page=' . ($nowPage + 1) . '&type=' . $nowType . '">Next &raquo;</a></li>';
    }
} elseif($nowPage == $borrowPageCount){
    $pageNav = '<li><a href="?page=' . ($nowPage - 1) . '&type=' . $nowType . '">&laquo; Prev</a></li>
                <li class="active"><span>Next &raquo;</span></li>';
} else{
    $pageNav = '<li><a href="?page=' . ($nowPage - 1) . '&type=' . $nowType . '">&laquo; Prev</a></li>
                <li><a href="?page=' . ($nowPage + 1) . '&type=' . $nowType . '">Next &raquo;</a></li>';
}

//执行sql语句
$result = mysql_query($sql, $conn);
$success = mysql_num_rows($result);
?>

<!--页面主体-->
<div class = "container">
    <div class = "btn-toolbar bx-borrow-list-subnav">
        <div class = "btn-group">
            <?php echo $subNav ?>
        </div>
    </div>

    <table class = "table table-bordered table-hover table-striped">
        <thead>
        <tr>
            <th>借阅ID</th>
            <th>姓名</th>
            <th>书名</th>
            <th>借阅状态</th>
            <th>是否续借</th>
            <th>操作日期</th>
            <th>应还日期</th>
            <th>管理</th>
        </tr>
        </thead>
        <tbody>

        <?php
        //返回结果，打印TR
        if($success){
            while($row = mysql_fetch_array($result)){
                //借阅ID
                $borrowId = $row["borrow_id"];
                //用户ID
                $userId = $row["user_id"];
                //通过ID获取用户名称
                $userInfo = getUserInfoById($userId, $conn);
                $userName = $userInfo["name"];
                //书籍ID
                $bookId = $row["book_id"];
                //通过ID获取书籍信息
                $bookInfo = getBookInfoById($bookId, $conn);
                $bookTitle = $bookInfo["title"];
                //是否续借
                $isRenew = $row["renew"];
                //操作时间
                $actionDate = $row["date"];
                //借阅状态
                $type = $row["type"];

                //根据借阅状态的不同，有些字段是不显示的
                switch($type){
                    case "0":
                        $borrowType = "申请中";
                        $borrowRenew = "-";
                        $returnDate = "-";
                        //管理菜单
                        $manageMenu = '<a href="#" data-event-tag="et_loan_book_btn" data-book-id="' . $bookId . '"data-borrow-id="' . $borrowId . '">借出</a>';
                        break;
                    case "1":
                        $borrowType = "借阅中";
                        //借出日的时间戳
                        $borrowDateStamp = strtotime($row["date"]);
                        //当前的时间戳
                        $nowDateStamp = strtotime(date("Y-m-d"));
                        //如果有续借
                        if($isRenew){
                            $borrowRenew = "已续借";
                            //到期那天的时间戳，算上续借的天数
                            $bookExpireStamp = (BORROW_DAY + RENEW_DAY) * 24 * 60 * 60 + $borrowDateStamp;
                            //到期日期
                            $returnDate = date("Y-m-d", $bookExpireStamp);
                        } else{
                            $borrowRenew = "未续借";
                            //到期那天的时间戳
                            $bookExpireStamp = BORROW_DAY * 24 * 60 * 60 + $borrowDateStamp;
                            //到期日期
                            $returnDate = date("Y-m-d", $bookExpireStamp);
                        }
                        //管理菜单
                        $manageMenu = '<a href="#" data-event-tag="et_return_book_btn" data-book-id="' . $bookId . '"data-borrow-id="' . $borrowId . '">还回</a>&nbsp;&nbsp;&nbsp;
                        <a href="#" data-event-tag="et_renew_book_btn" data-book-id="' . $bookId . '"data-borrow-id="' . $borrowId . '">续借</a>';
                        break;
                    case "2":
                        $borrowType = "已归还";
                        $borrowRenew = "-";
                        $returnDate = "-";
                        //管理菜单
                        $manageMenu = "-";
                        break;
                    default:
                        $borrowType = "-";
                        $borrowRenew = "-";
                        $returnDate = "-";
                        //管理菜单
                        $manageMenu = "-";
                }

                //填充表格
                echo '<tr>';
                echo '<td>' . $borrowId . '</td>';
                echo '<td><a href="user_info.php?userId=' . $userId . '">' . $userName . '</a></td>';
                echo '<td><a href="../book/info.php?bookId=' . $bookId . '">' . $bookTitle . '</a></td>';
                echo '<td>' . $borrowType . '</td>';
                echo '<td>' . $borrowRenew . '</td>';
                echo '<td>' . $actionDate . '</td>';
                echo '<td>' . $returnDate . '</td>';
                echo '<td>' . $manageMenu . '</td>';
                echo '</tr>';
            }
        } else{
            echo '没有项目！';
        }
        ?>
    </table>

    <!--导航条-->
    <div class = "pagination">
        <ul>
            <?php echo $pageNav ?>
        </ul>
    </div>
</div>

<!--引入页尾文件-->
<?php include "../common/foot.php"; ?>