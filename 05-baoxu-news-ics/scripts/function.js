/**
 * Author: Baoxu
 * Date:   12-10-29
 * Time:   下午12:09
 */

//定义一些要用的常量
var LOG_INFO = "BAOXU-LOG-INFO: ";  //LOG_INFO的前缀

//定义标志位全局变量
var MAIN_LAYER_MOVE_FLAG = 0;       //主图层的位移情况，0表示未移动，1表示向右移了，2表示向左移了
var COLUMN_DISPLAY_FLAG = 0;        //新闻类顶部栏目列表的显示标志，0表示没有展开，1表示展开了
var COLUMN_EDIT_FLAG = 0;           //新闻类顶部栏目列表编辑状态标志，0表示没有编辑或者编辑完成，1表示正在编辑
var DETAIL_LAYER_MOVE_FLAG = 0;     //新闻详情页是否显示在主视图，0表示没有，1表示正在显示
var TIES_LAYER_MOVE_FLAG = 0;       //跟帖页是否显示在主视图，0表示没有，1表示正在显示

var VIEW_SCROLL_TOP = 0;


/******************************************************************************/
/******************                 执行函数               *********************/
/******************************************************************************/

//将TODO事项加入页面加载完成之后立即处理
addLoadEvent(todo);
//TODO函数中包括要立即处理的函数
function todo(){
	console.log(LOG_INFO + "Starting, just do it!");//LOG
	initViewPort();
	changeBotLayerNavi();
	bindAllObject();

	//getNewsList("headline", "T1348647909107", 0, 20, renderHeadline);

	//显示离线存储状态
	//showAppCache();

//	document.addEventListener("touchstart", handleTouchEvent, false);
//	document.addEventListener("touchend", handleTouchEvent, false);
//	document.addEventListener("touchmove", handleTouchEvent, false);
}

//初始化页面的高宽以适合所有屏幕的显示
function initViewPort(){
	//获取屏幕信息
	var client_width = getClientInfo()["width"];
	var client_height = getClientInfo()["height"];
	console.log(LOG_INFO + "ViewSize is " + client_width + " & " + client_height);//LOG

	//页面底层图层全比例显示
	$$("bot-layer").style.width = client_width;
	$$("bot-layer").style.height = client_height;
	console.log(LOG_INFO + "Bottom layer is full of page");//LOG
	//底层导航，导航遮罩阴影，底层个人信息，个人信息遮罩阴影校正高度
	$$("bot-layer-navi").style.height = client_height + "px";
	$$("bot-layer-navi-shadow").style.height = client_height + "px";
	$$("bot-layer-info-shadow").style.height = client_height + "px";
	$$("bot-layer-info").style.height = client_height + "px";
	console.log(LOG_INFO + "Correct bottom layer navi and info's heigh with full page");//LOG
	//底层个人信息部分校正宽度
	$$("bot-layer-info").style.width = client_width - 96 + "px";
	console.log(LOG_INFO + "Correct bottom layer info's width with full page but navi");//LOG
	//上层信息主图层校正宽度
	$$("main").style.width = client_width + "px";
	$$("main-layer").style.width = client_width + "px";
	console.log(LOG_INFO + "Correct main layer width with full page");//LOG
	//新闻详情页图层校正宽高与视图一致
	$$("main-layer-detail").style.width = client_width + "px";
	$$("main-layer-detail").style.height = client_height + "px";
	//跟帖页图层校正宽高与视图一致
	$$("main-layer-ties").style.width = client_width + "px";
	$$("main-layer-ties").style.height = client_height + "px";
}

//需要添加事件的对象都写在这里
function bindAllObject(){
	//左上角的频道切换按钮的点击事件，点击后主图层向右推开或收回
	$$("main-layer-action-bar-back").getElementsByTagName("a")[0].onclick = toggleMainLayerMoveToRight;
	//右上角的用户及设置按钮的点击事件，点击后主图层向左推开或收回
	$$("main-layer-action-bar-user").getElementsByTagName("a")[0].onclick = toggleMainLayerMoveToLeft;
	//点击主图层操作条中部的栏目选择时，弹出或隐藏栏目列表
	$$("main-layer-action-bar-column").getElementsByTagName("a")[0].onclick = toggleColumnList;
	//点击栏目列表中某一项的时候，更改主图层栏目名称
	var columnList = $$("main-layer-action-bar-column-list").getElementsByTagName("li");
	for(var i = 0 ; i < columnList.length ; i++){
		columnList[i].getElementsByTagName("a")[0].onclick = toggleDeleteColumn;
		columnList[i].getElementsByTagName("a")[1].onclick = chooseColumn;
	}
	//点击新闻栏目编辑按钮的动作
	$$("main-layer-news-column-do").getElementsByTagName("a")[1].onclick = toggleEditNewsColumnList;
	//点击新闻栏目编辑完成按钮时的动作
	$$("main-layer-news-column-ok").getElementsByTagName("a")[0].onclick = toggleEditNewsColumnList;
}

