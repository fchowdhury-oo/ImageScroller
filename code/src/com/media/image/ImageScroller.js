var ImageScroller = function() {
};

(function() {
	var _ = ImageScroller.prototype;

	_.img = null;
	_.holder = null;
	_.scale = 1;
	_.maxImageWidth = 0;
	_.maxImageHeight = 0;
	_.createHandler = [];
	_.startX = 0;
	_.startY = 0;
	_.scaleInterval = 0.1;
	_.toFitScale = 1;
	_.mousewheelevt = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel"//FF doesn't recognize mousewheel as of FF3.x

	_.build = function(imgSrc) {
		this.holder = document.createElement("div");

		var root = this;

		this.img = new Image();
		this.img.src = imgSrc;
		this.img.onload = function() {
			root.onImageLoad()
		};
		this.img.ondragstart = function(event) {
			if (event && event.preventDefault)
				event.preventDefault();
			return false;
		};
		this.holder.appendChild(this.img);
		this.setStyle();

		this.setListeners();
	}
	_.onImageLoad = function() {
		this.img.onload = null;

		this.maxImageWidth = this.img.clientWidth;
		this.maxImageHeight = this.img.clientHeight;

		this.scaleToFit();
	}
	_.scaleToFit = function() {
		var xRatio = this.holder.clientWidth / this.maxImageWidth;
		var yRatio = this.holder.clientHeight / this.maxImageHeight;
		this.toFitScale = xRatio < yRatio ? xRatio : yRatio;

		this.scale = this.toFitScale;
		this.zoom();

		this.center();
	}
	_.setListeners = function() {
		if (!this.hasTouch()) {
			Utensil.addListener(this.holder, "mousedown", this.createHandler("onMouseDown"));
			Utensil.addListener(this.holder, "dblclick", this.createHandler("onDoubleClick"));
			Utensil.addListener(this.holder, this.mousewheelevt, this.createHandler("onMouseWheel"));
		} else {
			this.holder.addEventListener("touchstart", this.createHandler("onMouseDown"), false);
			this.holder.addEventListener('gestureend',this.createHandler("onPinch") , false);
		}

	}
	_.createHandler = function(eventName) {
		var root = this;
		if (!this.createHandler[eventName]) {
			this.createHandler[eventName] = function(event) {
				root[eventName](event);
			}
		}
		return this.createHandler[eventName];
	}
	_.setStyle = function() {
		this.holder.style.overflow = "hidden";
		this.holder.style.position = "relative";
		this.holder.style.cursor = "move";
		this.img.style.position = "absolute";
	}
	_.onPinch=function(event)
	{
		 if (event.scale < 1.0) {
        this.zoomOut();
    } else if (event.scale > 1.0) {
       this.zoomIn();
    }

	}
	_.onMouseDown = function(event) {
		
		if (this.scale <= this.toFitScale)
			return;
		this.startX = this.hasTouch()?event.touches[0].pageX:Utensil.mouseX(this.holder, event);
		this.startY = this.hasTouch()?event.touches[0].pageY:Utensil.mouseY(this.holder, event);

		if (!this.hasTouch()) {
			Utensil.addListener(this.holder, "mouseup", this.createHandler("onMouseUp"));
			Utensil.addListener(this.holder, "mousemove", this.createHandler("onMouseMove"));
		} else {
			this.holder.addEventListener("touchend", this.createHandler("onMouseUp"), false);
			this.holder.addEventListener("touchmove", this.createHandler("onMouseMove"), false);
		}
	}
	_.onMouseUp = function(event) {
		
		if (!this.hasTouch()) {
			Utensil.removeListener(this.holder, "mouseup", this.createHandler("onMouseUp"));
			Utensil.removeListener(this.holder, "mousemove", this.createHandler("onMouseMove"));
		} else {
			this.holder.removeEventListener("touchend", this.createHandler("onMouseUp"), false);
			this.holder.removeEventListener("touchmove", this.createHandler("onMouseMove"), false);
		}
	}
	_.onMouseMove = function(event) {
		
		var x = this.hasTouch()?event.touches[0].pageX:Utensil.mouseX(this.holder, event);
		var y = this.hasTouch()?event.touches[0].pageY:Utensil.mouseY(this.holder, event);
		var xDiff = x - this.startX;
		var yDiff = y - this.startY;
		var newX = Number(this.imgX()) + Number(xDiff);
		var newY = Number(this.imgY()) + Number(yDiff);

		if (newY > 0)
			newY = 0;
		if (newX <= -(this.img.clientWidth - this.holder.clientWidth))
			newX = -(this.img.clientWidth - this.holder.clientWidth);
		if (newY <= -(this.img.clientHeight - this.holder.clientHeight))
			newY = -(this.img.clientHeight - this.holder.clientHeight);
		if (newX > 0)
			newX = 0;
		this.imgX((newX));
		this.imgY((newY));

		this.startX = x;
		this.startY = y;

	}
	_.onMouseWheel = function(event) {
		var evt = window.event || event;
		var delta = evt.detail ? evt.detail * (-120) : evt.wheelDelta;
		switch(delta) {
			case 120:
				this.zoomIn();
				break;
			case -120:
				this.zoomOut();
				break;
		}
	}
	_.onDoubleClick = function(event) {

		this.zoomIn();

	}
	_.zoomIn = function() {
		this.scale += this.scaleInterval;
		this.zoom();
	}
	_.zoomOut = function() {
		this.scale -= this.scaleInterval;
		this.zoom();
	}
	_.zoom = function() {
		this.img.style.height = (this.maxImageHeight * this.scale) + "px";
		this.img.style.width = (this.maxImageWidth * this.scale) + "px";

		if (this.scale <= this.toFitScale)
			this.center();
	}
	_.imgX = function(value) {
		if (value != undefined)
			this.img.style.left = value + "px";

		return Number(this.img.style.left.replace("px", "" != "") ? this.img.style.left.replace("px", "") : 0);
	}
	_.imgY = function(value) {
		if (value != undefined)
			this.img.style.top = value + "px";
		return Number(this.img.style.top.replace("px", "") != "" ? this.img.style.top.replace("px", "") : 0);
	}
	_.height = function(value) {
		if (value != undefined)
			this.holder.style.height = value;
		return this.holder.clientHeight;
	}
	_.width = function(value) {
		if (value != undefined)
			this.holder.style.width = value;
		return this.holder.clientWidth;
	}
	_.display = function() {
		return this.holder;
	}
	_.className = function(value) {
		this.holder.className = value;
	}
	_.center = function() {
		var x = ((this.holder.clientWidth - this.img.clientWidth) * 0.5);
		var y = ((this.holder.clientHeight - this.img.clientHeight) * 0.5);
		this.imgX(x);
		this.imgY(y);
	}
	_.hasTouch = function() {
		
		return ('ontouchstart' in document.documentElement);
	}
})();
