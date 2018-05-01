var wmw = 
    {
        showMessageIfError : function(xSoapMessage,errTitle) 
        {
            if ($("faultstring",xSoapMessage.documentElement).length>0) 
            {
                var errMessage = $($("faultstring",xSoapMessage.documentElement)[0]).text();
                hideWaitIndicator();
                showError(errMessage,errTitle);
                return true;
            }
            return false;
        },
        getFaultString :function(xSoapMessage)
        {
            if ($("faultstring",xSoapMessage.documentElement).length>0) 
            {
                return $($("faultstring",xSoapMessage.documentElement)[0]).text();
            }
            return "";
        }
    }

function wmw_AttachmentDelete(sessionId,docId,attName,dataToken,handlerFunc)
{
    var dataTokenWrap = {dataToken:dataToken,handlerFunc:handlerFunc};    

    var srequestFormatStr = 
'<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
	'<SOAP-ENV:Body>' +
		'<tns:ExecuteOperation xmlns:tns="http://Df5.comped.it/">' +
			'<SessionId>{0}</SessionId>' +
			  '<sXmlParam>&lt;operation name="DeleteAttachments" docId="{1}"&gt;' +
			  '&lt;attachment name="{2}"/&gt;' +
			'&lt;/operation&gt;</sXmlParam>' +
		'</tns:ExecuteOperation>' +  
	'</SOAP-ENV:Body>' +
'</SOAP-ENV:Envelope>';    
  var strRequest = stringFormat(srequestFormatStr,[sessionId,docId,attName]);    
  wmw_soapRequest(strRequest,dataTokenWrap,
  function(bresult,responseData,dataTokenWrap)
  {
      var handlerFunc = dataTokenWrap.handlerFunc;
      var dataToken = dataTokenWrap.dataToken;
      var errorStr = "";
      var result = "";
      if (!bresult){
          errorStr = responseData;
      }
      handlerFunc(bresult,result,errorStr,dataToken);
  }
  );       
}

function wmw_ConvertFilterXmlToQuery(sessionId,volumeName,filter,dataToken,handlerFunc)
{
    var dataTokenWrap = {dataToken:dataToken,handlerFunc:handlerFunc};    

    var srequestFormatStr = 
'<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
  '<SOAP-ENV:Body>' +
	'<tns:ConvertFilterXmlToQuery xmlns:tns="http://Df5.comped.it/">'+
		'<SessionId>{0}</SessionId>' +
		'<VolumeName>{1}</VolumeName>' + 
		'<XmlFilter>&lt;?xml version="1.0" encoding="utf-8"?&gt;'+
			'&lt;Filter&gt;'+
			'&lt;maxDocsNum enabled="true" count="500"/&gt;'+
			'&lt;qbeExpression&gt;'+
			'&lt;row&gt;'+
			'{2}'+
			'&lt;/row&gt;'+
			'&lt;/qbeExpression&gt;'+
			'&lt;/Filter&gt;'+
		'</XmlFilter>'+
    '</tns:ConvertFilterXmlToQuery>'+		
  '</SOAP-ENV:Body>' +
'</SOAP-ENV:Envelope>';    
  var strRequest = stringFormat(srequestFormatStr,[sessionId,volumeName,filter]);    
  wmw_soapRequest(strRequest,dataTokenWrap,
  function(bresult,responseData,dataTokenWrap)
  {
      var handlerFunc = dataTokenWrap.handlerFunc;
      var dataToken = dataTokenWrap.dataToken;
      var errorStr = "";
      var result = null;
      if (bresult)
      {
		  result = $(responseData).text();
      }
      else
      {
          errorStr = responseData;
      }
      handlerFunc(true,result,errorStr,dataToken);
  }
  );       
}



function wmw_DocList_GetRange(sessionId,volumeId,position,count,dataObject,resultHandler)
{
var srequestFormatStr =     
"<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" "+ 
    "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">\n"+
        " <SOAP-ENV:Body>\n"+
            " <tns:DocList_GetRange xmlns:tns=\"http://Df5.comped.it/\">\n"+
                " <SessionId>{0}</SessionId>\n"+
                " <DocListId>{1}</DocListId>\n"+
                " <Pos>{2}</Pos>\n"+
                " <Count>{3}</Count>\n"+
            " </tns:DocList_GetRange>\n"+
        " </SOAP-ENV:Body>\n"+
"</SOAP-ENV:Envelope>";
var strRequest = stringFormat(srequestFormatStr,[sessionId,volumeId,position,count]);     
$.ajax({
    url: "DFStorageServer",
    type: "POST",
    contentType: "text/xml",
    context: dataObject,   
    dataType: "xml",    
    data : strRequest,
    success: function(data)
    {
        if (wmw.showMessageIfError(data,'wmw_GetRange'))
        {
            resultHandler(false,null,this);    
            return;
        }
        var xmlRows = $($("return",data));
        resultHandler(true,xmlRows,this);
    },
    error: function (jqXHR, textStatus )
    {
      showError(jqXHR.responseText,'wmw_GetRange'); 
      resultHandler(false,null,this);       
    },        
    processData: false
    });    
}

function wmw_DocumentAdd(sessionId,volumeId,metadata,dataToken,handlerFunc)
{
    //returns data-rows of specified grouping 
    var dataTokenWrap = {dataToken:dataToken,handlerFunc:handlerFunc};    

    var srequestFormatStr = 
'<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">'+
  '<SOAP-ENV:Body>'+
    '<tns:Document_Add xmlns:tns="http://Df5.comped.it/">'+
      '<SessionId>{0}</SessionId>'+
      '<DirectoryId>{1}</DirectoryId>'+
      '<SchemeId>0</SchemeId>'+
      '<Metadata>{2}</Metadata>'+
    '</tns:Document_Add>'+
  '</SOAP-ENV:Body>'+
'</SOAP-ENV:Envelope>';	
      
  var strRequest = stringFormat(srequestFormatStr,[sessionId,volumeId,metadata]);    
  wmw_soapRequest(strRequest,dataTokenWrap,
  function(bresult,responseData,dataTokenWrap)
  {
      var handlerFunc = dataTokenWrap.handlerFunc;
      var dataToken = dataTokenWrap.dataToken;
      var errorStr = "";
      var result = null;
      if (bresult)
      {
		  var result = $(responseData[0]).text();
      }
      else
      {
          errorStr = responseData;
      }
      handlerFunc(bresult,result,errorStr,dataToken);
  }
  );       
}

