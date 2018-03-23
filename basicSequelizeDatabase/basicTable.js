const Sequelize = require('sequelize');
const db = new Sequelize('datatron','otagwenko','1234',{
    host: 'localhost',
    dialect: 'sqlite'
})

const Rider = db.define('riders', {
    name : Sequelize.STRING
})

const Databots = db.define('databots',{
    name : Sequelize.STRING,
    description: Sequelize.STRING,
    upgrades: Sequelize.STRING,
    cute: Sequelize.BOOLEAN
})

db.sync({
    force: true,
    loggin: console.log
}).then(()=>{
    return Rider.create({
        name: 'Shinji'
    })
}).then((riderInstance)=>{
    Databots.create({
        name: 'Optimoo',
        description: 'like optimus prime but part cow',
        upgrades: 'moon jump, THX sound effect, milknade'
    }).then((databotInstance)=>{
        return databotInstance.setMaster(riderInstance)
    })
}).catch((err)=>{
    console.log(err)
})

Databots.belongsTo(Rider, {as: 'master'})
