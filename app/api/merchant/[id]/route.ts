import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Merchant } from "@/models/Category";
import typeErrorMessage from "../../../utils/typeErrorMessage";

export async function DELETE(
    req: Request,
    context: { params: Promise<{ id: string }> },
) {
    const { id } = await context.params;
    await connectDB();

    try {
        const merchantsUsingCategory = await Merchant.find({ id });

        if (!merchantsUsingCategory) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Merchant doesn't exists",
                },
                { status: 400 },
            );
        }

        await Merchant.findByIdAndDelete(id);
        return NextResponse.json(
            { success: true, message: "Merchant deleted" },
            { status: 200 },
        );
    } catch (error: unknown) {
        return NextResponse.json(
            { success: false, error: typeErrorMessage(error) },
            { status: 500 },
        );
    }
}
