from Tkinter import *
from turtle import *
import turtle
import random
from time import gmtime, strftime
import numpy as np
from pedigreeClasses import *
from pedigreeDraw import *
import collections
import scipy
import os
from math import *

# this class is here to not need to deal with fact that turtle grid
# and data grid are indexed differently
class grid:
    def __init__(self):
        # will have an array of what each pixel maps to what 
        # shape.  value will be 0 if not assigned, 
        # or will be the index of personList.
        self.data = np.zeros((turtle.window_height()*2, turtle.window_width()*2))
        
    def __getitem__(self,index):
        x = index[0]+turtle.window_height()/2
        y = turtle.window_width()/2-index[1]
        return self.data[x,y]
        
    def __setitem__(self, index, value):
        x = index[0]+turtle.window_height()/2
        y = turtle.window_width()/2-index[1]
        
        self.data[x,y] = value
        

fileName = ""

# initialize the variables
currentShape = 'Circle'
erase = False
affected = False
size = 20
selectFamily = False
unaffectedMate = False
multipleNotShown = 0

# have a structure of each shape and its corresponding person.
# use a dictionary so we don't have to deal with reordering 
# indices or anything.  will store the person object, and any 
# info needed to calculate which pixels are affected
lastCount = 0
currentEdge = 1
personList = {}

currentFamilyList = []
lastFamilyList = []

pixelGrid = grid()

lastActions = []


def printDetails(lastAction):
    global personList, multipleNotShown
    
    print("\n\n\nLast action - "+str(lastAction))
    print("Last actions: "+str(lastActions))
    print("Current Shape - "+currentShape)
    print("Erase - "+str(erase))
    print("Last Count - "+str(lastCount))
    print("Select family - "+str(selectFamily))
    print("Current family list: ")
    for p in currentFamilyList:
        print(p[0].informativeOutput())
    print("Person list: ")
    for i, p in personList.iteritems():
        #print("i: "+str(i)+" center: "+str(p[1])+" size: "+str(p[2])+" "+str(p[0].idNumber))
        print(p[0].informativeOutput())
    

    
    
    # make this stuff print out on the turtle window in bottom left
    windowPosX = -turtle.window_width()/2+100
    windowPosY = -turtle.window_height()/2+100
    turtle.goto(windowPosX, windowPosY)

    # clear any text that was there before
    drawEraseShape(185)  
    
    turtle.goto(windowPosX-50, windowPosY-50)
    
    
    if(selectFamily == True):
        helpString = "Select family members\n"
        if(unaffectedMate):
            helpString += "\nOnly 1 parent is shown\n"
        helpString += "m: cancel"
        outString = helpString+"\nCurrent family members: \n\n"
        for i,p in enumerate(currentFamilyList):
            
            if(i%10 == 0):
                outString += "\n"
            outString += str(p[0].idNumber)+" "
        
        turtle.write(outString, font=("Arial", 16, "normal"))
       
    else:
        helpString = "Current shape: "+currentShape
        if(affected):
            helpString += "\nAffected = True"
        helpString += "\nHelp:\n"+\
                        "c: draw circle\n"+\
                        "s: draw square\n"+\
                        "d: draw diamond\n"+\
                        "a: draw affected\n"+\
                        "p: select family\n"+\
                        "o: select family with 1 parent shown\n"+\
                        "click: draw person\n"+\
                        "l: save to csv\n"+\
                        "u: undo\n"+\
                        "q: quit\n\n"
        if(multipleNotShown != 0):
            helpString += "multiple not shown: "+str(multipleNotShown)
        turtle.write(helpString, font=("Arial", 14, "normal"))


def setCircle():
    global currentShape
    global lastActions
    lastActions.append('c')
    currentShape = 'Circle'
    

    
    printDetails("c")

def setSquare():
    global currentShape
    global lastActions
    lastActions.append('s')
    currentShape = 'Square'
    
    printDetails("s")

def setDiamond():
    global currentShape
    global lastActions
    lastActions.append('d')
    currentShape = 'Diamond'
    
    printDetails("d")

def quitProgram():
    turtle.Screen().bye()             
    
def eraseFunc():
    global erase
    #global lastActions
    #lastActions.append('e')
    if(erase == True):
        erase = False
    else:
        erase = True
    
    printDetails("e")
    
