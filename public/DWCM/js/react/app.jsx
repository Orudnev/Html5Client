/*
define(function(){
  var tmpl= <div>
            	<p>Hello, React!</p>
          	</div>;
	
  function App() {
    return React.createClass({
      render: function () {
        return (
          <div>
            <p>Hello, React!</p>
          </div>
        );
      }
    });
  }

  App.prototype.init = function () {
    //ReactDOM.render(<this.AppView />, document.getElementById('tree'));
  };

  var instance = React.createClass({
      render: function () {
        return (
          <div>
            <p>Hello, React!</p>
          </div>
        );
	  }
  });
		  
  var containerSelector = "#volumeFormStdContainer";
  ReactDOM.render(<instance />, $(containerSelector)[0]);
});

*/


define(function(){

  var TitleBar = React.createClass({
      render: function () {
        return (
  		<div class="row">
			<div className="col-xs-7">
				<h3 className="fntHeader">
				Dialog Header
				</h3>
			</div>
			<div className="col-xs-5 toolbarDiv">
			</div>
		</div>	
		);
	  }
  });
	
	
  var Dlg = React.createClass({
      render: function () {
		var dlgStyle = {
				height: '100vh',
				overflow: 'hidden'
		};  
        return (
		<div style={dlgStyle}
		className="mpall WholeMainPaneDialog">
			<TitleBar />
		</div>
			
		);
	  }
  });
	
  var containerSelector = "#volumeFormStdContainer";
  ReactDOM.render(<Dlg />, $(containerSelector)[0]);
	
	
});


/*
define(function(){
	console.log("blablabla");
	function Dlg(){
		return React.createClass({
			render: function(){
					var dlgStyle = {
							height: '100vh',
							overflow: 'hidden'
					};  
					return (
					<div style={dlgStyle}
					className="mpall WholeMainPaneDialog">
						test
					</div>

					);				
			};	
		});
	}
	
  var containerSelector = "#volumeFormStdContainer";
  console.log($(containerSelector)[0]);
  this.dlg = Dlg();	
  ReactDOM.render(<this.dlg />, $(containerSelector)[0]);
	
});

/*
  var App = React.createClass({
      render: function () {
		var dlgStyle = {
				height: '100vh',
				overflow: 'hidden'
		};  
        return (
		<div style={dlgStyle}
		className="mpall WholeMainPaneDialog">
			test
		</div>
			
		);
	  }
  });
		  

  var rowGetter = function(i) {
	return this._rows[i];
  }

  var containerSelector = "#volumeFormStdContainer";
  console.log($(containerSelector)[0]);	
  ReactDOM.render(<App />, $(containerSelector)[0]);
*/