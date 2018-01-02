#!/bin/bash

echo 'Testing main Functions'
echo '-----------------------------'
echo 'Create Value Entries'
echo $(curl --write-out %{http_code} -X POST -s -H "Content-Type: application/json" --data "{\"key\":\"A1\", \"value\":\"10\"}" localhost:3001/websheet/value)
echo $(curl -X POST -s -H "Content-Type: application/json" --data "{\"key\":\"A2\", \"value\":\"20\"}" localhost:3001/websheet/value)
echo $(curl -X POST -s -H "Content-Type: application/json" --data "{\"key\":\"A3\", \"value\":\"30\"}" localhost:3001/websheet/value)

echo 'Read Values then Formula'
echo $(curl --write-out %{http_code} -X GET -s localhost:3001/websheet/A1/value)
echo $(curl --write-out %{http_code} -X GET -s localhost:3001/websheet/A2/value)
echo $(curl --write-out %{http_code} -X GET -s localhost:3001/websheet/A3/value)
echo $(curl --write-out %{http_code} -X GET -s localhost:3001/websheet/A1/formula)
echo $(curl --write-out %{http_code} -X GET -s localhost:3001/websheet/A2/formula)
echo $(curl --write-out %{http_code} -X GET -s localhost:3001/websheet/A3/formula)
echo 'Create Formula Entries'
echo $(curl --write-out %{http_code} -X POST -s -H "Content-Type: application/json" --data "{\"key\":\"A4\", \"value\":\"=20*12\"}" localhost:3001/websheet/formula )
echo $(curl --write-out %{http_code} -X POST -s -H "Content-Type: application/json" --data "{\"key\":\"A5\", \"value\":\"=A1*A4\"}" localhost:3001/websheet/formula )
echo $(curl --write-out %{http_code} -X POST -s -H "Content-Type: application/json" --data "{\"key\":\"A6\", \"value\":\"=A5/2\"}" localhost:3001/websheet/formula )

echo 'Read value and foruma entries'
echo $(curl --write-out %{http_code} -X GET -s localhost:3001/websheet/A4/value)
echo $(curl --write-out %{http_code} -X GET -s localhost:3001/websheet/A5/value)
echo $(curl --write-out %{http_code} -X GET -s localhost:3001/websheet/A6/value)
echo $(curl --write-out %{http_code} -X GET -s localhost:3001/websheet/A4/formula)
echo $(curl --write-out %{http_code} -X GET -s localhost:3001/websheet/A5/formula)
echo $(curl --write-out %{http_code} -X GET -s localhost:3001/websheet/A6/formula)

echo 'Edit a formula, see update in value, delete formula, see persisted value'
echo $(curl -X PUT -s -H "Content-Type: application/json" --data "{\"key\":\"A1\", \"value\":\"=100-50\"}" localhost:3001/websheet/A1/formula )
echo $(curl -X GET -s localhost:3001/websheet/A1/value)
echo $(curl --write-out %{http_code} -X DELETE -s localhost:3001/websheet/A1/formula)
echo $(curl -X GET -s localhost:3001/websheet/A1/value)

echo 'Delete all entries'
echo $(curl --write-out %{http_code} -X DELETE -s localhost:3001/websheet/A1/value)
echo $(curl --write-out %{http_code} -X DELETE -s localhost:3001/websheet/A2/value)
echo $(curl --write-out %{http_code} -X DELETE -s localhost:3001/websheet/A3/value)
echo $(curl --write-out %{http_code} -X DELETE -s localhost:3001/websheet/A1/formula)
echo $(curl --write-out %{http_code} -X DELETE -s localhost:3001/websheet/A2/formula)
echo $(curl --write-out %{http_code} -X DELETE -s localhost:3001/websheet/A3/formula)
echo $(curl --write-out %{http_code} -X DELETE -s localhost:3001/websheet/A4/value)
echo $(curl --write-out %{http_code} -X DELETE -s localhost:3001/websheet/A5/value)
echo $(curl --write-out %{http_code} -X DELETE -s localhost:3001/websheet/A6/value)
echo $(curl --write-out %{http_code} -X DELETE -s localhost:3001/websheet/A4/formula)
echo $(curl --write-out %{http_code} -X DELETE -s localhost:3001/websheet/A5/formula)
echo $(curl --write-out %{http_code} -X DELETE -s localhost:3001/websheet/A6/formula)

