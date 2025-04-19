
/**
 * @description 数据埋点hooks 使用Beacon API 发送数据
 * @author maplecity 1314
 * @date 2025-04-184
 */

import { useEffect, useState } from "react"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useTracking = (eventname: string, eventdata: any) => {

        useEffect(() => {
                if (typeof window !== 'undefined') {
                        window.dataLayer = window.dataLayer || [];
                        window.dataLayer.push({ event: eventname, ...eventdata });
                }
        }, [eventname, eventdata]);
}
