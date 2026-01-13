import { useQuery } from "@apollo/client/react";
import { QueryDocument, type QueryQuery } from "./app.generated";

function App() {
  const { loading, error, data } = useQuery<QueryQuery>(QueryDocument);

  return (
    <>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && (
        <ul>
          {data.users.map((user) => (
            <li key={user.id}>
              <strong>{user.name}</strong> - {user.email} - {user.role}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default App;