echo 'Test for circular definitions'
echo '-----------------------------'
echo 'Create Circular expressions'
echo $(curl --write-out %{http_code} -X POST -s -H "Content-Type: application/json" --data "{\"key\":\"B1\", \"value\":\"=B1 + 1\"}" localhost:3001/websheet/formula )
echo $(curl --write-out %{http_code} -X POST -s -H "Content-Type: application/json" --data "{\"key\":\"B2\", \"value\":\"=B3+1\"}" localhost:3001/websheet/formula )
echo $(curl --write-out %{http_code} -X POST -s -H "Content-Type: application/json" --data "{\"key\":\"B3\", \"value\":\"=B2 - 1\"}" localhost:3001/websheet/formula )
echo $(curl --write-out %{http_code} -X POST -s -H "Content-Type: application/json" --data "{\"key\":\"G1\", \"value\":\"=G2 + G3\"}" localhost:3001/websheet/formula )
echo $(curl --write-out %{http_code} -X POST -s -H "Content-Type: application/json" --data "{\"key\":\"G2\", \"value\":\"=5+G5\"}" localhost:3001/websheet/formula )
echo $(curl --write-out %{http_code} -X POST -s -H "Content-Type: application/json" --data "{\"key\":\"G3\", \"value\":\"=G4 + G2\"}" localhost:3001/websheet/formula )
echo $(curl --write-out %{http_code} -X POST -s -H "Content-Type: application/json" --data "{\"key\":\"G4\", \"value\":\"=G2 + G1\"}" localhost:3001/websheet/formula )
echo $(curl --write-out %{http_code} -X POST -s -H "Content-Type: application/json" --data "{\"key\":\"G5\", \"value\":\"=G6\"}" localhost:3001/websheet/formula )
echo $(curl --write-out %{http_code} -X POST -s -H "Content-Type: application/json" --data "{\"key\":\"G6\", \"value\":\"5\"}" localhost:3001/websheet/value )
echo 'Similar to hard circular just adjusted to be non circular'
echo $(curl --write-out %{http_code} -X POST -s -H "Content-Type: application/json" --data "{\"key\":\"C1\", \"value\":\"=C2 + C3\"}" localhost:3001/websheet/formula )
echo $(curl --write-out %{http_code} -X POST -s -H "Content-Type: application/json" --data "{\"key\":\"C2\", \"value\":\"=5+C5\"}" localhost:3001/websheet/formula )
echo $(curl --write-out %{http_code} -X POST -s -H "Content-Type: application/json" --data "{\"key\":\"C3\", \"value\":\"=C4 + C2\"}" localhost:3001/websheet/formula )
echo $(curl --write-out %{http_code} -X POST -s -H "Content-Type: application/json" --data "{\"key\":\"C4\", \"value\":\"=C2 + C6\"}" localhost:3001/websheet/formula )
echo $(curl --write-out %{http_code} -X POST -s -H "Content-Type: application/json" --data "{\"key\":\"C5\", \"value\":\"=C6\"}" localhost:3001/websheet/formula )
echo $(curl --write-out %{http_code} -X POST -s -H "Content-Type: application/json" --data "{\"key\":\"C6\", \"value\":\"5\"}" localhost:3001/websheet/value )

echo 'Read Value of Circular expressions'
echo $(curl --write-out %{http_code} -X GET -s localhost:3001/websheet/B2/value)
echo $(curl --write-out %{http_code} -X GET -s localhost:3001/websheet/C1/value)
echo $(curl --write-out %{http_code} -X GET -s localhost:3001/websheet/G1/value)

