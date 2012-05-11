!function($) {
	var enemies = [],
		chars = ['°', '•', 'ₒ'],
		player = ['_', '-', '¯'],
		current = 0,
		level = 1,
		lives = 3,
		elapsed = 0

	for (var i = 0; i < 40; i++)
		enemies.push(' ')
		
	var game = function() {
		var t = player[current]
		
		// 10% chance of enemy getting added
		if (Math.round(Math.random() * 10) === 4) {
			enemies[enemies.length-1] = chars[Math.round(Math.random() * chars.length)]
		} else {
			enemies[enemies.length-1] = ' '
		}
		t += enemies.join('')
		
		// check for hit
		if (enemies[0] !== ' ') {
			var dead = false
			for (var i = 0; i < chars.length; i++) {
				if (enemies[0] === chars[i] && current === (2 - i)) {
					dead = true
				}
			}
			
			// game over message
			if (dead) {
				lives--
				if (lives === 0) {
					window.history.replaceState({}, document.title, "/Game_Over!")
					clearInterval(timer)
					return
				}
			}
		}
		
		// move enemies
		for (var i = 1; i < enemies.length; i++) {
			enemies[i-1] = enemies[i]
		}

		var state = ':::' + t + ':::'
		for (var i = 0; i < lives; i++)
			state += '♥'
		state += ':::level_' + level
		window.history.replaceState({}, document.title, "/" + state)
		
		// Go faster and faster
		elapsed++
		if (elapsed < 700 && elapsed % 100 === 0) {
			clearInterval(timer)
			timer = setInterval(game, 100 - (elapsed / 10))
			level++
		}
	};

	window.history.pushState({}, document.title, "/Starting_game...")
	var timer = setInterval(game, 100)
	
	// controls
	$(document).bind('keydown', 'up', function (e) {
		var keyCode = e.keyCode || e.which

		if (current < 2 && keyCode === 38)
			current++

		if (current > 0 && keyCode === 40)
			current--
	});
}(jQuery);