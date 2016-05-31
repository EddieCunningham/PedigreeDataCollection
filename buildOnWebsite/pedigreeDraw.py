from Tkinter import *
from turtle import *
import turtle
import random
from time import gmtime, strftime
import numpy as np
from pedigreeClasses import *
import collections
import os


def goLeft(distance):
    turtle.setheading(180)
    turtle.forward(distance)
    
def goRight(distance):
    turtle.setheading(0)
    turtle.forward(distance)

def goUp(distance):
    turtle.setheading(90)
    turtle.forward(distance)

def goDown(distance):
    turtle.setheading(270)
    turtle.forward(distance) 
    
def goNorthEast(distance):
    turtle.setheading(45)
    turtle.forward(distance)

def goNorthWest(distance):
    turtle.setheading(135)
    turtle.forward(distance)
    
def goSouthEast(distance):
    turtle.setheading(315)
    turtle.forward(distance)
    
def goSouthWest(distance):
    turtle.setheading(225)
    turtle.forward(distance)

def probString(person):
    if(person.affected == True):
        AD = sum(person.ADtypes[0:3])
        AR = person.ARtypes[0]
        XL = person.XLtypes[0]
        M = person.Mtypes[0]
    else:
        AD = person.ADtypes[3]
        AR = sum(person.ARtypes[1:4])
        if(person.isFemale == True):
            XL = sum(person.XLtypes[1:4])
        else:
            XL = person.XLtypes[1]
        M = person.Mtypes[1]
        
    ans = "AD: "+str(AD)+"\nAR: "+str(AR)+"\nXL: "+str(XL)+"\nM: "+str(M)
    return ans
    
def makeCircle(size, person=None, fill=False):
    origPosition = turtle.pos()
    origHead = turtle.heading()
    
    turtle.penup()
    goDown(size)
    turtle.setheading(0)
    turtle.pendown()
    if(person != None or fill==True):
        if(fill==True or person.affected):
            turtle.begin_fill()
    turtle.circle(size)
    if(person != None or fill==True):
        if(fill==True or person.affected):
            turtle.end_fill()
    turtle.penup()
    turtle.goto(origPosition)
    turtle.setheading(origHead)
    if(person != None or fill==True):
        if(fill==True or person.affected):
            turtle.color('black')
        if(person.multipleNotShown == 0):
            turtle.write(str(person.name())+"\n"+probString(person), align="center")
        else:
            turtle.write(str(person.name())+"\n"+probString(person)+"\n\n"+str(person.multipleNotShown), align="center")
    turtle.color('blue')
    turtle.penup()
    
def makeSquare(size, person=None, fill=False):
    origPosition = turtle.pos()
    origHead = turtle.heading()
    turtle.penup()
    goDown(size)
    if(person != None or fill == True):
        if(fill==True or person.affected):
            turtle.begin_fill()
    turtle.pendown()
    goLeft(size)
    goUp(2*size)
    goRight(2*size)
    goDown(2*size)
    goLeft(size)
    if(person != None or fill==True):
        if(fill==True or person.affected):
            turtle.end_fill()
    turtle.penup()
    turtle.goto(origPosition)
    turtle.setheading(origHead)
    if(person != None or fill==True):
        if(fill==True or person.affected):
            turtle.color('black')
        if(person.multipleNotShown == 0):
            turtle.write(str(person.name())+"\n"+probString(person), align="center")
        else:
            turtle.write(str(person.name())+"\n"+probString(person)+"\n\n"+str(person.multipleNotShown), align="center")
    turtle.color('blue')
    turtle.penup()
    
def makeDiamond(size, person=None, fill=False):
    origPosition = turtle.pos()
    origHead = turtle.heading()
    turtle.penup()
    goDown(size)
    turtle.pendown()
    if(person != None or fill==True):
        if(fill==True or person.affected):
            turtle.begin_fill()
    goNorthEast(2*size/np.sqrt(2))
    goNorthWest(2*size/np.sqrt(2))
    goSouthWest(2*size/np.sqrt(2))
    goSouthEast(2*size/np.sqrt(2))
    if(person != None or fill==True):
        if(fill==True or person.affected):
            turtle.end_fill()
    turtle.penup()
    turtle.goto(origPosition)
    turtle.setheading(origHead)
    if(person != None or fill==True):
        if(fill==True or person.affected):
            turtle.color('black')
        if(person.multipleNotShown == 0):
            turtle.write(str(person.name())+"\n"+probString(person), align="center")
        else:
            turtle.write(str(person.name())+"\n"+probString(person)+"\n\n"+str(person.multipleNotShown), align="center")
    turtle.color('blue')
    turtle.penup()
    
