
window.downloadFile = function (sUrl) {

    //iOS devices do not support downloading. We have to inform user about this.
    if (/(iP)/g.test(navigator.userAgent)) {
        alert('Your device does not support files downloading. Please try again in desktop browser.');
        return false;
    }

    //If in Chrome or Safari - download via virtual link click
    if (window.downloadFile.isChrome || window.downloadFile.isSafari) {
        //Creating new link node.
        var link = document.createElement('a');
        link.href = sUrl;

        if (link.download !== undefined) {
            //Set HTML5 download attribute. This will prevent file from opening if supported.
            var fileName = sUrl.substring(sUrl.lastIndexOf('/') + 1, sUrl.length);
            link.download = fileName;
        }

        //Dispatching click event.
        if (document.createEvent) {
            var e = document.createEvent('MouseEvents');
            e.initEvent('click', true, true);
            link.dispatchEvent(e);
            return true;
        }
    }

    // Force file download (whether supported by server).
    if (sUrl.indexOf('?') === -1) {
        sUrl += '?download';
    }

    window.open(sUrl, '_self');
    return true;
}
window.downloadFile.isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
window.downloadFile.isSafari = navigator.userAgent.toLowerCase().indexOf('safari') > -1;



function getUrlBase()
{
    var host = $(location).attr('host');
    var protocol = $(location).attr('protocol');
    var pathname = $(location).attr('pathname');
    var rootPrefix = "";
	var dfmwebprefix = ((location.href.indexOf("/dfm_web/")!=-1)?"/dfm_web/":"/");
    var url = protocol+"//"+host+dfmwebprefix;   
    return url;
}


function getUrlDfStorageServer()
{
    var baseUrl = getUrlBase();
    var dfStSrvUrl = baseUrl + "DFStorageServer"; 
    return dfStSrvUrl;
}


function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}
/*
function stringFormat(formatStr,args)
{
    var formatted = formatStr;
    for( var arg in args ) {
        formatted = formatted.replace("{" + arg + "}", args[arg]);
    }
    return formatted;
}
*/

function stringFormat(formatStr,args)
{
    return formatStr.replace(/{(\d+)}/g, function(match, number) {
        return typeof args[number] != 'undefined' ? args[number] : match;
    });
}

function isEmptyOrUndefined(s)
{
    if (typeof s == "undefined") return true;
    if (s == "") return true;
    return false;
}

function requestStack()
{
    this.stack = [];
    this.pushElement = function(obj)
    {
        this.stack.push(obj);
    };
    this.popElement = function(id)
    {
        var notFound = true;
        for(i=0;i<this.stack.length;i++)
        {
            var item = this.stack[i];
            if (id==null && item.id==null)
            {
                this.stack.splice(i,1);
                notFound = false;
                break;
            }
            if (item.id == id)
            {
                this.stack.splice(i,1);
                notFound = false;
                break;
            }
        }
        if (notFound)
        {
            console.log("requestStack.popElement notFound error id="+id);
            return false;
        }
        console.log("requestStack.popElement OK id="+id);
        return true;
    };
    this.isEmpty = function()
    {
        return this.stack.length == 0;
    }
}

$.fn.textWidth = function(text, font) {
    if (!$.fn.textWidth.fakeEl) $.fn.textWidth.fakeEl = $('<span>').hide().appendTo(document.body);
    $.fn.textWidth.fakeEl.text(text || this.val() || this.text()).css('font', font || this.css('font'));
    return $.fn.textWidth.fakeEl.width();
};


function compileTemplate(templStr,model)
{
     var dlgclass = Backbone.View.extend({template:templStr});
     var dlginstance = new dlgclass({model:model});
     dlginstance.template = _.template(templStr);
     htmlStr = dlginstance.template();
     return htmlStr;
}

function AppHelper_BuildFilterExpression(exprList,fields)
{
	var strExpr = "";
	
	this.getField = function(fieldName,fields)
	{
		for(var i=0;i<fields.length;i++)
		{
			field = fields[i];
			if (fieldName.toLowerCase()==field.name.toLowerCase()) return field;
		}
		return null;
	};
		
	
	for(var i = 0;i<exprList.length;i++)
	{
	 var exprItem = exprList[i];
	 var strExprItem = "";
	 if (exprItem.condition == "FROM;TO")
	 {
		var valuewholeValue = exprItem.value;
		var values = exprItem.value.match(/\s*(\d+[,.]*\d+)\s*;\s*(\d+[,.]*\d+)/); 
		if (values == null || values.length<2 ) values = ["","error","error"]; 
		strExprItem = stringFormat("{0} ({1}>={2} AND {1}<={3})",
					   [exprItem.andOr,exprItem.fieldName,values[1],values[2]]);
	 }
	 else
	 {
		fldObj = this.getField(exprItem.fieldName,fields);
		var value = exprItem.value;
		if(fldObj.type == "String")
		{
			value = '"'+value+'"';
		}
		strExprItem = stringFormat("{0} {1} {2} {3}",
					   [exprItem.andOr,exprItem.fieldName,exprItem.condition,value]);
	 }
	 strExpr += ((strExpr)?" ":"")+strExprItem; 
	}
	return strExpr;
	
}

