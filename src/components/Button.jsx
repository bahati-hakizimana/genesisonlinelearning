import { FaCheck } from 'react-icons/fa';

const Button = ({ label }) => {
  return (
    <button className="bg-[#4175B7] text-white py-1.5 px-2 text-sm font-semibold flex items-center justify-between rounded-md">
      {label}
      <span className="flex items-center ml-4">
        <span className="border-r-2 border-white h-4 mr-2"></span>
        <FaCheck size={14} />
      </span>
    </button>
  );
};

export default Button;