function wmw_DocumentDelete(sessionId,docId,dataToken,handlerFunc)
{
    var dataTokenWrap = {dataToken:dataToken,handlerFunc:handlerFunc};    

    var srequestFormatStr = 
'<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
  '<SOAP-ENV:Body>' +
    '<tns:Document_Delete xmlns:tns="http://Df5.comped.it/">' +
      '<SessionId>{0}</SessionId>' +
      '<DocumentId>{1}</DocumentId>' +
    '</tns:Document_Delete>' +
  '</SOAP-ENV:Body>' +
'</SOAP-ENV:Envelope>';    
  var strRequest = stringFormat(srequestFormatStr,[sessionId,docId]);    
  wmw_soapRequest(strRequest,dataTokenWrap,
  function(bresult,responseData,dataTokenWrap)
  {
      var handlerFunc = dataTokenWrap.handlerFunc;
      var dataToken = dataTokenWrap.dataToken;
      var errorStr = "";
      var result = "";
      if (!bresult){
          errorStr = responseData;
      }
      handlerFunc(bresult,result,errorStr,dataToken);
  }
  );       
}


function wmw_DocumentGetAttachments(sessionId,documentId,dataToken,handlerFunc)
{
    //returns data-rows of specified grouping 
    var dataTokenWrap = {dataToken:dataToken,handlerFunc:handlerFunc};    

    var srequestFormatStr = 
'<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">'+
  '<SOAP-ENV:Body>'+
    '<tns:Document_GetAttachments xmlns:tns="http://Df5.comped.it/">'+
      '<SessionId>{0}</SessionId>'+
      '<DocumentId>{1}</DocumentId>'+
    '</tns:Document_GetAttachments>'+
  '</SOAP-ENV:Body>'+
'</SOAP-ENV:Envelope>';
      
  var strRequest = stringFormat(srequestFormatStr,[sessionId,documentId]);    
  wmw_soapRequest(strRequest,dataTokenWrap,
  function(bresult,responseData,dataTokenWrap)
  {
      var handlerFunc = dataTokenWrap.handlerFunc;
      var dataToken = dataTokenWrap.dataToken;
      var errorStr = "";
      var result = null;
      if (bresult)
      {
		  var result = $(responseData[0]).text();
      }
      else
      {
          errorStr = responseData;
      }
      handlerFunc(true,result,errorStr,dataToken);
  }
  );       
}

function wmw_Document_GetZipLink(sessionId,selRows,dataToken,handlerFunc)
{
    var dataTokenWrap = {dataToken:dataToken,handlerFunc:handlerFunc};    
    var srequestFormatStr = 
'<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">'+
  '<SOAP-ENV:Body>'+
	'<tns:Document_GetZipLink xmlns:tns="http://Df5.comped.it/">'+
      '<SessionId>{0}</SessionId>'+
	  '{1}' +
    '</tns:Document_GetZipLink>' +
  '</SOAP-ENV:Body>'+
'</SOAP-ENV:Envelope>';

  var strDocumentItemFormatStr = '<DocumentIds>{0}</DocumentIds>';
  var strDocumentIds = "";
  for(var i=0; i<selRows.length; i++){
	  var strItem = stringFormat(strDocumentItemFormatStr,[selRows[i].sys_docId]);
	  strDocumentIds += strItem;
  }
  var strRequest = stringFormat(srequestFormatStr,[sessionId,strDocumentIds]);    
  wmw_soapRequest(strRequest,dataTokenWrap,
  function(bresult,responseData,dataTokenWrap)
  {
      var handlerFunc = dataTokenWrap.handlerFunc;
      var dataToken = dataTokenWrap.dataToken;
      var errorStr = "";
      var result = null;
      if (bresult)
      {
		  var result = responseData.find("link").text();
      }
      else
      {
          errorStr = responseData;
      }
      handlerFunc(bresult,result,errorStr,dataToken);
  }
  );       	
}

function wmw_Document_GetMergedPDFLink(sessionId,selRows,dataToken,handlerFunc)
{
    var dataTokenWrap = {dataToken:dataToken,handlerFunc:handlerFunc};    
    var srequestFormatStr = 
'<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">'+
  '<SOAP-ENV:Body>'+
	'<tns:Document_GetMergedPDFLink xmlns:tns="http://Df5.comped.it/">'+
      '<sessionId>{0}</sessionId>'+
	  '{1}' +
    '</tns:Document_GetMergedPDFLink>' +
  '</SOAP-ENV:Body>'+
'</SOAP-ENV:Envelope>';

  var strDocumentItemFormatStr = '<documentIds>{0}</documentIds>';
  var strDocumentIds = "";
  for(var i=0; i<selRows.length; i++){
	  var strItem = stringFormat(strDocumentItemFormatStr,[selRows[i].sys_docId]);
	  strDocumentIds += strItem;
  }
  var strRequest = stringFormat(srequestFormatStr,[sessionId,strDocumentIds]);    
  wmw_soapRequest(strRequest,dataTokenWrap,
  function(bresult,responseData,dataTokenWrap)
  {
      var handlerFunc = dataTokenWrap.handlerFunc;
      var dataToken = dataTokenWrap.dataToken;
      var errorStr = "";
      var result = null;
      if (bresult)
      {
		  var result = responseData.text();
      }
      else
      {
          errorStr = responseData;
      }
      handlerFunc(bresult,result,errorStr,dataToken);
  }
  );       	
}



function wmw_DocumentUpdateMetadata(sessionId,docId,metadata,dataToken,handlerFunc)
{
    var dataTokenWrap = {dataToken:dataToken,handlerFunc:handlerFunc};    

    var srequestFormatStr = 
'<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
	'<SOAP-ENV:Body>' +
    	'<tns:Document_UpdateMetadata xmlns:tns="http://Df5.comped.it/">'+
      		'<SessionId>{0}</SessionId>'+
      		'<DocumentId>{1}</DocumentId>'+
      		'<Metadata>{2}</Metadata>'+
	  	'</tns:Document_UpdateMetadata>'+
	'</SOAP-ENV:Body>' +
'</SOAP-ENV:Envelope>';    
  var strRequest = stringFormat(srequestFormatStr,[sessionId,docId,metadata]);    
  wmw_soapRequest(strRequest,dataTokenWrap,
  function(bresult,responseData,dataTokenWrap)
  {
      var handlerFunc = dataTokenWrap.handlerFunc;
      var dataToken = dataTokenWrap.dataToken;
      var errorStr = "";
      var result = "";
      if (!bresult){
          errorStr = responseData;
      }
      handlerFunc(bresult,result,errorStr,dataToken);
  }
  );       
}


