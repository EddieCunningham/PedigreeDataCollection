"use strict";

/* Instantiate JSGL Panel. */
var myPanel = new jsgl.Panel(document.getElementById("panel"));

window.currentShape = "none";
window.currentlySelected = null;

window.currentlySelectedParents = [];
window.currentlySelectedChildren = [];
window.nextSelectIsParent = false;

window.lastZygoticNumber = 0;


document.onkeypress = function(evt) {
    if(window.lockPanel === true) {
        return;
    }
    var evt = evt || window.event;
    var charCode = evt.keyCode || evt.which;
    var charStr = String.fromCharCode(charCode);
    
    if(charStr === 'c' || charStr === 'C') {
        window.currentShape = "circle"; 
        $("#currentSelection").text("Female selected");
    }
    else if(charStr === 's' || charStr === 'S') {
        window.currentShape = "square"; 
        $("#currentSelection").text("Male selected");
    }
    else if(charStr === 'd' || charStr === 'D') {
        window.currentShape = "diamond"; 
        $("#currentSelection").text("Unknown selected");
    }
    else if(charStr === 'e' || charStr === 'E') {
        window.currentShape = "erase"; 
        $("#currentSelection").text("Erase");
        return;
    }
    else if(charStr === 'm' || charStr === 'M') {
        window.currentShape = "none"; 
        $("#currentSelection").text("Nothing selected"); 
        deselectSelectedPerson();
    }
    else if(charCode === 13) {
        connectFamily(); 
    }
    else if(charStr === 'q' || charStr === 'q') {
        if(window.nextSelectIsParent === true) {
            window.nextSelectIsParent = false; 
            $("#extraInfo").text("");
        }
        else {
            window.nextSelectIsParent = true; 
            $("#extraInfo").text("Selecting a parent");
        }
        
    }

    window.lastCurrentShape = window.currentShape;
    window.lastHelpText = $("#currentSelection").text();
}

myPanel.addClickListener(
    function(eventArgs) {
        if(window.lockPanel === true) {
            return;
        }
        var elementWrapper = elementToWrapper(eventArgs.getSourceElement());
        if(window.currentShape !== "erase") {
            if(elementWrapper == null) {
                if(window.currentShape !== "none") {
                    var elementWrapper = myPerson(window.currentShape, eventArgs.getLocation());
                    myPanel.addElement(elementWrapper);
                    deselectSelectedPerson();
                    selectPerson(elementWrapper);
                }
                else {
                    return;
                }
            }
            else if(elementWrapper.shapeName === "circle" || elementWrapper.shapeName === "square" || elementWrapper.shapeName === "diamond"){
                deselectSelectedPerson();
                selectPerson(elementWrapper);
            }
        }
        else {
            // things that we need to consider:
            // if we click on a person
            //      1 - remove the person wrapper
            //      2 - remove all references of the person from its corresponding edge
            // if we click on an edge
            //      1 - remove all references between people attached to the edge
            if(elementWrapper == null) { return; }
            else if(elementWrapper.shapeName === "circle" || elementWrapper.shapeName === "square" || elementWrapper.shapeName === "diamond") {

                for(var i=0; i<elementWrapper.topHyperEdges.length; ++i) {
                    var current = elementWrapper.topHyperEdges[i];
                    if(current.removePerson(elementWrapper) === "getRidOfIt") {
                        myPanel.removeElement(current);
                    }
                    --i;
                }

                for(var i=0; i<elementWrapper.bottomHyperEdges.length; ++i) {
                    var current = elementWrapper.bottomHyperEdges[i];
                    if(current.removePerson(elementWrapper) === "getRidOfIt") {
                        myPanel.removeElement(current);
                    }
                    --i;
                }

                for(var i=0; i<elementWrapper.leftHyperEdges.length; ++i) {
                    var current = elementWrapper.leftHyperEdges[i];
                    if(current.removePerson(elementWrapper) === "getRidOfIt") {
                        myPanel.removeElement(current);
                    }
                    --i;
                }

                for(var i=0; i<elementWrapper.rightHyperEdges.length; ++i) {
                    var current = elementWrapper.rightHyperEdges[i];
                    if(current.removePerson(elementWrapper) === "getRidOfIt") {
                        myPanel.removeElement(current);
                    }
                    --i;
                }

                if(window.currentlySelected === elementWrapper) {
                    deselectSelectedPerson();
                    myPanel.removeElement(elementWrapper);
                }
                else if(window.currentlySelected == null) {
                    myPanel.removeElement(elementWrapper);
                }
                else {
                    var lastSelected = window.currentlySelected;
                    deselectSelectedPerson();
                    myPanel.removeElement(elementWrapper);
                    selectPerson(lastSelected);
                }
            }
            else if(elementWrapper.shapeName === "hyperEdge") {


                for(var i=0; i<elementWrapper.lines.length; ++i) {
                    elementWrapper.removeElement(elementWrapper.lines[i]);
                }
                for(var i=0; i<elementWrapper.parents.length; ++i) {
                    elementWrapper.parents[i].removeHyperEdge(elementWrapper);
                }
                for(var i=0; i<elementWrapper.children.length; ++i) {
                    elementWrapper.children[i].removeHyperEdge(elementWrapper);
                }
                elementWrapper.parents = [];
                elementWrapper.children = [];

                myPanel.removeElement(elementWrapper);
                
                updateRelationships();
            }

            window.currentShape = window.lastCurrentShape;
            $("#currentSelection").text(window.lastHelpText); 
        }
    }
);

