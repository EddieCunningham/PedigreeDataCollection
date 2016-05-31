"use strict";


function lineWrapper(Ids) {
	var wrapper = myPanel.createGroup();
	wrapper.Ids = Ids;
	var line = myPanel.createLine();
	wrapper.addElement(line);

	wrapper.getStartX = function() {
		return this.getElementAt(0).getStartX();
	}
	wrapper.getEndX = function() {
		return this.getElementAt(0).getEndX();
	}
	wrapper.getStartY = function() {
		return this.getElementAt(0).getStartY();
	}
	wrapper.getEndY = function() {
		return this.getElementAt(0).getEndY();
	}
	wrapper.getStartPoint = function() {
		return this.getElementAt(0).getStartPoint();
	}
	wrapper.getEndPoint = function() {
		return this.getElementAt(0).getEndPoint();
	}
	wrapper.setStartX = function(x) {
		this.getElementAt(0).setStartX(x);
	}
	wrapper.setEndX = function(x) {
		this.getElementAt(0).setEndX(x);
	}
	wrapper.setStartY = function(y) {
		this.getElementAt(0).setStartY(y);
	}
	wrapper.setEndY = function(y) {
		this.getElementAt(0).setEndY(y);
	}
	wrapper.setStartPoint = function(vector) {
		this.getElementAt(0).setStartPoint(vector);
	}
	wrapper.setEndPoint = function(vector) {
		this.getElementAt(0).setEndPoint(vector);
	}
	wrapper.getStroke = function(vector) {
		return this.getElementAt(0).getStroke();
	}
	return wrapper;
}

function calculateXBounds(anchorPoints, additionalPoint) {
	var leftMost, rightMost;
	if(additionalPoint == null) {
		leftMost = anchorPoints[0].getX();
		rightMost = anchorPoints[0].getX();
	}
	else {
		leftMost = additionalPoint.getX();
		rightMost = additionalPoint.getX();
	}

	for(var i=0; i<anchorPoints.length; ++i) {
		if(leftMost > anchorPoints[i].getX()) {
			leftMost = anchorPoints[i].getX();
		}
		if(rightMost < anchorPoints[i].getX()) {
			rightMost = anchorPoints[i].getX();
		}
	}
	return [leftMost, rightMost];
}

function twoParentsEdges(parents, children, parentAnchorPoints, childrenAnchorPoints) {

	var parent1 = parentAnchorPoints[0];
	var parent2 = parentAnchorPoints[1];

	// draw a line between the parents
	var connectParentsLine = lineWrapper([parents[0].Id, parents[1].Id]);
	connectParentsLine.setStartPoint(parent1);
	connectParentsLine.setEndPoint(parent2);

	// calculate the middle of the connectParentsLine and halfway to the highest child
	var halfwayBetween = new jsgl.Vector2D();
	halfwayBetween.setX((parent1.getX()+parent2.getX())/2);
	halfwayBetween.setY((childrenAnchorPoints[0].getY() - (parent1.getY()+parent2.getY())/2)/2 + (parent1.getY()+parent2.getY())/2);

	// draw the line down from connectParentsLine to where the horizontal line will be
	var cplToHorizLine = lineWrapper([]);
	cplToHorizLine.setStartPoint(new jsgl.Vector2D((parent1.getX()+parent2.getX())/2, (parent1.getY()+parent2.getY())/2));
	cplToHorizLine.setEndPoint(halfwayBetween);

	// calculate the bounds of the horizontal line that all children will be attached to
	var xBounds = calculateXBounds(childrenAnchorPoints, halfwayBetween);

	// draw the horizontal line
	var horizontalLine = lineWrapper([]);
	horizontalLine.setStartPoint(new jsgl.Vector2D(xBounds[0], halfwayBetween.getY()));
	horizontalLine.setEndPoint(new jsgl.Vector2D(xBounds[1], halfwayBetween.getY()));

	// draw vertical lines from the children to the horizontal line
	var verticalLines = [];
	for(var i=0; i<childrenAnchorPoints.length; ++i) {
		var vertical = lineWrapper([children[i].Id]);
		vertical.setStartPoint(new jsgl.Vector2D(childrenAnchorPoints[i].getX(), halfwayBetween.getY()));
		vertical.setEndPoint(childrenAnchorPoints[i]);
		verticalLines.push(vertical);
	}

	return [connectParentsLine, cplToHorizLine, horizontalLine].concat(verticalLines);
}

