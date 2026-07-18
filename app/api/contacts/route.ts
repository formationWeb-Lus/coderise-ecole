import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {

    const body = await request.json();

    const { name, phone } = body;


    if (!name || !phone) {
      return NextResponse.json(
        {
          message: "Nom et téléphone obligatoires"
        },
        {
          status: 400
        }
      );
    }


    const contact = await prisma.contact.create({
      data: {
        name,
        phone,
      },
    });


    return NextResponse.json(
      {
        success: true,
        contact,
      },
      {
        status: 201,
      }
    );


  } catch (error) {

    console.log("CONTACT ERROR :", error);


    return NextResponse.json(
      {
        success:false,
        message:"Erreur serveur"
      },
      {
        status:500
      }
    );

  }
}