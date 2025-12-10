import { debounce } from "@/libs/functions";
import React, { useCallback, useEffect, useState } from "react";
import { useProgress } from "@/components/Progress";

//define option type
export type OptionType = {
	label: string,
	value: string,
	select?: boolean
}

// define auto complete option type
export type AutoCompleteOptions = {
	id?: string,
	rowid?: string,
	name?: string,
	value?: string,
	type?: string,
	searchField?: string,
	descriptionField?: string,
	endpoint?: string,
	method?: string,
	required?: boolean,
	pattern?: string,
	placeholder?: string,
	className?: string,
	onSelected?: (item: any, element: any) => void,
	onAddNew?: (value: any, element: any) => void,
	onChange?: (value: any, element: any) => void,
	onClear?: () => void
	option?: OptionType[],
	size?: "sm" | "md" | "lg" | undefined;
	rounded?: "sm" | "md" | "lg" | undefined;
	multipleSelect?: boolean
}

export default function Autocomplete({ option = [], ...props }: AutoCompleteOptions) {
	const { showProgress } = useProgress();

	const [value, setValue] = useState<string>("");
	const [multiValue, setMultiValue] = useState<OptionType[]>([]);
	const [results, setResults] = useState<OptionType[]>([]);
	const [top, setTop] = useState<string>("38px");
	const [bottom, setBottom] = useState<string>("auto");
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
			const response = await fetch(`${props.endpoint}?${props.searchField}=${query}&size=8`, { method: props.method ?? "GET" });

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
		e.preventDefault();
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
				setResults(option);

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
		// hide suggestions
		setShowSuggestions(false);
	}

	function onSelection(e: any) {
		// e.preventDefault();

		// get selected item
		let selectedItem = results[selection.selectedIndex];

		// if mobile selection
		if (selection.selectedIndex == -1) {
			// get selected index
			const filteredOptions: OptionType[] = results
				//filter the values not in multivalue
				// .filter((option: OptionType) => !multiValue.includes(option))
				.filter((option: OptionType) => option.select == false)

				//filter the selected item
				.filter((option: OptionType) => {
					option.value.toLowerCase().includes(value.toLowerCase());

					// get text
					let text = query;

					// remove white spaces and make it uppercase            
					text = text.trim().replace(/\s+/g, ' ').toUpperCase();

					// find the index
					const index = option.value.toUpperCase().indexOf(text);

					// return state
					return index >= 0 ? true : false;
				})

			//selected item
			selectedItem = filteredOptions[e];
			console.log(filteredOptions[e])

			//set query
			setQuery(selectedItem.value)

			//set value
			setValue(selectedItem.value)

			// if (props.multipleSelect && !multiValue.includes(selectedItem)) {
			if (props.multipleSelect && selectedItem.select == false) {
				//set select to true; add tag
				selectedItem.select = true;

				//reset query
				setQuery("");

				//reset value
				setValue("");
			}
		}

		// on get selected
		if (typeof props.onSelected === "function") props.onSelected(selectedItem, e);

		// reset search result
		setResults(results);

		// update selection
		setSelection({
			selectedIndex: -1,
			selectionMode: false
		});
	}

	//remove selected tag
	function removeTag(value: string) {
		//get and remove item
		results.map((option: OptionType) => option.value == value ? option.select = false : option)
		console.log(results)

		//update results 
		setResults(results)
	};

	//select value from keyboard
	function onKeyDown(e: any) {
		if (e.key == "Enter") {
			// prevent from submit
			e.preventDefault();

			// if selection on enter
			if (selection.selectedIndex > -1) {
				// get selected item

				const selectedItem = results
					// .filter((option: OptionType) => !multiValue.includes(option))
					.filter((option: OptionType) => option.select == false)
					.filter((option: OptionType) => {
						option.value.toLowerCase().includes(value.toLowerCase());

						// get text
						let text = query;

						// remove white spaces and make it uppercase            
						text = text.trim().replace(/\s+/g, ' ').toUpperCase();

						// find the index
						const index = option.value.toUpperCase().indexOf(text);

						// return state
						return index >= 0 ? true : false;
					})[selection.selectedIndex];
				
				//set query and value
				setQuery(selectedItem.value)
				setValue(selectedItem.value)

				if (props.multipleSelect && selectedItem.select == false) {
					//set select to true; add tag
					selectedItem.select = true;

					// reset input
					setQuery("");
					setValue("");
				}
				// on get selected
				if (typeof props.onSelected === "function") props.onSelected(selectedItem, e);

				// reset search result
				setResults(results);

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

		//set all select values to false
		results.filter((option: OptionType) => option.select = false)	

		//set results if present
		if (option.length !== 0) setResults(option)

		// show hide suggestions
		setShowSuggestions(results.length ? true : false);
	}, [results])

	useEffect(() => {
		// set value
		setValue(props.value ?? "")
	}, [props.value])

	return (
		<div className="relative p-4">
			<div className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-600 p-2 w-1/2">
				{props.multipleSelect && results.filter((option: OptionType) => option.select == true).map((option: OptionType, index: number) => (
					<span
						key={option.value}
						className="px-2 py-1 bg-blue-500 text-white rounded-md flex items-center gap-1"
					>
						{option.label}
						<button onClick={() => removeTag(option.value)} className="cursor-pointer">x</button>
					</span>
				))}
				<input
					type={props.type ?? "search"}
					placeholder={props.placeholder}
					// value={value ?? multiValue}
					value={value ?? results.filter((option: OptionType) => option.select == true)}
					onKeyDown={onKeyDown}
					onClick={onFocus}
					onChange={onChange}
					onFocus={onFocus}
					onBlur={onBlur}
					className="w-full focus:outline-none p-2"
				/>
			</div>

			{showSuggestions && results.length > 0 && (
				<ul className={`absolute w-1/2 rounded-md mt-1 shadow-lg max-h-60 overflow-y-auto ${showSuggestions ? " show" : ""} ${top} ${bottom}`} onMouseDown={onMouseDown}>
					{results
						.filter((option: OptionType) => option.select == false)
						.filter((option: OptionType) => {
							option.value.toLowerCase().includes(value.toLowerCase());

							// get text
							let text = query;

							// remove white spaces and make it uppercase            
							text = text.trim().replace(/\s+/g, ' ').toUpperCase();

							// find the index
							const index = option.value.toUpperCase().indexOf(text);

							// return state
							return index >= 0 ? true : false;
						})
						.map((option: OptionType, index: number) => (
							<li
								key={index}
								className={`p-2 cursor-pointer hover:bg-gray-600 ${index == selection.selectedIndex ? "bg-gray-600" : ""}`}
								onClick={() => onSelection(index)}
							>
								<div className="flex items-center gap-2">
									<p className="pe-none">{highlight(option.label, query)}</p>
								</div>
							</li>
						))}
				</ul>
			)}
		</div>
	)
}
