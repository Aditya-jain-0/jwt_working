//login logout and refresh tokens

// why refresh tokens :- prevent users to get invalid access , expiration Date only for few minutes after it gets refreshed

const express = require('express');
const app = express()
require('dotenv').config();

const jwt = require('jsonwebtoken')

app.use(express.json())

const port = 4000 

let refreshTokens = [];

app.post('/token',(req,res)=>{
    const refreshToken = req.body.token;
    if(refreshToken == null) return res.sendStatus(401) 
    if(!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
    jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET,(err,user)=>{
        if(err) return res.sendStatus(403)
        const accessToken = generateAccessToken({name : user.name}) //d
        res.json({accessToken})
    })
})

app.delete('/logout',(req,res)=>{
    refreshTokens = refreshTokens.filter(token=>token!==req.body.token)
    res.sendStatus(204)
})

app.post('/login',(req,res)=>{
    //Authenticate user
    const username = req.body.username;
    const user = {name : username}

    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user,process.env.REFRESH_TOKEN_SECRET)
    refreshTokens.push(refreshToken);
    res.json({accessToken : accessToken , refreshToken : refreshToken}) //generate the access refresh token for every user 
})

function generateAccessToken(user){
    return jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'15s'});
}

app.listen(port,()=>{
    console.log(`Listening to port ${port}`);
})
 