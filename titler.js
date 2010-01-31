$(function() {
	var enemies = [];
	for (var i = 0; i < 20; i++) {
		enemies.push(' ');
	}
	var chars = ['°', '•', 'ₒ']; //, '♥', '☺'
	var player = ['_', '-', '¯'];
	var current = 0;
	var level = 1;
	var lives = 3;
	
	var timer = setInterval(game, 100);
	var elapsed = 0;
	
	function game() {
		var t = player[current];
		
		// 10% chance of enemy getting added
		if (Math.round(Math.random() * 10) === 4) {
			enemies[enemies.length-1] = chars[Math.round(Math.random() * chars.length)];
		} else {
			enemies[enemies.length-1] = ' ';
		}
		t += enemies.join('');
		
		// check for hit
		if (enemies[0] !== ' ') {
			var dead = false;
			for (var i = 0; i < chars.length; i++) {
				if (enemies[0] === chars[i] && current === (2 - i)) {
					dead = true;
				}
			}
			
			// game over message
			if (dead) {
				lives--;
				if (lives === 0) {
					document.title = 'Game over!';
					clearInterval(timer);
					return;
				}
			}
		}
		
		// move enemies
		for (var i = 1; i < enemies.length; i++) {
			enemies[i-1] = enemies[i];
		}
		
		document.title = 'lvl:' + level + ' ☺:' + lives + ' |' + t;
		
		// Go faster and faster
		elapsed++;
		if (elapsed < 700 && elapsed % 100 === 0) {
			clearInterval(timer);
			timer = setInterval(game, 100 - (elapsed / 10));
			level++;
		}
	};
	
	// controls
	$(document).bind('keydown', 'up', function (evt){
		if (current < 2) {
			current++;
		}
	});
	$(document).bind('keydown', 'down', function (evt){
		if (current > 0) {
			current--;
		}
	});
});