function wmw_getDDareaMembers(sessionId,rootNodeId,dataToken,okHandler)
{
    if (rootNodeId == null) rootNodeId = "0";
    var srequestFormatStr = 
    "<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\"     xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">\n"+
" <SOAP-ENV:Body>\n"+
" <tns:Directory_GetSnapshot xmlns:tns=\"http://Df5.comped.it/\">\n"+
" <SessionId>{0}</SessionId>\n"+
" <Parent>{1}</Parent>\n"+
" </tns:Directory_GetSnapshot>\n"+
" </SOAP-ENV:Body>\n"+
"</SOAP-ENV:Envelope>";
var strRequest = stringFormat(srequestFormatStr,[sessionId,rootNodeId]);    
    var timer = new responseTimer(5000,okHandler,dataToken);
    dataToken.timer = timer;
        var request = 
    $.ajax({
    url: "DFStorageServer",
    type: "POST",
    contentType: "text/xml",
    dataType: "xml",    
    dataToken:dataToken,    
    data : strRequest,
    success: function(data)
    {
        dataToken.timer.isResponseReceived = true;
        if (dataToken.timer.isResponseExpired) return;
        var cr = new checkResponse(data);
        if (cr.bresult)
        {
            var sResultXml = $(data.documentElement).find('return')[0].textContent;
            var xResult = $.parseXML( sResultXml );
            okHandler(true,xResult,dataToken);
        }
        else
        {
            okHandler(false,cr.errorMessage,dataToken);
        }
    },
    error: function onError(jqXHR, textStatus )
    {
      dataToken.timer.isResponseReceived = true;
      if (dataToken.timer.isResponseExpired) return;    
      okHandler(false,"wmw_GetDsnList: " + jqXHR.responseText,dataToken);    
    },        
    processData: false
    });    
}


function wmw_getDDTreeNodes(sessionId,rootNode,okHandler)
{
    var rootNodeId = "0"
    if (rootNode!=null) rootNodeId = rootNode.id;
    var srequestFormatStr = 
    "<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\"     xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">\n"+
" <SOAP-ENV:Body>\n"+
" <tns:Directory_GetSnapshot xmlns:tns=\"http://Df5.comped.it/\">\n"+
" <SessionId>{0}</SessionId>\n"+
" <Parent>{1}</Parent>\n"+
" </tns:Directory_GetSnapshot>\n"+
" </SOAP-ENV:Body>\n"+
"</SOAP-ENV:Envelope>";
if (rootNodeId==null) rootNodeId = "0";
var strRequest = stringFormat(srequestFormatStr,[sessionId,rootNodeId]);    

        var request = 
    $.ajax({
    url: "../DFStorageServer",
    type: "POST",
    contentType: "text/xml",
    dataType: "xml",    
    data : strRequest,
    success: function(data)
    {
        var sResultXml = $(data.documentElement).find('return')[0].textContent;
        var xResult = $.parseXML( sResultXml );
        okHandler(xResult,rootNode);
    },
    error: function onError(jqXHR, textStatus )
    {
      alert( "wmw_GetDsnList: " + jqXHR.responseText );
    },        
    processData: false
    });
    
}

function wmw_getDocumentPreviewInfo(sessionId,documentId,okHandler,errHandler)
{
    var rootNodeId = "0"
    var srequestFormatStr = 
    "<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">\n <SOAP-ENV:Body>\n <tns:getDocumentPreviewInfo xmlns:tns=\"http://wf.comped.it/\">\n <sessionId>{0}</sessionId>\n <documentId>{1}</documentId>\n </tns:getDocumentPreviewInfo>\n </SOAP-ENV:Body>\n</SOAP-ENV:Envelope>";
if (rootNodeId==null) rootNodeId = "0";
var strRequest = stringFormat(srequestFormatStr,[sessionId,documentId]);    

        var request = 
    $.ajax({
    url: "../WfWebService",
    type: "POST",
    contentType: "text/xml",
    dataType: "xml",    
    data : strRequest,
    success: function(data)
    {
        if ($("faultstring",data).length>0)
        {
            var faultString = $($("faultstring",data)[0]).text();
            errHandler(faultString);
            return;
        }
        var strPageCount = $($("pages",data)[0]).text();
        okHandler(strPageCount);
    },
    error: function onError(jqXHR, textStatus )
    {
      alert( "wmw_GetDsnList: " + jqXHR.responseText );
    }        
    });
}


function wmw_GetDsnList(userName,dataToken,okHandler)
{
    var srequestFormatStr = 
        "<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">\n"+
" <SOAP-ENV:Body>\n"+
" <tns:GetMyDSNs xmlns:tns=\"http://Df5.comped.it/\">\n"+
" <UserName>{0}</UserName>\n"+
" </tns:GetMyDSNs>\n"+
" </SOAP-ENV:Body>\n"+
"</SOAP-ENV:Envelope>";
    var strRequest = stringFormat(srequestFormatStr,[userName]);
    
    var request = 
    $.ajax({
    url: "DFStorageServer",
    type: "POST",
    contentType: "text/xml",
    dataType: "xml",  
    dataToken:dataToken,    
    data : strRequest,
    success: function(data)
    {
        var xDsnList = data.getElementsByTagName("Name");
        var dsnList = [];
        for (var i=0; i<xDsnList.length; i++)
        {
            dsnList.push(xDsnList[i].textContent);
        }
        okHandler(dsnList,dataToken);
    },
    error: function onError(jqXHR, textStatus )
    {
      alert( "wmw_GetDsnList: " + jqXHR.responseText );
    },        
    processData: false
    });
}

function wmw_getFirstFieldValuesEx(sessionId,volumeName,fieldName,filter,dataToken,handlerFunc)
{
    var dataTokenWrap = {dataToken:dataToken,handlerFunc:handlerFunc};    

    var srequestFormatStr = 
'<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
  '<SOAP-ENV:Body>' +
	'<tns:GetFirstFieldValuesEx xmlns:tns="http://Df5.comped.it/">' +
      '<SessionId>{0}</SessionId>' +
      '<VolumeName>{1}</VolumeName>' + 
      '<FieldName>{2}</FieldName>' +
      '<Filter>{3}</Filter>' +
      '<SortOrder></SortOrder>' +
      '<MaxNumberOfValues>100</MaxNumberOfValues>' +
      '<formatValues>true</formatValues>' +
    '</tns:GetFirstFieldValuesEx>' +		
  '</SOAP-ENV:Body>' +
'</SOAP-ENV:Envelope>';    
  var strRequest = stringFormat(srequestFormatStr,[sessionId,volumeName,fieldName,filter]);    
  wmw_soapRequest(strRequest,dataTokenWrap,
  function(bresult,responseData,dataTokenWrap)
  {
      var handlerFunc = dataTokenWrap.handlerFunc;
      var dataToken = dataTokenWrap.dataToken;
      var errorStr = "";
      var result = null;
      if (bresult)
      {
		  result = responseData;
      }
      else
      {
          errorStr = responseData;
      }
      handlerFunc(true,result,errorStr,dataToken);
  }
  );       
}

