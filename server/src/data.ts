interface IUser {
  name: string;
  password: string;
  email: string;
  phone: string;
  address: string;
}

const data: { users: IUser[] } = {
  users: [
    {
      name: "Rahim ",
      password: "password123",
      email: "johndoe@example.com",
      phone: "1234567890",
      address: "123 Main Street",
    },
    {
      name: "Rifat",
      password: "password456",
      email: "janesmith@example.com",
      phone: "9876543210",
      address: "456 Elm Street",
    },
    {
      name: "karim",
      password: "password789",
      email: "alicejohnson@example.com",
      phone: "5555555555",
      address: "789 Oak Avenue",
    },
    {
      name: "Bob Williams",
      password: "passwordabc",
      email: "bobwilliams@example.com",
      phone: "1112223333",
      address: "321 Pine Road",
    },
    {
      name: "Emily Davis",
      password: "passwordxyz",
      email: "emilydavis@example.com",
      phone: "4443332222",
      address: "555 Cedar Lane",
    },
  ],
};

export default data;