myPanel.addDoubleClickListener(
    function(eventArgs) {
        if(window.lockPanel === true) {
            return;
        }
        var person = elementToWrapper(eventArgs.getSourceElement());
        if(person == null) {
            return;
        }
        else {
            toggleSelectForFamily(person);
        }
    }
);

function toggleSelectForFamily(person) {
    if(person.isSelectedForFamily === "") {
        
        if(window.nextSelectIsParent === true) {
            person.makeSelectedForFamily("parent");
            window.currentlySelectedParents.push(person);
            window.nextSelectIsParent = false;
            $("#extraInfo").text("");
        }
        else {
            person.makeSelectedForFamily("child");
            window.currentlySelectedChildren.push(person);
        }
    }
    else {
        person.makeUnselectedForFamily();
        if(window.currentlySelectedParents.indexOf(person) !== -1) {
            window.currentlySelectedParents.splice(window.currentlySelectedParents.indexOf(person), 1);
        }
        else {
            window.currentlySelectedChildren.splice(window.currentlySelectedChildren.indexOf(person), 1);
        }
    }
}

function clearFields() {

        //Parents
        $("#parents").val("");
        $("#adoptiveParents").val("");

        //MateKids
        $("#children").val("");

        //ID
        $("#Id").val("");

        //Diagnosis
        while($('#diagnosisTable tr').length > 1) {
            $("#diagnosisTable tr:last").remove();
        }

        //AgeAtVisit
        $("#ageAtVisit").val("");

        //OtherInfo
        $("#otherInfo").val("");

        //NumbPersons
        $("#numbPersons").val("");

        //Divorced
        $("#divorcedWrapper input[class='divorced']").each(function(){this.nextSibling.nodeValue = "";});
        $("#divorcedWrapper input[class='divorced']").remove();

        //Consanguinity
        $("#consanguinityWrapper input[class='consanguinity']").each(function(){this.nextSibling.nodeValue = "";});
        $("#consanguinityWrapper input[class='consanguinity']").remove();

        //Zygotic
        $("#zygoticWrapper input[class='zygotic']").each(function(){this.nextSibling.nodeValue = "";});
        $("#zygoticWrapper input[class='zygotic']").remove();

        //Adoption
        $("#adoptedWrapper input[class='adopted']").each(function(){this.nextSibling.nodeValue = "";});
        $("#adoptedWrapper input[class='adopted']").remove();

        //Dead
        $("#dead").prop("checked",false);
        $("#textInputWrapper input[id='ageOfDeath']").remove();
        $("#textInputWrapper p[class='ageOfDeathText']").remove();

        //StillBirth
        $("#stillBirth").prop("checked",false);
        $("#textInputWrapper input[id='ageOfStillBirth']").remove();
        $("#textInputWrapper p[class='ageOfStillBirthText']").remove();

        //PrematureDeath
        $("#prematureDeath").prop("checked",false);
        $("#textInputWrapper select[id='typeOfPrematureDeath']").remove();
        $("#textInputWrapper p[class='prematureDeathText']").remove();

        //UnknownFamilyHistory
        $("#unknownFamilyHistory").prop("checked",false);

        //Consultand
        $("#consultand").prop("checked",false);

        //Proband
        $("#proband").prop("checked",false);

        //Carrier
        $("#carrier").prop("checked",false);

        //Pregnant
        $("#pregnant").prop("checked",false);

        //Infertile
        $("#infertileWrapper input[class='infertile']").each(function(){this.nextSibling.nodeValue = "";});
        $("#infertileWrapper input[class='infertile']").remove();

        //NoChildren
        $("#noChildrenWrapper input[class='noChildren']").each(function(){this.nextSibling.nodeValue = "";});
        $("#noChildrenWrapper input[class='noChildren']").remove();

        //Donor
        $("#donor").prop("checked",false);

        //Surrogate
        $("#surrogate").prop("checked",false);
}

