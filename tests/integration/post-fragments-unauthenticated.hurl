# Confirm that unauthenticated POSTs return a 401
POST http://localhost:8080/v1/fragments
Content-Type: text/plain
`Hello World!`

HTTP/1.1 401
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 401
jsonpath "$.error.message" isString
