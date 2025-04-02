import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongo/mongo";
import { Feedback } from "@/lib/db/mongo/schemas/feedback";

export async function POST(request: Request) {
      try {
            const body = await request.json();
            const { feedback } = body;

            if (!feedback) {
                  return NextResponse.json(
                        { error: "反馈内容不能为空" },
                        { status: 400 }
                  );
            }

            await dbConnect();

            const newFeedback = await Feedback.create({
                  content: feedback,
            });

            return NextResponse.json(
                  { message: "反馈提交成功", feedback: newFeedback },
                  { status: 201 }
            );
      } catch (error) {
            console.error("提交反馈时出错:", error);
            return NextResponse.json(
                  { error: "服务器内部错误" },
                  { status: 500 }
            );
      }
}