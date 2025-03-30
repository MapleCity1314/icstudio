
interface teamInfo {
        quote: string;
        name: string;
        designation: string;
        src: string;
}

export const team: teamInfo[] = [
        {
                quote: "扫地机器人",
                name: "巴巴博一 ",
                designation:
                        "掌握视频剪辑全流程（剪映专业版），可独立完成短视频制作与包装  \n" +
                        "熟练使用PS完成海报设计、图片精修及基础平面设计  \n" +
                        "具备Excel数据处理能力（VLOOKUP/数据透视表/图表制作） \n " +
                        "快速学习能力：2周内自学掌握剪映专业版特效功能",
                src: "/teamAvatar/bababoy.png",
        },
        {
                quote: "团队创始人",
                name: "枫城城",
                designation: "团队创始人，同时也是团队中的前端开发，主要使用Vue，React，Next.js",
                src: "/teamAvatar/boybaba.png",
        }
];
