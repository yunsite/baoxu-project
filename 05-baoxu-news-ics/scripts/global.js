/**
 * Author: Baoxu
 * Date:   12-7-2
 * Time:   下午1:56
 */

//添加页面加载后事件
function addLoadEvent(func){
	var oldOnloadEvent = window.onload;
	if(typeof oldOnloadEvent != "function"){
		window.onload = func;
	}else{
		window.onload = function(){
			oldOnloadEvent();
			func();
		}
	}
}

//在某元素之后插入
function insertAfter(newElement, targetElement){
	var theParentNode = targetElement.parentNode;
	if(theParentNode.lastChild == targetElement){
		theParentNode.appendChild(newElement);
	}else{
		theParentNode.insertBefore(newElement, targetElement.nextSibling);
	}
}

//为某元素添加class
function addClass(targetElement, className){
	if(!targetElement.className){
		targetElement.className = className;
	}else{
		var newClassName = targetElement.className;
		newClassName += " ";
		newClassName += className;
		targetElement.className = newClassName;
	}
}


//获取某对象元素在目标数组中的位置索引，如果有，返回索引，没有则返回-1
function getObjectIndex(targetArray, checkObject){
	for(var i = 0 ; i < targetArray.length ; i++){
		if(targetArray[i] == checkObject){
			return i;
		}
	}
	return -1;
}


//通用函数，根据不同的浏览器获取XmlHttpRequest对象
function getHTTPObject(){
	if(typeof XMLHttpRequest == "undefined"){
		XMLHttpRequest = function(){
			try{
				return new ActiveXObject("Msxml2.XMLHTTP.6.0");
			}catch(e){
			}
			try{
				return new ActiveXObject("Msxml2.XMLHTTP.3.0");
			}catch(e){
			}
			try{
				return new ActiveXObject("Msxml2.XMLHTTP");
			}catch(e){
			}
			return false;
		}
	}
	return new XMLHttpRequest();
}


//获得浏览器信息
function getClientInfo(){
	var client_info = new Array();
	client_info["width"] = document.body.clientWidth;
	client_info["height"] = document.body.clientHeight;
	return client_info;
}

//鼠标滚轮事件的定义
function wheelEvent(obj, handle){
	this.handle = handle;
	//兼容火狐和IE
	window.addEventListener ? obj.addEventListener("DOMMouseScroll", this.wheel, false) : (obj.onmousewheel = this.wheel);
}
wheelEvent.prototype.wheel = function(event){
	var ev = event || window.event;
	var delta = ev.wheelDelta ? (ev.wheelDelta / 120) : (-ev.detail / 3); // Firefox using `wheelDelta` IE using `detail`
	eval('delta ? ' + parent.wheelEventHandle + '(delta) : null;');
}


/**
 * 此方法用于移动元素到指定坐标，自定义单步移动距离百分比和单步移动时间
 *
 * @parameter elementID：需要移动的块的ID
 * @parameter targetX：移动到的目标X轴坐标
 * @parameter stepDis：每一次timeOut的移动距离百分比，用小数表示
 * @parameter stepTime：每一次timeOut的时间
 * @parameter key:用于标识关联影响的元素是应该变宽还是变窄，取值为-1，0，1
 *
 * @return true:表示移动完成
 * */
function moveElementTo(elementID, targetX, stepDis, stepTime , key){
	var elementToMove = document.getElementById(elementID);
	var elementX = parseInt(elementToMove.style.marginLeft);
	var dist;

	//如果上一次的点击的移位还没有完成，先清除循环
	if(elementToMove.movement){
		clearTimeout(elementToMove.movement);
	}

	//移位完成，返回true
	if(elementX == targetX){
		return true;
	}

	if(elementX > targetX){
		dist = Math.ceil((elementX - targetX) * stepDis);
		elementX -= dist;
	}

	if(elementX < targetX){
		dist = Math.ceil((targetX - elementX) * stepDis);
		elementX += dist;
	}
	//设定单次移动之后的marginLeft值
	elementToMove.style.marginLeft = elementX + "px";

	elementToMove.style.width = key*dist + parseInt(elementToMove.style.width) + "px";

	//循环单次移动，形成动画效果
	var repeat = "moveElementTo('" + elementID  + "'," + targetX + "," + stepDis + "," + stepTime + "," + key+ ")";
	elementToMove.movement = setTimeout(repeat, stepTime);
}


function moveElementWith(elementID, stepX, stepDis, stepTime, key){
	var elementToMove = document.getElementById(elementID);
	//获取当前X轴坐标
	var elementX = parseInt(elementToMove.style.marginLeft);
	//alert(elementToMove.style.marginLeft);

	var targetX = elementX + stepX;

	//循环单次移动，形成动画效果
	var repeat = "moveElementTo('" + elementID + "'," + targetX + "," + stepDis + "," + stepTime + "," + key+ ")";
	elementToMove.movement = setTimeout(repeat, stepTime);
}