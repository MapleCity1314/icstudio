import Image from 'next/image';
import { projects } from '../../_components/server/projects-server';
import { Card } from '@/components/ui/card';

// 几何形状组件
interface GeometricShapeProps {
      className?: string;
      style?: React.CSSProperties;
      type?: 'circle' | 'triangle' | 'hexagon' | 'diamond';
}

const GeometricShape = ({ className = '', style = {}, type = 'circle' }: GeometricShapeProps) => {
      const shapes = {
            circle: <div className={`rounded-full ${className}`} style={style}></div>,
            triangle: (
                  <div
                        className={`${className}`}
                        style={{
                              ...style,
                              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                        }}
                  ></div>
            ),
            hexagon: (
                  <div
                        className={`${className}`}
                        style={{
                              ...style,
                              clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
                        }}
                  ></div>
            ),
            diamond: (
                  <div
                        className={`${className}`}
                        style={{
                              ...style,
                              clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                        }}
                  ></div>
            ),
      };

      return shapes[type];
};

// 静态项目卡片内容
export function ProjectCardContent({ project, index, theme }: { 
      project: typeof projects[0];
      index: number;
      theme: string; 
}) {
      return (
            <Card
                  className={`relative overflow-hidden rounded-xl ${
                        theme === 'dark' ? 'bg-gray-800/80' : 'bg-white/90'
                  } shadow-2xl backdrop-blur-sm border-0 min-h-[400px]`}
            >
                  {/* 背景图形装饰 */}
                  <div className="absolute -right-12 -top-12 z-0 opacity-20">
                        <GeometricShape 
                              type={['circle', 'triangle', 'hexagon', 'diamond'][index % 4] as 'circle' | 'triangle' | 'hexagon' | 'diamond'} 
                              className={`w-32 h-32 bg-gradient-to-r ${project.color}`} 
                        />
                  </div>
                  <div className="absolute -left-6 -bottom-6 z-0 opacity-20">
                        <GeometricShape 
                              type={['diamond', 'hexagon', 'triangle', 'circle'][(index + 2) % 4] as 'circle' | 'triangle' | 'hexagon' | 'diamond'} 
                              className={`w-20 h-20 bg-gradient-to-r ${project.color}`} 
                        />
                  </div>

                  {/* 项目状态标签 */}
                  <div className={`absolute top-4 right-4 z-10 px-3 py-1 text-xs font-semibold rounded-full
                        ${project.state === '已上线' 
                              ? 'bg-green-500/20 text-green-500 border border-green-500/30' 
                              : 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30'}`}>
                        {project.state}
                  </div>

                  {/* 项目主图 */}
                  <div className={`relative h-44 bg-gradient-to-r ${project.color} overflow-hidden`}>
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                              <Image
                                    src={project.imageUrl || '/placeholder.svg'}
                                    alt={project.title}
                                    width={400}
                                    height={300}
                                    className="w-full h-full object-cover opacity-90"
                              />
                        </div>
                  </div>

                  {/* 项目内容 */}
                  <div className="p-6 z-10 relative">
                        {/* 标题 */}
                        <h3 className={`text-xl font-bold mb-2 ${
                              theme === 'dark' ? 'text-white' : 'text-gray-800'
                        }`}>
                              {project.title}
                        </h3>
                        
                        {/* 标签 */}
                        <div className="flex flex-wrap gap-2 mb-3">
                              {project.tags?.map((tag, idx) => (
                                    <span key={idx} 
                                          className={`text-xs px-2 py-1 rounded-full ${
                                                theme === 'dark' 
                                                      ? 'bg-gray-700 text-gray-300' 
                                                      : 'bg-gray-200 text-gray-700'
                                          }`}>
                                          {tag}
                                    </span>
                              ))}
                        </div>
                        
                        {/* 描述 */}
                        <p className={`${
                              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                        } text-sm line-clamp-3 mb-4`}>
                              {project.description}
                        </p>
                  </div>
            </Card>
      );
}

// 获取项目数据的服务器函数
export function getProjects() {
      return projects;
} 