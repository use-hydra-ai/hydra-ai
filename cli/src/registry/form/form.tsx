import * as React from "react";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const formVariants = cva("w-full rounded-lg transition-all duration-200", {
	variants: {
		variant: {
			default: "bg-white dark:bg-zinc-900",
			solid: [
				"shadow-lg shadow-zinc-900/10 dark:shadow-zinc-900/20",
				"bg-zinc-50 dark:bg-zinc-900",
			].join(" "),
			bordered: ["border-2", "border-zinc-200/40 dark:border-zinc-700/40"].join(
				" ",
			),
		},
		layout: {
			default: "space-y-4",
			compact: "space-y-2",
			relaxed: "space-y-6",
		},
	},
	defaultVariants: {
		variant: "default",
		layout: "default",
	},
});

/**
 * Represents a field in a form component
 * @property {string} id - Unique identifier for the field
 * @property {'text' | 'number' | 'select' | 'textarea'} type - Type of form field
 * @property {string} label - Display label for the field
 * @property {string} [placeholder] - Optional placeholder text
 * @property {string[]} [options] - Options for select fields
 * @property {boolean} [required] - Whether the field is required
 * @property {string} [description] - Additional description text for the field
 */

export interface FormField {
	id: string;
	type: "text" | "number" | "select" | "textarea";
	label: string;
	placeholder?: string;
	options?: string[];
	required?: boolean;
	description?: string;
}

export interface FormProps
	extends Omit<React.HTMLAttributes<HTMLFormElement>, "onSubmit">,
		VariantProps<typeof formVariants> {
	fields: FormField[];
	onSubmit: (data: Record<string, string>) => void;
	submitText?: string;
}