def affectedFunc():
    global affected
    global lastActions
    lastActions.append('a')
    if(affected == True):
        affected = False
    else:
        affected = True
    
    printDetails("a")
        
def drawEraseShape(size):
    origPosition = turtle.pos()
    origHead = turtle.heading()
    turtle.penup()
    goDown(size)
    turtle.setheading(0)
    turtle.pendown()
    turtle.color('white')
    turtle.begin_fill()     
    goLeft(size)
    goUp(2*size)
    goRight(2*size)
    goDown(2*size)
    goLeft(size)
    turtle.end_fill()
    turtle.penup()
    turtle.goto(origPosition)
    turtle.setheading(origHead)
    turtle.color('blue')
    turtle.penup()
    
def draw(x,y):
    global affected
    turtle.penup()
    turtle.goto(x,y)
    if(erase == True):
        drawEraseShape(size*2)
        updateParams('Erase')
    else:
        adding = updateParams(currentShape)
        if(currentShape == 'Circle'):
            makeCircle(size, person=adding, fill=affected)
        elif(currentShape == 'Square'):
            makeSquare(size, person=adding, fill=affected)
        else:
            makeDiamond(size, person=adding, fill=affected)
            
        
  
    
def updateParams(shape):
    global size, lastCount, affected, personList, multipleNotShown
    lastCount = lastCount+1
    
    if(shape == 'Circle'):
        # will add less than the actual size's radius just
        # so that we can erase cleanly
        center = turtle.pos()
        
        xLow = center[0]-size*0.95
        xHigh = center[0]+size*0.95
        yLow = center[1]-size*0.95
        yHigh = center[1]+size*0.95

        
        for i in range(int(xLow), int(xHigh)):
            for j in range(int(yLow), int(yHigh)):                
                
                pixelGrid[i,j] = lastCount
                
        # now add the female to personDict
        adding = [Person(1, affected, False, False, -1, 'none', 'none', -1, [], multipleNotShown), center, size]
        personList[lastCount] = adding
        
    elif(shape == 'Square'):
        center = turtle.pos()
        
        xLow = center[0]-size*0.95
        xHigh = center[0]+size*0.95
        yLow = center[1]-size*0.95
        yHigh = center[1]+size*0.95

        
        for i in range(int(xLow), int(xHigh)):
            for j in range(int(yLow), int(yHigh)):                
                
                pixelGrid[i,j] = lastCount
                
        # now add the male to personDict
        adding = [Person(0, affected, False, False, -1, 'none', 'none', -1, [], multipleNotShown), center, size]
        personList[lastCount] = adding
    
    elif(shape == 'Diamond'):
        center = turtle.pos()
        
        xLow = center[0]-size*0.95
        xHigh = center[0]+size*0.95
        yLow = center[1]-size*0.95
        yHigh = center[1]+size*0.95

        
        for i in range(int(xLow), int(xHigh)):
            for j in range(int(yLow), int(yHigh)):
                
                pixelGrid[i,j] = lastCount
                
        adding = [Person(2, affected, False, False, -1, 'none', 'none', -1, [], multipleNotShown), center, size]
        personList[lastCount] = adding
        
    return adding[0]
    
def cancelSelect():
    global selectFamily, currentFamilyList, affected, unaffectedMate, multipleNotShown
    global lastActions
    lastActions.append('m')
    selectFamily = False
    unaffectedMate = False
    affected = False
    currentFamilyList = []
    multipleNotShown = 0
    
    printDetails("m")
 
