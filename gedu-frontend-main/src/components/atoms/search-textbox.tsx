import { Input } from "antd";
import { SearchProps } from "antd/lib/input";
import { useSearchParams } from "react-router-dom";
import debounce from "../../utils/debounce";

interface Props {
  placeholder?: string,
  callback?: (_query: string) => void
}
const { Search } = Input
const QUERY_KEY = 'q'
export default function SearchTextBox({ placeholder, callback, ...more }: Props & SearchProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  function handleSearchChange(_value: string) {
    if (_value)
      setSearchParams(
        (prevSearchParams) => {
          prevSearchParams.set(QUERY_KEY, _value);
          return prevSearchParams;
        })
    else
      setSearchParams(
        (prevSearchParams) => {
          prevSearchParams.delete(QUERY_KEY);
          return prevSearchParams;
        });
    callback?.(_value)
  }
  const debouncedSearch = debounce(handleSearchChange, 700);
  return <Search
    {...more}
    allowClear
    defaultValue={searchParams.get(QUERY_KEY) || ''}
    style={{ maxWidth: 482 }}
    placeholder={placeholder}
    onChange={(e) => { debouncedSearch(e.target.value) }}
  />
}