function AppHelper_compileMacro(macro,doc)
{
	var buffer="";
	var currVariableName = "";
	var isVariableStarted = false;
	var calculatedValue = "";
	var errMessage = "";
	for(var i=0;i<macro.length;i++)
	{
		var c = macro.charAt(i);
		if (c=="{") 
		{
			isVariableStarted=true;
			continue;
		}
		if (c=="}")
		{
			isVariableStarted = false;
			if (doc.hasOwnProperty(currVariableName))
			{
				var fldValue = doc[currVariableName];
				fldValue = fldValue.trim();
				c=fldValue;
			}
			else
			{
				if (errMessage!="") errMessage = errMessage+"\r\n";
				var formatStr = App.localeData.errFieldOrVariableIsNotFound; 
				errMessage += stringFormat(formatStr,[currVariableName]); 
			}
			currVariableName = "";
		}
		if (isVariableStarted)
		{
			currVariableName+=c;	
			continue;
		}
		calculatedValue+=c;
	}
	var rv = {data:calculatedValue,errorStr:errMessage};
	return rv;
}

//selPickerCfg = 
//{
//  dataField:"",
//  validate:"",
//	captionsArray:[],
//  captionDataMember:null,
//	valuesArray:[],
//  valueDataMember:null
//}
function AppHelper_compileSelectPicker(selPickerCfg)
{
		var $mainTemplate = 
			$(
				'<select class="selectpicker" data-width="auto" tabindex="-98">'+
				'</select>'
			 );
		if (selPickerCfg.dataField && !selPickerCfg.notBindable)
			$mainTemplate.addClass("bindable");
	
	    $mainTemplate.attr("dataField",selPickerCfg.dataField);
	    if (selPickerCfg.datawidth)
		{
			$mainTemplate.attr("data-width",selPickerCfg.datawidth);
		}
		if (selPickerCfg.validate)
			$mainTemplate.attr("validate",selPickerCfg.validate);
		if (selPickerCfg.multiple)
			$mainTemplate.attr("multiple",selPickerCfg.multiple);
	 
		
		for(var i = 0;i<selPickerCfg.captionsArray.length;i++)
		{
			var cptItem = selPickerCfg.captionsArray[i];
			var cptStr = cptItem;
			var valStr = cptItem;
			if (selPickerCfg.captionDataMember) 
			{
				cptStr = cptItem[selPickerCfg.captionDataMember];
				valStr = cptStr;
			}
			if (selPickerCfg.valuesArray)
			{
				var valItem = selPickerCfg.valuesArray[i];
				if (selPickerCfg.valueDataMember)
				{
					valStr = valItem[selPickerCfg.valueDataMember];
				}
			}
			
			var $itemTemplate =$('<option></option>');
			$itemTemplate.attr("value",valStr); 
			$itemTemplate.attr("dataIndex",i); 
			$itemTemplate.text(cptStr); 
			$mainTemplate.append($itemTemplate);
		}
		return $mainTemplate[0].outerHTML;
}

function AppHelper_GetDocTypeIcon(extention)
{	
	var ext = extention.toLowerCase();
	if (ext.lastIndexOf(".")>-1)
		ext = ext.substr(ext.lastIndexOf(".")+1);
	if (ext=="htm") ext = "html";
	if (ext=="jpg") ext = "jpeg";
	if (ext=="p7k" || ext=="m7m" || ext=="b64") ext = "p7m";
	var path="DWCM/image/DocTypeIcons/";
	var rv = path+"unknown.svg";
	if (AppHelper_IsViewableDocType(ext)) rv = path+ext+".svg";
	return rv; 
}

function AppHelper_GetDownloadUrlAttachment(att)
{
	var servletName = "FileViewerServlet";
	var attUrl = getUrlBase()+servletName+"?sessionId="+App.getSessionId()+"&docId="+att.sys_docId+"&attachment="+att.name;
	return attUrl;
}

function AppHelper_getValueFromChain(modelObjOrAttr,strChain)
{
	this.getValue = function(modelObjOrAttr,fldName)
	{
		if (typeof(modelObjOrAttr.get)=="function")
		{
			// it is backbone model
			return modelObjOrAttr.get(fldName);
		}
		else
		{
			// it is Attr object
			return modelObjOrAttr[fldName];
		}
	}
	if (!strChain)
		var s="stop";
	if (strChain.includes("."))
	{
		var fldChain = strChain.split(".");
		
		var chObj = this.getValue(modelObjOrAttr,fldChain[0]);
		for (var j=1;j<fldChain.length;j++)
		{
			var fldName = fldChain[j];
			chObj = chObj[fldName];
		}
		value = chObj;
	}
	else
	{
		value = this.getValue(modelObjOrAttr,strChain);
	}
	return value;
}

