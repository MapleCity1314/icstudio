"use client";

import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
      Card,
      CardHeader,
      CardTitle,
      CardDescription,
      CardContent,
      CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import StarryBackground from "@/components/starry-background";
import Mailbox from "@/components/mailbox";

const Page = () => {
      const [feedback, setFeedback] = useState("");
      const [isSubmitting, setIsSubmitting] = useState(false);

      const checkSubmissionLimit = () => {
            const today = new Date().toDateString();
            const submissionData = localStorage.getItem('feedbackSubmissions');
            const data = submissionData ? JSON.parse(submissionData) : { date: today, count: 0 };

            if (data.date !== today) {
                  // 如果是新的一天，重置计数
                  localStorage.setItem('feedbackSubmissions', JSON.stringify({ date: today, count: 0 }));
                  return true;
            }

            if (data.count >= 5) {
                  toast.error("您今天的提交次数已达上限（5次），请明天再试");
                  return false;
            }

            return true;
      };

      const onSubmit = async () => {
            if (!feedback.trim()) {
                  toast.error("请输入您的意见或建议");
                  return;
            }

            if (!checkSubmissionLimit()) {
                  return;
            }

            try {
                  setIsSubmitting(true);
                  const res = await fetch("/api/about", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ feedback }),
                  });

                  if (res.ok) {
                        // 更新提交次数
                        const today = new Date().toDateString();
                        const submissionData = localStorage.getItem('feedbackSubmissions');
                        const data = submissionData ? JSON.parse(submissionData) : { date: today, count: 0 };
                        localStorage.setItem('feedbackSubmissions', JSON.stringify({
                              date: today,
                              count: data.count + 1
                        }));

                        // 动画完成后再显示成功提示
                        setTimeout(() => {
                              toast.success("感谢您的反馈！");
                              setFeedback("");
                              setIsSubmitting(false);
                        }, 1000);
                  } else {
                        toast.error("提交失败，请稍后重试");
                        setIsSubmitting(false);
                  }
            } catch (error) {
                  console.error(error);
                  toast.error("提交失败，请稍后重试");
                  setIsSubmitting(false);
            }
      };

      return (
            <div className="min-h-screen w-full relative flex flex-col items-center justify-center p-4 md:p-8 gap-8">
                  <StarryBackground />
                  <motion.div
                        className="w-full max-w-2xl"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                  >
                        <Card className="backdrop-blur-sm bg-background/80">
                              <CardHeader>
                                    <CardTitle>匿名意见箱</CardTitle>
                                    <CardDescription>
                                          您的意见对我们很重要，请随时向我们提出您的建议或反馈
                                    </CardDescription>
                              </CardHeader>
                              <CardContent>
                                    <Textarea
                                          placeholder="在这里输入您的意见或建议..."
                                          value={feedback}
                                          onChange={(e) =>
                                                setFeedback(e.target.value)
                                          }
                                          rows={6}
                                          className="resize-none"
                                    />
                              </CardContent>
                              <CardFooter className="flex flex-col items-start gap-4">
                                    <Button
                                          onClick={onSubmit}
                                          disabled={isSubmitting}
                                          className="w-full"
                                    >
                                          {isSubmitting
                                                ? "提交中..."
                                                : "提交反馈"}
                                    </Button>
                                    <p className="text-sm text-muted-foreground">
                                          如需直接联系站长，请添加QQ：
                                          <a
                                                href="http://wpa.qq.com/msgrd?v=3&uin=2702540295&site=qq&menu=yes"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary hover:underline"
                                          >
                                                2702540295
                                          </a>
                                    </p>
                              </CardFooter>
                        </Card>
                  </motion.div>
                  <div className="fixed bottom-6 right-6 z-40">
                        <Mailbox isSubmitting={isSubmitting} />
                  </div>
            </div>
      );
};

export default Page;
