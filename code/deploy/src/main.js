(function(window) {
	window.imageScroller=null;
	var header;
	var footer;
	function Main() {
		if (window.addEventListener) {
			window.addEventListener("load", onLoad);
		} else {
			window.attachEvent("onload", onLoad);
		}

	}

	function onLoad() {
		
		header = document.getElementById("header");
		footer = document.getElementById("footer");
		imageScroller = new ImageScroller();
		imageScroller.build("resource/image/standard-tube-map.gif");
		imageScroller.className("holder");
		document.getElementById("map").appendChild(imageScroller.display());
		Utensil.addListener(window,"resize",onResize);
		
		
		onResize();
	}

	 function onResize() {
		if(imageScroller)
		{
			
			imageScroller.height((Utensil.stageHeight()-(header.clientHeight+footer.clientHeight))+"px");
			document.getElementById("map").style.height =(Utensil.stageHeight()-(header.clientHeight+footer.clientHeight))+"px";
			imageScroller.width(Utensil.stageWidth()+"px");
			imageScroller.center();
		}
	}

	Main();
}
)(window);