//页面底层左栏导航按钮点击的样式变化
function changeBotLayerNavi(){
	var bot_layer_navi_li = $$("navi-list").getElementsByTagName("li");
	for(var i = 0 ; i < bot_layer_navi_li.length ; i++){
		bot_layer_navi_li[i].getElementsByTagName("a")[0].onclick = function(){
			//某个按钮被点击后，将所有的按钮样式置空
			for(var t = 0 ; t < bot_layer_navi_li.length ; t++){
				bot_layer_navi_li[t].getElementsByTagName("a")[0].className = "";
			}
			console.log(LOG_INFO + "All navi button style is normal");//LOG
			//将被点击按钮的样式置为current
			this.className = "current";
			setTimeout(toggleMainLayerMoveToRight, 200);
			console.log(LOG_INFO + "The navi button who is clicked style is current and main layer goes home");//LOG
		}
	}
}

//主页面图层向右移动，即点击了左上角的按钮的效果
function toggleMainLayerMoveToRight(){
	var theBar = $$("main-layer-action-bar-back").getElementsByTagName("a")[0];
	if(MAIN_LAYER_MOVE_FLAG == 0){
		moveElementWith("main-layer", "absolute", 96, 0.2, 10, -1, mainLayerRightOver);
		moveElementWith("main-layer-action-bar", "fixed", 96, 0.2, 10, 0);
		theBar.className = "current";
		//LOG
		console.log(LOG_INFO + "Main layer moving to the right,and back button style is current");//LOG
	}else{
		moveElementWith("main-layer", "absolute", -96, 0.2, 10, 1, mainLayerRestore);
		moveElementWith("main-layer-action-bar", "fixed", -96, 0.2, 10, 0);
		theBar.className = "";
		//LOG
		console.log(LOG_INFO + "Main layer going home, and back button style is normal");//LOG
	}
}

//切换主页面图层向左移动，即点击了右上角的按钮的效果，移动或收起
function toggleMainLayerMoveToLeft(){
	var theBar = $$("main-layer-action-bar-user").getElementsByTagName("a")[0];
	if(MAIN_LAYER_MOVE_FLAG == 0){
		moveElementWith("main-layer", "absolute", -384, 0.2, 10, 0, mainLayerLeftOver);
		moveElementWith("main-layer-action-bar", "fixed", -384, 0.2, 10, 0);
		theBar.className = "current";
		//LOG
		console.log(LOG_INFO + "Main layer moving to the left,and user button style is current");//LOG
	}else{
		moveElementWith("main-layer", "absolute", 384, 0.2, 10, 0, mainLayerRestore);
		moveElementWith("main-layer-action-bar", "fixed", 384, 0.2, 10, 0);
		theBar.className = "";
		//LOG
		console.log(LOG_INFO + "Main layer going home, and user button style is normal");//LOG
	}
}


//在新闻列表中点击的时候向左推出详情页
function toggleDetailLayerDisplay(){
	if(DETAIL_LAYER_MOVE_FLAG == 0){
		//获取页面的已滚动高度，以便于复原
		//VIEW_SCROLL_TOP = document.documentElement.scrollTop;   //Firefox
		VIEW_SCROLL_TOP = document.body.scrollTop;   //Webkit

		//先显示新闻详情页，设为block，然后将其移入主视图，占满主视图之后，在回调函数里面隐藏列表页，以方便滚动条
		setElementDisplay("main-layer-detail", "block");
		moveElementWith("main-layer-detail", "absolute", -480, 0.2, 10, 0, detailLayerDisplay);
		//LOG
		console.log(LOG_INFO + "Detail layer moving to the main view");//LOG
	}else{
		//先显示出隐藏了的新闻列表页，复原滚动高度，将新闻详情页移出主视图，在回调函数里面将其设置为none
		setElementDisplay("main-layer", "block");
		//document.documentElement.scrollTop = VIEW_SCROLL_TOP; //Firefox
		document.body.scrollTop = VIEW_SCROLL_TOP; //Webkit

		moveElementWith("main-layer-detail", "absolute", 480, 0.2, 10, 0, detailLayerRestore);
		//LOG
		console.log(LOG_INFO + "Detail layer moving out the main view, now is hide");//LOG
	}
}


