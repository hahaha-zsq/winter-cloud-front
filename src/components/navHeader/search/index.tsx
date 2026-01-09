import {Input, Modal, Tooltip} from "antd";
import {Icon} from "@iconify/react";
import "../index.less"
import {useState} from "react";
import Empty from "@/components/empty";

const Search = () => {
	const [open, setOpen] = useState(false);
	const [menuArr, setMenuArr] = useState([]);
	const hideModal = () => {
		setOpen(false);
	};
	const showModal = () => {
		setOpen(true);
	};
	return (
		<>
			<Tooltip placement="top">
				<div className="theme" onClick={showModal}>
					<Icon icon="ant-design:search-outlined" className="text-xl"/>
				</div>
			</Tooltip>

			<Modal
				closable={false}
				width={'50%'}
				title={
					<Input className="w-full" placeholder={"搜索"}/>}
				keyboard={true}
				open={open}
				onCancel={hideModal}
				footer={
					<div className="flex items-center justify-start flex-wrap">
          <span className="mr-[14px] flex items-center">
						<Icon icon="material-symbols:keyboard-return" className="searchIcon text-[25px] p-[2px] mr-[6px]"/>
						<span className="font-stone text-[18px]">{}</span>
          </span>
						<span className="mr-[14px] flex items-center">
						<Icon icon="mdi:arrow-up-thin" className="searchIcon text-[25px] p-[2px] mr-[6px]"/>
						<Icon icon="mdi:arrow-down-thin" className="searchIcon text-[25px] p-[2px] mr-[6px]"/>
								<span className="font-stone text-[18px]">{}</span>
          </span>
						<span className="flex items-center">
						<Icon icon="mdi:keyboard-esc" className="searchIcon text-[25px] p-[2px] mr-[6px]"/>
            <span className="font-stone text-[18px]">{"关闭"}</span>
          </span>
					</div>
				}
			>
				{
					menuArr
						?
						<div className="min-h-[250px] flex items-center justify-center">
							<Empty/>
						</div>
						:
						<div className="min-h-[250px]">
							<div></div>
						</div>

				}
			</Modal>
		</>
	)
}

export default Search
