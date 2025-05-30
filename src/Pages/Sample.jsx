// src/components/Profile.jsx
import { useAuth } from "../hooks/useAuth";

export default function Profile() {
  const user = useAuth();
  if (!user) return <p>Please log in.</p>;

  return (
    <div>
      <h1>Welcome, {user.fullname}!</h1>
      <p>Email:   {user.email}</p>
      <p>College: {user.college}</p>
      <p>Mobile:  {user.mobile}</p>
    </div>
  );
}
