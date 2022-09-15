import { faker } from "@faker-js/faker";
 
export default function __randomNumber(num: number) {
    return { 
        randomNumber: Number(faker.random.numeric(num)),
    }
}