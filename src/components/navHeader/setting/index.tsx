import {Icon} from "@iconify/react";
import {Tooltip} from "antd";

const Setting = () => {
    return(
        <>
            <Tooltip placement="top">
                <div className="theme">
                    <Icon icon="ant-design:setting-outlined" className="text-xl"/>
                </div>
            </Tooltip>
        </>
    )
}
export default Setting