function wmw_getMSD(sessionId,volumeId,sortField,order,dataObject,resultHandler,query)
{
    var sortStatement = "";
    if (sortField!=null)
    {
        sortStatement = stringFormat("&lt;Sort Type='{1}' Field='{0}'/&gt;",[sortField,order]);
    }
    
    if (!query)
    {
        // query for "all documents" 
        var defaultQueryFormatStr = 
        '&lt;dwiSearch&gt;\n'+
        '&lt;Dir&gt;{0}&lt;/Dir&gt;'+
        '&lt;type&gt;0&lt;/type&gt;'+
        '&lt;query/&gt;'+
        '&lt;fields/&gt;'+
        '{1}'+        
        '&lt;/dwiSearch&gt;';    
        query = stringFormat(defaultQueryFormatStr,[volumeId,sortStatement]);
    }
    
    var srequestFormatStr = 
        "<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">\n"+
" <SOAP-ENV:Body>\n"+
" <tns:DocList_Query xmlns:tns=\"http://Df5.comped.it/\">\n"+
" <SessionId>{0}</SessionId>\n"+
" <query>{1}</query>\n"+
" </tns:DocList_Query>\n"+
" </SOAP-ENV:Body>\n"+
"</SOAP-ENV:Envelope>\n";
    
var strRequest = stringFormat(srequestFormatStr,[sessionId,query]);    

 $.ajax({
    url: "DFStorageServer",
    type: "POST",
    contentType: "text/xml",
    context: dataObject,   
    dataType: "xml",    
    data : strRequest,
    success: function(data)
    {
        if (wmw.showMessageIfError(data,'wmw_GetMSD'))
        {
            resultHandler(false,null,this);    
            return;
        }
        var returnObj = {};
        returnObj.volId = Number($($("ID",data)[0]).text());
        returnObj.docCount = Number($($("Count",data)[0]).text());
        returnObj.sMSD = $($("XSD",data)[0]).text();
        returnObj.oMSD = new MSD(returnObj.sMSD);
        returnObj.oMSD.volumeName = $($(data).find('Schemes')).find('Name').text();
        resultHandler(true,returnObj,this);
    },
    error: function (jqXHR, textStatus )
    {
      showError(jqXHR.responseText,'wmw_GetMSD'); 
      resultHandler(false,null,this);       
    },        
    processData: false
    });
    
}

function wmw_getResidualSessionTime(sessionId,dataToken,handlerFunc)
{
    var dataTokenWrap = {dataToken:dataToken,handlerFunc:handlerFunc};    

    var srequestFormatStr = 
'<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
  '<SOAP-ENV:Body>' +
	'<tns:getResidualSessionTime xmlns:tns="http://Df5.comped.it/">' +
      	'<SessionId>{0}</SessionId>' +
	'</tns:getResidualSessionTime>' +		
  '</SOAP-ENV:Body>' +
'</SOAP-ENV:Envelope>';    
  var strRequest = stringFormat(srequestFormatStr,[sessionId]);    
  wmw_soapRequest(strRequest,dataTokenWrap,
  function(bresult,responseData,dataTokenWrap)
  {
      var handlerFunc = dataTokenWrap.handlerFunc;
      var dataToken = dataTokenWrap.dataToken;
      var errorStr = "";
      var result = -1;
      if (bresult)
      {
		  result = parseInt(responseData.text());
      }
      else
      {
          errorStr = responseData;
      }
      handlerFunc(bresult,result,errorStr,dataToken);
  }
  );       
}

function wmw_getServerVersion(dataToken,handlerFunc)
{
	var dataTokenWrap = {dataToken:dataToken,handlerFunc:handlerFunc};    
	var srequestFormatStr = 
'<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">'+
  '<SOAP-ENV:Body>'+
    '<tns:GetServerVersion xmlns:tns="http://Df5.comped.it/"/>'+
  '</SOAP-ENV:Body>'+
'</SOAP-ENV:Envelope>';
var strRequest = srequestFormatStr;	
wmw_soapRequest(strRequest,dataTokenWrap,
  function(bresult,responseData,dataTokenWrap)
  {
      var handlerFunc = dataTokenWrap.handlerFunc;
      var dataToken = dataTokenWrap.dataToken;
      var errorStr = "";
      var result = null;
      if (bresult)
      {
		  var versionElements=$(responseData).find("SERVER_VERSION");
		  var serverVersion = "";
		  for (var i=0;i<versionElements.length;i++)
		  {
			  var item = versionElements[i];
			  serverVersion += (serverVersion?".":"") + $(item).text();
		  }
		  App.serverVersion = serverVersion;
      }
      else
      {
          errorStr = responseData;
      }
	  if (handlerFunc)
      	handlerFunc(bresult,result,errorStr,dataToken);
  }
  );       	
}

function wmw_getVolumeFilter(sessionId,volumeName,filterName,dataToken,handlerFunc)
{
    var dataTokenWrap = {dataToken:dataToken,handlerFunc:handlerFunc};    

    var srequestFormatStr = 
'<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">'+
  '<SOAP-ENV:Body>'+
    '<tns:getVolumeFilter xmlns:tns="http://Df5.comped.it/">'+
      '<sessionId>{0}</sessionId>'+
      '<volumeName>{1}</volumeName>'+
      '<filterName>{2}</filterName>'+
    '</tns:getVolumeFilter>'+
  '</SOAP-ENV:Body>'+
'</SOAP-ENV:Envelope>';
      
  var strRequest = stringFormat(srequestFormatStr,[sessionId,volumeName,filterName]);    
  wmw_soapRequest(strRequest,dataTokenWrap,
  function(bresult,responseData,dataTokenWrap)
  {
      var handlerFunc = dataTokenWrap.handlerFunc;
      var dataToken = dataTokenWrap.dataToken;
      var errorStr = "";
      var result = null;
      if (bresult)
      {
        var $item = $(responseData[0]);
        result = {
            query: $item.find('query').text(),
            fullTextSearchExpression: $item.find('fullTextSearchExpression').text(),  
            maxDocs: $item.find('maxDocs').text()   
        }
      }
      else
      {
          errorStr = responseData;
      }
      handlerFunc(true,result,errorStr,dataToken);
  }
  );       
}


