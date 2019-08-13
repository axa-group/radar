
db.auth('root', 'example');
radarDb = db.getSiblingDB('radar-techno');
radarDb.entities.insert({
    "_id": ObjectId("5d5188985d0af00006e8c77e"),
    "name": "AXA France",
    "adminList": [
        "demo@axa.fr"
    ],
    "technologies": [],
    "workflowUrl": "",
    "__v": 0
});
radarDb.users.insert({
    "_id": ObjectId("5d5187c95d0af00006e8c77a"),
    "name": "demo",
    "email": "demo@axa.fr",
    "entityList": [
        "5d5188985d0af00006e8c77e"
    ],
    "role": "root",
    "passwordHash": "kIPCgx1d5RrLUFpkRV/4d885dMBXCJc+hgXNgrKNfT62K8p0FyfLC9bY6b9F2KNYA8dyMmMAgGCqMSLScvuKpg==",
    "passwordSalt": "gI3yLJLCttMWzkHJ2D3fKIMMKIsoYzsSreTTgEW7dyHZJV30hExJ7fcewPrWmZGHtZ6KjcCLjOwondHj2bsMOSGtLWRsf7y89IILp0foBKZAc8EkQk+JlZ6VBa0ERY5mCYHkZ7EhOPRcx6dd5v3CW08fLsjwOpmCg6IU0l4THCk=",
    "provider": null,
    "__v": 0
});
radarDb.technos.insert({
    "_id": ObjectId("5d527d8f13de705049bc298c"),
    "__v": 1,
    "name": "dotnetcore",
    "key": "dotnetcore",
    "category": "frameworks",
    "description": "3.0 is awesome",
    "scope": "",
    "reporter": null,
    "updateDate": null
});