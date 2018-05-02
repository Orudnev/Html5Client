/* contextMenu  */
(function ($, window) {

    $.fn.contextMenu = function (settings) {
        var defaults =  {
                        mouseX:0,
                        mouseY:0
                    };        
        return this.each(function () {

            $(this).on("vmousedown",defaults, function(e)
            {
                e.data.mouseX = e.clientX;
                e.data.mouseY = e.clientY;
            });
            
            // Open context menu
            $(this).on("contextmenu taphold", function (e) {
                // return native menu if pressing control
                if (e.ctrlKey) return;
                
                var clientX;
                var clientY;
                if (e.clientX && e.clientY)
                {
                    clientX = e.clientX;
                    clientY = e.clientY;
                }
                else
                {
                    clientX = defaults.mouseX-25;
                    clientY = defaults.mouseY-25;
                }
                
                if (typeof (settings.menuBeforeSelected) === 'function')
                {
                    var o = settings.menuBeforeSelected(e);
                    if (o!=null && o.doNotShowMenu!=null && o.doNotShowMenu == true)
                    {
                       return false;    
                    }
                }
                //open menu
                var $menu = $(settings.menuSelector)
                    .data("invokedOn", $(e.target))
                    .show()
                    .css({
                        position: "absolute",
                        left: getMenuPosition(clientX, 'width', 'scrollLeft'),
                        top: getMenuPosition(clientY, 'height', 'scrollTop')
                    })
                    .off('mousedown')
                    .on('mousedown', 'a', function (e) {
                        $menu.hide();
                
                        var $invokedOn = $menu.data("invokedOn");
                        var $selectedMenu = $(e.target);
                        
                        settings.menuSelected.call(this, $invokedOn, $selectedMenu);
                    });
                
                return false;
            });

            //make sure menu closes on any click
            $('body').mousedown(function (e) {
                $(settings.menuSelector).hide();
            });
        });
        
        function getMenuPosition(mouse, direction, scrollDir) {
            var win = $(window)[direction](),
                scroll = $(window)[scrollDir](),
                menu = $(settings.menuSelector)[direction](),
                position = mouse + scroll;
                        
            // opening menu would pass the side of the page
            if (mouse + menu > win && menu < mouse) 
                position -= menu;
            
            return position;
        }    

    };
})(jQuery, window);