function updateCurrentlySelectedAttributes() {
    window.currentlySelected.updateParents();
    window.currentlySelected.updateMateKids();
    window.currentlySelected.updateDiagnosis();
    window.currentlySelected.updateAgeAtVisit();
    window.currentlySelected.updateOtherInfo();
    window.currentlySelected.updateNumbPersons();
    window.currentlySelected.updateDivorced();
    window.currentlySelected.updateConsanguinity();
    window.currentlySelected.updateZygotic();
    window.currentlySelected.updateAdoption();
    window.currentlySelected.updateDead();
    window.currentlySelected.updateStillBirth();
    window.currentlySelected.updatePrematureDeath();
    window.currentlySelected.updateUnknownFamilyHistory();
    window.currentlySelected.updateProband();
    window.currentlySelected.updateConsultand();
    window.currentlySelected.updateCarrier();
    window.currentlySelected.updatePregnant();
    window.currentlySelected.updateInfertile();
    window.currentlySelected.updateNoChildren();
    window.currentlySelected.updateDonor();
    window.currentlySelected.updateSurrogate();

}

function deselectSelectedPerson() {
    // save attributes of person
    if(window.currentlySelected != null) {
        
        window.lockDiagnosis = true;
        $('*').blur();
        window.lockDiagnosis = false;

        updateCurrentlySelectedAttributes();

        window.currentlySelected.makeUnselected();

        window.currentlySelected = null;

        clearFields();
    }
    
}

function selectPerson(person) {
    window.currentlySelected = person;
    window.currentlySelected.makeSelected();
    $('#existingDiagnosis option[value=""]').prop("selected",true);
    window.currentlySelected.loadAttributes();
}

function elementToWrapper(element) {
    for(var i=0; i<myPanel.getElementsCount(); ++i) {
        var current = myPanel.getElementAt(i);
        for(var j=0; j<current.getElementsCount(); ++j) {
            if(current.getElementAt(j) === element) {
                return current;
            }
            else if(current.getElementAt(j).dummyShape === element) {
                return current;
            }
            else if(isLineOf(element, current.getElementAt(j)) === true) {
                return current;
            }
        }
    }
    return null;
}

