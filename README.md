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

## Evaluation.js - Functions Resolve and Refactor

The functions resolve and refactor are recursive and aim to simplify a cells function into a mathematically correct statement and evaluate it. Recursion is begun by passing a single cell key to resolve, resolve then looks up the cell function and sets it as its initial expression. Refactor is then called to identify the next leading cell key within the expression. Refactor identifies the sections of the expression that are guaranteed/complete, the key, and the unprocessed sections of the expression (lhs, key, rhs). This information is then provided to resolve who forms a new expression by concatenating the completed sections with the new key's function and the unprocessed snippets from the first expression.

This method ensures cell evaluation is conducted in a depth-first manner and is vital for ensuring that circular definitions do not appear. During the back and forth between resolve and refactor, a cell key stack is formed that indicates which keys we are still in the process of evaluating. Whenever a true value is reached (one within a key present), the key responsible for the value is removed from the stack. This shall always be the key on the top of the stack.

Circular definitions are then identified when resolve attempts to begin processing of a key already present in the call stack.

![Example of circular expression](https://github.com/Kieran-Bacon/Software-as-a-Service.git/imgs/example.png)


