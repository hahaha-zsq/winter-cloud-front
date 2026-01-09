import {Dropdown} from "antd";
import {Icon} from "@iconify/react";
import "../index.less"
import {useStore} from "@/store";
import {UNLanguagesEnum} from "@/types/enum";

const Language = () => {
    const configuration = useStore(state => state.configuration);
    const action = useStore(state => state.actions)
    const {language} = {...configuration};


    const handleSwitch = (lang: string) => {
        action.setConfiguration({
            ...configuration,
            language: lang as UNLanguagesEnum
        })
    };

    const items = [
        {
            key: UNLanguagesEnum.ENGLISH,
            label: <div className={"flex items-center gap-2"}>
                <Icon icon="flag:sh-4x3" className="text-xl"/>
                <div>English</div>
            </div>,
            onClick: () => handleSwitch(UNLanguagesEnum.ENGLISH)
        },
        {
            key: UNLanguagesEnum.SPANISH,
            label: <div className={"flex items-center gap-2"}>
                <Icon icon="flag:es-4x3" className="text-xl"/>
                <div>Español</div>
            </div>,
            onClick: () => handleSwitch(UNLanguagesEnum.SPANISH)
        },
        {
            key: UNLanguagesEnum.CHINESE,
            label: <div className={"flex items-center gap-2"}>
                <Icon icon="flag:cn-4x3" className="text-xl"/>
                <div>中文</div>
            </div>,
            onClick: () => handleSwitch(UNLanguagesEnum.CHINESE)
        },
        {
            key: UNLanguagesEnum.FRENCH,
            label: <div className={"flex items-center gap-2"}>
                <Icon icon="flag:fr-4x3" className="text-xl"/>
                <div>Français</div>
            </div>,
            onClick: () => handleSwitch(UNLanguagesEnum.FRENCH)
        },
        {
            key: UNLanguagesEnum.RUSSIAN,
            label: <div className={"flex items-center gap-2"}>
                <Icon icon="flag:ru-4x3" className="text-xl"/>
                <div>Русский</div>
            </div>,
            onClick: () => handleSwitch(UNLanguagesEnum.RUSSIAN)
        },
        {
            key: UNLanguagesEnum.ARABIC,
            label: <div className={"flex items-center gap-2"}>
                <Icon icon="flag:arab-4x3" className="text-xl"/>
                <div>العربية</div>
            </div>,
            onClick: () => handleSwitch(UNLanguagesEnum.ARABIC)
        }
    ];

    return (
        <Dropdown menu={{
            items,
            selectedKeys: [language]
        }} placement="bottom" arrow={{pointAtCenter: true}}>
            <div className="theme">
                <Icon icon="tabler:language-hiragana" className="text-xl"/>
            </div>
        </Dropdown>
    );
};

export default Language;
