define(['sinaSSOController','jsonp'],function(sinaSSOController,jsonp){
	var exports = {},
		apiRootCokkieAuth = 'http://mblogv2.city.sina.com.cn/interface/tcommonv2/cookie_auth/',
		apiRootNoAuth = 'http://mblogv2.city.sina.com.cn/interface/tcommonv2/no_auth/',
		appId = 151,
		siteId = 908,
		token = '',
		currentUserInfo = null;
	//������Ϣ
	function showMessage(message){
		alert(message);  //��ʱʹ��Ĭ�ϵ���
	}
	//��ȡtoken
	function getToken(callback) {
		var url = apiRootCokkieAuth + 'postaction/get_token.php';
		if (token == '') {
			//console.log('getToken', 'refresh token');
			jsonp(url,{
					site_id : siteId,
					app_id : appId,
					t : 'jsonp'
				},function(rsp) {
					token = rsp.token;
					if (typeof(callback) == 'function') {
						callback();
					}
				});
		} else {
			//console.log('getToken', 'use cache');
			if (typeof(callback) == 'function') {
				callback();
			}
		}
	}
	//����¼
	function checkLogin() {
		var userCookie = sinaSSOManager.getSinaCookie();
		if (!userCookie) {
			return false;
		} else {
			return true;
		}
	}
	//Ĭ�ϻص�
	function defaultCallback(data, fn) {
		if (typeof(fn) == 'function') {
			fn(data);
		}else{
			if (data.error === '0') {
				showMessage("����ɹ���");
			}else{
				showMessage(data.errmsg);
			}
		}
	}
	function postRequest(url,callback,data){
		if (!checkLogin()) {
			return;
		}
		getToken(function() {
			data = data || {};
			data.token = token;
			data.site_id = siteId;
			data.app_id = appId;
			jsonp(url,data,function(rsp) {
				defaultCallback(rsp, callback);
			});
		});
	}
	exports.checkLogin = checkLogin;
	exports.postWeibo = function(content, pid, callback) {
		if (content == '') {
			showMessage('����������');
			return;
		}
		var url = apiRootCokkieAuth + 'postaction/json_add_mblog.php';
		postRequest(url,callback,{
			content : content,
			pid : pid || ""
		});
	}
	//��ͼƬ���ӷ�΢��
	exports.postWeiboByPic = function(content, pic_url, callback) {
		if (content == '') {
			self.showMessage('����������');
			return;
		}
		var url = apiRootCokkieAuth + 'postaction/json_add_mblog.php';
		postRequest(url,callback,{
			content : content,
			pic_url : pic_url || ""
		});
	}
	//ת��΢��
	exports.repostWeibo = function(mid, content, isComment, callback) {
		if (content == '') {
			showMessage('����������');
			return;
		}
		var url = apiRootCokkieAuth + 'postaction/json_repost_mblog.php';
		postRequest(url,callback,{
			status : content,
			mid : mid,
			is_comment : isComment ? isComment : 0  //�Ƿ���ת����ͬʱ�������ۡ�0��ʾ���������ۣ�1��ʾ�������۸���ǰ΢����2��ʾ�������۸�ԭ΢����3��1��2������Ĭ��Ϊ0��
		});
	}
	return exports;
})
