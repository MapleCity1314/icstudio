import React from "react";
import { Cpu, Shield, Zap, MessageSquare } from "lucide-react";

// 功能特性部分
export const FeatureSection = () => {
      const features = [
            {
                  icon: <Cpu className="h-8 w-8 text-blue-400" />,
                  title: "高效性能",
                  description: "基于最新技术构建，确保软件运行流畅，资源占用低",
            },
            {
                  icon: <Shield className="h-8 w-8 text-green-400" />,
                  title: "安全保障",
                  description: "内置多层安全防护，保障数据安全，防止未授权访问",
            },
            {
                  icon: <Zap className="h-8 w-8 text-yellow-400" />,
                  title: "快速响应",
                  description: "独特的设计确保软件操作响应迅速，提升用户体验",
            },
      ];

      return (
            <div className="w-full max-w-6xl mx-auto px-4">
                  <h2 className="text-3xl md:text-5xl font-bold text-center text-white mb-12 tracking-tight">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-400">
                              强大功能，简单使用
                        </span>
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 max-w-5xl mx-auto">
                        {features.map((feature, index) => (
                              <div
                                    key={index}
                                    className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 md:p-8 shadow-xl hover:bg-white/10 transition-all duration-500 border border-white/10 group"
                              >
                                    <div className="flex items-center justify-center h-16 md:h-20 w-16 md:w-20 bg-indigo-900/50 rounded-xl mb-6 md:mb-8 mx-auto group-hover:scale-110 transition-transform duration-300 border border-indigo-500/30">
                                          {feature.icon}
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-semibold text-center text-white mb-3 md:mb-4">
                                          {feature.title}
                                    </h3>
                                    <p className="text-gray-300 text-center">
                                          {feature.description}
                                    </p>
                              </div>
                        ))}
                  </div>
            </div>
      );
};

// 关于我们部分
export const AboutSection = () => {
      return (
            <div className="w-full max-w-4xl mx-auto px-4">
                  <div className="backdrop-blur-md bg-white/5 rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl">
                        <h2 className="text-3xl md:text-5xl font-bold text-center text-white mb-8 md:mb-10 tracking-tight">
                              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-400">
                                    关于我们
                              </span>
                        </h2>
                        <div className="text-center">
                              <p className="text-gray-200 mb-6 text-base md:text-lg leading-relaxed">
                                    我们是一家致力于创新科技产品开发的团队，专注于为用户提供简单、高效、安全的软件解决方案。
                              </p>
                              <p className="text-gray-200 mb-6 text-base md:text-lg leading-relaxed">
                                    Loome
                                    是我们的旗舰产品，融合了团队多年的技术积累与用户体验研究，旨在为用户提供卓越的使用体验。
                              </p>
                              <p className="text-gray-200 text-base md:text-lg leading-relaxed">
                                    我们相信，科技应该让生活变得更简单，而不是更复杂。这是我们开发
                                    Loome 的核心理念。
                              </p>
                        </div>
                  </div>
            </div>
      );
};

// 常见问题部分
export const FaqSection = () => {
      const faqs = [
            {
                  question: "Loome 是免费软件吗？",
                  answer: "Loome 提供基础版免费使用，高级功能需要付费升级。我们相信为优质功能支付合理费用是双赢的选择。",
            },
            {
                  question: "Loome 支持哪些操作系统？",
                  answer: "目前 Loome 主要支持 Windows 10 及以上的 64 位系统。我们计划在未来支持 macOS 和 Linux 系统。",
            },
            {
                  question: "如何获取技术支持？",
                  answer: "您可以通过我们的官方网站提交支持请求，或者发送邮件至 support@loome.com。我们的支持团队会在 24 小时内回复您。",
            },
            {
                  question: "是否支持离线使用？",
                  answer: "是的，Loome 支持完全离线使用。某些云同步功能需要网络连接，但核心功能不受影响。",
            },
      ];

      return (
            <div className="w-full max-w-4xl mx-auto px-4">
                  <h2 className="text-3xl md:text-5xl font-bold text-center text-white mb-10 md:mb-16 tracking-tight">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-400">
                              常见问题
                        </span>
                  </h2>

                  <div className="space-y-6 md:space-y-8">
                        {faqs.map((faq, index) => (
                              <div
                                    key={index}
                                    className="bg-white/5 backdrop-blur-md rounded-xl p-5 md:p-6 hover:bg-white/10 transition-all duration-300 border border-white/10 shadow-lg transform hover:-translate-y-1"
                              >
                                    <div className="flex items-start">
                                          <MessageSquare className="h-6 md:h-7 w-6 md:w-7 text-blue-400 mt-1 mr-3 md:mr-4 flex-shrink-0" />
                                          <div>
                                                <h3 className="text-lg md:text-xl font-semibold text-white mb-2 md:mb-3">
                                                      {faq.question}
                                                </h3>
                                                <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                                                      {faq.answer}
                                                </p>
                                          </div>
                                    </div>
                              </div>
                        ))}
                  </div>
            </div>
      );
};
