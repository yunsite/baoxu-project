<?php
/**
 * User: Baoxu
 * Date: 13-4-1
 * Time: 下午6:26
 */



$host = "127.0.0.1";
$user = "baoxu";
$pass = ",.";
$db = "library";

$conn = mysql_connect($host,$user,$pass);
mysql_select_db($db,$conn);
mysql_query("SET NAMES 'utf8'");
?>