//点击跟帖数的时候向左推出跟帖页
function toggleTiesLayerDisplay(){
	if(TIES_LAYER_MOVE_FLAG == 0){
		//先显示跟帖页，设为block，然后将其移入主视图
		setElementDisplay("main-layer-ties", "block");
		moveElementWith("main-layer-ties", "absolute", -480, 0.2, 10, 0, tiesLayerDisplay);
		//LOG
		console.log(LOG_INFO + "Ties layer moving to the main view");//LOG
	}else{
		//将跟帖页移出主视图，在回调函数里面将其设置为none
		moveElementWith("main-layer-ties", "absolute", 480, 0.2, 10, 0, tiesLayerRestore);
		//LOG
		console.log(LOG_INFO + "Ties layer moving out the main view, now is hide");//LOG
	}
}

//主图层右移完成之后的回调，将MAIN_LAYER_MOVE_FLAG设置为1
function mainLayerRightOver(){
	MAIN_LAYER_MOVE_FLAG = 1;
	console.log(LOG_INFO + "MAIN_LAYER_MOVE_FLAG = " + MAIN_LAYER_MOVE_FLAG + " & Main layer is moved to the right");//LOG
}

//主图层左移完成之后的回调，将MAIN_LAYER_MOVE_FLAG设置为2
function mainLayerLeftOver(){
	MAIN_LAYER_MOVE_FLAG = 2;
	console.log(LOG_INFO + "MAIN_LAYER_MOVE_FLAG = " + MAIN_LAYER_MOVE_FLAG + " & Main layer is moved to the left");//LOG
}

//主图层归位时的回调，将MAIN_LAYER_MOVE_FLAG还原为0
function mainLayerRestore(){
	MAIN_LAYER_MOVE_FLAG = 0;
	console.log(LOG_INFO + "MAIN_LAYER_MOVE_FLAG = " + MAIN_LAYER_MOVE_FLAG + " & Main layer is restore");//LOG
}

//详情页图层显示时的回调，将DETAIL_LAYER_MOVE_FLAG变为1，表示详情页正在显示
function detailLayerDisplay(){
	DETAIL_LAYER_MOVE_FLAG = 1;
	console.log(LOG_INFO + "DETAIL_LAYER_MOVE_FLAG = " + DETAIL_LAYER_MOVE_FLAG + " & Detail layer is dispaly");//LOG

	//新闻详情页在主视图中显示的时候，将新闻列表页面隐藏
	setElementDisplay("main-layer", "none");
}

//详情页图层显示时的回调，将DETAIL_LAYER_MOVE_FLAG变为1，表示详情页已经隐藏
function detailLayerRestore(){
	DETAIL_LAYER_MOVE_FLAG = 0;
	console.log(LOG_INFO + "DETAIL_LAYER_MOVE_FLAG = " + DETAIL_LAYER_MOVE_FLAG + " & Detail layer is restore");//LOG

	setElementDisplay("main-layer-detail", "none");
}

//详情页图层显示时的回调，将DETAIL_LAYER_MOVE_FLAG变为1，表示详情页正在显示
function tiesLayerDisplay(){
	TIES_LAYER_MOVE_FLAG = 1;
	console.log(LOG_INFO + "TIES_LAYER_MOVE_FLAG = " + TIES_LAYER_MOVE_FLAG + " & Ties layer is dispaly");//LOG
}

//详情页图层显示时的回调，将DETAIL_LAYER_MOVE_FLAG变为1，表示详情页已经隐藏
function tiesLayerRestore(){
	TIES_LAYER_MOVE_FLAG = 0;
	console.log(LOG_INFO + "TIES_LAYER_MOVE_FLAG = " + TIES_LAYER_MOVE_FLAG + " & Ties layer is restore");//LOG

	setElementDisplay("main-layer-ties", "none");
}

//切换新闻类顶部栏目列表是否显示
function toggleColumnList(){
	//如果当前栏目列表没有展开，则展开，并将栏目条上的按钮置为按下的状态
	if(COLUMN_DISPLAY_FLAG == 0){
		$$("main-layer-action-bar-column-list").style.display = "block";
		this.className = "current";
		COLUMN_DISPLAY_FLAG = 1;
		console.log(LOG_INFO + "COLUMN_DISPLAY_FLAG = " + COLUMN_DISPLAY_FLAG + " & Column list is dispaly");//LOG
	}else{
		$$("main-layer-action-bar-column-list").style.display = "none";
		this.className = "";
		COLUMN_DISPLAY_FLAG = 0;
		console.log(LOG_INFO + "COLUMN_DISPLAY_FLAG = " + COLUMN_DISPLAY_FLAG + " & Column list is hide");//LOG
	}
}

//选择栏目
function chooseColumn(){
	//切换顶部栏目名
	$$("main-layer-action-bar-column").getElementsByTagName("a")[0].innerHTML = this.innerHTML + "&nbsp;&nbsp;&nbsp;";
	console.log(LOG_INFO + "The now column is " + this.innerHTML);//LOG
	//收起栏目列表
	toggleColumnList();
}

