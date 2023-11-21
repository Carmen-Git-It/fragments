# 404 test on invalid url
GET http://localhost:8080/nope

HTTP/1.1 404

[Asserts]
# Expect status to be "error"
jsonpath "$.status" == "error"
# Expect error: code to be 404
jsonpath "$.error.code" == 404
# Expect error: message to be "not found"
jsonpath "$.error.message" == "not found"
