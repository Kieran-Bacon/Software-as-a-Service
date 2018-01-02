#!/bin/bash
echo 'Read a none existant place'
echo $(curl --write-out %{http_code} -X GET -s localhost:3000/part1/A1/)
echo 'Create Value Entries'
echo $(curl  --write-out %{http_code} -X POST -s -H "Content-Type: application/json" --data "{\"key\":\"A1\", \"value\":\"10\"}" localhost:3000/part1/)
echo ' Read value'
echo $(curl  --write-out %{http_code} -X GET -s localhost:3000/part1/A1/)
echo 'update'
echo $(curl --write-out %{http_code} -X PUT -s -H "Content-Type: application/json" --data "{\"key\":\"A1\", \"value\":\"234\"}" localhost:3000/part1/A1)
echo ' Read value'
echo $(curl --write-out %{http_code} -X GET -s localhost:3000/part1/A1/)
echo 'delete'
echo $(curl --write-out %{http_code} -X DELETE -s localhost:3000/part1/A1/)