function PlayGround(selector_ch1)
{
	//create the first character
	var ch1 = new Character(selector_ch1);

	//map of action and the respective keyCode
	var actionKeyMap = {
		"WALK_RIGHT": 39,	//right arrow
		"WALK_LEFT": 37,	//left arrow
		"KNEEL": 40,		//down arrow
		"PUNCH": 65,		//a button
		"KICK": 83,			//s button
		"BEAM": 68,			//d button
		"ROUND_HOUSE": 70	//f button
	}

	//attaches event listener to the document listening for key strokes
	this.initialize = function()
	{
		$(document).keydown(function(e) {
			for(action in actionKeyMap)
			{
				if(e.keyCode == actionKeyMap[action])
					ch1.updateAction(action);
			}
		});
	}

	this.mainLoop = function()
	{
		ch1.drawCharacter();
	}


}	//end of PlayGround class

function Character(selector)
{
	var selector = selector; //store the html id of the character

	var constants = {
		'STANDING': 	{ 'y': 1, 'x': [0, 1, 2, 3] },
		'PUNCH':  		{ 'y': 2, 'x': [0, 1, 2, 3] },
		'WALK_RIGHT': 	{ 'y': 3, 'x': [0, 1, 2] },
		'WALK_LEFT': 	{ 'y': 3, 'x': [2, 3, 4] },
		'KNEEL': 		{ 'y': 9, 'x': [0] },
		'KICK': 		{ 'y': 6, 'x': [0, 1, 2, 3, 4] },
		'PUNCH': 		{ 'y': 2, 'x': [0, 1, 2] },
		'BEAM': 		{ 'y': 0, 'x': [0, 1, 2, 3] },
		'ROUND_HOUSE': 	{ 'y': 7, 'x': [0, 1, 2, 3, 4]}
	}
	var counter = 0;			//stores which sprite (in the x-direction) it should display 
	this.action = "STANDING";	//default action is for the character to stand
	this.position = {x:0, y:0}	//store the character's position this could be a private object but to make it easier to debug we're making it priliveged

	this.drawSprite = function(y, x)
	{
		$('#'+selector).css('background', "url('images/ken.png') "+x*(-70)+"px "+(-80*y)+"px").css('left', this.position.x+"px");
	}

	//updates the action
	this.updateAction = function(action)
	{
		counter=0;
		this.action = action;
	}

	//updates the character's coordinates and changes the sprite's counter to simulate the character moving
	this.updateCoordinate = function()
	{
		if(counter>=constants[this.action].x.length)
		{
			counter=0;
			//if action is anything other than 'STANDING' change the action back to 'STANDING'
			this.action = 'STANDING';
		}
		
		if(this.action == 'WALK_LEFT')
			this.position.x = this.position.x-10;
		else if(this.action == 'WALK_RIGHT')
			this.position.x = this.position.x+10;
	}

	//draws the character on the screen
	this.drawCharacter = function()
	{
		// console.log("drawing character");
		this.updateCoordinate();
		this.drawSprite(constants[this.action].y, constants[this.action].x[counter++]);
	}
}