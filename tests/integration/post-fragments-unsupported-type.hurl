# test authenticated post with an invalid filetype 
POST http://localhost:8080/v1/fragments
Content-Type: audio/mpeg
[BasicAuth]
test123:test123
`Hello World!`

HTTP/1.1 415

[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 415
jsonpath "$.error.message" isString