function oneParentEdges(parents, children, parentAnchorPoints, childrenAnchorPoints) {

	var parent = parentAnchorPoints[0];

	// calculate the middle of the connectParentsLine and halfway to the highest child
	var halfwayBetween = new jsgl.Vector2D();
	halfwayBetween.setX(parent.getX());
	halfwayBetween.setY((childrenAnchorPoints[0].getY() - parent.getY())/2 + parent.getY());

	// draw the line down from connectParentsLine to where the horizontal line will be
	var parentToHorizLine = lineWrapper([parents[0].Id]);
	parentToHorizLine.setStartPoint(parent);
	parentToHorizLine.setEndPoint(halfwayBetween);

	// calculate the bounds of the horizontal line that all children will be attached to
	var xBounds = calculateXBounds(childrenAnchorPoints, halfwayBetween);

	// draw the horizontal line
	var horizontalLine = lineWrapper([]);
	horizontalLine.setStartPoint(new jsgl.Vector2D(xBounds[0], halfwayBetween.getY()));
	horizontalLine.setEndPoint(new jsgl.Vector2D(xBounds[1], halfwayBetween.getY()));

	// draw vertical lines from the children to the horizontal line
	var verticalLines = [];
	for(var i=0; i<childrenAnchorPoints.length; ++i) {
		var vertical = lineWrapper([children[i].Id]);
		vertical.setStartPoint(new jsgl.Vector2D(childrenAnchorPoints[i].getX(), halfwayBetween.getY()));
		vertical.setEndPoint(childrenAnchorPoints[i]);
		verticalLines.push(vertical);
	}

	return [parentToHorizLine, horizontalLine].concat(verticalLines);
}

function zeroParentsEdges(children, childrenAnchorPoints) {

	// only draw the horizontal line
	var horizontalLineY = childrenAnchorPoints[0].getY() - window.shapeSize;

	// calculate the bounds of the horizontal line that all children will be attached to
	var xBounds = calculateXBounds(childrenAnchorPoints, null);

	// draw the horizontal line
	var horizontalLine = lineWrapper([]);
	horizontalLine.setStartPoint(new jsgl.Vector2D(xBounds[0], horizontalLineY));
	horizontalLine.setEndPoint(new jsgl.Vector2D(xBounds[1], horizontalLineY));

	// draw vertical lines from the children to the horizontal line
	var verticalLines = [];
	for(var i=0; i<childrenAnchorPoints.length; ++i) {
		var vertical = lineWrapper([children[i].Id]);
		vertical.setStartPoint(new jsgl.Vector2D(childrenAnchorPoints[i].getX(), horizontalLineY));
		vertical.setEndPoint(childrenAnchorPoints[i]);
		verticalLines.push(vertical);
	}

	return [horizontalLine].concat(verticalLines);
}

function noChildrenEdges(parents, parentAnchorPoints) {
	var parent1 = parentAnchorPoints[0];
	var parent2 = parentAnchorPoints[1];

	// draw a line between the parents
	var connectParentsLine = lineWrapper([parents[0].Id, parents[1].Id]);
	connectParentsLine.setStartPoint(parent1);
	connectParentsLine.setEndPoint(parent2);

	return [connectParentsLine];
}

