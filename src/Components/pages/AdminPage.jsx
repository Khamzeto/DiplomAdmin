import { useEffect, useState } from 'react';
import AddModal from '../AddModal/AddModal';
import Navbar from '../Navbar';
import getCroppedImg64 from '../getImage64';
import Cropper from 'react-easy-crop';

function AdminPage() {
  const [students, setStudents] = useState([]);
  console.log(students);
  const [selectAll, setSelectAll] = useState(false);
  const [studentId, setStudentId] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);
  console.log(selectedStudents);

  const toggleCheckbox = studentId => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter(id => id !== studentId));
    } else {
      setSelectedStudents([...selectedStudents, studentId]);
    }
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      // Если уже выбраны все, снимаем выбор со всех студентов
      setSelectedStudents([]);
    } else {
      // Иначе выбираем всех студентов
      setSelectedStudents(students.map(student => student._id));
    }
    // Инвертируем состояние выбора всех чекбоксов
    setSelectAll(!selectAll);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://2983365-dv35082.twc1.net/service');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        // Фильтрация пустых или неполных записей
        const filteredStudents = data.students.filter(student => student.name);
        setStudents(filteredStudents);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    return () => {
      // Cancel the request here if needed
    };
  }, []);
  const [isChecked, setIsChecked] = useState(true);

  console.log(isChecked);

  const [searchValue, setSearchValue] = useState('');

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleSearchChange = event => {
    setSearchValue(event.target.value);
  };

  const deleteStudents = async () => {
    try {
      const response = await fetch('https://2983365-dv35082.twc1.net/service/only', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: selectedStudents }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete students');
      }
      const data = await response.json();
      console.log(data);
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };
  const [addModal, setAddModal] = useState(false);

  useEffect(() => {
    // Проверяем значение avatar и устанавливаем соответствующий стиль для body
    if (addModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'visible';
    }
  }, [addModal]);

  return (
    <>
      {addModal && (
        <AddModal
          setAddModal={setAddModal}
          studentId={studentId}
          setStudentId={setStudentId}
        />
      )}
      <Navbar />

      <div className="App mx-[4%] my-6">
        <div className="text-left w-[100%] text-gray-900 text-[25px] font-extrabold font-['Manrope'] leading-[37.50px]">
          Админ-панель
        </div>
        <div className="flex">
          <div className="w-[100%] flex items-left my-8">
            <input
              className="w-[425px] h-[47px] p-2.5 bg-white rounded-[10px]   inline-flex pl-8"
              placeholder="Найти студента"
              value={searchValue}
              onChange={handleSearchChange}
            />
            <button className="w-[99px] h-[47px] px-5 py-2.5 bg-blue-500 rounded-[10px] justify-center items-center gap-3 inline-flex mx-4">
              <div className="text-white text-xl font-normal font-['Manrope']">Поиск</div>
            </button>
            <button
              onClick={toggleSelectAll}
              style={{
                backgroundColor: selectAll ? '#007bff' : 'transparent',
                fontColor: selectAll ? '#fff' : 'transparent',
              }}
              className="w-[188px] h-[47px] px-5 py-2.5 rounded-[10px] border border-blue-500 justify-start items-center gap-2 inline-flex"
            >
              <div
                className="min-w-[15px] h-[15px] rounded-full border border-blue-500 flex justify-center items-center"
                style={{
                  borderColor: selectAll ? '#fff' : '#2A85FF',
                  backgroundColor: selectAll ? '#fff' : 'transparent',
                }}
              >
                {selectAll && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="9"
                    height="9"
                    viewBox="0 0 9 7"
                    fill="none"
                  >
                    <path
                      d="M3.37503 4.66661L1.125 2.33331L0 3.49996L3.37503 7L9 1.16666L7.87501 0L3.37503 4.66661Z"
                      fill="#2A85FF"
                    />
                  </svg>
                )}
              </div>
              <div
                className="text-center w-[188px] text-xl font-normal font-['Manrope']"
                style={{
                  color: selectAll ? '#fff' : '#2A85FF',
                }}
              >
                Выбрать все
              </div>
            </button>
          </div>
          <div className="w-[100%] flex justify-end  my-8 ">
            <button
              onClick={deleteStudents}
              class="w-[138px] h-[47px] px-[30px] py-2.5 bg-red-500 rounded-[10px] justify-start items-center gap-2 inline-flex"
            >
              <div class="text-center text-white text-xl font-normal font-['Manrope']">
                Удалить
              </div>
            </button>
            <button
              onClick={() => setAddModal(true)}
              class="w-[153px] h-[47px] px-[30px] py-2.5 bg-blue-500 rounded-[10px] justify-start items-center gap-2 inline-flex mx-2"
            >
              <div class="text-center text-white text-xl font-normal font-['Manrope']">
                Добавить
              </div>
            </button>
          </div>
        </div>
        <div class="w-[100%] h-[30px] justify-start items-start gap-[113px] inline-flex ml-[6%] my-2">
          <div class="w-[133px] text-gray-900 text-xl font-semibold font-['Manrope'] leading-[30px]">
            Фамилия Имя
          </div>
          <div class="w-[133px] text-gray-900 text-xl font-semibold font-['Manrope'] leading-[30px]">
            Направление
          </div>
          <div class="w-[169px] text-gray-900 text-xl font-semibold font-['Manrope'] leading-[30px]">
            Поиск работы
          </div>
        </div>
        <div className="mt-8">
          {filteredStudents.map((stundent, index) => (
            <div
              key={stundent._id}
              class="w-[100%] h-20 mb-4 px-5 py-2.5 bg-white rounded-[15px] justify-start items-center gap-[13px] inline-flex"
            >
              <div
                className="custom-checkbox"
                onClick={() => toggleCheckbox(stundent._id)}
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  border: '1px solid #ccc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  backgroundColor: selectedStudents.includes(stundent._id)
                    ? '#007bff'
                    : 'transparent',
                  borderColor: selectedStudents.includes(stundent._id)
                    ? '#007bff'
                    : '#ccc',
                }}
              >
                {selectedStudents.includes(stundent._id) && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="9"
                    height="9"
                    viewBox="0 0 9 7"
                    fill="none"
                  >
                    <path
                      d="M3.37503 4.66661L1.125 2.33331L0 3.49996L3.37503 7L9 1.16666L7.87501 0L3.37503 4.66661Z"
                      fill="white"
                    />
                  </svg>
                )}
              </div>
              <div class="justify-start items-center gap-[13px] flex">
                <div class="w-[18px] h-[18px] relative"></div>

                <div class="justify-start items-start gap-2.5 flex">
                  <img
                    src={stundent.avatar}
                    class="w-[60px] h-[60px] bg-slate-50 rounded-full"
                  />
                </div>
              </div>
              <div class="grow max-w-[200px] shrink basis-0 h-10 justify-start items-center  flex">
                <div className="text-gray-900 text-[15px] font-medium font-['Manrope']">
                  {stundent.name.split(' ').slice(0, 2).join(' ')}
                </div>
              </div>
              <div className="flex w-[50%]  justify-start">
                <div className="text-gray-900 text-[15px] font-medium font-['Manrope'] flex-col items-start">
                  {stundent.direction}
                </div>
              </div>

              {stundent.searchJob ? (
                <div
                  className={`px-[15px] w-[160px] text-center py-2.5 rounded-[10px] justify-center items-center flex ${
                    stundent.searchJob === 'Не ищет работу'
                      ? 'bg-red-400'
                      : 'bg-green-400'
                  }`}
                >
                  <div class="text-white text-center text-[15px] font-medium font-['Manrope']">
                    {stundent.searchJob}
                  </div>
                </div>
              ) : null}

              <button
                onClick={() => {
                  setAddModal(true);
                  setStudentId(stundent._id); // Предположим, что у вас есть переменная состояния для studentId
                }}
                class="px-[30px] py-2.5 bg-blue-500 rounded-[10px] justify-start items-center gap-2 flex"
              >
                <div class="text-center text-white text-xl font-normal font-['Manrope']">
                  Изменить
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default AdminPage;
