# Health Check Test
GET http://localhost:8080

HTTP/1.1 200
Cache-Control: no-cache

# Extra checks
[Asserts]
# Expect "status": "ok"
jsonpath "$.status" == "ok"
# Expect an author string
jsonpath "$.author" isString
# Expect github url to match github.com
jsonpath "$.githubUrl" matches /^https:\/\/github.com\/.+/
# Expect version to match x.y.z
jsonpath "$.version" matches /^\d+\.\d+\.\d+$/
