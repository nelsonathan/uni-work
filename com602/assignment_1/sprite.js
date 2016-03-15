var 

// Sprite vars //

s_penguin,
s_bg,
s_fg,
s_iceNorth,
s_iceSouth,
s_text,
s_score,
s_splash,
s_buttons,
s_numberS,
s_numberB;

function Sprite(img, x, y, width, height) {
	this.img = img;
	this.x = x*2;
	this.y = y*2;
	this.width = width*2;
	this.height = height*2;
};

/* Draw sprite ta canvas context */
Sprite.prototype.draw = function(ctx, x, y) {
	ctx.drawImage(this.img, this.x, this.y, this.width, this.height,
		x, y, this.width, this.height);
};

/* Initate all sprites */
function initSprites(img) {

	s_penguin = [
		new Sprite(img, 0, 215, 23, 19 ),
		new Sprite(img, 26, 215, 23, 19),
		new Sprite(img, 0, 215, 23, 19),

	];
	
	s_bg = new Sprite(img,   0, 0, 138, 114);
	s_bg.color = "#00C0EF"; // save background color
	s_fg = new Sprite(img, 138, 0, 112,  56);
	
	s_iceNorth = new Sprite(img, 251, 0, 26, 200);
	s_iceSouth = new Sprite(img, 277, 0, 26, 200);
	
	s_text = {
		FlappyPenguin: new Sprite(img, 59, 114, 96, 22),
		GameOver:   new Sprite(img, 59, 136, 94, 19),
		GetReady:   new Sprite(img, 57, 155, 110, 22)
	}
	s_buttons = {
		Ok:    new Sprite(img, 119, 191, 42, 16),
	}

	s_score  = new Sprite(img, 138,  56, 113, 58);
	s_splash = new Sprite(img,   0, 114,  59, 49);

	s_numberS = new Sprite(img, 0, 180, 6,  7);
	s_numberB = new Sprite(img, 0, 190, 7, 10);

	/* Draw number to canvas */
	s_numberS.draw = s_numberB.draw = function(ctx, x, y, num, center, offset) {
		num = num.toString();

		var step = this.width + 2;
		
		if (center) {
			x = center - (num.length*step-2)/2;
		}
		if (offset) {
			x += step*(offset - num.length);
		}

		for (var i = 0, len = num.length; i < len; i++) {
			var n = parseInt(num[i]);
			ctx.drawImage(img, step*n, this.y, this.width, this.height,
				x, y, this.width, this.height)
			x += step;
		}
	}
}