def get_spaced_colors(n):
    max_value = 16581375 #255**3
    interval = int(max_value / n)
    colors = [hex(I)[2:].zfill(6) for I in range(0, max_value, interval)]
    
    return [(int(i[:2], 16), int(i[2:4], 16), int(i[4:], 16)) for i in colors]    
    
def connectFamily(parents, children, size, offset=0, color='blue'):
    origPosition = turtle.pos()
    origHead = turtle.heading()
    oldColor = turtle.pencolor()
    turtle.pencolor(color)
    turtle.penup()
    
    # parents are a tuple of positions for the parents
    # children are a tuple of positions of the children
    # all positions are from the center of each shape
    if(len(parents) == 2):
        # if we have 2 parents
        parentA = parents[0]
        parentB = parents[1]
        # draw horizontal line between parents
        turtle.goto(parentA)

        goDown(offset)        
        
        goRight(size)
        turtle.pendown()
        goRight(parentB[0]-parentA[0]-2*size)
        goLeft((parentB[0]-parentA[0]-2*size)/2 + offset)
        goDown(2*size)
    else:
        # if unaffected mate == True
        parentA = parents[0]
        turtle.goto(parentA)
        goDown(size)
        turtle.pendown()
    
        goDown(offset)

    currentPosition = turtle.pos()

    for child in children:
        horizDist = currentPosition[0] - child[0]
        verticalDist = currentPosition[1] - child[1] - size
        goLeft(horizDist)
        goDown(verticalDist)
        turtle.penup()
        turtle.goto(currentPosition)
        turtle.pendown()            
        
    turtle.penup()    
    turtle.goto(origPosition)
    turtle.setheading(origHead)
    turtle.pencolor(oldColor)
    turtle.up()

def updateDepthsHelper(node, changeTo, alreadyWent):

    if(node in alreadyWent):
        return
    alreadyWent.append(node)
    
    node.generationNumber = changeTo

    for p in node.parents:
        updateDepthsHelper(p, changeTo-1, alreadyWent)
        
    for c in node.children:
        updateDepthsHelper(c, changeTo+1, alreadyWent)
        
            

def updateDepths(pedigree):
    # need to do a BFS of tree.  then if we get inconsistencies, use update
    # depths recursive function to fix mismatched levels

    currentList = pedigree.roots
    tempList = []
    
    # make sure we don't add people more than once
    alreadyAdded = []
    
    while(len(currentList) > 0):
        for p in currentList:
            
            # update this person's depth
            if(p.parents != []):
                p.generationNumber = p.parents[0].generationNumber + 1  
            else:
                p.generationNumber = 1


            # to deal with mismatched levels, check to see if a mate
            # already has an assigned depth.  If they do, 
            # use updateDepths up to increase the mate's side of the
            # tree by difference (this will always be larger because if
            # if wasn't, then we would have already seen it).
            # Also have to go down and update everyone who's number
            # isn't -1!
            for m in p.mates:
                if(m.generationNumber != p.generationNumber and m.generationNumber != -1):
                    
                    # - then we have visited this before and have to 
                    #   update all previous nodes (shift down)
                    # - back traverse on other parent
                    difference = p.generationNumber - m.generationNumber
                    
                    if(difference > 0):
                        alreadyWent = []
                        updateDepthsHelper(m, p.generationNumber, alreadyWent)
                        for m_ in m.mates:
                            if(m_ != p):
                                updateDepthsHelper(m_, p.generationNumber, alreadyWent)
                                
                        for c_ in m.children:
                            updateDepthsHelper(c_, p.generationNumber+1, alreadyWent)
                            
            
            
            # add children to next level search
            for c in p.children:
                if((c not in tempList) and (c not in alreadyAdded)):
                    tempList.append(c)
                    alreadyAdded.append(c)
            
            
        currentList = tempList
        tempList = []
        
