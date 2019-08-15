const express=require('express')
const path=require('path')
const hbs=require('hbs')
const geocode=require('./utils/geocode')
const forecast=require('./utils/forecast')

const app=express()

//define path for express config
const publicDirectoryPath=path.join(__dirname,'../public')
const viewPath=path.join(__dirname,'../templates/views')
const partialPath=path.join(__dirname,'../templates/partials')


//setup handlers engine  and views location
app.set('view engine','hbs')
app.set('views',viewPath)
hbs.registerPartials(partialPath)

//setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('',(req,res)=>{
    res.render('index',{
        title:'weather',
        name:'Jayesh '
    })
})

app.get('/about',(req,res)=>{
    res.render('about',{
        title:'About me',
        name:'Jayesh'
    })
   // console.log(req.query)
    
})

app.get('/help',(req,res)=>{
    res.render('help',{
        helpText:'This is some helpful text',
        title:'Help',
        name:'Jayesh'
    })
})

app.get('/weather',(req,res)=>{

    if(!req.query.address){
      return res.send({
            error:'you must provide an address'
        })
    }

    geocode(req.query.address,(error,{latitude,longitude,location}={})=>{
        if(error){
            return res.send({error})
        }
        forecast(latitude,longitude,(error,forecastData)=>{
            if(error){
                return res.send({error})
            }

            res.send({
                forecast:forecastData,
                location,
                address:req.query.address
            })
        })
    })
    // res.send({
    //     forecast:'It is snowing',
    //     location:'pune',
    //     address: req.query.address
    // })
})

app.get('/products',(req,res)=>{

    if(!req.query.search){
       return res.send({
            error:'You must provide a search term'
        })
    }


    console.log(req.query)
    res.send({
        products:[] 
    })
})

app.get('/help/*',(req,res)=>{
    res.render('error',{
        title:'404',
        name:'jayesh',
        errorMessage:'Help article not found'
    })
})

app.get('*',(req,res)=>{
    res.render('error',{
        title:'404',
        name:'jayesh',
        errorMessage:'Page not found'
    })
})

app.listen(3000,()=>{
    console.log('Server is up on port 3000')
})