def toggleUnaffectedMate():
    
    global selectFamily, currentFamilyList, size, currentEdge, unaffectedMate, lastFamilyList
    
    global lastActions
    lastActions.append('o')
    
    if(selectFamily == True):
        
        currentEdge += 1

        # sort the family list by y coordinate        
        currentFamilyList = sorted(currentFamilyList, key=lambda x: x[1][1], reverse=True)
    

        parents = [currentFamilyList[0]]
        children = currentFamilyList[1:]
        
        # sort the parents by x coordinate        
        parents = sorted(parents, key=lambda x: x[1][0])
    
        parentsInput = [x[1] for x in parents]
        childrensInput = [x[1] for x in children]
        connectFamily(parentsInput, childrensInput, size)
        
        # now update the edges for each person
        # for the parents, their childrens edge is the current edge
        for p in parents:
            # find the person in the personList dictionary
            pId = p[0].idNumber
            personList[pId][0].childrenEdges.append(currentEdge)
            if(unaffectedMate == True):
                personList[pId][0].unaffectedMate = True
            
            # next update each's children and mates arrays.
            # not really necessary but will make debugging easier
            for c in children:
                personList[pId][0].children.append(personList[c[0].idNumber][0])
                
            for m in parents:
                if(m != p):
                    personList[pId][0].mates.append(personList[m[0].idNumber][0])
            
        # do the same thing for the children
        for c in children:
            pId = c[0].idNumber
            personList[pId][0].parentsEdge = currentEdge
            
            # add parents to each child's structure
            for p in parents:
                personList[pId][0].parents.append(personList[p[0].idNumber][0])
    
    
        lastFamilyList = currentFamilyList
        currentFamilyList = []
        selectFamily = False
        unaffectedMate = False
        
    else:
        selectFamily = True
        unaffectedMate = True
    
    printDetails("o")
    
    
def toggleFamily():     
    global selectFamily, currentFamilyList, size, currentEdge, unaffectedMate, lastFamilyList
    
    global lastActions
    lastActions.append('p')
    
    if(selectFamily == True and unaffectedMate == False):
        
        currentEdge += 1

        # sort the family list by y coordinate        
        currentFamilyList = sorted(currentFamilyList, key=lambda x: x[1][1], reverse=True)
        
        parents = [currentFamilyList[0], currentFamilyList[1]]
        children = currentFamilyList[2:]
        
        
        # sort the parents by x coordinate        
        parents = sorted(parents, key=lambda x: x[1][0])
    
        parentsInput = [x[1] for x in parents]
        childrensInput = [x[1] for x in children]
        connectFamily(parentsInput, childrensInput, size)
        
        # now update the edges for each person
        # for the parents, their childrens edge is the current edge
        for p in parents:
            # find the person in the personList dictionary
            pId = p[0].idNumber
            personList[pId][0].childrenEdges.append(currentEdge)

            
            # next update each's children and mates arrays.
            # not really necessary but will make debugging easier
            for c in children:
                personList[pId][0].children.append(personList[c[0].idNumber][0])
                
            for m in parents:
                if(m != p):
                    personList[pId][0].mates.append(personList[m[0].idNumber][0])
            
        # do the same thing for the children
        for c in children:
            pId = c[0].idNumber
            personList[pId][0].parentsEdge = currentEdge
            
            # add parents to each child's structure
            for p in parents:
                personList[pId][0].parents.append(personList[p[0].idNumber][0])
    
        lastFamilyList = currentFamilyList
        currentFamilyList = []
        selectFamily = False
        
    else:
        selectFamily = True
    
    printDetails("p")
     
def click(x,y):
    global multipleNotShown, affected

    global lastActions
       

    if(selectFamily != True):
        draw(x,y)
        lastActions.append('Click') 
        
    else:
        selectFamilyMember(x,y)
        
    if(multipleNotShown != 0):
        multipleNotShown = 0

    if(affected == True):
        affected = False
        
    printDetails("Click")
    
def personAtCoord(x,y):
    if(pixelGrid[x,y] in personList):
        return personList[pixelGrid[x,y]]
    return -1

def selectFamilyMember(x,y):
    global currentFamilyList
    person = personAtCoord(x,y)
    if(person != -1):
        currentFamilyList.append(person)
        