function myHyperEdge(parents, children, type="") {

	// sort the parents by x coordinate
	parents.sort(function(a,b){if(a.getX()<b.getX())return -1;else if(a.getX()>b.getX())return 1;else return 0;});

	var parentAnchorPoints = [];
	var childrenAnchorPoints = [];
	
	// sort the childrenAnchorPoints by y coordinate
	childrenAnchorPoints.sort(function(a,b){if(a.getY()<b.getY())return -1;else if(a.getY()>b.getY())return 1;else return 0;});

	for(var i=0; i<children.length; ++i) {
		childrenAnchorPoints.push(children[i].topAnchor());
	}

    var wrapper = myPanel.createGroup();
    wrapper.shapeName = "hyperEdge";
    wrapper.typeOfHyperEdge = "";

    wrapper.lines = [];
    if(children.length === 0) {
    	if(parents.length === 2) {

			parentAnchorPoints.push(parents[0].rightAnchor());
			parentAnchorPoints.push(parents[1].leftAnchor());

			// assign each person this hyperedge
			parents[0].rightHyperEdges.push(wrapper);
			parents[1].leftHyperEdges.push(wrapper);
		
	    	wrapper.lines = noChildrenEdges(parents, parentAnchorPoints);
	    	wrapper.typeOfHyperEdge = "noChildren";
	    }
	    else {
	    	return null;
	    }
    }
    else if(parents.length === 2) {

		parentAnchorPoints.push(parents[0].rightAnchor());
		parentAnchorPoints.push(parents[1].leftAnchor());

		// assign each person this hyperedge
		parents[0].rightHyperEdges.push(wrapper);
		parents[1].leftHyperEdges.push(wrapper);
	
    	wrapper.lines = twoParentsEdges(parents, children, parentAnchorPoints, childrenAnchorPoints);
    	wrapper.typeOfHyperEdge = "twoParents";
    }
    else if(parents.length === 1) {
		parentAnchorPoints.push(parents[0].bottomAnchor());

		parents[0].bottomHyperEdges.push(wrapper);

    	wrapper.lines = oneParentEdges(parents, children, parentAnchorPoints, childrenAnchorPoints);
    	wrapper.typeOfHyperEdge = "oneParent";
    }
    else if(parents.length === 0) {
    	wrapper.lines = zeroParentsEdges(children, childrenAnchorPoints);
    	wrapper.typeOfHyperEdge = "noParents";
    }


    for(var i=0; i<wrapper.lines.length; ++i) {
    	wrapper.lines[i].getStroke().setWeight(window.outline/2);
    	wrapper.addElement(wrapper.lines[i]);
    }

    // assign all the children this wrapper
    for(var i=0; i<children.length; ++i) {
    	children[i].topHyperEdges.push(wrapper);
    }

    wrapper.parents = parents;
    wrapper.children = children;
    if(wrapper.typeOfHyperEdge === "oneParent") {wrapper.parents.push(new myPerson("dummy", null));}
    else if(wrapper.typeOfHyperEdge === "noParents") {wrapper.parents = [new myPerson("dummy", null), new myPerson("dummy", null)];}

    wrapper.containsParent = function(Id) {
    	for(var i=0; i<this.parents.length; ++i) {
    		if(this.parents[i].Id === Id) {
    			return this.parents[i];
    		}
    	}
    	return null;
    }
    wrapper.containsChild = function(Id) {
    	for(var i=0; i<this.children.length; ++i) {
    		if(this.children[i].Id === Id) {
    			return this.children[i];
    		}
    	}
    	return null;
    }

    // misc things that need to be moved on resize
    wrapper.divorcedLines = [];
    wrapper.consanguinityLines = null;
    wrapper.zygoticLines = [];
    wrapper.oldLine = null;
    wrapper.noChildrenGraphic = null;
    wrapper.infertileGraphic = null;


    wrapper.partOfMiscLines = function(element) {
    	if(this.consanguinityLines != null) {
	    	for(var i=0; i<this.consanguinityLines.getElementsCount(); ++i) {
	    		if(element === this.consanguinityLines.getElementAt(i)) {
	    			return true;
	    		}
	    	}
	    }
	    if(this.noChildrenGraphic != null) {
			for(var i=0; i<this.noChildrenGraphic.getElementsCount(); ++i) {
	    		if(element === this.noChildrenGraphic.getElementAt(i)) {
	    			return true;
	    		}
	    	}
	    }
	    if(this.infertileGraphic != null) {
	    	for(var i=0; i<this.infertileGraphic.getElementsCount(); ++i) {
	    		if(element === this.infertileGraphic.getElementAt(i)) {
	    			return true;
	    		}
	    	}
	    }
		if(this.divorcedLines.indexOf(element) !== -1 || this.zygoticLines.indexOf(element) !== -1) {
			return true;
		}
		return false;
	}


	// will connect the lines to all people in the pedigree
	wrapper.reFit = function() {
		// find the new anchor points and do that thing we did to initialize this
		for(var i=0; i<this.lines.length; ++i) {
			this.removeElement(this.lines[i]);
		}

		if(this.typeOfHyperEdge === "getRidOfThis") {
			// remove this edge from each of the people
			for(var i=0; i<this.parents.length; ++i) {
				this.parents[i].removeHyperEdge(this);
			}
			for(var i=0; i<this.children.length; ++i) {
				this.children[i].removeHyperEdge(this);
			}
			this.parents = [];
			this.children = [];
	    	updateRelationships();
			return "getRidOfIt";
		}

		var childrenAnchorPoints = [];
		for(var i=0; i<this.children.length; ++i) {
			childrenAnchorPoints.push(this.children[i].topAnchor());
		}
		var parentAnchorPoints = [];
		
		if(this.typeOfHyperEdge === "noChildren") {
			parentAnchorPoints.push(this.parents[0].rightAnchor());
			parentAnchorPoints.push(this.parents[1].leftAnchor());
			this.lines = noChildrenEdges(this.parents, parentAnchorPoints);
		}
	    else if(this.typeOfHyperEdge === "twoParents") {
	    	parentAnchorPoints.push(this.parents[0].rightAnchor());
			parentAnchorPoints.push(this.parents[1].leftAnchor());
	    	this.lines = twoParentsEdges(this.parents, this.children, parentAnchorPoints, childrenAnchorPoints);
		}
	    else if(this.typeOfHyperEdge === "oneParent") {
	    	parentAnchorPoints.push(this.parents[0].bottomAnchor());
	    	this.lines = oneParentEdges(this.parents, this.children, parentAnchorPoints, childrenAnchorPoints);
		}
	    else if(this.typeOfHyperEdge === "noParents") {
	    	this.lines = zeroParentsEdges(this.children, childrenAnchorPoints);
		}
	    for(var i=0; i<this.lines.length; ++i) {
    		this.lines[i].getStroke().setWeight(window.outline/2);
	    	this.addElement(this.lines[i]);
		}

		var wasNoChildrenGraphic = false;
		var wasInfertileGraphic = false;
		
	    if(this.noChildrenGraphic != null) {
	    	wasNoChildrenGraphic = true;
	    }

	    if(this.infertileGraphic != null) {
	    	wasInfertileGraphic = true;
	    }

    	this.makeNoChildren(false);
    	this.makeInfertile(false);


	    // move around all of the misc stuff
	    if(this.divorcedLines.length !== 0) {
	    	this.makeNotDivorced();
	    	this.makeDivorced();
	    }
	    if(this.consanguinityLines != null) {
	    	this.makeNotConsanguinity(true);
	    	this.makeConsanguinity();
	    }
	    if(this.zygoticLines != null) {
	    	this.makeZygotic([]);
	    	this.makeZygotic(this.zygotePeople);
	    }
	    if(wasNoChildrenGraphic === true) {
	    	this.makeNoChildren(true);
	    }
	    if(wasInfertileGraphic === true) {
	    	this.makeInfertile(true);
	    }
	    for(var i=0; i<this.children.length; ++i) {
	    	if(this.adoptedPeople.indexOf(this.children[i].Id) !== -1) {
	    		this.makeAdopted(this.children[i].Id, true);
	    	}
	    	else {
	    		this.makeAdopted(this.children[i].Id, false);
	    	}
	    }

	    updateRelationships();
	}

    wrapper.makeDivorced = function() {
    	if(this.typeOfHyperEdge === "twoParents" || this.typeOfHyperEdge === "noChildren") {

    		var xPos = (this.getElementAt(0).getStartX()+this.getElementAt(0).getEndX())/2;
    		var yPos = (this.getElementAt(0).getStartY()+this.getElementAt(0).getEndY())/2;
    		
    		this.divorcedLines = divorcedLinesObjects(xPos, yPos);
    		this.addElement(this.divorcedLines[0]);
    		this.addElement(this.divorcedLines[1]);

    		// make sure that both parents have divorced set to true and the same sub buttons pressed
    		if(this.parents[0].divorcedList.indexOf(this.parents[1].Id) === -1) {
    			this.parents[0].divorcedList.push(this.parents[1].Id);
    		}
    		if(this.parents[1].divorcedList.indexOf(this.parents[0].Id) === -1) {
    			this.parents[1].divorcedList.push(this.parents[0].Id);
    		}
    	}
    }
    wrapper.makeNotDivorced = function() {
    	if(this.divorcedLines.length !== 0) {
    		this.removeElement(this.divorcedLines[0]);
    		this.removeElement(this.divorcedLines[1]);

    		if(this.parents[0].divorcedList.indexOf(this.parents[1].Id) !== -1) {
    			this.parents[0].divorcedList.splice(this.parents[0].divorcedList.indexOf(this.parents[1].Id), 1);
    		}
    		if(this.parents[1].divorcedList.indexOf(this.parents[0].Id) !== -1) {
    			this.parents[1].divorcedList.splice(this.parents[1].divorcedList.indexOf(this.parents[0].Id), 1);
    		}
    	}
    	this.divorcedLines = [];
    }


    wrapper.makeConsanguinity = function() {
    	if(this.typeOfHyperEdge === "twoParents" || this.typeOfHyperEdge === "noChildren") {

    		var xPos = (this.getElementAt(0).getStartX()+this.getElementAt(0).getEndX())/2;
    		var yPos = (this.getElementAt(0).getStartY()+this.getElementAt(0).getEndY())/2;
    		
    		this.consanguinityLines = consanguinityLinesObject(this);

    		this.oldLine = this.getElementAt(0).getElementAt(0);
    		this.getElementAt(0).removeElement(this.oldLine);
    		this.getElementAt(0).addElement(this.consanguinityLines);

    		// make sure that both parents have consanguinity set to true and the same sub buttons pressed
    		if(this.parents[0].consanguinityList.indexOf(this.parents[1].Id) === -1) {
    			this.parents[0].consanguinityList.push(this.parents[1].Id);
    		}
    		if(this.parents[1].consanguinityList.indexOf(this.parents[0].Id) === -1) {
    			this.parents[1].consanguinityList.push(this.parents[0].Id);
    		}
    	}
    }
    wrapper.makeNotConsanguinity = function(reFit) {
    	if(this.consanguinityLines != null) {
    		this.getElementAt(0).removeElement(this.consanguinityLines);

    		if(reFit === false) {
    			this.getElementAt(0).addElement(this.oldLine);
    		}
    		else {
    			this.oldLine = this.getElementAt(0).getElementAt(0);
    		}
    		

    		if(this.parents[0].consanguinityList.indexOf(this.parents[1].Id) !== -1) {
    			this.parents[0].consanguinityList.splice(this.parents[0].consanguinityList.indexOf(this.parents[1].Id), 1);
    		}
    		if(this.parents[1].consanguinityList.indexOf(this.parents[0].Id) !== -1) {
    			this.parents[1].consanguinityList.splice(this.parents[1].consanguinityList.indexOf(this.parents[0].Id), 1);
    		}
    	}
    	this.consanguinityLines = null;
    }

    wrapper.zygotePeople = [];
    wrapper.makeZygotic = function(zygotes) {
    	this.zygotePeople = zygotes;

		// see how many unique zygotic numbers there are
		var oldZygoticNumberList = [];
		for(var i=0; i<this.children.length; ++i) {
			if(this.children[i].zygoticNumber in oldZygoticNumberList) {
				oldZygoticNumberList[this.children[i].zygoticNumber].push(this.children[i].Id);
			}
			else {
				oldZygoticNumberList[this.children[i].zygoticNumber] = [this.children[i].Id];
			}
		}


		// remove the dizygotic lines before we modify the zygoticNumberList
		for(var number in oldZygoticNumberList) {
    		if(number in this.zygoticLines) {
    			this.removeElement(this.zygoticLines[number]);
    			delete this.zygoticLines[number];
    		}
    	}


		// make sure everyone in this list has the same zygotic number
		for(var i=0; i<zygotes.length; ++i) {
			var current = idToPerson(zygotes[i]);
			current.zygoticNumber = window.lastZygoticNumber;
		}
		window.lastZygoticNumber += 1;



		// see how many unique zygotic numbers there are
		var zygoticNumberList = [];
		for(var i=0; i<this.children.length; ++i) {
			if(this.children[i].zygoticNumber in zygoticNumberList) {
				zygoticNumberList[this.children[i].zygoticNumber].push(this.children[i].Id);
			}
			else {
				zygoticNumberList[this.children[i].zygoticNumber] = [this.children[i].Id];
			}
		}


		// move the start points of the children lines so that
		// only people with the same zygotic number are clumped together
		for(var number in zygoticNumberList) {
    		var avgX = 0;
    		var count = 0;

    		// find out where to connect these people
    		for(var i=this.getElementsCount()-1; i>=0; --i) {
    			if(this.partOfMiscLines(this.getElementAt(i)) === true) {continue;}
    			if(this.getElementAt(i).Ids.length === 0) {break;}
    			var current = idToPerson(this.getElementAt(i).Ids[0]);
    			if(current.zygoticNumber === parseInt(number)) {
    				avgX += this.getElementAt(i).getEndX();
    				count += 1;
    			}
    		}
    		avgX /= count;

    		// connect these people
    		var childrenAnchorPoints = [];
    		var halfwayAnchorPoints = [];
    		var additionalPoint = null;
    		var horizontalLineIndex = 0;
    		var x,y;
    		for(var i=this.getElementsCount()-1; i>=0; --i) {
    			if(this.partOfMiscLines(this.getElementAt(i)) === true) {continue;}
    			if(this.getElementAt(i).Ids.length === 0) {
    				if(this.typeOfHyperEdge !== "noParents") {
    					horizontalLineIndex = i;
    					additionalPoint = this.getElementAt(i-1).getEndPoint();
    				}
    				break;
    			}
    			if(idToPerson(this.getElementAt(i).Ids[0]).zygoticNumber === parseInt(number)) {
    				this.getElementAt(i).setStartX(avgX);
    			}
    			childrenAnchorPoints.push(this.getElementAt(i).getStartPoint());

    			if(idToPerson(this.getElementAt(i).Ids[0]).zygoticNumber === parseInt(number)) {
	    			// calculate the halfway point on the line for if we have monozygotic twins
	    			x = (this.getElementAt(i).getStartPoint().getX() + this.getElementAt(i).getEndPoint().getX())/2;
	    			y = (this.getElementAt(i).getStartPoint().getY() + this.getElementAt(i).getEndPoint().getY())/2;
	    			halfwayAnchorPoints.push(new jsgl.Vector2D(x,y));
    			}
    		}

    		// update the horizontal line
    		var xBounds = calculateXBounds(childrenAnchorPoints, additionalPoint);
    		this.getElementAt(horizontalLineIndex).setStartX(xBounds[0]);
    		this.getElementAt(horizontalLineIndex).setEndX(xBounds[1]);


    		// make sure that everyone with this zygotic number only have each
    		// other in their zygotic list. 
    		for(var i=0; i<zygoticNumberList[number].length; ++i) {
    			var current = idToPerson(zygoticNumberList[number][i]);


    			if(zygoticNumberList[number].length === 1) {
    				current.zygoticType = "";
    			}
    			else if(parseInt(number) === window.currentlySelected.zygoticNumber) {
    				current.zygoticType = $("#typeOfZygotic option:selected").text();
    			}
    			current.zygoticList = [];
    			for(var j=0; j<zygoticNumberList[number].length; ++j) {
    				if(zygoticNumberList[number][j] !== current.Id) {
    					current.zygoticList.push(zygoticNumberList[number][j]);
    				}
    			}
    		}
		
    		// if this is monozygotic, then add the extra horizontal line
    		// see if this current zygotic number is monozygotic
    		if(idToPerson(zygoticNumberList[number][0]).zygoticType === "Monozygotic" && zygoticNumberList[number].length > 1) {

    			var midXBounds = calculateXBounds(halfwayAnchorPoints, null);
				var monozygoticLine = lineWrapper([]);
				monozygoticLine.getStroke().setWeight(window.outline/2)
				monozygoticLine.setStartX(midXBounds[0]);
				monozygoticLine.setEndX(midXBounds[1]);
				monozygoticLine.setStartY(y);
				monozygoticLine.setEndY(y);
				this.zygoticLines[number] = monozygoticLine;
				this.addElement(monozygoticLine);
    		}
		}
    }

    wrapper.adoptedPeople = [];
    wrapper.makeAdopted = function(Id, makeDashed) {
    	// will toggle the vertical line connected to a child from dashed to solid
    	var verticalLine = null;

    	for(var i=0; i<this.getElementsCount(); ++i) {
    		var current = this.getElementAt(i);
    		if(current.Ids[0] === Id) {
    			if(makeDashed === true) {
    				if(this.adoptedPeople.indexOf(Id) === -1) {
    					this.adoptedPeople.push(Id);
    				}
    				current.getStroke().setDashStyle(jsgl.DashStyles.DASH);
    			}
    			else {
    				if(this.adoptedPeople.indexOf(Id) !== -1) {
    					this.adoptedPeople.splice(this.adoptedPeople.indexOf(Id),1);
    				}
    				current.getStroke().setDashStyle(jsgl.DashStyles.SOLID);
    			}
    		}
    	}
    }

    wrapper.makeNoChildren = function(showing) {
    	if(showing === true && this.noChildrenGraphic == null && this.parents[0].Id > 0 && this.parents[1].Id > 0) {

    		var xCoord = (this.parents[0].rightAnchor().getX() + this.parents[1].leftAnchor().getX())/2;
    		var yCoord = (this.parents[0].rightAnchor().getY() + this.parents[1].leftAnchor().getY())/2;

	    	var groupThing = myPanel.createGroup();
			var sizeAmount = window.shapeSize/2;

			var line1 = lineWrapper([this.Id]);
			line1.setStartX(xCoord);
			line1.setStartY(yCoord);
			line1.setEndX(line1.getStartX());
			line1.setEndY(line1.getStartY() + sizeAmount);

			var line2 = lineWrapper([this.Id]);
			line2.setStartX(line1.getStartX() - sizeAmount/2);
			line2.setStartY(line1.getEndY());
			line2.setEndX(line1.getStartX() + sizeAmount/2);
			line2.setEndY(line1.getEndY());

			groupThing.addElement(line1);
			groupThing.addElement(line2);

			this.noChildrenGraphic = groupThing;
			this.addElement(this.noChildrenGraphic);

			// add each parent to each others noChildrenList
			if(this.parents[0].noChildrenList.indexOf(this.parents[1].Id) === -1) {
				this.parents[0].noChildrenList.push(this.parents[1].Id);
			}
			if(this.parents[1].noChildrenList.indexOf(this.parents[0].Id) === -1) {
				this.parents[1].noChildrenList.push(this.parents[0].Id);
			}
		}
		else if(showing === false && this.noChildrenGraphic != null) {
			this.removeElement(this.noChildrenGraphic);
			this.noChildrenGraphic = null;

			if(this.parents[0].Id > 0 && this.parents[1].Id > 0) {
				if(this.parents[0].noChildrenList.indexOf(this.parents[1].Id) !== -1) {
					this.parents[0].noChildrenList.splice(this.parents[0].noChildrenList.indexOf(this.parents[1].Id), 1);
				}
				if(this.parents[1].noChildrenList.indexOf(this.parents[0].Id) !== -1) {
					this.parents[1].noChildrenList.splice(this.parents[1].noChildrenList.indexOf(this.parents[0].Id), 1);
				}
			}
			else {
				this.parents[0].noChildrenList = [];
			}
		}
    }

    wrapper.makeInfertile = function(showing) {
    	if(showing === true && this.infertileGraphic == null && this.parents[0].Id > 0 && this.parents[1].Id > 0) {

    		var xCoord = (this.parents[0].rightAnchor().getX() + this.parents[1].leftAnchor().getX())/2;
    		var yCoord = (this.parents[0].rightAnchor().getY() + this.parents[1].leftAnchor().getY())/2;

	    	var groupThing = myPanel.createGroup();
			var sizeAmount = window.shapeSize/2;

			var line1 = lineWrapper([this.Id]);
			line1.setStartX(xCoord);
			line1.setStartY(yCoord);
			line1.setEndX(line1.getStartX());
			line1.setEndY(line1.getStartY() + sizeAmount);

			var line2 = lineWrapper([this.Id]);
			line2.setStartX(line1.getStartX() - sizeAmount/2);
			line2.setStartY(line1.getEndY());
			line2.setEndX(line1.getStartX() + sizeAmount/2);
			line2.setEndY(line1.getEndY());

			var line3 = lineWrapper([this.Id]);
			line3.setStartX(line1.getStartX() - sizeAmount/2);
			line3.setStartY(line1.getEndY() + sizeAmount/4);
			line3.setEndX(line1.getStartX() + sizeAmount/2);
			line3.setEndY(line1.getEndY() + sizeAmount/4);

			groupThing.addElement(line1);
			groupThing.addElement(line2);
			groupThing.addElement(line3);

			this.infertileGraphic = groupThing;
			this.addElement(this.infertileGraphic);

			// add each parent to each others infertileList
			if(this.parents[0].infertileList.indexOf(this.parents[1].Id) === -1) {
				this.parents[0].infertileList.push(this.parents[1].Id);
			}
			if(this.parents[1].infertileList.indexOf(this.parents[0].Id) === -1) {
				this.parents[1].infertileList.push(this.parents[0].Id);
			}
		}
		else if(showing === false && this.infertileGraphic != null) {
			this.removeElement(this.infertileGraphic);
			this.infertileGraphic = null;

			if(this.parents[0].Id > 0 && this.parents[1].Id > 0) {
				if(this.parents[0].infertileList.indexOf(this.parents[1].Id) !== -1) {
					this.parents[0].infertileList.splice(this.parents[0].infertileList.indexOf(this.parents[1].Id), 1);
				}
				if(this.parents[1].infertileList.indexOf(this.parents[0].Id) !== -1) {
					this.parents[1].infertileList.splice(this.parents[1].infertileList.indexOf(this.parents[0].Id), 1);
				}
			}
			else {
				this.parents[0].infertileList = [];
			}
		}
    }

    wrapper.removePerson = function(person) {

    	person.removeHyperEdge(this);

    	if(this.zygotePeople.indexOf(person.Id) !== -1) {
    		this.zygotePeople.splice(this.zygotePeople.indexOf(person.Id), 1);
    	}

    	if(this.adoptedPeople.indexOf(person.Id) !== -1) {
    		this.adoptedPeople.splice(this.adoptedPeople.indexOf(person.Id), 1);
    	}


    	var tempChildren = [];
		for(var i=0; i<this.children.length; ++i) {
			if(this.children[i] !== person) {
				tempChildren.push(this.children[i]);
			}
		}
		this.children = tempChildren;

    	if(this.typeOfHyperEdge === "noParents") {
    		if(this.children.length === 1) {
    			this.typeOfHyperEdge = "getRidOfThis";
    		}
    	}
    	else if(this.typeOfHyperEdge === "oneParent") {
    		if(this.parents[0] === person) {
    			this.parents = [new myPerson("dummy", null), new myPerson("dummy", null)];
    			if(this.children.length <= 1) {
    				this.typeOfHyperEdge = "getRidOfThis";
    			}
    			else {
    				this.typeOfHyperEdge = "noParents";
    			}
    		}
    		else {
    			if(this.children.length === 0) {
    				this.typeOfHyperEdge = "getRidOfThis";
    			}
    		}
    	}
    	else if(this.typeOfHyperEdge === "twoParents") {
    		if(this.parents[0] === person) {
    			if(this.children.length === 0) {
    				this.parents = [new myPerson("dummy", null), new myPerson("dummy", null)];
    				this.typeOfHyperEdge = "getRidOfThis";
    			}
    			else {
    				this.parents = [this.parents[1], new myPerson("dummy", null)];
    				this.typeOfHyperEdge = "oneParent";
    			}
    		}
    		else if(this.parents[1] === person) {
    			if(this.children.length === 0) {
    				this.parents = [new myPerson("dummy", null), new myPerson("dummy", null)];
    				this.typeOfHyperEdge = "getRidOfThis";
    			}
    			else {
    				this.parents = [this.parents[0], new myPerson("dummy", null)];
    				this.typeOfHyperEdge = "oneParent";
    			}
    		}
    		else {
    			if(this.children.length === 0) {
    				this.typeOfHyperEdge = "noChildren";
    			}
    		}
	    }
	    else if(this.typeOfHyperEdge === "noChildren") {
    		this.typeOfHyperEdge = "getRidOfThis";    			
	    }
		
    	return this.reFit();
    }



    wrapper.toJSON = function() {
    	return '{"shapeName":"'+myToString(this.shapeName)+'",'+
			   '"typeOfHyperEdge":"'+myToString(this.typeOfHyperEdge)+'",'+
			   '"parents":"'+myToString(this.parents)+'",'+
			   '"children":"'+myToString(this.children)+'",'+
			   '"zygotePeople":"'+myToString(this.zygotePeople)+'",'+
			   '"adoptedPeople":"'+myToString(this.adoptedPeople)+'"}';
    }


    return wrapper;
}

