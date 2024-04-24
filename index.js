const express =require('express');
const cors=require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port=process.env.PORT || 5000;


// middelwar
app.use(cors());
app.use(express.json());


console.log(process.env.DB_USER)
console.log(process.env.DB_PASS)



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qmgfwvr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri)


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const coffeecollection=client.db('coffeDB').collection('coffee')

    app.get('/coffee',async(req,res)=>{
        const cursor=coffeecollection.find();
        const result= await cursor.toArray();
        res.send(result)
    })
    app.get('/coffee/:id',async(req,res)=>{
        const id =req.params.id;
        const quary={_id:new ObjectId(id)};
        const result=await coffeecollection.findOne(quary);
        res.send(result)
    })


    app.post('/coffee',async(req,res)=>{
        const newCollection=req.body;
        console.log(newCollection);
        const result = await coffeecollection.insertOne(newCollection)
        res.send(result)


    })
    app.put('/updatecoffee/:id',async(req,res)=>{
        const id =req.params.is;
        const filter={_id:new ObjectId(id)};
        const options={upsert:true};
        const updatecoffee=req.body;
        const coffe={
            $set:{
                name:updatecoffee.name,
                quantity:updatecoffee.quantity,
                supplier:updatecoffee.supplier,
                teste:updatecoffee.teste,
                category:updatecoffee.category,
                details:updatecoffee.details,
                photo:updatecoffee.photo,
                
            }
        }
        const result=await coffeecollection.updateOne(filter,coffe,options);
        res.send(result)
    })

    app.delete('/coffee/:id',async(req,res)=>{
        const id=req.params.id;
        const quary={_id:new ObjectId(id)};
        const result= await coffeecollection.deleteOne(quary);
        res.send(result)
    })


    // Send a ping to confirm a successful connection
    



    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('coffe making server is runing ')
    console.log()
})

app.listen(port,()=>{
    console.log(`server runing on port:${port}`)
})