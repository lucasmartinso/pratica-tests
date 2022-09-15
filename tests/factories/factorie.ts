import { faker } from "@faker-js/faker";
 
export default function __itemsFactorie() {
    return { 
        title: faker.lorem.words(1),
        url: faker.internet.url(),
        description: faker.lorem.paragraph(1),
        amount: Number(faker.random.numeric(1))
    }
} 