def buildLevels(current, levels):
    
    if(current.generationNumber not in levels):
        levels[current.generationNumber] = [current]
    else:
        if(current not in levels[current.generationNumber]):
            levels[current.generationNumber].append(current)
        
    for p in current.children:
        buildLevels(p, levels)
        
def printPedigree(levels, numbEdges):
    
    # work to calculate size and spacing
    width = 500
    height = 500
    
    # figure out where to start
    maxWidth = -1
    for row, people in levels.iteritems():
        if(len(people) > maxWidth):
            maxWidth = len(people)
            
    maxHeight = len(levels)         
    
    size = min(width/float(maxWidth), height/float(maxHeight))
    size /= 5
    
    # reset turtle
    turtle.home()
    turtle.up()
    turtle.speed(1000000)
    turtle.clear()
    turtle.color("blue")
    
    # start at top center
    goUp(height/2)
    

    # sort levels
    sortedLevels = collections.OrderedDict(sorted(levels.items()))
    
    # need to keep track of families also, so keep track of edges 
    # of children in same family in next level.
    # To do this, will have struct that keeps track of parent location and
    # their children edge number
    
    parents = {}
    
    # color the different edges differently
    colormap = {}
    colormode(255)
    differentColors = get_spaced_colors(numbEdges+1)
    colorIndex = 0
    
    
    for key, level in sortedLevels.iteritems():
        
        parentsTemp = {}
        
        # start at left of current height and calculate correct spacing
        goLeft(width/2)
        spacing = width/(float(len(level)+1))
        
        # offset will map parents edge to an offset.
        # this is to make the pedigree readable in case the algorithm 
        # messes up
        offset = {}
        offsetVal = 0
        
        for p in level:
            
            goRight(spacing)
            
            # keep track of current person's children edge
            for edge in p.childrenEdges:
                if(edge not in parentsTemp):
                    parentsTemp[edge] = [turtle.pos()]
                else:
                    parentsTemp[edge].append(turtle.pos())
                
            # actually draw the person
            if(p.isFemale == 1):
                makeCircle(size, p)
            elif(p.isFemale == 0):
                makeSquare(size, p)
            else:
                makeDiamond(size, p)
            
            if(p.parentsEdge not in offset):
                offset[p.parentsEdge] = offsetVal
                offsetVal += 5
                
            if(p.parentsEdge not in colormap):
                colormap[p.parentsEdge] = differentColors[colorIndex]
                colorIndex += 1
                
            # see if there are parents to connect to
            if(p.parentsEdge in parents):
                connectFamily(parents[p.parentsEdge], [turtle.pos()], size, offset=offset[p.parentsEdge], color=colormap[p.parentsEdge])
                
            
        parents = parentsTemp
        
        # reset to center of next col
        goLeft(width/2-spacing)
        goDown(height/(float(len(levels)+1)))
        

