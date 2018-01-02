# Software-as-a-Service

The task was to produce micro services in a versitle and robust manner. 
As a form of evidence of this, it was additionally required that the 
mirco-services work together to function as a service.

That is why the project is broken down into three parts:

 - Part 1 is the creation of a basic storage service, that allows for the crud 
 operations.
 - Part 2 is a service that acts as a backend for a spreadsheet program. 
 - Part 3 is a combination of the storage service and the spreadsheet backend.

To eliminate duplicating code that would inevertable be used in each part. I 
have separated out many of the functions and actions into required files.

## Evaluation.js - Resolve and Refactor

Resolve aims to identify keys and replace them with there expression values from the storage
module. During this process it is responsible for recording what keys have already been visited,
most importantly, keys that have yet to get a value. This is important when trying to eliminate
circular expressions, as if a chain of expressions try to evaluate another member of its chain
before reaching a mathematical value, no value would ever be able to be determined. Finally it
returns a value for the expression when all key references have been replaced.
Refactor is used to identify if a key refer-
ence exists within a raw snippet of expression.
If found it then splits and stores sections of
the expression so that it is in a format ready
for Resolve to work on the extracted key. If
no key is found it is responsible for informing
resolve and removing from the call stack the
key that created the expression it just eval-
uated as it is known that the key in the call
stack could not be part of a circular definition.
Lets look at an example of a circular ex-
pression to demonstrate there interactions:
In this example you can see that A4 is ref-
erenced twice from two different cells but it is
not apart of any circular reference chain. This
Figure 1: Single Circular
needs to be avoided while the obvious chain of
A6 needs to be identified.
This is a step by step look at the two functions interacting. You will notice that A4 never
appears in the call stack twice.


