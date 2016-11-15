var socket = io.connect("http://localhost:3000");

var updateScore = function (socket) {
	"use strict";

	socket.on("updateScore", function(data) {
		$("#correct-score").remove();
		$("#wrong-score").remove();
		$("#right").prepend('<div class="value" id="correct-score">' + data.right + '</div>');
		$("#wrong").prepend('<div class="value" id="wrong-score">' + data.wrong + '</div>');
		//$("#correct-score").transition("jiggle");
		//$("#wrong-score").transition("jiggle");
	});
};

var updatePlayers = function (socket) {
	"use strict";

	socket.on("get users", function(data) {
		data.forEach(function(data) {
			$("#users").append(data.username);
		});
	});
};

var main = function (triviaObjects) {
	"use strict";

	var answerId = 1;

	$("#login").on("click", function(event) {
		event.preventDefault();
		var username = $("#username").val();
		if(username != "")
		{
			$("#trivia-login").fadeOut();
			$("#trivia-menu").show();
			$("#users").show();
			$("#trivia-score").show();
			$("#trivia-game h2 span").html(username);
			socket.emit("new user", {username: username});
			socket.emit("score");
		}
	});

	var getQuestion = function() {
		$.get("/questions", function(data) {
			console.log(data);
			if(data) {
				$("#question").html(data.question);
				answerId = data.answerId;
			}
			else {
				console.log("There is no question in the database.");
			}
		});
	};

	$("#getQuestionButton").on("click", function() {
		getQuestion();
	});

	var getAnswer = function() {
		var jsonData,
			result;

		if($("#answer").val() !== " ") {
			jsonData = JSON.stringify({answer:answer, answerId:answerId});
		}

		$.ajax({
			type: "POST",
			url: "/answer",
			dataType: "json",
			data: jsonData,
			success: function(response) {
				console.log(response);
				result = response.correct ? "True":"False";
				$("#getAnswer").html(result);
			},
			contentType: "application/json"
		});
		$("#answer").val("");
	};

	$("#getAnswerButton").on("click", function() {
		getAnswer();
	});

	$("#getAnswerButton").on("keypress", function(event) {
		if(event.keyCode === 13) {
			getAnswer();
		}
	});

	var makeUpQuestion = function() {
		var qstn = $("#makeQuestion").val(),
			ans = $("#createAnswer").val(),
			jsonData = JSON.stringify({question:qstn, answer:ans});

		$.ajax({
			type: "POST",
			url: "/questions",
			dataType: "json",
			data: jsonData,
			success: function(response) {
				console.log(response);
			},
			contentType: "application/json"
		});
	};

	$("#submitQuestion").on("click", function() {
		makeUpQuestion();
	});

	$("#submitQuestions").on("keypress", function(event) {
		if(event.keyCode === 13) {
			makeUpQuestion();
		}
	});

	var getScore = function() {
		$.ajax({
			type: "GET",
			url: "/score",
			dataType: "json",
			success: function(response) {
				console.log(response);
				$("#correcScore").append("Right: " + response.right);
				$("#wrongScore").append("Wrong: " + response.wrong);
			}
		});
	};

	$("#getTotalScore").on("click", function() {
		getScore();
	});

	updateScore(socket);
	updatePlayers(socket);
};

$(document).ready(main);