function wmw_getVolumeFilters(sessionId,volumeName,dataToken,handlerFunc)
{
    var dataTokenWrap = {dataToken:dataToken,handlerFunc:handlerFunc};    

    var srequestFormatStr = 
'<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
  '<SOAP-ENV:Body>'+
    '<tns:getVolumeFilters xmlns:tns="http://Df5.comped.it/">'+
      '<sessionId>{0}</sessionId>'+
      '<volumeName>{1}</volumeName>'+
    '</tns:getVolumeFilters>'+
  '</SOAP-ENV:Body>'+
'</SOAP-ENV:Envelope>';
    
  var strRequest = stringFormat(srequestFormatStr,[sessionId,volumeName]);    
  wmw_soapRequest(strRequest,dataTokenWrap,
  function(bresult,responseData,dataTokenWrap)
  {
      var handlerFunc = dataTokenWrap.handlerFunc;
      var dataToken = dataTokenWrap.dataToken;
      var errorStr = "";
      var result = null;
      if (bresult)
      {
          result = [];
          for(var i=0;i<responseData.length;i++)
          {
             var item = responseData[i];
             var filterName = $(item).text(); 
             if (!filterName) continue;  
             var itemValue = {id:i.toString(),name:filterName};  
             result.push(itemValue);
          }
      }
      else
      {
          errorStr = responseData;
      }
      handlerFunc(true,result,errorStr,dataToken);
  }
  );       
}

function wmw_getVolumeGrouping(sessionId,volumeName,groupingName,dataToken,handlerFunc)
{
    //returns data-rows of specified grouping 
    var dataTokenWrap = {dataToken:dataToken,handlerFunc:handlerFunc};    

    var srequestFormatStr = 
'<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">'+
  '<SOAP-ENV:Body>'+
    '<tns:getVolumeGrouping xmlns:tns="http://Df5.comped.it/">'+
      '<sessionId>{0}</sessionId>'+
      '<volumeName>{1}</volumeName>'+
      '<groupingName>{2}</groupingName>'+
    '</tns:getVolumeGrouping>'+
  '</SOAP-ENV:Body>'+
'</SOAP-ENV:Envelope>';    
    
      
  var strRequest = stringFormat(srequestFormatStr,[sessionId,volumeName,groupingName]);    
  wmw_soapRequest(strRequest,dataTokenWrap,
  function(bresult,responseData,dataTokenWrap)
  {
      var handlerFunc = dataTokenWrap.handlerFunc;
      var dataToken = dataTokenWrap.dataToken;
      var errorStr = "";
      var result = null;
      if (bresult)
      {
          result = {};
          result.name = $(responseData).find('name').text();
          var xFields = $(responseData).find('fields');
          result.columns = [];
          for(var i=0;i<xFields.length;i++)
          {
              var item = xFields[i];
              var strFieldName = $(item).text();
              var column = {field:strFieldName,sortable:true,title:strFieldName};
              result.columns.push(column);
          }
          result.columns.push({field:"sysGroup_Count",sortable:true,title:"Count"}); //last visible "system" column
          var xGroups = $(responseData).find('groups');
          result.data = [];
          for(var i=0;i<xGroups.length;i++)
          {
              var item = xGroups[i];
              var newRow = {};
              var count = $(item).find('count').text();
              var query = $(item).find('query').text();
              newRow.sysGroup_Count = count;
              newRow.sysGroup_Query = query; 
              var xRowValues = $(item).find('fieldValues');      
              for (var j=0;j<xRowValues.length;j++)
              {
                  var itemJ = xRowValues[j];
                  var fldName = result.columns[j].field;
                  var fldValue = $(itemJ).text();
                  newRow[fldName] = fldValue;
              }
              newRow.sysGroup_Selected = false;
              result.data.push(newRow);
          }
      }
      else
      {
          errorStr = responseData;
      }
      handlerFunc(true,result,errorStr,dataToken);
  }
  );       
}


function wmw_getVolumeGroupings(sessionId,volumeName,dataToken,handlerFunc)
{
    //return list of groupings of specified volume
    var dataTokenWrap = {dataToken:dataToken,handlerFunc:handlerFunc};    

    var srequestFormatStr = 
'<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">'+
  '<SOAP-ENV:Body>'+
    '<tns:getVolumeGroupings xmlns:tns="http://Df5.comped.it/">'+
      '<sessionId>{0}</sessionId>'+
      '<volumeName>{1}</volumeName>'+
    '</tns:getVolumeGroupings>'+
  '</SOAP-ENV:Body>'+
'</SOAP-ENV:Envelope>';
      
  var strRequest = stringFormat(srequestFormatStr,[sessionId,volumeName]);    
  wmw_soapRequest(strRequest,dataTokenWrap,
  function(bresult,responseData,dataTokenWrap)
  {
      var handlerFunc = dataTokenWrap.handlerFunc;
      var dataToken = dataTokenWrap.dataToken;
      var errorStr = "";
      var result = null;
      if (bresult)
      {
          result = [];
          for(var i=0;i<responseData.length;i++)
          {
             var item = responseData[i];
             var filterName = $(item).text();      
             var itemValue = {id:i.toString(),name:filterName};  
             result.push(itemValue);
          }
      }
      else
      {
          errorStr = responseData;
      }
      handlerFunc(true,result,errorStr,dataToken);
  }
  );       
}

function wmw_getVolumeGroupingByFields(sessionId,volumeName,fldNames,dataToken,handlerFunc)
{
    //returns data-rows of grouping specified by field list 
    var dataTokenWrap = {dataToken:dataToken,handlerFunc:handlerFunc};    

    var srequestFormatStr = 
'<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">'+
	'<SOAP-ENV:Body>'+
		'<tns:getVolumeGroupingByFields xmlns:tns="http://Df5.comped.it/">'+
			'<sessionId>{0}</sessionId>'+
			'<volumeName>{1}</volumeName>'+
            '{2}'+
		'</tns:getVolumeGroupingByFields>'+
	'</SOAP-ENV:Body>'+
'</SOAP-ENV:Envelope>';
    var sGroupingsFormatStr = '<groupingFields>{0}</groupingFields>';

    var strGroupings = "";
    for (var i=0;i<fldNames.length;i++){
        strGroupings += stringFormat(sGroupingsFormatStr,[fldNames[i]]);         
    }

  var strRequest = stringFormat(srequestFormatStr,[sessionId,volumeName,strGroupings]);    
  wmw_soapRequest(strRequest,dataTokenWrap,
  function(bresult,responseData,dataTokenWrap)
  {
      var handlerFunc = dataTokenWrap.handlerFunc;
      var dataToken = dataTokenWrap.dataToken;
      var errorStr = "";
      var result = null;
      if (bresult)
      {
          result = {};
          result.name = $(responseData).find('name').text();
          var xFields = $(responseData).find('fields');
          result.columns = [];
          for(var i=0;i<xFields.length;i++)
          {
              var item = xFields[i];
              var strFieldName = $(item).text();
              var column = {field:strFieldName,sortable:true,title:strFieldName};
              result.columns.push(column);
          }
          result.columns.push({field:"sysGroup_Count",sortable:true,title:"Count"}); //last visible "system" column
          var xGroups = $(responseData).find('groups');
          result.data = [];
          for(var i=0;i<xGroups.length;i++)
          {
              var item = xGroups[i];
              var newRow = {};
              var count = $(item).find('count').text();
              var query = $(item).find('query').text();
              newRow.sysGroup_Count = count;
              newRow.sysGroup_Query = query; 
              var xRowValues = $(item).find('fieldValues');      
              for (var j=0;j<xRowValues.length;j++)
              {
                  var itemJ = xRowValues[j];
                  var fldName = result.columns[j].field;
                  var fldValue = $(itemJ).text();
                  newRow[fldName] = fldValue;
              }
              newRow.sysGroup_Selected = false;
              result.data.push(newRow);
          }
      }
      else
      {
          errorStr = responseData;
      }
      handlerFunc(true,result,errorStr,dataToken);
  }
  );      
}


