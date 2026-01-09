import {Modal, Tooltip} from "antd";
import {Icon} from "@iconify/react";
import "../index.less"
import { useState} from "react";


const Notify = () => {
	const [visible, setVisible] = useState(false)
	return (
		<>
		<Tooltip placement="top">
			<div className="theme" onClick={()=>setVisible(true)}>
				<Icon icon="ant-design:notification-outlined" className="text-xl"/>
			</div>
		</Tooltip>

			<Modal
				title={"通知"}
				width={'50%'}
				open={visible}
				onCancel={() => {
					setVisible(false);
				}}
				footer={null}
				closable={false}
			>
				<div>
					<h1>WebSocket Chat</h1>
				</div>
			</Modal>
		</>

	)
}

export default Notify
