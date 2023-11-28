POST http://localhost:8080/v1/fragments
Content-Type: text/plain; charset=utf-8
[BasicAuth]
test123:test123
`Hello S3!`

HTTP/1.1 201

[Captures]
url: header "Location"


GET {{url}}
[BasicAuth]
test123:test123

HTTP/1.1 200
Content-Type: text/plain; charset=utf-8
[Asserts]
body == "Hello S3!"


DELETE {{url}}
[BasicAuth]
test123:test123

HTTP/1.1 200


GET {{url}}
[BasicAuth]
test123:test123

HTTP/1.1 404

