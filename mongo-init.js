
db.auth('root', 'example');

db.getSiblingDB('radar-techno');
db.container.insert({ myfield: 'hello', thatfield: 'testing' });
db.container.insert({ myfield: 'hello2', thatfield: 'testing' });
db.container.insert({ myfield: 'hello3', thatfield: 'testing' });
db.container.insert({ myfield: 'hello3', thatfield: 'testing' });



{
    "_id": ObjectID(),
    "name" : "demo",
    "email" : "demo@axa.fr",
    "entityList" : [
    "5a4fadb65d734d0a7ca6903a"
],
    "role" : "root",
    "passwordHash" : "kIPCgx1d5RrLUFpkRV/4d885dMBXCJc+hgXNgrKNfT62K8p0FyfLC9bY6b9F2KNYA8dyMmMAgGCqMSLScvuKpg=="
    "passwordSalt" :  "gI3yLJLCttMWzkHJ2D3fKIMMKIsoYzsSreTTgEW7dyHZJV30hExJ7fcewPrWmZGHtZ6KjcCLjOwondHj2bsMOSGtLWRsf7y89IILp0foBKZAc8EkQk+JlZ6VBa0ERY5mCYHkZ7EhOPRcx6dd5v3CW08fLsjwOpmCg6IU0l4THCk=",
    "provider" : null,
    "__v" : 0
}

{
    "_id": ObjectID(),
    "__v" : 0,
    "name" : "Apache Kafka",
    "key" : "apache-kafka",
    "category" : "infrastructures",
    "description" : "no description",
    "scope" : "aaffdfgdfg",
    "reporter" : null,
    "updateDate" : null
}

{
    "_id" : ObjectID(),
    "name" : "AXA France",
    "adminList" : [
    "demo@axa.fr"
],
    "technologies" : [],
    "workflowUrl" : "",
    "__v" : 0
}