function AppHelper_GetViewUrl(row)
{
	var ext = row.sys_docType.toLowerCase();
	if (!AppHelper_IsViewableDocType(ext)) return null;
	var servletName = "FileViewerServlet";
	if (AppHelper_IsViewableDocViaPdfConverting(ext)) servletName = "GetDocumentAsPdf";
	var docUrl = getUrlBase()+servletName+"?sessionId="+App.getSessionId()+"&docId="+row.sys_docId;
	var viewUrl = "";
	if (ext=="pdf" || AppHelper_IsViewableDocViaPdfConverting(ext))
	{
		//viewUrl = getUrlBase() + "DWCM/PDF.js/web/viewer_dwcm.html?file=" + docUrl;
		viewUrl = getUrlBase() + "DWCM/ViewerJS/#" + docUrl;
	}
	else 
	{
		viewUrl = docUrl;	
	}
	return viewUrl;
}

function AppHelper_GetViewUrlAttachment(att)
{
	var ext = att.sys_attType.toLowerCase();
	if (!AppHelper_IsViewableDocType(ext)) return null;
	var servletName = "FileViewerServlet";
	if (AppHelper_IsViewableDocViaPdfConverting(ext)) servletName = "GetDocumentAsPdf";
	var docUrl = getUrlBase()+servletName+"?sessionId="+App.getSessionId()+"&docId="+att.sys_docId+"&attachment="+att.name;
	var viewUrl = "";
	if (ext=="pdf" || AppHelper_IsViewableDocViaPdfConverting(ext))
	{
		//viewUrl = getUrlBase() + "DWCM/PDF.js/web/viewer_dwcm.html?file=" + docUrl;
		viewUrl = getUrlBase() + "DWCM/ViewerJS/#" + docUrl;
	}
	else 
	{
		viewUrl = docUrl;	
	}
	return viewUrl;
}

function AppHelper_getStaticResource(relativeUrl,handler)
{
	var dfmwebprefix = ((location.href.indexOf("/dfm_web/")!=-1)?"/dfm_web/":"/");
    var token = {
        _this: this,
        _relativeUrl: relativeUrl,
        _handler: handler
    };
	var getStaticResServlet = "GetStaticRes_dwcm?Module=";
	if (startedFromVSCode){
		dfmwebprefix = "";
		getStaticResServlet = "";
	}
    if (relativeUrl == null) return;
    $.ajax({
    url: dfmwebprefix+getStaticResServlet+relativeUrl,
    type: "GET",
    contentType: "text/html",
    dataType: "text",  
    dataToken: token,    
    success: function(data)
    {
        if (this.dataToken._handler!=null) this.dataToken._handler.call(this.dataToken._this,data,this.dataToken._relativeUrl);
    },
    error: function onError(jqXHR, textStatus )
    {
        if (handler!=null) handler.call(this.dataToken,null);
    },        
    processData: false
    });
}

function AppHelper_IsMobileOrTablet()
{
var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|xiaomi|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;	
}

function AppHelper_isPortrait()
{
	return $(window).height()>$(window).width();
}

function AppHelper_IsSimpleDocFile(extention)
{
	var ext = extention.toLowerCase();
	if (ext.lastIndexOf(".")>-1)
		ext = ext.substr(ext.lastIndexOf(".")+1);	
	fileTypes = ["txt","xml","htm","html","jpg","jpeg","bmp","png","gif"];
	for(var i=0;i<fileTypes.length;i++)
	{
		if (ext == fileTypes[i]) return true;
	}
	return false;
}

function AppHelper_IsViewableDocViaPdfConverting(extention)
{
	var ext = extention.toLowerCase();
	if (ext.lastIndexOf(".")>-1)
		ext = ext.substr(ext.lastIndexOf(".")+1);	
	
	fileTypes = ["doc","rtf","msg","eml"];
	for(var i=0;i<fileTypes.length;i++)
	{
		if (ext == fileTypes[i]) return true;
	}
	return false;
}

function AppHelper_IsViewableDocViaDocLens(extention)
{
	var ext = extention.toLowerCase();
	if (ext.lastIndexOf(".")>-1)
		ext = ext.substr(ext.lastIndexOf(".")+1);	
				 
	fileTypes = ["pdf", "doc", "p7m","p7x","p7k","m7m","xls","b64"];
	var volModel = Appc.getActiveVolumeModelObject();
	var volCfg = volModel.get("volConfig");
	if (volCfg && volCfg.isPassiveFpaVolume) {
		fileTypes.push("xml");
	}

	for(var i=0;i<fileTypes.length;i++)
	{
		if (ext == fileTypes[i]) return true;
	}
	return false;
}