function wmw_getVolumeInfo(sessionId,volumeName,dataToken,handlerFunc)
{
    var dataTokenWrap = {dataToken:dataToken,handlerFunc:handlerFunc};    

    var srequestFormatStr = 
'<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
  '<SOAP-ENV:Body>' +
    '<tns:GetVolumeInfo xmlns:tns="http://Df5.comped.it/">' +
      '<SessionId>{0}</SessionId>' +
      '<VolumeName>{1}</VolumeName>' + 
    '</tns:GetVolumeInfo>' +
  '</SOAP-ENV:Body>' +
'</SOAP-ENV:Envelope>';    
  var strRequest = stringFormat(srequestFormatStr,[sessionId,volumeName]);    
  wmw_soapRequest(strRequest,dataTokenWrap,
  function(bresult,responseData,dataTokenWrap)
  {
      var handlerFunc = dataTokenWrap.handlerFunc;
      var dataToken = dataTokenWrap.dataToken;
      var errorStr = "";
      var result = null;
      if (bresult)
      {
          result = {
              name: $(responseData).find('name').text(),
              created: $(responseData).find('created').text().substr(0,10),
              description: $(responseData).find('description').text().substr(0,10),
              isFullTextIndexed: $(responseData).find('isFullTextIndexed').text(),
              volumeType: $(responseData).find('volumeType').text()
          }
      }
      else
      {
          errorStr = responseData;
      }
      handlerFunc(true,result,errorStr,dataToken);
  }
  );       
}


function wmw_Login(user,password,dsn,resultHandler)
{
    if (user=="" || password == "" || dsn == "")
    {
        hideWaitIndicator();
        if (resultHandler!=null)
        {
            resultHandler(false,appGlobal.errMessages.SomeFieldsAreNotFilled);
        }
        return;
    }
    
        var loginRes = 
    "<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">\n"+
    " <SOAP-ENV:Body>\n"+
    " <tns:loginEx xmlns:tns=\"http://Df5.comped.it/\">\n"+
    " <userName>{0}</userName>\n"+
    " <password>{1}</password>\n"+
    " <dataSource>{2}</dataSource>\n"+
    " </tns:loginEx>\n"+
    " </SOAP-ENV:Body>\n"+
    "</SOAP-ENV:Envelope> ";     

    //var strRequest = loginRes.format(user,password,dsn);
    var strRequest = stringFormat(loginRes,[user,password,dsn]);

    var url = getUrlDfStorageServer();  
    url = "DFStorageServer";    

    var request = 
        $.ajax({
        url: url,
        type: "POST",
        contentType: "text/xml",
        dataType: "xml",    
        data : strRequest,
        processData: false
    });


    request.fail(function( jqXHR, textStatus ) {
      if (resultHandler!=null)
            resultHandler(false,textStatus);
    });


    request.done(function( data ) 
    {
        hideWaitIndicator();
        var faultString = wmw.getFaultString(data);
        var bresult = true;
        if (faultString!="")
        {
            bresult = false;
            data = faultString;
        }
        if (resultHandler!=null)
        {
            resultHandler(bresult,data);
            return;
        }
    });

}

function wmw_Logout(sessionId,resultHandler)
{
var srequestFormatStr =   
"<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">\n"+
" <SOAP-ENV:Body>\n"+
    " <tns:ServerLogout xmlns:tns=\"http://Df5.comped.it/\">\n"+
        " <SessionId>{0}</SessionId>\n"+
    " </tns:ServerLogout>\n"+
" </SOAP-ENV:Body>\n"+
"</SOAP-ENV:Envelope>";    
    
var strRequest = stringFormat(srequestFormatStr,[sessionId]);     
$.ajax({
    url: "DFStorageServer",
    type: "POST",
    contentType: "text/xml",
    dataType: "xml",    
    data : strRequest,
    success: function(data)
    {
        resultHandler();    
    },
    error: function (jqXHR, textStatus )
    {
      resultHandler();       
    },        
    processData: false
    });    
}


function wmw_openFilter(sessionId,volumeName,query,dataObject,resultHandler)
{
    //it is just a wrapper for wmw_getMSD method
    var queryFormatStr=
    '&lt;dwiSearch &gt;'+
    '&lt;type&gt;1&lt;/type&gt;'+
    '&lt;query&gt;'+
    '&lt;volName&gt;{0}&lt;/volName&gt;'+
    '{1}'+
    '&lt;/query&gt;'+
    '&lt;fields/&gt;'+
    '&lt;Dir&gt;-1&lt;/Dir&gt;'+
    '&lt;DirName&gt;{0}&lt;/DirName&gt;'+
    '&lt;/dwiSearch&gt;';
    var queryStr = stringFormat(queryFormatStr,[volumeName,query]);
    wmw_getMSD(sessionId,null,null,null,dataObject,resultHandler,queryStr);
}

function wmw_openSearch(sessionId,volumeName,query,dataObject,resultHandler)
{
    var queryFormatStr=
	'&lt;dwiSearch&gt;'+
	'&lt;type&gt;2&lt;/type&gt;'+
  	'&lt;volName&gt;{0}&lt;/volName&gt;'+
	'&lt;query&gt;{1}&lt;/query&gt;'+
  	'&lt;fields/&gt;'+
  	'&lt;Dir&gt;-1&lt;/Dir&gt;'+
	'&lt;DirName&gt;{0}&lt;/DirName&gt;'+
	'&lt;/dwiSearch&gt;'
    var queryStr = stringFormat(queryFormatStr,[volumeName,query]);
    wmw_getMSD(sessionId,null,null,null,dataObject,resultHandler,queryStr);
}


