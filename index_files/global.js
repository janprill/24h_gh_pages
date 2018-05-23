function preventDefault(event) {
	if ( isInternetExplorer8() ) {
		event.returnValue=false;
	} else {
		event.preventDefault();
	}		
 }
 
function stopPropagation(event) {
	if ( isInternetExplorer8() ) {
		event.cancelBubble = true;
		event.returnValue = false;
 	} else {
		event.stopPropagation();
 	}
}
 
function isInternetExplorer8() {
	return $.browser.msie && parseInt($.browser.version, 10)==8;
}

function cleanUpPopup() {
	$("#theDarkBg").fadeOut(500, function() {
		$("#theDarkBg").remove();
	});
}

var fillPopup = function(uri) {
	$("body").append('<div class="darkBg" id="theDarkBg"></div>');
	$("#theDarkBg").css({
		position: "fixed",
		left: 0,
		top: 0,
		width: "100%",
		height: "100%",
		zIndex: 0
	});
	
	var width = $("#header").width();
	var topHeight = $("#header").height();
	var totalWidth = $(window).width();
	var innerHeight = 440;
	
	$("#theDarkBg").append('<a class="closeButtonHealthTest" href="#" onclick="cleanUpPopup(); return false">' + 'Schließen' + '</a>' +
			'<div class="thePopup"><div class="thePopupInner" style="overflow:scroll;margin-top:150px;background-color:#fff;height:440px"></div></div>');

	$("a.closeButtonHealthTest").css({ top: topHeight + 40, right: (totalWidth - width)/2 });
	$("a.closeButtonHealthTest").css("z-index","300");
	$(".thePopup").css({ left: (totalWidth - width)/2, top: '75px', width: width, position: 'fixed' });
	
	$(".thePopup").animate({ height: innerHeight }, 500, function() {
		$.ajax({
			type: 'GET',
			url: uri,
			success: function(data, errorStatus, xhr) {
				$(".thePopupInner").html(data);
			}
		});
		/* fix: button lag manchmal hinter dem popup */
		$("a.closeButtonHealthTest").fadeIn(500);
		
		return false;
	});
};


function startHealthTest() {
	$("body").append('<div class="darkBg" id="quicktest"></div>');
	$("#quicktest").css({
		position: "fixed",
		left: 0,
		top: 0,
		width: "100%",
		height: "100%",
		zIndex: 0
	});
	
	var width = $("#header").width();
	var topHeight = $("#header").height();
	var totalWidth = $(window).width();
	var innerHeight = 440;
	
	$("#quicktest").append('<a class="closeButtonHealthTest" href="#" onclick="cleanUpHealthTest(); return false">' + 'Schließen' + '</a>' +
		'<div class="healthTest"><p>' + 'SIND SIE FIT FÜR DIE 24STUNDEN<b>DIÄT</b>?' + '</p><div class="healthInner"></div></div>');

	$("a.closeButtonHealthTest").css({ top: topHeight + 40, right: (totalWidth - width)/2 });
	$("a.closeButtonHealthTest").css("z-index","300");
	$(".healthTest").css({ left: (totalWidth - width)/2, top: topHeight + 37, width: width });
	
	$(".healthTest").animate({ height: innerHeight }, 500, function() {
		loadNextHealthStep();
		/* fix: button lag manchmal hinter dem popup */
		$("a.closeButtonHealthTest").fadeIn(500);
	});
}

function cleanUpHealthTest() {
	$("#quicktest").fadeOut(500, function() {
		$("#quicktest").remove();
	});
}

function loadNextHealthStep() {
	var state  = $('.healthInner input:hidden').val();
	var choice = $('.healthInner input:checked').val();
	if (!state) state = "";
	if (!choice) choice = "";
	$.ajax({
		type: 'POST',
		url: "healthCheck.htm",
		data: { state: state, choice: choice },
		success: function(data, errorStatus, xhr) {

			$(".healthInner").fadeOut(200, function() {
				$(".healthInner").html(data);
				$(".healthInner input[type='radio']").change(function() {
					$(".healthCheckNext").fadeIn(200);
				});
				$(".healthInner input[type='radio']").uniform();
				setTimeout(function() {
					$(".healthInner").fadeIn(200);
				}, 100);
			});
		}
	});
	return false;
}