def saveToCSV():
    global fileName
    # need to make sure that no one has a 
    # parents edge of -1.  assign small decimals to solve.
    # also need to make sure that no children edges is empty   
    totalNeg = 0
    i=1
    for key, p_ in personList.iteritems():
        p = p_[0]
        if(p.parentsEdge == -1):
            totalNeg += 1
        if(len(p.childrenEdges) == 0):
            p.childrenEdges.append(currentEdge+i)
            i+=1
            
          
            
    count = 0
    
    with open(fileName, 'w') as csvfile:
        fieldnames = ['id','proband','female','affected','unaffected_mate', 'age',\
                      'other diagnosis', 'other', 'parents edge', '[children edges]', 'multipleNotShown']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        
        for key, p_ in personList.iteritems():
            p = p_[0]
            if(p.parentsEdge == -1):
                p.parentsEdge = count/float(totalNeg)
                count += 1
                
            writer.writerow({'id':p.idNumber,'proband':p.proband,'female':p.isFemale,\
                      'affected':p.affected,'unaffected_mate':p.unaffectedMate, 'age':p.age,\
                      'other diagnosis':p.otherDiagnoses, 'other':p.other, 'parents edge':p.parentsEdge, \
                      '[children edges]':p.childrenEdges, 'multipleNotShown':p.multipleNotShown})
    
    # save a photo of the screen
    screenOutput = fileName
    if screenOutput.endswith('.csv'):
        screenOutput = screenOutput[:-4]
 
    ts = turtle.getscreen()
    path = os.getcwd()+"/"+screenOutput+'_userGenerated.eps'
    ts.getcanvas().postscript(file=path)
        
    printDetails("saved!")    
    
def changeMultipleNotShown0():
    global multipleNotShown
    global lastActions
    lastActions.append('0')
    multipleNotShown = 0
    printDetails("0")
def changeMultipleNotShown1():
    global multipleNotShown
    global lastActions
    lastActions.append('1')
    multipleNotShown = 1
    printDetails("1")
def changeMultipleNotShown2():
    global multipleNotShown
    global lastActions
    lastActions.append('2')
    multipleNotShown = 2
    printDetails("2")
def changeMultipleNotShown3():
    global multipleNotShown
    global lastActions
    lastActions.append('3')
    multipleNotShown = 3
    printDetails("3")
def changeMultipleNotShown4():
    global multipleNotShown
    global lastActions
    lastActions.append('4')
    multipleNotShown = 4
    printDetails("4")
def changeMultipleNotShown5():
    global multipleNotShown
    global lastActions
    lastActions.append('5')
    multipleNotShown = 5
    printDetails("5")
def changeMultipleNotShown6():
    global multipleNotShown
    global lastActions
    lastActions.append('6')
    multipleNotShown = 6
    printDetails("6")
def changeMultipleNotShown7():
    global multipleNotShown
    global lastActions
    lastActions.append('7')
    multipleNotShown = 7
    printDetails("7")
def changeMultipleNotShown8():
    global multipleNotShown
    global lastActions
    lastActions.append('8')
    multipleNotShown = 8
    printDetails("8")
def changeMultipleNotShown9():
    global multipleNotShown
    global lastActions
    lastActions.append('9')
    multipleNotShown = 9
    printDetails("9")
    
