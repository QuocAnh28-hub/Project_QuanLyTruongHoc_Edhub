import { Avatar, Flex } from "antd"
import { Link } from "react-router-dom"
import { ToAvatarLetters, ToFullNameByLocale } from "../../utils/locale-helpers"
import GText from "../atoms/g-text"

interface Props {
  firstName?: string,
  lastName?: string,
  avatar?: string,
  code?: string,
  link?: string
}
export default function NameCardSimple({ firstName, lastName, avatar, code, link }: Props) {
  return <Flex gap={16} align="center">
    <Avatar size={32} src={avatar}>{ToAvatarLetters(firstName, lastName)}</Avatar>
    <Flex vertical>
      <GText>{ToFullNameByLocale(firstName, lastName)}</GText>
      {link ?
        <Link to={link}>
          {code}
        </Link> : code
      }
    </Flex>
  </Flex>
}