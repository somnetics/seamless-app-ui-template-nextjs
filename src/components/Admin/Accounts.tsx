export default function Account() {
  return (
    <>
      <h1 className="text-xl font-semibold text-surface-foreground-0 leading-tight">My collections</h1>
      <button type="button" className="items-center transition-colors duration-[300ms] no-underline inline-flex py-[10px] px-[25px] sprinkles-text-base font-semibold rounded-[6px] whitespace-nowrap bg-blueFreepik text-white hover:bg-blueScience dark:text-blueScience dark:hover:bg-blueFreepik">
        <span className="hidden sm:block pl-5 font-semibold">New collection</span>
      </button>
    </>
  )
}