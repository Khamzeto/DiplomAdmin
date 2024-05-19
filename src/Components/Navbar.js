import { Link } from 'react-router-dom';

function Navbar({ blue }) {
  const handleRemoveToken = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };
  return (
    <div className="App">
      <header className="bg-white h-[80px] w-[100%] flex  items-center px-4">
        <div className="flex w-[80%] justify-around ml-[16%]">
          <div className="flex justify-center items-center flex-grow">
            <span className="text-black font-manrope font-[800]">
              chesu.<span className="text-blueText">portfolio</span>
            </span>
          </div>

          <div className="flex justify-between">
            <Link to="/connection" className="flex  items-center justify-center ">
              <div
                className={`w-[104px] h-10 px-[30px] border border-blueText py-2.5 rounded-[10px] justify-center items-center gap-2 inline-flex ${
                  blue ? 'bg-blue-500 text-white' : 'bg-transparent text-blueText'
                }`}
              >
                <div className="text-center text-[15px] font-normal font-['Manrope']">
                  Заявки
                </div>
              </div>
            </Link>
            <button
              onClick={handleRemoveToken}
              className="flex justify-end mx-6 items-center w-1/5"
            >
              <div className="w-[104px] h-10 px-[30px] py-2.5 bg-red-500 rounded-[10px] justify-start items-center gap-2 inline-flex">
                <div className="text-center text-white text-[15px] font-normal font-['Manrope']">
                  Выйти
                </div>
              </div>
            </button>
          </div>
        </div>
      </header>
    </div>
  );
}

export default Navbar;
