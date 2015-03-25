if (Meteor.isClient) {
	
	Template.sum.helpers({
		result: function(){
			return ServerSession.get('result');
		}	
	});
	
	Template.sum.events({
    	'submit form': function(event) {
	    	event.preventDefault();
			//var sum = parseInt(event.target.a.value) + parseInt(event.target.b.value);
			Meteor.call('sumValues', parseInt(event.target.a.value), parseInt(event.target.b.value));
    	}
    });
  
}

if (Meteor.isServer) {
	
	exec = Npm.require('child_process').exec;
	
	Meteor.methods({
	
		'sumValues': function (a, b) {
			
			var command = 'pwd';
		    Fiber = Npm.require('fibers');
		    exec(command, function(error, stdout, stderr){
			    console.log(stdout);
			    Fiber(function() {
		        	ServerSession.set('path', pwd = stdout.split('.meteor')[0]);
		        }).run();
		    });
		    		    
			var path = ServerSession.get('path');
		    var command = 'Rscript ' + path + 'sum.R ' + a + ' ' + b;
		    Fiber = Npm.require('fibers');
		    exec(command, function(error, stdout, stderr){
			    console.log('Error: ' + error);
			    console.log('StdErr: ' + stderr);
			    console.log('StdOut: ' + stdout);
			    Fiber(function() {
		        	ServerSession.set('result', stdout.split(' ')[3].split(',')[0]); 
		        }).run();
		    });
		    
		    
		    
		}
	  
	});

}