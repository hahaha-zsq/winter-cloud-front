import AntdGlobal from "@/components/antdGlobal";
import {useRef} from "react";
import AuthPage from "@/views/AuthPage";
import NotFoundFC from "@/views/404";
import ForbiddenPageFC from "@/views/403";
import BadGatewayFC from "@/views/502";
import AdminLoader from "@/components/loading";
import {DynamicRouterFC} from "@/router";


function App() {
    const ref = useRef(null);
    return (
        <>
            <div ref={ref} className="h-full">
                    {/*这个是一个空组件，目的是解决消息组件在js文件中出现不能消费主题token的警告*/}
                    <AntdGlobal/>
                    <div className="h-full" ref={ref}>
                        {/*<AdminLoader*/}
                        {/*    theme="light"*/}
                        {/*    color="#ef4444" // 红色*/}
                        {/*    text="页面加载中。。。。"*/}
                        {/*    subText="请稍等..."*/}
                        {/*/>*/}
                        <DynamicRouterFC/>
                        {/*<AuthPage/>*/}
                        {/*<NotFoundFC/>*/}
                        {/*<ForbiddenPageFC/>*/}
                        {/*<BadGatewayFC/>*/}
                    </div>
            </div>
        </>
    )
}

export default App
