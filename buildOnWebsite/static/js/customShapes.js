"use strict";


function multiColorCircle(centerX, centerY, colors) {

	var radius = window.shapeSize/2;

	var wrapper = myPanel.createGroup();

	var dummyCircle = myPanel.createCircle();
	dummyCircle.getStroke().setWeight(0);
	dummyCircle.setCenterLocationXY(centerX,centerY);
	dummyCircle.setRadius(window.shapeSize/2);
	wrapper.dummyShape = dummyCircle;
	wrapper.addElement(dummyCircle);

	var n = colors.length;
	var r = radius;
	var theta = 2*Math.PI/n;

	for(var i=0; i<colors.length; ++i) {

		var myCurve = myPanel.createCurve();

		var p_ix = r*Math.cos(i*theta) + centerX;
		var p_iy = r*Math.sin(i*theta) + centerY;

		var q_ix = r*Math.cos((i+1)*theta) + centerX;
		var q_iy = r*Math.sin((i+1)*theta) + centerY;

		var alpha = Math.atan2(4/3*Math.tan(Math.PI/(2*n)), 1);
		var r_ = r*Math.sqrt(1+16/9*Math.pow(Math.tan(Math.PI/(2*n)), 2));

		var a_ix = r_*Math.cos(i*theta + alpha) + centerX;
		var a_iy = r_*Math.sin(i*theta + alpha) + centerY;

		var b_ix = r_*Math.cos((i+1)*theta - alpha) + centerX;
		var b_iy = r_*Math.sin((i+1)*theta - alpha) + centerY;

		myCurve.setStartPointXY(q_ix,q_iy);
		myCurve.setEndPointXY(p_ix,p_iy);
		myCurve.setControl1PointXY(b_ix,b_iy);
		myCurve.setControl2PointXY(a_ix,a_iy);

		myCurve.getStroke().setColor(colors[i]);
		myCurve.getStroke().setWeight(window.outline);

		wrapper.addElement(myCurve);
	}

	wrapper.X = centerX;
	wrapper.Y = centerY;
	wrapper.getXCustom = function() {return this.X}
    wrapper.getYCustom = function() {return this.Y}

	return wrapper;
}

