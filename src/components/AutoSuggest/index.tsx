import Link from "next/link";
import { debounce } from "@/libs/functions";
import React, { useState, useEffect, useRef, useContext, useCallback } from "react";
import { useProgress } from "@/components/Progress";

//define option type
export type OptionType = {
  label: string,
  value: string,
}

// define auto complete option type
export type AutoSuggestOptions = {
  options?: OptionType[],
  endpoint?: string,
  method?: string,
  labelField?: string,
  valueField?: string,
  renderField?: (item: any) => OptionType,
  id?: string,
  rowid?: string;
  name?: string,
  value?: string[] | string,
  multiple?: boolean,
  required?: boolean,
  pattern?: string,
  placeholder?: string,
  className?: string,
  onSelected?: (item: any, element: any) => void,
  onAddNew?: (value: any, element: any) => void,
  onChange?: React.ChangeEventHandler<HTMLSelectElement>,
  onClear?: () => void
}

export default function AutoSuggest(props: AutoSuggestOptions) {
  const { showProgress } = useProgress();

  const [value, setValue] = useState<string[] | string>();
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<OptionType[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [top, setTop] = useState<string>("38px");
  const [bottom, setBottom] = useState<string>("auto");
  const [selection, setSelection] = useState<any>({ selectionMode: false, selectedIndex: -1 });
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const selectedRef = useRef<HTMLSelectElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // manage multiple key strokes
  // get items from endpoint
  async function getItems(endpoint: string, method: string | undefined) {
    // activate form Progress
    showProgress(true);

    // return status from condition function
    try {
      // call api
      const response = await fetch(endpoint, { method: method ?? "GET" });

      // get response data
      let data: any = await response.json();

      data = data.splice(0, 9);

      // check for render field
      if (typeof props.renderField !== "undefined" && typeof props.renderField === "function") {
        // set search result
        setResults(data.map((item: any) => props.renderField!(item)));
      } else {
        // create funtion
        const fn = new Function("item", `return { label: item.${props.labelField}, value: item.${props.valueField} }`);

        // set search result
        setResults(data.map((item: any) => fn(item)));
      }
    } catch (err) {
      // show error
      console.log(err);
    }

    // on time out
    setTimeout(() => {
      // activate form Progress
      showProgress(false);
    }, 500);
  }

  // on keydown (arrowup, arrowdown, backspace, enter, escape)
  function onKeyDown(e: any) {

    //filter the dropdown list after selection of item
    const filteredList =
      results.filter((item: OptionType) => {
        // check if selected value found
        return props.multiple ? !selected.includes(item.value) : true;
      });

    if (e.key == "Enter") {
      // prevent from submit
      e.preventDefault();

      // if selection on enter
      if (selection.selectedIndex > -1) {
        // get selected item
        const selectedItem = results.filter((item: OptionType) => {
          // check if selected value found
          return props.multiple ? !selected.includes(item.value) : true;
        })[selection.selectedIndex];

        // on get selected
        if (selectedItem) {
          // on get selected
          // if not multiple options
          if (props.multiple === false || typeof props.multiple === "undefined") {
            // setSelected([selected[selected.length - 1]]);
            setSelected([selectedItem.value]);

            // hide suggestions
            setShowSuggestions(false);
          } else {
            setSelected(prevData => ([
              ...prevData,
              selectedItem.value
            ]));

            //show suggestions
            setShowSuggestions(true);
          }
        }
      } else {
        // get items
        // getItems(e.target.value, (items: any) => {
        //   // on add new item
        //   if (typeof props.onAddNew === "function" && selection.selectedIndex == -1) props.onAddNew(e.target.value, e);
        // });
      }
    } else if (e.key == "ArrowDown") {
      // prevent from submit
      e.preventDefault();

      if(listRef.current){listRef.current.scrollBy({ top: 20, behavior: 'smooth' });}

      // update selection
      setSelection({
        selectedIndex: filteredList.length === 0 ? -1 : (selection.selectedIndex + 1) % (filteredList.length),
        selectionMode: true
      });
    } else if (e.key == "ArrowUp") {
      // prevent from submit
      e.preventDefault();

      if(listRef.current){listRef.current.scrollBy({ top: -20, behavior: 'smooth' });}

      // update selection
      setSelection({
        selectedIndex: selection.selectedIndex <= 0 ? filteredList.length - 1 : selection.selectedIndex - 1,
        selectionMode: true
      });
    } else if (e.key == "Backspace" && selected.length != 0) {
      // prevent from submit
      e.preventDefault();
      //set item to remove
      let item = results.filter((item: OptionType) => {
        // check if selected value found
        return selected.includes(item.value);
      })

      //remove tag
      removeTag(selected[item.length - 1])

    } else if (e.key == "Escape") {
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

  function onMouseOver(e: any) {
    // prevent from submit
    e.preventDefault();
    e.stopPropagation();

    // update selection
    setSelection({
      selectedIndex: e.target.dataset.index,
      selectionMode: true
    });

    // get element
    const input = document.querySelector('.auto-complete [type="input"]') as HTMLInputElement;

    // set focus
    if (input) input.focus();
  }

  //check visibility
  function isVisible(element: HTMLElement) {
    // get element rect
    const rect = element.getBoundingClientRect();

    // check is visible
    return rect.top + rect.height + 4.5 + 309 <= (window.innerHeight || document.documentElement.clientHeight);
  }

  //on focus on input field
  function onFocus(e: any) {
    // if result
    if (results.length) {
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
    }
  }

  //on blur 
  function onBlur(e: any) {
    // hide suggestions
    setShowSuggestions(false);
  }

  //on mousedown
  function onMouseDown(e: any) {
    e.preventDefault();
  }

  //on change from keyboard
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

        // get items
        // getItems(e.target.value);
      } else {
        // on clear
        if (typeof props.onClear === "function") props.onClear();
      }

      // set query
      setQuery(e.target.value);
    }
  }

  //remove selected tag
  function removeTag(value: string) {

    //show cursor 
    if (inputRef.current) {
      inputRef.current.focus();
    }

    //get and remove item
    const selectedItems = selected.filter((item: string) => item !== value)

    // set selected
    setSelected(selectedItems)

    //show suggestions
    setShowSuggestions(true);
  };

  //selection on click
  function onSelection(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    e.preventDefault();

    // get selected item
    const selectedItem = results.find(item => item.value == e.currentTarget.dataset.value);

    if (selectedItem) {
      // on get selected
      // if not multiple options
      if (props.multiple === false || typeof props.multiple === "undefined") {
        // setSelected
        setSelected([selectedItem.value]);

        // hide suggestions
        setShowSuggestions(false);
      } else {
        //set selected for multiple
        setSelected(prevData => ([
          ...prevData,
          selectedItem.value
        ]));

        //show suggestions
        setShowSuggestions(true);
      }
    }
  }

  //highlight entered characters
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
        return <span className="pe-none">{content.substring(0, index)}<mark className="pe-none">{content.substring(index, index + text.length)}</mark>{content.substring(index + text.length)}</span>

      } else {
        // return original content 
        return content;
      }
    }
  }

  //set query
  useEffect(() => {
    // set query
    if (results.length == 0) setQuery("");

    // show hide suggestions
    // setShowSuggestions(results.length ? true : false);
  }, [results])

  // set value
  useEffect(() => {
    // set value
    setValue(props.value)
  }, [props.value])

  //set results from endpoint/options
  useEffect(() => {
    if (typeof props.endpoint !== "undefined" && typeof props.method !== "undefined" && results.length == 0) {
      // get items from endpoint
      getItems(props.endpoint, props.method);
    } else if (typeof props.options !== "undefined" && Array.isArray(props.options)) {
      // set value
      setResults(props.options);
    }
  }, [props.options, props.endpoint, props.method])

  //set value
  useEffect(() => {
    // set value
    if (selectedRef.current) {
      const event = new Event('change', { bubbles: true });
      selectedRef.current.dispatchEvent(event);
    }
  }, [selected])

  return (
    <>
      <div className="autosuggest">
        <div className="multiselect">
          {props.multiple ?
            results.filter((option: OptionType) => selected.includes(option.value)).map((option: OptionType, index: number) =>
            (
              <span
                key={option.value}
                className="tag hover"
              >
                {option.label}
                <button onClick={() => removeTag(option.value)} className="cursor-pointer">x</button>
              </span>
            ))
            :
            <span>{selected.length > 0 && results.filter((option: OptionType) => option.value == selected[0])[0].label}</span>
          }
          <input
            ref={inputRef}
            type="search"
            className="input"
            data-rowid={props.rowid}
            autoComplete="off"
            spellCheck="false"
            placeholder={props.placeholder}
            onKeyDown={onKeyDown}
            onClick={onFocus}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            required={props.required}
            pattern={props.pattern}
            value={query}
          />
        </div>
        <ul ref={listRef} className={`list ${showSuggestions ? "show" : "show1 hide"}`} style={{ maxHeight: "309px", top: top, bottom: bottom }} onMouseDown={onMouseDown}>
          {results.filter((item: OptionType) => {
            // check if selected value found
            return props.multiple ? !selected.includes(item.value) : true;
          }).filter((item: OptionType) => {
            // remove white spaces
            item.label = item.label.trim().replace(/\s+/g, ' ');

            // get text
            let text = query;

            // remove white spaces and make it uppercase            
            text = text.trim().replace(/\s+/g, ' ').toUpperCase();

            // find the index
            const index = item.label.toUpperCase().indexOf(text);

            // return state
            return index >= 0 ? true : false;
          }).map((item: OptionType, index: number, list: any) =>
            <li key={index} className={`item hover:bg-primary-600 ${index == selection.selectedIndex ? "text-white bg-primary-500 hover:bg-primary-600" : ""} ${selected.includes(item.value) ? "bg-primary-600" : ""}`}>
              <Link
                href="#"
                className={`${index == selection.selectedIndex ? "selected" : ""}`}
                onClick={onSelection}
                data-index={index}
                data-value={item.value}
                tabIndex={-1}>
                {highlight(item.label, query)}
                {/* {typeof props.descriptionField !== "undefined" ? <small className="text-muted text-wrap pe-none">{item[props.descriptionField]}</small> : ""} */}
              </Link>
            </li>
          )}
        </ul>
        <select className="hidden" name={props.name} value={selected} ref={selectedRef} multiple={props.multiple || false} onChange={props.onChange}>
          {results.map((item: OptionType, index: number) =>
            <option key={index} value={item.value}>{item.label}</option>
          )}
        </select>
      </div>
    </>
  )
}