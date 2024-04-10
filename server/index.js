require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const createError = require('http-errors');
// const { createHelia } = require('helia');
// const {json} = require('@helia/json')

const app = express();

const prisma = new PrismaClient();

// 1. Middleware for parsing requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. CORS
const corsOptions = {
    origin: 'http://localhost:5173', // specify the frontend origin
    credentials: true, // allow credentials (cookies, sessions)
};

app.use(cors(corsOptions));

app.get('/',(req,res)=>{
    res.send("Welcome to Push Dapp")
})
app.get('/test',async (req,res)=>{
    const { createHelia } = await import('helia');
    const { dagJson } = await import('@helia/dag-json');
    const { CID } = await import('multiformats/cid');

    const helia = await createHelia()
    const j = dagJson(helia)

    const cid = await j.add({ hello: 'world' })
    const cid_json = cid.toJSON()

    await prisma.cid.delete({
        where: {
            id: 1
          }
    })

    await prisma.cid.create({
        data: {
            id: 1,
            cid: cid_json,
        }
    })
    const users = await prisma.cid.findFirst();
    console.log(users.cid);
    const content = await j.get(CID.asCID(cid_json))
    res.send({
        "cid": cid_json,
        "content": content,
        "user": users
    })
})

app.listen(8000,()=>{
    console.log('Push API listening on http://localhost:8000');
})

