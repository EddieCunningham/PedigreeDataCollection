import random
from time import gmtime, strftime
import numpy as np
import csv
import ast
#import dill

# current id for identifying nodes
currentID = 1


class Person:

    # has mates, children and parents
    global currentID
    idNumber = None
    isFemale = None
    affected = None
    proband = None
    age = None
    otherDiagnoses = None
    other = None
    parentsEdge = None
    childrenEdges = []
    generationNumber = -1
    unaffectedMate = None
    multipleNotShown = 0

    mates = []
    # only needed for drawing pedigree
    parents = []
    # will organize children by mates.  children edges will also be ordered accordingly
    children = []
    
    # keep track of probabilities of different possibilities of autosomes and chromosomes
    
    #          AA,Aa,aA,aa
    ADtypes = [-1,-1,-1,-1]
    #          aa,aA,Aa,AA
    ARtypes = [-1,-1,-1,-1]
    #         [XX,XX',X'X,X'X'] or [XY,X'Y]
    XLtypes = [-1,-1, -1, -1, -1, -1]
    #         [XX,XX'] or [XY,XY']
    Mtypes =  [-1,-1, -1,-1]
    
    
    def __repr__(self):
        return self.idNumber
        
    def name(self):
        return self.idNumber
        
    def informativeOutput(self):
        answer =  "[id:"+str(self.idNumber)+" mates:["
        for m in self.mates:
            answer = answer + str(m.idNumber) + " "
        
        answer = answer + "] parents:["
        for p in self.parents:
            answer = answer + str(p.idNumber) + " "
        answer = answer + "] chilren:["
    
        for c in self.children:
            answer = answer + str(c.idNumber) + " "
        answer = answer + "] depth:"+str(self.generationNumber)+"]"
        
        return answer

    def __init__(self, female, affected, unaffected_mate, proband, age, otherDiagnoses, other, parentsEdge, childrenEdges, multipleNotShown):
        global currentID

        self.childrenEdges = []
        self.parents = []
        self.children = []
        self.mates = []
        self.generationNumber = -1
        self.isFemale = female
        self.affected = affected
        self.unaffectedMate = unaffected_mate
        self.proband = proband
        self.age = age
        self.otherDiagnoses = otherDiagnoses
        self.other = other
        self.parentsEdge = parentsEdge
        self.childrenEdges = childrenEdges
        self.multipleNotShown = multipleNotShown

        self.idNumber = currentID
        currentID = currentID+1
        

        
# finds the parents that have children edge 'edge'
def findParents(personDictionary, edge):
    first = -1
    second = -1

    for i, p in enumerate(personDictionary):
        if(edge in p.childrenEdges):
            if(first == -1):
                first = i
            else:
                second = i
                break
    return (first, second)

def regularize(probs):
    lowest = 0.02

    total = 0    
    
    for i, p in enumerate(probs):
        if(p == 0):
            probs[i] = lowest
            total += lowest
        else:
            total += p
    
    for i, p in enumerate(probs):
        probs[i] /= total
    
    return probs
    
    

