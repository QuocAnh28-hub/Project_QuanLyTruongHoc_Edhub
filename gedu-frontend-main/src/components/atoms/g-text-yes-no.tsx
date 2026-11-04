import { Flex, Typography } from "antd";
import { TextProps } from "antd/lib/typography/Text";
import { ReactNode } from "react";
import NoDataText from "./no-data-text";
import { CheckCircleOutlined, CloseCircleOutlined } from "./svg/outlined-icons";
import GText from "./g-text";

const { Text } = Typography
interface Props {
    children?: ReactNode
    empty_message?: string
}
export default function GTextYesNo(props: Props & TextProps) {
    if (props.children == 0 || props.children)
        return <Text>
            {props.children ?
                <Flex gap={4} align="center">
                    <CheckCircleOutlined size={20} fill='var(--success)' />
                    <GText>Có</GText>
                </Flex> :
                <Flex gap={4} align="center">
                    <CloseCircleOutlined size={20} fill='var(--error)' />
                    <GText>Không</GText>
                </Flex>}
        </Text>
    return <NoDataText>{props.empty_message || 'Không có thông tin'}</NoDataText>
}