function divorcedLinesObjects(xPos, yPos) {
	var line1 = lineWrapper([]);
	var line2 = lineWrapper([]);
	line1.getStroke().setWeight(window.outline/2);
	line2.getStroke().setWeight(window.outline/2);

	line1.setStartX(xPos-window.shapeSize/4-3*window.shapeSize/8);
	line1.setStartY(yPos+window.shapeSize/4);
	line1.setEndX(xPos+window.shapeSize/4-3*window.shapeSize/8);
	line1.setEndY(yPos-window.shapeSize/4);

	line2.setStartX(xPos-window.shapeSize/4-window.shapeSize/8);
	line2.setStartY(yPos+window.shapeSize/4);
	line2.setEndX(xPos+window.shapeSize/4-window.shapeSize/8);
	line2.setEndY(yPos-window.shapeSize/4);

	return [line1, line2];
}

function consanguinityLinesObject(wrapper) {
	var line1 = lineWrapper([]);
	var line2 = lineWrapper([]);
	line1.getStroke().setWeight(window.outline/2);
	line2.getStroke().setWeight(window.outline/2);

	line1.setStartX(wrapper.getElementAt(0).getStartX());
	line1.setStartY(wrapper.getElementAt(0).getStartY()-window.shapeSize/8);
	line1.setEndX(wrapper.getElementAt(0).getEndX());
	line1.setEndY(wrapper.getElementAt(0).getEndY()-window.shapeSize/8);

	line2.setStartX(wrapper.getElementAt(0).getStartX());
	line2.setStartY(wrapper.getElementAt(0).getStartY()+window.shapeSize/8);
	line2.setEndX(wrapper.getElementAt(0).getEndX());
	line2.setEndY(wrapper.getElementAt(0).getEndY()+window.shapeSize/8);

	var newWrapper = myPanel.createGroup();
	newWrapper.addElement(line1);
	newWrapper.addElement(line2);
	newWrapper.getStartX = function() {
		return this.getElementAt(0).getStartX();
	}
	newWrapper.getEndX = function() {
		return this.getElementAt(0).getEndX();
	}
	newWrapper.getStartY = function() {
		return this.getElementAt(0).getStartY()+window.shapeSize/8;
	}
	newWrapper.getEndY = function() {
		return this.getElementAt(0).getEndY()+window.shapeSize/8;
	}
	newWrapper.getStroke = function() {
		return this.getElementAt(0).getStroke();
	}
	return newWrapper;
}

