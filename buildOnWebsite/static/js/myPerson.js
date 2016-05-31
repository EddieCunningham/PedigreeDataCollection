"use strict";

window.globalId = 1;
window.outline = 10;
window.shapeSize = 50;

window.notShownMate = -1;

function myPerson(shapeName, location) {

    var wrapper = myPanel.createGroup();

    var jsglShape;
    if(shapeName === "circle") {
    	jsglShape = myPanel.createCircle();
	    jsglShape.getStroke().setWeight(window.outline);
	    jsglShape.setCenterLocation(location);
	    jsglShape.setRadius(window.shapeSize/2);
	}
    else if(shapeName === "diamond") {
    	jsglShape = myPanel.createRectangle();
	    jsglShape.getStroke().setWeight(window.outline);
	    jsglShape.setRotation(45);
	    jsglShape.setLocationXY(location.getX(),location.getY()-window.shapeSize/2);
	    jsglShape.setWidth(window.shapeSize/Math.sqrt(2));
	    jsglShape.setHeight(window.shapeSize/Math.sqrt(2));
	}
    else if(shapeName === "square") {
    	jsglShape = myPanel.createRectangle();
	    jsglShape.getStroke().setWeight(window.outline);
	    jsglShape.setLocationXY(location.getX()-window.shapeSize/2,location.getY()-window.shapeSize/2);
	    jsglShape.setWidth(window.shapeSize);
	    jsglShape.setHeight(window.shapeSize);
	}
    else if(shapeName === "dummy") {}
	wrapper.shapeName = shapeName;
    if(wrapper.shapeName !== "dummy") {
    	wrapper.shapeObject = jsglShape;
    	wrapper.addElement(jsglShape);
    }
    wrapper.custom = false;
    wrapper.isSelected = false;
    wrapper.isSelectedForFamily = "";

    wrapper.getX = function() {
    	try{
    		return this.shapeObject.getXCustom();
		}
	    catch(e){
	    	try {
	    		return this.shapeObject.getCenterX();
	    	}
	    	catch(e_) {
	    		return this.shapeObject.getX();
	    	}
		}
	}
    wrapper.getY = function() {
    	try{
    		return this.shapeObject.getYCustom();
		}
    	catch(e){
    		try {
    			return this.shapeObject.getCenterY();
    		}
    		catch(e_) {
    			return this.shapeObject.getY();
    		}
		}
	}

    wrapper.rightAnchor = function() {
        if(this.shapeName === "diamond") {
        	return new jsgl.Vector2D(this.getX()+window.shapeSize/2,this.getY()+window.shapeSize/2);
    	}
        else if(this.shapeName === "square") {
        	return new jsgl.Vector2D(this.getX()+window.shapeSize,this.getY()+window.shapeSize/2);
    	}
        else if(this.shapeName === "circle") {
        	return new jsgl.Vector2D(this.getX()+window.shapeSize/2,this.getY());
    	}
	}
    wrapper.leftAnchor = function() {
        if(this.shapeName === "diamond") {
        	return new jsgl.Vector2D(this.getX()-window.shapeSize/2,this.getY()+window.shapeSize/2);
    	}
        else if(this.shapeName === "square") {
        	return new jsgl.Vector2D(this.getX(),this.getY()+window.shapeSize/2);
    	}
        else if(this.shapeName === "circle") {
        	return new jsgl.Vector2D(this.getX()-window.shapeSize/2,this.getY());
    	}
	}
    wrapper.topAnchor = function() {
        if(this.shapeName === "diamond") {
        	return new jsgl.Vector2D(this.getX(),this.getY());
    	}
        else if(this.shapeName === "square") {
        	return new jsgl.Vector2D(this.getX()+window.shapeSize/2,this.getY());
    	}
        else if(this.shapeName === "circle") {
        	return new jsgl.Vector2D(this.getX(),this.getY()-window.shapeSize/2);
    	}
    }
    wrapper.bottomAnchor = function() {
        if(this.shapeName === "diamond") {
        	return new jsgl.Vector2D(this.getX(),this.getY()+window.shapeSize);
    	}
        else if(this.shapeName === "square") {
        	return new jsgl.Vector2D(this.getX()+window.shapeSize/2,this.getY()+window.shapeSize);
    	}
        else if(this.shapeName === "circle") {
        	return new jsgl.Vector2D(this.getX(),this.getY()+window.shapeSize/2);
    	}
    }

    wrapper.rightHyperEdges = [];
    wrapper.leftHyperEdges = [];
    wrapper.topHyperEdges = [];
    wrapper.bottomHyperEdges = [];

    if(wrapper.shapeName !== "dummy") {
		wrapper.Id = window.globalId;
    	window.globalId = window.globalId + 1;
    }
    else {
    	wrapper.Id = window.notShownMate;
    	window.notShownMate = window.notShownMate - 1;
    }

    wrapper.adoptionBrackets = [];
	wrapper.noChildrenGraphic = null;
    wrapper.infertileGraphic = null;
    wrapper.deadLine = null;
    wrapper.stillBirthLine = null;
    wrapper.unknownFamilyHistoryGraphic = null;
    wrapper.probandGraphic = null;
    wrapper.carrierGraphic = null;
    wrapper.pregnantGraphic = null;
    wrapper.surrogateGraphic = null;
    wrapper.donorGraphic = null;

    wrapper.reLoad1 = function() {
    	// resize the shape
    	this.updateColors();
		this.showNoChildren();
    	this.showInfertile();
    	this.showDead();
        this.showStillBirth();
    	this.showUnknownFamilyHistory();
    	this.showProband();
        this.showConsultand();
    	this.showCarrier();
    	this.showPregnant();
    	this.showSurrogate();
    	this.showDonor();
    	this.redoText();
    }

    wrapper.reLoad2 = function() {
		this.showAdoption();

    }

    wrapper.redoText = function() {
    	var allText = this.personText.getAllLines();
    	this.removeElement(this.personText);
    	this.personText = personTextInit(this.bottomAnchor(), this.shapeName);
    	for(var i=0; i<allText.length; ++i) {
    		this.personText.addNewLine(allText[i][0], allText[i][1]);
    	}
    	this.addElement(this.personText);
    }

    wrapper.parents = [];
    wrapper.updateParents = function() {
    	
		var checkboxes = $("#adoptedWrapper input[class='adopted']");
    	this.parents = [];
		this.adoptiveParents = [];

		for(var i=0; i<checkboxes.length; ++i) {
			var text = checkboxes[i].nextSibling.data;
			text = text.slice(1,text.length-1);

			var ids = text.split(",");

			for(var j=0; j<ids.length; ++j) {
				if(checkboxes[i].checked === true) {
					this.adoptiveParents.push(parseInt(ids[j]));
				}
			}
		}


        for(var i=0; i<this.topHyperEdges.length; ++i) {
            var currentHyperEdge = this.topHyperEdges[i];
            for(var j=0; j<currentHyperEdge.parents.length; ++j) {
                var currentId = currentHyperEdge.parents[j].Id;
                if(this.adoptiveParents.indexOf(currentId) === -1) {
                    this.parents.push(currentId);
                }
            }
         
        }
    	this.showParentsOnScreen();
    }
    wrapper.showParentsOnScreen = function() {
	    $("#parents").val(this.parents.toString());
	    $("#adoptiveParents").val(this.adoptiveParents.toString());
    }

    wrapper.adoptiveParents = [];
    wrapper.updateAdoption = function() {
    	this.updateAdoptionVal();
    	this.showAdoption();
    	this.showAdoptionOnScreen();
    }
	wrapper.updateAdoptionVal = function() {
		this.updateParents();
	}
	wrapper.showAdoption = function() {
		for(var i=0; i<this.adoptionBrackets.length; ++i) {
			this.removeElement(this.adoptionBrackets[i]);
		}
		if(this.adoptiveParents.length > 0) {


			var xOffset = 0;
			var yOffset = 0;
			if(this.shapeName === "diamond" || this.shapeName === "square") {
				yOffset = window.shapeSize/2;
				if(this.shapeName === "square") {
					xOffset = yOffset;
				}
			}
			var boundaryAmount = window.shapeSize/5;
			var size = window.shapeSize;

			// draw brackets around this person
			// top left line
			var line1 = lineWrapper([this.Id]);
			line1.setStartX(this.getX() - size/2 - boundaryAmount + xOffset);
			line1.setStartY(this.getY() - size/2 - boundaryAmount + yOffset);
			line1.setEndX(line1.getStartX() + size/16);
			line1.setEndY(line1.getStartY());

			// left line
			var line2 = lineWrapper([this.Id]);
			line2.setStartX(line1.getStartX());
			line2.setStartY(line1.getStartY());
			line2.setEndX(line2.getStartX());
			line2.setEndY(line2.getStartY() + boundaryAmount + size + boundaryAmount);
			
			// bottom left line
			var line3 = lineWrapper([this.Id]);
			line3.setStartX(line2.getEndX());
			line3.setStartY(line2.getEndY());
			line3.setEndX(line3.getStartX() + boundaryAmount);
			line3.setEndY(line3.getStartY());

			// top right line
			var line4 = lineWrapper([this.Id]);
			line4.setStartX(this.getX() + size/2 + boundaryAmount + xOffset);
			line4.setStartY(line1.getStartY());
			line4.setEndX(line4.getStartX() - boundaryAmount);
			line4.setEndY(line4.getStartY());

			// right line
			var line5 = lineWrapper([this.Id]);
			line5.setStartX(line4.getStartX());
			line5.setStartY(line4.getStartY());
			line5.setEndX(line5.getStartX());
			line5.setEndY(line2.getEndY());
			
			// bottom right line
			var line6 = lineWrapper([this.Id]);
			line6.setStartX(line5.getEndX());
			line6.setStartY(line5.getEndY());
			line6.setEndX(line6.getStartX() - boundaryAmount);
			line6.setEndY(line6.getStartY());

			this.adoptionBrackets = [line1, line2, line3, line4, line5, line6];

			this.addElement(line1);
			this.addElement(line2);
			this.addElement(line3);
			this.addElement(line4);
			this.addElement(line5);
			this.addElement(line6);
		}

		// connect the person with their biological and adoptive parents
		// dashed line is for adoptive parents
		// solid line is for biological parents

		// find the hyperedge we want to modify
		for(var i=0; i<this.topHyperEdges.length; ++i) {
			var foundFlag = false;
			for(var j=0; j<this.topHyperEdges[i].parents.length; ++j) {
				if(this.topHyperEdges[i].parents[j].Id === this.adoptiveParents[0]) {
					foundFlag = true;
					break;
				}
			}
			this.topHyperEdges[i].makeAdopted(this.Id, foundFlag);
		}

	}
	wrapper.showAdoptionOnScreen = function() {

        // add the new checkboxes for the mates
        $("#adoptedWrapper input[class='adopted']").each(function(){this.nextSibling.nodeValue = "";});
        $("#adoptedWrapper input[class='adopted']").remove();
        for(var i=0; i<this.topHyperEdges.length; ++i) {
            var currentHyperEdge = this.topHyperEdges[i];

            var innerText = "[";
            for(var j=0; j<currentHyperEdge.parents.length; ++j) {
            	var currentId = currentHyperEdge.parents[j].Id;
            	if(j === currentHyperEdge.parents.length-1) {
            		innerText += currentId.toString();
            	}
            	else {
            		innerText += currentId.toString() + ",";
            	}
            }
            innerText += "]";

            if(this.adoptiveParents.indexOf(currentId) !== -1) {
                $("#adoptedWrapper").append("<input type='checkbox' class='adopted' checked='checked'>"+innerText+"</input>");
            }
            else {
                $("#adoptedWrapper").append("<input type='checkbox' class='adopted'>"+innerText+"</input>");
            }
        }
	}















    wrapper.mateKids = [];
    wrapper.updateMateKids = function() {

    	this.mateKids = [];

    	// look at the left, right and bottom hyperedges
    	for(var i=0; i<this.leftHyperEdges.length; ++i) {
    		var adding = [this.leftHyperEdges[i].parents[0].Id, []];
    		for(var j=0; j<this.leftHyperEdges[i].children.length; ++j) {
    			adding[1].push(this.leftHyperEdges[i].children[j].Id);
    		}
    		this.mateKids.push(adding);
    	}

    	for(var i=0; i<this.rightHyperEdges.length; ++i) {
    		var adding = [this.rightHyperEdges[i].parents[1].Id, []];
    		for(var j=0; j<this.rightHyperEdges[i].children.length; ++j) {
    			adding[1].push(this.rightHyperEdges[i].children[j].Id);
    		}
    		this.mateKids.push(adding);
    	}

    	for(var i=0; i<this.bottomHyperEdges.length; ++i) {

    		var adding = [this.bottomHyperEdges[i].parents[1].Id, []];
    		//var adding = [window.notShownMate, []];
    		window.notShownMate -= 1;


    		for(var j=0; j<this.bottomHyperEdges[i].children.length; ++j) {
    			adding[1].push(this.bottomHyperEdges[i].children[j].Id);
    		}
    		this.mateKids.push(adding);
    	}

    	this.showMateKidsOnScreen();
    }
    wrapper.showMateKidsOnScreen = function() {
    	var childrenString = "";
	    for(var i=0; i<this.mateKids.length; ++i) {
	    	childrenString += this.mateKids[i][0]+":[";
	    	for(var j=0; j<this.mateKids[i][1].length; ++j) {
	    		if(j === this.mateKids[i][1].length-1) {
	    			childrenString += this.mateKids[i][1][j];
	    		}
	    		else {
					childrenString += this.mateKids[i][1][j]+",";
				}
	    	}
	    	if(i === this.mateKids.length-1) {
	    		childrenString += "]";
	    	}
	    	else {	
	    		childrenString += "], ";
	    	}
	    }
        $("#children").val(childrenString);
    }

    wrapper.diagnosis = [];
    wrapper.updateDiagnosis = function() {


    	var emptyValues = [];

        // update currentlySelected's diagnosis list
        var diagnoses = [];
        var diagnosisElement = $(".inTable.diagnosis");
        for(var i=0; i<diagnosisElement.length; ++i) {
        	if(diagnosisElement[i].value !== "") {
				diagnoses.push(diagnosisElement[i].value);
			}
			else {
				emptyValues.push(i);
			}
        }


        var ageOfDiagnoses = [];
        var ageOfDiagnosesElement = $(".inTable.ageOfDiagnosis");
        for(var i=0; i<ageOfDiagnosesElement.length; ++i) {
			if(emptyValues.indexOf(i) === -1) {
				ageOfDiagnoses.push(ageOfDiagnosesElement[i].value);
			}
		}

        var ageOfOnset = [];
        var ageOfOnsetElement = $(".inTable.ageOfOnset");
        for(var i=0; i<ageOfOnsetElement.length; ++i) {
			if(emptyValues.indexOf(i) === -1) {
				ageOfOnset.push(ageOfOnsetElement[i].value);
			}
		}

        this.diagnosis = [];
        for(var i=0; i<diagnoses.length; ++i) {
            this.diagnosis.push([diagnoses[i],ageOfDiagnoses[i],ageOfOnset[i]]);
        }
    }


    wrapper.ageAtVisit = "";
    wrapper.updateAgeAtVisit = function() {
    	this.ageAtVisit = $("#ageAtVisit").val();
    	this.showAgeAtVisit();
    }
    wrapper.showAgeAtVisit = function() {
    	if(this.ageAtVisit !== "" && this.ageAtVisit != null) {
			if(this.personText.getLine("ageAtVisit") == null) {
				this.personText.addNewLine(this.ageAtVisit+"y", "ageAtVisit");
			}
			else if(this.personText.getLine("ageAtVisit") !== this.ageAtVisit) {
				this.personText.setLine(this.ageAtVisit+"y","ageAtVisit");
			}
		}
		else {
			this.personText.removeLine("ageAtVisit");
		}
    }


    wrapper.otherInfo = "";
    wrapper.updateOtherInfo = function() {
    	this.otherInfo = $("#otherInfo").val();
    }


    wrapper.numbPersons = "";
    wrapper.updateNumbPersons = function() {
    	this.numbPersons = $("#numbPersons").val();
    	this.showNumbPersons();
    }
    wrapper.numbPersonsDisplay = null;
    wrapper.showNumbPersons = function() {
    	if(this.numbPersonsDisplay != null) {
    		this.removeElement(this.numbPersonsDisplay);
    	}
    	if(this.numbPersons !== "") {
    		var numbPersonsText = myPanel.createLabel();
    		numbPersonsText.setFontSize(15);
    		numbPersonsText.setLocationXY(this.bottomAnchor().getX()-numbPersonsText.getFontSize()/4, this.bottomAnchor().getY()-window.shapeSize/2-numbPersonsText.getFontSize()/2);
    		numbPersonsText.setText(this.numbPersons);
    		this.numbPersonsDisplay = numbPersonsText;
    		this.addElement(numbPersonsText);
    	}
    }


    // if someone is divorced, will have a list of checkboxes corresponding to 
    // the mates.  the checked ones will be ones with divorces
    wrapper.divorcedList = [];
    wrapper.updateDivorced = function() {
    	this.updateDivorcedList();
    	this.showDivorced();
    	this.showDivorcedOnScreen();
    }
    wrapper.updateDivorcedList = function() {
    	this.divorcedList = [];
		var radioButtons = $("#divorcedWrapper input[class='divorced']");
		for(var i=0; i<radioButtons.length; ++i) {
			if(radioButtons[i].checked === true) {
				this.divorcedList.push(parseInt(radioButtons[i].nextSibling.data));
			}
		}
    }
    wrapper.showDivorced = function() {
    	// will draw a double line on the edge that is divorced
    	for(var i=0; i<this.leftHyperEdges.length; ++i) {
    		var found = false;
    		for(var j=0; j<this.divorcedList.length; ++j) {
    			if(this.leftHyperEdges[i].containsParent(this.divorcedList[j]) != null) {
    				if(this.leftHyperEdges[i].divorcedLines.length === 0) {
    					this.leftHyperEdges[i].makeDivorced();
    				}
    				found = true;
    				break;
    			}
    		}
    		if(found === false) {
				this.leftHyperEdges[i].makeNotDivorced();
			}
		}
		for(var i=0; i<this.rightHyperEdges.length; ++i) {
    		var found = false;
    		for(var j=0; j<this.divorcedList.length; ++j) {
    			if(this.rightHyperEdges[i].containsParent(this.divorcedList[j]) != null) {
    				if(this.rightHyperEdges[i].divorcedLines.length === 0) {
    					this.rightHyperEdges[i].makeDivorced();
    				}
    				found = true;
    				break;
    			}
    		}
    		if(found === false) {
				this.rightHyperEdges[i].makeNotDivorced();
			}
		}
    }
    wrapper.showDivorcedOnScreen = function() {
        // add the new checkboxes for the mates
        $("#divorcedWrapper input[class='divorced']").each(function(){this.nextSibling.nodeValue = "";});
        $("#divorcedWrapper input[class='divorced']").remove();

        for(var i=0; i<this.mateKids.length; ++i) {
            var mateId = this.mateKids[i][0];
            if(this.divorcedList.indexOf(mateId) !== -1) {
                $("#divorcedWrapper").append("<input type='checkbox' class='divorced' checked='checked'>"+mateId+"</input>");
            }
            else {
                $("#divorcedWrapper").append("<input type='checkbox' class='divorced'>"+mateId+"</input>");
            }
        }
    }



    wrapper.consanguinityList = [];
    wrapper.updateConsanguinity = function() {
    	this.updateConsanguinityList();
    	this.showConsanguinity();
    	this.showConsanguinityOnScreen();
    }
    wrapper.updateConsanguinityList = function() {
    	this.consanguinityList = [];
		var radioButtons = $("#consanguinityWrapper input[class='consanguinity']");
		for(var i=0; i<radioButtons.length; ++i) {
			if(radioButtons[i].checked === true) {
				this.consanguinityList.push(parseInt(radioButtons[i].nextSibling.data));
			}
		}
    }
    wrapper.showConsanguinity = function() {
    	// will draw a double line on the edge that is consanguinity
    	for(var i=0; i<this.leftHyperEdges.length; ++i) {
    		var found = false;
    		for(var j=0; j<this.consanguinityList.length; ++j) {
    			if(this.leftHyperEdges[i].containsParent(this.consanguinityList[j]) != null) {
    				if(this.leftHyperEdges[i].consanguinityLines == null) {
    					this.leftHyperEdges[i].makeConsanguinity();
    				}
    				found = true;
    				break;
    			}
    		}
    		if(found === false) {
				this.leftHyperEdges[i].makeNotConsanguinity(false);
			}
		}
		for(var i=0; i<this.rightHyperEdges.length; ++i) {
    		var found = false;
    		for(var j=0; j<this.consanguinityList.length; ++j) {
    			if(this.rightHyperEdges[i].containsParent(this.consanguinityList[j]) != null) {
    				if(this.rightHyperEdges[i].consanguinityLines == null) {
    					this.rightHyperEdges[i].makeConsanguinity();
    				}
    				found = true;
    				break;
    			}
    		}
    		if(found === false) {
				this.rightHyperEdges[i].makeNotConsanguinity(false);
			}
		}
    }
    wrapper.showConsanguinityOnScreen = function() {
        // add the new checkboxes for the mates
        $("#consanguinityWrapper input[class='consanguinity']").each(function(){this.nextSibling.nodeValue = "";});
        $("#consanguinityWrapper input[class='consanguinity']").remove();
        for(var i=0; i<this.mateKids.length; ++i) {
            var mateId = this.mateKids[i][0];
            if(this.consanguinityList.indexOf(mateId) !== -1) {
                $("#consanguinityWrapper").append("<input type='checkbox' class='consanguinity' checked='checked'>"+mateId+"</input>");
            }
            else {
                $("#consanguinityWrapper").append("<input type='checkbox' class='consanguinity'>"+mateId+"</input>");
            }
        }
    }

    // to make sure that we group all twins together
    wrapper.zygoticNumber = window.lastZygoticNumber;
    window.lastZygoticNumber += 1;
    wrapper.zygoticList = [];
    wrapper.zygoticType = "";
    wrapper.updateZygotic = function() {
    	this.updateZygoticList();
    	this.showZygotic();
    	this.showZygoticOnScreen();
    }
    wrapper.updateZygoticList = function() {
		this.zygoticList = [];
		var checkboxes = $("#zygoticWrapper input[class='zygotic']");
		for(var i=0; i<checkboxes.length; ++i) {
			if(checkboxes[i].checked === true) {
				this.zygoticList.push(parseInt(checkboxes[i].nextSibling.data));
			}
		}
		this.zygoticList.push(this.Id);
    }
    wrapper.showZygotic = function() {
    	// move the orientation of the children lines
    	if(this.topHyperEdges.length > 0) {    
    		this.topHyperEdges[0].makeZygotic(this.zygoticList);
    	}
    }
    wrapper.showZygoticOnScreen = function() {
        // add the new checkboxes for the mates
        $("#zygoticWrapper input[class='zygotic']").each(function(){this.nextSibling.nodeValue = "";});
        $("#zygoticWrapper input[class='zygotic']").remove();

        var siblings = this.topHyperEdges.length > 0 ? this.topHyperEdges[0].children : [];
        for(var i=0; i<siblings.length; ++i) {
            var siblingId = siblings[i].Id;
            if(siblingId === this.Id) {continue;}
            if(this.zygoticList.indexOf(siblingId) !== -1) {
                $("#zygoticWrapper").append("<input type='checkbox' class='zygotic' checked='checked'>"+siblingId+"</input>");
            }
            else {
                $("#zygoticWrapper").append("<input type='checkbox' class='zygotic'>"+siblingId+"</input>");
            }
        }

        // if any of the checkboxes are checked, then make a 
        // drop down of the types
        $("#textInputWrapper p[class='zygoticTypeText']").remove();
        $("#textInputWrapper select[id='typeOfZygotic']").remove();

        if($("#zygoticWrapper input[class='zygotic']:checked").length > 0 && $("#typeOfZygotic").length === 0) {
            $("#textInputWrapper").append("<p class='zygoticTypeText' style='display:inline'>Mono/dyzygotic:</p><select id='typeOfZygotic'><option value='Dizygotic'>Dizygotic</option><option value='Monozygotic'>Monozygotic</option></select>");
        
        	if(this.zygoticType !== "") {
    			$("#typeOfZygotic").val(this.zygoticType);
    		}
        }
    }

	wrapper.noChildrenList = [];
    wrapper.updateNoChildren = function() {
    	this.updateNoChildrenValue();
    	this.showNoChildren();
    	this.showNoChildrenOnScreen();
    }
    wrapper.updateNoChildrenValue = function() {
    	this.noChildrenList = [];
		var checkboxes = $("#noChildrenWrapper input[class='noChildren']");
		for(var i=0; i<checkboxes.length; ++i) {
			if(checkboxes[i].checked === true) {
				this.noChildrenList.push(parseInt(checkboxes[i].nextSibling.data));
			}
		}
    }
    wrapper.showNoChildren = function() {

		if(this.noChildrenGraphic != null) {
			this.removeElement(this.noChildrenGraphic);
			this.noChildrenGraphic = null;
		}

    	// look for the correct hyperedges, then call change function
    	for(var i=0; i<this.leftHyperEdges.length; ++i) {
    		var current = this.leftHyperEdges[i];
    		if((this.noChildrenList.indexOf(current.parents[0].Id) !== -1 && current.parents[1].Id === this.Id) ||
    		 (this.noChildrenList.indexOf(current.parents[1].Id) !== -1 && current.parents[0].Id === this.Id)) {
    			current.makeNoChildren(true);
    		}
    		else {
    			current.makeNoChildren(false);
    		}
    	}
    	for(var i=0; i<this.rightHyperEdges.length; ++i) {
    		var current = this.rightHyperEdges[i];
    		if((this.noChildrenList.indexOf(current.parents[0].Id) !== -1 && current.parents[1].Id === this.Id) ||
    		 (this.noChildrenList.indexOf(current.parents[1].Id) !== -1 && current.parents[0].Id === this.Id)) {
    			current.makeNoChildren(true);
    		}
    		else {
    			current.makeNoChildren(false);
    		}
    	}
    	if(this.noChildrenList.indexOf(this.Id) !== -1) {
    		// draw that shape underneath using noChildrenGraphic
    		var groupThing = myPanel.createGroup();
    		var sizeAmount = window.shapeSize/2;
    		
    		var line1 = lineWrapper([this.Id]);
    		line1.setStartX(this.bottomAnchor().getX());
    		line1.setStartY(this.bottomAnchor().getY());
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
    	}
    }
    wrapper.showNoChildrenOnScreen = function() {
    	// add the new checkboxes for the mates and self
        $("#noChildrenWrapper input[class='noChildren']").each(function(){this.nextSibling.nodeValue = "";});
        $("#noChildrenWrapper input[class='noChildren']").remove();
        for(var i=0; i<this.leftHyperEdges.length; ++i) {

            for(var j=0; j<this.leftHyperEdges[i].parents.length; ++j) {

            	var currentId = this.leftHyperEdges[i].parents[j].Id;

	            if(this.noChildrenList.indexOf(currentId) !== -1 && currentId !== this.Id) {
	                $("#noChildrenWrapper").append("<input type='checkbox' class='noChildren' checked='checked'>"+currentId+"</input>");
	            }
	            else if(currentId !== this.Id) {
	                $("#noChildrenWrapper").append("<input type='checkbox' class='noChildren'>"+currentId+"</input>");
	            }
	        }
        }
        for(var i=0; i<this.rightHyperEdges.length; ++i) {
            for(var j=0; j<this.rightHyperEdges[i].parents.length; ++j) {
            	var currentId = this.rightHyperEdges[i].parents[j].Id;
	            if(this.noChildrenList.indexOf(currentId) !== -1 && currentId !== this.Id) {
	                $("#noChildrenWrapper").append("<input type='checkbox' class='noChildren' checked='checked'>"+currentId+"</input>");
	            }
	            else if(currentId !== this.Id) {
	                $("#noChildrenWrapper").append("<input type='checkbox' class='noChildren'>"+currentId+"</input>");
	            }
	        }
        }
        if(this.noChildrenList.indexOf(this.Id) !== -1) {
            $("#noChildrenWrapper").append("<input type='checkbox' class='noChildren' checked='checked'>"+this.Id+"</input>");
        }
        else {
            $("#noChildrenWrapper").append("<input type='checkbox' class='noChildren'>"+this.Id+"</input>");
        }
    }


    wrapper.infertileList = [];
    wrapper.updateInfertile = function() {
    	this.updateInfertileValue();
    	this.showInfertile();
    	this.showInfertileOnScreen();
    }
    wrapper.updateInfertileValue = function() {
    	this.infertileList = [];
		var checkboxes = $("#infertileWrapper input[class='infertile']");
		for(var i=0; i<checkboxes.length; ++i) {
			if(checkboxes[i].checked === true) {
				this.infertileList.push(parseInt(checkboxes[i].nextSibling.data));
			}
		}
    }
    wrapper.showInfertile = function() {
    	if(this.infertileGraphic != null) {
			this.removeElement(this.infertileGraphic);
			this.infertileGraphic = null;
		}
		// look for the correct hyperedges, then call change function
    	for(var i=0; i<this.leftHyperEdges.length; ++i) {
    		var current = this.leftHyperEdges[i];
    		// if this person's mate is in infertileList
    		if((this.infertileList.indexOf(current.parents[0].Id) !== -1 && current.parents[1].Id === this.Id) ||
    		 (this.infertileList.indexOf(current.parents[1].Id) !== -1 && current.parents[0].Id === this.Id)) {
    			current.makeInfertile(true);
    		}
    		else {
    			current.makeInfertile(false);
    		}
    	}
    	for(var i=0; i<this.rightHyperEdges.length; ++i) {
    		var current = this.rightHyperEdges[i];
    		if((this.infertileList.indexOf(current.parents[0].Id) !== -1 && current.parents[1].Id === this.Id) ||
    		 (this.infertileList.indexOf(current.parents[1].Id) !== -1 && current.parents[0].Id === this.Id)) {
    			current.makeInfertile(true);
    		}
    		else {
    			current.makeInfertile(false);
    		}
    	}
    	if(this.infertileList.indexOf(this.Id) !== -1) {
    		// draw that shape underneath using infertileGraphic
    		var groupThing = myPanel.createGroup();
    		var sizeAmount = window.shapeSize/2;

    		var line1 = lineWrapper([this.Id]);
    		line1.setStartX(this.bottomAnchor().getX());
    		line1.setStartY(this.bottomAnchor().getY());
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
    	}
    }
    wrapper.showInfertileOnScreen = function() {

    	// add the new checkboxes for the mates and self
        $("#infertileWrapper input[class='infertile']").each(function(){this.nextSibling.nodeValue = "";});
        $("#infertileWrapper input[class='infertile']").remove();
        for(var i=0; i<this.leftHyperEdges.length; ++i) {

            for(var j=0; j<this.leftHyperEdges[i].parents.length; ++j) {

            	var currentId = this.leftHyperEdges[i].parents[j].Id;

	            if(this.infertileList.indexOf(currentId) !== -1 && currentId !== this.Id) {
	                $("#infertileWrapper").append("<input type='checkbox' class='infertile' checked='checked'>"+currentId+"</input>");
	            }
	            else if(currentId !== this.Id) {
	                $("#infertileWrapper").append("<input type='checkbox' class='infertile'>"+currentId+"</input>");
	            }
	        }
        }
        for(var i=0; i<this.rightHyperEdges.length; ++i) {
            for(var j=0; j<this.rightHyperEdges[i].parents.length; ++j) {
            	var currentId = this.rightHyperEdges[i].parents[j].Id;
	            if(this.infertileList.indexOf(currentId) !== -1 && currentId !== this.Id) {
	                $("#infertileWrapper").append("<input type='checkbox' class='infertile' checked='checked'>"+currentId+"</input>");
	            }
	            else if(currentId !== this.Id) {
	                $("#infertileWrapper").append("<input type='checkbox' class='infertile'>"+currentId+"</input>");
	            }
	        }
        }
        if(this.infertileList.indexOf(this.Id) !== -1) {
            $("#infertileWrapper").append("<input type='checkbox' class='infertile' checked='checked'>"+this.Id+"</input>");
        }
        else {
            $("#infertileWrapper").append("<input type='checkbox' class='infertile'>"+this.Id+"</input>");
        }
    }



    wrapper.dead = false;
    wrapper.ageOfDeath = "";
    wrapper.updateDead = function() {
    	this.updateAgeOfDeath();
    	this.showDead();
    	this.showDeadOnScreen();
    }
    wrapper.updateAgeOfDeath = function() {
    	if($("#dead").is(":checked") === true) {
    		this.dead = true;
    		this.ageOfDeath = $("#textInputWrapper input[id='ageOfDeath']").val();
    	}
    	else {
    		this.dead = false;
    		this.ageOfDeath = "";
    	}
    }
    wrapper.showDead = function() {
    	// make a line go through the person and put text underneath the person saying age of death
    	if(this.deadLine != null) {
    		this.removeElement(this.deadLine);
    	}
    	if(this.dead === true) {
    		this.deadLine = lineWrapper([this.Id]);
    		if(this.shapeName === "square") {
	    		this.deadLine.setStartX(this.getX() - window.shapeSize/8);
	    		this.deadLine.setStartY(this.getY() + window.shapeSize + window.shapeSize/8);
	    		this.deadLine.setEndX(this.getX() + window.shapeSize + window.shapeSize/8);
	    		this.deadLine.setEndY(this.getY() - window.shapeSize/8);
    		}
    		else if(this.shapeName === "circle") {
    			this.deadLine.setStartX(this.getX() - window.shapeSize/2 - window.shapeSize/8);
	    		this.deadLine.setStartY(this.getY() + window.shapeSize/2 + window.shapeSize/8);
	    		this.deadLine.setEndX(this.getX() + window.shapeSize/2 + window.shapeSize/8);
	    		this.deadLine.setEndY(this.getY() - window.shapeSize/2 - window.shapeSize/8);
    		}
    		else if(this.shapeName === "diamond") {
    			this.deadLine.setStartX(this.getX() - window.shapeSize/2 - window.shapeSize/8);
	    		this.deadLine.setStartY(this.getY() + window.shapeSize + window.shapeSize/8);
	    		this.deadLine.setEndX(this.getX() + window.shapeSize/2 + window.shapeSize/8);
	    		this.deadLine.setEndY(this.getY() - window.shapeSize/8);
    		}
    		this.deadLine.getStroke().setWeight(window.outline/2);
    		this.addElement(this.deadLine);
    	}

    	// show age of death under the person
    	if(this.ageOfDeath !== "" && this.ageOfDeath != null) {
    		if(this.personText.getLine("ageOfDeath") == null) {
    			this.personText.addNewLine("d. "+this.ageOfDeath, "ageOfDeath");
    		}
    		else if(this.personText.getLine("ageOfDeath") !== this.ageOfDeath) {
    			this.personText.setLine("d. "+this.ageOfDeath,"ageOfDeath");
    		}
    	}
    	else {
    		this.personText.removeLine("ageOfDeath");
    	}
    }
    wrapper.showDeadOnScreen = function() {
    	if(this.dead === true) {
    		$("#dead").prop("checked",true);
    		if($("#textInputWrapper input[id='ageOfDeath']").length === 0) {
            	$("#textInputWrapper").append("<p class='ageOfDeathText' style='display:inline'>Age of death:</p><input type=text id='ageOfDeath' style='width:20px'>");
        	}
        	$("#ageOfDeath").val(this.ageOfDeath);
        }
        else {
        	$("#dead").prop("checked",false);
        	$("#textInputWrapper input[id='ageOfDeath']").remove();
        	$("#textInputWrapper p[class='ageOfDeathText']").remove();
        }
    }


    wrapper.stillBirth = false;
    wrapper.ageOfStillBirth = "";
    wrapper.updateStillBirth = function() {
        this.updateAgeOfStillBirth();
        this.showStillBirth();
        this.showStillBirthOnScreen();
    }
    wrapper.updateAgeOfStillBirth = function() {
        if($("#stillBirth").is(":checked") === true) {
            this.stillBirth = true;
            this.ageOfStillBirth = $("#textInputWrapper input[id='ageOfStillBirth']").val();
        }
        else {
            this.stillBirth = false;
            this.ageOfStillBirth = "";
        }
    }
    wrapper.showStillBirth = function() {
        // make a line go through the person and put text underneath the person saying age of death
        if(this.stillBirthLine != null) {
            this.removeElement(this.stillBirthLine);
        }
        if(this.stillBirth === true) {
            this.stillBirthLine = lineWrapper([this.Id]);
            if(this.shapeName === "square") {
                this.stillBirthLine.setStartX(this.getX() - window.shapeSize/8);
                this.stillBirthLine.setStartY(this.getY() + window.shapeSize + window.shapeSize/8);
                this.stillBirthLine.setEndX(this.getX() + window.shapeSize + window.shapeSize/8);
                this.stillBirthLine.setEndY(this.getY() - window.shapeSize/8);
            }
            else if(this.shapeName === "circle") {
                this.stillBirthLine.setStartX(this.getX() - window.shapeSize/2 - window.shapeSize/8);
                this.stillBirthLine.setStartY(this.getY() + window.shapeSize/2 + window.shapeSize/8);
                this.stillBirthLine.setEndX(this.getX() + window.shapeSize/2 + window.shapeSize/8);
                this.stillBirthLine.setEndY(this.getY() - window.shapeSize/2 - window.shapeSize/8);
            }
            else if(this.shapeName === "diamond") {
                this.stillBirthLine.setStartX(this.getX() - window.shapeSize/2 - window.shapeSize/8);
                this.stillBirthLine.setStartY(this.getY() + window.shapeSize + window.shapeSize/8);
                this.stillBirthLine.setEndX(this.getX() + window.shapeSize/2 + window.shapeSize/8);
                this.stillBirthLine.setEndY(this.getY() - window.shapeSize/8);
            }
            this.stillBirthLine.getStroke().setWeight(window.outline/2);
            this.addElement(this.stillBirthLine);
        }

        // show age of death under the person
        if(this.ageOfStillBirth !== "" && this.ageOfStillBirth != null) {
            if(this.personText.getLine("ageOfStillBirth") == null) {
                this.personText.addNewLine("SB","stillBirthSB");
                this.personText.addNewLine("d. "+this.ageOfStillBirth, "ageOfStillBirth");
            }
            else if(this.personText.getLine("ageOfStillBirth") !== this.ageOfStillBirth) {
                this.personText.setLine("d. "+this.ageOfStillBirth,"ageOfStillBirth");
            }
        }
        else {
            this.personText.removeLine("stillBirthSB");
            this.personText.removeLine("ageOfStillBirth");
        }
    }
    wrapper.showStillBirthOnScreen = function() {
        if(this.stillBirth === true) {
            $("#stillBirth").prop("checked",true);
            if($("#textInputWrapper input[id='ageOfStillBirth']").length === 0) {
                $("#textInputWrapper").append("<p class='ageOfStillBirthText' style='display:inline'>Age of stillbirth:</p><input type=text id='ageOfStillBirth' style='width:20px'>");
            }
            $("#ageOfStillBirth").val(this.ageOfStillBirth);
        }
        else {
            $("#stillBirth").prop("checked",false);
            $("#textInputWrapper input[id='ageOfStillBirth']").remove();
            $("#textInputWrapper p[class='ageOfStillBirthText']").remove();
        }
    }

    
    wrapper.prematureDeath = false;
    wrapper.typeOfPrematureDeath = "";
    wrapper.updatePrematureDeath = function() {
    	this.updatePrematureDeathType();
    	this.showPrematureDeath();
    	this.showPrematureDeathOnScreen();
    }
    wrapper.updatePrematureDeathType = function() {
    	if($("#prematureDeath").is(":checked") === true) {
    		this.prematureDeath = true;
    		this.typeOfPrematureDeath = $("#typeOfPrematureDeath option:selected").text();
    	}
    	else {
    		this.prematureDeath = false;
    		this.typeOfPrematureDeath = "";
    	}

    }
    wrapper.showPrematureDeath = function() {
    	// FOR THE MOMENT, WON'T MAKE A TRIANGLE!!! INSTEAD WILL JUST WRITE OUT WHAT IT IS
    	if(this.typeOfPrematureDeath !== "" && this.typeOfPrematureDeath != null) {
    		if(this.personText.getLine("typeOfPrematureDeath") == null) {
    			this.personText.addNewLine(this.typeOfPrematureDeath, "typeOfPrematureDeath");
    		}
    		else if(this.personText.getLine("typeOfPrematureDeath") !== this.typeOfPrematureDeath) {
    			this.personText.setLine(this.typeOfPrematureDeath,"typeOfPrematureDeath");
    		}
    	}
    	else {
    		this.personText.removeLine("typeOfPrematureDeath");
    	}
    }	
    wrapper.showPrematureDeathOnScreen = function() {
    	if(this.prematureDeath === true) {
    		$("#prematureDeath").prop("checked",true);
    		if($("#typeOfPrematureDeath").length === 0) {
	        	$("#textInputWrapper").append("<p class='prematureDeathText' style='display:inline'>Type of abortion/miscarriage:</p><select id='typeOfPrematureDeath'><option value='SAB'>SAB</option><option value='EAB'>EAB</option><option value='ECT'>ECT</option></select>");
	    	}
	    	$("#typeOfPrematureDeath").val(this.typeOfPrematureDeath);
	    }
	    else {
	    	$("#prematureDeath").prop("checked",false);
	        $("#textInputWrapper select[id='typeOfPrematureDeath']").remove();
	        $("#textInputWrapper p[class='prematureDeathText']").remove();
	    }
    }


    wrapper.unknownFamilyHistory = false;
    wrapper.updateUnknownFamilyHistory = function() {
    	this.updateUnknownFamilyHistoryValue();
    	this.showUnknownFamilyHistory();
    	this.showUnknownFamilyHistoryOnScreen();
    }
    wrapper.updateUnknownFamilyHistoryValue = function() {
    	this.unknownFamilyHistory = $("#unknownFamilyHistory").is(":checked");
    }
    wrapper.showUnknownFamilyHistory = function() {

    	if(this.unknownFamilyHistoryGraphic != null) {
    		this.removeElement(this.unknownFamilyHistoryGraphic);
    		this.unknownFamilyHistoryGraphic = null;
    	}

    	if(this.unknownFamilyHistory === true) {
    		// draw a small line and question mark on top of the shape
    		var groupThing = myPanel.createGroup();
    		var linePart = lineWrapper([]);
    		linePart.setStartX(this.topAnchor().getX());
    		linePart.setStartY(this.topAnchor().getY());
    		linePart.setEndX(this.topAnchor().getX());
    		linePart.setEndY(this.topAnchor().getY()-window.shapeSize/3);
    		linePart.getStroke().setWeight(window.outline/2);
    		var labelPart = myPanel.createLabel();
    		labelPart.setText("?");
    		labelPart.setFontSize(20);
    		labelPart.setLocationXY(linePart.getEndX()-6, linePart.getEndY()-window.shapeSize/8-20);
    		groupThing.addElement(linePart);
    		groupThing.addElement(labelPart);

    		this.unknownFamilyHistoryGraphic = groupThing;
    		this.addElement(this.unknownFamilyHistoryGraphic);
    	}
    }
    wrapper.showUnknownFamilyHistoryOnScreen = function() {
    	if(this.unknownFamilyHistory === true) {
    		$("#unknownFamilyHistory").prop("checked",true);
    	}
    	else {
    		$("#unknownFamilyHistory").prop("checked",false);
    	}
    }

    wrapper.proband = false;
    wrapper.updateProband = function() {
    	this.updateProbandValue();
    	this.showProband();
    	this.showProbandOnScreen();
    }
    wrapper.updateProbandValue = function() {
    	this.proband = $("#proband").is(":checked");
    }
    wrapper.showProband = function() {

    	if(this.probandGraphic != null) {
    		this.removeElement(this.probandGraphic);
    		this.probandGraphic = null;
    	}

    	if(this.proband === true) {
    		var groupThing = myPanel.createGroup();
    		
    		var sizeAmount = window.shapeSize;
    		
    		// draw an arrow in the bottom left
    		var line1 = lineWrapper([this.Id]);
    		line1.setStartX(this.bottomAnchor().getX() - sizeAmount/2 - sizeAmount/8);
    		line1.setStartY(this.bottomAnchor().getY() + sizeAmount/8);
    		line1.setEndX(line1.getStartX() - sizeAmount/4);
    		line1.setEndY(line1.getStartY());
    		line1.getStroke().setWeight(window.outline/4);

    		var line2 = lineWrapper([this.Id]);
    		line2.setStartX(line1.getStartX());
    		line2.setStartY(line1.getStartY());
    		line2.setEndX(line1.getStartX());
    		line2.setEndY(line1.getStartY() + sizeAmount/4);
    		line2.getStroke().setWeight(window.outline/4);

    		var line3 = lineWrapper([this.Id]);
    		line3.setStartX(line1.getStartX());
    		line3.setStartY(line1.getStartY());
    		line3.setEndX(line1.getStartX() - sizeAmount/2);
    		line3.setEndY(line1.getStartY() + sizeAmount/2);
    		line3.getStroke().setWeight(window.outline/4);

    		groupThing.addElement(line1);
    		groupThing.addElement(line2);
    		groupThing.addElement(line3);

            var pThing = labelWrapper("");
            pThing.setText("P");
            pThing.setX(line3.getEndX()-sizeAmount/4);
            pThing.setY(line3.getEndY());
            groupThing.addElement(pThing);

    		this.probandGraphic = groupThing;
    		this.addElement(this.probandGraphic);
    	}
    }
    wrapper.showProbandOnScreen = function() {
    	if(this.proband === true) {
    		$("#proband").prop("checked",true);
    	}
    	else {
    		$("#proband").prop("checked",false);
    	}
    }



    wrapper.consultand = false;
    wrapper.updateConsultand = function() {
        this.updateConsultandValue();
        this.showConsultand();
        this.showConsultandOnScreen();
    }
    wrapper.updateConsultandValue = function() {
        this.consultand = $("#consultand").is(":checked");
    }
    wrapper.showConsultand = function() {

        if(this.consultandGraphic != null) {
            this.removeElement(this.consultandGraphic);
            this.consultandGraphic = null;
        }

        if(this.consultand === true) {
            var groupThing = myPanel.createGroup();
            
            var sizeAmount = window.shapeSize;
            
            // draw an arrow in the bottom left
            var line1 = lineWrapper([this.Id]);
            line1.setStartX(this.bottomAnchor().getX() - sizeAmount/2 - sizeAmount/8);
            line1.setStartY(this.bottomAnchor().getY() + sizeAmount/8);
            line1.setEndX(line1.getStartX() - sizeAmount/4);
            line1.setEndY(line1.getStartY());
            line1.getStroke().setWeight(window.outline/4);

            var line2 = lineWrapper([this.Id]);
            line2.setStartX(line1.getStartX());
            line2.setStartY(line1.getStartY());
            line2.setEndX(line1.getStartX());
            line2.setEndY(line1.getStartY() + sizeAmount/4);
            line2.getStroke().setWeight(window.outline/4);

            var line3 = lineWrapper([this.Id]);
            line3.setStartX(line1.getStartX());
            line3.setStartY(line1.getStartY());
            line3.setEndX(line1.getStartX() - sizeAmount/2);
            line3.setEndY(line1.getStartY() + sizeAmount/2);
            line3.getStroke().setWeight(window.outline/4);

            groupThing.addElement(line1);
            groupThing.addElement(line2);
            groupThing.addElement(line3);

            this.consultandGraphic = groupThing;
            this.addElement(this.consultandGraphic);
        }
    }
    wrapper.showConsultandOnScreen = function() {
        if(this.consultand === true) {
            $("#consultand").prop("checked",true);
        }
        else {
            $("#consultand").prop("checked",false);
        }
    }


    wrapper.carrier = false;
    wrapper.updateCarrier = function() {
    	this.updateCarrierValue();
    	this.showCarrier();
    	this.showCarrierOnScreen();
    }
    wrapper.updateCarrierValue = function() {
    	this.carrier = $("#carrier").is(":checked");
    }
    wrapper.showCarrier = function() {

    	if(this.carrierGraphic != null) {
    		this.removeElement(this.carrierGraphic);
    		this.carrierGraphic = null;
    	}

    	if(this.carrier === true) {
    		var groupThing = myPanel.createGroup();
    		// shape is just a dot in the center
    		var sizeAmount = window.shapeSize/2;

    		var dot = myPanel.createLine();
    		dot.setStartX(this.bottomAnchor().getX());
    		dot.setStartY(this.bottomAnchor().getY()-sizeAmount);
    		dot.setEndX(this.bottomAnchor().getX());
    		dot.setEndY(this.bottomAnchor().getY()-sizeAmount);
    		dot.getStroke().setWeight(window.outline);
    		groupThing.addElement(dot);


    		this.carrierGraphic = groupThing;
    		this.addElement(this.carrierGraphic);
    	}
    }
    wrapper.showCarrierOnScreen = function() {
    	if(this.carrier === true) {
    		$("#carrier").prop("checked",true);
    	}
    	else {
    		$("#carrier").prop("checked",false);
    	}
    }


    wrapper.pregnant = false;
    wrapper.updatePregnant = function() {
    	this.updatePregnantValue();
    	this.showPregnant();
    	this.showPregnantOnScreen();
    }
    wrapper.updatePregnantValue = function() {
    	this.pregnant = $("#pregnant").is(":checked");
    }
    wrapper.showPregnant = function() {

    	if(this.pregnantGraphic != null) {
    		this.removeElement(this.pregnantGraphic);
    		this.pregnantGraphic = null;
    	}

    	if(this.pregnant === true) {
    		var groupThing = myPanel.createGroup();
    		
    		var sizeAmount = window.shapeSize;


    		var text = myPanel.createLabel();
    		text.setText("P");
    		text.setFontSize(20);
    		text.setX(this.bottomAnchor().getX()-text.getFontSize()/4);
    		text.setY(this.bottomAnchor().getY()-sizeAmount/2-text.getFontSize()/2);
    		groupThing.addElement(text);
    		

    		this.pregnantGraphic = groupThing;
    		this.addElement(this.pregnantGraphic);
    	}
    }
    wrapper.showPregnantOnScreen = function() {
    	if(this.pregnant === true) {
    		$("#pregnant").prop("checked",true);
    	}
    	else {
    		$("#pregnant").prop("checked",false);
    	}
    }


    wrapper.surrogate = false;
    wrapper.updateSurrogate = function() {
    	this.updateSurrogateValue();
    	this.showSurrogate();
    	this.showSurrogateOnScreen();
    }
    wrapper.updateSurrogateValue = function() {
    	this.surrogate = $("#surrogate").is(":checked");
    }
    wrapper.showSurrogate = function() {

    	if(this.surrogateGraphic != null) {
    		this.removeElement(this.surrogateGraphic);
    		this.surrogateGraphic = null;
    	}

    	if(this.surrogate === true) {
    		var groupThing = myPanel.createGroup();
    		
    		var sizeAmount = window.shapeSize;

    		var text = myPanel.createLabel();
    		text.setText("S");
    		text.setFontSize(20);
    		text.setX(this.bottomAnchor().getX()-text.getFontSize()/4);
    		text.setY(this.bottomAnchor().getY()-sizeAmount/2-text.getFontSize()/2);
    		groupThing.addElement(text);
    		

    		this.surrogateGraphic = groupThing;
    		this.addElement(this.surrogateGraphic);
    	}
    }
    wrapper.showSurrogateOnScreen = function() {
    	if(this.surrogate === true) {
    		$("#surrogate").prop("checked",true);
    	}
    	else {
    		$("#surrogate").prop("checked",false);
    	}
    }

    wrapper.donor = false;
    wrapper.updateDonor = function() {
    	this.updateDonorValue();
    	this.showDonor();
    	this.showDonorOnScreen();
    }
    wrapper.updateDonorValue = function() {
    	this.donor = $("#donor").is(":checked");
    }
    wrapper.showDonor = function() {

    	if(this.donorGraphic != null) {
    		this.removeElement(this.donorGraphic);
    		this.donorGraphic = null;
    	}

    	if(this.donor === true) {
    		var groupThing = myPanel.createGroup();
    		
    		var sizeAmount = window.shapeSize;


    		var text = myPanel.createLabel();
    		text.setText("D");
    		text.setFontSize(20);
    		text.setX(this.bottomAnchor().getX()-text.getFontSize()/4);
    		text.setY(this.bottomAnchor().getY()-sizeAmount/2-text.getFontSize()/2);
    		groupThing.addElement(text);
    		

    		this.donorGraphic = groupThing;
    		this.addElement(this.donorGraphic);
    	}
    }
    wrapper.showDonorOnScreen = function() {
    	if(this.donor === true) {
    		$("#donor").prop("checked",true);
    	}
    	else {
    		$("#donor").prop("checked",false);
    	}
    }
  

    wrapper.loadAttributes = function() {

    	while($('#diagnosisTable tr').length > 1) {
            $("#diagnosisTable tr:last").remove();
        }
        for(var i=0; i<this.diagnosis.length; ++i) {
        	$("#diagnosisTable").append("<tr><td><input type=text class='inTable diagnosis' value='"+this.diagnosis[i][0]+"'></td><td><input type=text class='inTable ageOfDiagnosis' value='"+this.diagnosis[i][1]+"'></td><td><input type=text class='inTable ageOfOnset' value='"+this.diagnosis[i][2]+"'></td></tr>");
        }

        $("#ageAtVisit").val(this.ageAtVisit);
		$("#otherInfo").val(this.otherInfo);
    	$("#numbPersons").val(this.numbPersons);

    	this.showParentsOnScreen();
    	this.showMateKidsOnScreen();
    	this.showDivorcedOnScreen();
    	this.showConsanguinityOnScreen();
    	this.showZygoticOnScreen();
    	this.showAdoptionOnScreen();
    	this.showDeadOnScreen();
        this.showStillBirthOnScreen();
    	this.showPrematureDeathOnScreen();
    	this.showUnknownFamilyHistoryOnScreen();
    	this.showProbandOnScreen();
        this.showConsultandOnScreen();
    	this.showCarrierOnScreen();
    	this.showPregnantOnScreen();
    	this.showInfertileOnScreen();
    	this.showNoChildrenOnScreen();
    	this.showDonorOnScreen();
    	this.showSurrogateOnScreen();


	    
        $("#Id").val(this.Id);
    }


    wrapper.setColors = function(colors) {
    	var newShape;
    	if(colors.length === 0) {
    		this.setColors(["black"]);
    		this.custom = false;
    		return;
    	}
    	else if(colors.length === 1) {
    		if(this.shapeName === "circle") {
    			newShape = myPanel.createCircle();
    			newShape.getStroke().setWeight(window.outline);
    			newShape.setCenterLocationXY(this.getX(),this.getY());
    			newShape.setRadius(window.shapeSize/2);
    		}
		    else if(this.shapeName === "diamond") {
		    	newShape = myPanel.createRectangle();
		    	newShape.getStroke().setWeight(window.outline);
		    	newShape.setRotation(45);
		    	newShape.setLocationXY(this.getX(),this.getY());
		    	newShape.setWidth(window.shapeSize/Math.sqrt(2));
		    	newShape.setHeight(window.shapeSize/Math.sqrt(2));
		    }
		    else if(this.shapeName === "square") {
		    	newShape = myPanel.createRectangle();
		    	newShape.getStroke().setWeight(window.outline);
		    	newShape.setLocationXY(this.getX(),this.getY());
		    	newShape.setWidth(window.shapeSize);
		    	newShape.setHeight(window.shapeSize);
		    }
    		newShape.getStroke().setColor(colors[0]);
    		this.custom = false;
    	}
    	else if(this.shapeName === "circle") {
    		newShape = multiColorCircle(this.getX(), this.getY(), colors);
    		this.custom = true;
    	}
    	else if(this.shapeName === "diamond") {
    		newShape = multiColorDiamond(this.getX(), this.getY(), colors);
    		this.custom = true;
    	}
    	else if(this.shapeName === "square") {
    		newShape = multiColorSquare(this.getX(), this.getY(), colors);
    		this.custom = true;
    	}

    	this.removeElement(this.shapeObject);
    	this.shapeObject = newShape;
    	this.addElement(newShape);
    	if(this.isSelected === true) {
    		this.makeSelected();
    	}
    	else {
    		this.makeUnselected();
    	}
    	if(this.isSelectedForFamily !== "") {
    		this.makeSelectedForFamily(this.isSelectedForFamily);
		}
    	else {
    		this.makeUnselectedForFamily();
    	}
    }

    wrapper.updateColors = function() {
    	var colorList = [];
    	for(var i=0; i<this.diagnosis.length; ++i) {
	    	colorList.push($("#legendWrapper p[value='"+this.diagnosis[i][0]+"']").css("color"));
	    }
	    this.setColors(colorList);
    }

    wrapper.makeSelected = function() {
    	this.isSelected = true;
    	if(this.custom === false) {
    		this.shapeObject.getStroke().setWeight(window.outline/4);
    		this.shapeObject.getStroke().setDashStyle(jsgl.DashStyles.DASH);
    	}
    	else {
    		for(var i=0; i<this.shapeObject.getElementsCount(); ++i) {
    			this.shapeObject.getElementAt(i).getStroke().setWeight(window.outline/4);
    			this.shapeObject.getElementAt(i).getStroke().setDashStyle(jsgl.DashStyles.DASH);
    		}	
    	}
    }

    wrapper.makeUnselected = function() {
    	this.isSelected = false;
    	if(this.custom === false) {
    		this.shapeObject.getStroke().setWeight(window.outline);
    		this.shapeObject.getStroke().setDashStyle(jsgl.DashStyles.SOLID);
    	}
    	else {
    		for(var i=0; i<this.shapeObject.getElementsCount(); ++i) {
    			this.shapeObject.getElementAt(i).getStroke().setWeight(window.outline);
    			this.shapeObject.getElementAt(i).getStroke().setDashStyle(jsgl.DashStyles.SOLID);
    		}
    	}
    }

    wrapper.makeSelectedForFamily = function(option) {
    	this.isSelectedForFamily = option;
    	if(this.custom === false) {
    		if(option === "parent") {
    			this.shapeObject.getFill().setColor("red");
    		}
    		else {
    			this.shapeObject.getFill().setColor("blue");
    		}
    		this.shapeObject.getFill().setOpacity(0.2);
    	}
    	else {
    		if(option === "parent") {
    			this.shapeObject.dummyShape.getFill().setColor("red");
    		}
    		else {
    			this.shapeObject.dummyShape.getFill().setColor("blue");
    		}
    		this.shapeObject.dummyShape.getFill().setOpacity(0.2);
    	}
    }

    wrapper.makeUnselectedForFamily = function() {
    	this.isSelectedForFamily = "";
    	if(this.custom === false) {
    		this.shapeObject.getFill().setColor("white");
    		this.shapeObject.getFill().setOpacity(1);
    	}
    	else {
    		this.shapeObject.dummyShape.getFill().setColor("white");
    		this.shapeObject.dummyShape.getFill().setOpacity(1);
    	}
    }

    if(wrapper.shapeName !== "dummy") {
	    wrapper.personText = personTextInit(wrapper.bottomAnchor(), wrapper.shapeName);
	    wrapper.addElement(wrapper.personText);
	    wrapper.personText.addNewLine("["+wrapper.Id+"]", "Id");
	    wrapper.personText.removeLine("Id");
	    wrapper.personText.addNewLine("["+wrapper.Id+"]", "Id");
	}

    wrapper.removeHyperEdge = function(hyperEdge) {

        for(var i=0; i<this.topHyperEdges.length; ++i) {
            if(this.topHyperEdges[i] === hyperEdge) {
                this.topHyperEdges.splice(i,1);
                return;
            }
        }
        for(var i=0; i<this.bottomHyperEdges.length; ++i) {
            if(this.bottomHyperEdges[i] === hyperEdge) {
                this.bottomHyperEdges.splice(i,1);
                return;
            }
        }
        for(var i=0; i<this.leftHyperEdges.length; ++i) {
            if(this.leftHyperEdges[i] === hyperEdge) {
                this.leftHyperEdges.splice(i,1);
                return;
            }
        }
        for(var i=0; i<this.rightHyperEdges.length; ++i) {
            if(this.rightHyperEdges[i] === hyperEdge) {
                this.rightHyperEdges.splice(i,1);
                return;
            }
        }

    }


    wrapper.toJSON = function() {
        return  '{"shapeName":"'+myToString(this.shapeName)+'",'+
                '"Id":"'+myToString(this.Id)+'",'+
                '"adoptionBrackets":"'+myToString(this.adoptionBrackets)+'",'+
                '"parents":"'+myToString(this.parents)+'",'+
                '"adoptiveParents":"'+myToString(this.adoptiveParents)+'",'+
                '"mateKids":"'+myToString(this.mateKids)+'",'+
                '"diagnosis":"'+myToString(this.diagnosis)+'",'+
                '"ageAtVisit":"'+myToString(this.ageAtVisit)+'",'+
                '"otherInfo":"'+myToString(this.otherInfo)+'",'+
                '"numbPersons":"'+myToString(this.numbPersons)+'",'+
                '"divorcedList":"'+myToString(this.divorcedList)+'",'+
                '"consanguinityList":"'+myToString(this.consanguinityList)+'",'+
                '"zygoticNumber":"'+myToString(this.zygoticNumber)+'",'+
                '"zygoticList":"'+myToString(this.zygoticList)+'",'+
                '"zygoticType":"'+myToString(this.zygoticType)+'",'+
                '"noChildrenList":"'+myToString(this.noChildrenList)+'",'+
                '"infertileList":"'+myToString(this.infertileList)+'",'+
                '"dead":"'+myToString(this.dead)+'",'+
                '"ageOfDeath":"'+myToString(this.ageOfDeath)+'",'+
                '"stillBirth":"'+myToString(this.stillBirth)+'",'+
                '"ageOfStillBirth":"'+myToString(this.ageOfStillBirth)+'",'+
                '"prematureDeath":"'+myToString(this.prematureDeath)+'",'+
                '"typeOfPrematureDeath":"'+myToString(this.typeOfPrematureDeath)+'",'+
                '"unknownFamilyHistory":"'+myToString(this.unknownFamilyHistory)+'",'+
                '"proband":"'+myToString(this.proband)+'",'+
                '"consultand":"'+myToString(this.consultand)+'",'+
                '"carrier":"'+myToString(this.carrier)+'",'+
                '"pregnant":"'+myToString(this.pregnant)+'",'+
                '"surrogate":"'+myToString(this.surrogate)+'",'+
                '"donor":"'+myToString(this.donor)+'"}';
    }


    return wrapper;
}



