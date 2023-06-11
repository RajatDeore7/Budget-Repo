import dayjs from "dayjs";
export const Topbar = () => {
  return (
    <div className="tw-bg-green-light px-3">
      <div className="tw-text-white tw-py-1 tw-d-flex tw-text-xl tw-leading-normal tw-flex tw-justify-end md:tw-justify-between">
        <span className="tw-hidden md:tw-inline">
          <small>Shine's Budget Dividend & Retirement Calculator</small>
        </span>
        <span>
          <span className="tw-mr-2">{dayjs().format('MMM DD, YYYY')}</span>
          <span className="tw-mr-2 tw-rounded-md tw-bg-yellow-200 tw-text-black tw-px-1">{dayjs().format('HH:mm A')}</span>
          <span>{dayjs().format('Z')}</span>
        </span>
      </div>
    </div>
  )
}