echo 'Delete rows'
echo $(curl --write-out %{http_code} -X DELETE -s localhost:3001/websheet/B1/formula)
echo $(curl --write-out %{http_code} -X DELETE -s localhost:3001/websheet/B2/formula)
echo $(curl --write-out %{http_code} -X DELETE -s localhost:3001/websheet/B3/formula)

echo $(curl --write-out %{http_code} -X DELETE -s localhost:3001/websheet/G1/formula)
echo $(curl --write-out %{http_code} -X DELETE -s localhost:3001/websheet/G2/formula)
echo $(curl --write-out %{http_code} -X DELETE -s localhost:3001/websheet/G3/formula)
echo $(curl --write-out %{http_code} -X DELETE -s localhost:3001/websheet/G4/formula)
echo $(curl --write-out %{http_code} -X DELETE -s localhost:3001/websheet/G5/formula)
echo $(curl --write-out %{http_code} -X DELETE -s localhost:3001/websheet/G6/value)

echo $(curl --write-out %{http_code} -X DELETE -s localhost:3001/websheet/C1/formula)
echo $(curl --write-out %{http_code} -X DELETE -s localhost:3001/websheet/C2/formula)
echo $(curl --write-out %{http_code} -X DELETE -s localhost:3001/websheet/C3/formula)
echo $(curl --write-out %{http_code} -X DELETE -s localhost:3001/websheet/C4/formula)
echo $(curl --write-out %{http_code} -X DELETE -s localhost:3001/websheet/C5/formula)
echo $(curl --write-out %{http_code} -X DELETE -s localhost:3001/websheet/C6/value)

echo 'Test Validation'
echo '-----------------------------'
echo $(curl --write-out %{http_code} -X POST -s -H "Content-Type: application/json" --data "{\"key\":\"ZZ1\", \"value\":\"=B1 + 1\"}" localhost:3001/websheet/formula )
echo $(curl --write-out %{http_code} -X POST -s -H "Content-Type: application/json" --data "{\"key\":\"Z1Z1\", \"value\":\"=B1 + 1\"}" localhost:3001/websheet/formula )
echo $(curl --write-out %{http_code} -X POST -s -H "Content-Type: application/json" --data "{\"key\":\"11\", \"value\":\"=B1 + 1\"}" localhost:3001/websheet/formula )
echo $(curl --write-out %{http_code} -X POST -s -H "Content-Type: application/json" --data "{\"key\":\"ZZ\", \"value\":\"=B1 + 1\"}" localhost:3001/websheet/formula )

echo $(curl --write-out %{http_code} -X POST -s -H "Content-Type: application/json" --data "{\"key\":\"Z1\", \"value\":\"=B1B1 + 1\"}" localhost:3001/websheet/formula )
echo $(curl --write-out %{http_code} -X POST -s -H "Content-Type: application/json" --data "{\"key\":\"Z1\", \"value\":\"=B11+ + 1\"}" localhost:3001/websheet/formula )
echo $(curl --write-out %{http_code} -X POST -s -H "Content-Type: application/json" --data "{\"key\":\"Z1\", \"value\":\"B1 + 1\"}" localhost:3001/websheet/formula )
echo $(curl --write-out %{http_code} -X POST -s -H "Content-Type: application/json" --data "{\"key\":\"Z1\", \"value\":\"=B1 ++ 1\"}" localhost:3001/websheet/formula )

echo $(curl --write-out %{http_code} -X POST -s -H "Content-Type: application/json" --data "{\"key\":\"Z1\", \"value\":\"B1B1\"}" localhost:3001/websheet/value )
echo $(curl --write-out %{http_code} -X POST -s -H "Content-Type: application/json" --data "{\"key\":\"Z1\", \"value\":\"=1\"}" localhost:3001/websheet/value )
echo $(curl --write-out %{http_code} -X POST -s -H "Content-Type: application/json" --data "{\"key\":\"Z1\", \"value\":\"A1\"}" localhost:3001/websheet/value )