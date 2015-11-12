/**
 * baseTools.js
 * �ṩԭ��JSѡ����֧��
 **/
define(function(){
var exports = {};
/**
 * getElementsByClass
 * ����������ȡDOM�ڵ�
 * @params {node}Ԫ�ؽ�� {classname}����
 * @return array DOM����
 **/
exports.getElementsByClass = function(node,classname){ 
	if (node.getElementsByClassName) {
		return node.getElementsByClassName(classname);  //�߼����������ֱ��֧��getElementsByClassName
	} else {
		return (function getElementsByClass(searchClass,node) {
			if ( node == null ) node = document;
			
			var classElements = [],
			els = node.getElementsByTagName("*"),
			elsLen = els.length,
			pattern = new RegExp("(^|\\s)"+searchClass+"(\\s|$)"), i, j;

			for (i = 0, j = 0; i < elsLen; i++) {
				if ( pattern.test(els[i].className) ) {
					classElements[j] = els[i];
					j++;
				}
			}
			return classElements;
		})(classname, node);
	}
}
/**
 * ������ز���
 * hasClass���ж��Ƿ���ڸ�������
 * addClass����������
 * removeClass��ɾ������
 * @params {obj} �ڵ�Ԫ�� {cls} ���в���������
 **/
exports.hasClass = function(obj, cls) { 
    return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));  
}  
exports.addClass = function(obj, cls) {
    if (!this.hasClass(obj, cls)) obj.className += " " + cls;  
}
exports.removeClass = function(obj, cls) {
    if (this.hasClass(obj, cls)) {
        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
        obj.className = obj.className.replace(reg, ' ');
    }
}
//��ȡcurrentStyle
exports.getcss = function(dom){
	return dom.currentStyle || document.defaultView.getComputedStyle(dom, null);
}
//ҳ��߶�
exports.getbodyCH = function(){
	var bh=document.body.clientHeight,
		eh=document.documentElement.clientHeight;
	return bh > eh ? bh : eh;
}
//��Ļ�߶�
exports.showbodyCH = function(){
	if(window.innerHeight){
		return window.innerHeight;
	}else if(document.documentElement && document.documentElement.clientHeight){
		return document.documentElement.clientHeight;
	}else if(document.body){
		return document.body.clientHeight;
	}
}
//��Ļ���
exports.getbodyCW = function(){
	var bw=document.body.clientWidth,
		ew=document.documentElement.clientWidth;
	return bw > ew ? bw : ew;
}
//�������߶�
exports.scrolltop = function(){
	if(window.pageYOffset){
		return window.pageYOffset;
	}else if(document.documentElement && document.documentElement.scrollTop){
		return document.documentElement.scrollTop;
	}else if(document.body){
		return document.body.scrollTop;
	}
}
/**
 * �¼��󶨲���event����
 * bind�����¼�
 * unbind�������
 * cancelBubble����ֹ�¼�ð��
 * stopDefault����ֹ�����Ĭ����Ϊ
 **/
exports.event = {
	bind : function(element, eventType, handler, capture) {
        if (typeof element == "string") {
            element = document.getElementById(element);
        }
        if (typeof capture != "Boolean") {
            capture = false;
        }

        if (element.addEventListener) {
            element.addEventListener(eventType, handler, capture);
        }
        else if (element.attachEvent) {
            if (capture) {
                element.setCapture();
            }
            element.attachEvent("on" + eventType, handler);
        }
        else {
            element["on" + eventType] = handler;
        }
    },
	unbind : function(element, eventType, handler, releaseCapture) {
        if (typeof element == "string") {
            element = document.getElementById(element);
        }

        if (typeof releaseCapture != "Boolean") {
            releaseCapture = false;
        }

        if (element.removeEventListener) {
            element.removeEventListener(eventType, handler, releaseCapture);
        }else if (element.detachEvent) {
            if (releaseCapture) {
                element.releaseCapture();
            }

            element.detachEvent("on" + eventType, handler);
        }else {
            element["on" + eventType] = null;
        }
    },
	cancelBubble : function(e) {  //ð�ݴ���
        e = e || window.event;

        if (e.stopPropagation) {
            e.stopPropagation();
        }else {
            e.cancelBubble = true; //IE
        }
    },
	stopDefault : function(e){
		//��ֹĬ�����������(W3C) 
		if ( e && e.preventDefault ) {
			e.preventDefault(); 
		}else{//IE����ֹ������Ĭ�϶����ķ�ʽ
			window.event.returnValue = false; 
		}
		return false; 
	}
}
return exports;
})