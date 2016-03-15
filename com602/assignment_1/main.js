var

// Game Variables //

canvas,
ctx,
width,
height,

fgpos = 0,
frames = 0,
score = 0,
best = localStorage.getItem("best") || 0,

// State Variables //

currentstate,
states = {
	Splash: 0, Game: 1, Score: 2
},

// Game Objects //

/* OK button initiated in main() */
okbtn,

/* The Character */

penguin = {

	x: 60,
	y: 0,

	frame: 0,
	velocity: 0,
	animation: [0, 1, 2, 1], // animation sequence

	rotation: 0,
	radius: 12,

	gravity: 0.1,
	_jump: 2.8,

	/* Makes the penguin hover and jump */
	jump: function() {
		this.velocity = -this._jump;
	},

	/* Update sprite animation and position of penguin */
	update: function() {
		// make sure animation updates and plays faster in gamestate
		var n = currentstate === states.Splash ? 10 : 5;
		this.frame += frames % n === 0 ? 1 : 0;
		this.frame %= this.animation.length;

		// in splash state make penguin hover up and down and set rotation to zero
		if (currentstate === states.Splash) {

			this.y = height - 280 + 5*Math.cos(frames/10);
			this.rotation = 0;

		} else { // game and score state //

			this.velocity += this.gravity;
			this.y += this.velocity;

			// change to the score state when penguin touches the ground
			if (this.y >= height - s_fg.height-10) {
				this.y = height - s_fg.height-10;
				if (currentstate === states.Game) {
					currentstate = states.Score;
				}
				
				// sets velocity to jump speed for correct rotation
				this.velocity = this._jump;
			}

			// when penguin lacks upward momentum increment the rotation angle
			if (this.velocity >= this._jump) {

				this.frame = 1;
				this.rotation = Math.min(Math.PI/2, this.rotation + 0.1);

			} else {

				this.rotation = -0.3;

			}
		}
	},

	/* Draws penguin with rotation to canvas ctx */
	draw: function(ctx) {
		ctx.save();
		
		// translate and rotate ctx coordinatesystem
		ctx.translate(this.x, this.y);
		ctx.rotate(this.rotation);
		
		var n = this.animation[this.frame];
		
		// draws the penguin with center in origo
		s_penguin[n].draw(ctx, -s_penguin[n].width/2, -s_penguin[n].height/2);

		ctx.restore();
	}
},

/* The ice blocks */

ice = {

	_ice: [],
	// padding: 80, // TODO: Implement paddle variable

	/**
	 * Empty ice blocks array
	 */
	reset: function() {
		this._ice = [];
	},

	/**
	 * Create, push and update all ice in ice array
	 */
	update: function() {
		// add new ice-block each 100 frames
		if (frames % 100 === 0) {
			
			// calculate y position
			var _y = height - (s_iceSouth.height+s_fg.height+120+200*Math.random());
			
			// create and push ice block to array
			this._ice.push({
				x: 600,
				y: _y,
				width: s_iceSouth.width,
				height: s_iceSouth.height
			});
		}
		for (var i = 0, len = this._ice.length; i < len; i++) {
			var p = this._ice[i];

			if (i === 0) {

				score += p.x === penguin.x ? 1 : 0;

				// collision check, calculates x/y difference and
				// use normal vector length calculation to determine
				// intersection
				var cx  = Math.min(Math.max(penguin.x, p.x), p.x+p.width);
				var cy1 = Math.min(Math.max(penguin.y, p.y), p.y+p.height);
				var cy2 = Math.min(Math.max(penguin.y, p.y+p.height+100), p.y+2*p.height+100);
				
				// closest difference
				var dx  = penguin.x - cx;
				var dy1 = penguin.y - cy1;
				var dy2 = penguin.y - cy2;
				
				// vector length
				var d1 = dx*dx + dy1*dy1;
				var d2 = dx*dx + dy2*dy2;
				var r = penguin.radius*penguin.radius;
				
				// determine intersection
				if (r > d1 || r > d2) {
					currentstate = states.Score;
				}
			}
			// move ice and remove if outside of canvas
			p.x -= 2;
			if (p.x < -p.width) {
				this._ice.splice(i, 1);
				i--;
				len--;
			}
		}
	},

	/* Draw all ice blocks to canvas context */
	draw: function(ctx) {
		for (var i = 0, len = this._ice.length; i < len; i++) {
			var p = this._ice[i];
			s_iceSouth.draw(ctx, p.x, p.y);
			s_iceNorth.draw(ctx, p.x, p.y+100+p.height);
		}
	}
};