def calcAD(parents, person):
    
    if(parents == []):
        if(person.affected == True):
            return regularize([float(1)/3,float(1)/3,float(1)/3,0])
        else:
            return regularize([0,0,0,1])
    
    [p1,p2,p3,p4] = parents[0].ADtypes
    [q1,q2,q3,q4] = parents[1].ADtypes
    
    if(p1 == -1 or q1 == -1):
        return [-1,-1,-1,-1]
 
    if(parents[0].affected == True and parents[1].affected == True):
        
        r1 = p1*(q1 + q2/2 + q3/2) + p2*(q1/2 + q2/4 + q3/4) + p3*(q1/2 + q2/4 + q3/4)
        r1 /= (p1*(q1+q2+q3)+p2*(q1+q2+q3)+p3*(q1+q2+q3))
        
        r2 = p1*(q2/2 + q3/2) + p2*(q1/2 + q2/2 + q3/2) + p3*(q1/2 + q2/2 + q3/2)
        r2 /= 2*(p1*(q1+q2+q3)+p2*(q1+q2+q3)+p3*(q1+q2+q3))
        
        r3 = p1*(q2/2 + q3/2) + p2*(q1/2 + q2/2 + q3/2) + p3*(q1/2 + q2/2 + q3/2)
        r3 /= 2*(p1*(q1+q2+q3)+p2*(q1+q2+q3)+p3*(q1+q2+q3))
        
        r4 = p2*(q2/4 + q3/4) + p3*(q2/4 + q3/4)
        r4 /= (p1*(q1+q2+q3)+p2*(q1+q2+q3)+p3*(q1+q2+q3))
        
    elif(parents[0].affected == True and parents[1].affected == False):
        
        r1 = 0
        
        r2 = (p1 + p2/2 + p3/2)/(p1+p2+p3)/2
        
        r3 = (p1 + p2/2 + p3/2)/(p1+p2+p3)/2
        
        r4 = (p2/2 + p3/2)/(p1+p2+p3)
        
    elif(parents[0].affected == False and parents[1].affected == True):
        
        r1 = 0
        
        r2 = (q1 + q2/2 + q3/2)/(q1+q2+q3)/2
        
        r3 = (q1 + q2/2 + q3/2)/(q1+q2+q3)/2
        
        r4 = (q2/2 + q3/2)/(q1+q2+q3)
        
    else:
        
        r1 = 0
        r2 = 0
        r3 = 0
        r4 = 1
        
    return regularize([r1,r2,r3,r4])

    
def calcAR(parents, person):
    
    if(parents == []):
        if(person.affected == True):
            return regularize([1,0,0,0])
        else:
            return regularize([0,float(1)/3,float(1)/3,float(1)/3])
    
    [p1,p2,p3,p4] = parents[0].ARtypes
    [q1,q2,q3,q4] = parents[1].ARtypes
    
    if(p1 == -1 or q1 == -1):
        return [-1,-1,-1,-1]
        
    if(parents[0].affected == False and parents[1].affected == False):
        
        r1 = p1*(q1 + q2/2 + q3/2) + p2*(q1/2 + q2/4 + q3/4) + p3*(q1/2 + q2/4 + q3/4)
        r1 /= (p1*(q1+q2+q3)+p2*(q1+q2+q3)+p3*(q1+q2+q3))
        
        r2 = p1*(q2/2 + q3/2) + p2*(q1/2 + q2/2 + q3/2) + p3*(q1/2 + q2/2 + q3/2)
        r2 /= 2*(p1*(q1+q2+q3)+p2*(q1+q2+q3)+p3*(q1+q2+q3))
        
        r3 = p1*(q2/2 + q3/2) + p2*(q1/2 + q2/2 + q3/2) + p3*(q1/2 + q2/2 + q3/2)
        r3 /= 2*(p1*(q1+q2+q3)+p2*(q1+q2+q3)+p3*(q1+q2+q3))
        
        r4 = p2*(q2/4 + q3/4) + p3*(q2/4 + q3/4)
        r4 /= (p1*(q1+q2+q3)+p2*(q1+q2+q3)+p3*(q1+q2+q3))
        
    elif(parents[0].affected == False and parents[1].affected == True):
        
        r1 = 0
        
        r2 = (p1 + p2/2 + p3/2)/(p1+p2+p3)/2
        
        r3 = (p1 + p2/2 + p3/2)/(p1+p2+p3)/2
        
        r4 = (p2/2 + p3/2)/(p1+p2+p3)
        
    elif(parents[0].affected == True and parents[1].affected == False):
        
        r1 = 0
        
        r2 = (q1 + q2/2 + q3/2)/(q1+q2+q3)/2
        
        r3 = (q1 + q2/2 + q3/2)/(q1+q2+q3)/2
        
        r4 = (q2/2 + q3/2)/(q1+q2+q3)
        
    else:
        
        r1 = 0
        r2 = 0
        r3 = 0
        r4 = 1
    
    return regularize([r1,r2,r3,r4])
    
   
