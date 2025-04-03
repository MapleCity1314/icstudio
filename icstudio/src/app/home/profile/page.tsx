"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/use-session";
import StarryBackground from "@/components/starry-background";
import {
      Card,
      CardContent,
      CardFooter,
      CardHeader,
      CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
      Dialog,
      DialogContent,
      DialogHeader,
      DialogTitle,
} from "@/components/ui/dialog";
import {
      AlertCircle,
      Camera,
      CheckIcon,
      PencilIcon,
      XIcon,
      Loader2,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuthStore } from "@/store/auth-store";
import { useProfileStore } from "@/store/profile-store";

// 用户类型定义

const ProfilePage = () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const router = useRouter();
      // 获取NextAuth会话
      const { data: session, status: sessionStatus } = useSession();

      // 使用Zustand状态管理
      const {
            user,
            isLoading,
            error,
            success,
            setUser,
            setLoading: setIsLoading,
            setError,
            setSuccess,
      } = useAuthStore();

      const {
            isEditing,
            editedUser,
            showVerifyDialog,
            verifyType,
            verifyContact,
            verifyCode,
            verifyLoading,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            codeSent,
            countdown,
            password,
            avatarFile,
            avatarPreview,
            uploadLoading,
            setEditing: setIsEditing,
            setEditedUser,
            setShowVerifyDialog,
            setVerifyType,
            setVerifyContact,
            setVerifyCode,
            setVerifyLoading,
            setCodeSent,
            setCountdown,
            setPassword,
            setAvatarFile,
            setAvatarPreview,
            setUploadLoading,
            resetEditState,
      } = useProfileStore();

      // 头像上传相关
      const fileInputRef = useRef<HTMLInputElement>(null);

      // 获取用户信息
      useEffect(() => {
            // 如果会话正在加载，不执行任何操作
            if (sessionStatus === "loading") {
                  setIsLoading(true);
                  return;
            }

            const fetchUserData = async () => {
                  try {
                        setIsLoading(true);
                        console.log("[前端DEBUG] 开始获取用户信息");

                        // 如果有NextAuth会话，先使用会话中的基本信息
                        if (session?.user) {
                              console.log(
                                    "[前端DEBUG] 使用NextAuth会话中的用户信息:",
                                    session.user,
                              );
                        }

                        // 无论是否有会话，都从API获取完整用户信息
                        const response = await fetch("/api/auth/user", {
                              credentials: "include", // 确保发送cookies，包括会话cookie
                        });
                        console.log(
                              "[前端DEBUG] API响应状态:",
                              response.status,
                              response.statusText,
                        );

                        if (!response.ok) {
                              const errorData = await response.json();
                              console.log(
                                    "[前端DEBUG] API错误响应:",
                                    errorData,
                              );
                              throw new Error(
                                    errorData.error || "获取用户信息失败",
                              );
                        }

                        const userData = await response.json();
                        console.log("[前端DEBUG] 获取到的用户数据:", userData);

                        const userInfo = {
                              id: userData._id,
                              name: userData.username,
                              email: userData.email,
                              phone: userData.phone,
                              avatar: userData.avatar,
                              role: userData.role,
                        };

                        setUser(userInfo);
                        setEditedUser({
                              name: userData.username,
                              email: userData.email,
                              phone: userData.phone,
                        });
                        console.log("[前端DEBUG] 用户数据已设置到状态");
                  } catch (err) {
                        setError(
                              err instanceof Error
                                    ? err.message
                                    : "获取用户信息失败",
                        );
                        console.error("[前端DEBUG] 获取用户信息失败:", err);
                  } finally {
                        setIsLoading(false);
                  }
            };

            fetchUserData();
      }, [
            session,
            sessionStatus,
            setUser,
            setIsLoading,
            setError,
            setEditedUser,
      ]);

      // 处理编辑表单变更
      const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const { name, value } = e.target;
            if (editedUser) {
                  setEditedUser({
                        ...editedUser,
                        [name]: value,
                  });
            }
      };

      // 发送验证码
      const sendVerificationCode = async () => {
            try {
                  setVerifyLoading(true);
                  const contact =
                        verifyType === "email"
                              ? editedUser?.email
                              : editedUser?.phone;

                  if (!contact) {
                        throw new Error(
                              `请先输入${verifyType === "email" ? "邮箱" : "手机号"}`,
                        );
                  }

                  setVerifyContact(contact);

                  const response = await fetch("/api/auth/verify-code", {
                        method: "POST",
                        headers: {
                              "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                              type: verifyType,
                              contact: contact,
                        }),
                  });

                  if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || "发送验证码失败");
                  }

                  setCodeSent(true);
                  setCountdown(60);

                  // 倒计时
                  const timer = setInterval(() => {
                        const newCountdown = countdown - 1;
                        if (newCountdown <= 0) {
                              clearInterval(timer);
                              setCountdown(0);
                        } else {
                              setCountdown(newCountdown);
                        }
                  }, 1000);

                  // 清理定时器
                  return () => clearInterval(timer);
            } catch (err) {
                  setError(
                        err instanceof Error ? err.message : "发送验证码失败",
                  );
                  console.error("发送验证码失败:", err);
            } finally {
                  setVerifyLoading(false);
            }
      };

      // 验证并保存更改
      const verifyAndSave = async () => {
            try {
                  setVerifyLoading(true);

                  if (!verifyCode) {
                        throw new Error("请输入验证码");
                  }

                  if (!password) {
                        throw new Error("请输入密码");
                  }

                  // 验证密码和验证码
                  const response = await fetch("/api/auth/update-profile", {
                        method: "POST",
                        headers: {
                              "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                              password,
                              verifyCode,
                              verifyType,
                              verifyContact,
                              userData: {
                                    username: editedUser?.name,
                                    email: editedUser?.email,
                                    phone: editedUser?.phone,
                              },
                        }),
                  });

                  if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || "更新个人信息失败");
                  }

                  const updatedData = await response.json();

                  // 更新本地状态
                  setUser({
                        ...user!,
                        name: updatedData.username,
                        email: updatedData.email,
                        phone: updatedData.phone,
                  });

                  setSuccess("个人信息更新成功");
                  setShowVerifyDialog(false);
                  setIsEditing(false);
                  setPassword("");
                  setVerifyCode("");

                  // 3秒后清除成功消息
                  setTimeout(() => setSuccess(null), 3000);
            } catch (err) {
                  setError(err instanceof Error ? err.message : "验证失败");
                  console.error("验证失败:", err);
            } finally {
                  setVerifyLoading(false);
            }
      };

      // 处理头像上传
      const handleAvatarClick = () => {
            fileInputRef.current?.click();
      };

      const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (!file) return;

            // 检查文件大小 (5MB限制)
            if (file.size > 5 * 1024 * 1024) {
                  setError("头像文件大小不能超过5MB");
                  return;
            }

            // 检查文件类型
            const validTypes = [
                  "image/jpeg",
                  "image/png",
                  "image/gif",
                  "image/webp",
            ];
            if (!validTypes.includes(file.type)) {
                  setError("只支持JPG、PNG、GIF和WEBP格式的图片");
                  return;
            }

            // 创建预览
            const reader = new FileReader();
            reader.onload = () => {
                  setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);

            setAvatarFile(file);
      };

      // 上传头像
      const uploadAvatar = async () => {
            if (!avatarFile) return;

            try {
                  // 检查用户认证状态
                  if (sessionStatus !== "authenticated" || !session?.user) {
                        throw new Error("请先登录");
                  }

                  setUploadLoading(true);
                  const formData = new FormData();
                  formData.append("avatar", avatarFile);

                  const response = await fetch("/api/auth/upload-avatar", {
                        method: "POST",
                        body: formData,
                  });

                  if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || "头像上传失败");
                  }

                  const data = await response.json();

                  // 更新用户头像
                  setUser({
                        ...user!,
                        avatar: data.avatarUrl,
                  });

                  // 更新session中的用户信息
                  await fetch("/api/auth/session", {
                        method: "PUT",
                        headers: {
                              "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                              user: {
                                    ...session.user,
                                    image: data.avatarUrl,
                              },
                        }),
                  });

                  setSuccess("头像上传成功");
                  setAvatarFile(null);
                  setAvatarPreview(null);

                  // 3秒后清除成功消息
                  setTimeout(() => setSuccess(null), 3000);

                  setUploadLoading(true);

                  console.log("[前端DEBUG] 开始上传头像");
                  const uploadFormData = new FormData();
                  uploadFormData.append("avatar", avatarFile);

                  console.log("[前端DEBUG] 文件信息:", {
                        name: avatarFile.name,
                        type: avatarFile.type,
                        size: avatarFile.size,
                  });

                  const uploadResponse = await fetch("/api/auth/upload-avatar", {
                        method: "POST",
                        body: uploadFormData,
                        credentials: "include", // 确保发送认证cookie
                  });

                  console.log(
                        "[前端DEBUG] 上传响应状态:",
                        uploadResponse.status,
                        uploadResponse.statusText,
                  );

                  if (!uploadResponse.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || "上传头像失败");
                  }

                  const uploadData = await uploadResponse.json();

                  // 更新用户头像
                  if (user) {
                        setUser({
                              ...user,
                              avatar: uploadData.avatarUrl,
                        });
                  }

                  setSuccess("头像更新成功");
                  setAvatarPreview(null);
                  setAvatarFile(null);

                  // 3秒后清除成功消息
                  setTimeout(() => setSuccess(null), 3000);
            } catch (err) {
                  setError(err instanceof Error ? err.message : "上传头像失败");
                  console.error("上传头像失败:", err);
            } finally {
                  setUploadLoading(false);
            }
      };

      // 取消头像上传
      const cancelAvatarUpload = () => {
            setAvatarPreview(null);
            setAvatarFile(null);
      };

      // 保存编辑
      const handleSave = () => {
            if (!editedUser) return;

            // 检查是否有变更
            const hasChanges =
                  user?.name !== editedUser.name ||
                  user?.email !== editedUser.email ||
                  user?.phone !== editedUser.phone;

            if (!hasChanges) {
                  setIsEditing(false);
                  return;
            }

            // 打开验证对话框
            setShowVerifyDialog(true);
      };

      // 取消编辑
      const handleCancel = () => {
            if (user) {
                  setEditedUser({
                        name: user.name,
                        email: user.email,
                        phone: user.phone,
                  });
            }
            setIsEditing(false);
            setError(null);
            resetEditState();
      };

      // 获取头像回退显示
      const getInitials = (name: string) => {
            return name ? name.charAt(0).toUpperCase() : "用";
      };

      if (isLoading) {
            return (
                  <div className="min-h-screen flex flex-col">
                        <StarryBackground />
                        <div className="flex-1 flex items-center justify-center p-4">
                              <Card className="w-full max-w-md mx-auto">
                                    <CardContent className="pt-6">
                                          <div className="flex justify-center items-center h-40">
                                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                                <p className="ml-2 text-lg">
                                                      加载中...
                                                </p>
                                          </div>
                                    </CardContent>
                              </Card>
                        </div>
                  </div>
            );
      }

      return (
            <div className="min-h-screen flex flex-col">
                  <StarryBackground />
                  <div className="flex-1 flex items-center justify-center p-4">
                        <div className="w-full max-w-3xl">
                              {error && (
                                    <Alert
                                          variant="destructive"
                                          className="mb-4"
                                    >
                                          <AlertCircle className="h-4 w-4" />
                                          <AlertDescription>
                                                {error}
                                          </AlertDescription>
                                    </Alert>
                              )}

                              {success && (
                                    <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
                                          <CheckIcon className="h-4 w-4" />
                                          <AlertDescription>
                                                {success}
                                          </AlertDescription>
                                    </Alert>
                              )}

                              <Tabs defaultValue="profile" className="w-full">
                                    <TabsList className="grid w-full grid-cols-2">
                                          <TabsTrigger value="profile">
                                                个人资料
                                          </TabsTrigger>
                                          <TabsTrigger value="avatar">
                                                头像设置
                                          </TabsTrigger>
                                    </TabsList>

                                    <TabsContent
                                          value="profile"
                                          className="mt-4"
                                    >
                                          <Card>
                                                <CardHeader className="pb-2">
                                                      <CardTitle className="text-2xl font-bold">
                                                            个人资料
                                                      </CardTitle>
                                                </CardHeader>
                                                <CardContent className="pt-4">
                                                      {user && (
                                                            <div className="flex flex-col space-y-4">
                                                                  {isEditing ? (
                                                                        <div className="w-full space-y-4">
                                                                              <div className="space-y-2">
                                                                                    <Label htmlFor="name">
                                                                                          用户名
                                                                                    </Label>
                                                                                    <Input
                                                                                          id="name"
                                                                                          name="name"
                                                                                          value={
                                                                                                editedUser?.name ||
                                                                                                ""
                                                                                          }
                                                                                          onChange={
                                                                                                handleInputChange
                                                                                          }
                                                                                    />
                                                                              </div>
                                                                              <div className="space-y-2">
                                                                                    <Label htmlFor="email">
                                                                                          电子邮箱
                                                                                    </Label>
                                                                                    <Input
                                                                                          id="email"
                                                                                          name="email"
                                                                                          type="email"
                                                                                          value={
                                                                                                editedUser?.email ||
                                                                                                ""
                                                                                          }
                                                                                          onChange={
                                                                                                handleInputChange
                                                                                          }
                                                                                    />
                                                                              </div>
                                                                              <div className="space-y-2">
                                                                                    <Label htmlFor="phone">
                                                                                          手机号码
                                                                                    </Label>
                                                                                    <Input
                                                                                          id="phone"
                                                                                          name="phone"
                                                                                          value={
                                                                                                editedUser?.phone ||
                                                                                                ""
                                                                                          }
                                                                                          onChange={
                                                                                                handleInputChange
                                                                                          }
                                                                                    />
                                                                              </div>
                                                                        </div>
                                                                  ) : (
                                                                        <div className="w-full space-y-4">
                                                                              <div className="flex flex-col space-y-1">
                                                                                    <p className="text-sm text-muted-foreground">
                                                                                          用户名
                                                                                    </p>
                                                                                    <p className="font-medium">
                                                                                          {
                                                                                                user.name
                                                                                          }
                                                                                    </p>
                                                                              </div>
                                                                              <div className="flex flex-col space-y-1">
                                                                                    <p className="text-sm text-muted-foreground">
                                                                                          电子邮箱
                                                                                    </p>
                                                                                    <p className="font-medium">
                                                                                          {user.email ||
                                                                                                "未设置"}
                                                                                    </p>
                                                                              </div>
                                                                              <div className="flex flex-col space-y-1">
                                                                                    <p className="text-sm text-muted-foreground">
                                                                                          手机号码
                                                                                    </p>
                                                                                    <p className="font-medium">
                                                                                          {user.phone ||
                                                                                                "未设置"}
                                                                                    </p>
                                                                              </div>
                                                                              <div className="flex flex-col space-y-1">
                                                                                    <p className="text-sm text-muted-foreground">
                                                                                          账户类型
                                                                                    </p>
                                                                                    <p className="font-medium">
                                                                                          {user.role ===
                                                                                          "admin"
                                                                                                ? "管理员"
                                                                                                : user.role ===
                                                                                                    "team"
                                                                                                  ? "团队成员"
                                                                                                  : "普通用户"}
                                                                                    </p>
                                                                              </div>
                                                                        </div>
                                                                  )}
                                                            </div>
                                                      )}
                                                </CardContent>
                                                <CardFooter className="flex justify-between">
                                                      {isEditing ? (
                                                            <>
                                                                  <Button
                                                                        variant="outline"
                                                                        onClick={
                                                                              handleCancel
                                                                        }
                                                                  >
                                                                        <XIcon className="mr-2 h-4 w-4" />
                                                                        取消
                                                                  </Button>
                                                                  <Button
                                                                        onClick={
                                                                              handleSave
                                                                        }
                                                                  >
                                                                        <CheckIcon className="mr-2 h-4 w-4" />
                                                                        保存
                                                                  </Button>
                                                            </>
                                                      ) : (
                                                            <Button
                                                                  className="w-full"
                                                                  onClick={() =>
                                                                        setIsEditing(
                                                                              true,
                                                                        )
                                                                  }
                                                            >
                                                                  <PencilIcon className="mr-2 h-4 w-4" />
                                                                  编辑资料
                                                            </Button>
                                                      )}
                                                </CardFooter>
                                          </Card>
                                    </TabsContent>

                                    <TabsContent
                                          value="avatar"
                                          className="mt-4"
                                    >
                                          <Card>
                                                <CardHeader className="pb-2">
                                                      <CardTitle className="text-2xl font-bold">
                                                            头像设置
                                                      </CardTitle>
                                                </CardHeader>
                                                <CardContent className="pt-4">
                                                      <div className="flex flex-col items-center space-y-6">
                                                            <div className="relative group">
                                                                  <Avatar className="h-32 w-32 cursor-pointer transition-all duration-300 group-hover:opacity-80">
                                                                        {avatarPreview ? (
                                                                              <AvatarImage
                                                                                    src={
                                                                                          avatarPreview
                                                                                    }
                                                                                    alt={
                                                                                          user?.name ||
                                                                                          "用户头像"
                                                                                    }
                                                                              />
                                                                        ) : user?.avatar ? (
                                                                              <AvatarImage
                                                                                    src={
                                                                                          user.avatar
                                                                                    }
                                                                                    alt={
                                                                                          user.name
                                                                                    }
                                                                              />
                                                                        ) : (
                                                                              <AvatarFallback className="text-4xl bg-primary text-primary-foreground">
                                                                                    {user
                                                                                          ? getInitials(
                                                                                                  user.name,
                                                                                            )
                                                                                          : "用"}
                                                                              </AvatarFallback>
                                                                        )}
                                                                  </Avatar>

                                                                  {!avatarPreview && (
                                                                        <div
                                                                              className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 cursor-pointer"
                                                                              onClick={
                                                                                    handleAvatarClick
                                                                              }
                                                                        >
                                                                              <Camera className="h-8 w-8 text-white" />
                                                                        </div>
                                                                  )}

                                                                  <input
                                                                        type="file"
                                                                        ref={
                                                                              fileInputRef
                                                                        }
                                                                        className="hidden"
                                                                        accept="image/jpeg,image/png,image/gif,image/webp"
                                                                        onChange={
                                                                              handleFileChange
                                                                        }
                                                                  />
                                                            </div>

                                                            {avatarPreview && (
                                                                  <div className="flex space-x-4">
                                                                        <Button
                                                                              variant="outline"
                                                                              onClick={
                                                                                    cancelAvatarUpload
                                                                              }
                                                                              disabled={
                                                                                    uploadLoading
                                                                              }
                                                                        >
                                                                              <XIcon className="mr-2 h-4 w-4" />
                                                                              取消
                                                                        </Button>
                                                                        <Button
                                                                              onClick={
                                                                                    uploadAvatar
                                                                              }
                                                                              disabled={
                                                                                    uploadLoading
                                                                              }
                                                                        >
                                                                              {uploadLoading ? (
                                                                                    <>
                                                                                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                                          上传中...
                                                                                    </>
                                                                              ) : (
                                                                                    <>
                                                                                          <CheckIcon className="mr-2 h-4 w-4" />
                                                                                          确认上传
                                                                                    </>
                                                                              )}
                                                                        </Button>
                                                                  </div>
                                                            )}

                                                            {!avatarPreview && (
                                                                  <div className="text-center text-sm text-muted-foreground">
                                                                        <p>
                                                                              点击头像更换图片
                                                                        </p>
                                                                        <p className="mt-1">
                                                                              支持JPG、PNG、GIF和WEBP格式，文件大小不超过5MB
                                                                        </p>
                                                                  </div>
                                                            )}
                                                      </div>
                                                </CardContent>
                                          </Card>
                                    </TabsContent>
                              </Tabs>
                        </div>
                  </div>

                  {/* 验证对话框 */}
                  <Dialog
                        open={showVerifyDialog}
                        onOpenChange={setShowVerifyDialog}
                  >
                        <DialogContent>
                              <DialogHeader>
                                    <DialogTitle>验证身份</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                          <Label htmlFor="password">
                                                当前密码
                                          </Label>
                                          <Input
                                                id="password"
                                                type="password"
                                                value={password}
                                                onChange={(e) =>
                                                      setPassword(
                                                            e.target.value,
                                                      )
                                                }
                                                placeholder="请输入当前密码"
                                          />
                                    </div>

                                    <div className="space-y-2">
                                          <div className="flex justify-between items-center">
                                                <Label>验证方式</Label>
                                                <div className="flex space-x-2">
                                                      <Button
                                                            variant={
                                                                  verifyType ===
                                                                  "email"
                                                                        ? "default"
                                                                        : "outline"
                                                            }
                                                            size="sm"
                                                            onClick={() =>
                                                                  setVerifyType(
                                                                        "email",
                                                                  )
                                                            }
                                                            disabled={
                                                                  !editedUser?.email
                                                            }
                                                      >
                                                            邮箱验证
                                                      </Button>
                                                      <Button
                                                            variant={
                                                                  verifyType ===
                                                                  "phone"
                                                                        ? "default"
                                                                        : "outline"
                                                            }
                                                            size="sm"
                                                            onClick={() =>
                                                                  setVerifyType(
                                                                        "phone",
                                                                  )
                                                            }
                                                            disabled={
                                                                  !editedUser?.phone
                                                            }
                                                      >
                                                            手机验证
                                                      </Button>
                                                </div>
                                          </div>

                                          <div className="flex space-x-2">
                                                <Input
                                                      value={verifyCode}
                                                      onChange={(e) =>
                                                            setVerifyCode(
                                                                  e.target
                                                                        .value,
                                                            )
                                                      }
                                                      placeholder="请输入验证码"
                                                />
                                                <Button
                                                      variant="outline"
                                                      onClick={
                                                            sendVerificationCode
                                                      }
                                                      disabled={
                                                            verifyLoading ||
                                                            countdown > 0
                                                      }
                                                >
                                                      {verifyLoading ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                      ) : countdown > 0 ? (
                                                            `${countdown}秒后重试`
                                                      ) : (
                                                            "获取验证码"
                                                      )}
                                                </Button>
                                          </div>
                                    </div>
                              </div>
                              <div className="flex justify-end space-x-2">
                                    <Button
                                          variant="outline"
                                          onClick={() =>
                                                setShowVerifyDialog(false)
                                          }
                                          disabled={verifyLoading}
                                    >
                                          取消
                                    </Button>
                                    <Button
                                          onClick={verifyAndSave}
                                          disabled={
                                                verifyLoading ||
                                                !verifyCode ||
                                                !password
                                          }
                                    >
                                          {verifyLoading ? (
                                                <>
                                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                      验证中...
                                                </>
                                          ) : (
                                                "确认修改"
                                          )}
                                    </Button>
                              </div>
                        </DialogContent>
                  </Dialog>
            </div>
      );
};

export default ProfilePage;