function wmw_sendDocumentsByEmail(sessionId,smtpSettings,
							   dataToken,handlerFunc)
{
	var dataTokenWrap = {dataToken:dataToken,handlerFunc:handlerFunc}; 
	var srequestFormatStr = 
'<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" '+ 'xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">'+
  '<SOAP-ENV:Body>'+
    '<tns:sendDocumentsByEmail xmlns:tns="http://Df5.comped.it/">'+
      '<smtpHost><%= this.model.host %></smtpHost>'+
      '<smtpPort><%= this.model.port %></smtpPort>'+
      '<from><%= this.model.senderAddress %></from>'+
      '<to><%= this.model.recipientAddress %></to>'+
      '<cc><%= this.model.ccAddress %></cc>'+
      '<bcc><%= this.model.bccAddress %></bcc>'+
      '<subject><%= this.model.subject %></subject>'+
      '<securityLayer><%= this.model.securityLayer %></securityLayer>'+
      '<authMechanisms><%= this.model.authentication %></authMechanisms>'+
      '<timeoutSec><%= this.model.timeout %></timeoutSec>'+
      '<userName><%= this.model.userName %></userName>'+
      '<password><%= this.model.smtpPassword %></password>'+
      '<messageBodyText>'+
		'Messaggio di prova inviato per verificare le impostazioni e-mail dei parametri SMTP di DWC:\r\n'+
		'Server version:	<%= App.version %> \r\n'+
		'Client version:	<%= App.serverVersion %>\r\n'+
		'- Nome utente:              <%= this.model.userName %>\r\n'+
		'- Indirizzo e-mail ("Da:"): <%= this.model.recipientAddress %>\r\n'+
		'- Indirizzo server:         <%= this.model.host %>\r\n'+
		'- Porta server:             <%= this.model.port %></messageBodyText>'+
      	'<sendAsZip>false</sendAsZip>'+
    '</tns:sendDocumentsByEmail>'+
  '</SOAP-ENV:Body>'+
'</SOAP-ENV:Envelope>';
	
	var strRequest = compileTemplate(srequestFormatStr,smtpSettings);    
	wmw_soapRequest(strRequest,dataTokenWrap,
	function(bresult,responseData,dataTokenWrap)
	{
	  var handlerFunc = dataTokenWrap.handlerFunc;
	  var dataToken = dataTokenWrap.dataToken;
	  var errorStr = "";
	  var result = null;
	  if (bresult)
	  {
	  }
	  else
	  {
		  errorStr = responseData;
	  }
	  handlerFunc(bresult,result,errorStr,dataToken);
	}
	);       	
}


function wmw_sendDocumentsByEmailEx(
		sessionId,
	 	emailModel,
		docInfoList,dataToken,handlerFunc)
{
	var dataTokenWrap = {dataToken:dataToken,handlerFunc:handlerFunc}; 
	var srequestFormatStr = 
'<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">'+
  '<SOAP-ENV:Body>'+
    '<tns:sendDocumentsByEmailEx xmlns:tns="http://Df5.comped.it/">'+
      '<sessionId><%=App.getSessionId()%></sessionId>'+
      '<smtpHost><%= this.model.host %></smtpHost>'+
      '<smtpPort><%= this.model.port %></smtpPort>'+
      '<personal><%= this.model.personal %></personal>'+
      '<from><%= this.model.senderAddress %></from>'+
      '<to><%= this.model.emailTo %></to>'+
      '<cc><%= this.model.emailCc %></cc>'+
      '<bcc><%= this.model.emailBcc %></bcc>'+
      '<subject><%= this.model.subject %></subject>'+
      '<securityLayer><%= this.model.securityLayer %></securityLayer>'+
      '<authMechanisms><%= this.model.authentication %></authMechanisms>'+
      '<timeoutSec><%= this.model.timeout %></timeoutSec>'+
      '<userName><%= this.model.userName %></userName>'+
      '<password><%= this.model.smtpPassword %></password>'+		
      '<messageBodyText><%= this.model.messageBody %></messageBodyText>'+
	  '<%= this.model.docInfoListHtml %>'+	
      '<sendAsZip><%= this.model.attMode=="zip" %></sendAsZip>'+
    '</tns:sendDocumentsByEmailEx>'+
  '</SOAP-ENV:Body>'+
'</SOAP-ENV:Envelope>';	

var docInfoTemplate = 	
 '<docInfo>'+
        '<documentId><%= this.model.id %></documentId>'+
        '<documentName><%= this.model.mainDocName %></documentName>'+
        '<includeAllAttachments><%= this.model.includeAllAtt %></includeAllAttachments>'+
        '<isAttachment><%= this.model.isAttachment %></isAttachment>'+
        '<attachmentName><%= this.model.attName %></attachmentName>'+
        '<link xsi:nil="true"/>'+
        '<extention xsi:nil="true"/>'+
        '<destinationFileName xsi:nil="true"/>'+
  '</docInfo>';	
var docInfoListHtml = "";	
var $request = $(strRequest);	
	for(var i=0;i<docInfoList.length;i++){	
		var docInfoItem = docInfoList[i];
		var docInfoHtml = compileTemplate(docInfoTemplate,docInfoItem);    
		docInfoListHtml += docInfoHtml;
	}
	
emailModel.docInfoListHtml = docInfoListHtml;	
var strRequest = compileTemplate(srequestFormatStr,emailModel);
wmw_soapRequest(strRequest,dataTokenWrap,
	function(bresult,responseData,dataTokenWrap)
	{
	  var handlerFunc = dataTokenWrap.handlerFunc;
	  var dataToken = dataTokenWrap.dataToken;
	  var errorStr = "";
	  var result = null;
	  if (bresult)
	  {
	  }
	  else
	  {
		  errorStr = responseData;
	  }
	  handlerFunc(bresult,result,errorStr,dataToken);
	}
);       	
	
	
	
}


