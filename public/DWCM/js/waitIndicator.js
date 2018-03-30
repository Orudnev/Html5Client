function showWaitIndicator(isRoot,cancelable)
{
    var wind_w = 70;
    var wind_h = 70;
    var l = (window.innerWidth/2  - wind_w/2) + "px";
    var t = (window.innerHeight/2 - wind_h/2) + "px";
    if (isRoot==null) isRoot = false;
    if (cancelable==null) cancelable = false;
    var src = "";
    var waitHtml = "";
    if (isRoot)
        src = "DWCM/image/waitRound.gif";
    else 
        src = "DWCM/image/waitRound.gif";
    waitHtml = "<div id=\"waitIndicator\" style=\"width:100%; height:100%; position: absolute; top: 0px; left: 0px; z-index: 5; background: #FFFFFF; opacity: 0.8 \" >";
    waitHtml += "<img src=\""+src+"\" style=\"width:"+wind_w+"px; height="+wind_h+"px;position: absolute;top: "+
        t+";left: "+l+";z-index: 5;\" "; 
    waitHtml+= " </div>";
    $("body").append(waitHtml);
    
    if (cancelable)
    {
        $("#waitIndicator").on("click",
                               function()
                               {
                                    hideWaitIndicator();
                               });
    }
}

function hideWaitIndicator()
{
    var wdlg =  $("#waitIndicator");
    if (wdlg.length == 0) return;
    $("#waitIndicator").remove();
}

function wwaitDialog(cmd)
{
$("body").waitDialog({title:"header",
					  onCancelButtonClicked: function()
					  {
						  var s="stop";
					  }
					 });
	
setTimeout(function()
{
	$("body").waitDialog("remove");
}
,2000);	
	
setTimeout(function()
{
	$("body").waitDialog("renderInfo","1/2");
}
,500);	
	
setTimeout(function()
{
	$("body").waitDialog("renderInfo","2/2");
}
,1500);	
	
	
//require(["spin"])	
//var spinner = new Spinner(opts).spin($("#waitDlg")[0]);	

	
}