function multiColorSquare(centerX, centerY, colors) {

	var wrapper = myPanel.createGroup();

	var dummySquare = myPanel.createRectangle();
	dummySquare.getStroke().setWeight(0);
	dummySquare.setLocationXY(centerX,centerY);
	dummySquare.setWidth(window.shapeSize);
	dummySquare.setHeight(window.shapeSize);
	wrapper.dummyShape = dummySquare;
	wrapper.addElement(dummySquare);

	centerX += window.shapeSize/2;
	centerY += window.shapeSize/2;

	var n = colors.length;
	var r = window.shapeSize*Math.sqrt(2)/2;
	var theta = 2*Math.PI/n;

	var thetaColorList = [];
	for(var i=0; i<colors.length; ++i) {
		if(i*theta <= Math.PI/4 || i*theta > 7*Math.PI/4) {
			if((i+1)*theta > 3*Math.PI/4) {
				thetaColorList.push([i*theta, Math.PI/4, colors[i]]);
				thetaColorList.push([Math.PI/4, 3*Math.PI/4, colors[i]]);
				thetaColorList.push([3*Math.PI/4, (i+1)*theta, colors[i]]);
			}
			else if((i+1)*theta > Math.PI/4) {
				thetaColorList.push([i*theta, Math.PI/4, colors[i]]);
				thetaColorList.push([Math.PI/4, (i+1)*theta, colors[i]]);
			}
			else {
				thetaColorList.push([i*theta, (i+1)*theta, colors[i]]);
			}
		}
		else if(i*theta <= 3*Math.PI/4) {
			if((i+1)*theta > 5*Math.PI/4) {
				thetaColorList.push([i*theta, 3*Math.PI/4, colors[i]]);
				thetaColorList.push([3*Math.PI/4, 5*Math.PI/4, colors[i]]);
				thetaColorList.push([5*Math.PI/4, (i+1)*theta, colors[i]]);
			}
			else if((i+1)*theta > 3*Math.PI/4) {
				thetaColorList.push([i*theta, 3*Math.PI/4, colors[i]]);
				thetaColorList.push([3*Math.PI/4, (i+1)*theta, colors[i]]);
			}
			else {
				thetaColorList.push([i*theta, (i+1)*theta, colors[i]]);
			}
		}
		else if(i*theta <= 5*Math.PI/4) {
			if((i+1)*theta > 7*Math.PI/4) {
				thetaColorList.push([i*theta, 5*Math.PI/4, colors[i]]);
				thetaColorList.push([5*Math.PI/4, 7*Math.PI/4, colors[i]]);
				thetaColorList.push([7*Math.PI/4, (i+1)*theta, colors[i]]);
			}
			else if((i+1)*theta > 5*Math.PI/4) {
				thetaColorList.push([i*theta, 5*Math.PI/4, colors[i]]);
				thetaColorList.push([5*Math.PI/4, (i+1)*theta, colors[i]]);
			}
			else {
				thetaColorList.push([i*theta, (i+1)*theta, colors[i]]);
			}
		}
		else if(i*theta <= 7*Math.PI/4) {
			if((i+1)*theta > 9*Math.PI/4) {
				thetaColorList.push([i*theta, 7*Math.PI/4, colors[i]]);
				thetaColorList.push([7*Math.PI/4, 9*Math.PI/4, colors[i]]);
				thetaColorList.push([9*Math.PI/4, (i+1)*theta, colors[i]]);
			}
			else if((i+1)*theta > 7*Math.PI/4) {
				thetaColorList.push([i*theta, 7*Math.PI/4, colors[i]]);
				thetaColorList.push([7*Math.PI/4, (i+1)*theta, colors[i]]);
			}
			else {
				thetaColorList.push([i*theta, (i+1)*theta, colors[i]]);
			}
		}
	}

	for(var i=0; i<thetaColorList.length; ++i) {

		var theta_1 = thetaColorList[i][0];
		var theta_2 = thetaColorList[i][1];
		var color = thetaColorList[i][2];

		var myLine = myPanel.createLine();

		var x1,x2,y1,y2,beta_1,beta_2,r_1,r_2;

		if(theta_1 < Math.PI/4 || theta_1 >= 7*Math.PI/4) {
			beta_1 = theta_1 + Math.PI/4;
			r_1 = r*Math.sqrt(2)/2/Math.sin(3*Math.PI/4 - beta_1);

			beta_2 = theta_2 + Math.PI/4;
			r_2 = r*Math.sqrt(2)/2/Math.sin(3*Math.PI/4 - beta_2);

			x1 = r/Math.sqrt(2) + centerX;
			y1 = -r_1*Math.sin(theta_1) + centerY;

			x2 = x1;
			y2 = -r_2*Math.sin(theta_2) + centerY;
		}
		else if(theta_1 < 3*Math.PI/4) {
			beta_1 = theta_1 - Math.PI/4;
			r_1 = r*Math.sqrt(2)/2/Math.sin(3*Math.PI/4 - beta_1);

			beta_2 = theta_2 - Math.PI/4;
			r_2 = r*Math.sqrt(2)/2/Math.sin(3*Math.PI/4 - beta_2);

			x1 = r_1*Math.cos(theta_1)+ centerX;
			y1 = -r/Math.sqrt(2) + centerY;

			x2 = r_2*Math.cos(theta_2)+ centerX;
			y2 = y1;
		}
		else if(theta_1 < 5*Math.PI/4) {
			beta_1 = theta_1 - 3*Math.PI/4;
			r_1 = r*Math.sqrt(2)/2/Math.sin(3*Math.PI/4 - beta_1);

			beta_2 = theta_2 - 3*Math.PI/4;
			r_2 = r*Math.sqrt(2)/2/Math.sin(3*Math.PI/4 - beta_2);

			x1 = -r/Math.sqrt(2) + centerX;
			y1 = -r_1*Math.sin(theta_1) + centerY;

			x2 = x1;
			y2 = -r_2*Math.sin(theta_2) + centerY;
		}
		else if(theta_1 < 7*Math.PI/4) {
			beta_1 = theta_1 - 5*Math.PI/4;
			r_1 = r*Math.sqrt(2)/2/Math.sin(3*Math.PI/4 - beta_1);

			beta_2 = theta_2 - 5*Math.PI/4;
			r_2 = r*Math.sqrt(2)/2/Math.sin(3*Math.PI/4 - beta_2);

			x1 = r_1*Math.cos(theta_1)+ centerX;
			y1 = r/Math.sqrt(2) + centerY;

			x2 = r_2*Math.cos(theta_2)+ centerX;
			y2 = y1;
		}
		
		myLine.setStartPointXY(x1,y1);
		myLine.setEndPointXY(x2,y2);

		myLine.getStroke().setColor(color);
		myLine.getStroke().setWeight(window.outline);

		wrapper.addElement(myLine);
	}

	wrapper.X = centerX;
	wrapper.Y = centerY;
	wrapper.getXCustom = function() {return this.X - window.shapeSize/2}
    wrapper.getYCustom = function() {return this.Y - window.shapeSize/2}

	return wrapper;
}