/* Called on mouse or touch press. Update and change state depending on current game state. */
function onpress(evt) {

	switch (currentstate) {

		// change state and update penguin velocity
		case states.Splash:
			currentstate = states.Game;
			penguin.jump();
			break;

		// update penguin velocity
		case states.Game:
			penguin.jump();
			break;

		// change state if event within okbtn bounding box
		case states.Score:
			// get event position
			var mx = evt.offsetX, my = evt.offsetY;

			if (mx == null || my == null) {
				mx = evt.touches[0].clientX;
				my = evt.touches[0].clientY;
			}

			// check if within
			if (okbtn.x < mx && mx < okbtn.x + okbtn.width &&
				okbtn.y < my && my < okbtn.y + okbtn.height
			) {
				ice.reset();
				currentstate = states.Splash;
				score = 0;
			}
			break;

	}
}

/**
 * Starts and initiate the game
 */
function main() {
	// create canvas and set width/height
	canvas = document.createElement("canvas");

	width = window.innerWidth;
	height = window.innerHeight;

	var evt = "touchstart";
	if (width >= 500) {
		width  = 320;
		height = 480;
		canvas.style.border = "1px solid #000";
		evt = "mousedown";
	}

	// listen for input event
	document.addEventListener(evt, onpress);

	canvas.width = width;
	canvas.height = height;
	if (!(!!canvas.getContext && canvas.getContext("2d"))) {
		alert("Your browser doesn't support HTML5, please update to latest version");
	}
	ctx = canvas.getContext("2d");

	currentstate = states.Splash;
	// append canvas to document
	document.body.appendChild(canvas);

	
	// initate graphics and okbtn
	var img = new Image();
	img.onload = function() {
		initSprites(this);
		ctx.fillStyle = s_bg.color;

		okbtn = {
			x: (width - s_buttons.Ok.width)/2,
			y: height - 200,
			width: s_buttons.Ok.width,
			height: s_buttons.Ok.height
		}

		run();
	}
	img.src = "sheet.png";
}


/* Starts and update gameloop */

function run() {
	var loop = function() {
		update();
		render();
		window.requestAnimationFrame(loop, canvas);
	}
	window.requestAnimationFrame(loop, canvas);
}


/* Update foreground, character and ice position */

function update() {
	frames++;

	if (currentstate !== states.Score) {
		fgpos = (fgpos - 2) % 14;
	} else {
		// set best score to maximum score
		best = Math.max(best, score);
		localStorage.setItem("best", best);
	}
	if (currentstate === states.Game) {
		ice.update();
	}

	penguin.update();
}

/* Draws character and all ice blocks and assets to the canvas */

function render() {
	
	// draw background color
	
	ctx.fillRect(0, 0, width, height);
	
	// draw background sprites
	
	s_bg.draw(ctx, 0, height - s_bg.height);
	s_bg.draw(ctx, s_bg.width, height - s_bg.height);

	ice.draw(ctx);
	penguin.draw(ctx);

	// draw foreground sprites
	
	s_fg.draw(ctx, fgpos, height - s_fg.height);
	s_fg.draw(ctx, fgpos+s_fg.width, height - s_fg.height);

	var width2 = width/2; // center of canvas

	if (currentstate === states.Splash) {
		// draw splash text and sprite to canvas
		s_splash.draw(ctx, width2 - s_splash.width/2, height - 300);
		s_text.GetReady.draw(ctx, width2 - s_text.GetReady.width/2, height-380);

	}
	if (currentstate === states.Score) {
		// draw gameover text and score board
		s_text.GameOver.draw(ctx, width2 - s_text.GameOver.width/2, height-400);
		s_score.draw(ctx, width2 - s_score.width/2, height-340);
		s_buttons.Ok.draw(ctx, okbtn.x, okbtn.y);
		
		// draw score and highscore inside the score board
		s_numberS.draw(ctx, width2-47, height-304, score, null, 10);
		s_numberS.draw(ctx, width2-47, height-262, best, null, 10);

	} else {
		// draw score to top of canvas
		s_numberB.draw(ctx, null, 20, score, width2);

	}
}