function connectFamily() {

	if(window.currentlySelectedParents.length + window.currentlySelectedChildren.length <= 1) {
		// deselect everyone
		for(var i=0; i<window.currentlySelectedChildren.length; ++i) {
			window.currentlySelectedChildren[i].makeUnselectedForFamily();
		}
		for(var i=0; i<window.currentlySelectedParents.length; ++i) {
			if(window.currentlySelectedParents[i].shapeName !== "dummy") {
				window.currentlySelectedParents[i].makeUnselectedForFamily();
			}
		}
		window.currentlySelectedChildren = [];
		window.currentlySelectedParents = [];
		return;
	}

	var edge = null;
	if(window.currentlySelectedParents.length <= 2) {
		edge = myHyperEdge(window.currentlySelectedParents, window.currentlySelectedChildren);
	}

	// deselect everyone
	for(var i=0; i<window.currentlySelectedChildren.length; ++i) {
		window.currentlySelectedChildren[i].makeUnselectedForFamily();
	}
	for(var i=0; i<window.currentlySelectedParents.length; ++i) {
		if(window.currentlySelectedParents[i].shapeName !== "dummy") {
			window.currentlySelectedParents[i].makeUnselectedForFamily();
		}
	}


	if(edge != null) {
		myPanel.addElement(edge);
	}

	window.currentlySelectedChildren = [];
	window.currentlySelectedParents = [];

	// update all the people's relationships
	updateRelationships();
	updateCurrentlySelectedAttributes();
}








