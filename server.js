const express = require('express');
const app = express()
require('dotenv').config();

const jwt = require('jsonwebtoken')

app.use(express.json())

const port = 5000 

const post = [
    {
        username:'Ted',
        job:'Arch.',
    },
    {
        username:'Barney',
        job:'P.L.E.A.S.E',
    }
]

app.get('/',(req,res)=>{
    res.json(post);
})

app.get('/posts',authenticateToken,(req,res)=>{
    res.json(post.filter(post=>post.username === req.user.name))
})

app.post('/login',(req,res)=>{
    //Authenticate user
    const username = req.body.username;
    const user = {name : username}

    const accessToken = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET);
    res.json({accessToken : accessToken}) //generate the access token for every user
})

function authenticateToken(req,res,next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] //if authenheader then go for coed after && else return undefined
    if(token == null)return  res.sendStatus(401);
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
        if(err) return res.sendStatus(403) //have the dead token
        req.user = user;
        next()
    })

}

app.listen(port,()=>{
    console.log(`Listening to port ${port}`);
})
 