function wmw_ViewDocument(sessionId,docId,dataObject,resultHandler)
{
var srequestFormatStr =     
"<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">\n <SOAP-ENV:Body>\n"+ 
    "<tns:ViewDocument xmlns:tns=\"http://Df5.comped.it/\">\n"+
        "<SessionId>{0}</SessionId>\n"+
        "<DocumentId>{1}</DocumentId>\n"+
"</tns:ViewDocument>\n"+
"</SOAP-ENV:Body>\n</SOAP-ENV:Envelope>";
var strRequest = stringFormat(srequestFormatStr,[sessionId,docId]);     
$.ajax({
    url: "DFStorageServer",
    type: "POST",
    contentType: "text/xml",
    context: dataObject,   
    dataType: "xml",    
    data : strRequest,
    success: function(data)
    {
        if (wmw.showMessageIfError(data,'wmw_ViewDocument'))
        {
            resultHandler(false,null,this);    
            return;
        }
        var sresult = $(data).find('return Link').text();
        resultHandler(true,sresult,this);
    },
    error: function (jqXHR, textStatus )
    {
      showError(jqXHR.responseText,'wmw_ViewDocument'); 
      resultHandler(false,null,this);       
    },        
    processData: false
    });    
}





///////////////////////////////////////////////////////////
function checkResponse(xmlResponse)
{
    this.xmlResponse = xmlResponse;
    this.errorMessage = "";
    this.checkFunc = function(_this)
    {
        var faultStringNodes = $(this.xmlResponse.documentElement).find("faultstring");
        var bresult = (faultStringNodes.length == 0);
        if (!bresult)
        {
            _this.errorMessage = $(_this.xmlResponse.documentElement).find("faultstring")[0].textContent;
            if (this.errorMessage == App.localeData.constErrSessionExpired)
            {
                App.Controllers.masterPage.onSessionExpired();
            }
        }
        return bresult;
    };
    this.bresult = this.checkFunc(this);
}




function processSuccess(data, status, req) {
            if (status == "success")
                $("#response").text($(req.responseXML).find("HelloResult").text());
        }

function processError(data, status, req) {
            alert(req.responseText + " " + status);
        }
function responseTimer(timeout,handler,dataToken)
{
    this.timeout = timeout;
    this.handler = handler;
    this.isResponseReceived = false;
    this.isResponseExpired = false;
    this.dataToken   = dataToken;
    setTimeout(function(that)
    {
        if (that.isResponseReceived) return; //resonse is received
        that.isResponseExpired = true;
        that.handler(false,"Timeout is expired",that.dataToken);
    },
    timeout,this);
}


function showError(message,title,onCloseMbHandler)
{
    if (title == null) title = "Error";
    var errorMbFormatStr = " <div id=\"errorMbDlg\" class=\"modal fade\">\n <div class=\"modal-dialog\">\n <div class=\"modal-content\">\n <div class=\"modal-header\">\n <h4 class=\"modal-title\">{1}</h4>\n </div> \n <div class=\"modal-body\">\n <div class=\"alert alert-danger\" role=\"alert\">{0}</div> \n <div class=\"modal-footer\">\n <button type=\"button\" class=\"btn btn-danger\" data-dismiss=\"modal\">OK</button>\n </div>\n </div> \n </div>\n </div>\n </div> "
    var errorMBBody = stringFormat(errorMbFormatStr,[message,title]);
    $("#errorMbDlg").remove();
    $("body").append(errorMBBody);
    $("#errorMbDlg").modal('show'); 
	if (onCloseMbHandler)
	{
		$("#errorMbDlg").data("onCloseMbHandler",onCloseMbHandler);
		$("#errorMbDlg").on("hidden.bs.modal", function (e) 
	    {
			var handler = $(this).data("onCloseMbHandler");
			$(this).data("onCloseMbHandler",null);
			$(this).off("hidden.bs.modal");
			handler();
		});
	}
	
}

function wmw_soapRequest(strRequest,dataToken,handlerFunc,timeOut)
{
    if (!dataToken) dataToken = {};
    if(!timeOut) timeOut = 5000;
    var timer = new responseTimer(5000,handlerFunc,dataToken);
    dataToken.timer = timer;
    
    $.ajax({
    url: "DFStorageServer",
    type: "POST",
    contentType: "text/xml",
    dataType: "xml",    
    dataToken:dataToken,    
    data : strRequest,
    success: function(data)
    {
        dataToken.timer.isResponseReceived = true;
        if (dataToken.timer.isResponseExpired) return;
        var cr = new checkResponse(data);
        if (cr.bresult)
        {
            var xResult = $(data.documentElement).find('return');
            handlerFunc(true,xResult,dataToken);
        }
        else
        {
            handlerFunc(false,cr.errorMessage,dataToken);
        }
    },
    error: function onError(jqXHR, textStatus )
    {
      dataToken.timer.isResponseReceived = true;
      if (dataToken.timer.isResponseExpired) return;    
      handlerFunc(false,"wmw_soapRequest: " + jqXHR.responseText,dataToken);    
    },        
    processData: false
    });    
}

///////////////////////////////////////////////////////////
// Value objects

function MSD(strXML)
{
    var xMSD = $.parseXML(strXML);
    this.jFields = [];
    this.jqGridColModel = [];
    this.jqGridColNames = [];
    this.btTableColumns = [];
    MSD.prototype.MSDField = function (name,caption,type,size,precision,dateFormat)
                    {
                        this.name = name;
                        this.caption = caption;
                        this.type = type;
                        this.size = size;
                        this.precision = precision;
                        this.dateFormat = dateFormat;    
                    }
    MSD.prototype.jqGridField = function (fname,fwidth)
                    {
                        this.name = fname;
                        this.width = fwidth;
                        this.align = "left";
                    }
    MSD.prototype.btTableColumn = function (fldName,colTitle,hAlign)
    {
                        this.field = fldName;
                        this.title = colTitle;
                        this.align = hAlign;
                        this.sortable = true;
                        this.valign = 'middle';
    }
    
    MSD.prototype.MSDFieldType = 
    {
        string : "String",
        numeric : "Numeric",
        text : "Text",
        date : "Date"        
    }
    
    

    var xFields = $("Field",xMSD);
    var stateFld = {field: 'state',checkbox: true};
    this.btTableColumns.push(stateFld);
    for (var i=0;i<xFields.length;i++)
    {
        var xField = xFields[i];
        var fld = new MSD.prototype.MSDField(
        $(xField).attr("Name")
        ,$(xField).attr("Caption")
        ,$(xField).attr("Type")
        ,$(xField).attr("Size")
        ,$(xField).attr("Precision")
        ,$(xField).attr("DateFormat")
        );
        this.jFields.push(fld);
        
        var jqFld = new MSD.prototype.jqGridField(fld.name,60);
        this.jqGridColModel.push(jqFld);
        this.jqGridColNames.push(fld.caption);
        var btCol = new MSD.prototype.btTableColumn(fld.name,fld.caption,"left");
        this.btTableColumns.push(btCol);
    }
    //var docUIDFld = new MSD.prototype.btTableColumn('documentUID','UID','left');
    //this.btTableColumns.push(docUIDFld);

    
}






