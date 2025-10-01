import bcrypt from "bcrypt";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { name, email, password, rePassword } = await req.json();

  if (password !== rePassword) {
    return NextResponse.json({ error: "Password mismatch" }, { status: 400 });
  }

  await connectDB();

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json({ error: "User already exists" }, { status: 409 });
  }

  try {
    const salt = 10;
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      email,
      name,
      password: hashedPassword,
    });

    return NextResponse.json({ user: newUser }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
