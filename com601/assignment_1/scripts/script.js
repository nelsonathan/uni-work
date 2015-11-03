// LIVE CLOCK

function startTime() {
	var today = new Date();
	var h = today.getHours();
	var m = today.getMinutes();
	var s = today.getSeconds();
	m = checkTime(m);
	s = checkTime(s);
	document.getElementById('time').innerHTML = h + ":" + m + ":" + s;
	t = setTimeout('startTime()', 500);
}

function checkTime(i) {
	if (i < 10) {
		i = "0" + i;
	}
	return i;
}

// NAV APPEAR ON SCROLL

$(document).ready(function($) {          
	$(document).scroll(function(){
	     $('header').toggleClass('scrolled', $(this).scrollTop() > 400);
	     $('.logo').toggleClass('scrolled', $(this).scrollTop() > 400);
	     
 	});
 });
 
// LOAD PLAYERS FROM PLAYERS.HTML

	$(document).ready( function() {
		$( "#profiles" ).load( "players.html #players" );
	});
 
 // TOOLTIP ON PLAYERS
	
$(document).ready(function() {
 $( document ).tooltip({
      position: {
        my: "center bottom-20",
        at: "center top",
        using: function( position, feedback ) {
          $( this ).css( position );
          $( "<div>" )
            .addClass( "arrow" )
            .addClass( feedback.vertical )
            .addClass( feedback.horizontal )
            .appendTo( this );
        }
      }
    });
 });
 

// TOGGLE HONOURS WHEN CLICKED

$(document).ready(function() {
	$("#league img").click(function(e) {
		$("#league p").toggle('size');
		e.preventDefault();
	});
	$("#cup img").click(function(e) {
		$("#cup p").toggle('size');
		e.preventDefault();
	});
	$("#euro img").click(function(e) {
		$("#euro p").toggle('size');
		e.preventDefault();
	});
	$("#uefa img").click(function(e) {
		$("#uefa p").toggle('size');
		e.preventDefault();
	});
	$("#fa img").click(function(e) {
		$("#fa p").toggle('size');
		e.preventDefault();
	});
});



// FIXTURES USING JSON

	$(document).ready(function() {

	  $.getJSON('scripts/fixtures.json', function(data) {
 		var output="";
	        $.each(data.fixtures, function(i, item) {
	            output="<option value="+i+">" + data.fixtures[i].Competition + "</option>";
		    $('#placeholder').append(output);
		});
	  });

	$("#upcoming").submit(function(evt){
		evt.preventDefault();
		var option_picked = $("#placeholder option:selected").val();
		if (option_picked == -1)
			alert("Please Select a Competition");
		else {
			$.ajax({
			      url:'scripts/fixtures.json',
			      dataType: 'json',
			      success: function( data ) {
				  var table_info="<table id='tblFixtures' border='0'><thead><th>Month</th><th>Date</th><th></th><th>Opponent</th><th>Location</th></thead><tbody>";
				 table_info+="<tr><td>" + data.fixtures[option_picked].Month + "</td><td>" +
					data.fixtures[option_picked].Day + "</td><td>" +
					"<img src='" + data.fixtures[option_picked].OpponentBadge + "'/></td><td>" +
					data.fixtures[option_picked].Opponent + "</td><td>" +
					data.fixtures[option_picked].Location + "</td></tr>";
				 $("#result").empty();
				 $('#result').append(table_info);
					table_info+="</tbody></table>";
				 },
				 error:function(){
			 	  //if there is an error append a 'none available' option
			   	 	$('#result').html("No fixtures available");
			 	 }
				});
			     }
			});
	   });


	   
