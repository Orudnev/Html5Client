define(function(){
var instance = function(){	
	var itemList = App.Models.ddTree.get("currDirItems");
	var pathBarHeight = $("#mpToolbar").height();
	var ctrlGroup1Height = 29;
	var constantPartHeight = 
		pathBarHeight + ctrlGroup1Height;
	
	if (window.innerHeight>window.innerWidth){
		var scrHeightPrt = window.innerHeight;
		var scrHeightLnd = window.innerWidth;
	}else{
		    scrHeightLnd = window.innerHeight;
		    scrHeightPrt = window.innerWidth;
	}
	 
	var dirItemsHeightPrt = scrHeightPrt - constantPartHeight -30;
	var dirItemsHeightLnd = scrHeightLnd - constantPartHeight -30;
	
	var CtrlGroup1 = React.createClass({
	  componentDidMount: function(){
	  },
      render: function () {
		var cStyle = {
			display: 'flex',
			flexDirection: 'row-reverse',
			height: ctrlGroup1Height+'px'
		}
		var inpStyle = {
			marginRight: '5px',
			marginTop: '-5px',
			flex: 1
		}
		
		var lStyle = {
			marginRight: '5px',
			marginLeft: '5px'
		}
		var btnStyle = {
			marginRight: '5px',
			marginLeft: '5px',
			marginBottom: '6px',
		}	
		var btnCancelSearchClassStr = 'glyphicon glyphicon-remove'; 

        return (
  		<div className="CtrlGroup1" style={cStyle}>
  			<input type="text" style={inpStyle} 
  				  onChange = {this.props.hndSearchStrChange}
  				  value = {this.props.searchStr}	
				  className="form-control input-md " />	
  		    <label style={lStyle}>Search for</label>  
  		    
  		    
		</div>
		);
	  }
  });
  
    var DirItem = React.createClass({
        render: function() {
			let attrs = {'src': this.props.dirItem.graphIcon.src};
            return (
				  <div className='dirItem' onClick={()=>this.props.hndOnDirItemClick(this.props.id)} >
					<img {...attrs} className='dirItemImage' />  
					<span >{this.props.dirItem.text}</span>
				  </div>             );
        }
    });
    
	var DirItems = React.createClass({
      render: function () {
		//console.log('gridRows:',this.props);  
		var strStyle=
			'.dirItem>img{margin-right: 5px;}'+
			'@media (orientation: portrait){'+
				'.dirItems{'+
				'overflow:auto; '+
				'height:'+ dirItemsHeightPrt +'px;}'+
			'}'+'\r\n'+
			'@media (orientation: landscape){'+
				'.dirItems{'+
				'overflow:auto; '+
				'height:'+ dirItemsHeightLnd +'px;}'+
			'}';
        return (
		<div>
			<style>{strStyle}</style>
  		<div className="dirItems">
		          { this.props.itemList.map((item)=>{
				  //console.log(item);	  
				  return (		
				  <DirItem 
                      key={item.id} id={item.id} dirItem={item}
                      selectedIndex={this.props.selectedIndex}
                      hndOnDirItemClick={this.props.hndOnDirItemClick}
                      />
                          );
					})
				  }
		</div>
		</div>	
		);
	  
	  }
	});
	
  var Dlg = React.createClass({
      getInitialState: function() {
        return {
		  initialItemList:itemList,	
          itemList: itemList,    
          selectedIndex: -1,
		  searchStr: App.Models.commonParams.get('globalSearchStr')	
        };
      },
      handleOnDirItemClick:function(dirItemId)
      {
        this.setState({selectedIndex: dirItemId});
		var node = App.Models.ddTree.getNode(dirItemId);
		App.Models.ddTree.setSelectedNode(node);
		App.Views.masterPage.showAndSelectNode(node);	
      },
	  handleToolbarBtnClick:function(strCommand)
	  {
		  if (strCommand=='cancel' && this.state.status=='readyToNewSearch')
			  		this.dlgRemove(); 
		  if (strCommand=='search' && this.state.status=='readyToNewSearch'){
			 this.doStartSearch();	  
		  }
		  if (strCommand=='cancel-search'){
			   this.doCancelSearch();
			 		setTimeout(()=>this.setState({status:'readyToNewSearch'}),2000);    
		  }
		  if (strCommand=='ok'){
			 App.Models.commonParams.set('globalSearchLastResult',this.state.rows);
			 this.dlgRemove(); 
			 App.Controllers.masterPage.doOpenUDFilter(
				 this.state.rows[this.state.selectedIndex].volumeName,
				 this.state.searchStr);
		  }			        
	  },
	  handleSearchStrChange:function(e)
	  {
		var searchStr = e.target.value.toLowerCase();  
		var filteredItemList = this.state.initialItemList.filter(itm=>itm.text.toLowerCase().indexOf(searchStr)!=-1);
		this.setState({searchStr: e.target.value,itemList:filteredItemList});  
	  },
	  doStartSearch:function(){
		  this.setState({status:'search',rows:[],selectedIndex: -1});
		  App.Models.commonParams.set('globalSearchLastResult',[]);
		  App.Models.commonParams.set('globalSearchStr',this.state.searchStr);
		  //args: 	command - "startSearch","getNextResult","cancelSearch"
		  //		searchStr, bool fullText, string fromDate,string toDate,string maxDocs
		  AppHelper_JsonWsEx('GlobalSearch',['startSearch',this.state.searchStr,false,'','','-1'],
		   		function(resultObj){
				  if (!resultObj.bResult)
				  {
					 throw "Error: todo:display error should be implemented"; 	
				  }
				  this.doGetNextResult();
			  	},this,true);		  
	  },
	  doGetNextResult:function(){
		  AppHelper_JsonWsEx('GlobalSearch',['getNextResult','','','','',''],
		   		function(resultObj){
				  if (!resultObj.bResult)
				  {
					 throw "Error: todo:display error should be implemented"; 	
				  }
			  	  if(!resultObj.data[0].stop){
					  //search is not completed, request next result					  
					  setTimeout(()=>this.doGetNextResult(),500);
				  }else{
					  //search is completed
		  			  this.setState({status:'readyToNewSearch'});
				  }
			  	  	
			  	  if (resultObj.data[0].numFoundDocuments==-1) return;
			      // result is not empty
			  	  var rowsCopy = this.state.rows.slice(0);
			  	  for(var i=0;i<resultObj.data.length;i++){
					  var newRow = resultObj.data[i];
					  if (newRow.numFoundDocuments == -1) continue;
					  var newRowId = this.state.rows.length+i;
					  newRow.id = newRowId;
					  rowsCopy.push(newRow);
				  } 
			  	  this.setState({rows: rowsCopy});
			  	},this,true);		  
			  
	  },
	  doCancelSearch:function(){
		this.setState({status:'cancelling'});
		AppHelper_JsonWsEx('GlobalSearch',['cancelSearch','','','','',''],
			function(resultObj){
				this.setState({status:'readyToNewSearch'});		
			},this,true);		  
	  },
	  dlgRemove:function(){
		this.setState({status:"close"});  
		$("#mpall").removeClass("nullHeight"); //hide panes
		$("#mpMainPane").removeClass("nullHeight"); //hide panes	
	  },	  
      render: function () {

		var strStyle=
			'@media (orientation: portrait){'+
				'.DirItemsPage{'+
				'overflow:hidden; '+
				'height:'+ scrHeightPrt - pathBarHeight +'px;}'+
			'}'+'\r\n'+
			'@media (orientation: landscape){'+
				'.DirItemsPage{'+
				'overflow:hidden; '+
				'height:'+ scrHeightLnd - pathBarHeight  +'px;}'+
			'}';

		//var dlgStyle = {
		//		height: pathBarHeight,
		//		overflow: 'hidden'
		//};  
        return (
			<div>
				<style>{strStyle}</style>
				<div  className="DirItemsPage">
					<CtrlGroup1 
						status={this.state.status} 
						searchStr={this.state.searchStr} 					
						hndToolbarBtnClick={this.handleToolbarBtnClick} 
						hndSearchStrChange={this.handleSearchStrChange}
						/>
					<DirItems 
						itemList={this.state.itemList} 
						selectedIndex={this.state.selectedIndex}
						hndOnDirItemClick={this.handleOnDirItemClick}
						/>	
				</div>
			</div>);
	  }
  });
	
	var containerSelector = "#mpMainPane";
	ReactDOM.render(<Dlg />, $(containerSelector)[0]);
}
return instance;

});
