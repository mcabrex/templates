//express itself does not create a server, it uses http then creates a function to handle requests
const express = require('express')
const app = express()
app.listen(8000)

const users = {
    regular : [
        'regUser1',
        'regUser2',
        'regUser3'
    ],
    admin : [
        'adminUser1',
        'adminUser2',
        'adminUser3'
    ]
}

app.use((req,res,next)=>{
    //a sort of global middleware (everything method on the app(express) is middleware) that can be used to attach something to the request on any request that is made
    req.prop = 'a value'
    next()
    //all these express middleware functions except a req, a res, and a next, by calling next in this situation we are able to attach 'a value' onto the request and pass it down the pipeline to the NEXT applicable middleware
    //this middleware can do anything you want it to do, it can even respond to the request, it doesn't even have to call next()
    //however if you dont call next() then the request will stop here as it doesn't know what to do at this point
    //can also be called asynchronously
})

app.use(express.static(__dirname))
//__dirname being the name of the directory this file is in
//using express.static(__dirname) will look for any file that matches the url and give it so if we go to our localhost in this situation and add /template it will send over our template.jpg in from this directory

app.get('/',(req,res)=>{
    res.send('Hello!')
})
//get is a method, the function after the path ('/') will only respond if there is a get request to that path

//req.query
app.get('/users',(req,res,next)=>{
    const group = req.query.group
    //some query action, after the initial request you can opt to make a query in this case something like http://localhost:8000/users?=regular
    //so were making a query '?=' through users for regular
    if(!group) return next(new Error('Groups not real bro'))
    //if there's no query send this charming anecdote 
    //if you don't specify to return it will acknowledge this error but continue to run the rest of the function which could lead to stacking errors and other problems
     
    //otherwise check what query it is
    if(users[group]) res.send(users[group])
    //send that query ^ in this case, or any appropriate response you want really
    else next(new Error('Groups not real bro'))
    //here if there's a query but it doesn't exist let em know using next() who's first argument should be an error
    //by calling next this will go down the line until it hits our error middleware
})

//req.params
app.get('/users/:apples',(req,res)=>{
    //anything after the colon (':') will become a key for the value (in this case apples) on req.params
    //params can stack even further ('/users/:apples/:seeds/:plants') but it will expect that amount of parameters and the request won't go through if it doesn't get that number of parameters
    res.json(req.params)
    //this allows for dynamic parameters
    //it will always be a string on the object so use parseInt() if you're expecting numbers
})

app.post('/submit',(req,res)=>{
    res.send('Submit it up bud!')
})
//post is also a method, use postman to try it out

app.use((err,req,res,next)=>{
    res.status(500).send(err.message)
    //example of error handling, this is expecting an error from our next() to which we will respond with a 500 status and a message to the user or whatever
})