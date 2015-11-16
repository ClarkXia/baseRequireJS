/**
 * localStorage
 * 本地存储
 *
 *
 **/
define(function(){

var exports = {},
	supportLS = window.localStorage ? true : false,  //判断是否支持localStorage
	storage = supportLS ? window.localStorage : {};
	
function expireTime(expiredays, h, m, s){
	var exdate=new Date();
	exdate.setDate(exdate.getDate()+expiredays);
	//设置cookie失效时间为0点
	exdate.setHours(h || 0);
	exdate.setMinutes(m || 0);
	exdate.setSeconds(s || 0);
	
	return exdate
}
//cookie存储实现
function setCookie(name, value, expiredays, h, m, s){
	document.cookie=name+ "=" +escape(value)+((expiredays==null) ? "" : ";expires="+expireTime(expiredays, h, m, s).toUTCString())
}

function getCookie(name){
	if (document.cookie.length>0){
		c_start=document.cookie.indexOf(name + "=");
		if (c_start!=-1){
			c_start=c_start + name.length+1; 
			c_end=document.cookie.indexOf(";",c_start);
			if (c_end==-1) c_end=document.cookie.length;
			return unescape(document.cookie.substring(c_start,c_end));
		}
	}
	return "";
}

function delCookie(name){
	var exp = new Date();
	exp.setTime(exp.getTime() - 1);
	var cval=getCookie(name);
	if(cval!=null) document.cookie=name+"="+cval+";expires="+exp.toUTCString();
}

//localStorage实现
function setItem(name, value, expiredays, h, m, s){
	storage.setItem(name,value);
	var exdate = expireTime(expiredays, h, m, s)
	var time = exdate.getTime();
	storage.setItem('expire',time);
}

function getItem(name){
	var currentDate = new Date(),expire = storage.getItem('expire');
	if (currentDate.getTime() > expire){  //内容过期
		return ""
	}else{
		var value = storage.getItem(name);
		if (value == null){
			return "";
		}else{
			return value;
		}
	}
}

function delItem(name){
	storage.removeItem(name);
}

exports.get = function(name){
	if (supportLS){
		return getItem(name);
	}else{
		return getCookie(name);
	}
}
exports.set = function(name, value, expiredays, h, m, s){
	if (supportLS){
		setItem(name, value, expiredays, h, m, s);
	}else{
		setCookie(name, value, expiredays, h, m, s)
	}
}
exports.del = function(name){
	if (supportLS){
		delItem(name);
	}else{
		delCookie(name);
	}
}

return exports;
})