function AppHelper_IsViewableDocType(extention)
{
	var ext = extention.toLowerCase();
	if (ext.lastIndexOf(".")>-1)
		ext = ext.substr(ext.lastIndexOf(".")+1);	
	var rv = ext == "pdf" || AppHelper_IsSimpleDocFile(ext) || AppHelper_IsViewableDocViaPdfConverting(ext) || AppHelper_IsViewableDocViaDocLens(ext); 
	return rv;
}

function AppHelper_RemoveWholeMainPaneDialog()
{
	var dlgList = $(".WholeMainPaneDialog");
	if (!dlgList || dlgList.length==0) return;
	var lastIndex = (dlgList.length-1);
	$(dlgList[lastIndex]).find("button").off("click");
	dlgList[lastIndex].remove();
	if (dlgList.length<=1)
	{
		$("#mpall").removeClass("nullHeight");
		$("#mpMainPane").removeClass("nullHeight"); 
	}
}

function AppHelper_ScrollToVisibleArea(
	viewPortContainerSelector,
	elementSelector)
{
	var padding = 20; 
	var $vp = $(viewPortContainerSelector);
	var topBound = $vp.offset().top + padding;
	var btmBound = $vp.offset().top + $vp.height() - padding;
	var scrollTop = $vp.scrollTop()
	
	
	var $el = $(elementSelector);
	var elTop = $el.offset().top - scrollTop;
	var elBtm = elTop + $el.height();
	
	if (topBound<elTop && elBtm<btmBound)
	{
		//element is located in visible part, do nothing
		return;
	}
	// element is out of the screen, scroll it	
	var newScrollTop = 0;
	newScrollTop = scrollTop + (elTop - topBound);
	$vp.scrollTop(newScrollTop);
}

function AppHelper_Settings_GetResourceAsBool(resourceName,defaultValue)
{
    var rv = localStorage.getItem(resourceName);
    if (rv==null) return defaultValue;
    return rv.toLowerCase() == 'true';
}

function AppHelper_Settings_GetResourceAsInt(resourceName,defaultValue)
{
    var rv = localStorage.getItem(resourceName);
    if (rv==null) return defaultValue;
    return parseInt(rv);
}

function AppHelper_Settings_GetStrResource(resourceName,defaultValue)
{
    var rv = localStorage.getItem(resourceName);
    if (rv!=null) return rv;
    return defaultValue;
}

function AppHelper_setValueToChain(modelObjOrAttr,strChain,newValue,options)
{
	this.getValue = function(modelObjOrAttr,fldName)
	{
		if (typeof(modelObjOrAttr.get)=="function")
		{
			// it is backbone model
			return modelObjOrAttr.attributes[fldName];
		}
		else
		{
			// it is Attr object
			return modelObjOrAttr[fldName];
		}
	}
	this.setValue = function(modelObjOrAttr,fldName,fldVal,options)
	{
		if (typeof(modelObjOrAttr.get)=="function")
		{
			// it is backbone model
			modelObjOrAttr.set(fldName,fldVal,options);
		}
		else
		{
			// it is Attr object
			modelObjOrAttr[fldName] = fldVal;
		}
	}

	var fldRootName = strChain;
	if (strChain.includes("."))
	{
		var fldChain = strChain.split(".");
		fldRootName = fldChain[0];
		var chObj = this.getValue(modelObjOrAttr,fldRootName);
		var rootObj = chObj;
		for (var j=1;j<fldChain.length-1;j++)
		{
			var fldName = fldChain[j];
			chObj = chObj[fldName];
		}
		var lastChainFldName = fldChain[fldChain.length-1];
		chObj[lastChainFldName]=newValue;
		newValue = rootObj;
	}
	this.setValue(modelObjOrAttr,fldRootName,newValue,options);
}

function AppHelper_ShowAttachment(att)
{
	var ext = att.sys_attType.toLowerCase();
	var viewUrl = AppHelper_GetViewUrlAttachment(att);
	if (viewUrl == null) return;
	if (ext=="pdf" || AppHelper_IsViewableDocViaPdfConverting(ext))
		AppHelper_ShowHidePdfDocument("show",[viewUrl]);
	else
		AppHelper_ShowSimpleDocument(viewUrl);
}


function AppHelper_ShowDialog(strDialogId,arrFormatParams,handlerFunc)
{
     var strHtml = stringFormat(App.Templates.dialogs[strDialogId],arrFormatParams);
     $('#'+strDialogId).remove();
     $('body').append(strHtml);
     $('#'+strDialogId).modal('show');
     if (handlerFunc!=null)
        $('#'+strDialogId).on("click",".btn",strDialogId,handlerFunc);
}