def calcXL(parents, person):
    
    if(parents == []):
        # here we will assume equal probabilities of all things happening
        if(person.isFemale == True):
            if(person.affected == True):
                return regularize([1,0,0,0])
            else:
                return regularize([0,float(1)/3,float(1)/3,float(1)/3])
        else:
            if(person.affected == True):
                return regularize([1,0])
            else:
                return regularize([0,1])
    
    if(parents[0].isFemale == True):
        [f1,f2,f3,f4] = parents[0].XLtypes
        [m1,m2] = parents[1].XLtypes
        fAffected = parents[0].affected
        mAffected = parents[1].affected
    else:
        [f1,f2,f3,f4] = parents[1].XLtypes
        [m1,m2] = parents[0].XLtypes
        fAffected = parents[1].affected
        mAffected = parents[0].affected

    
    if(f1 == -1 or m1 == -1):
        if(person.isFemale == True):
            return [-1,-1,-1,-1]
        else:
            return [-1,-1] 
            
    if(fAffected == True and mAffected == True):
        
        if(person.isFemale == True):
            a1 = 1
            a2 = 0
            a3 = 0
            a4 = 0
        else:
            b1 = 1
            b2 = 0
    
    elif(fAffected == False and mAffected == True):
        
        if(person.isFemale == True):
            a1 = (f2/4 + f3/4)/(f2/2+f3/2+f4/2)
            a2 = (f2/4 + f3/4 + f4/2)/(f2/2+f3/2+f4/2)/2
            a3 = (f2/4 + f3/4 + f4/2)/(f2/2+f3/2+f4/2)/2
            a4 = 0
        else:
            b1 = (f2/4 + f3/4)/(f2/2+f3/2+f4/2)
            b2 = (f2/4 + f3/4 + f4/2)/(f2/2+f3/2+f4/2)
            
    elif(fAffected == False and mAffected == False):
        
        if(person.isFemale == True):
            a1 = 0
            a2 = (f2/4 + f3/4)/(f2/2+f3/2+f4/2)/2
            a3 = (f2/4 + f3/4)/(f2/2+f3/2+f4/2)/2
            a4 = (f2/4 + f3/4 + f4/2)/(f2/2+f3/2+f4/2)
        else:
            b1 = (f2/4 + f3/4)/(f2/2+f3/2+f4/2)
            b2 = (f2/4 + f3/4 + f4/2)/(f2/2+f3/2+f4/2)
            
    else:
        
        if(person.isFemale == True):
            a1 = 0
            a2 = 0.5
            a3 = 0.5
            a4 = 0
        else:
            b1 = 1
            b2 = 0
            
    if(person.isFemale == True):
        return regularize([a1,a2,a3,a4])
    return regularize([b1,b2])
            
        
def calcM(parents, person):
    
    if(parents == []):
        # here we will assume equal probabilities of all things happening
        if(person.affected == True):
            return regularize([1,0])
        else:
            return regularize([0,1])
    
    if(parents[0].isFemale == True):
        [f1,f2,f3,f4] = parents[0].XLtypes
        [m1,m2] = parents[1].XLtypes
        fAffected = parents[0].affected
        mAffected = parents[1].affected
    else:
        [f1,f2,f3,f4] = parents[1].XLtypes
        [m1,m2] = parents[0].XLtypes
        fAffected = parents[1].affected
        mAffected = parents[0].affected

    
    if(f1 == -1 or m1 == -1):
        if(person.isFemale == True):
            return [-1,-1,-1,-1]
        else:
            return [-1,-1] 
            
    if(fAffected == True and mAffected == True):
        
        if(person.isFemale == True):
            a1 = 1
            a2 = 0
        else:
            b1 = 1
            b2 = 0
    
    elif(fAffected == True and mAffected == False):
        
        if(person.isFemale == True):
            a1 = 1
            a2 = 0
        else:
            b1 = 1
            b2 = 0
            
    elif(fAffected == False and mAffected == True):
        
        if(person.isFemale == True):
            a1 = 0
            a2 = 1
        else:
            b1 = 0
            b2 = 1
            
    else:
        
        if(person.isFemale == True):
            a1 = 0
            a2 = 1
        else:
            b1 = 0
            b2 = 1

    if(person.isFemale == True):
        return regularize([a1,a2])
    return regularize([b1,b2])

