export const Label = ({htmlFor, value, required}: any) => {
  return (
    <>
      <label className="tw-text-sm tw-font-medium tw-text-gray-900 tw-dark:text-gray-300" htmlFor={htmlFor}>{value}</label>
      <span className="tw-text-red-600" hidden={!required}>*</span>
    </>
  )
}