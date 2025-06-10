import User from "@/types/user";

const query = `
  {
    userDatabases {
        id
        email
        activeUser
    }
  }
`;

export async function getUserEmail() {
  if (!process.env.NEXT_HYGRAPH_ENDPOINT) {
    throw new Error("HYGRAPH_ENDPOINT is not defined");
  }
  const response = await fetch(process.env.NEXT_HYGRAPH_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: query,
      cache: "no-store",
    }),
  });

  const { data } = await response.json();
  const userDatabases = data.userDatabases as User[];

  let usersEmail = "";
  userDatabases.forEach((element) => {
    if (element.activeUser === true) usersEmail += `${element.email}, `;
  });
  
  return usersEmail.slice(0, -2);
}