(function ($, window, document, undefined) {
	var pluginName = 'waitDialog';

	var _default = {};
	var defaultTitle = "Wait...";
	if (window.App != undefined) 
		defaultTitle = App.localeData.wait;
	_default.settings = {
        title:defaultTitle,
		info:"",
        // Event handlers
        onCancelButtonClicked: undefined
	};

	_default.options = {
	};

	var ThePlugin = function (element, options) {

		this.$element = $(element);
		this.elementId = element.id;

		this.init(options);

		return {

			// Options (public access)
			options: this.options,

			// Initialize / destroy methods
			init: $.proxy(this.init, this),
			remove: $.proxy(this.remove, this),

            // methods
			renderInfo: $.proxy(this.renderInfo, this),
			hideAnimation: $.proxy(this.hideAnimation, this)
			
		};
	};

	ThePlugin.prototype.init = function (options) {

		if (options.data) {
			this.waitDialogData = $.extend(true, [], options.data);
		}
		this.options = $.extend({}, _default.settings, options);
		this.destroy();
		this.subscribeEvents();
		this.render();
	};
    
    ThePlugin.prototype.render = function () {

		this.$element.find("#waitDlg").remove();
		if (!this.initialized) {

			// Setup first time only components
			this.$element.addClass(pluginName);
			this.$wrapper = $(this.template.mainTmpl);
			this.initialized = true;
		}
		//this.$element.empty().append(this.$wrapper.empty());
		this.$wrapper.append(this.template.header);
		this.$wrapper.append(this.template.bottom());
		this.$wrapper.find(".header").text(this.options.title);
		this.$element.append(this.$wrapper);
		this.renderInfo(this.options.info);
		require(["spin"],function(Spinner)
				{
					var opts = {

						lines: 12 // The number of lines to draw
						, length: 20 // The length of each line
						, width: 7 // The line thickness
						, radius: 20 // The radius of the inner circle
						, scale: 1 // Scales overall size of the spinner
						, corners: 1 // Corner roundness (0..1)
						, color: '#000' // #rgb or #rrggbb or array of colors
						, opacity: 0.4 // Opacity of the lines
						, rotate: 0 // The rotation offset
						, direction: 1 // 1: clockwise, -1: counterclockwise
						, speed: 1 // Rounds per second
						, trail: 60 // Afterglow percentage
						, fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
						, zIndex: 2e9 // The z-index (defaults to 2000000000)
						, className: 'spinner' // The CSS class to assign to the spinner
						, top: '40%' // Top position relative to parent
						, left: '50%' // Left position relative to parent
						, shadow: false // Whether to render a shadow
						, hwaccel: false // Whether to use hardware acceleration
						, position: 'absolute' // Element positioning
					}
					var spinner = new Spinner(opts).spin($("#waitDlg")[0]);	
				}
			   );
	};
    
	ThePlugin.prototype.renderInfo = function(text)
	{
		this.options.info = text;
		this.$wrapper.find(".infoString").text(this.options.info);
	};
	
    ThePlugin.prototype.clickHandler = function (event)
    {
        var target = $(event.target);
        var item,index;
        if (target.hasClass("btn"))
        {
			this.$element.trigger('cancelButtonClicked',$.extend(true, {}, item));
			this.remove();
        }
    };
    
    ThePlugin.prototype.subscribeEvents = function () {
		this.unsubscribeEvents();
        this.$element.on('click', $.proxy(this.clickHandler, this));

		if (typeof (this.options.onCancelButtonClicked) === 'function') {
			this.$element.on('cancelButtonClicked',this.options, this.options.onCancelButtonClicked);
		}
	};
    
    ThePlugin.prototype.unsubscribeEvents = function () {

		this.$element.off('click');
        this.$element.off('cancelButtonClicked');
	};
    
    ThePlugin.prototype.remove = function () {
		this.destroy();
		$.removeData(this, pluginName);
		$('#' + this.styleId).remove();
	};
	
	ThePlugin.prototype.hideAnimation = function () {
		this.$wrapper.find(".spinner").hide();
	};


    
    ThePlugin.prototype.destroy = function () {
		if (!this.initialized) return;
		this.$wrapper.remove();
		this.$wrapper = null;
		// Switch off events
		this.unsubscribeEvents();
		this.$element.find("#waitDlg").remove();
		// Reset this.initialized flag
		this.initialized = false;
	};


    ThePlugin.prototype.template = {
		mainTmpl: 
		"<div id='waitDlg' class='fntHeader' "+
			"style='width:100vw; height:100vh; position: absolute; top:0px; left:0px; z-index:5; background: #FFFFFF' >"+
		"</div",
		header: "<h3 class='header' style='text-align:center'></h3>",
		bottom:function()
		{
			var rv = 	
		"<div style='position: absolute;top:55vh;'>"+
			"<div style='width:100vw;text-align:center' class='infoString'></div>"+
		"</div>" +
		"<div style='position: absolute;width:100vw; bottom:10vh'>" +
			"<a target='_blank' id='hiddenLink' ><span></span></a>"+	
			"<button id='cancelButton' class='btn btn-danger center-block'  >"+
				((window.App == undefined)?"Cancel":App.localeData.btnCancel)+"</button>" +
		"</div>";
			return rv;
		}
		
	};
    
	var logError = function (message) {
		if (window.console) {
			window.console.error(message);
		}
	};

	// Prevent against multiple instantiations,
	// handle updates and method calls
	$.fn[pluginName] = function (options, args) {

		var result;

		this.each(function () {
			var _this = $.data(this, pluginName);
			if (typeof options === 'string') {
				if (!_this) {
					logError('Not initialized, can not call method : ' + options);
				}
				else if (!$.isFunction(_this[options]) || options.charAt(0) === '_') {
					logError('No such method : ' + options);
				}
				else {
					if (!(args instanceof Array)) {
						args = [ args ];
					}
					result = _this[options].apply(_this, args);
				}
			}
			else if (typeof options === 'boolean') {
				result = _this;
			}
			else {
				$.data(this, pluginName, new ThePlugin(this, $.extend(true, {}, options)));
			}
		});

		return result || this;
	};

})(jQuery, window, document);