function AppHelper_ShowDialogEx(strDialogId,model,center,handlerFunc)
{
     $('#'+strDialogId).remove();
     var strHtml = App.Templates.dialogs[strDialogId];
     strHtml = compileTemplate(strHtml,model);
     $('body').append(strHtml);
     if (model)
     {
         $('#'+strDialogId).off('change', '.bindable').on('change', '.bindable' , model.onChangedByView);
     }

     $('#'+strDialogId).modal('show');
     //center the modal dialog window in the screen
     if (center)
     {
         $('#'+strDialogId).off('shown.bs.modal').on('shown.bs.modal',
         function(e)
         {
             var wh = $(window).height();
             var dh = parseInt($(this).find('.modal-content').css('height'));
             var dm = parseInt($(this).find('.modal-dialog').css('margin-top'));
             $(this).find('.modal-content').css('top',(wh-dh-dm)/3);
         }
        );
     }
     if (handlerFunc!=null)
        $('#'+strDialogId).on("click",".btn",strDialogId,handlerFunc);
}

function AppHelper_ShowDocument(row)
{
	
	var ext = row.sys_docType.toLowerCase();
	
	if (AppHelper_IsViewableDocViaDocLens(ext))
	{
		AppHelper_ShowDocumentViaDocLens(row);
		return;
	}
	
	var viewUrl = AppHelper_GetViewUrl(row);
	if (viewUrl == null) return;
	
	if (ext=="pdf" || AppHelper_IsViewableDocViaPdfConverting(ext))
	{
		AppHelper_ShowHidePdfDocument("show",[viewUrl]);
	}
	else
	{
		//AppHelper_ShowSimpleDocument(viewUrl);
		window.open(viewUrl, '_blank');
	}
}

function AppHelper_ShowDocumentViaDocLens(dataObject,dataToken)
{
	$("body").waitDialog({onCancelButtonClicked:
						  function()
						  {
							  var docUrl=$("#waitDlg #cancelButton").attr("docUrl");
							  if (docUrl)
							  {
								  window.open(docUrl, '_blank');
							  }
						  }
						 });	
	var servletName = "ViewDocViaDocLens";
	if (dataObject.type && dataObject.type=="historyMessage"){
		var url = getUrlBase()+servletName+"?sessionId="+App.getSessionId()+dataObject.urlSuffix;
	}else{
		// dataObject is row of dataGrid
		url = getUrlBase()+servletName+"?sessionId="+App.getSessionId()+"&docId="+dataObject.sys_docId;
	}
	
    $.ajax({
    url: url,
    type: "GET",
    contentType: "text/xml",
    dataType: "xml",    
    dataToken:dataToken,    
    complete: function onError(jqXHR, textStatus )
    {
	  try
	  {
		var result = $.parseJSON(jqXHR.responseText)	
		if (!result.isSucceded)
		{
	  	  $("body").waitDialog("remove");
		  showError(jqXHR.responseText);	
		  return;
		}
		if ($("#waitDlg").length>0)  
		{
			$("body").waitDialog("remove");
			iframeHtml =
				'<iframe src="<%= this.model.url %>" '+
					'style="width: 100%;height: 95%;">'+
				'</iframe>';
			var contentHtml = compileTemplate(iframeHtml,{url:result.url});
			$("#dialogContLvl1").dwcmDialog({
				title:'',
				buttons:{btnOk:false,btnCancel:true,btnMenu:false},
				contentHtml: contentHtml
			});
		}
	  }
	  catch(err)
	  {
	  	  $("body").waitDialog("remove");		
		  showError(jqXHR.responseText);	
	  }	
    },        
    processData: false
    });    
}

function AppHelper_JsonWs(argsObject,dataToken,handlerFunc)
{
	var dataTokenWrap = {dataToken:dataToken,handlerFunc:handlerFunc}; 
	var servletName = "JsonWs";
	var url = getUrlBase()+servletName+"?sessionId="+App.getSessionId();
	for (var key in argsObject) 
	{
		url+= stringFormat("&{0}={1}",[key,argsObject[key]]);
	}
    $.ajax({
    url: url,
    type: "GET",
    dataToken:dataTokenWrap,    
    complete: function (jqXHR, textStatus )
    {
	  try
	  {
		var result = $.parseJSON(jqXHR.responseText)	
		if (!result.bResult)
		{
		  showError(jqXHR.responseText);	
		  return;
		}
		if (this.dataToken && this.dataToken.handlerFunc)
		{
			this.dataToken.handlerFunc(result,this.dataToken.dataToken);
		}
	  }
	  catch(err)
	  {
	  	  $("body").waitDialog("remove");		
		  showError(jqXHR.responseText);	
	  }	
    },        
    processData: false
    });    
}

