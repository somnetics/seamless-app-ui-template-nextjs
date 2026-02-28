import Textbox from "@/components/Textbox";
import CheckRadio from "@/components/CheckRadio";
import Button from "@/components/Button";
import { useState } from "react";

export default function Login() {
	const [fieldsValue, setFieldsValue] = useState<{ [key: string]: string }>({});

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		// get element
		const { name, value } = e.target;
		console.log(name, value)
		// set data
		setFieldsValue((prevState: any) => ({
			...prevState,
			[name]: value
		}));
	}

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		console.log(fieldsValue);

	}
	return (
		<div className="flex h-screen min-h-full flex-col justify-center px-6 py-12 lg:px-8">
			<div className="sm:mx-auto sm:w-full sm:max-w-sm">
				<form className="space-y-6" onSubmit={onSubmit}>
					<div className="relative grid gap-6 py-12 px-8 w-full text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 text-sm rounded-xl z-1">
						<div className="flex gap-2 flex-col items-center justify-center">
							<h1 className="text-2xl font-bold">Sign In</h1>
							<p className="text-center text-[13px]">Fill the fields below to signin!</p>
						</div>
						<div className="flex flex-col gap-2">
							<label htmlFor="" className="">
								Email
							</label>
							<Textbox type="text" name="email" placeholder="Enter registered e-mail id" value={fieldsValue.username} onChange={onChange} required />
						</div>
						<div className="flex flex-col gap-2">
							<label htmlFor="" className="">
								Password
							</label>
							<Textbox type="password" name="password" placeholder="Enter your password" value={fieldsValue.password} onChange={onChange} required />
						</div>
						<div className="flex items-center justify-between text-sm">
							<CheckRadio type="checkbox">Remember me</CheckRadio>
							<a href="#" className="text-primary-500 hover:text-primary-600">
								Forgot password?
							</a>
						</div>
						<Button type="submit" className="justify-center h-11">
							Sign in to your account
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}