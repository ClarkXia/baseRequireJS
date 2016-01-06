define(['wx','jsonp'],function(wx,jsonp){
	jsonp('http://common.zj.sina.com.cn/weixin/get_sign.php',{location_url:encodeURIComponent(location.href.split('#')[0])},function(json){
		if (json.error == 0){
			var data = json.data;
			wx.config({
				appId: data.appId,
				timestamp: data.timestamp,
				nonceStr: data.nonceStr,
				signature: data.signature,
				//debug: true,
				jsApiList: [
					'checkJsApi',
					'onMenuShareTimeline',
					'onMenuShareAppMessage',
					'startRecord',
				    'stopRecord',
				    'onVoiceRecordEnd',
				    'playVoice',
				    'onVoicePlayEnd',
				    'pauseVoice',
				    'stopVoice',
				    'uploadVoice',
				    'downloadVoice'
				]
			});
		}else{
			console.log(json.errmsg);
		}
	})
	var exports = {};
	exports.setWxShare = function(data){
		var title = data.title || '',
			desc = data.desc || '',
			link = data.link || '',
			imgUrl = data.imgUrl || '',
			trigger = data.trigger || function(res){console.log('share')},
			success = data.success || function(res){console.log('success')},
			cancel = data.cancel || function(res){console.log('cancel')};
			
		wx.ready(function () {
			wx.onMenuShareAppMessage({
				title: title,
				desc: desc,
				link: link,
				imgUrl: imgUrl,
				trigger: trigger,
				success: success,
				cancel: cancel,
				fail: function (res) {
					alert(JSON.stringify(res));
				}
			});
			wx.onMenuShareTimeline({
				title: title,
				link: link,
				imgUrl: imgUrl,
				trigger: trigger,
				success: success,
				cancel: cancel,
				fail: function (res) {
					alert(JSON.stringify(res));
				}
			});
		})
	}
	var voice = {
	    localId: '',
	    serverId: ''
	};
	//假如页面一打开就要使用接口请先确保wx.ready
	exports.voiceEnd = function (cb){
		// 4.4 监听录音自动停止
		wx.onVoiceRecordEnd({
			complete: function (res) {
				voice.localId = res.localId;
				if (typeof cb == "function"){
					cb(res);
				}else{
					alert('录音时间已超过一分钟');
				}
			}
		});
	}
	exports.playEnd = function(cb){
		// 4.8 监听录音播放停止
		wx.onVoicePlayEnd({
			complete: function (res) {
				if (typeof cb == "function"){
					cb(res);
				}else{
					alert('录音（' + res.localId + '）播放结束');
				}	
			}
		});
	}
	
	exports.startRecord = function(cb){
		wx.startRecord({
			cancel: function () {},
			success: function(){
				typeof cb == "function" && cb();
			},
			fail: function (res) {
				//alert(JSON.stringify(res));
				alert("录音启动失败，您还可以选择文字问候");
			}
	    });
	}
	// 4.3 停止录音
	exports.stopRecord = function (cb) {
		wx.stopRecord({
			success: function (res) {
				voice.localId = res.localId;
				typeof cb == "function" && cb(true);
			},
			fail: function (res) {
				//alert(JSON.stringify(res));
				typeof cb == "function" && cb(false);
			}
		});
	};

  

	// 4.5 播放音频
	exports.playVoice = function (cb) {
		if (voice.localId == '') {
			alert('请先使用 startRecord 接口录制一段声音');
			return;
		}
		typeof cb == "function" && cb();
		wx.playVoice({
			localId: voice.localId
		});
	};

  // 4.6 暂停播放音频
	exports.pauseVoice = function () {
		wx.pauseVoice({
			localId: voice.localId
		});
	};

  // 4.7 停止播放音频
	exports.stopVoice = function () {
		wx.stopVoice({
			localId: voice.localId
		});
	};

  

	// 4.8 上传语音
	exports.uploadVoice = function (cb) {
		if (voice.localId == '') {
			alert('请先使用 startRecord 接口录制一段声音');
			return;
		}
		wx.uploadVoice({
			localId: voice.localId,
			success: function (res) {
				//alert('上传语音成功，serverId 为' + res.serverId);
				voice.serverId = res.serverId;
				typeof cb == "function" && cb(voice.serverId);
			},
			fail: function(res){
				alert("语音上传失败");
				typeof cb == "function" && cb(false);
			}
		});
	};

	// 4.9 下载语音
	exports.downloadVoice = function (serverId,cb) {
		/*if (voice.serverId == '') {
			alert('请先使用 uploadVoice 上传声音');
			return;
		}*/
		wx.ready(function () {
			wx.downloadVoice({
				serverId: serverId,
				success: function (res) {
					//alert('下载语音成功，localId 为' + res.localId);
					voice.localId = res.localId;
					typeof cb == "function" && cb(true);
				},
				fail : function(res){
					alert("音频文件已失效");
					typeof cb == "function" && cb(false);
				}
			});
		})
	};
	exports.getVoice = function(){
		return voice;
	};
	return exports;
})