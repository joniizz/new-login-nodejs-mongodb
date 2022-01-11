# REST API
The REST API to the example app is described below.

This is a basic User-login-app based on Express.js and MongoDB providing a REST API to login-db model.

The entire application is contained within the 'new-login-nodejs-mongodb'folder.

As a user login REST API, this back-end service allows:
- User to login with a username and password;
- Return success and a JWT token if username and password are correct;
- Return fail if username and password are not matched;
- Brute-force protection: A user has a maximum of 3 attempts within 5 minutes, otherwise, the user will be locked for 5 minutes;
- User login return fail if a user is locked

[create an anchor](#user-login)
# Steps:
1. Run the app
2. Sign up 
    - [Create a new user](#create-a-new-user)
    - [Create an existing user](#create-an-existing-user)
3. Sign in
    - [Existing user login](#existing-user-login)
    - [Non-existing user login](#non-existing-user-login)
    - [User password wrong login](#user-password-wrong-login)
    - [Locked user login](#locked-user-login)
   
## Run the app

    docker run -it user-login-app-demo /bin/bash
    docker-compose up
## Sign up functions: 
- [Create a new user](#create-a-new-user)
- [Create an existing user](#create-an-existing-user)

## Create a new user:
Create user with a username "test1" and password "123456".

**URL** : `localhost:8080/api/auth/signup`

**Method** : `POST`
###### POST Request in terminal

    curl -d '{
    "username": "test1",
    "password":"123456" }' -H "Content-Type: application/json" http://localhost:8080/api/auth/signup

### Success Response

**Code** : `201 Created`

**Content examples**

A new user with username test1 and password is stored on the local database.

```json
{
    "message": "User added successfully!"
}
```
## Create an existing user:
Create user with a registered username "test1" and password "123456".

**URL** : `localhost:8080/api/auth/signup`

**Method** : `POST`
###### POST Request in terminal

    curl -d '{
    "username": "test1",
    "password":"123456" }' -H "Content-Type: application/json" http://localhost:8080/api/auth/signup

### Failed Response

**Code** : `400 Bad Request`

**Content examples**

```json
{
    "message": "Failed! Username has been taken."
}
```
## Sign in:
- [Existing user login](#existing-user-login)
- [Non-existing user login](#non-existing-user-login)
- [User password wrong login](#user-password-wrong-login)
- [Locked user login](#locked-user-login)
## Existing User login:

User login in with a correct username "test1" and correct password "123456".

**URL** : `localhost:8080/api/auth/signin`

**Method** : `POST`

###### POST Request in terminal

    curl -d '{
    "username": "test1",
    "password":"123456" }' -H "Content-Type: application/json" http://localhost:8080/api/auth/signin

### Success Response

**Code** : `200 OK`

**Content examples**

A new user with username test1 and password is stored on the local database. And user is not locked.

```json
{
    "message": "Signin successfully!",
    "id": "61dd28dd578796154debbe72",
    "username": "test1",
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxZGQyOGRkNTc4Nzk2MTU0ZGViYmU3MiIsImlhdCI6MTY0MTg4NDIzNywiZXhwIjoxNjQxOTcwNjM3fQ.AI7q-DiYCz-4xnGCc82cU-DPO2oq9NptemTTa0ijIMU"
}
```

## Non-existing user login
Login response, for an unregistered user with username test2 on the local database:

**URL** : `localhost:8080/api/auth/signin`

**Method** : `POST`

###### POST Request in terminal

    curl -d '{
    "username": "test2",
    "password":"123456" }' -H "Content-Type: application/json" http://localhost:8080/api/auth/signin
  
### Failed Response: 

**Code** : `404 Not Found`
**Content examples**

```json
{
    "message": "User not found!"
}
```

## User password wrong login
For an existing user with username test1 on the local database, but user password is wrong.

**URL** : `localhost:8080/api/auth/signin`

**Method** : `POST`
###### POST Request in terminal

    curl -d '{
    "username": "test1",
    "password":"654321" }' -H "Content-Type: application/json" http://localhost:8080/api/auth/signin
    
### Failed Response:
**Code** : `401 Unauthorized`

**Content examples**
```json
{
    "accessToken": null,
    "message": "Invalid password! You've tried: 0 times!"
}
```
## Locked user login
Login response, for an existing user with username test1 on the local database, but user password is wrong with 3 login attempts within 5 minutes
**URL** : `localhost:8080/api/auth/signin`

**Method** : `POST`
###### POST Request in terminal

    curl -d '{
    "username": "test1",
    "password":"654321" }' -H "Content-Type: application/json" http://localhost:8080/api/auth/signin
    
### Failed Response:
**Code** : `404 Not found`

**Content examples**
```json
{
    "message": "User is locked! Wait until: 1/11/2022, 6:08:45 PM"
}
```

