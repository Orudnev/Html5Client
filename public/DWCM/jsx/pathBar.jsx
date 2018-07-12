define(function(){
var instance = function(){	
    var itemChain = App.Models.ddTree.getPathNodeChain();
	itemChain = itemChain.filter(function(item){return item.id!="DD"});
    var PathItem = React.createClass({
        render: function() {
			var delimiter = <span className='glyphicon glyphicon-triangle-right' aria-hidden='true'></span>;
			if (this.props.id == "DF") delimiter = "";
            console.log('pathItem',this.props);
            return (
                <div className='pathItem'>
       				{delimiter}  
                    <a onClick={()=>this.props.hndOnPathItemClick(this.props.id)} >
                    {this.props.dirItem.text}   
                    </a> 
                </div>
                      );
        }
    });
    
	var PathItems = React.createClass({
      render: function () {
		//console.log('gridRows:',this.props);  
		var strStyle=
			'.pathItem{'+
                'display: inline-block;'+
            '}';     
        return (
		<div>
			<style>{strStyle}</style>
  		<div className="pathItems">
		          { this.props.itemChain.map((item)=>{
				  return (		
				  <PathItem 
                      key={item.id} id={item.id} dirItem={item}
                      selectedIndex={this.props.selectedIndex}
                      hndOnPathItemClick={this.props.hndOnPathItemClick}
                      />
                          );
					})
				  }
		</div>
		</div>	
		);
	  
	  }
	});
	
  var Ctrl = React.createClass({
	  componentDidMount: function(){
		  var pathItems = $(".pathItem");
		  pathItems[pathItems.length-2].scrollIntoView();
	  },
      getInitialState: function() {
        return {
		  itemChain:itemChain,	
        };
      },
      handleOnDirItemClick:function(dirItemId)
      {
        this.setState({selectedIndex: dirItemId});
		var node = App.Models.ddTree.getNode(dirItemId);
		App.Models.ddTree.setSelectedNode(node);
		App.Views.masterPage.showAndSelectNode(node);	
      },
      render: function () {
		var strStyle = 	'.pathCtrl {'+  
							'padding-top: 5px;'+
						'}'+
						'.pathItems{'+
							'height: 20px;'+
							'overflow: hidden;'+
						'}';	 
		
        return (
			<div>
				<style>{strStyle}</style>
				<div  className="pathCtrl">
					<PathItems 
						itemChain={this.state.itemChain} 
						hndOnPathItemClick={this.handleOnDirItemClick}
						/>	
				</div>
			</div>);
	  }
  });
	
	var containerSelector = "#pathBarContainer";
	ReactDOM.render(<Ctrl />, $(containerSelector)[0]);
}
return instance;

});