def undo():
    global lastActions, lastFamilyList, size, lastCount, currentEdge
    if(lastActions[-1] == 'p'):

        if(selectFamily == False):
            
            currentEdge -= 1
            # sort the family list by y coordinate        
            lastFamilyList = sorted(lastFamilyList, key=lambda x: x[1][1], reverse=True)
            
            parents = [lastFamilyList[0], lastFamilyList[1]]
            children = lastFamilyList[2:]
            
            
            # sort the parents by x coordinate        
            parents = sorted(parents, key=lambda x: x[1][0])
        
            parentsInput = [x[1] for x in parents]
            childrensInput = [x[1] for x in children]
            connectFamily(parentsInput, childrensInput, size, color='white')
            
            # now update the edges for each person
            # for the parents, their childrens edge is the current edge
            for p in parents:
                # find the person in the personList dictionary
                pId = p[0].idNumber
                personList[pId][0].childrenEdges.pop()
    
                
                # next update each's children and mates arrays.
                # not really necessary but will make debugging easier
                for c in children:
                    personList[pId][0].children.pop()
                    
                for m in parents:
                    if(m != p):
                        personList[pId][0].mates.pop()
                
            # do the same thing for the children
            for c in children:
                pId = c[0].idNumber
                personList[pId][0].parentsEdge = -1
                
                # add parents to each child's structure
                for p in parents:
                    personList[pId][0].parents.pop()
                    
            lastFamilyList = []
                
        else:
            cancelSelect()
    elif(lastActions[-1] == 'c'):
        cancelSelect()
    elif(lastActions[-1] == 's'):
        cancelSelect()
    elif(lastActions[-1] == 'd'):
        cancelSelect()  
    elif(lastActions[-1] == 'a'):
        cancelSelect()
    elif(lastActions[-1] == 'o'):
        # need to check to see if we just finished connecting family
        # in other words, if selectFamily == False
        if(selectFamily == False):
            
            currentEdge -= 1
            
            # need to update personList to remove edges for people in 
            # lastFamilyList and then draw white edges over the other edges
                
            # sort the family list by y coordinate        
            lastFamilyList = sorted(lastFamilyList, key=lambda x: x[1][1], reverse=True)
        
    
            parents = [lastFamilyList[0]]
            children = lastFamilyList[1:]
            
            # sort the parents by x coordinate        
            parents = sorted(parents, key=lambda x: x[1][0])
        
            parentsInput = [x[1] for x in parents]
            childrensInput = [x[1] for x in children]
            connectFamily(parentsInput, childrensInput, size, color='white')
            
            # now update the edges for each person
            # for the parents, their childrens edge is the current edge
            for p in parents:
                # find the person in the personList dictionary
                pId = p[0].idNumber
                personList[pId][0].childrenEdges.pop()
                
                personList[pId][0].unaffectedMate = False
                
                # next update each's children and mates arrays.
                # not really necessary but will make debugging easier
                for c in children:
                    personList[pId][0].children.pop()
                    
                for m in parents:
                    if(m != p):
                        personList[pId][0].mates.pop()
                
            # do the same thing for the children
            for c in children:
                pId = c[0].idNumber
                personList[pId][0].parentsEdge = -1
                
                # add parents to each child's structure
                for p in parents:
                    personList[pId][0].parents.pop()
        
            lastFamilyList = []
            
        else:
            cancelSelect()
            
    elif(lastActions[-1] == 'm'):
        cancelSelect()
    elif(lastActions[-1] == 'Click'):
        
        # will have to see which shape was made last
        # will delete this from the personList
        # will make all values of pixelGrid 0
        
        # get the person and delete from personList
        toDelete = personList[lastCount]
        personList.pop(lastCount, None)
        
        # delete the pixelGrid value
        center = toDelete[1]
        size = toDelete[2]
        
        xLow = center[0]-size
        xHigh = center[0]+size
        yLow = center[1]-size
        yHigh = center[1]+size

        for i in range(int(xLow), int(xHigh)):
            for j in range(int(yLow), int(yHigh)):
                
                pixelGrid[i,j] = 0
                
        lastCount -= 1

        # now draw over the shape
        turtle.penup()
        turtle.goto(center[0], center[1])
        drawEraseShape(size)

    else:
        cancelSelect()
        
    printDetails("u")
    lastActions.pop()
        
        
    
def createPedigree(filename):    

    
    global fileName
    fileName = filename
    
    turtle.setup(width=1000,height=1300)
    turtle.home()
    turtle.up()
    turtle.speed(1000000)
    turtle.clear()
    turtle.color("blue")
    turtle.hideturtle()
    wn = turtle.Screen()
    
    wn.onkey(toggleFamily, 'p')
    wn.onkey(setCircle, 'c')
    wn.onkey(setSquare, 's')
    wn.onkey(setDiamond, 'd')
    wn.onkey(quitProgram, 'q')
    wn.onkey(eraseFunc, 'e')
    wn.onkey(affectedFunc, 'a')
    wn.onkey(saveToCSV, 'l')
    wn.onkey(toggleUnaffectedMate, 'o')
    wn.onkey(cancelSelect, 'm')
    wn.onkey(changeMultipleNotShown0, '0')
    wn.onkey(changeMultipleNotShown1, '1')
    wn.onkey(changeMultipleNotShown2, '2')
    wn.onkey(changeMultipleNotShown3, '3')
    wn.onkey(changeMultipleNotShown4, '4')
    wn.onkey(changeMultipleNotShown5, '5')
    wn.onkey(changeMultipleNotShown6, '6')
    wn.onkey(changeMultipleNotShown7, '7')
    wn.onkey(changeMultipleNotShown8, '8')
    wn.onkey(changeMultipleNotShown9, '9')
    wn.onkey(undo, 'u')
    
    
    wn.onclick(click)
    
    
    
    wn.listen()
    turtle.mainloop()