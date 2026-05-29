// //app/api/admin/daily/add-question/route.ts
// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();

//     const {
//       challengeId,
//       question,
//       optionA,
//       optionB,
//       optionC,
//       optionD,
//       correctAnswer,
//       difficulty,
//     } = body;

//     if (
//       !challengeId ||
//       !question ||
//       !optionA ||
//       !optionB ||
//       !optionC ||
//       !optionD ||
//       !correctAnswer
//     ) {
//       return NextResponse.json(
//         {
//           error: "Missing required fields",
//         },
//         { status: 400 },
//       );
//     }

//     const created = await prisma.dailyQuestion.create({
//       data: {
//         challengeId,
//         question,
//         optionA,
//         optionB,
//         optionC,
//         optionD,
//         correctAnswer,
//         difficulty,
//       },
//     });

//     return NextResponse.json({
//       success: true,
//       question: created,
//     });
//   } catch (error) {
//     console.error(error);

//     return NextResponse.json(
//       {
//         error: "Server error",
//       },
//       { status: 500 },
//     );
//   }
// }
