POST http://localhost:8080/v1/fragments
Content-Type: text/plain
[BasicAuth]
test123:test123
`Hello World!`

HTTP/1.1 201

[Asserts]
# Expect valid location header linking to newly created fragment
header "Location" matches "^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$"
jsonpath "$.status" == "ok"
# Expect fragment id to be a UUID
jsonpath "$.fragment.id" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
# Expect ownerId to be a hex encoded string
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"
# Checks for the existence of certain properties
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.type" == "text/plain"
jsonpath "$.fragment.size" == 12

# capture the location header
[Captures]
url: header "Location"

# 2. Try to get the fragment just posted
GET {{url}}
[BasicAuth]
test123:test123

HTTP/1.1 200
Content-Type: text/plain; charset=utf-8
Content-Length: 12
[Asserts]
body == "Hello World!"
