!function($) {
	var config = {
		enemies: ['°', '•', 'ₒ'],
		player: ['_', '-', '¯']
	}

	var Game = function() {
		this.enemies = []
		this.current = 0
		this.level = 1
		this.lives = 3
		this.elapsed = 0
		this.gameover = false
		this.timer = null
		this.outputs = jQuery.Callbacks()

		for (var i = 0; i < 40; i++)
			this.enemies.push(' ')
	}

	Game.prototype = {
		constructor: Game,
		
		update: function() {
			// move enemies
			this.enemies.shift()

			// 10% chance of enemy getting added
			if (Math.round(Math.random() * 10) === 4) {
				this.enemies.push(config.enemies[Math.round(Math.random() * config.enemies.length)])
			} else {
				this.enemies.push(' ')
			}

			// check for hit
			if (this.enemies[0] !== ' ') {
				var dead = false
				for (var i = 0; i < config.enemies.length; i++) {
					if (this.enemies[0] === config.enemies[i] && this.current === (2 - i)) {
						dead = true
					}
				}
				
				// game over message
				if (dead) {
					this.lives--
					if (this.lives === 0) {
						this.gameover = true
						clearInterval(this.timer)
						return
					}
				}
			}

			// Go faster and faster
			this.elapsed++
			if (this.elapsed < 700 && this.elapsed % 100 === 0) {
				clearInterval(this.timer)
				var game = this
				this.timer = setInterval(function() {
					game.update()
					game.draw()
				}, 100 - (this.elapsed / 10))
				this.level++
			}
		},
		
		draw: function() {	
			if (this.gameover) {
				this.outputs.fire('Game_Over!')
				return
			}

			var text = config.player[this.current] + this.enemies.join('')
			var state = ':::' + text + ':::'
			for (var i = 0; i < this.lives; i++)
				state += '♥'
			state += ':::level_' + this.level
			
			this.outputs.fire(state)
		},

		start: function() {
			this.outputs.fire('Starting game...')
			var game = this
			this.timer = setInterval(function() {
				game.update()
				game.draw()
			}, 100)
		},

		moveUp: function() {
			this.current < 2 && this.current++
		},

		moveDown: function() {
			this.current > 0 && this.current--
		},

		addOutput: function(output) {
			this.outputs.add(output)
		}
	}

	var game = new Game()

	// The url
	if (window.history.pushState) {
		game.addOutput(function() {
			var first = true
			return function(msg) {
				if (first) {
					first = false
					window.history.pushState({}, document.title, "/" + msg)
				} else {
					window.history.replaceState({}, document.title, "/" + msg)
				}
			}
		}())
	}

	// The title
	game.addOutput(function(msg) {
		document.title = msg;
		return true
	})

	// The document
	game.addOutput(function() {
		var elem
		return function(msg) {
			if (!elem) {
				if ($.isReady) {
					elem = document.getElementById('game')
				} else {
					return
				}
			}
			elem.innerHTML = msg
		}
	}())

	game.start()
	
	// controls
	$(document).bind('keydown', function (e) {
		var keyCode = e.keyCode || e.which
		if (keyCode === 38)
			game.moveUp()

		if (keyCode === 40)
			game.moveDown()
	});
}(jQuery);