//点击编辑新闻栏目列表的操作函数
function toggleEditNewsColumnList(){
	var columnList = $$("main-layer-action-bar-column-list").getElementsByTagName("li");
	var i;
	if(COLUMN_EDIT_FLAG == 0){
		for(i = 0 ; i < columnList.length ; i++){
			//进入可编辑状态的时候，修改栏目名前后的可操作样式
			columnList[i].getElementsByTagName("a")[0].className = "column_del";
			columnList[i].getElementsByTagName("a")[1].className = "column_name";
			columnList[i].getElementsByTagName("a")[2].className = "column_drag";
			//进入可编辑状态的时候，栏目列表中的栏目名是不可以点击的
			columnList[i].getElementsByTagName("a")[1].onclick = "";
		}
		//隐藏栏目编辑按钮入口，展示完成编辑按钮
		$$("main-layer-news-column-ok").style.display = "block";
		$$("main-layer-news-column-do").style.display = "none";
		COLUMN_EDIT_FLAG = 1;
		console.log(LOG_INFO + "COLUMN_EDIT_FLAG = " + COLUMN_EDIT_FLAG + " & Columns now can edit");//LOG
	}else{
		for(i = 0 ; i < columnList.length ; i++){
			//进入可编辑状态的时候，修改栏目名前后的可操作样式
			columnList[i].getElementsByTagName("a")[0].className = "column_dis";
			columnList[i].getElementsByTagName("a")[1].className = "column_name_all";
			columnList[i].getElementsByTagName("a")[2].className = "column_dis";
			//进入可编辑状态的时候，栏目列表中的栏目名重新换回可以点击的
			columnList[i].getElementsByTagName("a")[1].onclick = chooseColumn;
		}
		//隐藏完成编辑按钮，展示编辑按钮入口
		$$("main-layer-news-column-ok").style.display = "none";
		$$("main-layer-news-column-do").style.display = "block";
		COLUMN_EDIT_FLAG = 0;
		console.log(LOG_INFO + "COLUMN_EDIT_FLAG = " + COLUMN_EDIT_FLAG + " & Columns now edit finished");//LOG
	}
}

//切换栏目列表中删除按钮的动作
function toggleDeleteColumn(){
	//先将按钮变为删除警告
	if(this.className == "column_del"){
		this.className = "column_del_check";
	}else if(this.className == "column_del_check"){
		//删除该节点
		this.parentNode.outerHTML = "";
	}
}


/**
 * @funtion 通过XHR请求新闻列表
 *
 * @parameter newsType:请求的新闻列表的类型（headline：头条新闻；list：普通新闻）
 * @parameter columnId:新闻栏目的ID
 * @parameter startId:新闻列表的起始ID
 * @parameter endId：新闻列表的终止ID
 * @parameter callback:异步请求完之后的回调函数
 * */
function getNewsList(newsType, columuId, startId, endId, callback){
	var request = getHTTPObject();
	var requestResult = "";
	var requestUrl = document.location.href + "cdr.php?type=" + newsType + "&column=" + columuId + "&start=" + startId + "&end=" + endId;
	if(request){
		//异步处理
		request.open("GET", requestUrl, false);
		request.onreadystatechange = function(){
			if(request.readyState == 4){
				//请求成功之后要做的操作
				requestResult = request.responseText;
				//console.log(requestResult);
				//转化为标准JSON对象
				requestResult = JSON.parse(requestResult);
				//执行异步处理回调函数
				callback(requestResult, columuId);
				//返回请求成功
				return true;
			}
		};
		request.send(null);
	}else{
		alert("浏览器不支持XMLHttpRequest");
	}
	//console.log(requestResult);
	return requestResult;
}


/**
 * @funtion 通过XHR请求单条新闻内容
 *
 * @parameter
 * */
function getNews(){

}


/**
 * @function 显示新闻页面
 *
 * */
function displayNews(docId){
	//先显示出详细页面Layer
	toggleDetailLayerDisplay();
}

//触摸事件先不做了
/*
 function handleTouchEvent(event){
 //only for one touch
 //定义共用DOM对象
 var output = $$("output");
 if (event.touches.length == 1){
 switch(event.type){
 case "touchstart":
 output.innerHTML += "Touch started (" + event.touches[0].clientX + "," + event.touches[0].clientY + ")";
 break;
 case "touchend":
 output.innerHTML += "<br>Touch ended (" + event.changedTouches[0].clientX + "," + event.changedTouches[0].clientY + ")";
 break;
 case "touchmove":
 event.preventDefault();  //prevent scrolling
 output.innerHTML += "<br>Touch moved (" + event.changedTouches[0].clientX + "," + event.changedTouches[0].clientY + ")";
 break;
 }
 }
 }
 */

function showAppCache(){
	var myCache = new appCache();
	//定义共用DOM对象
	var output = $$("output");
	var act = myCache.cacheStatus;
	output.innerHTML += act;
	alert(act);
}