/*pathControl */
/*start */
(function ($, window, document, undefined) {
	var pluginName = 'pathControl';

	var _default = {};

	_default.settings = {
        data:[],
        // Event handlers
        onItemClicked: undefined
	};

	_default.options = {
	};

	var ThePlugin = function (element, options) {

		this.$element = $(element);
		this.elementId = element.id;
		this.styleId = this.elementId + '-style';

		this.init(options);

		return {

			// Options (public access)
			options: this.options,

			// Initialize / destroy methods
			init: $.proxy(this.init, this),
			remove: $.proxy(this.remove, this),

            // methods
			getNode: $.proxy(this.getNode, this),
			clearSearch: $.proxy(this.clearSearch, this)
		};
	};

	ThePlugin.prototype.init = function (options) {

		if (options.data) {
			this.pathCtrlData = $.extend(true, [], options.data);
		}
		this.options = $.extend({}, _default.settings, options);
		this.destroy();
		this.subscribeEvents();
		this.render();
	};
    
    ThePlugin.prototype.render = function () {

		if (!this.initialized) {

			// Setup first time only components
			this.$element.addClass(pluginName);
			this.$wrapper = $(this.template.mainTmpl);
			this.initialized = true;
		}
		this.$element.empty().append(this.$wrapper.empty());
        this.buildPath(this.options.data);
	};
    
    ThePlugin.prototype.buildPath = function(itemList){
        var that = this;
        var delimiterWidth = 0;
        // 1. build path 
        $.each(itemList, function addItem(id, item) {
			if (item.id != "DD" && item.id != "DF") {
            var delimiter = $(that.template.delimiter);
            that.$wrapper.append(delimiter);
            if (delimiterWidth == 0) delimiterWidth = delimiter.outerWidth(true);
            var newItem = $(that.template.folderTmpl).text(item.text).attr('itemIndex',id);
            that.$wrapper.append(newItem);
			}
        });
        //2. check the summary path width
        var pathItemList = that.$wrapper.children();
        var wholeWidth = that.$wrapper.parent().innerWidth()-10;
        var swidth = 0;
        var firstVisibleElementIndex = -1;
        for( var i=pathItemList.length-1;i>=0;i--)
        {
            var item = pathItemList[i];
            swidth += $(item).outerWidth(true);
            if (swidth > wholeWidth)
            {
                //replace delimiter to ellipsis
                if (firstVisibleElementIndex == -1)
                {
                    firstVisibleElementIndex = i+1;
                    var firstVisibleItem = pathItemList[firstVisibleElementIndex];
                    var vwidth = swidth - $(item).outerWidth(true) + delimiterWidth;
                    var lastHiddenItem = item;
                    if (vwidth > wholeWidth)
                    {
                        //move the first visible element on the 1 position forward
                        $(firstVisibleItem).css("visibility","hidden");
                        lastHiddenItem = firstVisibleItem; 
                        firstVisibleElementIndex = i+2;
                    }

                    $(lastHiddenItem).after($(that.template.ellipsis));
                }
                $(item).css("visibility","hidden");
            }
        }
        if (swidth < wholeWidth)
        {
            that.$wrapper.css("float","left");
        }
        else
        {
            that.$wrapper.css("float","right");
        }
    };
    
    ThePlugin.prototype.clickHandler = function (event)
    {
        var target = $(event.target);
        var item,index;
        if (target.hasClass("pathBarEllipsis"))
        {
            var nextEl = target.next();
            if($(nextEl).hasClass("pathBarDelimiter"))
            {
               nextEl = $(nextEl).next();
            }
            index = parseInt($(nextEl).attr('itemIndex')) -1;
            item = this.options.data[index];
            this.$element.trigger('itemClicked',$.extend(true, {}, item));
            return;
        }
        if (!target.attr('itemIndex')) return;
        index = parseInt(target.attr("itemIndex"));
        item =  this.options.data[index];
        this.$element.trigger('itemClicked',$.extend(true, {}, item));
    };
    
    ThePlugin.prototype.subscribeEvents = function () {
		this.unsubscribeEvents();
        $(window).on('resize',$.proxy(this.resizeHandler, this))
        this.$element.on('click', $.proxy(this.clickHandler, this));

		if (typeof (this.options.onItemClicked) === 'function') {
			this.$element.on('itemClicked', this.options.onItemClicked);
		}
        
	};
    
    ThePlugin.prototype.resizeHandler = function()
    {
        this.render();
    };
    
    ThePlugin.prototype.unsubscribeEvents = function () {

        $(window).off('resize');
		this.$element.off('click');
        this.$element.off('itemClicked');
	};
    
    ThePlugin.prototype.remove = function () {
		this.destroy();
		$.removeData(this, pluginName);
		$('#' + this.styleId).remove();
	};

    
    ThePlugin.prototype.destroy = function () {
		if (!this.initialized) return;
		this.$wrapper.remove();
		this.$wrapper = null;
		// Switch off events
		this.unsubscribeEvents();
		// Reset this.initialized flag
		this.initialized = false;
	};


    ThePlugin.prototype.template = {
		mainTmpl: '<div class="pathBar" type="text"> </div>',
        folderTmpl:'<a class="pathBarFolder"></a>',         
        delimiter:'<span class="pathBarDelimiter"></span>',
        ellipsis:'<span class="pathBarEllipsis" ></span>'                
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

/*finish*/



/* dwcmListBox */        

(function ($) {
    var defaults =  {
                    };
    
    var methods = {
            init :  function( options ) 
                    { 
                        defaults = $.extend({}, defaults, options);
                    },
            addRange: function(strArrDsnList)
            {
                var strHtml = "";
                for(var i=0;i<strArrDsnList.length;i++)
                {
                    var strItem = strArrDsnList[i];
                    var strFormat = "<a href='#' class='list-group-item'>{0}</a>";
                    strHtml += stringFormat(strFormat,[strItem]);
                }
                this.append(strHtml);
                $("a",this).click([this],methods.onItemSelected);
            },
            onItemSelected: function()
            {
                methods.setSelectedItem(this);                        
            },
            getSelectedItem: function()
            {
                var rv = $("a.active",($(this)).parent());
                if (rv.length>0)
                    return rv[0];
                else
                    return null;
            },
            setSelectedItem :  function(selectedItem) 
            {
                var strItem = "";
                var itemFunction = function(arg1) 
                    {
                        if (this.text==arg1) 
                        {
                            $(this).addClass("active");
                        }
                        else
                        {
                            $(this).removeClass("active");
                        }
                    };
                if (typeof selectedItem === 'string')
                {
                    strItem = selectedItem;
                    $("a",this).each(itemFunction,[strItem]);
                }
                else
                {
                    strItem = selectedItem.text;
                    $("a",$(selectedItem).parent()).each(itemFunction,[strItem]);
                }
             }
        };
    
    $.fn.dwcmListBox = function(method) 
    {
        if ( methods[method] ) 
        {
          return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } 
        else if ( typeof method === 'object' || ! method ) 
        {
          return methods.init.apply( this, arguments );
        } 
        else 
        {
          $.error( 'Method named as ' +  method + ' is not existent for jQuery.pageNavigator' );
        }         
    };
    })(jQuery);


/* Expression editor*/
(function ($, window, document, undefined) {
	var pluginName = 'expressionEditor';

	var _default = {};

	_default.settings = {
        fields:[],
		exprList:[],
        // Event handlers
        //onItemClicked: undefined
	};

	_default.options = {
	};

	var ThePlugin = function (element, options) {

		this.$element = $(element);
		this.elementId = element.id;
		this.styleId = this.elementId + '-style';

		this.init(options);

		return {

			// Options (public access)
			options: this.options,

			// Initialize / destroy methods
			init: $.proxy(this.init, this),
			remove: $.proxy(this.remove, this),

            // methods
			getExprList: $.proxy(this.getExprList, this)
		};
	};
	
	   ThePlugin.prototype.clickHandler = function (event)
    {
        var target = $(event.target);
        if (target.hasClass("btn") && target.hasClass("glyphicon-plus"))
        {
			var emptyItem = this.getEmptyExpItem();
			emptyItem.andOr = "AND";
			this.options.exprList.push(emptyItem);
			
			var $exprItem = this.renderItem(emptyItem);	
			this.$wrapper.append($exprItem);
			$("select.selectpicker").selectpicker();
			this.renderItemsButtons();
        }
        if (target.hasClass("btn") && target.hasClass("glyphicon-minus"))
        {
			var index = this.getItemIndex(target);
			this.options.exprList.slice(index,1);
			target.parents(".expressionItem").remove();
			this.renderItemsButtons();
        }
		if (target.prop("tagName")=="SPAN" && target.hasClass("text"))
		{
			//combobox item is selected
			if (target.parents(".bootstrap-select").hasClass("fieldList"))
			{
				//field name is changed
				var newFieldCaption = target.text();
				var itemIndex = parseInt(target.parents("li").attr("data-original-index"));
				var $selectOption = $(target.parents("div").next().find("option")[itemIndex]);
				var newFieldName = $selectOption.attr("fieldName");
				var newField = this.getField(newFieldName);
				var conditions = this.renderConditions(newField.type,"=");
				var divConditions = target.parents(".expressionItem").find("div.conditionList");
				var prevContitions = divConditions.prev();
				if(newField.type=="Date")
					target.parents(".expressionItem").find("input").attr("placeholder","YYYY/MM/DD");
				else
					target.parents(".expressionItem").find("input").attr("placeholder","");
				
				divConditions.remove();
				prevContitions.after(conditions);
				conditions.selectpicker();
			}
		}
    };
	
	ThePlugin.prototype.getExprList = function()
	{
		this.refreshExprList();
		return this.options.exprList;
	};
	
	ThePlugin.prototype.refreshExprList = function()
	{
		//refreshes this.options.exprList by current GUI values
		var expListCtrl = this.$element.find(".expressionItem");
		var expStr = "";
		var refreshedExpList = [];
		for (var i=0;i<expListCtrl.length;i++)
		{
			var $expItem = $(expListCtrl[i]);
			var andOr = $expItem.find(".bootstrap-select.andOr .filter-option").text();	
			var selFieldIndex = parseInt($expItem.find("div.fieldList").find("li.selected").attr("data-original-index"));
			var fieldName = $($expItem.find("div.fieldList").find("option")[selFieldIndex]).attr("fieldName");
			var condition = $expItem.find(".bootstrap-select.conditionList .filter-option").text();
			var value = $expItem.find("input").val();
			var expr = {
				andOr:andOr,
				fieldName:fieldName,
				condition:condition,
				value:value
			};	
			refreshedExpList.push(expr);
		}
		this.options.exprList = refreshedExpList;
	};

	ThePlugin.prototype.getEmptyExpItem = function(){
		var rv = {andOr:null,
				  fieldName:this.options.fields[0].name,
				  condition:"=",
				  value:""
				 };	
		return rv;
	};

	ThePlugin.prototype.getField = function(fieldName)
	{
		for(var i=0;i<this.options.fields.length;i++)
		{
			field = this.options.fields[i];
			if (fieldName.toLowerCase()==field.name.toLowerCase()) return field;
		}
		return null;
	};
	
	ThePlugin.prototype.getItemIndex = function(target)
	{
		var currItem = target.parents(".expressionItem");
		var index = 0;
		for(;;)
		{
			if (currItem.prev().hasClass("expressionItem"))
			{
				index++;
				currItem = currItem.prev();
				continue;
			}
			break;
		}
		return index;
	};
	
	ThePlugin.prototype.init = function (options) {

		if (options.data) {
			this.pathCtrlData = $.extend(true, [], options.data);
		}
		this.options = $.extend({}, _default.settings, options);
		this.destroy();
		this.subscribeEvents();
		this.render();
	};
	
    ThePlugin.prototype.render = function () {

		if (!this.initialized) {

			// Setup first time only components
			this.$element.addClass(pluginName);
			this.$wrapper = $(this.template.main);
			this.initialized = true;
		}
		this.$wrapper.empty();
		if (this.options.exprList.length==0)
			this.options.exprList.push(this.getEmptyExpItem());
		this.$element.empty();
		var correctItems = 0;
		for(var i=0;i<this.options.exprList.length;i++)
		{
			var expr = this.options.exprList[i];
			var $exprItem = this.renderItem(expr);
			this.$wrapper.append($exprItem);
			if ($exprItem) correctItems++;
		}
		if (correctItems==0)
		{
			var $exprItem = this.renderItem(this.getEmptyExpItem());
			this.$wrapper.append($exprItem);
		}
			
		//this.$wrapper.append(this.renderItem("OR","fld2",">=","5"));
		this.$element.append(this.$wrapper);
		$("select.selectpicker").selectpicker();
		this.renderItemsButtons();
	};
	
	ThePlugin.prototype.renderConditions = function(fieldType,conditionValue)
	{
		var $conditionCtrl = $(this.template.select);
		$conditionCtrl.addClass("conditionList");
		$conditionCtrl.append($(this.template.selectOption).text("="));	
		$conditionCtrl.append($(this.template.selectOption).text(">"));	
		$conditionCtrl.append($(this.template.selectOption).text("<"));	
		$conditionCtrl.append($(this.template.selectOption).text(">="));	
		$conditionCtrl.append($(this.template.selectOption).text("<="));	
		$conditionCtrl.append($(this.template.selectOption).text("<>"));
		if(fieldType=="String")
		{
			$conditionCtrl.append($(this.template.selectOption).text("LIKE"));	
			$conditionCtrl.append($(this.template.selectOption).text("NOT LIKE"));	
		}
		if(fieldType=="Numeric") 
			$conditionCtrl.append($(this.template.selectOption).text("FROM;TO"));	
		if (conditionValue)
			$conditionCtrl.val(conditionValue);
		return $conditionCtrl;
	};

	ThePlugin.prototype.renderItem = function (expr) {
		var exprField = this.getField(expr.fieldName);
		if (!exprField)	return "";
		var $expItem = $(this.template.expItem);
		$expItem.attr("fieldName",$expItem.name);
		$expItem.append(this.template.bottonsContainer);
		if (expr.andOr)
		{
			var $andOrCtrl = $(this.template.select);
			$andOrCtrl.attr("data-width","25vw");
			$andOrCtrl.addClass("andOr");
			$andOrCtrl.append($(this.template.selectOption).text("AND"));	
			$andOrCtrl.append($(this.template.selectOption).text("OR"));	
			$andOrCtrl.val(expr.andOr);
			$expItem.append($andOrCtrl); 
		}

		var $fieldsCtrl = $(this.template.select);
		$fieldsCtrl.attr("data-width","60vw");
		$fieldsCtrl.addClass("fieldList");
		for(var i=0;i<this.options.fields.length;i++)
		{
			var field = this.options.fields[i];
			var $selOption = $(this.template.selectOption);
			$selOption.attr("fieldName",field.name);
			$selOption.text(field.caption);
			$fieldsCtrl.append($selOption);	
		}
		$fieldsCtrl.val(exprField.caption)
		
		var $conditionCtrl = this.renderConditions(exprField.type,expr.condition);
							  
		$expItem.append($fieldsCtrl); 
		$expItem.append($conditionCtrl); 
		var $inputCtrl = $(this.template.inputCtrl);
		if (expr.value)
			$inputCtrl.val(expr.value);
		$expItem.append($inputCtrl);
		
		return $expItem;
	};
	
	ThePlugin.prototype.renderItemsButtons = function (event)
	{
		var expList = this.$element.find(".expressionItem");
		var isSingleItem = expList.length == 1;
		for (var i=0;i<expList.length;i++)
		{
			$(expList[i]).find(".btn.glyphicon-plus").remove();
			if (i==0 && isSingleItem)
			{
				$(expList[i]).find(".bootstrap-select.andOr").remove();
				$(expList[i]).find(".btn.glyphicon-minus").remove();
			}
			if(!isSingleItem && $(expList[i]).find(".btn.glyphicon-minus").length==0)
				$(expList[i]).find(".btnContainer").append(this.template.btnMinus);
			if(i==expList.length-1)
				$(expList[i]).find(".btnContainer").append(this.template.btnPlus);
		}
	};
    
    ThePlugin.prototype.subscribeEvents = function () {
		this.unsubscribeEvents();
        this.$element.on('click', $.proxy(this.clickHandler, this));

		if (typeof (this.options.onItemClicked) === 'function') {
			this.$element.on('itemClicked', this.options.onItemClicked);
		}
        
	};
    
    ThePlugin.prototype.unsubscribeEvents = function () {
		this.$element.off('click');
        this.$element.off('itemClicked');
	};
    
    ThePlugin.prototype.remove = function () {
		this.destroy();
		$.removeData(this, pluginName);
		$('#' + this.styleId).remove();
	};

    
    ThePlugin.prototype.destroy = function () {
		if (!this.initialized) return;
		this.$wrapper.remove();
		this.$wrapper = null;
		// Switch off events
		this.unsubscribeEvents();
		// Reset this.initialized flag
		this.initialized = false;
	};


    ThePlugin.prototype.template = {
		main: '<div class="expEditorContainer"  />',
		expItem: '<div class="expressionItem" style="padding-bottom:10px;" />',
        select:'<select class="selectpicker" data-width="auto" />',         
        selectOption:'<option />',
		bottonsContainer:'<div class="btnContainer" style="display:inline-block; padding-left:5px; padding-right: 5px;" />',
		inputCtrl:'<input type="text" class="form-control" />',
        btnMinus:'<button class="btn btn-default glyphicon glyphicon-minus btn-danger btn-xs"></button>',
		btnPlus:'<button class="btn btn-default glyphicon glyphicon-plus btn-success btn-xs" style="margin-left:5px"></button>'
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

/* dwcmNavigator*/
(function ($, window, document, undefined) {
	var pluginName = 'dwcmNavigator';

	var _default = {};

	_default.settings = {
		minIndex:0,
		maxIndex:0,
		currentIndex:0,
        // Event handlers
		onCurrentIndexChanged: undefined
	};

	_default.options = {
	};

	var ThePlugin = function (element, options) {

		this.$element = $(element);
		this.elementId = element.id;
		this.styleId = this.elementId + '-style';

		this.init(options);

		return {

			// Options (public access)
			options: this.options,

			// Initialize / destroy methods
			init: $.proxy(this.init, this),
			remove: $.proxy(this.remove, this),

            // methods
			getOptions: $.proxy(this.getOptions, this),
			appendHtml: $.proxy(this.appendHtml, this),
			refreshButtons: $.proxy(this.refreshButtons, this),
			refreshMenu: $.proxy(this.refreshMenu, this),
			setWaitIndicator: $.proxy(this.setWaitIndicator, this),
			remove: $.proxy(this.remove, this)
		};
	};
	
	ThePlugin.prototype.clickHandler = function (event)
	{
        var target = $(event.target);
		var htmlContent = this.$wrapper.find("div.row").next();
		eventData={htmlContent:htmlContent,dlgInstance:this};
        if (target.hasClass("btn")){
			if (target.attr("id")=="btnFirst") this.setCurrentIndex(this.options.minIndex);
			if (target.attr("id")=="btnPrevious") this.setCurrentIndex(this.options.currentIndex-1);
			if (target.attr("id")=="btnNext") this.setCurrentIndex(this.options.currentIndex+1);
			if (target.attr("id")=="btnLast") this.setCurrentIndex(this.options.maxIndex);
			
		}
	};
	
	ThePlugin.prototype.init = function (options) {
		this.options = $.extend({}, _default.settings, options);
		this.destroy();
		this.subscribeEvents();
		this.render();
	};
	
    ThePlugin.prototype.render = function () {

		if (!this.initialized) {

			// Setup first time only components
			this.$element.addClass(pluginName);
			this.$wrapper = $(this.template.main);
			this.initialized = true;
		}
		this.$wrapper.empty();
		this.$element.empty();
		this.$wrapper.append(this.template.controls);
		this.$element.append(this.$wrapper);
		this.invalidate();
	};
	ThePlugin.prototype.invalidate = function() {
		this.$wrapper.find("#currentRecord").text(this.options.currentIndex+1);
		this.$wrapper.find("#btnFirst").prop("disabled",this.options.currentIndex<=this.options.minIndex);
		this.$wrapper.find("#btnPrevious").prop("disabled",this.options.currentIndex<=this.options.minIndex);
		this.$wrapper.find("#btnNext").prop("disabled",this.options.currentIndex>=this.options.maxIndex);
		this.$wrapper.find("#btnLast").prop("disabled",this.options.currentIndex>=this.options.maxIndex);
	};
	ThePlugin.prototype.setCurrentIndex = function(newIndexValue) {
		if (this.options.currentIndex>=this.options.minIndex &&
			this.options.currentIndex<=this.options.maxIndex){
			this.options.currentIndex = newIndexValue;
			var eventData={newIndex:this.options.currentIndex};
			this.$element.trigger("currentIndexChanged",$.extend(true, {}, eventData));
			this.invalidate();
		}
		
	}
	
    ThePlugin.prototype.subscribeEvents = function () {
		this.unsubscribeEvents();
        this.$element.on('click', $.proxy(this.clickHandler, this));
		if (typeof (this.options.onCurrentIndexChanged) === 'function') {
			this.$element.on('currentIndexChanged', this.options.onCurrentIndexChanged);
		}

	};
    
    ThePlugin.prototype.unsubscribeEvents = function () {
		this.$element.off('click');
        this.$element.off('currentIndexChanged');
	};
    
    ThePlugin.prototype.remove = function () {
		this.destroy();
		$.removeData(this, pluginName);
		$('#' + this.styleId).remove();
	};

    
    ThePlugin.prototype.destroy = function () {
		if (!this.initialized) return;
		this.$wrapper.remove();
		this.$wrapper = null;
		// Switch off events
		this.unsubscribeEvents();
		// Reset this.initialized flag
		this.initialized = false;
	};


    ThePlugin.prototype.template = {
		main:
		'<div id="Navigator" style="position:absolute; top:7px;right:150px">'+
		'</div>',
		controls:
		'<button id="btnFirst" type="button" '+
			'class="btn btn-primary btn-sm glyphicon glyphicon-step-backward" >'+
		'</button>'+		
		'<button id="btnPrevious" type="button" '+
			'class="btn btn-primary btn-sm glyphicon glyphicon glyphicon-backward" '+
			'style="margin-left: 4px;margin-right: 4px;">'+
		'</button>'+		
		'<label id="currentRecord" style="padding-left:5px;padding-right:5px;">'+
		'</label>'+
		'<button id="btnNext" type="button" '+
		'class="btn btn-primary btn-sm glyphicon glyphicon-forward"'+
		'style="margin-left: 4px;" >'+
		'</button> '+
		'<button id="btnLast" type="button" '+
			'class="btn btn-primary btn-sm glyphicon gglyphicon glyphicon-step-forward" >'+
		'</button> '		
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



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/* dwcmDialog*/
(function ($, window, document, undefined) {
	var pluginName = 'dwcmDialog';

	var _default = {};

	_default.settings = {
		title:"Dialog title",
		allowTitleEdit:false,
		titleGlyphIcon:"",
        buttons:{btnOk:false,btnCancel:true,btnMenu:false,btnCustomCmd:false},//visibility
		btnCustomCmdGlyphIcon:"",
		buttonsDisabled:{btnOk:false,btnCancel:false,btnMenu:false,btnCustomCmd:false},
		contentHtml:"",
		model:null,
		doNotRemoveNullHeight:false,
        // Event handlers
		onMenuBtnClicked: undefined,
		onMenuItemClicked: undefined,
        onOkBtnClicked: undefined,
		onCancelBtnClicked: undefined,
		onBtnCustomCmdClicked:undefined,	//additional button in toolbar
		onCustomButtonClicked: undefined,   //any button in client area (not toolbar button)
		onContentElementClicked:undefined,
		onGuiValueChanged:undefined,
		onRendered:undefined,
		onDestroing:undefined
	};

	_default.options = {
	};

	var ThePlugin = function (element, options) {

		this.$element = $(element);
		this.elementId = element.id;
		this.styleId = this.elementId + '-style';

		this.init(options);

		return {

			// Options (public access)
			options: this.options,

			// Initialize / destroy methods
			init: $.proxy(this.init, this),
			remove: $.proxy(this.remove, this),

            // methods
			getOptions: $.proxy(this.getOptions, this),
			appendHtml: $.proxy(this.appendHtml, this),
			refreshButtons: $.proxy(this.refreshButtons, this),
			refreshMenu: $.proxy(this.refreshMenu, this),
			setModel: $.proxy(this.setModel, this),
			setWaitIndicator: $.proxy(this.setWaitIndicator, this),
			setBtnState: $.proxy(this.setBtnState, this)
		};
	};
	
	ThePlugin.prototype.clickHandler = function (event)
    {
        var target = $(event.target);
		var htmlContent = this.$wrapper.find("div.row").next();
		eventData={htmlContent:htmlContent,dlgInstance:this};
        if (target.hasClass("btn"))
        {
			if (target.attr("command")){
				//toolbar button clicked
				var cmd = target.attr("command");
				var eventType = cmd+"BtnClicked";
				if (eventType.toLowerCase() == "okbtnclicked")
				{
					if (this.options.model)
					{
						if (!AppHelper_WholeMainPaneDialog.setValues_GuiToModel(this.options.model))
							return; //errors were detected, do not fire "okbtnclicked" event
					}
				}

				this.$element.trigger(eventType,$.extend(true, {}, eventData));
				if (cmd == "cancel")
					this.remove();
				return;
			} else {
			  	// custom button clicked
				eventData.targetElm = target;
				this.$element.trigger("customButtonClicked",$.extend(true, {}, eventData));
				if (target.attr("closeDialog"))
					this.remove();
			}
        }
		if (target[0].tagName=="A" && target.attr("command"))
		{
			// it is menu command
			eventData.menuItem = target;
			this.$element.trigger("menuItemClicked",$.extend(true, {}, eventData));
			return;
		}
		if (target.parents("div.row").length==0)
		{
			//it is not titleBar
			eventData.targetElement = target;
			this.$element.trigger("contentElementClicked",$.extend(true, {}, eventData));
			if (target[0].tagName=="INPUT" && target.attr("type")=="checkbox") 
			{
				AppHelper_WholeMainPaneDialog.setValues_GuiToModel(this.options.model);
				var eventData={
					dlgInstance:this,
					target:target[0],
					dataField:target.attr("dataField"),
					value:target.prop("checked")
				};
				this.$element.trigger("guiValueChanged",$.extend(true, {}, eventData));
			}
			if (target[0].tagName=="INPUT" && target.attr("type")=="radio") {
				target.parents(".form-group").find("input").prop("checked",false);
				target.prop("checked",true);
				AppHelper_WholeMainPaneDialog.setValues_GuiToModel(this.options.model);
				var eventData={
					dlgInstance:this,
					target:target[0],
					dataField:target.attr("dataField"),
					value:target.prop("checked")
				};
				this.$element.trigger("guiValueChanged",$.extend(true, {}, eventData));
			}

		}
    };
	
	ThePlugin.prototype.changeSelPickerValueHandler = function (event,clickedIndex,bNewValue,bOldValue)
	{
		AppHelper_WholeMainPaneDialog.setValues_GuiToModel(this.options.model);
		var dataField=$(event.target).attr("dataField");
		var selector = stringFormat("option[dataIndex={0}]",[clickedIndex]);
		var strValue = $(event.target).find(selector).attr("value");
		eventData={
			dlgInstance:this,
			target:event.target,
			dataField:dataField,
			strValue:strValue,
			bNewValue:bNewValue,
			bOldValue:bOldValue};
		this.$element.trigger("guiValueChanged",$.extend(true, {}, eventData));
	}

	ThePlugin.prototype.appendHtml = function (htmlStr)
	{
		if (!this.initialized)
			return;
		this.$dlgContentContainer.append(htmlStr);
	}
	
	ThePlugin.prototype.getOptions = function ()
	{
		return this.options;
	}

	ThePlugin.prototype.setWaitIndicator = function (bState)
	{
		if (this.$wrapper)
		{
			if (bState)
				this.$wrapper.find("#dlgWaitIndicator").removeClass("invisible");	
			else	
				this.$wrapper.find("#dlgWaitIndicator").addClass("invisible");	
		}
	}
	
	
	ThePlugin.prototype.init = function (options) {
		this.options = $.extend({}, _default.settings, options);
		this.destroy();
		this.subscribeEvents();
		this.render();
	};
	
	
	ThePlugin.prototype.refreshButtons = function ()
	{
		var setButton = function(command,visibility,disabled){
			if (visibility)
				this.$wrapper.find("button[command='"+command+"']").removeClass("nullSize");
			else
				this.$wrapper.find("button[command='"+command+"']").addClass("nullSize");
			this.$wrapper.find("button[command='"+command+"']")
				.prop("disabled",disabled);
			
		}
		setButton.apply(this,["ok",this.options.buttons.btnOk,this.options.buttonsDisabled.btnOk]);
		setButton.apply(this,["cancel",this.options.buttons.btnCancel,this.options.buttonsDisabled.btnCancel]);
		setButton.apply(this,["menu",this.options.buttons.btnMenu,this.options.buttonsDisabled.btnMenu]);
		setButton.apply(this,["customBtnCmd",this.options.buttons.btnCustomCmd,this.options.buttonsDisabled.btnCustomCmd]);
	}
	
	ThePlugin.prototype.setBtnState = function (command,bDisabled)
	{
		this.$wrapper
			.find("button[command='"+command+"']").prop("disabled",bDisabled);
	}
	
	ThePlugin.prototype.setModel = function (newModel)
	{
		this.options.model = newModel;
		if (this.options.model)
			AppHelper_WholeMainPaneDialog.setValues_ModelToGui(this.options.model);	
	}
	
	ThePlugin.prototype.refreshMenu = function(menuItems){
		//menuItems: [{commandId:"cmdId",commandCaption:"Add Item",icon:"glyphicon glyphicon-plus"}]
		var $menuItems = this.$wrapper.find("#menuItems");
		//$menuItems.find("a[dwcmCommand]").off('click');
		$menuItems.empty();
		for(var i=0;i<menuItems.length;i++){
			var itemData = menuItems[i];
			var $menuItem = $(this.template.menuItem);
			$menuItem.find("a").attr("command",itemData.commandId);
			$menuItem.find("a").text(itemData.commandCaption);
			$menuItem.find("span").addClass(itemData.icon);
			$menuItems.append($menuItem);
		}
		//$menuItems.find("a[dwcmCommand]").on('click',);
	}
	
    ThePlugin.prototype.render = function () {

		if (!this.initialized) {

			// Setup first time only components
			this.$element.addClass(pluginName);
			this.$wrapper = $(this.template.main);
			this.initialized = true;
			$("#mpall").addClass("nullHeight"); //hide panes
			$("#mpMainPane").addClass("nullHeight"); //hide panes
		}
		this.$wrapper.empty();
		this.$element.empty();
		this.$wrapper.append(this.template.titleBar);
		//this.$wrapper.find("div h3").text(this.options.title);
		this.$wrapper.find("div h3 input").val(this.options.title)
		if (this.options.titleGlyphIcon)
			this.$wrapper.find("span.glyphicon").addClass(this.options.titleGlyphIcon);
		else
			this.$wrapper.find("span.glyphicon").remove();
		

		this.$wrapper.find("div.toolbarDiv").append(this.template.btnCancel);
		this.$wrapper.find("div.toolbarDiv").append(this.template.btnOk);
		this.$wrapper.find("div.toolbarDiv").append(this.template.btnMenu);
		this.$wrapper.find("div.toolbarDiv").append(this.template.btnCustomCmd);
		if (this.options.btnCustomCmdGlyphIcon)
			this.$wrapper.find("button[command='customBtnCmd']").addClass(this.options.btnCustomCmdGlyphIcon);
		this.refreshButtons();
		this.$wrapper.append(this.template.waitIndicator);
		this.$dlgContentContainer=$(this.template.dialogContent);
		this.$dlgContentContainer.append(this.options.contentHtml);
		this.$wrapper.append(this.$dlgContentContainer);
		this.$element.append(this.$wrapper);
		this.$element.find(".selectpicker").selectpicker();
		this.$element.find(".selectpicker").off('changed.bs.select')
											.on('changed.bs.select',$.proxy(this.changeSelPickerValueHandler, this));
		var dlgContentHeight = $(".WholeMainPaneDialog").height() - $(".WholeMainPaneDialog .row").outerHeight()-20;
		this.$dlgContentContainer.height(dlgContentHeight); 
		if (this.options.model)
			AppHelper_WholeMainPaneDialog.setValues_ModelToGui(this.options.model);
		this.$element.trigger("rendered",$.extend(true, {}, this));
	};
	
    ThePlugin.prototype.subscribeEvents = function () {
		this.unsubscribeEvents();
        this.$element.on('click', $.proxy(this.clickHandler, this));

		if (typeof (this.options.onMenuBtnClicked) === 'function') {
			this.$element.on('menuBtnClicked', this.options.onMenuBtnClicked);
		}
		if (typeof (this.options.onMenuItemClicked) === 'function') {
			this.$element.on('menuItemClicked', this.options.onMenuItemClicked);
		}		
		if (typeof (this.options.onOkBtnClicked) === 'function') {
			this.$element.on('okBtnClicked', this.options.onOkBtnClicked);
		}
		if (typeof (this.options.onCancelBtnClicked) === 'function') {
			this.$element.on('cancelBtnClicked', this.options.onCancelBtnClicked);
		}
		if (typeof (this.options.onBtnCustomCmdClicked) === 'function') {
			this.$element.on('customBtnCmdBtnClicked', this.options.onBtnCustomCmdClicked);
		}		
		if (typeof (this.options.onCustomButtonClicked) === 'function') {
			this.$element.on('customButtonClicked', this.options.onCustomButtonClicked);
		}
		if (typeof (this.options.onContentElementClicked) === 'function') {
			this.$element.on('contentElementClicked', this.options.onContentElementClicked);
		}
		if (typeof (this.options.onGuiValueChanged) === 'function') {
			this.$element.on('guiValueChanged', this.options.onGuiValueChanged);
		}
		if (typeof (this.options.onRendered) === 'function') {
			this.$element.on('rendered', this.options.onRendered);
		}
		if (typeof (this.options.onDestroing) === 'function') {
			this.$element.on('destroing', this.options.onDestroing);
		}
		
	};
    
    ThePlugin.prototype.unsubscribeEvents = function () {
		this.$element.off('click');
		this.$element.find(".selectpicker").off('changed.bs.select');
        this.$element.off('menuBtnClicked');
		this.$element.off('menuItemClicked');
        this.$element.off('okBtnClicked');
        this.$element.off('cancelBtnClicked');
		this.$element.off('customBtnCmdBtnClicked');		
		this.$element.off('customButtonClicked');
        this.$element.off('contentElementClicked');
        this.$element.off('guiValueChanged');
        this.$element.off('rendered');
        this.$element.off('destroing');
	};
    
    ThePlugin.prototype.remove = function () {
		this.destroy();
		$.removeData(this, pluginName);
		$('#' + this.styleId).remove();	
		if (!this.options.doNotRemoveNullHeight){
			$("#mpall").removeClass("nullHeight");
			$("#mpMainPane").removeClass("nullHeight");
		} 
	};

    
    ThePlugin.prototype.destroy = function () {
		if (!this.initialized) return;
		this.$element.trigger("destroing");
		this.$wrapper.remove();
		this.$wrapper = null;
		// Switch off events
		this.unsubscribeEvents();
		// Reset this.initialized flag
		this.initialized = false;
	};


    ThePlugin.prototype.template = {
		main:
		'<div class="mpall WholeMainPaneDialog" style="height:100vh; overflow:hidden" >'+ 
		'</div>',
		titleBar:
		'<div class="row">'+
			'<div class="col-xs-7">'+
				'<h3 class="fntHeader" style="display:inline-block;padding-left:20px">'+
					'<span class="glyphicon " style="margin-right: 5px;"></span>'+
					'<span>'+
						'<input type="text"'+ 
							'style="background-color: transparent; border: none; width: 40vw;" >'+					
						'</span>'+
				'</h3>'+
			'</div>'+
			'<div class="col-xs-5 toolbarDiv" style="padding-left: 0px;">'+
			'</div>'+
		'</div>',
		btnOk:
		'<button type="button" style="margin-top:3px;margin-bottom:3px; margin-right:3px;" '+ 'command="ok" '+
		'class="toolbarBtn btn btn-success menuBtn pull-right glyphicon glyphicon-ok">'+
		'</button>',
		btnCancel: 
		'<button type="button" style="margin-top:3px;margin-bottom:3px; margin-right:3px;"'+
		'class="toolbarBtn btn btn-danger pull-right dropdown-toggle glyphicon glyphicon-remove" '+
		'command="cancel" '+
		'data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'+
		'</button>',
        btnMenu:
		'<div class="btn-group menuBtnDiv pull-right" style="display:inline-block;">'+
		  '<button type="button" '+
			'command="menu" '+
			'style="margin-top:3px;margin-bottom:3px; margin-right:3px;" '+
			'class="toolbarBtn menuBtn btn btn-primary '+
			'dropdown-toggle glyphicon glyphicon-align-justify " '+
			'data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'+
		  '</button>'+
		  '<ul id="menuItems" class="dropdown-menu pull-right">'+
		  '</ul>'+
		'</div>',
		btnCustomCmd:
		'<button type="button" style="margin-top:3px;margin-bottom:3px; margin-right:3px;" '+ 'command="customBtnCmd" '+
		'class="toolbarBtn btn btn-primary menuBtn pull-right glyphicon ">'+
		'</button>',		
		menuItem:
		'<li>'+
			'<a href="#" >'+
				'<span style="padding-right: 5px;">'+
				'</span>'+
			'</a>'+
		'</li>',	
		waitIndicator:
		'<div style="font-size: 20px;font-size: 10vmax;position: absolute;top: 40vh;left: 42vw;color:darkblue">'+
			'<i id="dlgWaitIndicator" class="rotateIcon invisible">'+
				'<span class="glyphicon glyphicon-refresh"></span>'+
			'</i>'+ 
		'</div>',
	    dialogContent:
		'<div id="dialogContent" style="overflow:auto;"></div>'
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


