import { debounce } from "@/libs/functions";
import React, { useCallback, useEffect, useState } from "react";
import { useProgress } from "@/components/Progress";

// option type
export type OptionType = {
    label: string;
    value: string;
}

// define auto complete option type
export type AutoCompleteOptions = {
    id?: string,
    rowid?: string;
    name?: string,
    value?: string,
    type?: string,
    searchField?: string,
    descriptionField?: string,
    endpoint?: string,
    method?: string,
    required?: boolean,
    pattern?: string,
    placeholder?: string,//
    className?: string,
    onSelected?: (item: any, element: any) => void,//
    onAddNew?: (value: any, element: any) => void,
    onChange?: (value: any, element: any) => void,
    onClear?: () => void
    optionItems?: string[];//
    size?: "sm" | "md" | "lg" | undefined;
    rounded?: "sm" | "md" | "lg" | undefined;
    multipleSelect?: boolean
}

export default function Autocomplete({ optionItems = [], ...props }: AutoCompleteOptions) {
    const { showProgress } = useProgress();

    const [value, setValue] = useState<string>("");
    const [multiValue, setMultiValue] = useState<string[]>([]);
    const [options, setOptions] = useState(optionItems);
    const [top, setTop] = useState<string>("38px");
    const [bottom, setBottom] = useState<string>("auto");
    const [results, setResults] = useState<any>([]);
    const [query, setQuery] = useState<string>("");
    const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
    const [selection, setSelection] = useState<any>({ selectionMode: false, selectedIndex: -1 });

    // manage multiple key strokes
    const getItems = useCallback(debounce(async (query: string, callback: Function) => {
        // if not empty
        if (query.trim() != "" && query.trim().length >= 3) {
            // activate form Progress
            showProgress(true);

            // call api
            // const response = await fetch(`${props.endpoint}?${props.searchField}=${query}&size=8`, { method: props.method ?? "GET" });

            // get response data
            // const data = await response.json();

            // set search result
            // setResults(data.results);

            // callback with results
            // if (typeof callback === "function") callback(data.results);

            // on time out
            setTimeout(() => {
                // activate form Progress
                showProgress(false);
            }, 500);
        }
    }, 500), [])

    function isVisible(element: HTMLElement) {
        // get element rect
        const rect = element.getBoundingClientRect();

        // check is visible
        return rect.top + rect.height + 4.5 + 309 <= (window.innerHeight || document.documentElement.clientHeight);
    }

    function onMouseDown(e: any) {
        e.preventDefault();
    }

    function onChange(e: any) {
        if (e.key != "Enter") {
            // check for empty value
            if (e.target.value.trim() != "") {
                // prevent from submit
                e.preventDefault();

                // check visibility
                if (isVisible(e.target)) {
                    // set top
                    setTop("38px");

                    // set bottom
                    setBottom("auto");
                } else {
                    // set top
                    setTop("auto");

                    // set bottom
                    setBottom("38px");
                }

                // Open dropdown on input
                setShowSuggestions(true)

                // get items
                getItems(e.target.value);
            } else {
                // reset search result
                setOptions([]);

                // on clear
                if (typeof props.onClear === "function") props.onClear();
            }

            // on change
            if (typeof props.onChange === "function") props.onChange(e.target.value, e);

            // set value
            setValue(e.target.value);

            // set query
            setQuery(e.target.value);
        }
    }

    function onFocus(e: any) {
        // if result
        if (options.length) {
            // check visibility
            if (isVisible(e.target)) {
                // set top
                setTop("38px");

                // set bottom
                setBottom("auto");
            } else {
                // set top
                setTop("auto");

                // set bottom
                setBottom("38px");
            }

            // show suggestions
            setShowSuggestions(true);

            // Open dropdown on input
            // setIsDropdownOpen(true);
        }
    }

    function onBlur(e: any) {
        // hide suggestions
        setShowSuggestions(false);
    }

    function onSelection(e: any) {
        // e.preventDefault();

        // get selected item
        let selectedItem = options[selection.selectedIndex];

        // if mobile selection
        if (selection.selectedIndex == -1) {

            // get selected index
            const filteredOptions: string[] = options.filter((option: string) => {
                option.toLowerCase().includes(value.toLowerCase());

                // get text
                let text = query;

                // remove white spaces and make it uppercase            
                text = text.trim().replace(/\s+/g, ' ').toUpperCase();

                // find the index
                const index = option.toUpperCase().indexOf(text);

                // return state
                return index >= 0 ? true : false;
            })
            selectedItem = filteredOptions[e];

            if (props.multipleSelect) {
                // add tag
                setMultiValue((prev: any) => [...prev, selectedItem]);
                // reset input
                setQuery("");

            }

            setValue(selectedItem)
            setQuery(selectedItem)
        }

        // on get selected
        if (typeof props.onSelected === "function") props.onSelected(selectedItem, e);

        // reset search result
        setOptions(optionItems);

        // update selection
        setSelection({
            selectedIndex: -1,
            selectionMode: false
        });
    }

    //select value from keyboard
    function onKeyDown(e: any) {
        if (e.key == "Enter") {
            // prevent from submit
            e.preventDefault();

            // if selection on enter
            if (selection.selectedIndex > -1) {
                // get selected item
                const selectedItem = options.filter((option: string) => {
                    option.toLowerCase().includes(value.toLowerCase());

                    // get text
                    let text = query;

                    // remove white spaces and make it uppercase            
                    text = text.trim().replace(/\s+/g, ' ').toUpperCase();

                    // find the index
                    const index = option.toUpperCase().indexOf(text);

                    // return state
                    return index >= 0 ? true : false;
                })[selection.selectedIndex];

                setValue(selectedItem)
                setQuery(selectedItem)

                // on get selected
                if (typeof props.onSelected === "function") props.onSelected(selectedItem, e);

                // reset search result
                setOptions(optionItems);

                // update selection
                setSelection({
                    selectedIndex: -1,
                    selectionMode: false
                });
            } else {
                // get items
                getItems(e.target.value, (items: any) => {
                    // on add new item
                    if (typeof props.onAddNew === "function" && selection.selectedIndex == -1) props.onAddNew(e.target.value, e);
                });
            }
        } else if (e.key == "ArrowDown") {
            console.log("ArrowDown")

            console.log(selection.selectedIndex)
            console.log(options.length)

            // prevent from submit
            e.preventDefault();

            // update selection
            setSelection({
                selectedIndex: options.length === 0 ? -1 : (selection.selectedIndex + 1) % options.length,
                selectionMode: true
            });
            console.log()
        } else if (e.key == "ArrowUp") {
            console.log("ArrowUp")
            // prevent from submit
            e.preventDefault();

            // update selection
            setSelection({
                selectedIndex: selection.selectedIndex <= 0 ? options.length - 1 : selection.selectedIndex - 1,
                selectionMode: true
            });
        } else if (e.key == "Escape") {
            console.log("Escape")
            // prevent from submit
            e.preventDefault();

            // update selection
            setSelection({
                selectedIndex: -1,
                selectionMode: false
            });
        } else {
            // update selection
            setSelection({
                selectedIndex: -1,
                selectionMode: false
            });
        }
    }

    //highlight entered alphabet(s)
    function highlight(content: string, text: string) {
        // if defined
        if (typeof content !== "undefined") {
            // remove white spaces
            content = content.trim().replace(/\s+/g, ' ');

            // remove white spaces and make it uppercase
            text = text.trim().replace(/\s+/g, ' ').toUpperCase();

            // find the index
            const index = content.toUpperCase().indexOf(text);

            // if index found
            if (index >= 0) {
                // create highlited content
                return <span>{content.substring(0, index)}<mark>{content.substring(index, index + text.length)}</mark>{content.substring(index + text.length)}</span>
            } else {
                // return original content 
                return content;
            }
        }
    }

    useEffect(() => {
        // set query
        if (value.length == 0) setQuery("");

        // show hide suggestions
        setShowSuggestions(value.length ? true : false);
    }, [value])

    useEffect(() => {
        // set value
        setValue(props.value ?? "")
    }, [props.value])

    const handleSelect = (movie: string) => {
        setMultiValue((prev: any) => [...prev, movie]); // add tag
        setQuery(""); // reset input
    };

    const removeTag = (index: number) => {
        multiValue.splice(index,1)
        setMultiValue((multiValue: any) => (multiValue.filter((opt: any) => opt.index !== index)));

        console.log(multiValue.filter((opt: any) => opt.index !== index))
    };

    return (
        <div className="relative">
            <div className="flex flex-wrap items-center gap-2 rounded p-2">
                {multiValue.map((option: string, index: number) => (
                    <span
                        key={option}
                        className="px-2 py-1 bg-blue-500 text-white rounded-md flex items-center gap-1"
                    >
                        {option}
                        <button onClick={() => removeTag(index)}>×</button>
                    </span>
                ))}
                <input
                    type={props.type ?? "search"}
                    placeholder={props.placeholder}
                    value={value ?? multiValue}
                    onKeyDown={onKeyDown}          
                    onClick={onFocus}
                    onChange={onChange}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    className="w-1/2 p-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            {!props.multipleSelect && showSuggestions && options.length > 0 && (
                <ul className={`absolute z-10 w-1/2 rounded-md mt-1 shadow-lg max-h-60 overflow-y-auto ${showSuggestions ? " show" : ""}`} onMouseDown={onMouseDown}>
                    {options
                        .filter((option: string) => {
                            option.toLowerCase().includes(value.toLowerCase());

                            // get text
                            let text = query;

                            // remove white spaces and make it uppercase            
                            text = text.trim().replace(/\s+/g, ' ').toUpperCase();

                            // find the index
                            const index = option.toUpperCase().indexOf(text);

                            // return state
                            return index >= 0 ? true : false;
                        })
                        .map((option: string, index: number) => (
                            <li
                                key={option}
                                className={`p-2 cursor-pointer hover:bg-gray-600 ${index == selection.selectedIndex ? "bg-gray-600" : ""}`}
                                onClick={() => onSelection(index)}
                            >
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-300"> * </span>
                                    <p className="pe-none">{highlight(option, query)}</p>
                                </div>
                            </li>
                        ))}
                </ul>
            )}
            {props.multipleSelect && showSuggestions && options.length > 0 && (
                <ul className={`absolute z-10 w-1/2 rounded-md mt-1 shadow-lg max-h-60 overflow-y-auto ${showSuggestions ? " show" : ""}`} onMouseDown={onMouseDown}>

                    {options.filter((option: string) => {
                        option.toLowerCase().includes(value.toLowerCase());

                        // get text
                        let text = query;

                        // remove white spaces and make it uppercase            
                        text = text.trim().replace(/\s+/g, ' ').toUpperCase();

                        // find the index
                        const index = option.toUpperCase().indexOf(text);

                        // return state
                        return index >= 0 ? true : false;
                    }).map((option: string, index: number) => (
                        <li
                            key={option}
                            className={`p-2 cursor-pointer hover:bg-gray-600 ${index == selection.selectedIndex ? "bg-gray-600" : ""}`}
                            onClick={() => handleSelect(option)}
                        >
                            <p className="pe-none">{highlight(option, query)}</p>
                        </li>
                    ))}

                </ul>
            )}
        </div>
    )
}
