POST http://localhost:8080/v1/fragments
Content-Type: application/json
[BasicAuth]
test123:test123
{"service": "DynamoDB"}

HTTP/1.1 201

[Captures]
fragment1_url: header "Location"
fragment1_id: jsonpath "$.fragment.id"


GET {{fragment1_url}}/info
[BasicAuth]
test123:test123

HTTP/1.1 200
Content-Type: application/json; charset=utf-8
[Asserts]
jsonpath "$.size" == 23
jsonpath "$.type" == "application/json"
jsonpath "$.id" == {{fragment1_id}}


POST http://localhost:8080/v1/fragments
Content-Type: text/markdown
[BasicAuth]
test123:test123
`DynamoDB is **great**.`

HTTP/1.1 201

[Captures]
fragment2_url: header "Location"
fragment2_id: jsonpath "$.fragment.id"

GET {{fragment2_url}}/info
[BasicAuth]
test123:test123

HTTP/1.1 200
Content-Type: application/json; charset=utf-8
[Asserts]
jsonpath "$.size" == 22
jsonpath "$.type" == "text/markdown"
jsonpath "$.id" == {{fragment2_id}}


GET http://localhost:8080/v1/fragments
[BasicAuth]
test123:test123

HTTP/1.1 200
[Asserts]
jsonpath "$.fragments" includes {{fragment1_id}}
jsonpath "$.fragments" includes {{fragment2_id}}


