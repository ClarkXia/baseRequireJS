/**
 * @params {ctx} ��������
 * @params {spriteSheet} ����SpriteSheet�����֡��������
 * @params {frameOrAnimation} ��ʼ���еĶ���Ƭ�Σ�������SpriteSheet��_animations�б���
 *
 **/
define(function(){

function Sprite(ctx, spriteSheet, frameOrAnimation) {
	if (ctx == null){return;}
	this.ctx = ctx;
	
	/**
	 * public
	 **/
	//current frame index 
	this.currentFrame = 0;
	//current animation
	this.currentAnimation = null;
	//pause flag
	this.paused = true;
	//SpriteSheet data
	this.spriteSheet = spriteSheet;
	//current frame index������canvas��Ⱦ�����¼��֡�� ���ܷ�����
	this.currentAnimationFrame = 0;
	//ÿ��֡��
	this.framerate = 0;
	
	/**
	 * private
	 **/
	this._animation = null;
	this._currentFrame = null;
	
	/**
	 * ָ�����Ŷ���������������gotoAndPlay���������������
	 **/
	if (frameOrAnimation) { this.gotoAndPlay(frameOrAnimation); }
}
var p = Sprite.prototype;
/**
 * ���Ƶ�ǰ֡
 **/
p.draw = function() {
	var o = this.spriteSheet.getFrame(this._currentFrame|0);
	if (!o) { return false; }
	var rect = o.rect;
	if (rect.width && rect.height) { 
		this.ctx.clearRect(rect.x, rect.y, rect.width, rect.height);
		this.ctx.drawImage(o.image, rect.x, rect.y, rect.width, rect.height, -o.regX, -o.regY, rect.width, rect.height); 
	}
	return true;
};
/**
 * ���ű�ֹͣ�Ķ���
 **/
p.play = function() {
	this.paused = false;
};
/**
 * ֹͣ����
 **/
p.stop = function() {
	this.paused = true;
};
/**
 * ����ĳһ�ζ���
 * @params {frameOrAnimation}
 **/
p.gotoAndPlay = function(frameOrAnimation) {
	this.paused = false;
	this._goto(frameOrAnimation);
};
/**
 * ��ʼ����ĳһ�ζ����ĵ�һ֡
 * @params {frameOrAnimation}
 **/
p.gotoAndStop = function(frameOrAnimation) {
	this.paused = true;
	this._goto(frameOrAnimation);
};
/**
 * ѭ��������ִ�ж�������
 * @params {time} ���Ƶ�ʱ����
 **/
p.advance = function(time) {
	//ͬʱ����spriteSheet����ͼƬ�Ƿ�ȫ�� �������
	if (!this.paused && this.spriteSheet.complete == true) {
		var fps = this.framerate || this.spriteSheet.framerate;
		var t = (fps && time != null) ? time/(1000/fps) : 1;
		this._normalizeFrame(t);
		this.draw();
	}
};
/**
 * �жϵ�ǰ����֡�ı仯
 * @params {frameDelta} ���ݻ���ʱ�估ÿ��ָ��֡���ó�����֡��
 **/
p._normalizeFrame = function(frameDelta) {
	frameDelta = frameDelta || 0;
	var animation = this._animation;
	var paused = this.paused;
	var frame = this._currentFrame;
	var l;
	if (animation) {
		var speed = animation.speed || 1;
		var animFrame = this.currentAnimationFrame;
		l = animation.frames.length;
		if (animFrame + frameDelta * speed >= l) {
			var next = animation.next;
			if (next) {
				// ������һ�ζ���
				return this._goto(next, frameDelta - (l - animFrame) / speed);
			} else {
				// end.
				this.paused = true;
				animFrame = animation.frames.length - 1;
			}
		} else {
			animFrame += frameDelta * speed;
		}
		this.currentAnimationFrame = animFrame;
		this._currentFrame = animation.frames[animFrame | 0]
	} else {
		frame = (this._currentFrame += frameDelta);
		l = this.spriteSheet.getNumFrames();
		if (frame >= l && l > 0) {
			// looped.
			if ((this._currentFrame -= l) >= l) { return this._normalizeFrame(); }
			
		}
	}
	frame = this._currentFrame | 0;
	if (this.currentFrame != frame) {
		this.currentFrame = frame;
	}
};
/**
 * ����ĳһ�ζ���
 * @params {frameOrAnimation} ���Ŷ�������
 * @params {frame} ���ſ�ʼ֡
 **/
p._goto = function(frameOrAnimation, frame) {
	this.currentAnimationFrame = 0;
	if (isNaN(frameOrAnimation)) {
		var data = this.spriteSheet.getAnimation(frameOrAnimation);
		if (data) {
			this._animation = data;
			this.currentAnimation = frameOrAnimation;
			this._normalizeFrame(frame);
		}
	} else {
		this.currentAnimation = this._animation = null;
		this._currentFrame = frameOrAnimation;
		this._normalizeFrame();
	}
};

return Sprite;
});