const FormComponent = React.forwardRef<HTMLFormElement, FormProps>(
	(
		{
			className,
			variant,
			layout,
			fields,
			onSubmit,
			submitText = "Submit",
			...props
		},
		ref,
	) => {
		const [isSubmitting, setIsSubmitting] = React.useState(false);

		const handleSubmit = (e: React.FormEvent) => {
			e.preventDefault();
			setIsSubmitting(true);
			try {
				const formData = new FormData(e.target as HTMLFormElement);
				const data = Object.fromEntries(
					Array.from(formData.entries()).map(([k, v]) => [k, v.toString()]),
				);
				onSubmit(data);
			} catch (error) {
				console.error("Error submitting form:", error); // TODO: Add form error handling UI or callback
			} finally {
				setIsSubmitting(false);
			}
		};

		const [openDropdowns, setOpenDropdowns] = React.useState<
			Record<string, boolean>
		>({});
		const [selectedValues, setSelectedValues] = React.useState<
			Record<string, string>
		>({});
		const dropdownRefsMap = React.useRef(
			new Map<string, HTMLDivElement | null>(),
		);

		React.useEffect(() => {
			const handleClickOutside = (event: MouseEvent) => {
				dropdownRefsMap.current.forEach((ref, fieldId) => {
					if (ref && !ref.contains(event.target as Node)) {
						setOpenDropdowns((prev) => ({
							...prev,
							[fieldId]: false,
						}));
					}
				});
			};

			document.addEventListener("mousedown", handleClickOutside);
			return () =>
				document.removeEventListener("mousedown", handleClickOutside);
		}, []);

		return (
			<form
				ref={ref}
				className={cn(formVariants({ variant, layout }), className)}
				onSubmit={handleSubmit}
				{...props}
			>
				<div className="p-6 space-y-6">
					{fields.map((field) => (
						<div key={field.id} className="space-y-2">
							<label
								className="block text-sm font-medium text-zinc-900 dark:text-zinc-100"
								htmlFor={field.id}
							>
								{field.label}
								{field.required && <span className="text-red-500 ml-1">*</span>}
							</label>

							{field.description && (
								<p className="text-sm text-zinc-500 dark:text-zinc-400">
									{field.description}
								</p>
							)}

							{field.type === "text" && (
								<input
									type="text"
									id={field.id}
									name={field.id}
									placeholder={field.placeholder}
									required={field.required}
									className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 
                            bg-white dark:bg-zinc-900 
                            focus:ring-2 focus:ring-zinc-500 focus:border-zinc-500 dark:focus:ring-zinc-400
                            placeholder:text-zinc-400 dark:placeholder:text-zinc-500
                            transition-colors duration-200"
								/>
							)}

							{field.type === "number" && (
								<input
									type="number"
									id={field.id}
									name={field.id}
									placeholder={field.placeholder}
									required={field.required}
									className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 
                            bg-white dark:bg-zinc-900 
                            focus:ring-2 focus:ring-zinc-500 focus:border-zinc-500 dark:focus:ring-zinc-400
                            placeholder:text-zinc-400 dark:placeholder:text-zinc-500
                            transition-colors duration-200"
								/>
							)}

							{field.type === "textarea" && (
								<textarea
									id={field.id}
									name={field.id}
									placeholder={field.placeholder}
									required={field.required}
									rows={4}
									className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 
                            bg-white dark:bg-zinc-900 
                            focus:ring-2 focus:ring-zinc-500 focus:border-zinc-500 dark:focus:ring-zinc-400
                            placeholder:text-zinc-400 dark:placeholder:text-zinc-500
                            transition-colors duration-200 resize-y"
								/>
							)}

							{field.type === "select" && field.options && (
								<div
									className="relative"
									ref={(el) => {
										dropdownRefsMap.current.set(field.id, el);
									}}
								>
									<button
										type="button"
										aria-haspopup="listbox"
										aria-expanded={openDropdowns[field.id]}
										aria-labelledby={`${field.id}-label`}
										onClick={() =>
											setOpenDropdowns((prev) => ({
												...prev,
												[field.id]: !prev[field.id],
											}))
										}
										className="w-full px-3 py-2 rounded-lg border border-input
                              bg-background text-foreground
                              focus:ring-2 focus:ring-ring focus:border-ring
                              hover:bg-muted/50
                              transition-colors duration-200
                              text-left flex items-center justify-between"
									>
										<span
											className={
												selectedValues[field.id]
													? "text-foreground"
													: "text-muted-foreground"
											}
										>
											{selectedValues[field.id] || field.placeholder}
										</span>
										<svg
											className={cn(
												"h-4 w-4 text-muted-foreground transition-transform duration-200",
												openDropdowns[field.id] && "transform rotate-180",
											)}
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
										</svg>
									</button>

									{openDropdowns[field.id] && (
										<div
											className="absolute z-10 w-full mt-1 py-1 rounded-lg border border-input
                                  bg-background shadow-lg
                                  max-h-60 overflow-auto"
											role="listbox"
											tabIndex={-1}
											aria-labelledby={`${field.id}-label`}
										>
											{field.options.map((option) => (
												<button
													key={option}
													type="button"
													role="option"
													aria-selected={selectedValues[field.id] === option}
													onClick={() => {
														setSelectedValues((prev) => ({
															...prev,
															[field.id]: option,
														}));
														setOpenDropdowns((prev) => ({
															...prev,
															[field.id]: false,
														}));
													}}
													className={cn(
														"w-full px-3 py-2 text-left text-foreground",
														"hover:bg-muted focus:bg-muted outline-none",
														"transition-colors duration-200",
														selectedValues[field.id] === option &&
															"bg-muted/50 font-medium",
													)}
												>
													{option}
												</button>
											))}
										</div>
									)}
									<input
										type="hidden"
										name={field.id}
										value={selectedValues[field.id] || ""}
										required={field.required}
									/>
								</div>
							)}
						</div>
					))}

					<button
						type="submit"
						className="w-full px-4 py-2.5 bg-zinc-900 text-white rounded-lg 
                     hover:bg-zinc-800 active:bg-zinc-950
                     dark:bg-zinc-100 dark:text-zinc-900 
                     dark:hover:bg-zinc-200 dark:active:bg-zinc-300
                     font-medium transition-colors duration-200"
						disabled={isSubmitting}
					>
						{isSubmitting ? "Submitting..." : submitText}
					</button>
				</div>
			</form>
		);
	},
);
FormComponent.displayName = "FormComponent";

export { FormComponent, formVariants };
