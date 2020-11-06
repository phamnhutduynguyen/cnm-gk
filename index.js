const express = require('express')
const bodyParser = require('body-parser')
const AWS = require('aws-sdk')
const app = express()
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs')
app.set('views', './views')
app.listen(3000, () => console.log('server connected port 3000'))
const docClient = new AWS.DynamoDB.DocumentClient({
    region: 'us-east-2',
    accessKeyId: '',
    secretAccessKey: ''
})
app.get('/', (req, res) =>{
    const params = {
        TableName: "LinhKien"
    }
    docClient.scan(params, (err, data)=>{
        if(err){
            console.log('loi san')
        }else{
            res.render('index', {items: data.Items})
        }
    })
})
app.post('/add', (req, res) =>{
    const {id, ten, donvitinh, dongia, thongso} = req.body
    const params = {
        TableName: "LinhKien",
        Item:{
            "id": id,
            "ten": ten,
            "donvitinh": donvitinh,
            "dongia": dongia,
            "thongso": thongso,
        }
    }
    docClient.put(params, (err, data)=>{
        if(err){
            console.log('loi put')
        }else{
            return res.redirect('/')
        }
    })
})
app.get('/delete/:id', (req, res) =>{
    const id = req.params.id
    const params = {
        TableName: "LinhKien",
        Key:{
            "id": id
        }
    }
    docClient.delete(params, (err, data)=>{
        if(err){
            console.log('loi delete')
        }else{
            return res.redirect('/')
        }
    })
})
app.get('/update/:id', (req, res) =>{
    const id = req.params.id
    const params = {
        TableName: "LinhKien",
        Key: {
            "id":id
        }
    }
    docClient.get(params, (err, data) =>{
        if(err){
            console.log('loi scan update')
        }else{
            res.render('update', {item: data.Item})
        }
    })
})
app.post('/update',(req,res)=>{
    const {id, ten, donvitinh, dongia, thongso}= req.body
    const params ={
        TableName:"LinhKien",
        Key:{
            "id":id
        },
        UpdateExpression: "set ten= :ten, donvitinh = :donvitinh, dongia = :dongia , thongso =:thongso ",
        ExpressionAttributeValues:{
            ":ten": ten,
            ":donvitinh":donvitinh,
            ":dongia":dongia,
            ":thongso":thongso, 
        },
        ReturnValues:"UPDATED_NEW"
    }
    docClient.update(params, (err,data) =>{
        if(err){
            console.log("Loi update")
        }
        else{
            return res.redirect('/')
        }
    })
})