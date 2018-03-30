define(["utils","bootstrap","jqueryMobile","bootstrapTable", "jqueryForm","waitIndicator","ctrlLoginPg","ctrlMasterPg"],
	   function(Utils,BootsTrap,jqm,bootstrapTable,jF,wi,ctrlLogin,ctrlMaster){
			$(".ui-loader h1").remove(); //remove "loading" of jquery mobile
			var instance =
			{
				loginPage: ctrlLogin,
				masterPage: ctrlMaster
			}
			require(["bootstrapTable_TapRow"]);
			return instance;	
});

$( document ).on( "mobileinit", function() {
    $.mobile.loader.prototype.options.disabled = true;
});