def drawPedigree(pedigree, fileName):
    
    # 1 - go through the roots and bfs
    # 2 - update depth at each level
    # 3 - if we get to a depth that was already assigned, 
    #     then have to go up the pedigree to roots of lower
    #     level and update accordingly
    

    updateDepths(pedigree)
        
    # here all people are updated correctly, now need to build levels
    levels = {}
    for p in pedigree.roots:
        buildLevels(p, levels)
        

    #for k,l in levels.iteritems():
    #    for p in l:
    #        print("\n"+p.informativeOutput())
    

    finalLevels = []

    # first order each line by subsets according to
    # parents edge, then within each subset, order them
    # according to the children edges
    for depth, level in levels.iteritems():
        
        finalLevels.append([])
        
        # will hold the nodes according to parents edge.
        # Then will order the subsets by decreasing 
        currentSubsets = {}
        
        for p in level:
            if(p.parentsEdge not in currentSubsets):
                currentSubsets[p.parentsEdge] = [p]
            else:
                currentSubsets[p.parentsEdge].append(p)
                
        # next order elements in each subset by childrens edge
        for k, subset in currentSubsets.iteritems():
            subset.sort(key=lambda x: x.childrenEdges[0])
            
        # now, order the subsets dictionary by parent edge
        # and add the elements to finalLevels
        sortedSubsets = collections.OrderedDict(sorted(currentSubsets.items()))
            
        for k, subset in sortedSubsets.iteritems():
            for p in subset:
                finalLevels[depth-1].append(p)
        
        
                    
    for i, currentLevel in enumerate(finalLevels):
        levels[i+1] = currentLevel


    # actually draw out the pedigree
    # count the number of unique parent edges to color in 
    # edges differently
    parentsEdgeList = []
    for p in pedigree.peopleList:
        if(p.parentsEdge not in parentsEdgeList):
            parentsEdgeList.append(p.parentsEdge)

    printPedigree(levels, len(parentsEdgeList))
    
    # save a photo of the screen
    screenOutput = fileName
    if screenOutput.endswith('.csv'):
        screenOutput = screenOutput[:-4]    
    
    ts = turtle.getscreen()
    path = os.getcwd()+"/"+screenOutput+'_programGenerated.eps'
    ts.getcanvas().postscript(file=path)    
    
    pedigree.saveToCSV(fileName)
    
    #turtle.Screen().bye()





def drawPedigreeTest():
    
    # how to initialize a person
    # (proband, female, affected, unaffected_mate, age, other diagnosis, other, parents edge, [children edges])
    A = [False, 1, False, False, 10, 'none', 'other', 1, [5], 0]    
    B = [False, 2, True, False, 10, 'none', 'other', 2, [5], 0]
    C = [False, 0, False, False, 10, 'none', 'other', 3, [6], 0]
    D = [False, 1, False, False, 10, 'none', 'other', 4, [6], 0]
    E = [False, 1, False, False, 10, 'none', 'other', 5, [7], 0]
    F = [False, 1, False, False, 10, 'none', 'other', 4.5, [7], 0] # <- messed up when labeling graph
    G = [False, 1, False, False, 10, 'none', 'other', 5, [8], 0]
    H = [False, 0, False, False, 10, 'none', 'other', 6, [9], 0]
    I = [False, 0, False, False, 10, 'none', 'other', 6, [10], 0]
    J = [False, 0, False, False, 10, 'none', 'other', 7, [10], 0]
    K = [False, 1, True, False, 10, 'none', 'other', 7, [11], 0]
    L = [False, 2, False, False, 10, 'none', 'other', 7, [12], 0]
    M = [False, 1, False, False, 10, 'none', 'other', 10, [13], 0]
    N = [False, 2, False, False, 10, 'none', 'other', 10, [14], 0]
    O = [False, 1, False, False, 10, 'none', 'other', 10, [15], 0]   
    
    

    personTuple = [A,B,C,D,E,F,G,H,I,J,K,L,M,N,O]
    
    pedigree = Pedigree(personTuple=personTuple)
    
    drawPedigree(pedigree, 'somename.csv')


def testBasicShapesAndConnecting():    
    turtle.home()
    turtle.speed(1000000)
    turtle.clear()
    turtle.color("blue")

    makeCircle(25)
    parentA = turtle.position()
    
    turtle.penup()
    goRight(75)
    turtle.pendown()
    
    makeSquare(25)
    parentB = turtle.position()
    
    turtle.penup()
    goLeft(32.5)
    goDown(100)
    goLeft(32.5)
    turtle.pendown()
    
    makeSquare(25)
    childA = turtle.position()
    
    turtle.penup()
    goRight(75)
    turtle.pendown()
    
    makeDiamond(25)
    childB = turtle.position()
    
    turtle.penup()
    goRight(75)
    goDown(49)
    turtle.pendown()
    makeDiamond(25)
    childC = turtle.position()
    
    connectFamily([parentA, parentB], [childA, childB, childC], 25)


def drawPedigreeFromFile(inFile, outFile):
    
    pedigree = Pedigree(fileName=inFile)
    drawPedigree(pedigree, outFile)

def savePedigreeFromFile(inFile, outFile):
    pedigree = Pedigree(fileName=inFile)
    pedigree.saveToCSV(outFile)










        