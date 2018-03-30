define(["jquery","backbone","utils"],function($,Backbone,Utils){
var instance =
   		Backbone.View.extend({
     tagName: 'div',
     template: {},
     render: function()
             {
				 
                 //this.$el.html(this.template(this.model.toJSON() ));
                 //$("body").append(this.el); 
				 
				 var btph_Html ='<table id="tableDsnList" />';
				 var model = {title: App.localeData.SelectDsn_Title,strHtmlContent:btph_Html};
				 
				 var that = this;
				 var onOkBtnClick = function(event)
						{
							var viewInstance = that;
							viewInstance.removeEventListeners();
							App.Controllers.loginPage.onDsnListDlgOk();
						 	AppHelper_RemoveWholeMainPaneDialog();
						};
				 
				 var handleSelectRow = function(row,el)
				 {
					var handleOk = onOkBtnClick;
					App.Models.commonParams.set(Appn.Model.selectedDsn,row.DSN);
					//reset "selected" marker from the previous row
					var alreadySelected = el.hasClass("info"); 
					$('#tableDsnList .info').removeClass('info');
					//set "selected" marker to current row
					$(el).addClass('info');
					$(".WholeMainPaneDialog .toolbarBtn[command='ok']").prop('disabled', false);
					if (alreadySelected) 
								handleOk();
				 };
				 
				 AppHelper_ShowWholeMainPaneDialog(model,
				  function(token)
				  {
                    var thisView = that; 
					//remove main menu button (with its container) 
					$(".WholeMainPaneDialog .menuBtnDiv").remove();					 
					// Add Ok button and datagrid placeholder	
					var btnOkHtml = 
						'<button type="button" style="margin-top:3px;margin-bottom:3px; margin-right:3px;"'+
						'command="ok"'+
						'class="toolbarBtn btn btn-success menuBtn pull-right glyphicon glyphicon-ok">'+
						'</button>';
					 
			
					// $(".WholeMainPaneDialog .toolbarDiv").append(btnOkHtml);
					 
 					//disable OK button if current DSN is not defined 
					//if (!App.Models.commonParams.get(Appn.Model.selectedDsn)) 
					//	$('#SelectDsnDialog').find('#btnOK').prop('disabled', true); 

	
					 
					 $(".WholeMainPaneDialog .toolbarBtn[command='ok']").on('click', onOkBtnClick);
					 
					 // Add datagrid placeholder
					 //var btph_Html ='<table id="tableDsnList" />';
					 //$(".WholeMainPaneDialog").append(btph_Html);
					
                    // insert datagrid
                    $('#tableDsnList').bootstrapTable({
                        classes: 'table table-hover table-no-bordered',
                        columns : [{
                                    field: 'DSN',
                                    title: App.localeData.SelectDsn_ColHeader
                                }],      
                        ajax: function(params) 
                            {
                                // fake ajax function emulating jquery ajax 
                                params.success({
                                    total: App.Models.commonParams.get(Appn.Model.DsnList).length,
                                    rows: App.Models.commonParams.getDsnListAsFieldArray()
                                });
                                // hide "loading" label
                                params.complete();
                                if ($('#tableDsnList .info').length==0)
                                {
                                    //DSN stored in previous session is not found
									$(".WholeMainPaneDialog .toolbarBtn[command='ok']").prop('disabled', true);
                                    App.Models.commonParams.set(Appn.Model.selectedDsn,"");
                                    return;
                                }
								$('#SelectDsnDialog').find('#btnOK').prop('disabled', false);
                                var scrollPosition = $('#tableDsnList .info').position().top;
                                if (scrollPosition != null && !isNaN(scrollPosition) && scrollPosition>100) 
                                    setTimeout(function(){ 
                                    $('#tableDsnList').bootstrapTable('scrollTo',scrollPosition - 80);
                                },200,scrollPosition);
                                
                            }, 
                        rowStyle: function(row, index)
                            {
                                var currDsn = App.Models.commonParams.get(Appn.Model.selectedDsn);   
                                if (currDsn == row.DSN ) return {classes: 'info'};
                                return {};
                            },
                        onClickRow: handleSelectRow,
                        sidePagination: "server" ,
                        height: thisView.getDataGridHeight()
                        });   

				  },null,{that:this});
				 
				 return;
             },
     removeEventListeners: function() 
        {
            $('#SelectDsnDialog').off('shown.bs.modal');
            $('#SelectDsnDialog').find('.btn').off('click');
        },
	 getDataGridHeight:function()
		{
			var dgridHeight = $(".WholeMainPaneDialog").height() - $(".WholeMainPaneDialog .row").height(); 
			return dgridHeight - 50;
		},
	 onWindowResize:function(e)
		{
			var that = e.data;
			var newHeight = that.getDataGridHeight();
			$('#tableDsnList').bootstrapTable('resetView' , {height: newHeight} );  
		},			
     initialize: function()
     {
        //this.template = _.template(App.Templates.selectDsnDlg.html);
		App.winResize.addHandler("DfmVolume",this,this.onWindowResize); 
     }
    });    

	
return instance;	
});





 
                    