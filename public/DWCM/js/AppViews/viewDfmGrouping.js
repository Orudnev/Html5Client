define(["jquery","backbone","utils"],function($,Backbone,Utils){
var instance =
		Backbone.View.extend({
    render:function()
    {
        $(window).off("resize.grouping").on("resize.grouping",this,this.onWindowResize); 

        var selector = this.model.get("mainViewSelector");

        var groupingObj = this.model.get('groupingObject'); 
        if (!groupingObj) return;
        var pWidth = $('#mpMainPane').width();
        var pHeight = $('#mpMainPane').height();
        var grpGrid = {}; 
        var docGrid = {};
        var landscapeStyles="";
        if (pWidth > pHeight) 
        {
            // landscape
            grpGrid.width = pWidth/3; 
            grpGrid.height = pHeight-35;
            docGrid.width = pWidth - grpGrid.width - 5;
            docGrid.height = grpGrid.height;
        }
        else
        {
            // portrait
            grpGrid.width = pWidth; 
            grpGrid.height = pHeight/3;
            docGrid.width = grpGrid.width;
            docGrid.height = pHeight - grpGrid.height - 30;
        }
        var isGroupingExists = $(selector+" .DfmGrpContent").length>0;
        var groupingContentHtml=        
            '<div class="DfmGrpContent">'+
            '<div id="grpGridContainer" style="width:{0}px;height:{1}px;" >'+
            '   <table id="GroupingGrid_ExtTab"  ></table> '+
            '</div>'+
            '<div id="docGridContainer" style="width:{2}px;max-height:{3}px;">'+
            '   <table id="DocListGrid_ExtTab" class="VolDocumentGrid"></table> '+
            '</div>'+    
            '</div>';
         groupingContentHtml = stringFormat(groupingContentHtml,[grpGrid.width,grpGrid.height,docGrid.width,docGrid.height]);

        if (!isGroupingExists)
        {
         $(selector).append(groupingContentHtml);
         
         //store refference to model instance to DOM
         $(selector+" .DfmGrpContent").data("modelInstance",this.model);
    
         $("#GroupingGrid_ExtTab").bootstrapTable(
                {columns: groupingObj.columns, 
                 striped:true,
                 locale:'en-US',
                 singleSelect:true,
                 classes:"table table-hover table-condensed",
                 pageSize: App.Models.settings.get(Appn.Model.Settings.doclistPageSize),
                 height: grpGrid.height,
                 onClickRow:this.onGroupingRowClick,
                 rowStyle: function(row,index)
                 {
                    var rv = {};
                    rv.classes = ((row.sysGroup_Selected)?"selectedRow":"");
                    return rv;    
                 },
                 data: groupingObj.data
                }); 
        }
        else
        {
            
            $("#grpGridContainer").css("width",grpGrid.width);
            $("#docGridContainer").css("width",docGrid.width);
            $("#GroupingGrid_ExtTab").bootstrapTable('resetView',{height: grpGrid.height});
            $("#DocListGrid_ExtTab").bootstrapTable('resetView',{height: docGrid.height-50});
        }
        if(pWidth > pHeight) 
        {
            //landscape
            $("#grpGridContainer").css("display","inline-block");
            $("#docGridContainer").css("display","inline-block");
            $("#docGridContainer").css("position","fixed");
            //move document list grid up, to align with groupings data grid
            var top = $("#grpGridContainer").offset().top
            $("#docGridContainer").css("top",top);
        }
        else
        {
            //Portrait
            $("#grpGridContainer").css("display","initial");
            $("#docGridContainer").css("display","initial");
            $("#docGridContainer").css("position","initial");
        }
        this.highlightSelectedGrouping();
    },
    highlightSelectedGrouping:function()
    {
        var rowId = this.model.get("selectedGroupId");
        var selector = stringFormat("#GroupingGrid_ExtTab tr[data-index='{0}'",[rowId]);
        $("#GroupingGrid_ExtTab tr.selectedRow").removeClass("selectedRow");
        $(selector).addClass("selectedRow");
    },
    onGroupingRowClick:function(row,$element,field)
    {
        var rowIndex = parseInt($element.attr("data-index"));
        var that = $element.parents(".DfmGrpContent").data("modelInstance");
        that.selectGrouping(rowIndex,row);
    },
    onWindowResize:function(event)
    {
        var that = event.data;
        that.render();    
    },
    initialize: function()
    {
    }
    });

	
return instance;	
});