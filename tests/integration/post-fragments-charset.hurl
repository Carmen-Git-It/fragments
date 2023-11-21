POST http://localhost:8080/v1/fragments
Content-Type: text/plain; charset=utf-8
[BasicAuth]
test123:test123
`Hello World!`

HTTP/1.1 201
[Asserts]
jsonpath "$.fragment.type" == "text/plain; charset=utf-8"

[Captures]
url: header "Location"

GET {{url}}
[BasicAuth]
test123:test123

HTTP/1.1 200
Content-Type: text/plain; charset=utf-8
Content-Length: 12
[Asserts]
body == "Hello World!"
