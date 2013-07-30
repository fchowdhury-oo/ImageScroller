ImageScroller
=============

#Requirements
* ToolkitJS: provide in this repo
* ImageScroller: provide in this repo

#Usage  

1.Create an instance of this class then call the build method and supply the URL to the image as a parameter.  
```
var imageScroller = new ImageScroller();
imageScroller.build("resource/image/standard-tube-map.gif");
```

2.Set the width and height of the holder.The ImageScroller is made up of two parts, the holding div and the image within it. You need to set the holding divs height and width.  

```
imageScroller.height(500);
imageScroller.width(500);
```

3. Add the holder to the DOM.  
```
document.body.appendChild(imageScroller.display());
```

#Options

1. Centering the Image
You can center and image be calling the following method.  
```
imageScroller.center();
```

2. Zoom In
You can execute the zoom-in method as follows:  
```
imageScroller.zoomIn()
```

3. Zoom Out
You can execute the zoom-out method as follows:  
```
imageScroller.zoomOut()
```