function AppHelper_JsonWsEx(methodName,dataObject,handlerFunc,context,notShowErr,tokenObj)
{
	var dataTokenWrap = {context:context,handlerFunc:handlerFunc,notShowErr:notShowErr,tokenObj:tokenObj}; 
	var servletName = "JsonWs";
	var url = getUrlBase()+servletName+"?sessionId="+App.getSessionId()+"&method="+methodName;
	var jsonData = JSON.stringify(dataObject); 
    $.ajax({
    url: url,
    type: "POST",
	data: jsonData,	
	dataToken:dataTokenWrap,	
    success: function (resultObj,textStatus,jqXHR)
    {
	  //try
	  //{
		if (!resultObj.bResult && !this.dataToken.notShowErr)
		{
		  showError(jqXHR.responseText);	
		}
		if (this.dataToken)
		{
			this.dataToken.handlerFunc.apply(this.dataToken.context,[resultObj,this.dataToken.tokenObj]);
		}
	  //}
	  /*	
	  catch(err)
	  {
	  	  $("body").waitDialog("remove");		
		  showError(textStatus+" "+jqXHR.responseText);	
	  }	
	  */
    },        
	error: function(jqXHR,textStatus,errObject)
	{
	  	$("body").waitDialog("remove");		
		showError("AppHelper_JsonWsEx " + textStatus+" "+jqXHR.responseText);	
	},
    processData: false
    });    
}


function AppHelper_ShowHidePdfDocument(strCmd,arrFormatParams)
{
     var strDialogId = "PdfViewer";
     $('#'+strDialogId).remove();
     $(".fixed-table-pagination").show();
     if (strCmd=="show")
     {
         //var strHtml = stringFormat(App.Templates.dialogs[strDialogId],arrFormatParams);
         //$(".fixed-table-pagination").hide();
         //$('body').append(strHtml);
		 var viewUrl = arrFormatParams[0];
		 window.open(viewUrl, '_blank');
     }
}

function AppHelper_ShowWholeMainPaneDialog(
modelObject,onAppendHandler,renderMenuHandler,dataToken)
{
	$("#mpall").addClass("nullHeight"); //hide panes
	$("#mpMainPane").addClass("nullHeight"); //hide panes
	var containerHtml = App.Templates.dialogs[Appn.Dialogs.WholeMainPaneDialog];
	if(modelObject.titleIcon){
		modelObject.titleIconHtml = '<span class="glyphicon '+modelObject.titleIcon+'"></span>';
	}
    containerHtml = compileTemplate(containerHtml,modelObject);
	$("body").append(containerHtml);
	if (onAppendHandler) onAppendHandler(dataToken);
	var dlgList = $(".WholeMainPaneDialog");
	if (!dlgList) return;
	var lastIndex = (dlgList.length-1);
	$(dlgList[lastIndex]).find("button.toolbarBtn").on("click",
			function()
			{
				if ($(this).hasClass("menuBtn"))
				{
					// it is menu button, render menu items
					if (renderMenuHandler) renderMenuHandler();
				}
				else
				{	// it is "x" button
					// close dialog window, restore main pane
					AppHelper_RemoveWholeMainPaneDialog();
				}
			}
		   );
}

function AppHelper_ShowSimpleDocument(url)
{
	$("#SimpleDocViewer").remove();
	var strHtml = stringFormat(App.Templates.dialogs["SimpleDocViewer"],[App.localeData.dgrid_menuCmd_ViewDocument,url]);
	$("body").append(strHtml);
	$("#SimpleDocViewer button").off("click").on("click",function()
	{
		$("#SimpleDocViewer").remove();	
	});
}

function AppHelper_VolumeSettingsClass(volumeName)
{
	if (!volumeName)
	{
		volumeName = Appc.getCurrVolumeName();
	}
	this.volumeName = volumeName;
	this.getResName = function()
	{
		return "StdVolSettings_"+this.volumeName;
	}
	
    var data = localStorage.getItem(this.getResName());
	this.settings = {
		SearchExpression:"",
		nameGenRule:"",
		massiveSendingMap:
		{
			to:"",
			cc:"",
			bcc:"",
			title:"",
			messageBody:"",
			includeAttachments:false
		},
		pecSendingCfg:
		{
			useMacro:false,
			subjectMacro:"",
			bodyMacro:"",
			includeMainDoc:true,
			includeAttachments:false
		}
	};
    if (data!=null)
	{
		try
		{
			var storedSettings = $.parseJSON(data);
			if (storedSettings && !storedSettings.massiveSendingMap)
				storedSettings.massiveSendingMap = this.settings.massiveSendingMap;
			if (storedSettings && !storedSettings.pecSendingCfg)
				storedSettings.pecSendingCfg = this.settings.pecSendingCfg;
			$.extend(this.settings, storedSettings);
		}
		catch(e)
		{
			
		}
	}
	this.save = function()
	{
		localStorage.setItem(this.getResName(),JSON.stringify(this.settings));
	}
}

