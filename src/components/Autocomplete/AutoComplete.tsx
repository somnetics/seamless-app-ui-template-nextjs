import Link from "next/link";
import { debounce } from "@/libs/functions";
import { useState, useEffect, useContext, useCallback } from "react";
import { useProgress } from "@/components/Progress";

// define auto complete option type
export type AutoCompleteOptions = {
  endpoint: string,
  method?: string,
  searchField: string,
  descriptionField?: string,
  id?: string,
  rowid?: string;
  name?: string,
  value?: string,
  type?: string,
  required?: boolean,
  pattern?: string,
  placeholder?: string,
  voiceSearch?: boolean | true,
  className?: string,
  onSelected?: (item: any, element: any) => void,
  onAddNew?: (value: any, element: any) => void,
  onChange?: (value: any, element: any) => void,
  onClear?: () => void
}

export default function AutoComplete(options: AutoCompleteOptions) {
  const { showProgress } = useProgress();

  const [value, setValue] = useState<string>("");
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<any>([]);
  const [top, setTop] = useState<string>("38px");
  const [bottom, setBottom] = useState<string>("auto");
  const [transcript, setTranscript] = useState<string>("");
  const [selection, setSelection] = useState<any>({ selectionMode: false, selectedIndex: -1 });
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [voiceSearch, setVoiceSearch] = useState<boolean>(false);

  // manage multiple key strokes
  const getItems = useCallback(debounce(async (query: string, callback: Function) => {
    // if not empty
    if (query.trim() != "" && query.trim().length >= 3) {
      // activate form Progress
      showProgress(true);

      // call api
      const response = await fetch(`${options.endpoint}?${options.searchField}=${query}&size=8`, { method: options.method ?? "GET" });

      // get response data
      const data = await response.json();

      // set search result
      setResults(data.results);

      // callback with results
      if (typeof callback === "function") callback(data.results);

      // on time out
      setTimeout(() => {
        // activate form Progress
        showProgress(false);
      }, 500);
    }
  }, 500), [])

  function onKeyDown(e: any) {
    if (e.key == "Enter") {
      // prevent from submit
      e.preventDefault();

      // if selection on enter
      if (selection.selectedIndex > -1) {
        // get selected item
        const selectedItem = results[selection.selectedIndex];

        // on get selected
        if (typeof options.onSelected === "function") options.onSelected(selectedItem, e);

        // reset search result
        setResults([]);

        // update selection
        setSelection({
          selectedIndex: -1,
          selectionMode: false
        });
      } else {
        // get items
        getItems(e.target.value, (items: any) => {
          // on add new item
          if (typeof options.onAddNew === "function" && selection.selectedIndex == -1) options.onAddNew(e.target.value, e);
        });
      }
    } else if (e.key == "ArrowDown") {
      // prevent from submit
      e.preventDefault();

      // update selection
      setSelection({
        selectedIndex: results.length === 0 ? -1 : (selection.selectedIndex + 1) % results.length,
        selectionMode: true
      });
    } else if (e.key == "ArrowUp") {
      // prevent from submit
      e.preventDefault();

      // update selection
      setSelection({
        selectedIndex: selection.selectedIndex <= 0 ? results.length - 1 : selection.selectedIndex - 1,
        selectionMode: true
      });
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

  function isVisible(element: HTMLElement) {
    // get element rect
    const rect = element.getBoundingClientRect();

    // check is visible
    return rect.top + rect.height + 4.5 + 309 <= (window.innerHeight || document.documentElement.clientHeight);
  }

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

  function onBlur(e: any) {
    // if (e.relatedTarget) {
    //   // hide suggestions
    //   if (showSuggestions && !e.relatedTarget.classList.contains("dropdown-item")) setShowSuggestions(false);
    // }

    // hide suggestions
    setShowSuggestions(false)
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

        // get items
        getItems(e.target.value);
      } else {
        // reset search result
        setResults([]);

        // reset voice search
        setTranscript("");

        // on clear
        if (typeof options.onClear === "function") options.onClear();
      }

      // on change
      if (typeof options.onChange === "function") options.onChange(e.target.value, e);

      // set value
      setValue(e.target.value);

      // set query
      setQuery(e.target.value);
    }
  }

  function onSelection(e: any) {
    e.preventDefault();

    // get selected item
    let selectedItem = results[selection.selectedIndex];

    // if mobile selection
    if (selection.selectedIndex == -1) {
      // get selected index
      selectedItem = results[e.target.dataset.index];
    }

    // on get selected
    if (typeof options.onSelected === "function") options.onSelected(selectedItem, e);

    // reset search result
    setResults([]);

    // update selection
    setSelection({
      selectedIndex: -1,
      selectionMode: false
    });
  }

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
    // set value
    setValue(transcript ?? "");

    // get items
    getItems(transcript);
  }, [transcript])

  useEffect(() => {
    // set query
    if (results.length == 0) setQuery("");

    // show hide suggestions
    setShowSuggestions(results.length ? true : false);
  }, [results])

  useEffect(() => {
    // set value
    setValue(options.value ?? "")
  }, [options.value])

  return (
    <>
      <div className="auto-complete position-relative d-flex flex-column">
        <div className="d-flex">
          <input
            type={options.type ?? "search"}
            className={options.className ?? "form-control"}
            name={options.name}
            id={options.id}
            data-rowid={options.rowid}
            autoComplete="off"
            spellCheck="false"
            placeholder={options.placeholder}
            onKeyDown={onKeyDown}
            onClick={onFocus}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            required={options.required}
            pattern={options.pattern}
            value={value}
          />
        </div>
        <ul className={`dropdown-menu ${showSuggestions ? " show" : ""}`} style={{ maxHeight: "309px", top: top, bottom: bottom }} onMouseDown={onMouseDown}>
          {results.filter((item: any) => {
            // remove white spaces
            item = item[options.searchField].trim().replace(/\s+/g, ' ');

            // get text
            let text = query;

            // remove white spaces and make it uppercase            
            text = text.trim().replace(/\s+/g, ' ').toUpperCase();

            // find the index
            const index = item.toUpperCase().indexOf(text);

            // return state
            return index >= 0 ? true : false;
          }).map((item: any, index: number, list: any) =>
            <li key={index} className={`${index < list.length - 1 ? "border-bottom pb-1 mb-1" : ""}`}>
              <Link
                href="#"
                className={`dropdown-item ${index == selection.selectedIndex ? "selected" : ""}`}
                onClick={onSelection}
                data-index={index}
                data-value={item[options.searchField]}
                tabIndex={-1}>
                <p className="pe-none">{highlight(item[options.searchField], query)}</p>
                {typeof options.descriptionField !== "undefined" ? <small className="text-muted text-wrap pe-none">{item[options.descriptionField]}</small> : ""}
              </Link>
            </li>
          )}
        </ul>
      </div>
    </>
  )
}