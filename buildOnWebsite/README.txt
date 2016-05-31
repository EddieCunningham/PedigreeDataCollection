To install:

	- download git:   https://git-scm.com/
		- use all the preselected options when installing
	- launch git bash
	- type "git clone git@github.com:the-xx/MDP-KEC.git" and press enter
	- download latest python 2 release: https://www.python.org/downloads/windows/




Instructions:

- To use, press a button to select what kind of shape to draw, then click anywhere on the drawing panel to draw that shape

- Double clicking shapes will select them to be a part of a family.  Regular double clicking will highlight the shape as BLUE to signify that the person selected is a child.  Double clicking after "q" is pressed will highlight the shape as RED to signify that the person is a parent.

- Clicking an existing shape will select that person.  The bottom part of the screen is where you can enter the person's information.

- To save the pedigree, press the save button and an alert window will pop up to say the pedigree is saved.  All pedigrees will be saved in the "pedigreeData" folder located in the same folder as the app.




Buttons you can press:

	- s: on the next click, will draw a square

	- d: on the next click, will draw a diamond

	- c: on the next click, will draw a circle

	- e: on the next click, will erase whatever is clicked
		- if you click on a line that is connecting a family, it will erase the entire line
		- if you click on a shape, it will erase that shape and remove it from the family it is connected to

	- q: on the next double click, it will select a shape as a parent

	- m: will deselect a shape

	- enter: will connect shapes with line to signify that these people are a family
		- this will work if there is 0, 1 or 2 parents selected




