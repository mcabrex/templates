//you'll wanna npm i sequelize and sqlite, you'll see why

const Sequelize = require('sequelize');
//Sequelize is an ORM for node and js that lets you map sql queries to your database
//first require Sequelize (duh)
const connection = new Sequelize('datatron','otagwenko','1234',{
    host: 'localhost',
    dialect: 'sqlite'
})
//then set up your connection to the database, this takes 4 arguments: name of your db, the root username, password, and an object that represents host and the sql dialect youll be using, sqlite in thise case

const Rider = connection.define('riders', {
    name : {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    }
})

const Databots = connection.define('databots',{
    //here we are defining the models and then connecting it to the database we defined earlier, calling it Databots for no particular reason here but obviously it can be whatever you want
    //define takes in two arguments, the name of the data entry and an object that will be used to define the schema for your models
    name : {
        type: Sequelize.STRING,
        //have to use matching Sequelize types, up to you what you want and it can get tricky just make sure to look at those terrible docs
        unique: true,
        //determines whether or not it has to be unique
        allowNull: false,
        //determines if you can leave this empty or not
        validate: {
            //here we can set some, you guessed it, validations!
            len: {
                //this specific validation built in to determine the length 
                args : [3,20],
                //the first key value pair for length is args with an array that can hold how long you want it to be, the first number being a minimum and the second one being a maximum
                msg: 'Databots names have to be between 3 and 20 characters long'
                //we can also add a message we want to say when something fails to meet this validation
            },
            caseCheck : (nameValue)=>{
                //we can also make our own custom validation that we can call anything, by making the value be a function whos argument will be the data we're trying to validate
                const first = nameValue.charAt(0);
                if(first !== first.toUpperCase()) throw new Error('Names must be capitalized!')
                //have to throw the error for it to be a validation
            }
        }
    },
    description: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
    },
    upgrades: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: true
    },
    cute: {
        type: Sequelize.BOOLEAN,
        allowNull: true
    } 
})



//sync our database and we can follow sync with a promise to seed the db after we sync it
connection.sync({
    //.sync can take an optional object
    force: true,
    loggin: console.log
}).then(()=>{
    // make a promise to create a Rider here
    return Rider.create({
        name: 'Shinji'
    })
}).then((riderInstance)=>{
    //pass that promise to create a Rider into the next promise
    Databots.create({
        //create literally creates an entry
        name: 'Optimoo',
        description: 'like optimus prime but part cow',
        upgrades: 'moon jump, THX sound effect, milknade'
    }).then((databotInstance)=>{
        //for this particular creation we're going to take the association we made at the bottom (Databots.belongsTo(Rider, {as: 'master'})) 
        //and pass it into a promise to set it as the master for this particular databot we've created
        return databotInstance.setMaster(riderInstance)
    })

    Databots.create({
        name: 'Toaster oven guy',
        description: 'the evolved form of toaster teen',
        //since allowNull was false we dont have to have upgrades
    })

    const req = {
        body : {
            name: 'Optibark',
            description: 'like optimus prime but part dog',
            upgrades: 'being a good boy, so good, best boy ever'
        }
    }

    const instance = Databots.build(req.body)
    //build creates an instance of what were going to insert into the database and returns a promise that we can use to modify this instance before saving it, .build by itself doesn't actually add anything persistent to the databse so we need to use .save

    instance.save()
    //.save also returns a promise
    .then((thisInstance)=>{
        console.log('what up')
    })

    const req2 = {
        body : [
            {
                name: 'Optibark1',
                description: 'like optimus prime but part dog1',
                upgrades: 'being a good boy, so good, best boy ever',
                cute: true
            },
            {
                name: 'Optibark2',
                description: 'like optimus prime but part dog2',
                upgrades: 'being a good boy, so good, best boy ever'
            },
            {
                name: 'Optibark3',
                description: 'like optimus prime but part dog3',
                upgrades: 'being a good boy, so good, best boy ever',
                cute: true
            },
            ]
    }

    Databots.bulkCreate(req2.body)
    //allows you to bulk create, pretty straightforward
    .then(()=>{
        //here we can make some queries
        Databots.findAll({
            //one kind of query we can use is findAll
            //we can use findOne as well as other querying methods look em up B
            attributes: ['name'],
            //specify the attributes we want to query, in this case name
            where: {
                cute: true
            },
            order: [['name','DESC']]
            //order takes an array of items to order the query by or a sequelize method
        }).then((databots)=>{
            //were gonna take that promise and iterate over everything we get and in thise case all we're gonna do is log it out
            databots.forEach((instance)=>{
                console.log(instance.name + ' is cute!!')
            })
        })

    })

}).catch((err)=>{
    console.log(err)
})

//these are associations that we need to make in order to relate tables to each other in a db
//you must be very specific about these associations otherwise they won't get created in the actual tables
Databots.belongsTo(Rider, {as: 'master'})
    //it's fairly straight forward, here we are saying that Databots belong to Riders and every Databots Riders are referred to here at least as master 
// Rider.hasMany(Databots)