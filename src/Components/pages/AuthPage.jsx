import { useState } from 'react';
import AddModal from '../AddModal/AddModal';
import { Link, useNavigate } from 'react-router-dom';
import NavbarAuth from '../NavbarAuth';

function AuthPage({ setAddModal }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const response = await fetch(`https://2983365-dv35082.twc1.net/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const data = await response.json();
      const token = data.token;
      const userId = data.userId;
      navigate('/profile');

      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
    } catch (error) {
      console.error('Ошибка при отправке запроса:', error.message);
    }
  };

  return (
    <>
      <NavbarAuth />
      <div className="ml-auto h-[100%] w-[100%] mx-[4%] flex justify-center items-center relative ">
        <div className="w-[477px] h-[420px] p-[30px] bg-white rounded-[20px] flex-col justify-start items-center gap-5 my-[10%] flex">
          <div className="justify-start items-center gap-2.5 inline-flex">
            <div className="w-[341px] text-center text-gray-900 text-[25px] font-extrabold font-['Manrope'] leading-[37.50px]">
              Вход в админ-панель
            </div>
          </div>
          <div className="self-stretch h-[254px] flex-col justify-start items-center gap-5 flex">
            <div className="flex-col justify-start items-center gap-2.5 flex">
              <div className="h-[87px] flex-col justify-start items-start gap-2.5 flex">
                <div className="self-stretch h-[27px] flex-col justify-start items-start gap-1 flex">
                  <div className="text-black text-xl font-semibold font-['Manrope']">
                    Логин
                  </div>
                </div>
                <input
                  placeholder="Введите логин"
                  className="w-[400px] self-stretch px-6 py-[15px] bg-slate-50 rounded-[10px] border border-neutral-400 justify-start items-start gap-2.5 inline-flex"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="h-[87px] flex-col mb-[0%] my-[4%] justify-start items-start gap-2.5 flex">
                <div className="self-stretch h-[27px] flex-col justify-start items-start gap-1 flex">
                  <div className="text-black text-xl font-semibold font-['Manrope']">
                    Пароль
                  </div>
                </div>
                <input
                  placeholder="Введите пароль"
                  className="w-[400px] self-stretch px-6 py-[15px] mb-[40%] bg-slate-50 rounded-[10px] border border-neutral-400 justify-start items-start gap-2.5 inline-flex"
                  value={formData.password}
                  type="password"
                  name="password"
                  onChange={handleChange}
                />
              </div>
            </div>
            <button
              onClick={handleSubmit}
              className="self-stretch px-[30px] my-5  py-[15px] bg-blue-500 rounded-[10px] justify-center items-center gap-2.5 inline-flex"
            >
              <div className="text-white text-[15px] font-normal font-['Manrope']">
                Войти
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default AuthPage;