class Pedigree:

    roots = []
    
    # for the moment, the data matrix will only 
    # store data about the structure of the pedigree
    # -> this is the pedigree adjacency matrix
    dataMatrix = np.zeros((0,0))
    idToRow = {}
    edgeToCol = {}
    
    peopleList = []
    
    
    
    def updateDataMatrix(self, personID, parentsEdge, childrenEdges):
        # each call to this function will add a new row in the 
        # data matrix wil columns at each parents edge and
        # childrenEdges filled in.  
        # each new value encountered will be a new column
        # to deal with weird numbering of columns, will have a mapper
        # to map an edge to column.
        # will also have a mapper from personID to row
        self.idToRow[personID] = self.dataMatrix.shape[0]
        
        # same number of cols as dataMatrix
        newRow = np.zeros((1,self.dataMatrix.shape[1]))
        self.dataMatrix = np.vstack([self.dataMatrix, newRow])
        
        if(parentsEdge not in self.edgeToCol):
            
            # then add a col to the matrix and put parentsEdge in
            # edgeToCol dictionary.
            # make a new column of same size
            newCol = np.zeros((self.dataMatrix.shape[0],1))
            # mark that the row we just added has this edge
            newCol[-1,0] = 1
            # append it to the dataMatrix
            self.dataMatrix = np.hstack([self.dataMatrix, newCol])
            # update that this edge corresponds to the current
            # last col in the dataMatrix
            self.edgeToCol[parentsEdge] = self.dataMatrix.shape[1]-1
        else:
            
            # col is already in matrix, so just set that index to 0
            self.dataMatrix[-1,self.edgeToCol[parentsEdge]] = 1
            
            
        for childEdge in childrenEdges:
            # do the same thing for each childEdge
            if(childEdge not in self.edgeToCol):
                newCol = np.zeros((self.dataMatrix.shape[0],1))
                newCol[-1,0] = 1
                self.dataMatrix = np.hstack([self.dataMatrix, newCol])
                self.edgeToCol[childEdge] = self.dataMatrix.shape[1]-1
            else:
                self.dataMatrix[-1,self.edgeToCol[childEdge]] = 1

        
    def buildFromInput2(self, personTuple):
        #                           0       1         2      3         4
        # person tuple will be: (proband, female, affected, age, other diagnosis, 
        #                          5          6                     7                    8             9
        #                        other, [parent ids], [[mate id, [children ids]], multipleNotShown, thisID)
        personDictionary = []
        
        self.peopleList = []
        self.dataMatrix = np.zeros((0,0))
        self.idToRow = {}
        self.edgeToCol = {}
        
        # this will map a person id to [parents edge, [mate id, children edge]]
        peopleDict = {}
        currentEdge = 1      
        
        largestIdValue = len(personTuple)
        
        for personEncoding in personTuple:
            
            # parse the input data
            proband = personEncoding[0]
            female = personEncoding[1]
            affected = personEncoding[2]
            age = personEncoding[3]
            otherDiagnoses = personEncoding[4]
            other = personEncoding[5]
            parents = personEncoding[6]
            # mate as -1 means unaffected mate
            mateAndChildren = personEncoding[7]
            multipleNotShown = int(personEncoding[8])
            currentId = int(personEncoding[9])
            
            # if we have a mate not shown or a child not shown, will deal
            # with this right now   
            for m in mateAndChildren:
                if(m[0] == -1):
                    
            
            
            # need to determine what the current person's parent and childrens edges are.
            # because we know who the parents are, will assign the edges based on that.
            # will also have to add children edges for each of the parents
            
            currentParentsEdge = -1
            currentChildrensEdge = -1
            
            # first check to see if parents already have a childrens edge
            if(len(parents) > 0 and (parents[0] in personDictionary and parents[1] in personDictionary)):
                
                # finds common childrens edge that parents have
                intersection = [filter(lambda x: x[1] in personDictionary[parents[0]][1], sublist) for sublist in personDictionary[parents[1]][1]]
                                    
                if(len(intersection) > 0):   
                    currentParentsEdge = intersection[0]

                    
            # next check to see if childrens edge is already assigned
            if(currentId in personDictionary):
                matesList = personDictionary[currentId][1]
                
                # finds the childrens edges that have already been assigned
                intersection = [filter(lambda x: x[0] in matesList, sublist) for sublist in mateAndChildren[0]]
                
         
                
                
                
            
            currentPerson = Person(female, affected, unaffected_mate, proband, age, otherDiagnoses, other, [], [], multipleNotShown)
            
            
            
            # first parent edge.  for this, will have to see 
            
        
        
    

    def buildPedigreeFromInput(self, personTuple):
        # will pass in a tuple of people encodings  
        # (proband, female, affected, unaffected_mate, age, other diagnosis, other, parents edge, [children edges], multipleNotShown)

        # need to keep track of who has certain parent edges and children edges.
        # a person with a parent edge of X is the child of a person with a children edge of X

        # 2 people with smallest parents edges with same children edges are mates

        # just make a temporary dictionary to make it easier to code up relationships using parents and children edges
        personDictionary = []
        
        self.peopleList = []
        self.dataMatrix = np.zeros((0,0))
        self.idToRow = {}
        self.edgeToCol = {}
    

        for personEncoding in personTuple:
            
            # parse the input data
            proband = personEncoding[0]
            female = personEncoding[1]
            affected = personEncoding[2]
            unaffected_mate = personEncoding[3]
            age = personEncoding[4]
            otherDiagnoses = personEncoding[5]
            other = personEncoding[6]
            parentsEdge = personEncoding[7]
            childrenEdges = personEncoding[8]
            multipleNotShown = int(personEncoding[9])

            currentPerson = Person(female, affected, unaffected_mate, proband, age, otherDiagnoses, other, parentsEdge, childrenEdges, multipleNotShown)

            addingList = []

            if(multipleNotShown != 0):
                # this means that there is a shape with a number.  will have 
                # -1 if we have n (will try using different vals).  Make this
                # many new people
                if(multipleNotShown == -1):
                    multipleNotShown = 2
                
                # childrens edge will be larger than currentPerson's
                offset = 1/float(multipleNotShown+1)
                for n in range(multipleNotShown):
                    
                    newChildrenEdges = [x+offset for x in childrenEdges]
                    adding = Person(female, affected, unaffected_mate, proband, age, otherDiagnoses, other, parentsEdge, newChildrenEdges, 0)
                    addingList.append(adding)
                    
                    # add the new people to the data structures                    
                    #self.updateDataMatrix(adding.idNumber, parentsEdge, newChildrenEdges) 
                    self.peopleList.append(adding) 
                    
                    offset += 1/float(multipleNotShown+1)

                    """
                    #---------------------

                    UNAFFECTED MATE ISN'T CORRECT.  WHAT IF WE HAVE A PERSON WHO HAD 2 MATES AND ONE IS SHOWN AND ONE ISNT?
                    OR WHAT IF BOTH ARENT SHOWN?  MAKE UNAFFECTED MATE AND INTEGER AND HAVE ORDER OF CHILDRENEDGES MATTER!!!

                    #---------------------
                    """




            # if this person has a mate that isn't shown, just make one
            if(unaffected_mate == 1):
                gender = {1:0.0,0:1.0,2:2.0}
                mate = Person(gender[female], False, False, False, -1.0, '', '', -1, childrenEdges, 0)
                currentPerson.mates.append(mate)
                # add to the root for consistency
                self.roots.append(mate)
                
                #self.updateDataMatrix(mate.idNumber, -1, childrenEdges) 
                self.peopleList.append(mate) 
                
                personDictionary.append(mate)
                
            # update the data matrix here
            #self.updateDataMatrix(currentPerson.idNumber, parentsEdge, childrenEdges) 
            self.peopleList.append(currentPerson)               
                
            parents = findParents(personDictionary, parentsEdge)

            if(parents == (-1,-1)):
                # this is a root person
                self.roots.append(currentPerson)
                
                for p in addingList:
                    self.roots.append(p)
            else:
                
                # add this person's parents to his/her structure
                currentPerson.parents = [personDictionary[parents[0]], personDictionary[parents[1]]]
                
                # make sure that these parents are marked as mates
                if(personDictionary[parents[0]] not in personDictionary[parents[1]].mates):
                    personDictionary[parents[1]].mates.append(personDictionary[parents[0]])

                if(personDictionary[parents[1]] not in personDictionary[parents[0]].mates):
                    personDictionary[parents[0]].mates.append(personDictionary[parents[1]])
                    
                personDictionary[parents[0]].children.append(currentPerson)
                personDictionary[parents[1]].children.append(currentPerson)
                
                for p in addingList:
                    p.parents = [personDictionary[parents[0]], personDictionary[parents[1]]]
                    personDictionary[parents[0]].children.append(p)
                    personDictionary[parents[1]].children.append(p)
                
            personDictionary.append(currentPerson)
            for p in addingList:
                personDictionary.append(p)
                
        self.updateProbabilities()
        
        
    def updateProbabilities(self):

        ADTotal = 1
        ARTotal = 1
        XLTotal = 1
        MTotal = 1

        currentList = self.roots

        while(len(currentList) > 0):
            
            tempList = []
            
            for p in currentList:
                
                if(p.parents == [] or (p.parents[0].ADtypes[0] != -1 and p.parents[1].ADtypes[0] != -1)):                
                
                    if(p.ADtypes[0] == -1):
                        p.ADtypes = calcAD(p.parents, p)
                        
                        if(p.affected == True):
                            ADTotal *= (p.ADtypes[0]+p.ADtypes[1]+p.ADtypes[2])
                        else:
                            ADTotal *= p.ADtypes[3]
                        
                    if(p.ARtypes[0] == -1):
                        p.ARtypes = calcAR(p.parents, p)
                        
                        if(p.affected == True):
                            ARTotal *= (p.ARtypes[0]+p.ARtypes[1]+p.ARtypes[2])
                        else:
                            ARTotal *= p.ARtypes[3]
                            
                    if(p.XLtypes[0] == -1):
                        p.XLtypes = calcXL(p.parents, p)
                        
                        if(p.affected == True):
                            XLTotal *= p.XLtypes[0]
                        else:
                            if(p.isFemale == True):
                                XLTotal *= (p.XLtypes[1]+p.XLtypes[2]+p.XLtypes[3])
                            else:
                                XLTotal *= p.XLtypes[1]
                            
                    if(p.Mtypes[0] == -1):
                        p.Mtypes = calcM(p.parents, p)
                        
                        if(p.affected == True):
                            MTotal *= p.Mtypes[0]
                            
                        else:
                            MTotal *= p.Mtypes[1]
                        
                        
                    for c in p.children:
                        tempList.append(c)
                    
            currentList = tempList
            
        print("AD: "+str(ADTotal))
        print("AR: "+str(ARTotal))
        print("XL: "+str(XLTotal))
        print("M: "+str(MTotal))

                


    def buildFromCSV(self, fileName):
        personTuple = []
        boolMapper = {'True':True, 'False':False}
        with open(fileName) as csvfile:
            reader = csv.DictReader(csvfile)
            
            for row in reader:
                temp = []
                temp.append(boolMapper[row['proband']])
                temp.append(float(row['female']))
                temp.append(boolMapper[row['affected']])
                temp.append(boolMapper[row['unaffected_mate']])
                temp.append(float(row['age']))
                temp.append(row['other diagnosis'])
                temp.append(row['other'])
                temp.append(float(row['parents edge']))
                
                x = row['[children edges]']
                x = ast.literal_eval(x)
                x = [float(n) for n in x]
                temp.append(x)
                
                temp.append(float(row['multipleNotShown']))                
                
                personTuple.append(temp)
                
                
                
                
        self.buildPedigreeFromInput(personTuple)
            
            
    # (proband, female, affected, unaffected_mate, age, other diagnosis, other, parents edge, [children edges])
    def saveToCSV(self, fileName):
        
        # build the dataMatrix here
        for p in self.peopleList:
            self.updateDataMatrix(p.idNumber, p.parentsEdge, p.childrenEdges)
                
        with open(fileName, 'w') as csvfile:
            fieldnames = ['id','proband','female','affected','unaffected_mate', 'age',\
                          'other diagnosis', 'other', 'parents edge', '[children edges]']
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            
            for p in self.peopleList:
                writer.writerow({'id':p.idNumber,'proband':p.proband,'female':p.isFemale,\
                          'affected':p.affected,'unaffected_mate':p.unaffectedMate, 'age':p.age,\
                          'other diagnosis':p.otherDiagnoses, 'other':p.other, 'parents edge':p.parentsEdge, \
                          '[children edges]':p.childrenEdges})
                
        #dill.dump(self, open(fileName[:-4]+".dill", 'w'))
    
    
                
    def __init__(self, personTuple=None, fileName=None, personTuple2=None):
        if(personTuple is not None):
            self.buildPedigreeFromInput(personTuple)
        elif(fileName is not None):
            self.buildFromCSV(fileName)
        elif(personTuple2 is not None):
            self.buildFromInput2(personTuple2)
        else:
            print("NEED TO SPECIFY INPUT")
        