function myToString(val) {
    if(val == null) {
        return "";
    }
    else {
        return val.toString();
    }
}


/*
    '{"shapeName":"'+myToString(this.shapeName)+'",'+
    '"custom":"'+myToString(this.custom)+'",'+
    '"isSelected":"'+myToString(this.isSelected)+'",'+
    '"isSelectedForFamily":"'+myToString(this.isSelectedForFamily)+'",'+
    '"rightHyperEdges":"'+myToString(this.rightHyperEdges)+'",'+
    '"leftHyperEdges":"'+myToString(this.leftHyperEdges)+'",'+
    '"topHyperEdges":"'+myToString(this.topHyperEdges)+'",'+
    '"bottomHyperEdges":"'+myToString(this.bottomHyperEdges)+'",'+
    '"Id":"'+myToString(this.Id)+'",'+
    '"adoptionBrackets":"'+myToString(this.adoptionBrackets)+'",'+
    '"noChildrenGraphic":"'+myToString(this.noChildrenGraphic)+'",'+
    '"infertileGraphic":"'+myToString(this.infertileGraphic)+'",'+
    '"deadLine":"'+myToString(this.deadLine)+'",'+
    '"stillBirthLine":"'+myToString(this.stillBirthLine)+'",'+
    '"unknownFamilyHistoryGraphic":"'+myToString(this.unknownFamilyHistoryGraphic)+'",'+
    '"probandGraphic":"'+myToString(this.probandGraphic)+'",'+
    '"carrierGraphic":"'+myToString(this.carrierGraphic)+'",'+
    '"pregnantGraphic":"'+myToString(this.pregnantGraphic)+'",'+
    '"surrogateGraphic":"'+myToString(this.surrogateGraphic)+'",'+
    '"donorGraphic":"'+myToString(this.donorGraphic)+'",'+
    '"parents":"'+myToString(this.parents)+'",'+
    '"adoptiveParents":"'+myToString(this.adoptiveParents)+'",'+
    '"mateKids":"'+myToString(this.mateKids)+'",'+
    '"diagnosis":"'+myToString(this.diagnosis)+'",'+
    '"ageAtVisit":"'+myToString(this.ageAtVisit)+'",'+
    '"otherInfo":"'+myToString(this.otherInfo)+'",'+
    '"numbPersons":"'+myToString(this.numbPersons)+'",'+
    '"numbPersonsDisplay":"'+myToString(this.numbPersonsDisplay)+'",'+
    '"divorcedList":"'+myToString(this.divorcedList)+'",'+
    '"consanguinityList":"'+myToString(this.consanguinityList)+'",'+
    '"zygoticNumber":"'+myToString(this.zygoticNumber)+'",'+
    '"zygoticList":"'+myToString(this.zygoticList)+'",'+
    '"zygoticType":"'+myToString(this.zygoticType)+'",'+
    '"noChildrenList":"'+myToString(this.noChildrenList)+'",'+
    '"infertileList":"'+myToString(this.infertileList)+'",'+
    '"dead":"'+myToString(this.dead)+'",'+
    '"ageOfDeath":"'+myToString(this.ageOfDeath)+'",'+
    '"stillBirth":"'+myToString(this.stillBirth)+'",'+
    '"ageOfStillBirth":"'+myToString(this.ageOfStillBirth)+'",'+
    '"prematureDeath":"'+myToString(this.prematureDeath)+'",'+
    '"typeOfPrematureDeath":"'+myToString(this.typeOfPrematureDeath)+'",'+
    '"unknownFamilyHistory":"'+myToString(this.unknownFamilyHistory)+'",'+
    '"proband":"'+myToString(this.proband)+'",'+
    '"consultand":"'+myToString(this.consultand)+'",'+
    '"carrier":"'+myToString(this.carrier)+'",'+
    '"pregnant":"'+myToString(this.pregnant)+'",'+
    '"surrogate":"'+myToString(this.surrogate)+'",'+
    '"donor":"'+myToString(this.donor)+'",'+
    '"personText":"'+myToString(this.personText)+'"}';
*/





