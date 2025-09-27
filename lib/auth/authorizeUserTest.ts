import User from "../../models/User";

export async function authorizeUserTest(email: string, password: string) {
  const user = await User.findOne({ email });
  if (!user) return null;

  const isValid = password === user.password;
  return isValid
    ? { id: user._id!.toString(), name: user.name, email: user.email }
    : null;
}