function isLineOf(element, wrapper) {
    try {
        for(var i=0; i<wrapper.getElementsCount(); ++i) {
            var current = wrapper.getElementAt(i);
            if(current === element) {
                return true;
            }
        }
    }
    catch(e) {
        return false;
    }
}

function idToPerson(Id) {
    for(var i=0; i<myPanel.getElementsCount(); ++i) {
        var current = myPanel.getElementAt(i);
        if(current.Id === Id) {
            return current;
        }
    }
    return null;
}


window.colorList = ["blue","green","red","orange","purple","brown","tomato","salmon","palegreen","lawngreen","gold","beige","yellow"];
window.inUse = 0;

function updateLegend(whatToDo, val) {

    if(whatToDo === "push") {
        $("#legendWrapper").append("<p style='margin:0;font-size:150%;color:"+window.colorList[window.inUse]+"' value='"+val+"'>"+val+"</p>");
        window.inUse = (window.inUse+1)%window.colorList.length;
    }
    else {
        $("#legendWrapper p[value='"+val+"']").remove();
    }
}

function updatePeopleColors() {

    // make sure all of the shapes are colored the correct way
    for(var i=0; i<myPanel.getElementsCount(); ++i) {
        var current = myPanel.getElementAt(i);
        if(current.shapeName !== "hyperEdge") {
            current.updateColors();
        }
    }
}

function updateRelationships() {
    // make sure all of the shapes are colored the correct way
    for(var i=0; i<myPanel.getElementsCount(); ++i) {
        var current = myPanel.getElementAt(i);
        if(current.shapeName !== "hyperEdge") {
            current.updateParents();
            current.updateMateKids();
        }
    }

    if(window.currentlySelected != null) {
        window.currentlySelected.loadAttributes();
    }
}


function resizePedigree(newSize) {


    window.outline = newSize/window.shapeSize*window.outline;
    window.shapeSize = newSize;

    if(window.currentlySelected == null) {
        return;
    }

    var tempCurrent = window.currentlySelected;
    deselectSelectedPerson();



    for(var i=0; i<myPanel.getElementsCount(); ++i) {
        var current = myPanel.getElementAt(i);
        try {
            if(current.shapeName !== "dummy" && current.shapeName !== "hyperEdge") {
                current.reLoad1();
            }
        }
        catch(e) {
        }
    }
    for(var i=0; i<myPanel.getElementsCount(); ++i) {
        var current = myPanel.getElementAt(i);
        try {
            if(current.shapeName === "hyperEdge") {
                current.reFit();
            }
        }   
        catch(e) {
        }
    }
    for(var i=0; i<myPanel.getElementsCount(); ++i) {
        var current = myPanel.getElementAt(i);
        try {
            if(current.shapeName !== "dummy" && current.shapeName !== "hyperEdge") {
                current.reLoad2();
            }
        }
        catch(e) {
        }
    }


    selectPerson(tempCurrent);
}





function sendToApp() {
    
    var pedigreeId = $("#pedigreeID").val();
    var ethnicity1 = $("#ethnicity1").val();
    var ethnicity2 = $("#ethnicity2").val();
    var inheritancePattern = $("#inheritancePattern option:selected").text();
    var other = $("#otherPedigreeInfo").val();


    var json = '{"pedigreeId":"'+pedigreeId+'","ethnicity1":"'+ethnicity1+'","ethnicity2":"'+ethnicity2+'","inheritancePattern":"'+inheritancePattern+'","other":"'+other+'"},';
    for(var i=0; i<myPanel.getElementsCount(); ++i) {
        var currentShape = myPanel.getElementAt(i);
        if(currentShape.shapeName === "circle" || currentShape.shapeName === "diamond" || currentShape.shapeName === "square") {
            json += currentShape.toJSON()+",";
        }
    }

    json = json.slice(0, -1);

    // next, send the json object to /save
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", "/save", true);
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send(json);


    window.alert("Saved!");
}







