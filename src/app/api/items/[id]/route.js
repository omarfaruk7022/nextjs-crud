import Item from "@/app/models/Item";
import dbConnect from "@/app/utils/dbConnect";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  await dbConnect();

  try {
    const item = await Item.findById(params.id);
    if (!item)
      return new Response(JSON.stringify({ message: "Item not found" }), {
        status: 404,
      });

    return new Response(JSON.stringify(item), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}

export async function PUT(req, { params }) {
  await dbConnect();

  try {
    const body = await req.json();
    const updatedItem = await Item.findByIdAndUpdate(params.id, body, {
      new: true,
    });
    if (!updatedItem)
      return new Response(JSON.stringify({ message: "Item not found" }), {
        status: 404,
      });

    return new Response(JSON.stringify(updatedItem), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();

    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const deletedItem = await Item.findByIdAndDelete(id);

    if (!deletedItem) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
