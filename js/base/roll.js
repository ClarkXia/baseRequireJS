define(['animation','baseTools'],function(animation,baseTools){
	function roll(container,item,step){
		this.speed = 2000;
		this.container = container;
		this.item = item;
		this.listContainer = item[0].parentNode;
		this.length = item.length;
		this.topOffset = 0;
		this.setRoll = this.setRoll.bind(this);
		this.init();
		this.step = step || 1;
	}

	var pt = roll.prototype;
	pt.init = function(){
		//get container height
		this.rollHeight = parseInt(baseTools.getStyle(this.container,'height'));
		//get list height
		var itemMargin = parseInt(baseTools.getStyle(this.item[0],'marginBottom')) + parseInt(baseTools.getStyle(this.item[0],'marginTop'));
		this.itemLength = parseInt(baseTools.getStyle(this.item[0],'height')) + itemMargin;
		this.listHeight = this.itemLength*this.length;

		if (this.rollHeight < this.listHeight){
			var cloneList = document.createElement("ul");
			cloneList.innerHTML = this.listContainer.innerHTML;
			this.container.appendChild(cloneList);
			var that = this;
			setInterval(that.setRoll,that.speed);
		}

		this.animate = new animation(this.listContainer,{},500);
	}
	pt.setRoll = function(){
		this.topOffset += this.itemLength*this.step;
		if(this.topOffset > this.listHeight){
			//this.animate.stop();
			this.topOffset = this.topOffset - this.listHeight - this.itemLength*this.step;
			baseTools.setStyle(this.listContainer,{marginTop:-this.topOffset});
			this.topOffset = this.topOffset + this.itemLength*this.step;
		}
		this.animate.setProps({marginTop:-this.topOffset});
		this.animate.start();
	}

	return roll;
})