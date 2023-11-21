# Confirm that JSON fragments work correctly
POST http://localhost:8080/v1/fragments
Content-Type: application/json
[BasicAuth]
test123:test123
{"msg1": "hello", "msg2": "world"}

HTTP/1.1 201

[Captures]
url: header "Location"

GET {{url}}
[BasicAuth]
test123:test123

HTTP/1.1 200
Content-Type: application/json; charset=utf-8
[Asserts]
jsonpath "$.msg1" == "hello"
jsonpath "$.msg2" == "world"