function multiColorDiamond(centerX, centerY, colors) {

	var wrapper = myPanel.createGroup();

	centerY += window.shapeSize/2;

	var dummyDiamond = myPanel.createRectangle();
	dummyDiamond.getStroke().setWeight(0);
	dummyDiamond.setRotation(45);
	dummyDiamond.setLocationXY(centerX,centerY-window.shapeSize/2);
	dummyDiamond.setWidth(window.shapeSize/Math.sqrt(2));
	dummyDiamond.setHeight(window.shapeSize/Math.sqrt(2));
	wrapper.dummyShape = dummyDiamond;
	wrapper.addElement(dummyDiamond);
	
	var n = colors.length;
	var r = window.shapeSize/2;
	var theta = 2*Math.PI/n;
	
	var thetaColorList = [];
	for(var i=0; i<colors.length; ++i) {
		if(i*theta <= Math.PI/4 || i*theta > 7*Math.PI/4) {
			if((i+1)*theta > 3*Math.PI/4) {
				thetaColorList.push([i*theta, Math.PI/4, colors[i]]);
				thetaColorList.push([Math.PI/4, 3*Math.PI/4, colors[i]]);
				thetaColorList.push([3*Math.PI/4, (i+1)*theta, colors[i]]);
			}
			else if((i+1)*theta > Math.PI/4) {
				thetaColorList.push([i*theta, Math.PI/4, colors[i]]);
				thetaColorList.push([Math.PI/4, (i+1)*theta, colors[i]]);
			}
			else {
				thetaColorList.push([i*theta, (i+1)*theta, colors[i]]);
			}
		}
		else if(i*theta <= 3*Math.PI/4) {
			if((i+1)*theta > 5*Math.PI/4) {
				thetaColorList.push([i*theta, 3*Math.PI/4, colors[i]]);
				thetaColorList.push([3*Math.PI/4, 5*Math.PI/4, colors[i]]);
				thetaColorList.push([5*Math.PI/4, (i+1)*theta, colors[i]]);
			}
			else if((i+1)*theta > 3*Math.PI/4) {
				thetaColorList.push([i*theta, 3*Math.PI/4, colors[i]]);
				thetaColorList.push([3*Math.PI/4, (i+1)*theta, colors[i]]);
			}
			else {
				thetaColorList.push([i*theta, (i+1)*theta, colors[i]]);
			}
		}
		else if(i*theta <= 5*Math.PI/4) {
			if((i+1)*theta > 7*Math.PI/4) {
				thetaColorList.push([i*theta, 5*Math.PI/4, colors[i]]);
				thetaColorList.push([5*Math.PI/4, 7*Math.PI/4, colors[i]]);
				thetaColorList.push([7*Math.PI/4, (i+1)*theta, colors[i]]);
			}
			else if((i+1)*theta > 5*Math.PI/4) {
				thetaColorList.push([i*theta, 5*Math.PI/4, colors[i]]);
				thetaColorList.push([5*Math.PI/4, (i+1)*theta, colors[i]]);
			}
			else {
				thetaColorList.push([i*theta, (i+1)*theta, colors[i]]);
			}
		}
		else if(i*theta <= 7*Math.PI/4) {
			if((i+1)*theta > 9*Math.PI/4) {
				thetaColorList.push([i*theta, 7*Math.PI/4, colors[i]]);
				thetaColorList.push([7*Math.PI/4, 9*Math.PI/4, colors[i]]);
				thetaColorList.push([9*Math.PI/4, (i+1)*theta, colors[i]]);
			}
			else if((i+1)*theta > 7*Math.PI/4) {
				thetaColorList.push([i*theta, 7*Math.PI/4, colors[i]]);
				thetaColorList.push([7*Math.PI/4, (i+1)*theta, colors[i]]);
			}
			else {
				thetaColorList.push([i*theta, (i+1)*theta, colors[i]]);
			}
		}
	}

	for(var i=0; i<thetaColorList.length; ++i) {

		var theta_1 = thetaColorList[i][0];
		var theta_2 = thetaColorList[i][1];
		var color = thetaColorList[i][2];

		var myLine = myPanel.createLine();

		var x1,x2,y1,y2,beta_1,beta_2,r_1,r_2;

		if(theta_1 < Math.PI/4 || theta_1 >= 7*Math.PI/4) {
			beta_1 = theta_1 + Math.PI/4;
			r_1 = r*Math.sqrt(2)/2/Math.sin(3*Math.PI/4 - beta_1);

			beta_2 = theta_2 + Math.PI/4;
			r_2 = r*Math.sqrt(2)/2/Math.sin(3*Math.PI/4 - beta_2);

			x1 = r/Math.sqrt(2);
			y1 = -r_1*Math.sin(theta_1);

			x2 = x1;
			y2 = -r_2*Math.sin(theta_2);
		}
		else if(theta_1 < 3*Math.PI/4) {
			beta_1 = theta_1 - Math.PI/4;
			r_1 = r*Math.sqrt(2)/2/Math.sin(3*Math.PI/4 - beta_1);

			beta_2 = theta_2 - Math.PI/4;
			r_2 = r*Math.sqrt(2)/2/Math.sin(3*Math.PI/4 - beta_2);

			x1 = r_1*Math.cos(theta_1);
			y1 = -r/Math.sqrt(2);

			x2 = r_2*Math.cos(theta_2);
			y2 = y1;
		}
		else if(theta_1 < 5*Math.PI/4) {
			beta_1 = theta_1 - 3*Math.PI/4;
			r_1 = r*Math.sqrt(2)/2/Math.sin(3*Math.PI/4 - beta_1);

			beta_2 = theta_2 - 3*Math.PI/4;
			r_2 = r*Math.sqrt(2)/2/Math.sin(3*Math.PI/4 - beta_2);

			x1 = -r/Math.sqrt(2);
			y1 = -r_1*Math.sin(theta_1);

			x2 = x1;
			y2 = -r_2*Math.sin(theta_2);
		}
		else if(theta_1 < 7*Math.PI/4) {
			beta_1 = theta_1 - 5*Math.PI/4;
			r_1 = r*Math.sqrt(2)/2/Math.sin(3*Math.PI/4 - beta_1);

			beta_2 = theta_2 - 5*Math.PI/4;
			r_2 = r*Math.sqrt(2)/2/Math.sin(3*Math.PI/4 - beta_2);

			x1 = r_1*Math.cos(theta_1);
			y1 = r/Math.sqrt(2);

			x2 = r_2*Math.cos(theta_2);
			y2 = y1;
		}
		
		var x1_ = Math.sqrt(x1*x1 + y1*y1)*Math.cos(Math.atan2(y1,x1) + Math.PI/4) + centerX;
		var y1_ = Math.sqrt(x1*x1 + y1*y1)*Math.sin(Math.atan2(y1,x1) + Math.PI/4) + centerY;

		var x2_ = Math.sqrt(x2*x2 + y2*y2)*Math.cos(Math.atan2(y2,x2) + Math.PI/4) + centerX;
		var y2_ = Math.sqrt(x2*x2 + y2*y2)*Math.sin(Math.atan2(y2,x2) + Math.PI/4) + centerY;

		myLine.setStartPointXY(x1_,y1_);
		myLine.setEndPointXY(x2_,y2_);

		myLine.getStroke().setColor(color);
		myLine.getStroke().setWeight(window.outline);

		wrapper.addElement(myLine);
	}

	wrapper.X = centerX;
	wrapper.Y = centerY;
	wrapper.getXCustom = function() {return this.X}
    wrapper.getYCustom = function() {return this.Y - window.shapeSize/2;}

	return wrapper;
}
