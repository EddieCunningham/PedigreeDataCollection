"use strict";


function labelWrapper(type) {
	var wrapper = myPanel.createLabel();
	wrapper.typeOfLabel = type;

	return wrapper;
}

function personTextInit(location, shape) {
	var wrapper = myPanel.createGroup();
	wrapper.shapeName = shape;

	wrapper.loc = new jsgl.Vector2D(location.getX(), location.getY()-window.shapeSize/2);
	

	wrapper.addNewLine = function(text, labelType) {
    	var nextLine = labelWrapper(labelType);
		nextLine.setText(text);
		var increment = nextLine.getFontSize();
		nextLine.setLocationXY(this.loc.getX()-window.shapeSize/2, this.loc.getY()+increment*(this.getElementsCount()+2)+window.shapeSize/3);
		this.addElement(nextLine);
	}

	wrapper.removeLine = function(labelType) {

		// remove element with type labelType
		for(var i=0; i<this.getElementsCount(); ++i) {
			var current = this.getElementAt(i);
			if(current.typeOfLabel === labelType) {
				this.removeElement(current);
				break;
			}
		}

		// re-order everything
		for(var i=0; i<this.getElementsCount(); ++i) {
			var current = this.getElementAt(i);
			var increment = current.getFontSize();
			current.setLocationXY(this.loc.getX()-window.shapeSize/2, this.loc.getY()+increment*(i+2)+window.shapeSize/3);
		}
	}

	wrapper.getLine = function(labelType) {
		for(var i=0; i<this.getElementsCount(); ++i) {
			var current = this.getElementAt(i);
			if(current.typeOfLabel === labelType) {
				return current.getText();
			}
		}
		return null;
	}

	wrapper.setLine = function(text, labelType) {
		for(var i=0; i<this.getElementsCount(); ++i) {
			var current = this.getElementAt(i);
			if(current.typeOfLabel === labelType) {
				current.setText(text);
				return;
			}
		}
	}

	wrapper.getAllLines = function() {
		var ans = [];
		for(var i=0; i<this.getElementsCount(); ++i) {
			ans.push([this.getElementAt(i).getText(), this.getElementAt(i).typeOfLabel]);
		}
		return ans;
	}


	return wrapper;
}