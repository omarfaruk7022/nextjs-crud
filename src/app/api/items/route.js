import Item from "@/app/models/Item";
import dbConnect from "@/app/utils/dbConnect";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();

  try {
    const items = await Item.find({});
    const res = {
      success: true,
      data: items,
      message: "Successfully fetched data",
    };
    return new Response(JSON.stringify(res), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}

export async function POST(req) {
  await dbConnect();

  try {
    const data = await req.json();
    console.log(data);

    // Create the new item in the database
    const newItem = await Item.create({
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category,
      brand: data.brand,
      stock: data.stock,
      imageUrl: data.imageUrl,
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create item" },
      { status: 500 }
    );
  }
}

// import { NextResponse } from "next/server";
// import Item from "@/app/models/Item";
// import dbConnect from "@/app/utils/dbConnect";

// export async function POST(req) {
//   try {
//     // Connect to database
//     await dbConnect();

//     const data = await req.json();

//     // Validate required fields
//     const requiredFields = [
//       "name",
//       "description",
//       "price",
//       "category",
//       "brand",
//       "stock",
//       "imageUrl",
//     ];
//     for (const field of requiredFields) {
//       if (!data[field]) {
//         return NextResponse.json(
//           { error: `Missing required field: ${field}` },
//           { status: 400 }
//         );
//       }
//     }

//     // Create the new item in the database
//     const newItem = await Item.create({
//       name: data.name,
//       description: data.description,
//       price: Number.parseFloat(data.price),
//       category: data.category,
//       brand: data.brand,
//       stock: Number.parseInt(data.stock),
//       imageUrl: data.imageUrl,
//     });

//     return NextResponse.json(newItem, { status: 201 });
//   } catch (error) {
//     console.error("Error creating item:", error);
//     return NextResponse.json(
//       { error: "Failed to create item" },
//       { status: 500 }
//     );
//   }
// }
