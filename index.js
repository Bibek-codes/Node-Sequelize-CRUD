const express = require('express')
const app=express()
const Sequelize = require('sequelize')
const bodyParser = require('body-parser')


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

const port = process.env.PORT || 5000

const sequelize = new Sequelize('node_db','node','node',{
    dialect:'mysql'
})


const blog_table = sequelize.define(
    'blog_table',
    {
        title:Sequelize.STRING,
        desc:Sequelize.TEXT,
    },
    { tablename: 'blog_table'}
)

blog_table.sync()

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection made successfully..')
    })
    .catch((err)=>{
        console.log('Error is found')
    })

app.post('/',async(req,res)=>{
    const title = req.body.title
    const desc = req.body.desc
    const saveBlog = blog_table.build({
        title,
        desc,
    })
    await saveBlog.save()
    res.send('data posted')
})


app.get('/', async(req,res)=> {
    const alldata = await blog_table.findAll()
    res.json(alldata)
})

app.get('/:id', async(req,res)=> {
    let id = req.params.id
    let product = await blog_table.findOne({ where: { id:id }})
    res.json(product)
})

app.put('/:id',(req,res) => {
    const data = req.body.data;
    blog_table.update(
        {
            desc:data
        },
        {
            where: {
                id: req.params.id,
            }
        }
    )
    res.redirect('/')
})

app.delete('/:id',(req,res) => {
    blog_table.destroy({
            where: {
                id: req.params.id,
            }
        })
    res.redirect('/')
})

app.listen(port, ()=> {
    console.log(`server is listening on ${port}`)
})
