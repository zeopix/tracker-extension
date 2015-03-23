var App = {
  main: function(){
    $popup = Views.box();
    var now = new Date();
    var $ticket = "ticket";
    if(typeof(localStorage[$ticket]) == "undefined"){
      Views.boxContent("No time tracked","normal");
      Views.button('Start','red',{ action: App.startTrack($ticket), binding: 'click' });
    }else{
      diff = this.getDifference($ticket)
      Views.boxContent(diff+"sec","green");
      Views.button('Stop','green',{ action: App.stopTrack($ticket), binding: 'click' });
    }
  },
  startTrack: function(ticket){
    //binding
    return function(){
      var now = new Date();
      localStorage[ticket] = now.getTime();
    }
  },
  stopTrack: function(ticket){
    //binding
    return function(){
      var now = new Date();
      if(typeof(localStorage[ticket])!=="undefined"){
        localStorage['saved_'+ticket] = App.getDifference(ticket);
        localStorage.removeItem(ticket);
        alert(localStorage['saved_'+ticket]+" tracked")
      }
    }
  },
  getDifference: function(ticket){
    var now = new Date();
    if(typeof(localStorage[ticket])!=="undefined"){
      var totalSeconds = Math.ceil((now.getTime()-localStorage[ticket])/1000)
      var d = Math.floor(totalSeconds/(3600*24));
      var h = Math.floor((totalSeconds%(3600*24))/3600)
      var m = Math.floor((totalSeconds%(3600))/60)
      var s = totalSeconds%(60)
      return (d>0?d+'d ':'')+(h>0?h+'h ':'')+(m>0?m+'m ':'')+(s>0?s+'s ':'');
    }
    return false;
  }
}

var Views = {
  box: function(){
    if($("#box").length>0){
      return $("#box");
    }
    $popup = $('<div id="box"></div>');
    $popup.appendTo("body")
    return $popup;
  },
  boxContent: function(caption,attrClass,action){
    return this.constructor({
      path: '#box h1.boxcontent',
      dom: '<h1 class="boxcontent '+attrClass+'">'+caption+'</h1>',
      caption: caption,
      action: action,
      parent: Views.box()
    })
  },
  button: function(caption,attrClass,action){
    return this.constructor({
      path: '#box a.button',
      dom: '<a class="button '+attrClass+'">'+caption+'</a>',
      caption: caption,
      action: action,
      parent: Views.box()
    })
  },
  constructor: function(config){
    element = $(config.path);
    if(element.length==0){
      element = $(config.dom);
      element.appendTo(config.parent);
    }
    if(!element.hasClass(config.attrClass)){
      element.addClass(config.attrClass);
    }
    element.html(config.caption)
    if(typeof(config.action)=='object'){
      element.on(config.action.binding,config.action.action)
    }
    return element;
  }
}
$(function(){
  App.main();
  setInterval(function(){
    App.main();
  },1000)
})
