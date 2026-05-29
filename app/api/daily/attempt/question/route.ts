// //app/api/daily/attempt/question/route.ts
// import { prisma } from "@/lib/prisma";
// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();

//     const question = await prisma.dailyQuestion.create({
//       data: {
//         question: body.question,
//         optionA: body.optionA,
//         optionB: body.optionB,
//         optionC: body.optionC,
//         optionD: body.optionD,
//         correctAnswer: body.correctAnswer,
//         difficulty: body.difficulty,
//         challengeId: body.challengeId,
//       },
//     });

//     return NextResponse.json({
//       success: true,
//       question,
//     });
//   } catch (error) {
//     return NextResponse.json(
//       {
//         error: "Failed to add question",
//       },
//       {
//         status: 500,
//       },
//     );
//   }
// }
