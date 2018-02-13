# Software-as-a-Service

This repository describes a backend service for the storage, evaluation, and return of web-based spreadsheet's cells. The service is the combination of two services, a storage service for key-value pairs, and an evaluation service.

Part 1 is the storage service using the mongoDB client. Key value pairs are stored.
Part 2 is a self-contained evaluation and storage service. Storage of cell's value/formula is necessary for the evaluation phases as they reference them.
Part 3 separates out part 2 into the two specific microservices (or at least uncouples part 1). The evaluation service communicates through a standard API to an arbitrary storage unit which happens to be the storage unit of part 1.

I have put lots of emphasis on code reuse as these sections overlap heavily. I have separated out many of the functions and actions into required files to allow for reuse in multiple parts.

## Evaluation.js - Functions Resolve and Refactor

The functions resolve and refactor are recursive and aim to simplify a cells function into a mathematically correct statement and evaluate it. Recursion is begun by passing a single cell key to resolve, which then looks up the cell function and sets it as its initial expression. Refactor is then called to identify the next leading cell key within the expression. Refactor identifies the sections of the expression that are guaranteed/complete, the key, and the unprocessed sections of the expression (lhs, key, rhs). This information is then provided to resolve who forms a new expression by concatenating the completed sections with the new key's function and the unprocessed snippets from the previous expression.

This method ensures cell evaluation is conducted in a depth-first manner and is vital for ensuring that circular definitions do not appear. During the back and forth between resolve and refactor, a cell key stack is formed that indicates which keys we are still in the process of evaluating. Whenever a true value is reached (one without a key present), the key responsible for the value is removed from the stack. This shall always be the key on the top of the stack.

Circular definitions are then identified when resolve attempts to begin processing of a key already present in the call stack.

![Example of circular expression](/imgs/example.png)

Here is the output of this system as an example:
 - 1: ’’------A1------[ ]------[ ]Expand Key and add to callstack
 - 2: ’’------A2 + A3------[ ]------[ A1 ] Left of first key complete, right of first key unprocessed
 - 1: ’(’------A2------[ ’)+A3’ ]------[ A1 ] Expand Key and add to callstack
 - 2: ’(’------A4*2------[ ’)+A3’ ]------[ A1, A2 ] Left of first key complete, right of first key unprocessed
 - 1: ’((’------A4------[ ’)+A3’ , ’)*2’ ]------[ A1, A2 ] Expand Key and add to callstack
 - 2: ’((’------5------[ ’)+A3’ , ’)*2’]------[ A1, A2, A4 ] Value found, add to complete, pop from callstack
 - 1: ’((5’------null ------[’)+A3’,’)*2’]------[A1, A2] Null key found, pop from unprocessed
 - 2: ’((5’------)*2------[’)+A3’]------[A1, A2] Value found, add to complete, pop from callstack
 - 1: ’((5)*2’------null------[’)+A3’]------[A1] Null key found, pop from unprocessed
 - 2: ’((5)*2’------)+A3------[ ]------[A1] Left of first key complete, right of first key unprocessed
 - 1: ’((5)*2)+(’------A3------[ ’)’ ]------[A1] Expand Key and add to callstack
 - 2: ’((5)*2)+(’------A4 + A6 + A7------[ ’)’ ]------[A1, A3] Left of first key complete, right of first key unprocessed
 - 1: ’((5)*2)+((’------A4------[ ’)’, ’) + A6 + A7’ ]------[A1, A3] Expand Key and add to callstack
 - 2: ’((5)*2)+((’------5------[ ’)’, ’) + A6 + A7’ ]------[A1, A3, A4] Value found, add to complete, pop from callstack
 - 1: ’((5)*2)+((5’------null------[ ’)’, ’) + A6 + A7’ ]------[A1, A3] Null key found, pop from unprocessed
 - 2: ’((5)*2)+((5’------) + A6 + A7------[ ’)’ ]------[A1, A3] Left of first key complete, right of first key unprocessed
 - 1: ’((5)*2)+((5)+’------A6------[ ’)’, ’+ A7’ ]------[A1, A3] Expand Key and add to callstack
 - 2: ’((5)*2)+((5)+’------A1 - 3------[ ’)’, ’+ A7’ ]------[A1, A3] Left of first key complete, right of first key unprocessed
 - 1: ’((5)*2)+((5)+’------A1------[ ’)’, ’+ A7’, ’-3’ ]------[A1, A3] ERROR ADDING A1 TO CALLSTACK circular definition.