#                           0       1         2      3         4
# person tuple will be: (proband, female, affected, age, other diagnosis, 
#                          5          6                     7                    8             9
#                        other, [parent ids], [[mate id, [children ids]], multipleNotShown, thisID)

def test():
    
    #     0,1,2, 3, 4,  5,   6    ,    7     , 8, 9
    p1 = [0,0,0,-1,'', '', [     ], [2,[5,6]], 0, 1] 
    p2 = [0,1,0,-1,'', '', [     ], [1,[5,6]], 0, 2] 
    p3 = [0,1,0,-1,'', '', [     ], [4,[8]  ], 0, 3] 
    p4 = [0,0,0,-1,'', '', [     ], [2,[5,6]], 0, 4] 
    p5 = [0,1,1,-1,'', '', [ 1,2 ], [2,[5,6]], 0, 5] 
    p6 = [0,1,0,-1,'', '', [ 1,2 ], [2,[5,6]], 0, 6] 
    p7 = [0,0,0,-1,'', '', [     ], [2,[5,6]], 0, 7] 
    p8 = [0,0,0,-1,'', '', [ 3,4 ], [2,[5,6]], 0, 8] 
    p9 = [0,2,0,-1,'', '', [ 4,5 ], [2,[5,6]], 0, 9] 
    p10= [0,0,0,-1,'', '', [ 4,5 ], [2,[5,6]], 0, 10] 
    p11= [0,1,1,-1,'', '', [ 6,7 ], [2,[5,6]], 0, 11] 
    p12= [0,0,0,-1,'', '', [     ], [2,[5,6]], 0, 12] 
    p13= [0,1,0,-1,'', '', [  9  ], [2,[5,6]], 0, 13] 
    p14= [0,0,1,-1,'', '', [  9  ], [2,[5,6]], 0, 14] 
    p15= [0,1,0,-1,'', '', [10,11], [2,[5,6]], 0, 15] 
    p16= [1,1,0,-1,'', '', [11,12], [2,[5,6]], 0, 16] 
    p17= [0,0,0,-1,'', '', [11,12], [2,[5,6]], 0, 17] 
    p18= [0,2,0,-1,'', '', [  12 ], [2,[5,6]], 0, 18] 
    p19= [0,0,0,-1,'', '', [  15 ], [2,[5,6]], 0, 19]
    

    ped = Pedigree(personTuple2=[p1,p2,p3,p4,p5,p6,p7,p8,p9])



test()