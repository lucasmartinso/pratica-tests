import { items } from "@prisma/client";
import supertest from "supertest";
import app from "../src/app";
import {prisma} from "../src/database"
import { findAll } from "../src/repositories/itemRepository";
import { insert } from "../src/services/itemService";
import __itemsFactorie from "./factories/factorie";
import __randomNumber from "./factories/numberFactorie";

beforeEach( async () => {
  await prisma.$executeRaw`TRUNCATE TABLE items`;
})

describe('Testa POST /items ', () => {

  it('Deve retornar 201, se cadastrado um item no formato correto', async () => {
    const items = __itemsFactorie(); 
    
    const {status} = await supertest(app).post("/items").send(items);

    expect(status).toBe(201);
  }); 

  it('Deve retornar 409, ao tentar cadastrar um item que exista', async () => { 
    const items = __itemsFactorie(); 
    
    await supertest(app).post("/items").send(items);
    const {status} = await supertest(app).post("/items").send(items);

    expect(status).toBe(409);
  });

});

describe('Testa GET /items ', () => {
  it('Deve retornar status 200 e o body no formato de Array', async () => { 
    const { status }: any = await supertest(app).get("/items");

    expect(status).toBe(200);
  })
});

describe('Testa GET /items/:id ', () => {
  it('Deve retornar status 200 e um objeto igual a o item cadastrado', async () => {
    const randomNumber = __randomNumber(1);   
    for(let i=0; i<10; i++) { 
      const items = __itemsFactorie(); 
      await insert(items);
    } 

    const result = await findAll(); 
    console.log(result);
    
    const { status } = await supertest(app).get(`/tests/${randomNumber}`);

    expect(status).toBe(200);
   });

  it('Deve retornar status 404 caso não exista um item com esse id', async () => { 
    const randomNumber = __randomNumber(9);   
    const result = await findAll(); 
    
    const { status } = await supertest(app).get(`/tests/${randomNumber}`);

    expect(status).toBe(404);
  });
});
