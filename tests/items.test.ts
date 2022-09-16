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
    const { status, body }: any = await supertest(app).get("/items").send();

    expect(status).toBe(200);
    expect(body).toBeInstanceOf(Array);
  })
});

describe('Testa GET /items/:id ', () => {
  it('Deve retornar status 200 e um objeto igual a o item cadastrado', async () => {
    const items = await __itemsFactorie(); 

    const { body } = await supertest(app).post("/items").send(items);
    const id = body.id;
    
    const result = await supertest(app).get(`/items/${id}`).send();

    expect(result.status).toBe(200);
    expect(body).toMatchObject(result.body);
   });

  it('Deve retornar status 404 caso não exista um item com esse id', async () => { 
    const randomNumber = __randomNumber(9);   
    
    const { status } = await supertest(app).get(`/tests/${randomNumber}`).send();

    expect(status).toBe(404);
  });
});