function AppHelper_HtmlEnDeCode() {
    var charToEntityRegex,
        entityToCharRegex,
        charToEntity,
        entityToChar;

    function resetCharacterEntities() {
        charToEntity = {};
        entityToChar = {};
        // add the default set
        addCharacterEntities({
            '&amp;'     :   '&',
            '&gt;'      :   '>',
            '&lt;'      :   '<',
            '&quot;'    :   '"',
            '&#39;'     :   "'"
        });
    }

    function addCharacterEntities(newEntities) {
        var charKeys = [],
            entityKeys = [],
            key, echar;
        for (key in newEntities) {
            echar = newEntities[key];
            entityToChar[key] = echar;
            charToEntity[echar] = key;
            charKeys.push(echar);
            entityKeys.push(key);
        }
        charToEntityRegex = new RegExp('(' + charKeys.join('|') + ')', 'g');
        entityToCharRegex = new RegExp('(' + entityKeys.join('|') + '|&#[0-9]{1,5};' + ')', 'g');
    }

    function htmlEncode(value){
        var htmlEncodeReplaceFn = function(match, capture) {
            return charToEntity[capture];
        };

        return (!value) ? value : String(value).replace(charToEntityRegex, htmlEncodeReplaceFn);
    }

    function htmlDecode(value) {
        var htmlDecodeReplaceFn = function(match, capture) {
            return (capture in entityToChar) ? entityToChar[capture] : String.fromCharCode(parseInt(capture.substr(2), 10));
        };

        return (!value) ? value : String(value).replace(entityToCharRegex, htmlDecodeReplaceFn);
    }

    resetCharacterEntities();

    return {
        htmlEncode: htmlEncode,
        htmlDecode: htmlDecode
    };
}


AppHelper_Validate=
{
	stringAsInteger: function(attr,name,errorArray,convertToInt)
	{
		if (typeof(attr[name])=="string")
		{
			var strValue = attr[name];
			var intValue = parseInt(strValue);
			if (strValue.search(/\s*\d+$/) || isNaN(intValue))
			{
				var strErr = stringFormat(App.localeData.errFormat_IsNotInteger,[strValue]);
				errorArray.push({name:name,message:strErr});
				return;
			}
		}
	},
	notEmpty: function(attr,name,errorArray)
	{
		if (!App.localeData) return; //app is not initialized yet
		if (!AppHelper_getValueFromChain(attr,name))
		{
			var strErr = App.localeData.errFormat_IsEmpty;
			errorArray.push({name:name,message:strErr});
		}
	}
	
}


