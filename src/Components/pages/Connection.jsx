import { useEffect, useState } from 'react';
import AddModal from '../AddModal/AddModal';
import Navbar from '../Navbar';
import getCroppedImg64 from '../getImage64';
import Cropper from 'react-easy-crop';
import { Link } from 'react-router-dom';

function Connection() {
  const [blue, setBlue] = useState(true);
  const [students, setStudents] = useState([]);
  const [id, setId] = useState(null);
  const [student, setStudent] = useState(null);
  const [selectAll, setSelectAll] = useState(false);
  const [connections, setConnections] = useState(null);
  const [connection, setConnection] = useState(null);
  console.log(connections);
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
      setSelectedStudents(connections.map(connection => connection._id));
    }
    // Инвертируем состояние выбора всех чекбоксов
    setSelectAll(!selectAll);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://2983365-dv35082.twc1.net/connection');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setConnections(data.connections);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    return () => {};
  }, []);

  const handleOnlyConnect = async id => {
    try {
      const response = await fetch(`https://2983365-dv35082.twc1.net/connection/${id}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setConnection(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const handleOnlyStudent = async id => {
    try {
      const response = await fetch(`https://2983365-dv35082.twc1.net/service/only/${id}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setStudent(data.student);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const [isChecked, setIsChecked] = useState(true);

  const [searchValue, setSearchValue] = useState('');

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleSearchChange = event => {
    setSearchValue(event.target.value);
  };

  const deleteStudents = async () => {
    try {
      const response = await fetch('https://2983365-dv35082.twc1.net/connection/delete', {
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
        <div className="fixed flex items-center text-left justify-center bg-lightBlack w-[100%] h-[100%] z-[999999999]">
          <div class="w-[851px] h-[780px] p-[30px] bg-white rounded-[25px] flex-col justify-start items-start gap-2.5 inline-flex">
            <div class="h-[690px] flex-col justify-start items-start gap-5 flex">
              <div class="self-stretch h-[690px] flex-col justify-start items-start gap-[30px] flex">
                <div class="self-stretch h-[361px] flex-col justify-start items-start gap-[22px] flex">
                  <div class="flex-col justify-center items-center gap-[22px] flex">
                    <div class="w-[791px] justify-between items-center inline-flex">
                      <div class="grow shrink basis-0 text-center text-black text-[25px] font-semibold font-['Manrope']">
                        Заявка
                      </div>
                    </div>
                  </div>
                  <div class="self-stretch opacity-80 justify-start items-start gap-2.5 inline-flex">
                    <div class="grow shrink basis-0 flex-col justify-start items-start gap-2.5 inline-flex">
                      <div class="self-stretch text-black text-xl font-semibold font-['Manrope']">
                        ФИО
                      </div>
                      <div class="self-stretch  h-[50px] pl-[2.4%] py-[15px] bg-slate-50 rounded-[10px] border border-neutral-400 justify-start items-center gap-2.5 inline-flex">
                        {connection?.[0]?.fullName}
                      </div>
                    </div>
                  </div>
                  <div class="self-stretch h-[87px] flex-col justify-start items-start gap-2.5 flex">
                    <div class="self-stretch text-black text-xl font-semibold font-['Manrope']">
                      Номер телефона
                    </div>

                    <div class="self-stretch  h-[50px] pl-[2.4%] py-[15px] bg-slate-50 rounded-[10px] border border-neutral-400 justify-start items-center gap-2.5 inline-flex">
                      {connection?.[0]?.phoneNumber}
                    </div>
                  </div>
                  <div class="self-stretch h-[87px] flex-col justify-start items-start gap-2.5 flex">
                    <div class="self-stretch text-black text-xl font-semibold font-['Manrope']">
                      Почта
                    </div>
                    <div class="self-stretch  h-[50px] pl-[2.4%] py-[15px] bg-slate-50 rounded-[10px] border border-neutral-400 justify-start items-center gap-2.5 inline-flex">
                      {connection?.[0]?.email}
                    </div>
                  </div>
                </div>
                <div class="self-stretch h-[219px] mt-4 flex-col justify-center items-center gap-2.5 flex">
                  <div class="self-stretch text-black text-xl font-semibold font-['Manrope']">
                    Выбранный студент
                  </div>

                  <div className="w-[40%] border border-blue-500  left-[2.6%]  student-card relative max-w-[300px] mr-5  max-h-[200px] min-h-[200px] rounded-[10px]  bg-customWhite flex justify-center  ">
                    <div className="flex-col   ">
                      <div className="flex ava-name justify-center my-6">
                        <div className=" w-[60px] avatar h-[60px] flex justify-center items-center rounded-[360px]">
                          {student?.avatar ? (
                            <img
                              className="w-[60px]  h-[60px] rounded-[360px]"
                              src={student?.avatar}
                            />
                          ) : (
                            <div className="bg-slate-50 w-[60px] h-[60px] flex justify-center items-center rounded-[360px]">
                              <img className="w-[30px] h-[30px]" src="Layer_1.svg" />
                            </div>
                          )}
                        </div>
                        <div className="flex-col ml-4  text-left text-mob">
                          <div className="text-gray-900 nameStud text-[15px] font-extrabold font-['Manrope']">
                            {student?.name.split(' ').slice(0, 2).join(' ')}
                          </div>

                          <div class="text-gray-500 directionStud text-[12px]  font-normal font-['Manrope']">
                            {student?.direction}
                          </div>
                          <div
                            class={`w-[100px] h-5 px-[15px] py-[3px] rounded-xl flex-col justify-center items-center gap-2.5 inline-flex ${
                              student?.searchJob !== 'Ищет работу'
                                ? 'bg-red-400'
                                : 'bg-green-400'
                            }`}
                          >
                            <div class="self-stretch text-center text-white text-[8px] font-normal font-['Manrope']">
                              {student?.searchJob}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex skills justify-center">
                        <div class="justify-start  items-start skills-cont  inline-flex">
                          {student?.skills[0] &&
                            JSON.parse(student?.skills[0])
                              .slice(0, 3)
                              .map((skills, index) => (
                                <div
                                  key={index}
                                  className="w-[50px] skill mr-2 h-6 px-2.5 py-[7px] bg-blue-500 bg-opacity-20 rounded-[15px] justify-center items-center gap-2.5 inline-flex"
                                >
                                  <div className="text-blue-500 text-[7px] font-normal font-['Manrope']">
                                    {skills}
                                  </div>
                                </div>
                              ))}

                          {student?.skills[0] &&
                            JSON.parse(student?.skills[0]).length > 3 && (
                              <div className="w-[30px] h-[25px] px-2.5 py-[7px] rounded-[15px] border border-blue-500 justify-center items-center gap-2.5 inline-flex">
                                <span className="text-blue-500 text-[8px] font-semibold font-['Manrope']">
                                  +{JSON.parse(student?.skills[0]).length - 4}
                                </span>
                              </div>
                            )}
                        </div>
                      </div>
                      <div className="w-[100%]  my-3">
                        <button className="w-[100%] podrob h-[30px] px-[25px] py-2 bg-blue-500 rounded-[5px] justify-center items-center gap-2.5 inline-flex">
                          <div class="text-center text-white text-[10px] font-normal font-['Manrope']">
                            Подробнее
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setAddModal(false)}
                  class="self-stretch px-[30px] mt-4 py-[15px] bg-blue-500 rounded-[10px] justify-center items-center gap-2.5 inline-flex"
                >
                  <div class="text-white text-[15px] font-normal font-['Manrope']">
                    Принять
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <Navbar blue={blue} />

      <div className="App mx-[4%] my-6">
        <div className="w-[100%] flex justify-left mt-[3%] mb-[2.8%]">
          <Link
            to="/"
            class="w-[222px] h-[47px] px-[30px] py-2.5 bg-blue-500 rounded-[10px] justify-start items-center gap-2 inline-flex"
          >
            <div class="text-center text-white text-xl font-normal font-['Manrope']">
              Вернуться назад
            </div>
          </Link>
        </div>
        <div className="text-left w-[100%] text-gray-900 text-[25px] font-extrabold font-['Manrope'] leading-[37.50px]">
          Заявки
        </div>
        <div className="flex">
          <div className="w-[100%] flex items-left my-8">
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
              type="submit"
              onClick={() => {
                deleteStudents();
                window.location.reload();
              }}
              class="w-[206px] h-[47px] px-[30px] py-2.5 bg-red-500 rounded-[10px] justify-center items-center gap-2 inline-flex"
            >
              <div class="text-center text-white text-xl font-normal font-['Manrope']">
                Удалить заявки
              </div>
            </button>
          </div>
        </div>

        <div className="mt-8 w-[100%] flex flex-wrap">
          {connections?.map((connect, index) => (
            <div
              key={connect._id}
              class="w-[48%] h-[100px] mt-4 mx-2 inline-flex  px-5 py-2.5 bg-white rounded-[15px] justify-between items-center "
            >
              <div
                className="custom-checkbox absolute z-[999999]"
                onClick={() => toggleCheckbox(connect._id)}
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  border: '1px solid #ccc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  backgroundColor: selectedStudents.includes(connect._id)
                    ? '#007bff'
                    : 'transparent',
                  borderColor: selectedStudents.includes(connect._id)
                    ? '#007bff'
                    : '#ccc',
                }}
              >
                {selectedStudents.includes(connect._id) && (
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

                <div class="justify-center items-center ml-2 w-[60px] rounded-full h-[60px] bg-slate-50 items-start gap-2.5 flex">
                  <img src="Layer.svg" class=" " />
                </div>
              </div>
              <div class=" w-[300px] text-left justify-left items-center  flex">
                <div className="text-gray-900 text-left text-[15px] font-medium font-['Manrope']">
                  {connect.fullName.split('  ').slice(0, 2).join('   ')}
                </div>
              </div>

              <button
                onClick={() => {
                  setAddModal(true);
                  handleOnlyConnect(connect._id);
                  handleOnlyStudent(connect.studentId);
                }}
                class="px-[30px] py-2.5 bg-blue-500 rounded-[10px] justify-start items-center gap-2 flex"
              >
                <div class="text-center text-white text-xl font-normal font-['Manrope']">
                  Подробнее
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Connection;