Notes about each feature in the bottom data entry portion of the screen:

	- First portion (Legend):

		- At the top of this section it will say what is the next shape that will be drawn.  This will change everytime one of the above buttons are pressed

		- Legend:
			- Every time a new diagnosis is added in the Diagnosis section, colored text of the new diagnosis will appear and remain there so long as at least one person has that diagnosis

	- Second portion (Global attributes):

		- This section contains information that is pertaining to the pedigree as a whole.

		- Pedigree ID will be the patient number of the pedigree.  This is also going to be the name of the file that we save to.

		- Ethnicities are the ethnicities of the pedigree.  Try to be consistent throughout the pedigrees with how you enter these ethnicities.

		- Inheritance pattern is the inheritance pattern of the proband's disease.  It is crucial that this is entered for the machine learning side of the project.

		- Other is any comments or other information needed about this pedigree

		- Parents, adoptive parents, children and ID are read only!!!  They are just there as a reference to see that the program is working correctly.  
			- Parents are the current individual's parents' IDs.  IF AN ID IS NEGATIVE, THIS MEANS THAT THERE IS AN IMPLIED PERSON THAT IS NOT SHOWN.  
				- In the case of 0 or 1 parent shown, a child will have two or one parent id's that are negative.

			- Adoptive parents are the ids of the parents that adopted the child.  More about this is explained in the adopted section.

			- Children are the children's ids of this person.

			- ID is the id of the currently selected person.  The id is also shown on the screen below every person in brackets.

		- Size is the size of each shape.  If a pedigree is drawn it will resize all elements of it.  Try to avoid resizing after a lot of data is entered just in case (I fixed all the bugs I could find so this shouldn't be an issue, but just to be safe try using an appropriate size from the beginning)

		- SAVE BUTTON:  Pressing this will save the pedigree to a .json file located in the pedigreeData folder in the main directory.

	- Third portion (Diagnosis):

		- This is where you can enter diagnosis information about the currently selected person.

		- The currently selected person will be colored according to what diagnoses they have.

		- Add new will make another entry to enter a diagnosis and its corresponding age of diagnosis and age of onset.

		- Remove will remove the last row.

		- The select option will allow you to choose any existing diagnoses that you have entered for another person.

		- Adding or removing diagnoses here will update the corresponding element in the legend.

	- Fourth portion (Text information about person):

		- Here you can enter text information about the currently selected person such as age, other information, number of persons not shown, age of death, age of stillbirth, Mono/dyzogotic and type of abortion/miscarriage (note the last 4 only appear when the corresponding checkboxes in the checkbox section are selected)

		- Age is the selected person's age at the time of the visit.  Updating this will place the age (followed by a "y") on the screen below the selected shape.

		- Other info is just other information about this selected person

		- Number of persons is for if a shape is supposed to represent multiple people (such as if there is a number or "n" in the middle of the shape).  Updating this text will place the text in the center of the shape.

		- Age of death is only shown when the "dead" checkbox is checked.  Updating this text will put the age of death text (preceded by "d. ") below the currently selected shape.

		- Age of stillbirth is only shown when the "stillbirth" checkbox is checked.  Updating this text will put the age of stillbirth text (with "SB" above it and "d. " in front of it) below the currently selected shape.

		- Mono/dyzogotic is a option select menu where you can mark twins as monozygotic or dyzygotic.  This option is only shown if we mark a subset of children as mono/dyzygotic in the checkbox section.  Marking them as monozygotic will put a horizontal line through the diagonal lines of the set of identical children.

		- Type of abortion/miscarriage will only be shown if the "abortion/miscarriage" checkbox is checked.  Select from the drop down menu what kind of abortion/miscarriage and the text will show under the shape.  ### NOTE THAT DOING THIS DOES NOT MAKE THE SHAPE A TRIANGLE.  I FORGOT TO MAKE A FEATURE WHERE MARKING THE PERSON AS ABORTED TURNS THE SHAPE INTO A TRIANGLE.

	- Fifth portion (Checkbox section):

		- Here we can mark the person as having certain attributes.

			- Divorced, Consanguinity, Dizygotic/Monozygotic, Adopted, No children and Infertile are all based on relationships, so the checkboxes will appear when a family is connected.

				- You will only be able to use divorced and consanguinity for people who are parents.  (Note that person can be a parent and a child)

				- You will only be able to use Dizygotic/Monozygotic, Adopted for people who are children.

				- No children and infertile can be used for anyone.  Note that we can choose indicate that an individual cannot have any children or is infertile, or we can say that a couple is infertile or cannot have children.

			- The rest are person specific so they can be pressed at any time.

		- Divorced will indicate that a couple is divorced.  Choose which person the selected person is divorced with.  This will draw a double diagonal line through the line connecting the parents.  Marking one parent as divorced will automatically mark the other parent as divorced.  

		- Consanguinity will indicate that a couple is consanguinous.  Choose which person the selected person is consanguinous with.  This will draw a double line to replace the line connecting the parents.  Marking one parent as consanguinity will automatically mark the other parent as consanguinity. 

		- Dizygotic/Monozygotic will indicate that children are dizygotic/monozygotic.  For a selected person, the list of its siblings will be available to choose from.  The Dizygotic/Monozygotic option select menu will also appear in the text information portion where you can choose to make this subset of children identical or fraternal.  Selecting children to be dizygotic/monozygotic will turn the vertical lines above them into diagonal lines.

		- Adopted will mark a child adopted.  You will be able to choose from which set of parents to make this person adopted.  Note that the biological parents should not be chosen.  Checking the box will put brackets around the shape and make a dahsed line to the parents of adoption.

		- No children and infertile have the same functionality except that infertile draws an extra horizontal line below the upside down T shape.  You can check the ID of the selected person (this will draw the shape below the person), or the ID of a mate (which will draw the shape below the line connecting them).

		- Dead will mark the person as dead.  It will draw a diagnoal line through the shape and will make the age of death text appear in the text portion.

		- Still birth has the same functionality as dead except when the sillbirth text is updated, it will draw a SB under the shape.

		- Abortion/Miscarriage will make the type of abortion/miscarriage option menu appear in the text portion.  ## SEE NOTE ABOVE ABOUT NOT TURNING SHAPE INTO TRIANGLE.

		- Unknown family history will draw a short line and a question mark above the current shape

		- Proband will mark the currently selected person as the proband.  It will draw an arrow with a P in the bottom left corner of the shape.

		- Consultand has the same functionality as proband, but does not draw the P.  I'm not entirely sure what the difference between this and proband is, but it was in the packet Dana gave us.

		- Carrier will mark the current person as a carrier.  It places a dot in the center of the shape.  #### If there is any information about what kind of carrier this person is, write it in the other info section

		- Pregnancy will mark the current person as a pregnancy.  It places a "P" in the center of the shape.

		- Surrogate marks the current person as a surrogate.  It places an "S" in the center of the shape.

		- Donor marks the current person as a donor.  It places a "D" in the center of the shape.
























