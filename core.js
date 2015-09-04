
@import 'lib/utils.js';
@import 'os.js';

function create(name, height){

  var doc = context.document;
  var page = doc.currentPage();
  var selection = context.selection;

  var artboard;
  var artboardRect;

  if(Util.didSelect(selection, 'You must select an Artboard')){

    artboard = selection[0];

    artboardRect = Util.getRect(artboard);

    log(artboardRect.width);


    if(Util.is(artboard, MSArtboardGroup)){

        createBars(640);
      }
  }


  function createBars(){

    var mainGroup = Util.addGroup('viewport-'+name, artboard);

    Util.setSize(mainGroup, {width: artboardRect.width, height: height + artboardRect.height * 2})

    var topBar = createBar('top-bar', {width: artboardRect.width, height: artboardRect.height}, {type:'topleft', x: 0, y: -artboardRect.height});
    var bottomBar = createBar('bottom-bar', {width: artboardRect.width, height: artboardRect.height}, {type:'topleft', x: 0, y: height});

    Util.moveLayer(topBar, mainGroup);
    Util.moveLayer(bottomBar, mainGroup);

    createOsBars(mainGroup);
  }

  function createOsBars(group){

    osBars.forEach(function(os){

      var osGroup = Util.addGroup(os.name, group);
      var osTop = createBar('os-top-bar', {width: artboardRect.width, height: os.top}, {type:'topleft', x: 0, y: 0}, 0.8);
      Util.moveLayer(osTop, osGroup);

      if(os.bottom){

        var osBottom = createBar('os-bottom-bar', {width: artboardRect.width, height: os.bottom}, {type:'topleft', x: 0, y: height - os.bottom}, 0.8);
        Util.moveLayer(osBottom, osGroup);
      }

      if(os.name === 'windows'){

        group.frame().setY(-os.top);

      }else{

        osGroup.setIsVisible(false);
      }
    })


  }


  function createBar(name, size, position, opacity){

    var bar = Util.addShape(name, artboard);

    opacity = opacity || 0.9;

    Util.setShapeColor(bar, '#000000', opacity);
    Util.setSize(bar, size);

    Util.setPosition(bar, position);

    return bar;
  }
}
