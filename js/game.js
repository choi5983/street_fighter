function PlayGround(selector)
{
	var canvas = document.getElementById(selector);	//get the canvas
	var context = canvas.getContext('2d');
	var ch1 = new Character(context);	//create the first character
	var ch2 = new Character(context);	//create the first character
	
	this.initialize = function()
	{
		ch1.setControl();

		var actions_map_for_ch2 = {
			'STANDING': 	{ keyCode: 0 , 'y': 1, 'x': [0, 1, 2, 3] },		//keyCode for Standing is not needed so this could be changed/refactored
			'PUNCH':  		{ keyCode: 188, 'y': 2, 'x': [0, 1, 2] },
			'WALK_RIGHT': 	{ keyCode: 39, 'y': 3, 'x': [0, 1, 2] },
			'WALK_LEFT': 	{ keyCode: 37, 'y': 3, 'x': [2, 3, 4] },
			'KNEEL': 		{ keyCode: 40, 'y': 9, 'x': [0] },
			'ROUND_HOUSE': 	{ keyCode: 190, 'y': 7, 'x': [0, 1, 2, 3, 4] },
			'KICK': 		{ keyCode: 191, 'y': 6, 'x': [0, 1, 2, 3, 4] }
		}	//this records the appropriate keyCode as well as the coordinate of the sprites in ken.png that correspond to that particular action

		ch2.setControl(actions_map_for_ch2, 2);
	}

	detectCollision = function()
	{
		var actions_damage_map = {
			'PUNCH' : 		{ damage: 2 },
			'KICK' : 		{ damage: 3 },
			'ROUND_HOUSE' : 		{ damage: 5 }
		}

		//implementing a very very simple collision/damage calculation system
		//feel free to add/edit/update codes below
		if(ch1.player.position.x > (ch2.player.position.x-45) && ch1.player.position.x < (ch2.player.position.x-10))
		{
			if(ch1.player.counter==1 && (ch1.player.action == 'PUNCH' || ch1.player.action == 'ROUND_HOUSE' || ch1.player.action == 'KICK' ))
			{
				ch2.player.health = ch2.player.health - actions_damage_map[ch1.player.action].damage;
			}

			if(ch2.player.counter==1 && (ch2.player.action == 'PUNCH' || ch2.player.action == 'ROUND_HOUSE' || ch2.player.action == 'KICK' ))
			{
				ch1.player.health = ch1.player.health - actions_damage_map[ch2.player.action].damage;
			}
		}
	}

	drawHealthBars = function()
	{
		context.fillStyle="#FFFFFF";
		context.fillRect(20,10,120,10);	
		context.fillRect(150,10,120,10);

		context.fillStyle="#FF0000";
		context.fillRect(20,10,parseInt(ch1.player.health*1.2),10);
		context.fillStyle="#0000FF";
		context.fillRect(150,10,parseInt(ch2.player.health*1.2),10);
	}

	this.mainLoop = function()
	{
		context.clearRect(0, 0, canvas.width, canvas.height);	//clean up the canvas before drawing
		ch1.drawCharacter();
		ch2.drawCharacter();
		detectCollision();
		drawHealthBars();
	}

	this.initialize();
}	//end of PlayGround class

function Character(selector)
{
	var context = selector;
	var this_obj = this;

	var actions_map = {
			'STANDING': 	{ keyCode: 0 , 'y': 1, 'x': [0, 1, 2, 3] },		//keyCode for Standing is not needed so this could be changed/refactored
			'PUNCH':  		{ keyCode: 81, 'y': 2, 'x': [0, 1, 2] },
			'WALK_RIGHT': 	{ keyCode: 68, 'y': 3, 'x': [0, 1, 2] },
			'WALK_LEFT': 	{ keyCode: 65, 'y': 3, 'x': [2, 3, 4] },
			'KNEEL': 		{ keyCode: 83, 'y': 9, 'x': [0] },
			'ROUND_HOUSE': 	{ keyCode: 69, 'y': 7, 'x': [0, 1, 2, 3, 4] },
			'KICK': 		{ keyCode: 87, 'y': 6, 'x': [0, 1, 2, 3, 4] }
		}	//this records the appropriate keyCode as well as the coordinate of the sprites in ken.png that correspond to that particular action

	this.player = {
		action: 		"STANDING", 
		position: 		{ x:0, y:0 } ,
		player_number: 	1 ,
		img_source: 	'images/ken.png' ,
		health: 		100 ,
		counter: 		0	//stores which sprite (in the x-direction) it should display
	}
	
	var img = new Image();   // Create new img element
	var pressedKeys = [];

	//attach the appropriate event listeners for the keypress activities
	this.initialize = function()
	{
		img.src= this.player.img_source;
	}

	//allow the program to change the control/actions
	this.setControl = function(new_actions_map, number)
	{
		if(new_actions_map != null)
			actions_map = new_actions_map;
		if(number != null)			//if player_number is not passed, assume it's for the first player
		{	
			this.player.player_number = 2;;		//otherwise assume it's for player 2
			this.player.position.x = 200;
		}
		
		//to detect multiple keys being pressed 
		$(document).keydown(function(e) {
			pressedKeys[e.keyCode] = true;
			// console.log(e.keyCode);
			for(action in actions_map)
			{
				if(pressedKeys[actions_map[action].keyCode])
					this_obj.updateAction(action);
			}
		});

		$(document).keyup(function(e) {
			pressedKeys[e.keyCode] = false;
		});

	}

	//updates the action
	this.updateAction = function(action)
	{
		//only allow the user to perform another action if the player is standing
		if(this.player.action == 'STANDING')
			this.player.counter=0;	//set counter to 0 so that it would display the first sprite for that particular action
		this.player.action = action;
	}

	//updates the character's coordinates and changes the sprite's counter to simulate the character moving
	this.updateCoordinate = function()
	{
		if(this.player.counter>=actions_map[this.player.action].x.length)
		{
			this.player.counter=0;
			//if action is anything other than 'STANDING' change the action back to 'STANDING'
			this.player.action = 'STANDING';
		}
		
		if(this.player.action == 'WALK_LEFT')
			this.player.position.x = this.player.position.x-4;
		else if(this.player.action == 'WALK_RIGHT')
			this.player.position.x = this.player.position.x+4;
	}

	//draws the character on the screen
	this.drawCharacter = function()
	{
		// console.log("drawing character");
		this.updateCoordinate();
		
		if(this.player.player_number == 1)
			context.drawImage(img, actions_map[this.player.action].x[this.player.counter++]*70, actions_map[this.player.action].y*80, 70, 80, this.player.position.x, 53, 70, 80); //see http://www.w3schools.com/tags/canvas_drawimage.asp to better understand how drawImage method works
		else	//if it's player 2 rotate the image so that it's facing the other way
		{
			context.save();
			context.scale(-1, 1);
			context.drawImage(img, actions_map[this.player.action].x[this.player.counter++]*70, actions_map[this.player.action].y*80, 70, 80, this.player.position.x*-1-70, 53, 70, 80); //see http://www.w3schools.com/tags/canvas_drawimage.asp to better understand how drawImage method works
			context.restore();
		}

	}

	this.initialize();
}