AppHelper_WholeMainPaneDialog=
{
	//value=<%= App.Models.settings.get(Appn.Model.Settings.doclistPageSize) %> 
	setValues_ModelToGui:function(model,token)
	{
		var rootNodeSelector = ".WholeMainPaneDialog";
		if (token && token.rootNodeSelector) rootNodeSelector = token.rootNodeSelector;
		
		var inputControlsArray = $(rootNodeSelector+" .bindable");
		for(var i=0;i<inputControlsArray.length;i++)
		{
			var $inpCtrl = $(inputControlsArray[i]);
			var dataField = "";
			var value = "";
			var controlType = "textBox";
			if ($inpCtrl.prop("tagName")=="DIV")
			{
				controlType = "select";
				dataField = $inpCtrl.find("select").attr("dataField")
			}
			else if ($inpCtrl.prop("tagName")=="SELECT")
			{
				continue; //do nothing, it was already processed as "DIV"
			}
			else
			{
				controlType = $inpCtrl.attr("type");
				dataField = $inpCtrl.attr("dataField");
			}
			
			value = AppHelper_getValueFromChain(model,dataField);
			
			if (controlType=="checkbox")
			{
				if ($inpCtrl.attr("checkedValue")==null)
					$inpCtrl.prop("checked", value);
				else{
					$inpCtrl.prop("indeterminate", false);
					$inpCtrl.prop("checked", value==$inpCtrl.attr("checkedValue"));
					if (value!=$inpCtrl.attr("checkedValue") && value!=$inpCtrl.attr("uncheckedValue"))
						$inpCtrl.prop("indeterminate", true);
				}
			}
			else if (controlType=="radio")
			{
				$inpCtrl.prop("checked", ($inpCtrl.prop("value")==value));
			}
			else if(controlType=="select")
			{
				var selector = stringFormat("select option[value='{0}']",[value]);
				var strValue = $inpCtrl.find(selector).attr("value");
				var dataIndex = parseInt($inpCtrl.find(selector).attr("ataIndex"));
				var selCtrl = $inpCtrl.find("select.selectpicker");
				$(selCtrl).on("loaded.bs.select",{selCtrl:selCtrl,strValue:strValue},function(e)
					  {
						$(e.data.selCtrl).selectpicker("val",e.data.strValue);
					  }
							 );
			}
			else
			{
				$inpCtrl.prop("value",value);	
			}
		}
	},
	setValues_GuiToModel:function(model,token)
	{
		AppHelper_WholeMainPaneDialog.removeErrors();
		var rootNodeSelector = ".WholeMainPaneDialog";
		if (token && token.rootNodeSelector) rootNodeSelector = token.rootNodeSelector;
		$(rootNodeSelector+" .inlineError").remove();
		var inputControlsArray = $(rootNodeSelector+" .bindable");
		var rv = true;
		for(var i=0;i<inputControlsArray.length;i++)
		{
			var $inpCtrl = $(inputControlsArray[i]);
			var dataField = $inpCtrl.attr("dataField");
			var value = null;
			var tagName = $inpCtrl.prop("tagName").toUpperCase();
			var validateOnViewLevel = $inpCtrl.attr("validate");
			if (!validateOnViewLevel)
			{
				validateOnViewLevel = $inpCtrl.find("select.selectpicker").attr("validate")
			}
			if ( tagName == "INPUT" || tagName == "TEXTAREA")
			{
				if ($inpCtrl.attr("type")=="checkbox")
				{
					if ($inpCtrl.attr("checkedValue")==null){
						value =  $inpCtrl.prop("checked");
					}else{
						if ($inpCtrl.prop("checked"))
							value = $inpCtrl.attr("checkedValue");
						else{
							if ($inpCtrl.attr("uncheckedValue")==null)
								value = "";
							else
								value = $inpCtrl.attr("uncheckedValue");
						}
					}
						
				}
				else if($inpCtrl.attr("type")=="radio")
				{
					if (!$inpCtrl.prop("checked")) continue;
					value = $inpCtrl.prop("value");
				}
				else
				{
					value = $inpCtrl.prop("value");	
				}
			}
			else
			{
				if (tagName == "SELECT") continue;
				if ($inpCtrl.hasClass("bootstrap-select"))
				{
					//combobox
					var selectedIndex = $inpCtrl.find("ul li.selected").attr("data-original-index");
					var selector = stringFormat("select option[dataIndex='{0}']",[selectedIndex]);
					dataField = $inpCtrl.find("select").attr("dataField");
					value = $inpCtrl.find(selector).attr("value");
				}
			}
			
			if (validateOnViewLevel)
			{
				var viewLvlErrs = [];
				var jsonstr = '{"'+dataField+'":"'+((value)?value:"")+'"}';
				var fakeModelObj = JSON.parse(jsonstr);
				AppHelper_Validate[validateOnViewLevel](fakeModelObj,dataField,viewLvlErrs);
				var matchedErrs = AppHelper_WholeMainPaneDialog.findDataFieldError(viewLvlErrs,dataField);
				if (matchedErrs.length>0)
				{
					AppHelper_WholeMainPaneDialog.showErrors($inpCtrl,matchedErrs);
					rv = false;
					continue
				}	
				var opt = {validate:false,errors:null,token:token};
				AppHelper_setValueToChain(model,dataField,value,opt);				
				continue;
			}
			var opt = {validate:true,errors:null,token:token};
			AppHelper_setValueToChain(model,dataField,value,opt);
			//model.set(dataField,value,opt);
			var errors = AppHelper_WholeMainPaneDialog.findDataFieldError(opt.errors,dataField);
			if (errors.length>0)
			{
				AppHelper_WholeMainPaneDialog.showErrors($inpCtrl,errors);
				rv = false;
			}
		}
		return rv;
	},
	updateGuiField:function(dataField,value)
	{
		var selector = stringFormat(".WholeMainPaneDialog .bindable[dataField='{0}']",[dataField]);
		$(selector).prop("value",value);
	},
	getControlsByField:function(dataField)
	{
		var selector = stringFormat(".WholeMainPaneDialog .bindable[dataField='{0}'",[dataField]);
		var rv = $(selector);	
		return rv;
	},
	findDataFieldError:function(errors,dataField)
	{
		var matchedErrors=[];
		if (errors)
		{
			for(var i=0;i<errors.length;i++)
			{
				var errObj = errors[i];
				if (errObj.name==dataField) 
				{
					matchedErrors.push(errObj);
				}
			}
		}
		return matchedErrors;
	},
	removeErrors:function()
	{
		$(".WholeMainPaneDialog .inlineError").remove();	
	},
	showErrors:function(inputCtrl,errors)
	{
		var errorsHtml = "";
		for(var i=0;i<errors.length;i++)
		{
			var errItem = errors[i];
			errorsHtml += stringFormat('<div class="inlineError">{0}</div>',[errItem.message]);
		}
		$(errorsHtml).insertAfter(inputCtrl);
	}
}

