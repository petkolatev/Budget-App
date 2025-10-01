import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { compare } from "bcrypt";
import User from "@/models/User";
import clientPromise from "@/lib/mongoClient";

const handler = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials || {};
        const user = await User.findOne({ email });
        if (!user) return null;

        const isValid = await compare(password!, user.password);
        return isValid
          ? { id: user._id!.toString(), name: user.name, email: user.email }
          : null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 1 * 12 * 60 * 60,
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
