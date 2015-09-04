
var Util = {

  addLayer : function (name, type, parent) {

    var layer = parent.addLayerOfType(type);

    if (name)
      layer.setName(name);

    return layer;
  },

  addShape : function (name, parent) {

    var layer = this.addLayer(name, 'rectangle', parent);

    if (this.isShape(layer))
      return layer;

    return this.shapeWithPath(layer);
  },

  addGroup : function (name, parent) {

    return this.addLayer(name, 'group', parent);
  },

  addText : function (name, parent) {

    return this.addLayer(name, 'text', parent);
  },

  removeLayer : function (group, layer) {

    if (group) group.removeLayer(layer);
  },

  moveLayer : function (layer, newGroup) {

    var oldGroup = layer.parentGroup();

    layer.setIsSelected(false);

    if (this.isGroup(newGroup)) {

      newGroup.addLayers ([layer]);
      this.removeLayer(oldGroup, layer);
    }
  },

  getFrame : function (layer) {
    var frame = layer.frame();

    return {
      x: Math.round(frame.x()),
      y: Math.round(frame.y()),
      width: Math.round(frame.width()),
      height: Math.round(frame.height())
    };
  },

  getRect : function (layer) {
    var rect = layer.absoluteRect();
    return {
      x: Math.round(rect.x()),
      y: Math.round(rect.y()),
      width: Math.round(rect.width()),
      height: Math.round(rect.height())
    };
  },

  setSize : function (layer, opt) {
    //layer, width, height, absolute
    this.debug(opt.layer);

    if(opt.absolute){
      layer.absoluteRect().setWidth(opt.width);
      layer.absoluteRect().setHeight(opt.height);
    }
    else{
      layer.frame().setWidth(opt.width);
      layer.frame().setHeight(opt.height);
    }

    return layer;
  },

  setPosition : function (layer, opt) {

    if (opt.type == "topleft") {
      if(opt.absolute){
        layer.absoluteRect().setX(opt.x);
        layer.absoluteRect().setY(opt.y);
      }
      else{
        layer.frame().setX(opt.x);
        layer.frame().setY(opt.y);
      }
    } else if (opt.type == "middle") {
      if(opt.absolute){
        layer.absoluteRect().setMidX(opt.x);
        layer.absoluteRect().setMidY(opt.y);
      }
      else{
        layer.frame().setMidX(opt.x);
        layer.frame().setMidY(opt.y);
      }
    }

    return layer;
  },

  setFontStyle :function (label, opt) {

    var opt 	= opt || {},
      name 	= (opt.name) ? opt.name : this.options.fontName,
      size 	= (opt.size) ? opt.size : this.options.fontSize,
      color 	= (opt.color) ? MSColor.colorWithSVGString(opt.color] :  MSColor.colorWithSVGString(this.options.fontColor],
    align 	= (opt.align) ? (opt.align) : this.options.align;

    var originalFrame = label.frame();

    label.setFontPostscriptName (name);
    label.setFontSize (size);
    label.setTextColor (color);
    label.setTextAlignment(align); // center
  },

  setBorder : function (layer, opt) {
    if (this.isShape(layer)) {
      var border 			= layer.style().borders().addNewStylePart();
      border.color 		= MSColor.colorWithSVGString(opt.color);
      border.thickness 	= opt.thickness;
    }
  },

  setShapeColor : function (layer, hex, alpha) {
    //layer, hex, alpha

    if(this.isShape(layer)) {

      var	color = MSColor.alloc().init(),
        rgb = this.hexToRgb(hex),
        red = rgb.r / 255,
        green = rgb.g / 255,
        blue = rgb.b / 255;

      var alpha = alpha || 1;
      //alphe = (alpha && !isNaN(alpha) && (alpha <= 1 || alpha >= 0)) ? alpha : 1;

      color.setRed(red);
      color.setGreen(green);
      color.setBlue(blue);
      color.setAlpha(alpha);

      var fills = layer.style().fills();
      if (fills.count() <= 0) {
        fills.addNewStylePart();
      }

      layer.style().fill().setFillType(0);
      layer.style().fill().setColor(color);
    }
  },

  setGradient : function (layer, opt) {

    if (this.isShape(layer)) {
      var fills = layer.style().fills();

      if (fills.count() <= 0) {
        fills.addNewStylePart();
      }

      layer.style().fill().setFillType(1);
      var gradient 	= layer.style().fill().gradient(),
        startColor 	= opt.startColor,
        endColor 	= opt.endColor;

      [gradient setColor:[MSColor colorWithSVGString:startColor] atIndex:0];
      [gradient setColor:[MSColor colorWithSVGString:endColor] atIndex:1];
    }
  },

  didSelect : function (selection, text) {

    if (selection.count() > 0) {

      return true;

    } else {

      this.showToast (text);
    }
  },

  is : function (layer, theClass) {

    var klass = layer.class();

    return klass === theClass;
  },

  isPage : function (layer) {

    return this.is(layer, MSPage);
  },

  isGroup : function (layer) {

    return this.is(layer, MSLayerGroup);
  },

  isText : function (layer) {

    return this.is(layer, MSTextLayer);
  },

  isShape : function (layer){

    return this.is(layer, MSShapeGroup);
  },

  shapeWithPath : function (shape) {

    return MSShapeGroup.shapeWithPath(shape);
  },

  hexToRgb : function (hex) {

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  },

  showToast : function (message) {
    this.runCommand(['-c', 'afplay /System/Library/Sounds/Basso.aiff']);
    [doc showMessage: message];
  },

  runCommand: function(cmd, path){

    var task = [[NSTask alloc] init];

    task.setLaunchPath("/bin/bash");
    task.setArguments(cmd);
    task.launch();
  },

  debug : function(msg){

    log(msg);
  },

  dump : function (obj) {
    this.debugLog("#####################################################################################");
    this.debugLog("## Dumping object " + obj );
    this.debugLog("## obj class is: " + [obj className]);
    this.debugLog("#####################################################################################");

    this.debugLog("############################# obj.properties:");
    this.debugLog([obj class].mocha().properties());
    this.debugLog("############################# obj.propertiesWithAncestors:");
    this.debugLog([obj class].mocha().propertiesWithAncestors());

    this.debugLog("############################# obj.classMethods:");
    this.debugLog([obj class].mocha().classMethods());
    this.debugLog("############################# obj.classMethodsWithAncestors:");
    this.debugLog([obj class].mocha().classMethodsWithAncestors());

    this.debugLog("############################# obj.instanceMethods:");
    this.debugLog([obj class].mocha().instanceMethods());
    this.debugLog("############################# obj.instanceMethodsWithAncestors:");
    this.debugLog([obj class].mocha().instanceMethodsWithAncestors());

    this.debugLog("############################# obj.protocols:");
    this.debugLog([obj class].mocha().protocols())
    this.debugLog("############################# obj.protocolsWithAncestors:");
    this.debugLog([obj class].mocha().protocolsWithAncestors());

    this.debugLog("############################# obj.treeAsDictionary():");
    this.debugLog(obj.treeAsDictionary());
  }
}