import { NextRequest, NextResponse } from "next/server";
import { ensureDbConnection } from "@/lib/db/init-db";
import { dbFactory } from "@/lib/db/db-factory";
import { 
  feedbackSchema, 
  FEEDBACK_MODEL_NAME,
  FeedbackType,
  FeedbackStatus,
  type IFeedback
} from "@/lib/db/schema/feedback";

// 注册Schema
dbFactory.registerSchema(FEEDBACK_MODEL_NAME, feedbackSchema);

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        
        // 验证必填字段
        if (!data.name || !data.email || !data.message || !data.mode) {
            return NextResponse.json(
                { message: "缺少必填字段" },
                { status: 400 }
            );
        }

        // 确保数据库连接
        await ensureDbConnection();

        // 获取反馈服务
        const feedbackService = dbFactory.getService<IFeedback>(FEEDBACK_MODEL_NAME);

        // 创建反馈记录
        const feedback = await feedbackService.create({
            name: data.name,
            email: data.email,
            message: data.message,
            type: data.mode as FeedbackType,
            status: FeedbackStatus.PENDING,
            ...(data.mode === FeedbackType.JOIN && {
                phone: data.phone,
                portfolio: data.portfolio
            }),
            ...(data.mode === FeedbackType.COLLABORATE && {
                company: data.company,
                address: data.address
            })
        });

        return NextResponse.json({
            success: true,
            message: "反馈提交成功",
            data: feedback
        });

    } catch (error) {
        console.error("Feedback error:", error);
        return NextResponse.json(
            { message: "反馈提交失败，请稍后重试" },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        // 确保数据库连接
        await ensureDbConnection();

        // 获取反馈服务
        const feedbackService = dbFactory.getService<IFeedback>(FEEDBACK_MODEL_NAME);

        // 获取查询参数
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const status = searchParams.get('status') as FeedbackStatus | null;

        // 构建查询条件
        const query = status ? { status } : {};

        // 分页查询
        const { data, total } = await feedbackService.findWithPagination(
            query,
            { page, limit, sort: { createdAt: -1 } }
        );

        return NextResponse.json({
            success: true,
            data,
            total,
            page,
            limit
        });

    } catch (error) {
        console.error("Feedback error:", error);
        return NextResponse.json(
            { message: "获取反馈列表失败" },
            { status: 500 }
        );
    }
}


