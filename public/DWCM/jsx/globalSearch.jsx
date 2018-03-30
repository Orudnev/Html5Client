define(function(){
var instance = function(){	
	console.log("jsx");
	var titleBarHeight = 36;
	var ctrlGroup1Height = 29;
	var gridHeaderHeight = 38;
	var delimiterHeight = 20;
	var constantPartHeight = 
		titleBarHeight + ctrlGroup1Height + gridHeaderHeight + delimiterHeight + 30;
	
	if (window.innerHeight>window.innerWidth){
		var scrHeightPrt = window.innerHeight;
		var scrHeightLnd = window.innerWidth;
	}else{
		var scrHeightLnd = window.innerHeight;
		var scrHeightPrt = window.innerWidth;
	}
	 
	var gridRowsHeightPrt = scrHeightPrt - constantPartHeight;
	var gridRowsHeightLnd = scrHeightLnd - constantPartHeight;
	
	var TitleBar = React.createClass({
      render: function () {
		var cStyle = {
			display: 'flex',
			marginBottom: '10px',
			height: titleBarHeight+'px'
		}
		var hStyle = {
            fontSize: '24px',
            fontWeight: 'bolder'
		}
		var btnStyle = {
			marginTop: '3px',
			marginBottom: '3px',
			marginRight: '-10px'
		}
		var btnOkStyle = $.extend(
			{},
			btnStyle,
			{
				marginRight: '5px',
				visibility: this.props.selIndex != -1 ?'visible':'hidden'
			});	
		
		var btnCancelStyle = $.extend(
			{},
			btnStyle,
			{
				marginRight: '-10px',
				visibility: this.props.status == 'readyToNewSearch'?'visible':'hidden'

			});	
		
		var headerIconStyle = {marginRight: '10px'};
		if (this.props.status == 'readyToNewSearch'){  
			var headerIcon = (
				<span className="glyphicon glyphicon-search " style={headerIconStyle} >
				</span>);
		}else{
			headerIcon = (
				<span className="glyphicon glyphicon-refresh rotateIcon" style={headerIconStyle} >
				</span>);
		}
		  
		return (
  		<div style={cStyle}>
			<div className="col-xs-8">
				<div  style={hStyle} className="headerColor">
					{headerIcon}
					{App.localeData.globalSearch}
				</div>
			</div>
			<div className="col-xs-4 toolbarDiv">
				<button type="button" style={btnCancelStyle} 
					onClick={()=>this.props.hndToolbarBtnClick("cancel")} 
					className="toolbarBtn btn btn-xs btn-danger pull-right glyphicon glyphicon-remove"
					>
				</button>			
				<button type="button" style={btnOkStyle} 
					onClick={()=>this.props.hndToolbarBtnClick("ok")} 
					className="toolbarBtn btn btn-xs btn-success pull-right glyphicon glyphicon-ok"
					>
				</button>			
			</div>
		</div>	
		);
	  }
  });
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
		if (this.props.status == 'cancelling'){
			btnCancelSearchClassStr += " rotateIcon";
		}
		if (this.props.status == 'readyToNewSearch'){
			var searchBtn = (
				<button type="button" 
					disabled = {!this.props.searchStr} 
					className='toolbarBtn btn btn-xs btn-primary pull-right glyphicon glyphicon-search' 
					style={btnStyle}
					onClick={()=>this.props.hndToolbarBtnClick("search")}>
				</button>  		    
			);
		}else{
			searchBtn = (
				<button type="button" 
					disabled = {!this.props.searchStr} 
					className='toolbarBtn btn btn-xs btn-danger pull-right'
					style={btnStyle}
					disabled={this.props.status == 'cancelling'}
					onClick={()=>this.props.hndToolbarBtnClick("cancel-search")}>
					
					<span className={btnCancelSearchClassStr}></span>
				</button>  		    
			);
		} 
		  
        return (
  		<div style={cStyle}>
  			{searchBtn}
  			<input type="text" style={inpStyle} 
  				  onChange = {this.props.hndSearchStrChange}
  				  value = {this.props.searchStr}	
				  className="form-control input-md " />	
  		    <label style={lStyle}>Search for</label>  
  		    
  		    
		</div>
		);
	  }
  });
	var Delimiter = React.createClass({
      render: function () {
		var cStyle = {
			height: delimiterHeight+'px',
			marginTop: '20px',
			color: 'white',
			fontWeight: 'bolder',
    		textAlign: 'center'
		}
        return (
		<div className='label-info' style={cStyle}>
			{App.localeData.searchResult}
		</div>
		);
	  }
  });
	var GridHeader = React.createClass({
      render: function () {
		var cStyle = {
			height: gridHeaderHeight+'px'
		}
		var tblStyle = {
			marginBottom: '0px',
			borderBottom: '2px solid'
		}
        return (
		<div style={cStyle}>
			<table className="table " style={tblStyle}>
				<tbody>
					  <tr >
						<th className="col-xs-3">{App.localeData.volumeName}</th>
						<th className="col-xs-3">{App.localeData.documentsFound}</th>
					  </tr>
				</tbody>
			</table>  		
		</div>
		);
	  }
  });
    var GridRow = React.createClass({

        render: function(props) {
            return (
				  <tr className={this.props.selectedIndex==this.props.id?"selected":""}  onClick={()=>this.props.hndOnSelIndChange(this.props.id)} >
					<td className="col-xs-3">{this.props.row.volumeName}</td>
					<td className="col-xs-3">{this.props.row.numFoundDocuments}</td>
				  </tr>             );
        }
    });
    
	var GridRows = React.createClass({
      render: function () {
		var strStyle=
			'tbody>tr:hover{background-color:#5bc0de;} '+
            'tbody>tr.selected{background-color:#5bc0de;} '+
			'@media (orientation: portrait){'+
				'.glbSearch{'+
				'overflow:auto; '+
				'height:'+ gridRowsHeightPrt +'px;}'+
			'}'+'\r\n'+
			'@media (orientation: landscape){'+
				'.glbSearch{'+
				'overflow:auto; '+
				'height:'+ gridRowsHeightLnd +'px;}'+
			'}';
			
        return (
		<div>
			<style>{strStyle}</style>
  		<div className="glbSearch">
 			<table className="table ">
				<tbody>
		          { this.props.rows.map((row)=>{
				  return (		
				  <GridRow 
                      key={row.id} id={row.id} row={row}
                      selectedIndex={this.props.selectedIndex}
                      hndOnSelIndChange={this.props.hndOnSelIndChange}
                      />
                          );
					})
				  }
				</tbody>
			</table>  		  		
		</div>
		</div>	
		);
	  
	  }
	});
	
  var Dlg = React.createClass({
      getInitialState: function() {
        return {
          rows: App.Models.commonParams.get('globalSearchLastResult'),    
          selectedIndex: -1,
		  status: "readyToNewSearch",   //"readyToNewSearch","search","cancelling","close"
		  searchStr: App.Models.commonParams.get('globalSearchStr')	
        };
      },
      handleOnSelIndexChange:function(newSelectedIndex)
      {
          this.setState({selectedIndex: newSelectedIndex});
		  //App.Controllers.masterPage.doOpenVolumeSearch("bbbb","DWC");
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
			 App.Controllers.masterPage.doOpenVolumeSearch(
				 this.state.rows[this.state.selectedIndex].volumeName,
				 this.state.searchStr);
		  }
			        
	  },
	  handleSearchStrChange:function(e)
	  {
		this.setState({searchStr: e.target.value});  
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
		var dlgStyle = {
				height: '100vh',
				overflow: 'hidden'
		};  
		if (this.state.status!="close"){
        return (
			<div style={dlgStyle}
			className="mpall WholeMainPaneDialog">
				<TitleBar 
					hndToolbarBtnClick={this.handleToolbarBtnClick}
					status={this.state.status} selIndex={this.state.selectedIndex}
					/>
				<CtrlGroup1 
					status={this.state.status} 
					searchStr={this.state.searchStr} 
					hndToolbarBtnClick={this.handleToolbarBtnClick} 
					hndSearchStrChange={this.handleSearchStrChange}
					/>
				<Delimiter />
				<GridHeader />
				<GridRows 
					rows={this.state.rows} 
					selectedIndex={this.state.selectedIndex}
					hndOnSelIndChange={this.handleOnSelIndexChange}
					/>
			</div>);
		} else {
			return null;
		}  
	  }
  });
	
	var containerSelector = "#dialogContLvl1";
	$("#mpall").addClass("nullHeight"); //hide panes
	$("#mpMainPane").addClass("nullHeight"); //hide panes	
	ReactDOM.render(<Dlg />, $(containerSelector)[0]);
}
return instance;

});
